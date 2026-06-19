# AI跑团项目重构流程清单（按优先级排序版）

> 适用项目：AI跑团《地心之门》  
> 目标：在原版已上传 GitHub 的前提下，按优先级逐步重构代码，避免一次性大改导致项目不可运行。  
> 核心方向：从“页面驱动的 AI 跑团 Demo”升级为“规则引擎驱动的 AI RPG”。  
> 执行原则：每个阶段都必须可运行、可测试、可回滚。

---

# 0. 总体优先级结论

当前重构优先级如下：

```text
P0：必须优先解决，会直接影响项目稳定性和后续扩展
P1：重要优化，P0完成后尽快推进
P2：体验、调试和长期工程化增强
```

## 总排序

| 优先级 | 任务 | 目标 |
|---|---|---|
| P0-1 | 接通后端权威战斗引擎 | 消除前后端双战斗规则 |
| P0-2 | 建立统一 GameAction / ActionResult / StatePatch | 统一所有玩家行为入口 |
| P0-3 | 建立 Canonical GameState 草案与迁移层 | 解决状态字段混乱和旧字段别名问题 |
| P0-4 | 收紧 AI 权限 | 让 AI 只负责叙事，不直接改规则状态 |
| P0-5 | 战斗状态入档 | 支持战斗中刷新、读档和服务重启恢复 |
| P1-1 | 统一骰子入口 | 清除业务代码中的散落随机数 |
| P1-2 | 重构物品系统 | 建立 ItemCatalog / ItemInstance / ItemEffect |
| P1-3 | 拆分大组件 | 降低 App.tsx / BattleTestScreen.tsx 维护风险 |
| P1-4 | 统一 AI 输出校验 | 对 AI 输出、状态补丁和 SSE 事件做 schema 校验 |
| P2-1 | DebugTrace 调试系统 | 每次 Action 可追踪、可复盘 |
| P2-2 | Replay 回放系统 | 基于 Action / Event / Seed 重放流程 |
| P2-3 | NPCProfile 统一 | 合并散落的 NPC 人格、信任、立绘与剧情数据 |
| P2-4 | 删除旧逻辑 | 新链路稳定后清理 fallback 和重复代码 |

---

# 1. 重构总原则

## 1.1 不要一次性全量重写

禁止让 Codex 一次性重构整个项目。

尤其不要直接全量重写：

```text
frontend/src/App.tsx
frontend/src/components/BattleTestScreen.tsx
剧情数据文件
存档系统
AI prompt 系统
```

正确方式：

```text
新增核心模块
→ 接入一个最小闭环
→ 测试通过
→ 再迁移下一个系统
→ 最后删除旧逻辑
```

---

## 1.2 每个阶段必须可运行

每个阶段结束后必须满足：

- 前端能启动
- 后端能启动
- 页面不白屏
- 主剧情能继续进入
- 存档不崩
- 核心玩法至少一个闭环可跑通
- Git 提交一次
- 出问题可以回滚

---

## 1.3 分支与回滚策略

建议执行：

```bash
git checkout main
git pull
git tag before-refactor
git push origin before-refactor

git checkout -b refactor/game-engine-core
```

每完成一个阶段就提交：

```bash
git add .
git commit -m "refactor: complete stage P0-1 battle engine integration"
```

阶段稳定后打 tag：

```bash
git tag refactor-p0-1-battle-engine
git push origin refactor-p0-1-battle-engine
```

---

# 2. P0-1：接通后端权威战斗引擎

## 2.1 为什么最优先

当前最大架构风险是：

```text
前端 BattleTestScreen 有一套战斗结算
后端 BattleEngine 也有一套战斗结算
```

如果继续保留两套规则，后续新增技能、敌人、状态、装备时，很容易出现：

- 前端命中规则和后端不一致
- 前端伤害和后端不一致
- HP、状态、回合推进不同步
- 战斗 bug 难以定位
- AI 续写读取到错误战斗状态

