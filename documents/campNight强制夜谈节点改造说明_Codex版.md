# campNight 强制夜谈节点改造说明（Codex 执行版）

> 目标：把 `campNight` 从“短静态剧情 / 特定分支剧情”改造成 **蓝伞浅滩战后主线必经的 Boss 前夜谈节点**。  
> 关键修正：  
> - `campNight` 必须经过。  
> - 玩家必须和所有“当前可谈对象”聊完才能继续。  
> - 如果救了莱因：可谈对象为 **瑟琳、艾琳、布洛克、凯娅、莱因**，共 5 个。  
> - 如果没救莱因：可谈对象只有 **瑟琳、艾琳、布洛克、凯娅**，共 4 个，不显示莱因选项。  
> - 不使用玩家输入框；点击固定选项后由大模型根据上下文生成该角色夜谈文本。  
> - 必须复用当前重构后的剧情、AI 续写、状态、存档和 UI 组件，不要另起一套系统。

---

## 0. 背景与修改原因

当前文笔审查中已经指出，`campNight` 原本只有 4 行，但它承担的是“进入堡垒前最后一夜”的功能，是全剧重要情感枢纽。原建议是扩展到 10-12 行，通过火光、装备检查、圣徽、黑缆扣、银杖裂痕等动作表达压力，而不是让同伴轮流朗读台词。

现在需求进一步调整：

1. `campNight` 不再是“不救莱因才触发”的分支剧情。
2. `campNight` 改为主线必经剧情。
3. 玩家需要在这里和队友进行最后一轮 Boss 前夜谈。
4. 夜谈不使用自由输入框，只显示固定角色选项。
5. 每个角色夜谈内容由大模型生成，并参考当前状态。
6. 是否显示莱因选项取决于 `lainHelped`。

---

## 1. 最高优先级结论

### 1.1 campNight 必须主线必经

原流程如果是：

```text
救莱因 → 跳过 campNight
不救莱因 → campNight
```

现在必须改为：

```text
莱因事件 / laineDecision
→ campNight 夜谈
→ Boss 前休整 / 瑟琳银杖裂痕
→ 黑石门卫 Boss
```

也就是说，`laineDecision` 后不管玩家是否救莱因，都要进入 `campNight`。

---

### 1.2 夜谈对象由 lainHelped 决定

#### 情况 A：玩家救了莱因

如果：

```ts
state.lainHelped === true
```

则 `campNight` 需要显示 5 个夜谈选项：

```text
和瑟琳聊聊
和艾琳聊聊
和布洛克聊聊
和凯娅聊聊
和莱因聊聊
```

全部 5 个聊完后，才能显示 / 解锁：

```text
前往黑暗之门前庭
```

#### 情况 B：玩家没救莱因

如果：

```ts
state.lainHelped === false
```

则 `campNight` 只显示 4 个夜谈选项：

```text
和瑟琳聊聊
和艾琳聊聊
和布洛克聊聊
和凯娅聊聊
```

不显示：

```text
和莱因聊聊
```

全部 4 个聊完后，才能显示 / 解锁：

```text
前往黑暗之门前庭
```

---

### 1.3 不救莱因时不能偷偷补救

`campNight` 必须尊重玩家在莱因事件中的选择。

不救莱因时：

1. 不显示莱因夜谈选项。
2. 不调用莱因夜谈 AI。
3. 不把 `lainHelped` 改成 true。
4. 不自动获得莱因救助线索。
5. 不让莱因在 Boss 前给提示。
6. 不影响后续 C / D 结局判定。

可以在开场旁白里非常轻地提及远处的莱因声音，但不能提供可交互对话。

示例：

```text
远处偶尔传来盔甲拖过黑石的声音。没有人确认那是不是莱因。
```

---

## 2. 新流程图

