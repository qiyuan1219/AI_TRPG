# AI 跑团《地心之门》PPT 可用材料清单

> 用途：给“宣传 PPT / 项目答辩”同学快速找 AI 卖点、截图位置、演示流程和代码证据。  
> 扫描范围：当前项目代码、`README.md`、`documents/`、`docs/`、`frontend/public/assets/`。  
> 重要口径：当前剧情以代码为准，尤其是 `frontend/src/data/postBlueShoalStory.ts` 的蓝伞浅滩战后新版主线；早期文档和 README 中仍有部分废案/旧结局描述，PPT 不建议直接使用。

## 1. 项目中 AI 相关功能总览

| AI 功能 | 当前状态 | 项目中的体现 | 主要证据 |
| --- | --- | --- | --- |
| AI KP / 游戏主持人 | 已实现 | 后端把玩家输入、剧情状态、记忆、规则提示词组合成 DM prompt，并通过流式接口返回叙事和行动建议。 | `backend/kp/dm_service.py:306`、`backend/kp/prompt_builder_dnd.py:10`、`backend/api/routes_dnd.py:897`、`frontend/src/services/api.ts:552` |
| AI 剧情续写 | 已实现 | 玩家点击行动或输入自由行动后，前端通过 SSE 接收 AI 旁白；AI 输出正文和 `[HINTS]`，前端解析成剧情文本与下一步选项。 | `frontend/src/App.tsx:3114`、`frontend/src/features/ai/AiStreamController.ts:13`、`frontend/src/utils/narrative.ts` |
| AI NPC 对话 | 已实现 / 部分专用接口 | 艾琳招募回答判定、瑟琳初见判定、同伴支线反馈/聊天、凯娅黑市议价、云苓商品咨询、小游戏短评等都有后端 AI 接口。 | `backend/kp/dm_service.py:510`、`:636`、`:1043`、`backend/api/routes_dnd.py:806`、`:836`、`:869`、`:881`、`backend/api/routes_companion_events.py` |
| 玩家行动 + D20 骰子判定 + AI 反馈 | 已实现 | 选择行动可触发 D20 判定，规则层先锁定骰子、DC、成功/失败、奖励/代价，再把结果交给 AI 写成剧情反馈。 | `frontend/src/utils/battlePrep.ts:238`、`:308`、`frontend/src/utils/selectionAction.ts:22`、`frontend/src/App.tsx:3652`、`backend/api/routes_dnd.py:864` |
| 战斗前剧情判定 | 已实现 | 蓝伞浅滩、骨柱湿地、黑石门卫等遭遇可以有战前行动；判定结果转化为第一回合优势、敌人惩罚、flag、信任变化等。 | `frontend/src/data/scriptedScenes.ts:1151`、`frontend/src/data/postBlueShoalStory.ts:561`、`frontend/src/utils/battlePrep.ts:507`、`frontend/src/data/encounterFlows.ts:81` |
| 战斗胜利后的剧情衔接 | 部分实现 / 当前以脚本主线 + AI 行动续写结合 | 战斗结果进入后续剧情节点；蓝伞浅滩战后新版主线由 `postBlueShoalStory.ts` 承接，并在玩家继续行动时由 AI 续写局部反馈。 | `frontend/src/data/encounterFlows.ts:81`、`frontend/src/data/postBlueShoalStory.ts:65`、`frontend/src/App.tsx:3076` |
| AI 战况播报 / 战斗总结 | 已实现 | 每次战斗行动可请求 AI 用一句 KP 口吻播报战况；失败时回退为空，不阻塞战斗日志。 | `backend/kp/dm_service.py:889`、`:919`、`backend/api/routes_dnd.py:1084`、`frontend/src/services/api.ts:405`、`frontend/src/components/BattleTestScreen.tsx:1044` |
| 多结局剧情分流 | 已实现 / 新版主线中 | 莱因作为“堡垒真相”和“结局分流”的核心证据，影响守门者仍在、斩断黑根、逆钟锚定、强制暂封，以及门缝开启失败态。 | `frontend/src/data/postBlueShoalStory.ts:135`、`:257`、`:613`、`:649`、`:668`、`:1318` |
| AI 生成/辅助生成素材 | 已有静态资产，可作为 AI 辅助内容生产展示 | 项目内存在大量角色、场景、敌人、Q 版模型、道具图标和背景资源；部分文件名直接保留 ChatGPT/Image/cutout/spritesheet 线索。注意：这是“AI 辅助美术资产”，不是运行时实时生图。 | `frontend/public/assets/characters/`、`frontend/public/assets/chibi/`、`frontend/public/assets/enemies/`、`frontend/public/assets/scenes/`、`frontend/public/assets/icons/items/` |
| Prompt / 规则注入机制 | 已实现 | 系统 prompt 注入 DM 身份、AI 展示目标、技能检定、同伴信任、剧情状态、记忆、HINTS 协议和状态边界。 | `backend/kp/prompt_builder_dnd.py:10`、`:70`、`:249`、`:612`、`:837`、`:920`、`backend/core/context/context_budget.py:36` |
| fallback 机制 | 已实现 | 后端 AI 失败会输出本地兜底叙事/选项；前端 AI 续写异常也会显示系统兜底旁白，保证剧情不锁死。 | `backend/api/routes_dnd.py:999`、`:1032`、`backend/kp/dm_service.py:987`、`frontend/src/App.tsx:3169`、`:3250`、`frontend/src/services/api.ts:405` |

