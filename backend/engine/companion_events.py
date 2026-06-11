"""Companion side-event runtime for Act 1 tests."""
from __future__ import annotations

from copy import deepcopy

from engine.rules_dnd import skill_check


def _choice(
    choice_id: str,
    label: str,
    text: str,
    trust: int,
    *,
    check: dict | None = None,
    threat: int = 0,
    success_threat: int = 0,
    failure_threat: int = 0,
    contamination: int = 0,
    success_contamination: int = 0,
    failure_contamination: int = 0,
    flags: list[str] | None = None,
    blocks_rewards: list[str] | None = None,
    starts_battle: bool = False,
) -> dict:
    return {
        "id": choice_id,
        "label": label,
        "text": text,
        "trust": trust,
        "check": check,
        "threat": threat,
        "success_threat": success_threat,
        "failure_threat": failure_threat,
        "contamination": contamination,
        "success_contamination": success_contamination,
        "failure_contamination": failure_contamination,
        "flags": flags or [],
        "blocks_rewards": blocks_rewards or [],
        "starts_battle": starts_battle,
    }


SIDE_EVENT_DEFINITIONS: dict[str, dict] = {
    "block_echo_forest": {
        "id": "block_echo_forest",
        "companion": {
            "id": "block",
            "name": "布洛克·铁锅",
            "trust_key": "trust_block",
            "portrait": "锅",
        },
        "title": "回声菌林的求救声",
        "location": "回声菌林",
        "eyebrow": "同伴支线 / 第一幕",
        "summary": "孢海生态、异常菌脉、解毒与生存判断。玩家需要在拟声诱捕和污染菌核之间做出判断。",
        "opening": (
            "前线废弃据点后方的窄路渐渐被蓝白荧光吞没。菌盖像倒挂的耳朵一样层叠，"
            "远处传来断断续续的呼救声。布洛克停下脚步，把铁锅从背上放低，声音压得很沉："
            "“别急着跑。会学人喊救命的东西，通常不急着让你活。”"
        ),
        "objectives": [
            "判断回声菌林是真正求救、拟声诱捕，还是污染扩散。",
            "保护健康菌林，找出污染菌核。",
            "在污染藤蔓和拟声孢群的攻击中稳住队伍。",
            "根据玩家是否尊重布洛克的生态判断结算信任和奖励。",
        ],
        "free_chat_prompt": "布洛克把锅架在干净石头上，低声骂着什么，又小心地把健康菌丝收进样本袋。",
        "chat_topics": [
            "回声菌林为什么会模仿人声",
            "为什么不能直接烧掉菌林",
            "孢海生态有没有善恶",
            "布洛克为什么总把危险和食物放在一起讲",
            "骨柱湿地可能有什么风险",
        ],
        "forbidden": [
            "黑暗之门后方具体是什么",
            "地下海洋反转",
            "第二幕之后路线",
            "布洛克尚未公开的完整个人秘密",
        ],
        "initial_state": {
            "phase": "opening",
            "trust": 55,
            "threat": 12,
            "max_threat": 12,
            "contamination": 0,
            "round": 0,
            "flags": [],
            "blocked_rewards": [],
            "rewards": [],
            "completed": False,
            "result_title": "",
            "result_text": "",
            "last_choice": None,
            "last_roll": None,
            "battle_log": [],
            "pending_battle": None,
            "battle_result": None,
        },
        "opening_choices": [
            _choice(
                "observe_echo",
                "先观察回声规律",
                "听布洛克解释，让队伍停下，分辨呼救声和菌林回声的重复间隔。",
                8,
                check={"label": "生存 / 感知", "stat_mod": 2, "prof_bonus": 2, "dc": 12},
                success_threat=-3,
                failure_contamination=1,
                flags=["识别回声规律", "尊重生态判断"],
            ),
            _choice(
                "purify_sample",
                "协助采样配置净化粉",
                "帮布洛克刮取健康菌丝和污染粉末，尝试提前配出净化粉。",
                10,
                check={"label": "自然 / 医药", "stat_mod": 2, "prof_bonus": 2, "dc": 14},
                success_threat=-4,
                failure_threat=-1,
                failure_contamination=1,
                flags=["协助采样", "净化粉就绪", "尊重生态判断"],
            ),
            _choice(
                "allow_but_impatient",
                "催他快点但允许判断",
                "提醒布洛克别拖太久，但仍把开路判断交给他。",
                3,
                threat=-1,
                flags=["勉强等待"],
            ),
            _choice(
                "burn_path",
                "直接用火烧开道路",
                "快速烧出一条路，牺牲部分健康菌林换取推进速度。",
                -10,
                threat=-5,
                contamination=1,
                flags=["大规模用火"],
                blocks_rewards=["暖孢浓汤", "回声菌粉"],
            ),
            _choice(
                "rush_voice",
                "立刻冲向呼救声",
                "不管声音真假，先冲过去救人。",
                -6,
                threat=2,
                contamination=1,
                flags=["触发菌丝伏击"],
            ),
            _choice(
                "ask_team_tactics",
                "让其他同伴从战斗角度判断",
                "先听其他同伴的阵型和火力建议，再决定是否采纳布洛克的生态判断。",
                2,
                check={"label": "洞察 / 指挥", "stat_mod": 1, "prof_bonus": 2, "dc": 13},
                success_threat=-2,
                flags=["队伍互动", "尊重生态判断"],
            ),
        ],
        "crisis_choices": [
            _choice(
                "enter_battle",
                "正面清剿污染菌核",
                "让布洛克锁定污染菌核，你带队正面迎击拟声孢群和污染藤蔓。",
                2,
                threat=-2,
                flags=["准备清剿污染菌核"],
                starts_battle=True,
            ),
            _choice(
                "protect_block",
                "保护布洛克净化菌核",
                "让布洛克靠近污染菌核，你负责挡住拟声孢群和藤蔓。",
                4,
                check={"label": "力量护卫", "stat_mod": 3, "prof_bonus": 2, "dc": 14},
                success_threat=-5,
                failure_threat=-2,
                failure_contamination=1,
                flags=["保护净化"],
            ),
            _choice(
                "drive_spores",
                "驱赶拟声孢群",
                "用武器和脚步逼退会模仿人声的孢群，不让它们分散队伍。",
                1,
                check={"label": "攻击压制", "stat_mod": 3, "prof_bonus": 2, "dc": 13},
                success_threat=-4,
                failure_threat=-1,
            ),
            _choice(
                "cut_vines",
                "斩断污染藤蔓",
                "优先清理缠住腿甲和背包的菌丝藤蔓，避免队伍被拖进孢粉深处。",
                0,
                check={"label": "敏捷 / 武器", "stat_mod": 1, "prof_bonus": 2, "dc": 12},
                success_threat=-3,
                failure_contamination=1,
            ),
            _choice(
                "controlled_fire",
                "小范围控火逼退",
                "只烧污染藤蔓边缘，尽量不点燃健康菌林。",
                -2,
                check={"label": "奥秘 / 控火", "stat_mod": 0, "prof_bonus": 2, "dc": 15},
                success_threat=-6,
                failure_threat=-3,
                failure_contamination=1,
                flags=["小范围控火"],
            ),
        ],
    },
}


