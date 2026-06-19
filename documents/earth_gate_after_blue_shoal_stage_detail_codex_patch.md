# 《地心之门》蓝伞浅滩后续剧情细化补丁 · Codex 可执行版

> 目标：在已经能正常通关的剧情框架上，把“蓝伞浅滩之后到四结局”重写成更细、更有阅读感、更能回收前文伏笔的后半段主线。  
> 用途：直接交给 Codex 作为实现任务文档。  
> 总阅读时长：单次正常通关约 15 分钟。本文包含所有分支、调查结果、fallback 和差分文本，实际总字数会超过单次游玩阅读量。  
> 重要原则：不要只新增文学文本。必须让固定剧情、调查道具、线索档案、伙伴信任、战前选择、结局变量互相联动。

---

## 0. Codex 总任务

请基于现有剧情框架，重写并细化蓝伞浅滩战斗胜利后的全部剧情。

### 0.1 必须替换的旧流程

蓝伞浅滩战斗胜利后，不允许再进入旧的简化线。必须进入新节点：

```ts
nextStoryNodeId = 'after-battle-blue-shoal-expanded-v2'
```

如果项目中已有以下旧节点，请保留但不再作为主线 next：

```ts
'after-battle-blue-shoal'
'after-battle-blue-shoal-expanded'
'after-battle-blue-shoal-rewrite'
```

主线新流程固定为：

```text
蓝伞浅滩战后复盘
  ↓
蓝伞浅滩调查：尸体 / 脚印 / 伤员 / 声音
  ↓
骨柱湿地入口
  ↓
骨柱湿地穿行：路线选择 + 道具回收伏笔
  ↓
骨柱孢兽战前选择行动
  ↓
骨柱孢兽战斗
  ↓
第三远征队临时营地
  ↓
营地深度调查：医疗帐 / 指挥桌 / 传讯阵 / 黑石样本 / 遗物
  ↓
发现莱因
  ↓
莱因稳定与证词
  ↓
营地夜谈：伙伴反应 + 前文道具回收
  ↓
地底堡垒外环
  ↓
权限门与守门者协议调查
  ↓
黑石门卫战前选择行动
  ↓
黑石门卫 Boss 战
  ↓
最终处置选择
  ↓
四结局之一
```

### 0.2 文本目标

后续剧情要让玩家读出三个层次：

1. **恐怖感**：下面的东西会模仿声音、污染记忆、借封印系统扩散。
2. **误解感**：黑石门卫并不是单纯敌人，而是在被污染后仍试图守门。
3. **回收感**：前面玩家拿到的档案、道具、伙伴信任，在后续调查中不断被用上。

禁止写成：

```text
你们继续前进，发现了一个营地，里面有一个幸存者。幸存者告诉你真相，然后你们去打 Boss。
```

必须写成：

```text
固定剧情推进 + 可调查证据 + 角色反应 + 分支检定 + 道具/flag/分数变化 + 后续伏笔回收。
```

---

## 1. 新增/确认全局数据

### 1.1 Flags

如已有同类字段，复用现有字段，不要重复造名。没有则新增。

```ts
// 蓝伞浅滩战后
blue_shoal_aftermath_v2_done: boolean
blue_shoal_corpse_examined: boolean
blue_shoal_drag_marks_found: boolean
blue_shoal_voice_warning_found: boolean
blue_shoal_wounded_helped: boolean
blue_shoal_spore_sample_obtained: boolean
blue_shoal_mercy_choice: boolean

// 骨柱湿地
bone_wetland_entered: boolean
bone_wetland_route: 'safe' | 'fast' | 'sample' | 'lost'
bone_wetland_echo_voice_triggered: boolean
bone_wetland_black_root_seen: boolean
bone_wetland_sample_quality: 0 | 1 | 2
bone_beast_pre_action_done: boolean
bone_beast_battle_done: boolean

// 第三远征队营地
third_camp_found: boolean
third_camp_medical_log_found: boolean
third_camp_command_log_found: boolean
third_camp_voice_array_found: boolean
third_camp_blackstone_sample_found: boolean
third_camp_personal_tokens_found: boolean
expedition_truth_piece_count: number

// 莱因
laine_found: boolean
laine_alive: boolean
laine_stabilized: boolean
laine_left_behind: boolean
laine_truth_level: 0 | 1 | 2 | 3
laine_trust: 0 | 1 | 2 | 3
laine_gave_badge: boolean
laine_badge_obtained: boolean
laine_memory_anchor_obtained: boolean
laine_final_words_heard: boolean

// 堡垒与守门者
fortress_outer_ring_entered: boolean
fortress_gate_open_method: 'badge' | 'decipher' | 'forced'
guardian_name_known: boolean
guardian_protocol_known: boolean
guardian_mercy_understood: boolean
black_root_core_exposed: boolean
black_root_sample_obtained: boolean
reverse_clock_anchor_ready: boolean

// 结局可用性
ending_guardian_remains_available: boolean
ending_cut_black_root_available: boolean
ending_reverse_clock_available: boolean
ending_forced_seal_available: boolean
```

### 1.2 结局分数

```ts
truthScore: number        // 真相掌握程度
mercyScore: number        // 是否救人、理解守门者、避免鲁莽处置
sealScore: number         // 封印稳定程度
combatPrepScore: number   // Boss 战前准备
reverseClockScore: number // 逆钟锚定准备程度
```

建议初始化：

```ts
truthScore = existingTruthScore ?? 0
mercyScore = existingMercyScore ?? 0
sealScore = existingSealScore ?? 0
combatPrepScore = existingCombatPrepScore ?? 0
reverseClockScore = existingReverseClockScore ?? 0
```

不要因为玩家错过部分调查就断主线。错过调查只影响文本、难度和结局可选项。

### 1.3 道具与线索

以下道具/线索若项目中已有图标 token，直接复用。没有图标时先用默认线索图标，不要阻塞实现。

```ts
itemsOrClues = [
  {
    id: 'blue_umbrella_spore_powder',
    name: '蓝伞孢粉',
    type: 'material',
    icon: '/assets/icons/items/spore-powder.png',
    desc: '从蓝伞浅滩孢兽残骸中收集的净化孢粉。微弱发光，能暂时压制黑根污染。',
    use: '莱因稳定检定 +2；骨柱湿地采样 +1；Boss 战前削弱黑根。'
  },
  {
    id: 'third_patrol_record',
    name: '第三巡逻队记录',
    type: 'clue',
    icon: '/assets/icons/items/scroll-log.png',
    desc: '被孢水泡烂的巡逻记录，反复写着“禁止回应熟人的声音”。',
    use: '回收蓝伞浅滩前尼布警告；解锁莱因证词可信度。'
  },
  {
    id: 'wounded_purification_report',
    name: '伤员净化报告',
    type: 'clue',
    icon: '/assets/icons/items/scroll-medicine.png',
    desc: '艾琳协助整理的伤员记录，显示浅层孢毒可以被压制，但黑根污染会反复侵入记忆。',
    use: '莱因稳定时获得额外文本；结局 C 逆钟锚定 +1。'
  },
  {
    id: 'bloodied_expedition_gauntlet',
    name: '染血的远征队护手',
    type: 'clue',
    icon: '/assets/icons/items/default.png',
    desc: '第三远征队制式护手，内侧刻着“莱因，别再替别人站最后一班岗”。',
    use: '营地调查后触发莱因情感反应；mercyScore +1。'
  },
  {
    id: 'laine_badge',
    name: '莱因的识别牌',
    type: 'keyItem',
    icon: '/assets/icons/items/underground-fortress-emblem.png',
    desc: '第三远征队副哨长莱因的身份识别牌，背面残留黑石门禁权限。',
    use: '打开堡垒外环权限门；结局 A/B/C 的关键证据。'
  },
  {
    id: 'guardian_protocol_page',
    name: '守门者协议残页',
    type: 'clue',
    icon: '/assets/icons/items/scroll-sealed.png',
    desc: '地底堡垒旧协议残页。记录黑石门卫不是处刑装置，而是封印系统的最后执行者。',
    use: 'guardian_protocol_known = true；解锁结局 A。'
  },
  {
    id: 'guardian_true_name_rubbing',
    name: '门卫真名拓片',
    type: 'clue',
    icon: '/assets/icons/items/note-pencil.png',
    desc: '从黑石门廊上拓下的古名：格朗-赫尔。',
    use: 'Boss 战前呼唤真名，削弱第一阶段；结局 A 条件之一。'
  },
  {
    id: 'black_root_sample',
    name: '黑根样本',
    type: 'material',
    icon: '/assets/icons/items/default.png',
    desc: '从封印裂缝旁剥离的黑色根丝。离开母体后仍会轻微抽动。',
    use: '结局 B“斩断黑根”的关键材料。'
  },
  {
    id: 'laine_memory_anchor',
    name: '莱因的记忆锚点',
    type: 'keyItem',
    icon: '/assets/icons/items/clue.png',
    desc: '莱因残存记忆中最稳定的一段：黑石门卫挡在门前，不是在杀人，而是在阻止更深处的东西出来。',
    use: '结局 C“逆钟锚定”的关键材料。'
  }
]
```

---

## 2. 伏笔回收总表

Codex 必须按本表实现“道具/线索触发差分文本”。如果玩家没有拿到对应道具，也要有普通文本，不得卡流程。

| 前文伏笔/道具 | 来源 | 后续回收阶段 | 回收方式 |
|---|---|---|---|
| 第三远征队失联报告 | 公会/任务档案 | 第三远征队营地 | 对照营地指挥桌日志，发现报告中“全员失联”被赫尔曼压低风险措辞 |
| 失踪远征队登记册 | 公会登记册 | 营地个人遗物 | 登记册上的名字对应护手、药瓶、断弓，强化远征队不是背景板 |
| 赫尔曼的抽屉笔记 | 城防负责人相关线索 | 堡垒权限门 | 笔记中的“封印系统仍有响应”解释赫尔曼为什么急着派人下潜 |
| 指名委托书原件 | 主线委托 | 堡垒外环 | 门禁识别旧城防章，委托书能辅助“解读权限”，但不能替代莱因识别牌 |
| 萨洛的情报卡片 | 酒馆 | 骨柱湿地/营地 | 情报卡片上的“不要信孢海人声”与第三巡逻队记录互相印证 |
| 凯娅暗号纸条 | 黑市/凯娅 | 营地传讯阵 | 凯娅认出传讯阵里有黑市走私用的短码，说明污染曾伪装成合法求救信号 |
| 云苓的护身符 | 药铺购买后赠送 | 莱因稳定 | 护身符可替代一次医药失败，触发云苓祝福回忆 |
| 蓝伞孢粉 | 蓝伞浅滩调查 | 莱因稳定/Boss 前 | 可压制黑根；说明蓝伞浅滩不是单纯怪物区，而是天然缓冲带 |
| 第三巡逻队记录 | 蓝伞浅滩追踪 | 莱因询问 | 玩家可用记录里的句子唤回莱因理智，证明他不是胡言乱语 |
| 伤员净化报告 | 浅滩救治 | 莱因稳定/结局 C | 说明艾琳的净化只能稳住“身体污染”，逆钟锚定需要“记忆锚点” |
| 地底堡垒徽章/地下堡垒纹章 | 物品/线索 | 堡垒权限门 | 与莱因识别牌共鸣，提示堡垒仍承认第三远征队权限 |
| 门卫真名拓片 | 堡垒外环调查 | Boss 战前/结局 A | 呼唤格朗-赫尔，让门卫短暂恢复守门协议 |
| 莱因的识别牌 | 莱因剧情 | 堡垒权限门/结局 | 证明玩家不是入侵者；是四结局分流核心证据 |