## 2. 需要在 PPT 中展示的核心 AI 卖点

### 卖点 1：AI KP 动态续写剧情

说明：玩家做出行动后，系统结合当前剧情状态、记忆、背包、同伴信任和规则约束，请求 AI KP 生成下一段剧情与可选行动。

相关文件：

* `backend/kp/dm_service.py:306`：`dm_chat_stream` 负责流式 AI 主持人回复。
* `backend/kp/prompt_builder_dnd.py:920`：`build_system_prompt` 动态组装 DM 身份、规则、状态、记忆。
* `backend/api/routes_dnd.py:897`：`/api/dnd/chat/stream` SSE 路由。
* `frontend/src/services/api.ts:552`：前端解析流式 AI 事件。
* `frontend/src/App.tsx:3114`：前端发起 AI 续写并把文本追加到主舞台。

适合 PPT 展示：

* 玩家点击一个剧情行动。
* 主舞台出现 KP 旁白。
* 底部刷新下一步行动选项。

可截图位置：

* 主剧情页面：`frontend/src/components/VisualNovelStage.tsx:64`
* 对话日志：`frontend/src/components/DialogueLog.tsx`

一句话文案：

> AI 不只是聊天机器人，而是在规则、状态和记忆约束下扮演“地下城主”。

### 卖点 2：选择行动 + D20 判定 + AI 反馈

说明：玩家的行动先由规则层完成 D20 判定，AI 再根据已锁定结果续写成功、失败、代价或奖励，避免“AI 自己乱改数值”。

相关文件：

* `frontend/src/utils/selectionAction.ts:22`：识别自由输入中的 `【能力DC】` 检定。
* `frontend/src/utils/battlePrep.ts:238`：D20 判定规则。
* `frontend/src/utils/battlePrep.ts:308`：行动结果结算。
* `frontend/src/components/DiceRollOverlay.tsx:340`：骰子 UI。
* `backend/api/routes_dnd.py:864`：`/story-check/narrate`。
* `backend/kp/dm_service.py:987`：`dm_story_check_narrate` 根据骰子结果写战前/行动反馈。

适合 PPT 展示：

* 点击带 `【感知DC14】` 的行动。
* 展示 D20 骰子界面。
* 展示“成功/失败”后的 AI 旁白。

可截图位置：

* 骰子界面：`frontend/src/components/DiceRollOverlay.tsx`
* 行动选择面板：`frontend/src/App.tsx` 中选择行动与战前行动区域。

一句话文案：

> 规则层负责公平结算，AI 负责把结算变成有戏剧张力的跑团叙事。

### 卖点 3：战斗前剧情判定影响战斗开局

说明：蓝伞浅滩、骨柱湿地、黑石门卫等重要遭遇前，玩家可以先进行一次战前行动，成功后获得第一回合优势、敌人减益、同伴加成或剧情 flag。

相关文件：

* `frontend/src/data/scriptedScenes.ts:1104`：蓝伞浅滩场景。
* `frontend/src/data/scriptedScenes.ts:1151`：蓝伞浅滩战前行动配置。
* `frontend/src/utils/battlePrep.ts:93`：战前行动效果结构。
* `frontend/src/utils/battlePrep.ts:507`：战前行动效果写入状态。
* `frontend/src/App.tsx:3652`：战前行动流程。
* `frontend/src/data/battleConfigs.ts:10`：蓝伞浅滩战斗配置。

适合 PPT 展示：

* 蓝伞浅滩剧情结束后出现战前行动。
* 玩家选择“确认远处喊声是否为拟声菌团诱导”等行动。
* 骰子判定后进入战斗，战斗日志显示开局优势。

一句话文案：

> 战斗不是孤立的数值对撞，玩家在剧情中的准备会真实改变战斗开局。

