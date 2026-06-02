# 碎冠之影 —— D&D AI-TRPG

> 基于大语言模型的龙与地下城跑团游戏
> AI 担任地下城主(DM)，玩家在中世纪奇幻世界中深入地下城、拯救王国

---

## 🏗 项目结构

```
demo02/
├── document/                    # 📄 D&D 设计文档（8份完整V1文档）
│   ├── 世界观文档V1.md          #   瓦尔德里王国、阴影石修道院
│   ├── 势力设定V1.md            #   四大势力设定
│   ├── NPC设定V1.md             #   NPC完整模板+关系网
│   ├── 主线剧情框架V1.md        #   5层地城+多结局
│   ├── 游戏规则文档V1.md        #   D20检定、战斗系统、成长
│   ├── 随机事件库V1.md          #   遭遇/陷阱/NPC事件库
│   ├── AI主持人手册V1.md        #   可直接用作System Prompt的DM手册
│   └── 完整玩家攻略.md          #   玩家指南
│
├── backend/                     # 🐍 Python 后端 (FastAPI)
│   ├── main.py                  #   FastAPI 入口
│   ├── config.py                #   集中配置（模型/数据库/游戏数值）
│   ├── requirements.txt         #   依赖清单
│   ├── engine/
│   │   └── rules_dnd.py         #   D20规则引擎（检定/战斗/HP计算）
│   ├── kp/
│   │   ├── dm_service.py        #   LLM-DM核心服务（Function Calling）
│   │   ├── prompt_builder_dnd.py #  System Prompt动态拼装器
│   │   └── memory.py            #   记忆系统（SQLite存储）
│   └── api/
│       └── routes_dnd.py        #   REST + SSE 流式API
│
├── frontend/                    # ⚛ React 前端 (D&D UI)
│   ├── src/
│   │   ├── App.tsx              #   主应用
│   │   ├── components/          #   UI组件
│   │   └── services/
│   │       └── api.ts           #   API封装（SSE流式对话）
│   ├── package.json
│   └── vite.config.ts
│
├── assets/                      # 🎨 游戏资源（图片素材）
└── start.bat                    # 🚀 一键启动脚本
```

---

## 🚀 快速启动

### 1. 后端

```bash
cd backend
pip install -r requirements.txt

# 配置 API Key
# 创建 .env 文件，填入 DEEPSEEK_API_KEY=your_key

# 启动服务
python main.py
# 访问 http://localhost:8000/docs 查看 API 文档
```

### 2. 前端

```bash
cd frontend
npm install
npm run dev
# 访问 http://localhost:5174
```

### 3. 一键启动 (Windows)

双击运行 `start.bat`

---

## 🧠 AI-DM 接入方案

### 核心架构

```
┌──────────────────────────────────────────┐
│              Frontend (React)             │
│  创角界面 │ 对话界面 │ 角色面板 │ D20动画  │
└──────────────────┬───────────────────────┘
                   │ SSE 流式对话
┌──────────────────┴───────────────────────┐
│            Backend (FastAPI)              │
│  ┌──────────────────────────────────┐    │
│  │          DM Service (核心)        │    │
│  │  Prompt Builder → Function Call  │    │
│  │         ↓              ↓          │    │
│  │    LLM API    Rules Engine       │    │
│  │  (DeepSeek)   (D20检定/战斗)     │    │
│  │         ↓              ↓          │    │
│  │       Memory System (SQLite)      │    │
│  └──────────────────────────────────┘    │
└──────────────────────────────────────────┘
```

### 三层分离设计

| 层级 | 组件 | 职责 |
|------|------|------|
| **创意层** | LLM (DeepSeek) | 叙事、NPC扮演、氛围营造 |
| **桥接层** | Function Calling | LLM调用检定/战斗函数 |
| **规则层** | 规则引擎 (Python) | D20检定、HP计算、战斗裁决 |

---

## 📡 API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/dnd/game/create` | 创建新游戏，返回开场白 |
| GET | `/api/dnd/game/{id}/state` | 获取当前游戏状态 |
| POST | `/api/dnd/chat/stream` | SSE流式DM对话（核心接口） |
| GET | `/api/dnd/health` | 健康检查 |

---

## 🎮 游戏特色

- **AI扮演DM**：全程由LLM叙事、扮演NPC、裁决行动
- **D20检定系统**：简化D&D 5E规则，1D20 + 调整值
- **5层地城探索**：阴影石修道院，每层独立主题和Boss
- **6种职业**：战士、法师、游荡者、牧师、游侠、术士
- **多结局**：根据玩家选择触发不同王国命运
- **NPC同伴系统**：3名同伴可组队，态度影响剧情分支
- **记忆系统**：SQLite短期+长期双层记忆存储
