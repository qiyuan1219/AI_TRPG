"""
记忆系统 —— 纯 Python + SQLite，零编译依赖
短期记忆：对话历史（直接拼入 messages）
长期记忆：重要事件存入 SQLite，按关键词检索
"""
import sqlite3
import os
import json
from datetime import datetime
from config import DATABASE_PATH, LEGACY_DATABASE_PATHS, SAVE_DIR


# ============================================================
# 数据库连接
# ============================================================
def get_db():
    """获取数据库连接"""
    os.makedirs(os.path.dirname(DATABASE_PATH), exist_ok=True)
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    return conn


def init_db():
    """初始化所有表"""
    conn = get_db()
    conn.executescript("""
        -- 游戏会话
        CREATE TABLE IF NOT EXISTS game_sessions (
            id TEXT PRIMARY KEY,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            current_area TEXT DEFAULT '教学楼A栋教室',
            chapter TEXT DEFAULT '序章：逢魔时刻',
            cleared_monsters INTEGER DEFAULT 0,
            notes_collected INTEGER DEFAULT 0,
            last_event TEXT DEFAULT '游戏开始'
        );

        -- 玩家状态
        CREATE TABLE IF NOT EXISTS player_state (
            game_id TEXT PRIMARY KEY,
            str_val INTEGER DEFAULT 40,
            dex_val INTEGER DEFAULT 40,
            int_val INTEGER DEFAULT 50,
            cha_val INTEGER DEFAULT 30,
            pow_val INTEGER DEFAULT 40,
            current_san INTEGER DEFAULT 40,
            inventory TEXT DEFAULT '手电筒,学生手册,手机',
            FOREIGN KEY (game_id) REFERENCES game_sessions(id)
        );

        -- NPC状态
        CREATE TABLE IF NOT EXISTS npc_state (
            game_id TEXT,
            npc_id TEXT,
            san INTEGER,
            trust INTEGER DEFAULT 50,
            alive BOOLEAN DEFAULT 1,
            PRIMARY KEY (game_id, npc_id),
            FOREIGN KEY (game_id) REFERENCES game_sessions(id)
        );

        -- 长期记忆
        CREATE TABLE IF NOT EXISTS game_memories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            game_id TEXT NOT NULL,
            event TEXT NOT NULL,
            event_type TEXT DEFAULT 'general',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (game_id) REFERENCES game_sessions(id)
        );
        CREATE INDEX IF NOT EXISTS idx_memories_game
            ON game_memories(game_id, created_at);

        -- 完整游戏状态快照。用于 D&D 以及后续新增服务，避免旧字段表丢失金币、HP、AC、信任等扩展状态。
        CREATE TABLE IF NOT EXISTS game_state_json (
            game_id TEXT PRIMARY KEY,
            state_json TEXT NOT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- 手动存档槽。保留前端叙事文本、行动建议、后端短期上下文与长期记忆快照。
        CREATE TABLE IF NOT EXISTS game_saves (
            slot_key TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            source_game_id TEXT NOT NULL,
            state_json TEXT NOT NULL,
            story_json TEXT NOT NULL DEFAULT '[]',
            suggestions_json TEXT NOT NULL DEFAULT '[]',
            active_index INTEGER DEFAULT 0,
            phase TEXT DEFAULT 'action',
            chat_history_json TEXT NOT NULL DEFAULT '[]',
            memories_json TEXT NOT NULL DEFAULT '[]',
            saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)
    conn.commit()
    conn.close()
    sync_save_files()


# ============================================================
# 长期记忆（SQLite 纯文本）
# ============================================================
def save_memory(game_id: str, event: str, event_type: str = "general"):
    """保存一条长期记忆"""
    conn = get_db()
    conn.execute(
        "INSERT INTO game_memories (game_id, event, event_type) VALUES (?, ?, ?)",
        (game_id, event, event_type)
    )
    conn.commit()
    conn.close()


def search_memory(game_id: str, query: str, n_results: int = 5) -> list[str]:
    """
    关键词检索相关记忆
    将查询拆成关键词，在记忆库中做 OR 匹配，按时间倒序返回
    """
    conn = get_db()

    # 提取中文关键词（按常见分隔符拆分）
    keywords = _extract_keywords(query)
    if not keywords:
        conn.close()
        return get_recent_memories(game_id, n_results)

    # 构建 WHERE 条件：每个关键词在 event 中出现
    conditions = " OR ".join(["event LIKE ?" for _ in keywords])
    params = [f"%{kw}%" for kw in keywords]

    rows = conn.execute(
        f"SELECT DISTINCT event FROM game_memories "
        f"WHERE game_id = ? AND ({conditions}) "
        f"ORDER BY created_at DESC LIMIT ?",
        [game_id] + params + [n_results]
    ).fetchall()
    conn.close()
    return [r["event"] for r in rows]


def get_recent_memories(game_id: str, limit: int = 10) -> list[str]:
    """获取最近的记忆"""
    conn = get_db()
    rows = conn.execute(
        "SELECT event FROM game_memories WHERE game_id = ? "
        "ORDER BY created_at DESC LIMIT ?",
        (game_id, limit)
    ).fetchall()
    conn.close()
    return [r["event"] for r in rows]


def clear_game_memory(game_id: str):
    """清除某个游戏的全部记忆"""
    conn = get_db()
    conn.execute("DELETE FROM game_memories WHERE game_id = ?", (game_id,))
    conn.commit()
    conn.close()


# ============================================================
# 关键词提取（纯 Python）
# ============================================================
def _extract_keywords(text: str) -> list[str]:
    """
    从文本中提取有意义的关键词
    中文按标点/空格拆分 + 去停用词 + 过滤过短词
    """
    import re
    # 按标点和空格拆分
    raw = re.split(r"[，。！？、；：\"'（）\s]+", text)
    stopwords = {
        '的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都',
        '一', '一个', '上', '也', '很', '到', '说', '要', '去', '你',
        '会', '着', '没有', '看', '好', '自己', '这', '他', '她', '它',
        '们', '那', '什么', '怎么', '这个', '那个', '可以', '能', '想',
        '把', '被', '让', '向', '从', '对', '用', '吗', '吧', '呢',
        '啊', '哦', '嗯', '啦', '嘛', '哇', '呀', '哈',
    }
    keywords = []
    for w in raw:
        w = w.strip()
        if len(w) >= 2 and w not in stopwords:
            keywords.append(w)
    return keywords[:10]  # 最多10个关键词


# ============================================================
# 结构化状态存储
# ============================================================
def save_game_state(game_id: str, state: dict):
    """保存完整游戏状态"""
    conn = get_db()
    conn.execute("""
        INSERT OR REPLACE INTO game_state_json (game_id, state_json, updated_at)
        VALUES (?, ?, CURRENT_TIMESTAMP)
    """, (game_id, json.dumps(state, ensure_ascii=False)))
    conn.execute("""
        INSERT OR REPLACE INTO game_sessions
        (id, current_area, chapter, cleared_monsters, notes_collected, last_event)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        game_id, state.get("current_area"), state.get("chapter"),
        state.get("cleared_monsters", 0), state.get("notes_collected", 0),
        state.get("last_event", "")
    ))
    conn.execute("""
        INSERT OR REPLACE INTO player_state
        (game_id, str_val, dex_val, int_val, cha_val, pow_val, current_san, inventory)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        game_id,
        state.get("str", 40), state.get("dex", 40),
        state.get("int", 50), state.get("cha", 30),
        state.get("pow", 40), state.get("current_san", 40),
        state.get("inventory", "手电筒,学生手册,手机")
    ))
    conn.commit()
    conn.close()


def load_game_state(game_id: str) -> dict:
    """加载游戏状态"""
    conn = get_db()
    full_state = conn.execute(
        "SELECT state_json FROM game_state_json WHERE game_id = ?", (game_id,)
    ).fetchone()
    if full_state:
        conn.close()
        try:
            return json.loads(full_state["state_json"])
        except json.JSONDecodeError:
            return {}

    session = conn.execute(
        "SELECT * FROM game_sessions WHERE id = ?", (game_id,)
    ).fetchone()
    if not session:
        conn.close()
        return {}

    player = conn.execute(
        "SELECT * FROM player_state WHERE game_id = ?", (game_id,)
    ).fetchone()
    npcs = conn.execute(
        "SELECT * FROM npc_state WHERE game_id = ?", (game_id,)
    ).fetchall()
    conn.close()

    state = dict(session)
    if player:
        state.update({
            "str": player["str_val"], "dex": player["dex_val"],
            "int": player["int_val"], "cha": player["cha_val"],
            "pow": player["pow_val"], "current_san": player["current_san"],
            "inventory": player["inventory"],
        })
    for npc in npcs:
        prefix = {"sw": "sw", "lm": "lm", "cls": "cls"}.get(npc["npc_id"], npc["npc_id"])
        state[f"{prefix}_san"] = npc["san"]
        state[f"{prefix}_trust"] = npc["trust"]
        state[f"{prefix}_alive"] = bool(npc["alive"])
    return state


# ============================================================
# 手动存档槽
# ============================================================
def _json_or_default(raw: str, default):
    try:
        return json.loads(raw) if raw else default
    except json.JSONDecodeError:
        return default


def _now_timestamp() -> str:
    return datetime.now().isoformat(timespec="seconds")


def _ensure_save_dir():
    os.makedirs(SAVE_DIR, exist_ok=True)


def _safe_slot_filename(slot_key: str) -> str:
    safe = "".join(ch for ch in str(slot_key) if ch.isalnum() or ch in {"-", "_"})
    return safe or "slot"


def _save_file_path(slot_key: str) -> str:
    return os.path.join(str(SAVE_DIR), f"{_safe_slot_filename(slot_key)}.json")


def _coerce_list(value) -> list:
    return value if isinstance(value, list) else []


def _coerce_dict(value) -> dict:
    return value if isinstance(value, dict) else {}


def _save_payload_from_row(row: sqlite3.Row) -> dict:
    return {
        "schema_version": 1,
        "slot_key": row["slot_key"],
        "title": row["title"],
        "source_game_id": row["source_game_id"],
        "state": _json_or_default(row["state_json"], {}),
        "story": _json_or_default(row["story_json"], []),
        "suggestions": _json_or_default(row["suggestions_json"], []),
        "active_index": int(row["active_index"] or 0),
        "phase": row["phase"] or "action",
        "chat_history": _json_or_default(row["chat_history_json"], []),
        "memories": _json_or_default(row["memories_json"], []),
        "saved_at": row["saved_at"] or _now_timestamp(),
    }


def _normalize_save_payload(data: dict) -> dict | None:
    if not isinstance(data, dict):
        return None

    state = _coerce_dict(data.get("state"))
    story = _coerce_list(data.get("story"))
    suggestions = _coerce_list(data.get("suggestions"))
    chat_history = _coerce_list(data.get("chat_history"))
    memories = _coerce_list(data.get("memories"))

    if not state:
        state = _json_or_default(str(data.get("state_json", "")), {})
    if not story:
        story = _json_or_default(str(data.get("story_json", "")), [])
    if not suggestions:
        suggestions = _json_or_default(str(data.get("suggestions_json", "")), [])
    if not chat_history:
        chat_history = _json_or_default(str(data.get("chat_history_json", "")), [])
    if not memories:
        memories = _json_or_default(str(data.get("memories_json", "")), [])

    slot_key = str(data.get("slot_key") or "").strip()
    source_game_id = str(data.get("source_game_id") or data.get("game_id") or "").strip()
    if not slot_key or not source_game_id:
        return None

    try:
        active_index = int(data.get("active_index", 0) or 0)
    except (TypeError, ValueError):
        active_index = 0

    phase = str(data.get("phase") or "action")
    if phase not in {"narrating", "action"}:
        phase = "action"

    return {
        "schema_version": int(data.get("schema_version") or 1),
        "slot_key": slot_key,
        "title": str(data.get("title") or "Save"),
        "source_game_id": source_game_id,
        "state": state,
        "story": story,
        "suggestions": suggestions,
        "active_index": max(0, active_index),
        "phase": phase,
        "chat_history": chat_history,
        "memories": memories,
        "saved_at": str(data.get("saved_at") or _now_timestamp()),
    }


def _read_save_file(path: str) -> dict | None:
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except (OSError, json.JSONDecodeError):
        return None

    if isinstance(data, dict) and not data.get("slot_key"):
        data["slot_key"] = os.path.splitext(os.path.basename(path))[0]
    return _normalize_save_payload(data)


def _write_save_file(payload: dict):
    _ensure_save_dir()
    path = _save_file_path(payload["slot_key"])
    tmp_path = f"{path}.tmp"
    with open(tmp_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)
    os.replace(tmp_path, path)


def _save_summary_from_payload(payload: dict) -> dict:
    state = _coerce_dict(payload.get("state"))
    story = _coerce_list(payload.get("story"))
    last_line = ""
    for line in reversed(story):
        text = str(line.get("text", "")).strip() if isinstance(line, dict) else ""
        if text:
            last_line = text
            break

    return {
        "slot_key": payload["slot_key"],
        "title": payload["title"],
        "source_game_id": payload["source_game_id"],
        "player_name": state.get("player_name", "Adventurer"),
        "char_class": state.get("style_name") or (state.get("player") or {}).get("styleName") or state.get("char_class", "Unknown"),
        "level": state.get("level", 1),
        "current_area": state.get("current_area", "Unknown area"),
        "last_event": state.get("last_event") or last_line[:80],
        "saved_at": payload["saved_at"],
    }


def _upsert_save_payload(conn: sqlite3.Connection, payload: dict):
    conn.execute("""
        INSERT OR REPLACE INTO game_saves (
            slot_key, title, source_game_id, state_json, story_json,
            suggestions_json, active_index, phase, chat_history_json,
            memories_json, saved_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        payload["slot_key"],
        payload["title"],
        payload["source_game_id"],
        json.dumps(payload["state"], ensure_ascii=False),
        json.dumps(payload["story"], ensure_ascii=False),
        json.dumps(payload["suggestions"], ensure_ascii=False),
        int(payload["active_index"]),
        payload["phase"],
        json.dumps(payload["chat_history"], ensure_ascii=False),
        json.dumps(payload["memories"], ensure_ascii=False),
        payload["saved_at"],
    ))