所以第一优先级不是拆 UI，而是让战斗规则只有一个权威来源：**后端 BattleEngine**。

---

## 2.2 第一阶段目标闭环

只完成这个闭环：

```text
进入教学战斗
→ 创建后端 battle
→ 前端获取后端 battleState
→ 前端展示双方单位
→ 玩家点击技能
→ 前端发送 battleId / actorId / skillId / targetIds
→ 后端 BattleEngine 结算
→ 后端返回 BattleEvent[] / DiceEvent[] / UpdatedBattleState
→ 前端只展示事件结果
→ 敌人死亡后返回 victory = true
→ 前端写入剧情 flag
→ 跳转战后剧情
```

---

## 2.3 本阶段不做什么

第一阶段不要做：

```text
不要重构全部 GameState
不要重写剧情系统
不要重写背包系统
不要重写商店系统
不要重写 AI prompt
不要拆 App.tsx
不要删除旧战斗逻辑
```

旧战斗逻辑先保留为 fallback，新链路稳定后再删除。

---

## 2.4 建议新增文件

```text
frontend/src/core/battle/BattleAdapter.ts
frontend/src/core/battle/BattleTypes.ts
frontend/src/core/events/GameEvent.ts
frontend/src/core/actions/GameAction.ts
frontend/src/core/actions/ActionResult.ts
frontend/src/core/state/StatePatch.ts
```

---

## 2.5 建议修改文件

```text
frontend/src/components/BattleTestScreen.tsx
frontend/src/services/api.ts
backend/api/routes_battles.py
backend/engine/battle_engine.py
```

---

## 2.6 BattleAction 类型

```ts
export interface BattleSkillUseAction {
  type: 'battle.skill.use';
  battleId: string;
  actorId: string;
  skillId: string;
  targetIds: string[];
}
```

---

## 2.7 ActionResult 类型

```ts
export interface ActionResult {
  ok: boolean;
  events: GameEvent[];
  patch?: StatePatch;
  error?: string;
}
```

---

## 2.8 后端返回结构

后端战斗接口建议返回：

```ts
export interface BattleActionResponse {
  battleId: string;
  encounterId: string;
  battleState: BattleState;
  events: BattleEvent[];
  diceEvents: DiceEvent[];
  currentActorId: string | null;
  nextActorId: string | null;
  round: number;
  victory: boolean;
  defeat: boolean;
}
```

---

## 2.9 BattleAdapter 示例

```ts
export async function submitBattleSkillUse(
  action: BattleSkillUseAction
): Promise<ActionResult> {
  const response = await api.resolveBattleAction({
    battleId: action.battleId,
    actorId: action.actorId,
    skillId: action.skillId,
    targetIds: action.targetIds,
  });

  return {
    ok: true,
    events: response.events.map(mapBattleEventToGameEvent),
    patch: {
      battle: response.battleState,
      flags: response.victory
        ? {
            [`battle_${response.encounterId}_result`]: 'win',
            [`completed_${response.encounterId}`]: true,
          }
        : undefined,
    },
  };
}
```

---

## 2.10 前端改造要求

把 UI 中的本地结算逻辑：

```ts
rollD20();
calculateHit();
calculateDamage();
setEnemyHp();
advanceTurn();
```

改成：

```ts
await submitBattleSkillUse({
  type: 'battle.skill.use',
  battleId,
  actorId,
  skillId,
  targetIds,
});
```

前端只负责展示：

- 当前行动者
- 双方单位
- HP 条
- 技能按钮
- 骰子结果
- 命中/未命中
- 伤害数字
- 状态变化
- 战斗日志
- 胜利/失败结果

---

## 2.11 P0-1 完成标准

