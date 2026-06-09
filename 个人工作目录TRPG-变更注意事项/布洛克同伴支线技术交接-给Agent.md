# 布洛克同伴支线技术交接-给Agent

更新时间：2026-06-09

## 版本基准

远端仓库：`https://github.com/qiyuan1219/AI_TRPG`

已在 2026-06-09 执行 `git fetch origin` 更新远端索引。

当前比较基准：

- GitHub 当前 `origin/main`：`cc4671d5 demo8 初版战斗系统已完成`
- 本地开发分支：`codex/companion-side-events`
- 本地已提交安全点：`7a075f31 Add companion side event framework`
- 当前工作区还有未提交源码改动，主要是支线战斗适配、右上角状态面板、危机结束必定触发战斗。

`origin/main` 到当前工作区的核心源码差异涉及：

- `.gitignore`
- `start.bat`
- `backend/main.py`
- `backend/kp/dm_service.py`
- `backend/api/routes_companion_events.py`
- `backend/engine/companion_events.py`
- `frontend/src/services/api.ts`
- `frontend/src/components/TestScreen.tsx`
- `frontend/src/components/ActionPanel.tsx`
- `frontend/src/components/VisualNovelStage.tsx`
- `frontend/src/components/BattleTestScreen.tsx`
- `frontend/src/components/CompanionEventTestScreen.tsx`
- `frontend/src/index.css`

相对本地安全点 `7a075f31`，当前未提交源码改动主要涉及：

- `backend/api/routes_companion_events.py`
- `backend/engine/companion_events.py`
- `frontend/src/components/BattleTestScreen.tsx`
- `frontend/src/components/CompanionEventTestScreen.tsx`
- `frontend/src/index.css`
- `frontend/src/services/api.ts`

## 功能总览

当前新增的是布洛克同伴支线测试框架，支线 ID 为：

`block_echo_forest`

入口在：

`frontend/src/components/TestScreen.tsx`

测试页组件：

`frontend/src/components/CompanionEventTestScreen.tsx`

后端事件定义和状态机：

`backend/engine/companion_events.py`

后端 API：

`backend/api/routes_companion_events.py`

后端路由注册：

`backend/main.py`

前端 API 封装：

`frontend/src/services/api.ts`

## 后端 API

新增路由前缀：

`/api/dnd/side-events`

接口列表：

- `GET /api/dnd/side-events`
  - 列出可用支线事件。
- `POST /api/dnd/side-events/start`
  - 创建支线测试会话。
  - 默认事件：`block_echo_forest`。
  - 可选 `initial_trust`。
- `POST /api/dnd/side-events/{session_id}/choose`
  - 提交支线选项。
  - 请求体包含 `choice_id`。
  - 新增 `include_feedback`，默认 `true`；前端支线测试页传 `false`，用于先返回骰子结果，再生成 AI 反馈。
- `POST /api/dnd/side-events/{session_id}/feedback`
  - 根据最近一次选择生成 AI 反馈文本。
  - 用于实现“先弹骰子，玩家关闭骰子后再拉取叙事反馈”。
- `POST /api/dnd/side-events/{session_id}/battle-result`
  - 支线战斗结束后提交 `win` 或 `lose`。
  - 后端结算信任、污染、奖励和自由对话阶段。
- `POST /api/dnd/side-events/{session_id}/chat`
  - 支线结束后的 AI 自由对话。

当前 session 存在内存字典 `_side_event_sessions` 中，仅适合测试，不是正式存档系统。

## 后端状态机

支线状态字段见 `CompanionSideEventState` 和 `backend/engine/companion_events.py`：

- `phase`
  - `opening`
  - `crisis`
  - `battle_pending`
  - `dialogue`
- `trust`
- `threat`
- `max_threat`
- `contamination`
- `round`
- `flags`
- `blocked_rewards`
- `rewards`
- `completed`
- `result_title`
- `result_text`
- `last_choice`
- `last_roll`
- `battle_log`
- `pending_battle`
- `battle_result`

当前流程：

1. `start` 创建 `opening`。
2. `opening` 选择后进入 `crisis`。
3. `crisis` 中每次选择会结算信任、威胁、污染、骰子、旗标。
4. 如果选择 `starts_battle=True`，进入 `battle_pending`。
5. 如果 `crisis` 中威胁降到 0，或行动轮数达到 3，也进入 `battle_pending`。
6. 前端检测 `state.phase === "battle_pending"` 后切到 `BattleTestScreen mode="side-event"`。
7. 战斗完成后调用 `battle-result`。
8. 后端调用 `_complete_event`，进入 `dialogue`。
9. `dialogue` 阶段允许自由对话，但不再刷信任值。

注意：旧逻辑曾经在 `threat <= 0` 或 `round >= 3` 时直接 `_complete_event`，会跳过战斗。现在已改为 `_queue_side_event_battle(state)`，保证本支线必定触发战斗。

## AI 反馈与提示词

