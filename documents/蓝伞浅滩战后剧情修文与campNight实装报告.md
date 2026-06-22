# 蓝伞浅滩战后剧情修文与 campNight 实装报告

## 一、完成结果

本轮已按《蓝伞浅滩战后剧情修文与实装报告（Codex 版）》及《campNight 强制夜谈节点改造说明（Codex 版）》完成修改。

当前主线保持为现有扩展路线，没有重新启用已停用的压缩收尾模块，也没有新增平行剧情系统或 AI 聊天系统。

营地夜谈现在是必经节点：

- 救下莱因：必须完成瑟琳、艾琳、布洛克、凯娅、莱因五次夜谈。
- 未救莱因：必须完成四位队友夜谈，不显示莱因选项。
- 所有必需夜谈完成前，不显示前往地底堡垒外环的出口。
- 夜谈不提供自由输入框，只能点击固定角色按钮。

## 二、修改文件

### `frontend/src/data/postBlueShoalStory.ts`

修改了蓝伞浅滩战后到第一幕结尾的实际运行剧情：

- `aftermath`：将“三类异常痕迹”的说明式总结改为现场画面。
- `route`：压缩路线介绍，删除艾琳复读式总结，强化凯娅口吻。
- `boneInvestigation`：减少三名同伴轮流解释的模板感，并移除结局揭示前不应出现的“潮声”。
- `bonePrebattle`：由 2 行扩写为 6 行，补充雾层塌落、拟声菌丝包围和骨片孢兽起身。
- `camp`：补充温热炉灰、朝向堡垒的拒马、打叉箭头、医疗帐与黑缆痕迹。
- `laineSurvivor`：补充莱因铠甲、菌丝共生、军牌和错乱报数等发现细节。
- `laineDecision`：补充净化反应、第三下敲门、假队长声音与“门开错了”的证词节奏。
- `campNight`：固定开场调整为实际显示 10—11 行，并改为强制四人/五人夜谈。
- `fortressOuter`：补充完整外墙、无人守军、旧誓词和门内回响。
- `fortressInner`：补充建堡者姓名地砖、缺头石像、黑石粉末和同伴反应。
- `sealChamber`：补充三圈错位封印环和古代警戒音，减少说明式对白。
- `bossPrebattle`：补充黑根回卷、守卫残骸重组和核心如锁的视觉重点。
- `afterBoss`：保留门后声音模仿玩家的桥段，收紧黑根退场描写。
- `finalChoice`：用沉默和同伴动作承托最终选择，不让同伴轮流替玩家表态。
- `endingA/B/C/D`：按报告重写为画面化叙事，并保留原结局条件、CG 和 BGM。
- `epilogue`：扩写地下深海揭示，强化旧地图中断和“门后世界吞没所有回程”的收束。

同时新增 campNight helper、固定兜底文本、AI 上下文构造和完成度判断。

### `frontend/src/App.tsx`

- campNight 隐藏自由输入框。
- 显示夜谈完成进度。
- 夜谈按钮调用现有 AI 流式续写，不新建聊天系统。
- AI 无文本、报错或超时时显示对应角色的固定兜底夜谈。
- AI 成功时保存本次生成文本；读档后不会因重新生成而改变已完成内容。
- 扩展路线最终核心选择交还 `postBlueShoalStory` 的既有四结局解析，避免旧兼容拦截提前截走完整结局场景。

### `backend/kp/prompt_builder_dnd.py`

新增仅在 campNight 生效的提示词约束：

- 只生成当前角色的 3—6 行短夜谈。
- 使用前文经历、背包、信任值和主角六维信息。
- 不修改状态、道具或信任。
- 不输出行动选项，不替玩家选择 Boss 核心处理方式。
- 禁止提前揭露瑟琳身份、完整时间锚点与地下深海。

### `frontend/src/data/scriptedScenes.ts`

- 重写 `act1-bad-ending-time-reset`（逆时归零）文本，增强银杖碎裂和回到起点的演出，不提前完全揭露瑟琳身份。

### `frontend/src/data/postBlueShoalStory.test.ts`

新增或调整测试：

