# 重要战斗遭遇流程统一规范说明

## 一、目标

请按照“教学战斗”的完整流程，统一规范所有重要战斗遭遇的剧情与战斗衔接。

标准遭遇流程为：

```txt
剧情铺垫
→ 一次战前选择行动
→ 骰子判定
→ AI 续写
→ 进入战斗
→ 战斗胜利
→ 自动进入下一段战后剧情
```

需要以教学战斗为模板，规范以下战斗：

1. 教学战斗
2. 蓝伞浅滩战斗
3. 骨柱湿地战斗
4. Boss 战

当前需要重点修复的问题：

1. 战前行动次数大于 1，导致玩家可以反复选择行动，无法进入战斗。
2. 战前选择后没有触发骰子判定。
3. 战斗胜利后无法正常接到下一段剧情。

---

## 二、统一遭遇流程状态机

请新增或整理一个统一的 `encounter flow` 状态，不要每场战斗各写一套临时逻辑。

建议状态如下：

```ts
type EncounterPhase =
  | 'story'
  | 'prepChoice'
  | 'prepResolving'
  | 'aiNarration'
  | 'battlePending'
  | 'battleRunning'
  | 'battleWon'
  | 'afterScene';
```

每场战斗使用统一配置：

```ts
type EncounterFlowConfig = {
  encounterId: string;

  // 战前剧情 scene id
  introSceneId: string;

  // 战前行动配置
  prepActions: BattlePrepAction[];

  // 战斗 id
  battleId: string;

  // 战斗胜利后进入的剧情 scene id
  afterSceneId: string;

  // 防重复 flag
  prepDoneFlag: string;
  battleDoneFlag: string;
};
```

示例配置：

```ts
const ENCOUNTER_FLOW_CONFIGS: EncounterFlowConfig[] = [
  {
    encounterId: 'tutorial-crawler-ambush',
    introSceneId: 'tutorial-battle-trigger',
    battleId: 'tutorial-crawler-battle',
    afterSceneId: 'after-tutorial-battle',
    prepDoneFlag: 'tutorial_battle_prep_done',
    battleDoneFlag: 'tutorial_battle_done',
    prepActions: TUTORIAL_BATTLE_PREP_ACTIONS,
  },
  {
    encounterId: 'blue-shoal',
    introSceneId: 'enter-blue-shoal',
    battleId: 'blue-shoal-battle',
    afterSceneId: 'after-battle-blue-shoal',
    prepDoneFlag: 'blue_shoal_battle_prep_done',
    battleDoneFlag: 'blue_shoal_battle_done',
    prepActions: BLUE_SHOAL_PREP_ACTIONS,
  },
  {
    encounterId: 'bone-pillar-wetland',
    introSceneId: 'enter-bone-pillar-wetland',
    battleId: 'bone-pillar-wetland-battle',
    afterSceneId: 'after-battle-bone-pillar-wetland',
    prepDoneFlag: 'bone_pillar_wetland_battle_prep_done',
    battleDoneFlag: 'bone_pillar_wetland_battle_done',
    prepActions: BONE_PILLAR_WETLAND_PREP_ACTIONS,
  },
  {
    encounterId: 'boss-gatekeeper',
    introSceneId: 'enter-boss-gatekeeper',
    battleId: 'boss-gatekeeper-battle',
    afterSceneId: 'after-battle-boss-gatekeeper',
    prepDoneFlag: 'boss_gatekeeper_battle_prep_done',
    battleDoneFlag: 'boss_gatekeeper_battle_done',
    prepActions: BOSS_GATEKEEPER_PREP_ACTIONS,
  },
];
```

如果项目中的实际 ID 不同，请按现有 ID 替换，但必须保留这个结构。

---

## 三、战前行动必须只执行一次

这是最重要的修复点。

每场遭遇中，玩家只能选择一次战前行动。

逻辑要求：

```ts
function canShowPrepChoice(state: GameState, config: EncounterFlowConfig): boolean {
  return !state.flags?.[config.prepDoneFlag] && !state.flags?.[config.battleDoneFlag];
}
```

玩家点击某个战前行动后，必须立刻设置：

```ts
flags[config.prepDoneFlag] = true;
state.currentEncounterId = config.encounterId;
state.selectedPrepActionId = action.id;
```

一旦 `prepDoneFlag === true`：

