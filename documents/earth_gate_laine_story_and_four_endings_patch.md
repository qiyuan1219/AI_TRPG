# 《地心之门》莱因剧情与四结局分流补丁（Codex 版）

> 目的：补上前一版剧情扩写中遗漏的关键人物“莱因”。莱因不能被删掉，因为他是“第三远征队真相”“黑石门卫协议”“最终四结局分流”的核心证人和剧情钥匙。  
> 接入方式：在现有蓝伞浅滩后主线中，插入/替换以下节点。优先复用现有 story node、choice、dice check、inventory、documents、flags、relationships、battle callback，不要重写剧情引擎。

---

## 1. 为什么必须有莱因

莱因的剧情功能如下：

1. **人证**：他是第三远征队幸存者，亲眼见到黑石门卫并非主动背叛，而是被“门内伪造命令”污染。
2. **权限钥匙**：他持有半损坏的黑缆守卫识别牌/堡垒门禁口令，可影响进入堡垒和 Boss 战前选择。
3. **道德抉择对象**：他处于孢化边缘，玩家如何对待他会影响“救赎/斩断/牺牲/暂封”四种结局倾向。
4. **结局分流锚点**：没有莱因，玩家只能凭档案判断；有莱因后，最终选择有了情感和证据支撑。

因此莱因不应是可删除 NPC，而应是蓝伞浅滩后到最终结局之间的关键剧情节点。

---

## 2. 四个正式结局重新定义

建议将上一版的五结局收束为“四个正式结局 + 一个失败态”。

| 结局 | 名称 | 类型 | 莱因作用 |
|---|---|---|---|
| Ending A | 守门者仍在 | 最好/真结局 | 需要莱因存活或留下完整证词，证明门卫可被唤醒与净化 |
| Ending B | 斩断黑根 | 普通好结局 | 莱因可提供污染源位置；即使无法救门卫，也能精准斩断黑根 |
| Ending C | 逆钟锚定 | 高代价好结局 | 莱因的记忆/识别牌可作为“失控前状态”的锚点之一 |
| Ending D | 强制暂封 | 中性结局 | 莱因死亡/证据不足时的保底通关结局 |

失败态“门缝开启”不建议算作正式四结局之一，而是最终检定大失败或鲁莽选择触发的 Bad End / Failure Ending。这样更符合“四个结局”的结构。

---

## 3. 新增/修改全局状态

```ts
flags: {
  // 莱因相关
  laine_found: boolean;
  laine_alive: boolean;
  laine_stabilized: boolean;
  laine_spore_worsened: boolean;
  laine_testimony_obtained: boolean;
  laine_full_testimony_obtained: boolean;
  laine_black_cable_badge_obtained: boolean;
  laine_knows_gatekeeper_name: boolean;
  laine_escort_to_camp: boolean;
  laine_left_behind: boolean;
  laine_mercy_killed: boolean;
  laine_joined_final_chamber: boolean;

  // 结局分数/条件
  guardian_mercy_score: number;      // 偏向 Ending A
  black_root_decisive_score: number; // 偏向 Ending B
  reverse_clock_anchor_score: number;// 偏向 Ending C
  forced_seal_score: number;         // 偏向 Ending D

  // 失败态
  gate_open_failure_triggered: boolean;
}
```

建议新增关系值：

```ts
relationships: {
  laine: number; // 初始 30，稳定/信任/保护可提升，逼问/放弃/伤害会下降
}
```

---

## 4. 新增道具、档案、线索

| 类型 | ID | 名称 | 作用 |
|---|---|---|---|
| item | `item_laine_black_cable_badge` | 莱因的黑缆识别牌 | 堡垒外环门禁、Boss 前真名协议、Ending A/C 条件 |
| item | `item_laine_bloodstained_gauntlet` | 莱因的染血护手 | 若莱因死亡，作为锚点材料；Ending C 条件之一 |
| document | `doc_laine_testimony` | 莱因的断续证词 | 证明门卫不是敌人；Ending A/B/C 条件 |
| document | `doc_laine_full_testimony` | 莱因的完整证词 | Ending A 强条件，降低最终净化 DC |
| clue | `clue_gatekeeper_order_forged` | 门卫命令被伪造 | 开启“净化/呼唤真名”路线 |
| clue | `clue_laine_heard_true_name` | 莱因听见守门者真名 | Boss 前“呼唤守门者真名”选项 |
| item | `item_laine_memory_splinter` | 莱因的记忆残片 | 若莱因孢化严重，作为逆钟锚定材料 |
| document | `doc_black_cable_last_order` | 黑缆最后命令 | 说明第三远征队曾试图撤离莱因，结果失败 |