---

# 3. 阶段一：蓝伞浅滩战后复盘

```ts
id: 'after-battle-blue-shoal-expanded-v2'
title: '蓝伞浅滩战后：孢尘落下'
background: '/assets/scenes/blue-shoal-after-battle.webp'
entryCondition: completedBlueShoalBattle || blue_shoal_battle_done
next: 'blue-shoal-investigation-v2'
```

## 3.1 固定剧情文本

战斗结束后，蓝伞浅滩没有立刻安静下来。

那些被斩开的菌团仍在泥水里缓慢收缩，像一颗颗不肯承认死亡的心脏。蓝色孢尘从伞盖上落下，在盾牌边缘、弓弦、法杖银纹和每个人的肩头铺出一层微光。远处水洼倒映着逆穹悬城的模糊轮廓，可那轮廓被战斗后的涟漪切碎，看起来不像一座城，更像一盏快要熄灭的灯。

尼布没有立刻庆祝。他站在哨棚旁，短矛仍横在胸前，眼睛死死盯着孢兽倒下的地方。

那里留下了一道很长的拖拽痕。

不是野兽冲锋时压出的泥沟，也不是受伤后挣扎留下的爪印。那道痕迹细、密、规律，像有成百上千根看不见的线从远处牵住孢兽，把它一点一点拖到浅滩。

布洛克蹲下，用斧背拨开菌膜。他低低骂了一声。

「这不是正常孢化。」他说，「正常孢兽会抢地盘、护菌巢、追血味。可这玩意儿身上的菌丝像被拧成缆绳了。」

瑟琳举起法杖。杖头银色符文像钟摆一样轻轻震动。你们听见极低的嗡鸣从地下传来，仿佛某口埋在深处的钟，被谁从很远的地方敲了一下。

艾琳的圣徽贴在掌心。她闭眼片刻，再睁开时，声音比平时更轻。

「这里有恐惧。」

她停顿了一下。

「不是怪物的恐惧。是人的。」

凯娅靠在断木桩上，匕首在指间转了一圈。她看向浅滩尽头，那里的蓝伞菌低低垂下，遮住一条通往更深处的小路。

「有人从这边逃过去。」她说，「脚印被孢尘盖了一半，另一半还湿着。不是很久以前。」

你们顺着她的视线看去。

路边挂着一块断裂的远征队标牌，字迹被孢水泡得发胀，只剩半行还能读清：

> 第三远征队临时标记。禁止回应远处人声。

尼布咽了口唾沫。

「我之前提醒过你们。」他说，「在孢海里，能叫出你名字的，不一定是人。」

## 3.2 固定伏笔回收

进入本节点时，根据玩家已有道具插入差分文本。

### 若玩家持有“萨洛的情报卡片”

```ts
condition: hasItem('salo_info_cards')
effect: truthScore += 1 only once
```

插入文本：

凯娅从你的行囊里抽出萨洛给的情报卡片，抖了抖上面的孢灰。

「酒馆老板没骗人。」她指着其中一行小字，「‘深层孢海会借熟人声音诱导旅人偏离路线。’我当时还以为这是酒鬼吓唬新人的故事。」

布洛克沉着脸说：「萨洛年轻时跟过下层采样队。他知道的东西，比他愿意承认的多。」

### 若玩家持有“第三远征队失联报告”

```ts
condition: hasItem('third_expedition_missing_report')
effect: no score change
```

插入文本：

你想起公会档案里那份失联报告。报告写得很克制，只说第三远征队“通讯中断、位置不明”。可眼前这块标牌上的警告，明显不是普通失联前会留下的东西。

瑟琳低声说：「如果他们有时间写下‘禁止回应人声’，说明他们不是被突然袭击。他们曾经明白自己面对的是什么。」

---

# 4. 阶段二：蓝伞浅滩调查

```ts
id: 'blue-shoal-investigation-v2'
title: '蓝伞浅滩调查'
background: '/assets/scenes/blue-shoal-after-battle.webp'
mode: 'investigation'
minActions: 2
maxActions: 3
next: 'bone-wetland-approach-v2'
```

## 4.1 实现要求

玩家可以调查 2 到 3 项。如果现有系统只支持一次选择，请改成：

1. 固定自动触发“检查拖拽痕”。
2. 玩家从“尸体采样 / 追踪脚印 / 救治伤员 / 倾听远处声音”中选择 1 项。

每个调查都必须能推进主线，不得因为失败阻塞。

---

## 4.2 调查 A：检查拖拽痕，确认污染方向

```ts
id: 'investigate-drag-marks'
check: observe || ecology
DC: 12
success: blue_shoal_drag_marks_found = true; truthScore += 1
partial: blue_shoal_drag_marks_found = true
fail: no score, but still points to next route
```

### 成功文本

你蹲在拖拽痕旁，拨开浮在泥水上的蓝伞碎片。痕迹越往浅滩深处越细，越往外缘越重，说明孢兽并不是从巢穴里冲出来的，而是从更深处被迫拖到这里。

那些细线一样的沟槽里残留着黑色纤维。它们不软，也不像植物。你用刀尖碰了碰，纤维竟然微微收缩，像怕疼一样缩进泥里。

瑟琳的银色符文压低了一瞬。

「这不是孢海自己的生态。」她说，「有东西把封印里的力量接到了活物身上。」

布洛克看向更深处，脸色不好。

「那就说明下面不是单纯有怪物。」

他把斧柄扛上肩。

「下面有个会放牧怪物的东西。」

### 失败文本

你试着分辨拖拽痕，但战斗后的泥水混着孢兽体液，几乎盖住所有细节。你只能确认一点：痕迹通向浅滩尽头那条被蓝伞菌遮住的小路。

尼布说：「别纠结了。所有坏事最后都会往那边走。」

---

## 4.3 调查 B：采集蓝伞孢粉

```ts
id: 'collect-blue-spore-powder'
check: ecology || medicine
DC: 13
success: addItem('blue_umbrella_spore_powder'); blue_shoal_spore_sample_obtained = true; combatPrepScore += 1
partial: addItem('blue_umbrella_spore_powder_diluted'); // 可作为弱化版 +1，不如完整版
fail: addStatus('minor_spore_sickness'); no item
```

### 成功文本

你避开孢兽体内被黑根缠住的部分，只从蓝伞菌冠还未变黑的边缘刮下孢粉。粉末落进玻璃瓶时发出细小的光，像一把被揉碎的星屑。

艾琳看了一眼，点头。

「蓝伞菌本来就是浅层孢海的缓冲。它们吸收毒素，也压制深层孢潮。」

她轻轻把瓶塞按紧。

「如果后面遇到被污染的人，这个也许能替他多争取一点时间。」

你获得道具：**蓝伞孢粉**。

### 失败文本

你刚挑开菌膜，一股甜腻的蓝色雾气就从孢囊里喷出。艾琳立刻拉住你的手腕，将圣徽按在你掌心。

「别吸进去。」

你后退两步，喉咙里却已经泛起铁锈味。孢粉被黑色根丝污染，不能再安全使用。

获得状态：**轻微孢毒**。后续一次体质/医药相关检定 -1。

---

## 4.4 调查 C：沿脚印追踪逃亡者方向

```ts
id: 'track-expedition-footprints'
check: survival || observe
DC: 12
success: addItem('third_patrol_record'); blue_shoal_voice_warning_found = true; truthScore += 1
partial: blue_shoal_voice_warning_found = true
fail: bone_wetland_echo_voice_triggered = true
```

### 成功文本

你沿着湿脚印绕过蓝伞菌背后。脚印起初杂乱，像逃亡者曾经在浅滩边跌倒过几次。再往前，它们忽然变得整齐，不是因为那个人恢复冷静，而是因为他开始沿着同一条路线机械地走。

凯娅蹲下来，从泥里挑出一枚鞋钉。

「城防制式。」她说，「第三远征队的人。」

脚印尽头压着一本被孢水泡烂的巡逻记录。大部分字已经糊开，只剩几段还能辨认：

> 第三晚，听见队长从东侧喊我。队长明明已经失踪两天。  
> 禁止回应熟人的声音。  
> 莱因说门里有人敲钟。不是求救，是警告。  
> 黑石门卫没有追杀我们，它在挡住更里面的东西。

瑟琳读到最后一句时，声音明显低了下去。

「黑石门卫……在挡住更里面的东西？」

你获得线索：**第三巡逻队记录**。

### 失败文本

你刚追到浅滩边缘，远处忽然传来一个熟悉的声音。

「委托人，请立刻返回。任务取消。」

那声音很像米娜，冷静、疲惫，像仍站在公会柜台后整理登记册。

队伍瞬间停住。

尼布冲过来抓住你的肩膀，指节用力到发白。

「别答。」他说，「别回头，别问为什么。」

等你们强迫自己离开时，脚印已经被新落下的孢尘盖住。

设置：`bone_wetland_echo_voice_triggered = true`。

---

## 4.5 调查 D：帮助尼布清点伤员与遗物

```ts
id: 'help-nibu-wounded'
check: medicine || religion || persuasion
DC: 12
success: addItem('wounded_purification_report'); blue_shoal_wounded_helped = true; mercyScore += 1; laine_trust += 1
partial: blue_shoal_wounded_helped = true; mercyScore += 1
fail: no penalty
```

### 成功文本

你没有立刻离开，而是帮尼布把哨棚里的伤员挪到干燥的木板上。有人手臂上长出蓝白色菌丝，有人一直念着听不懂的名字，还有一个年轻守卫反复说自己听见母亲在水里叫他。

艾琳跪在伤员之间，将白枝圣徽按在每个人额前。她不是用宏大的祈祷压过哭声，而是一遍一遍重复他们自己的名字，像把快要散掉的灵魂重新缝回身体。

「记住自己的名字。」她说，「不要回应别人的声音。」

尼布递给你一份临时记录，手指还在发抖。

「拿着吧。你们要去的地方，也许会用得上。」

