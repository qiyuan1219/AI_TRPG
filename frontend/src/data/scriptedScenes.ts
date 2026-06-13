/**
 * 固定剧情脚本 —— 不依赖 AI 生成，speaker 由数据显式指定。
 * AI 只负责玩家自由行动、检定结果与战斗/小游戏后的短承接。
 */

export interface ScriptedLine {
  speaker: string;
  text: string;
  portrait?: string;
  bgImage?: string;
  bgm?: string;
}

export interface ScriptedScene {
  id: string;
  triggers: string[];
  lines: ScriptedLine[];
  hints: string[];
  setArea?: string;
  bgImage?: string;
  bgm?: string;
  statePatch?: Record<string, any>;
  events?: string[];
  lastEvent?: string;
  autoDicePoker?: boolean;
  manualOnly?: boolean;
}

// ============================================================
// 开场剧情 —— 从逆穹悬城到教学战斗触发
// ============================================================
const OPENING: ScriptedScene = {
  id: 'opening',
  triggers: [],
  setArea: '逆穹悬城·主缆街',
  bgm: '/assets/bgm/bgm_02_inverse_city.mp3',
  lastEvent: '抵达逆穹悬城入城平台，第一次遭遇裂隙爬兽',
  lines: [
    // ===== 世界观 =====
    { speaker: '主持人', text: '地表诸国的历史，不过记载了这个世界最年轻、也最安全的一部分。' },
    { speaker: '主持人', text: '在王国疆界之外，在阳光无法抵达的幽暗地域深处，埋藏着一段被刻意封存的往事。' },
    { speaker: '主持人', text: '一千年前，大地深处出现了一道贯穿位面的裂口。后来的人们将它称为——地心之门。' },
    { speaker: '主持人', text: '门的另一端，连接着九层地狱的第一层：阿弗纳斯。' },
    { speaker: '主持人', text: '战争随之降临，炼狱魔物穿过裂口涌入地下，污染矿脉，占据城邦，将大片幽暗地域变成无法通行的死地。' },
    { speaker: '主持人', text: '最终，三位英雄携带三件圣遗物深入地底，在付出惨重代价后封闭了地心之门。' },
    { speaker: '主持人', text: '为了防止封印再次松动，他们在门的上方修建了一座地底堡垒。' },
    { speaker: '主持人', text: '从那以后，最精锐的骑士、法师与工匠世代驻守于此，监视封印，也阻挡任何从深处爬出的东西。' },

    // ===== 逆穹悬城 =====
    { speaker: '主持人', text: '随着驻军、矿工和商队不断聚集，一座前线补给城逐渐出现在堡垒上方的巨大洞窟中。' },
    { speaker: '主持人', text: '那就是逆穹悬城——幽暗地域最深处，也是地表文明最后的一座永久据点。' },
    { speaker: '主持人', text: '整座城市倒悬于洞穴穹顶，街道、房屋与塔楼全都朝向下方深渊。' },
    { speaker: '主持人', text: '九条秘银主缆贯穿城内，支撑街区，稳定重力，也为防御法阵输送能量。' },
    { speaker: '主持人', text: '城市中央，一座被称为降渊缆梯的巨型升降装置垂入黑暗。' },
    { speaker: '主持人', text: '它是逆穹城通往更深层区域的唯一稳定通道。' },
    { speaker: '主持人', text: '而那座守卫地心之门的地底堡垒，就在缆梯尽头的深渊之下。' },

    // ===== 危机 =====
    { speaker: '主持人', text: '十年前，地底堡垒按惯例发出了最后一次守备信号。内容一切正常，此后便彻底沉默。' },
    { speaker: '主持人', text: '逆穹城先后派出多支侦察队和远征队，试图恢复联系。但没有一支队伍返回，也没有任何消息从深处传回来。' },
    { speaker: '主持人', text: '最初，人们将这场沉默归咎于塌方、法阵故障，或者深层魔物的袭击。' },
    { speaker: '主持人', text: '直到最近几个月，情况开始急剧恶化。' },
    { speaker: '主持人', text: '从深层矿道上涌的魔物数量增加了数倍。裂隙爬兽闯入商路，孢化地底兽袭击矿场，连城防记录中从未出现过的生物也开始接近逆穹城。' },
    { speaker: '主持人', text: '城里的每个人都明白：深渊之下，一定发生了什么。' },

    // ===== 赏金猎人 =====
    { speaker: '主持人', text: '而今天故事的主角，是你——{name}。一名往来于各大城邦之间的赏金猎人。' },
    { speaker: '主持人', text: '你不是刚在公会登记的新手，也不是为了几枚金币便敢闯进巢穴的亡命徒。' },
    { speaker: '主持人', text: '你曾在北地追踪霜龙，也曾深入南方沼泽，清理被巫妖污染的地下水脉。' },
    { speaker: '主持人', text: '从废弃矿城到边境要塞，这片大陆许多见不得光的地方，都留下过你的脚印。' },

    // ===== 指名委托 =====
    { speaker: '主持人', text: '三个月前，一份来自逆穹城的指名委托被送到你手中。' },
    { speaker: '主持人', text: '没有寒暄，没有多余说明，羊皮纸上只有几行经过公会认证的文字。' },
    { speaker: '主持人', text: '「深入幽暗地域，抵达逆穹悬城。调查地底堡垒与历次远征队失联的原因。确认地心之门封印状态。带回生还者、调查记录，或者足以证明真相的证据。」' },
    { speaker: '主持人', text: '委托报酬丰厚，危险等级却没有标注上限。你接下了它。' },

    // ===== 旅途 =====
    { speaker: '主持人', text: '你沿着一条废弃的符文矿道不断下行，起初还能看见锈蚀矿车与熄灭的矮人锻炉。' },
    { speaker: '主持人', text: '越往深处，空气越发潮湿，蓝绿色菌斑开始爬满岩壁。' },
    { speaker: '主持人', text: '再往下，连矮人的路标也消失了。黑暗中，只剩侏儒工程师留下的发光铆钉，引着你继续深入。' },

    // ===== 抵达 =====
    { speaker: '主持人', text: '不久后，矿道尽头终于吹来带着矿尘与孢粉气味的风。' },
    { speaker: '主持人', text: '脚下岩地逐渐变成刻有防御符文的石板，并一路延伸向前方吊桥。' },
    { speaker: '主持人', text: '吊桥尽头，一扇布满封印咒文的巨大石门挡住去路。' },
    { speaker: '主持人', text: '公会徽记通过核验后，锁链转动，石门在轰鸣声中缓缓开启。逆穹悬城的入城平台，就在门后。' },

    // ===== 城市初见 =====
    { speaker: '主持人', text: '你穿过重力定向法阵，短暂失重后，整个世界在眼前猛然翻转。' },
    { speaker: '主持人', text: '双脚重新落地时，一座倒悬于洞穴穹顶之上的城市出现在你面前。' },
    { speaker: '主持人', text: '房屋紧贴岩层，桥梁横跨街区，尖塔垂向下方无尽的深渊。' },
    { speaker: '主持人', text: '九条秘银主缆贯穿全城，表面的符文随着低沉震动不断明灭。防御弩塔守在街角，数百盏符文灯照亮倒悬的街道。' },
    { speaker: '主持人', text: '城市中央，一口巨大的深井贯穿层层建筑。深井之下，蓝绿色孢光缓慢起伏，仿佛黑暗中沉睡着一片会呼吸的海洋。' },

    // ===== 守卫 =====
    { speaker: '守卫', text: '「地表来的赏金猎人？」' },
    { speaker: '守卫', text: '「别盯着深井看太久。第一次进城的人容易失去方向感，上个月还有人吐在自己的通行证上。」' },
    { speaker: '守卫', text: '「公会已经通知过我们。我负责带你通过入城区。穿过吊桥区就是冒险者公会。跟紧一点，也别翻过护栏。」' },

    // ===== 主缆街 =====
    { speaker: '主持人', text: '你跟随守卫沿主缆街前往冒险者公会。', bgImage: '/assets/scenes/0101cable-street-walk.webp' },
    { speaker: '主持人', text: '街道一侧贴着岩壁，另一侧越过护栏，便是望不到底的深渊。秘银主缆在街旁低声震响，符文灯将行人的影子投向头顶。' },
    { speaker: '主持人', text: '矿工、商贩与巡逻守卫匆匆经过，空气中混着矿尘、机油与孢粉的甜腥。' },
    { speaker: '主持人', text: '这座城市仍在运转，却显然已经进入戒备状态。' },

    // ===== 瑟琳登场 =====
    { speaker: '主持人', text: '公会钟声响起，前方倒悬塔楼下，一名银灰长发的女法师正在等候。' },
    { speaker: '主持人', text: '她看见你时，目光短暂停顿，随后恢复平静。' },
    { speaker: '瑟琳', text: '「你就是公会指名的赏金猎人，{name}。」' },
    { speaker: '瑟琳', text: '「我是瑟琳，负责你的法术支援、治疗和环境监测，也作为你的向导」' },
    { speaker: '瑟琳', text: '「你比预计早到了三天，看来传言并不全是夸张。」' },
    { speaker: '瑟琳', text: '「先去公会登记吧。路上我会说明城里的情况。」' },

    // ===== 教学战斗触发 =====
    { speaker: '主持人', text: '你们刚走出街口，前方便传来刺耳的金属断裂声。', bgImage: '/assets/scenes/02tutorial-battle-trigger.webp' },
    { speaker: '主持人', text: '一只运输吊箱脱离缆车，重重砸在街面上。木板碎裂，蓝绿色孢尘喷涌而出。' },
    { speaker: '主持人', text: '箱中没有补给，只有数只沾满孢粉的裂隙爬兽。' },
    { speaker: '主持人', text: '它们受到惊吓，立刻张开口器冲向人群。其中一只踏着断裂缆索跃起，径直扑向你。' },
    { speaker: '主持人', text: '瑟琳抬起银杖，寒白色法光照亮了它腹侧裸露的软甲。' },
    { speaker: '瑟琳', text: '「别退向护栏！攻击它腹侧的软肋！」' },
    { speaker: '主持人', text: '裂隙爬兽已经逼近，战斗一触即发！' },
  ],
  hints: [
    '正面迎击裂隙爬兽【力量DC10】',
    '观察弱点寻找破绽【感知DC10】',
    '请求瑟琳施展辅助法术【魅力DC12】',
    '闪避并寻找掩护位置【敏捷DC10】',
  ],
};

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
      bgImage: '/assets/scenes/04guild-interior.webp',
    },

    // ===== 冒险者公会 =====
    { speaker: '主持人', text: '你与瑟琳沿主缆街来到冒险者公会。一座倒悬的石砌塔楼立在街区中央，门外悬着铁制剑盾徽记，墙上贴满泛黄的任务单与悬赏令。' },
    { speaker: '主持人', text: '大厅炉火正旺，空气里却仍带着地底的潮冷。文书员围在地图旁低声交谈，一名黑缆守卫正将沾血的回收箱封条交给柜台。' },
    { speaker: '米娜', text: '「你就是公会指名调来的赏金猎人。叫我米娜。先登记姓名、职业和随身装备。」' },
    { speaker: '主持人', text: '米娜将登记册推到你面前，又把三枚铜牌放在地图上：艾琳、布洛克、凯娅。' },
    { speaker: '米娜', text: '「这次下潜按五人编队执行。除了你和瑟琳，还需要三名熟悉孢毒、深层环境和地下暗线的成员。」' },
    { speaker: '米娜', text: '「艾琳，静默神殿的白枝修女。擅长治疗、解毒和稳定心神。她不会放弃伤者，和她同行，就别把人命当成可以舍弃的补给。」' },
    { speaker: '米娜', text: '「布洛克·铁锅，深层生存专家。菌毯、毒囊、孢海风向和魔物迁徙，他都比公会教官更熟。想请动他，就准备好报酬，并认真听他的判断。」' },
    { speaker: '米娜', text: '「凯娅没有公开档案。锁具、陷阱、暗号和黑市渠道都是她的本事。她不信承诺，只认摆在桌面上的筹码。」' },
    { speaker: '赫尔曼', text: '「地底堡垒已经失联十年。最近三个月，深层魔物的活动频率增加了三倍。」' },
    { speaker: '赫尔曼', text: '「我们要的是一支能抵达堡垒、查清真相并活着回来的队伍，不是几个写在登记册上的名字。」' },
    { speaker: '米娜', text: '「他们现在的位置不能写进公会明档。去回声酒馆找萨洛，他掌握着三人的最新消息。」' },
    { speaker: '米娜', text: '「不过他有个麻烦的规矩：先陪他玩一局快艇骰子，他才肯开口。」' },
    { speaker: '瑟琳', text: '「那我们先去酒馆吧。拿到完整情报后，我们再好好决定招募顺序和行动路线。」' },


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
    // ===== 回声酒馆 =====
    { speaker: '主持人', text: '回声酒馆藏在倒挂街区的侧巷里。炉火烧得正旺，主缆每次震动，梁下的铜铃便跟着轻响。' },
    { speaker: '主持人', text: '萨洛靠在吧台后擦着酒杯。听见你们提到公会，他才抬起眼，露出一丝意味不明的笑。' },
    { speaker: '萨洛', text: '「公会的新远征队？米娜让你们来的吧。她每次说是请我帮忙，最后都会变成我替她收拾麻烦。」' },
    { speaker: '瑟琳', text: '「我们需要艾琳、布洛克和凯娅的位置，还有你对他们的判断。」' },
    { speaker: '萨洛', text: '「消息可以给，但不能白给。陪我玩一局快艇骰子。」' },
    { speaker: '萨洛', text: '「五颗骰子，最多重掷三轮。赢了，我把知道的都告诉你；输了，也能听情报，不过得承认我的酒馆比公会更懂人。」' },
    { speaker: '主持人', text: '瑟琳借着整理披肩靠近你，压低了声音。' },
    { speaker: '瑟琳', text: '「我的法术能短暂预判骰子的结果。我会给出建议，但保留哪些骰子，由你决定。」' },
  ],
  hints: ['接受游戏', '付100G购买萨洛的情报'],
};

