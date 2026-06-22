# AI 跑团项目 P1 架构审计报告

审计日期：2026-06-18  
审计范围：当前工作区代码、P0 重构产物、《AI 跑团项目当前架构审计报告》中的五项 P1 要求，以及现有自动化测试与生产构建。

## 1. 总体结论

当前项目的功能基线稳定，现有自动化测试和生产构建全部通过；但 P1 架构整改尚未完成，五项要求均未达到“可验收完成”的程度。

| P1 项目 | 状态 | 结论 |
| --- | --- | --- |
| 统一骰子入口与可追溯事件 | 部分完成 | 权威战斗已使用后端骰子服务，但剧情判定和小游戏仍有多个独立随机入口，事件缺少 `rollId/source/seedIndex` |
| AI、SSE、StatePatch 统一 schema | 部分完成 | 已有 Pydantic 请求模型和补丁权限校验，但没有统一、带版本的事件信封和 AI 输出 schema |
| 拆分 App 与 BattleTestScreen | 部分完成 | 已抽出权威战斗 adapter 和动作/状态基础层，但两个主组件仍分别有 5111、3988 行 |
| ItemCatalog / ItemInstance / ItemEffect | 未完成 | 物品定义仍分散并内嵌在 UI，规则层没有登记目录校验 |
| 标准 SceneSummary 与上下文预算 | 部分完成 | 存档与状态中已有摘要字段，但没有标准摘要类型、更新器和统一预算配置 |

建议判定：**P1 未通过验收**。当前适合在测试基线上按“骰子与事件 schema → 物品目录 → SceneSummary → 大组件拆分”的顺序继续整改。

## 2. P1-1：统一前后端骰子入口

### 已有基础

- 后端 `BattleEngine` 已通过 `DiceService` 生成战斗骰子，前端权威战斗 adapter 消费后端事件。
- 战斗状态已有 `rngSeed` 与 `rngCursor`，可支持战斗动作级复现。
- 战斗命中、伤害事件已有自动化测试，星轨震荡主目标加伤也有回归覆盖。

### 未完成项

- 前端业务代码仍存在 13 处 `Math.random()`，其中包括剧情/战前判定和多个小游戏：
  - `frontend/src/utils/battlePrep.ts:233`
  - `frontend/src/App.tsx:332`
  - `frontend/src/components/BargainTestScreen.tsx:129`
  - `frontend/src/components/BattleTestScreen.tsx:1394`
  - `frontend/src/components/DrinkingDiceGame.tsx:14`
  - `frontend/src/components/LuckyBoxGame.tsx:10`
  - `frontend/src/components/OrlanBoxGame.tsx:157`
  - `frontend/src/components/TavernDicePoker.tsx:61`
  - `frontend/src/components/YachtDiceTestScreen.tsx:68`
- 后端酒馆骰子、骰子扑克及 `rules_dnd.py` 仍有独立随机实现，尚未全部汇入一个骰子服务。
- `backend/engine/dice_service.py` 事件目前只有 `type/dice/result/label` 等字段；全局搜索未发现 `rollId` 或 `seedIndex`。
- 当前 `rngCursor` 更接近“战斗动作游标”，还不是每一颗骰子的可审计序号。
- `BattleTestScreen.tsx` 中仍保留旧本地 `rollDie`，即使主战斗路径暂未使用，也会形成未来误接回旧逻辑的风险。

### 风险

- 刷新/读档后，非战斗判定与小游戏无法可靠复现。
- 日志无法用稳定 ID 对应一次骰子生成、重投和最终采用结果。
- 同一规则在前后端重复实现，修复时容易只改一侧。

### 验收建议

建立后端统一 `DiceService` API，并让所有业务骰子事件至少包含：`rollId`、`source`、`formula`、`rolls`、`modifier`、`total`、`seed` 或 `seedIndex`、`createdAt`。前端只保留动画随机，不得生成业务结果。

## 3. P1-2：统一 AI、SSE 与 StatePatch schema

### 已有基础

- FastAPI 路由已使用 Pydantic 校验部分请求。
- `backend/engine/game_state.py` 已集中实现补丁应用和 AI 受保护根字段校验。
- `routes_dnd.py` 调用 `apply_directive(..., source="ai")`，AI 对金币、HP、物品和信任值的修改会进入权限检查。
- Canonical GameState 已有 `schemaVersion: 2`。