你获得线索：**伤员净化报告**。

伏笔回收说明：后续莱因稳定时，如果持有该报告，艾琳会直接指出“莱因不是普通孢毒，而是记忆被黑根反复侵入”。

---

# 5. 阶段三：骨柱湿地入口

```ts
id: 'bone-wetland-approach-v2'
title: '骨柱湿地入口：白骨一样的林'
background: '/assets/scenes/bone-wetland-approach.webp'
next: 'bone-wetland-route-choice-v2'
```

## 5.1 固定剧情文本

离开蓝伞浅滩后，脚下的泥开始变硬。

不是干燥，而是被某种白色沉积物一层层包住，踩上去会发出轻微的脆响。蓝伞菌越来越少，取而代之的是一根根从泥中伸出的骨白色菌柱。它们有的细如手指，有的粗得像塔柱，表面布满一圈圈年轮般的纹路。远远望去，整片湿地像一座由白骨支起的森林。

风穿过菌柱时，会发出空洞的鸣声。

一开始你以为那只是风声。可走得越深，那声音越像人在很远的地方说话。

「别分神。」莉亚瑟搭上箭，视线越过每一根菌柱之间的缝隙，「这里的回声不是自然形成的。」

布洛克摸了摸菌柱表面，指腹沾下一层白灰。

「骨柱菌。」他说，「它们会吸收死掉的孢兽、矿工、远征队员，长成这种柱子。别问哪一根以前是人。」

艾琳皱了皱眉，却没有责备他。

因为她也听见了。

骨柱深处，有人轻轻喊了一声：

「莱因。」

声音不大，甚至有些温柔。可所有人都停住了。

凯娅把匕首反握在掌心，嘴角的笑意消失。

「很好。」她说，「还没见到本人，名字已经先出现了。」

## 5.2 伏笔回收差分

### 若玩家持有“第三巡逻队记录”

```ts
condition: hasItem('third_patrol_record')
effect: bone_wetland_echo_voice_triggered difficulty -2
```

插入文本：

你想起巡逻记录里那句被反复划重的话：**禁止回应熟人的声音。**

你抬手示意队伍停下，没有人回答那声呼唤。

骨柱之间的风声顿了一下，像某个藏在深处的东西发现诱饵没有被咬住。

### 若没有“第三巡逻队记录”，但持有“萨洛的情报卡片”

```ts
condition: !hasItem('third_patrol_record') && hasItem('salo_info_cards')
effect: next echo check DC -1
```

插入文本：

萨洛情报卡片上的提醒忽然浮上心头：深层孢海会借熟人声音诱导旅人偏离路线。

你不能确定那声“莱因”是不是陷阱，但至少你知道，在这里回应任何声音都不是好主意。

---

# 6. 阶段四：骨柱湿地路线选择

```ts
id: 'bone-wetland-route-choice-v2'
title: '骨柱湿地：选择穿行方式'
background: '/assets/scenes/bone-wetland.webp'
mode: 'preBattleChoice'
next: 'bone-beast-prebattle-v2'
```

本阶段不是普通调查，而是让玩家选择穿越方式。每条路线都要影响后续战斗或调查。

## 6.1 选择 A：沿骨柱稀疏处绕行

```ts
check: survival || observe
DC: 12
success: bone_wetland_route = 'safe'; combatPrepScore += 1; no penalty
partial: bone_wetland_route = 'safe'; addMinorDelayText()
fail: bone_wetland_route = 'lost'; next combat enemy gains first-round advantage
```

### 成功文本

你没有急着穿过最短路线，而是沿着骨柱稀疏处绕行。那里泥水更深，但回声更少。莉亚瑟几次停下，用箭尾在菌柱上刻下细小标记，避免队伍被重复的地形绕回原点。

走到一处半塌的菌柱旁时，你看见柱体内部嵌着一枚断裂的箭头。箭杆上还缠着第三远征队的灰布。

「他们也走过这条路。」莉亚瑟说。

她拔出箭头，检查片刻后摇头。

「不是射出去的。是有人把箭折断，插在这里当路标。」

你们确认了一条相对安全的路径。后续骨柱孢兽战斗第一回合，敌方不获得伏击优势。

## 6.2 选择 B：快速穿过湿地，不在回声中停留

```ts
check: athletics || dexterity
DC: 14
success: bone_wetland_route = 'fast'; sealScore += 1; but miss optional clue
partial: bone_wetland_route = 'fast'; one companion minor damage
fail: bone_wetland_route = 'lost'; trigger echo scene; combatPrepScore -= 1
```

### 成功文本

你选择不和这片湿地耗时间。

队伍压低身形，从骨柱之间快速穿行。泥水溅在靴面上，白色菌灰被脚步震落，像一场倒着下的雪。每当远处有人声响起，你都强迫自己不去分辨它像谁。

很快，骨柱的密度开始下降。

瑟琳回头看了一眼来路，银色符文仍在轻轻颤动。

「我们避开了不少东西。」她说，「但也错过了不少答案。」

效果：更快抵达堡垒方向，`sealScore += 1`；但本阶段无法获得“骨柱回声残片”。

## 6.3 选择 C：采集骨柱样本，分析污染结构

```ts
check: ecology || arcana || medicine
DC: 14
success: bone_wetland_route = 'sample'; bone_wetland_sample_quality = 2; truthScore += 1; reverseClockScore += 1
partial: bone_wetland_sample_quality = 1; truthScore += 1
fail: addStatus('black_root_whisper'); next dialogue includes hallucination
requiresBonus: hasItem('blue_umbrella_spore_powder') gives +2
```

### 成功文本

你停在一根断裂的骨柱旁。柱体内部不是实心的，而是层层包裹的纤维结构：外层白得像骨，内层却泛着淡蓝。最深处有一缕极细的黑线，像墨滴进水后凝住的痕迹。

如果你持有**蓝伞孢粉**，插入：

你把一点蓝伞孢粉撒在断面上。蓝光触到黑线时，黑线猛地收缩，发出几乎听不见的尖鸣。

艾琳低声说：「它怕这个。」

瑟琳立刻记下反应。

「不是彻底净化，但能让污染短暂停顿。后面如果要从记忆或封印里剥离黑根，这个反应很重要。」

你获得：`bone_wetland_sample_quality = 2`，`truthScore += 1`，`reverseClockScore += 1`。

## 6.4 选择 D：回应远处“莱因”的声音

这是一个危险选项，用于给玩家自由，但不能直接 Bad End。

```ts
check: wisdom || religion
DC: 15
success: learn clue but gain risk; truthScore += 1; bone_wetland_echo_voice_triggered = true
partial: bone_wetland_echo_voice_triggered = true
fail: addStatus('echo_marked'); next battle enemy targets player first
```

### 成功文本

你没有立刻回答，而是低声问：「你是谁？」

骨柱深处安静了一瞬。

随后，那个声音变成了很多个声音。男人、女人、老人、孩子，像一群人隔着水面同时说话。

「莱因……开门……」

「副哨长……你听见钟了吗……」

「门卫没有杀我们……」

「别让他们把门打开……」

最后，所有声音又合成同一个低哑的句子：

「他还在站岗。」

艾琳猛地抓住你的手腕，圣徽光芒刺破周围白雾。那些声音像被火烫到一样退入骨柱深处。

你得到了重要信息：**“他还在站岗”指向黑石门卫仍在执行守门职责。**

---

# 7. 阶段五：骨柱孢兽战前选择行动

```ts
id: 'bone-beast-prebattle-v2'
title: '骨柱孢兽：战前选择'
background: '/assets/scenes/bone-wetland.webp'
mode: 'singlePreBattleAction'
nextOnResolve: 'battle-bone-beast'
```

## 7.1 固定剧情文本

湿地深处传来骨头折断般的声响。

一开始，你以为是某根骨柱在风里开裂。下一刻，三根菌柱同时向外弯折，泥水下有什么东西缓慢站了起来。

它不像普通孢兽。

它的背脊由白色菌柱拼成，胸腔里塞满发光孢囊，四肢则是无数黑根和兽骨纠缠出来的畸形支架。每走一步，身上的骨柱都会发出空洞的鸣声，仿佛那些被它吸收的死者仍困在里面，用最后一点气息提醒后来者逃跑。

布洛克把斧头握紧。

「骨柱孢兽。」他说，「这种东西通常只守菌巢。」

莉亚瑟盯着孢兽胸口那团黑线缠成的结。

「它不是在守巢。」

瑟琳接上她的话：

「它在守路。」

## 7.2 选择 A：攻击胸口黑根结

```ts
check: observe || arcana
DC: 13
success: combatPrepScore += 2; enemy starts with 'blackRootExposed'
partial: combatPrepScore += 1
fail: enemy starts normal
```

成功 AI 续写/fallback：

你没有被它庞大的骨柱背脊吸引，而是盯住胸口那团节律异常的黑根。每当黑根收缩，孢兽四肢就会同时抽动，像一具被线牵动的傀儡。

你指出弱点。莉亚瑟第一箭射入黑根结外侧，瑟琳的闪电紧随其后，短暂撕开孢兽胸前的菌膜。

战斗开始时，骨柱孢兽获得状态：**黑根暴露**。

## 7.3 选择 B：用蓝伞孢粉干扰孢囊

```ts
condition: hasItem('blue_umbrella_spore_powder')
consume: optional true, ask confirm if system supports
check: medicine || ecology
DC: 12
success: combatPrepScore += 2; enemy first round damage -20% or loses spore skill
partial: combatPrepScore += 1
fail: item consumed but no effect
```

成功文本：

你把蓝伞孢粉撒向泥水。粉末没有立刻散开，而是被孢兽胸口的发光孢囊吸引过去。蓝光与黑根相触的一瞬间，孢兽全身骨柱同时颤抖，发出刺耳的空鸣。

艾琳立刻明白你的意图。

「它的孢囊被压住了！」

战斗第一回合，骨柱孢兽无法使用大范围孢毒技能。

## 7.4 选择 C：保护队伍阵型，避免被伏击冲散

```ts
check: leadership || defense || survival
DC: 12
success: allies gain 'formationReady'; first enemy AoE reduced
partial: one ally protected
fail: no bonus
```

成功文本：

你没有急着抢攻，而是让队伍靠近一根半塌的骨柱，借地形缩小孢兽冲锋角度。

卡西亚立刻明白你的判断，盾牌横在最前方。

「站我后面。它要冲，就让它先撞盾。」

布洛克咧嘴笑了一下。

「这才像能活着回去的打法。」

战斗开始时，队伍获得状态：**阵型稳固**。

## 7.5 选择 D：直接开战

```ts
check: none
success: no bonus
```

文本：

你没有时间再分析。骨柱孢兽已经踏碎泥水冲来，胸口孢囊一明一暗，像一颗装在尸骨里的心脏。

