# AI跑团项目 Codex 自动对照审计清单（代码级 Diff 评估版）

> 用途：让 Codex 直接对照代码库逐项检查，而不是泛泛评价项目好不好。  
> 目标：输出一份可执行的工程审计报告，判断当前 AI 跑团项目中哪些能力已经实现、哪些部分实现、哪些完全缺失、哪些存在架构风险。

---

## 0. 使用方式

将本文件与项目代码一起交给 Codex，并使用如下指令：

```text
请逐文件扫描当前代码库，对照《AI跑团项目 Codex 自动对照审计清单》逐项检查。
要求：
1. 每一项必须标注：✔ 已实现 / ⚠ 部分实现 / ✖ 未实现。
2. 每一项必须引用对应文件路径。
3. 能引用关键函数、类型、变量名时必须引用。
4. 不允许只做主观评价，必须基于代码事实判断。
5. 最后按指定格式输出《AI跑团系统架构审计报告》。
```

---

## 1. 项目总体审计目标

一个成熟的 AI 跑团游戏，本质上不是简单的“AI讲故事”，而是一个：

```text
LLM Narrative Layer + Deterministic Rule Engine + Persistent GameState
```

也就是说，系统必须同时具备：

1. **稳定的游戏状态管理**：角色、场景、背包、战斗、任务、旗标都可追踪。
2. **确定性的规则执行层**：骰子、命中、伤害、状态变化不能由 AI 随意决定。
3. **受控的 AI 叙事层**：AI 负责叙事、解释、氛围和 NPC 对话，而不是直接修改核心状态。
4. **可调试、可保存、可恢复、可扩展**：项目后续能继续堆剧情、战斗、道具和角色，而不导致系统失控。

Codex 需要重点判断：

```text
当前项目更接近：
A. 剧情文本生成器
B. 半结构化 AI 跑团 Demo
C. 具备规则引擎雏形的 AI RPG 系统
D. 工程化 LLM RPG Engine
```

---

## 2. GameState 代码结构审计

GameState 是 AI 跑团系统的核心。所有剧情、战斗、背包、任务和 AI 上下文都应围绕统一 GameState 运转。

### 2.1 是否存在统一状态定义文件

重点检查可能路径：

```text
/src/state/GameState.ts
/src/store/gameStore.ts
/src/core/state/*.ts
/src/types/game.ts
/src/types/state.ts
/src/data/gameState.ts
```

### 检查项

```text
[ ] 是否存在唯一、统一的 GameState 类型或接口定义
[ ] 是否所有模块引用同一份 GameState 类型
[ ] 是否存在多个重复、冲突或临时拼接的状态定义
[ ] 是否存在 any 类型绕过 GameState 约束
[ ] 是否状态字段命名一致，例如 sceneId / currentScene / scene_id 是否混用
```

### 理想结构参考

```ts
export type GamePhase =
  | 'story'
  | 'pre_battle'
  | 'battle'
  | 'resolution'
  | 'shop'
  | 'dialogue';

export interface GameState {
  sessionId: string;
  phase: GamePhase;
  turn: number;

  scene: SceneState;
  player: PlayerState;
  party: CharacterState[];
  enemies: EnemyState[];
  battle?: BattleState;
  inventory: InventoryState;
  flags: GameFlags;
  logs: GameEvent[];
}
```

### Codex 输出要求

```text
GameState 统一性：✔/⚠/✖
证据文件：xxx
关键代码：xxx
问题说明：xxx
```

---

### 2.2 GameState 字段完整性检查

对照以下字段逐项检查：

```ts
GameState {
  sessionId
  phase
  turn
  scene
  player
  party
  enemies
  battle
  inventory
  flags
  logs
}
```

### 字段检查说明

| 字段 | 作用 | 是否必须 |
|---|---|---|
| sessionId | 当前游戏会话 ID | 推荐 |
| phase | 当前阶段：剧情、战前、战斗、结算等 | 必须 |
| turn | 当前推进轮次 | 推荐 |
| scene | 当前场景信息 | 必须 |
| player | 玩家状态 | 必须 |
| party | 队友状态 | 必须 |
| enemies | 敌人状态 | 战斗系统必须 |
| battle | 当前战斗状态 | 战斗系统必须 |
| inventory | 背包状态 | 必须 |
| flags | 剧情旗标 / 任务旗标 | 必须 |
| logs | 事件日志 / 战斗日志 | 强烈推荐 |

