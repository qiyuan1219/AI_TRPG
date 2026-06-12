/**
 * 固定剧情脚本 —— 不依赖 AI 生成，speaker 由数据显式指定。
 * AI 只负责玩家自由行动、检定结果与战斗/小游戏后的短承接。
 */

export interface ScriptedLine {
  speaker: string;
  text: string;
  portrait?: string;
  bgImage?: string;
}

export interface ScriptedScene {
  id: string;
  triggers: string[];
  lines: ScriptedLine[];
  hints: string[];
  setArea?: string;
  bgImage?: string;
  statePatch?: Record<string, any>;
  events?: string[];
  lastEvent?: string;
  autoDicePoker?: boolean;
  manualOnly?: boolean;
}

// ============================================================
// 教学战斗后 → 抵达冒险者公会，米娜给出三名队友线索
// ============================================================
const GUILD_ARRIVAL: ScriptedScene = {
  id: 'guild-arrival',
  triggers: ['前往冒险者公会', '去公会', '冒险者公会登记'],
  setArea: '逆穹悬城·冒险者公会',
  bgImage: '/assets/scenes/04guild-interior.webp',
  statePatch: {
    guild_registered: true,
    city_map_unlocked: true,
    team_target_size: 5,
    required_companions: '艾琳,布洛克,凯娅',
    al_recruited: false,
    sl_recruited: false,
    kl_recruited: false,
  },
  events: ['公会登记完成', '三名目标队友线索已获得', '城市地图已解锁'],
  lastEvent: '在冒险者公会登记，并从米娜处获得三名目标队友的基本信息',
  lines: [
    {
      speaker: '主持人',
      text: '你沿主缆街朝公会方向走去。',
      bgImage: '/assets/scenes/0101cable-street-walk.webp',
    },
    {
      speaker: '主持人',
      text: '你沿着主缆街朝倒挂塔楼区走去。街道两侧的符文灯将影子投在头顶的街石上，远处城市缆索发出低沉震响。公会建筑是一栋倒挂的石砌塔楼，门外挂着铁制剑盾徽记，门口贴着泛黄的任务单和悬赏令。',
    },
    {
      speaker: '主持人',
      text: '大厅里炉火很旺，却压不住空气里的潮冷。几名文书员在地图桌旁低声争论，黑缆守卫把带血的回收箱封条交给柜台后的银发女性。',
    },
    {
      speaker: '米娜',
      text: '「你就是地表王国指名调来的冒险者。米蕾娜·白契，叫我米娜就好。先登记，名字、职业、携带装备，写清楚。」',
    },
    {
      speaker: '主持人',
      text: '米娜把登记册推到你面前，又将三枚写着名字的铜牌压在地图边缘：艾琳、布洛克、凯娅。瑟琳站在你身侧，银杖的微光映在铜牌上。',
    },
    {
      speaker: '米娜',
      text: '「这次不是普通下潜。远征队标准配置是五人：你、瑟琳，再加三名能处理孢海、污染和暗线的人。」',
    },
    {
      speaker: '米娜',
      text: '「艾琳是静默神殿的白枝修女。她处理伤口、孢毒和恐慌都很稳，也读得懂牺牲者遗物里那些宗教符号。和她同行时记住一件事：不要把伤者当成路线成本。她会救人，这是她的力量，也是她的底线。」',
    },
    {
      speaker: '米娜',
      text: '「布洛克·铁锅常在回声酒馆出没。孢海的风向、菌毯、毒囊、迁徙痕迹，他比很多公会讲师都熟。别指望他被徽记打动，他要的是明确的采样许可、合理报酬，还有你们真的愿意听他的判断。」',
    },
    {
      speaker: '米娜',
      text: '「凯娅不在任何公开名单上。锁、陷阱、暗号、黑市假货，她都能看出门道。她不喜欢空话，也不喜欢欠账；如果你们想请她，就拿出能放在桌面上的筹码。」',
    },
    {
      speaker: '赫尔曼',
      text: '「地底堡垒失联十年，最近三个月魔物上涌频率翻了三倍。我们需要的是能活着抵达黑暗之门的人，不是漂亮的报名表。」',
    },
    {
      speaker: '米娜',
      text: '「三人的位置和性格细节，我这里不能写进公会明档。去回声酒馆找萨洛吧，他的情报很准，但他的规矩也烦人——陪他玩一局快艇骰子，他才肯透露他那珍贵的情报。」',
    },
    {
      speaker: '瑟琳',
      text: '「萨洛的赌桌比公会档案更诚实。我们先去酒馆拿完整情报，再按风险规划路线。」',
    },
  ],
  hints: [
    '前往回声酒馆找萨洛打听三名队友',
    '先查看失踪远征队登记册【调查DC12】',
    '追问赫尔曼最近魔物上涌细节【洞悉DC13】',
  ],
};