### 卖点 4：AI NPC 互动与信任系统

说明：NPC 会根据玩家回答、支线选择、行动结果和信任值变化给出不同反馈；数值由规则层更新，AI 负责表现语气、态度和信息量。

相关文件：

* `backend/kp/prompt_builder_dnd.py:612`：信任系统规则，明确 LLM 只表现、不擅自改数值。
* `backend/kp/dm_service.py:510`：艾琳招募回答 AI 判定。
* `backend/kp/dm_service.py:636`：同伴支线 AI 反馈。
* `backend/api/routes_companion_events.py:73`：支线选择后的 AI 反馈接口。
* `frontend/src/features/story/StoryRewardNotices.tsx:18`：信任变化右上角提示。
* `frontend/src/components/CharacterPanel.tsx:36`：角色信息面板展示近期信任日志。

适合 PPT 展示：

* 艾琳招募回答：玩家输入对修女定位的理解。
* AI 评价玩家回答并改变信任。
* 角色信息面板中信任值实时变化。

一句话文案：

> NPC 不是固定台词板，而是会记住玩家态度、改变信任和反馈方式的队友。

### 卖点 5：AI 战况播报让战斗更像跑团

说明：战斗行动发生后，系统把战斗上下文交给 AI，生成一句 KP 风格战况播报，补足传统回合制战斗“只有数字日志”的表现力。

相关文件：

* `backend/kp/dm_service.py:889`：战场解说 prompt。
* `backend/kp/dm_service.py:919`：`dm_battle_narrate`。
* `backend/api/routes_dnd.py:1084`：`/battle/narrate`。
* `frontend/src/services/api.ts:405`：`fetchBattleNarration`。
* `frontend/src/components/BattleTestScreen.tsx:1044`：战斗界面调用 AI 播报。
* `frontend/src/components/BattleTestScreen.tsx:1467`：战斗日志展示区域。

适合 PPT 展示：

* 进入蓝伞浅滩战斗。
* 玩家攻击或敌方行动。
* 战斗日志中出现自然语言战况描述。

一句话文案：

> 每一轮战斗都可以被 AI 翻译成“像桌游主持人在讲”的临场叙事。

### 卖点 6：莱因驱动的真相链与四结局分流

说明：蓝伞浅滩之后，莱因不只是幸存者，而是“堡垒真相”和“最终处置”的关键证人；玩家如何救助、询问、携带或放弃莱因，会影响最终四结局。

相关文件：

* `frontend/src/data/postBlueShoalStory.ts:5`：新版蓝伞浅滩战后节点 ID。
* `frontend/src/data/postBlueShoalStory.ts:135`：莱因发现节点。
* `frontend/src/data/postBlueShoalStory.ts:149`：莱因稳定/询问节点。
* `frontend/src/data/postBlueShoalStory.ts:257`：正式结局节点开始。
* `frontend/src/data/postBlueShoalStory.ts:613`：莱因与结局分数计算。
* `frontend/src/data/postBlueShoalStory.ts:1318`：最终结局解析。

适合 PPT 展示：

* 发现莱因。
* 取得证词/识别牌/真名线索。
* 最终选择“守门者仍在 / 斩断黑根 / 逆钟锚定 / 强制暂封”。

一句话文案：

> 结局不是 Boss 战后的固定菜单，而是由玩家一路积累的证词、信任、线索和选择共同解锁。

### 卖点 7：AI 辅助内容生产资产库

说明：项目已经沉淀角色立绘、Q 版战斗模型、敌人模型、道具图标、场景背景、结局 CG 等大量静态资产，可作为“AI 辅助美术生产”的展示材料。

相关文件/目录：

* `frontend/public/assets/characters/`：角色立绘。
* `frontend/public/assets/chibi/`：Q 版战斗 spritesheet。
* `frontend/public/assets/enemies/`：敌人模型，其中多张文件名含 `ChatGPT Image ... cutout`。
* `frontend/public/assets/scenes/`：场景背景。
* `frontend/public/assets/icons/items/`：道具图标。
* `frontend/public/assets/icons/style_selection/01.png` 到 `05.png`：五个流派图标。
* `frontend/public/assets/battle/`：战斗背景。

适合 PPT 展示：

* 一页素材墙：角色、敌人、场景、道具、战斗 Q 版模型。
* 展示“从文本世界观到视觉资产”的生产链路。

一句话文案：

> AI 不只参与运行时叙事，也参与了项目内容资产的快速生产。

### 卖点 8：Prompt 规则护栏 + 失败兜底，保证 AI 可控

