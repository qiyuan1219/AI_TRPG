# AI跑团项目 P2 架构整改与工程化任务总清单

> 适用项目：AI跑团《地心之门》  
> 当前状态：P0 已完成，P1 核心协议与规则边界已完成。  
> 本文件用于发给 Codex / CodeBuddy，按阶段推进 P2 级工程化整改。  
> 核心原则：P2 不再优先改规则，而是提升可维护性、可观测性、可回放能力与内容扩展能力。

---

# 0. 当前项目状态

截至 P1 核心整改完成，项目已经具备：

- 统一 DiceEvent / EventEnvelope。
- 业务代码不再直接使用 `Math.random` 生成业务随机结果。
- SSE、StatePatch、战斗响应加入版本化 Schema。
- AI 专项输出增加 Pydantic 校验。
- AI 优劣势判定已禁用。
- 建立 ItemCatalog / ItemInstance / ItemEffect 和旧物品迁移。
- 建立 SceneSummary / ContextBudgetPolicy。
- 抽离 AI、战前、剧情及战斗 Controller / ViewModel。
- 保持旧存档和旧事件兼容。
- 前端测试通过。
- 后端测试通过。
- TypeScript + Vite 生产构建通过。
- Python 编译与后端模块导入通过。
- `git diff --check` 通过。

但仍存在 P2 级技术债：

- `App.tsx` 和 `BattleTestScreen.tsx` 行数仍然很大。
- DebugTrace 尚未形成完整面板。
- Replay 尚未形成最小闭环。
- NPCProfile 尚未完全统一。
- 内容包与数据版本管理尚未建立。
- 大量内容数据仍散落在剧情、组件、prompt 与配置文件中。

---

# 1. P2 总目标

P2 目标不是继续堆玩法，而是让项目进入“可长期维护、可调试、可扩展”的阶段。

P2 应完成：

```text
P2-0：物理拆分债务清理
P2-1：DebugTrace 调试系统
P2-2：Replay 最小闭环
P2-3：NPCProfile 统一
P2-4：内容包与数据版本管理
```

推荐执行顺序：

```text
1. P2-0：物理拆分债务清理
2. P2-1：DebugTrace 调试系统
3. P2-2：Replay 最小闭环
4. P2-3：NPCProfile 统一
5. P2-4：内容包与数据版本管理
```

---

# 2. P2 执行总原则

## 2.1 不要一次性大改

P2 的最大风险是“为了清理而破坏稳定主线”。

必须遵守：

1. 每次只执行一个 Phase。
2. 每个 Phase 单独提交。
3. 每个 Phase 测试必须通过。
4. 不改变 P1 已稳定协议。
5. 不改变 DiceEvent / EventEnvelope。
6. 不改变 ItemCatalog。
7. 不改变 SceneSummary / ContextBudgetPolicy。
8. 不改变 GameAction / StatePatch。
9. 不删除旧存档兼容层。
10. 不删除旧事件兼容层。
11. 不为了行数机械切文件。
12. 不在展示组件中引入新的业务状态源。

---

## 2.2 P2 每阶段必须运行的测试

每个阶段完成后都运行：

```bash
npm run test
npm run build
python -m unittest discover -s tests -v
python -m compileall -q api core engine kp main.py
git diff --check
```

如果后端实际目录没有 `core`，请按项目当前目录调整编译命令。

---

## 2.3 P2 每阶段手动验收

每个阶段至少人工验收：

```text
[ ] 新游戏开场正常
[ ] 瑟琳自我介绍流程正常
[ ] 教学战斗前选择行动只出现一次
[ ] 重投 UI 正常
[ ] AI 续写完成后进入战斗
[ ] 教学战斗完整打完
[ ] 蓝伞浅滩战前行动正常
[ ] 背包按钮正常
[ ] 角色信息按钮正常
[ ] 对话日志按钮正常
[ ] 存档按钮正常
[ ] 战斗命中骰显示正常
[ ] 战斗伤害骰显示正常
[ ] 战斗胜利奖励弹窗不重复
[ ] 旧存档可读取
```

---

# 3. P2-0：物理拆分债务清理

## 3.1 目标

当前：

```text
App.tsx 约 5112 行
BattleTestScreen.tsx 约 3992 行
```