`backend/kp/dm_service.py` 新增/扩展了同伴支线 AI 反馈相关能力：

- `companion_side_event_feedback`
- `companion_side_event_chat`
- 支线反馈清洗逻辑

目标：

- 支线选择结算后生成 KP/布洛克反馈。
- 支线结束后允许玩家与布洛克自由对话。
- 避免输出 `KP视角`、`末结算提示`、Markdown 加粗标题、奖励调试标题等不应展示给玩家的文本。
- 限制剧透，不允许提前讲黑暗之门后方、第二幕后续等内容。

Agent 后续改提示词时要保持这几条边界。

## 前端结构

`CompanionEventTestScreen.tsx` 是当前支线测试页，负责：

- 创建支线 session。
- 显示视觉小说舞台。
- 调用支线选择接口。
- 显示 D20 掷骰层。
- 关闭骰子后拉取 AI 反馈。
- 在 `battle_pending` 阶段切到战斗页。
- 战斗结束后提交结果并回到支线。
- 自由对话阶段显示可填入输入框的建议问题。
- 显示右上角支线状态面板。

复用组件：

- `VisualNovelStage`
- `ActionPanel`
- `DialogueLog`
- `DiceRollOverlay`
- `BattleTestScreen`

新增/扩展点：

- `ActionPanel`
  - 新增 `placeholder`
  - 新增 `helperText`
  - 新增 `suggestionMode`
  - `submit`：点击建议立即提交。
  - `fill`：点击建议只填入输入框。
- `VisualNovelStage`
  - 支持通过 speaker 映射显示布洛克立绘。
- `BattleTestScreen`
  - 新增 `battleConfigOverride`。
  - 新增/支持 `mode="side-event"`。
  - 不传 `battleConfigOverride` 时，原测试战斗和主线教学战斗走旧逻辑。
- `CompanionEventTestScreen`
  - 内置 `BLOCK_ECHO_FOREST_BATTLE_CONFIG`。
  - 内置 `SideEventStatusPanel`。

## 支线战斗适配层

适配策略是“不重写战斗系统，只给现有战斗页增加可选配置入口”。

当前支线战斗配置：

`BLOCK_ECHO_FOREST_BATTLE_CONFIG`

我方：

- 冒险者
- 布洛克·铁锅

敌方：

- 拟声孢群
- 污染藤蔓
- 污染菌核

完成方式：

- `BattleTestScreen` 内部完成战斗后调用 `onComplete(result)`。
- 支线页面调用 `completeCompanionSideEventBattle(sessionId, outcome)`。
- 后端 `resolve_side_event_battle_result` 负责胜负结算。

兼容性要求：

- 不要破坏 `BattleTestScreen mode="test"`。
- 不要破坏 `BattleTestScreen mode="tutorial"`。
- 不要改 `App.tsx` 里的主线教学战斗流程，除非主线负责人决定接入。

## 右上角状态面板

当前右上角不再把信任、奖励等塞进 `EventFeed` 普通提示条，而是在 `CompanionEventTestScreen.tsx` 内新增 `SideEventStatusPanel`。

显示内容：

- 当前支线同伴
- 阶段标签
- 布洛克信任
- 菌林威胁
- 孢子污染
- 支线奖励

CSS 在 `frontend/src/index.css`：

- `.companion-event-screen .event-feed`
- `.side-event-status`
- `.side-event-meter`
- `.side-event-threat`
- `.side-event-stat-row`
- `.side-event-rewards`

这样做的原因：只影响支线页面，不改变主线共用 `EventFeed` 样式。

## 道具与奖励现状

项目已有轻量背包机制，不是完整道具系统。

已有机制：

- `backend/engine/state_directives.py`
  - `_inventory`
  - `DIRECTIVE_HANDLERS["inventory"]`
  - `DIRECTIVE_HANDLERS["item"]`
  - `DIRECTIVE_HANDLERS["update_inventory"]`
- `backend/kp/prompt_builder_dnd.py`
  - 提示词中说明 `update_inventory(动作, 物品名)`。
  - 支持 `[CMD:inventory:{"op":"add","item":"抗孢面罩"}]`。
- `frontend/src/services/dndRuntime.ts`
  - `formatStateChange`
  - `applyStateChange`
- `frontend/src/components/CharacterPanel.tsx`
  - 把 `state.inventory` 字符串拆成背包显示。

限制：

- 没有结构化 item id。
- 没有数量栈规则。
- 没有道具类型。
- 没有使用/消耗接口。
- 没有装备栏。
- 没有自动数值加成。
- 没有确定性选项解锁系统。

当前支线里的奖励是 `state.rewards` 列表，属于支线奖励标签，还没有自动写入主线 `inventory`。

后续主线接入时建议把奖励分成三类：

- `inventory_items`：真正进入背包的物品名。
- `reward_flags`：用于后续剧情判断的标签。
- `modifiers`：临时或永久数值修正。

