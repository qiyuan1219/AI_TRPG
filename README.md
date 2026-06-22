# 地心之门（Earthgate）

<p align="center">
  <img src="./poster.png" alt="地心之门宣传海报" width="780">
</p>

<p align="center">
  <a href="http://114.132.232.194/">在线试玩</a> ·
  <span>宣传视频：promotional_video.mp4 随参赛提交包提供</span>
</p>
> **AI 驱动的 D&D 跑团游戏** | 深圳大学 · 深龙战队  
> 黄锦意 · 黄瑜 · 朱俊熹

---

## 📖 作品简介

*地心之门*是一款以 AI 大语言模型担任主持人的龙与地下城（D&D）风格文字冒险游戏。玩家扮演赏金猎人，在倒悬于穹顶之下的奇迹城邦"逆穹悬城"集结四名同伴，穿越无光孢海，深入被封禁十年的地底堡垒，揭开黑石封印与地心之门的真相。

游戏融合了 TRPG 骰子检定、同伴信任系统、情报档案收集、多结局分流与 AI 实时续写，力图在浏览器中还原一场有血有肉的跑团体验。

---

## 🎮 核心特色

| 系统          | 说明                                                                 |
| ------------- | -------------------------------------------------------------------- |
| **AI 主持人** | DeepSeek V4 实时叙事，动态推进剧情，支持自由输入与上下文记忆         |
| **D20 检定**  | 六维属性（力量/敏捷/体质/智力/感知/魅力）标注 DC，骰子动画展示       |
| **同伴信任**  | 瑟琳/艾琳/布洛克/凯娅独立信任值，5档信任影响对话与结局               |
| **情报档案**  | 22份可收集文档，多入口线索防卡关                                     |
| **战斗系统**  | 4场战斗（教学+蓝伞浅滩+骨柱湿地+Boss黑石门卫），D&D 回合制           |
| **多结局**    | 莱因选择 × 核心选择 → 5种结局（含坏结局逆时归零）                    |
| **小游戏**    | 快艇骰子（萨洛情报局）、喝酒骰子（布洛克招募）、幸运盲盒（钻石抽取） |
| **视觉小说**  | 多阶段背景切换、角色立绘、战斗精灵、BGM 系统                         |

---

## 🗺 剧情流程

```
逆穹悬城 → 公会登记 → 回声酒馆（萨洛）→ 静默神殿（艾琳）
    → 酒馆喝酒（布洛克）→ 黑市暗号（凯娅）→ 云苓药铺
    → 五人编队登记 → 降渊缆梯垂降
    ↓
无光孢海 → 孢海据点 → 艾琳支线 → 蓝伞浅滩战斗
    → 骨柱湿地战斗 → 莱因登场 → Boss黑石门卫
    → 破坏/稳定核心 → 结局分流（A/B/C/D/逆时归零）
```

---

## 🏗 技术架构

| 层       | 技术选型                                            |
| -------- | --------------------------------------------------- |
| 后端框架 | Python FastAPI + Uvicorn                            |
| AI 模型  | DeepSeek V4（OpenAI 兼容协议）                      |
| 前端框架 | React 18 + TypeScript + Vite 5                      |
| UI       | TailwindCSS 3 + Framer Motion                       |
| 存储     | SQLite + JSON 存档                                  |
| 通信     | Server-Sent Events (SSE) 流式对话                   |
| 战斗后端 | Python 权威战斗引擎（命中/伤害/治疗/防御/群体攻击） |

### 项目结构

```
earthgate/
├── backend/               # Python 后端
│   ├── engine/            # D20 规则引擎 + 战斗引擎 + 信任系统
│   ├── kp/                # AI 主持人核心（prompt + 记忆）
│   ├── api/               # REST + SSE 流式 API
│   └── config.py          # 统一配置
├── frontend/              # React 前端
│   ├── src/components/    # 28个组件（视觉小说舞台/战斗/骰子等）
│   ├── src/data/          # 固定剧情/场景/战斗/情报数据
│   └── public/assets/     # 场景图/立绘/CG/BGM/音效
├── data/                  # 运行时数据（存档 + SQLite）
├── documents/             # 设计文档 + 审查报告
└── start.bat              # Windows 一键启动
```

