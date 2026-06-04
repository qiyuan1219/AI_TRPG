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
        if _contains_any(label, tuple(_ATTR_MAP.keys())) or _contains_any(label, ("丽莎", "影刃", "格鲁姆", "铁锤", "塔莉亚")):
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

    if "丽莎" in text or "影刃" in text:
        if assist:
            stat_key, skill_name = _infer_player_stat(label, message)
            return f"{skill_name}（丽莎协助）", modifier(state.get(stat_key, 10)), state.get("proficiency_bonus", 2) + 2
        if _contains_any(text, ("陷阱", "拆陷", "开锁", "巧手", "盗贼")):
            return "丽莎-敏捷(盗贼工具)", 6, 0
        if _contains_any(text, ("潜行", "潜入", "暗语")):
            return "丽莎-敏捷(潜行)", 6, 0
        if _contains_any(text, ("追踪", "印记", "察觉", "嗅探")):
            return "丽莎-感知(察觉)", 4, 0

    if "格鲁姆" in text or "铁锤" in text:
        if _contains_any(text, ("酒馆", "人脉", "打听", "传闻", "情报")):
            return "格鲁姆-酒馆人脉", 3, 0
        if _contains_any(text, ("石工", "石造", "机关")):
            return "格鲁姆-矮人石工", 4, 0
        if _contains_any(text, ("嘲讽", "护卫", "运动", "力量")):
            return "格鲁姆-力量(运动)", 5, 0

    if "塔莉亚" in text:
        if _contains_any(text, ("奥秘", "奥术", "译读", "符文", "法术")):
            return "塔莉亚-智力(奥秘)", 6, 0
        if _contains_any(text, ("历史", "礼仪", "法师塔")):
            return "塔莉亚-智力(历史)", 4, 0

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
        f"{player}在{area}稳住呼吸，周围的火光、脚步声与远处低沉的回响仍在继续。\n"
        f"{action_line}\n"
        "局势暂时没有发生新的剧烈变化。你可以先保存进度、检查角色状态，或从眼前线索中选择下一步行动。\n\n"
        "[HINTS:观察周围环境【感知DC12】|回顾任务线索【智力DC12】|和同伴确认计划【魅力DC12】]"
    )


