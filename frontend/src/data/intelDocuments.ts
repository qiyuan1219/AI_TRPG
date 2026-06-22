/**
 * 情报档案数据库 —— 第一幕完整情报类道具
 *
 * 设计原则（参考 AI跑团行动检定与调查档案系统设计.md）：
 * 1. 覆盖全部11个剧情地点，每地3-5份情报
 * 2. 同一关键信息提供多个获取入口（防止检定失败卡关）
 * 3. 情报支持在背包中分类展示和全文阅读
 * 4. 部分情报解锁后续对话、行动或路线
 *
 * 使用方式：
 *   import { INTEL_DATABASE, getIntelByLocation, getIntelById } from './intelDocuments';
 *   const guildIntel = getIntelByLocation('guild');
 *   const doc = getIntelById('report_missing_expedition_01');
 */

// ── 类型定义 ──────────────────────────────────────────────

/** 情报获取难度 */
export type IntelRarity = 'common' | 'uncommon' | 'rare' | 'key';

/** 情报分类 */
export type IntelCategory = 'report' | 'log' | 'map' | 'letter' | 'record' | 'note' | 'ledger' | 'scripture';

/** 获取方式 */
export interface IntelAcquisition {
  method: string;           // 获取方式描述
  check?: {                 // 检定条件
    skill: string;
    dc: number;
  };
  location: string;         // 所属地点
  hints: string[];          // 触发行动提示词
}

/** 情报文档章节 */
export interface IntelSection {
  heading: string;
  body: string;
}

/** 单条情报文档 */
export interface IntelDocument {
  id: string;
  name: string;
  category: IntelCategory;
  rarity: IntelRarity;
  icon: string;             // 图标标识
  summary: string;          // 一行摘要（背包列表显示）
  source: string;           // 来源地点/人物
  acquisition: IntelAcquisition[];
  sections: IntelSection[];
  tags: string[];
  unlocks?: string[];       // 解锁的对话/行动/路线 ID
  relatedDocuments?: string[]; // 关联情报 ID
}

/** 地点情报汇总 */
export interface LocationIntel {
  locationId: string;
  locationName: string;
  documents: IntelDocument[];
}

// ── 情报数据库 ────────────────────────────────────────────