### Codex 输出格式

```text
sessionId → ✔/⚠/✖，文件：xxx，说明：xxx
phase → ✔/⚠/✖，文件：xxx，说明：xxx
scene → ✔/⚠/✖，文件：xxx，说明：xxx
battle → ✔/⚠/✖，文件：xxx，说明：xxx
flags → ✔/⚠/✖，文件：xxx，说明：xxx
```

---

### 2.3 State 修改方式检查

重点检查：

```text
reducer
zustand store
redux slice
React context
localStorage 写入逻辑
battle update 函数
inventory update 函数
AI response handler
```

### 判断标准

```text
✔ 所有 state mutation 都集中在 reducer / store / engine 中
⚠ 大部分集中，但 UI 或 AI handler 中仍有部分直接修改
✖ 多处直接修改对象属性，状态来源混乱
```

### 高风险写法示例

```ts
// 高风险：直接修改对象
gameState.player.hp -= damage;

// 高风险：AI 返回后直接覆盖状态
setGameState(aiResponse.gameState);
```

### 推荐写法

```ts
const nextState = applyGameEvent(gameState, event);
setGameState(nextState);
```

或者：

```ts
const patch = createDamagePatch(targetId, damage);
const nextState = applyStatePatch(gameState, patch);
```

---

## 3. Action System 玩家行为系统审计

玩家所有行为都应先被转换为结构化 Action，再交给 GameEngine 处理。

### 3.1 是否存在标准 Action 类型定义

重点检查路径：

```text
/src/types/action.ts
/src/core/action.ts
/src/core/actions/*.ts
/src/engine/actionResolver.ts
```

### 理想结构参考

```ts
export type ActionType =
  | 'attack'
  | 'skill_check'
  | 'use_item'
  | 'dialogue'
  | 'inspect'
  | 'move'
  | 'shop_buy'
  | 'shop_sell'
  | 'confirm_roll'
  | 'reroll_with_item';

export interface GameAction {
  id: string;
  type: ActionType;
  actorId: string;
  targetId?: string;
  payload?: Record<string, unknown>;
  createdAt: number;
}
```

### 检查项

```text
[ ] 是否存在统一 Action 类型
[ ] UI 是否只负责 dispatch Action
[ ] 战斗、剧情、商店、背包是否都能用 Action 表示
[ ] 是否存在按钮直接改 state 或直接调用 AI 的情况
```

---

### 3.2 Action 是否被强制使用

理想流程：

```text
UI Button Click
→ createAction()
→ dispatchAction(action)
→ GameEngine.resolve(action, state)
→ StatePatch / GameEvent
→ update GameState
→ build LLM context
→ AI narration
```

高风险流程：

```text
UI Button Click
→ setHp / setScene / callLLM / appendText
```

### Codex 输出要求

```text
Action 强制程度：✔/⚠/✖
发现的绕过 Action 的位置：
- 文件：xxx
- 函数：xxx
- 问题：xxx
```

---

### 3.3 Action Resolver 是否存在

检查是否存在类似函数：

```ts
function resolveAction(state: GameState, action: GameAction): ResolveResult
```

理想返回：

```ts
export interface ResolveResult {
  events: GameEvent[];
  patches: StatePatch[];
  checks?: CheckResult[];
  needsNarration: boolean;
}
```

判断标准：

```text
✔ 存在统一 resolver，所有 Action 经过它处理
⚠ 存在部分 resolver，但不同系统各自处理
✖ 没有 Action Resolver，逻辑散落在 UI / AI handler 中
```

---

## 4. Dice System 骰子系统审计

骰子结果必须由系统生成，AI 只能解释骰子，不能虚构骰子。

### 4.1 是否存在统一骰子引擎

重点检查路径：

```text
/src/engine/dice.ts
/src/utils/dice.ts
/src/core/dice.ts
```

