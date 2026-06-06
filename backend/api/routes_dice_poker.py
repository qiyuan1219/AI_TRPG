"""
快艇骰子 API 路由
提供骰子游戏的全部后端操作 + AI策略建议 + NPC信任联动
"""
import json
import random
import uuid
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

from engine.dice_poker import (
    DicePokerState, roll_dice, roll_with_kept,
    calculate_score, get_available_categories,
    get_ai_hint_text, describe_dice, CATEGORY_NAMES_CN,
)
from kp.memory import load_game_state, save_game_state

router_poker = APIRouter(prefix="/api/dice-poker")

# 内存中存储活跃游戏状态（比赛demo简化方案）
_active_games: dict[str, DicePokerState] = {}

# 每局游戏配置
GAME_CONFIG = {
    "ante_gold": 20,          # 底注金币
    "max_rerolls": 2,          # 最大重投次数
    "max_rounds": 3,           # 每局几轮
    "npc_min_score": 18,       # NPC"及格线"分数（低于此NPC算输）
    "npc_good_score": 30,      # NPC"良好"分数
    "npc_excellent_score": 45, # NPC"优秀"分数
}


# ============================================================
# 模型
# ============================================================
class StartGameRequest(BaseModel):
    game_id: str
    npc_name: str = "莱因"
    npc_trust_key: str = "ly"       # 信任值的state key


class RollRequest(BaseModel):
    game_id: str


class KeepRequest(BaseModel):
    game_id: str
    keep_indices: list[int] = []    # 要保留的骰子索引(0-4)


class ScoreRequest(BaseModel):
    game_id: str
    category: str                    # 计分项名称


class AIHintRequest(BaseModel):
    game_id: str


# ============================================================
# 工具
# ============================================================
def _get_game(game_id: str) -> DicePokerState:
    if game_id not in _active_games:
        raise HTTPException(404, "游戏不存在或已结束")
    return _active_games[game_id]


def _game_summary(state: DicePokerState) -> dict:
    return {
        "dice": state.dice,
        "kept": list(state.kept),
        "rerolls_left": state.rerolls_left,
        "round_number": state.round_number,
        "scores": state.scores,
        "used_categories": list(state.used_categories),
        "available_categories": get_available_categories(state),
        "game_over": state.game_over,
        "npc_name": state.npc_name,
        "current_bet_info": state.current_bet_info,
    }


# ============================================================
# 端点
# ============================================================
@router_poker.post("/start")
def start_game(req: StartGameRequest):
    """开始一局快艇骰子，赌注为一条情报"""
    gid = str(uuid.uuid4())[:6]
    state = DicePokerState(
        dice=roll_dice(5),
        round_number=1,
        npc_name=req.npc_name,
        npc_trust_key=req.npc_trust_key,
    )
    
    # 根据NPC设定不同的赌注情报
    bet_infos = {
        "莱因": "莱因会告诉你关于黑暗之门后传来海浪声的秘密",
        "萨洛": "萨洛会透露地底堡垒失联前的最后一封传讯内容",
        "森洛": "森洛会分享无光孢海深处真菌梦声的秘密",
    }
    state.current_bet_info = bet_infos.get(req.npc_name, f"{req.npc_name}会透露一条重要情报")
    
    _active_games[gid] = state
    
    # AI生成开场白
    dice_desc = describe_dice(state.dice)
    greeting = (
        f"🎲 {state.npc_name}把骰子杯往桌上一顿，浑浊的眼睛里闪过一丝久违的光。\n"
        f"「来一局。赢了，我就告诉你一些你绝对想听的事。」\n"
        f"你的初始骰面：{dice_desc}\n"
        f"还剩 {state.rerolls_left} 次重投机会。"
    )
    
    return {
        "game_id": gid,
        "summary": _game_summary(state),
        "narrative": greeting,
        "hint": get_ai_hint_text(state.dice, state.rerolls_left, get_available_categories(state)),
    }


@router_poker.post("/roll")
def roll_dice_endpoint(req: RollRequest):
    """掷所有未被保留的骰子（消耗一次重投）"""
    state = _get_game(req.game_id)
    
    if state.rerolls_left <= 0:
        raise HTTPException(400, "没有剩余重投次数，请选择计分项")
    
    if state.game_over:
        raise HTTPException(400, "游戏已结束")
    
    state.dice = roll_with_kept(state)
    state.kept = set()
    state.rerolls_left -= 1
    state.round_number += 1
    
    available = get_available_categories(state)
    ai_hint = get_ai_hint_text(state.dice, state.rerolls_left, available)
    
    # AI氛围组叙事
    dice_desc = describe_dice(state.dice)
    kept_desc = "所有骰子已重投" if state.round_number > 1 else "首次掷骰"
    
    narrative = (
        f"🎲 {kept_desc}！新的骰面：{dice_desc}\n"
        f"还剩 {state.rerolls_left} 次重投机会。"
    )
    
    return {
        "summary": _game_summary(state),
        "narrative": narrative,
        "hint": ai_hint,
    }


