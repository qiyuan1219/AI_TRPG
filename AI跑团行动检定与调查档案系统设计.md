# AI 跑团游戏：行动检定、调查奖励与档案系统设计

## 1. 设计目标

这套系统的目标是让玩家不只是“点选项看剧情”，而是通过自己的行动参与调查、收集证据、解锁信息，并影响后续剧情。

核心体验：

```text
玩家行动 → 检定判定 → 获得道具 / 档案 / 线索 → 背包查看 → 解锁后续剧情
```

它适合你们现在的 AI 跑团 / 侦探式冒险结构，尤其适合“逆穹城”“地底堡垒”“失联远征队”“地心之门封印状态”这类调查主线。

---

## 2. 核心原则

### 2.1 推荐选项 + 自定义行动

不要只给玩家 3 个固定选项，否则参与感会偏低。更推荐：

```text
3~5 个推荐行动 + 1 个自定义行动输入框
```

示例：

```text
你站在吊桥尽头，巨大石门挡住去路。门上刻满封印符文，锁链仍在低声震动。

推荐行动：
1. 检查石门上的封印符文
2. 使用公会徽记进行核验
3. 观察周围是否有埋伏
4. 强行撬动锁链
5. 自定义行动
```

玩家也可以输入：

```text
我不急着开门，先观察吊桥下面有没有异常声音，再用剑柄轻敲石门听回声。
```

系统需要解析玩家行动，并判断是否触发检定和奖励。

### 2.2 AI 负责叙事，系统负责状态

AI 可以描述：

```text
你在柜台旁翻到一份被火漆封过的报告单，纸张边缘已经发黄。
```

但真正把《远征队失联报告》加入背包，应该由游戏状态系统执行。

推荐职责划分：

```text
AI：生成叙事、解释检定结果、给出下一轮行动建议
系统：管理背包、档案、线索、任务、flag、NPC 关系
```

---

## 3. 总体流程

```text
玩家选择行动 / 输入自定义行动
↓
系统识别行动类型、目标、方式、风险
↓
判断是否需要检定
↓
执行投骰 / 判定
↓
根据结果发放奖励或代价
↓
更新背包、档案、线索、剧情状态、任务日志
↓
AI 根据新状态继续叙事
↓
生成下一轮可行动选项
```

---

## 4. 场景对象设计

每个场景应该有可交互对象。玩家的行动围绕这些对象展开，而不是凭空发生。

示例：公会大厅。

```js
const guildHallScene = {
  id: "guild_hall",
  name: "冒险者公会大厅",

  description: "柜台后的烛光摇晃，公会书记员正在整理几份来自逆穹城的档案。墙上的委托板挂满了火漆封印的羊皮纸。",

  interactables: [
    {
      id: "commission_board",
      name: "委托公告板",
      type: "object",
      description: "墙上贴满了来自各大城邦的委托。"
    },
    {
      id: "mission_report_stack",
      name: "报告单堆",
      type: "document_source",
      description: "柜台旁放着几份被翻阅过的远征队报告。"
    },
    {
      id: "guild_clerk",
      name: "公会书记员",
      type: "npc",
      description: "一名疲惫的书记员正在整理档案。"
    }
  ]
};
```

---

## 5. 行动数据结构

每个行动可以绑定检定、奖励、显示条件和是否只能触发一次。

```js
const action = {
  id: "inspect_reports",
  label: "观察柜台旁的报告单",
  type: "investigate",
  target: "mission_report_stack",

  check: {
    attribute: "investigation",
    dc: 12,
    dice: "1d20"
  },

  rewards: {
    criticalSuccess: [
      { type: "document", id: "report_missing_expedition_01" },
      { type: "document", id: "map_deep_mine_fragment" },
      { type: "clue", id: "hidden_route_to_fortress" }
    ],
    success: [
      { type: "document", id: "report_missing_expedition_01" },
      { type: "clue", id: "expedition_saw_spore_beasts" }
    ],
    partial: [
      { type: "clue", id: "expedition_saw_spore_beasts" }
    ],
    fail: [
      { type: "clue", id: "guild_files_were_removed" }
    ],
    criticalFail: [
      { type: "flag", id: "guild_clerk_alerted", value: true },
      { type: "relationship", target: "guild", delta: -5 }
    ]
  },

  onceOnly: true,

  visibleWhen: {
    scene: "guild_hall"
  }
};
```

字段说明：

| 字段 | 作用 |
|---|---|
| `id` | 行动唯一编号 |
| `label` | 玩家看到的行动文本 |
| `type` | 行动类型，如调查、交谈、战斗、使用道具 |
| `target` | 交互目标 |
| `check` | 检定配置 |
| `rewards` | 不同判定结果对应奖励 |
| `onceOnly` | 是否只能触发一次 |
| `visibleWhen` | 行动显示条件 |

