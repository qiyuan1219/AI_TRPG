# 《地心之门》蓝伞浅滩后剧情扩写实现规格（Codex 版）

> 目标：在现有剧情框架已经可以正常通关的前提下，替换/扩写蓝伞浅滩战后到游戏结束的全部剧情内容。重点不是重构系统，而是补足每段剧情、选择分支、检定、道具/档案/线索奖励、伙伴信任变化与结局条件。  
> 核心要求：复用现有剧情节点、行动检定、背包、档案、线索、战前选择、战斗胜利后跳转、多结局系统。不要再走旧的蓝伞浅滩战斗后简陋线；蓝伞浅滩战后应进入本文件定义的新主线链路。

---

## 0. 实现原则

### 0.1 不要大改现有架构

Codex 应优先做“数据/剧情节点扩写”，而不是重写系统。

优先复用：

- 现有 story event / scene node 结构
- 现有 `choice/action -> dice check -> AI narration -> state update -> next node` 流程
- 现有背包 inventory / documents / clues / flags / relationships / questLog
- 现有战前选择行动流程
- 现有战斗系统和胜利回调
- 现有 ending CG 展示逻辑

不得为了剧情扩写重新实现一套剧情引擎。

### 0.2 AI 续写与本地状态分工

剧情文本可以交给 AI KP 润色，但关键状态必须由前端/本地逻辑确定：

- 道具是否获得
- 档案是否加入
- 线索是否解锁
- 伙伴信任是否变化
- 结局条件是否满足
- 战前选择给战斗带来的效果
- 是否跳转到下一节点

AI 续写只负责 `narration`，不得自行发放不存在的道具，也不得跳过主线节点。

### 0.3 剧情检定分级

推荐继续沿用 D20 + 属性/技能修正。

建议统一分级：

| 结果 | 条件 | 叙事效果 | 状态效果 |
|---|---|---|---|
| 大成功 | 自然 20 或 total >= DC + 5 | 获得额外细节，伙伴认可 | 主要奖励 + 额外线索/信任 |
| 成功 | total >= DC | 行动达成 | 主要奖励 |
| 部分成功 | total >= DC - 3 | 达成但有代价 | 主要线索不阻断，少量损耗 |
| 失败 | total < DC - 3 | 没完全达成 | 给保底线索，但附加负面状态 |
| 大失败 | 自然 1 | 场景危险升级 | 负面 flag / 扣血 / 伙伴信任下降 |

主线关键线索不能因为失败彻底断掉；失败应改为“拿到不完整版本”或“付出代价后推进”。

### 0.4 重投道具规则必须保留

剧情检定后底部按钮保持：

- 确定
- 使用虚构骰子
- 使用万能骰子

规则：

- 每次剧情判定最多只能使用一个重投道具。
- 虚构骰子：消耗 1 个，再判一次，取两次结果中更高者。
- 万能骰子：消耗 1 个，玩家指定最终自然点数/最终结果。
- AI 续写必须参考最终采用的判定结果，而不是第一次判定结果。

---

## 1. 总流程图

蓝伞浅滩战斗胜利后，不再进入旧简陋战后线，而是进入以下新链路：

```text
after-battle-blue-shoal-expanded
  ↓
route-to-bone-marsh
  ↓
bone-pillar-marsh-investigation
  ↓
prebattle-bone-marsh
  ↓
battle-bone-marsh
  ↓
after-battle-bone-marsh
  ↓
third-expedition-camp
  ↓
camp-night-companion-scene
  ↓
fortress-outer-ring
  ↓
fortress-inner-investigation
  ↓
seal-control-chamber
  ↓
prebattle-blackstone-gatekeeper
  ↓
battle-blackstone-gatekeeper
  ↓
final-seal-choice
  ↓
ending-A / ending-B / ending-C / ending-D / ending-E
```

---

## 2. 全局状态与奖励类型

### 2.1 建议新增 flags

```ts
flags: {
  blue_shoal_expanded_done: boolean;
  blue_shoal_patrol_record_found: boolean;
  wounded_guard_stabilized: boolean;
  wounded_guard_failed: boolean;
  clue_voice_mimic_found: boolean;
  active_spore_sample_count: number;
  black_root_fragment_found: boolean;
  route_to_bone_marsh: 'marked_stakes' | 'dwarf_drain' | 'fungal_ridge' | 'broken_cable';
  bone_marsh_crossing_secured: boolean;
  bone_marsh_mimic_resisted: boolean;
  bone_marsh_nest_burned: boolean;
  bone_marsh_nest_sealed: boolean;
  bone_marsh_nest_ignored: boolean;
  bone_marsh_battle_done: boolean;
  expedition_camp_found: boolean;
  expedition_truth_level: number; // 0-4
  expedition_commander_log_found: boolean;
  expedition_medical_log_found: boolean;
  fortress_entry_map_found: boolean;
  fortress_emblem_found: boolean;
  blackstone_tuning_fork_found: boolean;
  gatekeeper_protocol_found: boolean;
  seal_maintenance_log_found: boolean;
  hero_oath_memory_seen: boolean;
  purification_core_prepared: boolean;
  gatekeeper_true_name_known: boolean;
  boss_battle_done: boolean;
  ending_unlocked_guardian_remains: boolean;
  ending_unlocked_cut_black_root: boolean;
  ending_unlocked_reverse_clock_anchor: boolean;
  ending_unlocked_forced_seal: boolean;
  ending_unlocked_bad_gate_open: boolean;
}
```

### 2.2 建议新增道具/档案/线索

| 类型 | ID | 名称 | 用途 |
|---|---|---|---|
| document | `doc_patrol_record_03` | 第三巡逻队记录 | 提示“远处求救声不可回应”，影响骨柱湿地 |
| clue | `clue_voice_mimic` | 拟声菌团会模仿人声 | 骨柱湿地听声选择获得优势/自动成功 |
| item | `item_black_cable_badge` | 黑缆守卫徽章 | 地底堡垒门禁识别可用 |
| item | `item_active_spore_sample` | 活性孢子样本 | 布洛克入队条件/后续净化材料；可累计 3 个 |
| item | `item_black_root_fragment` | 黑根碎片 | 黑石门卫战前削弱 Boss 护盾 |
| item | `item_blue_cap_fungus` | 蓝伞菌盖 | 可作为弱治疗/解毒材料 |
| document | `doc_bone_pillar_rubbing` | 骨柱铭文拓片 | 说明骨柱不是天然形成，指向封印失败 |
| clue | `clue_spores_follow_seal_pulse` | 孢群受封印脉冲牵引 | 影响 Boss 前战术选择 |
| document | `doc_expedition_commander_final_log` | 远征队长最后日志 | 提升真相等级，结局 A/C 条件之一 |
| document | `doc_expedition_medical_log` | 远征队用药记录 | 说明孢化可逆，结局 A 条件之一 |
| item | `item_fortress_entry_map` | 地底堡垒入口残图 | 解锁堡垒隐蔽入口 |
| item | `item_fortress_emblem` | 地底堡垒徽章 | 门禁/结局纪念道具 |
| item | `item_blackstone_tuning_fork` | 黑石调律叉 | Boss 前削弱黑石脉冲 |
| document | `doc_seal_maintenance_log` | 封印维护日志 | 说明黑石门卫职责不是敌人，而是守门者 |
| document | `doc_gatekeeper_protocol` | 黑石门卫协议 | 解锁“呼唤守门者真名”战前行动 |
| clue | `clue_gatekeeper_not_evil` | 黑石门卫并非恶意 | 影响最终结局选项显示 |
| item | `item_white_branch_candle_core` | 白枝烛芯 | 艾琳净化线材料，结局 A 条件之一 |
| item | `item_purified_blackstone_core` | 净化黑石核心 | Boss 后最终选择关键材料 |
| item | `item_cracked_gatekeeper_core` | 裂纹守门者核心 | 结局 B/C 纪念物 |

### 2.3 伙伴信任建议

涉及伙伴：瑟琳、艾琳、布洛克、凯娅。

- 艾琳：偏向救人、净化、安魂、克制破坏。
- 布洛克：偏向尊重孢海生态、采样、不要乱烧菌巢。
- 凯娅：偏向务实、风险收益、开锁绕路、取得筹码。
- 瑟琳：偏向理解封印、维护城市安全、理性判断。

---

## 3. 节点一：蓝伞浅滩战后调查

### 3.1 节点信息

```ts
id: 'after-battle-blue-shoal-expanded'
title: '蓝伞浅滩：战后的伞影'
background: '/assets/scenes/blue-shoal-after-battle.webp'
entryCondition: battle_blue_shoal_result === 'win'
```

### 3.2 剧情目标

玩家刚击败孢兽与菌团。浅滩恢复短暂安静，但战斗痕迹暴露出更多异常：

- 孢兽不是自然迁徙，而是被某种黑石脉冲驱赶。
- 第三巡逻队曾在这里失联。
- 远处的人声可能是拟声菌团模仿。
- 孢海里存在可用于后续净化/研究的活性样本。

### 3.3 入场剧情文本

战斗结束后，蓝伞浅滩的荧光没有立刻暗下去。被斩碎的菌丝仍在地上缓慢抽动，像是有某种看不见的呼吸从地底一下一下推着它们。  
布洛克蹲下，用斧背拨开一片破裂的菌盖，脸色比刚才更沉：“这不是普通孢潮。它们像是被什么东西赶出来的。”  
艾琳扶住一名倒在岩壁旁的黑缆守卫，低声念出白枝祷词。那人的嘴唇发青，却仍断断续续重复着一句话：“别回头……有人在叫我们的名字……”  
瑟琳抬起手，银色符文在指尖倒转一圈：“这里留下了封印脉冲的余波。地底堡垒还在回应，但回应方式不对。”  
凯娅看向浅滩更深处的蓝光，轻轻啧了一声：“也就是说，真正值钱的线索，还没露头。”

### 3.4 玩法结构

该节点建议给玩家 **2 次调查行动**。每完成一次行动，记录 `sceneState.blueShoalInvestigationActions += 1`。满 2 次后显示“离开浅滩，继续深入”。

如果玩家直接离开，也允许推进，但会降低后续真相等级上限。

```ts
sceneState: {
  blueShoalInvestigationActions: 0,
  blueShoalInvestigationMaxActions: 2
}
```

### 3.5 分支选择

#### 选择 A：检查孢兽尸体

```ts
choiceId: 'inspect_spore_beast_body'
label: '检查孢兽尸体，判断它们为何聚集'
check: { skill: '生态', attribute: 'wis', dc: 12 }
onceOnly: true
```

