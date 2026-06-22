"""Authoritative investigation reward rules.

AI may narrate an investigation, but this module owns reward application:
documents, clues, flags, quest updates, and once-only guards.
"""
from __future__ import annotations

import re
from copy import deepcopy
from datetime import datetime, timezone
from typing import Any


def _doc(
    doc_id: str,
    name: str,
    category: str,
    rarity: str,
    icon: str,
    source: str,
    summary: str,
    tags: list[str] | None = None,
    unlocks: list[str] | None = None,
    related: list[str] | None = None,
) -> dict[str, Any]:
    return {
        "id": doc_id,
        "name": name,
        "type": "document",
        "category": "archive",
        "intelCategory": category,
        "rarity": rarity,
        "icon": icon,
        "readable": True,
        "source": source,
        "summary": summary,
        "content": {"title": name, "sections": []},
        "tags": tags or [],
        "unlocks": unlocks or [],
        "relatedDocuments": related or [],
    }


DOCUMENTS: dict[str, dict[str, Any]] = {
    "report_missing_expedition_01": _doc(
        "report_missing_expedition_01",
        "第三远征队失联报告",
        "report",
        "key",
        "scroll-sealed",
        "冒险者公会 · 报告单堆",
        "一份记录第三远征队失联前最后行动轨迹的公会认证报告，火漆已被拆开。",
        ["expedition", "missing", "underdark", "main_quest", "spore_beast", "beacon"],
        ["dialogue_mila_spore_beast", "route_warning_glowing_rivets", "clue_beacon_simultaneous_failure"],
        ["register_missing_expeditions"],
    ),
    "register_missing_expeditions": _doc(
        "register_missing_expeditions",
        "失踪远征队登记册",
        "record",
        "uncommon",
        "book-open",
        "冒险者公会 · 档案柜",
        "一本厚重的登记册，记录了过去五年间所有未归的远征队基本信息。",
        ["expedition", "missing", "guild", "record", "pattern"],
        ["clue_missing_frequency_increasing", "clue_mine_tunnel_changed"],
        ["report_missing_expedition_01"],
    ),
    "helman_personal_note": _doc(
        "helman_personal_note",
        "赫尔曼的抽屉笔记",
        "note",
        "rare",
        "note-pencil",
        "冒险者公会 · 赫尔曼办公室",
        "一张从赫尔曼私人抽屉夹层中找到的便签，字迹潦草而急促。",
        ["helman", "secret", "blackstone", "seal_tremor", "spore_spread"],
        ["clue_spore_follows_beacon", "clue_seal_tremor_2_7x", "location_observatory_hint"],
    ),
    "commission_letter_detail": _doc(
        "commission_letter_detail",
        "指名委托书原件",
        "letter",
        "common",
        "scroll-quill",
        "冒险者公会 · 委托档案",
        "三个月前送达的指名委托书，羊皮纸边缘略微发黄。",
        ["commission", "player", "guild", "main_quest"],
        ["clue_seal_tampered"],
    ),
    "salo_intel_notes": _doc(
        "salo_intel_notes",
        "萨洛的情报卡片",
        "note",
        "uncommon",
        "cards",
        "回声酒馆 · 萨洛",
        "几张用细绳捆在一起的情报卡片，记录同伴、黑市和药铺线索。",
        ["salo", "intel", "companions", "recruitment_hint"],
    ),
    "tavern_rumor_board": _doc(
        "tavern_rumor_board",
        "酒馆传闻便条",
        "note",
        "common",
        "note-pin",
        "回声酒馆 · 布告栏",
        "钉在酒馆布告栏角落的几张便条，上面写着矿工和守卫的零星见闻。",
        ["rumor", "tavern", "city_tension"],
        ["clue_city_on_edge", "clue_main_cable_anomaly"],
    ),
    "temple_sacrifice_record": _doc(
        "temple_sacrifice_record",
        "牺牲者遗录",
        "record",
        "uncommon",
        "book-prayer",
        "静默神殿 · 遗物陈列台",
        "一本厚重的皮质书册，记录历年远征牺牲者的名字、职务与最后所在地。",
        ["temple", "sacrifice", "ailin", "expedition"],
        related=["ailin_white_branch_scripture"],
    ),
    "ailin_white_branch_scripture": _doc(
        "ailin_white_branch_scripture",
        "白枝修会巡礼经文",
        "scripture",
        "uncommon",
        "scroll-holy",
        "静默神殿 · 艾琳",
        "一本艾琳随身携带的巡礼经文，封面绣着白色枝条图案。",
        ["ailin", "white_branch", "scripture", "character_depth"],
    ),
    "orlan_box_journal": _doc(
        "orlan_box_journal",
        "奥兰的盲盒账本",
        "ledger",
        "rare",
        "book-accounts",
        "黑市 · 奥兰摊位",
        "一本塞在盲盒柜底下的旧账本，记录奥兰经手过的部分特殊物品。",
        ["orlan", "blackmarket", "kaiya", "ledger"],
        ["clue_kaiya_owes_orlan", "clue_secret_buyer_samples"],
    ),
    "blackmarket_tunnel_sketch": _doc(
        "blackmarket_tunnel_sketch",
        "黑市暗道草图",
        "map",
        "rare",
        "map-tunnel",
        "黑市 · 凯娅",
        "一张画在旧账页背面的暗道草图，标注了黑市深处几条非公开通路。",
        ["blackmarket", "kaiya", "tunnel", "shortcut"],
        ["route_blackmarket_hidden_passage"],
    ),
    "elevator_maintenance_log": _doc(
        "elevator_maintenance_log",
        "缆梯检修日志",
        "log",
        "common",
        "scroll-log",
        "降渊缆梯 · 检修台",
        "记录降渊缆梯近期停摆、震动和异常敲击声的检修日志。",
        ["elevator", "maintenance", "glowing_rivets", "bell"],
        ["clue_glowing_rivets_warning", "clue_bell_rang_three_times"],
    ),
    "nibu_patrol_log": _doc(
        "nibu_patrol_log",
        "尼布的巡逻日志",
        "log",
        "common",
        "scroll-log",
        "孢海据点 · 尼布",
        "尼布记录据点周边巡逻、异常荧光和补给缺失的巡逻日志。",
        ["nibu", "outpost", "patrol", "blue_shoal"],
        ["clue_dont_go_blue_shoal"],
    ),
    "outpost_supply_inventory": _doc(
        "outpost_supply_inventory",
        "据点补给清单",
        "record",
        "common",
        "scroll-list",
        "孢海据点 · 补给箱",
        "一张夹在木箱内侧的补给清单，列出据点现存物资与过往领取记录。",
        ["supply", "outpost", "missing_patrol"],
    ),
    "shallow_map_spore_sea": _doc(
        "shallow_map_spore_sea",
        "孢子海浅层地图",
        "map",
        "key",
        "map-parchment",
        "孢海据点 · 尼布",
        "尼布交给队伍的浅层地图，标注了从据点到旧远征停靠点的路线。",
        ["map", "spore_sea", "route", "key_item"],
        ["route_warning_glowing_rivets", "clue_dont_go_blue_shoal"],
    ),
    "patrol_last_words": _doc(
        "patrol_last_words",
        "巡逻队遗言线索",
        "note",
        "uncommon",
        "note-blood",
        "孢海据点 · 伤员棚 / 蓝伞浅滩入口",
        "从上一支巡逻队遗留物中找到的残缺记录，写在被孢粉浸染的布条上。",
        ["patrol", "blue_shoal", "warning", "light_anomaly"],
        ["clue_light_will_lure_you", "route_blue_shoal_safe_zone"],
    ),
    "brock_ecology_notes": _doc(
        "brock_ecology_notes",
        "布洛克的孢海生态笔记",
        "note",
        "uncommon",
        "journal-leaf",
        "回声菌林 · 布洛克",
        "布洛克随身携带的防水笔记本，记录了数十种孢海生物。",
        ["brock", "ecology", "spore_sea", "knowledge"],
        ["clue_blue_cap_fed_bodies", "clue_cleanse_over_burn"],
    ),
    "abandoned_outpost_record": _doc(
        "abandoned_outpost_record",
        "废弃据点撤离记录",
        "record",
        "uncommon",
        "scroll-torn",
        "前线废弃据点 · 墙壁",
        "一张被钉在墙上又被撕去一半的记录单，残留部分是撤离指令副本。",
        ["abandoned", "evacuation", "fortress_seal"],
        ["clue_dont_go_blue_shoal", "clue_record_torn_recently"],
    ),
    "blackstone_contamination_report": _doc(
        "blackstone_contamination_report",
        "黑石污染初步报告",
        "report",
        "rare",
        "scroll-dark",
        "前线废弃据点 · 补给箱夹层",
        "一份从废弃据点补给箱夹层中找到的报告，纸张因黑石粉末侵蚀而出现黑斑。",
        ["blackstone", "contamination", "ecology", "arcana"],
        ["clue_blackstone_affects_magic", "clue_contaminated_beasts_self_harm"],
    ),
    "bone_marsh_bestiary": _doc(
        "bone_marsh_bestiary",
        "骨柱湿地怪物图鉴",
        "record",
        "uncommon",
        "book-skull",
        "骨柱湿地 · 废弃营地",
        "一本被防水油布裹着的速写本，记录骨柱湿地及周边区域出没的魔物信息。",
        ["bestiary", "bone_marsh", "combat_hint"],
        ["clue_spore_beast_weak_points", "clue_mud_lurker_light_weakness", "clue_boss_safe_position"],
    ),
    "serin_silver_staff_observation": _doc(
        "serin_silver_staff_observation",
        "瑟琳的银杖观测笔记",
        "note",
        "rare",
        "scroll-star",
        "黑石根区前沿 · 瑟琳",
        "瑟琳在Boss战前休整时匆匆写下的一页观测记录。",
        ["serin", "silver_staff", "boss_hint", "seal"],
        ["clue_boss_safe_position", "clue_seal_not_broken_yet", "clue_blackstone_affects_magic"],
    ),
    "rhein_fragmented_testimony": _doc(
        "rhein_fragmented_testimony",
        "莱因的断片证言",
        "note",
        "key",
        "note-torn",
        "骨柱湿地尽头 / 黑石根区前沿 · 莱因",
        "莱因在精神污染间歇清醒时断续说出的零散信息，由艾琳记录在绷带包装纸上。",
        ["rhein", "fortress", "boss", "testimony"],
        ["clue_bell_rang_three_times", "clue_gate_leaking_influence", "clue_boss_safe_position"],
    ),
    "yunling_expedition_medicine_record": _doc(
        "yunling_expedition_medicine_record",
        "远征队用药记录",
        "record",
        "uncommon",
        "scroll-medicine",
        "黑市深处 · 云苓药铺",
        "云苓保存的一份详细用药记录，追踪经过她柜台的远征队药剂需求变化。",
        ["yunling", "medicine", "expedition", "trend"],
        ["clue_expedition_medicine_trend", "clue_blackstone_affects_magic"],
    ),
}


