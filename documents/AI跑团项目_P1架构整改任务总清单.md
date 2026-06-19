# AI跑团项目 P1 架构整改任务总清单

> 适用项目：AI跑团《地心之门》  
> 当前状态：P0 架构重构已完成，P1 架构审计已完成。  
> 本文件用于发给 Codex / CodeBuddy，按阶段推进 P1 级架构整改。  
> 核心原则：不要一次性大改；先稳定协议和规则边界，再拆大组件。

---

# 0. P1 总结论

P1 审计结论：

```text
P1 五项均未完全闭环。
其中四项部分完成，物品目录尚未开始。
当前功能基线稳定，但骰子统一入口、版本化事件、物品目录、标准场景摘要以及大组件拆分仍需继续整改。
```

当前测试基线：

```text
前端：20/20 通过
后端：25/25 通过
TypeScript + Vite 生产构建通过
Python 全量编译检查通过
```

P1 整改目标不是新增大量玩法，而是让现有玩法具备：

- 可追溯
- 可复现
- 可校验
- 可迁移
- 可扩展
- 可调试

---

# 1. P1 执行总顺序

推荐顺序如下：

```text
1. P1-1A：DiceEvent / EventEnvelope 最小闭环
2. P1-1B：迁移剩余随机入口
3. P1-2：AI / SSE / StatePatch schema
4. P1-3：ItemCatalog / ItemInstance / ItemEffect
5. P1-4：SceneSummary / ContextBudgetPolicy
6. P1-5：拆分 App.tsx / BattleTestScreen.tsx
```

不要先拆大组件。  
原因：

```text
DiceEvent、SSE、ItemCatalog、SceneSummary 这些边界还没定型。
如果现在先拆 UI，后续协议一变，会导致大量新文件二次修改。
```

正确路线：

```text
先稳定数据协议
→ 再稳定规则入口
→ 再迁移内容数据
→ 最后拆 UI
```

---

# 2. P1-1A：DiceEvent / EventEnvelope 最小闭环

## 2.1 目标

建立统一的：

```text
EventEnvelope<TPayload>
DiceEvent
```

并先覆盖以下最小闭环：

1. 战前剧情检定骰子
2. 虚构骰子重投
3. 万能骰子指定结果
4. 后端权威战斗骰子，包括 attack / damage / initiative

本阶段暂时不迁移：

- 黑市抽奖
- 奥兰盲盒
- 布洛克喝酒小游戏
- 酒馆骰子扑克
- 测试页面骰子
- 所有旧 fallback 随机逻辑

这些放到 P1-1B 再处理。

---

## 2.2 必须遵守

1. 不要破坏 P0 权威战斗链路。
2. 不要改变现有战斗 UI 表现。
3. 不要改变重投机制体验。
4. 不要删除旧骰子函数，第一轮只做兼容接入。
5. 所有新增事件必须带 `schemaVersion`。
6. 每次业务骰子必须有 `rollId`。
7. `DiceEvent.rolls` 必须保存原始骰面。
8. `DiceEvent.total` 才是加修正后的总值。
9. 伤害骰 UI 不得把 `total` 当成 `finalFace`。
10. 万能骰子指定结果也必须生成 `DiceEvent`，并标记 `source = "omni_dice"`。
11. 前端允许保留动画随机，但前端不得用动画随机生成业务结果。
12. 旧数据结构应通过 mapper 兼容，不要暴力删除旧字段。

---

## 2.3 EventEnvelope 类型建议

```ts
export interface EventEnvelope<TPayload> {
  eventId: string;
  schemaVersion: 1;
  sequence: number;
  correlationId?: string;

  type: string;
  source: string;
  createdAt: string;

  payload: TPayload;
}
```

---

## 2.4 DiceEvent 类型建议

