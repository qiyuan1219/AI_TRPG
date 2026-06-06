"""D&D API路由"""
import asyncio
import json
import re
import uuid
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from kp.dm_service import dm_chat_stream, dm_narrate_stream
from kp.memory import (
    get_game_memories,
    get_recent_memories,
    init_db,
    list_game_saves,
    load_game_save,
    load_game_state,
    replace_game_memories,
    save_game_slot,
    save_game_state,
    save_memory,
    search_memory,
)
from engine.rules_dnd import CLASS_PRESETS, PROFICIENCY_BONUS, modifier, skill_check, validate_character
from engine.state_directives import DirectiveStreamFilter, apply_directive, parse_state_chunk
from logger import get_logger, new_session

router_dnd = APIRouter(prefix="/api/dnd")
OPENING_TIMEOUT = 30
init_db()
SAVE_SLOT_KEYS = {"slot-1", "slot-2", "slot-3", "slot-4", "slot-5"}

# 对话历史缓存（每局游戏保留最近20轮）
_chat_history: dict[str, list[dict]] = {}
# game_id → session_id 映射
_session_map: dict[str, str] = {}
MAX_HISTORY = 20


def _apply_state_change(chunk: str, state: dict) -> dict:
    """解析并应用旧版 [STATE:tool_name:{...}] 指令。"""
    directive = parse_state_chunk(chunk)
    if directive:
        return apply_directive(state, directive)
    return {"type": "unknown"}


# ============================================================
# 模型
# ============================================================
class CreateDNDRequest(BaseModel):
    player_name: str = "冒险者"
    char_class: str = "战士"
    attr_str: int = 16
    attr_dex: int = 13
    attr_con: int = 15
    attr_int: int = 10
    attr_wis: int = 12
    attr_cha: int = 8
    level: int = 3

class ChatRequest(BaseModel):
    game_id: str
    message: str


class SaveGameRequest(BaseModel):
    slot_key: str
    title: str | None = None
    story: list[dict] = Field(default_factory=list)
    suggestions: list[dict] = Field(default_factory=list)
    active_index: int = 0
    phase: str = "action"


def _validate_slot_key(slot_key: str):
    if slot_key not in SAVE_SLOT_KEYS:
        raise HTTPException(400, "无效的存档位")


# ============================================================
# DC模式预骰
# ============================================================
_ATTR_MAP = {
    "智力": "int", "敏捷": "dex", "力量": "str",
    "感知": "wis", "洞悉": "wis", "魅力": "cha", "体质": "con",
    "调查": "int", "历史": "int", "奥秘": "int",
    "察觉": "wis", "生存": "wis", "医药": "wis", "宗教": "wis",
    "巧手": "dex", "盗贼工具": "dex", "盗贼": "dex", "潜行": "dex", "杂技": "dex", "闪避": "dex",
    "说服": "cha", "威吓": "cha", "欺瞒": "cha", "人脉": "cha", "谈判": "cha",
    "运动": "str", "破门": "str",
}
_DC_BRACKET_RE = re.compile(
    r"[【\[]\s*([^【】\[\]\n]{1,40}?)\s*(?:DC|ＤＣ)\s*(\d{1,2})(?:\s*[-~—到至]\s*\d{1,2})?\s*[】\]]",
    re.IGNORECASE,
)
_DC_BEFORE_RE = re.compile(
    r"([\u4e00-\u9fffA-Za-z0-9（）()/+· -]{1,40}?)\s*(?:DC|ＤＣ)\s*(\d{1,2})(?:\s*[-~—到至]\s*\d{1,2})?",
    re.IGNORECASE,
)
_DC_AFTER_RE = re.compile(
    r"(?:DC|ＤＣ)\s*(\d{1,2})\s*([^\s【】\[\]，。；;、,.!?！？]{1,16})",
    re.IGNORECASE,
)


def _clean_check_label(label: str) -> str:
    return re.sub(r"^[【\[\s]+|[】\]\s]+$", "", label or "").strip()


