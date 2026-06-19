# AI 控制的伙伴信任值机制设计文档  
## 《地心之门》第一幕编程版：Trust-AI Companion System

> 目标：将“玩家自由输入 + 检定点数 + 战斗结果 + 剧情选择”统一纳入伙伴信任值系统，让同伴不再只是固定台词 NPC，而是会根据玩家行为形成态度、给出不同建议、开放不同信息、提供不同奖励与结局反馈。  
> 本文档可直接喂给编程 AI，用于实现后端逻辑、前端展示、AI 返回格式约束和提示词工程。

---

# 一、机制定位

## 1.1 设计目标

本游戏的核心特色之一是：**AI 驱动的伙伴关系系统**。

传统跑团游戏里，同伴好感度通常由固定选项决定，例如：

- 选择 A：瑟琳 +5
- 选择 B：瑟琳 -3

但本项目存在大量玩家自由输入，例如：

- “我先安抚艾琳，让她救人，但同时让布洛克检查路线”
- “我不相信凯娅，但还是让她先拆陷阱”
- “我对瑟琳说她不用逞强，如果撑不住就退后”
- “我为了赶路，决定无视伤员”

这种自由输入无法只靠写死选项判断，因此需要由大模型在主持剧情时，同时判断：

1. 玩家行动表达了什么态度。
2. 这个行动影响哪些同伴。
3. 影响是正面、负面还是中性。
4. 变化幅度是多少。
5. 变化理由是什么。
6. 是否触发新的角色记忆、奖励、提示或伏笔。

---

# 二、核心原则

## 2.1 AI 负责“解释行为”，后端负责“保存结果”

大模型负责：

- 理解玩家自然语言行动。
- 判断该行动对同伴的情绪与信任影响。
- 输出结构化信任值变化。
- 给出理由和可展示文本。

后端负责：

- 校验 AI 返回的信任变化是否合法。
- 限制每次变化上限。
- 更新数据库中的信任值。
- 记录信任变化日志。
- 根据当前信任值决定 UI 显示、奖励解锁和剧情状态。

## 2.2 信任值不是“恋爱好感度”

信任值表示同伴是否认为玩家：

- 可靠
- 尊重他人
- 能听取专业判断
- 有底线
- 能承担队长责任
- 值得分享更多信息

它不等于单纯讨好 NPC。

例如：

- 玩家拒绝艾琳的请求，但理由充分，且没有蔑视伤员：可能只是 -2。
- 玩家不听凯娅建议，强行开锁导致受伤：凯娅 -8。
- 玩家质疑凯娅，但语气克制并要求她解释风险：凯娅 +4。
- 玩家在战斗中保护后排，哪怕失败，也可能让艾琳或瑟琳 +2。

## 2.3 信任值不替玩家做关键选择

信任值影响：

- 同伴语气
- 同伴主动建议
- 支线奖励强度
- Boss 战提示
- 结局反馈台词
- 自由对话信息深度

信任值不直接决定：

- 玩家是否能通关
- 第一幕四结局分支
- Boss 是否被击败
- 莱因是否被救
- 核心是破坏还是稳定

这些仍由玩家选择和战斗系统决定。

---

# 三、信任值数据模型

## 3.1 同伴列表

当前固定队伍：

```javascript
const companions = ['serin', 'ailin', 'brock', 'kaiya']
```

对应显示名：

```javascript
const companionNames = {
  serin: '瑟琳',
  ailin: '艾琳',
  brock: '布洛克',
  kaiya: '凯娅',
}
```

## 3.2 初始信任值建议

```javascript
const initialTrust = {
  serin: 84,   // 瑟琳固定高信任，但隐藏秘密
  ailin: 55,   // 艾琳认可任务，但要看玩家底线
  brock: 50,   // 布洛克默认公事公办
  kaiya: 45,   // 凯娅默认谨慎，先看玩家是否可靠
}
```

## 3.3 信任值范围

```javascript
trustValue: 0 - 100
```

后端必须做裁剪：

```javascript
newTrust = Math.max(0, Math.min(100, oldTrust + delta))
```

## 3.4 信任等级区间