P2-0 目标：

```text
第一阶段目标：
App.tsx 降到 2500 行以下
BattleTestScreen.tsx 降到 2000 行以下

最终目标：
App.tsx 降到 1000 行以下
BattleTestScreen.tsx 降到 1200 行以下
```

判断标准不是单纯行数，而是职责边界：

```text
App.tsx 只做根路由、全局状态组合、页面装配。
BattleTestScreen.tsx 只做战斗页面容器。
规则、协议、数据、展示组件、controller/viewmodel 各在自己的文件中。
```

---

## 3.2 App.tsx 当前职责

当前 `App.tsx` 职责包括：

- 根应用状态：screen、phase、gameState、story、suggestions、dice、reward notices。
- AI 流式会话绑定：启动流、解析 narrative/system/suggestions/state_update、错误兜底。
- 剧情推进：脚本场景、自由行动、行动次数限制、固定节点推进。
- 战前行动：战前面板、骰子结果、重投、AI 续写、进入战斗。
- 教学战斗前置流程：第一次行动判定、AI 续写、战斗 setup。
- 存读档：自动存档、手动存档、读档恢复 UI 状态。
- 背包/奖励提示：奖励弹窗、物品图标、文档/线索提示。
- 商店/小游戏入口：奥兰盲盒、云苓药铺、酒馆骰子、喝酒小游戏、讲价。
- 音频/BGM：音量、曲目切换、外部战斗 BGM 事件。
- 页面布局：标题、主游戏、测试页、战斗页、弹窗、右上角按钮区等。

优先拆：

```text
AI 流绑定
战前行动绑定
建议/行动面板
存读档绑定
弹窗绑定
页面布局
```

---

## 3.3 BattleTestScreen.tsx 当前职责

当前 `BattleTestScreen.tsx` 职责包括：

- 战斗类型、单位、技能、配置数据。
- 教学战斗/测试战斗单位配置。
- 本地 fallback 战斗规则与旧骰子逻辑。
- 权威 BattleEngine adapter 调用与状态同步。
- DiceOverlay 绑定与骰子结果展示。
- 战斗动画、技能 FX、受击反馈。
- AI 敌人行动选择和战斗旁白。
- BattleLog、行动按钮、目标选择。
- 单位详情弹窗、技能卡片、角色模型。
- 胜负结算、教学提示、先攻 UI。
- debug/test/fallback 兼容逻辑。

优先拆：

```text
战斗数据配置
DiceOverlay 绑定
BattleLogPanel
BattleActionBar
BattleField / BattleActorSprite
BattleResultPanel
```

---

## 3.4 已抽离模块

P2-0 不应重新设计这些，只应把 App / BattleTestScreen 中的 UI 绑定代码逐步搬过去：

```text
frontend/src/features/ai/AiStreamController.ts
frontend/src/features/encounter/BattlePrepController.ts
frontend/src/features/story/StoryController.ts
frontend/src/features/battle/BattleController.ts
frontend/src/features/battle/BattleViewModel.ts
frontend/src/core/battle/authoritativeAdapter.ts
```

---

## 3.5 推荐目录结构

```text
frontend/src/features/app/
  AppLayout.tsx
  AppTopActions.tsx
  AppModals.tsx
  useAppDialogs.ts

frontend/src/features/ai/
  AiStreamController.ts
  useAiStreamSession.ts

frontend/src/features/story/
  StoryScreen.tsx
  StoryActionSuggestions.tsx
  StoryController.ts
  StoryRewardNotices.tsx

frontend/src/features/encounter/
  BattlePrepController.ts
  BattlePrepBinding.tsx
  TutorialBattleBridge.ts

frontend/src/features/save/
  SaveLoadBinding.tsx
  useSaveSlots.ts

frontend/src/features/battle/
  BattleController.ts
  BattleViewModel.ts
  BattleScreen.tsx
  BattleDiceBinding.tsx
  BattleLogPanel.tsx
  BattleActionBar.tsx
  BattleField.tsx
  BattleActorSprite.tsx
  BattleResultPanel.tsx
  BattleUnitDetailModal.tsx

frontend/src/data/battle/
  battleTypes.ts
  battleStaticConfig.ts
  tutorialBattleConfig.ts
  testBattleConfig.ts
```

