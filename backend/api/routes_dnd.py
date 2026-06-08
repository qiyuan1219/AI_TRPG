"""D&D API路由"""
import asyncio
import json
import re
import uuid
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from kp.dm_service import dm_chat_stream, dm_narrate_stream, judge_black_market_bargain
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


class BargainJudgeRequest(BaseModel):
    item_name: str
    base_price: int
    current_price: int
    attempt: int
    max_attempts: int = 5
    roll: int
    bonus: int = 3
    total: int
    player_words: str
    history: list[dict] = Field(default_factory=list)


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
        if _contains_any(label, tuple(_ATTR_MAP.keys())) or _contains_any(label, ("丽莎", "影刃", "格鲁姆", "铁锤", "塔莉亚", "瑟琳", "逆钟", "森洛", "铁锅", "莉亚瑟", "青弦", "艾琳", "白枝", "克莱娅", "软爪", "雷铎", "炉心")):
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

    if "艾琳" in text or "白枝" in text:
        if _contains_any(text, ("治疗", "医药", "包扎", "医术")):
            return "艾琳-医者之手", 6, 0
        if _contains_any(text, ("宗教", "圣典", "仪式", "祝福")):
            return "艾琳-圣典学识", 5, 0
        if _contains_any(text, ("说服", "安抚", "劝慰")):
            return "艾琳-安抚低语", 4, 0

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
    return f"""你是{name}，一名身经百战的{cls}。

【玩家身份与背景——开场必须包含，不可跳过】
你不是初出茅庐的新手。你见过北境冰原的暴风雪，穿过南方沼泽的毒雾森林，
在西境商路上单枪匹马护过车队。见过大场面，也吃过败仗——但每次都活着回来了。
冒险者公会找上你的时候，你没有太多犹豫，因为这正是你擅长的事：哪里危险，就往哪里去。

几个月前，地下魔物开始从矿道和裂隙涌向地表。边境村镇首当其冲——矿道撕裂，商路截断，
越来越多的平民被迫南迁。地表王国焦头烂额，普通的守卫根本挡不住这些不知来处的怪物。
当公会找到你时，你没有犹豫太久——这种级别的任务，正需要你这样的人。

【玩家此行目的——必须交代】
委托来自幽暗地域深处最后一座大型文明据点——颠倒城市「逆穹城」。
厚羊皮纸，蓝色火漆印章，在暗处发出冷绿色荧光。委托内容简明扼要：前往逆穹城，组建远征队，
深入失联十年的地底堡垒，确认「地心狱门」封印状态。
「此行穿越无光孢海，普通冒险者慎入。」

【世界观背景——请在叙事中自然融入】
幽暗地域深处有一座古老门户「地心狱门」，通向九层地狱第一层阿弗纳斯。
千年前古代英雄用三件封印圣遗物封住狱门，并在上方建立地底堡垒世代镇守。
但十年前，地底堡垒突然失联。近年来地下魔物愈发频繁地涌向地表。

【比赛版第一幕展示目标——请内化到叙事中】
本次剧情只制作第一幕。开场要展示 AI 如何当主持人：根据玩家行动和检定结果推进主线；NPC 如何像数字居民一样记住玩家并按信任值反馈；回声酒馆的快艇骰子会展示 AI 参谋和瑟琳协助；战斗会展示 KP 根据骰点和伤害生成行动结果描写。
不要在开场直白说"这是比赛功能展示"，但要通过瑟琳的反应、萨洛的赌局传闻、公会对同伴信任的提醒，让玩家自然知道这些系统会影响剧情。

【叙事节奏——循序渐进，不得跳过任何步骤】
🔴🔴 前置流程铁律——以下步骤必须严格按顺序执行，不可跳步、不可换序 🔴🔴

步骤0·世界观与身份铺垫（80-100字）🔴 绝不能跳过：
先写幽暗地域和地心狱门的危机感，再自然引出玩家——你不是新手，是经验丰富的冒险者，
当公会找到你时你没有犹豫。你正沿着地底矿道的符文路标前行，接近逆穹城的外围关卡。
🔴 禁止「登记簿」「名单」「评价」等档案腔调。用行动暗示资历。
🔴 此时尚未进城，你在城市外围的检查站/定向门平台。

步骤1·初遇瑟琳（60-80字）🔴 发生在进城之前的外围关卡：
瑟琳在定向门平台等你。她是年轻的女法师【瑟琳·逆钟】，文静、克制、强大而忧郁。
她会主动上前：「你就是公会提到的那位吧。比通知的时间来得更早。」
然后说明身份：「我是瑟琳·逆钟，冒险者公会指派的协作者。负责奥术支援、治疗和时间异常判断。
公会让我来接你——他们已经在等你的报到。」
她固定入队。
🔴 此时绝对不能描述城市内部景观！你还站在外围检查站，只看到定向门和守卫岗哨。

步骤2·初次战斗（40-60字）🔴 在外围平台发生，战斗后不进城：
一批从下层孢海据点回收的补给吊箱被吊上平台。吊箱打开时，钻出2-3只小型「裂隙爬兽」。
极低难度教学战，玩家必胜。

🔴🔴 铁律——判定后必须进入完整战斗，不可秒杀！🔴🔴
当玩家选择行动并投出判定后，你只需要用2-3句简短叙事描述判定结果带来的战术态势
（例如「你抢在爬兽扑到之前切入侧腹，它踉跄后退」），然后**立即推进到战斗开始**。
无论D20掷出多少，裂隙爬兽都只是受轻伤/受惊/暴露弱点，绝不会被判定一击毙命。
你的叙事节奏：判定结果陈述（2-3句）→ 战斗正式开始。中间不停顿、不额外给选项。

战斗结束后，不要立即进城！先与瑟琳和守卫对话——

步骤3·战斗后交谈（40-60字）🔴 必须发生在进城之前：
🔴 三人对话，台词归属严格分离：
- 【守卫】翻看吊箱封条，脸色变了：「这是从孢海据点回收的空箱。按理说，它不该带回活物。」
  守卫会补充：最近从下层运上来的物资里混进魔物的次数越来越多了。
- 【瑟琳】皱眉看向深井方向：「孢海据点的防线可能已经出了问题。这事必须在公会报备。」
- 【冒险者】你可以提问，但这段对话的目的是引出怪物来源的疑云。
🔴 不能把守卫的话塞给瑟琳，反之亦然。

步骤4·进城+公会报到（80-100字）🔴 交谈结束后才进城：
方向错乱定向门的短眩晕后，世界翻转——一整座城市倒挂在穹顶之上。
此时才描述逆穹城的倒挂奇迹感、尖塔、吊桥、深井和远处荧光。
然后瑟琳带你进入冒险者公会报到。
冒险者公会接待员【米蕾娜·白契】核对委托书后，展开远征图说明路线：
从降渊缆梯垂降→孢海据点→无光孢海→黑暗之门→地底堡垒。
🔴🔴 关键信息——米蕾娜必须明确告知：🔴🔴
「另外——公会规定：出发队伍必须满四人。单独或双人行动的下场，你看看墙上那些失踪名单就知道了。」
城防负责人【赫尔曼·断缆】补充军事动态。
瑟琳表示自己已占一个名额：「公会整备厅还有几位通过筛选的冒险者，你可以去看看。」

步骤5·城市探索引导（40-60字）：
玩家需要在逆穹城招募剩余队员（从整备厅的5人中选2人）、采购装备、打探情报。
此处只是过渡——具体招募和探索在后续对话中展开。
🔴 开场白到此结束。不要一次性展开所有同伴详情。

【重要——伏笔提示】
米蕾娜、酒馆老板等NPC必须暗示：地底堡垒就在无光孢海下面一层，穿过黑暗之门就该抵达。
这是第一幕结尾反转的基础。

第六步·引导：结尾给出至少两个选择。
🔴 先叙事过渡，再给选项。选项必须贴合"招募队员+筹备出发"这个阶段。
例如：前往公会整备厅招募队员、去回声酒馆打听情报【魅力DC12】、
向赫尔曼询问军事动态【洞悉DC13】、与瑟琳讨论远征路线【奥秘DC12】

【台词归属】
标准剧本格式：人物名：「台词」。不要用"说/道/喊"等动词。

请以DM身份叙述开场白，严格按照上述七步(步骤0→步骤6)顺序，节奏舒缓、沉浸感强。步骤0不可或缺！"""