```javascript
const trustTier = {
  0_29: '疏离',
  30_49: '谨慎',
  50_69: '合作',
  70_84: '信赖',
  85_100: '深信',
}
```

表现效果：

| 区间 | 名称 | 表现 |
|---|---|---|
| 0-29 | 疏离 | 只给最低限度信息，语气冷淡，支线奖励降低 |
| 30-49 | 谨慎 | 合作但保持距离，很少主动透露个人想法 |
| 50-69 | 合作 | 正常同行，提供专业建议 |
| 70-84 | 信赖 | 主动补充信息，愿意解释个人理由，奖励增强 |
| 85-100 | 深信 | 透露私人情绪或深层动机，提供特殊提示或强奖励 |

---

# 四、信任值变化来源

信任值变化来自四类输入：

```javascript
const trustSources = [
  'free_action',       // 玩家自由输入行动
  'preset_choice',     // 预设剧情选择
  'check_result',      // 检定结果
  'battle_result',     // 战斗结果
]
```

---

# 五、预设剧情选择的信任值

预设选择可直接写死基础变化，再允许 AI 微调语气。

例如艾琳支线：

```javascript
{
  choiceId: 'help_ailin_treat_wounded',
  baseTrustDelta: { ailin: +10 },
}
```

AI 可以根据玩家补充描述微调，但不能超出限制。

例如玩家选择“帮助艾琳救治伤员”，又补充：

> “但我提醒她最多十分钟，不能让整队陷在这里。”

这不是负面选择，可以调整为：

```javascript
{ ailin: +8, serin: +1, brock: +1 }
```

因为玩家既尊重生命，也兼顾远征效率。

---

# 六、自由输入行动的信任值判断

## 6.1 为什么自由输入要交给 AI

玩家自由输入可能包含复杂意图：

```text
我让艾琳先救人，但让布洛克同步检查风向；如果污染扩散，就立刻撤离。
```

这句话同时影响：

- 艾琳：玩家重视伤员，+信任
- 布洛克：玩家尊重他的专业，+信任
- 瑟琳：玩家会分配任务，+少量信任
- 凯娅：没有直接影响

这种复杂判断适合交给大模型。

---

## 6.2 AI 判断自由输入时的维度

AI 需要从玩家行动中识别以下维度：

```javascript
const trustEvaluationDimensions = {
  respect_companion_expertise: '是否尊重同伴专业判断',
  protect_life: '是否重视伤员、平民和队友生命',
  tactical_reasoning: '是否有战术判断和风险控制',
  honesty: '是否诚实表达恐惧、疑问或限制',
  responsibility: '是否承担队长责任',
  selfishness: '是否明显自私、贪婪或甩锅',
  recklessness: '是否鲁莽冒进',
  cruelty: '是否轻视生命或羞辱同伴',
  trust_keeping: '是否守信用，是否尊重交易或承诺',
}
```

---

## 6.3 每名同伴关注点

### 瑟琳

瑟琳更看重：

- 玩家是否诚实表达状态。
- 玩家是否接受帮助但不依赖她替自己决定。
- 玩家是否关心她的异常疲惫。
- 玩家是否尊重同伴，而不是把 NPC 当工具。
- 玩家是否在危险前保持冷静。

正面行为：

```text
承认紧张但继续前进
关心瑟琳状态
询问她的建议但自己做决定
保护队伍
不强迫她过度施法
```

负面行为：

```text
逞强并拒绝所有提醒
强迫瑟琳继续施法
粗暴逼问她隐瞒什么
把她当治疗工具
蔑视其他同伴
```

### 艾琳

艾琳更看重：

- 玩家是否尊重生命。
- 玩家是否愿意救伤员。
- 玩家是否记住牺牲者名字。
- 玩家是否避免把人命当路线成本。
- 玩家是否处理污染伤口时有耐心。

正面行为：

```text
救治伤员
整理遗物和名册
愿意带回死者名字
保护失控但未完全异化的人
```

负面行为：

```text
无视伤员
称伤员为负担
为了效率抛弃可救之人
用冷酷语言羞辱牺牲者
```

### 布洛克

布洛克更看重：