---

## 3.6 P2-0 Phase 1：低风险展示组件搬迁

### 目标

```text
App.tsx 降到约 4300 行
BattleTestScreen.tsx 降到约 3200 行
```

行数不是唯一目标，功能稳定优先。

### App.tsx 允许搬迁

```text
AudioSettingsModal
RewardAcquisitionModal
右上角功能按钮区
弹窗容器 AppModals
```

建议新增：

```text
frontend/src/features/app/AppTopActions.tsx
frontend/src/features/app/AppModals.tsx
frontend/src/features/app/useAppDialogs.ts
frontend/src/features/story/StoryRewardNotices.tsx
```

### BattleTestScreen.tsx 允许搬迁

```text
BattleTutorialIntro
InitiativeRollOverlay
RosterPanel
SkillCard
UnitDetailModal
```

建议新增：

```text
frontend/src/features/battle/BattleTutorialIntro.tsx
frontend/src/features/battle/InitiativeRollOverlay.tsx
frontend/src/features/battle/RosterPanel.tsx
frontend/src/features/battle/SkillCard.tsx
frontend/src/features/battle/BattleUnitDetailModal.tsx
```

### Phase 1 禁止移动

App.tsx 中禁止移动：

```text
submitAction 全流程
AI 流式解析主流程
教学战斗第一次行动相关逻辑
战前行动确认后进入 AI 续写再进入战斗的状态机
存档恢复后的 encounter / battlePrep 恢复逻辑
任何会影响 DiceEvent、ItemCatalog、SceneSummary、StatePatch 的代码
```

BattleTestScreen.tsx 中禁止移动：

```text
resolveAction
executeSettlement
advanceTurn
权威战斗与旧 fallback 混合区域
AI 敌人行动策略
战斗动画时序绑定
DiceEvent 解析逻辑
伤害骰 finalFace 逻辑
任何本地 fallback 战斗规则
```

### Phase 1 验收标准

```text
[ ] App.tsx 行数下降
[ ] BattleTestScreen.tsx 行数下降
[ ] 新组件只接收 props / callbacks
[ ] 子组件不直接修改 GameState
[ ] 子组件不调用 BattleEngine
[ ] 子组件不计算命中 / 伤害 / 回合推进
[ ] 所有测试通过
[ ] 手动主流程通过
```

---

## 3.7 P2-0 Phase 2：Battle 展示层拆分

### 目标

```text
BattleTestScreen.tsx 降到 2600 行以内
```

### 推荐顺序

```text
1. BattleLogPanel
2. BattleActionBar
3. BattleResultPanel
4. BattleField
5. BattleActorSprite
6. BattleEffectPanel
```

原因：

```text
BattleLogPanel / BattleActionBar / BattleResultPanel 风险较低。
BattleField / ActorSprite 容易牵扯动画、坐标、受击反馈、目标选择，放后面。
```

### 规则

```text
子组件只收 props。
不在子组件内调用 BattleEngine。
不在子组件内计算伤害、命中、回合推进。
不在子组件内解析 DiceEvent。
不改变动画时序。
```

---

## 3.8 P2-0 Phase 3：App 绑定层拆分

### 目标

```text
App.tsx 降到 3500 行以内
```

### 搬迁内容

```text
SaveLoadBinding
Inventory / Character / DialogueLog / CityMap 绑定层
StoryActionSuggestions
StoryRewardNotices
```

### 规则

```text
只搬 UI 绑定。
状态修改仍由原 App 控制。
避免一次性改变状态来源。
```

---

## 3.9 P2-0 Phase 4：AI 流 UI 绑定层

### 目标

```text
App.tsx 降到 3000 行以内
```

### 搬迁内容

```text
submitAction 内 AI stream callbacks 组合逻辑
parser flush / suggestions / system event defer 的 UI 绑定
```

### 规则

```text
保留 submitAction 的流程编排在 App。
先不搬教学战斗分支。
不改变 AI 协议。
不改变 SSE 解析。
```

---

## 3.10 P2-0 Phase 5：战前行动绑定层

### 目标

```text
App.tsx 降到 2500 行以下
```

### 搬迁内容

```text
handleBattlePrepResolve
handleBattlePrepReroll
handleBattlePrepConfirm
handleBattlePrepEnterBattle
```