def create_side_event_session(event_id: str = "block_echo_forest", initial_trust: int | None = None) -> dict:
    event = SIDE_EVENT_DEFINITIONS[event_id]
    state = deepcopy(event["initial_state"])
    if initial_trust is not None:
        state["trust"] = _clamp(initial_trust, 0, 100)
    return state


def get_event_public_data(event_id: str) -> dict:
    event = SIDE_EVENT_DEFINITIONS[event_id]
    return {
        "id": event["id"],
        "companion": event["companion"],
        "title": event["title"],
        "location": event["location"],
        "eyebrow": event["eyebrow"],
        "summary": event["summary"],
        "opening": event["opening"],
        "objectives": event["objectives"],
        "free_chat_prompt": event["free_chat_prompt"],
        "chat_topics": event["chat_topics"],
    }


def get_available_choices(event_id: str, state: dict) -> list[dict]:
    event = SIDE_EVENT_DEFINITIONS[event_id]
    if state["phase"] == "opening":
        choices = event["opening_choices"]
    elif state["phase"] == "crisis":
        choices = event["crisis_choices"]
    else:
        choices = []
    return [_public_choice(choice) for choice in choices]


def resolve_side_event_choice(event_id: str, state: dict, choice_id: str) -> dict:
    event = SIDE_EVENT_DEFINITIONS[event_id]
    choices = event["opening_choices"] if state["phase"] == "opening" else event["crisis_choices"]
    choice = next((item for item in choices if item["id"] == choice_id), None)
    if not choice:
        raise ValueError("无效的支线选择")

    roll = _resolve_roll(choice)
    success = roll["成功"] if roll else None
    trust_before = state["trust"]
    threat_before = state["threat"]
    contamination_before = state["contamination"]

    state["trust"] = _clamp(state["trust"] + choice["trust"], 0, 100)
    state["threat"] = _clamp(state["threat"] + choice["threat"], 0, state["max_threat"] + 4)
    state["contamination"] = max(0, state["contamination"] + choice["contamination"])

    if roll:
        if success:
            state["threat"] = _clamp(state["threat"] + choice["success_threat"], 0, state["max_threat"] + 4)
            state["contamination"] = max(0, state["contamination"] + choice["success_contamination"])
        else:
            state["threat"] = _clamp(state["threat"] + choice["failure_threat"], 0, state["max_threat"] + 4)
            state["contamination"] = max(0, state["contamination"] + choice["failure_contamination"])

    for flag in choice["flags"]:
        if flag not in state["flags"]:
            state["flags"].append(flag)
    for reward in choice["blocks_rewards"]:
        if reward not in state["blocked_rewards"]:
            state["blocked_rewards"].append(reward)

    if choice.get("starts_battle"):
        phase_note = _queue_side_event_battle(state)
    elif state["phase"] == "opening":
        state["phase"] = "crisis"
        phase_note = "支线进入危机战斗：污染藤蔓开始收紧，拟声孢群从菌盖后方滑出。"
    else:
        state["round"] += 1
        phase_note = "危机战斗继续。"

    if state["phase"] == "crisis" and (state["threat"] <= 0 or state["round"] >= 3):
        phase_note = _queue_side_event_battle(state)

    state["last_choice"] = _public_choice(choice)
    state["last_roll"] = roll
    state["battle_log"].append({
        "choice": choice["label"],
        "roll": roll,
        "trust_delta": state["trust"] - trust_before,
        "threat_delta": state["threat"] - threat_before,
        "contamination_delta": state["contamination"] - contamination_before,
        "note": phase_note,
    })

    return {
        "choice": _public_choice(choice),
        "roll": roll,
        "success": success,
        "phase_note": phase_note,
        "state": state,
    }