战斗开始。

---

# 8. 阶段六：骨柱孢兽战后与第三远征队营地入口

```ts
id: 'after-battle-bone-beast-v2'
title: '骨柱孢兽战后：沉默的营地'
background: '/assets/scenes/third-expedition-camp-entrance.webp'
entryCondition: bone_beast_battle_done
next: 'third-expedition-camp-investigation-v2'
```

## 8.1 固定剧情文本

骨柱孢兽倒下时，没有发出野兽的吼叫。

它胸口那团黑根被斩断后，庞大的身躯像失去支撑的帐篷一样塌进泥里。白色菌柱一根接一根碎裂，里面涌出大量陈旧的空气，带着铁锈、药草和烧焦皮革的味道。

艾琳忽然停住。

她从碎裂的骨柱中拾起一小片金属。

那是一枚远征队徽章的残片，边缘被菌丝腐蚀，背面却还刻着一个名字的前半截：

> ……因

布洛克沉默了一会儿。

「莱因？」

没有人回答。

前方雾气散开，露出一片几乎被骨柱包围的临时营地。帐篷倒塌，绳索断裂，传讯杆歪在泥里，几盏符文灯还在以极低频率闪烁。它们没有完全熄灭，像一群不肯闭眼的守夜人。

营地门口挂着第三远征队的标牌。

标牌下方，被人用刀刻了一行字：

> 如果有人活着到这里，别先开枪。先问他记不记得自己的名字。

凯娅轻轻吸了口气。

「这不像给怪物看的。」

瑟琳说：「这是给后来者看的。」

---

# 9. 阶段七：第三远征队营地深度调查

```ts
id: 'third-expedition-camp-investigation-v2'
title: '第三远征队临时营地'
background: '/assets/scenes/third-expedition-camp.webp'
mode: 'investigation'
minActions: 3
maxActions: 5
next: 'laine-survivor-reveal-v2'
```

## 9.1 实现要求

营地必须是后半段的“真相拼图核心”。不要让玩家点一下就发现莱因。建议至少完成 3 个调查行动后，触发固定事件“帐篷深处传来咳嗽声”，进入莱因节点。

每完成一个调查：

```ts
expedition_truth_piece_count += 1
```

当 `expedition_truth_piece_count >= 3` 时，允许进入 `laine-survivor-reveal-v2`。

---

## 9.2 调查 A：医疗帐篷

```ts
id: 'camp-medical-tent'
check: medicine || religion
DC: 12
success: addItem('expedition_medicine_log'); third_camp_medical_log_found = true; truthScore += 1
partial: third_camp_medical_log_found = true
fail: still reveal basic info
synergy: hasItem('wounded_purification_report') unlocks extra text; reverseClockScore += 1 once
```

### 固定文本

医疗帐篷塌了一半。木箱被翻开，药瓶滚得到处都是。许多药剂已经干涸，只剩瓶底一圈深蓝色结晶。帐篷中央放着三张简易担架，其中两张空着，第三张上只有一条被撕断的束缚带。

艾琳蹲下检查束缚带。带子内侧不是被刀割断的，而是被人用牙一点点咬开的。

「有人在失去理智时还想离开这里。」她说。

桌上压着一本用药记录，字迹从整齐逐渐变得混乱：

> 第一天：浅层孢毒，可净化。  
> 第二天：出现幻听，患者听见已故队员呼唤。  
> 第三天：净化有效时间缩短。患者开始忘记自己的职务。  
> 第四天：莱因要求所有人每日三次复述姓名、队籍、任务目标。  
> 第五天：门卫没有离开黑门。它不是追击者。污染源在门后，或门下。

### 若持有“伤员净化报告”

插入文本：

艾琳翻出你们在蓝伞浅滩整理的伤员净化报告，把两份记录并排放在一起。

「浅滩伤员和这里的人症状相同，但程度不同。」她说，「浅滩的人只是被孢毒影响感官；第三远征队的人，是记忆被反复改写。」

她看向担架上被咬断的束缚带。

「如果莱因还活着，我们不能只问他发生了什么。我们得先帮他记起自己是谁。」

效果：`reverseClockScore += 1`。

---

## 9.3 调查 B：指挥桌与第三远征队报告草稿

```ts
id: 'camp-command-table'
check: investigation || observe
DC: 12
success: addItem('third_expedition_field_report_draft'); third_camp_command_log_found = true; truthScore += 1; sealScore += 1
partial: third_camp_command_log_found = true; truthScore += 1
fail: reveal only fragmented text
synergy: hasItem('third_expedition_missing_report') unlocks contradiction text
```

### 固定文本

指挥桌被压在倒塌的帐篷梁下。卡西亚和布洛克一起抬开木梁，桌面上的纸张早已被水泡皱，边角粘着黑色菌丝。

瑟琳用法术烘干其中几页。显出来的不是正式报告，而是一份没有送出去的草稿。

> 致逆穹悬城城防署：  
> 我队已抵达地底堡垒外环。封印系统仍有最低限度响应。  
> 黑石门卫出现异常攻击行为，但攻击目标并非所有活体。  
> 它优先攻击携带黑根污染者，阻止其接近黑门。  
> 初步判断：门卫协议未完全崩溃。  
> 请求上层不要执行远程破门方案。  
> 重复，请不要远程破门。

最后一行被墨水和血迹盖住，只剩莱因的签名。

### 若持有“第三远征队失联报告”

插入文本：

你取出公会里拿到的失联报告。那份报告只写着“第三远征队通讯中断，堡垒危险等级上调”。没有提黑石门卫仍有协议，没有提远程破门风险，更没有提“不要破门”。

瑟琳的脸色冷了下来。

「有人删掉了最关键的判断。」

卡西亚沉声说：「或者，他们没等到这份报告送上去。」

效果：`truthScore += 1`，但只触发一次。

---

## 9.4 调查 C：传讯阵与伪造求救信号

```ts
id: 'camp-voice-array'
check: arcana || technology || thievery
DC: 14
success: addItem('corrupted_voice_array_note'); third_camp_voice_array_found = true; truthScore += 1; black_root_core_exposed = true
partial: third_camp_voice_array_found = true; truthScore += 1
fail: trigger echo hallucination text; no score
synergy: hasItem('kaeya_cipher_note') or companion 'kaeya' unlocks short-code text
```

### 固定文本

营地中央的传讯阵还在运行。

它本该向逆穹悬城发送坐标、伤亡和撤离请求，如今符文盘却被黑根缠住，圆形阵纹一亮一灭，像一只正在眨眼的巨大瞳孔。

你靠近时，阵盘里传出一段断断续续的声音：

「这里是第三远征队……请求……开门……请求……开门……」

声音忽然变成赫尔曼的低语：

「执行破门。」

又变成米娜的声音：

「任务更新，请继续深入。」

最后，它变成你自己的声音。

「我知道怎么打开门。」

### 若队伍有凯娅或持有“凯娅暗号纸条”

插入文本：

凯娅脸上的表情第一次变得认真。她蹲在传讯阵旁，匕首尖轻轻拨开一段黑根，露出下面几枚短码符号。

「这不是城防标准码。」她说，「这是黑市走私短讯里会用的伪装码。短、快、难追踪。」

她抬头看你。

「有人，或者某个东西，学会了把非法短码套进城防传讯阵里。这样上面收到的就不是完整报告，而是一句被剪过的命令。」

瑟琳低声说：「比如……执行破门。」

效果：`truthScore += 1`，`black_root_core_exposed = true`。

---

## 9.5 调查 D：黑石样本与封印裂纹

```ts
id: 'camp-blackstone-sample'
check: arcana || religion || ecology
DC: 14
success: addItem('black_root_sample_fragment'); third_camp_blackstone_sample_found = true; reverseClockScore += 1; combatPrepScore += 1
partial: third_camp_blackstone_sample_found = true; combatPrepScore += 1
fail: addStatus('black_root_whisper')
synergy: bone_wetland_sample_quality >= 1 unlocks comparison text
```

### 固定文本

营地后方有一块从堡垒外环剥落的黑石样本。它被放在三层符文框里，旁边写着“不得直接接触”。

黑石表面本该光滑坚硬，如今却长出细密根须。那些根须没有扎进泥土，而是扎进符文线里，像在吸食封印本身。

瑟琳伸手悬在样本上方，没有碰。

「黑根不是从孢海长进堡垒。」她说，「它是从封印裂隙里长出来，再反过来污染孢海。」

### 若 `bone_wetland_sample_quality >= 1`

插入文本：

你想起骨柱湿地里的样本。那里的黑线像污染末梢，而眼前这块黑石里的根须更粗、更深，像源头伸出的血管。

布洛克低声说：「所以骨柱湿地那些东西，只是被它牵过去的。」

效果：`reverseClockScore += 1`。

成功获得：**黑根样本残片**。该残片不是最终结局 B 的完整“黑根样本”，但可以在 Boss 战前让“暴露核心”选项 DC -2。

---

## 9.6 调查 E：个人遗物与远征队登记册回收

```ts
id: 'camp-personal-tokens'
check: observe || persuasion || empathy
DC: 11
success: addItem('bloodied_expedition_gauntlet'); third_camp_personal_tokens_found = true; mercyScore += 1; laine_trust += 1
partial: third_camp_personal_tokens_found = true; mercyScore += 1
fail: no penalty
synergy: hasItem('missing_expedition_registry') unlocks names text
```

### 固定文本

营地角落堆着一些个人物品：断裂的弓弦、被水泡皱的家书、半盒没有吃完的糖、一枚磨损严重的骰子，还有一只染血的远征队护手。

护手内侧刻着一句话：

> 莱因，别再替别人站最后一班岗。

这不是正式编号，也不是战术标记。只是某个队友随手刻下的玩笑，带着活人之间才有的熟悉。

艾琳轻轻合上护手。

「他们不是一串失踪人数。」她说。

### 若持有“失踪远征队登记册”

插入文本：

你翻开公会登记册，开始对照遗物上的名字。

断弓属于侦察手梅尔。药瓶属于随队医师卡洛。那枚骰子属于一个总在任务备注里画笑脸的年轻守卫。登记册上的名字在这一刻不再是墨水，而是一件件被主人来不及带走的东西。

布洛克沉默很久，最后把酒壶从腰间解下，倒了一点在泥地上。

「给下不了酒馆的人。」他说。

效果：`mercyScore += 1`。

---

# 10. 阶段八：发现莱因

```ts
id: 'laine-survivor-reveal-v2'
title: '最后一个守夜人'
background: '/assets/scenes/third-expedition-camp-interior.webp'
entryCondition: expedition_truth_piece_count >= 3
next: 'laine-stabilization-v2'
```

## 10.1 固定剧情文本

当你们准备离开营地时，医疗帐篷深处传来一声很轻的咳嗽。

所有武器同时抬起。