def _timestamp_key(value: str) -> str:
    return str(value or "")


def _should_overwrite_save_file(payload: dict) -> bool:
    current = _read_save_file(_save_file_path(payload["slot_key"]))
    if not current:
        return True
    return _timestamp_key(payload["saved_at"]) > _timestamp_key(current["saved_at"])


def _db_has_saves_table(conn: sqlite3.Connection) -> bool:
    row = conn.execute(
        "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'game_saves'"
    ).fetchone()
    return bool(row)


def _database_paths_for_import() -> list[str]:
    paths = [DATABASE_PATH, *LEGACY_DATABASE_PATHS]
    result = []
    seen = set()
    for path in paths:
        full = os.path.abspath(str(path))
        if full not in seen and os.path.exists(full):
            seen.add(full)
            result.append(full)
    return result


def _sync_database_saves_to_files():
    _ensure_save_dir()
    for db_path in _database_paths_for_import():
        try:
            conn = sqlite3.connect(db_path)
            conn.row_factory = sqlite3.Row
            if not _db_has_saves_table(conn):
                conn.close()
                continue
            rows = conn.execute("SELECT * FROM game_saves").fetchall()
            conn.close()
        except sqlite3.Error:
            continue

        for row in rows:
            payload = _save_payload_from_row(row)
            if _should_overwrite_save_file(payload):
                _write_save_file(payload)