CLUES: dict[str, dict[str, Any]] = {
    "expedition_saw_spore_beasts": {
        "id": "expedition_saw_spore_beasts",
        "name": "远征队曾遭遇孢化地底兽",
        "description": "第三远征队在失联前报告过疑似孢化地底兽的活动痕迹。",
        "source": "report_missing_expedition_01",
        "relatedDocuments": ["report_missing_expedition_01"],
        "tags": ["monster", "spore_beast", "expedition"],
    },
    "glowing_rivets_warning": {
        "id": "glowing_rivets_warning",
        "name": "发光铆钉尽头有危险",
        "description": "多份记录都提醒不要靠近发光铆钉的尽头，旧路标可能已被污染误导。",
        "source": "report_missing_expedition_01",
        "relatedDocuments": ["report_missing_expedition_01", "shallow_map_spore_sea", "elevator_maintenance_log"],
        "tags": ["route", "warning", "glowing_rivets"],
    },
    "blackstone_affects_magic": {
        "id": "blackstone_affects_magic",
        "name": "黑石污染会干扰魔法",
        "description": "黑石污染会削弱符文、防御法阵、通讯和治疗相关魔力回路。",
        "source": "blackstone_contamination_report",
        "relatedDocuments": ["blackstone_contamination_report", "serin_silver_staff_observation", "yunling_expedition_medicine_record"],
        "tags": ["blackstone", "magic", "boss_hint"],
    },
    "boss_safe_position": {
        "id": "boss_safe_position",
        "name": "Boss战安全站位",
        "description": "靠近原生岩壁、避开黑石碎片正前方和多碎片共振区，能降低脉冲干扰。",
        "source": "serin_silver_staff_observation",
        "relatedDocuments": ["serin_silver_staff_observation", "rhein_fragmented_testimony", "bone_marsh_bestiary"],
        "tags": ["boss", "positioning", "combat_hint"],
    },
    "bell_rang_three_times": {
        "id": "bell_rang_three_times",
        "name": "地底堡垒钟声三响",
        "description": "地底堡垒失守前曾响起三次钟声，第三次之后命令中断。",
        "source": "rhein_fragmented_testimony",
        "relatedDocuments": ["rhein_fragmented_testimony", "helman_personal_note", "elevator_maintenance_log"],
        "tags": ["fortress", "bell", "main_quest"],
    },
    "dont_go_blue_shoal": {
        "id": "dont_go_blue_shoal",
        "name": "不要走蓝伞浅滩",
        "description": "巡逻、撤离和据点记录都指向同一警告：蓝伞浅滩的路径会把人引向深处。",
        "source": "abandoned_outpost_record",
        "relatedDocuments": ["abandoned_outpost_record", "nibu_patrol_log", "patrol_last_words"],
        "tags": ["blue_shoal", "route", "warning"],
    },
    "guild_files_were_removed": {
        "id": "guild_files_were_removed",
        "name": "公会档案被抽走过",
        "description": "报告单堆中有明显缺页，说明有人在你来之前移走了部分文件。",
        "source": "冒险者公会 - 报告单堆",
        "tags": ["guild", "missing_files", "investigation"],
    },
}