1. 不允许再次显示战前行动面板。
2. 不允许再次点击其他战前行动。
3. 不允许返回上一段剧情后重复选择。
4. 页面刷新或读档后也不能重复显示。
5. 下一步必须进入“骰子判定 / AI 续写 / 进入战斗”流程，而不是再次弹出选择。

---

## 四、战前行动数据结构

请统一使用下面结构：

```ts
type BattlePrepAction = {
  id: string;
  label: string;
  desc: string;

  check: {
    attribute: 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';
    skillName: string;
    dc: number;
  };

  successText?: string;
  failText?: string;

  successEffect?: BattleEffectPatch;
  failEffect?: BattleEffectPatch;
};
```

注意：

除非某个行动明确写了 `alwaysSuccess: true`，否则所有战前行动都必须触发骰子判定。

不要出现“玩家点击行动后只显示文本、不投骰子”的情况。

---

## 五、骰子判定必须强制执行

玩家选择战前行动后，必须调用统一函数：

```ts
function resolvePrepAction(
  action: BattlePrepAction,
  state: GameState
): PrepResolveResult
```

返回：

```ts
type PrepResolveResult = {
  actionId: string;
  d20: number;
  modifier: number;
  total: number;
  dc: number;
  success: boolean;
  resultText: string;
  effectPatch?: BattleEffectPatch;
};
```

判定公式：

```txt
D20 + 属性修正 >= DC
```

属性修正公式：

```ts
modifier = Math.floor((attributeValue - 10) / 2)
```

示例：

```ts
function resolvePrepAction(action: BattlePrepAction, state: GameState): PrepResolveResult {
  const d20 = rollD20();
  const attrValue = state.player.attributes[action.check.attribute] ?? 10;
  const modifier = Math.floor((attrValue - 10) / 2);
  const total = d20 + modifier;
  const success = total >= action.check.dc;

  return {
    actionId: action.id,
    d20,
    modifier,
    total,
    dc: action.check.dc,
    success,
    resultText: success ? action.successText : action.failText,
    effectPatch: success ? action.successEffect : action.failEffect,
  };
}
```

判定完成后必须保存：

```ts
state.lastPrepResult = result;
state.battleEffects = mergeBattleEffects(state.battleEffects, result.effectPatch);
```

UI 显示示例：

```txt
D20：14 + 感知修正 2 = 16 / DC 14
判定成功
```

失败时显示：

```txt
D20：7 + 感知修正 2 = 9 / DC 14
判定失败
```

---

## 六、AI 续写必须发生在骰子判定之后、战斗之前

骰子判定完成后，进入 AI 续写阶段。

流程：

```txt
玩家选择行动
→ 骰子判定
→ 得到成功 / 失败
→ 把结果交给 AI
→ AI 续写 1~3 句剧情
→ 显示 AI 续写
→ 玩家点击“进入战斗”
```

AI 调用输入必须包含：

```ts
{
  encounterId,
  actionLabel,
  actionDesc,
  d20,
  modifier,
  total,
  dc,
  success,
  resultText,
  currentArea,
  importantFlags
}
```

AI 输出要求：

```ts
type PrepAINarration = {
  narration: string;
};
```

AI 续写要求：

1. 只写 1~3 句。
2. 必须承接玩家选择和骰子结果。
3. 不允许直接宣布战斗胜利。
4. 不允许改变战斗结果。
5. 不允许跳过进入战斗。
6. 如果 AI 调用失败，使用本地兜底文本。

兜底文本：

```ts
const fallbackPrepNarration = result.success
  ? '你的判断及时生效，队伍在混乱爆发前争取到了一点优势。'
  : '你的动作慢了一步，敌人的压迫感迅速逼近，局势变得更加危险。';
```

AI 续写显示完后，按钮必须变成：

```txt
进入战斗
```

点击后调用：

```ts
startBattle(config.battleId);
```

---

## 七、进入战斗时必须锁定当前 encounter

进入战斗前，必须写入：

```ts
state.currentEncounterId = config.encounterId;
state.currentBattleId = config.battleId;
state.nextAfterBattleSceneId = config.afterSceneId;
```

这样战斗胜利后才能知道该接哪段剧情。

不要只依赖字符串 `trigger` 或 `lastEvent` 来判断下一段剧情。

必须通过 `nextAfterBattleSceneId` 或 `encounter config` 明确跳转。

---

## 八、战斗胜利后必须自动进入战后剧情

战斗胜利时统一调用：

