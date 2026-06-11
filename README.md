# 地心之门 —— D&D AI-TRPG

> AI 担任主持人的龙与地下城跑团游戏。深入幽暗地域，探索倒挂城市逆穹悬城，穿越无光孢海，揭开地心狱门的封印之谜。

---

## 🏗 项目结构

```
demo02/
├── backend/                         # Python 后端 (FastAPI)
│   ├── main.py                      # FastAPI 入口
│   ├── config.py                    # 集中配置（LLM/数据库/游戏参数）
│   ├── requirements.txt             # Python 依赖
│   ├── engine/
│   │   ├── rules_dnd.py             # D20 规则引擎（检定/战斗/HP）
│   │   └── state_directives.py      # 状态指令解析
│   ├── kp/
│   │   ├── dm_service.py            # AI 主持人核心服务
│   │   ├── prompt_builder_dnd.py    # System Prompt 动态组装
│   │   └── memory.py               # SQLite 记忆系统
│   └── api/
│       ├── routes_dnd.py            # D&D REST + SSE 流式 API
│       ├── routes_dice_poker.py     # 快艇骰子 API
│       └── routes_companion_events.py
│
├── frontend/                        # React 前端 (Vite + TypeScript)
│   ├── src/
│   │   ├── App.tsx                  # 主应用（场景路由/状态管理）
│   │   ├── components/              # UI 组件
│   │   │   ├── VisualNovelStage.tsx # 视觉小说对话舞台
│   │   │   ├── TitleMenu.tsx        # 标题主菜单
│   │   │   ├── StartDND.tsx         # 角色创建
│   │   │   ├── ActionPanel.tsx      # 行动面板
│   │   │   ├── DiceRollOverlay.tsx  # 骰子动画
│   │   │   ├── DicePokerGame.tsx    # 快艇骰子游戏
│   │   │   ├── BattleTestScreen.tsx # 战斗系统
│   │   │   └── CityMap.tsx          # 城市地图
│   │   ├── data/
│   │   │   ├── dndScenes.ts         # 场景与背景图配置
│   │   │   ├── characterRegistry.ts # NPC 角色注册表
│   │   │   ├── scriptedScenes.ts    # 固定剧情脚本
│   │   │   └── dndClasses.ts        # D&D 职业数据
│   │   ├── services/
│   │   │   ├── api.ts               # API 封装 + SSE 流式对话
│   │   │   └── dndRuntime.ts        # D&D 运行时服务
│   │   ├── utils/narrative.ts       # 叙事文本解析
│   │   └── styles/                  # CSS 样式
│   ├── public/assets/               # 静态资源
│   │   ├── scenes/                  # 场景背景图（按放映序号命名）
│   │   ├── characters/              # 角色立绘
│   │   ├── chibi/                   # Q版头像/精灵图
│   │   ├── maps/                    # 地图与建筑图标
│   │   ├── battle/                  # 战斗素材
│   │   └── sounds/                  # 音效
│   ├── package.json
│   └── vite.config.ts
│
├── data/                            # 运行时数据
│   ├── game.db                      # SQLite 数据库
│   └── saves/                       # 游戏存档 (JSON)
│
├── document/                        # 设计文档（12+ 份）
│   ├── 世界观文档V1-地心之门.md
│   ├── 主线剧情框架V1-地心之门.md
│   ├── 势力设定V1-地心之门.md
│   ├── 最终NPC设定V1-地心之门.md
│   ├── DND战斗规则详解.md
│   ├── 逆穹城地图-生图提示词.md
│   └── 素材需求清单-地心之门.md
│
├── logs/                            # 游戏日志
├── start.bat                        # 一键启动脚本 (Windows)
└── README.md
```

---

## 🚀 快速启动

### 前置要求

- **Python 3.10+**
- **Node.js 18+**
- **DeepSeek API Key**（或其他兼容 OpenAI 格式的 LLM API）

### 1. 配置 API Key

在 `backend/` 目录下创建 `.env` 文件：

```env
DEEPSEEK_API_KEY=your_api_key_here
```

### 2. 安装依赖

```bash
# 后端
cd backend
pip install -r requirements.txt

# 前端
cd frontend
npm install
```

### 3. 启动服务

```bash
# 后端 (端口 8000)
cd backend
python main.py

# 前端 (端口 5174)
cd frontend
npm run dev
```

### 4. 一键启动 (Windows)

双击运行 `start.bat`，自动打开两个终端窗口分别启动前后端。

### 5. 访问游戏

浏览器打开 **http://localhost:5174**

---

## 🎮 游戏特色

### AI 主持人系统
- 全程由大模型扮演主持人（D&D 中的 DM/KP），负责叙事、NPC 扮演和行动裁决
- **固定剧情 + AI 实时生成** 混合架构：关键剧情对话预写为脚本确保角色准确，玩家自由行动时由 AI 实时叙事
- 支持 Function Calling：检定掷骰、金币物品、HP 变化、场景切换均由 AI 驱动规则引擎执行

### 倒挂城市 · 逆穹悬城
- 一整座城市倒挂在巨大洞穴穹顶之上，尖塔和吊桥从"天顶"垂挂而下
- 探索冒险者公会、回声酒馆、黑市、静默神殿、降渊缆梯等独特场景
- 多阶段背景图随剧情推进平滑切换

### D20 检定与战斗
- 简化 D&D 5E 规则：D20 + 属性调整值 + 熟练加值 vs DC/AC
- 完整的教学战斗和正式战斗流程
- 骰子动画、伤害计算、状态效果

### 快艇骰子小游戏
- 回声酒馆中与老板萨洛进行五骰扑克对决
- AI 参谋瑟琳提供策略建议，玩家自主决策

### NPC 同伴系统
- "银杖"瑟琳固定同行，另有 5 名可选同伴
- 信任值系统影响 NPC 行为和剧情分支
- 视觉小说风格的立绘 + 对话呈现

---

## 📡 API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/dnd/game/create` | 创建新游戏，返回固定开场脚本 + 状态 |
| GET | `/api/dnd/game/{id}/state` | 获取游戏状态 |
| POST | `/api/dnd/chat/stream` | SSE 流式主持人对话（核心接口） |
| POST | `/api/dnd/battle/narrate` | 战斗回合 AI 叙述 |
| POST | `/api/dnd/bargain/judge` | 黑市讲价判定 |
| POST | `/api/dice-poker/start` | 开始快艇骰子对局 |
| GET | `/api/dnd/saves` | 获取存档列表 |
| POST | `/api/dnd/game/{id}/save` | 保存游戏 |
| POST | `/api/dnd/saves/{slot}/load` | 读取存档 |
| GET | `/api/dnd/health` | 健康检查 |

---

## 🎨 美术风格

- **画风**：日式二次元，赛璐珞平涂，动画电影质感
- **参考**：《来自深渊》《迷宫饭》《无职转生》
- **色调**：深蓝紫 `#1a1a3e`、暗紫黑 `#0d0d1a`、青绿荧光 `#5fb7a7`、暖金 `#d4a843`
- **规格**：1920×1080，16:9，WebP/PNG

---

## 🛠 技术栈

| 层 | 技术 |
|----|------|
| 后端框架 | Python FastAPI + Uvicorn |
| AI 模型 | DeepSeek V4（兼容 OpenAI SDK） |
| 前端框架 | React 18 + TypeScript |
| 构建工具 | Vite 5 |
| UI 动效 | Framer Motion + TailwindCSS 3 |
| 数据存储 | SQLite + JSON 存档 |
| 流式通信 | Server-Sent Events (SSE) |

---

## 📄 许可证

MIT License