def _rewards(
    document_ids: list[str],
    clue_ids: list[str] | None = None,
    extras: list[dict[str, Any]] | None = None,
) -> list[dict[str, Any]]:
    rewards = [{"type": "document", "id": doc_id} for doc_id in document_ids]
    rewards.extend({"type": "clue", "id": clue_id} for clue_id in (clue_ids or []))
    rewards.extend(deepcopy(extras or []))
    return rewards


def _action(
    action_id: str,
    label: str,
    locations: list[str],
    pattern: str,
    document_ids: list[str],
    clue_ids: list[str] | None = None,
    check: dict[str, Any] | None = None,
    rewards: dict[str, list[dict[str, Any]]] | None = None,
    requirements: dict[str, Any] | None = None,
    quest_update: dict[str, str] | None = None,
) -> dict[str, Any]:
    base_rewards = _rewards(document_ids, clue_ids)
    return {
        "id": action_id,
        "label": label,
        "type": "investigate",
        "locations": locations,
        "match": re.compile(pattern, re.I),
        "check": check,
        "rewards": rewards or {
            "criticalSuccess": base_rewards,
            "success": base_rewards,
            "partial": [],
            "fail": [],
            "criticalFail": [],
        },
        "onceOnly": True,
        "requirements": requirements or {},
        "questUpdate": quest_update,
    }