```ts
function onBattleWin(state: GameState) {
  const encounterId = state.currentEncounterId;
  const config = getEncounterConfig(encounterId);

  if (!config) {
    console.error('Missing encounter config:', encounterId);
    return state;
  }

  return {
    ...state,
    flags: {
      ...state.flags,
      [config.battleDoneFlag]: true,
    },
    currentBattleId: null,
    currentEncounterId: null,
    currentSceneId: config.afterSceneId,
    nextAfterBattleSceneId: null,
    encounterPhase: 'afterScene',
  };
}
```

要求：

1. 教学战斗胜利后进入教学战后剧情。
2. 蓝伞浅滩胜利后进入 `after-battle-blue-shoal`。
3. 骨柱湿地胜利后进入骨柱湿地战后剧情。
4. Boss 战胜利后进入 Boss 战后剧情。
5. 如果找不到 `afterSceneId`，必须在控制台报错，并在 UI 中显示“战后剧情缺失”，不能卡死黑屏。

---

## 九、剧情 scene 与 battle 的衔接规则

每个战前剧情 scene 的最后不要直接启动战斗，而是进入战前行动。

标准规则：

```txt
scene lines 播放结束
→ 如果存在 encounter config 且 prepDoneFlag 为 false
→ 显示战前行动面板
→ 玩家选择一次行动
→ 骰子判定
→ AI 续写
→ 玩家点击进入战斗
```

如果 `prepDoneFlag === true` 且 `battleDoneFlag === false`，说明玩家已经完成战前行动但还没打完战斗。

此时不再显示战前行动，直接显示：

```txt
继续进入战斗
```

点击后进入对应 battle。

如果 `battleDoneFlag === true`，说明战斗已经完成，不要再触发战斗，直接进入 afterScene 或保持当前剧情推进。

---

## 十、战前行动 UI 要求

战前行动面板标题：

```txt
战前行动
```

副标题：

```txt
选择一项行动。系统会进行一次 D20 判定，判定结果会影响接下来的战斗。
```

每个选项显示：

1. 行动名称 `label`
2. 行动描述 `desc`
3. 判定属性和 DC，例如：
   ```txt
   感知检定 DC 14
   ```

玩家点击后：

1. 立即禁用所有战前行动按钮。
2. 显示骰子判定结果。
3. 显示 AI 续写文本。
4. 显示“进入战斗”按钮。
5. 不再显示其他战前行动按钮。

---

## 十一、教学战斗作为模板

请先检查教学战斗完整流程，并将其作为模板。

教学战斗必须满足：

```txt
剧情铺垫
→ 战前行动选择
→ D20 判定
→ AI 续写
→ 进入教学战斗
→ 战斗胜利
→ 教学战后剧情
```

教学战斗战前行动可以设计为：

```ts
const TUTORIAL_BATTLE_PREP_ACTIONS: BattlePrepAction[] = [
  {
    id: 'observe-soft-belly',
    label: '观察裂隙爬兽的软肋',
    desc: '根据瑟琳的提醒，寻找裂隙爬兽腹侧没有硬壳保护的位置。',
    check: {
      attribute: 'wis',
      skillName: '观察',
      dc: 12,
    },
    successText: '你看准了裂隙爬兽跃起时暴露出的腹侧软肋。',
    failText: '你试图寻找弱点，但裂隙爬兽动作太快，你只来得及仓促应战。',
    successEffect: {
      playerAttackBonusFirstRound: 2,
    },
    failEffect: {
      enemyAttackBonusFirstRound: 1,
    },
  },
  {
    id: 'hold-position',
    label: '稳住脚步，不退向护栏',
    desc: '听从瑟琳提醒，避免在慌乱中退到危险边缘。',
    check: {
      attribute: 'con',
      skillName: '耐受',
      dc: 11,
    },
    successText: '你稳住呼吸和重心，没有被裂隙爬兽的冲势逼到护栏边。',
    failText: '你被扑来的怪物逼退半步，脚下的碎木和缆索让站位变得不稳。',
    successEffect: {
      playerAcBonusFirstRound: 1,
    },
    failEffect: {
      playerInitiativePenalty: 1,
    },
  },
];
```

---

## 十二、蓝伞浅滩、骨柱湿地、Boss 战规范

### 1. 蓝伞浅滩

必须走：

```txt
enter-blue-shoal
→ 战前行动
→ 骰子判定
→ AI 续写
→ blue-shoal-battle
→ after-battle-blue-shoal
```

蓝伞浅滩的 `prepDoneFlag`：

```ts
blue_shoal_battle_prep_done
```