示例：

- `铁锅解毒丸`
  - 背包物品。
  - 后续抗毒或污染检定可 +2，或抵消一次污染。
- `回声菌粉`
  - 奖励标签或背包物品。
  - 在骨柱湿地解锁“使用回声菌粉识别菌类痕迹”。
- `暖孢浓汤`
  - 消耗品。
  - 可恢复 HP，或提供一次抗孢粉优势。

## 后续开发其他 NPC 支线

建议先不要复制整页组件五次。较稳的路线：

1. 把 `SIDE_EVENT_DEFINITIONS` 扩成多事件配置。
2. 为每个 NPC 增加：
   - `event_id`
   - `companion`
   - `opening`
   - `opening_choices`
   - `crisis_choices`
   - `free_chat_prompt`
   - `chat_topics`
   - `forbidden`
   - 奖励规则
3. 把 `BLOCK_ECHO_FOREST_BATTLE_CONFIG` 抽到单独配置文件，按事件选择 battle config。
4. `CompanionEventTestScreen` 接收 `eventId`，而不是写死布洛克。
5. `SideEventStatusPanel` 中“布洛克信任”改为 `${event.companion.name}信任`。
6. 专属立绘准备好后，更新 `VisualNovelStage` 里的 `PORTRAIT_MAP` 或改成数据驱动。
7. 主线接入时，不要用测试页内部 session 作为正式存档，应该由主线状态持有支线结果。

## 主线接入建议

目标流程：第一场主线战斗后，根据玩家选择的同行同伴触发 5 个支线中的 2 个。

推荐实现：

1. 主线选择同行同伴时，把同伴 ID 存入主线状态，例如 `selected_companions`。
2. 第一场主线战斗结束后，由主线流程创建一个 `pending_side_events` 队列。
3. 队列中只放玩家选择的 2 名同伴对应支线。
4. 依次启动支线事件。
5. 每个支线结束后返回结构化结果：
   - `companion_id`
   - `trust_delta`
   - `final_trust`
   - `reward_flags`
   - `inventory_items`
   - `contamination_delta`
   - `battle_result`
   - `summary`
6. 主线统一写回存档和全局状态。
7. 两个支线都完成后，主线继续推进骨柱湿地。

不要让单个支线直接决定第一幕结局。支线结果应影响语气、奖励、建议、后续选项和结局反馈，但不直接改主线大分支。

## 提交清单建议

提交时建议只 stage 以下源码和文档：

- `.gitignore`
- `start.bat`
- `backend/main.py`
- `backend/kp/dm_service.py`
- `backend/api/routes_companion_events.py`
- `backend/engine/companion_events.py`
- `frontend/src/services/api.ts`
- `frontend/src/components/TestScreen.tsx`
- `frontend/src/components/ActionPanel.tsx`
- `frontend/src/components/VisualNovelStage.tsx`
- `frontend/src/components/BattleTestScreen.tsx`
- `frontend/src/components/CompanionEventTestScreen.tsx`
- `frontend/src/index.css`
- `个人工作目录TRPG-变更注意事项/同伴支线接入变更注意事项.md`
- `个人工作目录TRPG-变更注意事项/布洛克同伴支线交接说明-给队友.md`
- `个人工作目录TRPG-变更注意事项/布洛克同伴支线技术交接-给Agent.md`

不要提交：

- `backend/.env`
- `.env`
- API Key
- `data/game.db`
- `data/saves/slot-1.json`
- `frontend/dist`
- `frontend/node_modules/.vite`
- `logs`
- `.playwright-cli`
- 任何本地运行缓存、构建产物、数据库、日志

当前工作区里这些运行产物很多，提交前必须认真检查 `git status`。

## 验证记录

已做轻量验证：

- `npm run build` 通过。
- `python -m compileall backend\engine\companion_events.py backend\api\routes_companion_events.py` 通过。
- 用后端函数模拟过：
  - 直接选择 `enter_battle` 会进入 `battle_pending`。
  - 危机阶段威胁降到 0 会进入 `battle_pending`。

已知非阻断提醒：

- `/assets/title-bg.webp` 构建时提示运行时解析。
- Vite 提示 JS chunk 大于 500 kB。

这两个不是支线逻辑问题。

## 风险点

- 当前支线 session 是内存态，刷新后会丢，正式主线接入要走主线存档。
- 当前只做了布洛克支线，其他 NPC 还没有配置。
- 当前战斗配置写在 `CompanionEventTestScreen.tsx` 内，后续多支线时应抽到配置文件。
- 当前奖励只在支线 `state.rewards` 中，不会自动进入主线背包。
- 当前布洛克立绘临时复用 `senluo` 模型资源，后续需要替换为专属资源。
- 当前自由对话默认不改变信任，避免刷数值；如果后续要让对话影响信任，必须加防刷规则。
- 不要为了支线改坏 `BattleTestScreen mode="test"` 和 `mode="tutorial"`。