| 结果 | 剧情 | 奖励/状态 |
|---|---|---|
| 大成功 | 玩家发现孢兽体内的菌丝并非自然生长，而是绕着黑色碎片聚集，像被某种封印信号牵引。 | `item_active_spore_sample +1`；`item_black_root_fragment +1`；`clue_spores_follow_seal_pulse`；布洛克信任 +5 |
| 成功 | 玩家采集到稳定样本，并确认孢兽曾受到黑石脉冲影响。 | `item_active_spore_sample +1`；`clue_spores_follow_seal_pulse` |
| 部分成功 | 样本采集成功，但玩家吸入少量孢粉。 | `item_active_spore_sample +1`；玩家获得轻微状态 `spore_cough`，下一个剧情检定 -1 |
| 失败 | 尸体快速腐化，只留下不完整样本。 | `item_unstable_spore_sample +1`；无完整线索 |
| 大失败 | 菌囊炸开，队伍被孢尘呛退。 | `spore_cough`；布洛克信任 -2 |

用途：

- `active_spore_sample_count >= 3` 时，布洛克相关承诺完成，可在后续营地给予额外信任奖励。
- 黑根碎片可在 Boss 战前选择“破坏黑根中继”时提供优势。

#### 选择 B：整理第三巡逻队遗物

```ts
choiceId: 'collect_patrol_remains'
label: '整理黑缆守卫遗物，寻找巡逻记录'
check: { skill: '观察', attribute: 'int', dc: 10 }
onceOnly: true
```

| 结果 | 剧情 | 奖励/状态 |
|---|---|---|
| 大成功 | 玩家在断裂胸甲内找到防水记录筒，里面有完整巡逻记录和黑缆徽章。 | `doc_patrol_record_03`；`item_black_cable_badge`；`clue_voice_mimic`；瑟琳信任 +3 |
| 成功 | 玩家找到巡逻记录，读到“不要回应远处喊声”。 | `doc_patrol_record_03`；`clue_voice_mimic` |
| 部分成功 | 记录被孢液腐蚀，只能读出“人声”“别回头”等片段。 | `doc_patrol_record_03_damaged`；后续骨柱湿地相关检定 +1 |
| 失败 | 只找到破损徽记。 | `item_black_cable_badge_damaged`；无完整线索 |
| 大失败 | 遗物中的拟声菌丝突然发声，模仿一名守卫求救。 | `mimic_voice_haunted`；下次对抗拟声效果劣势 |

巡逻记录全文建议：

> 第三巡逻队，浅层孢海外缘记录。  
> 第一次听见呼救时，我们以为是第二队的人。声音从蓝伞深处传来，能叫出每个人的名字。  
> 尼布说不要回应，不要回头，不要让它知道你听见了。  
> 但罗因回头了。菌毯从他的影子下面立起来，像一张嘴。  
> 如果这份记录被找到，请转告城防：蓝伞浅滩不是异常源头，只是被某种更深处的东西推到了这里。

#### 选择 C：稳定受伤守卫

```ts
choiceId: 'stabilize_wounded_guard'
label: '帮助艾琳稳定受伤守卫'
check: { skill: '医药', attribute: 'wis', dc: 12 }
assist: ['艾琳']
onceOnly: true
```

特殊规则：

- 若拥有 `item_yunling_talisman`，可获得 +2 或直接把失败提升为部分成功。
- 若艾琳在队伍中，检定获得 +2。
- 若玩家之前多次选择冷酷/功利选项，艾琳信任不足时不提供加成。

| 结果 | 剧情 | 奖励/状态 |
|---|---|---|
| 大成功 | 守卫短暂清醒，说出“堡垒不是死了，是在被迫开门”。 | `wounded_guard_stabilized = true`；`clue_gate_pulse_forced_open`；艾琳信任 +6 |
| 成功 | 守卫生还，并提供“别回应声音，去找第三远征队营地”的提示。 | `wounded_guard_stabilized = true`；`clue_voice_mimic`；艾琳信任 +4 |
| 部分成功 | 守卫活下来了，但昏迷不醒。 | `wounded_guard_stabilized = true`；艾琳信任 +2 |
| 失败 | 守卫情况恶化，艾琳沉默很久。 | `wounded_guard_failed = true`；艾琳信任 -3；仍获得保底提示“第三远征队营地方向” |
| 大失败 | 伤口被孢化刺激，守卫死亡，艾琳强行完成安魂。 | `wounded_guard_failed = true`；艾琳信任 -6；队伍获得 `guilt_over_wounded_guard` |

后续影响：

- `wounded_guard_stabilized` 会在远征队营地/结局 A 中增加“孢化可逆”的说服力。
- `wounded_guard_failed` 不阻断主线，但会让艾琳的结局台词更沉重。

#### 选择 D：追踪异常蓝光

```ts
choiceId: 'track_abnormal_glow'
label: '追踪浅滩深处一闪而过的异常蓝光'
check: { skill: '观察', attribute: 'wis', dc: 14 }
onceOnly: true
```

| 结果 | 剧情 | 奖励/状态 |
|---|---|---|
| 大成功 | 玩家看见蓝光其实来自一枚被菌丝包裹的黑石碎片，它随着地底脉冲发亮。 | `item_teal_spore_crystal +1`；`item_black_root_fragment +1`；`clue_spores_follow_seal_pulse` |
| 成功 | 玩家确认蓝光方向与地底堡垒一致。 | `clue_spores_follow_seal_pulse`；瑟琳信任 +3 |
| 部分成功 | 方向判断正确，但玩家短暂听见同伴声音从背后传来。 | `mimic_voice_haunted`；仍解锁骨柱湿地路线 |
| 失败 | 玩家被蓝光误导，绕了一圈。 | 下个场景入场时队伍疲劳，第一次检定 -1 |
| 大失败 | 拟声菌团模仿同伴声音，使玩家差点离队。 | 凯娅信任 -2；`mimic_voice_haunted` |

#### 选择 E：采集蓝伞菌盖

```ts
choiceId: 'collect_blue_cap_fungus'
label: '采集尚未腐化的蓝伞菌盖'
check: { skill: '生态', attribute: 'int', dc: 11 }
onceOnly: true
```

| 结果 | 剧情 | 奖励/状态 |
|---|---|---|
| 大成功 | 采到完整菌盖和菌褶粉，布洛克判断可作解毒辅料。 | `item_blue_cap_fungus +2`；布洛克信任 +4 |
| 成功 | 采到一份可用菌盖。 | `item_blue_cap_fungus +1` |
| 部分成功 | 采到菌盖，但品质一般。 | `item_blue_cap_fungus +1`；使用效果降低 |
| 失败 | 菌盖腐坏不可用。 | 无奖励 |
| 大失败 | 误触孢囊。 | `spore_cough` |

道具效果建议：

- `蓝伞菌盖`：剧情中可作为解毒/稳定材料；战斗中可恢复少量 HP 或清除轻微孢毒。

#### 选择 F：询问伙伴判断

```ts
choiceId: 'ask_companion_judgement'
label: '让一名伙伴判断下一步行动'
check: none
repeatable: false
```

进入二级选择：

| 伙伴 | 反馈 | 奖励/状态 |
|---|---|---|
| 瑟琳 | 她认为封印脉冲正在逆向泄出，源头必在堡垒。 | `clue_spores_follow_seal_pulse`；瑟琳信任 +2 |
| 艾琳 | 她认为受害者仍残留意识，不能把所有孢化者都当怪物。 | 艾琳信任 +2；结局 A 隐藏分 +1 |
| 布洛克 | 他指出孢群迁移路线不自然，像被驱赶。 | 布洛克信任 +2；骨柱湿地生态检定 +1 |
| 凯娅 | 她建议别追最亮的光，先找“有人试图藏起来的路”。 | 凯娅信任 +2；后续路线选择显示“矮人旧排水渠”提示 |

### 3.6 离开浅滩

显示条件：

- `blueShoalInvestigationActions >= 2` 或玩家主动选择离开。

按钮：

```ts
choiceId: 'leave_blue_shoal'
label: '离开蓝伞浅滩，继续向骨柱湿地前进'
next: 'route-to-bone-marsh'
```

离开叙事：

蓝伞浅滩的光被远远甩在身后时，那些破裂菌盖仍像潮水一样一明一暗。队伍没有人再把这次袭击当成单纯的野兽暴动。  
你们已经看见了更深处的手。它藏在孢海、黑石、失联记录和那些会模仿人声的菌丝背后。  
前方，骨柱湿地的轮廓从雾中升起，像一排排倒插在地底的白色肋骨。

---

## 4. 节点二：前往骨柱湿地的路线选择

### 4.1 节点信息

```ts
id: 'route-to-bone-marsh'
title: '前往骨柱湿地：雾中的路线'
background: '/assets/scenes/spore-sea-route.webp'
```

### 4.2 剧情目标

让玩家选择进入骨柱湿地的方式。路线选择不阻断主线，但会影响：

- 入场损耗
- 后续调查加成
- 是否获得隐藏道具
- 伙伴信任变化
- 骨柱湿地战前可选行动

### 4.3 入场剧情文本

孢海的地面不像真正的地面。每走几步，靴底都会陷入柔软菌毯，下面传来细小的空响，仿佛你们踩在一层覆盖深井的皮肤上。  
尼布留下的浅层标记在这里变得稀疏：几枚发光铆钉钉在岩壁和石桩上，指向不同方向。  
布洛克抹掉铆钉旁的孢尘，皱眉道：“四条路，都能到骨柱湿地。问题是，你想完整地到，还是想带点值钱东西到。”  
凯娅笑了一下：“通常这两个目标可以同时完成，只是需要一点运气。”

### 4.4 分支选择

#### 路线 A：沿尼布标记的浅滩桩道前进

```ts
choiceId: 'route_marked_stakes'
label: '沿尼布留下的发光桩道前进'
check: { skill: '观察', attribute: 'wis', dc: 10 }
```

| 结果 | 剧情 | 奖励/状态 |
|---|---|---|
| 成功以上 | 队伍避开大部分菌毯陷坑，安全抵达湿地外缘。 | `route_to_bone_marsh = 'marked_stakes'`；全队无损耗；艾琳信任 +1 |
| 部分成功 | 走错一小段，但及时修正。 | `route_to_bone_marsh = 'marked_stakes'`；第一次骨柱湿地检定 -1 |
| 失败/大失败 | 标记被孢尘覆盖，队伍绕远。 | `route_to_bone_marsh = 'marked_stakes'`；队伍疲劳 |

特点：最安全，但隐藏奖励少。

#### 路线 B：穿过矮人旧排水渠

```ts
choiceId: 'route_dwarf_drain'
label: '从矮人旧排水渠绕入湿地'
check: { skill: '开锁', attribute: 'dex', dc: 13 }
assist: ['凯娅']
```

可见条件：

- 默认可见；若此前询问凯娅，按钮描述增加“凯娅认为这里可能有旧门禁”。

| 结果 | 剧情 | 奖励/状态 |
|---|---|---|
| 大成功 | 玩家打开旧闸门，还找到一枚地底堡垒旧徽章。 | `route_to_bone_marsh = 'dwarf_drain'`；`item_fortress_emblem_fragment +1`；凯娅信任 +4 |
| 成功 | 队伍从排水渠绕过部分孢海。 | `route_to_bone_marsh = 'dwarf_drain'`；骨柱湿地首个陷阱检定 +2 |
| 部分成功 | 闸门打开，但发出刺耳声音。 | `route_to_bone_marsh = 'dwarf_drain'`；后续战斗敌方第一轮多 1 个小怪或警戒提高 |
| 失败 | 闸门卡死，只能强行挤过。 | `route_to_bone_marsh = 'dwarf_drain'`；玩家/前排轻微受伤 |
| 大失败 | 旧管道坍塌。 | 队伍疲劳；凯娅信任 -2 |