const SALO_COMPANION_INTEL: ScriptedScene = {
  id: 'salo-companion-intel',
  manualOnly: true,
  triggers: ['酒馆骰局结束获取队友情报'],
  setArea: '逆穹悬城·回声酒馆',
  bgImage: '/assets/scenes/06tavern-interior.webp',
  bgm: '/assets/bgm/bgm_03_guild_tavern_companions.mp3',
  statePatch: {
    salo_intel_done: true,
    ailin_location_known: true,
    brock_location_known: true,
    kaiya_location_known: true,
  },
  events: ['萨洛给出三名队友详细情报'],
  lastEvent: '从萨洛处获得艾琳、布洛克、凯娅的位置与性格情报',
  lines: [
    { speaker: '萨洛', text: '「愿赌服输。先说艾琳，她今晚在静默神殿为阵亡守卫主持安魂仪式。去时安静些，也别把她当成随队药箱。」' },
    { speaker: '萨洛', text: '「她擅长治疗、净化和稳定心神，但绝不会放弃伤员。你若把人命当成累赘，她不会继续跟你走。」' },
    { speaker: '萨洛', text: '「布洛克就在二楼。他熟悉孢海、菌毯、毒囊和魔物迁徙。想请动他，准备好采样许可、报酬，再陪他玩一轮喝酒骰子。」' },
    { speaker: '萨洛', text: '「凯娅在黑市。她精通开锁、陷阱、暗号和地下交易，但只相信看得见的筹码。公会徽记没用，米娜给你的暗号才有用。」' },
    { speaker: '萨洛', text: '「她最近想要一颗钻石。奥兰爵的幸运盲盒里正好有，二十金一次，能不能抽到全看骰子。」' },
    { speaker: '瑟琳', text: '「那就先去静默神殿找艾琳，再回来见布洛克，最后带着筹码去黑市找凯娅。」' },
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
    al_trust: 55,
    trust_al: 55,
    temple_ailin_recruited: true,
  },
  events: ['艾琳加入队伍'],
  lastEvent: '在静默神殿邀请艾琳加入远征队',
  lines: [
    // ===== 静默神殿 =====
    { speaker: '主持人', text: '静默神殿嵌在倒悬石拱中，门前没有钟，只有一排不滴蜡的白枝烛，像凝固在空中的雪。' },
    { speaker: '主持人', text: '大厅中央陈列着阵亡守卫的遗物：断裂的缆扣、破损的护符，以及没能寄出的家书。修女们正低声诵念安魂祷词。', bgImage: '/assets/scenes/11temple-prayer.webp' },
    { speaker: '瑟琳', text: '「先为他们祈祷吧。这里保存的不只是名字，也是我们必须下去的理由。」' },
    { speaker: '主持人', text: '你们停在遗物台前。烛光掠过瑟琳的银杖，映出几道转瞬即逝的细小裂纹。' },
    { speaker: '艾琳', text: '「愿白枝引导他们穿过无声之地。愿后来者记住，牺牲不是数字，失踪也不是。」', portrait: '/assets/characters/ailin/ailin_prayer.webp' },
    { speaker: '主持人', text: '祷告结束后，艾琳收起圣徽，看向你们胸前的公会徽记。' },
    { speaker: '瑟琳', text: '「我们要前往无光孢海，调查堡垒失联与魔物上涌。队伍需要你的治疗和净化。」' },
    { speaker: '艾琳', text: '「我可以同行，但你们必须答应我：伤者不是负担，遗体也不是障碍。能救的人要救，无法带回的人，至少要带回名字。」' },
    { speaker: '主持人', text: '艾琳说完，看向你，等待回答。' },
    { speaker: '艾琳', text: '「我会加入。孢毒、恐惧和伤口不会等人，而你们会需要我。」' },
    { speaker: '主持人', text: '她将白枝修会的徽章别在药箱上，又为队伍做了简短祈祷。柔和的光沿着你们的护腕缓缓散开。' },
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
    // ===== 回声酒馆·布洛克 =====
    { speaker: '主持人', text: '你们回到回声酒馆时，萨洛朝角落抬了抬下巴。那里坐着一个宽肩矮壮的男人，桌上摆着铁锅、酒杯和一袋晒干的菌片。', bgImage: '/assets/scenes/09brock-tavern-table.webp' },
    { speaker: '布洛克', text: '「公会的人？我一向不喜欢公会的人。他们嘴上说是采样，最后总把会发光、会咬人、会救命的东西全塞进一个箱子。」', portrait: '/assets/characters/senluo/brock_tavern.webp' },
    { speaker: '艾琳', text: '「我们不是来抢样本的。我们需要你带路，也需要你告诉我们哪些东西绝不能碰。」' },
    { speaker: '布洛克', text: '「想让我跟你们下孢海？行，先陪我喝一轮。」' },
    { speaker: '布洛克', text: '「规则很简单。酒喝下去，先看你扛不扛得住；扛住了，再看骰子认不认你。」' },
    { speaker: '萨洛', text: '「三轮，先过体质豁免，再拼点数。别担心，吐在桌上也算一种结果。」' },
    { speaker: '瑟琳', text: '「小心点。布洛克不是单纯在灌你酒，他是在判断你进入孢海后能不能保持清醒。」' },
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
    sl_trust: 50,
    trust_block: 50,
    brock_recruited: true,
    brock_spore_sample_deal: true,
  },
  events: ['布洛克加入队伍'],
  lastEvent: '布洛克接受采样与报酬条件，加入远征队',
  lines: [
    // ===== 布洛克加入队伍 =====
    { speaker: '布洛克', text: '「酒量和骰运都过关了。条件再说一遍：采集三份活性孢子，不准焚烧菌巢，也不准把活样本扔进城市排水沟。」', bgImage: '/assets/scenes/09brock-tavern-table.webp', portrait: '/assets/characters/senluo/brock_tavern.webp' },
    { speaker: '瑟琳', text: '「报酬由公会结算，样本归属也会写进附约。」' },
    { speaker: '布洛克', text: '「你说话像本账册，不过账册至少可靠。好，我加入。进了孢海以后听我指挥，别看见发光的东西就伸手。」' },
    { speaker: '主持人', text: '布洛克收起菌片，将铁锅挂在背包外侧。远征队里，又多了一名熟悉孢海的生存专家。' },
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
    // ===== 黑市·凯娅 =====
    { speaker: '主持人', text: '黑市藏在补给市场背后的斜巷里。冷光灯被黑布遮住，只照亮摊位上的半张桌面。厚重帘幕隔开一间间铺子，也将讨价还价声切得断断续续。', bgImage: '/assets/scenes/12blackmarket-alley.webp' },
    { speaker: '主持人', text: '这里没有人高声招揽生意。摊主们只用目光衡量客人的钱袋、武器，以及是否值得招惹。' },
    { speaker: '瑟琳', text: '「米娜给的暗号是：‘白契账本缺了一页。’对方若回答‘缺页最值钱’，就是我们要找的人。」' },
    { speaker: '主持人', text: '你们在一处旧护符摊前说出暗号。摊主继续擦拭货物，仿佛什么也没听见。' },
    { speaker: '凯娅', text: '「缺页最值钱。尤其是那一页上，写着不该被人知道的名字。」', portrait: '/assets/characters/kelaiya/kaiya_blackmarket.webp' },
    { speaker: '主持人', text: '声音从摊位后的阴影中传来。一名披着短斗篷的女人靠在石柱旁，手中正把玩着你们没有察觉何时丢失的钱袋。' },
    { speaker: '凯娅', text: '「放心，一枚都没少。我只是想确认，公会这次派来的究竟是远征队，还是一群连口袋都看不住的尸体。」' },
    { speaker: '布洛克', text: '「手倒是挺快。」' },
    { speaker: '凯娅', text: '「你发现得也不算太慢。看来这支队伍至少不是完全没救。」' },
    { speaker: '瑟琳', text: '「我们需要一名熟悉锁具、陷阱和地下暗线的成员。米娜认为你最合适。」' },
    { speaker: '凯娅', text: '「米娜还认为公会的印章能解决所有问题。可到了孢海深处，印章打不开门，也不会提醒你哪块地砖会要命。」' },
    { speaker: '凯娅', text: '「不过你们找对人了。古锁、机关、暗号、假货，还有那些不方便写进档案的交易，我都能处理。」' },
    { speaker: '艾琳', text: '「你愿意加入远征队吗？」' },
    { speaker: '凯娅', text: '「愿意是最不值钱的回答。我只谈条件。」' },
    { speaker: '凯娅', text: '「一颗未经附魔、没有追踪印记的天然钻石。交到我手里，我就跟你们下去；拿不出来，我们今天就当没见过。」' },
    { speaker: '主持人', text: '旁边的帘幕忽然被人挑开。一名衣着考究的商人推着木箱走来，脸上的笑容热情得近乎刻意。' },
    { speaker: '奥兰', text: '「谈到钻石，怎么能少了奥兰爵？幸运盲盒，二十金一次。骰点超过十八，钻石立刻带走。」' },
    { speaker: '奥兰', text: '「连续八次没有抽中，我按规矩保底。黑市当然讲信誉，只不过信誉通常需要另付费用。」' },
    { speaker: '艾琳', text: '「所以你是在诱导他们赌博。」' },
    { speaker: '奥兰', text: '「修女小姐，我提供的是机会。至于希望、冲动和后悔，那都是客人自己带来的。」' },
    { speaker: '凯娅', text: '「别被他的笑骗了。箱子是真的，钻石也是真的，只是他很擅长让你觉得下一次一定会中。」' },
    { speaker: '奥兰', text: '「凯娅小姐，你这样评价老朋友，会影响我的生意。」' },
    { speaker: '凯娅', text: '「我们不是朋友。你还欠我两把匕首和一张真的通行证。」' },
    { speaker: '艾琳', text: '「我仍然不赞成用赌博决定远征队的人选。」' },
    { speaker: '凯娅', text: '「这座城每天都在赌博。守卫赌主缆不会断，矿工赌下一镐不会挖穿巢穴，而你们赌地底堡垒里还有值得救的人。」' },
    { speaker: '凯娅', text: '「至少在这里，骰子不会假装自己代表正义。」' },
    { speaker: '瑟琳', text: '「我们只需要拿到钻石。先检查盲盒规则，再决定是否下注。」' },
    { speaker: '凯娅', text: '「很好。会怀疑规则的人，通常能活得久一些。让我看看你们到底是运气好，还是准备得足够充分。」' },
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
    kl_trust: 45,
    trust_kl: 45,
    kaiya_recruited: true,
    kaiya_diamond_paid: true,
  },
  events: ['凯娅加入队伍'],
  lastEvent: '将钻石交给凯娅，凯娅同意加入远征队',
  lines: [
    // ===== 凯娅加入队伍 =====
    { speaker: '主持人', text: '钻石落入凯娅掌心时，她没有立刻收起，而是举到冷光灯下缓缓转动。她检查了切面，又用指甲轻敲边缘，直到确认上面没有附魔刻痕和追踪印记。', bgImage: '/assets/scenes/10orlan-lucky-box.webp' },
    { speaker: '主持人', text: '冷光在钻石中折射，也在她眼底一闪而过。直到这一刻，她才真正将你们视作可以谈条件的人。' },
    { speaker: '凯娅', text: '「天然钻石，没有标记，也不是奥兰拿玻璃糊弄人的残次品。不错。」', portrait: '/assets/characters/kelaiya/kaiya_blackmarket.webp' },
    { speaker: '奥兰', text: '「凯娅小姐，你可以怀疑我的品格，但不能怀疑我的商品。」' },
    { speaker: '凯娅', text: '「你的品格和商品一样，都需要先验过再说。」' },
    { speaker: '主持人', text: '她收起钻石，将方才顺走的钱袋抛还给你，动作干净得像是在完成一份没有落笔的契约。' },
    { speaker: '凯娅', text: '「筹码已经付清，我加入。不过规矩也得提前说清楚。」' },
    { speaker: '凯娅', text: '「我负责开锁、识别陷阱和处理暗线，但我不替愚蠢开门，也不替贪心拆机关。」' },
    { speaker: '凯娅', text: '「如果我说前面的路有问题，你们可以不听。但最好等我把话说完，再决定要不要去送命。」' },
    { speaker: '艾琳', text: '「只要你的判断不是建立在抛弃伤员之上，我会尊重你的意见。」' },
    { speaker: '凯娅', text: '「放心，修女。我讨厌的是蠢人，不是伤员。伤员至少知道自己需要帮助。」' },
    { speaker: '布洛克', text: '「她嘴是毒了点，但鼻子比孢兽还灵。能在黑市活到今天，靠的可不只是运气。」' },
    { speaker: '凯娅', text: '「而你能活到今天，大概是因为毒蘑菇也嫌你难吃。」' },
    { speaker: '主持人', text: '布洛克哼了一声，没有反驳。瑟琳则扫过已经到齐的众人，将公会名单重新收好。' },
    { speaker: '瑟琳', text: '「艾琳负责治疗与净化，布洛克负责孢海生存，凯娅负责机关和暗线。五人编队已经齐了。」' },
    { speaker: '瑟琳', text: '「现在返回公会登记，领取远征物资。之后前往降渊缆梯，正式进入深层区域。」' },
    { speaker: '主持人', text: '凯娅拉低斗篷，跟在队伍最后。至此，前往地底堡垒的远征队终于完成集结。' },
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

    // ===== 黑市药师·云苓 =====
    { speaker: '主持人', text: '凯娅收起钻石后，瑟琳取出萨洛留下的纸条。上面只写着一个名字：云苓。' },
    { speaker: '凯娅', text: '「萨洛连她都告诉你们了？别看云苓年纪小，她配的药比黑市里大多数大人都可靠。」' },
    { speaker: '主持人', text: '凯娅带你们穿过补给摊，在黑市深处找到一间没有招牌的药铺。门内没有叫卖声，只有玻璃瓶里的药液咕噜冒泡。', bgImage: '/assets/scenes/13yunling-apothecary.webp' },
    { speaker: '主持人', text: '柜台后坐着一个穿青灰长衣的小女孩。她踩着高脚凳，用银针拨弄一片蓝色菌叶，听见脚步才抬起头。' },
    { speaker: '凯娅', text: '「云苓。萨洛介绍来的，他们准备下无光孢海。」' },
    { speaker: '云苓', text: '「还没领远征装备，就先来找药？不错。至少你们知道，武器能杀怪物，药才能让人走得更远。」', portrait: '/assets/characters/yunling/yunling_apothecary.webp' },
    { speaker: '瑟琳', text: '「我们需要适合深层探索的药剂。」' },
    { speaker: '云苓', text: '「那就别只买治疗药。治疗药只能补伤口，救不了中毒、感染和走不动路的人。」' },
    { speaker: '主持人', text: '云苓从柜台下搬出几只颜色不同的小药瓶，按顺序排成一列。' },
    { speaker: '云苓', text: '「绿色的是抗孢剂。喝下去以后，短时间内能压住咳嗽、眩晕和孢毒，不至于刚进菌区就倒下。」' },
    { speaker: '云苓', text: '「银灰色的是净血剂。污染刚进入伤口时用，能延缓侵蚀，给修女争取施术的时间。」' },
    { speaker: '云苓', text: '「黄色的是醒神剂。赶路太久、缺氧或者被幻觉影响时喝一小口，能让人多清醒一阵。」' },
    { speaker: '布洛克', text: '「这些东西能救急，但不能当水喝。药效过去以后，该休息还是得休息。」' },
    { speaker: '云苓', text: '「我知道。你负责让他们别踩进毒窝，我负责他们踩进去以后别马上死。」' },
    { speaker: '艾琳', text: '「这些药能代替净化术吗？」' },
    { speaker: '云苓', text: '「不能。药只能拖时间，让你们撑到安全地方。真把它当治愈，最后只会死得晚一点。」' },
    { speaker: '主持人', text: '她又取出三瓶封蜡的红色药水，推到你们面前。' },
    { speaker: '云苓', text: '「看在萨洛的面子上，这三瓶治疗药水送你们。流血、骨裂、体力透支都能用，但别擦破点皮就喝，深层里补给比金币贵。」' },
    { speaker: '主持人', text: '云苓随后指向柜台最内侧。一枚被银丝包裹的黑红色结晶，正像心脏一样缓慢跳动。' },
    { speaker: '云苓', text: '「那个叫净化之心。要是有人被黑石侵蚀，却还没完全失去自我，它也许能把人拉回来。」' },
    { speaker: '云苓', text: '「它不是常备药，是给最糟糕的情况准备的。现在嫌贵没关系，等真正需要时，你们可能连后悔的时间都没有。」' },
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
    // ===== 公会登记与远征物资 =====
    { speaker: '主持人', text: '你们回到公会任务室时，地图桌旁已经空出五个签名位。桌面上铺着降渊路线图，黑暗之门的位置被红蜡封记圈出。' },
    { speaker: '主持人', text: '赫尔曼站在地图前，米娜则将队伍契约、物资清单和一只沉重的公会补给箱推到桌上。箱体边缘还残留着旧远征队的编号刻痕。' },
    { speaker: '赫尔曼', text: '「五人到齐：你、瑟琳、艾琳、布洛克、凯娅。」' },
    { speaker: '赫尔曼', text: '「治疗、法术支援、孢海生存、机关暗线和正面行动能力都齐了。这个配置，才算有资格下潜。」' },
    { speaker: '米娜', text: '「签名之前，正式委托重申一遍。」' },
    { speaker: '米娜', text: '「第一，前往地底堡垒；第二，调查堡垒与历次远征队失联原因；第三，确认地心之门封印状态；第四，查明魔物上涌源头。」' },
    { speaker: '米娜', text: '「如发现生还者，优先带回；如无法带回，则必须取得可靠证据。口头猜测不会被公会登记为调查结果。」' },
    { speaker: '赫尔曼', text: '「旧地图显示，黑暗之门是通往深层堡垒区的关键入口。穿过那里之后，你们就会进入十年来无人带回消息的区域。」' },
    { speaker: '赫尔曼', text: '「不要指望公会能及时支援。缆梯只能送你们下去，不能保证把你们完整带回来。」' },
    { speaker: '主持人', text: '米娜打开补给箱。抗孢面罩、冷光灯、止血粉、解毒剂、缆梯安全扣、样本瓶和密封滤网被分门别类地固定在箱内。' },
    { speaker: '米娜', text: '「这些是五人份基础远征物资。抗孢面罩用于穿越高浓度孢尘区，冷光灯用于低能见度环境，安全扣必须全程系在缆梯索上。」' },
    { speaker: '米娜', text: '「止血粉和解毒剂只能处理常规伤势。遇到污染、黑石侵蚀或深层变异，不要硬撑，立刻让艾琳和瑟琳判断。」' },
    { speaker: '米娜', text: '「样本瓶和滤网用于收集孢子、菌丝和污染残留。样本必须封存编号，不能直接塞进背包，更不能带回城里乱放。」' },
    { speaker: '艾琳', text: '「我会检查急救包、解毒剂和污染防护。下去之后，所有伤口都要先处理再继续行动。」' },
    { speaker: '布洛克', text: '「样本瓶和滤网交给我。孢海里的东西不是装进瓶子就算采样，封错了会让整支队伍一起倒霉。」' },
    { speaker: '凯娅', text: '「我检查锁扣、暗袋和箱底。要是这批物资里混了黑市翻新的旧货，最好现在就让我发现。」' },
    { speaker: '瑟琳', text: '「我会记录法阵反应、污染波动和队伍状态。进入深层后，任何异常都必须第一时间汇报。」' },
    { speaker: '主持人', text: '你在契约末尾签下名字。随后，瑟琳、艾琳、布洛克和凯娅依次完成签名。五个名字并排落在同一张远征契约上。' },
    { speaker: '赫尔曼', text: '「从现在起，你们是逆穹城第七远征小队。任务目标已经确认，风险等级记为最高。」' },
    { speaker: '米娜', text: '「补给领取完毕后，前往降渊缆梯。守卫会为你们开放下行通道。」' },
    { speaker: '瑟琳', text: '「队伍完整，委托确认，物资领取完毕。」' },
    { speaker: '瑟琳', text: '「下一站，降渊缆梯。」' },
    { speaker: '主持人', text: '补给箱被合上，沉重的锁扣声在任务室里回响。你们离开地图桌，朝通往深渊的方向走去。' },
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
  bgImage: '/assets/scenes/elevator-hub.webp',
  bgm: '/assets/bgm/bgm_04a_elevator_descent.mp3',
  statePatch: {
    elevator_hub_visited: true,
  },
  events: ['抵达降渊缆梯中枢'],
  lastEvent: '抵达降渊缆梯中枢，准备下探无光孢海',
  lines: [
    { speaker: '主持人', text: '降渊缆梯中枢位于逆穹城最下缘。九条秘银主缆从这里垂入深井，巨型绞盘缓慢转动，齿轮声在空洞中回荡，像某种沉睡巨兽的呼吸。' },
    { speaker: '主持人', text: '护栏之外，蓝绿色孢光在深渊下方层层浮动。吊舱悬在轨道尽头，只等最后一次安全核验。' },
    { speaker: '温妮', text: '「站稳，别把手伸到护栏外。上一个这么做的人，现在只剩一只手套挂在三号缆上。」' },
    { speaker: '主持人', text: '检修台后探出一名矮个子的少女。她脸上沾着机油，怀里抱着一卷厚得吓人的缆梯维护图，腰间挂满扳手和铜铃。' },
    { speaker: '温妮', text: '「温妮·铜铃，缆梯检修员。你们要是能完整回来，记得告诉公会给我的维护预算加一倍。」' },
    { speaker: '主持人', text: '她扫过五人名单，又看了看你们的装备，吹了声短促的口哨。' },
    { speaker: '温妮', text: '「治疗、银杖、孢海向导、黑市手，还有一个负责站在最前面的。配置不错，至少不像来深渊边上许愿的。」' },
    { speaker: '温妮', text: '「不过听好了。最近主缆回响比记录快了半拍，机械不会撒谎，下面有东西正在影响缆梯。」' },
    { speaker: '温妮', text: '「下去以后，安全扣别离身，冷光灯别乱晃，听见缆索尖叫就立刻趴低。你们怕不怕我不管，缆梯怕乱动的人。」' },
    { speaker: '布洛克', text: '「这孩子说话不中听，但主缆的事听她的。」' },
    { speaker: '凯娅', text: '「我喜欢她。至少她把会死人这件事说得很清楚。」' },
    { speaker: '瑟琳', text: '「装备确认。所有人上吊舱，安全扣锁紧。」' },
    { speaker: '主持人', text: '吊舱铁门缓缓打开，深渊的冷风从下方涌上来。远征队即将离开逆穹城，进入真正的幽暗深层。' },
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
  bgImage: '/assets/scenes/ele.webp',
  statePatch: {
    elevator_descent_started: true,
  },
  events: ['降渊缆梯启动'],
  lastEvent: '乘降渊缆梯从逆穹悬城前往无光孢海第一层',

  lines: [
    { speaker: '主持人', text: '吊舱启动时，逆穹悬城的灯火在头顶缓缓远去。九条秘银主缆在黑暗中绷紧，符文制动轮一层层亮起，将你们送入那口看不见底的深井。' },
    { speaker: '温妮', text: '「听得到吗？很好。别碰红色拉杆！那不是启动杆，那是让整条缆梯把你们当石头甩下去的蠢办法。」' },
    { speaker: '主持人', text: '温妮的声音从吊舱角落的通讯铜铃里传来，伴随着断断续续的齿轮杂音。' },
    { speaker: '艾琳', text: '「呼吸放慢。第一次垂降眩晕很正常，盯住吊舱内壁，不要一直看下方。」' },
    { speaker: '布洛克', text: '「下面开始有孢光了。记住，蓝得太均匀的地方别踩。那通常不是地面，是一整片等着合拢的菌毯。」' },
    { speaker: '凯娅', text: '「吊舱外侧有旧刮痕。不是机械磨损，是某种带钩的东西抓过。希望它今晚不加班。」' },
    { speaker: '瑟琳', text: '「下方孢光出现得太早了，比公会记录提前了至少三层缆距。」' },
    { speaker: '瑟琳', text: '「记录可能已经过期。抵达后先确认前线据点情况，不要急着深入孢海。」' },
    { speaker: '主持人', text: '吊舱继续下沉。头顶的城市逐渐缩成一圈遥远的灯火，而脚下的蓝绿色光海，正一点点变得清晰。' },
  ],
  hints: [
    '固定安全扣，适应垂降【体质DC10】',
    '观察下方异常孢光带【感知DC13】',
    '抵达孢海据点，确认当地情况',
  ],
};

const SPORE_OUTPOST_ARRIVAL: ScriptedScene = {
  id: 'spore-outpost-arrival',
  triggers: ['抵达孢海据点并确认前线情况', '抵达孢海据点', '前往孢海据点', '抵达孢海前线据点', '确认当地情况'],
  setArea: '无光孢海·孢海据点',
  bgImage: '/assets/scenes/jidi.webp',
  bgm: '/assets/bgm/bgm_04b_fungal_sea_explore.mp3',
  statePatch: {
    spore_outpost_reached: true,
    arrivedSporeOutpost: true,
    currentNodeId: 'sidequest_ailin_wounded_names',
  },
  events: ['抵达第一层孢海据点'],
  lastEvent: '抵达无光孢海第一层前线据点',

  lines: [
    { speaker: '主持人', text: '吊舱最终落在一座钉入岩壁的钢木平台上。这里仍有符文灯、守卫和补给箱，却安静得不像一处前线据点。' },
    { speaker: '主持人', text: '淡蓝色孢尘覆盖着护栏与箱盖，平台外侧，巨型真菌像倒塌的塔楼般从黑暗中升起，菌盖深处闪着不规律的冷光。' },
    { speaker: '尼布', text: '「蓝伞尼布，孢海据点守夜人。你们是逆穹城派来的远征队？」' },
    { speaker: '尼布', text: '「浅层地图可以给你们。但记住，别追那些异常荧光，也别回应远处的喊声。会喊人的东西，不一定还是人。」' },
    { speaker: '艾琳', text: '「这里还有伤员。我先确认孢毒和污染程度，能稳定一个算一个。」' },
    { speaker: '布洛克', text: '「蓝伞浅滩最近不该这么亮。先看风向、孢尘厚度和菌毯边界，再决定从哪条路进去。」' },
    { speaker: '凯娅', text: '「补给箱少了两个封扣，锁痕很新。这里有人走得很急，也可能有人拿走了不该拿的东西。」' },
    { speaker: '瑟琳', text: '「先确认据点记录、队伍状态和进入路线。离开这里之后，就是真正的无光孢海。」' },
  ],
  hints: [
    '停下协助艾琳救治伤员',
    '判断伤员污染程度【医疗DC12】',
    '整理阵亡者名册【调查DC13】',
  ],
};

// ============================================================
// 蓝伞浅滩战后固定结算
// ============================================================
const AFTER_BATTLE_BLUE_SHOAL: ScriptedScene = {
  id: 'after-battle-blue-shoal',
  manualOnly: true,
  triggers: ['蓝伞浅滩战后结算'],
  setArea: '无光孢海·蓝伞浅滩出口',
  bgm: '/assets/bgm/bgm_04b_fungal_sea_explore.mp3',
  statePatch: {
    blue_shoal_battle_done: true,
    completedBlueShoalBattle: true,
    battle_blue_shoal_result: 'win',
    currentNodeId: 'sidequest_brock_echo_grove',
  },
  events: ['蓝伞浅滩战斗结束', '发现污染异常'],
  lastEvent: '蓝伞浅滩战斗结束，发现敌人被更深处污染驱赶',
  lines: [
    { speaker: '主持人', text: '最后一只孢化生物倒下后，浅滩上的蓝光并没有立刻熄灭。相反，远处的菌毯像受到惊扰般一圈圈亮起。' },
    { speaker: '布洛克', text: '「它们不是在狩猎，是被什么东西从更深处赶出来的。」' },
    { speaker: '艾琳', text: '「这些生物的伤口里有污染残留。不是普通孢毒，更像是某种侵蚀。」' },
    { speaker: '凯娅', text: '「前面有旧路标。有人曾经从这里往据点方向撤退，而且撤得很急。」' },
    { speaker: '瑟琳', text: '「继续前进。旧远征停靠点应该就在前方。」' },
  ],
  hints: [
    '跟随布洛克调查回声菌林',
    '听布洛克解释呼救声规律【生存DC13】',
    '协助布洛克配置净化粉【自然DC14】',
  ],
};

// ============================================================
// 前线废弃据点
// ============================================================
const ABANDONED_FORWARD_POST: ScriptedScene = {
  id: 'abandoned-forward-post',
  triggers: ['前往前线废弃据点', '前往废弃据点', '调查废弃据点', '进入废弃据点'],
  setArea: '无光孢海·废弃据点',
  bgImage: '/assets/scenes/abandoned-post.webp',
  bgm: '/assets/bgm/bgm_04b_fungal_sea_explore.mp3',
  statePatch: {
    frontline_abandoned_outpost_reached: true,
    reachedAbandonedForwardPost: true,
    currentNodeId: 'sidequest_kaiya_broken_seals',
  },
  events: ['发现前线废弃据点', '发现远征痕迹和黑石异常'],
  lastEvent: '抵达前线废弃据点，发现失踪远征队痕迹',
  lines: [
    { speaker: '主持人', text: '前方出现一座半塌的旧据点。外墙仍挂着逆穹城旧徽记，木门却被从内侧撞断。' },
    { speaker: '主持人', text: '补给箱空了一半，墙上残留着地底堡垒的旧标识。菌丝没有吞掉这里，只是安静地钻进每一道缝隙。' },
    { speaker: '凯娅', text: '「补给箱少了两个封扣，锁痕很新。不是魔物咬的，是人手。」' },
    { speaker: '布洛克', text: '「有人从这里往骨柱湿地方向撤了。脚步很乱，像是边走边打。」' },
    { speaker: '艾琳', text: '「墙壁上有地底堡垒的旧标记。我们离目标层越来越近了。」' },
    { speaker: '瑟琳', text: '「先确认据点的记录和痕迹，再决定下一步。不要在这里停留太久。」' },
  ],
  hints: [
    '让凯娅检查少了两个封扣',
    '检查补给箱封扣与锁痕【调查DC12】',
    '让凯娅判断暗道机关【巧手DC13】',
  ],
};

// ============================================================
// 骨柱湿地战后：发现莱因
// ============================================================
const RHEIN_ENCOUNTER: ScriptedScene = {
  id: 'rhein-encounter',
  manualOnly: true,
  triggers: ['骨柱湿地战后发现幸存者'],
  setArea: '无光孢海·骨柱湿地尽头',
  bgImage: '/assets/scenes/bone-pillar-marsh.webp',
  bgm: '/assets/bgm/bgm_04b_fungal_sea_explore.mp3',
  statePatch: {
    bone_marsh_battle_done: true,
    completedBoneMarshBattle: true,
    battle_bone_marsh_result: 'win',
    metRhein: true,
    currentNodeId: 'rhein_encounter_choice',
    rhein_encounter_started: true,
  },
  events: ['发现地底堡垒幸存者莱因'],
  lastEvent: '在骨柱湿地尽头发现一名精神濒临崩溃的堡垒士兵',
  lines: [
    { speaker: '主持人', text: '骨柱湿地尽头，一具盔甲靠在断裂菌柱旁。最初你以为那是尸体，直到里面传来断断续续的呼吸。' },
    { speaker: '主持人', text: '那人胸前的徽记已经磨花，但仍能认出地底堡垒的旧纹章。他的手指在泥里反复划着同一个残缺圆环。' },
    { speaker: '莱因', text: '「不对……不是这条路……钟响了，灯灭了，他们还在点名……别让我回去……」' },
    { speaker: '艾琳', text: '「他还活着，但精神污染很严重。」' },
    { speaker: '凯娅', text: '「带上他会拖慢速度。不带他，我们会少很多麻烦。」' },
    { speaker: '瑟琳', text: '「选择权在你。只是这一次，选择会被记住。」' },
  ],
  hints: [
    '帮助莱因',
    '无视莱因，继续前进',
  ],
};

// ============================================================
// Boss 战前休整点
// ============================================================
const PRE_BOSS_REST: ScriptedScene = {
  id: 'pre-boss-rest',
  manualOnly: true,
  triggers: ['进入黑石根区休整', 'Boss战前休整'],
  setArea: '无光孢海·黑石根区前沿',
  bgImage: '/assets/scenes/blackstone-root.webp',
  bgm: '/assets/bgm/bgm_04b_fungal_sea_explore.mp3',
  statePatch: {
    pre_boss_rest_done: true,
    blackstone_root_reached: true,
    currentNodeId: 'sidequest_serin_cracked_silver_staff',
  },
  events: ['抵达黑石根区前沿', 'Boss战前最后休整'],
  lastEvent: '在Boss战前完成最后休整',
  lines: [
    { speaker: '主持人', text: '黑石根区就在前方。菌丝到了这里不再柔软，而是像烧黑的根须一样缠进岩层。' },
    { speaker: '主持人', text: '空气中每隔数息就有一次低沉脉冲，像某种巨大的锁仍在地下尝试闭合。' },
    { speaker: '瑟琳', text: '「这里适合短暂休整。检查药剂、装备和伤势。再往前，就没有安全的地方了。」' },
  ],
  hints: [
    '检查瑟琳银杖裂痕',
    '和瑟琳交谈',
    '让瑟琳分析黑石脉冲规律【奥秘DC14】',
  ],
};

// ============================================================
// Boss 核心选择
// ============================================================
const BLACKSTONE_CORE_CHOICE: ScriptedScene = {
  id: 'blackstone-core-choice',
  manualOnly: true,
  triggers: ['Boss核心暴露后的选择'],
  setArea: '无光孢海·黑暗之门前庭',
  bgImage: '/assets/scenes/blackstone-gatekeeper.webp',
  bgm: '/assets/bgm/bgm_07_blackstone_guardian_boss.mp3',
  statePatch: {
    boss_defeated: true,
    bossDefeated: true,
    blackstone_gatekeeper_result: 'win',
    currentNodeId: 'choice_blackstone_core',
    core_choice_pending: true,
  },
  events: ['Boss核心暴露', '关键选择：破坏或稳定核心'],
  lastEvent: '黑石门卫核心暴露，必须在破坏和稳定之间做出选择',
  lines: [
    { speaker: '主持人', text: '黑石门卫胸口的方尖碑碎片终于暴露出来。黑色裂纹在它表面一张一合，像某种还在工作的锁。' },
    { speaker: '瑟琳', text: '「如果破坏它，门可能会立刻打开。但封锁也会一起崩溃。」' },
    { speaker: '艾琳', text: '「如果它仍在压制污染，直接破坏会有风险。」' },
    { speaker: '凯娅', text: '「稳定它更慢，但也许能保住后路。」' },
    { speaker: '布洛克', text: '「别磨太久。它快要重新合上了。」' },
  ],
  hints: [
    '破坏核心，强行开路',
    '稳定核心，保留封印',
  ],
};

export const SCRIPTED_SCENES: ScriptedScene[] = [
  OPENING,
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
  AFTER_BATTLE_BLUE_SHOAL,
  ABANDONED_FORWARD_POST,
  RHEIN_ENCOUNTER,
  PRE_BOSS_REST,
  BLACKSTONE_CORE_CHOICE,
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