---

## 5. 插入位置调整

原流程：

```text
after-battle-bone-marsh
  ↓
third-expedition-camp
  ↓
camp-night-companion-scene
  ↓
fortress-outer-ring
```

调整为：

```text
after-battle-bone-marsh
  ↓
third-expedition-camp
  ↓
laine-survivor-scene
  ↓
laine-stabilization-or-interrogation
  ↓
camp-night-companion-scene
  ↓
fortress-outer-ring
```

莱因不应出现在开局，也不应拖到最终大厅才出现。他最合适的位置是“第三远征队营地调查后”：玩家刚知道远征队失联，马上发现一个活人，冲击力最强。

---

## 6. 节点：发现莱因

### 6.1 节点信息

```ts
id: 'laine-survivor-scene'
title: '第三远征队营地：最后一个活人'
background: '/assets/scenes/third-expedition-camp-deep.webp'
entryCondition: flags.expedition_camp_found === true
```

### 6.2 入场剧情文本

你们准备离开营地时，凯娅忽然抬手示意所有人停下。  
风里有一道很轻的金属摩擦声。

不是孢兽，不是菌团，也不像黑石机关。那声音来自营地后方一座塌了一半的岩棚。几根断裂的黑缆插在岩壁里，像被巨力硬生生扯断的肋骨。

布洛克把斧头横在胸前：“有人。”

岩棚深处，一名重甲兵靠坐在石壁下。他的胸甲已经裂开，黑缆守卫的徽记被血和孢液糊成一团。半边肩膀被青绿色菌丝缠住，菌丝随着他的呼吸缓慢收缩。

他听见脚步声，猛地抬起头，眼神先是涣散，随后像从噩梦里挣扎出来一样锁定你们。

“别……别回应它。”他声音嘶哑，“它会用你认识的声音叫你。”

艾琳脸色一变：“他还活着。”

瑟琳看向他胸口残破的识别牌：“黑缆守卫，莱因。”

### 6.3 第一次选择

玩家需要决定如何接近莱因。该选择影响莱因信任、病情和后续结局条件。

#### 选择 A：让艾琳先稳定伤势

```ts
choiceId: 'laine_stabilize_first'
label: '让艾琳先稳定莱因的伤势'
check: { skill: '医药/宗教', attribute: 'wis', dc: 13 }
assist: ['艾琳']
```

| 结果 | 剧情效果 | 状态效果 |
|---|---|---|
| 大成功 | 艾琳压制孢化，莱因短暂清醒并主动交出识别牌。 | `laine_alive = true`; `laine_stabilized = true`; `relationships.laine +20`; `item_laine_black_cable_badge`; `guardian_mercy_score +2`; 艾琳信任 +5 |
| 成功 | 莱因伤势稳定，可以断续交流。 | `laine_alive = true`; `laine_stabilized = true`; `relationships.laine +15`; `doc_laine_testimony`; `guardian_mercy_score +1` |
| 部分成功 | 暂时止住伤势，但孢化仍在恶化。 | `laine_alive = true`; `laine_spore_worsened = true`; `relationships.laine +8`; `doc_laine_testimony_damaged` |
| 失败 | 稳定失败，莱因痛苦挣扎，但仍可交流几句。 | `laine_alive = true`; `laine_spore_worsened = true`; `relationships.laine +3`; 获得保底线索 `clue_gatekeeper_order_forged` |
| 大失败 | 孢丝反扑，莱因误以为队伍是拟声幻觉。 | `laine_alive = true`; `laine_spore_worsened = true`; `relationships.laine -5`; 下一次说服莱因 DC +2 |

#### 选择 B：先询问他发生了什么

```ts
choiceId: 'laine_question_first'
label: '先询问莱因，弄清远征队发生了什么'
check: { skill: '交涉/威吓', attribute: 'cha', dc: 12 }
```