```ts
export interface DiceEvent {
  rollId: string;

  type:
    | 'attack'
    | 'damage'
    | 'initiative'
    | 'story_check'
    | 'reroll'
    | 'shop_lottery'
    | 'drinking_game'
    | 'dice_poker'
    | 'test';

  source:
    | 'battle_engine'
    | 'story_check'
    | 'fiction_dice'
    | 'omni_dice'
    | 'shop'
    | 'minigame'
    | 'test';

  formula: string;
  diceSides: number;
  rolls: number[];
  modifier: number;
  total: number;

  seed?: string;
  seedIndex?: number;
  createdAt: string;

  actorId?: string;
  targetId?: string;
  skillId?: string;
  checkId?: string;
  itemId?: string;

  metadata?: Record<string, unknown>;
}
```

---

## 2.5 建议新增文件

前端：

```text
frontend/src/core/events/EventEnvelope.ts
frontend/src/core/dice/DiceEvent.ts
frontend/src/core/dice/createDiceEvent.ts
frontend/src/core/dice/DiceEventMapper.ts
```

后端：

```text
backend/core/events/event_envelope.py
backend/core/dice/dice_event.py
```

如果后端主要使用：

```text
backend/engine/dice_service.py
```

可以先在现有 DiceService 中扩展事件结构，不强制新建目录。

---

## 2.6 必须全局检查

请全局搜索：

```text
Math.random
rollD20
rollDice
rollDie
localRoll
randomInt
diceEvents
DiceEvent
StoryCheckResult
reroll
finalRoll
rngCursor
```

并按系统分类：

| 系统 | 是否本轮迁移 |
|---|---|
| 战前剧情检定 | 是 |
| 虚构骰子重投 | 是 |
| 万能骰子指定结果 | 是 |
| 后端权威战斗骰子 | 是 |
| 黑市抽奖 / 奥兰盲盒 | 否，P1-1B |
| 布洛克喝酒小游戏 | 否，P1-1B |
| 酒馆骰子扑克 | 否，P1-1B |
| 测试页面骰子 | 否，P1-1B |
| 旧 fallback 战斗逻辑 | 暂时保留，标记风险 |

---

## 2.7 战前剧情检定要求

- 生成 `type = "story_check"` 的 `DiceEvent`。
- `source = "story_check"`。
- `checkId` 必须存在。
- `initialRoll` 需要引用 `rollId`。
- 保留现有 UI 和判定体验。
- 保留现有 AI 续写流程。
- 不允许重新引入多次战前行动。

兼容方案：

```ts
initialRoll: number
initialRollId: string
diceEvents: DiceEvent[]
```

第一轮以兼容为主，不强制彻底替换旧字段。

---

## 2.8 虚构骰子重投要求

- 生成 `type = "reroll"` 的 `DiceEvent`。
- `source = "fiction_dice"`。
- 保留 `initialRoll`、`reroll`、`finalRoll`。
- `finalRoll` 引用被采用的 `rollId`。
- 每次剧情判定最多只能使用一个重投道具。
- 重投后 AI 续写只读取最终结果。

示例：

```ts
{
  rollId: "roll_xxx",
  type: "reroll",
  source: "fiction_dice",
  formula: "1d20",
  diceSides: 20,
  rolls: [16],
  modifier: 3,
  total: 19,
  checkId: "blue_shoal_prep_observe",
  itemId: "fiction_dice",
  createdAt: "...",
  metadata: {
    rerollRule: "take_max",
    previousRollId: "roll_initial"
  }
}
```

---

## 2.9 万能骰子要求

- 即使玩家指定点数，也必须生成 `DiceEvent`。
- `source = "omni_dice"`。
- `type = "reroll"`。
- `metadata.forced = true`。
- `finalRoll` 引用该 `rollId`。
- 不应使用随机数生成业务结果。

示例：

```ts
{
  rollId: "roll_xxx",
  type: "reroll",
  source: "omni_dice",
  formula: "1d20",
  diceSides: 20,
  rolls: [20],
  modifier: 3,
  total: 23,
  checkId: "blue_shoal_prep_observe",
  itemId: "omni_dice",
  createdAt: "...",
  metadata: {
    forced: true,
    chosenFace: 20
  }
}
```

