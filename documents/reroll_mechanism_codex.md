# 剧情判定重投机制实现说明

## 一、目标

请为「剧情里的选择行动骰子判定」增加重投机制。

该机制只适用于剧情选择行动、战前行动、探索行动、NPC 互动判定等剧情类判定，不适用于战斗命中、伤害、敌人行动、治疗量、随机掉落、盲盒抽取等战斗或抽奖类骰子。

标准流程改为：

```txt
玩家选择剧情行动
→ 初次 D20 判定
→ 显示判定结果
→ 底部出现三个按钮：确定 / 使用虚构骰子 / 使用万能骰子
→ 玩家确认最终结果
→ AI 根据最终结果续写
→ 进入后续流程
```

核心强制规则：

```txt
每次剧情判定最多只能使用一个重投道具。
```

也就是说，同一次剧情判定中，玩家使用了「虚构骰子」后，不能再使用「万能骰子」；使用了「万能骰子」后，也不能再使用「虚构骰子」。

---

## 二、初始道具

新游戏开始时，玩家背包里默认拥有：

```ts
{
  id: 'fiction-dice',
  name: '虚构骰子',
  quantity: 3,
  type: 'reroll',
  desc: '剧情判定后可使用。重新进行一次 D20 判定，最终结果取两次判定中较高的一次。'
}

{
  id: 'omni-dice',
  name: '万能骰子',
  quantity: 3,
  type: 'reroll',
  desc: '剧情判定后可使用。重新进行一次可以指定 D20 点数的判定，最终结果由玩家决定。'
}
```

请确保新开局背包默认加入：

```txt
虚构骰子 x3
万能骰子 x3
```

旧存档如果没有这两个道具字段，可以在存档迁移时补充一次，避免老存档缺道具导致功能不可用。

---

## 三、适用范围

该机制只适用于：

```txt
剧情选择行动判定
战前行动判定
探索行动判定
NPC 互动判定
```

不适用于：

```txt
战斗命中
战斗伤害
敌人行动
治疗量
持续伤害
随机掉落
盲盒抽取
```

建议给剧情判定统一加字段：

```ts
canUseRerollItems: true
```

只有这个字段为 `true` 时，才显示重投按钮。

---

## 四、判定状态结构

请把原来的单次判定结果扩展为「可确认的判定结果」。

```ts
type StoryCheckResult = {
  checkId: string;
  actionId: string;

  attribute: 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';
  skillName: string;
  dc: number;
  modifier: number;

  initialRoll: {
    d20: number;
    total: number;
    success: boolean;
  };

  reroll?: {
    itemId: 'fiction-dice' | 'omni-dice';
    d20: number;
    total: number;
    success: boolean;
  };

  finalRoll: {
    d20: number;
    total: number;
    success: boolean;
    source: 'initial' | 'fiction-dice' | 'omni-dice';
  };

  rerollUsed: boolean;
  finalized: boolean;
};
```

字段说明：

1. `initialRoll` 是第一次投骰结果。
2. `reroll` 是使用道具后的第二次结果。
3. `finalRoll` 是最终被 AI 和后续流程采用的结果。
4. `rerollUsed` 用于防止同一次判定多次重投。
5. `finalized` 表示玩家已经点击「确定」，可以进入 AI 续写。

---

## 五、初次判定流程

玩家选择剧情行动后，先正常进行一次 D20 判定。

公式：

```ts
modifier = Math.floor((attributeValue - 10) / 2);
total = d20 + modifier;
success = total >= dc;
```

生成结果：

```ts
const result: StoryCheckResult = {
  checkId,
  actionId,
  attribute,
  skillName,
  dc,
  modifier,
  initialRoll: {
    d20,
    total,
    success,
  },
  finalRoll: {
    d20,
    total,
    success,
    source: 'initial',
  },
  rerollUsed: false,
  finalized: false,
};
```

注意：

1. 初次判定后，不要立刻调用 AI 续写。
2. 初次判定后，不要立刻应用成功或失败效果。
3. 必须先让玩家在底部按钮中确认最终结果。
4. 最终结果确认后，才允许 AI 续写与效果结算。

