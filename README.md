# 地心之门 —— D&D AI-TRPG

> AI 担任主持人的龙与地下城跑团游戏。深入幽暗地域，探索倒挂城市逆穹悬城，穿越无光孢海，揭开地心狱门的封印之谜。

---

## 🏗 项目结构

```
demo02/
├── backend/                              # Python 后端 (FastAPI)
│   ├── main.py                           # FastAPI 入口
│   ├── config.py                         # 集中配置（LLM/数据库/游戏参数）
│   ├── requirements.txt                  # Python 依赖
│   ├── engine/
│   │   ├── rules_dnd.py                  # D20 规则引擎（检定/战斗/HP）
│   │   ├── state_directives.py           # 状态指令解析
│   │   ├── trust_system.py               # 同伴信任值系统
│   │   └── companion_events.py           # 同伴支线事件引擎（4条支线）
│   ├── kp/
│   │   ├── dm_service.py                 # AI 主持人核心服务
│   │   ├── prompt_builder_dnd.py         # System Prompt 动态组装
│   │   └── memory.py                     # SQLite 记忆系统
│   └── api/
│       ├── routes_dnd.py                 # D&D REST + SSE 流式 API
│       ├── routes_tavern_dice_poker.py   # 快艇骰子 API
│       ├── routes_companion_events.py    # 同伴支线 API
│       └── routes_battle.py              # 战斗系统 API
│
├── frontend/                             # React 前端 (Vite + TypeScript)
│   ├── src/
│   │   ├── App.tsx                       # 主应用（场景路由/状态管理/结局分流）
│   │   ├── components/                   # 28个 UI 组件
│   │   │   ├── VisualNovelStage.tsx      # 视觉小说对话舞台（多阶段背景+立绘）
│   │   │   ├── TitleMenu.tsx             # 标题主菜单（视频背景）
│   │   │   ├── ActionPanel.tsx           # 行动面板
│   │   │   ├── DiceRollOverlay.tsx       # 3D 骰子动画
│   │   │   ├── BattleTestScreen.tsx      # 战斗系统（教学战+普通战+Boss战）
│   │   │   ├── TavernDicePoker.tsx       # 快艇骰子（回声酒馆）
│   │   │   ├── DrinkingDiceGame.tsx      # 喝酒骰子（布洛克招募）
│   │   │   ├── OrlanBoxGame.tsx          # 奥兰幸运盲盒（钻石抽取）
│   │   │   ├── ApothecaryShop.tsx        # 云苓黑市药铺
│   │   │   ├── CompanionEventTestScreen.tsx  # 同伴支线事件
│   │   │   ├── CharacterPanel.tsx        # 角色面板（含信任值+日志）
│   │   │   ├── TutorialOverlay.tsx       # 教程提示卡片
│   │   │   ├── CityMap.tsx               # 城市地图
│   │   │   └── ...                       # 其他组件
│   │   ├── data/                         # 游戏数据
│   │   │   ├── scriptedScenes.ts         # 固定剧情脚本（19个场景）
│   │   │   ├── dndScenes.ts              # 场景与背景图配置（14个区域）
│   │   │   ├── battleConfigs.ts          # 战斗配置（3场战斗）
│   │   │   ├── companionSideQuests.ts    # 同伴支线管理（4条+流程+AI约束）
│   │   │   ├── intelDocuments.ts         # 情报档案数据库（22份情报）
│   │   │   ├── characterRegistry.ts      # NPC 角色注册表
│   │   │   └── dndClasses.ts             # D&D 职业数据
│   │   ├── services/
│   │   │   ├── api.ts                    # API 封装 + SSE 流式对话
│   │   │   └── dndRuntime.ts             # D&D 运行时服务
│   │   ├── types/game.ts                 # 类型定义
│   │   ├── utils/
│   │   │   ├── narrative.ts             # 叙事文本解析
│   │   │   └── trust.ts                  # 信任值工具
│   │   └── styles/                       # CSS 样式
│   ├── public/assets/                    # 静态资源
│   │   ├── scenes/                       # 场景背景图
│   │   ├── characters/                   # 角色立绘
│   │   ├── chibi/                        # Q版战斗精灵图
│   │   ├── battle/                       # 战斗背景
│   │   ├── bgm/                          # 背景音乐（8首）
│   │   ├── maps/                         # 地图图标
│   │   ├── prop/                         # 道具图标（盲盒+药水）
│   │   └── sounds/                       # 音效
│   ├── package.json
│   └── vite.config.ts
│
├── data/                                 # 运行时数据
│   ├── game.db                           # SQLite 数据库
│   └── saves/                            # 游戏存档 (JSON)
│
├── document/                             # 设计文档
│   ├── new/                              # 最新版本文档（与代码同步）
│   │   └── ...                           # 世界观/剧情/系统/Boss设计等
│   └── ...                               # 初代设计文档（部分内容已过时）
│
├── 情报档案数据库.md                      # 情报系统完整清单
├── 第一幕后半段主线支线多结局编程版.md      # 后半段实现说明书
├── AI控制的伙伴信任值机制设计与实现提示词.md # 信任系统设计
├── AI跑团行动检定与调查档案系统设计.md      # 情报系统设计
├── start.bat                             # 一键启动脚本 (Windows)
└── README.md
```

---

## 🎮 剧情流程（第一幕完整版）

### 第一章：逆穹悬城（城市阶段）