// ============================================================
// 回声酒馆 → 萨洛情报骰局
// ============================================================
const TAVERN_INTRO: ScriptedScene = {
  id: 'tavern-intro',
  triggers: ['前往回声酒馆', '去酒馆', '回声酒馆', '找萨洛', '前往回声酒馆找萨洛打听三名队友'],
  setArea: '逆穹悬城·回声酒馆',
  bgImage: '/assets/scenes/06tavern-interior.webp',
  autoDicePoker: true,
  statePatch: {
    tavern_salo_intro_seen: true,
  },
  events: ['抵达回声酒馆'],
  lastEvent: '抵达回声酒馆，准备与萨洛进行快艇骰子情报局',
  lines: [
    {
      speaker: '主持人',
      text: '回声酒馆藏在倒挂街区一条侧巷里。炉火、麦酒、潮湿木梁和旧皮革的气味混在一起，天花板上垂着一排铜铃，每当城市主缆震动，铃声就像很远的回音。萨洛靠在吧台后，胡茬修得很短，眼角却像常年没睡醒似的垂着，只有你们提到公会徽记时，他的笑意才慢慢从杯沿后浮出来。',
    },
    {
      speaker: '萨洛',
      text: '「公会的新远征队？米娜让你们来的吧。她每次说‘请你帮忙’，都像把欠条塞进我酒杯里。」',
    },
    {
      speaker: '瑟琳',
      text: '「我们需要艾琳、布洛克和凯娅的位置，也需要你对他们的看法。」',
    },
    {
      speaker: '萨洛',
      text: '「判断可以给，白送不行。快艇骰子，五颗骰，三轮重掷。赢了，我把话说细；输了，我也说，但你得承认我的酒馆比公会更懂人。」',
    },
    {
      speaker: '瑟琳',
      text: '瑟琳借着替你整理披肩的动作靠近耳侧，声音压得很低：「我的银杖能短时间看穿骰面。我可以给你建议，但最后保留什么、重掷什么，还是你决定。」',
    },
  ],
  hints: ['接受游戏', '付100G购买萨洛的情报'],
};

const SALO_COMPANION_INTEL: ScriptedScene = {
  id: 'salo-companion-intel',
  manualOnly: true,
  triggers: ['酒馆骰局结束获取队友情报'],
  setArea: '逆穹悬城·回声酒馆',
  bgImage: '/assets/scenes/06tavern-interior.webp',
  statePatch: {
    salo_intel_done: true,
    ailin_location_known: true,
    brock_location_known: true,
    kaiya_location_known: true,
  },
  events: ['萨洛给出三名队友详细情报'],
  lastEvent: '从萨洛处获得艾琳、布洛克、凯娅的位置与性格情报',
  lines: [
    {
      speaker: '萨洛',
      text: '「行，愿赌服输。先说白枝修女艾琳。她在静默神殿，今晚会替一批牺牲的黑缆守卫祈祷。你们去的时候别大声，别把她当随队药箱。」',
    },
    {
      speaker: '萨洛',
      text: '「她擅长治疗、净化和稳住快崩的人。弱点嘛，她太认真。你要是把伤员当路障，她会先治伤员，再考虑要不要继续跟你走。」',
    },
    {
      speaker: '萨洛',
      text: '「布洛克就在我这儿二楼睡觉，他不喜欢有人在他睡觉时打扰。他懂孢海，尤其是样本、菌毯、毒囊和怪物迁徙。想让他走，给他采样许可和报酬，还得陪他玩一轮喝酒骰子。」',
    },
    {
      speaker: '萨洛',
      text: '「凯娅在黑市。她不会因为公会徽记现身，米娜给你的暗号才有用。她擅长开锁、陷阱、暗号和坏交易。弱点是她只相信能握在手里的筹码。」',
    },
    {
      speaker: '萨洛',
      text: '「她最近盯上一颗钻石。奥兰·爵的幸运盲盒里有，二十金一次，骰点够高就能抽到。抽不到也别骂我，骂奥兰，他比较习惯。」',
    },
    {
      speaker: '瑟琳',
      text: '「路线很清楚了。先去静默神殿找艾琳。神殿离公会近，且她今晚就在安魂仪式上。之后回酒馆找布洛克，最后去黑市处理凯娅和钻石。」',
    },
  ],
  hints: [
    '前往静默神殿寻找艾琳',
    '向萨洛确认布洛克的采样报酬【说服DC12】',
    '询问凯娅暗号的使用方式【洞悉DC13】',
  ],
};