---

## 六、判定结果 UI

初次判定完成后，底部显示三个按钮：

```txt
确定
使用虚构骰子（剩余 x）
使用万能骰子（剩余 x）
```

如果道具数量为 0，则按钮置灰并显示：

```txt
虚构骰子不足
万能骰子不足
```

如果本次判定已经使用过任意重投道具，则只显示：

```txt
确定
```

要求：

1. 不允许同一次判定连续使用多个重投道具。
2. 使用任意一个重投道具后，隐藏或禁用另一个重投道具按钮。
3. 使用重投道具后，玩家只能点击「确定」确认最终结果。
4. 刷新或读档后也必须保持该限制。

---

## 七、按钮一：确定

点击「确定」时：

1. 将当前 `finalRoll` 标记为最终结果。
2. 设置 `result.finalized = true`。
3. 根据 `finalRoll.success` 应用成功或失败效果。
4. 将最终结果传给 AI 续写。
5. AI 续写完成后继续后续流程，例如进入战斗。

伪代码：

```ts
function confirmStoryCheckResult(
  result: StoryCheckResult,
  action: BattlePrepAction,
  state: GameState
) {
  const finalSuccess = result.finalRoll.success;

  const effectPatch = finalSuccess ? action.successEffect : action.failEffect;
  const resultText = finalSuccess ? action.successText : action.failText;

  const finalResult = {
    ...result,
    finalized: true,
  };

  const nextState = {
    ...state,
    lastStoryCheckResult: finalResult,
    battleEffects: mergeBattleEffects(state.battleEffects, effectPatch),
  };

  return {
    state: nextState,
    resultText,
    finalResult,
  };
}
```

---

## 八、按钮二：使用虚构骰子

### 效果

```txt
消耗 1 个虚构骰子。
重新进行一次 D20 判定。
最终结果取两次判定中 total 较高的一次。
如果 total 相同，优先保留第二次重投结果，用于显示“虚构骰子生效”。
```

### 流程

1. 检查背包中 `fiction-dice.quantity > 0`。
2. 检查 `result.rerollUsed === false`。
3. 消耗 1 个虚构骰子。
4. 重新投一个 D20。
5. 使用相同的 `modifier` 和 `dc` 计算 `total` 和 `success`。
6. 对比 `initialRoll.total` 和 `reroll.total`。
7. `finalRoll` 取 total 更高的结果。
8. 设置 `rerollUsed = true`。

### 伪代码

```ts
function useFictionDice(result: StoryCheckResult, state: GameState): {
  result: StoryCheckResult;
  state: GameState;
} {
  if ((getItemQuantity(state, 'fiction-dice') ?? 0) <= 0) {
    throw new Error('虚构骰子不足');
  }

  if (result.rerollUsed) {
    throw new Error('本次判定已经使用过重投道具');
  }

  const nextState = consumeItem(state, 'fiction-dice', 1);

  const d20 = rollD20();
  const total = d20 + result.modifier;
  const success = total >= result.dc;

  const reroll = {
    itemId: 'fiction-dice' as const,
    d20,
    total,
    success,
  };

  const useReroll = total >= result.initialRoll.total;

  const finalRoll = useReroll
    ? {
        d20,
        total,
        success,
        source: 'fiction-dice' as const,
      }
    : {
        d20: result.initialRoll.d20,
        total: result.initialRoll.total,
        success: result.initialRoll.success,
        source: 'initial' as const,
      };

  return {
    state: nextState,
    result: {
      ...result,
      reroll,
      finalRoll,
      rerollUsed: true,
    },
  };
}
```

### UI 显示示例

重投更高：

```txt
初次判定：D20 7 + 感知修正 2 = 9 / DC 14，失败
使用虚构骰子：D20 15 + 感知修正 2 = 17 / DC 14，成功
最终采用：17，判定成功
```

重投更低：

```txt
初次判定：D20 16 + 感知修正 2 = 18 / DC 14，成功
使用虚构骰子：D20 5 + 感知修正 2 = 7 / DC 14，失败
最终采用：18，判定成功
```

---