#### 路线 C：走菌毯脊线，观察孢群迁徙

```ts
choiceId: 'route_fungal_ridge'
label: '沿菌毯脊线前进，观察孢群迁徙方向'
check: { skill: '生态', attribute: 'wis', dc: 13 }
assist: ['布洛克']
```

| 结果 | 剧情 | 奖励/状态 |
|---|---|---|
| 大成功 | 玩家判断出孢群正围绕地底堡垒形成环流。 | `route_to_bone_marsh = 'fungal_ridge'`；`clue_spores_follow_seal_pulse`；`item_active_spore_sample +1`；布洛克信任 +5 |
| 成功 | 玩家获得第二份活性样本或迁徙线索。 | `item_active_spore_sample +1`；布洛克信任 +3 |
| 部分成功 | 样本有用，但队伍吸入孢尘。 | `item_active_spore_sample +1`；`spore_cough` |
| 失败 | 菌毯脊线突然塌陷，队伍被迫绕路。 | 队伍疲劳；布洛克信任 -1 |
| 大失败 | 玩家踩碎幼生菌巢。 | 布洛克信任 -4；后续骨柱湿地敌意提高 |

#### 路线 D：攀过断裂缆索

```ts
choiceId: 'route_broken_cable'
label: '借助断裂秘银缆索横穿裂隙'
check: { skill: '运动', attribute: 'str', dc: 14 }
```

| 结果 | 剧情 | 奖励/状态 |
|---|---|---|
| 大成功 | 队伍快速抵达高处，还取下一段秘银缆丝。 | `route_to_bone_marsh = 'broken_cable'`；`item_mithril_cable_fiber +1`；瑟琳信任 +2 |
| 成功 | 队伍节省时间，从高处看清湿地布局。 | `route_to_bone_marsh = 'broken_cable'`；骨柱湿地地图类行动 +2 |
| 部分成功 | 有人险些滑落。 | `route_to_bone_marsh = 'broken_cable'`；前排轻伤 |
| 失败 | 缆索剧烈震动，队伍被迫跳下。 | 队伍疲劳；下一场战斗先攻 -1 |
| 大失败 | 缆索回响引来远处拟声。 | `mimic_voice_haunted`；下一次抗拟声检定劣势 |

---

## 5. 节点三：骨柱湿地调查

### 5.1 节点信息

```ts
id: 'bone-pillar-marsh-investigation'
title: '骨柱湿地：会呼吸的白骨林'
background: '/assets/scenes/bone-pillar-marsh.webp'
```

### 5.2 剧情目标

骨柱湿地是进入第三远征队营地前的关键调查区。这里要让玩家意识到：

- 骨柱不是普通尸骨，而是封印系统失败后的“生物化支撑柱”。
- 拟声菌团会用熟人声音引诱队伍。
- 是否焚烧/封闭菌巢会影响布洛克和后续战斗。
- 玩家可以获得第二/第三份活性孢子样本。

### 5.3 入场剧情文本

骨柱湿地没有水声，却有潮声。  
一根根苍白骨柱从菌毯中伸出，有些像肋骨，有些像断裂的塔基。青绿色孢光沿着骨缝缓慢上升，抵达顶端后又像雾一样散开。  
远处传来人声。先是尼布的声音，接着是某个黑缆守卫的咳嗽，最后甚至像是你们队伍中某个人在叫你的名字。  
艾琳握紧圣徽：“不要立刻回应。”  
凯娅的匕首已经滑进掌心：“终于开始像个陷阱了。”

### 5.4 玩法结构

建议给玩家 **2 次湿地行动**，然后进入战前选择。

```ts
sceneState: {
  boneMarshActions: 0,
  boneMarshMaxActions: 2
}
```

### 5.5 分支选择

#### 选择 A：拓印骨柱铭文

```ts
choiceId: 'rubbing_bone_pillar'
label: '拓印骨柱上的黑石铭文'
check: { skill: '奥秘', attribute: 'int', dc: 13 }
assist: ['瑟琳']
onceOnly: true
```

| 结果 | 剧情 | 奖励/状态 |
|---|---|---|
| 大成功 | 铭文显示骨柱曾是封印冷却结构，后来被孢化侵占。 | `doc_bone_pillar_rubbing`；`clue_gatekeeper_not_evil`；瑟琳信任 +5 |
| 成功 | 玩家确认骨柱与地底堡垒封印系统有关。 | `doc_bone_pillar_rubbing`；瑟琳信任 +3 |
| 部分成功 | 拓印残缺，但可读出“冷却”“守门者”等词。 | `doc_bone_pillar_rubbing_damaged`；Boss 前奥秘行动 +1 |
| 失败 | 铭文被孢液覆盖，无法完整读取。 | 保底线索：骨柱不是天然形成 |
| 大失败 | 铭文短暂反噬，黑石脉冲刺痛手腕。 | `blackstone_headache`；下一次奥秘检定 -1 |

#### 选择 B：无视/对抗远处求救声

```ts
choiceId: 'resist_mimic_voice'
label: '判断远处求救声是真是假'
check: { skill: '洞察', attribute: 'wis', dc: 13 }
```

特殊加成：

- 若拥有 `clue_voice_mimic`：+3。
- 若拥有完整 `doc_patrol_record_03`：可把失败提升为部分成功。
- 若拥有 `mimic_voice_haunted`：劣势。

| 结果 | 剧情 | 奖励/状态 |
|---|---|---|
| 大成功 | 玩家反向利用拟声，判断菌团藏身方向。 | `bone_marsh_mimic_resisted = true`；战前可选“诱导拟声菌团暴露” |
| 成功 | 队伍不回应声音，安全绕开诱捕区。 | `bone_marsh_mimic_resisted = true` |
| 部分成功 | 队伍识破陷阱，但被声音干扰。 | `bone_marsh_mimic_resisted = true`；下一次检定 -1 |
| 失败 | 有人下意识回头，菌丝开始靠近。 | 后续战斗敌方获得先攻加成 |
| 大失败 | 拟声菌团准确模仿队友声音，队形被拉散。 | 后续战斗开场我方一名后排位置不利 |

#### 选择 C：采集活性孢子

```ts
choiceId: 'collect_marsh_spores'
label: '采集骨柱根部的活性孢子'
check: { skill: '生态', attribute: 'wis', dc: 12 }
assist: ['布洛克']
onceOnly: true
```

| 结果 | 奖励/状态 |
|---|---|
| 大成功 | `item_active_spore_sample +2`；布洛克信任 +5 |
| 成功 | `item_active_spore_sample +1`；布洛克信任 +3 |
| 部分成功 | `item_active_spore_sample +1`；`spore_cough` |
| 失败 | 获得 `item_unstable_spore_sample +1` |
| 大失败 | 触发小型孢囊，后续战斗敌人数量 +1 |

当 `active_spore_sample_count >= 3`：

- 设置 `brock_sample_promise_completed = true`
- 布洛克信任额外 +8
- 后续营地夜谈中布洛克会承认玩家“不是只会砍东西的外行”。

#### 选择 D：处理菌巢

```ts
choiceId: 'handle_fungal_nest'
label: '处理挡路的幼生菌巢'
check: 二级选择
onceOnly: true
```

二级分支：

##### D1：焚烧菌巢

```ts
label: '直接焚烧菌巢，快速清路'
check: { skill: '奥秘', attribute: 'int', dc: 12 }
```

| 结果 | 奖励/状态 |
|---|---|
| 成功以上 | `bone_marsh_nest_burned = true`；后续战斗敌方小怪 -1；布洛克信任 -6；艾琳信任 -2 |
| 失败 | 火焰引发孢尘爆燃；队伍受伤；布洛克信任 -8 |

说明：这是功利路线，降低战斗难度但伤害布洛克关系。

##### D2：封闭菌巢通气孔

```ts
label: '封闭菌巢通气孔，让它休眠'
check: { skill: '生态', attribute: 'wis', dc: 14 }
assist: ['布洛克']
```

| 结果 | 奖励/状态 |
|---|---|
| 大成功 | `bone_marsh_nest_sealed = true`；后续战斗敌方小怪 -1；布洛克信任 +6；获得 `item_active_spore_sample +1` |
| 成功 | `bone_marsh_nest_sealed = true`；布洛克信任 +4 |
| 部分成功 | `bone_marsh_nest_sealed = true`；队伍疲劳 |
| 失败 | 未能封住，后续战斗无变化 |

##### D3：绕开菌巢

```ts
label: '不冒险处理，绕开菌巢'
check: { skill: '潜行', attribute: 'dex', dc: 12 }
```

| 结果 | 奖励/状态 |
|---|---|
| 成功以上 | `bone_marsh_nest_ignored = true`；无战斗加成；凯娅信任 +2 |
| 失败 | 绕路耗时；后续战斗先攻 -1 |

---

## 6. 节点四：骨柱湿地战前选择

### 6.1 节点信息

```ts
id: 'prebattle-bone-marsh'
title: '战前行动：骨柱湿地的伏击'
nextBattle: 'battle-bone-marsh'
```

### 6.2 强制流程

这里必须沿用你已经设计的战前选择流程：

```text
一次战前选择行动 -> 骰子判定 -> AI续写 -> 进入战斗 -> 战斗胜利 -> 下一段剧情
```

注意：

- 战前行动固定只能选 1 个。
- 每个战前行动必须触发骰子判定。
- 判定后可以用重投道具，但最多一个。
- AI 续写后必须进入战斗，不得停在“等待 KP 回复”。

### 6.3 入场文本

骨柱之间的雾突然塌了下来。  
你们听见骨节摩擦般的声音从湿地深处传来，紧接着，几团拟声菌丝从骨柱背后滑出。更远处，一头披着苍白骨片的孢兽缓慢站起，背上的骨刺像一排浸在蓝光里的墓碑。  
这一次，它们没有乱冲。它们在等，像是被同一个心跳指挥。  
瑟琳压低声音：“还有时间做一个准备动作。只够一个。”

### 6.4 战前行动选项

#### 选项 A：占据骨柱高点

```ts
choiceId: 'pre_bone_take_high_ground'
label: '占据骨柱高点，抢先建立视野'
check: { skill: '运动', attribute: 'dex', dc: 13 }
```

| 结果 | 战斗效果 |
|---|---|
| 大成功 | 我方全员第一轮先攻 +3；远程/法术角色第一击命中 +2 |
| 成功 | 我方全员第一轮先攻 +2 |
| 部分成功 | 主角第一轮先攻 +2 |
| 失败 | 无加成 |
| 大失败 | 一名角色开场位置不利，第一轮闪避 -1 |

#### 选项 B：艾琳净化孢尘