那声音太像人了。也正因为太像人，才更让人不敢相信。

卡西亚走在最前，盾牌一点点推开垂落的帆布。里面没有新的怪物，只有一个男人蜷缩在倒塌的药柜后。他身上的远征队制服几乎看不出原本颜色，肩章被撕掉一半，胸前绷带下透出黑色根丝的阴影。

他很瘦，像被这片湿地一点点啃空。可他的右手仍死死按在腰侧短剑上。即使昏迷、发抖、快要死去，他也没有让那把剑离开自己能拔出的距离。

听见脚步，他猛地睁眼。

「姓名。」

他的声音嘶哑得不像活人。

「说出你的姓名、队籍、任务目标。」

你还没回答，他又像被什么东西拽住记忆一样，痛苦地捂住头。

「不……不对……这是我的问题……我才是……」

他抬起眼，瞳孔里有蓝色孢光，也有黑根留下的细线。

「我是莱因。」

他艰难地吐出这几个字，像把自己从水底拖出来。

「第三远征队……副哨长……任务目标……确认地底堡垒状态，禁止黑门开启。」

他看向你们，眼神忽然变得极度警惕。

「你们是上面派来的？」

「他们是不是还想开门？」

---

# 11. 阶段九：莱因稳定与询问

```ts
id: 'laine-stabilization-v2'
title: '莱因：记住自己的名字'
background: '/assets/scenes/third-expedition-camp-interior.webp'
mode: 'dialogueAndCheck'
next: 'camp-night-talk-v2'
```

## 11.1 实现方式

玩家必须先选择一种处理莱因的方式，再进入证词。该选择影响莱因状态和结局可用性。

### 选择 A：先稳定莱因的身体污染

```ts
check: medicine || religion
DC: 14
bonus:
  hasItem('blue_umbrella_spore_powder'): +2
  hasItem('wounded_purification_report'): +1
  hasItem('yunling_talisman'): +2 or auto prevent fail once
success:
  laine_alive = true
  laine_stabilized = true
  laine_trust += 2
  laine_truth_level = max(laine_truth_level, 2)
  mercyScore += 2
  reverseClockScore += 1
partial:
  laine_alive = true
  laine_stabilized = false
  laine_trust += 1
  laine_truth_level = max(laine_truth_level, 1)
  mercyScore += 1
fail:
  laine_alive = true but critical
  laine_truth_level = max(laine_truth_level, 1)
  no softlock
```

#### 成功文本

你示意所有人先放低武器。

艾琳立刻跪到莱因身边。她没有急着施展净化，而是先按住他的肩膀，一字一句问：

「你是谁？」

莱因的嘴唇颤了一下。

「莱因。」

「你的队籍？」

「第三远征队……副哨长。」

「你的任务？」

他痛苦地吸了一口气。黑根在绷带下蠕动，像想把这句话重新塞回他体内。

你打开蓝伞孢粉的瓶塞。微光落在伤口边缘时，黑根猛地收缩。艾琳趁机把圣徽按上去，白光沿着根丝缝隙渗入，莱因整个人像从噩梦里摔醒一样剧烈喘息。

如果持有**云苓的护身符**，插入：

这时，你行囊里的小护身符忽然微微发热。蓝色菌叶与白枝烛芯在透明外壳里亮了一瞬。你想起云苓把它塞给你时认真到有些笨拙的样子：

「下面黑，要记得回来哦。」

那点微弱的护光没有驱散污染，却像一只小手，帮莱因从黑根的低语里多拽回一口气。

莱因终于看清了你们。

「不是幻觉。」他低声说，「你们是真的。」

效果：莱因稳定，解锁完整证词。

### 选择 B：直接追问堡垒真相

```ts
check: intimidation || persuasion || investigation
DC: 13
success:
  laine_truth_level = max(laine_truth_level, 2)
  truthScore += 2
  laine_trust -= 1
partial:
  laine_truth_level = max(laine_truth_level, 1)
  truthScore += 1
fail:
  laine panic scene
  laine_truth_level = max(laine_truth_level, 1)
```

#### 成功文本

你没有绕开问题，直接问他：

「黑石门卫到底是什么？」

莱因的表情瞬间变了。他像是听见某个禁词，手指猛地扣紧短剑。

「不是怪物。」他说。

这四个字几乎是从牙缝里挤出来的。

「至少一开始不是。」

他艰难地抬头，眼里混着恐惧和愤怒。

「我们以为它杀了前哨队，所以向它开火。可后来我看见了——有个被黑根寄生的队员想冲进黑门，是门卫把他拦下。它杀他的时候，还把身体挡在门前。」

他呼吸越来越急。

「它一直在守门。它只是……已经分不清谁被污染，谁没有。」

效果：获得核心真相，但莱因信任下降。

### 选择 C：用巡逻记录里的句子唤回莱因

```ts
condition: hasItem('third_patrol_record')
check: persuasion || empathy
DC: 11
success:
  laine_stabilized = true
  laine_trust += 2
  laine_truth_level = 3
  truthScore += 2
  mercyScore += 1
  addItem('laine_memory_anchor')
partial:
  laine_truth_level = 2
  laine_trust += 1
fail:
  laine_truth_level = 1
```

#### 成功文本

你没有先问问题，而是取出那本被孢水泡烂的第三巡逻队记录，读出其中一句：

「禁止回应熟人的声音。」

莱因浑身一震。

你继续读：

「门里有人敲钟。不是求救，是警告。」

他的眼神开始聚焦，像一个在深水里快要溺死的人终于看见岸上的火光。

「那是……我写的。」

他声音很轻。

「我让他们每天读一遍。后来有人开始用队长的声音叫门，有人用母亲的声音叫他们回家。我们就规定，任何声音都不能回应，除非对方先说出姓名、队籍、任务目标。」

他看着你，忽然笑了一下。那笑容很短，也很疲惫。

「你们把它带回来了。」

你获得关键道具：**莱因的记忆锚点**。

### 选择 D：认为莱因危险，要求他交出识别牌后留下

```ts
check: persuasion || intimidation
DC: 12
success:
  laine_left_behind = true
  laine_alive = true
  addItem('laine_badge')
  laine_badge_obtained = true
  mercyScore -= 1
  truthScore += 1
partial:
  laine_left_behind = true
  addItem('laine_badge')
  laine_badge_obtained = true
fail:
  laine panic, still drops badge later
```

#### 文本

你们不能带着一个随时可能被黑根控制的人继续深入。

这个判断很冷，但并不愚蠢。

莱因听完后沉默了很久。他没有求你，也没有解释自己还能撑住。他只是用颤抖的手摘下脖子上的识别牌，递给你。

「如果门卫还认得这个，告诉它……」

他停住，似乎不知道该把话说给一个人，还是一块被污染的黑石。

「告诉它，第三远征队没有全逃。」

你获得关键道具：**莱因的识别牌**。

效果：可继续主线，但结局 A/C 条件变高。

## 11.2 莱因证词固定段

无论玩家选择哪种处理方式，只要莱因未立即死亡，都至少触发低配证词。根据 `laine_truth_level` 显示不同版本。

### 低配证词：`laine_truth_level >= 1`

莱因靠在药柜旁，胸口每一次起伏都像在和黑根争夺身体。

「第三远征队抵达堡垒时，黑石门卫已经醒了。」

「它攻击了我们。我们以为它是敌人。」

「后来才发现……它只攻击靠近黑门的人，尤其是那些听见声音、想开门的人。」

「门后有东西在学我们说话。」

### 完整证词：`laine_truth_level >= 2`

「第一天，我们以为门卫失控。」

「第二天，传讯阵开始收到上层命令，说要我们配合远程破门。可我们的报告明明写的是不要破门。」

「第三天，有人听见死去队友在门后求救。那个人打开了第一道内闸。」

莱因闭上眼，喉结滚动。

「门卫杀了他。」

「我当时恨它。直到我看见黑根从那个人身体里爬出来，想钻进门缝。」

「门卫把自己的左臂塞进门缝里，用身体把黑根压回去。」

「它不是在守堡垒。」

莱因睁开眼。

「它在守我们。」

### 记忆锚点证词：`laine_truth_level >= 3`

莱因从怀里摸出一片被血浸透的布。布里包着一小块黑石碎片，上面刻着古老的门卫编号。

「它有名字。」

他说。

「格朗-赫尔。旧语里是‘最后一块门石’。」

「我最后一次看见它时，它已经被黑根缠住半边身体。它举起武器对着我，但没有砍下来。」

莱因看向瑟琳。

「它让我走。」

「不，是它的协议让它让我走。它知道至少要有一个人把真相带回去。」

你获得线索：**门卫真名线索**。后续堡垒外环可拓印完整真名。

---

# 12. 阶段十：营地夜谈与伙伴差分

```ts
id: 'camp-night-talk-v2'
title: '营地夜谈：不要让真相死在这里'
background: '/assets/scenes/third-expedition-camp-night.webp'
next: 'fortress-outer-ring-v2'
```

## 12.1 固定剧情文本

你们没有立刻进入堡垒。

第三远征队营地已经证明了一件事：越靠近地心之门，越不能只凭第一眼判断敌人。队伍需要休整，也需要决定如何面对一个可能仍在守门、也可能随时失控的黑石门卫。

夜晚并没有真正降临。地底没有太阳，只有菌光从蓝变成更深的青色。符文灯在营地边缘微弱闪烁，照得每个人脸上都像蒙着一层旧梦。

莱因如果被救下，则插入：

莱因坐在医疗帐篷门口，身上盖着艾琳找来的毯子。他没有睡。每隔一段时间，他就会低声重复一遍自己的姓名、队籍和任务目标。

「莱因。第三远征队副哨长。确认堡垒状态。禁止黑门开启。」

像祈祷，也像惩罚。

莱因如果被留下，则插入：

莱因留在医疗帐篷里。你们离开前，他要求你把束缚带重新系上。不是因为他信不过你们，而是因为他信不过下一次醒来的自己。

「如果我开始用别人的声音说话，别回答。」他说。

## 12.2 伙伴差分文本

根据已招募伙伴显示最多 3 段，不要一次刷屏过长。优先显示和玩家此前选择相关的伙伴。

### 艾琳差分

条件：队伍有艾琳。

艾琳坐在熄灭的药炉旁，手指轻轻擦拭圣徽。

「我以前以为，净化就是把污秽从身体里驱走。」

她看向莱因所在的帐篷。

「可是这里的污染不只在身体里。它会冒充思念、愧疚、命令和责任。它不是逼人堕落，它让人相信自己正在做正确的事。」

如果玩家此前救治浅滩伤员：

「你在浅滩选择帮那些伤员时，我就觉得你不是只会往前冲的人。」

「后面如果还有必须停下来的时刻，我希望你还能停下来。」

效果：`mercyScore += 1`。