```text
act1-lain-survivor-event / laineDecision
  ↓
设置 lainHelped = true / false
  ↓
act1-camp-night-talk / campNight
  ↓
根据 lainHelped 计算 requiredTalkTargets
  ├─ lainHelped = true:
  │    requiredTalkTargets = ['serin', 'ailin', 'block', 'kaiya', 'lain']
  │
  └─ lainHelped = false:
       requiredTalkTargets = ['serin', 'ailin', 'block', 'kaiya']
  ↓
玩家逐个点击夜谈对象
  ↓
每次点击调用 AI 生成该角色夜谈文本
  ↓
标记该角色已聊
  ↓
全部 requiredTalkTargets 完成
  ↓
显示“前往黑暗之门前庭”
  ↓
act1-black-root-rest-serin-crack / Boss 前休整
```

---

## 3. 状态字段设计

优先复用当前已有的 `statePatch`、`storyFlags`、`gameState`、`saveSnapshot` / `saveRestore` 等结构。

建议新增：

```ts
type CampNightTalkTarget =
  | 'serin'
  | 'ailin'
  | 'block'
  | 'kaiya'
  | 'lain';

interface CampNightTalkState {
  campNightSeen: boolean;
  campNightIntroSeen: boolean;

  campNightTalkedToSerin: boolean;
  campNightTalkedToAilin: boolean;
  campNightTalkedToBlock: boolean;
  campNightTalkedToKaiya: boolean;
  campNightTalkedToLain: boolean;

  campNightAllRequiredTalksDone: boolean;

  // 可选：保存 AI 生成结果，避免读档或切换时重复生成不同文本
  campNightTalkLogs?: Partial<Record<CampNightTalkTarget, StoryLine[]>>;
}
```

如果当前状态系统不适合嵌套对象，则用扁平字段：

```ts
campNightSeen: boolean
campNightIntroSeen: boolean
campNightTalkedToSerin: boolean
campNightTalkedToAilin: boolean
campNightTalkedToBlock: boolean
campNightTalkedToKaiya: boolean
campNightTalkedToLain: boolean
campNightAllRequiredTalksDone: boolean
```

默认值：

```ts
campNightSeen = false
campNightIntroSeen = false
campNightTalkedToSerin = false
campNightTalkedToAilin = false
campNightTalkedToBlock = false
campNightTalkedToKaiya = false
campNightTalkedToLain = false
campNightAllRequiredTalksDone = false
```

注意：

- 即使 `lainHelped === false`，也可以保留 `campNightTalkedToLain = false`，但它不参与完成度检查。
- 旧存档没有这些字段时，必须走默认值，不允许崩溃。
- 这些字段必须进入存档快照，读档后夜谈进度不能丢失。

---

## 4. 关键 helper 设计

### 4.1 requiredTalkTargets

建议新增纯函数，便于测试：

```ts
export function getCampNightRequiredTalkTargets(state: GameState): CampNightTalkTarget[] {
  const targets: CampNightTalkTarget[] = ['serin', 'ailin', 'block', 'kaiya'];

  if (state.lainHelped === true) {
    targets.push('lain');
  }

  return targets;
}
```

### 4.2 判断某个目标是否已聊

```ts
export function hasTalkedToCampNightTarget(
  state: GameState,
  target: CampNightTalkTarget
): boolean {
  switch (target) {
    case 'serin':
      return Boolean(state.campNightTalkedToSerin);
    case 'ailin':
      return Boolean(state.campNightTalkedToAilin);
    case 'block':
      return Boolean(state.campNightTalkedToBlock);
    case 'kaiya':
      return Boolean(state.campNightTalkedToKaiya);
    case 'lain':
      return Boolean(state.campNightTalkedToLain);
  }
}
```

### 4.3 标记某个目标已聊

```ts
export function markCampNightTargetTalked(
  state: GameState,
  target: CampNightTalkTarget
): GameState {
  switch (target) {
    case 'serin':
      return { ...state, campNightTalkedToSerin: true };
    case 'ailin':
      return { ...state, campNightTalkedToAilin: true };
    case 'block':
      return { ...state, campNightTalkedToBlock: true };
    case 'kaiya':
      return { ...state, campNightTalkedToKaiya: true };
    case 'lain':
      return { ...state, campNightTalkedToLain: true };
  }
}
```