说明：项目并不是把所有逻辑交给 AI，而是通过 prompt、规则层、状态 patch、HINTS 协议和 fallback 把 AI 控制在“会讲故事但不乱改规则”的范围里。

相关文件：

* `backend/kp/prompt_builder_dnd.py:837`：叙事与候选状态边界。
* `backend/kp/prompt_builder_dnd.py:851`：HINTS 可见性规则。
* `backend/core/context/context_budget.py:32`：不同场景的 token budget。
* `backend/core/context/scene_summary.py:18`：剧情状态摘要。
* `backend/api/routes_dnd.py:999`：AI 空回复时的兜底。
* `frontend/src/App.tsx:3250`：前端 AI 续写异常兜底。

适合 PPT 展示：

* 架构图：玩家行动 → 规则层结算 → AI 叙事 → 前端展示。
* 对比“纯聊天 AI”与“规则约束 AI KP”。

一句话文案：

> 可控 AI 才能做游戏：数值归规则，表达归 AI，异常归兜底。

## 3. 请重点查找这些类型的文件

### 前端 AI 调用相关

| 文件 | 作用 | PPT 可用点 |
| --- | --- | --- |
| `frontend/src/services/api.ts` | 前端 API 封装；包含 `chatStream`、战前判定叙事、战斗播报、小游戏短评、商店咨询、同伴支线等请求。 | 可证明前端确实接入后端 AI，而不是只播放固定文本。 |
| `frontend/src/features/ai/AiStreamController.ts` | 管理 AI 流式请求、取消和回调。 | 展示“AI KP 流式输出”的工程封装。 |
| `frontend/src/services/dndRuntime.ts` | 解析系统事件、骰子事件和运行时状态。 | 展示 AI 输出和游戏状态之间有协议层。 |
| `frontend/src/App.tsx` | 游戏主流程；处理玩家行动、AI 续写、战前行动、fallback、剧情推进。 | PPT 中最重要的“前端编排”证据。 |
| `frontend/src/utils/narrative.ts` | 清理 AI 机器协议、提取 HINTS、过滤元文本。 | 证明 AI 输出会被结构化解析，不是直接裸显示。 |
| `frontend/src/components/DiceRollOverlay.tsx` | D20 骰子 UI。 | 截图最直观，适合“选择行动 + 骰子 + AI”卖点。 |
| `frontend/src/components/BattleTestScreen.tsx` | 战斗页面，调用 AI 战况播报。 | 适合展示 AI 战斗播报。 |
| `frontend/src/components/CharacterPanel.tsx` | 角色信息、同伴信任与近期日志。 | 适合展示“AI NPC + 信任系统”结果。 |
| `frontend/src/features/story/StoryRewardNotices.tsx` | 奖励、信任变化提示。 | 适合展示右上角信任变化提示。 |

### 后端 AI 调用相关

| 文件 | 作用 | PPT 可用点 |
| --- | --- | --- |
| `backend/config.py` | LLM 环境变量配置，包含 API key、base url、model 等配置项。 | 只说明“存在环境变量配置”，不要展示真实 `.env` 内容。 |
| `backend/kp/dm_service.py` | AI 服务核心：主聊天流、艾琳回答判定、同伴支线、战斗播报、战前判定叙事、小游戏/商店短评。 | 后端 AI 能力的核心证据。 |
| `backend/kp/prompt_builder_dnd.py` | Prompt 构建器，注入 DM 身份、规则、NPC、信任、状态、HINTS 协议。 | 适合做“AI KP 如何被约束”的技术页。 |
| `backend/api/routes_dnd.py` | `/api/dnd` 路由：流式聊天、判定叙事、战斗播报、NPC/商店/小游戏等接口。 | 证明 AI 能力对前端开放为接口。 |
| `backend/api/routes_companion_events.py` | 同伴支线开始、选择、战斗结果、自由聊天接口。 | 适合展示 NPC 个人剧情。 |
| `backend/core/context/context_budget.py` | 按主聊天、战斗、短评等场景控制 token budget。 | 证明项目考虑 AI 成本与上下文管理。 |
| `backend/core/context/scene_summary.py` | 根据状态生成剧情摘要，并更新最近事件摘要。 | 证明 AI 有“当前剧情上下文”。 |
| `backend/kp/memory.py` | 记忆系统。 | 可用于说明 NPC/DM 可以参考历史信息。 |

### 剧情与规则数据

