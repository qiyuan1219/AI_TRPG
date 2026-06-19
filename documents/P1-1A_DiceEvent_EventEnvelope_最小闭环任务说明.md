# P1-1A：统一 DiceEvent / EventEnvelope 最小闭环任务说明

> 适用项目：AI跑团《地心之门》  
> 当前阶段：P0 架构重构已完成，P1 架构审计已完成。  
> 本文件用于发给 Codex / CodeBuddy 执行下一阶段整改。  
> 核心原则：先统一骰子事件协议与最小闭环，不要一次性大改全部随机逻辑。

---

# 0. 当前背景

P0 架构重构已经完成：

- BattleTestScreen 实际战斗改走后端权威 BattleEngine。
- 前端只提交角色、技能和目标。
- 已新增 Canonical GameState v2 与旧存档自动迁移兼容层。
- 已建立 GameAction → Resolver → StatePatch 基础管线。
- AI 无权直接修改金币、物品、HP、信任或战斗状态。
- 战斗状态、动作、事件、骰子和随机种子已持久化至 SQLite。
- 支持战斗中刷新、读档及服务重启恢复。
- 原战斗 UI、骰子动画、教程和 KP 叙述均保留。

P1 架构审计结论：

> P1 五项均未完全闭环，其中四项部分完成，物品目录尚未开始。  
> 当前功能基线稳定，但骰子统一入口、版本化事件、物品目录、标准场景摘要以及大组件拆分仍需继续整改。

本阶段优先处理：

```text
P1-1A：统一 DiceEvent / EventEnvelope 最小闭环
```

---

# 1. 为什么优先做 DiceEvent / EventEnvelope

当前 P1 审计发现：

- 权威战斗已使用后端骰子服务，但剧情判定和小游戏仍有多个独立随机入口。
- 前端业务代码仍存在多处 `Math.random()`。
- 后端部分小游戏和规则仍有独立随机实现。
- 现有骰子事件缺少稳定的 `rollId`、`source`、`seedIndex`。
- 当前 `rngCursor` 更接近战斗动作游标，而不是每一颗骰子的可审计序号。
- 非战斗骰子无法可靠复现。
- 重投、剧情检定和战斗骰子之间没有统一追踪结构。
- 之前已出现过“伤害骰 total 被当成 finalFace”的 UI 显示问题，说明骰子结构需要进一步明确。

因此，下一阶段不要先拆大组件，也不要先做物品目录，而应先完成：

```text
统一骰子事件协议
→ 战前剧情检定接入
→ 重投接入
→ 权威战斗骰子补齐字段
→ 存档可追溯
```

---

# 2. 本阶段目标

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

# 3. 必须遵守的原则

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

# 4. 建议新增类型

## 4.1 EventEnvelope

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

字段说明：

| 字段 | 说明 |
|---|---|
| `eventId` | 每个事件唯一 ID |
| `schemaVersion` | 事件结构版本，当前为 1 |
| `sequence` | 同一会话或同一上下文中的递增序号 |
| `correlationId` | 可选，用于关联同一次 Action / Check / BattleAction |
| `type` | 事件类型 |
| `source` | 事件来源 |
| `createdAt` | 创建时间 |
| `payload` | 具体事件内容 |

---

## 4.2 DiceEvent

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

字段说明：

| 字段 | 说明 |
|---|---|
| `rollId` | 每次骰子结果唯一 ID |
| `type` | 骰子用途，如 attack、damage、story_check |
| `source` | 骰子来源，如 battle_engine、story_check |
| `formula` | 骰子公式，如 `1d20+3`、`1d8+2` |
| `diceSides` | 骰子面数，如 20、8、6、4 |
| `rolls` | 原始骰面，如 `[7]` 或 `[2, 4]` |
| `modifier` | 修正值 |
| `total` | 最终总值 |
| `seed` | 可选，随机种子 |
| `seedIndex` | 可选，骰子序号 |
| `createdAt` | 创建时间 |
| `actorId` | 可选，行动者 |
| `targetId` | 可选，目标 |
| `skillId` | 可选，技能 |
| `checkId` | 可选，剧情检定 ID |
| `itemId` | 可选，触发道具 |
| `metadata` | 额外信息 |