| 结果 | 剧情效果 | 状态效果 |
|---|---|---|
| 大成功 | 莱因强撑着说出完整经过：门卫被伪造命令污染，不是敌人。 | `doc_laine_full_testimony`; `laine_full_testimony_obtained = true`; `clue_gatekeeper_order_forged`; `relationships.laine +12`; `guardian_mercy_score +2`; `black_root_decisive_score +1` |
| 成功 | 莱因说出关键证词。 | `doc_laine_testimony`; `laine_testimony_obtained = true`; `clue_gatekeeper_order_forged`; `relationships.laine +8` |
| 部分成功 | 莱因只说出“门卫收到的是假命令”。 | `clue_gatekeeper_order_forged`; `relationships.laine +3`; `laine_spore_worsened = true` |
| 失败 | 莱因把队伍误认为拟声菌团，不肯配合。 | `relationships.laine -5`; 可转入稳定/证明身份分支 |
| 大失败 | 莱因情绪崩溃，拔出断剑自卫。 | 触发小型 QTE/检定；若再次失败，`laine_spore_worsened = true`; 凯娅信任 -1 |

#### 选择 C：检查他的黑缆识别牌

```ts
choiceId: 'laine_check_badge'
label: '检查莱因胸前的黑缆识别牌'
check: { skill: '观察/开锁', attribute: 'int/dex', dc: 12 }
assist: ['凯娅']
```

| 结果 | 剧情效果 | 状态效果 |
|---|---|---|
| 大成功 | 无损取下识别牌，并发现背面刻着堡垒维护口令。 | `item_laine_black_cable_badge`; `doc_black_cable_last_order`; `laine_black_cable_badge_obtained = true`; 凯娅信任 +4; `reverse_clock_anchor_score +1` |
| 成功 | 获得识别牌。 | `item_laine_black_cable_badge`; `laine_black_cable_badge_obtained = true`; 凯娅信任 +2 |
| 部分成功 | 取下识别牌但伤口被牵动。 | `item_laine_black_cable_badge_damaged`; `laine_spore_worsened = true`; 莱因信任 -3 |
| 失败 | 莱因护住识别牌，不许靠近。 | 莱因信任 -5 |
| 大失败 | 误触识别牌内的黑石残响。 | `blackstone_headache`; 下一次奥秘检定 -1 |

#### 选择 D：保持距离，先确认他是否已孢化

```ts
choiceId: 'laine_check_infection'
label: '保持距离，确认莱因是否已经孢化'
check: { skill: '生态/医药', attribute: 'wis', dc: 12 }
assist: ['布洛克', '艾琳']
```

| 结果 | 剧情效果 | 状态效果 |
|---|---|---|
| 大成功 | 判断莱因处于“可逆早期孢化”，不是怪物。 | `laine_alive = true`; `clue_spore_corruption_reversible`; `guardian_mercy_score +2`; 艾琳信任 +3; 布洛克信任 +2 |
| 成功 | 判断他仍保留意识，可以救。 | `laine_alive = true`; `guardian_mercy_score +1`; 艾琳信任 +2 |
| 部分成功 | 无法完全确认，但他仍能回应名字。 | `laine_alive = true`; `relationships.laine +2` |
| 失败 | 误判风险较高，队伍气氛紧张。 | 凯娅建议放弃，艾琳信任 -1 |
| 大失败 | 将莱因刺激到孢化应激。 | `laine_spore_worsened = true`; 后续稳定 DC +2 |

---

## 7. 节点：稳定、逼问或处置莱因

### 7.1 节点信息

```ts
id: 'laine-stabilization-or-interrogation'
title: '莱因：清醒与孢声之间'
background: '/assets/scenes/laine-survivor-close.webp'
entryCondition: flags.laine_found === true
```

### 7.2 入场文本

莱因的意识像一盏快要熄灭的灯。每当他闭上眼，喉咙里都会响起另一个声音，温柔、熟悉，甚至带着一点诱哄。

“回来吧，莱因。”

他猛地睁眼，用还没完全失去力气的手抓住地面。

“那不是队长。”他说，“队长死在门前了。那东西只是学会了他的声音。”