| 文件 | 内容 | PPT 可用点 |
| --- | --- | --- |
| `frontend/src/data/scriptedScenes.ts` | 固定主线场景、背景、人物立绘、状态 patch、蓝伞浅滩战前行动。 | 展示“固定剧情骨架 + AI 局部续写”的混合结构。 |
| `frontend/src/data/postBlueShoalStory.ts` | 蓝伞浅滩战后新版主线、莱因补丁、堡垒真相、四结局/失败态、行动解析和状态结算。 | 展示复杂分支叙事和多结局。 |
| `frontend/src/data/encounterFlows.ts` | 遭遇流程：战前场景、战斗 ID、战后场景的连接。 | 展示剧情如何进入战斗、战斗后如何继续。 |
| `frontend/src/data/battleConfigs.ts` | 蓝伞浅滩、骨柱湿地、黑石门卫 Boss 等战斗配置。 | 展示战斗内容和背景资源。 |
| `frontend/src/utils/battlePrep.ts` | 战前行动、D20、重掷道具、效果结算。 | 展示跑团规则和 AI 叙事的连接层。 |
| `frontend/src/utils/selectionAction.ts` | 从固定选项或自由输入创建行动检定。 | 展示“自由行动也可被规则化”。 |
| `frontend/src/data/intelDocuments.ts` | 情报档案/线索数据。 | 展示调查获得档案、影响剧情。 |
| `frontend/src/core/items/ItemCatalog.ts`、`frontend/src/data/itemIconPaths.ts` | 道具目录与图标映射。 | 展示背包、重掷骰子、剧情关键道具。 |
| `frontend/src/data/characterRegistry.ts`、`frontend/src/data/npc/npcProfiles.ts` | 角色/NPC 配置。 | 展示 NPC 画像和立绘引用。 |

### 素材与 AI 生成资产

当前素材目录大致可分为：

| 类型 | 目录/示例 | PPT 展示建议 |
| --- | --- | --- |
| 角色立绘 | `frontend/public/assets/characters/adventurer/adventurer_idle.png`、`frontend/public/assets/characters/ailin/ailin_idle.png`、`frontend/public/assets/characters/lein/lein_idle.png` | 主角、艾琳、莱因、凯娅、瑟琳、布洛克立绘拼图。 |
| Q 版战斗模型 | `frontend/public/assets/chibi/adventurer/adventurer_chibi_spritesheet.png`、`frontend/public/assets/chibi/gatekeeper/gatekeeper_chibi_spritesheet.png` | 战斗角色 spritesheet 墙。 |
| 敌人模型 | `frontend/public/assets/enemies/`、多张 `ChatGPT Image ... cutout.png`、`enemy-gatekeeper.webp` | 展示黑石门卫、黑根仆从、拟声菌类敌人。 |
| 道具图标 | `frontend/public/assets/icons/items/`，如 `item-lain-dogtag.png`、`item-fortress-emblem.png`、`spore-mask.png`、`xugou.png`、`wanneng.png` | 展示背包、关键线索、重掷道具。 |
| 流派图标 | `frontend/public/assets/icons/style_selection/01.png` 到 `05.png` | 展示冒险者登记/流派选择。 |
| 场景背景 | `frontend/public/assets/scenes/16blue-umbrella-shoal.webp`、`12yunling-apothecary.webp`、`14dark-gate-forecourt-battle.webp` | 展示场景氛围和剧情节点。 |
| 战斗背景 | `frontend/public/assets/battle/battle01.png`、`battle02.png`、`battle03.png` | 展示战斗场景差异。 |
| 结局 CG | 已存在：`ending-guardian-remains.webp`、`ending-gate-split-open.webp`、`ending-cold-expedition.webp`、`ending-wounded-through-gate.webp` | 当前新版代码还引用 `ending-cut-black-root.webp`、`ending-reverse-clock.webp`、`ending-forced-seal.webp`，但扫描时未在目录中找到；PPT 使用前要确认素材补齐或替换。 |

### 近期文档线索

`documents/` 目录下有多份可辅助 PPT 文案的设计/实现说明：

* `documents/AI控制的伙伴信任值机制设计与实现提示词.md`
* `documents/AI跑团行动检定与调查档案系统设计.md`
* `documents/earth_gate_after_blue_shoal_stage_detail_codex_patch.md`
* `documents/earth_gate_laine_story_and_four_endings_patch.md`
* `documents/蓝伞浅滩战后至第一幕结束_Codex实现说明.md`
* `documents/重要战斗遭遇流程统一规范_Codex实现说明.md`

注意：这些文档中可能包含方案草稿或旧版本描述。PPT 的剧情名称、结局名称、节点路径应以当前代码为准。

## 4. PPT 证据表