# ============================================================
# 开场白上下文
# ============================================================
def _opening_context(name: str, cls: str) -> str:
    return f"""你是{name}，一名{cls}。你响应了瓦尔德里王国的悬赏令，来到王冠城。

【世界观背景——请在叙事中自然融入】
瓦尔德里（Valdris）是北方王国，首都王冠城依山而建。王国曾繁荣两百年，
但三周前新君阿尔德温三世在加冕典礼上陷入魔法沉睡，同一时刻王冠城地下裂开深渊，
涌出名为「灰烬之裔」的暗影生物——它们昼伏夜出，袭击居民，腐蚀土地。
王国大法师伊瑟拉·星语判定：国王灵魂被囚禁在地下城最深处「碎冠之心」中。
王室悬赏一万金币、贵族头衔、以及国王醒来后的一个承诺，各路冒险者因此涌入王冠城。

【叙事节奏——必须循序渐进，严禁仓促】
第一步·王国氛围（40-60字）：从王冠城的整体氛围写起——晨雾中的山城、
不安的市民、街头张贴的泛黄悬赏令、远方隐约的地裂痕迹。让玩家感受到这是一个陷入危机的王国。

第二步·大法师出场（40-60字）：自然过渡到王宫前厅或中央广场——人群聚集，
大法师伊瑟拉从台阶上缓步走出。先用环境烘托伊瑟拉的出场（钟声、安静的人群、长袍上的魔法纹路），
再让伊瑟拉开口。伊瑟拉语气中应带有沉重与隐忧，暗示事情不止悬赏那么简单。

第三步·伊瑟拉发布委托（50-80字）：伊瑟拉宣布国王沉睡、深渊裂开、碎冠之心的真相，
悬赏一万金币。重点展现伊瑟拉「知情人却不能说太多」的矛盾感。

第四步·冒险者公会注册（60-90字）：【关键——这里必须交代为什么四人会组队！】
伊瑟拉演讲结束后，冒险者涌入公会。公会接待员翻着记录簿，神情严肃地告知一个残酷事实：
「过去三周，单独行动的冒险者没有一个活着回来。新规定——必须四人组队才能领取悬赏令。」
此时公会大厅里大部分冒险者已经找好了队友，只剩下最后四个落单的人：一个矮人战士、
一个半精灵游荡者、一个年轻的法师学徒——还有你。接待员把你们四个叫到柜台前。

第五步·同伴登场（60-90字）：接待员离开后，三位同伴自然发起对话：
【#1】矮人战士格鲁姆·铁锤必须先开口。格鲁姆性格粗犷爽快，嗓门大但讲义气。
他会主动报上名字并询问你的来历——在他的视角里，你们是一根绳上的蚂蚱，得互相认识。
【#2】然后法师学徒塔莉亚插话。塔莉亚年轻、崇拜强者、有点紧张但充满期待。
她会表达对地城探险的兴奋，同时流露出「终于有人愿意和我组队了」如释重负感。
【#3】最后是半精灵游荡者影刃丽莎。丽莎话少，靠在墙边擦匕首，冷冷说一句
「名字不重要，活着回来才重要」。但她的眼神在认真打量你——你感觉得出来，她在评估队友。
每个NPC的初次台词必须贴合其性格，且对话占比 > 80%，舞台提示极简。

第六步·引导：结尾给出至少两个带检定标签的选择：
调查公会登记簿看之前死伤记录【智力DC12】、
观察伊瑟拉是否有所隐瞒【洞悉DC14】、
请格鲁姆打听酒馆情报【人脉DC13】、
请丽莎聊聊她对地城的了解【魅力DC12】、
询问塔莉亚的法术专长【奥秘DC12】

【台词归属】
直接台词前必须写明角色名，例如「伊瑟拉说：」「格鲁姆喊道：」。不要用「她说」「他说」承接。

【组队合理性铁律】
必须交代清楚：1) 独自下地城=必死，所以公会强制组队；
2) 你们四个恰好是最后落单的人，不是随机凑的，是制度推动的必然；
3) 不要写成「他们恰好也在大厅里你就随便组了」这种敷衍感。

请以DM身份叙述开场白，严格按照上述六步顺序，节奏舒缓、沉浸感强。"""