---

## 6. 行动类型设计

建议先设计这些基础行动类型：

| 类型 | 说明 | 常见检定 |
|---|---|---|
| `observe` | 观察环境 | 感知 |
| `investigate` | 调查物品、档案、机关 | 调查 |
| `talk` | 与 NPC 交谈 | 魅力、洞察 |
| `use_item` | 使用道具 | 根据道具决定 |
| `force` | 强行破坏、推开、撬动 | 力量 |
| `stealth` | 潜行、绕行 | 敏捷 |
| `arcana` | 分析魔法、符文、封印 | 奥术 |
| `combat` | 发起攻击 | 命中检定 |
| `custom` | 玩家自由输入行动 | AI 解析后转为具体类型 |

---

## 7. 检定结果分级

不要只做“成功 / 失败”。建议至少使用五档：

```text
大成功
成功
部分成功
失败
大失败
```

示例函数：

```js
function getCheckResult(total, dc, naturalRoll) {
  if (naturalRoll === 20) return "criticalSuccess";
  if (naturalRoll === 1) return "criticalFail";
  if (total >= dc + 5) return "criticalSuccess";
  if (total >= dc) return "success";
  if (total >= dc - 3) return "partial";
  return "fail";
}
```

结果设计：

| 结果 | 设计方式 |
|---|---|
| 大成功 | 获得完整信息 + 额外隐藏奖励 |
| 成功 | 获得目标奖励 |
| 部分成功 | 获得部分线索，但可能不完整 |
| 失败 | 不应卡死，可以给替代线索或提示 |
| 大失败 | 触发代价，如敌意上升、时间消耗、机关启动 |

---

## 8. 调查奖励系统

奖励不只包括普通道具，也包括档案、线索和剧情状态。

| 类型 | 说明 |
|---|---|
| `item` | 普通物品，如药水、钥匙、绳索 |
| `document` | 可阅读档案，如报告单、日志、地图 |
| `clue` | 线索标签，用于推理和解锁剧情 |
| `flag` | 剧情状态，如某门已开启、NPC 已警觉 |
| `quest_update` | 任务目标更新 |
| `relationship` | NPC 或势力关系变化 |
| `location_unlock` | 解锁新地点 |
| `action_unlock` | 解锁新行动选项 |

示例：观察报告单。

```text
玩家行动：观察柜台旁的报告单
检定：调查 DC 12

大成功：获得《远征队失联报告》+《深层矿道残图》+ 隐藏线索
成功：获得《远征队失联报告》+ 线索“远征队曾遭遇孢化地底兽”
部分成功：只获得线索“远征队曾遭遇孢化地底兽”
失败：发现档案柜中有文件被刻意抽走
大失败：被书记员发现，公会信任度下降
```

---

## 9. 背包与档案系统

### 9.1 背包分类

建议背包拆成：

```text
背包
├── 消耗品
├── 装备
├── 关键物品
├── 档案
└── 线索
```

| 分类 | 示例 |
|---|---|
| 消耗品 | 治疗药水、解毒剂 |
| 装备 | 长剑、护盾、护甲 |
| 关键物品 | 公会徽记、降渊通行牌 |
| 档案 | 远征队失联报告、矿道草图 |
| 线索 | 孢化地底兽活动痕迹、信标同时熄灭 |

### 9.2 档案类物品结构

```js
const documentItem = {
  id: "report_missing_expedition_01",
  name: "远征队失联报告",
  type: "document",
  category: "archive",
  icon: "report_scroll",
  readable: true,

  summary: "一份记录失联远征队最后行动轨迹的公会认证报告。",

  content: {
    title: "远征队失联报告",
    sections: [
      {
        heading: "队伍信息",
        body: "第三远征队共七人，于三个月前从逆穹城前线堡垒出发，目标为地底堡垒旧址。"
      },
      {
        heading: "最后记录",
        body: "队伍在深层矿道发现大面积蓝绿色菌斑，并报告有疑似孢化地底兽的活动痕迹。"
      },
      {
        heading: "异常情况",
        body: "通讯中断前，队长曾提到矿道墙壁中传来类似敲击声的回音，随后所有信标同时熄灭。"
      },
      {
        heading: "备注",
        body: "报告末尾有被墨水划掉的部分，只能隐约看见“不要靠近发光铆钉尽头”几个字。"
      }
    ]
  },

  tags: [
    "expedition",
    "underdark",
    "spore_beast",
    "missing_team",
    "main_quest"
  ],

  unlocks: [
    "dialogue_guild_clerk_ask_about_spore_beast",
    "route_warning_glowing_rivets"
  ]
};
```

---

## 10. 线索系统

档案是玩家可以阅读的完整内容，线索是系统用于判断剧情、对话和行动解锁的标签。