@router_poker.post("/keep")
def keep_dice_endpoint(req: KeepRequest):
    """先选择要保留的骰子，然后自动重投其余（消耗一次重投）"""
    state = _get_game(req.game_id)
    
    if state.rerolls_left <= 0:
        raise HTTPException(400, "没有剩余重投次数")
    
    if state.game_over:
        raise HTTPException(400, "游戏已结束")
    
    # 验证索引
    state.kept = set()
    for idx in req.keep_indices:
        if 0 <= idx <= 4:
            state.kept.add(idx)
    
    # 重投未保留的
    state.dice = roll_with_kept(state)
    state.rerolls_left -= 1
    state.round_number += 1
    
    available = get_available_categories(state)
    ai_hint = get_ai_hint_text(state.dice, state.rerolls_left, available)
    
    kept_vals = [f"第{i+1}个({state.dice[i]}点)" for i in sorted(state.kept)]
    dice_desc = describe_dice(state.dice)
    
    narrative = (
        f"🎲 保留：{', '.join(kept_vals) if kept_vals else '无'}。重投其余骰子！\n"
        f"新骰面：{dice_desc}\n"
        f"还剩 {state.rerolls_left} 次重投机会。"
    )
    
    return {
        "summary": _game_summary(state),
        "narrative": narrative,
        "hint": ai_hint,
    }


@router_poker.post("/score")
def score_endpoint(req: ScoreRequest):
    """选择计分项并结算（与NPC对比分数，决定信任变动）"""
    state = _get_game(req.game_id)
    
    if state.game_over:
        raise HTTPException(400, "游戏已结束")
    
    if req.category in state.used_categories:
        raise HTTPException(400, f"计分项「{req.category}」已使用")
    
    if req.category not in CATEGORY_NAMES_CN:
        raise HTTPException(400, f"未知计分项「{req.category}」")
    
    # 计算玩家分数
    player_score = calculate_score(state.dice, req.category)
    state.scores[req.category] = player_score
    state.used_categories.add(req.category)
    
    # NPC出分（模拟NPC的骰子水平）
    npc_base = [random.randint(1, 6) for _ in range(5)]
    npc_score = max(
        calculate_score(npc_base, cat)
        for cat in CATEGORY_NAMES_CN
        if cat not in state.used_categories
    )
    # NPC的分数不能完全离谱，增加一点竞争力
    npc_score = min(npc_score, player_score + 12)
    npc_score = max(npc_score, player_score - 20)
    
    # 判定结果
    if player_score > npc_score:
        result = "win"
        trust_change = 10
        narrative_tone = "得意地"
    elif player_score == npc_score:
        result = "tie"
        trust_change = 3
        narrative_tone = "勉强地"
    else:
        result = "lose"
        trust_change = -5
        narrative_tone = "不甘地"
    
    # NPC反应（基于剧本中莱因的性格：有负罪感、创伤、记忆混乱）
    npc_reactions = {
        "win": {
            "莱因": "「……你运气不错。」他把酒杯推给你，眼角的抽搐略微平复。\n「听好了——门后面，不是堡垒。是海。我听到了海浪声。还有一个声音在回响：'守住现在就够了……可门打开的时候，我看见的不是现在。'」",
            "萨洛": "老板摇摇头，从柜台下面摸出一张泛黄的传讯抄本。\n「这是堡垒失联前收到的最后一封。上面说——黑石脉冲频率在加快，像是某种倒计时。」",
            "森洛": "矮人摸了摸胡子，压低声音：「我在孢海深处听过一种梦声。不是幻觉——是真菌在唱歌。它知道黑石根区下面有什么。」",
        },
        "tie": {
            "莱因": "他盯着骰子看了很久，像是在看别的东西。\n「……平了。算你还有点本事。」他喝了口酒，语气松动了一些。\n「堡垒失联那天，我们收到了一个奇怪的命令——'不要开门'。但我们还是开了。」",
            "萨洛": "「啧，差一点。」萨洛收了骰子，「不过看在你没输的份上……最近有个伤兵（指了指角落里发抖的莱因），他说的话值得一听。」",
            "森洛": "「我们算是不分胜负。」森洛拍拍大腿，「不过说实话，我在意的不是输赢。你想知道孢海深处有什么？那条路我只走过三次。」",
        },
        "lose": {
            "莱因": "「哈……」他露出了复杂的神情，把骰子扫进杯中。\n「输了好。输的人不用背负那个。」但他还是在离开前丢下一句话：「别走正门。门后有东西等你们。」",
            "萨洛": "老板得意地收了赌注，「下次带够金币再来。」但他还是推过来一小杯麦酒，「免费——就当听故事的茶钱。」",
            "森洛": "「哈哈！我赢了！」矮人笑得胡子都在抖。但他还是递过来一小包药粉：「这是孢海解毒剂。带上，你会需要的。」",
        },
    }
    
    default_reaction = f"{state.npc_name}{narrative_tone}推过骰子杯。「有意思。」"
    npc_line = npc_reactions.get(result, {}).get(state.npc_name, default_reaction)
    
    # AI氛围组：D&D战斗般叙事骰子结果
    ai_narration = _generate_ai_dice_narration(
        state.dice, req.category, player_score, npc_score, result
    )
    
    state.game_over = True
    
    # 检查是否有信任key回调
    trust_update = None
    if state.npc_trust_key and state.npc_trust_key != "ly":
        trust_update = {
            "npc": state.npc_name,
            "key": state.npc_trust_key,
            "change": trust_change,
            "reason": f"快艇骰子{result}"
        }
    
    return {
        "result": result,
        "player_score": player_score,
        "npc_score": npc_score,
        "trust_change": trust_change,
        "ai_narration": ai_narration,
        "npc_reaction": npc_line,
        "bet_info": state.current_bet_info,
        "summary": _game_summary(state),
        "trust_update": trust_update,
    }