// ============================================================
// 静默神殿 → 艾琳入队
// ============================================================
const CATHEDRAL_AILIN_RECRUIT: ScriptedScene = {
  id: 'cathedral-ailin-recruit',
  triggers: ['前往静默神殿', '去静默神殿', '前往教堂', '去教堂', '寻找艾琳', '前往静默神殿寻找艾琳'],
  setArea: '逆穹悬城·静默神殿',
  bgImage: '/assets/scenes/05temple-interior.png',
  statePatch: {
    al_recruited: true,
    al_trust: 72,
    temple_ailin_recruited: true,
  },
  events: ['艾琳加入队伍'],
  lastEvent: '在静默神殿邀请艾琳加入远征队',
  lines: [
    {
      speaker: '主持人',
      text: '静默神殿嵌在一座倒悬石拱中，门楣上没有钟，只有一排白枝烛缓慢燃烧。烛光向下垂落，却不滴蜡，像一片被固定在空中的雪。',
    },
    {
      speaker: '主持人',
      text: '神殿大厅里摆着牺牲战士的遗物：折断的缆扣、裂开的护符、没有寄出的家书。几名修女站在灰布两侧，低声诵念安魂祷词。',
      bgImage: '/assets/scenes/11temple-prayer.webp',
    },
    {
      speaker: '瑟琳',
      text: '「先为他们祈祷吧。这里保存的不只是名字，也是我们必须下去的理由。」',
    },
    {
      speaker: '主持人',
      text: '你们在遗物台前停下。白枝烛的光落在瑟琳的银杖上，短暂映出一圈细小裂纹，又很快消失。',
    },
    {
      speaker: '艾琳',
      text: '「愿白枝引导他们穿过无声之处。愿后来者记住，牺牲不是数字，失踪也不是。」',
      portrait: '/assets/characters/ailin/ailin_prayer.webp',
    },
    {
      speaker: '主持人',
      text: '祷词结束后，艾琳收起圣徽，看向你们的公会徽记。她没有惊讶，像早已知道这一天会来。',
    },
    {
      speaker: '瑟琳',
      text: '「我们要去无光孢海，调查堡垒失联和魔物上涌。队伍需要治疗、净化，也需要一个在黑暗里还能守住底线的人。」',
    },
    {
      speaker: '艾琳',
      text: '「如果我加入，你们要答应一件事。伤者不是负重，遗体不是障碍。能救的人要救，不能带回的人，至少要带回名字。」',
    },
    {
      speaker: '主持人',
      text: '瑟琳没有立刻回答，而是看向你。神殿安静得能听见白枝烛燃烧的细声。',
    },
    {
      speaker: '艾琳',
      text: '「我会同行。孢毒、恐惧和伤口都不会等人。我能做的不多，但至少能让你们多撑过几次黑暗。」',
    },
    {
      speaker: '主持人',
      text: '艾琳将白枝修会的随行徽章别在药箱侧面，随后为你们做了一次简短祈祷。温和的光沿着护腕和衣领散开，像给远征队缝上第一道安全线。',
    },
  ],
  hints: [
    '回到回声酒馆寻找布洛克',
    '请艾琳检查队伍伤势【医药DC12】',
    '询问神殿保存的牺牲者遗录【宗教DC13】',
  ],
};