---

## 2.10 后端战斗骰子要求

- `attack` / `damage` / `initiative` 事件补齐 `rollId`。
- 补齐 `source`。
- 补齐 `formula` / `diceSides` / `rolls` / `modifier` / `total`。
- 如果目前没有 `seedIndex`，先补 nullable 字段。
- 或者临时由 `rngCursor` 生成兼容 `seedIndex`。
- 不破坏现有前端 BattleAdapter。
- 不破坏伤害骰 UI。
- 不允许把伤害骰 `total` 当作骰子最终面。

---

## 2.11 兼容旧结构 mapper

建议新增：

```ts
export function normalizeDiceEvent(raw: unknown): DiceEvent {
  // 1. 如果 raw 已经是 DiceEvent，直接返回
  // 2. 如果 raw 是旧 battle dice event，补齐 rollId/source/formula/rolls/total
  // 3. 如果 raw 是 story check 旧结构，转换为 DiceEvent
  // 4. 如果字段缺失，使用 metadata.legacy = true 标记
}
```

兼容原则：

- 新逻辑产出新结构。
- 旧逻辑经 mapper 转成新结构。
- 未知字段保存在 `metadata.legacyRaw`。
- 不因旧字段缺失导致 UI 崩溃。

---

## 2.12 UI 注意事项

伤害骰动画最终面必须使用：

```ts
finalFace = event.rolls[0]
```

禁止使用：

```ts
finalFace = event.total
```

原因：

```text
1d8 + 3 = 10
```

此时 `total = 10`，但 D8 没有第 10 面。

伤害骰不应该显示：

```text
AC?
< AC?
```

---

## 2.13 P1-1A 完成标准

```text
[ ] EventEnvelope 类型存在
[ ] DiceEvent 类型存在
[ ] createDiceEvent 工具存在
[ ] normalizeDiceEvent mapper 存在
[ ] 战前剧情检定生成 DiceEvent
[ ] 虚构骰子重投生成 DiceEvent
[ ] 万能骰子指定结果生成 DiceEvent
[ ] 后端战斗 attack 事件补齐 DiceEvent 字段
[ ] 后端战斗 damage 事件补齐 DiceEvent 字段
[ ] 后端战斗 initiative 事件补齐 DiceEvent 字段
[ ] storyCheck.initialRollId 可追溯
[ ] storyCheck.finalRollId 可追溯
[ ] battle.diceLog 可追溯
[ ] 伤害骰 UI 不回归
[ ] 战前行动 UI 不回归
[ ] 前端测试通过
[ ] 后端测试通过
[ ] TypeScript + Vite 构建通过
[ ] Python 编译检查通过
```

---

# 3. P1-1B：迁移剩余随机入口

## 3.1 目标

P1-1A 只覆盖主线闭环。P1-1B 负责把剩余业务随机入口逐步迁入统一 DiceEvent / DiceService。

目标：

```text
所有业务随机结果必须有 DiceEvent。
前端只允许动画随机，不允许业务随机。
```

---

## 3.2 迁移范围

审计中已发现前端仍存在多处 `Math.random()`，包括：

```text
frontend/src/utils/battlePrep.ts
frontend/src/App.tsx
frontend/src/components/BargainTestScreen.tsx
frontend/src/components/BattleTestScreen.tsx
frontend/src/components/DrinkingDiceGame.tsx
frontend/src/components/LuckyBoxGame.tsx
frontend/src/components/OrlanBoxGame.tsx
frontend/src/components/TavernDicePoker.tsx
frontend/src/components/YachtDiceTestScreen.tsx
```

后端也需要检查：

```text
backend/engine/dice_service.py
backend/engine/rules_dnd.py
酒馆骰子相关后端代码
骰子扑克相关后端代码
```

---

## 3.3 本阶段要迁移的系统

