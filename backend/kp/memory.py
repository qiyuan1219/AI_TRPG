"""
记忆系统 —— 纯 Python + SQLite，零编译依赖
短期记忆：对话历史（直接拼入 messages）
长期记忆：重要事件存入 SQLite，按关键词检索
"""
import sqlite3
import os
import json
from datetime import datetime
from config import DATABASE_PATH


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
    """)
    conn.commit()
    conn.close()


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