// ============================================================
// 回声酒馆 → 布洛克喝酒骰子
// ============================================================
const BROCK_TAVERN_INTRO: ScriptedScene = {
  id: 'brock-tavern-intro',
  triggers: ['回到回声酒馆寻找布洛克', '寻找布洛克', '找布洛克', '去酒馆找布洛克'],
  setArea: '逆穹悬城·回声酒馆',
  bgImage: '/assets/scenes/06tavern-interior.webp',
  statePatch: {
    brock_intro_seen: true,
  },
  events: ['找到布洛克'],
  lastEvent: '在回声酒馆找到布洛克，并得知他的入队条件',
  lines: [
    {
      speaker: '主持人',
      text: '你们再次回到回声酒馆时，萨洛只朝角落抬了抬下巴。那里坐着一个宽肩矮壮的男人，桌上摆着铁锅、酒杯和一只装满干燥菌片的布袋。',
      bgImage: '/assets/scenes/09brock-tavern-table.webp',
    },
    {
      speaker: '布洛克',
      text: '「公会的人？我不喜欢公会的人。他们总说‘采样’，最后把会发光的、会咬人的、会救命的全装进一个箱子。」',
      portrait: '/assets/characters/senluo/brock_tavern.webp',
    },
    {
      speaker: '艾琳',
      text: '「我们不是来抢样本。我们需要你带路，也需要你告诉我们哪些东西不该碰。」',
    },
    {
      speaker: '布洛克',
      text: '「那就简单。第一，帮我采集三份活性孢子样本。第二，按规矩付报酬。第三，先陪我喝得尽兴。连酒桌都坐不稳的人，进孢海只会浪费绷带。」',
    },
    {
      speaker: '萨洛',
      text: '「别看我，我只负责酒杯不碎。布洛克的规矩一直这么难听，但他带过的队伍，活着回来的比例最高。」',
    },
  ],
  hints: [
    '陪布洛克喝得尽兴',
    '询问布洛克需要采集哪种孢子样本【自然DC12】',
    '向萨洛确认布洛克的报酬行情【洞悉DC12】',
  ],
};

const BROCK_RECRUITED: ScriptedScene = {
  id: 'brock-recruited',
  manualOnly: true,
  triggers: ['布洛克喝酒骰子结束'],
  setArea: '逆穹悬城·回声酒馆',
  bgImage: '/assets/scenes/06tavern-interior.webp',
  statePatch: {
    sl_recruited: true,
    sl_trust: 64,
    brock_recruited: true,
    brock_spore_sample_deal: true,
  },
  events: ['布洛克加入队伍'],
  lastEvent: '布洛克接受采样与报酬条件，加入远征队',
  lines: [
    {
      speaker: '布洛克',
      text: '「行，酒量和骰运都还没让我失望。采样条件写清楚：活性孢子三份，不能烧菌巢，不能把会繁殖的样本丢进城市排水沟。」',
      bgImage: '/assets/scenes/09brock-tavern-table.webp',
      portrait: '/assets/characters/senluo/brock_tavern.webp',
    },
    {
      speaker: '瑟琳',
      text: '「报酬由公会登记后结算。样本归属写进附约，避免之后扯皮。」',
    },
    {
      speaker: '布洛克',
      text: '「银杖小姐说话像账本，但账本至少不会撒谎。好，我跟你们走。下去以后听我说，别看什么亮就摸什么。」',
    },
    {
      speaker: '主持人',
      text: '布洛克把铁锅扣在背包外侧，又把干燥菌片收好。回声酒馆的热闹重新漫上来，你们的队伍里多了一个懂孢海脾气的人。',
    },
  ],
  hints: [
    '前往黑市寻找凯娅',
    '请布洛克说明活性孢子样本的安全采集法【自然DC12】',
    '整理当前队伍分工',
  ],
};

