"""
游戏配置文件 —— D&D 地心之门
"""
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BACKEND_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BACKEND_DIR.parent


def _resolve_project_path(value) -> Path:
    path = Path(value)
    if path.is_absolute():
        return path.resolve()
    return (PROJECT_ROOT / path).resolve()


def _int_env(name: str, fallback: int) -> int:
    raw = os.getenv(name)
    if not raw:
        return fallback
    try:
        return int(raw)
    except ValueError:
        return fallback


def _csv_env(name: str) -> list[str]:
    raw = os.getenv(name, "")
    return [item.strip() for item in raw.split(",") if item.strip()]

# ============================================================
# AI 模型配置
# ============================================================
LLM_API_KEY = os.getenv("DEEPSEEK_API_KEY", "your-api-key-here").strip()
LLM_BASE_URL = os.getenv("DEEPSEEK_BASE_URL", "https://api.deepseek.com/v1")
LLM_MODEL = os.getenv("LLM_MODEL", "deepseek-v4-pro")

# ============================================================
# 数据库配置（纯 SQLite）
# ============================================================
DATA_DIR = _resolve_project_path(os.getenv("GAME_DATA_DIR") or PROJECT_ROOT / "data")
SAVE_DIR = _resolve_project_path(os.getenv("GAME_SAVE_DIR") or DATA_DIR / "saves")
DATABASE_PATH = str(_resolve_project_path(os.getenv("DATABASE_PATH") or DATA_DIR / "game.db"))
LEGACY_DATABASE_PATHS = [
    str((BACKEND_DIR / "data" / "game.db").resolve()),
]

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
PORT = _int_env("PORT", 8190)
DEFAULT_CORS_ORIGINS = [
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]
CORS_ORIGINS = _csv_env("CORS_ORIGINS") or DEFAULT_CORS_ORIGINS