```ts
choiceId: 'pre_bone_purify_spores'
label: '协助艾琳净化周围孢尘'
check: { skill: '宗教', attribute: 'wis', dc: 13 }
```

| 结果 | 战斗效果 |
|---|---|
| 大成功 | 全队获得 `spore_resistance`，前 2 回合免疫轻度孢毒；艾琳信任 +3 |
| 成功 | 全队前 1 回合免疫轻度孢毒 |
| 部分成功 | 主角/前排获得孢毒抗性 |
| 失败 | 无加成 |
| 大失败 | 净化阵被干扰，第一轮治疗效果 -1 |

#### 选项 C：布洛克布置菌囊诱饵

```ts
choiceId: 'pre_bone_brock_bait'
label: '让布洛克布置菌囊诱饵'
check: { skill: '生态', attribute: 'int', dc: 12 }
```

| 结果 | 战斗效果 |
|---|---|
| 大成功 | 敌方开场聚集，第一轮受到范围技能伤害 +20%；布洛克信任 +3 |
| 成功 | 一名小怪开场进入易伤状态 |
| 部分成功 | 敌方第一轮移动下降 |
| 失败 | 无加成 |
| 大失败 | 诱饵误导队伍，敌方先攻 +1 |

若 `bone_marsh_nest_burned = true`，布洛克会冷淡地说“你现在又想听我的了？”该选项可用但无信任奖励。

#### 选项 D：凯娅拆除菌丝陷阱

```ts
choiceId: 'pre_bone_kaia_trap'
label: '让凯娅拆除骨柱间的菌丝陷阱'
check: { skill: '开锁', attribute: 'dex', dc: 14 }
```

| 结果 | 战斗效果 |
|---|---|
| 大成功 | 移除敌方“缠绕陷阱”机制；凯娅信任 +4 |
| 成功 | 敌方第一次缠绕失败 |
| 部分成功 | 主角免疫第一次缠绕 |
| 失败 | 无加成 |
| 大失败 | 凯娅被迫后撤，第一轮无法提供辅助 |

#### 选项 E：瑟琳读取黑石脉冲

```ts
choiceId: 'pre_bone_serin_pulse'
label: '协助瑟琳读取黑石脉冲节奏'
check: { skill: '奥秘', attribute: 'int', dc: 14 }
```

| 结果 | 战斗效果 |
|---|---|
| 大成功 | 揭示骨柱孢兽弱点；Boss 类敌人开场护甲 -2；瑟琳信任 +4 |
| 成功 | 骨柱孢兽第一回合受到命中 +2 |
| 部分成功 | 第一轮显示敌方弱点提示 |
| 失败 | 无加成 |
| 大失败 | 黑石噪音反噬，主角第一轮命中 -1 |

### 6.5 战斗配置建议

```ts
battleId: 'battle-bone-marsh'
enemies: [
  'enemy_bone_beast',
  'enemy_fungal_mimic',
  'enemy_spore_crawler'
]
background: '/assets/battle/maps/bone-marsh-battle.webp'
onVictory: 'after-battle-bone-marsh'
```

---

## 7. 节点五：骨柱湿地战后

### 7.1 节点信息

```ts
id: 'after-battle-bone-marsh'
title: '骨柱湿地：沉默后的回声'
entryCondition: battle_bone_marsh_result === 'win'
```

### 7.2 战后文本

最后一只拟声菌团在骨柱下崩散时，它没有发出怪物的叫声。  
它用一个陌生士兵的声音说：“门……不是从外面开的。”  
随后声音像被水吞没一样消失，只剩下湿地里缓慢升起的孢光。  
瑟琳跪在一块黑石残片旁，脸色苍白：“这句话可能是真的。地心之门的封印，正在被内部命令改写。”  
雾散开一线，你们终于看见远处倾斜的帐杆、断裂的旗帜和被菌毯半吞没的补给箱。第三远征队的营地到了。

### 7.3 固定奖励

战斗胜利后自动发放：

```ts
flags.bone_marsh_battle_done = true;
items += ['item_bone_spore_core'];
questLog += '已穿过骨柱湿地，发现第三远征队营地。';
next = 'third-expedition-camp';
```

可选额外奖励：

- 若 `bone_marsh_mimic_resisted = true`：获得线索 `clue_mimic_voice_pattern`。
- 若 `bone_marsh_nest_sealed = true`：布洛克信任 +3。
- 若 `bone_marsh_nest_burned = true`：布洛克战后台词冷淡，信任 -2。

---

## 8. 节点六：第三远征队营地调查

### 8.1 节点信息

```ts
id: 'third-expedition-camp'
title: '第三远征队营地：没有寄出的回信'
background: '/assets/scenes/third-expedition-camp.webp'
```

### 8.2 剧情目标

这是中后段最重要的调查节点。这里要提供大量档案、道具和结局条件。

玩家应逐步知道：

1. 第三远征队不是单纯被怪物杀死。
2. 他们发现黑石门卫仍在执行“守门”职责。
3. 远征队曾尝试重启封印，但部分成员被孢化/拟声影响。
4. 地心之门并非完全打开，而是在被迫“松动”。
5. 孢化不是完全不可逆，存在净化可能。

### 8.3 玩法结构

建议给玩家 **3 次营地调查行动**。关键主线线索至少保底获得 1 条，避免断线。

```ts
sceneState: {
  expeditionCampActions: 0,
  expeditionCampMaxActions: 3
}
```

每获得一个关键档案，`expedition_truth_level += 1`，上限 4。

关键档案包括：

- `doc_expedition_commander_final_log`
- `doc_expedition_medical_log`
- `item_fortress_entry_map`
- `doc_gatekeeper_protocol` 或 `doc_seal_maintenance_log`

### 8.4 入场剧情文本

第三远征队营地比想象中更安静。  
帐篷没有被彻底撕碎，补给箱也没有被洗劫一空。这里不像是遭遇了单纯的兽群袭击，倒更像是所有人都在某一刻同时停下手里的事，然后朝同一个方向走去。  
一口锅还架在熄灭的炉石上，里面的汤早已干成黑色薄壳。几封写到一半的信压在石块下面，纸边被孢液咬出细小缺口。  
艾琳轻声说：“他们离开的时候，应该还以为自己会回来。”  
凯娅扫了一眼营地中央的锁箱：“或者，他们知道自己回不来了，所以把真正重要的东西锁起来了。”

### 8.5 分支选择

#### 选择 A：搜索指挥帐篷

```ts
choiceId: 'search_command_tent'
label: '搜索远征队长的指挥帐篷'
check: { skill: '观察', attribute: 'int', dc: 12 }
onceOnly: true
```

| 结果 | 剧情 | 奖励/状态 |
|---|---|---|
| 大成功 | 找到完整最后日志、路线批注和队长私印。 | `doc_expedition_commander_final_log`；`item_commander_seal`；`expedition_truth_level +1`；瑟琳信任 +4 |
| 成功 | 找到最后日志。 | `doc_expedition_commander_final_log`；`expedition_truth_level +1` |
| 部分成功 | 日志被撕掉后半，但能读到“守门者仍在”。 | `doc_expedition_commander_final_log_damaged`；`expedition_truth_level +1` |
| 失败 | 只找到碎页。 | `clue_gatekeeper_not_evil` |
| 大失败 | 帐内孢丝触发，发出远征队长的声音。 | `mimic_voice_haunted`；凯娅信任 -1 |

远征队长最后日志建议全文：

> 第三远征队队长记录，降渊第十七日。  
> 我们抵达地底堡垒外环。堡垒没有完全沉默，至少“守门者”还在回应。  
> 问题是，它回应的不是我们。黑石门卫接收到了来自门内侧的伪造命令，正在把“封闭”误判为“迎接维护队返航”。  
> 如果我们失败，后来者必须记住：门卫不是敌人。真正的敌人藏在命令里，藏在那些会学人说话的东西里。  
> 不要急着摧毁守门者。除非你们已经没有别的选择。

#### 选择 B：检查医疗帐篷

```ts
choiceId: 'search_medical_tent'
label: '检查医疗帐篷和用药记录'
check: { skill: '医药', attribute: 'wis', dc: 12 }
assist: ['艾琳']
onceOnly: true
```

| 结果 | 剧情 | 奖励/状态 |
|---|---|---|
| 大成功 | 玩家发现孢化早期可被白枝烛芯和蓝伞菌盖稳定。 | `doc_expedition_medical_log`；`item_white_branch_candle_core`；`expedition_truth_level +1`；艾琳信任 +5 |
| 成功 | 找到用药记录，说明孢化并非立刻不可逆。 | `doc_expedition_medical_log`；`expedition_truth_level +1`；艾琳信任 +3 |
| 部分成功 | 记录残缺，但能读出“蓝伞菌盖”“白枝烛芯”。 | `doc_expedition_medical_log_damaged`；艾琳信任 +1 |
| 失败 | 医疗箱被污染，只能找到少量药品。 | `item_weak_antidote +1` |
| 大失败 | 误开污染药箱。 | `spore_cough`；艾琳信任 -2 |

若玩家拥有 `item_blue_cap_fungus`：

- 成功及以上额外获得 `purification_core_prepared = true`。
- 艾琳会说：“云苓给你的护身符和这些菌盖，也许真的能救人。”

#### 选择 C：查看地图桌

```ts
choiceId: 'search_map_table'
label: '查看被石块压住的堡垒地图'
check: { skill: '观察', attribute: 'int', dc: 11 }
onceOnly: true
```

| 结果 | 剧情 | 奖励/状态 |
|---|---|---|
| 大成功 | 找到堡垒入口残图，并标出隐蔽维护井。 | `item_fortress_entry_map`；`location_unlock_fortress_maintenance_well`；`expedition_truth_level +1` |
| 成功 | 找到堡垒入口残图。 | `item_fortress_entry_map`；`expedition_truth_level +1` |
| 部分成功 | 地图残缺，但能辨认外环入口。 | `item_fortress_entry_map_damaged` |
| 失败 | 地图被孢液破坏，只能确认堡垒大方向。 | 保底推进主线 |
| 大失败 | 地图下藏着拟声菌丝。 | 下一场景第一次检定 -1 |

#### 选择 D：打开远征队锁箱

```ts
choiceId: 'open_expedition_lockbox'
label: '打开远征队留下的封蜡锁箱'
check: { skill: '开锁', attribute: 'dex', dc: 14 }
assist: ['凯娅']
onceOnly: true
```

| 结果 | 剧情 | 奖励/状态 |
|---|---|---|
| 大成功 | 锁箱无损打开，里面有堡垒徽章、调律叉和补给。 | `item_fortress_emblem`；`item_blackstone_tuning_fork`；`item_healing_potion +1`；凯娅信任 +5 |
| 成功 | 找到堡垒徽章和调律叉。 | `item_fortress_emblem`；`item_blackstone_tuning_fork`；凯娅信任 +3 |
| 部分成功 | 打开锁箱但损坏内部一部分材料。 | `item_fortress_emblem`；`item_blackstone_tuning_fork_damaged` |
| 失败 | 锁箱打不开，凯娅可以强拆但会损坏内容。 | 二次选择：强拆获得 `item_fortress_emblem_damaged`，凯娅信任 -1；放弃则无奖励 |
| 大失败 | 触发旧式警报。 | 后续堡垒外环守卫机制警戒 +1 |