理想函数：

```ts
export function rollDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1;
}

export function rollDice(count: number, sides: number): number[] {
  return Array.from({ length: count }, () => rollDie(sides));
}

export function rollD20(modifier = 0): DiceResult {
  const roll = rollDie(20);
  return {
    formula: `1d20${modifier >= 0 ? '+' : ''}${modifier}`,
    rolls: [roll],
    modifier,
    total: roll + modifier,
  };
}
```

### DiceResult 结构参考

```ts
export interface DiceResult {
  formula: string;
  rolls: number[];
  modifier: number;
  total: number;
  natural?: number;
  advantage?: boolean;
  disadvantage?: boolean;
}
```

### 检查项

```text
[ ] 是否有统一骰子函数
[ ] 是否支持 D20
[ ] 是否支持伤害骰，例如 1d6 / 1d8 / 2d6
[ ] 是否支持优势 / 劣势
[ ] 是否保留 natural roll，自然 1 / 自然 20 可判断
[ ] 是否支持固定随机种子或可回放随机日志
```

---

### 4.2 是否禁止 AI 生成骰子结果

重点检查：

```text
prompt 内容
LLM response parser
剧情判定逻辑
战斗判定逻辑
```

高风险提示词：

```text
请你为玩家投掷一次 D20 并判断结果。
```

推荐提示词：

```text
骰子结果已经由系统生成。你只能根据 CheckResult 解释结果，不允许修改、重投或虚构骰子点数。
```

判断标准：

```text
✔ 骰子全部由系统生成，AI 只解释结果
⚠ 大部分骰子由系统生成，但部分剧情仍让 AI 自行判断成功失败
✖ AI 可以直接决定骰子结果或成功失败
```

---

### 4.3 CheckResult 是否结构化

理想结构：

```ts
export type CheckType =
  | 'attack'
  | 'skill_check'
  | 'saving_throw'
  | 'death_save'
  | 'story_check';

export type OutcomeTag =
  | 'critical_success'
  | 'success'
  | 'partial_success'
  | 'failure'
  | 'critical_failure';

export interface CheckResult {
  id: string;
  type: CheckType;
  actorId: string;
  targetId?: string;
  dice: DiceResult;
  dc: number;
  success: boolean;
  outcomeTag: OutcomeTag;
  sourceActionId: string;
}
```

检查项：

```text
[ ] 是否有 CheckResult 类型
[ ] 是否记录 dc / ac
[ ] 是否记录 success
[ ] 是否记录 critical_success / critical_failure
[ ] 是否和 Action / Event 关联
```

---

## 5. 剧情判定与重投机制审计

该项目已有“剧情选择行动 → 骰子判定 → 结果确认 / 使用道具重投 → AI 续写”的设计，因此需要重点检查。

### 5.1 剧情判定流程是否完整

理想流程：

```text
玩家选择剧情行动
→ 系统生成 StoryCheck Action
→ 系统投 D20
→ 生成 CheckResult
→ UI 显示结果
→ 底部出现三个按钮：确定 / 使用虚构骰子 / 使用万能骰子
→ 玩家确认最终结果
→ AI 根据最终 CheckResult 续写剧情
```

检查项：

```text
[ ] 是否存在 story_check 类型
[ ] 是否区分“初始判定结果”和“最终采用结果”
[ ] AI 续写是否只读取最终结果
[ ] 玩家点击确定后是否锁定结果
[ ] 进入 AI 续写前是否禁止再次修改骰子
```

---

### 5.2 虚构骰子机制是否实现

规则要求：

```text
虚构骰子：
- 背包初始数量为 3
- 只能用于剧情判定后的重投
- 使用后重新投一次 D20
- 最终结果取两次判定中较大的结果
- 每次剧情判定最多只能使用一个重投道具
```

理想结构：

```ts
export interface RerollState {
  originalCheck: CheckResult;
  rerollCheck?: CheckResult;
  finalCheck: CheckResult;
  usedItemId?: 'fiction_dice' | 'omni_dice';
  rerollConsumed: boolean;
}
```

检查项：