### 4.4 判断是否全部完成

```ts
export function areAllRequiredCampNightTalksDone(state: GameState): boolean {
  return getCampNightRequiredTalkTargets(state).every((target) =>
    hasTalkedToCampNightTarget(state, target)
  );
}
```

### 4.5 禁止不救莱因时强行聊莱因

在点击 `talk-lain` 前做保护：

```ts
if (target === 'lain' && state.lainHelped !== true) {
  // 不应该出现该选项；如果因为旧 UI 或状态异常触发，则直接拒绝
  return;
}
```

---

## 5. UI 选项设计

### 5.1 生成选项

```ts
const requiredTargets = getCampNightRequiredTalkTargets(state);

const options = requiredTargets.map((target) => ({
  id: `camp-night-talk-${target}`,
  label: hasTalkedToCampNightTarget(state, target)
    ? `${getCampNightTargetName(target)}（已交谈）`
    : `和${getCampNightTargetName(target)}聊聊`,
  target,
  disabled: hasTalkedToCampNightTarget(state, target),
}));
```

名称映射：

```ts
export function getCampNightTargetName(target: CampNightTalkTarget): string {
  switch (target) {
    case 'serin':
      return '瑟琳';
    case 'ailin':
      return '艾琳';
    case 'block':
      return '布洛克';
    case 'kaiya':
      return '凯娅';
    case 'lain':
      return '莱因';
  }
}
```

### 5.2 继续按钮

当：

```ts
areAllRequiredCampNightTalksDone(state) === true
```

显示：

```ts
{
  id: 'continue-to-black-root-rest',
  label: '前往黑暗之门前庭',
  next: 'act1-black-root-rest-serin-crack'
}
```

如果项目下一节点实际叫：

```text
serin_cracked_silver_staff
bossPrebattle
act1-black-root-rest-point
```

按当前代码实际 ID 使用。

### 5.3 未完成时的提示

如果玩家试图继续但未完成全部夜谈：

```text
还有人没有交谈。进入黑暗之门前，最好听听他们最后想说的话。
```

如果 `lainHelped=false`，这里的“全部”只指四位队友，不包含莱因。

---

## 6. campNight 固定开场文本

背景建议：

```text
/assets/scenes/13black-root-rest-point.webp
```

或复用当前 campNight 背景。

### 6.1 通用开场 lines

```ts
[
  { speaker: "主持人", text: "那一夜，营地没有真正睡着。" },
  { speaker: "主持人", text: "火光照在黑石根区边缘，影子被拉得很长，像一排站在黑暗里的死者。远处的黑缆偶尔轻轻震一下，声音沿着地面传回来，像有人在更深处敲门。" },
  { speaker: "主持人", text: "布洛克没有讲笑话。他把锅倒扣在膝前，一遍遍检查斧刃和采样刀，最后只往火里添了一块干菌木。" },
  { speaker: "主持人", text: "艾琳坐在火光边缘，擦拭白枝圣徽。每擦一下，她就停一会儿，像在确认自己还记得那些没能被救下的名字。" },
  { speaker: "主持人", text: "凯娅背对火光，低头检查黑缆扣和锁针。她的尾巴很安静，安静到不像她。" },
  { speaker: "主持人", text: "瑟琳没有写笔记。她只是看着银杖上的那道细裂纹，指腹停在裂痕旁边，迟迟没有按下去。" }
]
```

### 6.2 如果救了莱因，追加

条件：

```ts
state.lainHelped === true
```

```ts
[
  { speaker: "主持人", text: "莱因被安置在火光边缘。艾琳替他固定了肩甲下的绷带，但那些青绿色菌丝仍会随着他的呼吸轻轻收缩。" },
  { speaker: "主持人", text: "他每次数到三，都会停住，像在确认自己没有回应错误的敲门声。" },
  { speaker: "主持人", text: "进入黑暗之门前，你还有一点时间和他们分别谈谈。" }
]
```