#### 选择 E：修复远征队通讯器

```ts
choiceId: 'repair_expedition_communicator'
label: '尝试修复损坏的远征队通讯器'
check: { skill: '奥秘', attribute: 'int', dc: 15 }
assist: ['瑟琳']
onceOnly: true
```

| 结果 | 剧情 | 奖励/状态 |
|---|---|---|
| 大成功 | 通讯器播放最后通信，提到“门卫真名：阿格洛恩”。 | `gatekeeper_true_name_known = true`；`doc_last_transmission`；瑟琳信任 +5 |
| 成功 | 播放残缺通信，提到“真名指令可以覆盖伪造命令”。 | `doc_last_transmission_damaged`；Boss 前“呼唤真名”检定 +2 |
| 部分成功 | 只能听见“真名”“守门者协议”。 | `clue_true_name_command` |
| 失败 | 通讯器彻底烧毁。 | 无奖励 |
| 大失败 | 黑石噪音冲击精神。 | `blackstone_headache` |

#### 选择 F：安葬远征队遗骸

```ts
choiceId: 'bury_expedition_dead'
label: '协助艾琳安葬远征队遗骸'
check: { skill: '宗教', attribute: 'wis', dc: 12 }
assist: ['艾琳']
onceOnly: true
```

| 结果 | 剧情 | 奖励/状态 |
|---|---|---|
| 大成功 | 安魂后，一枚白枝圣徽从遗骸中发光。 | `item_white_branch_candle_core`；艾琳信任 +6；结局 A 隐藏分 +1 |
| 成功 | 安葬完成，队伍士气恢复。 | 艾琳信任 +4；全队移除轻微疲劳 |
| 部分成功 | 仪式被孢风打断，但基本完成。 | 艾琳信任 +2 |
| 失败 | 无法完成仪式。 | 艾琳信任 -1 |
| 大失败 | 拟声菌团模仿死者声音干扰仪式。 | 艾琳信任 -3；`mimic_voice_haunted` |

### 8.6 离开营地

显示条件：

- `expeditionCampActions >= 3`
- 或玩家选择提前离开。

若 `expedition_truth_level >= 3`：

瑟琳总结：

> “现在可以确定了。地底堡垒不是完全失守。守门者还在，只是它收到的命令被污染了。”

若 `< 3`：

> “线索还不完整，但方向已经足够明确。继续拖下去，孢海会先找到我们。”

跳转：

```ts
next: 'camp-night-companion-scene'
```

---

## 9. 节点七：营地夜谈 / 伙伴剧情补强

### 9.1 节点信息

```ts
id: 'camp-night-companion-scene'
title: '远征队营地：短暂的火光'
background: '/assets/scenes/expedition-camp-night.webp'
```

### 9.2 剧情目标

在进入堡垒前补充伙伴情感线，避免后续只是打怪通关。玩家可选择与 1 名伙伴深入对话。若开发时间允许，可以允许 2 次夜谈。

### 9.3 入场文本

夜晚在地底没有真正降临，只是孢光变得更冷。  
你们在第三远征队留下的石圈里点起一小团火。火焰不高，却足够让每个人的影子落在帐篷残布上。  
远处的骨柱湿地偶尔传来细微声响，但没有人再把它误认为求救。  
明天，你们就要进入地底堡垒。今晚，队伍里每个人似乎都有话想说。

### 9.4 夜谈选择

#### 选择 A：与艾琳谈谈她为何成为修女

```ts
choiceId: 'night_talk_eileen'
label: '与艾琳谈谈她为何成为修女'
check: none
```

剧情要点：

- 艾琳并非从小就温柔坚定。
- 她曾在一次孢灾中失去亲人/同伴，被静默神殿收留。
- 成为修女不是因为她不害怕死亡，而是因为她不想再让死者只剩下“失踪记录”。
- 她加入队伍，是因为地底堡垒的失联者也应该被记住。

奖励：

```ts
relationships.eileen += 6;
flags.eileen_backstory_known = true;
items += ['item_eileen_white_thread_charm']; // 白线护符，可在一次剧情精神/恐惧检定中 +2
```

艾琳台词示例：

> “很多人以为修女是离死亡很远的人。其实不是。我们只是站得太近了，所以必须学会不移开眼睛。”

#### 选择 B：与布洛克核对采样承诺

```ts
choiceId: 'night_talk_brock'
label: '与布洛克核对活性孢子样本'
check: none
```

若 `active_spore_sample_count >= 3`：

奖励：

```ts
relationships.brock += 8;
items += ['item_brock_spore_filter']; // 下一次孢毒相关检定 +2
flags.brock_sample_promise_completed = true;
```

布洛克台词：

> “行，你没把孢海当成一堆该烧掉的烂蘑菇。能活着回去的话，我请你喝一杯不掺水的。”

若不足 3：

```ts
relationships.brock += 2;
```

台词：

> “还差点样本。不过算了，你至少知道自己脚下踩的是活东西，不是背景板。”

#### 选择 C：与凯娅谈谈她为什么愿意跟来

```ts
choiceId: 'night_talk_kaia'
label: '与凯娅谈谈她为什么愿意跟来'
check: none
```

剧情要点：

- 凯娅表面上只谈筹码和利息。
- 她实际知道黑市很多人靠堡垒物资活着，地心之门一旦出事，底层先死。
- 她不信公会和城防，但愿意相信“能把话说到最后的人”。

奖励：

```ts
relationships.kaia += 6;
flags.kaia_backstory_known = true;
items += ['item_kaia_spare_lockpick']; // 一次开锁/陷阱剧情检定 +2
```

凯娅台词：

> “别误会，我不是突然变成好人了。我只是讨厌有人把整座城当成可以抵押的筹码。”

#### 选择 D：与瑟琳讨论逆钟学派和封印

```ts
choiceId: 'night_talk_serin'
label: '与瑟琳讨论逆钟学派和封印'
check: none
```

剧情要点：

- 逆钟学派研究“让错误的瞬间倒退一点”。
- 瑟琳不是万能法师，她只能争取一个修正错误的窗口。
- 最终结局 C“逆钟锚定”需要理解她的方法。

奖励：

```ts
relationships.serin += 6;
flags.reverse_clock_method_known = true;
items += ['item_reverse_clock_chalk']; // Boss 前奥秘/封印检定 +2
```

瑟琳台词：

> “我们不能让一千年前的封印重新开始。但也许可以让它记起，自己原本应该停在哪里。”

### 9.5 离开夜谈

跳转：

```ts
next: 'fortress-outer-ring'
```

---

## 10. 节点八：地底堡垒外环

### 10.1 节点信息

```ts
id: 'fortress-outer-ring'
title: '地底堡垒外环：沉默的门禁'
background: '/assets/scenes/fortress-outer-ring.webp'
```

### 10.2 剧情目标

玩家抵达地底堡垒。这里不是普通魔王城，而是古代封印设施/军事堡垒。入口方式应体现之前道具与选择的价值。

### 10.3 入场文本

地底堡垒从孢海尽头升起时，没有任何号角，也没有守卫喝问。  
它只是沉默地横在深处，像一块被黑暗浸透的巨骨。堡垒外墙由黑石与旧铜铆接而成，表面爬满青绿色菌丝。每隔数十步，就有一座已经熄灭的符文塔。  
正门仍然完整。门上刻着三英雄时代的誓词：  
“此门不开，深渊不入；此城不退，众生不坠。”  
然而誓词下方，有新的菌丝正在组成另一行扭曲文字。它们像是在模仿命令。

### 10.4 入口选择

该节点选择一个入口方式。不同方式进入同一个后续节点，但影响资源/警戒/奖励。

#### 入口 A：使用黑缆守卫徽章接近正门

```ts
choiceId: 'enter_with_black_cable_badge'
label: '使用黑缆守卫徽章接近正门门禁'
check: { skill: '交涉', attribute: 'cha', dc: 13 }
visibleWhen: hasItem('item_black_cable_badge') || hasItem('item_black_cable_badge_damaged')
```

| 结果 | 奖励/状态 |
|---|---|
| 大成功 | 门禁承认临时权限；进入时获得 `doc_gate_access_log`；警戒 -1 |
| 成功 | 正门开启一道缝；正常进入 |
| 部分成功 | 门禁迟疑，进入但触发轻微警戒 |
| 失败 | 门禁拒绝，转入强行破门/绕路二选一 |
| 大失败 | 门禁把队伍识别为污染体；下一节点第一轮机关伤害 |

#### 入口 B：根据堡垒入口残图寻找维护井

```ts
choiceId: 'enter_maintenance_well'
label: '根据堡垒入口残图寻找维护井'
check: { skill: '观察', attribute: 'int', dc: 12 }
visibleWhen: hasItem('item_fortress_entry_map') || hasItem('item_fortress_entry_map_damaged')
```

| 结果 | 奖励/状态 |
|---|---|
| 大成功 | 找到维护井和隐藏补给箱。获得 `item_old_fortress_supply +1`；凯娅信任 +3 |
| 成功 | 从维护井安全进入 |
| 部分成功 | 入口狭窄，队伍疲劳 |
| 失败 | 维护井坍塌，改走外墙裂缝 |
| 大失败 | 触发旧式清理喷雾，轻微受伤 |

#### 入口 C：让凯娅破解外墙旧锁

```ts
choiceId: 'enter_kaia_lock'
label: '让凯娅破解外墙旧锁'
check: { skill: '开锁', attribute: 'dex', dc: 15 }
assist: ['凯娅']
```

| 结果 | 奖励/状态 |
|---|---|
| 大成功 | 无声进入，并额外获得 `item_fortress_side_key`；凯娅信任 +5 |
| 成功 | 无声进入 |
| 部分成功 | 进入但锁芯断裂，无法回头 |
| 失败 | 锁打不开，必须改走正门或维护井 |
| 大失败 | 旧锁反噬，凯娅轻伤；凯娅信任 -2 |

#### 入口 D：强行破开外墙菌丝

```ts
choiceId: 'enter_force_wall'
label: '强行破开外墙菌丝'
check: { skill: '运动', attribute: 'str', dc: 14 }
```

| 结果 | 奖励/状态 |
|---|---|
| 大成功 | 快速破墙进入；布洛克信任 +1；警戒 +1 |
| 成功 | 破墙进入；警戒 +1 |
| 部分成功 | 破墙但队伍受轻伤；警戒 +1 |
| 失败 | 破墙失败，触发孢尘；警戒 +2 |
| 大失败 | 外墙反震，前排受伤；警戒 +2 |

---

## 11. 节点九：堡垒内部调查

### 11.1 节点信息

```ts
id: 'fortress-inner-investigation'
title: '地底堡垒内部：仍在运行的遗迹'
background: '/assets/scenes/fortress-inner-hall.webp'
```

### 11.2 剧情目标

进入最终 Boss 前，玩家应在堡垒内获得：