def _sync_save_files_to_db():
    _ensure_save_dir()
    payloads = []
    for name in os.listdir(SAVE_DIR):
        if not name.endswith(".json"):
            continue
        payload = _read_save_file(os.path.join(str(SAVE_DIR), name))
        if payload:
            payloads.append(payload)

    conn = get_db()
    for payload in payloads:
        _upsert_save_payload(conn, payload)
    conn.commit()
    conn.close()


def sync_save_files():
    _sync_database_saves_to_files()
    _sync_save_files_to_db()


def _save_summary(row: sqlite3.Row) -> dict:
    state = _json_or_default(row["state_json"], {})
    story = _json_or_default(row["story_json"], [])
    last_line = ""
    for line in reversed(story):
        text = str(line.get("text", "")).strip() if isinstance(line, dict) else ""
        if text:
            last_line = text
            break

    return {
        "slot_key": row["slot_key"],
        "title": row["title"],
        "source_game_id": row["source_game_id"],
        "player_name": state.get("player_name", "冒险者"),
        "char_class": state.get("style_name") or (state.get("player") or {}).get("styleName") or state.get("char_class", "未知职业"),
        "level": state.get("level", 1),
        "current_area": state.get("current_area", "未知区域"),
        "last_event": state.get("last_event") or last_line[:80],
        "saved_at": row["saved_at"],
    }


