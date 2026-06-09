"""D&D DM 服务"""
import asyncio
import json
from typing import AsyncGenerator
from openai import AsyncOpenAI
from config import LLM_API_KEY, LLM_BASE_URL, LLM_MODEL
from engine.rules_dnd import (
    skill_check, attack_roll, death_save,
    roll_dice, modifier, PROFICIENCY_BONUS,
)
from kp.prompt_builder_dnd import build_system_prompt

client = AsyncOpenAI(api_key=LLM_API_KEY, base_url=LLM_BASE_URL)
LLM_MAX_ATTEMPTS = 3
LLM_RETRY_DELAY = 0.8


async def _create_chat_completion(**kwargs):
    last_error = None
    for attempt in range(LLM_MAX_ATTEMPTS):
        try:
            return await client.chat.completions.create(**kwargs)
        except Exception as error:
            last_error = error
            if attempt >= LLM_MAX_ATTEMPTS - 1:
                break
            await asyncio.sleep(LLM_RETRY_DELAY * (attempt + 1))
    raise last_error

TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "attack_roll",
            "description": "执行攻击检定",
            "parameters": {
                "type": "object",
                "properties": {
                    "weapon": {"type": "string"},
                    "stat_mod": {"type": "integer", "description": "STR或DEX调整值"},
                    "prof_bonus": {"type": "integer", "description": "熟练加值"},
                    "target_ac": {"type": "integer"},
                    "damage_dice": {"type": "string"},
                    "dmg_mod": {"type": "integer"},
                },
                "required": ["weapon", "stat_mod", "target_ac", "damage_dice"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "skill_check",
            "description": "执行技能检定",
            "parameters": {
                "type": "object",
                "properties": {
                    "attribute": {"type": "string"},
                    "stat_mod": {"type": "integer"},
                    "prof_bonus": {"type": "integer"},
                    "dc": {"type": "integer"},
                },
                "required": ["attribute", "stat_mod", "dc"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "roll_dice_tool",
            "description": "直接掷骰",
            "parameters": {
                "type": "object",
                "properties": {
                    "dice_str": {"type": "string"},
                    "reason": {"type": "string"},
                },
                "required": ["dice_str", "reason"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "update_gold",
            "description": "玩家花费或获得金币。花费填负数，获得填正数。涉及钱财交易时必须调用此函数",
            "parameters": {
                "type": "object",
                "properties": {
                    "amount": {"type": "integer", "description": "金币变化量，正数获得，负数花费"},
                    "reason": {"type": "string", "description": "花费原因：如注册费、购买装备、赏金等"},
                },
                "required": ["amount", "reason"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "update_inventory",
            "description": "玩家获得或失去物品。获得用add，失去用remove",
            "parameters": {
                "type": "object",
                "properties": {
                    "action": {"type": "string", "enum": ["add", "remove"]},
                    "item": {"type": "string", "description": "物品名称"},
                },
                "required": ["action", "item"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "update_hp",
            "description": "玩家受到伤害或恢复HP。伤害填负数，恢复填正数",
            "parameters": {
                "type": "object",
                "properties": {
                    "amount": {"type": "integer", "description": "HP变化量"},
                    "reason": {"type": "string"},
                },
                "required": ["amount", "reason"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "update_trust",
            "description": "改变同伴信任值。NPC名: 格鲁姆/丽莎/塔莉亚/伊瑟拉",
            "parameters": {
                "type": "object",
                "properties": {
                    "npc": {"type": "string", "description": "NPC名称"},
                    "amount": {"type": "integer", "description": "信任变化量, 正增负减"},
                    "reason": {"type": "string", "description": "变化原因"},
                },
                "required": ["npc", "amount", "reason"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "update_area",
            "description": "切换场景。玩家移动到新地点时必须调用。可用区域: 王冠城/B1废弃圣堂/B2幽暗书库/B3囚徒迷宫/B4皇家墓穴/B5碎冠圣所",
            "parameters": {
                "type": "object",
                "properties": {
                    "area": {"type": "string", "description": "目标区域"},
                    "reason": {"type": "string"},
                },
                "required": ["area", "reason"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "level_up",
            "description": "玩家升级。击败Boss后调用。HP上限提升, HP回满",
            "parameters": {
                "type": "object",
                "properties": {
                    "reason": {"type": "string", "description": "升级原因"},
                },
                "required": ["reason"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "update_npc_hp",
            "description": "同伴NPC受伤或恢复HP。NPC名: 格鲁姆/丽莎/塔莉亚",
            "parameters": {
                "type": "object",
                "properties": {
                    "npc": {"type": "string", "description": "NPC名称"},
                    "amount": {"type": "integer", "description": "HP变化量, 正增负减"},
                    "reason": {"type": "string"},
                },
                "required": ["npc", "amount", "reason"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "update_attribute",
            "description": "改变玩家属性值(诅咒/祝福)。谨慎使用, 每次最多+-2",
            "parameters": {
                "type": "object",
                "properties": {
                    "attr": {"type": "string", "description": "属性名: str/dex/con/int/wis/cha"},
                    "amount": {"type": "integer", "description": "变化量, -2到+2"},
                    "reason": {"type": "string"},
                },
                "required": ["attr", "amount", "reason"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "add_xp",
            "description": "玩家获得经验值。击败敌人/完成任务时调用",
            "parameters": {
                "type": "object",
                "properties": {
                    "amount": {"type": "integer", "description": "XP数量"},
                    "reason": {"type": "string"},
                },
                "required": ["amount", "reason"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "complete_chapter",
            "description": "标记地城层次完成, 解锁下一层",
            "parameters": {
                "type": "object",
                "properties": {
                    "reason": {"type": "string"},
                },
                "required": ["reason"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "trigger_event",
            "description": "触发特定剧情事件(如龙血觉醒、丽莎复仇等), 仅记录不修改数值",
            "parameters": {
                "type": "object",
                "properties": {
                    "event_name": {"type": "string", "description": "事件名: 龙血觉醒/丽莎复仇/格鲁姆债主/盲眼修女/公主赏赐"},
                },
                "required": ["event_name"]
            }
        }
    }
]


def execute_tool(name: str, args: dict) -> dict:
    if name == "attack_roll":
        r = attack_roll(args["weapon"], args["stat_mod"],
                        args.get("prof_bonus", 2), args["target_ac"],
                        args["damage_dice"], args.get("dmg_mod", 0))
        return r.to_dict()
    elif name == "skill_check":
        r = skill_check(args["stat_mod"], args.get("prof_bonus", 2), args["dc"])
        return {**r.to_dict(), "属性": args.get("attribute", "")}
    elif name == "roll_dice_tool":
        return {"骰子": args["dice_str"], "结果": roll_dice(args["dice_str"])}
    elif name == "update_gold":
        return {"action": "gold", "amount": args["amount"], "reason": args["reason"]}
    elif name == "update_inventory":
        return {"action": "inventory", "op": args["action"], "item": args["item"]}
    elif name == "update_hp":
        return {"action": "hp", "amount": args["amount"], "reason": args["reason"]}
    elif name == "update_trust":
        return {"action": "trust", "npc": args["npc"], "amount": args["amount"], "reason": args["reason"]}
    elif name == "update_area":
        return {"action": "area", "area": args["area"], "reason": args["reason"]}
    elif name == "level_up":
        return {"action": "level_up", "reason": args["reason"]}
    elif name == "update_npc_hp":
        return {"action": "npc_hp", "npc": args["npc"], "amount": args["amount"], "reason": args["reason"]}
    elif name == "update_attribute":
        return {"action": "attribute", "attr": args["attr"], "amount": args["amount"], "reason": args["reason"]}
    elif name == "add_xp":
        return {"action": "xp", "amount": args["amount"], "reason": args["reason"]}
    elif name == "complete_chapter":
        return {"action": "complete_chapter", "reason": args["reason"]}
    elif name == "trigger_event":
        return {"action": "trigger_event", "event_name": args["event_name"]}
    return {"error": f"未知: {name}"}


async def dm_chat_stream(
    user_input: str, game_state: dict,
    history: list[dict], recent_memory: list[str] = None,
) -> AsyncGenerator[str, None]:
    sp = build_system_prompt(game_state, recent_memory)
    messages = [{"role": "system", "content": sp}]
    messages.extend(history[-20:])
    messages.append({"role": "user", "content": user_input})

    for _ in range(2):
        acc_content = ""
        acc_tools = []

        stream = await _create_chat_completion(
            model=LLM_MODEL, messages=messages, tools=TOOLS,
            tool_choice="auto", temperature=0.7, max_tokens=1024, stream=True,
        )
        async for chunk in stream:
            d = chunk.choices[0].delta if chunk.choices else None
            if not d: continue
            if d.content:
                acc_content += d.content
                yield d.content
            if d.tool_calls:
                for tc in d.tool_calls:
                    while len(acc_tools) <= tc.index:
                        acc_tools.append({"id":"","type":"function","function":{"name":"","arguments":""}})
                    if tc.id: acc_tools[tc.index]["id"] = tc.id
                    if tc.function:
                        if tc.function.name: acc_tools[tc.index]["function"]["name"] += tc.function.name
                        if tc.function.arguments: acc_tools[tc.index]["function"]["arguments"] += tc.function.arguments

        if acc_tools:
            messages.append({"role":"assistant","content":acc_content or None,"tool_calls":acc_tools})
            for tc in acc_tools:
                try:
                    fn_args = json.loads(tc["function"]["arguments"])
                    result = execute_tool(tc["function"]["name"], fn_args)
                    # 状态变更用 STATE 前缀，检定掷骰用 SYSTEM 前缀
                    STATE_TOOLS = ("update_gold","update_inventory","update_hp","update_trust",
                                   "update_area","level_up","update_npc_hp","update_attribute",
                                   "add_xp","complete_chapter","trigger_event")
                    is_state = tc["function"]["name"] in STATE_TOOLS
                    prefix = "[STATE:" if is_state else "[SYSTEM:"
                    yield f"{prefix}{tc['function']['name']}:{json.dumps(result, ensure_ascii=False)}]\n"
                    messages.append({"role":"tool","tool_call_id":tc["id"],
                                     "content": json.dumps(result, ensure_ascii=False)})
                except json.JSONDecodeError as e:
                    err_info = {"error": "JSON解析失败", "args": tc["function"]["arguments"][:100], "detail": str(e)}
                    yield f"[SYSTEM:error:{json.dumps(err_info, ensure_ascii=False)}]\n"
                    messages.append({"role":"tool","tool_call_id":tc["id"],
                                     "content": json.dumps(err_info, ensure_ascii=False)})
                except Exception as e:
                    err_info = {"error": f"工具执行失败: {tc['function']['name']}", "detail": str(e)}
                    yield f"[SYSTEM:error:{json.dumps(err_info, ensure_ascii=False)}]\n"
                    messages.append({"role":"tool","tool_call_id":tc["id"],
                                     "content": json.dumps(err_info, ensure_ascii=False)})
            continue
        return

    final = await _create_chat_completion(
        model=LLM_MODEL,
        messages=messages + [{"role":"user","content":"继续叙事，不要调用函数。"}],
        temperature=0.7, max_tokens=768, stream=True,
    )
    async for chunk in final:
        d = chunk.choices[0].delta if chunk.choices else None
        if d and d.content: yield d.content


async def dm_narrate_stream(prompt: str, state: dict) -> AsyncGenerator[str, None]:
    sp = build_system_prompt(state)
    stream = await _create_chat_completion(
        model=LLM_MODEL,
        messages=[{"role":"system","content":sp},{"role":"user","content":prompt}],
        temperature=0.7, max_tokens=1024, stream=True,
    )
    async for chunk in stream:
        d = chunk.choices[0].delta if chunk.choices else None
        if d and d.content: yield d.content


def _fallback_companion_feedback(event: dict, state: dict, choice: dict) -> str:
    companion = event["companion"]["name"]
    trust_band = state.get("trust_band", "正常")
    if state.get("completed"):
        return (
            f"{state.get('result_text') or '危机暂时解除。'}\n\n"
            f"{companion}把铁锅往身后一背，看了你一眼：“记住刚才脚下的声音。"
            f"孢海不是故意吓你，它只是照自己的方式活着。你现在和我的关系是：{trust_band}。”"
        )
    return (
        f"你选择了“{choice.get('label', '行动')}”。菌林深处的呼救声忽远忽近，污染藤蔓开始收紧。\n\n"
        f"{companion}低声提醒：“别只听声音，看它重复的位置。活路通常藏在规律里。”"
    )


def sanitize_companion_side_event_text(text: str) -> str:
    """Keep AI side-event replies suitable for the in-game dialogue box."""
    cleaned_lines: list[str] = []
    banned_prefixes = (
        "KP视角",
        "KP 视角",
        "布洛克·铁锅",
        "布洛克",
        "同伴回应",
        "末结算提示",
        "结算提示",
        "奖励提示",
        "引导",
    )
    for raw_line in (text or "").replace("\r\n", "\n").split("\n"):
        line = raw_line.strip()
        if not line:
            if cleaned_lines and cleaned_lines[-1]:
                cleaned_lines.append("")
            continue
        line = line.strip("*#- \t")
        for prefix in banned_prefixes:
            if line.startswith(prefix):
                _, sep, tail = line.partition("：")
                if not sep:
                    _, sep, tail = line.partition(":")
                line = tail.strip() if sep else line
                break
        line = line.strip("*#- \t")
        if line:
            cleaned_lines.append(line)

    cleaned = "\n".join(cleaned_lines).strip()
    while "\n\n\n" in cleaned:
        cleaned = cleaned.replace("\n\n\n", "\n\n")
    return cleaned


async def companion_side_event_feedback(
    event: dict,
    state: dict,
    choice: dict,
    roll: dict | None,
    phase_note: str,
) -> str:
    companion = event["companion"]["name"]
    roll_text = "无检定"
    if roll:
        roll_text = (
            f"{roll.get('检定')}：{roll.get('掷骰')}，加值 {roll.get('加值')}，"
            f"总计 {roll.get('总计')} vs DC{roll.get('DC')}，"
            f"{'成功' if roll.get('成功') else '失败'}"
        )

    prompt = f"""
你是《地心之门》第一幕同伴支线的 AI 主持人。
当前支线：{event['title']}
地点：{event['location']}
同伴：{companion}
同伴说话风格：粗硬、生态专家、会把危险和食物放在一起讲；不是冷血，他保护生态也保护队伍。
玩家选择：{choice.get('label')} - {choice.get('text')}
检定结果：{roll_text}
当前状态：信任值 {state.get('trust')}（{state.get('trust_band')}），威胁 {state.get('threat')}/{state.get('max_threat')}，孢子污染 {state.get('contamination')}
结算说明：{phase_note}
获得奖励：{', '.join(state.get('rewards') or []) or '暂无'}
已发生标记：{', '.join(state.get('flags') or []) or '暂无'}

请输出 2-3 段可直接放进游戏文本框的中文反馈。
严格格式要求：
1. 只写正文，不要写 Markdown，不要加粗，不要项目符号。
2. 不要出现“KP视角”“布洛克·铁锅（信任值...）”“末结算提示”“奖励提示”等标题或调试说明。
3. 第一段写场面变化，第二段自然写出布洛克的反应或台词。
4. 如果支线已结算，可以在正文里自然提到奖励或代价；如果未结算，只用剧情语气引导继续处理危机。
5. 不要提前揭示：{'; '.join(event.get('forbidden') or [])}
"""
    fallback = _fallback_companion_feedback(event, state, choice)
    try:
        completion = await _create_chat_completion(
            model=LLM_MODEL,
            messages=[
                {"role": "system", "content": "你是中文 TRPG AI 主持人，回复要短、可直接显示在游戏 UI 中。"},
                {"role": "user", "content": prompt},
            ],
            temperature=0.75,
            max_tokens=520,
            stream=False,
        )
        content = completion.choices[0].message.content if completion.choices else ""
        return sanitize_companion_side_event_text(content) or fallback
    except Exception:
        return fallback


async def companion_side_event_chat(
    event: dict,
    state: dict,
    message: str,
    history: list[dict] | None = None,
) -> str:
    companion = event["companion"]["name"]
    history_text = json.dumps(history or [], ensure_ascii=False)
    prompt = f"""
你正在扮演《地心之门》第一幕同伴支线结束后的自由对话 NPC：{companion}。
当前支线：{event['title']}
地点：{event['location']}
当前信任值：{state.get('trust')}（{state.get('trust_band')}）
支线结果：{state.get('result_title')} / {state.get('result_text')}
奖励：{', '.join(state.get('rewards') or []) or '暂无'}
可聊范围：{'; '.join(event.get('chat_topics') or [])}
禁止提前回答：{'; '.join(event.get('forbidden') or [])}
历史对话：{history_text}
玩家问：{message}

请只以“布洛克”的口吻回答，1-3 段中文。信任值越高，他越愿意解释生态细节和私人情绪；信任值低则更短、更粗硬。
严格格式要求：只写布洛克会说出口的话，不要写 Markdown，不要写“布洛克：”“KP视角”“旁白”“末结算提示”等标题。
如果玩家问到禁止内容，请自然回避，并把话题拉回回声菌林、孢海生态或后续骨柱湿地风险。
"""
    fallback = "布洛克哼了一声：“这个问题先放着。你要是真想活到骨柱湿地，就先记住：会发光的不一定安全，会喊救命的也不一定是人。”"
    try:
        completion = await _create_chat_completion(
            model=LLM_MODEL,
            messages=[
                {"role": "system", "content": "你只扮演布洛克·铁锅，不要跳出角色。"},
                {"role": "user", "content": prompt},
            ],
            temperature=0.8,
            max_tokens=460,
            stream=False,
        )
        content = completion.choices[0].message.content if completion.choices else ""
        return sanitize_companion_side_event_text(content) or fallback
    except Exception:
        return fallback


def _fallback_bargain_judgement(
    item_name: str,
    base_price: int,
    current_price: int,
    attempt: int,
    max_attempts: int,
    total: int,
    player_words: str,
) -> dict:
    patience_lost = attempt >= max_attempts
    word_score = min(4, max(0, len(player_words.strip()) // 18))
    effective_total = total + word_score
    floor_price = max(1, round(base_price * 0.55))

    if patience_lost:
        agreed = False
        discount = 0
        mood = "不耐烦"
    elif effective_total >= 22:
        agreed = True
        discount = max(1, round(current_price * 0.16))
        mood = "被打动"
    elif effective_total >= 17:
        agreed = True
        discount = max(1, round(current_price * 0.1))
        mood = "松口"
    elif effective_total >= 13 and "老主顾" in player_words:
        agreed = True
        discount = max(1, round(current_price * 0.06))
        mood = "试探"
    else:
        agreed = False
        discount = 0
        mood = "戒备"

    discount = min(discount, max(0, current_price - floor_price))
    new_price = current_price - discount
    if discount <= 0:
        agreed = False
        new_price = current_price

    boss_reply = (
        f"老板：「{item_name}不是地摊上的破铜烂铁。你这话我听着还算顺耳，"
        f"骰点也没让我觉得你在浪费时间。"
        f"{'我给你抹掉 ' + str(discount) + ' 金，' if agreed else '但这个价我不点头，'}"
        f"现在就是 {new_price} 金。再磨下去，我的耐心可比这盏黑油灯烧得快。」"
    )

    return {
        "agreed": agreed,
        "discount": discount,
        "new_price": new_price,
        "mood": mood,
        "reason": "根据骰点、话术长度和老板耐心进行兜底判定。",
        "boss_reply": boss_reply,
    }


async def judge_black_market_bargain(
    item_name: str,
    base_price: int,
    current_price: int,
    attempt: int,
    max_attempts: int,
    roll: int,
    bonus: int,
    total: int,
    player_words: str,
    history: list[dict] | None = None,
) -> dict:
    floor_price = max(1, round(base_price * 0.55))
    max_single_discount = max(1, round(current_price * 0.18))
    remaining_discount = max(0, current_price - floor_price)

    prompt = f"""
你是逆穹城黑市老板“萨洛·杯底”的地下同行，一名谨慎、会算账、嘴硬但懂人情的老板。
玩家正在购买：{item_name}
原价：{base_price} 金
当前报价：{current_price} 金
最低心理价：{floor_price} 金
这是第 {attempt}/{max_attempts} 次讲价。
玩家说的话：{player_words}
讲价判定：D20={roll}，加值={bonus}，总计={total}
历史：{json.dumps(history or [], ensure_ascii=False)}

请判断老板是否同意本轮降价。主要影响因素是：
1. 判定总计越高越容易降价。
2. 玩家话语越具体、越能打动老板、越符合黑市处境，越容易降价。
3. 空泛、威胁、白嫖、侮辱老板会失败。
4. 第 {max_attempts} 次后老板耐心耗尽，不再同意降价。
5. 本轮降价不能超过 {max_single_discount} 金，最终价格不能低于 {floor_price} 金。

必须只输出 JSON，不要输出解释文本。JSON 字段：
agreed: boolean
discount: integer
new_price: integer
mood: string
reason: string
boss_reply: string

boss_reply 必须是老板第一人称台词，60-140个中文字符，无论成功或失败都必须有老板视角回复。
"""
    fallback = _fallback_bargain_judgement(
        item_name, base_price, current_price, attempt, max_attempts, total, player_words,
    )

    try:
        completion = await _create_chat_completion(
            model=LLM_MODEL,
            messages=[
                {"role": "system", "content": "你只输出严格 JSON。"},
                {"role": "user", "content": prompt},
            ],
            temperature=0.75,
            max_tokens=420,
            stream=False,
        )
        raw = completion.choices[0].message.content if completion.choices else ""
        data = json.loads((raw or "").strip())
    except Exception:
        data = fallback

    agreed = bool(data.get("agreed"))
    discount = int(data.get("discount") or 0)
    if attempt >= max_attempts:
        agreed = False
        discount = 0

    discount = max(0, min(discount, max_single_discount, remaining_discount))
    if discount <= 0:
        agreed = False

    new_price = current_price - discount if agreed else current_price
    if new_price < floor_price:
        new_price = floor_price
        discount = current_price - new_price

    boss_reply = str(data.get("boss_reply") or fallback["boss_reply"]).strip()
    if not boss_reply:
        boss_reply = fallback["boss_reply"]

    return {
        "agreed": agreed,
        "discount": discount,
        "new_price": new_price,
        "mood": str(data.get("mood") or fallback["mood"]),
        "reason": str(data.get("reason") or fallback["reason"]),
        "boss_reply": boss_reply,
    }