- 黑石门卫协议
- 封印维护日志
- 三英雄誓约记忆
- 净化材料或战斗补给
- 对最终结局的判断依据

### 11.3 玩法结构

建议给玩家 **3 次堡垒调查行动**。

```ts
sceneState: {
  fortressInnerActions: 0,
  fortressInnerMaxActions: 3
}
```

如果玩家调查不足，也可以推进，但结局 A/C 条件更难满足。

### 11.4 入场文本

堡垒内部没有彻底死去。  
墙内的符文管线仍在一明一暗地闪烁，只是节奏乱得像病人的脉搏。黑石地面上有许多拖拽痕迹，一部分属于远征队，一部分属于更古老的东西。  
在大厅中央，一尊缺头的石像握着断剑，剑尖指向深处。石像底座上刻着一句几乎被菌丝覆盖的话：  
“守门者可沉睡，不可遗忘。”

### 11.5 分支选择

#### 选择 A：调查封印维护室

```ts
choiceId: 'investigate_seal_maintenance_room'
label: '调查封印维护室'
check: { skill: '奥秘', attribute: 'int', dc: 13 }
assist: ['瑟琳']
onceOnly: true
```

| 结果 | 奖励/状态 |
|---|---|
| 大成功 | `doc_seal_maintenance_log`；`clue_gatekeeper_not_evil`；`purification_core_prepared = true`；瑟琳信任 +5 |
| 成功 | `doc_seal_maintenance_log`；`clue_gatekeeper_not_evil`；瑟琳信任 +3 |
| 部分成功 | `doc_seal_maintenance_log_damaged`；Boss 前封印检定 +1 |
| 失败 | 只获得保底线索：门卫曾负责维持封印 |
| 大失败 | 黑石脉冲反噬，`blackstone_headache` |

维护日志建议摘要：

> 黑石门卫并非战斗兵器，而是封印维护核心的外部人格化执行体。  
> 当门内污染伪造维护指令时，门卫可能误判“开门”为“修复通道”。  
> 若需重置门卫，应使用：维护徽章、调律叉、真名协议、净化核心。四者不必全部具备，但缺失越多，风险越高。

#### 选择 B：读取黑石门卫协议

```ts
choiceId: 'read_gatekeeper_protocol'
label: '读取破损的黑石门卫协议'
check: { skill: '奥秘', attribute: 'int', dc: 14 }
onceOnly: true
```

加成：

- `item_blackstone_tuning_fork`：+2
- `gatekeeper_true_name_known`：+2
- `blackstone_headache`：-1

| 结果 | 奖励/状态 |
|---|---|
| 大成功 | `doc_gatekeeper_protocol`；`gatekeeper_true_name_known = true`；Boss 前解锁“呼唤守门者真名” |
| 成功 | `doc_gatekeeper_protocol`；Boss 前解锁“呼唤守门者真名”，但 DC 较高 |
| 部分成功 | `doc_gatekeeper_protocol_damaged`；Boss 前相关行动 +1 |
| 失败 | 只知道门卫有协议锁，但无法读取 |
| 大失败 | 协议噪音刺入意识，下一次奥秘检定劣势 |

门卫真名建议：**阿格洛恩**。  
含义可解释为古地底语“站在门前者”。

#### 选择 C：进入旧军械库

```ts
choiceId: 'enter_old_armory'
label: '进入旧军械库寻找可用补给'
check: { skill: '观察', attribute: 'int', dc: 12 }
onceOnly: true
```

成功后从以下奖励中选择 1 个，避免过强：

| 奖励 ID | 名称 | 效果 |
|---|---|---|
| `item_rune_guard_plate` | 符文护板 | 下一场战斗主角/前排获得临时护甲 |
| `item_blackstone_bolt` | 黑石弩矢 | Boss 战中一次攻击附加破盾效果 |
| `item_old_healing_kit` | 旧式治疗包 | 恢复/战斗内治疗道具 |
| `item_seal_flare` | 封印照明弹 | Boss 战第一轮降低敌方闪避 |

检定结果影响：

| 结果 | 奖励/状态 |
|---|---|
| 大成功 | 可选择 2 个奖励；凯娅信任 +2 |
| 成功 | 可选择 1 个奖励 |
| 部分成功 | 可选择 1 个奖励，但带 `old_item_unstable`，效果降低 |
| 失败 | 无可用装备，只获得少量金币/材料 |
| 大失败 | 触发旧机关，队伍轻伤 |

#### 选择 D：观看三英雄誓约残影

```ts
choiceId: 'watch_hero_oath_memory'
label: '触碰大厅中央的三英雄誓约残影'
check: { skill: '宗教', attribute: 'wis', dc: 13 }
assist: ['艾琳']
onceOnly: true
```

| 结果 | 奖励/状态 |
|---|---|
| 大成功 | 看见三英雄封门真相，获得结局 A/C 关键理解；艾琳、瑟琳信任 +4 |
| 成功 | `hero_oath_memory_seen = true`；`clue_gatekeeper_not_evil` |
| 部分成功 | 只看见守门者跪在门前的画面；结局 A 隐藏分 +1 |
| 失败 | 残影破碎，只听见“不要让它独自守门” |
| 大失败 | 残影中混入门内低语，`mimic_voice_haunted` |

残影内容建议：

> 三道身影站在地心之门前。不是胜利者的姿态，而是疲惫到几乎站不稳的人。  
> 其中一人将手按在黑石巨人的额前，说：“你不需要赢。你只需要记得自己为何不退。”  
> 黑石巨人缓缓跪下。门后的红光被一点点压回缝隙。  
> 最后一刻，你听见它用低沉的声音回答：“我记得。”

#### 选择 E：净化被污染的黑石核心

```ts
choiceId: 'purify_blackstone_core'
label: '尝试净化一枚被污染的黑石核心'
check: { skill: '宗教', attribute: 'wis', dc: 15 }
assist: ['艾琳', '瑟琳']
onceOnly: true
```

可见条件：

- 拥有 `item_white_branch_candle_core` 或 `doc_expedition_medical_log`
- 或 `wounded_guard_stabilized = true`

加成：

- `item_blue_cap_fungus`：+2
- `item_white_branch_candle_core`：+2
- `purification_core_prepared = true`：+2

| 结果 | 奖励/状态 |
|---|---|
| 大成功 | `item_purified_blackstone_core`；结局 A 强条件；艾琳信任 +6；瑟琳信任 +4 |
| 成功 | `item_purified_blackstone_core`；艾琳信任 +4 |
| 部分成功 | `item_unstable_purified_core`；最终选择可用但风险高 |
| 失败 | 净化失败，材料损耗 |
| 大失败 | 核心裂开，Boss 战黑石脉冲增强 |

---

## 12. 节点十：封印控制大厅

### 12.1 节点信息

```ts
id: 'seal-control-chamber'
title: '封印控制大厅：门前的守望者'
background: '/assets/scenes/seal-control-chamber.webp'
```

### 12.2 剧情目标

这里是 Boss 战前的叙事揭示：黑石门卫是被污染命令劫持的守门者，不是纯粹反派。

### 12.3 入场文本

封印控制大厅比整座堡垒都要巨大。  
地面上的圆形符文阵层层嵌套，像一只睁开的黑色眼睛。大厅尽头，地心之门仍然闭合着，却不再严丝合缝。门缝中透出极细的暗红光，像一条尚未愈合的伤口。  
而在门前，黑石门卫跪在那里。  
它的身体比城门更像城墙，肩上覆盖着破损古甲，青绿色菌丝从甲缝中垂落。每一次呼吸，整个大厅的符文都会跟着颤动。  
瑟琳的声音很轻：“它还在守门。”  
下一刻，门卫抬起头。它的眼中没有愤怒，只有一道被反复覆盖的命令：  
“维护队返航。开启外层封锁。迎接门内指令。”

### 12.4 剧情揭示逻辑

根据玩家调查程度，显示不同解释文本。

#### 若 `expedition_truth_level >= 3` 且有 `doc_seal_maintenance_log`

瑟琳明确说明：

> “门内的污染伪造了维护命令。门卫以为自己在修复封印，实际上它正在一点点打开门。”

#### 若调查不足

瑟琳只能推测：

> “它的命令被污染了。细节我还不能确定，但如果任由它继续执行，门会被打开。”

#### 若 `clue_gatekeeper_not_evil` 存在

艾琳补充：

> “它不是想放深渊进来。它只是被迫相信，开门才是守门。”

### 12.5 跳转

进入 Boss 战前行动：

```ts
next: 'prebattle-blackstone-gatekeeper'
```

---

## 13. 节点十一：黑石门卫 Boss 战前选择

### 13.1 节点信息

```ts
id: 'prebattle-blackstone-gatekeeper'
title: '战前行动：唤醒守门者'
nextBattle: 'battle-blackstone-gatekeeper'
```

### 13.2 强制流程

仍然是：

```text
一次战前选择行动 -> 骰子判定 -> AI续写 -> 进入 Boss 战 -> 胜利 -> 最终选择
```

战前行动只能选 1 个。

### 13.3 选项 A：用调律叉校准黑石脉冲

```ts
choiceId: 'pre_gatekeeper_tuning_fork'
label: '使用黑石调律叉校准大厅脉冲'
check: { skill: '奥秘', attribute: 'int', dc: 14 }
visibleWhen: hasItem('item_blackstone_tuning_fork') || hasItem('item_blackstone_tuning_fork_damaged')
```

| 结果 | Boss 战效果 |
|---|---|
| 大成功 | Boss 初始护盾 -30%；第一轮不会释放全场脉冲 |
| 成功 | Boss 初始护盾 -20% |
| 部分成功 | Boss 初始护盾 -10% |
| 失败 | 无效果 |
| 大失败 | 调律反噬，Boss 第一轮脉冲增强 |

### 13.4 选项 B：呼唤守门者真名

```ts
choiceId: 'pre_gatekeeper_true_name'
label: '呼唤黑石门卫的真名，试图覆盖伪造命令'
check: { skill: '宗教', attribute: 'wis', dc: 15 }
visibleWhen: flags.gatekeeper_true_name_known || hasDocument('doc_gatekeeper_protocol')
```

加成：

- `doc_gatekeeper_protocol`：+2
- `hero_oath_memory_seen`：+2
- 艾琳信任 >= 60：+1

| 结果 | Boss 战效果 |
|---|---|
| 大成功 | Boss 获得 `hesitation`，前 2 回合攻击力下降；结局 A 隐藏分 +2 |
| 成功 | Boss 第一回合行动延迟；结局 A 隐藏分 +1 |
| 部分成功 | Boss 开场出现短暂清醒台词，但无明显战斗削弱 |
| 失败 | 无效果 |
| 大失败 | 门内低语抢先回应，Boss 开场攻击 +1 |

Boss 短暂清醒台词：

> “我……记得……门不可开……”

### 13.5 选项 C：破坏黑根中继

```ts
choiceId: 'pre_gatekeeper_break_black_root'
label: '破坏连接门卫背后的黑根中继'
check: { skill: '运动', attribute: 'str', dc: 15 }
```