def _find_dc_check(message: str) -> tuple[str, int] | None:
    match = _DC_BRACKET_RE.search(message)
    if match:
        return _clean_check_label(match.group(1)), int(match.group(2))

    for match in _DC_BEFORE_RE.finditer(message):
        label = _clean_check_label(match.group(1))
        if not label or label.upper() in {"D", "DC"}:
            continue
        if _contains_any(label, tuple(_ATTR_MAP.keys())) or _contains_any(label, ("丽莎", "影刃", "格鲁姆", "铁锤", "塔莉亚", "瑟琳", "逆钟", "森洛", "铁锅", "莉亚瑟", "青弦", "卡西亚", "断羽", "克莱娅", "软爪", "雷铎", "炉心")):
            return label, int(match.group(2))

    match = _DC_AFTER_RE.search(message)
    if match:
        return _clean_check_label(match.group(2)), int(match.group(1))

    return None


def _contains_any(text: str, words: tuple[str, ...]) -> bool:
    return any(word in text for word in words)


def _infer_player_stat(label: str, message: str) -> tuple[str, str]:
    text = f"{label} {message}"
    for key, stat in _ATTR_MAP.items():
        if key in text:
            return stat, key
    return "int", label or "调查"


def _resolve_check(label: str, message: str, state: dict) -> tuple[str, int, int]:
    text = f"{label} {message}"
    assist = _contains_any(text, ("帮忙", "协助", "辅助", "配合"))

    if "克莱娅" in text or "软爪" in text:
        if _contains_any(text, ("陷阱", "拆陷", "开锁", "巧手", "盗贼")):
            return "克莱娅-敏捷(盗贼工具)", 6, 0
        if _contains_any(text, ("潜行", "潜入", "侦查")):
            return "克莱娅-敏捷(潜行)", 6, 0
        if _contains_any(text, ("察觉", "感知", "危险")):
            return "克莱娅-感知(察觉)", 4, 0

    if "森洛" in text or "铁锅" in text:
        if _contains_any(text, ("真菌", "孢海", "生态", "辨识", "自然", "植物")):
            return "森洛-真菌辨识", 5, 0
        if _contains_any(text, ("生存", "导航", "路线", "找路", "方向")):
            return "森洛-生存导航", 5, 0
        if _contains_any(text, ("料理", "食材", "做饭", "烹饪")):
            return "森洛-孢海料理", 4, 0

    if "莉亚瑟" in text or "青弦" in text:
        if _contains_any(text, ("追踪", "足迹", "痕迹", "生存")):
            return "莉亚瑟-追踪", 5, 0
        if _contains_any(text, ("侦查", "察觉", "发现", "观察")):
            return "莉亚瑟-精灵感知", 5, 0
        if _contains_any(text, ("射击", "弓箭", "远程")):
            return "莉亚瑟-精准射击", 6, 0

    if "卡西亚" in text or "断羽" in text:
        if _contains_any(text, ("战术", "评估", "阵型", "指挥")):
            return "卡西亚-战术评估", 4, 0
        if _contains_any(text, ("威吓", "交涉", "守卫", "军规")):
            return "卡西亚-军规交涉", 3, 0
        if _contains_any(text, ("力量", "运动", "突破", "负重")):
            return "卡西亚-负重行军", 5, 0

    if "雷铎" in text or "炉心" in text:
        if _contains_any(text, ("黑石", "共鸣", "奥秘", "方尖碑")):
            return "雷铎-黑石共鸣", 4, 0
        if _contains_any(text, ("破障", "撞开", "清理", "塌方")):
            return "雷铎-重装破障", 5, 0
        if _contains_any(text, ("守护", "防护", "盾")):
            return "雷铎-巨盾守护", 6, 0

    if "瑟琳" in text or "逆钟" in text:
        if _contains_any(text, ("奥秘", "魔法", "鉴定", "符文")):
            return "瑟琳-奥秘鉴定", 5, 0
        if _contains_any(text, ("时间", "异常", "感知")):
            return "瑟琳-时间感", 4, 0
        if assist:
            stat_key, skill_name = _infer_player_stat(label, message)
            return f"{skill_name}（瑟琳协助）", modifier(state.get(stat_key, 10)), state.get("proficiency_bonus", 2) + 2

    stat_key, skill_name = _infer_player_stat(label, message)
    return skill_name, modifier(state.get(stat_key, 10)), state.get("proficiency_bonus", 2)