- [ ] 前端战斗不再直接计算命中
- [ ] 前端战斗不再直接计算伤害
- [ ] 前端战斗不再直接修改敌人 HP
- [ ] 前端战斗不再直接推进回合
- [ ] 后端 BattleEngine 负责所有战斗结算
- [ ] 前端能显示后端返回的 BattleEvent
- [ ] 前端能显示后端返回的 DiceEvent
- [ ] 教学战斗能完整胜利
- [ ] 胜利后能进入战后剧情
- [ ] 旧战斗逻辑仍保留为 fallback

---

# 3. P0-2：建立统一 GameAction / ActionResult / StatePatch

## 3.1 目标

所有玩家行为都先转成 `GameAction`，再进入 Resolver，最后产出 `ActionResult` 和 `StatePatch`。

目标链路：

```text
UI
→ GameAction
→ ActionResolver
→ ActionResult
→ StatePatch
→ GameState
```

---

## 3.2 建议新增目录

```text
frontend/src/core/actions/
  GameAction.ts
  ActionResult.ts
  ActionResolver.ts
  dispatchGameAction.ts
  resolvers/
    battleResolver.ts
    storyCheckResolver.ts
    itemResolver.ts
    shopResolver.ts
    dialogueResolver.ts
    moveResolver.ts
```

---

## 3.3 GameAction 联合类型

```ts
export type GameAction =
  | DialogueAction
  | StoryCheckStartAction
  | StoryCheckRerollAction
  | StoryCheckConfirmAction
  | BattleSkillUseAction
  | ItemUseAction
  | ShopBuyAction
  | ShopSellAction
  | MoveSceneAction;
```

---

## 3.4 基础 Action

```ts
export interface BaseAction {
  id: string;
  actorId: string;
  createdAt: string;
}
```

---

## 3.5 剧情对话 Action

```ts
export interface DialogueAction extends BaseAction {
  type: 'dialogue.submit';
  text: string;
}
```

---

## 3.6 剧情检定 Action

```ts
export interface StoryCheckStartAction extends BaseAction {
  type: 'story.check.start';
  checkId: string;
  attribute: string;
  dc: number;
  playerInput: string;
}

export interface StoryCheckRerollAction extends BaseAction {
  type: 'story.check.reroll';
  checkId: string;
  rerollType: 'fiction_dice' | 'omni_dice';
  forcedRoll?: number;
}

export interface StoryCheckConfirmAction extends BaseAction {
  type: 'story.check.confirm';
  checkId: string;
}
```

---

## 3.7 战斗 Action

```ts
export interface BattleSkillUseAction extends BaseAction {
  type: 'battle.skill.use';
  battleId: string;
  skillId: string;
  targetIds: string[];
}
```

---

## 3.8 背包 Action

```ts
export interface ItemUseAction extends BaseAction {
  type: 'item.use';
  itemInstanceId: string;
  targetId?: string;
}
```

---

## 3.9 商店 Action

```ts
export interface ShopBuyAction extends BaseAction {
  type: 'shop.buy';
  shopId: string;
  itemId: string;
  quantity: number;
}

export interface ShopSellAction extends BaseAction {
  type: 'shop.sell';
  shopId: string;
  itemInstanceId: string;
  quantity: number;
}
```

---

## 3.10 场景移动 Action

```ts
export interface MoveSceneAction extends BaseAction {
  type: 'story.move';
  targetSceneId: string;
}
```

---

## 3.11 ActionResolver 接口

```ts
export interface ActionResolver<T extends GameAction = GameAction> {
  type: T['type'];
  resolve(action: T, state: GameState): Promise<ActionResult>;
}
```

---

## 3.12 dispatchGameAction

```ts
export async function dispatchGameAction(
  action: GameAction,
  state: GameState
): Promise<{
  nextState: GameState;
  result: ActionResult;
}> {
  const resolver = resolvers[action.type];

  if (!resolver) {
    return {
      nextState: state,
      result: {
        ok: false,
        events: [],
        error: `No resolver registered for action type: ${action.type}`,
      },
    };
  }

  const result = await resolver.resolve(action, state);

  if (!result.ok || !result.patch) {
    return { nextState: state, result };
  }

  return {
    nextState: applyStatePatch(state, result.patch),
    result,
  };
}
```