加成：

- `item_black_root_fragment`：+2，因为玩家理解黑根结构。
- `item_blackstone_bolt`：可以把部分成功提升为成功。

| 结果 | Boss 战效果 |
|---|---|
| 大成功 | 禁用 Boss 召唤小怪机制；Boss 护甲 -1 |
| 成功 | Boss 第一次召唤失败 |
| 部分成功 | Boss 召唤小怪数量 -1 |
| 失败 | 无效果 |
| 大失败 | 黑根反卷，主角第一回合受到束缚 |

### 13.6 选项 D：布置净化核心

```ts
choiceId: 'pre_gatekeeper_purified_core'
label: '将净化黑石核心布置到封印阵边缘'
check: { skill: '医药', attribute: 'wis', dc: 14 }
visibleWhen: hasItem('item_purified_blackstone_core') || hasItem('item_unstable_purified_core')
```

| 结果 | Boss 战效果/结局影响 |
|---|---|
| 大成功 | Boss 战中出现“清醒窗口”；结局 A 必定显示 |
| 成功 | 结局 A 显示条件大幅降低；Boss 第二阶段攻击 -1 |
| 部分成功 | 结局 A 可显示，但需要其他条件支持 |
| 失败 | 核心未稳定，战斗中无效果，但最终仍可尝试 |
| 大失败 | 核心裂开，结局 A 需要更高条件 |

### 13.7 选项 E：逆钟锚定

```ts
choiceId: 'pre_gatekeeper_reverse_clock_anchor'
label: '协助瑟琳布置逆钟锚定阵'
check: { skill: '奥秘', attribute: 'int', dc: 15 }
visibleWhen: flags.reverse_clock_method_known || relationships.serin >= 60
```

| 结果 | Boss 战效果/结局影响 |
|---|---|
| 大成功 | 解锁结局 C“逆钟锚定”；Boss 第一次濒死反扑被取消 |
| 成功 | 解锁结局 C；Boss 濒死反扑伤害降低 |
| 部分成功 | 结局 C 可见但标注高风险 |
| 失败 | 无效果 |
| 大失败 | 瑟琳受反噬，Boss 战中瑟琳辅助冷却增加 |

---

## 14. 节点十二：黑石门卫 Boss 战

### 14.1 战斗配置建议

```ts
battleId: 'battle-blackstone-gatekeeper'
title: 'Boss 战：黑石门卫'
background: '/assets/battle/maps/black-gate-boss.webp'
enemies: [
  'enemy_gatekeeper',
  'enemy_black_root_minion',
  'enemy_fungal_mimic'
]
onVictory: 'final-seal-choice'
```

### 14.2 Boss 阶段建议

#### 第一阶段：守门者误判

- 技能：黑石重击、封印脉冲、菌丝横扫。
- 目标：让玩家感受到它强，但不是邪恶。
- 台词：
  > “维护队返航。清理外部污染。”

#### 第二阶段：门内低语增强

触发条件：Boss HP <= 50%。

- 门缝红光增强。
- 召唤黑根小怪或拟声菌团。
- 若战前破坏黑根成功，召唤弱化/取消。

台词：

> 门内传来无数重叠的声音：“开门。你守得太久了。开门。”

#### 第三阶段：短暂清醒窗口

触发条件：

- Boss HP <= 20%
- 或玩家战前使用真名/净化核心成功

台词：

> 黑石门卫的动作停了一瞬。它巨大的手掌按在门前，像是在阻止自己继续执行命令。  
> “后来者……如果我忘记……请替我记得……”

战斗胜利后不应该写“门卫被彻底消灭”，而是写“门卫核心被击碎/压制，进入最终处置选择”。

---

## 15. 节点十三：最终封印选择

### 15.1 节点信息

```ts
id: 'final-seal-choice'
title: '最终选择：门前无人退后'
background: '/assets/scenes/final-seal-choice.webp'
entryCondition: battle_blackstone_gatekeeper_result === 'win'
```

### 15.2 入场文本

黑石门卫倒下时，整座大厅没有胜利的声音。  
它单膝跪在地心之门前，胸口核心裂开，青绿色菌丝和暗红光从裂缝里一起涌出。门缝比刚才更宽了一点，但仍没有完全打开。  
瑟琳踉跄着扶住符文柱：“还有一次机会。不是很多时间，但够我们做一个选择。”  
艾琳看着门卫裂开的核心，声音发紧：“它还没有完全消失。”  
布洛克握紧斧柄：“要砸就现在砸，要救也得现在救。”  
凯娅看向你：“这次没有稳赚的选项。你来定。”

### 15.3 结局条件计算

建议在进入最终选择时计算：

```ts
const truthScore = expedition_truth_level;
const mercyScore = Number(wounded_guard_stabilized)
  + Number(hero_oath_memory_seen)
  + Number(relationships.eileen >= 60)
  + Number(!bone_marsh_nest_burned);
const sealScore = Number(hasDocument('doc_seal_maintenance_log'))
  + Number(hasDocument('doc_gatekeeper_protocol'))
  + Number(hasItem('item_blackstone_tuning_fork'))
  + Number(hasItem('item_purified_blackstone_core'))
  + Number(flags.gatekeeper_true_name_known);
const sacrificeScore = Number(flags.reverse_clock_method_known)
  + Number(relationships.serin >= 60)
  + Number(hasItem('item_reverse_clock_chalk'));
```

### 15.4 最终选项 A：守门者仍在（较好结局）

```ts
choiceId: 'ending_guardian_remains'
label: '尝试净化门卫核心，让守门者继续守门'
ending: 'ending-A-guardian-remains'
visibleWhen:
  hasItem('item_purified_blackstone_core')
  || (truthScore >= 3 && sealScore >= 3 && mercyScore >= 2)
check: { skill: '宗教/奥秘', attribute: 'wis/int', dc: 15 }
```

结局要求：

- 推荐需要至少满足：
  - `doc_seal_maintenance_log`
  - `doc_gatekeeper_protocol` 或 `gatekeeper_true_name_known`
  - `item_purified_blackstone_core` 或 `wounded_guard_stabilized + doc_expedition_medical_log`

检定结果：

| 结果 | 结局 |
|---|---|
| 大成功/成功 | 进入 Ending A：守门者仍在 |
| 部分成功 | 进入 Ending A，但门卫沉睡，未来仍需维护 |
| 失败 | 转入 Ending E：强制暂封 |
| 大失败 | 转入 Ending D：门缝开启的坏结局 |

Ending A 文本：

> 你们没有把黑石门卫当作怪物处决。  
> 瑟琳重新校准封印阵，艾琳将白枝烛芯按入裂开的核心，布洛克把最后一份活性孢子样本倒进冷却槽，凯娅则咬着牙把那枚旧徽章卡回门卫胸口的凹槽。  
> 黑石门卫发出低沉到几乎听不见的声音：  
> “我……记得。”  
> 门缝中的红光一点点退去。它没有站起来，只是重新跪回门前，像一座终于想起职责的山。  
> 很久以后，逆穹悬城的人们仍会说起那一天：一支小队深入孢海，没有杀死守门者，而是把它从错误的命令中带了回来。  
> 地心之门仍旧关闭。守门者仍在。

CG 建议：

- 文件：`frontend/public/assets/scenes/ending-guardian-remains.webp`
- 画面：队伍背影剪影站在大厅前景，黑石门卫跪在中远景，地心之门闭合，青绿孢光和暖金封印光交织。
- 注意：不要直接贴角色立绘；角色应融入场景，有统一透视、光照、接触阴影。

奖励/记录：

```ts
ending = 'guardian_remains';
items += ['item_guardian_oath_shard'];
achievements += ['achievement_true_guardian'];
```

### 15.5 最终选项 B：斩断黑根（普通好结局）

```ts
choiceId: 'ending_cut_black_root'
label: '斩断黑根，彻底破坏污染源'
ending: 'ending-B-cut-black-root'
visibleWhen: always
check: { skill: '运动/攻击', attribute: 'str', dc: 13 }
```

结局说明：

- 这是默认可见结局。
- 玩家选择杀死/摧毁门卫核心，确保门不会继续被伪造命令打开。
- 城市安全，但守门者消失，封印未来需要人类重新维护。

检定结果：

| 结果 | 结局 |
|---|---|
| 成功以上 | Ending B：斩断黑根 |
| 部分成功 | Ending B，但封印出现裂痕，后续维护压力大 |
| 失败 | Ending E：强制暂封 |
| 大失败 | Ending D：门缝开启 |

Ending B 文本：

> 你选择不再冒险。  
> 黑根仍在门卫核心中扭动，门内的低语一遍遍模仿着你们熟悉的声音。再多犹豫一刻，它也许就会重新站起。  
> 于是你斩下最后一击。  
> 黑石核心碎裂，门卫眼中的青光彻底熄灭。与此同时，缠绕在地心之门上的黑根被连根扯断，暗红门缝猛地收缩，像一只被迫闭上的眼睛。  
> 逆穹悬城得救了。  
> 只是当你们离开大厅时，门前再也没有那个跪守千年的身影。

CG 建议：

- 文件：`frontend/public/assets/scenes/ending-cut-black-root.webp`
- 画面：黑根断裂，门缝闭合，黑石门卫残骸沉在中景，队伍背影离开。

奖励：

```ts
ending = 'cut_black_root';
items += ['item_cracked_gatekeeper_core'];
achievements += ['achievement_city_saved'];
```

### 15.6 最终选项 C：逆钟锚定（牺牲/高代价好结局）

```ts
choiceId: 'ending_reverse_clock_anchor'
label: '启动逆钟锚定，把封印状态倒回门卫失控前'
ending: 'ending-C-reverse-clock-anchor'
visibleWhen:
  flags.reverse_clock_method_known
  || flags.ending_unlocked_reverse_clock_anchor
  || sacrificeScore >= 2
check: { skill: '奥秘', attribute: 'int', dc: 16 }
```

结局说明：

- 这是瑟琳剧情线结局。
- 不是简单牺牲主角；建议设定为瑟琳留下一个长期锚点，短期无法回城，队伍必须承诺回来维护。
- 适合玩家没拿到完整净化材料，但理解逆钟方法且瑟琳信任高。

检定结果：

| 结果 | 结局 |
|---|---|
| 大成功 | Ending C：逆钟锚定，瑟琳保留归来可能 |
| 成功 | Ending C：瑟琳留在锚点中沉睡/维持封印 |
| 部分成功 | Ending E：暂封，但瑟琳受伤严重 |
| 失败 | Ending E 或 D，视 sealScore 决定 |
| 大失败 | Ending D：门缝开启 |

Ending C 文本：

> 瑟琳把逆钟粉末洒在封印阵边缘，银色符文逆着大厅里的黑石脉搏旋转。  
> “这不是让时间倒流。”她看向你，努力笑了一下，“只是让错误的那一刻，多犹豫一会儿。”  
> 你们把门卫核心、远征队日志和调律叉一同推入阵心。下一瞬，所有声音都被拉长：门内的低语、菌丝断裂声、伙伴的呼喊，以及黑石门卫最后一句“我记得”。  
> 当光芒散去，地心之门重新闭合。黑石门卫没有恢复，也没有彻底死去。它和瑟琳留下的逆钟锚点一起，停在门前某个被延长的瞬间。  
> 逆穹悬城得到了时间。  
> 而你们得到了一项新的约定：总有一天，要回来把她带回家。

