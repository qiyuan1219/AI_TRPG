"""D&D DM 服务"""
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
        r.attr = args.get("attribute", "")
        return r.to_dict() if hasattr(r, 'attr') else {**r.to_dict(), "属性": args.get("attribute","")}
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
    return {"error": f"未知: {name}"}


async def dm_chat_stream(
    user_input: str, game_state: dict,
    history: list[dict], recent_memory: list[str] = None,
) -> AsyncGenerator[str, None]:
    sp = build_system_prompt(game_state, recent_memory)
    messages = [{"role": "system", "content": sp}]
    messages.extend(history[-10:])
    messages.append({"role": "user", "content": user_input})

    for _ in range(2):
        acc_content = ""
        acc_tools = []

        stream = await client.chat.completions.create(
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
                                   "add_xp","complete_chapter")
                    is_state = tc["function"]["name"] in STATE_TOOLS
                    prefix = "[STATE:" if is_state else "[SYSTEM:"
                    yield f"{prefix}{tc['function']['name']}:{json.dumps(result, ensure_ascii=False)}]\n"
                    messages.append({"role":"tool","tool_call_id":tc["id"],
                                     "content": json.dumps(result, ensure_ascii=False)})
                except: pass
            continue
        return

    final = await client.chat.completions.create(
        model=LLM_MODEL,
        messages=messages + [{"role":"user","content":"继续叙事，不要调用函数。"}],
        temperature=0.7, max_tokens=768, stream=True,
    )
    async for chunk in final:
        d = chunk.choices[0].delta if chunk.choices else None
        if d and d.content: yield d.content


async def dm_narrate_stream(prompt: str, state: dict) -> AsyncGenerator[str, None]:
    sp = build_system_prompt(state)
    stream = await client.chat.completions.create(
        model=LLM_MODEL,
        messages=[{"role":"system","content":sp},{"role":"user","content":prompt}],
        temperature=0.7, max_tokens=1024, stream=True,
    )
    async for chunk in stream:
        d = chunk.choices[0].delta if chunk.choices else None
        if d and d.content: yield d.content