```text
[ ] 背包是否有 fiction_dice，初始数量是否为 3
[ ] 使用后数量是否 -1
[ ] 是否重新生成一次系统骰子
[ ] 是否取两次 total 最大值
[ ] 是否记录原始结果与重投结果
[ ] 是否禁止同一次判定使用第二个重投道具
```

---

### 5.3 万能骰子机制是否实现

规则要求：

```text
万能骰子：
- 背包初始数量为 3
- 只能用于剧情判定后的重投
- 使用后玩家可以指定结果
- 最终结果由玩家决定
- AI 续写必须参考玩家指定后的最终结果
- 每次剧情判定最多只能使用一个重投道具
```

检查项：

```text
[ ] 背包是否有 omni_dice，初始数量是否为 3
[ ] 使用后数量是否 -1
[ ] 是否允许玩家指定最终点数或结果等级
[ ] 是否生成 finalCheck
[ ] AI 续写是否读取 finalCheck 而不是 originalCheck
[ ] 是否禁止同一次判定继续使用虚构骰子或万能骰子
```

---

## 6. Combat System 战斗系统审计

战斗系统必须是确定性状态机，不能让 AI 用一段文本直接决定战斗结果。

### 6.1 是否存在战斗状态机

重点检查路径：

```text
/src/combat/engine.ts
/src/combat/turnManager.ts
/src/engine/combat.ts
/src/battle/*.ts
```

理想阶段：

```text
INITIATIVE
TURN_START
ACTION_SELECT
ACTION_RESOLVE
STATE_UPDATE
TURN_END
ROUND_END
BATTLE_END
```

理想类型：

```ts
export type BattlePhase =
  | 'initiative'
  | 'turn_start'
  | 'action_select'
  | 'action_resolve'
  | 'turn_end'
  | 'round_end'
  | 'battle_end';

export interface BattleState {
  battleId: string;
  round: number;
  phase: BattlePhase;
  initiativeOrder: string[];
  currentActorId: string;
  participants: Record<string, BattleParticipant>;
  log: BattleEvent[];
}
```

### 判断标准

```text
✔ 存在明确战斗状态机，阶段清晰
⚠ 有战斗数据和回合逻辑，但阶段不完整
✖ 战斗主要依赖文本或 UI 临时状态推进
```

---

### 6.2 是否存在固定 turn loop

理想流程：

```ts
function advanceTurn(state: GameState): GameState {
  const battle = state.battle;
  const currentIndex = battle.initiativeOrder.indexOf(battle.currentActorId);
  const nextIndex = (currentIndex + 1) % battle.initiativeOrder.length;
  const nextRound = nextIndex === 0 ? battle.round + 1 : battle.round;

  return updateBattle(state, {
    currentActorId: battle.initiativeOrder[nextIndex],
    round: nextRound,
    phase: 'turn_start',
  });
}
```

检查项：

```text
[ ] 是否先投先攻
[ ] 是否保存 initiativeOrder
[ ] 是否有 currentActorId
[ ] 是否能从当前角色推进到下一个角色
[ ] 是否有 round 递增
[ ] 是否跳过死亡 / 无法行动单位
[ ] 是否检查胜利 / 失败条件
```

---

### 6.3 攻击、命中、伤害是否确定性执行

理想流程：

```text
Attack Action
→ rollD20 + attackBonus
→ compare target AC
→ if hit: roll damage dice
→ apply damage
→ armor absorbs first if armor exists
→ append BattleEvent
```

检查项：

```text
[ ] 是否有 attackBonus
[ ] 是否有 target AC
[ ] 是否有 hit / miss 判定
[ ] 是否有 damage dice
[ ] 是否有 armor 优先扣除逻辑
[ ] 是否有死亡 / 倒地判断
[ ] 是否写入 battle log
```

---

### 6.4 战斗事件日志是否结构化

理想结构：

```ts
export interface BattleEvent {
  id: string;
  round: number;
  actorId: string;
  targetId?: string;
  action: GameAction;
  check?: CheckResult;
  damage?: DamageResult;
  effects?: AppliedEffect[];
  timestamp: number;
}
```