| PPT 展示点 | 功能说明 | 推荐截图/演示 | 相关文件路径 | 关键代码/数据位置 | 展示价值 |
| --- | --- | --- | --- | --- | --- |
| AI KP 动态续写 | 玩家行动后 AI 根据剧情状态、记忆和规则续写 | 行动选择 → KP 旁白 → 新选项 | `backend/kp/dm_service.py`<br>`backend/api/routes_dnd.py`<br>`frontend/src/App.tsx` | `dm_chat_stream`、`/chat/stream`、`aiStreamController.start` | 展示 AI 作为 DM 的核心能力 |
| HINTS 结构化行动建议 | AI 输出 `[HINTS]`，前端转成按钮 | AI 生成剧情后底部出现选项 | `backend/kp/prompt_builder_dnd.py`<br>`frontend/src/utils/narrative.ts` | `STATE_DIRECTIVE_SYSTEM`、HINTS 解析 | 证明 AI 输出不是裸文本，而是游戏协议 |
| D20 行动检定 | 玩家选择行动后进行骰子判定 | 点击 `【感知DC14】` → 骰子界面 | `frontend/src/utils/battlePrep.ts`<br>`frontend/src/components/DiceRollOverlay.tsx` | `resolveBattlePrepChoice`、`DiceRollOverlay` | 展示跑团规则和网页交互 |
| 判定结果 AI 续写 | 骰子结果锁定后交给 AI 写反馈 | 成功/失败后出现 KP 旁白 | `backend/kp/dm_service.py`<br>`backend/api/routes_dnd.py`<br>`frontend/src/App.tsx` | `dm_story_check_narrate`、`/story-check/narrate` | 展示 AI 与规则层协作 |
| 蓝伞浅滩战前行动 | 战前一次行动影响开局 | 蓝伞浅滩剧情 → 战前选择 → 进入战斗 | `frontend/src/data/scriptedScenes.ts`<br>`frontend/src/data/battleConfigs.ts` | `enter-blue-shoal`、`battlePrep`、`BLUE_SHOAL_BATTLE_CONFIG` | 展示剧情选择影响战斗 |
| AI 战况播报 | 战斗每回合生成自然语言战况 | 战斗日志/播报区域 | `backend/kp/dm_service.py`<br>`frontend/src/components/BattleTestScreen.tsx` | `BATTLE_NARRATE_PROMPT`、`fetchBattleNarration` | 让战斗从数字日志变成跑团叙事 |
| 艾琳招募 AI 判定 | 玩家自由回答，AI 判断信任变化 | 输入招募理由 → AI/系统反馈 → 信任变化 | `backend/kp/dm_service.py`<br>`backend/api/routes_dnd.py` | `judge_ailin_recruit_answer`、`/ailin/recruit-answer` | 展示 NPC 互动不只是固定选项 |
| 同伴支线 AI 反馈 | 伙伴事件选择/战斗后 AI 反馈 | 同伴事件页面或剧情段落 | `backend/api/routes_companion_events.py`<br>`backend/engine/companion_events.py` | `choose_side_event`、`companion_side_event_feedback` | 展示 NPC 关系线可扩展 |
| 信任值实时反馈 | 行动导致信任变化，右上角提示并写入角色信息 | 右上角信任 toast + 角色面板 | `frontend/src/features/story/StoryRewardNotices.tsx`<br>`frontend/src/components/CharacterPanel.tsx` | `TrustNotice`、`recentTrustLogs` | 展示 AI NPC 关系的可视化结果 |
| 莱因与四结局 | 莱因证词、识别牌、真名影响结局解锁 | 莱因节点 → 堡垒 → 最终选择 | `frontend/src/data/postBlueShoalStory.ts` | `getLaineEndingScores`、`resolveEnding` | 展示状态驱动叙事和多结局 |
| 情报档案/背包线索 | 行动获得文件、道具、线索并影响后续 | 背包/档案页截图 | `frontend/src/data/intelDocuments.ts`<br>`frontend/src/core/items/ItemCatalog.ts` | 档案配置、道具目录 | 展示调查玩法和世界观沉淀 |
| AI 辅助资产库 | 角色、敌人、场景、图标等静态资产 | 素材墙 | `frontend/public/assets/` | `characters`、`chibi`、`enemies`、`scenes`、`icons/items` | 展示内容生产效率和视觉完成度 |
| Prompt 规则护栏 | AI 被限制为“写叙事，不乱改数值” | 技术架构页 | `backend/kp/prompt_builder_dnd.py`<br>`backend/core/context/context_budget.py` | `TRUST_SYSTEM`、`STATE_DIRECTIVE_SYSTEM`、`token_budget` | 展示 AI 可控性 |
| fallback 防卡死 | AI 请求失败时本地兜底继续剧情 | 可用流程图展示 | `backend/api/routes_dnd.py`<br>`frontend/src/App.tsx` | `_fallback_chat_narrative`、`【AI续写异常】` | 展示项目稳定性 |