### 规则

```text
BattlePrepController 只处理状态机和结果。
App 只接收“要显示什么 / 下一步进入哪里”。
不能重新引入第 2/3 次行动框。
不能破坏重投道具限制。
```

---

## 3.11 P2-0 Phase 6：Battle fallback / debug 分离

### 目标

```text
BattleTestScreen.tsx 降到 2000 行以下
```

### 搬迁内容

```text
旧 fallback 骰子 / 战斗逻辑 → legacyBattleFallback.ts
debug/test encounter → battleDebugConfig.ts
权威战斗主路径保留在 BattleScreen
```

### 规则

```text
fallback 不得被主流程调用。
debug 配置不得污染正式配置。
旧 fallback 必须明确标记 deprecated。
```

---

## 3.12 P2-0 总验收标准

```text
[ ] App.tsx 降到 2500 行以下
[ ] BattleTestScreen.tsx 降到 2000 行以下
[ ] App.tsx 不再承担弹窗细节渲染
[ ] App.tsx 不再承担战斗展示细节
[ ] BattleTestScreen.tsx 不再承担纯展示组件细节
[ ] Battle 展示组件只接收 props
[ ] Story 展示组件只接收 props
[ ] 所有 P1 协议不回归
[ ] 所有测试通过
[ ] 主线手动验收通过
```

---

# 4. P2-1：DebugTrace 调试系统

## 4.1 目标

建立完整调试链路：

```text
玩家做了什么
系统投了什么骰
AI 原文是什么
解析出了什么
状态改了哪里
哪个补丁被拒绝
哪里报错
```

P2-1 的目标不是给玩家看，而是给开发者看。

---

## 4.2 DebugTrace 类型建议

```ts
export interface DebugTrace {
  traceId: string;
  schemaVersion: 1;
  createdAt: string;

  action?: GameAction;
  actionId?: string;

  eventIds: string[];
  diceRollIds: string[];

  ai?: {
    requestId: string;
    rawOutput?: string;
    parsedOutput?: unknown;
    schemaValid: boolean;
    warnings?: string[];
  };

  patch?: {
    patchId: string;
    source: string;
    accepted: boolean;
    rejectionReason?: string;
    operations?: unknown[];
  };

  state?: {
    prevStateHash: string;
    nextStateHash: string;
    diff?: StateDiffEntry[];
  };

  errors?: DebugError[];
}
```

---

## 4.3 StateDiffEntry

```ts
export interface StateDiffEntry {
  path: string;
  before: unknown;
  after: unknown;
  op: 'add' | 'remove' | 'replace';
}
```

---

## 4.4 DebugTrace 应覆盖

```text
GameAction
DiceEvent
StatePatch
AI raw output
AI parsed output
SSE EventEnvelope
BattleEvent
SceneSummary update
ItemEffect execution
错误和 fallback
```

---

## 4.5 建议新增文件

前端：

```text
frontend/src/core/debug/DebugTrace.ts
frontend/src/core/debug/createDebugTrace.ts
frontend/src/core/debug/stateDiff.ts
frontend/src/features/debug/DebugPanel.tsx
frontend/src/features/debug/DebugTraceViewer.tsx
frontend/src/features/debug/StateDiffViewer.tsx
frontend/src/features/debug/DiceEventViewer.tsx
frontend/src/features/debug/AiRawOutputViewer.tsx
```

后端：

```text
backend/core/debug/debug_trace.py
backend/core/debug/state_diff.py
```

---

## 4.6 Debug 面板功能

DebugPanel 应至少支持：

```text
[ ] 查看最近 Action
[ ] 查看 DiceEvent 列表
[ ] 查看 AI raw output
[ ] 查看 AI parsed output
[ ] 查看 StatePatch
[ ] 查看 patch 是否被拒绝
[ ] 查看状态 diff
[ ] 查看错误
[ ] 一键导出调试包
```

---

## 4.7 调试包导出内容

```text
gameState
recentActions
eventLog
diceLog
statePatches
debugTraces
sceneSummary
aiRawOutputs
errors
versionInfo
```

导出格式：

```text
JSON
```

文件名示例：

```text
debug_trace_2026-06-18_213000.json
```

---

## 4.8 P2-1 完成标准