```js
const clue = {
  id: "expedition_saw_spore_beasts",
  name: "远征队曾遭遇孢化地底兽",
  description: "第三远征队在失联前报告过疑似孢化地底兽的活动痕迹。",
  source: "report_missing_expedition_01",
  tags: ["monster", "spore_beast", "expedition"]
};
```

用线索解锁对话：

```js
const dialogueOption = {
  id: "ask_about_spore_beast",
  text: "追问书记员：报告中提到的孢化地底兽是什么？",
  visibleWhen: {
    hasClue: "expedition_saw_spore_beasts"
  }
};
```

---

## 11. 多入口线索设计

关键线索不要只放在一个判定里，否则玩家失败就可能卡关。

例如关键线索：

```text
第三远征队曾遭遇孢化地底兽
```

可以通过多个入口获得：

```text
1. 成功观察公会报告单
2. 与公会书记员交谈成功
3. 在矿道中调查蓝绿色菌斑
4. 在失联营地发现残缺日志
```

这样即使玩家某一次检定失败，也仍然有机会获得主线信息。

---

## 12. 游戏状态结构

### 12.1 MVP 版 GameState

```js
const gameState = {
  player: {
    hp: 28,
    armor: 5,
    attributes: {
      strength: 2,
      dexterity: 3,
      perception: 2,
      investigation: 4,
      arcana: 1,
      charisma: 0
    }
  },

  inventory: ["guild_badge"],
  documents: [],
  clues: [],

  flags: {
    guild_report_checked: false,
    gate_opened: false,
    guild_clerk_alerted: false
  },

  relationships: {
    guild: 30,
    city_guard: 20
  },

  questLog: {
    mainQuest: "investigate_earthcore_gate",
    currentObjective: "前往逆穹悬城",
    completedObjectives: []
  },

  sceneState: {
    currentScene: "guild_hall",
    visitedScenes: ["guild_hall"]
  }
};
```

### 12.2 物品数据库

```js
const itemDatabase = {
  guild_badge: {
    id: "guild_badge",
    name: "公会徽记",
    type: "key_item",
    category: "key_item",
    summary: "冒险者公会认证身份的徽记，可用于核验委托权限。"
  },

  report_missing_expedition_01: {
    id: "report_missing_expedition_01",
    name: "远征队失联报告",
    type: "document",
    category: "archive",
    summary: "记录第三远征队失联前最后行动的报告。",
    contentId: "doc_missing_expedition_01"
  }
};
```

### 12.3 文档数据库

```js
const documentDatabase = {
  doc_missing_expedition_01: {
    id: "doc_missing_expedition_01",
    title: "远征队失联报告",
    sections: [
      {
        heading: "队伍信息",
        body: "第三远征队共七人，于三个月前从逆穹城前线堡垒出发。"
      },
      {
        heading: "最后记录",
        body: "队伍最后一次回报中提到蓝绿色菌斑、异常敲击声和疑似孢化地底兽。"
      },
      {
        heading: "异常情况",
        body: "所有信标在同一时间熄灭。"
      },
      {
        heading: "残缺备注",
        body: "不要靠近发光铆钉尽头。"
      }
    ]
  }
};
```

---

## 13. AI 输出结构建议

建议让 AI 每轮输出类似结构：

```json
{
  "narration": "你在柜台旁翻到一份被火漆封过的报告单，纸张边缘已经发黄。",
  "check_result": {
    "attribute": "investigation",
    "dc": 12,
    "roll": 14,
    "modifier": 3,
    "total": 17,
    "result_level": "success"
  },
  "state_updates": {
    "add_items": [],
    "add_documents": ["report_missing_expedition_01"],
    "add_clues": ["expedition_saw_spore_beasts"],
    "set_flags": {
      "guild_report_checked": true
    },
    "relationship_delta": {}
  },
  "next_actions": [
    "询问书记员报告中的孢化地底兽",
    "检查委托火漆",
    "离开公会前往矿道",
    "自定义行动"
  ]
}
```

前端或后端收到后，再更新状态。

---

## 14. 公会大厅完整示例

### 14.1 场景行动