## 5. 建议 PPT 结构

### 第 1 页：游戏标题页

* 该页要讲什么：介绍《地心之门》是一款 AI KP 驱动的 D&D 风格网页跑团游戏。
* 推荐截图：主菜单/标题界面，或主剧情舞台 + 蓝伞浅滩背景。
* 推荐引用文件：`README.md`、`frontend/src/components/VisualNovelStage.tsx`、`frontend/public/assets/scenes/16blue-umbrella-shoal.webp`
* PPT 文案：  
  > 《地心之门》：让 AI 成为可控、会判定、会扮演 NPC 的网页跑团主持人。

### 第 2 页：项目痛点

* 该页要讲什么：传统跑团主持人成本高、规则门槛高、固定剧情复玩性有限。
* 推荐截图：可以用 D20 骰子、剧情文本、角色队伍组合做拼图。
* 推荐引用文件：`README.md`、`frontend/src/components/DiceRollOverlay.tsx`
* PPT 文案：  
  > 跑团好玩，但需要主持人、规则经验和大量内容准备；AI 可以降低进入门槛。

### 第 3 页：解决方案：AI KP 驱动的网页跑团

* 该页要讲什么：展示整体架构：玩家行动 → 规则层结算 → AI KP 续写 → 前端舞台展示。
* 推荐截图：主剧情页面 + 简单流程图。
* 推荐引用文件：`backend/kp/dm_service.py`、`backend/kp/prompt_builder_dnd.py`、`frontend/src/services/api.ts`、`frontend/src/App.tsx`
* PPT 文案：  
  > 我们把 AI 放在“主持人表达层”，把数值结算留给确定性规则层。

### 第 4 页：AI 核心能力 1：动态剧情续写

* 该页要讲什么：玩家选择行动后，AI 根据当前剧情、状态、记忆和同伴关系续写。
* 推荐截图：行动按钮 + KP 旁白 + 新选项。
* 推荐引用文件：`backend/api/routes_dnd.py:897`、`frontend/src/App.tsx:3114`
* PPT 文案：  
  > 每次玩家行动都会成为 AI KP 的新上下文，而不是只走固定剧本。

### 第 5 页：AI 核心能力 2：选择行动 + 骰子判定 + AI 反馈

* 该页要讲什么：D20 判定决定成功失败，AI 将结果写成符合当前场景的剧情反馈。
* 推荐截图：骰子检定界面。
* 推荐引用文件：`frontend/src/components/DiceRollOverlay.tsx`、`frontend/src/utils/battlePrep.ts`、`backend/kp/dm_service.py:987`
* PPT 文案：  
  > 骰子决定命运，AI 负责讲出命运发生的方式。

### 第 6 页：AI 核心能力 3：NPC 互动与信任系统

* 该页要讲什么：NPC 会根据玩家回答和行动结果改变信任，信任影响语气、建议和剧情反馈。
* 推荐截图：艾琳招募回答、右上角信任提示、角色信息面板。
* 推荐引用文件：`backend/kp/dm_service.py:510`、`backend/kp/prompt_builder_dnd.py:612`、`frontend/src/features/story/StoryRewardNotices.tsx`
* PPT 文案：  
  > 队友不是数值卡，而是会评价玩家、建立信任、影响冒险的同行者。

### 第 7 页：AI 核心能力 4：战前判定与战斗播报

* 该页要讲什么：战斗前的剧情行动影响开局；战斗中 AI 用 KP 语言播报局势。
* 推荐截图：蓝伞浅滩战前行动、战斗界面、战斗日志。
* 推荐引用文件：`frontend/src/data/scriptedScenes.ts:1151`、`frontend/src/data/battleConfigs.ts`、`backend/kp/dm_service.py:889`、`frontend/src/components/BattleTestScreen.tsx:1044`
* PPT 文案：  
  > 战斗既有规则强度，也有 AI 主持人的现场叙事感。

### 第 8 页：AI 核心能力 5：多结局与状态驱动叙事

* 该页要讲什么：莱因线索、证词、识别牌、真名和玩家选择共同决定结局。
* 推荐截图：莱因立绘、堡垒场景、最终结局选择。
* 推荐引用文件：`frontend/src/data/postBlueShoalStory.ts`
* PPT 文案：  
  > 结局由一路积累的真相和代价共同解锁，而不是打完 Boss 自动播放。