瑟琳低声问：“黑石门卫呢？”

莱因看向她，眼里闪过恐惧，也闪过一种近乎愧疚的清醒。

“它在守门。”  
“它一直都在守门。”  
“是我们……把假命令带进去了。”

### 7.3 第二阶段选择

该节点建议允许玩家选择 1 个主行动。主行动结束后进入夜谈节点。

#### 选择 A：用白枝烛芯和蓝伞菌盖稳定莱因

```ts
choiceId: 'use_materials_to_stabilize_laine'
label: '使用白枝烛芯和蓝伞菌盖稳定莱因'
visibleWhen: hasItem('item_white_branch_candle_core') && hasItem('item_blue_cap_fungus')
check: { skill: '医药/宗教', attribute: 'wis', dc: 14 }
assist: ['艾琳']
consume: ['item_blue_cap_fungus']
```

| 结果 | 剧情效果 | 状态效果 |
|---|---|---|
| 大成功 | 莱因恢复清醒，完整说出真名协议和门卫状态。 | `laine_stabilized = true`; `laine_full_testimony_obtained = true`; `laine_knows_gatekeeper_name = true`; `doc_laine_full_testimony`; `clue_laine_heard_true_name`; `guardian_mercy_score +3`; `relationships.laine +25`; 艾琳信任 +6 |
| 成功 | 莱因稳定，能随队抵达堡垒外环。 | `laine_stabilized = true`; `laine_escort_to_camp = true`; `doc_laine_testimony`; `guardian_mercy_score +2`; `relationships.laine +18` |
| 部分成功 | 莱因暂时稳定，但不能长时间行动。 | `laine_stabilized = true`; `laine_spore_worsened = true`; `doc_laine_testimony`; `guardian_mercy_score +1` |
| 失败 | 材料压制失败，但莱因在昏迷前交出识别牌。 | `item_laine_black_cable_badge`; `laine_alive = true`; `laine_spore_worsened = true`; `forced_seal_score +1` |
| 大失败 | 孢化反噬，莱因清醒时间大幅缩短。 | `laine_spore_worsened = true`; `relationships.laine -5`; 艾琳信任 -2 |

#### 选择 B：让莱因画出堡垒内部路线

```ts
choiceId: 'ask_laine_draw_fortress_route'
label: '让莱因画出地底堡垒内部路线'
check: { skill: '交涉/观察', attribute: 'cha/int', dc: 13 }
```

| 结果 | 剧情效果 | 状态效果 |
|---|---|---|
| 大成功 | 莱因标出维护井、调律室、封印大厅侧门。 | `item_fortress_entry_map_laine_marked`; `location_unlock_fortress_maintenance_well`; `black_root_decisive_score +2`; `reverse_clock_anchor_score +1`; 莱因信任 +10 |
| 成功 | 获得堡垒内部简图。 | `item_fortress_entry_map_laine_marked`; `black_root_decisive_score +1`; 莱因信任 +6 |
| 部分成功 | 地图不完整，但能避开一处机关。 | `clue_fortress_side_route`; 下一场景第一次机关检定 +1 |
| 失败 | 莱因记忆混乱，地图无法使用。 | 无奖励，但不阻断主线 |
| 大失败 | 画出的路线混入拟声幻觉。 | 下一场景若相信该路线，会触发伏击；凯娅可提醒 |

#### 选择 C：询问黑石门卫的真名

```ts
choiceId: 'ask_laine_gatekeeper_true_name'
label: '追问莱因：黑石门卫是否有真名或协议口令'
check: { skill: '交涉/奥秘', attribute: 'cha/int', dc: 15 }
```

| 结果 | 剧情效果 | 状态效果 |
|---|---|---|
| 大成功 | 莱因记起真名“阿格洛恩”，并说明真名不是控制，而是唤醒职责。 | `gatekeeper_true_name_known = true`; `clue_laine_heard_true_name`; `doc_gatekeeper_protocol_fragment`; `guardian_mercy_score +3`; 瑟琳信任 +4 |
| 成功 | 记起部分协议：“守门者，回到门前。” | `clue_true_name_command`; Boss 前呼唤真名检定 +2; `guardian_mercy_score +1` |
| 部分成功 | 只记得“真名协议存在”。 | `clue_true_name_command_damaged`; Boss 前呼唤真名检定 +1 |
| 失败 | 莱因痛苦摇头，无法回忆。 | 无奖励 |
| 大失败 | 强行追问刺激孢化声音。 | 莱因信任 -8; 艾琳信任 -2; `laine_spore_worsened = true` |