```text
[ ] 每次 GameAction 有 traceId
[ ] 每次 DiceEvent 可通过 rollId 追踪
[ ] 每次 AI 输出有 rawOutput 或明确记录未保存原因
[ ] 每次 StatePatch 有 accepted / rejected
[ ] 每次状态修改有 before/after hash
[ ] DebugPanel 可以查看最近事件
[ ] DebugPanel 可以导出调试包
[ ] DebugTrace 不影响正式玩家 UI
[ ] DebugTrace 可开关
[ ] 所有测试通过
```

---

# 5. P2-2：Replay 最小闭环

## 5.1 目标

建立基于事件与骰子记录的最小回放能力。

Replay 目标：

```text
从初始状态 + GameAction[] + DiceEvent[] + StatePatch[] 重放流程
并验证 replay 后状态与原状态一致。
```

第一阶段不用做完整 UI 回放，先做命令式 / 测试级 replay。

---

## 5.2 Replay 输入

```ts
export interface ReplayInput {
  schemaVersion: 1;
  initialGameState: GameState;
  actions: GameAction[];
  diceEvents: DiceEvent[];
  statePatches: StatePatchEnvelope[];
  eventLog: EventEnvelope<unknown>[];
  rngSeed?: string;
}
```

---

## 5.3 Replay 输出

```ts
export interface ReplayResult {
  ok: boolean;
  finalState: GameState;
  expectedStateHash?: string;
  actualStateHash: string;

  mismatch?: {
    index: number;
    actionId?: string;
    expected?: unknown;
    actual?: unknown;
    reason: string;
  };

  warnings?: string[];
}
```

---

## 5.4 最小覆盖场景

第一轮只覆盖：

```text
1. 战前剧情检定 + 重投
2. 一场教学战斗
3. 一次物品使用
```

不要第一轮覆盖全部剧情和全部小游戏。

---

## 5.5 Replay 规则

```text
Replay 中不得重新随机。
Replay 使用已有 DiceEvent。
Replay 不调用 AI。
Replay 使用已保存的 AI 输出或跳过 AI 叙事。
Replay 只验证规则状态一致性。
Replay 不验证动画。
Replay 不验证 UI。
```

---

## 5.6 建议新增文件

前端：

```text
frontend/src/core/replay/ReplayInput.ts
frontend/src/core/replay/ReplayRunner.ts
frontend/src/core/replay/ReplayResult.ts
frontend/src/features/debug/ReplayPanel.tsx
```

后端：

```text
backend/core/replay/replay_runner.py
backend/core/replay/replay_result.py
```

---

## 5.7 P2-2 完成标准

```text
[ ] ReplayInput 类型存在
[ ] ReplayRunner 存在
[ ] Replay 不重新投骰
[ ] Replay 不调用 AI
[ ] 战前检定 + 重投可回放
[ ] 教学战斗可回放
[ ] 一次物品使用可回放
[ ] replay 失败能指出第几个 action 不一致
[ ] replay 结果有状态 hash
[ ] 有 replay 单元测试
```

---

# 6. P2-3：NPCProfile 统一

## 6.1 目标

将 NPC 的角色数据统一管理，避免散落在：

```text
characterRegistry
prompt
剧情文件
UI 立绘配置
信任字段
支线条件
```

---

## 6.2 NPCProfile 类型建议

```ts
export interface NPCProfile {
  id: string;
  name: string;
  aliases: string[];

  portrait?: string;
  avatar?: string;
  chibi?: string;

  role: string;
  faction?: string;

  speechStyle: string;
  goals: string[];
  secrets?: string[];

  trustKey?: string;
  questIds?: string[];

  knownFacts?: string[];
  unlockConditions?: Record<string, unknown>;

  promptProfile?: {
    personality: string;
    speakingRules: string[];
    forbiddenKnowledge?: string[];
  };

  metadata?: Record<string, unknown>;
}
```

---

## 6.3 第一批迁移 NPC

优先迁移：

```text
瑟琳
艾琳
布洛克 / 森洛
凯娅
米娜
温妮
萨洛
奥兰
云苓
赫尔曼
莱因
蓝伞尼布
```

---

## 6.4 必须解决的问题