// ============================================================
// 黑市 → 凯娅与幸运盲盒钻石
// ============================================================
const BLACK_MARKET_KAIYA_INTRO: ScriptedScene = {
  id: 'blackmarket-kaiya-intro',
  triggers: ['前往黑市寻找凯娅', '去黑市找凯娅', '寻找凯娅', '前往黑市'],
  setArea: '逆穹悬城·黑市',
  bgImage: '/assets/scenes/07blackmarket-stall.webp',
  statePatch: {
    blackmarket_unlocked: true,
    kaiya_intro_seen: true,
  },
  events: ['凯娅现身', '幸运盲盒已开放'],
  lastEvent: '在黑市使用米娜暗号让凯娅现身',
  lines: [
    {
      speaker: '主持人',
      text: '黑市藏在补给市场背面的斜巷里。冷光灯被黑布罩住，摊主们说话像在数刀刃，讨价还价声被厚重帘幕切成一段一段。',
    },
    {
      speaker: '瑟琳',
      text: '「米娜给的暗号是：‘白契账本缺一页。’回答如果是‘缺页最值钱’，就说明人到了。」',
    },
    {
      speaker: '主持人',
      text: '你们在一处卖旧护符的摊前说出暗号。摊主没有抬头，倒是背后阴影里传来一声轻笑。',
    },
    {
      speaker: '凯娅',
      text: '「缺页最值钱。公会这次终于学会不把我的名字写在明档上了？」',
      portrait: '/assets/characters/kelaiya/kaiya_blackmarket.webp',
    },
    {
      speaker: '凯娅',
      text: '「我知道你们要下孢海。锁、陷阱、暗号、假货、黑市欠账，我都能处理。条件也简单：一颗钻石，干净的，能握在手里的。」',
    },
    {
      speaker: '奥兰',
      text: '「巧了。幸运盲盒，二十金一次。骰点大于十八，钻石归你。八次还没出，我按规矩保底。黑市也有信誉，虽然不多。」',
    },
    {
      speaker: '艾琳',
      text: '「这听起来像赌博。」',
    },
    {
      speaker: '凯娅',
      text: '「这座城本来就是靠赌活着的。你们赌缆梯不会断，我赌你们真的付得起价。」',
    },
  ],
  hints: [
    '购买奥兰的幸运盲盒',
    '和凯娅确认她能处理的陷阱类型【巧手DC13】',
    '询问奥兰盲盒保底规则【洞悉DC12】',
  ],
};

const KAIYA_RECRUITED: ScriptedScene = {
  id: 'kaiya-recruited',
  manualOnly: true,
  triggers: ['凯娅收到钻石加入队伍'],
  setArea: '逆穹悬城·黑市',
  bgImage: '/assets/scenes/07blackmarket-stall.webp',
  statePatch: {
    kl_recruited: true,
    kl_trust: 62,
    kaiya_recruited: true,
    kaiya_diamond_paid: true,
  },
  events: ['凯娅加入队伍'],
  lastEvent: '将钻石交给凯娅，凯娅同意加入远征队',
  lines: [
    {
      speaker: '主持人',
      text: '钻石落进凯娅掌心时，她没有立刻收起，而是举到冷光灯下看了看切面。光在她眼底一闪，像某种被确认的契约。',
      bgImage: '/assets/scenes/10orlan-lucky-box.webp',
    },
    {
      speaker: '凯娅',
      text: '「不错，是真的。你们至少知道筹码要先放在桌上。」',
      portrait: '/assets/characters/kelaiya/kaiya_blackmarket.webp',
    },
    {
      speaker: '凯娅',
      text: '「我加入。先说好，我不替愚蠢开锁，也不替贪心拆陷阱。如果我说那条路像骗局，你们最好听完再决定要不要送命。」',
    },
    {
      speaker: '布洛克',
      text: '「她说话难听，但鼻子准。黑市里能活到今天的人，多少有点本事。」',
    },
    {
      speaker: '瑟琳',
      text: '「三名队友齐了。回公会找赫尔曼登记小队信息，领取正式物资，然后去降渊缆梯。」',
    },
  ],
  hints: [
    '返回冒险者公会找赫尔曼正式登记小队',
    '请凯娅检查黑市暗道情报【巧手DC13】',
    '整理五人队伍分工',
  ],
};