蓝伞浅滩的 `battleDoneFlag`：

```ts
blue_shoal_battle_done
```

---

### 2. 骨柱湿地

必须走：

```txt
enter-bone-pillar-wetland
→ 战前行动
→ 骰子判定
→ AI 续写
→ bone-pillar-wetland-battle
→ after-battle-bone-pillar-wetland
```

骨柱湿地的 `prepDoneFlag`：

```ts
bone_pillar_wetland_battle_prep_done
```

骨柱湿地的 `battleDoneFlag`：

```ts
bone_pillar_wetland_battle_done
```

---

### 3. Boss 战

必须走：

```txt
enter-boss-gatekeeper
→ 战前行动
→ 骰子判定
→ AI 续写
→ boss-gatekeeper-battle
→ after-battle-boss-gatekeeper
```

Boss 战的 `prepDoneFlag`：

```ts
boss_gatekeeper_battle_prep_done
```

Boss 战的 `battleDoneFlag`：

```ts
boss_gatekeeper_battle_done
```

---

## 十三、禁止的实现方式

请不要这样实现：

1. 不要让 `hints` 在战前行动后继续反复显示。
2. 不要把多个战前行动当成普通剧情选项，可以连续点击。
3. 不要在选择行动后直接进入战斗，必须先骰子判定。
4. 不要在骰子判定后直接跳战斗，必须显示 AI 续写。
5. 不要依赖 `lastEvent` 模糊判断战后剧情。
6. 不要把战后剧情写死在某个 battle 组件内部。
7. 不要让战斗胜利后停留在战斗页。
8. 不要让战斗胜利后回到战前剧情。
9. 不要让同一个 `prepDoneFlag` 在多场战斗之间混用。
10. 不要让刷新页面后重新弹出已经完成过的战前行动。

---

## 十四、验收标准

### 教学战斗

1. 播放教学战斗前剧情。
2. 剧情结束后只显示一次战前行动面板。
3. 点击一个战前行动后，其他按钮立刻禁用或消失。
4. 显示 D20 判定结果。
5. 显示 AI 续写。
6. 点击“进入战斗”后进入教学战斗。
7. 战斗胜利后进入教学战后剧情。
8. 刷新或读档后不会重复弹出已经完成的战前行动。

### 蓝伞浅滩

1. `enter-blue-shoal` 播放结束后显示战前行动。
2. 只能选择一次。
3. 必须触发骰子判定。
4. 必须触发 AI 续写。
5. 点击进入战斗后进入 `blue-shoal-battle`。
6. 战斗胜利后进入 `after-battle-blue-shoal`。
7. 不会重复进入战前行动。

### 骨柱湿地

1. 战前剧情结束后显示战前行动。
2. 只能选择一次。
3. 必须触发骰子判定。
4. 必须触发 AI 续写。
5. 战斗胜利后进入骨柱湿地战后剧情。

### Boss 战

1. Boss 战前剧情结束后显示战前行动。
2. 只能选择一次。
3. 必须触发骰子判定。
4. 必须触发 AI 续写。
5. 战斗胜利后进入 Boss 战后剧情。
6. Boss 战不能卡在战斗页，也不能回到战前剧情。

---

## 十五、默认战前行动

如果某场战斗暂时没有配置战前行动，也必须走同一个流程，只是使用默认战前行动：

```ts
const DEFAULT_BATTLE_PREP_ACTION: BattlePrepAction = {
  id: 'keep-formation',
  label: '保持队形，准备迎战',
  desc: '在敌人靠近前稳住阵型。',
  check: {
    attribute: 'wis',
    skillName: '观察',
    dc: 12,
  },
  successText: '你及时稳住队伍节奏，战斗开始前没有露出明显破绽。',
  failText: '敌人的压迫感来得太快，队伍只能仓促应战。',
  successEffect: {
    playerInitiativeBonus: 1,
  },
  failEffect: {
    enemyInitiativeBonus: 1,
  },
};
```

---

## 十六、最终要求

最终所有重要战斗都必须统一成这个流程：

```txt
剧情
→ 一次战前行动
→ 骰子判定
→ AI 续写
→ 进入战斗
→ 胜利
→ 战后剧情
```

本次任务优先修流程，不要先改剧情文案。

剧情文案可以后续微调，当前优先保证每场战斗都能稳定从：

```txt
剧情 → 战前行动 → 判定 → AI续写 → 战斗 → 战后剧情
```

完整走通。