### 第 9 页：AI 辅助内容生产：角色、场景、道具、敌人素材

* 该页要讲什么：展示素材库，强调 AI 帮助快速扩展视觉内容。
* 推荐截图：素材墙；角色立绘、Q 版 spritesheet、敌人、场景、道具图标。
* 推荐引用文件：`frontend/public/assets/characters/`、`frontend/public/assets/chibi/`、`frontend/public/assets/enemies/`、`frontend/public/assets/scenes/`、`frontend/public/assets/icons/items/`
* PPT 文案：  
  > AI 辅助生成让小团队也能快速搭建完整的幻想世界视觉资产。

### 第 10 页：总结：创新点、技术栈、未来扩展

* 该页要讲什么：总结 AI KP、规则层、状态驱动叙事、素材生产与可扩展架构。
* 推荐截图：技术架构图 + 游戏画面拼图。
* 推荐引用文件：`README.md`、`backend/`、`frontend/`、`documents/AI跑团项目_当前架构审计报告.md`
* PPT 文案：  
  > 《地心之门》的核心创新，是把大模型从“聊天”变成可控的网页跑团主持系统。

## 6. 演示流程建议

### 演示路线 A：AI 剧情续写

1. 进入一个主线剧情节点，例如黑市、据点调查或蓝伞浅滩前置节点。
2. 点击一个行动选项，或输入带有意图的自由行动。
3. 展示 AI KP 流式输出后续剧情。
4. 展示底部新行动选项由 AI HINTS 解析而来。
5. 如果行动影响状态，展示背包、档案或同伴信任的变化。

适合讲解：

* AI 不是单纯聊天，而是读取剧情状态后续写。
* 前端会解析 AI 输出并转成可点击选项。

### 演示路线 B：战前行动 + 骰子判定 + 战斗衔接

1. 进入蓝伞浅滩 `enter-blue-shoal`。
2. 展示战前行动选项，例如检查拟声诱导、寻找菌核、规避菌毯鼓包或检查面罩。
3. 选择一个行动，展示 D20 判定。
4. 展示 AI 根据判定结果写出的战前反馈。
5. 点击进入战斗，展示战斗开局效果和 AI 战况播报。

适合讲解：

* 剧情选择会影响战斗，不是战斗前后割裂。
* AI 续写使用的是已结算结果，不会篡改骰子。

### 演示路线 C：莱因真相链与多结局

1. 从蓝伞浅滩战后新版主线继续到第三远征队营地。
2. 发现莱因，选择稳定、询问、检查识别牌或确认孢化情况。
3. 展示获得证词、识别牌、真名线索或记忆锚点。
4. 进入堡垒与黑石门卫阶段，展示这些证据如何影响战前行动/最终选择。
5. 展示不同结局条件：守门者仍在、斩断黑根、逆钟锚定、强制暂封，以及门缝开启失败态。

适合讲解：

* 多结局来自状态、线索、信任和玩家选择的长期积累。
* 莱因是当前新版主线中最能证明“分支叙事”的角色。

## 7. 注意事项

* 不要在 PPT 中展示 `.env`、API Key、token 或任何真实密钥。项目中存在 `backend/.env` 和 `backend/.env.example`，只可说明“后端通过环境变量配置模型服务”。
* “AI 生成素材”建议表述为“AI 辅助生成/处理的静态素材资产”。当前项目代码没有看到运行时实时生成图片的功能，不要宣传成“游戏中实时生图”。
* 当前新版蓝伞浅滩战后主线以 `frontend/src/data/postBlueShoalStory.ts` 为准。`frontend/src/data/scriptedScenes.ts:1387` 附近仍可看到旧的“压缩结局/旧战后入口”痕迹，PPT 不建议使用。
* README 与部分旧文档可能保留早期废案，例如旧版布洛克支线、旧结局描述等。做宣传稿时优先引用当前代码和本清单。
* 扫描时发现新版结局代码引用了 `frontend/public/assets/scenes/ending-cut-black-root.webp`、`ending-reverse-clock.webp`、`ending-forced-seal.webp`，但这三张文件当前未在素材目录中找到。若 PPT 要展示这三个结局 CG，请先补齐素材或使用游戏内实际可显示截图。
* 如果某个功能在演示机器上没有出现，建议优先检查：当前存档所在剧情节点、`encounterFlows.ts` 的遭遇连接、`App.tsx` 的战前行动 gating、以及后端 AI 服务是否启动。
* 对外答辩建议强调“AI + 确定性规则”的混合架构：AI 负责叙事、NPC 语气和战况表达；规则层负责骰子、HP、道具、信任、flag 和结局条件。

