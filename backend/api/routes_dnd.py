"""D&D API路由"""
import asyncio
import json
import re
import uuid
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from kp.dm_service import dm_chat_stream, dm_narrate_stream, judge_black_market_bargain, dm_battle_narrate, dm_judge_advantage
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
SAVE_SLOT_KEYS = {"auto", "slot-1", "slot-2", "slot-3", "slot-4", "slot-5"}

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


class StatePatchRequest(BaseModel):
    patch: dict = Field(default_factory=dict)


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
        if _contains_any(label, tuple(_ATTR_MAP.keys())) or _contains_any(label, ("瑟琳", "银杖", "逆钟", "布洛克", "森洛", "铁锅", "艾琳", "白枝", "凯娅", "克莱娅", "软爪")):
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

    if _contains_any(text, ("凯娅", "克莱娅", "软爪")):
        if _contains_any(text, ("陷阱", "拆陷", "开锁", "巧手", "盗贼")):
            return "凯娅-敏捷(盗贼工具)", 6, 0
        if _contains_any(text, ("潜行", "潜入", "侦查")):
            return "凯娅-敏捷(潜行)", 6, 0
        if _contains_any(text, ("察觉", "感知", "危险")):
            return "凯娅-感知(察觉)", 4, 0

    if _contains_any(text, ("布洛克", "森洛", "铁锅")):
        if _contains_any(text, ("真菌", "孢海", "生态", "辨识", "自然", "植物")):
            return "布洛克-真菌辨识", 5, 0
        if _contains_any(text, ("生存", "导航", "路线", "找路", "方向")):
            return "布洛克-生存导航", 5, 0
        if _contains_any(text, ("料理", "食材", "做饭", "烹饪")):
            return "布洛克-孢海料理", 4, 0

    if _contains_any(text, ("艾琳", "白枝")):
        if _contains_any(text, ("治疗", "医药", "包扎", "医术", "稳定")):
            return "艾琳-医者之手", 6, 0
        if _contains_any(text, ("宗教", "圣典", "仪式", "祝福", "腐化", "污染")):
            return "艾琳-圣典学识", 5, 0
        if _contains_any(text, ("说服", "安抚", "劝慰")):
            return "艾琳-安抚低语", 4, 0

    if _contains_any(text, ("瑟琳", "银杖", "逆钟")):
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
你不是初出茅庐的新手。你经历过多次大型攻略，懂得在危险现场快速判断局势。
几个月前，地下魔物开始从矿道、裂隙和废弃井道涌向地表。边境村镇被迫迁离，商路被截断。
冒险者公会给你的委托简洁但清晰：深入幽暗地域，抵达逆穹悬城，查明地底堡垒失联原因，确认「地心狱门」封印是否完好。
这份委托来自幽暗地域深处最后的大型文明据点——倒挂城市「逆穹悬城」。

【开场叙事顺序——必须严格执行，不可跳步、不可合并】

步骤1·抵达入城平台（70-90字）：
用极简叙事交代背景：地心狱门、地底堡垒失联十年、魔物上涌。
再写玩家沿符文矿道一路下行，终于抵达逆穹悬城的入城平台。
此段是序幕，不要展开城市描写，不要写登记流程，不要透露地下海洋。

步骤2·初入逆穹悬城（120-150字）：
这是玩家第一次看见倒挂城市。必须出现「一整座城市倒挂在巨大洞穴的穹顶之上」这句或近似句，以触发前端城景。
之后扩展描写：尖塔垂向黑暗、秘银主缆如蛛网、远处深井下方浮着蓝绿色孢光。
守卫喊住玩家并说一句台词（如"地表来的？别盯着下面看太久，第一次有人看吐在通行证上。"）。
守卫可以简短指引方向（往主缆街走可以找到公会），但不要陪同。
此段给玩家两三句自由观察空间：城市结构、主缆上的防御弩台、下方深井的孢光。

步骤3·"银杖"瑟琳登场并固定同行（120-150字）：
公会钟声从倒挂塔楼里传来。人流被一队黑缆守卫分开。
瑟琳站在主缆街边，戴着法师帽，银灰发，手中短银杖轻点在街面上。
她的第一句台词必须是：「你就是从地表来的冒险者吧。比我想象中……来得更早。」
之后用沉稳自然的语气说明自己的职责——她不是官僚，只是把事情说清楚：「公会安排我负责你的法术支援和医疗。先跟我去公会大厅登记。」
或类似表达，一定要自然提到去公会登记。不要背诵公文，不要说"文书上写的是……"这种生硬句式。
另外用一两句表达关心，但点到为止，不煽情。如"受了伤直接跟我说，不用硬撑。"
表现瑟琳的文静、克制、可靠、略带疲惫感。
绝不能揭露她来自未来，不能让她长篇解释时间魔法。