### 布洛克差分

条件：队伍有布洛克。

布洛克坐在帐篷外，用粗布擦斧刃。他擦得很慢，像在想很久以前的事。

「我见过矿井塌方。」他说，「最糟的不是石头砸下来，是上面的人听见下面喊救命，却不知道该不该继续挖。」

他看向堡垒方向。

「现在也一样。门后有东西喊救命，门前有个门卫挡着。我们要是听错了，死的就不只是下面几个人。」

如果玩家在喝酒游戏中获得较高信任：

「你酒量不一定好，脑子还行。」他咧嘴笑了一下，「别让我收回这句话。」

### 凯娅差分

条件：队伍有凯娅。

凯娅坐在传讯阵残骸旁，匕首尖挑着一截已经死掉的黑根。

「我讨厌这种东西。」

这句话不像她平时会说的玩笑。

「偷东西有规矩。骗钱也有规矩。至少你得让对方知道自己输给了谁。」

她把黑根丢进火里。

「这东西连声音都偷。它用你信任的人说话，让你自己打开门。」

如果持有凯娅暗号纸条：

「暗号本来是用来确认‘你是你’的。」她看向你，「后面要是有人用我的声音说话，先问暗号。答不上来，就砍。」

效果：后续一次声音诱导检定 DC -1。

### 莉亚瑟差分

条件：队伍有莉亚瑟。

莉亚瑟站在营地边缘，箭已经搭在弦上很久，却一直没有射出去。

「森林里也有会模仿声音的兽。」她说，「但它们只是为了捕猎。」

她看着那些骨柱。

「这里不一样。这里的声音像是在学习我们。它先学求救，再学命令，最后学信任。」

### 卡西亚差分

条件：队伍有卡西亚。

卡西亚检查盾牌边缘的裂口，动作沉稳。

「我不喜欢不清楚的战场。」她说，「敌人是谁，目标是什么，撤退线在哪里。这些东西不清楚，就会死人。」

她抬头看向你。

「但莱因让我想起一件事。有时候站在最前面的，不一定是敌人。也可能是最后一个还没退的人。」

### 瑟琳固定差分

瑟琳在营地中央画出一个银色小圆阵。阵纹像钟表一样缓慢转动，却始终差半格无法闭合。

「逆钟法术不能简单倒转一切。」她说，「我们不能把死亡当成可以随便撤销的错误。」

她指向莱因的识别牌，或者莱因留下的记忆锚点。

「但如果一个存在还保留着足够明确的‘自我’，我可以尝试把它锚回污染前的某个瞬间。」

她停顿了一下。

「前提是，我们知道它是谁。」

效果：提示结局 C 需要 `莱因的记忆锚点`、`门卫真名拓片`、`守门者协议残页`。

---

# 13. 阶段十一：地底堡垒外环

```ts
id: 'fortress-outer-ring-v2'
title: '地底堡垒外环：仍在响应的门'
background: '/assets/scenes/fortress-outer-ring.webp'
next: 'fortress-gate-and-protocol-v2'
```

## 13.1 固定剧情文本

地底堡垒终于出现在你们眼前。

它不像废墟。

废墟会坍塌，会沉默，会被时间磨成一堆不再抵抗的石头。可这座堡垒仍在抵抗。黑色城墙嵌在地底岩层中，巨大的符文制动轮半埋在菌毯下，断裂的铁链从高处垂落，像被斩断的巨兽筋腱。每隔数十息，墙体深处就会亮起一道微弱蓝光，沿着符文槽缓慢游走，最后熄灭在中央黑门前。

那不是生命。

却也不是死亡。

莱因若同行：

莱因在看见堡垒的一瞬间停下脚步。他脸色惨白，却仍强迫自己站直。

「我们第一次到这里时，也以为它已经死了。」

他低声说。

「后来门卫醒了。」

莱因若未同行但有识别牌：

你掌心的莱因识别牌忽然发热。背面残留的黑石纹路亮起一线微光，像某个老旧系统在迟钝地辨认来者。

## 13.2 伏笔回收差分

### 若持有“赫尔曼的抽屉笔记”

插入文本：

你想起赫尔曼抽屉里那句没有写进正式报告的话：

> 封印系统仍有响应。若响应来自门卫，不得贸然破门。

现在你终于明白他为什么急着派人下潜。上层看到的是失联和怪物，赫尔曼看到的也许是另一个更糟的可能：

如果门卫还在守门，而逆穹悬城却把它当成障碍清除，那么真正被放出来的东西，可能会顺着主缆一路爬回城市。

效果：`truthScore += 1`，只触发一次。

### 若持有“指名委托书原件”

插入文本：

指名委托书上的城防印章在靠近堡垒时泛起微弱的蓝光。它不是权限钥匙，却能证明你们不是普通盗掘者。

瑟琳说：「旧系统还认城防章，但权限不够。要开真正的门，我们还需要远征队识别。」

提示：莱因识别牌更重要。

---

# 14. 阶段十二：权限门与守门者协议调查

```ts
id: 'fortress-gate-and-protocol-v2'
title: '权限门与守门者协议'
background: '/assets/scenes/fortress-gate.webp'
mode: 'investigationAndGate'
next: 'guardian-prebattle-choice-v2'
```

## 14.1 权限门打开方式

### 方式 A：使用莱因识别牌

```ts
condition: hasItem('laine_badge') || laine_gave_badge
check: none or easy arcana DC 8
success:
  fortress_gate_open_method = 'badge'
  sealScore += 1
  truthScore += 1
```

文本：

你把莱因的识别牌按进门侧的凹槽。

黑石门禁沉默很久。久到你几乎以为它已经彻底死去。随后，门内传来一声低沉的齿轮声。

符文一枚接一枚亮起。

> 第三远征队副哨长权限确认。  
> 生还者标记：不稳定。  
> 守门协议：未终止。  
> 警告：门后污染仍在扩散。  
> 禁止执行破门。

莱因若同行，插入：

莱因闭上眼，肩膀轻轻颤了一下。

「它还认得我们。」

这句话里没有庆幸，只有迟来的疼痛。

### 方式 B：解读权限门残缺符文

```ts
condition: !hasItem('laine_badge')
check: arcana || investigation
DC: 15
bonus: hasItem('underground_fortress_emblem') +2; hasItem('commission_original') +1
success:
  fortress_gate_open_method = 'decipher'
  sealScore += 0
partial:
  open but trigger alarm; combatPrepScore -= 1
fail:
  forced open fallback; sealScore -= 1
```

文本：

没有莱因识别牌，权限门只能被强行解读。

瑟琳和凯娅分别处理符文与机械锁。旧城防章能骗过外层识别，地下堡垒徽章能补上一部分旧协议，但缺少真正的远征队权限，门禁始终发出低沉警告。

> 权限不足。  
> 请提交生还者识别。  
> 请提交守门者确认。  
> 请勿破门。

如果成功：

你们没有完全破解权限，而是避开了最危险的几道锁。门缓缓打开，里面吹出一阵冷得不正常的风。

如果失败：

符文锁被迫过载。门开了，但堡垒深处立刻响起沉闷警钟。

效果：后续 Boss 第一阶段获得额外警戒状态。

## 14.2 协议调查点 A：守门者协议残页

```ts
check: investigation || arcana
DC: 12
success: addItem('guardian_protocol_page'); guardian_protocol_known = true; truthScore += 2; mercyScore += 1
partial: guardian_protocol_known = true; truthScore += 1
fail: no item but basic hint
```

### 成功文本

门厅一侧的石壁上刻着一整套古老协议。大部分已经被黑根覆盖，只有几段在识别牌亮起时重新显现。

> 黑石门卫并非处刑装置。  
> 它为地心之门最后封锁单元。  
> 当城防、祭司、工程师全部失效时，门卫自动接管封印。  
> 门卫有权攻击试图开启黑门者。  
> 门卫不得离开门前三十七步。  
> 门卫若遭污染，应优先以自身为楔，维持封闭。

艾琳读到最后一句时，声音停住。

布洛克低声说：「以自身为楔……」

瑟琳看向深处。

「所以它不是被困在那里。」

卡西亚接上：

「是它把自己钉在那里。」

你获得线索：**守门者协议残页**。

## 14.3 协议调查点 B：门卫真名拓片

```ts
check: history || arcana || religion
DC: 13
success: addItem('guardian_true_name_rubbing'); guardian_name_known = true; combatPrepScore += 1; ending_guardian_remains_available check enabled
partial: guardian_name_known = true
fail: no item, but name can still be learned if laine_truth_level >= 3
```

### 成功文本

黑石门廊内侧有一圈旧语铭文。你们清理掉表层菌斑后，瑟琳用银粉拓下一段保存最完整的文字。

> 格朗-赫尔。  
> 最后一块门石。  
> 不退，不眠，不回应门后的呼唤。

莱因若同行：

莱因看着那个名字，喉咙动了一下。

「我听见队长骂它怪物的时候，它没有反应。」

「但我喊这个名字时，它停了一下。」

「它还记得。」

你获得线索：**门卫真名拓片**。

## 14.4 协议调查点 C：黑根核心方向

```ts
check: ecology || arcana
DC: 14
bonus: hasItem('black_root_sample_fragment') +2; bone_wetland_sample_quality >= 1 +1
success: black_root_core_exposed = true; addItem('black_root_sample'); combatPrepScore += 2
partial: black_root_core_exposed = true; combatPrepScore += 1
fail: black_root_core_exposed = false
```

### 成功文本

你沿着门厅里的黑根走向墙角，发现它们并不是杂乱生长。所有根丝都绕开门卫站位，集中钻向黑门下方一道细不可见的裂缝。

瑟琳把骨柱湿地和营地黑石样本的记录摊开，对照根丝走向。

「这些不是枝条。」她说，「是神经。」

「门后的东西在借黑根感知外面。孢兽、传讯阵、骨柱声音，都是它伸出来的手。」

你切下一段仍在抽动的根丝，用蓝伞孢粉和符文封入容器。

你获得材料：**黑根样本**。

效果：结局 B 可用性提高。

---

# 15. 阶段十三：黑石门卫战前选择行动

```ts
id: 'guardian-prebattle-choice-v2'
title: '黑石门卫：战前选择'
background: '/assets/scenes/dark-gate-hall.webp'
mode: 'singlePreBattleAction'
nextOnResolve: 'battle-blackstone-guardian'
```

## 15.1 固定剧情文本

黑门大厅比你想象中更大。

它不像房间，更像一座被掏空的山腹。地面铺满黑石板，每一块石板上都刻着封印符文。那些符文大多已经暗下去，只剩靠近黑门的区域还在发出深蓝色微光。

而黑石门卫就站在那里。