def _preroll_if_dc(message: str, state: dict) -> tuple[str | None, str]:
    """
    检测用户消息中是否包含DC检定标签【属性DC数字】。
    如果有则预骰，返回 (system_event_json, 附带检定结果的增强消息)。
    如果没有则返回 (None, message)。
    """
    dc_check = _find_dc_check(message)
    if not dc_check:
        return None, message

    attr_name, dc = dc_check
    check_label, stat_mod, prof_bonus = _resolve_check(attr_name, message, state)
    result = skill_check(stat_mod, prof_bonus, dc)
    result_dict = result.to_dict()
    result_dict["属性"] = f"{check_label}(检定)"
    system_event = f"[SYSTEM:skill_check:{json.dumps(result_dict, ensure_ascii=False)}]"

    label = "成功" if result.success else "失败"
    operator = "≥" if result.success else "<"
    enhanced = (
        f"{message}\n"
        f"[系统提示：检定已自动完成——D20={result.roll} 加值+{result.bonus} "
        f"总计={result.total} {operator}DC{dc}，{label}。请基于此检定结果叙事，"
        f"不要再调用skill_check工具。]"
    )
    return system_event, enhanced


def _fallback_chat_narrative(message: str, state: dict) -> str:
    player = state.get("player_name") or "冒险者"
    area = state.get("current_area") or "当前区域"
    prompt = (message or "").strip()
    action_line = f"你刚才选择了：{prompt}" if prompt else "你停下脚步，重新整理眼前的局势。"
    return (
        f"{player}在{area}稳住呼吸，远处的荧光在黑暗中明灭，空气中弥漫着潮湿的孢尘。\n"
        f"{action_line}\n"
        "局势暂时没有发生新的剧烈变化。你可以先保存进度、检查角色状态，或从眼前线索中选择下一步行动。\n\n"
        "[HINTS:观察周围环境【感知DC12】|回顾任务线索【智力DC12】|和瑟琳确认计划【魅力DC12】]"
    )