#### 选择 D：为了安全，决定不带莱因继续前进

```ts
choiceId: 'leave_laine_behind'
label: '为了安全，不带莱因继续前进'
check: none
```

效果：

```ts
flags.laine_left_behind = true;
flags.laine_alive = true;
relationships.laine -= 10;
relationships.eileen -= 4;
relationships.kaia += 2;
forced_seal_score += 1;
```

叙事：

> 艾琳想说什么，最后只是低下头，把一枚白枝符放在莱因掌心。  
> 莱因没有责怪你们。他只是笑了一下，声音轻得几乎听不见：  
> “别让它用我的声音骗你们。”

后果：

- Ending A 仍可达成，但要求更高：必须拥有 `doc_seal_maintenance_log`、`doc_gatekeeper_protocol`、`item_purified_blackstone_core`。
- Ending C 可用 `item_laine_bloodstained_gauntlet` 或后续找到的记忆残片作为锚点替代。

#### 选择 E：认为莱因已无可救药，给他最后的仁慈

```ts
choiceId: 'mercy_kill_laine'
label: '认为莱因已无可救药，给他最后的仁慈'
visibleWhen: flags.laine_spore_worsened === true
confirm: true
```

效果：

```ts
flags.laine_alive = false;
flags.laine_mercy_killed = true;
items += ['item_laine_bloodstained_gauntlet'];
relationships.eileen -= 8;
relationships.brock -= 2;
relationships.kaia += 1;
black_root_decisive_score += 2;
forced_seal_score += 1;
```

叙事：

> 莱因没有挣扎。  
> 他只是用最后一点清醒看向你，像是想确认站在面前的到底是人，还是又一个模仿人的声音。  
> “别让门开。”他说。  
> “不管用什么办法。”

后果：

- Ending A 仍可见，但必须依赖完整档案与净化材料，最终 DC +2。
- Ending B 条件降低，因为玩家路线明显偏向“斩断风险”。
- Ending C 可用 `item_laine_bloodstained_gauntlet` 作为逆钟锚点材料。

---

## 8. 莱因与伙伴夜谈联动

在 `camp-night-companion-scene` 中新增一个夜谈选项。

### 8.1 选择：守夜时查看莱因状况

```ts
choiceId: 'night_talk_laine'
label: '守夜时查看莱因的状况'
visibleWhen: flags.laine_alive === true && !flags.laine_left_behind
```

剧情文本：

> 莱因没有真正睡着。  
> 每隔一会儿，他就会猛地睁开眼，确认火光、队伍和自己的手仍在原处。  
> “第三远征队出发前，城里的人都说我们是英雄。”他低声说，“可到了下面才知道，英雄这两个字，只是活着的人给死者补上的。”  
> 他抬起手，指了指自己胸口裂开的黑缆徽记。  
> “如果我撑不到门前，把这个带去。门卫认得它。也许……它还认得我们。”

选项：

| 玩家回应 | 效果 |
|---|---|
| “你会亲自走到门前。” | 莱因信任 +8；艾琳信任 +2；`guardian_mercy_score +1` |
| “把你知道的一切都告诉我。” | 获得 `doc_laine_testimony` 或补全为 `doc_laine_full_testimony`；瑟琳信任 +2 |
| “我们会用最安全的办法结束这一切。” | 凯娅信任 +2；`black_root_decisive_score +1` |
| “如果必须有人留下，我们不会逃避。” | 瑟琳信任 +3；`reverse_clock_anchor_score +1` |

---

## 9. 莱因进入堡垒后的表现

### 9.1 堡垒外环

在 `fortress-outer-ring` 增加莱因状态分支。

#### 如果 `laine_stabilized = true`

莱因台词：

> “外环门禁不是锁，是问答。它会问你从哪条缆来，你要答：从断缆回到门前。”

效果：