| 系统 | DiceEvent type | source |
|---|---|---|
| 黑市抽奖 / 奥兰盲盒 | shop_lottery | shop |
| 布洛克喝酒小游戏 | drinking_game | minigame |
| 酒馆骰子扑克 | dice_poker | minigame |
| 游艇 / 骰子测试页 | test | test |
| 后端 rules_dnd.py 随机判定 | 按用途分类 | battle_engine / story_check |
| 旧 fallback 战斗逻辑 | 标记 deprecated | test / legacy |

---

## 3.4 迁移原则

1. 业务随机必须来自统一 DiceService / DiceClient。
2. 所有业务随机都要生成 DiceEvent。
3. UI 动画随机可以保留，但必须明确命名为 animationRandom。
4. 测试页面可以使用随机，但 source 必须为 `test`。
5. 旧 fallback 战斗逻辑如果保留，必须标记 `deprecated`，不得被主流程调用。
6. 迁移一个系统，补一个测试。
7. 不要一次性改所有小游戏。

---

## 3.5 推荐迁移顺序

```text
1. 黑市抽奖 / 奥兰盲盒
2. 布洛克喝酒小游戏
3. 酒馆骰子扑克
4. 测试页面骰子
5. 后端 rules_dnd.py 独立随机逻辑
6. 旧 fallback 战斗逻辑标记与清理
```

---

## 3.6 P1-1B 完成标准

```text
[ ] 黑市抽奖接入 DiceEvent
[ ] 奥兰盲盒接入 DiceEvent
[ ] 布洛克喝酒小游戏接入 DiceEvent
[ ] 酒馆骰子扑克接入 DiceEvent
[ ] 测试页面骰子标记 source = test
[ ] 业务代码中不再直接 Math.random 生成业务结果
[ ] 前端只允许动画随机
[ ] 后端业务随机统一进入 DiceService
[ ] 所有业务骰子可追溯 rollId
[ ] 所有业务骰子有 source
[ ] 所有业务骰子有 formula / rolls / modifier / total
```

---

# 4. P1-2：统一 AI / SSE / StatePatch schema

## 4.1 目标

建立统一、版本化、可校验的事件与 AI 输出协议。

当前问题：

- SSE 仍发送 `{ type, content }` 自由字典。
- `content` 可能是字符串、字典或完整状态。
- AI 工具输出仍通过 `[STATE:...]`、`[SYSTEM:...]`、`[CMD:...]` 文本协议传递。
- AI 专项调用使用 `json.loads` 和手工默认值，缺少统一 schema。
- `PatchOperation`、`GameAction`、`ActionResult` 仍有较多 `str` / `Any`。
- 战斗路由响应未全部声明 response_model。

---

## 4.2 目标结构

### EventEnvelope

```ts
export interface EventEnvelope<TPayload> {
  eventId: string;
  schemaVersion: number;
  sequence: number;
  correlationId?: string;
  type: string;
  source: string;
  createdAt: string;
  payload: TPayload;
}
```

### AiResult

```ts
export interface AiResult<TPayload> {
  schemaVersion: number;
  requestId: string;
  type: string;
  payload: TPayload;
  rawText?: string;
  warnings?: string[];
}
```

### StatePatchEnvelope

```ts
export interface StatePatchEnvelope {
  schemaVersion: number;
  patchId: string;
  source: 'system' | 'rules' | 'ai_candidate' | 'migration';
  correlationId?: string;
  patches: PatchOperation[];
  createdAt: string;
}
```

---

## 4.3 后端建议

使用 Pydantic 建模：

```py
class EventEnvelope(BaseModel):
    event_id: str
    schema_version: int = 1
    sequence: int
    correlation_id: str | None = None
    type: str
    source: str
    created_at: str
    payload: dict
```

为以下对象建立 Pydantic 模型：

```text
AiNarrationOutput
AiCandidatePatch
StatePatchEnvelope
PatchOperation
GameAction
ActionResult
BattleActionResponse
SSEEvent
StoryCheckResult
```

