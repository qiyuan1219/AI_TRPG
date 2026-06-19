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
    # ============================================================
    # 艾琳支线：白枝下的名字
    # ============================================================
    "ailin_wounded_names": {
        "id": "ailin_wounded_names",
        "companion": {
            "id": "ailin",
            "name": "艾琳·白枝",
            "trust_key": "trust_al",
            "portrait": "白枝修女",
        },
        "title": "白枝下的名字",
        "location": "孢海据点伤员棚",
        "eyebrow": "同伴支线 / 第一幕",
        "summary": "伤员、遗物、牺牲不是数字。玩家帮艾琳救治伤员、整理名册，为后续「莱因选择」做道德铺垫。",
        "opening": (
            "尼布把浅层地图压在补给箱上，转身去找巡逻日志。布洛克蹲在平台边缘辨认风向，"
            "凯娅拆开第一只补给箱的封扣，队伍暂时被分成几条整备线。艾琳没有打断整备，"
            "只是把药箱放到伤员棚门口。帘布后传来压抑的咳嗽声，白枝木牌上写着上一批巡逻队的名字。"
            "她低声说：「给我一刻钟。我先判断污染有没有扩散，等尼布把路线核完，我们再一起出发。」"
        ),
        "objectives": [
            "在据点整备时间内帮艾琳判断伤员污染程度。",
            "从伤员或遗物中获得浅滩异常光带线索。",
            "决定如何平衡救治伤员与出发效率。",
            "整理阵亡者名册，为后续莱因选择做道德铺垫。",
        ],
        "free_chat_prompt": "艾琳在伤员棚外洗净了手上的孢粉，指尖在袖口的白枝刺绣上停留了一瞬。",
        "chat_topics": [
            "为什么坚持救伤员",
            "白枝修会怎么看待牺牲",
            "是否害怕带不回所有人",
            "如果队伍中有人被污染会怎么做",
            "对接下来进入蓝伞浅滩的担忧",
        ],
        "forbidden": [
            "黑暗之门后方具体是什么",
            "地下海洋反转",
            "第二幕之后路线",
            "艾琳尚未公开的完整个人秘密",
        ],
        "initial_state": {
            "phase": "opening",
            "trust": 55,
            "threat": 10,
            "max_threat": 10,
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
                "stop_and_help",
                "陪艾琳去伤员棚确认污染情况",
                "利用据点整备时间帮艾琳检查污染程度、清理伤口、稳定最严重的那名伤员。",
                10,
                check={"label": "医疗", "stat_mod": 2, "prof_bonus": 2, "dc": 12},
                success_threat=-3,
                flags=["协助救治", "尊重伤员"],
            ),
            _choice(
                "ask_time_and_organize",
                "询问救治需要多久，安排其他人整备",
                "让艾琳评估时间，同时安排布洛克和凯娅整理装备、瑟琳检查法阵反应，兼顾效率与救援。",
                6,
                threat=-1,
                flags=["兼顾效率", "队伍协作"],
            ),
            _choice(
                "quick_patch_only",
                "要求艾琳只做快速分诊，别拖延进入浅滩",
                "让艾琳做最低限度处理，确保队伍尽快离开据点。",
                -4,
                threat=-2,
                contamination=1,
                flags=["匆忙处理"],
            ),
            _choice(
                "ignore_wounded",
                "认为伤员已经没用，要求立刻出发",
                "伤员拖慢进度，直接离开。",
                -12,
                threat=1,
                contamination=1,
                blocks_rewards=["白枝绷带"],
                flags=["抛弃伤员"],
            ),
            _choice(
                "pray_with_ailin",
                "陪艾琳完成白枝祈祷",
                "协助艾琳为阵亡者完成白枝祝福，整理阵亡者名册。",
                8,
                check={"label": "宗教", "stat_mod": 0, "prof_bonus": 2, "dc": 12},
                success_threat=-3,
                flags=["白枝祈祷", "整理名册"],
            ),
            _choice(
                "investigate_belongings",
                "检查阵亡者遗物",
                "从巡逻队的遗物和记录中寻找蓝伞浅滩异常光带的线索。",
                2,
                check={"label": "调查", "stat_mod": 1, "prof_bonus": 2, "dc": 13},
                success_threat=-2,
                flags=["遗物线索", "浅滩警告"],
            ),
        ],
        "crisis_choices": [
            _choice(
                "stabilize_crisis",
                "全力稳定伤员",
                "伤员污染发作，蓝色孢尘从绷带渗出。立刻协助艾琳进行紧急救治。",
                8,
                check={"label": "医疗", "stat_mod": 2, "prof_bonus": 2, "dc": 14},
                success_threat=-3,
                failure_threat=-1,
                failure_contamination=1,
                flags=["稳定伤员"],
            ),
            _choice(
                "use_white_branch_ritual",
                "用白枝仪式压制污染",
                "让艾琳启动白枝净化仪式，你负责按住伤员并维持法阵边界。",
                4,
                check={"label": "宗教/医疗", "stat_mod": 1, "prof_bonus": 2, "dc": 13},
                success_threat=-4,
                failure_threat=-2,
                failure_contamination=1,
                flags=["白枝净化"],
            ),
            _choice(
                "protect_others",
                "保护其他伤员",
                "优先将未受感染的伤员移出帐篷，隔离污染爆发区域。",
                2,
                threat=-2,
                flags=["保护其他伤员"],
            ),
        ],
    },

    # ============================================================
    # 凯娅支线：少了两个封扣
    # ============================================================
    "kaiya_broken_seals": {
        "id": "kaiya_broken_seals",
        "companion": {
            "id": "kaiya",
            "name": "凯娅",
            "trust_key": "trust_kl",
            "portrait": "黑市猎手",
        },
        "title": "少了两个封扣",
        "location": "前线废弃据点暗道",
        "eyebrow": "同伴支线 / 第一幕",
        "summary": "凯娅发现据点补给箱封扣被打开过，切口是人类手法。暗门通往黑市仓库与怪物巢穴之间的暗道。",
        "opening": (
            "废弃据点的补给箱排成一列，大多已经空了。凯娅却没有看箱子里面，而是蹲在最外侧的锁扣旁。"
            "她用指尖摸过切口：「少了两个封扣，切口很新。不是魔物咬的，是人手。」"
            "布洛克皱眉：「偷补给？」凯娅没抬头：「如果只是偷补给，我会觉得这里的人很有求生欲。"
            "问题是这个切法……像是在开一条别人故意留下的路。」"
        ),
        "objectives": [
            "调查补给箱封扣。",
            "找到隐藏暗道。",
            "判断暗道是捷径还是怪物巢穴。",
            "决定是否拿走暗道补给，以及是否留下交换物。",
        ],
        "free_chat_prompt": "凯娅收起锁针，用刀尖在地上画了一条通往骨柱湿地的捷径。",
        "chat_topics": [
            "她和奥兰到底熟不熟",
            "为什么不喜欢欠账",
            "如何判断怪物巢穴",
            "为什么总用交易口吻说话",
            "是否真的会背叛队伍",
        ],
        "forbidden": [
            "黑暗之门后方具体是什么",
            "地下海洋反转",
            "凯娅尚未公开的完整个人秘密",
        ],
        "initial_state": {
            "phase": "opening",
            "trust": 62,
            "threat": 10,
            "max_threat": 10,
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
                "let_kaiya_check",
                "让凯娅先检查暗门和陷阱",
                "把暗门和封扣的判断全权交给凯娅，你负责在旁警戒。",
                8,
                check={"label": "巧手", "stat_mod": 3, "prof_bonus": 2, "dc": 13},
                success_threat=-3,
                flags=["避开第一道机关", "尊重机关判断"],
            ),
            _choice(
                "ask_about_marks",
                "追问她和黑市标记的关系，但不指责",
                "你注意到封扣切口带有黑市常见的标记手法，问凯娅是否认识。语气保持探寻而非质问。",
                6,
                check={"label": "洞察", "stat_mod": 1, "prof_bonus": 2, "dc": 14},
                success_threat=-2,
                flags=["了解黑市标记", "追问但不逼问"],
            ),
            _choice(
                "help_lockpick",
                "帮她一起拆机关锁",
                "和凯娅并排拆解暗门机关，让布洛克和瑟琳在后方观察。",
                10,
                check={"label": "巧手", "stat_mod": 1, "prof_bonus": 2, "dc": 14},
                success_threat=-4,
                failure_threat=-1,
                flags=["保留补给完整", "协作拆锁"],
            ),
            _choice(
                "take_supplies",
                "直接拿走补给，不管欠账标记",
                "暗道补给是远征物资，拿走不需要解释。",
                -6,
                threat=-2,
                flags=["拿走欠账补给"],
                blocks_rewards=["奥兰旧封条"],
            ),
            _choice(
                "accuse_kaiya",
                "指责她把队伍带进黑市陷阱",
                "质问凯娅为何把队伍引到她熟悉的暗道，怀疑她另有目的。",
                -12,
                threat=1,
                contamination=1,
                flags=["指责凯娅"],
            ),
            _choice(
                "scout_lair_noise",
                "先听暗道深处动静",
                "蹲下贴耳，判断暗道深处是怪物巢穴还是普通回声。",
                2,
                check={"label": "感知", "stat_mod": 1, "prof_bonus": 2, "dc": 13},
                success_threat=-2,
                flags=["识别巢穴声音"],
            ),
        ],
        "crisis_choices": [
            _choice(
                "enter_battle_kaiya",
                "正面清剿暗道怪物",
                "凯娅指出巢穴位置，你带队正面攻入。",
                2,
                threat=-2,
                flags=["准备清剿暗道"],
                starts_battle=True,
            ),
            _choice(
                "protect_supply_box",
                "保护补给箱不被拖走",
                "让布洛克和瑟琳守住补给箱，你和凯娅主攻怪物。",
                4,
                check={"label": "力量/安排", "stat_mod": 2, "prof_bonus": 2, "dc": 13},
                success_threat=-4,
                failure_threat=-2,
                flags=["保护补给"],
            ),
            _choice(
                "collapse_tunnel",
                "诱敌触发坍塌",
                "让怪物追入陷阱区，利用凯娅布置的绊线触发暗道部分坍塌压住怪物。",
                1,
                check={"label": "巧手/指挥", "stat_mod": 1, "prof_bonus": 2, "dc": 14},
                success_threat=-5,
                failure_threat=-2,
                failure_contamination=1,
                flags=["利用暗道机关"],
            ),
        ],
    },

    # ============================================================
    # 瑟琳支线：银杖的第一次裂痕
    # ============================================================
    "serin_cracked_silver_staff": {
        "id": "serin_cracked_silver_staff",
        "companion": {
            "id": "serin",
            "name": "瑟琳",
            "trust_key": "trust_sl",
            "portrait": "银杖术士",
        },
        "title": "银杖的第一次裂痕",
        "location": "黑石根区前沿休整点",
        "eyebrow": "同伴支线 / 第一幕·伏笔",
        "summary": "Boss 战前休整时，黑石脉冲在瑟琳银杖上留下裂痕。她第一次明显慌乱——不是因为法杖损坏。",
        "opening": (
            "休整时，黑石根区深处传来一次低沉脉冲。瑟琳手中的银杖忽然亮起，又迅速暗下去。"
            "你看见杖身上出现了一道细小裂痕。瑟琳下意识握紧银杖，脸色比刚才更白。"
            "「没事……只是魔力回流不稳。」她说，但凯娅已经挑起了眉毛。"
        ),
        "objectives": [
            "判断瑟琳是否真的没事。",
            "选择安慰、追问、劝她休息或要求她继续。",
            "获得黑石干扰魔法的线索。",
            "根据信任值获得 Boss 前提示或银杖护符。",
        ],
        "free_chat_prompt": "瑟琳把银杖横放在膝上，指尖沿着新的裂痕轻抚。她没有抬头，但你知道她感觉到了你的目光。",
        "chat_topics": [
            "银杖为什么会裂",
            "黑石为什么会干扰魔法",
            "她为什么害怕「来不及」",
            "她是否需要休息",
            "她对 Boss 前方危险的判断",
        ],
        "forbidden": [
            "她来自未来",
            "玩家未来身份",
            "地底堡垒完整真相",
            "黑暗之门后方反转",
        ],
        "initial_state": {
            "phase": "opening",
            "trust": 55,
            "threat": 8,
            "max_threat": 8,
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
                "comfort_and_rest",
                "安慰她，并要求她先休息",
                "告诉她不管任务多重要，状态不好的人没法保护别人。让她先休息，再考虑施法。",
                10,
                threat=-2,
                flags=["关心瑟琳", "要求休息"],
            ),
            _choice(
                "ask_but_gentle",
                "追问她隐瞒了什么，但语气克制",
                "直接问她银杖裂痕不是普通魔力回流，你注意到她的恐惧——但不逼她说出全部。",
                5,
                check={"label": "洞察", "stat_mod": 1, "prof_bonus": 2, "dc": 13},
                success_threat=-2,
                flags=["追问但不逼问", "察觉恐惧"],
            ),
            _choice(
                "task_only",
                "只问法杖会不会影响任务",
                "保持专业距离，只关心银杖破裂对 Boss 战的战术影响。",
                0,
                threat=-1,
                flags=["任务至上"],
            ),
            _choice(
                "force_answer",
                "粗暴逼问她到底知道什么",
                "不再克制，直接逼问瑟琳银杖裂痕与她隐瞒的事。",
                -15,
                threat=1,
                contamination=1,
                flags=["粗暴逼问"],
                blocks_rewards=["银杖护符", "瑟琳的战前提示"],
            ),
            _choice(
                "keep_casting",
                "要求她继续施法，不要拖慢队伍",
                "让她别矫情，修复法杖后继续前进。",
                -20,
                threat=-1,
                contamination=1,
                flags=["强迫施法"],
                blocks_rewards=["银杖护符", "瑟琳的战前提示"],
            ),
            _choice(
                "analyze_pulse",
                "分析黑石脉冲对法术的影响",
                "用奥术知识判断黑石脉冲的频率和法术干扰之间的规律。",
                3,
                check={"label": "奥秘", "stat_mod": 1, "prof_bonus": 2, "dc": 14},
                success_threat=-3,
                flags=["分析黑石脉冲", "法术干扰情报"],
            ),
        ],
        # 瑟琳支线没有危机战斗——纯叙事
        "crisis_choices": [],
    },

    # ============================================================
    # 布洛克支线（已有）：回声菌林的假歌
    # ============================================================
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