def list_game_saves() -> list[dict]:
    sync_save_files()
    payloads = []
    for name in os.listdir(SAVE_DIR):
        if not name.endswith(".json"):
            continue
        payload = _read_save_file(os.path.join(str(SAVE_DIR), name))
        if payload:
            payloads.append(payload)
    if payloads:
        return [
            _save_summary_from_payload(payload)
            for payload in sorted(payloads, key=lambda item: item["slot_key"])
        ]

    """列出所有手动存档摘要。"""
    conn = get_db()
    rows = conn.execute(
        "SELECT * FROM game_saves ORDER BY slot_key"
    ).fetchall()
    conn.close()
    return [_save_summary(row) for row in rows]


def get_game_memories(game_id: str) -> list[dict]:
    """获取某局游戏的完整长期记忆快照。"""
    conn = get_db()
    rows = conn.execute(
        "SELECT event, event_type, created_at FROM game_memories "
        "WHERE game_id = ? ORDER BY id ASC",
        (game_id,)
    ).fetchall()
    conn.close()
    return [dict(row) for row in rows]


def replace_game_memories(game_id: str, memories: list[dict]):
    """用存档中的长期记忆替换当前记忆，避免读档后泄露未来事件。"""
    conn = get_db()
    conn.execute("DELETE FROM game_memories WHERE game_id = ?", (game_id,))
    for memory in memories:
        conn.execute(
            "INSERT INTO game_memories (game_id, event, event_type, created_at) "
            "VALUES (?, ?, ?, COALESCE(?, CURRENT_TIMESTAMP))",
            (
                game_id,
                str(memory.get("event", "")),
                str(memory.get("event_type", "general")),
                memory.get("created_at"),
            )
        )
    conn.commit()
    conn.close()