```ts
fortress_entry_check_bonus += 2;
visibleChoice += '使用莱因的黑缆口令通过门禁';
```

#### 如果 `laine_alive = true && laine_spore_worsened = true`

莱因台词：

> “不要走左边。左边有声音……不，对，是右边。等等，我听见队长了。”

效果：

- 玩家可选择相信莱因或让瑟琳复核。
- 直接相信：有机会走捷径，也可能触发伏击。
- 复核成功：获得捷径且无伏击。

#### 如果 `laine_left_behind = true`

在堡垒外环听到拟声菌团模仿莱因声音：

> “你们为什么不带我走？”

效果：

- 若玩家之前获得 `doc_laine_testimony`，自动识破。
- 否则进行 WIS/意志检定，失败则下一场遭遇劣势。

#### 如果 `laine_mercy_killed = true`

队伍在门禁前看到黑缆识别牌残响，艾琳沉默。

效果：

```ts
black_root_decisive_score += 1;
relationships.eileen -= 1;
```

---

## 10. Boss 战前莱因专属行动

在 `prebattle-blackstone-gatekeeper` 中新增莱因相关选择。

### 10.1 选择：让莱因呼唤黑石门卫

```ts
choiceId: 'laine_call_gatekeeper'
label: '让莱因呼唤黑石门卫，证明它仍记得守门职责'
visibleWhen: flags.laine_alive === true && flags.laine_stabilized === true
check: { skill: '交涉/意志', attribute: 'cha/wis', dc: 15 }
assist: ['莱因', '瑟琳']
```

| 结果 | Boss 战效果 | 结局影响 |
|---|---|---|
| 大成功 | Boss 第一阶段跳过一次强攻击，并出现“清醒窗口”。 | Ending A 必定显示；`guardian_mercy_score +3` |
| 成功 | Boss 获得 `hesitation`，前 2 回合伤害 -15%。 | Ending A 显示条件降低；`guardian_mercy_score +2` |
| 部分成功 | Boss 第一回合行动延迟。 | `guardian_mercy_score +1` |
| 失败 | Boss 没有回应，莱因伤势恶化。 | `laine_spore_worsened = true` |
| 大失败 | 伪造命令反向利用莱因声音。 | Boss 第一回合强化；若莱因未稳定，可能死亡 |

### 10.2 选择：使用莱因识别牌覆盖伪造命令

```ts
choiceId: 'use_laine_badge_override'
label: '使用莱因的黑缆识别牌尝试覆盖伪造命令'
visibleWhen: hasItem('item_laine_black_cable_badge') || hasItem('item_laine_black_cable_badge_damaged')
check: { skill: '奥秘/开锁', attribute: 'int/dex', dc: 14 }
assist: ['凯娅', '瑟琳']
```

| 结果 | Boss 战效果 | 结局影响 |
|---|---|---|
| 大成功 | 破除 Boss 外层黑根护盾。 | Ending A/B/C 条件全部降低；`black_root_decisive_score +2` |
| 成功 | Boss 护盾 -30%。 | `black_root_decisive_score +1`; `guardian_mercy_score +1` |
| 部分成功 | Boss 第一阶段护盾 -15%，识别牌损坏。 | 后续不能再用于 Ending C 锚点 |
| 失败 | 无效果。 | 无 |
| 大失败 | 识别牌被黑根吞噬。 | `forced_seal_score +1` |

### 10.3 选择：以莱因记忆作为逆钟锚点

```ts
choiceId: 'use_laine_memory_anchor'
label: '以莱因关于门卫失控前的记忆作为逆钟锚点'
visibleWhen:
  flags.reverse_clock_method_known === true &&
  (flags.laine_full_testimony_obtained || hasItem('item_laine_bloodstained_gauntlet') || hasItem('item_laine_memory_splinter'))
check: { skill: '奥秘', attribute: 'int', dc: 16 }
assist: ['瑟琳']
```

| 结果 | Boss 战效果 | 结局影响 |
|---|---|---|
| 大成功 | Boss 濒死反扑取消。 | Ending C 必定显示；瑟琳信任 +5 |
| 成功 | Boss 濒死反扑伤害降低。 | Ending C 显示；`reverse_clock_anchor_score +2` |
| 部分成功 | 获得一次抵消致命伤机会。 | Ending C 可见但 DC +1 |
| 失败 | 逆钟锚点不稳定。 | Ending C 仍可见但 DC +2 |
| 大失败 | 记忆被门内声音污染。 | Ending C 隐藏；可能触发失败态风险 |