- 玩家是否听取生存专家判断。
- 玩家是否理解孢海生态不是单纯怪物巢穴。
- 玩家是否采样规范。
- 玩家是否避免乱烧、乱摸、乱吃。
- 玩家是否在危险前愿意先观察。

正面行为：

```text
先观察菌丝和风向
听布洛克判断路线
协助采样
避免烧毁健康菌林
承认自己不懂孢海并询问建议
```

负面行为：

```text
乱踩发光菌毯
乱烧菌林
不听警告直接冲向声音
嘲笑布洛克太慢
把未知生态都当敌人
```

### 凯娅

凯娅更看重：

- 玩家是否守信用。
- 玩家是否尊重交易和筹码。
- 玩家是否让她先检查陷阱。
- 玩家是否理解地下暗线和黑市规则。
- 玩家是否不会轻易把同伴当成可卖的货物。

正面行为：

```text
让凯娅先检查暗门
追问她但不指责
尊重交易承诺
不乱拿有欠账标记的补给
在陷阱前相信她的判断
```

负面行为：

```text
强行开锁
指责她必然背叛
乱拿黑市补给
赖账
把她当小偷工具人
```

---

# 七、信任值变化幅度规则

## 7.1 单次变化范围

普通自由输入：

```javascript
-5 <= delta <= +5
```

重要剧情选择：

```javascript
-12 <= delta <= +12
```

支线关键选择：

```javascript
-20 <= delta <= +15
```

Boss 前关键互动：

```javascript
-20 <= delta <= +15
```

战斗结果：

```javascript
-6 <= delta <= +6
```

## 7.2 推荐幅度含义

| 变化 | 含义 |
|---|---|
| +1 / -1 | 轻微印象变化 |
| +2 / -2 | 明确态度变化 |
| +3 / -3 | 重要回应 |
| +5 / -5 | 强烈认可或明显不满 |
| +8 / -8 | 支线关键行为 |
| +10 以上 | 角色核心价值被尊重 |
| -10 以下 | 角色核心底线被踩踏 |

## 7.3 单次事件总变化上限

同一玩家行动可能影响多个同伴，但要限制总量：

```javascript
maxTotalPositiveDeltaPerAction = +12
maxTotalNegativeDeltaPerAction = -15
```

避免 AI 过度奖励或惩罚。

---

# 八、检定点数如何影响信任值

检定结果不应直接等同于信任变化。

重点不是“成功就加信任，失败就扣信任”，而是：

```text
玩家的意图 + 检定结果 + 后续承担方式 = 信任变化
```

## 8.1 检定结果等级

```javascript
function getCheckOutcome(total, dc) {
  const margin = total - dc

  if (margin >= 10) return 'critical_success'
  if (margin >= 0) return 'success'
  if (margin >= -4) return 'fail'
  return 'critical_fail'
}
```

## 8.2 检定对信任的影响原则

| 情况 | 信任影响 |
|---|---|
| 好意图 + 成功 | 通常加信任 |
| 好意图 + 失败但承担后果 | 可小幅加信任或不变 |
| 好意图 + 失败后甩锅 | 扣信任 |
| 坏意图 + 成功 | 可能仍扣信任 |
| 鲁莽行动 + 大失败 | 明显扣信任 |
| 尊重同伴建议 + 成功 | 对应同伴加信任 |
| 不听专业建议 + 失败 | 对应同伴扣信任 |

## 8.3 示例

玩家输入：

```text
我不追那个声音，先听布洛克分析回声规律。
```

检定：生存 DC13，玩家总点数 17，成功。

AI 输出：

```json
{
  "trustChanges": [
    {
      "companionId": "brock",
      "delta": 4,
      "reason": "玩家尊重布洛克的孢海判断，并通过观察避免了诱捕风险。"
    }
  ]
}
```

玩家输入：

```text
我不管布洛克说什么，直接冲向呼救声。
```

检定：感知 DC13，玩家总点数 8，失败。

AI 输出：

```json
{
  "trustChanges": [
    {
      "companionId": "brock",
      "delta": -6,
      "reason": "玩家无视布洛克对回声菌林的专业警告，并因此触发伏击。"
    },
    {
      "companionId": "serin",
      "delta": -2,
      "reason": "玩家鲁莽行动增加了队伍整体风险。"
    }
  ]
}
```