def save_game_slot(
    slot_key: str,
    title: str,
    source_game_id: str,
    state: dict,
    story: list[dict],
    suggestions: list[dict],
    active_index: int,
    phase: str,
    chat_history: list[dict],
    memories: list[dict],
) -> dict:
    """写入或覆盖一个手动存档槽。"""
    conn = get_db()
    conn.execute("""
        INSERT OR REPLACE INTO game_saves (
            slot_key, title, source_game_id, state_json, story_json,
            suggestions_json, active_index, phase, chat_history_json,
            memories_json, saved_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    """, (
        slot_key,
        title,
        source_game_id,
        json.dumps(state, ensure_ascii=False),
        json.dumps(story, ensure_ascii=False),
        json.dumps(suggestions, ensure_ascii=False),
        int(active_index),
        phase,
        json.dumps(chat_history, ensure_ascii=False),
        json.dumps(memories, ensure_ascii=False),
    ))
    row = conn.execute(
        "SELECT * FROM game_saves WHERE slot_key = ?", (slot_key,)
    ).fetchone()
    conn.commit()
    conn.close()
    payload = _save_payload_from_row(row)
    _write_save_file(payload)
    return _save_summary_from_payload(payload)


def load_game_save(slot_key: str) -> dict | None:
    sync_save_files()
    payload = _read_save_file(_save_file_path(slot_key))
    if payload:
        return {
            "summary": _save_summary_from_payload(payload),
            "game_id": payload["source_game_id"],
            "state": payload["state"],
            "story": payload["story"],
            "suggestions": payload["suggestions"],
            "active_index": int(payload["active_index"] or 0),
            "phase": payload["phase"] or "action",
            "chat_history": payload["chat_history"],
            "memories": payload["memories"],
        }

    """读取一个手动存档槽的完整内容。"""
    conn = get_db()
    row = conn.execute(
        "SELECT * FROM game_saves WHERE slot_key = ?", (slot_key,)
    ).fetchone()
    conn.close()
    if not row:
        return None

    return {
        "summary": _save_summary(row),
        "game_id": row["source_game_id"],
        "state": _json_or_default(row["state_json"], {}),
        "story": _json_or_default(row["story_json"], []),
        "suggestions": _json_or_default(row["suggestions_json"], []),
        "active_index": int(row["active_index"] or 0),
        "phase": row["phase"] or "action",
        "chat_history": _json_or_default(row["chat_history_json"], []),
        "memories": _json_or_default(row["memories_json"], []),
    }