### 6.3 如果没救莱因，追加

条件：

```ts
state.lainHelped !== true
```

```ts
[
  { speaker: "主持人", text: "远处偶尔传来盔甲拖过黑石的声音。没有人确认那是不是莱因。" },
  { speaker: "主持人", text: "进入黑暗之门前，你还有一点时间和队友分别谈谈。" }
]
```

注意：

- 不救莱因时，不要写成“莱因被安置在营火边缘”。
- 不救莱因时，不显示莱因夜谈选项。
- 不救莱因时，不要让莱因提供 Boss 提示。

---

## 7. 大模型夜谈生成机制

### 7.1 不使用输入框

本节点不允许玩家自由输入文本。  
玩家只点击固定按钮：

```text
和瑟琳聊聊
和艾琳聊聊
和布洛克聊聊
和凯娅聊聊
和莱因聊聊（仅救莱因时）
```

点击后调用 AI 生成该角色夜谈。

---

### 7.2 必须复用现有 AI 续写系统

如果当前项目已有以下功能，必须复用：

```text
AI KP 续写
AI 同伴事件
companion_events.py
前端 AI 续写状态
等待 KP 回复 UI
失败重试 UI
```

不要新建平行 AI chat 系统。

建议新增轻量函数，但底层复用原有请求：

```ts
generateCampNightTalk(target, context)
```

---

## 8. AI 上下文输入要求

每次点击某角色时，传入大模型的上下文必须包括：

```ts
interface CampNightTalkContext {
  target: CampNightTalkTarget;

  currentNodeId: string;
  currentArea: string;

  playerName?: string;
  playerArchetype?: string;
  playerAttributes: {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
  };

  recentStorySummary: string;
  completedEvents: string[];
  importantFlags: Record<string, boolean | string | number>;

  blueShoalBattleResult: 'win';
  lainEncountered: boolean;
  lainHelped: boolean;

  inventoryItems: Array<{
    id: string;
    name: string;
    type: string;
    description?: string;
  }>;

  companionTrust: {
    serin: number;
    ailin: number;
    block: number;
    kaiya: number;
  };

  alreadyTalkedTargets: CampNightTalkTarget[];

  forbiddenReveals: string[];
}
```

如果当前代码字段名不同，按当前结构映射。

---

## 9. 大模型生成提示词模板

### 9.1 系统提示词 / 开发提示词

```text
你是《地心之门》的 AI 主持人。现在处于第一幕 Boss 前夜谈 campNight 节点。

请根据指定交谈对象、玩家当前经历、背包道具、同伴信任值、主角六维属性和关键剧情 flag，生成一段短小但有情绪重量的夜谈文本。

要求：
1. 只写当前交谈对象相关内容。
2. 不要写玩家自由输入，因为此节点没有输入框。
3. 不要让 NPC 替玩家做决定。
4. 不要提前揭露瑟琳来自未来。
5. 不要提前揭露玩家未来英雄身份。
6. 不要解释完整时间锚点真相。
7. 黑暗之门开启前，不要明示地下海洋、海声、海浪、盐味、海风、黑潮。
8. 莱因不能说地下海洋，也不能解释完整地底堡垒真相。
9. Boss 相关信息只能是模糊警告、情绪反应或战斗建议，不能剧透完整机制。
10. 输出 3-6 行剧情 lines，每行包含 speaker 和 text。
11. 文风应当有画面、动作、沉默，不要写成攻略说明。
12. 自由对话期间不改变信任值，除非当前代码已有明确规则。
```

### 9.2 用户提示词模板