---

## 11. 最终四结局条件改写

进入 `final-seal-choice` 时重新计算：

```ts
const laineScore =
  Number(flags.laine_alive && flags.laine_stabilized) +
  Number(flags.laine_full_testimony_obtained) +
  Number(flags.laine_knows_gatekeeper_name) +
  Number(hasItem('item_laine_black_cable_badge'));

const truthScore =
  expedition_truth_level +
  Number(hasDocument('doc_laine_testimony')) +
  Number(hasDocument('doc_laine_full_testimony')) +
  Number(hasClue('clue_gatekeeper_order_forged'));

const mercyScore =
  Number(flags.wounded_guard_stabilized) +
  Number(flags.laine_stabilized) +
  Number(relationships.eileen >= 60) +
  Number(!flags.bone_marsh_nest_burned);

const sealScore =
  Number(hasDocument('doc_seal_maintenance_log')) +
  Number(hasDocument('doc_gatekeeper_protocol')) +
  Number(hasItem('item_blackstone_tuning_fork')) +
  Number(hasItem('item_purified_blackstone_core')) +
  Number(flags.gatekeeper_true_name_known || flags.laine_knows_gatekeeper_name);

const reverseClockScore =
  Number(flags.reverse_clock_method_known) +
  Number(relationships.serin >= 60) +
  Number(hasItem('item_reverse_clock_chalk')) +
  Number(flags.laine_full_testimony_obtained || hasItem('item_laine_bloodstained_gauntlet'));
```

### Ending A：守门者仍在

```ts
visibleWhen:
  hasItem('item_purified_blackstone_core') &&
  (laineScore >= 2 || truthScore >= 4) &&
  mercyScore >= 2 &&
  sealScore >= 3
check: { skill: '宗教/奥秘', attribute: 'wis/int', dc: 15 }
```

莱因影响：

- `laine_stabilized = true`：最终 DC -2。
- `doc_laine_full_testimony`：最终 DC -1。
- `laine_mercy_killed = true`：最终 DC +2，但不完全锁死。
- `laine_left_behind = true`：需要额外拥有 `doc_seal_maintenance_log` 或 `doc_gatekeeper_protocol`。

结局补充文本：

> 莱因扶着断裂的长枪，几乎站不稳，却仍然把黑缆识别牌举到门卫面前。  
> “阿格洛恩。”他说。  
> “第三远征队归队。守门协议，回到门前。”  
> 黑石门卫眼中的暗红光猛地一颤。那一瞬间，它不再像怪物，而像一个在漫长噩梦里听见自己名字的守卫。

### Ending B：斩断黑根

```ts
visibleWhen: always
check: { skill: '运动/攻击', attribute: 'str', dc: 13 }
```

莱因影响：

- `doc_laine_testimony` 或 `item_laine_black_cable_badge`：可以精准定位黑根核心，DC -1。
- `laine_mercy_killed = true`：DC -1，但艾琳后日谈更沉重。
- `laine_alive && laine_stabilized`：选择该结局时，莱因会理解但痛苦。

结局补充文本：

> 莱因闭上眼，没有阻止你。  
> “如果救不了它，”他说，“至少别让它继续被假命令折磨。”

### Ending C：逆钟锚定

```ts
visibleWhen:
  reverseClockScore >= 3 ||
  flags.ending_unlocked_reverse_clock_anchor === true
check: { skill: '奥秘', attribute: 'int', dc: 16 }
```

莱因影响：

- `doc_laine_full_testimony`：作为“门卫失控前状态”的记忆坐标，DC -1。
- `item_laine_bloodstained_gauntlet`：莱因死亡路线下的替代锚点。
- `laine_alive && laine_stabilized`：莱因可主动把识别牌压进阵心，瑟琳不必独自承受全部代价，结局文本更温和。

结局补充文本：