// ============================================================
// 高胜局奖励情报 → 黑市深处云苓药剂
// ============================================================
const YUNLING_BLACK_MARKET: ScriptedScene = {
  id: 'yunling-black-market',
  manualOnly: true,
  triggers: ['根据萨洛额外情报寻找云苓'],
  setArea: '逆穹悬城·黑市深处',
  bgImage: '/assets/scenes/12yunling-apothecary.webp',
  statePatch: {
    yunling_met: true,
    yunling_shop_unlocked: true,
  },
  events: ['根据萨洛额外情报找到云苓', '云苓赠送三瓶治疗药水'],
  lastEvent: '在黑市深处找到药剂商云苓，并获得关于孢海污染的补充情报',
  lines: [
    {
      speaker: '主持人',
      text: '凯娅收起钻石后，瑟琳取出萨洛临别时塞来的纸条。纸上只写着三行：黑市尽头、铜铃不响的门、问她“蓝孢会不会做梦”。凯娅看完，轻轻啧了一声。',
    },
    {
      speaker: '凯娅',
      text: '「萨洛居然把这个名字给你们了。云苓不卖假药，也不卖便宜药。她愿意见谁，通常说明那个人马上要去很糟糕的地方。」',
    },
    {
      speaker: '主持人',
      text: '你们穿过补给摊、旧护符柜和一排挂着黑布的狭门，来到黑市最深处。这里没有叫卖声，只有玻璃瓶里药液轻轻冒泡的声音。一个穿青灰长衣的女人坐在低灯下，银针别着发髻，眼神像正在称量你们每一次呼吸。',
    },
    {
      speaker: '云苓',
      text: '「蓝孢当然会做梦。它们梦见潮湿、热血和不会逃跑的骨头。萨洛让你们来，说明他觉得你们还有救。」',
    },
    {
      speaker: '瑟琳',
      text: '「我们要下无光孢海。需要知道污染、孢毒和深层变异的风险。」',
    },
    {
      speaker: '云苓',
      text: '「第一，孢尘不是雾，它会记住热源。冷光灯要间歇使用，别让整支队伍像一串挂在黑暗里的灯笼。第二，蓝色菌毯不一定有毒，但太均匀的蓝光通常意味着它们在等重量。第三，听见熟人的声音时，先确认影子。孢海会偷声音，比偷命更快。」',
    },
    {
      speaker: '艾琳',
      text: '「污染如果进入血液，普通治疗会变得不稳定，对吗？」',
    },
    {
      speaker: '云苓',
      text: '「对。所以你们要把伤口先洗净，再祈祷。顺序错了，祈祷会替污染打开门。」',
    },
    {
      speaker: '布洛克',
      text: '「你这话像黑市药师会说的，也像真话。」',
    },
    {
      speaker: '云苓',
      text: '「真话比较贵。看在萨洛赢得不难看的份上，三瓶治疗药水送你们。之后想买，按规矩付钱。柜台最里面那枚净化之心也卖，但它不是给小伤小痛用的；如果你们遇到被黑石侵蚀、却还没完全失去自我的人，它也许能替你们多留一个选择。」',
    },
  ],
  hints: [
    '购买力量药水',
    '购买治疗药水',
    '购买净化之心',
    '不购买药水返回公会登记',
  ],
};