INVESTIGATION_ACTIONS: list[dict[str, Any]] = [
    _action(
        "inspect_reports",
        "观察柜台旁的报告单",
        ["guild_hall"],
        r"(观察|查看|调查|翻阅|检查).*(报告单|远征档案|失联报告|档案)|报告单",
        ["report_missing_expedition_01"],
        ["expedition_saw_spore_beasts", "glowing_rivets_warning"],
        {"attribute": "调查", "dc": 12, "dice": "1d20"},
        rewards={
            "criticalSuccess": _rewards(
                ["report_missing_expedition_01", "helman_personal_note"],
                ["expedition_saw_spore_beasts", "glowing_rivets_warning", "bell_rang_three_times"],
            ),
            "success": _rewards(["report_missing_expedition_01"], ["expedition_saw_spore_beasts", "glowing_rivets_warning"]),
            "partial": _rewards([], ["expedition_saw_spore_beasts"]),
            "fail": _rewards([], ["guild_files_were_removed"]),
            "criticalFail": [{"type": "flag", "id": "guild_staff_alerted", "value": True}],
        },
        quest_update={
            "id": "quest_missing_expedition_report",
            "title": "调查失联远征队",
            "objective": "带着第三远征队失联报告，向萨洛或公会人员追问孢化地底兽。",
        },
    ),
    _action("ask_mila_missing_expedition", "向米娜打听远征队", ["guild_hall"], r"(米娜|文书员).*(打听|询问|追问).*(远征队|失踪|失联)", ["report_missing_expedition_01"], ["expedition_saw_spore_beasts"], {"attribute": "说服", "dc": 13, "dice": "1d20"}),
    _action("ask_mila_archive_register", "请米娜查看档案", ["guild_hall"], r"(米娜|文书员).*(查看|翻阅|申请|请求).*(失踪记录|登记册|档案)", ["register_missing_expeditions"]),
    _action(
        "inspect_helman_desk",
        "检查赫尔曼办公桌",
        ["guild_hall"],
        r"(赫尔曼|会长).*(办公桌|抽屉|桌子|夹层)",
        ["helman_personal_note"],
        ["bell_rang_three_times"],
        {"attribute": "巧手", "dc": 14, "dice": "1d20"},
        rewards={
            "criticalSuccess": _rewards(["helman_personal_note"], ["bell_rang_three_times"], [{"type": "gold", "amount": 20, "reason": "发现赫尔曼夹在旧账册里的预付补贴"}]),
            "success": _rewards(["helman_personal_note"], ["bell_rang_three_times"]),
            "partial": _rewards([], ["bell_rang_three_times"]),
            "fail": [{"type": "hp", "amount": -1, "reason": "抽屉暗扣划伤手指"}],
            "criticalFail": [{"type": "hp", "amount": -2, "reason": "触动办公桌里的防盗针簧"}, {"type": "flag", "id": "helman_desk_alarm", "value": True}],
        },
    ),
    _action(
        "inspect_commission_seal",
        "检查委托火漆",
        ["guild_hall"],
        r"(检查|查看|调查).*(委托|火漆|印章|公会认证)",
        ["commission_letter_detail"],
        check={"attribute": "调查", "dc": 10, "dice": "1d20"},
        rewards={
            "criticalSuccess": _rewards(["commission_letter_detail"], [], [{"type": "gold", "amount": 10, "reason": "确认可领取委托预支金"}]),
            "success": _rewards(["commission_letter_detail"]),
            "partial": _rewards([], [], [{"type": "flag", "id": "commission_seal_smudged", "value": True}]),
            "fail": [],
            "criticalFail": [{"type": "flag", "id": "commission_seal_damaged", "value": True}],
        },
    ),
    _action("obtain_salo_intel", "获得萨洛的情报卡片", ["echo_tavern"], r"(萨洛).*(情报卡片|情报|购买|赠送|骰子获胜|赢下)|付.*100.*情报", ["salo_intel_notes"]),
    _action(
        "read_tavern_board",
        "查看酒馆布告栏",
        ["echo_tavern"],
        r"(查看|阅读|调查).*(布告栏|传闻|便条)",
        ["tavern_rumor_board"],
        check={"attribute": "调查", "dc": 10, "dice": "1d20"},
        rewards={
            "criticalSuccess": _rewards(["tavern_rumor_board"], [], [{"type": "gold", "amount": 15, "reason": "找到一张还能兑换的旧赏金兑票"}]),
            "success": _rewards(["tavern_rumor_board"], [], [{"type": "gold", "amount": 5, "reason": "抄到一条小额悬赏线索"}]),
            "partial": _rewards([], [], [{"type": "gold", "amount": 2, "reason": "从旧传闻里认出一枚可兑铜牌"}]),
            "fail": [],
            "criticalFail": [{"type": "gold", "amount": -3, "reason": "误碰酒馆布告押钉，赔了纸页钱"}],
        },
    ),
    _action(
        "read_sacrifice_record",
        "翻阅牺牲者遗录",
        ["silent_temple"],
        r"(牺牲者遗录|阵亡名单|遗录|安魂).*?(翻阅|查看|请求|阅读)|翻阅.*遗录",
        ["temple_sacrifice_record"],
        check={"attribute": "宗教", "dc": 12, "dice": "1d20"},
        rewards={
            "criticalSuccess": _rewards(["temple_sacrifice_record"], [], [{"type": "hp", "amount": 4, "reason": "艾琳顺手完成一次白枝净化"}]),
            "success": _rewards(["temple_sacrifice_record"], [], [{"type": "hp", "amount": 2, "reason": "艾琳处理了队伍的小伤"}]),
            "partial": _rewards([], [], [{"type": "hp", "amount": 1, "reason": "安魂仪式让队伍缓过一口气"}]),
            "fail": [],
            "criticalFail": [{"type": "flag", "id": "temple_record_disturbed", "value": True}],
        },
    ),
    _action("read_white_branch_scripture", "查看白枝修会巡礼经文", ["silent_temple"], r"(艾琳|白枝).*(经文|巡礼|誓约|深入交谈)", ["ailin_white_branch_scripture"], requirements={"trust": ["al_trust", 70]}),
    _action("inspect_orlan_ledger", "观察奥兰的暗格账本", ["black_market"], r"(奥兰).*(账本|暗格|盲盒账本|瞥向)", ["orlan_box_journal"], check={"attribute": "洞察", "dc": 13, "dice": "1d20"}),
    _action("ask_kaiya_tunnel_map", "索要黑市暗道草图", ["black_market"], r"(凯娅|软爪).*(暗道|草图|黑市通路|路线)", ["blackmarket_tunnel_sketch"], check={"attribute": "调查", "dc": 14, "dice": "1d20"}, requirements={"trust": ["kl_trust", 70]}),
    _action("read_elevator_log", "观察缆梯检修日志", ["elevator"], r"(缆梯|降渊).*(检修日志|检修记录|维修记录)", ["elevator_maintenance_log"], ["glowing_rivets_warning", "bell_rang_three_times"], {"attribute": "调查", "dc": 10, "dice": "1d20"}),
    _action("ask_nibu_patrol_log", "向尼布索要巡逻日志", ["spore_outpost"], r"(尼布).*(巡逻日志|巡逻记录|记录)", ["nibu_patrol_log"], ["dont_go_blue_shoal"], {"attribute": "说服", "dc": 11, "dice": "1d20"}),
    _action("inspect_outpost_supply", "检查据点补给箱", ["spore_outpost"], r"(检查|调查|查看).*(补给箱|补给清单|物资)", ["outpost_supply_inventory"], check={"attribute": "调查", "dc": 12, "dice": "1d20"}),
    _action("receive_shallow_map", "获得孢子海浅层地图", ["spore_outpost"], r"(抵达|到达|进入).*(孢海据点)|孢子海浅层地图|尼布.*地图", ["shallow_map_spore_sea"], ["glowing_rivets_warning", "dont_go_blue_shoal"]),
    _action("find_patrol_last_words", "寻找巡逻队遗言线索", ["spore_outpost", "blue_shoal"], r"(巡逻队|伤员|遗物|浅滩边缘).*(遗言|线索|记录|残留)", ["patrol_last_words"], ["dont_go_blue_shoal"], {"attribute": "调查", "dc": 13, "dice": "1d20"}),
    _action("read_brock_ecology_notes", "阅读布洛克生态笔记", ["echo_grove"], r"(布洛克).*(生态笔记|孢海笔记|笔记本|生态判断)", ["brock_ecology_notes"], check={"attribute": "自然", "dc": 14, "dice": "1d20"}, requirements={"trust": ["sl_trust", 70]}),
    _action("read_abandoned_record", "调查废弃据点撤离记录", ["abandoned_post"], r"(废弃据点|旧标记|墙上|撤离记录).*(调查|查看|阅读)|调查旧远征标记", ["abandoned_outpost_record"], ["dont_go_blue_shoal"], {"attribute": "调查", "dc": 13, "dice": "1d20"}),
    _action(
        "identify_blackstone_report",
        "识别黑石污染报告",
        ["abandoned_post"],
        r"((黑石|黑色结晶|污染).*(识别|调查|报告|奥秘)|(识别|调查|奥秘).*(黑石|黑色结晶|污染))",
        ["blackstone_contamination_report"],
        ["blackstone_affects_magic"],
        {"attribute": "奥秘", "dc": 14, "dice": "1d20"},
        rewards={
            "criticalSuccess": _rewards(["blackstone_contamination_report"], ["blackstone_affects_magic"], [{"type": "attribute", "attr": "intelligence", "amount": 1, "reason": "理解黑石污染的魔力干扰规律"}]),
            "success": _rewards(["blackstone_contamination_report"], ["blackstone_affects_magic"]),
            "partial": _rewards([], ["blackstone_affects_magic"]),
            "fail": [],
            "criticalFail": [{"type": "hp", "amount": -2, "reason": "直接触碰污染结晶造成反噬"}],
        },
    ),
    _action("search_bone_marsh_bestiary", "搜索骨柱湿地怪物图鉴", ["bone_marsh"], r"(骨柱湿地|废弃营地|装备袋).*(怪物图鉴|图鉴|搜索|感知)", ["bone_marsh_bestiary"], ["boss_safe_position"], {"attribute": "感知", "dc": 14, "dice": "1d20"}),
    _action("read_serin_observation", "阅读瑟琳银杖观测笔记", ["blackstone_root"], r"(瑟琳|银杖).*(观测笔记|黑石脉冲|裂痕|站位)", ["serin_silver_staff_observation"], ["blackstone_affects_magic", "boss_safe_position"], {"attribute": "奥秘", "dc": 14, "dice": "1d20"}, requirements={"trust": ["se_trust", 70]}),
    _action("record_rhein_testimony", "记录莱因断片证言", ["bone_marsh", "blackstone_root"], r"(莱因).*(证言|清醒|询问|医疗|断片)", ["rhein_fragmented_testimony"], ["bell_rang_three_times", "boss_safe_position"], {"attribute": "医疗", "dc": 12, "dice": "1d20"}),
    _action("obtain_yunling_medicine_record", "获得远征队用药记录", ["black_market", "apothecary"], r"(云苓|药铺).*(用药记录|净化之心|消费.*100|大量购买)", ["yunling_expedition_medicine_record"], ["blackstone_affects_magic"]),
]


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _list_ids(entries: Any) -> set[str]:
    if not isinstance(entries, list):
        return set()
    ids: set[str] = set()
    for entry in entries:
        if isinstance(entry, dict):
            entry_id = str(entry.get("id") or "").strip()
        else:
            entry_id = str(entry or "").strip()
        if entry_id:
            ids.add(entry_id)
    return ids