### 未完成项

- `routes_dnd.py` 的 SSE 仍直接发送 `{type, content}` 自由字典，没有 `schemaVersion/eventId/sequence/correlationId`。
- SSE 的 `content` 根据事件类型可能是字符串、字典或完整状态，前端只能靠分支和字符串协议解析。
- AI 工具输出仍通过 `[STATE:...]`、`[SYSTEM:...]`、`[CMD:...]` 文本协议传递；解析层能过滤和校验补丁，但协议自身没有版本。
- `dm_service.py` 多个 AI 专项调用要求模型输出 JSON，再以 `json.loads` 和手工默认值处理，未使用统一 Pydantic/JSON Schema 验证。
- `PatchOperation`、`GameAction`、`ActionResult` 仍以 `str` 和 `Any` 为主，缺少可判别联合类型与版本化信封。
- `routes_battles.py` 的开始/动作响应未声明 `response_model`，返回结构仍由运行时字典约定。

### 风险

- 后端字段改名后，前端可能静默丢事件或错误解释 `content`。
- AI 返回“合法 JSON 但字段类型错误”时，手工兜底可能掩盖数据污染。
- 无事件 ID 和序号时，SSE 重连难以去重，也不利于问题追踪。

### 验收建议

统一建立版本化 `EventEnvelope<T>`、`AiResult<T>`、`StatePatchEnvelope`；为每个 AI 专项输出建立 Pydantic 模型；SSE 只发送联合事件类型，前端进行穷尽匹配。旧文本指令仅作为兼容输入，不再作为内部主协议。

## 4. P1-3：拆分 App 与 BattleTestScreen

### 已有基础

- 已新增 `frontend/src/core/battle/authoritativeAdapter.ts`，权威战斗响应不再完全由 UI 直接解释。
- 已新增 `frontend/src/core/actions/`、`frontend/src/core/state/`，形成 Action/Resolver/State 的最小骨架。
- 战斗 adapter 已有 3 个测试。

### 未完成项

- `frontend/src/App.tsx` 仍有 5111 行，同时承担场景编排、存读档、AI 流、战前行动、商店、小游戏、战斗切换和大量 UI 状态。
- `frontend/src/components/BattleTestScreen.tsx` 仍有 3988 行，同时包含 encounter 配置、动画、事件解释、战斗状态同步、目标选择和展示。
- `BattleTestScreen.tsx` 仍保留旧本地掷骰与若干旧战斗辅助函数，说明规则层与视图层边界未彻底收口。
- 当前仅抽出了 adapter，尚未形成可独立测试的 `AppController/SceneController/ActionDispatcher/BattleViewModel`。

### 风险

- 任一剧情改动都可能触发全局回归。
- 组件级状态与 canonical state 发生漂移时难以定位责任层。
- 大组件阻碍针对状态机和场景转换编写小粒度测试。

### 验收建议

先抽无 UI 的 controller/hooks，再移动纯展示组件；每次只迁移一条现有流程并保持 API 不变。优先顺序：SSE/AI 会话控制器、战前状态机、场景路由、战斗 view model，最后再拆 JSX。

## 5. P1-4：全局物品目录

### 现状

- `frontend/src/components/InventoryPanel.tsx:42` 内嵌 `ITEM_DEFINITIONS`，物品类型、图标、稀有度和用途属于 UI 私有知识。
- 商店、图标映射、剧情奖励和后端状态指令各自保存物品名称或配置。
- Canonical State 的 `InventoryItemState` 只有 `id/name/quantity/metadata`，没有 `catalogId`、实例 ID、效果联合类型或数据版本。
- `backend/engine/state_directives.py` 的背包处理只检查名称非空，不验证物品是否登记；AI 来源虽会被补丁权限层阻止，但系统/旧入口仍能写入任意名称。
- 全局搜索未发现 `ItemCatalog`、`ItemInstance` 或 `ItemEffect`。

### 风险