---

## 3.13 迁移顺序

不要一次性迁移所有行为，按这个顺序：

```text
1. battle.skill.use
2. story.check.start
3. story.check.reroll
4. story.check.confirm
5. item.use
6. shop.buy
7. shop.sell
8. dialogue.submit
9. story.move
```

---

## 3.14 P0-2 完成标准

- [ ] 新增 GameAction 联合类型
- [ ] 新增 ActionResult 类型
- [ ] 新增 StatePatch 类型
- [ ] 新增 ActionResolver 接口
- [ ] 新增 dispatchGameAction
- [ ] battle.skill.use 已走统一 action 管线
- [ ] story.check 逐步接入统一 action 管线
- [ ] UI 不再直接调用规则逻辑，而是 dispatch action

---

# 4. P0-3：建立 Canonical GameState 草案与迁移层

## 4.1 目标

解决当前状态问题：

```text
GameState 字段开放
[key: string]: any 过多
信任字段存在多个别名
current_area / currentArea / sceneState.currentScene 并存
inventory 有字符串和对象两种表达
battle 没有统一纳入主状态
```

---

## 4.2 建议新增目录

```text
frontend/src/core/state/
  GameState.ts
  StatePatch.ts
  applyStatePatch.ts
  GameStateMigration.ts
  selectors.ts
```

---

## 4.3 Canonical GameState

```ts
export interface GameState {
  version: number;
  session: SessionState;
  story: StoryState;
  player: PlayerState;
  party: PartyState;
  inventory: InventoryState;
  battle: BattleState | null;
  quests: QuestState;
  flags: Record<string, FlagValue>;
  logs: GameEvent[];
}

export type FlagValue = boolean | number | string | null;
```

---

## 4.4 子状态设计

```ts
export interface SessionState {
  sessionId: string;
  createdAt: string;
  updatedAt: string;
  schemaVersion: number;
}

export interface StoryState {
  currentSceneId: string;
  currentArea: string;
  phase: 'story' | 'pre_battle' | 'battle' | 'resolution' | 'shop' | 'dialogue';
  lastEvent?: string;
  recentSceneSummary?: string;
}

export interface PlayerState {
  id: 'player';
  name: string;
  flowId: string;
  level: number;
  hp: number;
  maxHp: number;
  ac: number;
  attributes: {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
  };
  gold: number;
  statusEffects: StatusEffect[];
}

export interface PartyState {
  members: PartyMember[];
  recruitedIds: string[];
  trust: Record<string, number>;
}

export interface InventoryState {
  items: ItemInstance[];
}

export interface ItemInstance {
  instanceId: string;
  itemId: string;
  quantity: number;
}

export interface QuestState {
  activeQuestIds: string[];
  completedQuestIds: string[];
  questData: Record<string, unknown>;
}
```

---

## 4.5 迁移函数

不要直接删旧字段，先写迁移器：

```ts
export function migrateLegacyGameState(oldState: any): GameState {
  return {
    version: 2,
    session: migrateSession(oldState),
    story: migrateStory(oldState),
    player: migratePlayer(oldState),
    party: migrateParty(oldState),
    inventory: migrateInventory(oldState),
    battle: migrateBattle(oldState),
    quests: migrateQuests(oldState),
    flags: migrateFlags(oldState),
    logs: migrateLogs(oldState),
  };
}
```

---

## 4.6 优先统一字段

优先处理：

```text
se_trust / al_trust / sl_trust / kl_trust / trust_sl
current_area / currentArea / sceneState.currentScene
inventory 字符串 / inventory.items
battle result flags
recruited flags
gold / player.gold
hp / player.hp
```

---

## 4.7 P0-3 完成标准