MAIN_STORY_NODE_META = {
    "guild-final-registration": {
        "objective": "前往降渊缆梯中枢，完成下潜前安全核验。",
        "completed": ["recruit_full_party", "register_expedition_party"],
        "update": {
            "id": "guild-final-registration",
            "title": "第七远征小队登记完成",
            "objective": "前往降渊缆梯中枢，完成下潜前安全核验。",
        },
    },
    "elevator-hub": {
        "objective": "确认装备后乘缆梯前往无光孢海据点。",
        "completed": ["recruit_full_party", "register_expedition_party", "reach_elevator_hub"],
        "update": {
            "id": "elevator-hub",
            "title": "抵达降渊缆梯中枢",
            "objective": "确认装备后乘缆梯前往无光孢海据点。",
        },
    },
    "elevator-descent": {
        "objective": "固定安全扣，适应垂降并观察下方异常孢光带。",
        "completed": ["recruit_full_party", "register_expedition_party", "reach_elevator_hub", "start_elevator_descent"],
        "update": {
            "id": "elevator-descent",
            "title": "降渊缆梯启动",
            "objective": "固定安全扣，适应垂降并观察下方异常孢光带。",
        },
    },
}


def _merge_unique_strings(existing: Any, additions: list[str]) -> list[str]:
    result = [item for item in existing if isinstance(item, str)] if isinstance(existing, list) else []
    for item in additions:
        if item and item not in result:
            result.append(item)
    return result