---

# 九、战斗结果如何影响信任值

战斗信任值不应只看胜负，还要看玩家表现。

## 9.1 输入给 AI 的战斗摘要

后端在战斗结束后，把结构化战斗摘要传给 AI：

```javascript
const battleSummary = {
  battleId: 'battle_blue_shoal_01',
  result: 'win',
  rounds: 5,
  playerHpPercentAfterBattle: 42,
  allyStates: {
    serin: { hpPercent: 70, downed: false },
    ailin: { hpPercent: 50, downed: false },
    brock: { hpPercent: 80, downed: false },
    kaiya: { hpPercent: 35, downed: false }
  },
  playerActions: [
    'player_protected_ailin',
    'player_followed_brock_warning',
    'player_used_healing_potion_on_kaiya'
  ],
  tacticalFlags: {
    ignoredCompanionWarning: false,
    protectedWounded: true,
    usedConsumableToSaveAlly: true,
    recklessCharge: false,
    letAllyDownedWithoutHelp: false
  }
}
```

## 9.2 战斗信任变化规则

| 行为 | 影响 |
|---|---|
| 保护低血同伴 | 对应同伴 +2 至 +4 |
| 使用药剂救同伴 | 对应同伴 +2，艾琳 +1 |
| 听取同伴战术建议并成功 | 对应同伴 +2 至 +5 |
| 无视警告导致伏击或重伤 | 对应同伴 -3 至 -6 |
| 玩家承担前排压力 | 瑟琳 +1，艾琳 +1，视同伴而定 |
| 故意让同伴吸收伤害 | 被牺牲同伴 -5 至 -10 |
| 战斗团灭 | 进入坏结局，不做普通信任结算 |

---

# 十、AI 返回格式设计

## 10.1 推荐统一返回结构

AI 主持人每次返回剧情文本时，必须附带结构化 metadata。

```json
{
  "narration": [
    {
      "speaker": "主持人",
      "text": "……"
    },
    {
      "speaker": "瑟琳",
      "text": "……"
    }
  ],
  "trustChanges": [
    {
      "companionId": "serin",
      "delta": 2,
      "reason": "玩家承认自己紧张但仍愿意继续前进，瑟琳认为这比逞强更可靠。",
      "visibility": "show"
    }
  ],
  "memoryUpdates": [
    {
      "companionId": "serin",
      "memoryKey": "player_admitted_fear_during_descent",
      "summary": "玩家在降渊缆梯上承认自己紧张，但没有退缩。"
    }
  ],
  "flags": {
    "requiresCheck": false,
    "triggerBattle": null,
    "nextNode": "spore_outpost_arrival"
  },
  "uiHints": [
    "瑟琳的信任值上升了。"
  ]
}
```

## 10.2 字段说明

### narration

用于前端展示的剧情文本。

### trustChanges

同伴信任值变化。

字段：

```javascript
{
  companionId: 'serin' | 'ailin' | 'brock' | 'kaiya',
  delta: number,
  reason: string,
  visibility: 'show' | 'hidden'
}
```

visibility：

- `show`：前端显示“瑟琳信任值 +2”
- `hidden`：后端记录，但前端只显示“瑟琳似乎放松了一些”

建议大多数轻微变化都显示，部分伏笔可以隐藏。

### memoryUpdates

用于给 AI 后续对话提供角色记忆。

示例：

```javascript
{
  companionId: 'kaiya',
  memoryKey: 'player_kept_blackmarket_deal',
  summary: '玩家在黑市暗道中没有乱拿有欠账标记的补给，而是留下了交换物。'
}
```

### flags

用于后端推进流程。

### uiHints

用于前端提示。

---

# 十一、后端校验机制

AI 不能完全掌控数值。后端必须校验。

## 11.1 校验规则

```javascript
function validateTrustChanges(trustChanges, context) {
  return trustChanges
    .filter(change => isValidCompanion(change.companionId))
    .map(change => {
      const limit = getDeltaLimitByContext(context.eventType)

      return {
        ...change,
        delta: clamp(change.delta, -limit.negative, limit.positive),
        reason: sanitizeReason(change.reason),
      }
    })
}
```

## 11.2 不同事件的限制