def resolve_side_event_battle_result(event_id: str, state: dict, result: str) -> dict:
    event = SIDE_EVENT_DEFINITIONS[event_id]
    if state.get("phase") != "battle_pending":
        raise ValueError("当前支线没有等待结算的战斗")

    normalized = result.strip().lower()
    if normalized not in {"win", "lose"}:
        raise ValueError("无效的支线战斗结果")

    trust_before = state["trust"]
    threat_before = state["threat"]
    contamination_before = state["contamination"]

    state["pending_battle"] = None
    state["battle_result"] = normalized

    if normalized == "win":
        state["trust"] = _clamp(state["trust"] + 8, 0, 100)
        state["threat"] = 0
        for flag in ["击败污染菌核", "保护净化"]:
            if flag not in state["flags"]:
                state["flags"].append(flag)
        phase_note = "污染菌核被压制，布洛克获得了净化菌林的窗口。"
    else:
        state["trust"] = _clamp(state["trust"] - 5, 0, 100)
        state["threat"] = 0
        state["contamination"] = max(0, state["contamination"] + 2)
        if "支线战斗失利" not in state["flags"]:
            state["flags"].append("支线战斗失利")
        phase_note = "队伍被孢粉逼退，布洛克勉强救场，但污染已经加重。"

    _complete_event(event, state)
    if normalized == "win":
        state["result_title"] = "击败污染菌核"
        state["result_text"] = "污染菌核被压制，回声渐渐恢复为自然的重复声。布洛克抓住窗口完成净化，低声承认你们这次配合得不错。"
    else:
        state["result_title"] = "孢粉中脱险"
        state["result_text"] = "拟声孢群被暂时逼退，但队伍吸入了过量孢粉。布洛克把你们拖出污染圈，语气粗硬地提醒下次别让菌核拖进节奏。"

    state["battle_log"].append({
        "choice": "支线战斗",
        "roll": None,
        "trust_delta": state["trust"] - trust_before,
        "threat_delta": state["threat"] - threat_before,
        "contamination_delta": state["contamination"] - contamination_before,
        "note": phase_note,
        "battle_result": normalized,
    })

    return {
        "result": normalized,
        "phase_note": state["result_text"],
        "state": state,
    }