def _merge_quest_update(existing: Any, update: dict) -> list[dict]:
    result = [item for item in existing if isinstance(item, dict)] if isinstance(existing, list) else []
    update_id = str(update.get("id") or "")
    if update_id and not any(item.get("id") == update_id for item in result):
        next_update = dict(update)
        next_update["createdAt"] = _now()
        result.append(next_update)
    return result


def _main_story_scene_for_state(state: dict) -> str:
    scene_state = state.get("sceneState")
    scene_id = ""
    if isinstance(scene_state, dict):
        scene_id = str(scene_state.get("currentScene") or "")
    area = str(state.get("current_area") or "")
    if state.get("elevator_descent_started") or "垂降" in area:
        return "elevator-descent"
    if state.get("elevator_hub_visited") or "缆梯" in area or "降渊" in area:
        return "elevator-hub"
    if state.get("expedition_registered"):
        return "guild-final-registration"
    if scene_id in MAIN_STORY_NODE_META:
        return scene_id
    return ""


def _sync_main_story_progress(state: dict, scene_id: str) -> None:
    meta = MAIN_STORY_NODE_META.get(scene_id)
    if not meta:
        return

    quest = state.setdefault("questLog", {})
    quest["mainQuest"] = quest.get("mainQuest") or "investigate_earthcore_gate"
    quest["currentObjective"] = meta["objective"]
    quest["completedObjectives"] = _merge_unique_strings(quest.get("completedObjectives"), meta["completed"])
    quest["updates"] = _merge_quest_update(quest.get("updates"), meta["update"])

    scene_state = state.setdefault("sceneState", {})
    scene_state["currentScene"] = scene_id
    scene_state["visitedScenes"] = _merge_unique_strings(scene_state.get("visitedScenes"), [scene_id])


def ensure_investigation_state(state: dict) -> None:
    state.setdefault("documents", [])
    state.setdefault("clues", [])
    state.setdefault("flags", {})
    state.setdefault("questLog", {
        "mainQuest": "investigate_earthcore_gate",
        "currentObjective": "前往逆穹悬城",
        "completedObjectives": [],
        "updates": [],
    })
    state.setdefault("sceneState", {
        "currentScene": _scene_id_for_area(str(state.get("current_area") or "")),
        "visitedScenes": [],
    })
    scene_state = state.get("sceneState")
    if isinstance(scene_state, dict):
        current_scene = _main_story_scene_for_state(state) or _scene_id_for_area(str(state.get("current_area") or ""))
        if current_scene:
            scene_state["currentScene"] = current_scene
            visited = scene_state.setdefault("visitedScenes", [])
            if isinstance(visited, list) and current_scene not in visited:
                visited.append(current_scene)
            _sync_main_story_progress(state, current_scene)
        if current_scene == "spore_outpost":
            _grant_document(state, "shallow_map_spore_sea")
            _grant_clue(state, "glowing_rivets_warning")
            _grant_clue(state, "dont_go_blue_shoal")