# ============================================================
# 开场白上下文
# ============================================================
def _opening_context(name: str, cls: str) -> str:
    return f"""你是{name}，一名来自地表的{cls}。近年来，地下魔物频繁袭击地表村镇、
商路和矿道。你接受委托，前往幽暗地域中的最后大型文明据点：逆穹城。

【世界观背景——请在叙事中自然融入】
幽暗地域深处有一座古老门户「地心狱门」，通向九层地狱第一层阿弗纳斯。
千年前古代英雄用三件封印圣遗物封住狱门，并在上方建立地底堡垒世代镇守。
但十年前，地底堡垒突然失踪。近年来地下魔物愈发频繁地涌向地表。
你接受了冒险者公会的委托：前往地底堡垒调查失联真相。

【比赛版第一幕展示目标——请内化到叙事中】
本次剧情只制作第一幕。开场要展示 AI 如何当主持人：根据玩家行动和检定结果推进主线；NPC 如何像数字居民一样记住玩家并按信任值反馈；回声酒馆的快艇骰子会展示 AI 参谋和瑟琳协助；战斗会展示 KP 根据骰点和伤害生成行动结果描写。
不要在开场直白说“这是比赛功能展示”，但要通过瑟琳的反应、萨洛的赌局传闻、公会对同伴信任的提醒，让玩家自然知道这些系统会影响剧情。

【叙事节奏——必须循序渐进，严禁仓促】
第一步·初入逆穹城（60-80字）：玩家穿过地底矿道，通过符文定向门，第一次看到倒挂在
巨大洞穴穹顶之上的逆穹城。描述重力翻转的眩晕感、城市的震撼视觉——尖塔、吊桥、
风车和神殿像钉在天顶上，中央一座巨大深井垂向黑暗。远处洞底有蓝绿色荧光。
绝对不要写「王冠城」！务必写出逆穹城的倒挂奇迹感。

第二步·初遇瑟琳（60-80字）：玩家在街道上时，一个药剂瓶从货箱滑落摔碎。
年轻的女法师【瑟琳·逆钟】蹲下，指尖浮起淡银色光——碎片像记起形状般贴合回去。
她抬头看向你，目光停留了比礼貌更久的一瞬。瑟琳应当是文静、克制、强大而忧郁的，
她会说「你就是从地表来的冒险者吧。比我想象中…来得更早。」然后立刻改口
「我是说，公会今天登记的队伍比预期早到。」瑟琳说明自己受公会邀请加入远征队，
负责奥术、治疗和时间异常判断。她会在第一时间固定加入主角团。

第三步·教学战斗（40-60字）：一批来自下层孢海据点的补给吊箱被送上城市。吊箱打开时，
从里面钻出2-3只小型地下魔物「裂隙爬兽」——它们虚弱、惊慌但有攻击性。
这是一场极低难度的教学战斗，玩家必胜。瑟琳会说「别退太远，它们怕光。攻击侧腹，那里没有甲壳。」
战斗后，守卫翻看吊箱封条脸色变了：「这是从孢海据点回收的空箱。按理说，它不该带回活物。」

第四步·公会接任务（80-100字）：战斗后，公会信使赶来请玩家前往冒险者公会。
冒险者公会接待员【米蕾娜·白契】说明委托：
「地底堡垒已经失联十年。你们的路线是——从逆穹城乘降渊缆梯抵达孢海据点，
穿越无光孢海，在深处找到黑暗之门。按照旧远征图，黑暗之门后方就是地底堡垒所在层。」
城防负责人【赫尔曼·断缆】出现补充军事视角。
瑟琳表示会同行：「不是因为你需要一位法师，而是因为这条路需要有人看住时间本身。」

【重要——必须反复暗示玩家预期】
米蕾娜、酒馆老板、温妮娅等NPC必须多次暗示：地底堡垒就在无光孢海下面一层，
穿过黑暗之门就该抵达堡垒层。这是第一幕结尾反转的基础。

第五步·城市探索、快艇骰子与同伴介绍（80-100字）：玩家在逆穹城自由探索时，可以先去回声酒馆打听情报。酒馆老板【萨洛·杯底】正在开一桌快艇骰子，50G 入场，最多三轮；瑟琳可以在开骰前选择潜行偷窥或人情说服，AI 参谋会根据牌面推荐重掷。
玩家也会认识可选同伴：
可选同伴在公会的整备厅等待，一共5人。瑟琳固定同行，不占名额。玩家可从5人中任选最多2名：
- 森洛·铁锅：矮人孢海向导/生存专家/厨师。性格稳重固执，尊重孢海生态。
可选：接任务后先做城市探索，再在整备厅中正式展示同伴招募。
【绝对不要在开场白里一次性列出5个同伴的详情，这样太冗长。
开场白只需提到「公会整备厅还有几位愿意加入的冒险者」即可，
具体招募在玩家探索时才逐一展示。瑟琳必须第一时间登场并固定入队。】

第六步·引导：结尾给出至少两个带检定标签的选择：
观察倒挂城市工程结构【调查DC12】、
前往冒险者公会接任务、
去回声酒馆参加快艇骰子赌局、
打听最近的魔物袭击情报【感知DC12】、
与瑟琳聊聊她的魔法【奥秘DC13】

【台词归属】
直接台词前必须写明角色名，例如「瑟琳说：」「米蕾娜说：」。不要用「她说」「他说」承接。

请以DM身份叙述开场白，严格按照上述六步顺序，节奏舒缓、沉浸感强。逆穹城必须是第一幕最大的文明奇观。"""