```javascript
const deltaLimits = {
  free_action: { positive: 5, negative: 5 },
  preset_choice: { positive: 12, negative: 12 },
  sidequest_key_choice: { positive: 15, negative: 20 },
  battle_result: { positive: 6, negative: 6 },
  boss_preparation: { positive: 15, negative: 20 },
}
```

## 11.3 防刷机制

同一节点内，同一同伴通过自由对话最多只允许变化一次：

```javascript
const antiFarmRule = {
  freeTalkTrustChange: false,
  maxTrustChangePerNodePerCompanion: 1,
  repeatedSimilarActionPenalty: true,
}
```

自由对话默认不改变信任值，除非当前节点明确允许“关键回应”。

---

# 十二、前端展示建议

## 12.1 明示型提示

```text
瑟琳的信任值 +2
原因：你承认了紧张，但没有退缩。
```

## 12.2 沉浸型提示

```text
瑟琳看你的眼神柔和了一些。
```

## 12.3 详情面板

角色详情中显示：

```javascript
{
  name: '瑟琳',
  trust: 86,
  tier: '深信',
  recentTrustLogs: [
    '你在缆梯上承认紧张，瑟琳认为你比逞强的人更可靠。 +3',
    '你要求她休息而不是继续施法。 +10'
  ],
  unlockedNotes: [
    '她似乎比任何人都更害怕你受伤。',
    '黑石会干扰她的银杖。'
  ]
}
```

---

# 十三、同伴信任奖励设计

## 13.1 奖励类型

```javascript
const trustRewards = [
  'extra_dialogue',
  'battle_hint',
  'sidequest_item',
  'boss_hint',
  'ending_line',
]
```

## 13.2 阶段奖励

### 70+ 信赖

- 同伴主动补充专业建议。
- 支线奖励增强。
- 战斗前可能给提示。

### 85+ 深信

- 开放私人情绪。
- 提供特殊道具。
- Boss 战前提供关键环境提示。
- 结局台词更私人化。

---

# 十四、角色专属信任奖励

## 14.1 瑟琳

```javascript
serinTrustRewards = {
  trust70: '银杖护符',
  trust85: 'Boss战前环境危险提示',
}
```

## 14.2 艾琳

```javascript
ailinTrustRewards = {
  trust70: '白枝绷带',
  trust85: '濒危救治提示或污染处理额外说明',
}
```

## 14.3 布洛克

```javascript
brockTrustRewards = {
  trust70: '铁锅解毒丸',
  trust85: '回声菌粉，提示拟声或诱捕危险',
}
```

## 14.4 凯娅

```javascript
kaiyaTrustRewards = {
  trust70: '软爪锁针',
  trust85: '隐藏陷阱或暗账提示',
}
```

---

# 十五、AI 信任值判定提示词

以下提示词用于运行时调用大模型，让它在生成剧情文本时附带信任值变化。

## 15.1 Runtime Prompt：AI 主持人 + 信任值判定