```text
[ ] 每个 NPC 只能有一个唯一 id
[ ] 不允许重复 id
[ ] aliases 统一处理旧称呼
[ ] trustKey 统一
[ ] prompt 从 NPCProfile 读取角色资料
[ ] UI 从 NPCProfile 读取头像 / 立绘
[ ] 剧情条件从 NPCProfile 或统一 id 引用角色
[ ] 支线任务与 NPC id 关联
```

---

## 6.5 建议新增文件

```text
frontend/src/core/npc/NPCProfile.ts
frontend/src/data/npc/npcProfiles.ts
frontend/src/data/npc/npcAliases.ts
frontend/src/core/npc/getNpcProfile.ts
frontend/src/core/npc/validateNpcProfiles.ts

backend/core/npc/npc_profile.py
backend/core/npc/npc_registry.py
```

---

## 6.6 P2-3 完成标准

```text
[ ] NPCProfile 类型存在
[ ] npcProfiles 数据存在
[ ] 每个 NPC id 唯一
[ ] aliases 可解析旧称呼
[ ] trustKey 统一
[ ] prompt builder 使用 NPCProfile
[ ] UI 使用 NPCProfile 读取头像 / 立绘
[ ] 支线剧情使用统一 NPC id
[ ] 有重复 id 检查测试
```

---

# 7. P2-4：内容包与数据版本管理

## 7.1 目标

让剧情、战斗、物品、NPC、场景、资源配置可以版本化管理。

当前问题：

```text
内容数据散落在组件、data 文件、prompt、剧情脚本和 UI 配置中。
新增章节容易跨多个文件修改。
旧存档与新内容数据的兼容关系不清晰。
```

---

## 7.2 内容包结构建议

```ts
export interface ContentPack {
  packId: string;
  version: string;
  title: string;
  description?: string;

  scenes: SceneDefinition[];
  encounters: EncounterDefinition[];
  items: ItemDefinition[];
  npcs: NPCProfile[];
  quests: QuestDefinition[];

  migrations?: ContentMigration[];
  assets?: ContentAssetManifest;
}
```

---

## 7.3 建议目录结构

```text
frontend/src/content/core/
  contentPack.ts
  contentRegistry.ts
  validateContentPack.ts

frontend/src/content/packs/base/
  pack.json
  scenes.ts
  encounters.ts
  items.ts
  npcs.ts
  quests.ts
  assets.ts

frontend/src/content/migrations/
  contentMigrations.ts
```

后端：

```text
backend/content/core/content_pack.py
backend/content/core/content_registry.py
backend/content/packs/base/
```

---

## 7.4 ContentMigration

```ts
export interface ContentMigration {
  fromVersion: string;
  toVersion: string;
  migrateSave: (state: GameState) => GameState;
}
```

---

## 7.5 需要版本化的数据

```text
剧情场景
战斗遭遇
敌人配置
技能配置
物品目录
NPCProfile
任务定义
资源路径
提示词片段
```

---

## 7.6 P2-4 完成标准

```text
[ ] ContentPack 类型存在
[ ] base content pack 存在
[ ] scenes 可从 content pack 注册
[ ] encounters 可从 content pack 注册
[ ] items 可从 content pack 注册
[ ] npcs 可从 content pack 注册
[ ] quests 可从 content pack 注册
[ ] content version 写入存档
[ ] 有内容迁移入口
[ ] 新增内容不需要修改核心引擎
```

---

# 8. P2 推荐提交节奏

```text
commit 1: refactor(p2): extract low-risk app display components
commit 2: refactor(p2): extract low-risk battle display components
commit 3: refactor(p2): extract battle log and action bar
commit 4: refactor(p2): extract battle field and actor sprites
commit 5: refactor(p2): extract app save inventory and modal bindings
commit 6: refactor(p2): extract AI stream UI binding
commit 7: refactor(p2): extract battle prep binding
commit 8: refactor(p2): separate legacy battle fallback and debug config
commit 9: feat(debug): add DebugTrace core types
commit 10: feat(debug): add DebugPanel and trace export
commit 11: feat(replay): add ReplayInput and ReplayRunner
commit 12: test(replay): add story check and battle replay tests
commit 13: refactor(npc): add NPCProfile registry
commit 14: refactor(content): add ContentPack registry
```

---