# [已停用/归档] 旧版布洛克“回声菌林”和凯娅“少了两个封扣”仍保留在上方，
# 仅供查阅历史实现；从运行时注册表移除，接口不会再列出或启动它们。
for _legacy_event_id in ("block_echo_forest", "kaiya_broken_seals"):
    SIDE_EVENT_DEFINITIONS.pop(_legacy_event_id, None)


def create_side_event_session(event_id: str = "ailin_wounded_names", initial_trust: int | None = None) -> dict:
    if event_id not in SIDE_EVENT_DEFINITIONS:
        raise ValueError(f"支线事件 {event_id} 不存在")
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
        crisis_choices = event.get("crisis_choices", [])
        if crisis_choices:
            state["phase"] = "crisis"
            phase_note = "支线进入危机阶段。"
        else:
            # 无危机阶段的事件（如瑟琳支线），直接结算
            _complete_event(event, state)
            phase_note = state["result_text"]
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

    event_id = event["id"]
    rewards = []
    flags = set(state["flags"])
    blocked = set(state["blocked_rewards"])
    trust = state["trust"]

    if event_id == "ailin_wounded_names":
        if "白枝绷带" not in blocked and "稳定伤员" in flags:
            rewards.append("白枝绷带")
        if "遗物线索" in flags or "浅滩警告" in flags:
            rewards.append("巡逻队遗言线索")
        if not rewards and state["contamination"] <= 2:
            rewards.append("基础急救补给")

        if state["contamination"] >= 3:
            state["result_title"] = "带着孢粉脱险"
            state["result_text"] = "伤员被稳定住了，但帐篷内的孢粉已经渗入你的皮肤。艾琳完成祈祷后沉默地递来一杯净水。"
        elif "白枝祈祷" in flags and trust >= 70:
            state["result_title"] = "白枝下的名字"
            state["result_text"] = "伤员和阵亡者名册都被妥善记录。艾琳把白枝布符放入你掌心，低声念了一句话——你没有听清内容，但你听清了分量。"
        elif "抛弃伤员" in flags:
            state["result_title"] = "匆匆离开"
            state["result_text"] = "你没有回头，但伤员棚里压抑的咳嗽声跟着你走了一段。艾琳没有骂你，她的沉默比任何责备都更让你记到今天。"
        else:
            state["result_title"] = "救治完成"
            state["result_text"] = "伤员稳定下来，阵亡者名册被合上。艾琳洗净双手，朝你点了下头——那是修女对同伴的认可，不是礼仪。"
    elif event_id == "kaiya_broken_seals":
        if "软爪锁针" not in blocked and "尊重机关判断" in flags:
            rewards.append("软爪锁针")
        if "保留补给完整" in flags:
            rewards.append("猎人止血粉")
        if "黑市冷光灯" not in blocked and trust >= 70:
            rewards.append("黑市冷光灯")
        if "奥兰旧封条" not in blocked and ("了解黑市标记" in flags or "追问但不逼问" in flags):
            rewards.append("奥兰旧封条")
        if not rewards:
            rewards.append("少量暗道补给")

        if state["contamination"] >= 3:
            state["result_title"] = "带伤从暗道脱身"
            state["result_text"] = "怪物被击退，但你身上多了几道孢子划伤。凯娅把你拖出暗道，嘴上骂骂咧咧，手里的止血粉却没停。"
        elif "指责凯娅" in flags:
            state["result_title"] = "信任的裂痕"
            state["result_text"] = "暗道清扫完毕，但凯娅再没主动说过关于机关和标记的事。她仍然跟着队伍——只是不再提前警告暗处的危险。"
        elif trust >= 70:
            state["result_title"] = "暗道的尽头"
            state["result_text"] = "暗道另一端通向一个被废弃的黑市仓库。凯娅在门边留下一枚她自己的封扣，然后把补给递到你手里。"
        else:
            state["result_title"] = "清扫完毕"
            state["result_text"] = "暗道怪物被击退，补给品被回收。凯娅吹掉锁针上的孢粉，看了一眼剩下的补给箱：'下次再碰上，记得先检查锁。'"
    elif event_id == "serin_cracked_silver_staff":
        if "银杖护符" not in blocked and trust >= 70 and "强迫施法" not in flags:
            rewards.append("银杖护符")
        if "瑟琳的战前提示" not in blocked and trust >= 85 and "强迫施法" not in flags and "粗暴逼问" not in flags:
            rewards.append("瑟琳的战前提示")
        if not rewards:
            rewards.append("基础休整补给")

        if trust >= 85 and "关心瑟琳" in flags:
            state["result_title"] = "银杖的微光"
            state["result_text"] = "瑟琳把银杖护符放在你手中，指节在你掌心停了一瞬。'我不是只担心任务失败，我也担心你。'她的声音比平时轻，但你听到了。"
        elif trust >= 70:
            state["result_title"] = "法杖的裂痕"
            state["result_text"] = "银杖裂痕没有扩大。瑟琳告诉你黑石会干扰法术稳定性，更频繁的脉冲可能在 Boss 战中再次出现。"
        elif "强迫施法" in flags or "粗暴逼问" in flags:
            state["result_title"] = "碎片"
            state["result_text"] = "瑟琳封住了银杖的裂痕，但她没有解释任何事。你们之间的沉默比黑石根区的静默更深。任务仍然继续——只是她再也不看你。"
        else:
            state["result_title"] = "休整结束"
            state["result_text"] = "银杖的裂痕暂时稳定。瑟琳重新握紧法杖，朝Boss战场地的方向微微抬头。她知道前方有什么——但此刻还不到说出来的时候。"
    elif event_id == "block_echo_forest":
        if "暖孢浓汤" not in blocked and "尊重生态判断" in flags and state["contamination"] <= 1:
            rewards.append("暖孢浓汤")
        if {"协助采样", "净化粉就绪"} & flags or "识别回声规律" in flags:
            rewards.append("铁锅解毒丸")
        if trust >= 70 and "净化粉就绪" in flags and "回声菌粉" not in blocked:
            rewards.append("回声菌粉")
        if not rewards and state["contamination"] <= 2:
            rewards.append("少量安全菌丝样本")

        if state["contamination"] >= 3:
            state["result_title"] = "带着孢粉脱险"
            state["result_text"] = "队伍击退了污染菌核，但吸入了过量孢粉。布洛克会救场，却对鲁莽选择很不满意。"
        elif "大规模用火" in flags:
            state["result_title"] = "烧开的道路"
            state["result_text"] = "火焰逼退了拟声孢群，也烧坏了健康菌林。道路打开了，布洛克的沉默比责备更重。"
        elif trust >= 70:
            state["result_title"] = "净化菌核"
            state["result_text"] = "污染菌核被压制，回声渐渐恢复为自然的重复声。布洛克罕见地承认你不是只会砍东西的人。"
        else:
            state["result_title"] = "击退污染"
            state["result_text"] = "队伍稳定住局面，污染藤蔓缩回菌盖阴影。布洛克把剩下的净化粉收好，提醒你别把漂亮当安全。"

    state["phase"] = "dialogue"
    state["completed"] = True
    state["rewards"] = rewards


def _queue_side_event_battle(state: dict, battle_id: str | None = None) -> str:
    state["phase"] = "battle_pending"
    state["pending_battle"] = battle_id or "block_echo_forest_battle"
    return "支线进入战斗。"


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