```text
你是《地心之门》的 AI 跑团主持人，同时负责判断玩家行为对同伴信任值的影响。

你必须完成两件事：
1. 生成符合当前场景的剧情回复。
2. 输出结构化 trustChanges、memoryUpdates 和 flags，供后端更新状态。

【当前队伍】
- 主角：玩家
- 瑟琳：银杖法师，克制、温柔、关心玩家，隐藏未来相关秘密。重视诚实、冷静、玩家是否关心她和队伍。
- 艾琳：白枝修女，温和坚定，重视生命、伤员、遗体和名字。讨厌把人命当成路线成本。
- 布洛克：孢海生存专家，粗犷但专业，重视生态判断、采样规范和尊重自然危险。
- 凯娅：黑市猎手与盗贼，优雅讽刺，重视信用、筹码、机关判断和地下规则。

【信任值区间】
0-29 疏离：只给最低限度信息。
30-49 谨慎：合作但保持距离。
50-69 合作：正常提供专业建议。
70-84 信赖：主动补充个人看法或额外线索。
85-100 深信：开放私人情绪，可能提供特殊奖励或 Boss 提示。

【信任变化原则】
- 你可以根据玩家自由输入、预设选择、检定结果、战斗结果判断信任值变化。
- 不要机械地“成功就加、失败就扣”。重点判断玩家意图、是否尊重同伴、是否承担后果。
- 普通自由输入每名同伴变化范围为 -5 到 +5。
- 支线关键选择每名同伴变化范围为 -20 到 +15。
- 战斗结果每名同伴变化范围为 -6 到 +6。
- 一次行动不要随意影响所有同伴，只影响相关同伴。
- 如果没有明显影响，trustChanges 返回空数组。
- 自由对话期间默认不改变信任值，除非当前节点明确允许关键回应。
- 不得通过信任值改变第一幕结局分支。

【禁止】
- 不得替玩家做关键选择。
- 不得决定战斗胜负、伤害、死亡或状态。
- 不得提前揭露瑟琳来自未来。
- 不得提前揭露黑暗之门后方是地下海洋。
- 不得完整解释地底堡垒失联真相。
- 不得让 NPC 抢走玩家主角地位。

【输出格式】
你必须只输出 JSON，不要输出 Markdown，不要额外解释。

JSON 格式如下：

{
  "narration": [
    { "speaker": "主持人", "text": "剧情描述" },
    { "speaker": "同伴名", "text": "NPC台词" }
  ],
  "trustChanges": [
    {
      "companionId": "serin | ailin | brock | kaiya",
      "delta": 0,
      "reason": "为什么变化",
      "visibility": "show | hidden"
    }
  ],
  "memoryUpdates": [
    {
      "companionId": "serin | ailin | brock | kaiya",
      "memoryKey": "简短英文key",
      "summary": "本次值得记住的玩家行为"
    }
  ],
  "flags": {
    "requiresCheck": false,
    "triggerBattle": null,
    "nextNode": null
  },
  "uiHints": [
    "可展示给玩家的简短提示"
  ]
}

【当前场景信息】
{{sceneContext}}

【当前信任值】
{{trustState}}

【当前事件类型】
{{eventType}}

【检定结果，如有】
{{checkResult}}

【战斗结果，如有】
{{battleSummary}}

【玩家输入】
{{playerInput}}
```

---

# 十六、给编程 AI 的实现提示词

以下内容可以直接喂给 Cursor / Codex / CodeBuddy，让它实现该机制。