---

## 4.4 SSE 改造要求

SSE 不再发送自由结构：

```json
{ "type": "xxx", "content": "..." }
```

改成：

```json
{
  "eventId": "evt_xxx",
  "schemaVersion": 1,
  "sequence": 12,
  "correlationId": "action_xxx",
  "type": "ai.delta",
  "source": "dm_service",
  "createdAt": "...",
  "payload": {
    "text": "..."
  }
}
```

---

## 4.5 兼容要求

旧文本协议：

```text
[STATE:...]
[SYSTEM:...]
[CMD:...]
```

可以保留为兼容输入，但内部主协议必须转为结构化对象。

原则：

```text
旧协议只在边界层解析
内部流转只使用 schema 对象
```

---

## 4.6 P1-2 完成标准

```text
[ ] SSE 有 EventEnvelope
[ ] SSE 有 schemaVersion
[ ] SSE 有 eventId
[ ] SSE 有 sequence
[ ] SSE 有 correlationId
[ ] AI 专项输出有 Pydantic / schema 校验
[ ] StatePatchEnvelope 有版本
[ ] PatchOperation 有可判别类型
[ ] GameAction 有 schema
[ ] ActionResult 有 schema
[ ] BattleActionResponse 有 response_model
[ ] 非法 AI 输出不会污染 GameState
[ ] 旧文本协议仅作为兼容输入
[ ] 前端对 SSE 事件进行穷尽匹配
```

---

# 5. P1-3：ItemCatalog / ItemInstance / ItemEffect

## 5.1 目标

把物品系统从“UI 内嵌定义 + 名称判断 + 分散效果”升级为统一目录：

```text
ItemCatalog
ItemInstance
ItemEffect
```

当前问题：

- `InventoryPanel.tsx` 内嵌 `ITEM_DEFINITIONS`。
- 商店、图标映射、剧情奖励、后端状态指令各自保存物品名称或配置。
- Canonical State 的物品结构缺少 `catalogId`、`instanceId`、效果联合类型。
- 后端背包处理只检查名称非空，不验证物品是否登记。
- 全局尚无 ItemCatalog / ItemInstance / ItemEffect。

---

## 5.2 建议类型

### ItemDefinition

```ts
export interface ItemDefinition {
  catalogId: string;
  name: string;
  aliases?: string[];
  type:
    | 'consumable'
    | 'equipment'
    | 'quest'
    | 'document'
    | 'clue'
    | 'material'
    | 'currency';

  description: string;
  icon?: string;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'story';
  stackable: boolean;
  maxStack?: number;
  effects?: ItemEffect[];
  metadata?: Record<string, unknown>;
}
```

### ItemInstance

```ts
export interface ItemInstance {
  instanceId: string;
  catalogId: string;
  quantity: number;
  metadata?: Record<string, unknown>;
  acquiredAt?: string;
}
```

### ItemEffect

```ts
export type ItemEffect =
  | HealEffect
  | RerollEffect
  | RevealClueEffect
  | UnlockSceneEffect
  | AddBuffEffect
  | OpenDocumentEffect;

export interface HealEffect {
  type: 'heal';
  amount: number;
}

export interface RerollEffect {
  type: 'reroll';
  rerollType: 'fiction_dice' | 'omni_dice';
}

export interface RevealClueEffect {
  type: 'reveal_clue';
  clueId: string;
}

export interface OpenDocumentEffect {
  type: 'open_document';
  documentId: string;
}
```

---

## 5.3 建议新增文件

前端：

```text
frontend/src/core/items/ItemTypes.ts
frontend/src/core/items/ItemCatalog.ts
frontend/src/core/items/ItemEffect.ts
frontend/src/core/items/ItemResolver.ts
frontend/src/core/items/legacyItemAliases.ts
```

后端：

```text
backend/core/items/item_catalog.py
backend/core/items/item_effect.py
backend/core/items/item_migration.py
```

---

## 5.4 第一批迁移物品