```
开场动画 → 世界观叙事 → 逆穹悬城初入 → 瑟琳登场
    ↓
教学战斗（裂隙爬兽）→ 公会登记（米娜/赫尔曼）→ 获得三名队友线索
    ↓
回声酒馆 → 萨洛快艇骰子 → 获得三队友详细情报
    ↓
静默神殿 → 艾琳·白枝修女招募
    ↓
回声酒馆 → 布洛克·铁锅喝酒骰子招募 → 信任值变化
    ↓
黑市 → 暗号"断缆不问来路" → 凯娅现身 → 奥兰幸运盲盒抽钻石
    ↓
黑市深处 → 云苓药铺（可选药剂购买）→ 净化之心
    ↓
公会最终登记 → 五人小队组建完毕
```

### 第二章：无光孢海（地下探索阶段）

```
降渊缆梯中枢 → 缆梯垂降 → 孢海据点（尼布）
    ↓
艾琳支线：白枝下的名字（伤员+名册）
    ↓
战斗一：蓝伞浅滩遭遇战
    ↓
布洛克支线：回声菌林的假歌（污染菌核）
    ↓
前线废弃据点 → 远征痕迹调查
    ↓
凯娅支线：少了两个封扣（黑市暗道）
    ↓
战斗二：骨柱湿地遭遇战 → 莱因登场
    ↓
关键选择一：帮助莱因 / 无视莱因（影响结局+信任值）
    ↓
Boss战前休整 → 瑟琳支线：银杖的第一次裂痕
    ↓
Boss战：黑石门卫（三阶段）→ 核心暴露
    ↓
关键选择二：破坏核心 / 稳定核心
    ↓
结局分流：莱因选择 × 核心选择 → 4种正常结局
    ↓
团灭 → 逆时归零坏结局（2秒后回标题画面）
```

---

## 🎯 结局系统（第一幕）

| 结局 | 条件 | 描述 |
|------|------|------|
| **守门者仍在** | 帮助莱因 + 稳定核心 | 封印未破，带幸存者穿过黑石门 |
| **带伤者穿门** | 帮助莱因 + 破坏核心 | 封印崩溃，搀着莱因进入门后黑暗 |
| **冷静的远征** | 无视莱因 + 稳定核心 | 封印保留，无负担的远征继续 |
| **裂门而下** | 无视莱因 + 破坏核心 | 封印解除，不在乎代价的队伍 |
| **逆时归零** | Boss战团灭 | 时间倒流，回到标题画面 |

---

## 🤖 已实现系统

### D20 检定系统
- 所有行动提示使用 D&D 六维（力量/敏捷/体质/智力/感知/魅力）标注 DC
- 骰子结算格式：`检定成功！结果：19 = 15（点数）+ 4（【力量】加值）≥ DC12`
- D20=20 大成功 / D20=1 大失败
- 后端自动预骰，前段骰子动画展示

### 同伴信任值系统
- 4名同伴独立信任值：瑟琳 84 / 艾琳 55 / 布洛克 50 / 凯娅 45
- 5档信任：疏离(0-29) → 谨慎(30-49) → 合作(50-69) → 信赖(70-84) → 深信(85-100)
- 信任值影响：剧情对话/支线奖励强度/Boss前提示/结局台词
- 防刷机制：同节点同同伴限1次变化；总预算 positive≤12/negative≤-15
- 下缆梯前信任反馈：根据4名同伴当前信任值生成出发前台词

### 同伴支线系统
- 4条支线必定触发（进入对应区域即激活）
- 每条支线：固定开场 → 玩家检定+选择 → 危机/小战斗 → 奖励结算 → 自由对话
- 后端引擎支持的完整事件流

### 情报档案系统
- 22份可收集情报文档，覆盖12个地点
- 多入口线索设计（防卡关）：同一关键信息可从多个地点获得
- 分类：报告/日志/地图/信件/记录/笔记/账本/经文
- 稀有度：key(3)/rare(5)/uncommon(10)/common(4)

### 小游戏系统
- **快艇骰子**（萨洛情报局）：5骰重投3轮，瑟琳透视+说服技能
- **喝酒骰子**（布洛克招募）：3轮体质豁免+拼点，结果影响信任值
- **幸运盲盒**（钻石抽取）：20金/次 D20>18得钻石，8次保底

### 战斗系统
- 教学战斗：裂隙爬兽遭遇战（单场）
- 普通战斗一：蓝伞浅滩（3敌 vs 5人队）
- 普通战斗二：骨柱湿地（3敌 vs 5人队）
- Boss战：黑石门卫（1敌 HP80 AC17，三阶段）

### BGM 系统
- 8首背景音乐覆盖全部场景
- 场景→区域自动匹配
- 音量控制（BGM/音效独立）

---

## 🚀 快速启动

### 1. 配置 API Key

在 `backend/` 下创建 `.env`：
```env
DEEPSEEK_API_KEY=your_api_key_here
```

### 2. 安装 & 启动

```bash
# 后端
cd backend && pip install -r requirements.txt && python main.py

# 前端
cd frontend && npm install && npm run dev
```

浏览器打开 **http://localhost:5174**

---

## 🛠 技术栈

| 层 | 技术 |
|----|------|
| 后端 | Python FastAPI + Uvicorn |
| AI | DeepSeek V4（OpenAI兼容） |
| 前端 | React 18 + TypeScript + Vite 5 |
| 动效 | Framer Motion + TailwindCSS 3 |
| 存储 | SQLite + JSON存档 |
| 通信 | Server-Sent Events (SSE) |

---

## 📡 核心 API

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/dnd/game/create` | 创建新游戏 |
| GET | `/api/dnd/game/{id}/state` | 获取游戏状态 |
| POST | `/api/dnd/chat/stream` | SSE 流式对话（核心） |
| POST | `/api/dnd/battle/narrate` | 战斗回合叙述 |
| POST | `/api/dice-poker/start` | 快艇骰子 |
| GET/POST | `/api/dnd/saves` | 存档管理 |
| GET | `/api/dnd/game/{id}/trust` | 信任值查询 |

---

## 📄 许可证

MIT License