- 未救莱因时只要求四位队友。
- 救下莱因时莱因是第五个必需对象。
- 未完成全部夜谈时不能继续。
- 非救援路线不能通过异常输入触发莱因夜谈。
- 两条路线的 campNight 开场均为 10—12 行。
- 地下深海相关词不会在尾声前出现。
- 调整扩写后四结局 CG 切换顺序断言。

### `frontend/src/data/updateAnnouncements.ts`

- 新增版本 `1.2.7`，记录本轮剧情修文、强制夜谈和 AI 兜底更新。

## 三、campNight 状态与流程

新增的兼容状态字段：

- `campNightTalkedToSerin`
- `campNightTalkedToAilin`
- `campNightTalkedToBrock`
- `campNightTalkedToKaiya`
- `campNightTalkedToLain`
- `campNightAllRequiredTalksDone`
- `campNightTalkLogs`
- `campNightActiveTalkTarget`

这些字段沿用现有游戏状态保存与 `patchGameState` 管线，没有新增存档格式或平行存档系统。

夜谈调用 AI 时会提供：

- 当前交谈对象与当前节点。
- 玩家姓名、流派/职业和六维属性。
- 最近剧情摘要与关键事件。
- 莱因是否遭遇、是否获救、是否稳定。
- 背包文本与结构化物品。
- 四位同伴当前信任值。
- 已完成的夜谈对象。

每位角色都有确定性的固定兜底。AI 失败后仍会标记该角色已交谈、保存兜底文本并返回夜谈选项，不会自动跳过其余角色，也不会卡死主线。

## 四、逻辑字段与系统影响

- 未修改任何 scene id。
- 未修改任何 trigger。
- 未修改战斗配置、胜利判定或战斗流程。
- 未修改四结局的核心条件，仍为“是否救下莱因 × 稳定/破坏核心”。
- 未新增大型地图、势力、系统或剧情线。
- campNight 因新要求新增了必要的运行时状态字段、选项完成度判断和 AI 文本保存逻辑。
- campNight 完成后的下一节点仍是现有 `fortressOuter`，没有改变后续主线路由结构。

## 五、验证结果

- 前端定向剧情测试：通过，2 个测试文件、17 项测试。
- 前端完整测试：通过，28 个测试文件、102 项测试。
- 后端完整测试：通过，40 项测试。
- Python 语法检查与 campNight 提示词守卫检查：通过。
- TypeScript/Vite 构建：通过，502 个模块完成转换。

构建仍报告两个既有资源运行时解析警告：

- `/assets/scenes/title-bg.webp`
- `/assets/battle/b1-sanctum-placeholder.png`

这两个警告与本轮剧情及 campNight 修改无关，不影响本轮构建成功。

## 六、发布前复核补充

根据复核意见完成以下收尾：

- `fortressOuter` 的旧誓词调整为“守住门——直到门不再需要人守”，保留口语化表达并增强仪式停顿。
- endingA 的结局记录移除“关键证词”式说明语，改为旧防线重新沉睡、胸口留下最后真话的画面。
- endingC 的结局记录移除“平稳推进”，改为“远征得以继续。只是队伍里少了一道会解释真相的呼吸”。
- `act1-bad-ending-time-reset` 补上与 A/B/C/D、尾声和第一幕完结场景一致的 `ACT1_ENDING_BGM`。
- 新增“扩展路线、未救莱因、`core_choice_pending: false`、稳定核心”仍进入 endingC 的回归测试，并校验结局持久化字段 `endingId`、`act1EndingCode` 与 `bossCoreChoice`。
- 新增 `campNightTalkLogs` 经过存档快照 JSON 序列化和既有状态迁移后保持嵌套内容不变的回归测试。

莱因分支复核结果：未救莱因时，`laineSurvivor` 会直接固定跳转到 `campNight`，不会进入 `laineDecision`；只有使用净化之心救下莱因的路线会进入 `laineDecision`，因此“净化之心压住侵蚀”的条件台词不会在未救路线播放。

旧 `routeAct1Ending` 仅在 `postBlueShoalExpandedStarted` 为假时作为兼容路径运行；扩展路线会由 `resolvePostBlueShoalAction` 处理最终选择。endingC 已持久化 `endingId: cold-expedition`、`act1EndingCode: C`、`act1_ending_title` 与 `bossCoreChoice: stabilize`，第二幕可直接引用，无需新增重复字段。