def _scene_id_for_area(area: str) -> str:
    if "公会" in area:
        return "guild_hall"
    if "酒馆" in area:
        return "echo_tavern"
    if "神殿" in area:
        return "silent_temple"
    if "药铺" in area or "云苓" in area:
        return "apothecary"
    if "黑市" in area or "市场" in area:
        return "black_market"
    if "缆梯" in area or "降渊" in area:
        return "elevator"
    if "孢海据点" in area:
        return "spore_outpost"
    if "蓝伞" in area:
        return "blue_shoal"
    if "回声菌林" in area or "菌林" in area:
        return "echo_grove"
    if "废弃据点" in area:
        return "abandoned_post"
    if "骨柱" in area:
        return "bone_marsh"
    if "黑石根" in area or "Boss" in area or "前沿" in area:
        return "blackstone_root"
    return "unknown"


def _current_scene_ids(state: dict) -> set[str]:
    area_scene = _scene_id_for_area(str(state.get("current_area") or ""))
    scene = state.get("sceneState", {}).get("currentScene") if isinstance(state.get("sceneState"), dict) else ""
    return {item for item in (area_scene, scene) if item}


def _requirements_met(action: dict[str, Any], state: dict) -> bool:
    requirements = action.get("requirements") or {}
    trust = requirements.get("trust")
    if trust:
        key, minimum = trust
        value = max(
            int(state.get(key) or 0),
            int(state.get("companionTrust", {}).get("ailin" if key == "al_trust" else "brock" if key == "sl_trust" else "kaiya" if key == "kl_trust" else "serin", 0))
            if isinstance(state.get("companionTrust"), dict)
            else 0,
        )
        if value < int(minimum):
            return False
    return True


def find_investigation_action(message: str, state: dict) -> dict[str, Any] | None:
    scenes = _current_scene_ids(state)
    text = str(message or "")
    for action in INVESTIGATION_ACTIONS:
        if scenes.isdisjoint(set(action.get("locations") or [])):
            continue
        if action["match"].search(text) and _requirements_met(action, state):
            return action
    return None


def action_check_for_message(message: str, state: dict) -> tuple[str, int] | None:
    action = find_investigation_action(message, state)
    if not action or not action.get("check"):
        return None
    check = action.get("check") or {}
    return str(check.get("attribute") or "调查"), int(check.get("dc") or 12)


def classify_check_result(total: int, dc: int, natural_roll: int) -> str:
    if natural_roll == 20:
        return "criticalSuccess"
    if natural_roll == 1:
        return "criticalFail"
    if total >= dc + 5:
        return "criticalSuccess"
    if total >= dc:
        return "success"
    if total >= dc - 3:
        return "partial"
    return "fail"


def _roll_from_payload(payload: dict[str, Any]) -> int:
    raw = str(payload.get("掷骰") or payload.get("roll") or "")
    match = re.search(r"D20=(\d+)", raw, re.I) or re.search(r"\b(\d+)\b", raw)
    if match:
        return int(match.group(1))
    return int(payload.get("naturalRoll") or payload.get("d20") or 0)


def _reward_bucket(action: dict[str, Any], level: str) -> list[dict[str, Any]]:
    rewards = action.get("rewards") or {}
    if level in rewards:
        return list(rewards[level])
    if level == "criticalSuccess":
        return list(rewards.get("success") or [])
    if level == "criticalFail":
        return list(rewards.get("fail") or [])
    return []


def _grant_document(state: dict, document_id: str) -> dict[str, Any] | None:
    if document_id not in DOCUMENTS:
        return None
    existing_documents = _list_ids(state.get("documents"))
    if document_id in existing_documents:
        return None
    document = deepcopy(DOCUMENTS[document_id])
    document["unlockedAt"] = _now()
    state.setdefault("documents", []).append(document)
    return document


def _grant_clue(state: dict, clue_id: str) -> dict[str, Any] | None:
    if clue_id not in CLUES:
        return None
    existing_clues = _list_ids(state.get("clues"))
    if clue_id in existing_clues:
        return None
    clue = deepcopy(CLUES[clue_id])
    clue["unlockedAt"] = _now()
    state.setdefault("clues", []).append(clue)
    return clue


def _int_state(state: dict, key: str, default: int = 0) -> int:
    try:
        return int(state.get(key, default) or default)
    except (TypeError, ValueError):
        return default