检查项：

```text
[ ] 是否记录 actor
[ ] 是否记录 action
[ ] 是否记录 check result
[ ] 是否记录 damage
[ ] 是否记录状态效果
[ ] 是否能用于 UI 展示和 replay
```

---

## 7. LLM 调用层审计

LLM 应负责叙事，不应直接决定规则结果。

### 7.1 是否存在 prompt 分层

重点检查路径：

```text
/src/llm/prompt.ts
/src/llm/prompts/*.ts
/src/ai/*.ts
/src/services/llm*.ts
```

理想分层：

```text
Narrator Prompt：负责剧情续写、氛围、角色台词
Judge Prompt：负责解释已经确定的规则结果
StatePatch Prompt：只提出状态变更建议，不直接覆盖 GameState
```

检查项：

```text
[ ] 是否把系统规则写入 prompt
[ ] 是否告诉 AI 不允许虚构骰子
[ ] 是否告诉 AI 不允许直接改角色数值
[ ] 是否区分剧情模式和战斗模式 prompt
[ ] 是否限制 AI 输出格式
```

---

### 7.2 是否存在 AI 输出 parser

理想结构：

```ts
export interface AIOutput {
  narration: string;
  interpretation?: string;
  suggestedActions?: GameActionOption[];
  suggestedStatePatch?: StatePatch;
}
```

推荐使用：

```text
zod / ajv / JSON Schema
```

检查项：

```text
[ ] 是否强制 AI 输出 JSON
[ ] 是否校验 JSON schema
[ ] 是否处理 invalid JSON
[ ] 是否存在 retry / fallback
[ ] 是否把 narration 和 state patch 分离
```

判断标准：

```text
✔ AI 输出经过 parser + schema validation
⚠ AI 有一定格式要求，但容错和校验不足
✖ AI 输出自由文本，前端直接使用
```

---

### 7.3 是否禁止 AI 直接修改 GameState

高风险写法：

```ts
const nextState = aiResponse.gameState;
setGameState(nextState);
```

推荐写法：

```ts
const parsed = parseAIOutput(response);
const safePatch = validateStatePatch(parsed.suggestedStatePatch);
const nextState = applyStatePatch(currentState, safePatch);
```

检查项：

```text
[ ] AI 是否只能输出 suggestedStatePatch
[ ] StatePatch 是否经过白名单校验
[ ] Engine 是否有权拒绝非法 patch
[ ] 是否禁止 AI 直接设置 hp / inventory / battle result
```

---

## 8. StatePatch 系统审计

StatePatch 是解耦 AI 与 GameState 的关键。

### 8.1 是否存在 patch 机制

重点检查路径：

```text
/src/engine/statePatch.ts
/src/core/patch.ts
/src/store/applyPatch.ts
```

理想结构：

```ts
export type StatePatch =
  | { type: 'set_phase'; phase: GamePhase }
  | { type: 'set_scene'; sceneId: string }
  | { type: 'add_item'; itemId: string; quantity: number }
  | { type: 'remove_item'; itemId: string; quantity: number }
  | { type: 'set_flag'; key: string; value: unknown }
  | { type: 'damage_character'; characterId: string; amount: number }
  | { type: 'heal_character'; characterId: string; amount: number };

export function applyStatePatch(state: GameState, patch: StatePatch): GameState {
  switch (patch.type) {
    case 'set_phase':
      return { ...state, phase: patch.phase };
    default:
      return state;
  }
}
```

检查项：

```text
[ ] 是否存在 StatePatch 类型
[ ] 是否存在 applyStatePatch 函数
[ ] 是否有 patch 白名单
[ ] 是否禁止任意深层对象覆盖
[ ] 是否记录 patch 来源：player / engine / ai
```

---

## 9. UI 层架构审计

UI 应该只负责展示和发送 Action，不应该承担核心规则计算。

### 9.1 UI 是否直接包含游戏逻辑

重点检查：

```text
React components
pages
screens
battle UI
inventory UI
story UI
```

高风险情况：

```ts
// UI 组件里直接计算命中和伤害
const hit = Math.random() * 20 + attackBonus >= enemy.ac;
setEnemyHp(enemy.hp - damage);
```

