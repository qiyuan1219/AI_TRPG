"""对话日志系统 —— 每次游戏一个文件，时间戳命名
文件命名: MMDD_HHMMSS.txt (如 0602_143600.txt)
写入时机: DM说完一段 → 写入 | 玩家说完 → 写入 | 系统事件 → 写入
"""
import os
import logging
from datetime import datetime

LOG_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "logs")
os.makedirs(LOG_DIR, exist_ok=True)
_logger = logging.getLogger(__name__)


class GameLogger:
    def __init__(self, session_id: str):
        self.session_id = session_id  # 即文件名 (MMDD_HHMMSS)
        self.path = os.path.join(LOG_DIR, f"{session_id}.txt")
        self.round = 0

    def log_create(self, player_name: str, char_class: str, attrs: dict, opening: str):
        """建角+开场"""
        attr_str = ", ".join(f"{k[4:] if k.startswith('attr_') else k}:{v}"
                             for k, v in attrs.items() if k.startswith("attr_"))
        text = (
            f"{'='*50}\n"
            f"  碎冠之影 D&D 对话日志\n"
            f"  开始时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n"
            f"  玩家: {player_name} | 职业: {char_class}\n"
            f"  属性: {attr_str}\n"
            f"  MODEL: {_get_model()}\n"
            f"{'='*50}\n\n"
            f"━━━ DM开场 ━━━\n{opening}\n\n"
        )
        self._append(text)

    def log_player(self, message: str):
        """玩家输入后写入"""
        self.round += 1
        self._append(f"{'─'*40}\n第{self.round}轮 | {datetime.now().strftime('%H:%M:%S')}\n"
                     f"【玩家】{message}\n\n")

    def log_dm(self, narrative: str, systems: list[str] = None):
        """DM回复完成后写入，附带系统事件"""
        text = f"【DM】\n{narrative}\n"
        if systems:
            for s in systems:
                text += f"  [系统] {s}\n"
        self._append(text + "\n")

    def log_error(self, error: str):
        self._append(f"【异常】{error}\n\n")

    def _append(self, text: str):
        try:
            with open(self.path, "a", encoding="utf-8") as f:
                f.write(text)
                f.flush()
        except OSError as error:
            _logger.warning("failed to append game log %s: %s", self.path, error)


_loggers: dict[str, GameLogger] = {}


def new_session(player_name: str = "", char_class: str = "",
                attrs: dict = None, opening: str = "") -> GameLogger:
    """创建新游戏会话，返回 logger"""
    session_id = datetime.now().strftime("%m%d_%H%M%S")
    log = GameLogger(session_id)
    if player_name:
        log.log_create(player_name, char_class, attrs or {}, opening)
    return session_id, log


def get_logger(session_id: str) -> GameLogger:
    if session_id not in _loggers:
        _loggers[session_id] = GameLogger(session_id)
    return _loggers[session_id]


def _get_model() -> str:
    try:
        from config import LLM_MODEL
        return LLM_MODEL
    except ImportError:
        return "unknown"