FALLBACK_OPENING = """你穿过最后一段地底矿道，脚下的石阶忽然向上弯折。守卫让你通过一道刻满符文的「定向门」。
短暂眩晕后，世界翻转了。

一整座城市倒挂在巨大洞穴的穹顶之上。尖塔、吊桥、神殿、风车和市场像被钉在天顶的王都。
城市中央，一座巨大的深井向下贯穿黑暗，九条秘银主缆垂向看不见底的洞穴深处。
更远处，洞底浮动着蓝绿色荧光，像一片在黑暗中呼吸的海。

这是逆穹城——幽暗地域中最后的文明奇迹。地表王国、矮人工匠、地底侏儒工程师、
卓尔流亡者和魔法学院共同建造的倒挂城邦。但即使是这样伟大的工程，也笼罩在阴影之下。

十年前，更深处的地底堡垒——负责镇守地心狱门的要塞——突然失联。
多支远征队有去无回。最近，魔物开始沿地下裂隙向地表涌出。

你从地表的边境一路穿过矿道，终于抵达了这里。接受委托、组建队伍、穿越无光孢海。

一声细微的碎裂声打断了你的思绪。一个青色的药剂瓶从旁边的货箱边缘滑落，摔碎在石板路上。
年轻的法师轻轻叹了口气，指尖浮起淡银色的光。碎片没有飞舞，只是像记起了自己原本的形状，
一点点贴合回去。

她抬起头看向你，目光在你脸上停留了比礼貌更久的一瞬。
她是瑟琳·逆钟——受冒险者公会邀请加入深层远征队的法师。
瑟琳说：「你就是从地表来的冒险者吧。比我想象中……来得更早。」
她顿了顿，似乎意识到自己说了什么多余的话。
瑟琳改口说：「我是说，公会今天登记的队伍比预期早到。我叫瑟琳·逆钟，负责奥术支援——
还有时间异常判断。这条路需要有人看住时间本身。」

她的话还没说完，不远处的补给平台传来刮擦声。
几只灰白色的小型魔物从吊箱里滚落出来，身上沾着蓝绿色孢尘，眼睛被城市灯火刺激得不断收缩。
守卫刚拔出手弩，其中一只已经朝你们扑来。

瑟琳说：「别退太远，它们怕光。攻击侧腹，那里没有甲壳。」

[HINTS:攻击裂隙爬兽【力量DC10】|观察敌人弱点【感知DC10】|让瑟琳辅助或治疗|战斗后前往回声酒馆参加快艇骰子赌局]"""


# ============================================================
# API端点
# ============================================================
@router_dnd.post("/game/create")
async def create_dnd_game(req: CreateDNDRequest):
    gid = str(uuid.uuid4())[:8]
    preset = CLASS_PRESETS.get(req.char_class, CLASS_PRESETS["战士"])

    state = {
        "player_name": req.player_name,
        "char_class": req.char_class,
        "level": req.level,
        "current_area": "逆穹城·入城定向门",
        "cleared_levels": 0,
        "str": req.attr_str, "dex": req.attr_dex, "con": req.attr_con,
        "int": req.attr_int, "wis": req.attr_wis, "cha": req.attr_cha,
        "current_hp": preset["hp"], "max_hp": preset["hp"], "ac": preset["ac"],
        "atk_bonus": preset.get("atk_bonus", 5),
        "proficiency_bonus": PROFICIENCY_BONUS.get(req.level, 2),
        "gold": 200,
        "inventory": "长剑,冒险者工具包,治疗药水x2",
        # 核心同伴 - 瑟琳固定同行
        "se_hp": 34, "se_trust": 85, "se_alive": True,
        # 可选同伴1 - 森洛
        "sl_hp": 46, "sl_trust": 60, "sl_alive": True,
        # 可选同伴2 - 莉亚瑟
        "ly_hp": 34, "ly_trust": 65, "ly_alive": True,
        # 可选同伴3 - 卡西亚
        "kx_hp": 48, "kx_trust": 50, "kx_alive": True,
        # 可选同伴4 - 克莱娅
        "kl_hp": 36, "kl_trust": 55, "kl_alive": True,
        # 可选同伴5 - 雷铎
        "ld_hp": 58, "ld_trust": 70, "ld_alive": True,
        "triggered_events": "",
        "last_event": "游戏开始",
    }
    save_game_state(gid, state)
    save_memory(gid, f"游戏开始。{req.player_name}，{req.char_class}，接受委托来到逆穹城。")

    prompt = _opening_context(req.player_name, req.char_class) + "\n\n请严格按上述步骤生成开场白。叙事要有画面感、节奏要舒缓，让玩家感受到世界的厚度。"

    try:
        opening = ""
        async for chunk in asyncio.wait_for(dm_narrate_stream(prompt, state), timeout=OPENING_TIMEOUT):
            opening += chunk
        if not opening.strip():
            opening = FALLBACK_OPENING
    except:
        opening = FALLBACK_OPENING

    # 初始化对话历史
    _chat_history[gid] = [
        {"role": "assistant", "content": opening}
    ]

    # 创建日志文件（时间戳命名）
    sid, log = new_session(
        req.player_name, req.char_class,
        {"attr_str": req.attr_str, "attr_dex": req.attr_dex, "attr_con": req.attr_con,
         "attr_int": req.attr_int, "attr_wis": req.attr_wis, "attr_cha": req.attr_cha},
        opening
    )
    _session_map[gid] = sid

    return {"game_id": gid, "session_id": sid, "opening": opening, "state": state}