- 同一物品可能因名称、图标或效果配置不一致形成多个版本。
- 物品效果仍由具体 UI 分支实现，无法由规则层统一验证和回放。
- 旧存档中的自由文本背包难以稳定迁移。

### 验收建议

建立共享 catalog ID；后端作为权威目录和效果执行方，前端消费可序列化目录。新增 `ItemInstance { instanceId, catalogId, quantity, metadata }` 与可判别 `ItemEffect`，旧名称通过 alias 表迁移，未知项进入明确的 `legacy_unknown` 容器而不是静默登记。

## 6. P1-5：SceneSummary 与上下文预算

### 已有基础

- Canonical State 已有 `story.summary`。
- 存档层保存摘要信息并限制普通聊天历史为最近 20 条。
- prompt builder 已集中拼装部分游戏状态、任务和 flags。

### 未完成项

- 全局没有标准 `SceneSummary` 类型，也没有确定性的摘要生成/更新入口。
- 摘要字段没有约束必须包含当前场景、参与者、玩家意图、已确认事实、未决线索和最近规则事件。
- `dm_service.py` 的不同 AI 调用分别硬编码 `max_tokens`（如 120、300、420、520、960、1024、1400），没有统一预算策略。
- 不同调用各自决定传多少 history/context，缺少按调用类型配置的 token 预算和裁剪优先级。
- 没有看到用于验证“关键信息在裁剪后仍保留”的测试。

### 风险

- 长流程中 AI 容易遗忘已确认事实，或重新发放奖励、重复触发剧情。
- token 使用不可预测，专项调用之间的上下文质量不一致。
- 摘要若由 AI 自由生成且直接覆盖事实，会成为新的状态污染入口。

### 验收建议

建立规则层维护的 `SceneSummary`；事实字段由状态机生成，AI 只可提供叙事摘要候选。增加统一 `ContextBudgetPolicy`，按 system/current scene/rules/recent events/history 的优先级裁剪，并为所有 AI 入口复用同一构建器。

## 7. 测试与构建结果

本次在当前工作区实际执行：

| 检查 | 命令 | 结果 |
| --- | --- | --- |
| 前端单元测试 | `npm run test` | 4 个测试文件、20 个测试全部通过 |
| 前端生产构建 | `npm run build` | TypeScript 检查通过，Vite 生产构建通过，461 个模块完成转换 |
| 后端单元测试 | `python -m unittest discover -s tests -v` | 25 个测试全部通过 |
| 后端语法/导入编译 | `python -m compileall -q api engine kp main.py` | 通过 |

测试总计：**45/45 通过**，构建与编译均通过。

### 覆盖缺口

- 尚无统一骰子入口、骰子事件追溯字段和跨读档复现测试。
- 尚无 AI 专项 schema、SSE 版本兼容、事件去重/乱序测试。
- 尚无 ItemCatalog 登记校验、alias 迁移和物品效果规则测试。
- 尚无 SceneSummary 更新、上下文裁剪和预算上限测试。
- 前端没有 App/场景状态机的集成测试；当前 20 个测试主要覆盖叙事工具、战前行动和战斗 adapter。

因此，“现有测试通过”证明当前已覆盖路径没有发现回归，不等于五项 P1 风险已经被测试覆盖。

## 8. 建议执行顺序与最小闭环

1. **先做版本化事件与骰子闭环**：定义共享 DiceEvent/EventEnvelope，统一剧情判定和战斗骰子入口，补复现与重投测试。
2. **统一 AI/SSE schema**：Pydantic 校验所有专项输出，SSE 改为带版本和序号的联合事件，保留旧协议兼容层。
3. **建立 ItemCatalog**：先迁移骰子道具、治疗药水、金币显示和现有商店物品，再逐步迁移剧情物品。
4. **建立 SceneSummary/ContextBudgetPolicy**：先覆盖主聊天与战前/战后续写，再迁移专项 AI 调用。
5. **最后拆大组件**：在上述边界稳定后迁移 controller 和 view model；避免在协议仍变化时同时大规模移动 UI。

建议第一个可交付闭环为：**战前剧情检定 + 实际战斗 + 重投道具全部使用同一 DiceEvent schema，能够存档、读档并按 rollId 追溯，且旧功能测试保持全绿。**