def apply_investigation_rewards(
    state: dict,
    message: str,
    check_payload: dict[str, Any] | None,
) -> dict[str, Any] | None:
    action = find_investigation_action(message, state)
    if not action:
        return None
    if action.get("check") and not check_payload:
        return None

    ensure_investigation_state(state)
    flags = state.setdefault("flags", {})
    action_flag = f"{action['id']}_completed"
    if action.get("onceOnly") and flags.get(action_flag):
        return {
            "type": "investigation_reward",
            "actionId": action["id"],
            "duplicate": True,
            "message": "该调查行动已经结算过，没有重复奖励。",
            "inventory": state.get("inventory", ""),
            "documents": state.get("documents", []),
            "clues": state.get("clues", []),
            "flags": flags,
            "questLog": state.get("questLog", {}),
            "sceneState": state.get("sceneState", {}),
            "addedDocuments": [],
            "addedClues": [],
            "appliedRewards": [],
            "gold": state.get("gold"),
            "current_hp": state.get("current_hp"),
            "max_hp": state.get("max_hp"),
            "attributes": {},
        }

    if check_payload:
        roll = _roll_from_payload(check_payload)
        total = int(check_payload.get("总计") or check_payload.get("total") or 0)
        dc = int(check_payload.get("DC") or action.get("check", {}).get("dc") or 12)
        result_level = classify_check_result(total, dc, roll)
    else:
        roll = 0
        total = 0
        dc = 0
        result_level = "success"
    reward_defs = _reward_bucket(action, result_level)

    added_documents: list[dict[str, Any]] = []
    added_clues: list[dict[str, Any]] = []
    applied_rewards: list[dict[str, Any]] = []
    changed_attributes: dict[str, int] = {}

    for reward in reward_defs:
        reward_type = reward.get("type")
        reward_id = str(reward.get("id") or "").strip()
        if reward_type == "document":
            document = _grant_document(state, reward_id)
            if document:
                added_documents.append(document)
            if reward_id:
                applied_rewards.append({"type": "document", "id": reward_id})
        elif reward_type == "clue":
            clue = _grant_clue(state, reward_id)
            if clue:
                added_clues.append(clue)
            if reward_id:
                applied_rewards.append({"type": "clue", "id": reward_id})
        elif reward_type == "flag" and reward_id:
            flags[reward_id] = reward.get("value", True)
            applied_rewards.append({"type": "flag", "id": reward_id, "value": flags[reward_id]})
        elif reward_type == "item" and reward_id:
            inventory = [item.strip() for item in str(state.get("inventory", "")).split(",") if item.strip()]
            item_name = str(reward.get("name") or reward_id)
            if item_name not in inventory:
                inventory.append(item_name)
            state["inventory"] = ",".join(inventory)
            applied_rewards.append({"type": "item", "id": reward_id, "name": item_name})
        elif reward_type == "gold":
            amount = int(reward.get("amount") or reward.get("change") or 0)
            old = _int_state(state, "gold", 200)
            state["gold"] = max(0, old + amount)
            applied_rewards.append({
                "type": "gold",
                "old": old,
                "new": state["gold"],
                "change": amount,
                "reason": reward.get("reason", ""),
            })
        elif reward_type == "hp":
            amount = int(reward.get("amount") or reward.get("change") or 0)
            old = _int_state(state, "current_hp", 30)
            max_hp = _int_state(state, "max_hp", 30)
            state["current_hp"] = max(0, min(max_hp, old + amount))
            applied_rewards.append({
                "type": "hp",
                "old": old,
                "new": state["current_hp"],
                "max": max_hp,
                "change": amount,
                "reason": reward.get("reason", ""),
            })
        elif reward_type == "attribute":
            attr = str(reward.get("attr") or reward.get("id") or "").strip()
            if not attr:
                continue
            amount = int(reward.get("amount") or reward.get("change") or 0)
            old = _int_state(state, attr, 0)
            state[attr] = old + amount
            changed_attributes[attr] = state[attr]
            applied_rewards.append({
                "type": "attribute",
                "attr": attr,
                "old": old,
                "new": state[attr],
                "change": amount,
                "reason": reward.get("reason", ""),
            })

    flags[action_flag] = True
    if action["id"] == "inspect_reports":
        flags["guild_report_checked"] = True

    quest = state.setdefault("questLog", {})
    update = deepcopy(action.get("questUpdate") or {})
    if update:
        quest["mainQuest"] = quest.get("mainQuest") or "investigate_earthcore_gate"
        quest["currentObjective"] = update.get("objective") or quest.get("currentObjective")
        updates = quest.setdefault("updates", [])
        if isinstance(updates, list) and not any(item.get("id") == update.get("id") for item in updates if isinstance(item, dict)):
            update["createdAt"] = _now()
            updates.append(update)
        applied_rewards.append({"type": "quest_update", "id": update.get("id"), "title": update.get("title")})

    return {
        "type": "investigation_reward",
        "actionId": action["id"],
        "actionLabel": action["label"],
        "duplicate": False,
        "resultLevel": result_level,
        "roll": roll,
        "total": total,
        "dc": dc,
        "inventory": state.get("inventory", ""),
        "documents": state.get("documents", []),
        "clues": state.get("clues", []),
        "flags": flags,
        "questLog": state.get("questLog", {}),
        "sceneState": state.get("sceneState", {}),
        "addedDocuments": added_documents,
        "addedClues": added_clues,
        "appliedRewards": applied_rewards,
        "gold": state.get("gold"),
        "current_hp": state.get("current_hp"),
        "max_hp": state.get("max_hp"),
        "attributes": changed_attributes,
    }