---

## 🚀 快速启动

### 环境要求

- Python 3.10+
- Node.js 18+
- DeepSeek API Key

### 1. 配置

在 `backend/.env` 中设置 API Key（已预置）：

```env
DEEPSEEK_API_KEY=sk-your-key
DEEPSEEK_BASE_URL=https://api.deepseek.com
LLM_MODEL=deepseek-v4-pro
```

前端 API 地址在 `frontend/.env` 中默认为 `http://localhost:8190`。

### 2. 安装依赖

```bash
# 后端
cd backend
pip install -r requirements.txt

# 前端
cd frontend
npm install
```

### 3. 启动

```bash
# 终端1：启动后端
cd backend && python main.py

# 终端2：启动前端
cd frontend && npm run dev
```

浏览器访问 **http://localhost:5174**。

或双击 `start.bat` 一键启动（Windows）。

---

## 🎯 结局一览

| 结局           | 条件                    | 描述                               |
| -------------- | ----------------------- | ---------------------------------- |
| **守门者仍在** | 帮助莱因 + 稳定Boss核心 | 封印未破，带幸存者穿过黑石门       |
| **带伤者穿门** | 帮助莱因 + 破坏核心     | 封印崩溃，搀着莱因进入门后黑暗     |
| **冷静的远征** | 无视莱因 + 稳定核心     | 封印保留，队伍完整、高效、沉默     |
| **裂门而下**   | 无视莱因 + 破坏核心     | 封印解除，不在乎代价的队伍继续前进 |
| **逆时归零**   | Boss战团灭              | 时间倒流——"请再来一次"             |

---

## 📊 项目规模

- 前端文件：500+（含资源）
- 后端文件：50+
- 固定剧情场景：30+
- 情报文档：22份
- 战斗：4场（含3阶段Boss战）
- BGM：8首原创/改编
- 测试：前端107项 + 后端41项

---

## 🌐 核心 API

| 方法     | 路径                       | 说明                 |
| -------- | -------------------------- | -------------------- |
| POST     | `/api/dnd/game/create`     | 创建新游戏           |
| GET      | `/api/dnd/game/{id}/state` | 获取游戏状态         |
| POST     | `/api/dnd/chat/stream`     | SSE 流式对话（核心） |
| POST     | `/api/dnd/battle/narrate`  | 战斗回合叙述         |
| POST     | `/api/dice-poker/start`    | 快艇骰子             |
| GET/POST | `/api/dnd/saves`           | 存档管理             |
| GET      | `/api/dnd/game/{id}/trust` | 信任值查询           |

---

## 🖥 服务器部署指南

以下流程只更新前端，不会覆盖服务器上的 `backend/.env`、`backend/.venv`、`data/game.db` 和 `data/saves`。

### 1. 本地构建与打包

```powershell
cd frontend
npm install && npm run build
cd ..
tar -czf frontend-dist.tar.gz -C frontend\dist .
```

### 2. 上传至服务器

```powershell
scp frontend-dist.tar.gz ubuntu@114.132.232.194:/tmp/
ssh ubuntu@114.132.232.194
```

### 3. 定位项目路径

```bash
find /home/ubuntu -maxdepth 1 -type d -name '_deploy_trpg_*' -print
# 将结果填入 PROJECT_DIR
PROJECT_DIR=/home/ubuntu/_deploy_trpg_xxxxxxxx
```

### 4. 解压并替换 dist

```bash
cd "$PROJECT_DIR/frontend"
rm -rf dist.new && mkdir dist.new
tar -xzf /tmp/frontend-dist.tar.gz -C dist.new

rm -rf dist.backup && mv dist dist.backup && mv dist.new dist
chmod -R a+rX dist

sudo nginx -t && sudo systemctl reload nginx
echo "前端更新完成"
```

部署后访问 `http://114.132.232.194/`，`Ctrl+F5` 强制刷新验证。

### 5. 回滚

```bash
cd "$PROJECT_DIR/frontend"
rm -rf dist && mv dist.backup dist
sudo systemctl reload nginx
```

---

## 📄 许可证

MIT License

---

_"我不要求你们像英雄一样下去。我只要求你们像活人一样回来。"_ —— 赫尔曼·断缆