推荐情况：

```ts
function AttackButton({ actorId, targetId }) {
  return (
    <button onClick={() => dispatchAction({
      type: 'attack',
      actorId,
      targetId,
    })}>
      攻击
    </button>
  );
}
```

判断标准：

```text
✔ UI 只 dispatch Action，规则在 engine 中
⚠ UI 中有少量临时逻辑，但主体在 engine 中
✖ UI 中大量混杂战斗、骰子、状态更新逻辑
```

---

### 9.2 UI 是否依赖 LLM 自由文本生成结构

高风险：

```text
AI 返回一段文本，前端从文本中解析按钮、数值、道具、敌人状态。
```

推荐：

```text
AI 返回 narration，按钮和状态由结构化 JSON / GameState 渲染。
```

检查项：

```text
[ ] UI 按钮是否来自 ActionOption schema
[ ] UI 状态是否来自 GameState
[ ] UI 是否从 AI 文本中提取数字或逻辑
[ ] UI 是否将 narration 仅作为文本展示
```

---

## 10. 存档、读档与回放系统审计

AI 跑团游戏必须能保存、恢复，并最好支持事件回放。

### 10.1 是否存在 save / load

重点检查：

```text
localStorage
IndexedDB
SQLite
backend save API
saveGame()
loadGame()
```

检查项：

```text
[ ] 是否保存完整 GameState
[ ] 是否保存 inventory
[ ] 是否保存 party / enemies
[ ] 是否保存 scene / flags
[ ] 是否保存 battle state
[ ] 是否保存 AI 生成过的剧情摘要或日志
```

---

### 10.2 是否支持 replay

理想结构：

```text
initial GameState + GameEvent[] + DiceLog[] → replay
```

检查项：

```text
[ ] 是否有 GameEvent 日志
[ ] 是否有 DiceLog
[ ] 是否每个 Action 都可追踪
[ ] 是否可通过事件重建状态
[ ] 是否支持 Debug Mode 查看状态变化
```

判断标准：

```text
✔ 支持完整 replay 或接近完整 replay
⚠ 有日志，但不能完整重建状态
✖ 只有最终状态，没有事件链
```

---

## 11. Context 压缩系统审计

LLM 不能无限读取完整历史，否则容易 token 爆炸、状态遗忘、逻辑漂移。

### 11.1 是否存在 context builder / context reducer

重点检查路径：

```text
/src/llm/contextBuilder.ts
/src/ai/context.ts
/src/services/buildPrompt.ts
```

理想结构：

```ts
export interface LLMContext {
  sceneSummary: string;
  recentEvents: GameEvent[];
  relevantFlags: Record<string, unknown>;
  currentStateView: CompressedGameState;
  allowedActions: GameActionOption[];
  lastCheckResult?: CheckResult;
}
```

检查项：

```text
[ ] 是否只发送压缩后的 GameState
[ ] 是否只发送最近 3~5 个事件
[ ] 是否发送当前场景摘要
[ ] 是否发送当前可行动作
[ ] 是否避免把完整历史全部塞进 prompt
```

---

### 11.2 Scene Summary 是否自动维护

检查项：

```text
[ ] 是否每个 scene 有 summary
[ ] 是否在关键剧情后更新 summary
[ ] summary 是否控制长度，例如 100~300 字
[ ] 是否能在读档后恢复 summary
```

---

## 12. 输出规范审计

AI 输出必须可解析、可验证、可降级。

### 12.1 是否强制 JSON schema

推荐结构：

```ts
export interface AIResponse {
  narration: string;
  npcDialogues?: Array<{
    speakerId: string;
    text: string;
  }>;
  actionOptions?: GameActionOption[];
  suggestedPatch?: StatePatch[];
  warnings?: string[];
}
```

检查项：

```text
[ ] 是否要求 AI 输出 JSON
[ ] 是否对 JSON 做 schema validation
[ ] 是否在解析失败时重试
[ ] 是否在重试失败时使用 fallback 文本
[ ] 是否记录原始 AI 输出用于 Debug
```