优先迁移：

```text
虚构骰子
万能骰子
治疗药水
金币
第三远征队失联报告
失踪远征队登记册
第三巡逻队记录
伤员净化报告
凯娅暗号纸条
云苓的护身符
常用线索文档
商店售卖物品
```

不要第一轮迁移所有历史物品，先做主线和高频道具。

---

## 5.5 旧物品迁移策略

旧物品可能是：

```text
自由文本名称
逗号分隔字符串
旧 id
旧 name
UI 内嵌定义
```

建立 alias 表：

```ts
export const legacyItemAliases: Record<string, string> = {
  '虚构骰子': 'fiction_dice',
  '万能骰子': 'omni_dice',
  '治疗药水': 'healing_potion',
};
```

未知物品进入：

```text
legacy_unknown
```

不要静默登记未知物品。

---

## 5.6 AI 与物品

AI 不允许添加未登记物品。

如果 AI 提出候选物品奖励：

```ts
candidatePatch.addItem = {
  name: "神秘药剂"
}
```

规则层必须检查：

```text
是否存在 catalogId
是否允许当前场景发放
是否已重复领取
是否满足奖励条件
```

未登记则拒绝或进入 pending_review，不得直接入背包。

---

## 5.7 P1-3 完成标准

```text
[ ] ItemCatalog 存在
[ ] ItemInstance 存在
[ ] ItemEffect 存在
[ ] InventoryPanel 不再私有维护完整物品定义
[ ] 虚构骰子进入 ItemCatalog
[ ] 万能骰子进入 ItemCatalog
[ ] 治疗药水进入 ItemCatalog
[ ] 线索文档进入 ItemCatalog
[ ] 商店物品进入 ItemCatalog
[ ] 旧物品名称通过 alias 迁移
[ ] 未知物品进入 legacy_unknown
[ ] AI 不能添加未登记物品
[ ] item.use 走 GameAction / Resolver
[ ] 物品效果可被规则层验证
```

---

# 6. P1-4：SceneSummary / ContextBudgetPolicy

## 6.1 目标

建立规则层维护的标准场景摘要和统一上下文预算策略。

当前问题：

- Canonical State 已有 `story.summary`，但没有标准类型。
- 没有确定性的摘要生成 / 更新入口。
- 摘要字段没有约束必须包含哪些事实。
- 不同 AI 调用分别硬编码 `max_tokens`。
- 不同调用各自决定传多少 history/context。
- 没有统一 token 预算和裁剪优先级。
- 没有测试确保裁剪后关键信息仍保留。

---

## 6.2 SceneSummary 类型

```ts
export interface SceneSummary {
  sceneId: string;
  areaId: string;
  title: string;

  currentObjective?: string;
  participants: string[];

  confirmedFacts: string[];
  unresolvedClues: string[];
  recentRuleEvents: string[];
  recentPlayerIntent?: string;

  lastUpdatedAt: string;
  version: number;
}
```

---

## 6.3 规则

SceneSummary 中的事实字段应由规则层维护。

AI 可以提供：

```text
叙事摘要候选
语气整理
文本压缩建议
```

但 AI 不应直接覆盖：

```text
confirmedFacts
quest flags
reward state
battle result
inventory facts
```

---

## 6.4 ContextBudgetPolicy

```ts
export interface ContextBudgetPolicy {
  maxTokens: number;

  reserved: {
    system: number;
    rules: number;
    currentScene: number;
    recentEvents: number;
    playerState: number;
    history: number;
  };

  priority: Array<
    | 'system'
    | 'rules'
    | 'currentScene'
    | 'playerState'
    | 'partyState'
    | 'inventory'
    | 'recentEvents'
    | 'history'
    | 'memories'
  >;
}
```

---

## 6.5 建议新增文件

前端：

```text
frontend/src/core/context/SceneSummary.ts
frontend/src/core/context/ContextBudgetPolicy.ts
frontend/src/core/context/buildAiContext.ts
frontend/src/core/context/updateSceneSummary.ts
```