---

# 5. 建议新增文件

如果项目已有相近目录，请复用现有 `core` 结构。

## 前端

```text
frontend/src/core/events/EventEnvelope.ts
frontend/src/core/dice/DiceEvent.ts
frontend/src/core/dice/createDiceEvent.ts
frontend/src/core/dice/DiceEventMapper.ts
```

## 后端

```text
backend/core/events/event_envelope.py
backend/core/dice/dice_event.py
```

如果后端当前主要使用：

```text
backend/engine/dice_service.py
```

可以先在现有 DiceService 中扩展事件结构，不强制新建目录。

---

# 6. 必须全局检查

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

# 7. 第一轮必须接入的系统

## 7.1 战前剧情检定

要求：

- 生成 `type = "story_check"` 的 `DiceEvent`。
- `source = "story_check"`。
- `checkId` 必须存在。
- `initialRoll` 需要引用 `rollId`。
- 保留现有 UI 和判定体验。
- 保留现有 AI 续写流程。
- 不允许重新引入多次战前行动。

建议结构：

```ts
interface StoryCheckRollRef {
  rollId: string;
  diceEvent: DiceEvent;
}
```

原先如果有：

```ts
initialRoll: number
```

可以兼容升级为：

```ts
initialRoll: {
  rollId: string;
  value: number;
  diceEvent: DiceEvent;
}
```

或者保留：

```ts
initialRoll: number
initialRollId: string
diceEvents: DiceEvent[]
```

第一轮以兼容为主，不强制彻底替换旧字段。

---

## 7.2 虚构骰子重投

要求：

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

## 7.3 万能骰子指定结果

要求：

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

## 7.4 后端战斗骰子

要求：

- `attack` / `damage` / `initiative` 事件补齐 `rollId`。
- 补齐 `source`。
- 补齐 `formula` / `diceSides` / `rolls` / `modifier` / `total`。
- 如果目前没有 `seedIndex`，先补 nullable 字段。
- 或者临时由 `rngCursor` 生成兼容 `seedIndex`。
- 不破坏现有前端 BattleAdapter。
- 不破坏伤害骰 UI。
- 不允许把伤害骰 `total` 当作骰子最终面。

示例：

```ts
{
  rollId: "roll_xxx",
  type: "damage",
  source: "battle_engine",
  formula: "1d8+2",
  diceSides: 8,
  rolls: [7],
  modifier: 2,
  total: 9,
  actorId: "player",
  targetId: "enemy_spore_crawler_1",
  skillId: "steady_slash",
  seedIndex: 12,
  createdAt: "..."
}
```

---

# 8. 兼容旧结构的 mapper

本阶段不要直接删除旧字段。

建议新增 mapper：

```ts
export function normalizeDiceEvent(raw: unknown): DiceEvent {
  // 1. 如果 raw 已经是 DiceEvent，直接返回
  // 2. 如果 raw 是旧 battle dice event，补齐 rollId/source/formula/rolls/total
  // 3. 如果 raw 是 story check 旧结构，转换为 DiceEvent
  // 4. 如果字段缺失，使用 metadata.legacy = true 标记
}
```

后端也可增加类似函数：

```py
def normalize_dice_event(raw: dict) -> DiceEvent:
    ...
```

兼容原则：

- 新逻辑产出新结构。
- 旧逻辑经 mapper 转成新结构。
- 未知字段保存在 `metadata.legacyRaw`。
- 不因旧字段缺失导致 UI 崩溃。

---

# 9. 前端 UI 注意事项

## 9.1 伤害骰 finalFace

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

---

## 9.2 命中骰与伤害骰分开渲染

命中骰可以显示：

```text
命中掷骰
点数 + 修正 = 总值
总值 vs AC
命中 / 未命中
```

伤害骰应该显示：

```text
伤害掷骰
公式：1d8 + 3
点数：7
修正：+3
总伤害：10
造成 10 点伤害
```

伤害骰不应该显示：

```text
AC?
< AC?
```

---

# 10. EventEnvelope 使用建议

第一轮不强制所有 SSE 事件都接入 EventEnvelope。

但本阶段新增的 DiceEvent 应尽量支持：