@router_poker.get("/{game_id}/state")
def get_game_state(game_id: str):
    state = _get_game(game_id)
    return _game_summary(state)


@router_poker.post("/ai-hint")
def get_ai_hint(req: AIHintRequest):
    """获取AI策略建议（单独调用）"""
    state = _get_game(req.game_id)
    available = get_available_categories(state)
    hint = get_ai_hint_text(state.dice, state.rerolls_left, available)
    return {"hint": hint}


@router_poker.post("/{game_id}/end")
def end_game(game_id: str):
    """强制结束游戏"""
    if game_id in _active_games:
        del _active_games[game_id]
    return {"status": "ok"}


# ============================================================
# AI氛围组：D&D风格骰子叙事生成
# ============================================================
def _generate_ai_dice_narration(dice: list[int], category: str, 
                                player_score: int, npc_score: int, 
                                result: str) -> str:
    """根据骰子结果和计分项，生成D&D战斗般的叙事描述"""
    
    dice_summary = describe_dice(dice)
    
    # 根据不同计分项生成特定叙事模板
    templates = {
        "快艇": [
            f"五个骰子完美地定格——全是相同的点数！{dice_summary}\n一声清脆的撞击，骰子杯被震得嗡嗡作响。{dice[0]}个骰子像被命运锁定般整齐排列，50分的【快艇】！整个酒馆安静了一瞬，连角落里的蜡烛火焰都似乎凝住了。",
        ],
        "大顺": [
            f"骰子像被无形之手排列——{dice_summary}\n2-3-4-5-6，完美的递增序列！40分的【大顺】。你仿佛看见命运的齿轮在骰子落下的瞬间精确咬合。",
        ],
        "小顺": [
            f"骰子滚动停止——{dice_summary}\n1到5的小顺，30分。虽然不是最完美的序列，但这份秩序在混乱的骰子碰撞中已经足够令人惊叹。",
        ],
        "四条": [
            f"骰子停住——{dice_summary}\n四个相同的数字在桌面上闪亮，像一支纪律严明的小队列阵。只剩下一个叛逆者落了单。",
        ],
        "葫芦": [
            f"骰子落定——{dice_summary}\n三条配一对，完美的葫芦组合。25分！像一支训练有素的雇佣兵小队：三人突击组加两人掩护组。",
        ],
        "三条": [
            f"桌面上——{dice_summary}\n三个骰子整齐一致，虽不完美但足够坚实。{player_score}分的三条，能赢下这一轮吗？",
        ],
    }
    
    # 根据result生成结果叙事
    result_lines = {
        "win": [
            f"「{player_score} 比 {npc_score}！」\n你赢了这一轮。骰子仿佛通灵一般回应着你的指尖。",
        ],
        "tie": [
            f"「{player_score} 对 {npc_score}！」\n势均力敌。骰子在桌面上沉默，两个灵魂在酒馆的昏暗光线中短暂对峙。",
        ],
        "lose": [
            f"「{player_score} 输给 {npc_score}。」\n骰子的神祇今天没有眷顾你。但在这幽暗地底，一次失败的赌博，也许是另一种命运的交汇。",
        ],
    }
    
    cat_narration = templates.get(category, [
        f"骰子落下——{dice_summary}。{category}，{player_score}分。"
    ])
    result_narration = result_lines.get(result, [f"得分：{player_score}"])
    
    import random
    return f"{random.choice(cat_narration)}\n\n{random.choice(result_narration)}"