---

### 12.2 是否存在 fallback 机制

推荐流程：

```text
LLM response
→ parse JSON
→ validate schema
→ if fail: retry once with repair prompt
→ if still fail: use safe fallback narration
→ do not modify GameState
```

检查项：

```text
[ ] invalid JSON 是否不会导致游戏崩溃
[ ] AI 胡乱输出是否不会污染 GameState
[ ] 是否有错误日志
[ ] 是否有用户可见的安全降级提示
```

---

## 13. 背包与道具系统审计

AI 跑团中的道具不仅是展示图标，还应该能触发规则效果。

### 13.1 Item 数据结构

理想结构：

```ts
export interface Item {
  id: string;
  name: string;
  type: 'consumable' | 'equipment' | 'quest' | 'material' | 'junk';
  description: string;
  quantity: number;
  icon?: string;
  usableIn?: Array<'story' | 'battle' | 'shop' | 'dialogue'>;
  effects?: ItemEffect[];
}
```

### 13.2 ItemEffect 数据结构

```ts
export type ItemEffect =
  | { type: 'heal'; amount: number }
  | { type: 'buff'; stat: string; amount: number; duration: number }
  | { type: 'reroll'; mode: 'take_highest' | 'choose_result' }
  | { type: 'reveal_clue'; clueId: string }
  | { type: 'unlock_flag'; flag: string };
```

检查项：

```text
[ ] 是否存在 Item 类型
[ ] 是否记录 quantity
[ ] 是否区分 consumable / quest / equipment
[ ] 使用道具是否走 Action
[ ] 道具效果是否由 engine 执行
[ ] AI 是否不能随意添加或删除道具
```

---

## 14. 剧情旗标与任务系统审计

剧情旗标决定分支、结局、NPC 态度和后续事件。

### 14.1 Flag 系统

理想结构：

```ts
export interface GameFlags {
  story: Record<string, unknown>;
  quest: Record<string, QuestState>;
  npcTrust: Record<string, number>;
  discoveredClues: Record<string, boolean>;
}
```

检查项：

```text
[ ] 是否存在剧情 flags
[ ] 是否存在任务状态
[ ] 是否存在 NPC 信任度 / 好感度
[ ] 是否存在线索发现状态
[ ] 是否使用 flags 控制剧情分支
[ ] 是否避免只靠自然语言记忆剧情
```

---

## 15. NPC 与对话系统审计

好的 AI 跑团需要 NPC 有稳定身份、目标、关系和记忆，而不是每轮重新生成。

### 15.1 NPC 数据结构

理想结构：

```ts
export interface NPCProfile {
  id: string;
  name: string;
  role: string;
  personality: string;
  goals: string[];
  secrets?: string[];
  trust: number;
  knownFacts: string[];
  dialogueStyle: string;
}
```

检查项：

```text
[ ] 是否有 NPC profile 数据
[ ] 是否有 trust / relationship
[ ] 是否有 secrets / hidden clues
[ ] 是否有 dialogueStyle
[ ] AI 对话是否读取 NPC profile
[ ] NPC 状态是否能随剧情变化
```

---

## 16. Debug 与开发者工具审计

AI 跑团项目非常需要调试能力，否则后续很难排查 AI 为什么乱写或战斗为什么错。

### 16.1 Debug Mode

检查项：

```text
[ ] 是否能显示当前 GameState
[ ] 是否能显示最近 Action
[ ] 是否能显示 DiceResult
[ ] 是否能显示 CheckResult
[ ] 是否能显示 AI 原始输出
[ ] 是否能显示 StatePatch
[ ] 是否能一键复制 debug 信息
```

### 16.2 日志追踪

推荐结构：

```ts
export interface DebugTrace {
  id: string;
  action: GameAction;
  beforeState: Partial<GameState>;
  diceResults?: DiceResult[];
  aiRawOutput?: string;
  parsedAIOutput?: AIResponse;
  patches: StatePatch[];
  afterState: Partial<GameState>;
  timestamp: number;
}
```

---

## 17. Codex 最终评分模型

请 Codex 按以下维度打分，每项 0~5 分。