# 9. 给 Codex 的第一条 P2 执行指令

建议第一条只执行 P2-0 Phase 1。

```md
# 任务：P2-0 Phase 1 低风险展示组件物理拆分

当前 P0 / P1 核心架构已稳定。现在只执行 P2-0 Phase 1：低风险展示组件搬迁。

## 目标

在不改变业务行为的前提下，从 App.tsx 和 BattleTestScreen.tsx 中拆出低风险纯展示组件。

第一阶段目标：

- App.tsx 从约 5112 行降低到约 4300 行
- BattleTestScreen.tsx 从约 3992 行降低到约 3200 行

行数不是唯一目标，功能稳定优先。

## 必须遵守

1. 不改变任何业务规则。
2. 不改变 UI 表现。
3. 不改变 API 协议。
4. 不改变存档结构。
5. 不改变 DiceEvent / EventEnvelope。
6. 不改变 ItemCatalog。
7. 不改变 SceneSummary / ContextBudgetPolicy。
8. 不改变 GameAction / StatePatch。
9. 不删除旧兼容层。
10. 不移动高风险状态机。
11. 每个组件只接收 props 和 callbacks。
12. 子组件内不得新增业务状态源。
13. 子组件内不得调用 BattleEngine。
14. 子组件内不得计算命中、伤害、回合推进。
15. 子组件内不得直接修改 GameState。

## 本阶段允许搬迁的 App.tsx 代码块

1. AudioSettingsModal
2. RewardAcquisitionModal
3. 右上角功能按钮区
4. 弹窗容器 AppModals

建议新增文件：

frontend/src/features/app/AppTopActions.tsx
frontend/src/features/app/AppModals.tsx
frontend/src/features/app/useAppDialogs.ts
frontend/src/features/story/StoryRewardNotices.tsx

## 本阶段允许搬迁的 BattleTestScreen.tsx 代码块

1. BattleTutorialIntro
2. InitiativeRollOverlay
3. RosterPanel
4. SkillCard
5. UnitDetailModal

建议新增文件：

frontend/src/features/battle/BattleTutorialIntro.tsx
frontend/src/features/battle/InitiativeRollOverlay.tsx
frontend/src/features/battle/RosterPanel.tsx
frontend/src/features/battle/SkillCard.tsx
frontend/src/features/battle/BattleUnitDetailModal.tsx

## 本阶段禁止移动

### App.tsx

- submitAction 全流程
- AI 流式解析主流程
- 教学战斗第一次行动相关逻辑
- 战前行动确认后进入 AI 续写再进入战斗的状态机
- 存档恢复后的 encounter / battlePrep 恢复逻辑
- 任何会影响 DiceEvent、ItemCatalog、SceneSummary、StatePatch 的代码

### BattleTestScreen.tsx

- resolveAction
- executeSettlement
- advanceTurn
- 权威战斗与旧 fallback 混合区域
- AI 敌人行动策略
- 战斗动画时序绑定
- DiceEvent 解析逻辑
- 伤害骰 finalFace 逻辑
- 任何本地 fallback 战斗规则

## 测试要求

完成后必须运行：

npm run test
npm run build
python -m unittest discover -s tests -v
python -m compileall -q api core engine kp main.py
git diff --check

## 输出要求

完成后请输出：

1. 实际新增文件列表
2. 实际修改文件列表
3. App.tsx 行数变化
4. BattleTestScreen.tsx 行数变化
5. 每个新组件的职责
6. 哪些代码没有移动，以及原因
7. 测试结果
8. 手动验收建议
```

---

# 10. P2 最终完成标准

P2 全部完成后，项目应满足：

```text
[ ] App.tsx 只做根路由、全局状态组合、页面装配
[ ] BattleTestScreen.tsx 只做战斗页面容器
[ ] DebugTrace 可追踪 Action / DiceEvent / AI / StatePatch / StateDiff
[ ] DebugPanel 可导出调试包
[ ] Replay 可回放战前检定 + 教学战斗 + 物品使用
[ ] NPCProfile 统一角色数据
[ ] ContentPack 统一内容数据
[ ] 新增章节不需要修改核心引擎
[ ] 所有旧存档兼容
[ ] 所有测试通过
[ ] 生产构建通过
```

---

# END