```text
请帮我在当前 React + 后端项目中实现一个“AI 控制的伙伴信任值机制”。

核心目标：
玩家在跑团剧情中的自由输入、预设选择、检定结果、战斗结果，都会影响队伍中同伴的信任值。信任值变化由大模型在返回剧情文本时附带结构化 JSON，后端校验后更新状态。

请实现以下内容：

一、数据结构

1. companionTrust
每个存档中保存：
{
  serin: number,
  ailin: number,
  brock: number,
  kaiya: number
}

初始值：
serin: 84
ailin: 55
brock: 50
kaiya: 45

范围：0-100。

2. trustLogs
保存信任变化日志：
{
  id,
  nodeId,
  companionId,
  oldValue,
  delta,
  newValue,
  reason,
  source,
  visibility,
  createdAt
}

3. companionMemories
保存同伴对玩家行为的记忆：
{
  companionId,
  memoryKey,
  summary,
  nodeId,
  createdAt
}

二、信任区间

实现 getTrustTier(value)：

0-29：疏离
30-49：谨慎
50-69：合作
70-84：信赖
85-100：深信

三、AI 返回格式

AI 每次剧情回复必须返回：

{
  narration: [],
  trustChanges: [],
  memoryUpdates: [],
  flags: {},
  uiHints: []
}

请写 TypeScript 类型：

type CompanionId = 'serin' | 'ailin' | 'brock' | 'kaiya'

interface TrustChange {
  companionId: CompanionId
  delta: number
  reason: string
  visibility: 'show' | 'hidden'
}

interface MemoryUpdate {
  companionId: CompanionId
  memoryKey: string
  summary: string
}

interface AIStoryResponse {
  narration: Array<{ speaker: string; text: string }>
  trustChanges: TrustChange[]
  memoryUpdates: MemoryUpdate[]
  flags: {
    requiresCheck?: boolean
    triggerBattle?: string | null
    nextNode?: string | null
  }
  uiHints: string[]
}

四、后端校验

不要完全相信 AI 返回的 delta。

实现 validateTrustChanges(trustChanges, eventType)：

eventType 对应限制：
free_action: +5 / -5
preset_choice: +12 / -12
sidequest_key_choice: +15 / -20
battle_result: +6 / -6
boss_preparation: +15 / -20

如果 AI 返回超过范围，自动 clamp。

还要过滤不存在的 companionId。

五、更新信任值

实现 applyTrustChanges(saveState, trustChanges, context)：

- 读取旧 trust。
- 计算 newTrust = clamp(old + delta, 0, 100)。
- 写入 companionTrust。
- 写入 trustLogs。
- 如果 visibility 为 show，则生成前端可展示提示。
- 如果 delta 为 0，不写日志。

六、同伴记忆

实现 applyMemoryUpdates(saveState, memoryUpdates, nodeId)：

- 同一个 companionId + memoryKey 不重复写入。
- memory summary 用于后续 prompt 拼接。
- 前端可以暂时不展示 memory，只在角色详情中预留。

七、前端展示

角色详情面板显示：

- 角色名
- 当前信任值
- 信任等级
- 最近 5 条信任变化日志
- 已解锁的同伴记忆或提示

剧情界面中，当 trustChanges.visibility === 'show' 时显示：
“瑟琳 信任值 +2”
并显示 reason 的简短版本。

八、AI 调用

调用 AI 时，将以下内容放入 prompt：

- 当前 nodeId
- 当前场景信息
- 当前同伴信任值
- 当前同伴最近记忆
- 玩家输入
- 事件类型 eventType
- 检定结果 checkResult，如果有
- 战斗摘要 battleSummary，如果有

要求 AI 只返回 JSON。

九、防刷机制

- 自由对话节点默认不改变信任值。
- 同一个 nodeId 内，同一个 companionId 的自由输入信任变化最多记录一次。
- 重复类似行为不重复加分。
- 支线关键选择和战斗结果不受该限制。

十、错误处理

如果 AI 返回 JSON 解析失败：
- 不更新信任值。
- 使用 narration 文本或兜底文本继续剧情。
- 记录错误日志。

如果 AI 返回非法 companionId：
- 忽略该条 trustChange。

如果 AI 返回过大 delta：
- clamp 到当前 eventType 允许范围。

十一、输出要求

请给出：
1. TypeScript 类型定义。
2. trust utility 函数。
3. applyTrustChanges 函数。
4. validateTrustChanges 函数。
5. 示例 API route 或 service。
6. 前端 TrustPanel 组件。
7. 一个调用 AI 时拼接 prompt 的示例函数。
代码要清晰，方便接入现有项目。
```

---

# 十七、评委展示话术

可以在答辩中这样介绍：

```text
我们的特色不是让 AI 随便续写剧情，而是让 AI 成为“关系裁判”。

玩家可以自由输入行动，例如“我让艾琳先救伤员，同时让布洛克检查路线”。系统会让大模型理解这个行动背后的态度：玩家尊重生命，也尊重专业分工。AI 会在剧情回复中附带结构化信任值变化，后端校验后更新角色关系。

所以同一个剧情节点，不同玩家的表达方式、检定结果和战斗表现，都会让同伴形成不同态度。信任值不会粗暴决定结局，但会影响同伴是否主动给出建议、是否透露私人信息、是否提供战前提示，以及结局时用什么语气回应玩家。

这让我们的 NPC 不再只是固定台词，而是能记住玩家行为、回应玩家风格、并参与跑团叙事的 AI 伙伴。
```

---

# 十八、最小可实现版本 MVP

如果时间紧，优先实现：

1. companionTrust 存储。
2. AI 返回 trustChanges。
3. 后端 clamp 和 applyTrustChanges。
4. 前端显示信任变化提示。
5. 角色详情显示信任等级。
6. 四个支线节点接入关键选择信任变化。
7. Boss 前根据瑟琳信任值给提示。

后续再做：

1. memoryUpdates。
2. 自由对话长期记忆。
3. 战斗表现影响信任。
4. 复杂防刷。
5. 结局台词按信任值动态变化。