@router_dnd.get("/game/{game_id}/state")
async def get_state(game_id: str):
    state = load_game_state(game_id)
    if not state: raise HTTPException(404, "游戏不存在")
    return {"game_id": game_id, "state": state}


@router_dnd.get("/saves")
async def get_saves():
    return {"saves": list_game_saves()}


@router_dnd.post("/game/{game_id}/save")
async def save_current_game(game_id: str, req: SaveGameRequest):
    _validate_slot_key(req.slot_key)
    state = load_game_state(game_id)
    if not state:
        raise HTTPException(404, "游戏不存在")

    title = (req.title or "").strip()
    if not title:
        title = f"{state.get('player_name', '冒险者')} · {state.get('current_area', '未知区域')}"

    phase = req.phase if req.phase in {"narrating", "action"} else "action"
    story = req.story[-120:]
    story_offset = max(0, len(req.story) - len(story))
    active_index = min(max(0, req.active_index - story_offset), max(len(story) - 1, 0))
    save = save_game_slot(
        req.slot_key,
        title[:32],
        game_id,
        state,
        story,
        req.suggestions[:6],
        active_index,
        phase,
        _chat_history.get(game_id, [])[-MAX_HISTORY:],
        get_game_memories(game_id),
    )
    return {"save": save}


@router_dnd.post("/saves/{slot_key}/load")
async def load_saved_game(slot_key: str):
    _validate_slot_key(slot_key)
    save = load_game_save(slot_key)
    if not save:
        raise HTTPException(404, "存档不存在")

    game_id = save["game_id"]
    save_game_state(game_id, save["state"])
    replace_game_memories(game_id, save["memories"])
    _chat_history[game_id] = save["chat_history"][-MAX_HISTORY:]

    return {
        "game_id": game_id,
        "state": save["state"],
        "story": save["story"],
        "suggestions": save["suggestions"],
        "active_index": save["active_index"],
        "phase": save["phase"],
        "save": save["summary"],
    }