## 九、按钮三：使用万能骰子

### 效果

```txt
消耗 1 个万能骰子。
玩家指定第二次判定的 D20 点数，范围 1~20。
使用该指定点数计算最终结果。
最终结果由这次指定判定决定。
```

### 流程

1. 玩家点击「使用万能骰子」。
2. 检查背包中 `omni-dice.quantity > 0`。
3. 检查 `result.rerollUsed === false`。
4. 弹出选择框，让玩家选择 D20 点数：1 到 20。
5. 玩家确认后，消耗 1 个万能骰子。
6. 用玩家指定的 D20 点数计算：`total = chosenD20 + modifier`，`success = total >= dc`。
7. 设置 `finalRoll.source = 'omni-dice'`。
8. 设置 `rerollUsed = true`。
9. 万能骰子不和初次判定取最大值，而是直接采用玩家指定结果。

### 伪代码

```ts
function useOmniDice(
  result: StoryCheckResult,
  state: GameState,
  chosenD20: number
): {
  result: StoryCheckResult;
  state: GameState;
} {
  if ((getItemQuantity(state, 'omni-dice') ?? 0) <= 0) {
    throw new Error('万能骰子不足');
  }

  if (result.rerollUsed) {
    throw new Error('本次判定已经使用过重投道具');
  }

  if (chosenD20 < 1 || chosenD20 > 20) {
    throw new Error('万能骰子的指定点数必须在 1 到 20 之间');
  }

  const nextState = consumeItem(state, 'omni-dice', 1);

  const total = chosenD20 + result.modifier;
  const success = total >= result.dc;

  const reroll = {
    itemId: 'omni-dice' as const,
    d20: chosenD20,
    total,
    success,
  };

  return {
    state: nextState,
    result: {
      ...result,
      reroll,
      finalRoll: {
        d20: chosenD20,
        total,
        success,
        source: 'omni-dice',
      },
      rerollUsed: true,
    },
  };
}
```

### 万能骰子选择框文案

```txt
使用万能骰子

请选择本次剧情判定的 D20 点数。
点数范围：1~20。
确认后将消耗 1 个万能骰子，并以该结果作为最终判定。
```

建议默认提供快捷按钮：

```txt
1  5  10  15  20
```

也可以提供数字输入框。

---

## 十、AI 续写必须读取最终结果

AI 续写阶段不能读取 `initialRoll` 作为成败依据，必须读取 `finalRoll`。

AI 输入应改为：

```ts
{
  encounterId,
  actionId,
  actionLabel,
  actionDesc,

  attribute,
  skillName,
  dc,
  modifier,

  initialRoll,
  reroll,
  finalRoll,

  finalSuccess: finalRoll.success,
  rerollUsed,
  rerollItemId: reroll?.itemId ?? null,

  currentArea,
  importantFlags
}
```

AI 续写规则：

1. 如果没有使用重投道具，只根据初次结果续写。
2. 如果使用了虚构骰子，需要体现「命运被重新掷出一次」的感觉。
3. 如果使用了万能骰子，需要体现「骰面被某种奇异力量固定」的感觉。
4. 续写必须参考最终结果 `finalRoll.success`。
5. 不要参考已经被覆盖的旧结果作为成败依据。
6. 不允许 AI 改变最终判定结果。

兜底文本：

```ts
function getFallbackAINarration(result: StoryCheckResult) {
  if (!result.rerollUsed) {
    return result.finalRoll.success
      ? '你的判断及时生效，局势在混乱爆发前被你抓住了一瞬。'
      : '你的动作慢了一步，危险迅速逼近，局势变得更加紧迫。';
  }

  if (result.finalRoll.source === 'fiction-dice') {
    return result.finalRoll.success
      ? '虚构骰子在掌心微微发烫，像是替你改写了某个即将滑向失败的细节。'
      : '虚构骰子滚动后停下，命运似乎给了你第二次机会，但局势仍未明显好转。';
  }

  if (result.finalRoll.source === 'omni-dice') {
    return result.finalRoll.success
      ? '万能骰子的骰面被奇异的力量固定，结果如你所愿，局势被强行拉向更有利的方向。'
      : '万能骰子的骰面按你的选择停下，你接受了这个结果，并准备承担它带来的后果。';
  }

  return '判定结果已经确认，故事继续向前推进。';
}
```