// ============================================================
// 公会正式登记五人小队 → 领取物资 → 出发
// ============================================================
const GUILD_FINAL_REGISTRATION: ScriptedScene = {
  id: 'guild-final-registration',
  triggers: ['返回冒险者公会找赫尔曼正式登记小队', '回公会正式登记小队', '正式登记小队', '找赫尔曼登记小队'],
  setArea: '逆穹悬城·冒险者公会任务室',
  bgImage: '/assets/scenes/04guild-interior.webp',
  statePatch: {
    formal_mission_briefed: true,
    companions_selected: true,
    selected_companions: '瑟琳,艾琳,布洛克,凯娅',
    party_size: 5,
    al_recruited: true,
    sl_recruited: true,
    kl_recruited: true,
    expedition_registered: true,
    blackmarket_done: true,
    inventory: '长剑,冒险者工具包,抗孢面罩,冷光灯,止血粉,解毒剂,缆梯安全扣,公会补给箱',
  },
  events: ['五人远征队登记完成', '公会物资已领取'],
  lastEvent: '在冒险者公会登记五人小队，并领取前往无光孢海的正式物资',
  lines: [
    {
      speaker: '主持人',
      text: '你们回到公会任务室时，地图桌旁已经空出五个签名位。赫尔曼站在缆梯路线图前，米娜把物资清单、队伍契约和一只沉重的补给箱放到桌上。',
    },
    {
      speaker: '赫尔曼',
      text: '「五人到齐：你、瑟琳、艾琳、布洛克、凯娅。治疗、生态、暗线、主力行动都有了。这个配置能下孢海。」',
    },
    {
      speaker: '米娜',
      text: '「正式委托重申一遍。第一，前往地底堡垒；第二，调查失联原因；第三，确认地心狱门相关情报；第四，查明魔物上涌原因，并带回生还者或可靠证据。」',
    },
    {
      speaker: '赫尔曼',
      text: '「旧地图显示，黑暗之门是通往深层路线的关键入口。按公会记录，穿过那里后就该抵达地底堡垒所在层。」',
    },
    {
      speaker: '米娜',
      text: '「物资包括抗孢面罩、冷光灯、止血粉、解毒剂、缆梯安全扣和一只公会补给箱。别省到最后，也别第一天全用完。」',
    },
    {
      speaker: '艾琳',
      text: '「我会检查污染防护和急救包。」',
    },
    {
      speaker: '布洛克',
      text: '「我看样本瓶和滤网。孢海里的东西不是塞进瓶子就算采样。」',
    },
    {
      speaker: '凯娅',
      text: '「我看锁扣、暗袋和假货。如果这箱子里有黑市回收件，我会知道。」',
    },
    {
      speaker: '瑟琳',
      text: '「队伍完整，路线明确。下一站，降渊缆梯。」',
    },
  ],
  hints: [
    '前往降渊缆梯中枢',
    '检查公会补给箱【调查DC12】',
    '向赫尔曼确认黑暗之门记录【调查DC13】',
  ],
};

// ============================================================
// 降渊缆梯 → 出发前路线提示
// ============================================================
const ELEVATOR_HUB: ScriptedScene = {
  id: 'elevator-hub',
  triggers: ['前往降渊缆梯中枢', '前往降渊缆梯', '去缆梯', '降渊缆梯'],
  setArea: '逆穹悬城·降渊缆梯',
  statePatch: {
    elevator_hub_visited: true,
  },
  events: ['抵达降渊缆梯中枢'],
  lastEvent: '抵达降渊缆梯中枢，准备下探无光孢海',
  lines: [
    {
      speaker: '主持人',
      text: '降渊缆梯中枢悬在城市最下缘，九条秘银主缆从这里垂入深井。巨大的绞盘缓慢转动，齿轮声像一头沉睡巨兽的呼吸，蓝绿色孢光在下方黑暗里一层层浮动。',
    },
    {
      speaker: '温妮',
      text: '「别把手伸进护栏外。上一个这么做的人，现在只剩一只手套挂在三号缆上。」',
    },
    {
      speaker: '主持人',
      text: '温妮·铜铃从检修台后探出头，脸上沾着机油，手里抱着一卷厚得吓人的缆梯维护图。她扫了一眼五人名单，吹了声口哨。',
    },
    {
      speaker: '温妮',
      text: '「五人队，配置还挺齐。治疗、锅、黑市手、银杖，还有主力。行，我喜欢不把缆梯当许愿井的人。」',
    },
    {
      speaker: '温妮',
      text: '「最近回响比记录快了半拍。机械不会撒谎，下面有东西在影响主缆。下去以后，别让安全扣离身。」',
    },
    {
      speaker: '瑟琳',
      text: '「装备确认。所有人上吊舱。」',
    },
  ],
  hints: [
    '确认装备后乘缆梯前往孢海据点',
    '询问温妮主缆异常【调查DC13】',
    '让队友分别做出发前检查',
  ],
};