- [ ] 新 GameState 类型存在
- [ ] 新 StatePatch 类型存在
- [ ] 新 applyStatePatch 存在
- [ ] 新 GameStateMigration 存在
- [ ] 旧存档能迁移到新结构
- [ ] 新代码不再新增顶层随意字段
- [ ] 信任字段统一到 party.trust
- [ ] 背包字段统一到 inventory.items
- [ ] 剧情位置统一到 story.currentSceneId / story.currentArea
- [ ] 战斗状态统一到 battle

---

# 5. P0-4：收紧 AI 权限

## 5.1 目标

AI 负责叙事，不负责规则结算。

AI 可以写：

```text
剧情描述
战斗结果描写
骰子结果解释
玩家提示
候选状态变化
```

AI 不应该直接决定：

```text
骰子点数
命中/未命中
伤害数值
优势/劣势
金币变化
HP变化
物品发放
信任变化
剧情 flag
```

---

## 5.2 AI 输出结构

```ts
export interface AiNarrationOutput {
  narration: string;
  hints?: string[];
  candidatePatch?: CandidateStatePatch;
}
```

---

## 5.3 CandidateStatePatch 不可直接应用

必须经过：

```ts
validateCandidatePatch(candidatePatch, state, actionContext)
```

转换为安全的：

```ts
StatePatch
```

之后才能应用。

---

## 5.4 validateCandidatePatch 规则

```ts
export function validateCandidatePatch(
  patch: CandidateStatePatch,
  state: GameState,
  context: ActionContext
): StatePatch {
  // 1. 检查当前 action 是否允许修改该字段
  // 2. 检查数值上下限
  // 3. 检查物品是否存在于 ItemCatalog
  // 4. 检查奖励是否重复领取
  // 5. 检查场景切换是否合法
  // 6. 检查信任值变化是否在允许范围
  // 7. 检查 HP / 金币不能越界
  return safePatch;
}
```

---

## 5.5 P0-4 完成标准

- [ ] AI 不再决定优势/劣势
- [ ] AI 不再直接修改金币
- [ ] AI 不再直接发放任意物品
- [ ] AI 不再直接扣 HP
- [ ] AI 不再直接改变信任值
- [ ] AI 输出 candidatePatch
- [ ] candidatePatch 经过规则层验证后才应用
- [ ] 所有 AI 状态变化都有日志

---

# 6. P0-5：战斗状态入档

## 6.1 目标

解决战斗状态只存在内存的问题。

重构后，以下内容必须能存档：

```text
battleState
battleActionLog
battleEventLog
diceLog
rngSeed
currentActorId
round
initiativeOrder
actor HP / status
```

---

## 6.2 后端建议新增文件

```text
backend/core/battle/battle_persistence.py
```

---

## 6.3 战斗存档结构

```ts
export interface PersistedBattleState {
  battleId: string;
  encounterId: string;
  status: 'active' | 'victory' | 'defeat';
  round: number;
  currentActorId: string | null;
  initiativeOrder: string[];
  actors: BattleActor[];
  actionLog: BattleActionLogEntry[];
  eventLog: BattleEvent[];
  diceLog: DiceEvent[];
  rngSeed: string;
  updatedAt: string;
}
```

---

## 6.4 P0-5 完成标准

- [ ] 战斗中刷新页面不丢状态
- [ ] 后端服务重启后能恢复战斗
- [ ] 战斗状态进入普通存档
- [ ] 读档后能恢复当前回合
- [ ] 读档后能恢复行动顺序
- [ ] 读档后能恢复 HP 和状态
- [ ] diceLog 被保存
- [ ] actionLog 被保存
- [ ] eventLog 被保存

---

# 7. P1-1：统一骰子入口

## 7.1 目标

清除业务代码中的散落随机数。

所有骰子必须来自统一入口：

```text
后端 DiceService
或统一 DiceClient
```

---

## 7.2 要清理的写法