它比任何远征报告里描述的都高大。古老黑石构成铠甲般的躯体，肩部垂着断裂锁链，胸口嵌着一枚已经开裂的符文核心。它的左臂不自然地插进黑门缝隙，像用自己的身体堵住一道不断扩大的伤口。

黑根从门缝里爬出，缠住它半边身体。每一次黑根收缩，它的头部都会微微偏转，像同时听见两个命令。

一个命令让它守门。

另一个命令让它杀死所有靠近的人。

莱因若同行：

莱因踉跄着往前一步。

「格朗-赫尔。」

黑石门卫的头部停住了。

只停了一瞬。

下一刻，黑根猛地收紧，门卫胸口的符文由蓝转黑。它拔出巨刃，刃尖拖过地面，擦出一串冷火。

瑟琳低声说：「它听见了。但黑根也听见了。」

## 15.2 选择 A：呼唤门卫真名，唤醒守门协议

```ts
condition: hasItem('guardian_true_name_rubbing') || guardian_name_known || laine_truth_level >= 3
check: persuasion || religion || arcana
DC: 13
success:
  guardian_mercy_understood = true
  combatPrepScore += 2
  boss starts with 'protocolFlicker'
  mercyScore += 1
partial:
  combatPrepScore += 1
fail:
  boss starts normal
```

成功文本：

你没有先举起武器。

你喊出那个刻在黑石门廊上的名字：

「格朗-赫尔。」

大厅里的封印符文同时闪了一下。

黑石门卫的巨刃停在半空。它胸口那枚开裂核心里，蓝光艰难地从黑色裂纹间渗出。

一段古老而断续的声音从它体内传来：

> ……识别……守门协议……未终止……  
> ……远离……黑门……  
> ……我……仍在……

黑根立刻像蛇群一样收紧，将那点蓝光压回裂缝。

但你们已经争取到了一瞬。

Boss 战开始时，黑石门卫获得状态：**协议闪回**。第一阶段攻击力或行动频率降低。

## 15.3 选择 B：暴露黑根核心，准备斩断污染

```ts
condition: black_root_core_exposed || hasItem('black_root_sample_fragment') || hasItem('black_root_sample')
check: ecology || arcana || attack
DC: 14
success:
  combatPrepScore += 2
  boss starts with 'blackRootWeakPoint'
  ending_cut_black_root_available = true
partial:
  combatPrepScore += 1
fail:
  boss starts normal
```

成功文本：

你没有盯着门卫的巨刃，而是看向它左臂与黑门缝隙交接的位置。

那里不是装甲薄弱点，而是黑根最密集的地方。每当门卫试图后退，黑根就从门缝里收紧，像要把它重新拖回某个命令里。

你把黑根样本摔在地上。样本朝门缝方向抽动，证明了你的判断。

「那里是源头。」瑟琳说。

莉亚瑟的箭已经瞄准黑根交汇处。

「那就别打守门人。」

她松开弓弦。

「打牵着它的线。」

Boss 战开始时，黑根弱点暴露。

## 15.4 选择 C：布置逆钟锚点，尝试保留门卫自我

```ts
condition: hasItem('laine_memory_anchor') && (hasItem('guardian_true_name_rubbing') || guardian_name_known)
check: arcana || history
DC: 15
bonus: hasItem('wounded_purification_report') +1; bone_wetland_sample_quality >= 2 +1
success:
  reverse_clock_anchor_ready = true
  reverseClockScore += 2
  ending_reverse_clock_available = true
partial:
  reverseClockScore += 1
fail:
  no bonus, but no lock
```

成功文本：

瑟琳把莱因的记忆锚点放在银色圆阵中央，又将门卫真名拓片压在其上。

圆阵缓缓转动，像一枚试图倒拨却始终卡住的钟。

莱因的记忆从锚点里浮现，不是完整画面，而是一段声音：

「格朗-赫尔没有杀我。」

「它让我走。」

「它想让我们知道，门不能开。」

黑石门卫胸口的蓝光再次亮起。这一次，光芒没有立刻被黑根吞掉。

瑟琳脸色苍白，却没有停止施法。

「我不能把它变回过去。」

「但我可以让它记住，自己为什么站在这里。」

效果：解锁结局 C“逆钟锚定”。

## 15.5 选择 D：直接攻击门卫本体

```ts
check: attack || athletics
DC: 12
success: combatPrepScore += 1, but mercyScore -= 1
partial: no score
fail: boss first attack empowered
```

文本：

你选择不再犹豫。

无论它曾经是什么，现在挡在你们面前的都是一具足以杀死整支队伍的战争造物。卡西亚举盾前压，布洛克低吼着冲向侧翼，莉亚瑟的箭直指门卫胸口开裂核心。

黑石门卫抬起巨刃。

封印大厅里的所有符文同时变暗。

战斗开始。

---

# 16. 阶段十四：Boss 战后固定剧情

```ts
id: 'after-battle-blackstone-guardian-v2'
title: '黑门之前：最后的处置'
background: '/assets/scenes/dark-gate-after-battle.webp'
entryCondition: blackstone_guardian_defeated
next: 'final-ending-choice-v2'
```

## 16.1 固定文本

黑石门卫跪倒在黑门前。

它没有彻底碎裂。巨刃断成两截，胸口核心布满裂纹，左臂仍死死卡在门缝里。黑根被你们斩断了大半，却还有更深的部分从门后探出，像不甘心退回黑暗的手指。

大厅里的符文忽明忽暗。

每一次亮起，你都能看见门卫胸口深处残留的蓝光。

每一次熄灭，你又能听见门后那些声音。

「开门。」

「救我。」

「回家。」

「执行命令。」

最后，所有声音合成一个与你完全相同的声音：

「你已经走到这里了。现在只差最后一步。」

艾琳的圣徽亮起，挡住那声音。

布洛克握紧斧头，第一次没有急着砍下去。

凯娅看向你：「现在总该由活人说话了。」

瑟琳脸色苍白，银色圆阵在她脚下若隐若现。

「我们有几种选择。」她说，「但每一种都要付代价。」

莱因若仍活着：

莱因扶着墙站起来，看向门卫。

「它站了十年。」

他声音很哑。

「别让它最后只被记成怪物。」

---

# 17. 阶段十五：最终四结局选择

```ts
id: 'final-ending-choice-v2'
title: '最终抉择'
background: '/assets/scenes/dark-gate-after-battle.webp'
mode: 'endingChoice'
```

## 17.1 结局可用性计算

进入结局选择前计算：

```ts
ending_guardian_remains_available =
  guardian_protocol_known &&
  guardian_name_known &&
  (laine_alive || hasItem('laine_badge')) &&
  mercyScore >= 3 &&
  sealScore >= 1

ending_cut_black_root_available =
  black_root_core_exposed &&
  (hasItem('black_root_sample') || combatPrepScore >= 3) &&
  truthScore >= 3

ending_reverse_clock_available =
  reverse_clock_anchor_ready &&
  hasItem('laine_memory_anchor') &&
  guardian_name_known &&
  reverseClockScore >= 3

ending_forced_seal_available = true
```

如果某结局不可用，在 UI 中灰掉并提示缺少条件，不要完全隐藏。提示要用剧情化语言：

- A 不可用：`你们还不足以证明门卫仍是守门者。`
- B 不可用：`你们还没有找到黑根核心的准确位置。`
- C 不可用：`逆钟锚点不足，瑟琳无法锁定门卫的自我。`
- D 永远可用：`即使真相残缺，封印仍必须暂时维持。`

---

## 17.2 结局 A：守门者仍在

```ts
id: 'ending-guardian-remains-v2'
name: '结局 A：守门者仍在'
condition: ending_guardian_remains_available
reward: addItem('guardian_mark')
achievement: 'ending_guardian_remains'
CG: '/assets/scenes/ending-guardian-remains.webp'
```

### 选择文本

「不摧毁门卫。修复守门协议，让格朗-赫尔继续镇守黑门。」

### 结局正文

你没有下令处决黑石门卫。

你把莱因的识别牌放在它胸口开裂的核心前，又将守门者协议残页按在黑石地面上。瑟琳的银色符文沿着协议残文一寸寸亮起，艾琳的圣徽压住黑根残余的低语。

莱因若活着：

莱因跪在门卫面前，声音颤得几乎不成句。

「格朗-赫尔。」

「第三远征队副哨长莱因，确认守门协议未终止。」

「你没有离岗。」

黑石门卫胸口的蓝光亮了一下。

那不是回答，却像一次迟来的呼吸。

门后传来无数声音。它们哭喊、命令、哀求，甚至用你们每个人最熟悉的声音请求开门。可这一次，黑石门卫缓慢抬起残破的右臂，将断刃重新插入黑门前的石槽。

> 守门协议……重启。  
> 第三远征队证词……记录。  
> 黑门……不得开启。

黑根在蓝光中一寸寸退回门缝。

它仍然污染着门卫。它仍然没有真正消失。格朗-赫尔也不会因此恢复成古老传说中完美的守门者。

但它重新站了起来。

不是作为敌人。

而是作为最后一块门石。

回到逆穹悬城后，赫尔曼沉默着读完你们带回的证词。他没有为自己辩解，也没有立刻下令封存档案。很久之后，他亲手在第三远征队失联报告上补上一行：

> 他们没有失联。他们抵达了门前，并阻止了一次错误的开门。

莱因若活着，他会在城防疗养所醒来。每天清晨，他仍会重复姓名、队籍和任务目标。只是最后一句慢慢变了。

「任务目标：把真相带回去。」

CG 构图：黑门前，残破黑石门卫重新跪守，队伍以背影剪影站在远处。门卫胸口有微弱蓝光，黑根退入门缝。不要把角色立绘直接贴上去，要让角色融入环境。

---

## 17.3 结局 B：斩断黑根

```ts
id: 'ending-cut-black-root-v2'
name: '结局 B：斩断黑根'
condition: ending_cut_black_root_available
reward: addItem('black_root_core_remnant')
achievement: 'ending_cut_black_root'
CG: '/assets/scenes/ending-cut-black-root.webp'
```

### 选择文本

「集中力量斩断黑根核心，牺牲门卫残躯，彻底阻断污染外延。」

### 结局正文

你们最终决定不再试图保住门卫。

这不是因为你们把它当成怪物，而是因为你们已经看见黑根钻入它核心太深。格朗-赫尔仍在守门，但它的身体已经成了污染延伸到外界的桥。

布洛克把斧头扛到肩上，低声说：「对一个站岗站到最后的人来说，这不算好结局。」

卡西亚接过话：「但可能是它还能完成的最后一次任务。」

你将黑根样本放入封印槽，瑟琳据此推算出根系收缩的节律。莉亚瑟的箭贯入第一处节点，凯娅切断符文线下的暗根，艾琳用圣徽压住门后的声音。

最后一击落在门卫左臂与黑门交接处。

黑根尖叫起来。