| 维度 | 说明 |
|---|---|
| GameState 设计 | 是否统一、完整、可恢复 |
| Action 系统 | 玩家行为是否结构化 |
| Dice 系统 | 骰子是否系统生成、可追踪 |
| 剧情判定系统 | 选择行动、判定、重投、续写是否闭环 |
| Combat 系统 | 是否有回合、先攻、命中、伤害、日志 |
| LLM 控制能力 | AI 是否受控，是否只能叙事和建议 patch |
| UI 纯净度 | UI 是否只负责展示和 dispatch |
| 存档与回放 | 是否可保存、恢复、追踪事件链 |
| Context 压缩 | 是否避免完整历史塞入 prompt |
| Debug 能力 | 是否能排查骰子、状态、AI 输出问题 |
| 可扩展性 | 是否方便继续加角色、敌人、道具、场景 |

### 评分解释

```text
0 分：完全没有
1 分：零散存在，无法稳定使用
2 分：有雏形，但不完整或耦合严重
3 分：基本可用，但仍有明显风险
4 分：较完整，可继续扩展
5 分：工程化优秀，稳定、清晰、可测试
```

---

## 18. Codex 最终报告格式

Codex 必须按以下 Markdown 格式输出报告：

```md
# AI跑团系统架构审计报告

## 1. 项目整体判断

当前项目更接近：
- [ ] A. 剧情文本生成器
- [ ] B. 半结构化 AI 跑团 Demo
- [ ] C. 具备规则引擎雏形的 AI RPG 系统
- [ ] D. 工程化 LLM RPG Engine

判断依据：
- ...

---

## 2. 已实现能力（✔）

### 2.1 xxx
- 证据文件：`src/...`
- 关键代码：`function xxx()`
- 说明：...

---

## 3. 部分实现能力（⚠）

### 3.1 xxx
- 证据文件：`src/...`
- 当前实现：...
- 不足之处：...
- 风险：...

---

## 4. 完全缺失能力（✖）

### 4.1 xxx
- 缺失说明：...
- 影响：...
- 建议补充位置：`src/...`

---

## 5. 高风险架构问题

### 5.1 xxx
- 风险等级：高 / 中 / 低
- 涉及文件：`src/...`
- 问题说明：...
- 可能后果：...

---

## 6. 优化建议（按优先级排序）

### P0：必须优先解决
1. ...
2. ...

### P1：重要优化
1. ...
2. ...

### P2：体验与扩展优化
1. ...
2. ...

---

## 7. 分项评分

| 维度 | 分数 | 说明 |
|---|---:|---|
| GameState 设计 | x/5 | ... |
| Action 系统 | x/5 | ... |
| Dice 系统 | x/5 | ... |
| 剧情判定系统 | x/5 | ... |
| Combat 系统 | x/5 | ... |
| LLM 控制能力 | x/5 | ... |
| UI 纯净度 | x/5 | ... |
| 存档与回放 | x/5 | ... |
| Context 压缩 | x/5 | ... |
| Debug 能力 | x/5 | ... |
| 可扩展性 | x/5 | ... |

---

## 8. 总体评分

- Architecture：x/5
- Stability：x/5
- LLM Control：x/5
- Extensibility：x/5
- Overall：x/5

---

## 9. 结论

用 300~500 字总结当前项目最大优势、最大短板，以及下一阶段最应该改什么。
```

---

## 19. Codex 注意事项

请严格遵守：

```text
不要只说“建议优化 GameState”。
必须指出：
- 当前 GameState 在哪个文件
- 缺少哪些字段
- 哪些模块没有使用它
- 应该怎么拆或怎么集中
```

```text
不要只说“AI 控制不稳定”。
必须指出：
- 哪个 prompt 让 AI 有过大自由度
- 哪个 response handler 直接信任 AI 输出
- 是否存在 parser / validator / fallback
```

```text
不要只说“战斗系统不完善”。
必须指出：
- 是否有 initiativeOrder
- 是否有 currentActorId
- 是否有 turn loop
- 是否有 BattleEvent
- 是否有胜负判断
```

---

# END