```ts
Math.random()
Math.floor(Math.random() * 20) + 1
localRollD20()
```

---

## 7.3 统一 DiceEvent

```ts
export interface DiceEvent {
  id: string;
  type: 'd20' | 'damage' | 'check' | 'initiative';
  formula: string;
  rolls: number[];
  modifier: number;
  total: number;
  source: string;
  seedIndex?: number;
  createdAt: string;
}
```

---

## 7.4 P1-1 完成标准

- [ ] 战斗骰子来自统一入口
- [ ] 剧情检定骰子来自统一入口
- [ ] 重投骰子来自统一入口
- [ ] 先攻骰子来自统一入口
- [ ] 所有骰子都有 DiceEvent
- [ ] 业务代码中不再直接 Math.random()

---

# 8. P1-2：物品系统重构

## 8.1 目标

把背包从“字符串/名称判断”升级为：

```text
ItemCatalog
ItemInstance
ItemEffect
```

---

## 8.2 建议新增目录

```text
frontend/src/core/items/
  ItemCatalog.ts
  ItemTypes.ts
  ItemEffect.ts
  itemResolver.ts
```

---

## 8.3 ItemDefinition

```ts
export interface ItemDefinition {
  id: string;
  name: string;
  type: 'consumable' | 'equipment' | 'quest' | 'document' | 'clue' | 'material';
  description: string;
  icon?: string;
  stackable: boolean;
  effects?: ItemEffect[];
}
```

---

## 8.4 ItemEffect

```ts
export type ItemEffect =
  | HealEffect
  | AddBuffEffect
  | RerollEffect
  | RevealClueEffect
  | UnlockSceneEffect;

export interface HealEffect {
  type: 'heal';
  amount: number;
}

export interface RerollEffect {
  type: 'reroll';
  rerollType: 'fiction_dice' | 'omni_dice';
}
```

---

## 8.5 P1-2 完成标准

- [ ] 所有常用道具有 itemId
- [ ] 背包保存 ItemInstance
- [ ] 道具效果来自 ItemEffect
- [ ] AI 不能添加未登记物品
- [ ] 虚构骰子、万能骰子走 ItemEffect
- [ ] 治疗药水走 ItemEffect
- [ ] 线索道具走 clue/document 类型

---

# 9. P1-3：拆分大组件

## 9.1 目标

降低 `App.tsx` 和 `BattleTestScreen.tsx` 的维护风险。

拆分原则：

```text
Controller 负责 dispatch action
Component 只负责展示
core 负责规则
api 负责请求
data 负责静态配置
```

---

## 9.2 App.tsx 拆分目标

```text
frontend/src/features/story/
  StoryScreen.tsx
  StoryController.ts
  StoryActionPanel.tsx
  DialogueInput.tsx

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
  ShopController.tsx
```

---

## 9.3 BattleTestScreen.tsx 拆分目标

```text
frontend/src/features/battle/
  BattleScreen.tsx
  BattleController.ts
  BattleField.tsx
  BattleActorSprite.tsx
  BattleActionBar.tsx
  BattleLogPanel.tsx
  BattleDiceOverlay.tsx
  BattleResultPanel.tsx
```

---

## 9.4 P1-3 完成标准

- [ ] `App.tsx` 不再超过 1000 行
- [ ] `BattleTestScreen.tsx` 不再承担规则结算
- [ ] 战斗 UI 组件只接收 props
- [ ] 剧情 UI 组件只接收 props
- [ ] 状态修改集中到 controller / resolver

---

# 10. P1-4：统一 AI 输出校验

## 10.1 目标

对 AI 输出、状态补丁、SSE 事件做统一结构校验。

建议使用：

```text
zod
或 JSON Schema / ajv
```

---

## 10.2 需要校验的对象

```text
AiNarrationOutput
CandidateStatePatch
StatePatch
GameAction
ActionResult
BattleActionResponse
SSE event
```