```js
const guildHallActions = [
  {
    id: "inspect_reports",
    label: "观察柜台旁的报告单",
    type: "investigate",
    target: "mission_report_stack",
    check: {
      attribute: "investigation",
      dc: 12,
      dice: "1d20"
    },
    rewards: {
      success: [
        { type: "document", id: "report_missing_expedition_01" },
        { type: "clue", id: "expedition_saw_spore_beasts" }
      ],
      partial: [
        { type: "clue", id: "expedition_saw_spore_beasts" }
      ],
      fail: [
        { type: "clue", id: "guild_files_were_removed" }
      ]
    },
    onceOnly: true
  },

  {
    id: "talk_to_clerk",
    label: "询问书记员远征队情况",
    type: "talk",
    target: "guild_clerk",
    check: {
      attribute: "charisma",
      dc: 13,
      dice: "1d20"
    },
    rewards: {
      success: [
        { type: "clue", id: "expedition_saw_spore_beasts" },
        { type: "clue", id: "guild_hiding_casualties" }
      ],
      partial: [
        { type: "clue", id: "expedition_saw_spore_beasts" }
      ],
      fail: [
        { type: "relationship", target: "guild", delta: -2 }
      ]
    },
    onceOnly: false
  },

  {
    id: "inspect_guild_seal",
    label: "检查委托火漆与公会认证",
    type: "investigate",
    target: "commission_board",
    check: {
      attribute: "investigation",
      dc: 10,
      dice: "1d20"
    },
    rewards: {
      success: [
        { type: "clue", id: "commission_is_authentic" }
      ],
      fail: []
    },
    onceOnly: true
  }
];
```

---

## 15. 背包与档案界面建议

### 15.1 背包页签

```text
背包
├── 全部
├── 消耗品
├── 装备
├── 关键物品
├── 档案
└── 线索
```

### 15.2 档案卡片

```text
【远征队失联报告】
类型：档案
来源：公会大厅 - 报告单堆
摘要：记录第三远征队失联前最后行动的报告。

[查看详情]
```

### 15.3 档案详情

```text
远征队失联报告

一、队伍信息
第三远征队共七人，于三个月前从逆穹城前线堡垒出发。

二、最后记录
队伍最后一次回报中提到蓝绿色菌斑、异常敲击声和疑似孢化地底兽。

三、异常情况
所有信标在同一时间熄灭。

四、残缺备注
不要靠近发光铆钉尽头。
```

---

## 16. 防止重复刷奖励

对于一次性调查行为，应使用 `onceOnly` 或 flag 控制。

```js
function canRunAction(action, gameState) {
  if (!action.onceOnly) return true;
  return !gameState.flags[action.id + "_completed"];
}
```

执行后：

```js
gameState.flags["inspect_reports_completed"] = true;
```

如果玩家再次调查：

```text
你已经调查过这里，没有发现新的内容。
```

---

## 17. MVP 实现范围

第一版建议只做这些：

```text
1. 每个场景有 3~6 个推荐行动
2. 保留自定义行动输入
3. 行动可以绑定检定
4. 检定结果分为成功、部分成功、失败
5. 奖励支持 document、clue、flag、item
6. 背包中增加“档案”分类
7. 档案可以点开阅读全文
8. 线索可以影响后续行动选项
9. onceOnly 防止重复获得同一奖励
10. AI 输出结构化 state_updates，系统负责真正更新状态
```

---

## 18. 给 Codex 的开发需求提示词

```text
请帮我实现一个 AI 跑团游戏的“行动检定、调查奖励与档案系统”。

项目需求如下：

1. 每个场景包含多个 interactables 和 actions。
2. 玩家可以点击推荐行动，也可以输入自定义行动。
3. 每个 action 可以配置：
   - id
   - label
   - type
   - target
   - check
   - rewards
   - onceOnly
   - visibleWhen
4. check 支持：
   - attribute
   - dc
   - dice
5. 检定结果至少分为：
   - criticalSuccess
   - success
   - partial
   - fail
   - criticalFail
6. rewards 支持：
   - item
   - document
   - clue
   - flag
   - quest_update
   - relationship
   - location_unlock
   - action_unlock
7. document 类型要进入背包的“档案”分类，玩家可以点击查看完整内容。
8. clue 类型要进入线索列表，可以用于解锁后续对话、行动和剧情。
9. onceOnly 行动不能重复刷奖励。
10. 游戏状态需要维护：
    - inventory
    - documents
    - clues
    - flags
    - relationships
    - questLog
    - sceneState
11. AI 只负责生成 narration 和 state_updates，不允许直接修改状态。
12. 系统根据 state_updates 更新背包、档案、线索、任务和场景状态。
13. 请提供一个示例场景：公会大厅。
14. 示例行为：玩家选择“观察柜台旁的报告单”，调查检定成功后获得《远征队失联报告》和线索“远征队曾遭遇孢化地底兽”。
15. 请尽量使用清晰的数据结构，方便后续接入 React 前端。
```

---

## 19. 总结

这套系统的关键不是“给玩家奖励”，而是让玩家感觉：

```text
我通过自己的行动发现了信息。
我获得的档案真的能阅读。
我收集到的线索会影响后续剧情。
我不是在看 AI 自动讲故事，而是在参与调查。
```

推荐最终结构：

```text
场景对象
↓
行动选择 / 自定义行动
↓
检定
↓
奖励发放
↓
背包 / 档案 / 线索更新
↓
新对话、新行动、新剧情解锁
```

这会让 AI 跑团游戏更接近真正的桌面跑团体验，也能让侦探、冒险、探索类玩法更有参与感。