那不是生物的叫声，而像千万句被偷来的声音同时被撕碎。米娜、赫尔曼、萨洛、尼布、莱因，甚至你自己的声音，全都在一瞬间从门缝里涌出，又在蓝白色光芒中断裂。

黑石门卫低下头。

它胸口核心闪过最后一次蓝光。

> 守门……完成。  
> 污染……截断。  
> 后继者……请勿开门。

然后，它的左臂和半边身体一起碎成黑石尘埃。

黑门没有开启。

但门前再也没有那个站了十年的守门者。

回到逆穹悬城后，城防署把这次行动定义为“污染源截断成功”。报告写得准确、冷静、没有多余情绪。可在报告附件里，你们放入了门卫真名拓片。

从此以后，堡垒档案中不再只写“黑石门卫异常个体”。

它有名字。

格朗-赫尔。

CG 构图：黑门紧闭，门前只剩半截断刃与散落黑石残骸。队伍背影站在冷蓝光中，画面中心是被切断的黑根核心。

---

## 17.4 结局 C：逆钟锚定

```ts
id: 'ending-reverse-clock-anchor-v2'
name: '结局 C：逆钟锚定'
condition: ending_reverse_clock_available
reward: addItem('reverse_clock_anchor_shard')
achievement: 'ending_reverse_clock_anchor'
CG: '/assets/scenes/ending-reverse-clock.webp'
```

### 选择文本

「使用莱因记忆锚点与门卫真名，尝试将格朗-赫尔锚回污染前的守门瞬间。」

### 结局正文

瑟琳告诉你，这不是治愈。

逆钟法术无法让十年的污染像没有发生过一样消失。它不能复活死去的远征队，不能修好裂开的黑门，也不能把格朗-赫尔变回古老协议里完美无损的守门者。

它只能做一件事。

在污染彻底吞没门卫之前，把它最清醒的那个瞬间固定下来。

你把莱因的记忆锚点放在圆阵中央。门卫真名拓片压在上方，守门者协议残页围成半圈。艾琳低声祈祷，白枝圣徽的光芒不再向外驱散，而是向内收束，像替一段即将散掉的记忆点灯。

瑟琳的银色圆阵开始逆向旋转。

大厅里的声音全部变慢。

黑根收缩的声音、符文闪烁的声音、门后呼唤的声音，甚至你自己的心跳，都像被拉进一口古老的钟里。

莱因的记忆在阵中浮现：

黑石门卫站在门前。远征队向它开火。它没有追击逃走的人，而是转身，将左臂插入即将裂开的门缝。

然后，它回头看了莱因一眼。

那不是人的眼神。

可那一刻，莱因明白了它的意思。

走。

把真相带回去。

瑟琳咬破嘴唇，银色符文从她眼角一路蔓延到指尖。

「现在！」

你喊出门卫的名字。

「格朗-赫尔！」

黑石门卫胸口的蓝光猛然亮起。黑根像潮水一样向外翻卷，又被逆钟圆阵强行拖回裂隙边缘。门卫没有恢复完整，甚至没有站起来。可它抬起仅剩的右臂，把断刃重新按回封印槽。

> 记忆……确认。  
> 守门者……格朗-赫尔。  
> 协议……继续。

从那以后，黑石门卫进入一种近乎静止的状态。它既没有真正活着，也没有彻底死去。逆钟锚点让它永远停在“选择守门”的那个瞬间。

回到逆穹悬城后，瑟琳休养了很久。她不愿称这次法术为胜利。

「我只是把一个人的证词，交还给一个快要忘记自己的守门者。」

莱因若活着，会在很久之后去探望瑟琳。他们谈了很短的时间。离开前，莱因只说了一句话：

「谢谢你让它记得。」

CG 构图：黑门前银色逆钟圆阵展开，门卫残躯被固定在蓝银色时间光中，黑根像被冻结的潮水。队伍站在圆阵外，瑟琳背影位于画面侧前方。

---

## 17.5 结局 D：强制暂封

```ts
id: 'ending-forced-seal-v2'
name: '结局 D：强制暂封'
condition: true
reward: addItem('temporary_seal_report')
achievement: 'ending_forced_seal'
CG: '/assets/scenes/ending-forced-seal.webp'
```

### 选择文本

「证据不足或时间不够，优先执行强制暂封，保证黑门暂时不被打开。」

### 结局正文

你们没有足够的证据修复门卫协议，也没有准确定位黑根核心，更没有完成逆钟锚定所需的记忆条件。

但黑门正在震动。

有时候，真相来不及被完整拼好，灾难就已经把手伸到门缝边。

卡西亚第一个做出判断。

「先封门。」

没有人反驳。

瑟琳启动堡垒残存的应急封印，艾琳以圣徽稳定符文，布洛克和卡西亚把门卫残躯推回黑门前的封印槽。凯娅切断外围所有传讯符文，防止门后的声音继续伪装成上层命令。

这不是优雅的方案。

它粗暴、仓促，甚至带着错误。

黑石门卫在封印启动时发出低沉的碎裂声。你无法判断那是痛苦，还是协议最后一次响应。黑根被强行压回门缝，但没有被清除。大厅里的符文重新亮起，却亮得不稳定，像一盏风中的灯。

> 临时封印完成。  
> 稳定期限：未知。  
> 建议：不得破门。不得回应门后声音。不得删除第三远征队记录。

回到逆穹悬城后，赫尔曼签署了新的封锁令。缆梯下层路线被暂时关闭，城防署开始重新审查第三远征队档案。

这不是最好的结局。

莱因的真相可能残缺。格朗-赫尔的名字可能无人知晓。黑根仍在门后等待下一次裂隙。

但逆穹悬城还在。

有时，暂时守住，也是一种胜利。

CG 构图：黑门被大量临时符文锁链封住，门卫残骸半跪在门前，队伍背影正在离开。画面压抑但不能绝望，远处有微弱蓝光。

---

# 18. AI 续写与 fallback 要求

之前出现过“等待 KP 回复几秒后强制跳战斗”的问题。本次必须修。

## 18.1 所有 AI 续写节点必须有 fallback

以下节点必须内置本地 fallback 文本：

```ts
'blue-shoal-investigation-v2'
'bone-wetland-route-choice-v2'
'bone-beast-prebattle-v2'
'laine-stabilization-v2'
'guardian-prebattle-choice-v2'
'final-ending-choice-v2'
```

伪代码：

```ts
async function resolveStoryChoice(choice) {
  setKpLoading(true)
  const fallback = getFallbackText(choice.id, rollResult, currentFlags)

  try {
    const aiText = await requestAiKp({ choice, rollResult, flags, inventory })
    appendStory(aiText || fallback)
  } catch (error) {
    appendStory(fallback)
  } finally {
    setKpLoading(false)
    applyChoiceEffects(choice, rollResult)
    goNext(choice.next)
  }
}
```

禁止：

```ts
// 错误：AI 没返回就直接跳战斗，没有剧情承接
setTimeout(() => startBattle(), 3000)
```

必须：

```ts
// 正确：AI 失败时先显示 fallback，再允许玩家点“继续”进入战斗
appendStory(fallbackText)
showContinueButton('进入战斗')
```

## 18.2 战前选择行动固定流程

骨柱孢兽与黑石门卫战前必须走完整流程：

```text
显示战前危机文本
  ↓
玩家选择一个行动
  ↓
掷骰判定
  ↓
显示结果文本，允许使用一次重投道具
  ↓
确认结果
  ↓
AI 续写或 fallback
  ↓
应用战斗 buff/debuff
  ↓
进入战斗
```

不得直接从选择跳到战斗。

---

# 19. 推荐实现顺序

Codex 按以下顺序做，降低风险：

1. 新增/确认 flags、score、items/clues。
2. 修改蓝伞浅滩战斗胜利 next 到 `after-battle-blue-shoal-expanded-v2`。
3. 添加蓝伞浅滩战后与调查节点。
4. 添加骨柱湿地路线选择与骨柱孢兽战前节点。
5. 接入骨柱孢兽战斗胜利后的 `after-battle-bone-beast-v2`。
6. 添加第三远征队营地调查节点，至少 5 个调查点。
7. 添加莱因发现、稳定、证词节点。
8. 添加营地夜谈差分。
9. 添加堡垒外环、权限门、守门者协议调查。
10. 添加黑石门卫战前选择。
11. 接入 Boss 战胜利后的最终处置节点。
12. 添加四结局可用性判断、结局文本、奖励与成就。
13. 给所有 AI 续写节点补 fallback，修复等待 KP 卡死问题。
14. 跑通测试：最少线、真相线、救莱因线、逆钟线、鲁莽线。

---

# 20. 测试用例

## 20.1 最少线：玩家调查少、没救好莱因

预期：仍可通关，但只能稳定进入结局 D，可能开放 B。

```text
蓝伞浅滩调查失败或少调查
骨柱湿地快速穿过
营地只调查 3 项
莱因未稳定，只拿识别牌
堡垒强行开门
Boss 战后只能选强制暂封，或在黑根信息足够时选斩断黑根
```

## 20.2 真相线：玩家认真调查但不做逆钟

预期：结局 A 或 B 可用。

```text
获得第三巡逻队记录
获得第三远征队报告草稿
获得守门者协议残页
获得门卫真名拓片
莱因稳定或至少拿到识别牌
Boss 前呼唤真名
结局 A 可用
```

## 20.3 逆钟线：玩家收集记忆锚点

预期：结局 C 可用。

```text
蓝伞浅滩救治伤员
获得伤员净化报告
获得第三巡逻队记录
莱因稳定成功
使用巡逻记录唤回莱因
获得莱因记忆锚点
获得门卫真名拓片
Boss 前布置逆钟锚点成功
结局 C 可用
```

## 20.4 鲁莽线：玩家一路强攻

预期：剧情仍通，但文本更压抑，D 结局保底。

```text
不调查尸体
回应声音失败
骨柱孢兽直接开战
营地粗暴追问莱因
堡垒强行开门
Boss 前直接攻击
强制暂封可用
```

---

# 21. 最终验收标准

完成后应满足：

1. 蓝伞浅滩之后不再剧情跳跃，读起来有连续探索感。
2. 每个阶段至少回收一个前文道具或伏笔。
3. 莱因是后半段核心，不可被省略。
4. 黑石门卫的身份从“敌人”逐步翻转为“被污染的守门者”。
5. 玩家调查越多，最终选择越丰富。
6. 即使调查少，也不会卡死，仍能通关到强制暂封。
7. AI 请求失败时，剧情不会停在“等待 KP 回复”，也不会无文本直接跳战斗。
8. 四结局条件清楚、文本完整、奖励与成就明确。
9. 所有新增节点可以被存档/读档恢复。
10. 不要把角色立绘直接贴进结局 CG；CG 只作为环境主导的队伍背影/中景构图。