> 莱因把识别牌按在逆钟阵的中心。  
> “我记得它失控前的声音。”他说，“不是这个声音。不是门里的声音。”  
> 瑟琳看向你，银色符文在她脚下倒转：“有记忆作锚，时间就不会完全迷路。”

### Ending D：强制暂封

```ts
visibleWhen: always
check: { skill: '奥秘/宗教', attribute: 'int/wis', dc: 12 }
```

莱因影响：

- 若莱因死亡、被放弃、证词不足，Ending D 是最自然的保底结局。
- 若莱因存活但未稳定，强制暂封后可在后日谈中提到他被送回静默神殿治疗，未来未知。

结局补充文本：

> 莱因没有说这是胜利。  
> 他只是望着重新闭合的门，低声说：“至少今天，它没有开。”

### 失败态：门缝开启

不计入正式四结局，只作为失败态：

```ts
trigger:
  finalCheckNaturalOne === true ||
  failedFinalChoice && sealScore <= 1 ||
  recklessOpenGateChoice === true
```

莱因影响：

- 若莱因存活，他会在失败态中试图用最后的清醒挡在门前。
- 若莱因已死，门内会模仿他的声音，作为坏结局心理冲击。

---

## 12. Codex 实现清单

### 12.1 必须新增的节点

```ts
'laine-survivor-scene'
'laine-stabilization-or-interrogation'
```

### 12.2 必须修改的节点

```ts
'third-expedition-camp'              // 调查结束后跳莱因节点
'camp-night-companion-scene'          // 新增莱因夜谈
'fortress-outer-ring'                 // 增加莱因/识别牌/拟声联动
'prebattle-blackstone-gatekeeper'     // 增加莱因专属战前行动
'final-seal-choice'                   // 四结局条件重算
'ending-*'                            // 加入莱因存活/死亡/放弃的后日谈变量文本
```

### 12.3 不允许出现的问题

1. 不允许删除莱因或把莱因只写成背景尸体。
2. 不允许莱因死亡后导致主线卡死；必须有识别牌/证词/残片作为替代推进物。
3. 不允许因为某次检定失败导致四结局全部不可达；失败只能提高代价或转向低条件结局。
4. 不允许 Boss 战后自动进入单一结局；必须进入 `final-seal-choice`。
5. 不允许 AI KP 自行决定莱因生死；莱因生死必须由本地 flag 和玩家选择决定。
6. 不允许 AI 请求失败时卡在“等待 KP 回复”；必须提供本地 fallback 文本并继续状态跳转。

---

## 13. 推荐最小实现版本

如果开发时间紧，至少实现以下内容：

1. `laine-survivor-scene`：发现莱因，选择救治/询问/取识别牌。
2. `laine-stabilization-or-interrogation`：获得证词、识别牌、真名线索之一。
3. Boss 前新增两个选择：
   - 让莱因呼唤门卫。
   - 使用莱因识别牌覆盖伪造命令。
4. 最终四结局条件加入 `laineScore`。
5. 后日谈根据莱因状态显示不同文本。

这样即使不做复杂夜谈和分支，也能保证莱因承担关键剧情功能，并让四结局逻辑成立。

---

## 14. 建议给 Codex 的任务描述

请在现有剧情框架基础上补入莱因主线。莱因是第三远征队唯一幸存者，是最终四结局分流的核心 NPC，不能删除或弱化。需要新增 `laine-survivor-scene` 与 `laine-stabilization-or-interrogation` 两个剧情节点，并修改第三远征队营地、伙伴夜谈、堡垒外环、黑石门卫战前选择、最终封印选择和结局后日谈。

莱因相关剧情必须支持以下状态：救下莱因、稳定莱因、莱因孢化恶化、获得莱因证词、获得完整证词、获得黑缆识别牌、莱因被留下、莱因被仁慈处置、莱因参与最终大厅。不同状态会影响四个正式结局：守门者仍在、斩断黑根、逆钟锚定、强制暂封。失败态“门缝开启”只作为大失败/鲁莽选择触发，不计入正式四结局。

所有主线关键线索必须有保底，不允许因为检定失败导致无法通关。AI KP 只负责润色叙事，莱因生死、道具发放、flag、结局显示条件必须由本地逻辑控制。AI 请求失败时必须使用本地 fallback 文本继续，不得卡在等待 KP 回复。