export const INTEL_DATABASE: IntelDocument[] = [

  // ================================================================
  //  地点1：冒险者公会
  // ================================================================

  {
    id: 'report_missing_expedition_01',
    name: '第三远征队失联报告',
    category: 'report',
    rarity: 'key',
    icon: 'scroll-sealed',
    summary: '一份记录第三远征队失联前最后行动轨迹的公会认证报告，火漆已被拆开。',
    source: '冒险者公会 · 报告单堆',
    acquisition: [
      {
        method: '在公会柜台旁翻阅报告单堆',
        check: { skill: '调查', dc: 12 },
        location: 'guild',
        hints: ['翻阅公会报告单', '调查柜台旁的文件堆', '查看远征队档案'],
      },
      {
        method: '向米娜询问最近失踪的远征队',
        check: { skill: '说服', dc: 13 },
        location: 'guild',
        hints: ['向米娜打听远征队', '询问文书员失踪记录'],
      },
    ],
    sections: [
      {
        heading: '一、队伍信息',
        body: '第三远征队共七人，队长为公会认证调查员科恩·灰索。队员包括一名矮人工程专家、一名半精灵药剂师、一名侏儒信标操作员及三名资深护卫。于三个月前从逆穹城降渊缆梯出发，目标为地底堡垒旧址。',
      },
      {
        heading: '二、装备与补给',
        body: '队伍配备制式冷光灯、抗孢面罩、两套远程信标、一份深层矿道残图及足够二十日的口粮与净水药剂。另携带公会签发的采集许可与紧急撤离符文。',
      },
      {
        heading: '三、最后回报',
        body: '最后一次信标回报于出发后第九日。内容提到："矿道深处出现大面积蓝绿色菌斑，覆盖范围远超此前记录。墙壁内部传来有规律的敲击声，像某种回音，又像在回应我们的脚步。"',
      },
      {
        heading: '四、异常情况',
        body: '第十日凌晨，所有信标在同一时刻同时熄灭。此后未再收到任何信号。城防观测台确认深层区域出现一次短暂魔力脉冲，波形与地心之门封印震颤记录高度相似。',
      },
      {
        heading: '五、残缺备注',
        body: '报告末尾附着队长科恩在被墨水划掉前留下的最后一行字。经复原处理后只能辨认出："不要靠近发光铆钉的尽头——它们不再只是指路。"',
      },
      {
        heading: '六、公会结论',
        body: '第三远征队被正式列为"深层失联"。赫尔曼已暂停后续派遣，并建议等待外部调查力量抵达。本报告附加限制阅览标记。',
      },
    ],
    tags: ['expedition', 'missing', 'underdark', 'main_quest', 'spore_beast', 'beacon'],
    unlocks: ['dialogue_mila_spore_beast', 'route_warning_glowing_rivets', 'clue_beacon_simultaneous_failure'],
    relatedDocuments: ['register_missing_expeditions', 'map_deep_mine_fragment'],
  },

  {
    id: 'register_missing_expeditions',
    name: '失踪远征队登记册',
    category: 'record',
    rarity: 'uncommon',
    icon: 'book-open',
    summary: '一本厚重的登记册，记录了过去五年间所有未归的远征队基本信息。',
    source: '冒险者公会 · 档案柜',
    acquisition: [
      {
        method: '向米娜请求查看失踪记录档案',
        check: { skill: '说服', dc: 11 },
        location: 'guild',
        hints: ['查看失踪登记册', '翻阅公会档案柜', '询问米娜往期失踪记录'],
      },
    ],
    sections: [
      {
        heading: '一、登记册概况',
        body: '近五年来共有十一支远征队出发前往地底堡垒方向。其中六支在规定时间内返回，三支超期但最终返回（人员均有不同程度损伤），两支被列为"深层失联"。',
      },
      {
        heading: '二、第一远征队',
        body: '六人，两年前出发。成功抵达地底堡垒外围并确认堡垒主体结构完整。报告提到堡垒内部灯光全灭、守备部队无响应、大门呈半开状态。因补给耗尽未进一步深入。',
      },
      {
        heading: '三、第二远征队',
        body: '五人，一年半前出发。在深层矿道遭遇大规模菌毯覆盖后折返。一名队员出现轻度孢化症状，经治疗后恢复。报告提到"矿道中有被新近搬动过的补给箱"。',
      },
      {
        heading: '四、第四远征队（未归）',
        body: '四人，两个月前出发——在第三远征队失联后，公会仍派出了第四支小队试图紧急联络。装备了改良信标和加倍补给。最后回传内容仅为："矿道变了。以前的岔路现在通向不同的方向。"',
      },
      {
        heading: '五、规律观察',
        body: '登记册的边栏有人用铅笔标注：失联频率在近一年内显著上升。标注者未署名，但字迹与赫尔曼的签名比对高度一致。',
      },
    ],
    tags: ['expedition', 'missing', 'guild', 'record', 'pattern'],
    unlocks: ['clue_missing_frequency_increasing', 'clue_mine_tunnel_changed'],
    relatedDocuments: ['report_missing_expedition_01'],
  },

  {
    id: 'helman_personal_note',
    name: '赫尔曼的抽屉笔记',
    category: 'note',
    rarity: 'rare',
    icon: 'note-pencil',
    summary: '一张从赫尔曼私人抽屉夹层中找到的便签，字迹潦草而急促。',
    source: '冒险者公会 · 赫尔曼办公室',
    acquisition: [
      {
        method: '趁赫尔曼离开时快速检查他的办公桌',
        check: { skill: '巧手', dc: 14 },
        location: 'guild',
        hints: ['检查赫尔曼办公桌', '趁没人翻找抽屉'],
      },
      {
        method: '大成功观察柜台报告单时额外发现',
        check: { skill: '调查', dc: 17 },
        location: 'guild',
        hints: ['仔细观察报告单堆的夹层'],
      },
    ],
    sections: [
      {
        heading: '便签内容',
        body: '"不能再派人了。堡垒里有什么东西在往外扩散，那些菌斑不是自然生长——它们在跟着信标信号的方向蔓延。第四次远征队的信标在熄灭前移动了十七个小时，但方向完全错误。不是往下走，而是在往上，往城的方向。黑石观测台的数据我压下来了，但压不了太久。"',
      },
      {
        heading: '附加信息',
        body: '便签背面画了一个粗糙的环形符号，中间标注"封印震颤频率×2.7"。环形外侧写了一个地名——黑石观测台，并划了下划线。',
      },
    ],
    tags: ['helman', 'secret', 'blackstone', 'seal_tremor', 'spore_spread'],
    unlocks: ['clue_spore_follows_beacon', 'clue_seal_tremor_2_7x', 'location_observatory_hint'],
  },

  {
    id: 'commission_letter_detail',
    name: '指名委托书原件',
    category: 'letter',
    rarity: 'common',
    icon: 'scroll-quill',
    summary: '三个月前送达的指名委托书，羊皮纸边缘略微发黄。',
    source: '冒险者公会 · 委托档案',
    acquisition: [
      {
        method: '检查委托火漆与公会认证标识',
        check: { skill: '调查', dc: 10 },
        location: 'guild',
        hints: ['检查委托书', '确认委托火漆', '查看公会认证'],
      },
    ],
    sections: [
      {
        heading: '委托正文',
        body: '"谨以逆穹城冒险者公会名义，指名委托赏金猎人{name}。任务内容：深入幽暗地域，抵达逆穹悬城。调查地底堡垒与历次远征队失联的原因。确认地心之门封印状态。带回生还者、调查记录，或者足以证明真相的证据。"',
      },
      {
        heading: '委托条款',
        body: '委托报酬：基础酬金800金，附加危险津贴按实际深入层级递增。公会将提供基础装备、情报支援及不超过五人的远征小队编制。危险等级：未标注上限。委托有效期：直至委托人主动撤销或调查结论成立。',
      },
      {
        heading: '火漆分析',
        body: '火漆印章为公会正式认证徽记（剑盾纹章），封印完整。但在放大检查后，火漆边缘有极细微的二次加热痕迹——有人在火漆未完全凝固时拆开并重新封合过。',
      },
    ],
    tags: ['commission', 'player', 'guild', 'main_quest'],
    unlocks: ['clue_seal_tampered'],
  },

  // ================================================================
  //  地点2：回声酒馆
  // ================================================================

  {
    id: 'salo_intel_notes',
    name: '萨洛的情报卡片',
    category: 'note',
    rarity: 'uncommon',
    icon: 'cards',
    summary: '几张用细绳捆在一起的情报卡片，萨洛的习惯——把每条情报写在一张扑克牌大小的硬纸片上。',
    source: '回声酒馆 · 萨洛',
    acquisition: [
      {
        method: '快艇骰子获胜后萨洛赠送',
        check: undefined,
        location: 'tavern',
        hints: ['赢下快艇骰子'],
      },
      {
        method: '付100金直接购买',
        check: undefined,
        location: 'tavern',
        hints: ['付钱购买情报'],
      },
    ],
    sections: [
      {
        heading: '卡片一：艾琳 · 白枝修女',
        body: '"静默神殿。今晚主持安魂仪式。白枝修会的核心信条：伤者不是负担，牺牲不是数字。擅长治疗、净化与心灵稳定。不擅长说谎，所以别让她替你圆场。"',
      },
      {
        heading: '卡片二：布洛克 · 深层生存专家',
        body: '"酒馆二楼，靠窗位置。矮人铁锅挂在背包外侧——那是他的标志。会先让你喝酒再谈正事。入队条件：采集三份活性孢子样本，不准烧菌巢，报酬按件结算。别在他面前说「蘑菇都差不多」。"',
      },
      {
        heading: '卡片三：凯娅 · 黑市猎手',
        body: '"黑市，找奥兰——护符摊位。萨洛的暗号：「断缆不问来路」。她曾是地下怪物猎人，懂机关和暗道。要钻石，从奥兰的幸运盲盒抽——五十金一次，十八点以上出钻石，出不出看骰子。"',
      },
      {
        heading: '卡片四：额外情报 · 云苓（高胜局奖励）',
        body: '"黑市深处，过了二手符文区再左转——云苓的小药铺。前公会药剂师，认识所有失联远征队的用药记录。她手里有深层污染的特效药，但不会白给。出示公会徽记能便宜两成。"',
      },
      {
        heading: '卡片五：萨洛的潦草备注',
        body: '"别在酒馆里翻赫尔曼的旧账。也别说你是来调查堡垒的——最近两个月，只要提到地底堡垒，总有人第二天就改变行程，好像被什么警告过。"',
      },
    ],
    tags: ['salo', 'intel', 'companions', 'recruitment_hint'],
  },

  {
    id: 'tavern_rumor_board',
    name: '酒馆传闻便条',
    category: 'note',
    rarity: 'common',
    icon: 'note-pin',
    summary: '钉在酒馆布告栏角落的几张便条，上面写着矿工和守卫的零星见闻。',
    source: '回声酒馆 · 布告栏',
    acquisition: [
      {
        method: '查看酒馆布告栏',
        check: { skill: '调查', dc: 10 },
        location: 'tavern',
        hints: ['查看布告栏', '阅读酒馆便条'],
      },
    ],
    sections: [
      {
        heading: '便条一',
        body: '"上周主缆三号线在凌晨停摆了十七秒。不是检修。法阵工说传感器显示缆绳被「从下方」拉了一下。缆梯井里没有风，但那次传感器全都报了压力异常。"',
      },
      {
        heading: '便条二',
        body: '"黑石观测台昨晚又亮起红光。值班老头说这次震动持续了九分钟——以前从未超过三分钟。观测台已经有人开始收拾东西。"',
      },
      {
        heading: '便条三',
        body: '"补给市场的铁匠说，最近两个月卖出的武器比过去两年都多。不是远征队在买，是普通人在囤。有人说看见守卫私下在护甲内侧刻护身符文。"',
      },
    ],
    tags: ['rumor', 'tavern', 'city_tension'],
    unlocks: ['clue_city_on_edge', 'clue_main_cable_anomaly'],
  },

  // ================================================================
  //  地点3：静默神殿
  // ================================================================

  {
    id: 'temple_sacrifice_record',
    name: '牺牲者遗录',
    category: 'record',
    rarity: 'uncommon',
    icon: 'book-prayer',
    summary: '一本厚重的皮质书册，内页以工整的修道院字体记录着历年远征牺牲者的名字、职务与最后所在地。',
    source: '静默神殿 · 遗物陈列台',
    acquisition: [
      {
        method: '在安魂仪式后向艾琳请求翻阅遗录',
        check: { skill: '宗教', dc: 12 },
        location: 'temple',
        hints: ['翻阅牺牲者遗录', '请求查看阵亡名单'],
      },
    ],
    sections: [
      {
        heading: '一、近期记录',
        body: '最近六个月新增了十四人。其中九人来自第三和第四远征队，其余为单独的巡逻队员和矿井工程师。值得注意的是，有五人的遗体并未被找到，遗录上标注为"名在身未归"。',
      },
      {
        heading: '二、共同特征',
        body: '十四人中，有十一人最后的记录位置都在"深层矿道第三岔口以南"。此地距离地底堡垒直线距离不足两公里。艾琳在页边加注：孢化污染可能让亡者无法安息。',
      },
      {
        heading: '三、艾琳的笔迹',
        body: '遗录末尾，有人用细笔写道："如果有一天我的名字出现在这里，请在白枝烛前念一遍我救过的人的名字。不用念我的。"字迹与艾琳签名完全吻合。',
      },
    ],
    tags: ['temple', 'sacrifice', 'ailin', 'expedition'],
    relatedDocuments: ['ailin_white_branch_scripture'],
  },

  {
    id: 'ailin_white_branch_scripture',
    name: '白枝修会巡礼经文',
    category: 'scripture',
    rarity: 'uncommon',
    icon: 'scroll-holy',
    summary: '一本艾琳随身携带的巡礼经文，封面绣着白色枝条图案，内页边缘因反复翻阅而磨损。',
    source: '静默神殿 · 艾琳',
    acquisition: [
      {
        method: '艾琳信任值≥70时主动展示',
        check: undefined,
        location: 'temple',
        hints: ['与艾琳深入交谈'],
      },
    ],
    sections: [
      {
        heading: '一、白枝誓约',
        body: '"手持白枝者，视伤者为同伴，视亡者为先行。不论身份、罪责或出身，凡在痛楚中伸出手的，便不可将其当作损耗计算。"',
      },
      {
        heading: '二、关于牺牲',
        body: '"牺牲不是数字。每一具被留在黑暗中的遗体，都曾有人等他们回家。若不能带回身体，至少要带回名字。若连名字也带不回，至少记住——有人曾在这里倒下，是为了让更多人往前走。"',
      },
      {
        heading: '三、关于净化',
        body: '"被黑石污染侵蚀者，并非不洁。深层污染是外来的侵蚀，不是人心的堕落。净化之术不是为了驱逐污秽者，而是为了分离不属于此世的附着。"',
      },
    ],
    tags: ['ailin', 'white_branch', 'scripture', 'character_depth'],
  },

  // ================================================================
  //  地点4：黑市
  // ================================================================

  {
    id: 'orlan_box_journal',
    name: '奥兰的盲盒账本',
    category: 'ledger',
    rarity: 'rare',
    icon: 'book-accounts',
    summary: '一本塞在盲盒柜底下的旧账本，记录了奥兰经手过的部分特殊物品。',
    source: '黑市 · 奥兰摊位',
    acquisition: [
      {
        method: '盲盒抽取10次后，奥兰打开暗格时可见',
        check: { skill: '洞察', dc: 13 },
        location: 'blackmarket',
        hints: ['趁奥兰开暗格时瞥向账本'],
      },
    ],
    sections: [
      {
        heading: '一、特殊物品记录',
        body: '账本前几页是普通杂货。翻到中间，字迹变小："D级洁净钻石×1——凯娅预定，收半价。备注：不要让她知道我已经扣下了她上次追货的尾款。""密封样本瓶×12——全部卖给同一个买家，每隔四天来取一次。名字没留。问太多问题的人，不适合在黑市做生意。"',
      },
      {
        heading: '二、欠账标记页',
        body: '末页只有一列符号：奥兰旧封条编号、人名缩写、金额，以及标注"已结""欠"或"抹掉"。其中一条写着"K.L. — 空晶石捕网×2 — 未结 — 她说会还，但她从不还人情"。K.L. 指凯娅。',
      },
      {
        heading: '三、被撕掉的页面',
        body: '账本最后几页被整齐撕去，残留的撕痕显示撕页者用了尺子——不是仓促破坏，而是在掩盖某条不想被发现的记录。',
      },
    ],
    tags: ['orlan', 'blackmarket', 'kaiya', 'ledger'],
    unlocks: ['clue_kaiya_owes_orlan', 'clue_sealed_vials_bought_by_unknown'],
  },

  {
    id: 'blackmarket_tunnel_map',
    name: '黑市暗道草图',
    category: 'map',
    rarity: 'rare',
    icon: 'map-folded',
    summary: '一张画在旧布料上的简易地图，标注了黑市斜巷下方的暗道网络。',
    source: '黑市 · 凯娅',
    acquisition: [
      {
        method: '凯娅支线"少了两个封扣"中高信任获得',
        check: { skill: '巧手', dc: 14 },
        location: 'blackmarket',
        hints: ['帮凯娅拆机关锁', '尊重她的机关判断'],
      },
    ],
    sections: [
      {
        heading: '地图内容',
        body: '地图标注了三条暗道：一条通向补给市场后巷（被标记为"安全·但有人蹲守"），一条通向缆梯检修通道（标记为"紧急撤离用·需拆三道旧锁"），第三条通向废弃黑市仓库，旁边写着"这里曾存有远征队回收物资——被人搬空了，但不是公会的人搬的"。',
      },
      {
        heading: '凯娅的备注',
        body: '地图边缘有凯娅的笔迹："地底的黑市比地面的更诚实。地面上的人会骗你，是因为他们还有地方可逃。在地下，能活下来的商人至少知道一件事——信誉比金币难赚。"',
      },
    ],
    tags: ['blackmarket', 'kaiya', 'tunnel', 'escape_route'],
    unlocks: ['route_tunnel_shortcut'],
  },

  // ================================================================
  //  地点5：降渊缆梯中枢
  // ================================================================

  {
    id: 'elevator_maintenance_log',
    name: '缆梯检修日志',
    category: 'log',
    rarity: 'common',
    icon: 'clipboard',
    summary: '钉在缆梯操作室墙上的检修记录板，最后几行字迹越来越潦草。',
    source: '降渊缆梯中枢 · 操作室',
    acquisition: [
      {
        method: '在缆梯平台观察检修记录',
        check: { skill: '调查', dc: 10 },
        location: 'elevator',
        hints: ['查看检修记录', '观察缆梯状态'],
      },
    ],
    sections: [
      {
        heading: '最近检修记录',
        body: '"第三次月度检修：主缆张力正常，符文阵响应延迟0.3秒（容许范围）。操作员注：最近三次下降都出现了中途轻微摆动，原因不明。可能是下方气流变化，也可能是吊舱配重需要重新校准。"',
      },
      {
        heading: '异常记录（三周前）',
        body: '"吊舱在下行至第四层平台时出现了17秒信号中断。恢复后一切正常。操作员注：不是设备故障——是有什么东西在那一层屏蔽了信标。"',
      },
      {
        heading: '最后一次记录（一周前）',
        body: '"吊舱回收时，舱体外壁发现三道划痕。不像是金属碰撞，更像是爪子或利器留下的。已上报城防，等待回复。"',
      },
    ],
    tags: ['elevator', 'maintenance', 'anomaly'],
    unlocks: ['clue_elevator_scratches'],
  },

  // ================================================================
  //  地点6：孢海据点
  // ================================================================

  {
    id: 'nibu_patrol_journal',
    name: '尼布的巡逻日志',
    category: 'log',
    rarity: 'common',
    icon: 'journal',
    summary: '孢海据点守夜人尼布的皮面日志，记录了最近几周的据点周边巡逻情况。',
    source: '孢海据点 · 尼布处',
    acquisition: [
      {
        method: '向尼布索要近期巡逻记录',
        check: { skill: '说服', dc: 11 },
        location: 'spore_outpost',
        hints: ['询问尼布巡逻情况', '查看据点记录'],
      },
    ],
    sections: [
      {
        heading: '一、常规巡逻',
        body: '每日两次巡视据点平台周边三百步范围。蓝伞浅滩方向菌毯亮度在过去两周内增加了约四成。尼布备注："不只是更亮了——光的颜色在从冷蓝变成青白。以前只有深处才这么亮。"',
      },
      {
        heading: '二、异常声音记录',
        body: '第三夜：听到蓝伞浅滩方向传来有节奏的敲击声，像金属撞击岩石。持续约二十分钟后停止。次日清晨在浅滩边缘发现被翻动的泥土，但没有任何脚印。',
      },
      {
        heading: '三、补给异常',
        body: '第五夜：据点平台外侧的补给箱少了一箱。锁扣完好，不像是被撬的。尼布怀疑是之前的巡逻队取走，但没有留条。补给箱内的主要失踪物：抗孢面罩×2、冷光灯×1。',
      },
    ],
    tags: ['nibu', 'patrol', 'spore_outpost', 'anomaly'],
    unlocks: ['clue_blue_shoal_brightness_increase'],
  },

  {
    id: 'outpost_supply_inventory',
    name: '据点补给清单',
    category: 'record',
    rarity: 'common',
    icon: 'scroll-list',
    summary: '一张夹在木箱内侧的补给清单，列出了据点现存物资与过往领取记录。',
    source: '孢海据点 · 补给箱',
    acquisition: [
      {
        method: '检查据点补给箱',
        check: { skill: '调查', dc: 12 },
        location: 'spore_outpost',
        hints: ['检查补给箱', '查看物资清单'],
      },
    ],
    sections: [
      {
        heading: '一、现存物资',
        body: '抗孢面罩×3，冷光灯×4（其中一盏亮度不稳定），止血粉×6，净水药剂×8，应急口粮×12日份，信号弹×2。备注：信号弹只有在确认有人能看见时才使用——孢海深处没有救援队。',
      },
      {
        heading: '二、最近领取记录',
        body: '三天前：蓝伞浅滩巡逻队领取抗孢面罩×2、冷光灯×1。巡逻队共三人，至今未归。尼布在领取记录的备注栏写："如果明晚还不回来，我会去浅滩找。"该条记录旁有另一人批注——"如果明晚还不回来，别去。"批注人未署名。',
      },
    ],
    tags: ['supply', 'outpost', 'missing_patrol'],
  },

  {
    id: 'shallow_map_spore_sea',
    name: '孢子海浅层地图',
    category: 'map',
    rarity: 'key',
    icon: 'map-parchment',
    summary: '尼布交给队伍的浅层地图，标注了从据点到旧远征停靠点的路线。',
    source: '孢海据点 · 尼布',
    acquisition: [
      {
        method: '尼布在对话中主动提供',
        check: undefined,
        location: 'spore_outpost',
        hints: ['抵达孢海据点后自动获得'],
      },
    ],
    sections: [
      {
        heading: '地图标注',
        body: '路线经过蓝伞浅滩（标注"近期异常发亮·注意荧光"）、一块标记为"回声区"的菌林（标注"别回应任何喊声"），以及一个被红圈圈出的位置——旧远征停靠点，旁边写着"还有路标残留，但路标可能已经不是原来的方向了"。',
      },
      {
        heading: '尼布的警告',
        body: '地图反面用炭笔写了一行字："别追异常荧光。别回应远处的喊声。会喊人的东西，不一定还是人。如果你迷路了——不要相信任何看起来太像出口的方向。"',
      },
    ],
    tags: ['map', 'spore_sea', 'route', 'key_item'],
  },

  // ================================================================
  //  地点7：蓝伞浅滩（普通战斗一）
  // ================================================================

  {
    id: 'patrol_last_words',
    name: '巡逻队遗言线索',
    category: 'note',
    rarity: 'uncommon',
    icon: 'note-blood',
    summary: '从上一支巡逻队遗留物中找到的残缺记录，写在一张被孢粉浸染的布条上。',
    source: '孢海据点 · 伤员棚 / 蓝伞浅滩入口',
    acquisition: [
      {
        method: '艾琳支线中成功通过洞察或调查检定',
        check: { skill: '调查', dc: 13 },
        location: 'spore_outpost',
        hints: ['检查阵亡者遗物', '从伤员断续话语中提取信息'],
      },
      {
        method: '蓝伞浅滩战前感知检定成功',
        check: { skill: '感知', dc: 14 },
        location: 'blue_shoal',
        hints: ['留意浅滩边缘的残留物品'],
      },
    ],
    sections: [
      {
        heading: '布条内容',
        body: '"浅滩里有光带——不是菌毯在亮，是光本身在动。它们会围着你转，像在看你。跟着光走的人，走到一半就忘了自己要回据点。别盯着光看太久。也别相信浅滩上任何看起来太像路的方向。它想让你走的方向，全是往深处——没有一条是往据点。"',
      },
      {
        heading: '附加发现',
        body: '布条的另一面画着一个粗糙的地图标记：蓝伞浅滩中有一片被标为"安静区"的区域。该区域周边没有任何菌毯发光，连孢粉都极少。"安静区"旁边写了一个字——"怕"？还是"跑"？字迹太模糊无法辨认。',
      },
    ],
    tags: ['patrol', 'blue_shoal', 'warning', 'light_anomaly'],
    unlocks: ['clue_light_will_lure_you', 'route_blue_shoal_safe_zone'],
  },

  // ================================================================
  //  地点8：回声菌林（布洛克支线）
  // ================================================================

  {
    id: 'brock_ecology_notes',
    name: '布洛克的孢海生态笔记',
    category: 'note',
    rarity: 'uncommon',
    icon: 'journal-leaf',
    summary: '布洛克随身携带的防水笔记本，里面用简笔画和矮人文字记录了数十种孢海生物。',
    source: '回声菌林 · 布洛克',
    acquisition: [
      {
        method: '布洛克支线中高信任获得（信任≥70）',
        check: { skill: '自然', dc: 14 },
        location: 'echo_grove',
        hints: ['协助布洛克配置净化粉', '尊重他的生态判断'],
      },
    ],
    sections: [
      {
        heading: '一、回声菌',
        body: '"不是植物，更接近菌类与神经组织的混合体。成熟的回声菌群能捕捉周围声音，储存，并用菌丝振动还原。它模仿人声不是为了捕猎——它只是在重复它听到过的东西。让人害怕的不是它模仿了什么，而是它听到那些声音的时候，原来的人还在不在。"',
      },
      {
        heading: '二、蓝伞幼菌',
        body: '"蓝伞浅滩的大型菌伞在幼苗阶段需要靠动物尸体或腐烂植物提供养分。所以如果一片蓝伞长得特别密，说明下面曾经有过大量有机物——不是自然堆积的那种。有人在浅滩里喂过它们。"',
      },
      {
        heading: '三、污染菌核',
        body: '"被黑石污染侵蚀的菌核表面会出现黑色结晶纹路。健康的菌核会主动避开这种污染——但如果整片地都被污染了，它们没法跑，只能慢慢硬化。别烧。净化比焚烧更难，但不会杀死还没被污染的那一半。"',
      },
    ],
    tags: ['brock', 'ecology', 'spore_sea', 'knowledge'],
    unlocks: ['clue_blue_cap_fed_bodies', 'clue_cleanse_over_burn'],
  },

  // ================================================================
  //  地点9：前线废弃据点
  // ================================================================

  {
    id: 'abandoned_outpost_record',
    name: '废弃据点撤离记录',
    category: 'record',
    rarity: 'uncommon',
    icon: 'scroll-torn',
    summary: '在一张被钉在墙上又被撕去一半的记录单，残留部分是撤离指令的副本。',
    source: '前线废弃据点 · 墙壁',
    acquisition: [
      {
        method: '调查旧远征标记或墙壁残留',
        check: { skill: '调查', dc: 13 },
        location: 'abandoned_post',
        hints: ['调查旧远征标记', '阅读墙上残留文字'],
      },
    ],
    sections: [
      {
        heading: '一、撤离指令（残存部分）',
        body: '"——所有人员注意：立即从骨柱湿地方向撤离，不要走蓝伞浅滩。重复：不要走蓝伞浅滩。补给品能带多少带多少，但别为箱子停下。——发令人已无法辨认，但指令末尾盖有地底堡垒的旧纹章。"',
      },
      {
        heading: '二、被撕去的部分',
        body: '撕痕很新，不是撤离时的陈旧破损。有人近期回到过这里，刻意取走了指令的后半段内容。从残留的笔画推断，后半段可能包含一个地名或一个日期。',
      },
      {
        heading: '三、墙上的补充涂鸦',
        body: '指令下方有人用炭笔写了两行字："第一远征队留下了补给，但没留路标。""这里的路由人走出来的都不准——只有菌毯知道哪里能走。"',
      },
    ],
    tags: ['abandoned', 'evacuation', 'fortress_seal'],
    unlocks: ['clue_dont_go_blue_shoal', 'clue_record_torn_recently'],
  },

  {
    id: 'blackstone_contamination_report',
    name: '黑石污染初步报告',
    category: 'report',
    rarity: 'rare',
    icon: 'scroll-dark',
    summary: '一份从废弃据点补给箱夹层中找到的报告，纸张因黑石粉末侵蚀而出现黑色斑点。',
    source: '前线废弃据点 · 补给箱夹层',
    acquisition: [
      {
        method: '识别黑石微弱异常并深入调查',
        check: { skill: '奥秘', dc: 14 },
        location: 'abandoned_post',
        hints: ['识别黑石微弱异常', '调查墙体中的黑色结晶'],
      },
    ],
    sections: [
      {
        heading: '一、污染扩散范围',
        body: '黑石粉末或结晶的附着痕迹已从地底堡垒外围向骨柱湿地方向延伸了至少八百米。污染区域的菌类生物出现统一行为异常：菌毯停止生长、菌伞不再发光、孢子释放频率降低——像是整片生态系统在自我保护。',
      },
      {
        heading: '二、对生物的影响',
        body: '长期暴露在黑石污染中的动物和魔物表现出以下症状：定向能力丧失、攻击性增强、对符文光产生强烈排斥反应。有观察记录显示，一只被污染的骨柱孢兽试图用头部撞击黑石方尖碑碎片，连续撞击四小时后力竭倒下。',
      },
      {
        heading: '三、对法阵的影响',
        body: '黑石污染区域的防御符文效能下降约30%-60%。通讯符文在污染核心周边完全失效。报告建议：任何深入调查行动必须携带物理信号装置（信标或冷光灯），不要单独依赖魔法通讯。',
      },
    ],
    tags: ['blackstone', 'contamination', 'ecology', 'arcana'],
    unlocks: ['clue_blackstone_affects_magic', 'clue_contaminated_beasts_self_harm'],
  },

  // ================================================================
  //  地点10：骨柱湿地（普通战斗二）
  // ================================================================

  {
    id: 'bone_marsh_bestiary',
    name: '骨柱湿地怪物图鉴',
    category: 'record',
    rarity: 'uncommon',
    icon: 'book-skull',
    summary: '一本被防水油布裹着的速写本，记录了骨柱湿地及周边区域出没的魔物信息。',
    source: '骨柱湿地 · 废弃营地',
    acquisition: [
      {
        method: '骨柱湿地战前感知检定成功',
        check: { skill: '感知', dc: 14 },
        location: 'bone_marsh',
        hints: ['留意湿地周边残留营地', '搜索废弃装备袋'],
      },
    ],
    sections: [
      {
        heading: '一、骨柱孢兽',
        body: '"体型中等，背部覆盖骨白色菌柱碎片。会利用湿地泥沼进行伏击——它能在泥下静止长达六小时。弱点：菌柱碎片之间的软膜，用穿刺武器效果最好。注意：受伤后会释放孢子云，吸入过多会导致短暂方向感丧失。"',
      },
      {
        heading: '二、泥沼潜伏者',
        body: '"真菌与两栖类生物的混合变异体，腹部有吸盘，能在垂直菌柱表面攀爬。喜群居，通常两到三只协同狩猎。弱点：对冷光敏感，强光可使其中止攻击并退缩2-3秒。"',
      },
      {
        heading: '三、湿地生存建议',
        body: '"不要在骨柱湿地奔跑——震动会引起泥沼陷落。不要站在最亮的菌柱旁边——那是泥沼潜伏者的领地标记。如果听见身后有气泡声但回头什么都没看见——跑。不是因为后面有东西，而是因为前面的路正在合上。"',
      },
    ],
    tags: ['bestiary', 'bone_marsh', 'combat_hint'],
    unlocks: ['clue_spore_beast_weak_points', 'clue_mud_lurker_light_weakness'],
  },

  // ================================================================
  //  地点11：黑石根区前沿（Boss战前休整）
  // ================================================================

  {
    id: 'serin_silver_staff_observation',
    name: '瑟琳的银杖观测笔记',
    category: 'note',
    rarity: 'rare',
    icon: 'scroll-star',
    summary: '瑟琳在Boss战前休整时匆匆写下的一页观测记录，字迹因银杖裂痕带来的震动而微微发颤。',
    source: '黑石根区前沿 · 瑟琳',
    acquisition: [
      {
        method: '瑟琳支线中高信任获得（信任≥70）',
        check: { skill: '奥秘', dc: 14 },
        location: 'blackstone_root',
        hints: ['分析黑石脉冲频率', '追问瑟琳银杖裂痕的意义'],
      },
    ],
    sections: [
      {
        heading: '一、脉冲规律',
        body: '"黑石脉冲频率目前为每2-5秒一次。在即将进入脉冲高峰时，银杖表面的裂痕会先一步发光——它不是在损坏，而是在预警。黑石脉冲会干扰所有基于魔力回路的法术，效果包括：施法延迟、范围缩减、治疗量下降。"',
      },
      {
        heading: '二、安全站位建议',
        body: '"前沿区域中，靠近大块原生岩壁的位置受脉冲干扰最小。不要站在黑石方尖碑碎片的正前方，也不要在两根以上的碎片之间停留——共振效应会让干扰翻倍。建议分散站位，确保至少有两名队员在任何时刻能正常施法。"',
      },
      {
        heading: '三、关于门',
        body: '"黑暗之门本身不是污染源——它是封印。真正的问题在门的另一侧。千年前的封印并没有破裂，但它像一扇被重重敲击的铁门，正在松动。敲门的不是我们这一侧的东西。"',
      },
    ],
    tags: ['serin', 'silver_staff', 'boss_hint', 'seal'],
    unlocks: ['clue_boss_safe_position', 'clue_seal_not_broken_yet'],
  },

  {
    id: 'rhein_fragmented_testimony',
    name: '莱因的断片证言',
    category: 'note',
    rarity: 'key',
    icon: 'note-torn',
    summary: '莱因在精神污染间歇清醒时断续说出的零散信息，由艾琳记录在绷带包装纸上。',
    source: '骨柱湿地尽头 / 黑石根区前沿 · 莱因',
    acquisition: [
      {
        method: '帮助莱因后，在他间歇清醒时询问',
        check: { skill: '医疗', dc: 12 },
        location: 'bone_marsh',
        hints: ['尝试让莱因保持清醒', '询问莱因地底堡垒情况'],
      },
    ],
    sections: [
      {
        heading: '一、钟声',
        body: '"钟响了三次。第一次是集合——队长让我们关好大门，拉下闸门锁。第二次是警戒——观测台说黑石方尖碑在往外长，不是一块，是十几块同时。第三次是……第三次钟之后就没有命令了。队长只说了一句话：「别让它们碰到封印。」"',
      },
      {
        heading: '二、黑暗之门',
        body: '"门没有开。但它后面的东西，已经开始从门缝里挤出来了。不是身体——是声音，是颜色，是让你觉得身边战友突然变得陌生。我们在门前守了四天。第四天晚上，站在我右边的人突然开始唱一首歌，说那是他从门的另一边听到的。"',
      },
      {
        heading: '三、撤离时的意外',
        body: '"我们不是全部同时撤离的。队长让一部分人先走——包括我。断后的人留在了门前面。我不知道他们还在不在。我只记得临走时回头看了一眼——队长用剑柄敲了自己的头盔，意思是「别回头」。那是我最后一次看见活着的地底堡垒。"',
      },
    ],
    tags: ['rhein', 'fortress', 'boss', 'testimony'],
    unlocks: ['clue_bell_rang_three_times', 'clue_gate_leaking_influence'],
  },

  // ================================================================
  //  地点12：黑市药铺（云苓）
  // ================================================================

  {
    id: 'yunling_expedition_medicine_record',
    name: '远征队用药记录',
    category: 'record',
    rarity: 'uncommon',
    icon: 'scroll-medicine',
    summary: '云苓保存的一份详细用药记录，追踪了每一支经过她柜台的远征队的药剂需求变化。',
    source: '黑市深处 · 云苓药铺',
    acquisition: [
      {
        method: '购买净化之心后云苓主动提供',
        check: undefined,
        location: 'apothecary',
        hints: ['购买净化之心'],
      },
      {
        method: '在药铺消费满100金获得',
        check: undefined,
        location: 'apothecary',
        hints: ['在云苓处大量购买药水'],
      },
    ],
    sections: [
      {
        heading: '一、远征队用药趋势',
        body: '"一年前，远征队购买最多的药剂是标准治疗药水和体力恢复剂。半年前，净化剂的购买量突然飙升。三个月前——也就是第三远征队出发的那个月——来买药的人开始频繁提到「黑石污染」、「孢化抗性」和「心灵稳定」。他们买的药暗示了他们在下面遇到的东西。"',
      },
      {
        heading: '二、云苓的个人备注',
        body: '"我不是黑市药商里最便宜的，但我是唯一一个把每一支出征队伍的用药记录保存完整的人。公会说我对药材定价太高，但他们从不问为什么远征队活着回来的人越来越少。如果有人能把这些记录看完，他们会发现：不是药不够好——是下面变了。变化的速度超过了我的配方。"',
      },
    ],
    tags: ['yunling', 'medicine', 'expedition', 'trend'],
    unlocks: ['clue_expedition_medicine_trend'],
  },
];