@router_dnd.post("/chat/stream")
async def chat_stream(req: ChatRequest):
    state = load_game_state(req.game_id)
    if not state: raise HTTPException(404, "游戏不存在")

    recent = get_recent_memories(req.game_id)
    ctx = search_memory(req.game_id, req.message, n_results=3)

    async def gen():
        full = ""
        systems: list[str] = []
        directive_filter = DirectiveStreamFilter()

        # 获取日志器并立即写入玩家输入
        sid = _session_map.get(req.game_id, req.game_id)
        log = get_logger(sid)
        log.log_player(req.message)

        # 获取历史对话
        history = _chat_history.get(req.game_id, [])
        if len(history) > MAX_HISTORY:
            history = history[-MAX_HISTORY:]

        # 预骰: 检测用户消息中的DC检定标签，自动掷骰
        preroll_event, enhanced_msg = _preroll_if_dc(req.message, state)
        if preroll_event:
            systems.append(preroll_event)
            yield f"data: {json.dumps({'type':'system','content':preroll_event}, ensure_ascii=False)}\n\n"
            user_message = enhanced_msg
        else:
            user_message = req.message

        try:
            async for chunk in dm_chat_stream(user_message, state, history, ctx + recent):
                if chunk.startswith("[STATE:"):
                    change = _apply_state_change(chunk, state)
                    systems.append(chunk)
                    yield f"data: {json.dumps({'type':'state_update','content':change}, ensure_ascii=False)}\n\n"
                elif chunk.startswith("[SYSTEM:"):
                    systems.append(chunk)
                    yield f"data: {json.dumps({'type':'system','content':chunk}, ensure_ascii=False)}\n\n"
                else:
                    narrative, directives = directive_filter.feed(chunk)
                    for directive in directives:
                        change = apply_directive(state, directive)
                        systems.append(directive.raw)
                        yield f"data: {json.dumps({'type':'state_update','content':change}, ensure_ascii=False)}\n\n"
                    if narrative:
                        full += narrative
                        yield f"data: {json.dumps({'type':'narrative','content':narrative}, ensure_ascii=False)}\n\n"

            narrative, directives = directive_filter.flush()
            for directive in directives:
                change = apply_directive(state, directive)
                systems.append(directive.raw)
                yield f"data: {json.dumps({'type':'state_update','content':change}, ensure_ascii=False)}\n\n"
            if narrative:
                full += narrative
                yield f"data: {json.dumps({'type':'narrative','content':narrative}, ensure_ascii=False)}\n\n"

            # DM说完一段 → 写入日志（附带系统事件）
            log.log_dm(full, systems)

            # 保存对话历史
            history.append({"role": "user", "content": req.message})
            history.append({"role": "assistant", "content": full})
            if len(history) > MAX_HISTORY:
                history = history[-MAX_HISTORY:]
            _chat_history[req.game_id] = history
            # 保存记忆和状态
            save_memory(req.game_id, f"玩家: {req.message}")
            if full: save_memory(req.game_id, f"DM: {full[:200]}")
            state["last_event"] = req.message[:100]
            save_game_state(req.game_id, state)
            yield f"data: {json.dumps({'type':'state_snapshot','content':state}, ensure_ascii=False)}\n\n"
            yield f"data: {json.dumps({'type':'done'})}\n\n"
        except Exception as e:
            if full:
                log.log_dm(full + f"\n[中断: {e}]", systems)
            log.log_error(str(e))
            fallback = full or _fallback_chat_narrative(req.message, state)
            if not full:
                full = fallback
                yield f"data: {json.dumps({'type':'narrative','content':fallback}, ensure_ascii=False)}\n\n"

            # 异常时保存状态（防止本轮状态变更丢失）
            try:
                history.append({"role": "user", "content": req.message})
                history.append({"role": "assistant", "content": full})
                if len(history) > MAX_HISTORY:
                    history = history[-MAX_HISTORY:]
                _chat_history[req.game_id] = history
                save_memory(req.game_id, f"玩家: {req.message}")
                if full:
                    save_memory(req.game_id, f"DM: {full[:200]}")
                state["last_event"] = req.message[:100]
                save_game_state(req.game_id, state)
            except: pass
            yield f"data: {json.dumps({'type':'state_snapshot','content':state}, ensure_ascii=False)}\n\n"
            yield f"data: {json.dumps({'type':'done'})}\n\n"

    return StreamingResponse(gen(), media_type="text/event-stream",
        headers={"Cache-Control":"no-cache","Connection":"keep-alive"})


@router_dnd.get("/health")
async def health():
    return {"status": "ok", "game": "D&D 地心之门"}