def snapshot_side_event(event_id: str, state: dict) -> dict:
    return {
        **state,
        "trust_band": _trust_band(state["trust"]),
        "choices": get_available_choices(event_id, state),
    }


def _resolve_roll(choice: dict) -> dict | None:
    check = choice.get("check")
    if not check:
        return None
    result = skill_check(check["stat_mod"], check.get("prof_bonus", 0), check["dc"]).to_dict()
    return {
        **result,
        "检定": check["label"],
        "id": f"side-event-{choice['id']}",
    }


def _complete_event(event: dict, state: dict) -> None:
    if state["completed"]:
        return

    rewards = []
    flags = set(state["flags"])
    blocked = set(state["blocked_rewards"])

    if "暖孢浓汤" not in blocked and "尊重生态判断" in flags and state["contamination"] <= 1:
        rewards.append("暖孢浓汤")
    if {"协助采样", "净化粉就绪"} & flags or "识别回声规律" in flags:
        rewards.append("铁锅解毒丸")
    if state["trust"] >= 70 and "净化粉就绪" in flags and "回声菌粉" not in blocked:
        rewards.append("回声菌粉")

    if not rewards and state["contamination"] <= 2:
        rewards.append("少量安全菌丝样本")

    state["phase"] = "dialogue"
    state["completed"] = True
    state["rewards"] = rewards

    if state["contamination"] >= 3:
        state["result_title"] = "带着孢粉脱险"
        state["result_text"] = "队伍击退了污染菌核，但吸入了过量孢粉。布洛克会救场，却对鲁莽选择很不满意。"
    elif "大规模用火" in flags:
        state["result_title"] = "烧开的道路"
        state["result_text"] = "火焰逼退了拟声孢群，也烧坏了健康菌林。道路打开了，布洛克的沉默比责备更重。"
    elif state["trust"] >= 70:
        state["result_title"] = "净化菌核"
        state["result_text"] = "污染菌核被压制，回声渐渐恢复为自然的重复声。布洛克罕见地承认你不是只会砍东西的人。"
    else:
        state["result_title"] = "击退污染"
        state["result_text"] = "队伍稳定住局面，污染藤蔓缩回菌盖阴影。布洛克把剩下的净化粉收好，提醒你别把漂亮当安全。"


def _queue_side_event_battle(state: dict) -> str:
    state["phase"] = "battle_pending"
    state["pending_battle"] = "block_echo_forest_battle"
    return "支线进入战斗：污染菌核暴露，拟声孢群和污染藤蔓开始围攻队伍。"


def _public_choice(choice: dict) -> dict:
    check = choice.get("check")
    return {
        "id": choice["id"],
        "label": choice["label"],
        "text": choice["text"],
        "trust": choice["trust"],
        "check": {
            "label": check["label"],
            "dc": check["dc"],
            "bonus": check["stat_mod"] + check.get("prof_bonus", 0),
        } if check else None,
    }


def _trust_band(trust: int) -> str:
    if trust <= 29:
        return "疏离"
    if trust <= 49:
        return "谨慎"
    if trust <= 69:
        return "正常"
    if trust <= 84:
        return "信任"
    return "高度信任"


def _clamp(value: int, low: int, high: int) -> int:
    return max(low, min(high, value))