// ── 查询函数 ──────────────────────────────────────────────

/**
 * 按地点获取全部情报
 */
export function getIntelByLocation(locationId: string): IntelDocument[] {
  return INTEL_DATABASE.filter((doc) =>
    doc.acquisition.some((acq) => acq.location === locationId),
  );
}

/**
 * 按ID获取单条情报
 */
export function getIntelById(id: string): IntelDocument | undefined {
  return INTEL_DATABASE.find((doc) => doc.id === id);
}

/**
 * 按标签筛选情报
 */
export function getIntelByTag(tag: string): IntelDocument[] {
  return INTEL_DATABASE.filter((doc) => doc.tags.includes(tag));
}

/**
 * 获取某条情报的所有关联情报（多入口线索）
 */
export function getRelatedIntel(docId: string): IntelDocument[] {
  const doc = getIntelById(docId);
  if (!doc?.relatedDocuments) return [];
  return doc.relatedDocuments
    .map((id) => getIntelById(id))
    .filter((d): d is IntelDocument => d !== undefined);
}

/**
 * 获取全部地点的情报汇总（用于生成地点面板）
 */
export function getLocationIntelSummary(): LocationIntel[] {
  const locationMap: Record<string, { name: string; docs: IntelDocument[] }> = {};

  for (const doc of INTEL_DATABASE) {
    for (const acq of doc.acquisition) {
      if (!locationMap[acq.location]) {
        locationMap[acq.location] = { name: '', docs: [] };
      }
      locationMap[acq.location].docs.push(doc);
    }
  }

  const locationNames: Record<string, string> = {
    guild: '冒险者公会',
    tavern: '回声酒馆',
    temple: '静默神殿',
    blackmarket: '黑市',
    elevator: '降渊缆梯中枢',
    spore_outpost: '孢海据点',
    blue_shoal: '蓝伞浅滩',
    echo_grove: '回声菌林',
    abandoned_post: '前线废弃据点',
    bone_marsh: '骨柱湿地',
    blackstone_root: '黑石根区前沿',
    apothecary: '黑市药铺（云苓）',
  };

  return Object.entries(locationMap).map(([id, data]) => ({
    locationId: id,
    locationName: locationNames[id] || id,
    documents: data.docs,
  }));
}

/**
 * 按category获取情报
 */
export function getIntelByCategory(category: IntelCategory): IntelDocument[] {
  return INTEL_DATABASE.filter((doc) => doc.category === category);
}

/**
 * 获取全部key级别情报
 */
export function getKeyIntel(): IntelDocument[] {
  return INTEL_DATABASE.filter((doc) => doc.rarity === 'key');
}