```text
当前交谈对象：{targetName}

当前剧情：
- 蓝伞浅滩战斗已经胜利。
- 队伍已经发现黑石根区异常和地底堡垒相关线索。
- 莱因已经登场。
- lainHelped = {true/false}
- 队伍即将前往黑暗之门前庭，面对黑石门卫。

玩家信息：
- 名字：{playerName}
- 流派/职业：{playerArchetype}
- 六维：{attributes}

背包重要道具：
{inventoryItems}

同伴信任值：
{companionTrust}

已经夜谈过：
{alreadyTalkedTargets}

请生成当前对象的夜谈文本。
```

---

## 10. 每个角色的夜谈方向

### 10.1 瑟琳

主题：

1. 银杖裂痕。
2. 她对玩家过度关心。
3. 对黑石门卫的克制恐惧。
4. 不能解释全部，但可以提醒危险。
5. 高信任时更柔软，低信任时更克制。

允许提：

```text
“这扇门现在不稳定”
“不要长时间站在亮起的黑石纹路上”
“如果我反应慢了一点，请先保护自己”
```

禁止提：

```text
未来
时间线
玩家未来英雄身份
地下海洋
```

示例 fallback：

```ts
[
  { speaker: "主持人", text: "瑟琳坐在火光照不到的地方，银杖横放在膝上。裂纹里的微光一明一暗，像一只很疲惫的眼睛。" },
  { speaker: "瑟琳", text: "明天如果黑石纹路亮起来，不要站在原地等我提醒。" },
  { speaker: "瑟琳", text: "我会尽力跟上你。但你也要答应我，先让自己活下来。" }
]
```

---

### 10.2 艾琳

主题：

1. 白枝圣徽。
2. 伤员、名字、救治伦理。
3. 对莱因选择的反应。
4. 净化和安魂。
5. 鼓励玩家不要把“活着”看成负担。

如果 `lainHelped=true`，她可以温柔肯定玩家：

```text
你没有把他当成累赘。
```

如果 `lainHelped=false`，她可以克制失望，但不强行指责：

```text
不是所有选择都能在当下回头。
```

示例 fallback：

```ts
[
  { speaker: "主持人", text: "艾琳把白枝圣徽擦得很慢。火光照在银白纹路上，像一截没有完全熄灭的烛芯。" },
  { speaker: "艾琳", text: "我以前以为，只要还能说出名字，就一定要救。" },
  { speaker: "艾琳", text: "现在我知道，有些地方会逼人先选择谁能走到明天。" }
]
```

---

### 10.3 布洛克

主题：

1. 热食、锅、装备检查。
2. 孢海生存经验。
3. 明天路线风险。
4. 用朴素方式安慰玩家。
5. 高信任时可以给“暖孢浓汤”或战斗提示。

示例 fallback：

```ts
[
  { speaker: "主持人", text: "布洛克把锅倒扣在膝前，用布擦去斧刃上的孢粉。锅里还剩一点热汤，味道不算好，却让人想起还活着这件事。" },
  { speaker: "布洛克", text: "明天别逞英雄。孢海里逞英雄的人，最后都变成别人踩过去时脚下那声响。" },
  { speaker: "布洛克", text: "吃点东西。胃里有热气，手就不会抖得那么厉害。" }
]
```

---

### 10.4 凯娅

主题：

1. 黑缆扣、锁针、退路。
2. 用交易口吻掩饰担心。
3. 对玩家选择的现实评价。
4. 高信任时更坦诚，低信任时更像交易。
5. 不要把她写成单纯玩笑角色。

示例 fallback：

```ts
[
  { speaker: "主持人", text: "凯娅背对火光坐着，尾巴尖一下一下敲着石头。她手里那枚黑缆扣已经被检查了很多遍，还是没有放回袋子里。" },
  { speaker: "凯娅", text: "我给明天算过账。进门亏，退回去也亏。" },
  { speaker: "凯娅", text: "所以我们只能赌第三种——活着穿过去，然后让欠账的人慢慢还。" }
]
```

---

### 10.5 莱因，仅 lainHelped=true 时可用

主题：

