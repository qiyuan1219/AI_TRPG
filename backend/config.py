"""
游戏配置文件 —— D&D 碎冠之影
"""
import os
from dotenv import load_dotenv

load_dotenv()

# ============================================================
# AI 模型配置
# ============================================================
LLM_API_KEY = os.getenv("DEEPSEEK_API_KEY", "your-api-key-here")
LLM_BASE_URL = os.getenv("DEEPSEEK_BASE_URL", "https://api.deepseek.com/v1")
LLM_MODEL = os.getenv("LLM_MODEL", "deepseek-v4-pro")

# ============================================================
# 数据库配置（纯 SQLite）
# ============================================================
DATABASE_PATH = "data/game.db"

# ============================================================
# D&D 游戏数值平衡
# ============================================================
# 属性范围 (D&D 3-18 标准)
ATTR_MIN = 3
ATTR_MAX = 20

# 检定系统 (D20)
CRITICAL_SUCCESS = 20       # 自然20 = 大成功
CRITICAL_FAILURE = 1        # 自然1 = 大失败
DC_EASY = 10
DC_MODERATE = 15
DC_HARD = 20
DC_EXTREME = 25

# 经验与升级
XP_PER_ENCOUNTER = 200
LEVEL_CAP = 20

# ============================================================
# 服务器配置
# ============================================================
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8000"))
CORS_ORIGINS = [
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]