步骤4·教学战斗触发（80-100字）：
主缆街尽头的货箱堆传来刮擦声。一只从孢海据点回收的补给吊箱从缆车上震落，木板炸开。
里面蜷缩的不是货物，而是几只被孢粉刺激到发狂的小型「裂隙爬兽」。它们撞翻灯架，沿倒挂街面朝人群扑来。
守卫刚抬起手弩，其中一只已经朝玩家方向冲来。
瑟琳快速判断局势，给出简短战术提示（如"别后退到缆边。先解决最近的那只，侧腹没有甲壳。"），但绝不替玩家拍板。
开场白必须在玩家下令前停止，不要在末尾写"你的选择是？""请下令"等引导语。

【判定后衔接铁律】
玩家下一次行动会触发预骰和完整教学战斗。无论D20判定多高，第一击只能造成战术优势、轻伤、畏光或暴露弱点，绝不能秒杀怪物。
战斗结束后进入"战斗后交谈→初到冒险者公会→回声酒馆→公会正式接任务"的后续流程。

【后续主线锚点——开场不要提前展开】
教学战斗后：守卫感谢玩家但语气严肃，解释吊箱来自孢海据点，最近这类事件变多。
初到公会：公会任务官"米娜"和"断缆"赫尔曼做初步登记，并引导去回声酒馆完成轻量互动教程。
回声酒馆：酒馆老板萨洛介绍快艇骰子规则后，HINTS必须只给两个选项——「和萨洛玩一局快艇骰子」或「先在酒馆里转转再说」。选择玩则前端直接跳转骰子游戏界面，选择不玩则继续自由对话。瑟琳只提供建议，不能代替玩家决策；不能出现莱因或地下海洋线索。
正式接任务后：选五名可选同伴中的2名；"银杖"瑟琳固定同行不占名额。
出发前准备：黑市商人奥兰·爵触发5轮讲价采购。

【台词格式】
必须使用剧本格式：人物名：「台词」。不要写"说/道/喊道"。
舞台提示作为独立短句自然融入叙述，不加括号，每轮≤2处。

【整体要求】
叙事要有画面感、节奏要舒缓，让玩家感受到世界的厚度。每个场景之间要有自然过渡，不要生硬跳转。
禁止使用登记簿评价玩家，禁止现代科技，禁止透露地下海洋。
每个分句字数必须大于等于10字。若某个分句不足10字，必须将其与前一个分句合并，绝不允许出现短于10字的独立分句。