1. 断裂军牌。
2. 点名、换岗、第三下敲门。
3. “队长声音是假的”。
4. 对被救的模糊反应。
5. 给非常有限的 Boss 前提示。

禁止：

1. 不能说地下海洋。
2. 不能说海浪、海声、盐味。
3. 不能解释完整真相。
4. 不能提供过于清楚的攻略。
5. 不能泄露瑟琳身份。

示例 fallback：

```ts
[
  { speaker: "主持人", text: "莱因靠在火光边缘，断裂军牌被他攥得很紧。菌丝随着他的呼吸轻轻收缩，像还在替某个不存在的队伍报数。" },
  { speaker: "莱因", text: "点名……不对。你们不是第一队。" },
  { speaker: "莱因", text: "如果它叫你们归队，别答应。队长死在门前了。" },
  { speaker: "莱因", text: "胸口的黑石不是心脏……是锁。锁坏了，可锁还在响。" }
]
```

---

## 11. AI 失败时的兜底机制

不要出现“等待 KP 回复很久，然后什么都没显示”的问题。

每个目标都必须有 deterministic fallback。

流程：

```text
点击角色
→ 显示等待 KP 回复
→ AI 成功：写入 AI 文本，标记已聊
→ AI 失败 / 超时 / 空文本：
   → 使用该角色 fallback 文本
   → 标记已聊
   → 显示“由于 KP 回复失败，已使用固定夜谈文本”
```

注意：

- 不要因为 AI 失败而阻塞玩家。
- 不要因为 AI 失败直接跳到下一剧情。
- 必须先显示文本，再允许继续。
- 同一个角色已聊后不要重复生成，除非玩家点击“重新生成”功能且当前项目已有类似功能。

---

## 12. 保存 AI 文本

为了避免读档后夜谈内容变化，建议保存每个角色的生成文本：

```ts
campNightTalkLogs: {
  serin?: StoryLine[];
  ailin?: StoryLine[];
  block?: StoryLine[];
  kaiya?: StoryLine[];
  lain?: StoryLine[];
}
```

点击已聊角色时有两种做法：

### 做法 A：禁用已聊按钮

最简单，推荐。

```text
瑟琳（已交谈）
```

### 做法 B：允许查看已聊内容

如果当前 UI 支持，可以显示：

```text
回看与瑟琳的夜谈
```

但不要重新调用 AI。

---

## 13. 完成度逻辑示例

```ts
const requiredTargets = getCampNightRequiredTalkTargets(state);
const allDone = requiredTargets.every((target) =>
  hasTalkedToCampNightTarget(state, target)
);

if (allDone) {
  state.campNightAllRequiredTalksDone = true;
}
```

示例：

### 救莱因

```ts
state.lainHelped = true;
state.campNightTalkedToSerin = true;
state.campNightTalkedToAilin = true;
state.campNightTalkedToBlock = true;
state.campNightTalkedToKaiya = true;
state.campNightTalkedToLain = false;

areAllRequiredCampNightTalksDone(state); // false
```

莱因也聊完后：

```ts
state.campNightTalkedToLain = true;
areAllRequiredCampNightTalksDone(state); // true
```

### 不救莱因

```ts
state.lainHelped = false;
state.campNightTalkedToSerin = true;
state.campNightTalkedToAilin = true;
state.campNightTalkedToBlock = true;
state.campNightTalkedToKaiya = true;
state.campNightTalkedToLain = false;

areAllRequiredCampNightTalksDone(state); // true
```

重点：

```text
不救莱因时，campNightTalkedToLain 不参与完成度判断。
```

---

## 14. 路由改造要求

Codex 需要找到 `laineDecision` 或对应莱因事件后的 next 逻辑。

旧逻辑可能类似：

```ts
if (lainHelped) {
  next = 'bossPrebattle';
} else {
  next = 'campNight';
}
```

或：

```ts
next: state.lainHelped ? SOME_NODE : CAMP_NIGHT_NODE
```

现在必须改为：

```ts
next = 'campNight';
```