---

## 10.3 P1-4 完成标准

- [ ] AI 输出有 schema
- [ ] CandidateStatePatch 有 schema
- [ ] StatePatch 有 schema
- [ ] GameAction 有 schema
- [ ] ActionResult 有 schema
- [ ] 非法输出有 fallback
- [ ] 非法 patch 不会污染 GameState

---

# 11. P2-1：DebugTrace 调试系统

## 11.1 目标

以后出 bug 能看到完整链路：

```text
玩家做了什么
系统投了什么骰
AI 原文是什么
解析出了什么
状态改了哪里
哪里报错
```

---

## 11.2 DebugTrace

```ts
export interface DebugTrace {
  id: string;
  timestamp: string;
  action: GameAction;
  prevStateHash: string;
  result: ActionResult;
  patch?: StatePatch;
  nextStateHash: string;
  aiRawOutput?: string;
  diceEvents?: DiceEvent[];
  errors?: string[];
}
```

---

## 11.3 建议新增目录

```text
frontend/src/features/debug/
  DebugPanel.tsx
  DebugTraceViewer.tsx
  StateDiffViewer.tsx
```

---

## 11.4 P2-1 完成标准

- [ ] 每次 Action 都有 trace
- [ ] 每次骰子都有 diceEvent
- [ ] 每次 AI 输出都有 rawOutput
- [ ] 每次状态修改都有 before/after diff
- [ ] 可以导出调试包

---

# 12. P2-2：Replay 回放系统

## 12.1 目标

基于以下内容重放流程：

```text
initialGameState
GameAction[]
DiceEvent[]
StatePatch[]
GameEvent[]
rngSeed
```

---

## 12.2 Replay 完成标准

- [ ] 可以从初始状态重放一场战斗
- [ ] 可以从初始状态重放一段剧情检定
- [ ] 同 seed 得到同结果
- [ ] replay 与原流程状态一致
- [ ] replay 失败时能指出第几个 action 不一致

---

# 13. P2-3：NPCProfile 统一

## 13.1 目标

把 NPC 的这些数据合并：

```text
角色 id
显示名
别名
立绘
头像
说话风格
目标
秘密
信任值 key
已知事实
支线状态
```

---

## 13.2 NPCProfile

```ts
export interface NPCProfile {
  id: string;
  name: string;
  aliases: string[];
  portrait?: string;
  avatar?: string;
  role: string;
  speechStyle: string;
  goals: string[];
  secrets?: string[];
  trustKey?: string;
  knownFacts?: string[];
  questIds?: string[];
}
```

---

## 13.3 P2-3 完成标准

- [ ] 每个 NPC 有唯一 id
- [ ] 不再出现重复角色 id
- [ ] 信任值 key 统一
- [ ] prompt 从 NPCProfile 读取角色资料
- [ ] UI 从 NPCProfile 读取立绘和头像

---

# 14. P2-4：删除旧逻辑

## 14.1 删除前提

只有在新链路稳定后才删除旧逻辑。

删除前必须确认：

- 新逻辑已经覆盖
- 冒烟测试通过
- Git 有可回滚提交
- 没有剧情节点依赖旧字段
- 没有存档依赖旧字段，或已有迁移器

---

## 14.2 可删除内容

```text
前端本地战斗命中计算
前端本地伤害计算
前端本地敌人 HP 修改
重复骰子工具函数
重复信任字段别名
废弃状态字段
未使用旧 API
旧 fallback 战斗逻辑
```

---

# 15. 推荐提交节奏

```text
commit 1: docs: add prioritized refactor checklist and smoke test
commit 2: refactor: add core action/result/state patch types
commit 3: refactor: add battle adapter
commit 4: refactor: connect battle skill use to backend engine
commit 5: refactor: map backend battle events to frontend display
commit 6: refactor: handle battle victory and story flags
commit 7: refactor: add canonical GameState draft
commit 8: refactor: add legacy state migration
commit 9: refactor: migrate story check actions
commit 10: refactor: migrate item and shop actions
commit 11: refactor: restrict AI state patch
commit 12: refactor: persist battle state
commit 13: refactor: unify dice events
commit 14: refactor: split battle UI components
commit 15: refactor: split story UI components
commit 16: refactor: remove old battle fallback
```