FALLBACK_OPENING = """瓦尔德里——北方王国，曾经繁荣了整整两百年。
王冠城依山而建，灰色的城墙在晨雾中若隐若现，像是从山岩中生长出来一般。街头的石板路被晨露打得湿滑，墙壁上贴满了泛黄的悬赏令，墨迹被雨水洇开，但「一万金币」几个字依然清晰可辨。

三周前，新君阿尔德温三世在加冕典礼上突然陷入魔法沉睡——就在那一刻，王冠城地下裂开一道深渊，名为「灰烬之裔」的暗影生物从中涌出。它们昼伏夜出，袭击居民，腐蚀土地。曾经繁华的街市如今在黄昏后就早早关门，空气中弥漫着铁锈和不安的味道。

四面八方涌来的冒险者填满了城中的每一间旅店。一万金币、贵族头衔、还有一个国王醒来后的承诺——足够让任何人赌上性命。

你穿过城门，沿着石板路走向中央广场。王宫的高塔在雾中投下长长的影子。

一阵低沉的钟声响起。人群安静下来。

大法师【伊瑟拉·星语】从王宫前厅缓步走出。伊瑟拉是一位高等精灵，长袍如夜空织就，深紫色的奥术纹路在袍角微微流转。两百年来伊瑟拉守护着这个王国——也背负着关于这场灾祸的秘密。

伊瑟拉抬起手，广场彻底寂静。

伊瑟拉说：「国王阿尔德温三世——被囚禁在他的梦境之中。他的灵魂困在地下城最深处的【碎冠之心】里。深渊就在这座城下。」
伊瑟拉停顿片刻，目光如炬。
伊瑟拉说：「我需要勇士。赏金一万金币。贵族头衔。还有——国王醒来后的一个承诺。」

伊瑟拉的眼神扫过人群，在你身上停了短短一瞬。

……

演讲结束后，人群涌向冒险者公会。公会大厅里嘈杂一片——登记簿被拍得啪啪响，已经组好队的冒险者们挤在柜台前争抢悬赏令。壁炉的火焰噼啪作响，但暖意驱不散空气中的紧张。

你排到柜台前。

公会接待员是个戴厚眼镜的中年女人。她翻开登记簿，叹了口气。
公会接待员说：「又是一个独行的？听好了——过去三周，单独下地城的冒险者，没有一个活着回来。一个都没有。」
她把登记簿转过来让你看：满满的红叉，划掉了一个又一个名字。
公会接待员说：「新规定。悬赏令只发给四人以上的队伍。单人免谈。」

她抬眼扫了一圈大厅。大多数冒险者已经成团，只剩下零星几个人。
公会接待员用笔敲了敲桌子，朝大厅另一头喊道：「喂——你们三个。过来。凑一队。」

先走过来的是一位矮人战士——满脸络腮胡，板甲上还沾着啤酒沫，嗓门大得震天响。

格鲁姆·铁锤把战锤咚的一声拄在地上，上下打量了你一番。
格鲁姆哈哈大笑：「又来一个不怕死的！好得很！」
格鲁姆拍了拍你的肩膀，力气大得差点把你拍趴下。
格鲁姆说：「我叫格鲁姆，挥锤子的。矮人，欠了一屁股债——一万金币正好够我还清。你呢？」

话还没说完，一个年轻的人类女孩挤到前来。法杖斜背在背上，袍角还沾着墨渍，一双眼睛亮晶晶地轮番看着你们三个。

塔莉亚两手攥着法杖，声音微微发颤——不是紧张，是激动。
塔莉亚说：「我、我叫塔莉亚！法师学徒，主修火焰系——」
塔莉亚说了一半，鼻子里突然喷出一小簇火星，她自己吓了一跳，脸腾地红了。
塔莉亚小声说：「……对不起。一激动就这样。」

半精灵游荡者【影刃丽莎】最后一个走过来。她靠在你旁边的墙上，手里一柄匕首翻了个花，又插回腰间。丽莎没说话，灰色的眼睛像刀锋一样从你脸上一扫而过——你在她眼里看到了评估，不是敌意，而是那种在刀尖上活下来的人特有的谨慎。

沉默了半晌，丽莎终于开了口。声音很轻，但每个字都清楚。
丽莎说：「影刃丽莎。名字不重要。活着回来才重要。」
丽莎顿了顿。丽莎说：「别拖后腿。谁都别。」

接待员把登记簿推到你们面前。
公会接待员说：「四个人，刚好满员。填上名字和职业——从现在起你们是一队。悬赏令领一份就够了，赏金平分。」
公会接待员推了推眼镜，补了一句：「祝你们是第一批活着回来的人。」

[HINTS:调查公会登记簿看死伤记录【智力DC12】|观察伊瑟拉是否有所隐瞒【洞悉DC14】|请格鲁姆打听酒馆情报【人脉DC13】|请丽莎聊聊她对地城的了解【魅力DC12】|询问塔莉亚的法术专长【奥秘DC12】]"""


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
        "current_area": "王冠城·中央广场",
        "cleared_levels": 0,
        "str": req.attr_str, "dex": req.attr_dex, "con": req.attr_con,
        "int": req.attr_int, "wis": req.attr_wis, "cha": req.attr_cha,
        "current_hp": preset["hp"], "max_hp": preset["hp"], "ac": preset["ac"],
        "atk_bonus": preset.get("atk_bonus", 5),
        "proficiency_bonus": PROFICIENCY_BONUS.get(req.level, 2),
        "gold": 200,
        "inventory": "长剑,冒险者工具包,治疗药水x2",
        "gm_hp": 52, "gm_trust": 60, "gm_alive": True,
        "ls_hp": 38, "ls_trust": 45, "ls_alive": True,
        "tl_hp": 24, "tl_trust": 75, "tl_alive": True,
        "triggered_events": "",
        "last_event": "游戏开始",
    }
    save_game_state(gid, state)
    save_memory(gid, f"游戏开始。{req.player_name}，{req.char_class}，响应悬赏来到王冠城。")

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
    return {"status": "ok", "game": "D&D 碎冠之影"}