后端：

```text
backend/core/context/scene_summary.py
backend/core/context/context_budget.py
backend/core/context/context_builder.py
```

---

## 6.6 第一轮覆盖范围

先覆盖：

```text
主聊天 DM
战前行动 AI 续写
战斗胜利后 AI 续写
```

然后再迁移：

```text
NPC 专项判断
艾琳回答评分
布洛克小游戏台词
凯娅暗号判断
商店议价
```

---

## 6.7 P1-4 完成标准

```text
[ ] SceneSummary 类型存在
[ ] SceneSummary 更新器存在
[ ] SceneSummary 由规则层维护事实字段
[ ] AI 不能直接覆盖 confirmedFacts
[ ] ContextBudgetPolicy 存在
[ ] 所有主 AI 调用使用统一 context builder
[ ] 主聊天接入统一预算
[ ] 战前续写接入统一预算
[ ] 战后续写接入统一预算
[ ] 不同 AI 调用不再到处硬编码 max_tokens
[ ] 有测试验证裁剪后关键信息仍保留
```

---

# 7. P1-5：拆分 App.tsx / BattleTestScreen.tsx

## 7.1 目标

在协议边界稳定后，拆分大组件，降低维护风险。

当前问题：

```text
App.tsx 仍有约 5111 行。
BattleTestScreen.tsx 仍有约 3988 行。
```

它们仍承担：

- UI 展示
- 状态管理
- 场景编排
- AI 流处理
- 战斗切换
- 商店 / 小游戏入口
- 动画控制
- 部分旧逻辑 fallback

---

## 7.2 拆分原则

```text
Controller 负责 dispatch action
Component 只负责展示
core 负责规则
api 负责请求
data 负责静态配置
```

不要先拆 JSX。  
先抽无 UI 的 controller / hooks / view model。

---

## 7.3 App.tsx 拆分目标

```text
frontend/src/features/app/
  AppShell.tsx
  AppController.ts
  useAppState.ts

frontend/src/features/story/
  StoryScreen.tsx
  StoryController.ts
  StoryActionPanel.tsx
  DialogueInput.tsx
  useStoryFlow.ts

frontend/src/features/ai/
  AiStreamController.ts
  useAiSession.ts

frontend/src/features/encounter/
  EncounterController.ts
  BattlePrepController.ts

frontend/src/features/inventory/
  InventoryPanel.tsx
  ItemDetailModal.tsx

frontend/src/features/party/
  PartyPanel.tsx
  TrustPanel.tsx

frontend/src/features/save/
  SaveLoadPanel.tsx

frontend/src/features/shop/
  ShopScreen.tsx
  ShopController.ts
```

---

## 7.4 BattleTestScreen 拆分目标

```text
frontend/src/features/battle/
  BattleScreen.tsx
  BattleController.ts
  BattleViewModel.ts
  useBattleSession.ts
  BattleField.tsx
  BattleActorSprite.tsx
  BattleActionBar.tsx
  BattleLogPanel.tsx
  BattleDiceOverlay.tsx
  BattleResultPanel.tsx
```

---

## 7.5 推荐拆分顺序

```text
1. 抽 AiStreamController
2. 抽 BattlePrepController
3. 抽 StoryController
4. 抽 BattleViewModel
5. 抽 BattleController
6. 抽纯展示组件
7. 最后压缩 App.tsx / BattleTestScreen.tsx
```

---

## 7.6 不允许做的事

```text
不要在拆分时改变业务规则
不要在拆分时改变 UI 交互
不要在拆分时重写剧情流程
不要在拆分时删除 fallback
不要和 DiceEvent / SSE schema 改造混在同一个提交
```

---

## 7.7 P1-5 完成标准