请严格按上述步骤生成完整开场白，只写到裂隙爬兽扑来、等待玩家下令为止。最后给出贴合教学战的 [HINTS]。"""


# ============================================================
# 🔴 固定开场白脚本 (不依赖AI, speaker绝对不会错)
# ============================================================
SCRIPTED_OPENING: list[dict] = [
    # ===== 世界观 =====
    {"speaker": "主持人", "text": "这世界远比地表王国愿意承认的更古老也更危险。"},
    {"speaker": "主持人", "text": "在幽暗地域最深处，千年前曾裂开一道门——地心狱门。"},
    {"speaker": "主持人", "text": "它直通九层地狱第一层阿弗纳斯。"},
    {"speaker": "主持人", "text": "恶魔涌出、矿脉污染、城市陷落。"},
    {"speaker": "主持人", "text": "三位英雄带着三件圣遗物深入地下，将门封印。"},
    {"speaker": "主持人", "text": "他们在门上方建立地底堡垒，命最精锐的骑士与法师世代镇守。"},
    # ===== 逆穹悬城 =====
    {"speaker": "主持人", "text": "那之后一千年，逆穹悬城在洞穴穹顶之上建成。"},
    {"speaker": "主持人", "text": "一座整座倒挂的城市，幽暗地域最后的文明据点。"},
    {"speaker": "主持人", "text": "九条秘银主缆拉住整片街区，符文灯照亮倒悬街巷。"},
    {"speaker": "主持人", "text": "降渊缆梯从城市中央垂入不可见的深渊。"},
    {"speaker": "主持人", "text": "而地底堡垒，就在那座深渊的更深处。"},
    # ===== 危机 =====
    {"speaker": "主持人", "text": "十年前，地底堡垒最后一次发出信号。"},
    {"speaker": "主持人", "text": "之后，便彻底沉默了。"},
    {"speaker": "主持人", "text": "多支远征队深入地下，没有一支带着答案回来。"},
    {"speaker": "主持人", "text": "近几个月，魔物上涌翻了数倍。"},
    {"speaker": "主持人", "text": "裂隙爬兽、孢化地底兽，甚至从未见过的魔物开始袭击矿道和商路。"},
    # ===== 赏金猎人 =====
    {"speaker": "主持人", "text": "你是一名行走在各大城邦之间的赏金猎人。"},
    {"speaker": "主持人", "text": "不是登记簿上新填的那种。"},
    {"speaker": "主持人", "text": "也不是这行里缺钱的亡命徒。"},
    {"speaker": "主持人", "text": "你追踪过北地霜龙，清理过南沼巫妖水脉。"},
    {"speaker": "主持人", "text": "几座地下城的黑市名单上，同时标注着「最可靠的疯子」和「最危险的债务人」。"},
    # ===== 指名委托 =====
    {"speaker": "主持人", "text": "三个月前，一份指名委托送到了你手上。"},
    {"speaker": "主持人", "text": "指名委托——不是挂在告示板上等人摘的那种。"},
    {"speaker": "主持人", "text": "而是公会指名道姓选一个人，并预付一半佣金。"},
    {"speaker": "主持人", "text": "委托只有三行字。"},
    {"speaker": "主持人", "text": "「深入幽暗地域。抵达逆穹悬城。」"},
    {"speaker": "主持人", "text": "「查明失联原因，确认封印状态，带回生还者或证据。」"},
    # ===== 旅途 =====
    {"speaker": "主持人", "text": "你接下委托，沿废弃的符文矿道一路下行。"},
    {"speaker": "主持人", "text": "先是地表矿层——灰岩、铁锈、熄灭的矮人锻炉。"},
    {"speaker": "主持人", "text": "进入过渡带，空气变潮。"},
    {"speaker": "主持人", "text": "岩壁渗出蓝绿色菌斑，像墙壁自己在发光。"},
    {"speaker": "主持人", "text": "再往下，连矮人的路标都没了。"},
    {"speaker": "主持人", "text": "只剩侏儒工程师留下的发光铆钉。"},
    {"speaker": "主持人", "text": "每隔五十步一颗，在黑暗里串成通向深渊的虚线。"},
    # ===== 抵达 =====
    {"speaker": "主持人", "text": "数日跋涉后，矿道尽头不再只有岩石。"},
    {"speaker": "主持人", "text": "前方涌来的气流带着矿石粉尘和孢海的甜腥。"},
    {"speaker": "主持人", "text": "脚下的石板变成了刻有防御符文的吊桥。"},
    {"speaker": "主持人", "text": "吊桥尽头，一扇刻满封印咒文的石门缓缓打开。"},
    {"speaker": "主持人", "text": "逆穹悬城的入城平台，就在门后。"},
    # ===== 城市初见 =====
    {"speaker": "主持人", "text": "定向门开启，重力被看不见的手翻转。"},
    {"speaker": "主持人", "text": "你抬头，又像在低头。"},
    {"speaker": "主持人", "text": "一整座城市倒挂在巨大洞穴的穹顶之上。"},
    {"speaker": "主持人", "text": "尖塔垂向深渊。"},
    {"speaker": "主持人", "text": "秘银主缆像冻结的瀑布拉住整片街区。"},
    {"speaker": "主持人", "text": "防御弩塔嵌在倒悬街角。"},
    {"speaker": "主持人", "text": "数百盏符文灯在倒挂的街道里浮动。"},
    {"speaker": "主持人", "text": "中央深井下，蓝绿色孢光铺展到视线尽头。"},
    {"speaker": "主持人", "text": "像洞穴底部睡着一片会呼吸的星云。"},
    # ===== 守卫 =====
    {"speaker": "守卫", "text": "「地表来的赏金猎人？别盯着下面看太久——以前有人看吐在通行证上。」"},
    {"speaker": "守卫", "text": "「公会让我来接你，往这边走。」"},
    {"speaker": "守卫", "text": "「穿过吊桥区就是冒险者公会。逆穹城的路看着是倒的，摔起来比看着重。」"},
    # ===== 主缆街 =====
    {"speaker": "主持人", "text": "你沿主缆街朝公会方向走去。"},
    {"speaker": "主持人", "text": "符文灯把你的影子投在头顶的街石上，像一个倒影中行走的幽灵。"},
    {"speaker": "主持人", "text": "秘银主缆发出深沉的金属震响。"},
    {"speaker": "主持人", "text": "哨岗弩手从角楼探头，视线扫过深井幽光。"},
    {"speaker": "主持人", "text": "空气里混着矿石粉尘、机油和孢海甜腥。"},
    # ===== 瑟琳登场 =====
    {"speaker": "主持人", "text": "公会钟声从一座倒挂塔楼里传来。"},
    {"speaker": "主持人", "text": "人流被黑缆守卫分开。"},
    {"speaker": "主持人", "text": "你看见一名银灰长发的女性站在檐下。"},
    {"speaker": "主持人", "text": "她戴着法师帽，短银杖轻轻抵着街石。"},
    {"speaker": "主持人", "text": "像在听地底的脉搏。"},
    {"speaker": "主持人", "text": "她看你时眼里闪过克制的熟悉感。"},
    {"speaker": "主持人", "text": "没有解释，只在你走近时收回眼底。"},
    {"speaker": "瑟琳", "text": "「你就是地表公会指名的那位赏金猎人。」"},
    {"speaker": "瑟琳", "text": "「我叫瑟琳，公会安排我负责你的法术支援和医疗辅助。」"},
    {"speaker": "瑟琳", "text": "「你比预估抵达时间早了三天——看来传言没夸张。」"},
    {"speaker": "瑟琳", "text": "「先随我去公会大厅登记，路上和你交代城里的情况。」"},
    {"speaker": "瑟琳", "text": "「受了伤直接告诉我，不用逞强。」"},
    # ===== 教学战斗触发 =====
    {"speaker": "主持人", "text": "你们没走多远，街尽头传来刺耳的金属刮擦声。"},
    {"speaker": "主持人", "text": "一只补给吊箱从缆车支架翻落，木板在街面上炸开。"},
    {"speaker": "主持人", "text": "里面蜷缩的不是补给，而是小型裂隙爬兽。"},
    {"speaker": "主持人", "text": "它们被孢粉刺激到发狂。"},
    {"speaker": "主持人", "text": "灰白色甲壳沾满蓝绿色孢尘，眼睛被符文灯光刺得不断收缩。"},
    {"speaker": "主持人", "text": "其中一只正沿断裂缆索，朝你直扑过来。"},
    {"speaker": "主持人", "text": "守卫刚抬起手弩，瑟琳的银杖已经亮了。"},
    {"speaker": "瑟琳", "text": "「别退到缆索那边！最近那只侧腹没甲，打它的软肋！」"},
]

SCRIPTED_OPENING_HINTS = [
    "正面迎击裂隙爬兽【力量DC10】",
    "观察弱点寻找破绽【感知DC10】",
    "请求瑟琳施展辅助法术【魅力DC12】",
    "闪避并寻找掩护位置【敏捷DC10】",
]

# 保留旧版纯文本兜底（用于日志记录和兼容）
FALLBACK_OPENING = """这世界远比地表王国愿意承认的更古老也更危险。在幽暗地域最深处，千年前曾裂开一道门——地心狱门。
三位英雄带着圣遗物将门封印，并建立地底堡垒世代镇守。逆穹悬城——这座倒挂在巨大洞穴穹顶的城市，是幽暗地域最后的文明据点。
十年前地底堡垒失联，魔物上涌。你是一名赏金猎人，接到了逆穹城公会的指名委托：深入幽暗地域，查明失联原因，确认封印状态。"""


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
        "current_area": "逆穹悬城·主缆街",
        "actions_in_area": 0,
        "cleared_levels": 0,
        "str": req.attr_str, "dex": req.attr_dex, "con": req.attr_con,
        "int": req.attr_int, "wis": req.attr_wis, "cha": req.attr_cha,
        "current_hp": preset["hp"], "max_hp": preset["hp"], "ac": preset["ac"],
        "atk_bonus": preset.get("atk_bonus", 5),
        "proficiency_bonus": PROFICIENCY_BONUS.get(req.level, 2),
        "gold": 200,
        "inventory": "长剑,冒险者工具包,治疗药水x2",
        "guild_registered": False,
        "city_map_unlocked": False,
        "blackmarket_unlocked": False,
        "al_recruited": False,
        "sl_recruited": False,
        "kl_recruited": False,
        "recruited_companions": "瑟琳",
        # 核心同伴 - "银杖"瑟琳固定同行
        "se_hp": 34, "se_trust": 84, "se_alive": True,
        # 可选同伴1 - 布洛克
        "sl_hp": 46, "sl_trust": 60, "sl_alive": True,
        # 可选同伴2 - 艾琳
        "al_hp": 32, "al_trust": 60, "al_alive": True,
        # 可选同伴3 - 凯娅
        "kl_hp": 36, "kl_trust": 55, "kl_alive": True,
        "triggered_events": "",
        "last_event": "游戏开始",
    }
    save_game_state(gid, state)
    save_memory(gid, f"游戏开始。{req.player_name}，{req.char_class}，接受委托来到逆穹悬城。")

    # 🔴 使用固定脚本，不依赖AI生成，speaker绝对不会出错
    opening_script = SCRIPTED_OPENING
    opening_text = "\n".join(f"{line['speaker']}：{line['text']}" for line in opening_script)
    hints = SCRIPTED_OPENING_HINTS

    # 初始化对话历史（用纯文本记录，保持兼容）
    _chat_history[gid] = [
        {"role": "assistant", "content": opening_text}
    ]

    # 创建日志文件（时间戳命名）
    sid, log = new_session(
        req.player_name, req.char_class,
        {"attr_str": req.attr_str, "attr_dex": req.attr_dex, "attr_con": req.attr_con,
         "attr_int": req.attr_int, "attr_wis": req.attr_wis, "attr_cha": req.attr_cha},
        opening_text
    )
    _session_map[gid] = sid

    return {
        "game_id": gid,
        "session_id": sid,
        "opening": opening_text,
        "opening_script": opening_script,    # 🔴 结构化脚本，speaker绝对正确
        "opening_hints": hints,              # 🔴 开场HINTS
        "state": state,
    }


@router_dnd.get("/game/{game_id}/state")
async def get_state(game_id: str):
    state = load_game_state(game_id)
    if not state: raise HTTPException(404, "游戏不存在")
    return {"game_id": game_id, "state": state}


@router_dnd.post("/game/{game_id}/state/patch")
async def patch_state(game_id: str, req: StatePatchRequest):
    state = load_game_state(game_id)
    if not state:
        raise HTTPException(404, "游戏不存在")

    patch = dict(req.patch or {})
    patch.pop("game_id", None)
    patch.pop("id", None)
    if not patch:
        return {"game_id": game_id, "state": state}

    old_area = state.get("current_area")
    state.update(patch)
    if patch.get("current_area") and patch.get("current_area") != old_area:
        state["actions_in_area"] = int(patch.get("actions_in_area", 0))

    recruited = [item.strip() for item in str(state.get("recruited_companions", "")).split(",") if item.strip()]
    for flag, name in (("al_recruited", "艾琳"), ("sl_recruited", "布洛克"), ("kl_recruited", "凯娅")):
        if state.get(flag) and name not in recruited:
            recruited.append(name)
    if recruited:
        state["recruited_companions"] = ",".join(recruited)

    save_game_state(game_id, state)
    if patch.get("last_event"):
        save_memory(game_id, str(patch["last_event"]), "state")

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

    # 递增当前区域行动次数
    state["actions_in_area"] = int(state.get("actions_in_area", 0)) + 1
    save_game_state(req.game_id, state)

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


class BattleNarrateRequest(BaseModel):
    actor_name: str
    target_name: str
    skill_name: str
    outcome: str
    amount: float = 0
    d20_roll: int = 0
    d20_total: int = 0
    damage_label: str = ""
    tags: list[str] = []
    ac_dc: int = 0


@router_dnd.post("/battle/narrate")
async def battle_narrate(req: BattleNarrateRequest):
    text = await dm_battle_narrate(
        actor_name=req.actor_name,
        target_name=req.target_name,
        skill_name=req.skill_name,
        outcome=req.outcome,
        amount=req.amount,
        d20_roll=req.d20_roll,
        d20_total=req.d20_total,
        damage_label=req.damage_label,
        tags=req.tags,
        ac_dc=req.ac_dc,
    )
    return {"narration": text}


class AdvantageRequest(BaseModel):
    unit_name: str
    context: str


@router_dnd.post("/battle/advantage")
async def judge_advantage(req: AdvantageRequest):
    result = await dm_judge_advantage(req.unit_name, req.context)
    return result


@router_dnd.get("/health")
async def health():
    return {"status": "ok", "game": "D&D 地心之门"}