---

## 十一、状态保存要求

确认最终结果后保存：

```ts
state.lastStoryCheckResult = finalResult;
state.lastPrepResult = finalResult;
state.lastRerollUsed = finalResult.rerollUsed;
state.lastRerollItemId = finalResult.reroll?.itemId ?? null;
```

如果是战前行动，还要继续保存：

```ts
state.selectedPrepActionId = action.id;
state.battleEffects = mergeBattleEffects(state.battleEffects, finalEffectPatch);
```

注意：

1. 战斗效果必须根据最终结果应用。
2. 不要在初次判定后立刻应用效果。
3. 否则使用重投后会出现旧效果残留。
4. AI 续写和后续剧情只能基于 `finalResult`。

---

## 十二、防止重复触发

每次剧情判定最多只能使用一个重投道具。

状态判断：

```ts
if (result.rerollUsed) {
  hideRerollButtons();
  showOnlyConfirmButton();
}
```

如果玩家刷新页面或读档时，存在：

```ts
lastStoryCheckResult.finalized === false
```

则恢复到判定确认界面，而不是重新投骰。

如果存在：

```ts
lastStoryCheckResult.finalized === true
```

则不要再次显示重投按钮。

---

## 十三、和战前行动流程的衔接

战前行动完整流程现在应为：

```txt
剧情 lines 播放结束
→ 显示战前行动选项
→ 玩家选择一个行动
→ 初次 D20 判定
→ 显示：确定 / 使用虚构骰子 / 使用万能骰子
→ 玩家确认最终结果
→ AI 根据最终结果续写
→ 显示“进入战斗”
→ 进入战斗
```

不要再使用旧流程：

```txt
选择行动
→ 初次判定
→ 立刻 AI 续写
```

必须改为：

```txt
选择行动
→ 初次判定
→ 等待玩家确认或使用重投道具
→ 最终确认
→ AI 续写
```

---

## 十四、验收标准

请逐项验证：

1. 新游戏开局时，背包里有虚构骰子 x3、万能骰子 x3。
2. 剧情行动初次判定后，底部出现三个按钮：
   - 确定
   - 使用虚构骰子
   - 使用万能骰子
3. 点击「确定」后，直接确认当前结果，并进入 AI 续写。
4. 使用虚构骰子会消耗 1 个虚构骰子。
5. 虚构骰子会重新投一次 D20。
6. 虚构骰子的最终结果取两次 total 较高的一次。
7. 使用万能骰子会弹出点数选择框。
8. 万能骰子确认点数后消耗 1 个万能骰子。
9. 万能骰子的最终结果采用玩家指定的 D20 点数。
10. 每次剧情判定最多只能使用一个重投道具。
11. 使用重投道具后，只能点击「确定」，不能继续使用另一个重投道具。
12. AI 续写读取的是最终结果，不是初次结果。
13. 战斗效果、剧情效果、成功失败文本都根据最终结果决定。
14. 初次失败后使用虚构骰子成功，后续按成功处理。
15. 初次成功后使用万能骰子指定低点数失败，后续按失败处理。
16. 背包数量不足时，对应按钮置灰。
17. 刷新或读档不会导致重复投骰或重复消耗道具。
18. 战斗中的命中、伤害、敌人行动不显示重投按钮。
19. 如果 `rerollUsed === true`，UI 必须隐藏或禁用所有重投按钮，只保留「确定」。
20. 如果 `finalized === true`，不允许再次回到重投确认阶段。

---

## 十五、最终要求

最终剧情判定流程必须稳定变成：

```txt
选择剧情行动
→ 初次 D20 判定
→ 玩家确认或消耗一个重投道具
→ 得到最终判定结果
→ AI 根据最终结果续写
→ 继续剧情或进入战斗
```

强制规则：

```txt
每次剧情判定最多只能用一个重投道具。
```

请优先保证流程稳定，不要先改剧情文案。