CG 建议：

- 文件：`frontend/public/assets/scenes/ending-reverse-clock-anchor.webp`
- 画面：银色逆钟阵包裹门前区域，队伍背影站在光外，瑟琳不要画清晰正脸，可用剪影/光中轮廓。

奖励：

```ts
ending = 'reverse_clock_anchor';
items += ['item_reverse_clock_anchor_shard'];
achievements += ['achievement_borrowed_time'];
```

### 15.7 最终选项 D：门缝开启（坏结局）

```ts
ending: 'ending-D-gate-opens'
trigger:
  final check natural 1
  || failed Ending A/B/C with very low sealScore
  || player chooses reckless open/overload option if implemented
```

结局说明：

- 不建议作为主动“奖励”选项默认显示。
- 可作为连续失败/鲁莽选择的坏结局。
- 城市未立刻毁灭，但地心之门打开一道缝，逆穹悬城进入长期灾难。

Ending D 文本：

> 你们已经足够快了。  
> 但门内的声音更快。  
> 黑石核心在最后一次震动中裂成粉末，封印阵上所有符文同时倒转。地心之门没有完全敞开，只是打开了一道缝。  
> 可那已经足够。  
> 暗红色的风从门后涌出，吹灭大厅里所有青绿色孢光。远处，逆穹悬城的九条主缆同时发出低沉哀鸣。  
> 你们拖着伤痕回到城市时，人们仍在欢呼你们归来。没有人知道真正的灾难已经把手伸进门缝。  
> 直到第一场红色孢雨落下。

CG 建议：

- 文件：`frontend/public/assets/scenes/ending-gate-opens.webp`
- 画面：门缝暗红光压倒青绿孢光，队伍背影很小，城市主缆远景颤动。

状态：

```ts
ending = 'gate_opens';
achievements += ['achievement_red_spore_rain'];
```

### 15.8 最终选项 E：强制暂封（中性结局）

```ts
choiceId: 'ending_forced_seal'
label: '放弃净化，强制暂时封闭地心之门'
ending: 'ending-E-forced-seal'
visibleWhen: always
check: { skill: '奥秘/宗教', attribute: 'int/wis', dc: 12 }
```

结局说明：

- 玩家没有足够条件达成 A/C，或 B 检定失败但没坏到 D。
- 门被暂时封住，但污染没有根除，后续需要再远征。
- 适合作为“通关但不完美”的结局。

Ending E 文本：

> 你们没有足够材料修复守门者，也没有把握彻底斩断所有黑根。  
> 于是瑟琳选择最保守的办法：烧毁外层控制阵，把地心之门重新压回沉默。  
> 这不是胜利，更像是把一场坍塌暂时按住。  
> 门缝闭合了。黑石门卫也不再动弹。大厅重新安静下来，只是符文阵中仍有几处暗红色余光，像没有完全熄灭的炭。  
> 回到逆穹悬城后，赫尔曼宣布远征成功。人群欢呼，钟声回荡。  
> 但你们知道，真正的报告不会写在公告栏上。它会被放进公会最深处的档案柜，等待下一支愿意下潜的队伍打开。

CG 建议：

- 文件：`frontend/public/assets/scenes/ending-forced-seal.webp`
- 画面：门闭合但光线黯淡，守门者残骸沉默，队伍背影站在半暗中。

状态：

```ts
ending = 'forced_seal';
items += ['item_silent_gate_report'];
achievements += ['achievement_temporary_peace'];
```

---

## 16. 后日谈节点

### 16.1 节点信息

```ts
id: 'epilogue-return-to-city'
title: '后日谈：逆穹悬城的钟声'
background: '/assets/scenes/return-to-hanging-city.webp'
```

不同结局后可以复用一个后日谈节点，根据 `ending` 切换文本。

### 16.2 通用后日谈入场

当降渊缆梯重新升回逆穹悬城时，城市的灯火像倒悬星河一样铺在头顶。  
没有人能从你们的沉默里看出地底发生了什么。孩子们追着缆梯跑，商人们探头张望，黑缆守卫在人群前维持秩序。  
赫尔曼站在最前方，单片镜后的眼神第一次没有那么锋利。  
“报告。”他说。  
这一次，你们带回来的不只是报告。

### 16.3 按结局追加

#### Ending A 后日谈

- 赫尔曼承认守门者仍在。
- 艾琳推动建立“失联者安魂名册”。
- 布洛克获得活性样本研究许可。
- 凯娅把堡垒徽章转卖/收藏，但实际替玩家保管。
- 瑟琳整理封印维护方案。

奖励：

```ts
newGamePlusUnlockHint = '守门者路线已完成';
```

#### Ending B 后日谈

- 城市庆祝远征成功。
- 黑石门卫被列为“已牺牲的古代守卫”。
- 封印维护成为城防长期任务。
- 伙伴语气偏沉重但认可选择。

#### Ending C 后日谈

- 瑟琳暂时不归队。
- 公会保留她的位置。
- 玩家获得“回到地底堡垒”的长期目标。
- 适合为续作/二周目埋钩子。

#### Ending D 后日谈

- 城市表面欢迎远征队。
- 红色孢雨作为最后镜头。
- 伙伴台词短且压抑，不建议太长。

#### Ending E 后日谈

- 城市暂时安全。
- 档案封存。
- 赫尔曼要求准备第二次远征。

---

## 17. Codex 具体实现任务清单

### 17.1 数据层

新增或扩写剧情节点：

```ts
const POST_BLUE_SHOAL_STORY_NODES = [
  'after-battle-blue-shoal-expanded',
  'route-to-bone-marsh',
  'bone-pillar-marsh-investigation',
  'prebattle-bone-marsh',
  'after-battle-bone-marsh',
  'third-expedition-camp',
  'camp-night-companion-scene',
  'fortress-outer-ring',
  'fortress-inner-investigation',
  'seal-control-chamber',
  'prebattle-blackstone-gatekeeper',
  'final-seal-choice',
  'epilogue-return-to-city'
];
```

战斗节点：

```ts
'battle-bone-marsh'
'battle-blackstone-gatekeeper'
```

结局节点：

```ts
'ending-A-guardian-remains'
'ending-B-cut-black-root'
'ending-C-reverse-clock-anchor'
'ending-D-gate-opens'
'ending-E-forced-seal'
```

### 17.2 跳转层

必须确保：

```ts
onBlueShoalBattleVictory -> after-battle-blue-shoal-expanded
```

不要再跳到旧的简陋蓝伞浅滩战后线。

骨柱湿地战斗：

```ts
prebattle-bone-marsh -> battle-bone-marsh -> after-battle-bone-marsh
```

Boss 战：

```ts
prebattle-blackstone-gatekeeper -> battle-blackstone-gatekeeper -> final-seal-choice
```

### 17.3 背包/档案/线索层

所有新增 item/document/clue 必须进入现有背包系统。

- document：可查看全文。
- clue：可查看简短说明和关联档案。
- item：可查看说明，部分可使用。

建议给每个新增资源补 `suggestedFile`，没有素材时先用 default/clue/scroll 图标占位。

### 17.4 选择可见条件

根据已有 visibleWhen 机制实现：

- 有巡逻记录 → 骨柱湿地拟声检定加成。
- 有堡垒入口残图 → 显示维护井入口。
- 有黑石调律叉 → 显示调律叉战前行动。
- 有门卫协议/真名 → 显示呼唤真名战前行动。
- 有净化核心 → 显示结局 A 和净化核心战前行动。
- 瑟琳夜谈/逆钟方法 → 显示结局 C。

### 17.5 战前行动层

每个战前节点必须：

1. 只允许选择一次。
2. 选择后立即投骰。
3. 投骰结果支持重投道具。
4. 最终结果进入 AI 续写。
5. AI 续写完成后自动进入对应战斗。
6. 禁止出现“等待 KP 回复后卡住，几秒后强制进战斗”的情况。

实现上建议：

- 判定完成后先本地生成 `pendingBattleIntro`。
- AI 请求超时或失败时使用本地 fallback narration。
- 无论 AI 成功/失败，都由本地状态机进入战斗。
- 不要依赖 AI 返回 nextNode 才进入战斗。

### 17.6 结局层

最终选择显示逻辑：

- Ending B、E 默认显示。
- Ending A 需要净化/真相/封印条件。
- Ending C 需要逆钟/瑟琳条件。
- Ending D 通常不主动显示，由失败或鲁莽触发。

结局 CG 注意：

- 不要直接把角色立绘贴到背景上。
- 如果出现角色，应是“队伍背影剪影”或融入场景的小比例人物。
- 环境是主视觉，角色是次视觉。
- 光影、透视、接触阴影必须统一。

---

## 18. 推荐优先级

如果时间紧，按以下顺序实现：

### P0 必做

1. 蓝伞浅滩战后扩写节点。
2. 骨柱湿地调查 + 战前选择 + 战斗胜利跳转。
3. 第三远征队营地三项核心调查。
4. 堡垒内部核心档案。
5. Boss 战前选择。
6. 最终 3 个结局：A/B/E。

### P1 增强

1. 营地夜谈四名伙伴剧情。
2. 入口路线差异。
3. 结局 C 逆钟锚定。
4. 结局 D 坏结局。
5. 更多伙伴信任台词差异。

### P2 打磨

1. 每个档案全文。
2. 所有道具图标绑定。
3. 不同结局后日谈。
4. 成就系统。
5. 二周目/续作钩子。

---

## 19. 给 Codex 的最终执行要求

请基于当前重构后的代码实现以上剧情扩写。重点要求：

1. 复用现有 story/battle/inventory/document/clue/flag/relationship 架构，不要重写系统。
2. 蓝伞浅滩战斗胜利后必须进入 `after-battle-blue-shoal-expanded`，不要走旧战后线。
3. 每个剧情节点至少有 3 个可选行动，关键调查节点有行动次数限制。
4. 每条分支都要有明确的成功/部分成功/失败处理和状态奖励。
5. 主线关键线索失败时不得断线，必须给保底推进方式。
6. 战前选择严格遵循“一次战前选择行动 -> 骰子判定 -> AI续写 -> 进入战斗 -> 战斗胜利 -> 下一段剧情”。
7. 重投道具只适用于剧情检定，每次剧情检定最多使用一个。
8. AI 续写不能决定核心状态，只能根据本地判定结果补充叙事。
9. 新增道具、档案、线索必须能在背包/档案系统中查看。
10. 最终结局根据玩家收集的线索、道具、伙伴信任和关键 flag 显示。
11. 任何 AI 请求失败或超时，都必须有本地 fallback 文本，不能卡在“等待 KP 回复”。
12. 保持 TypeScript 构建、现有测试、前后端测试全部通过。