const ELEVATOR_DESCENT: ScriptedScene = {
  id: 'elevator-descent',
  triggers: ['确认装备后乘缆梯前往孢海据点', '乘缆梯前往孢海据点', '前往第一层', '准备前往第一层'],
  setArea: '降渊缆梯·垂降途中',
  statePatch: {
    elevator_descent_started: true,
  },
  events: ['降渊缆梯启动'],
  lastEvent: '乘降渊缆梯从逆穹悬城前往无光孢海第一层',
  lines: [
    {
      speaker: '主持人',
      text: '吊舱启动时，整座逆穹悬城的灯火从头顶慢慢远去。九条秘银主缆在黑暗里绷紧，符文制动轮一层层亮起，像把你们送入一口没有底的井。',
    },
    {
      speaker: '温妮',
      text: '「别碰红色拉杆！那不是启动杆，那是让整条缆梯把你们当石头甩下去的蠢办法。」',
    },
    {
      speaker: '艾琳',
      text: '「呼吸放慢。第一次垂降眩晕很正常，盯住吊舱内壁，不要一直看下方。」',
    },
    {
      speaker: '布洛克',
      text: '「下面开始有孢光了。蓝得太均匀的地方别踩，通常不是地面，是一整片等你踩进去的菌毯。」',
    },
    {
      speaker: '凯娅',
      text: '「吊舱外侧有旧刮痕。不是机械磨损，是某种带钩的东西抓过。希望它今晚不加班。」',
    },
    {
      speaker: '瑟琳',
      text: '「它比记录里更早开始发光了……」',
    },
    {
      speaker: '瑟琳',
      text: '「我的意思是，公会记录可能过期了。下去之后，先确认据点情况。」',
    },
  ],
  hints: [
    '抵达孢海据点并确认前线情况',
    '固定安全扣适应垂降【体质DC10】',
    '观察下方异常光带【感知DC13】',
  ],
};

const SPORE_OUTPOST_ARRIVAL: ScriptedScene = {
  id: 'spore-outpost-arrival',
  triggers: ['抵达孢海据点并确认前线情况', '抵达孢海据点', '前往孢海据点'],
  setArea: '无光孢海·孢海据点',
  statePatch: {
    spore_outpost_reached: true,
  },
  events: ['抵达第一层孢海据点'],
  lastEvent: '抵达无光孢海第一层前线据点',
  lines: [
    {
      speaker: '主持人',
      text: '吊舱落在一座钉进岩壁的钢木平台上。这里仍有灯、守卫和补给箱，但所有东西都蒙着一层淡蓝孢尘。平台之外，巨型真菌像塔楼一样从黑暗里升起。',
    },
    {
      speaker: '尼布',
      text: '「蓝伞尼布，孢海据点守夜人。浅层地图可以给你们，但别追那些异常荧光。会喊人的东西，不一定是人。」',
    },
    {
      speaker: '艾琳',
      text: '「据点还有伤员。我先确认污染程度。」',
    },
    {
      speaker: '布洛克',
      text: '「蓝伞浅滩最近不该这么亮。先看风向和孢尘，再决定从哪条路进去。」',
    },
    {
      speaker: '凯娅',
      text: '「补给箱少了两个封扣。这里有人离开得很急，也可能有人拿走了不该拿的东西。」',
    },
    {
      speaker: '瑟琳',
      text: '「先确认路线和队伍状态。离开据点后，就是真正的无光孢海。」',
    },
  ],
  hints: [
    '确认蓝伞浅滩安全路线【生存DC13】',
    '调查据点失联记录【调查DC12】',
    '和同行同伴做出发前最后确认',
  ],
};

export const SCRIPTED_SCENES: ScriptedScene[] = [
  GUILD_ARRIVAL,
  TAVERN_INTRO,
  SALO_COMPANION_INTEL,
  CATHEDRAL_AILIN_RECRUIT,
  BROCK_TAVERN_INTRO,
  BROCK_RECRUITED,
  BLACK_MARKET_KAIYA_INTRO,
  KAIYA_RECRUITED,
  YUNLING_BLACK_MARKET,
  GUILD_FINAL_REGISTRATION,
  ELEVATOR_HUB,
  ELEVATOR_DESCENT,
  SPORE_OUTPOST_ARRIVAL,
];

export function matchScriptedScene(action: string): { scene: ScriptedScene; trigger: string } | null {
  const trimmed = action.trim();
  for (const scene of SCRIPTED_SCENES) {
    if (scene.manualOnly) continue;
    for (const trigger of scene.triggers) {
      if (trimmed.includes(trigger)) return { scene, trigger };
    }
  }
  return null;
}

export function getScriptedScene(id: string): ScriptedScene | null {
  return SCRIPTED_SCENES.find((scene) => scene.id === id) ?? null;
}