FALLBACK_OPENING = """在世界深处，存在一座古老的门——地心狱门。它通向九层地狱第一层阿弗纳斯。
千年前，英雄们用三件封印圣遗物封住了它，并在上方建立地底堡垒，世代镇守。

但十年前，地底堡垒突然失联。多支远征队深入调查，无一生还。
最近几个月，地下魔物开始顺着裂隙涌向地表——矿道被撕裂，商路被截断，边境村镇一个接一个沦陷。

冒险者公会翻遍了登记簿。你的名字在上面。

委托书来自幽暗地域深处最后一座文明据点——颠倒城市「逆穹城」。
「调查地底堡垒失联事件，确认地心狱门封印状态。此任务需穿越无光孢海，非资深冒险者慎入。」

你没有犹豫太久。

穿过连绵的地底矿道，沿着符文路标走了数日。前方终于出现了光亮——不是阳光，
是刻在岩壁上的符文灯，标示着逆穹城的外围检查站。

一个年轻的女法师站在定向门平台旁，深色长袍，法杖斜倚在肩头。她看起来像在等人。
看到你，她站直了身体。

瑟琳：「你就是公会提到的那位吧。比通知的时间来得更早。」
瑟琳：「我是瑟琳·逆钟，冒险者公会指派的协作者。负责奥术支援、治疗和时间异常判断。
公会让我来接你——他们已经在等你的报到。」

话还没说完，不远处的吊箱平台传来刮擦声。一批从下层孢海据点回收的补给吊箱正在卸货，
其中一只箱盖突然从内部被撞开——几只灰白色的小型魔物滚落出来，身上沾着蓝绿色孢尘，
眼睛被符文灯光刺激得不断收缩。

守卫刚拔出手弩，其中一只已经朝你们扑来。
瑟琳：「别退太远，它们怕光。攻击侧腹，那里没有甲壳。」

裂隙爬兽嘶吼着越来越近，你只有几秒的决断时间。瑟琳退后一步，淡银色的光已在指尖亮起——
她在等你下令。
瑟琳：「你的选择是？」

[HINTS:正面迎击裂隙爬兽【力量DC10】|观察弱点寻找破绽【感知DC10】|让瑟琳施展辅助法术|撤退脱战拉开距离【敏捷DC10】|闪避并寻找掩护位置【敏捷DC10】]"""


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
        # 可选同伴3 - 艾琳
        "al_hp": 32, "al_trust": 60, "al_alive": True,
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


@router_dnd.post("/bargain/judge")
async def judge_bargain(req: BargainJudgeRequest):
    item_name = req.item_name.strip() or "黑市货物"
    player_words = req.player_words.strip()
    if not player_words:
        raise HTTPException(400, "讲价话语不能为空")

    base_price = max(1, req.base_price)
    current_price = max(1, req.current_price)
    max_attempts = max(1, min(req.max_attempts, 5))
    attempt = max(1, min(req.attempt, max_attempts))
    roll = max(1, min(req.roll, 20))
    bonus = max(-5, min(req.bonus, 12))
    total = max(roll + bonus, min(req.total, 40))

    result = await judge_black_market_bargain(
        item_name=item_name,
        base_price=base_price,
        current_price=current_price,
        attempt=attempt,
        max_attempts=max_attempts,
        roll=roll,
        bonus=bonus,
        total=total,
        player_words=player_words,
        history=req.history[-5:],
    )
    return result


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