---

# 16. 第一轮 Codex 任务建议

第一轮只让 Codex 做 P0-1。

可以直接发：

```md
# 任务：P0-1 接通后端权威战斗引擎

目标：不要全量重构项目。只完成第一阶段最小闭环：让前端战斗页面不再自行计算命中、伤害、HP、回合推进，而是提交战斗 Action 给后端 BattleEngine，由后端返回 BattleEvent、DiceEvent 与最新 BattleState，前端只负责展示。

## 必须遵守

1. 不要重写整个项目。
2. 不要删除现有剧情流程。
3. 不要改动无关素材、角色、剧情数据。
4. 不要破坏现有存档。
5. 每一步修改都必须能运行。
6. 保留旧战斗逻辑作为 fallback，直到新战斗链路跑通。

## 目标闭环

进入教学战斗
→ 创建/读取后端 battle
→ 前端展示后端 BattleState
→ 玩家点击技能
→ 前端发送 `{ battleId, actorId, skillId, targetIds }`
→ 后端 BattleEngine 结算
→ 返回 `BattleEvent[]`、`DiceEvent[]` 与 `UpdatedBattleState`
→ 前端根据事件展示日志、骰子、伤害、状态变化
→ 胜利后写入剧情 flag
→ 跳转战后剧情

## 建议新增文件

frontend/src/core/battle/BattleAdapter.ts
frontend/src/core/battle/BattleTypes.ts
frontend/src/core/events/GameEvent.ts
frontend/src/core/actions/GameAction.ts
frontend/src/core/actions/ActionResult.ts
frontend/src/core/state/StatePatch.ts

## 建议修改文件

frontend/src/components/BattleTestScreen.tsx
frontend/src/services/api.ts
backend/api/routes_battles.py
backend/engine/battle_engine.py

## 输出要求

请先不要直接大改。先输出：

1. 当前相关文件定位
2. 需要修改的函数列表
3. 新增类型定义
4. API 数据流
5. 具体改造步骤
6. 可能破坏的功能
7. 回滚方案
8. 第一阶段完成后的测试清单
```

---

# 17. 最终目标架构

```text
UI Layer
  ↓
GameAction
  ↓
ActionResolver
  ↓
Rule Engine / BattleEngine / ItemResolver / ShopResolver
  ↓
ActionResult
  ↓
StatePatch
  ↓
GameState
  ↓
AI Narration Layer
```

---

# 18. 重构完成后的理想状态

完成后项目应满足：

- 战斗只有一套权威规则
- 骰子只有一个权威来源
- 玩家行为统一走 GameAction
- 状态修改统一走 StatePatch
- AI 只负责叙事，不直接改核心规则
- 背包物品有统一 ItemCatalog
- 存档能恢复完整 GameState
- DebugTrace 能追踪每次 Action
- 后续新增敌人、技能、道具、剧情节点不需要到处改代码

---

# 19. 最推荐的执行顺序

最终建议按这个顺序执行：

```text
1. P0-1 接通后端权威战斗引擎
2. P0-2 建立 GameAction / ActionResult / StatePatch
3. P0-3 建立 Canonical GameState 和迁移层
4. P0-4 收紧 AI 权限
5. P0-5 战斗状态入档
6. P1-1 统一骰子入口
7. P1-2 重构物品系统
8. P1-3 拆分大组件
9. P1-4 统一 AI 输出校验
10. P2-1 DebugTrace
11. P2-2 Replay
12. P2-3 NPCProfile
13. P2-4 删除旧逻辑
```

---

# END