```text
[ ] App.tsx 不再超过 1000 行
[ ] BattleTestScreen.tsx 不再超过 1200 行
[ ] AI 流处理从 App.tsx 抽离
[ ] 战前状态机从 App.tsx 抽离
[ ] 场景切换从 App.tsx 抽离
[ ] BattleViewModel 可独立测试
[ ] BattleController 可独立测试
[ ] 战斗 UI 组件只接收 props
[ ] 剧情 UI 组件只接收 props
[ ] 状态修改集中到 controller / resolver
[ ] 原有测试全部通过
[ ] 手动主线流程通过
```

---

# 8. P1 总验收标准

P1 全部完成后，应满足：

```text
[ ] 所有业务骰子有 DiceEvent
[ ] 所有 DiceEvent 有 rollId / source / formula / rolls / total
[ ] 战斗、剧情检定、重投、小游戏骰子可追溯
[ ] SSE 使用版本化 EventEnvelope
[ ] AI 输出有 schema 校验
[ ] StatePatch 有版本化信封
[ ] 物品有 ItemCatalog
[ ] 背包保存 ItemInstance
[ ] 物品效果走 ItemEffect
[ ] AI 不能添加未登记物品
[ ] SceneSummary 有标准结构
[ ] ContextBudgetPolicy 统一上下文裁剪
[ ] App.tsx 与 BattleTestScreen.tsx 完成拆分
[ ] 所有原测试通过
[ ] 新增 P1 测试通过
[ ] 生产构建通过
[ ] Python 编译检查通过
```

---

# 9. 推荐提交节奏

```text
commit 1: refactor(p1): add EventEnvelope and DiceEvent types
commit 2: refactor(p1): add dice event mapper and createDiceEvent
commit 3: refactor(p1): attach DiceEvent to story checks and rerolls
commit 4: refactor(p1): enrich battle dice events with rollId and source
commit 5: test(p1): add DiceEvent regression tests
commit 6: refactor(p1): migrate shop lottery dice events
commit 7: refactor(p1): migrate drinking game dice events
commit 8: refactor(p1): migrate dice poker and test dice events
commit 9: refactor(p1): add EventEnvelope SSE schema
commit 10: refactor(p1): add AI output schema validation
commit 11: refactor(p1): add ItemCatalog and legacy item aliases
commit 12: refactor(p1): migrate reroll items and healing potion to ItemEffect
commit 13: refactor(p1): add SceneSummary and ContextBudgetPolicy
commit 14: refactor(p1): extract AI stream and battle prep controllers
commit 15: refactor(p1): extract battle view model and presentation components
```

---

# 10. 第一条 Codex 任务建议

建议第一条只做 P1-1A，不要全量整改 P1。

```md
# 任务：P1-1A DiceEvent / EventEnvelope 最小闭环

当前 P0 架构稳定，P1 审计完成。现在请只做 P1-1A 的设计与改造计划，不要直接全量改代码。

## 目标

建立统一 DiceEvent 与 EventEnvelope 协议，并先覆盖：

1. 战前剧情检定骰子
2. 虚构骰子重投
3. 万能骰子指定结果
4. 后端权威战斗骰子 attack / damage / initiative

## 必须遵守

1. 不要破坏 P0 权威战斗链路。
2. 不要改变现有 UI 表现。
3. 不要改变重投机制体验。
4. 不要删除旧骰子函数。
5. 所有新增业务骰子必须有 rollId。
6. DiceEvent.rolls 保存原始骰面。
7. DiceEvent.total 保存加修正后的总值。
8. 伤害骰 finalFace 必须使用 rolls[0]，不能使用 total。
9. 万能骰子指定结果也必须生成 DiceEvent。
10. 第一轮不要迁移小游戏。

## 输出要求

请输出：

1. 当前 DiceEvent / diceEvents 实际结构
2. 战前检定当前骰子结构
3. 重投当前骰子结构
4. 后端战斗骰子当前结构
5. 需要新增的类型文件
6. 兼容旧结构的 mapper 方案
7. 第一轮最小改造步骤
8. 风险点
9. 完成后的测试清单
```

---

# END