```ts
export type DiceEventEnvelope = EventEnvelope<DiceEvent>;
```

在以下地方可先接入：

- 战斗事件日志
- diceLog
- story check result
- debug trace

SSE 全面改造放到 P1-2。

---

# 11. 存档要求

本阶段完成后，以下内容应可追溯：

```text
storyCheck.initialRollId
storyCheck.rerollRollId
storyCheck.finalRollId
battle.diceLog[].rollId
battle.diceLog[].source
battle.diceLog[].formula
battle.diceLog[].rolls
battle.diceLog[].total
```

读档后：

- 战前剧情检定结果不丢。
- 重投结果不丢。
- finalRoll 引用仍有效。
- 战斗 diceLog 仍可追溯。
- UI 不重新投骰。
- AI 续写不重新判定。

---

# 12. 测试要求

## 12.1 必须保留现有测试

当前基线：

```text
前端：20/20 通过
后端：25/25 通过
TypeScript + Vite 生产构建通过
Python 全量编译检查通过
```

改造后必须仍然通过。

---

## 12.2 新增测试建议

### 剧情检定 DiceEvent

```text
[ ] story_check 会生成 DiceEvent
[ ] DiceEvent 有 rollId
[ ] DiceEvent 有 source = story_check
[ ] DiceEvent.rolls 保存原始骰面
[ ] DiceEvent.total 保存加修正后的总值
[ ] initialRoll 引用 rollId
```

### 虚构骰子重投

```text
[ ] fiction_dice 会生成 reroll DiceEvent
[ ] reroll DiceEvent 有 previousRollId
[ ] finalRoll 引用较大的 rollId
[ ] 每次判定最多只能使用一个重投道具
```

### 万能骰子

```text
[ ] omni_dice 会生成 reroll DiceEvent
[ ] metadata.forced = true
[ ] rolls[0] 等于玩家指定点数
[ ] finalRoll 引用万能骰子的 rollId
```

### 战斗骰子

```text
[ ] attack DiceEvent 有 rollId
[ ] damage DiceEvent 有 rollId
[ ] initiative DiceEvent 有 rollId
[ ] damage DiceEvent.rolls[0] 用于 finalFace
[ ] damage DiceEvent.total 不被用于 finalFace
[ ] 战斗 diceLog 可持久化
[ ] 读档后 diceLog 不丢
```

---

# 13. 输出要求

请 Codex 先输出设计和改造计划，不要直接大改。

输出格式：

```md
# P1-1A DiceEvent / EventEnvelope 改造计划

## 1. 当前 DiceEvent / diceEvents 实际结构
- ...

## 2. 战前检定当前骰子结构
- ...

## 3. 重投当前骰子结构
- ...

## 4. 后端战斗骰子当前结构
- ...

## 5. 需要新增的类型文件
- ...

## 6. 兼容旧结构的 mapper 方案
- ...

## 7. 第一轮最小改造步骤
- ...

## 8. 风险点
- ...

## 9. 完成后的测试清单
- ...
```

---

# 14. 本阶段完成标准

P1-1A 完成后，应满足：

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

# 15. P1-1A 之后的下一步

P1-1A 完成后，进入：

```text
P1-1B：迁移剩余随机入口
```

P1-1B 覆盖：

```text
黑市抽奖 / 奥兰盲盒
布洛克喝酒小游戏
酒馆骰子扑克
测试页面骰子
后端 rules_dnd.py 独立随机逻辑
旧 fallback 战斗逻辑标记和清理
```

之后再进入：

```text
P1-2：统一 AI / SSE / StatePatch schema
P1-3：建立 ItemCatalog / ItemInstance / ItemEffect
P1-4：建立 SceneSummary / ContextBudgetPolicy
P1-5：拆分 App.tsx / BattleTestScreen.tsx
```

---

# 16. 最推荐的执行顺序

```text
1. P1-1A：DiceEvent / EventEnvelope 最小闭环
2. P1-1B：迁移剩余随机入口
3. P1-2：AI / SSE / StatePatch schema
4. P1-3：ItemCatalog
5. P1-4：SceneSummary / ContextBudgetPolicy
6. P1-5：拆大组件
```

---

# END