或者当前项目 ID：

```ts
next = POST_BLUE_SHOAL_IDS.campNight;
```

然后 `campNight` 完成后再进入：

```ts
next = 'act1-black-root-rest-serin-crack';
```

或当前实际 Boss 前节点。

---

## 15. 不要破坏四结局

夜谈完成度只控制是否能进入下一节点。  
不要让夜谈改变四结局的核心条件。

四结局仍然只由：

```text
lainHelped
bossCoreChoice
```

决定。

不要新增：

```text
是否与莱因夜谈
```

作为结局条件。

也就是说：

- 救莱因但没有和莱因聊完：不能继续剧情。
- 救莱因且和莱因聊完：可以继续，后续仍然是 A/B 分支。
- 不救莱因：没有莱因选项，四位队友聊完即可继续，后续仍然是 C/D 分支。

---

## 16. 禁止事项

1. 不要在不救莱因时显示莱因夜谈按钮。
2. 不要在不救莱因时强制把莱因带回营地。
3. 不要把 `campNightTalkedToLain` 当成 `lainHelped`。
4. 不要让夜谈改变四结局硬条件。
5. 不要新增自由输入框。
6. 不要让 AI 夜谈泄露地下海洋。
7. 不要让 AI 夜谈泄露瑟琳来自未来。
8. 不要让 AI 夜谈解释完整时间锚点。
9. 不要让 AI 夜谈替玩家决定稳定 / 破坏核心。
10. 不要因为 AI 失败卡死夜谈流程。
11. 不要 AI 失败后直接跳剧情。
12. 不要重复生成已完成夜谈，除非项目已有明确“重新生成”交互。

---

## 17. 测试清单

### 17.1 路由测试

1. 救莱因后，进入 `campNight`。
2. 不救莱因后，也进入 `campNight`。
3. `campNight` 完成后进入 Boss 前休整 / 瑟琳裂杖节点。
4. `campNight` 未完成时不能进入下一节点。

### 17.2 选项测试

#### 救莱因

`lainHelped = true` 时显示：

```text
和瑟琳聊聊
和艾琳聊聊
和布洛克聊聊
和凯娅聊聊
和莱因聊聊
```

必须 5 个都完成才能继续。

#### 不救莱因

`lainHelped = false` 时只显示：

```text
和瑟琳聊聊
和艾琳聊聊
和布洛克聊聊
和凯娅聊聊
```

不显示：

```text
和莱因聊聊
```

4 个完成后即可继续。

### 17.3 AI 测试

1. 点击每个角色会调用 AI 夜谈生成。
2. AI 输入上下文包含前文经历、背包、同伴信任值、主角六维值。
3. AI 失败时使用 fallback 文本。
4. AI 失败不会卡死流程。
5. 已聊角色不会重复调用 AI。
6. 读档后已聊状态仍然保留。
7. 读档后已生成文本不变化，或至少不会造成流程错误。

### 17.4 剧情限制测试

1. 夜谈中不能出现地下海洋、海风、海浪、海声、盐味、黑潮。
2. 瑟琳夜谈不能暴露未来身份。
3. 莱因夜谈不能说出完整真相。
4. 同伴夜谈不能替玩家选择 Boss 核心处理方式。
5. 不救莱因时没有莱因的 Boss 前提示。

---

## 18. 建议提交信息

```text
feat: add required camp night companion talks
```

如果拆成两次提交：

```text
feat: route post-lain flow through camp night
feat: add camp night AI companion talks
```

---

## 19. 给 Codex 的最后提醒

这次不是普通修文，而是一个小型交互节点改造。

核心要点只有三个：

```text
campNight 必须经过。
救莱因 = 五个夜谈对象。
不救莱因 = 四个夜谈对象，没有莱因。
```

实现时请优先复用当前剧情选择、AI 续写、等待 KP、fallback、存档和状态系统。  
不要重写剧情引擎，不要新建平行聊天系统，不要破坏四结局。
