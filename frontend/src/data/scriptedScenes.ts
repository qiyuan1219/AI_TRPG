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
  condition?: string;
}

export interface ScriptedScene {
  id: string;
  triggers: string[];
  lines: ScriptedLine[];
  hints: string[];
  battlePrep?: Array<{ id: string; label: string; type: 'battlePrep'; desc: string; canUseRerollItems?: boolean; autoSuccessWhen?: string; greatSuccessWhen?: string; alwaysSuccess?: boolean; check?: { skill: string; altSkill?: string; dc: number; label: string }; successText: string; greatSuccessText?: string; failText?: string; successEffect: { flags?: Record<string, boolean>; battleEffects?: Record<string, any> }; greatSuccessEffect?: { flags?: Record<string, boolean>; battleEffects?: Record<string, any> }; failEffect?: { flags?: Record<string, boolean>; battleEffects?: Record<string, any> } }>;
  setArea?: string;
  bgImage?: string;
  bgm?: string;
  statePatch?: Record<string, any>;
  events?: string[];
  lastEvent?: string;
  autoDicePoker?: boolean;
  clues?: Array<{ id: string; name: string; description: string; source: string; tags: string[]; icon?: string; relatedDocuments?: string[]; imageUrl?: string }>;
  manualOnly?: boolean;
}

const KAIYA_PASSPHRASE_CLUE = {
  id: 'clue_black_market_password',
  name: '凯娅的暗号',
  description: '萨洛在酒馆告诉你的黑市暗号是"断缆不问来路"。到黑市找凯娅时，必须亲口说出这句话，她才愿意听完来意。',
  source: '回声酒馆 · 萨洛',
  tags: ['凯娅', '黑市', '暗号', '招募'],
  icon: 'note-pin',
};

// ============================================================
// 开场剧情 —— 从逆穹悬城到教学战斗触发
// ============================================================
const OPENING: ScriptedScene = {
  id: 'opening',
  triggers: [],
  setArea: '逆穹悬城·主缆街',
  bgImage: '/assets/scenes/opening-hunter-back.webp',
  bgm: '/assets/bgm/bgm_02_inverse_city.mp3',
  lastEvent: '抵达逆穹悬城入城平台，第一次遭遇裂隙爬兽',
  lines: [
    // ===== 世界观 =====
    { speaker: '主持人', text: '地表诸国的历史，不过记载了这个世界最年轻、也最安全的一部分。', bgImage: '/assets/scenes/opening/opening01.webp' },
    { speaker: '主持人', text: '在王国疆界之外，在阳光无法抵达的幽暗地域深处，埋藏着一段被刻意封存的往事。' },
    { speaker: '主持人', text: '一千年前，大地深处出现了一道贯穿位面的裂口。后来的人们将它称为——地心之门。', bgImage: '/assets/scenes/opening/opening02.webp' },
    { speaker: '主持人', text: '门的另一端，连接着九层地狱的第一层：阿弗纳斯。' },
    { speaker: '主持人', text: '战争随之降临，炼狱魔物穿过裂口涌入地下，污染矿脉，占据城邦，将大片幽暗地域变成无法通行的死地。', bgImage: '/assets/scenes/opening/opening03.webp' },
    { speaker: '主持人', text: '最终，三位英雄携带三件圣遗物深入地底，在付出惨重代价后封闭了地心之门。', bgImage: '/assets/scenes/opening/opening04.webp' },
    { speaker: '主持人', text: '为了防止封印再次松动，他们在门的上方修建了一座地底堡垒。' },
    { speaker: '主持人', text: '从那以后，最精锐的骑士、法师与工匠世代驻守于此，监视封印，也阻挡任何从深处爬出的东西。' },

    // ===== 逆穹悬城 =====
    { speaker: '主持人', text: '随着驻军、矿工和商队不断聚集，一座前线补给城逐渐出现在堡垒上方的巨大洞窟中。', bgImage: '/assets/scenes/opening/opening05.webp' },
    { speaker: '主持人', text: '那就是逆穹悬城——幽暗地域最深处，也是地表文明最后的一座永久据点。' },
    { speaker: '主持人', text: '整座城市倒悬于洞穴穹顶，街道、房屋与塔楼全都朝向下方深渊。' },
    { speaker: '主持人', text: '九条秘银主缆贯穿城内，支撑街区，稳定重力，也为防御法阵输送能量。' },
    { speaker: '主持人', text: '城市中央，一座被称为降渊缆梯的巨型升降装置垂入黑暗。' },
    { speaker: '主持人', text: '它是逆穹城通往更深层区域的唯一稳定通道。' },
    { speaker: '主持人', text: '而那座守卫地心之门的地底堡垒，就在缆梯尽头的深渊之下。' },

    // ===== 危机 =====
    { speaker: '主持人', text: '十年前，地底堡垒按惯例发出了最后一次守备信号。内容一切正常，此后便彻底沉默。', bgImage: '/assets/scenes/opening/opening05_2.webp' },
    { speaker: '主持人', text: '逆穹城先后派出多支侦察队和远征队，试图恢复联系。但没有一支队伍返回，也没有任何消息从深处传回来。' },
    { speaker: '主持人', text: '最初，人们将这场沉默归咎于塌方、法阵故障，或者深层魔物的袭击。' },
    { speaker: '主持人', text: '直到最近几个月，情况开始急剧恶化。' },
    { speaker: '主持人', text: '从深层矿道上涌的魔物数量增加了数倍。裂隙爬兽闯入商路，孢化地底兽袭击矿场，连城防记录中从未出现过的生物也开始接近逆穹城。', bgImage: '/assets/scenes/opening/opening06.webp' },
    { speaker: '主持人', text: '城里的每个人都明白：深渊之下，一定发生了什么。' },

    // ===== 赏金猎人 =====
    { speaker: '主持人', text: '而今天故事的主角，是你——{name}。一名往来于各大城邦之间的赏金猎人。', bgImage: '/assets/scenes/opening/opening07.webp' },
    { speaker: '主持人', text: '你不是刚在公会登记的新手，也不是为了几枚金币便敢闯进巢穴的亡命徒。' },
    { speaker: '主持人', text: '你曾在北地追踪霜龙，也曾深入南方沼泽，清理被巫妖污染的地下水脉。' },
    { speaker: '主持人', text: '从废弃矿城到边境要塞，这片大陆许多见不得光的地方，都留下过你的脚印。' },

    // ===== 指名委托 =====
    { speaker: '主持人', text: '三个月前，一份来自逆穹城的指名委托被送到你手中。', bgImage: '/assets/scenes/opening/opening08.webp' },
    { speaker: '主持人', text: '没有寒暄，没有多余说明，羊皮纸上只有几行经过公会认证的文字。' },
    { speaker: '主持人', text: '「深入幽暗地域，抵达逆穹悬城。调查地底堡垒与历次远征队失联的原因。确认地心之门封印状态。带回生还者、调查记录，或者足以证明真相的证据。」' },
    { speaker: '主持人', text: '委托报酬丰厚，危险等级却没有标注上限。你接下了它。' },


    { speaker: '主持人', text: '出发前，公会要求你补完最后一份登记档案。那不是职业证明，也不是头衔认证，而是一份关于“你通常如何活下来”的记录。' },
    { speaker: '主持人', text: '有人依靠体魄和耐力穿过危险，有人依靠速度和警觉避开死亡；有人擅长分析异常规则，也有人更懂得与活人、伤员和幸存者交谈。' },
    { speaker: '主持人', text: '在幽暗地域里，所谓流派并不代表身份高低。它只说明当危险降临时，你会本能地选择哪一种方式面对它。' },
    { speaker: '主持人', text: '你在登记页上停下笔，开始确认自己的冒险者流派。' },



    // ===== 旅途 =====
    { speaker: '主持人', text: '你沿着一条废弃的符文矿道不断下行，起初还能看见锈蚀矿车与熄灭的矮人锻炉。', bgImage: '/assets/scenes/opening/opening09.webp' },
    { speaker: '主持人', text: '越往深处，空气越发潮湿，蓝绿色菌斑开始爬满岩壁。' },
    { speaker: '主持人', text: '再往下，连矮人的路标也消失了。黑暗中，只剩侏儒工程师留下的发光铆钉，引着你继续深入。', bgImage: '/assets/scenes/opening/opening10.webp' },

    // ===== 抵达 =====
    { speaker: '主持人', text: '不久后，矿道尽头终于吹来带着矿尘与孢粉气味的风。', bgImage: '/assets/scenes/opening/opening11.webp' },
    { speaker: '主持人', text: '脚下岩地逐渐变成刻有防御符文的石板，并一路延伸向前方吊桥。' },
    { speaker: '主持人', text: '吊桥尽头，一扇布满封印咒文的巨大石门挡住去路。' },
    { speaker: '主持人', text: '公会徽记通过核验后，锁链转动，石门在轰鸣声中缓缓开启。逆穹悬城的入城平台，就在门后。' },

    // ===== 城市初见 =====
    { speaker: '主持人', text: '你穿过重力定向法阵，短暂失重后，整个世界在眼前猛然翻转。' ,bgImage: '/assets/scenes/01city.webp'  },
    { speaker: '主持人', text: '双脚重新落地时，一座倒悬于洞穴穹顶之上的城市出现在你面前。' },
    { speaker: '主持人', text: '房屋紧贴岩层，桥梁横跨街区，尖塔垂向下方无尽的深渊。' },
    { speaker: '主持人', text: '九条秘银主缆贯穿全城，表面的符文随着低沉震动不断明灭。防御弩塔守在街角，数百盏符文灯照亮倒悬的街道。' },
    { speaker: '主持人', text: '城市中央，一口巨大的深井贯穿层层建筑。深井之下，蓝绿色孢光缓慢起伏，仿佛黑暗中沉睡着一片会呼吸的海洋。' },

    // ===== 守卫 =====
    { speaker: '守卫', text: '「你就是地表来的赏金猎人？」' },
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
  ],
  hints: [],
  statePatch: {
    first_choice_resolved: false,
    tutorial_battle_done: false,
    tutorial_battle_pending: true,
    serlin_intro_pending: true,
    currentNodeId: 'opening_tutorial_battle',
  },
};

// ============================================================
// 瑟琳介绍完毕后 → 教学战斗触发（serlin_intro_pending 清除后由 completeSerlinIntro 播放）
// ============================================================
const OPENING_SUSPENSE: ScriptedScene = {
  id: 'opening-suspense',
  manualOnly: true,
  triggers: ['开场疑云'],
  setArea: '逆穹悬城·主缆街',
  bgImage: '/assets/scenes/0101cable-street-walk.webp',
  lastEvent: '裂隙爬兽冲出吊箱，教学战斗触发',
  statePatch: {
    tutorial_battle_pending: true,
    first_choice_resolved: false,
    currentNodeId: 'opening_tutorial_battle',
  },
  events: ['裂隙爬兽袭击'],
  lines: [
    { speaker: '主持人', text: '瑟琳转身走向街口。她的步子不快，却很稳，像是已经习惯在这座倒悬城市的边缘行走。' },
    { speaker: '主持人', text: '你跟在她身后，穿过一条由黑石与金属梁架成的主缆街。街道一侧是倒挂的民居与商铺，另一侧则能看见深井下方翻涌的蓝绿色孢光。' },
    { speaker: '瑟琳', text: '「逆穹城的道路不按地面城市的逻辑运转。这里的街区靠主缆、绞盘和符文制动维持稳定。听见钟声、缆鸣或者金属崩裂声时，第一反应不是抬头看，而是先确认脚下。」' },
    { speaker: '主持人', text: '她说话时，远处一条粗大的秘银缆索低低震动，声音沉闷得像某种巨兽在石层深处翻身。行人们对此并不惊讶，只是熟练地往街道内侧让了让。' },
    { speaker: '瑟琳', text: '「近一个月，这种异常缆鸣越来越频繁。城防署说只是负载问题，但我不这么认为。」' },
    { speaker: '主持人', text: '你注意到街边有几名工匠正在检查吊运轨道。木箱、补给袋和矿石吊篮被悬挂在半空，沿着缆车轨道缓慢移动。每只吊箱外侧都贴着封条，封条上印着公会与城防署的双重印记。' },
    { speaker: '瑟琳', text: '「公会登记处就在前面。登记之后，你会拿到临时通行许可。没有它，你无法进入缆梯中枢，也无法接触远征队档案。」' },
    { speaker: '主持人', text: '她停顿了一下，目光扫过你腰间的装备，又落回街道前方。' },
    { speaker: '瑟琳', text: '「在此之前，记住一件事：这座城市看起来还在运转，不代表它安全。逆穹城只是习惯了把危险藏在日常里面。」' },

    { speaker: '主持人', text: '你们刚走出街口，前方便传来一阵刺耳的警铃。街边的符文灯同时闪烁，几名工匠猛地抬头，脸色瞬间变了。' },
    { speaker: '工匠', text: '「三号吊轨失衡！让开！都让开！」' },
    { speaker: '主持人', text: '下一秒，半空中的一只运输吊箱剧烈摇晃。固定它的金属扣发出连续的崩裂声，缆索像被无形的手撕开一样绷断。', bgImage: '/assets/scenes/02tutorial-battle-trigger.webp' },
    { speaker: '主持人', text: '吊箱从轨道上脱离，重重砸在街面上。木板碎裂，铁片翻卷，蓝绿色孢尘从箱体缝隙里喷涌而出，瞬间淹没了半条街。' ,bgImage: '/assets/scenes/02tutorial-battle-trigger.webp' },
    { speaker: '主持人', text: '人群惊叫着后退。几名巡街守卫刚想上前，箱体内部却传来密集的刮擦声，像许多细小的爪子正在同时撕扯木板。' ,bgImage: '/assets/scenes/02tutorial-battle-trigger.webp'},
    { speaker: '瑟琳', text: '「后退，别吸入孢尘。」' ,bgImage: '/assets/scenes/02tutorial-battle-trigger.webp'},
    { speaker: '主持人', text: '她抬起银杖，寒白色法光在杖尖聚成一圈，将翻涌的孢尘短暂压低。你这才看清，箱中没有补给，只有数只沾满孢粉的裂隙爬兽。' ,bgImage: '/assets/scenes/02tutorial-battle-trigger.webp'},
    { speaker: '主持人', text: '那些生物像是刚从狭窄的黑暗里被惊醒，背部甲壳不断开合，口器里流出带着荧光的黏液。它们不是有组织地伏击，更像是被吊箱坠落和人群尖叫彻底激怒。' ,bgImage: '/assets/scenes/02tutorial-battle-trigger.webp'},
    { speaker: '主持人', text: '其中一只裂隙爬兽踏着断裂缆索跃起，锋利的前肢在石面上拖出一串火星，径直扑向你。' ,bgImage: '/assets/scenes/02tutorial-battle-trigger.webp'},
    { speaker: '瑟琳', text: '「别退向护栏！那里没有第二次落脚机会！」' ,bgImage: '/assets/scenes/02tutorial-battle-trigger.webp'},
    { speaker: '主持人', text: '瑟琳的银杖向前一指，寒白色法光照亮了裂隙爬兽腹侧一片没有硬壳覆盖的软甲。' ,bgImage: '/assets/scenes/02tutorial-battle-trigger.webp'},
    { speaker: '瑟琳', text: '「看清楚它的动作。腹侧软肋是弱点，等它跃起时攻击。」' ,bgImage: '/assets/scenes/02tutorial-battle-trigger.webp'},
    { speaker: '主持人', text: '裂隙爬兽已经逼近。周围的行人四散逃离，巡街守卫被孢尘阻隔在另一侧，而你正站在它冲锋路线的正前方。' ,bgImage: '/assets/scenes/02tutorial-battle-trigger.webp'},
    { speaker: '主持人', text: '这是你抵达逆穹城后的第一场战斗。按照你平时战斗的思路来吧' ,bgImage: '/assets/scenes/02tutorial-battle-trigger.webp'},
  ],
  hints: [
    '正面迎击裂隙爬兽【力量DC10】',
    '观察弱点寻找破绽【感知DC10】',
    '请求瑟琳施展辅助法术【魅力DC12】',
    '闪避并寻找掩护位置【敏捷DC10】',
  ],
};

// ============================================================
// 教学战斗后 → 战后固定剧情
// ============================================================
const TUTORIAL_BATTLE_AFTER: ScriptedScene = {
  id: 'tutorial-battle-after',
  manualOnly: true,
  triggers: ['教学战斗后剧情'],
  setArea: '逆穹悬城·主缆街',
  bgImage: '/assets/scenes/03post-battle-street.webp',
  statePatch: {
    tutorial_battle_done: true,
    tutorial_battle_pending: false,
  },
  events: ['教学战斗完成'],
  lastEvent: '击退补给吊箱中的裂隙爬兽，守卫引导前往冒险者公会',
  lines: [
    { speaker: '主持人', text: '最后一只裂隙爬兽被银白色光芒逼退，撞在吊箱边缘，蜷缩着失去了攻击性。' },
    { speaker: '主持人', text: '它没有继续扑咬，反而本能地缩向吊箱阴影深处，像是那道光比刀刃更让它恐惧。' },
    { speaker: '瑟琳', text: '「没有重伤。很好，你的反应速度比大部分第一次进悬城的人快。」' },
    { speaker: '瑟琳', text: '「不过你也看到了，它们对银白光的反应很异常。普通野兽不会这样退缩。」' },
    { speaker: '守卫', text: '「这是从孢海据点回收的空箱。最近三个月，类似事件发生了四次。」' },
    { speaker: '守卫', text: '「可问题是，补给吊箱入城前都会检查封条。按记录，这只箱子不该被打开过。」' },
    { speaker: '主持人', text: '守卫蹲下查看吊箱边缘。箱门的铜封条还挂在锁扣上，但封蜡内侧有一道不太明显的黑蓝色刮痕。' },
    { speaker: '主持人', text: '那痕迹不像是从外面撬开的，倒像是有什么东西曾经贴着箱壁，被硬生生拖进了里面。' },
    { speaker: '守卫', text: '「感谢你们出手。如果让它们冲进吊桥区，今天的通行记录上就要多几行红字了。这里有一些补给物资，请收下吧。」' },
    { speaker: '主持人', text: '守卫把一只应急补给袋递给你，又警惕地看了一眼吊箱封条。' },
    { speaker: '瑟琳', text: '「不是偶然。它们不是主动潜进来的——箱壁内侧有拖痕，像是被什么东西赶上去的。」' },
    { speaker: '瑟琳', text: '「而且它们怕的未必是光本身。刚才我的术式里混了逆钟学派的净化银辉，可能刺激到了它们体内的裂隙孢核。」' },
    { speaker: '主持人', text: '主缆街短暂安静下来，远处城市缆索发出低沉震响。吊箱残骸旁，封条、拖痕和魔物畏光的反应都显得格外刺眼。' },
    { speaker: '守卫', text: '「冒险者公会在倒挂塔楼区，顺着主缆走到底。你们的委托应该需要先登记。」' },
    { speaker: '守卫', text: '「当然，如果你们想在离开前多看一眼吊箱封条，我不会拦着。只是别碰里面残留的孢粉。」' },
    { speaker: '瑟琳', text: '「先过去也可以。米娜应该已经在等你了。」' },
    { speaker: '瑟琳', text: '「但如果你想问那些魔物为什么怕光，现在问我也来得及。这个现象，可能和孢海深处的异常有关。」' },
  ],
  hints: [
    '放弃调查，直接前往冒险者公会登记',
    '查看吊箱封条【智力DC10】',
    '询问瑟琳这些魔物为什么怕光【智力DC8】',
  ],
};



// ============================================================
// 教学战斗后 → 抵达冒险者公会
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
    { speaker: '主持人', text: '你与瑟琳沿主缆街来到冒险者公会。倒悬的石砌塔楼嵌在街区中央，铁制剑盾徽记悬在门外，被主缆震动带得轻轻摇晃。' },
    { speaker: '主持人', text: '墙上贴满泛黄的任务单与悬赏令，许多名字被红墨划去，旁边只留下简短的备注：失联、阵亡、未归。' },
    { speaker: '主持人', text: '大厅炉火烧得很旺，空气里却仍有地底特有的潮冷。文书员围在地图旁低声交谈，黑缆守卫将一只沾血的回收箱抬到柜台前，封条上还凝着暗色的泥。' },
    { speaker: '主持人', text: '柜台后的年轻女性抬起头。她戴着细框眼镜，深栗色卷发被整齐束在肩后，桌面上的登记册、铜牌和羽笔排得像一场即将开始的审判。' },
    { speaker: '米娜', text: '「你就是公会指名调来的赏金猎人。叫我米娜。先登记姓名、职业和随身装备。」' },
    { speaker: '主持人', text: '她语速很快，却没有催促。每说一句，笔尖便在纸上落下一道清晰的墨痕，像是要把混乱的局势强行整理出秩序。' },
    { speaker: '米娜', text: '「这次不是普通委托。按照公会和城防联合条例，进入无光孢海的远征队不得少于五人。」' },
    { speaker: '米娜', text: '「现在队伍里只有你和瑟琳。剩下的成员，至少要补上治疗与净化、深层生存、地下渠道这三块短板。」' },
    { speaker: '主持人', text: '米娜将三枚空白铜牌放在地图上。铜牌落下时发出沉闷的轻响，分别压住了静默神殿、深层矿道和黑市附近的标记。' },
    { speaker: '米娜', text: '「治疗者能处理孢毒、伤口和精神崩溃；深层向导能判断风向、菌毯和魔物迁徙；懂地下渠道的人，能处理锁具、陷阱、黑市交易和那些不会写进公会档案的麻烦。」' },
    { speaker: '瑟琳', text: '「也就是说，我们必须先找到合适的队友，才能领取下潜许可。」' },
    { speaker: '米娜', text: '「没错。公会不会替你们随便点名。深层远征靠的不只是能力，还要看这些人愿不愿意信任你们。」' },
    { speaker: '主持人', text: '话音刚落，大厅另一侧传来金属手杖敲击石面的声音。交谈声渐渐低了下去，连炉火爆开的轻响都显得格外清楚。' },
    { speaker: '主持人', text: '赫尔曼·断缆从地图阴影中走出。他穿着黑色长大衣，衣领扣得一丝不苟，右眼前的黑石单片镜泛着冷光。那张脸并不苍老，却像被十年的坏消息磨出了棱角。' },
    { speaker: '赫尔曼', text: '「五人编队不是形式，是底线。」' },
    { speaker: '主持人', text: '他停在地图前，戴着皮手套的手指按住地底堡垒的位置。那枚标记已经被反复摩擦，边缘发白，像一道迟迟没有愈合的旧伤。' },
    { speaker: '赫尔曼', text: '「地底堡垒已经失联十年。十年里，我们送下去的队伍够填满这间大厅，可回来的消息，连一页纸都写不满。」' },
    { speaker: '主持人', text: '黑缆守卫低头站在一旁，沾血的回收箱还没有打开。赫尔曼的目光扫过箱子，只停了一瞬，便重新落回你身上。' },
    { speaker: '赫尔曼', text: '「最近三个月，深层魔物的活动频率增加了三倍。孢海风向异常，主缆震动提前，连城市下缘的巡逻队都开始带回不该出现在浅层的爪痕。」' },
    { speaker: '瑟琳', text: '「所以这不是一次普通远征。」' },
    { speaker: '赫尔曼', text: '「普通远征不会把你们叫到这里。」' },
    { speaker: '主持人', text: '他的声音不高，却压得大厅里没人插话。那不是威胁，更像是一个人把最坏的结果提前摆在桌面上，逼所有人看清楚。' },
    { speaker: '赫尔曼', text: '「少于五人的队伍不准下潜。这不是怀疑你的能力，是因为我们已经为\u2018自信\u2019付过太多代价。」' },
    { speaker: '赫尔曼', text: '「我要的不是几个写在登记册上的名字，也不是一支看起来像样的队伍。我要的是有人抵达堡垒，查清沉默的原因，然后活着回来。」' },
    { speaker: '米娜', text: '「公会明档里能调动的人手有限。真正适合这次远征的人，未必愿意把名字挂在任务墙上。」' },
    { speaker: '米娜', text: '「去回声酒馆找萨洛。他不是公会的人，但他知道谁最近还活着，谁有本事，谁又可能愿意接这种麻烦。」' },
    { speaker: '米娜', text: '「不过他有个规矩：先陪他玩一局快艇骰子。赢了，他才会判断你们值不值得听真话。」' },
    { speaker: '主持人', text: '赫尔曼收回手指，地图上那枚地底堡垒的标记仍被压出一道浅痕。' },
    { speaker: '赫尔曼', text: '「骰子、报酬、信任、人情……这些听起来不像军令，但在深处，它们往往比军令更有用。」' },
    { speaker: '赫尔曼', text: '「记住，赏金猎人。你们不是去证明勇气的。勇气在地底不稀罕，能活着带回真相的人才稀罕。」' },
    { speaker: '瑟琳', text: '「那我们先去回声酒馆。找到合适的队友后，再回来领取正式下潜许可。」' },
    { speaker: '米娜', text: '「我会把你们的临时编队登记为待确认状态。五人到齐，能力缺口补齐，公会才会放行。」' },
    { speaker: '主持人', text: '你接过米娜递来的临时登记铜牌。铜牌还带着炉火的余温，可地图上通往深层的那条线，却冷得像一截没有尽头的铁索。' }
  ],
  hints: [
    '前往回声酒馆找萨洛打听三名队友',
    '观察柜台旁的报告单【智力DC12】',
    '说服米娜查看失踪远征队登记册【魅力DC11】',
    '检查委托火漆与公会认证【智力DC10】',
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
    { speaker: '主持人', text: '回声酒馆藏在倒挂街区的侧巷深处。门口没有醒目的招牌，只有一只旧铜铃悬在梁下，随着主缆远处传来的震动轻轻作响。' },
    { speaker: '主持人', text: '你们推门进去时，炉火正旺。热气、麦酒香、潮湿皮革和矿尘的味道混在一起，驱散了街巷里那股冰冷的孢光。' },
    { speaker: '主持人', text: '酒馆里的人不多，却都坐得很分散。有人低声谈着远征队的传闻，有人把斗篷压得很低，像是不愿让别人看清自己的脸。' },
    { speaker: '主持人', text: '吧台后，一个中年男人正慢条斯理地擦着酒杯。他动作很稳，像是早已习惯了在吵闹、谎言和麻烦之间保持耐心。' },
    { speaker: '主持人', text: '直到你们提到"公会"两个字，他才停下手里的动作，抬眼看了过来。那目光不算锋利，却像能把人心里的犹豫和底牌都照出来。' },
    { speaker: '萨洛', text: '「公会的新远征队？」' },
    { speaker: '主持人', text: '萨洛把酒杯放回架子上，嘴角露出一丝意味不明的笑。' },
    { speaker: '萨洛', text: '「米娜让你们来的吧。她每次都说只是\u2018请我帮个小忙\u2019，最后都会变成我替她收拾一堆麻烦。」' },
    { speaker: '瑟琳', text: '「我们需要补齐远征队的人手。公会说，你知道谁适合这次下潜。」' },
    { speaker: '萨洛', text: '「适合？这词听着比\u2018愿意送死\u2019体面多了。」' },
    { speaker: '主持人', text: '他用指节轻轻敲了敲吧台。铜铃又响了一声，像是在替这句话落下句点。' },
    { speaker: '萨洛', text: '「让我猜猜。你们缺一个能救命的人，一个能在孢海里认路的人，还缺一个懂地下规矩、知道哪扇门不该从正面开的家伙。」' },
    { speaker: '主持人', text: '瑟琳微微眯起眼，似乎在判断萨洛究竟知道多少。' },
    { speaker: '瑟琳', text: '「看来米娜没有说错。你确实知道该去找谁。」' },
    { speaker: '萨洛', text: '「我知道很多人。知道他们的下落、习惯、脾气，欠过谁的人情，喝醉以后会说什么梦话……这座城里有些事，公会档案不会写，但酒馆会记得。」' },
    { speaker: '主持人', text: '萨洛从吧台下取出一只旧木骰盅，五颗骨骰在里面轻轻碰撞，发出干脆的声响。' },
    { speaker: '萨洛', text: '「不过，情报不是酒水，不能直接端上来。」' },
    { speaker: '瑟琳', text: '「你要钱？」' },
    { speaker: '萨洛', text: '「钱最没意思。真正危险的远征，花钱的人反而死得最快。」' },
    { speaker: '主持人', text: '他把骰盅推到你们面前，目光从每个人脸上扫过，最后停在你身上。' },
    { speaker: '萨洛', text: '「我想看看你们怎么做决定。是贪心，是保守，是相信运气，还是相信同伴。」' },
    { speaker: '萨洛', text: '「陪我玩一局快艇骰子。五颗骰子，最多重掷三轮。每一轮，你都可以决定保留哪些骰子，重掷哪些骰子。」' },
    { speaker: '萨洛', text: '「赢了，我告诉你们该找谁。输了，我也会给线索，但你们得承认一件事——这间酒馆，比公会更懂人。」' },
    { speaker: '主持人', text: '瑟琳没有立刻回应。她借着整理披肩的动作靠近你，声音压得很低，几乎被炉火噼啪声盖住。' },
    { speaker: '瑟琳', text: '「他不是单纯在刁难我们。他想判断我们值不值得听真话，也想判断那些人能不能交给我们。」' },
    { speaker: '主持人', text: '她的指尖掠过袖口，一缕极淡的银色符文在掌心一闪即逝。' },
    { speaker: '瑟琳', text: '「我的法术能短暂预判骰子的走向。我会给出建议，但保留哪些骰子、冒不冒险，最后由你决定。」' },
    { speaker: '主持人', text: '萨洛像是没有听见你们的低语，只是把五颗骰子一颗一颗摆在吧台上。' },
    { speaker: '萨洛', text: '「来吧，新远征队。让我看看，米娜这次是找来了希望，还是又给我送来一场麻烦。」' }
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
  clues: [KAIYA_PASSPHRASE_CLUE],
  lines: [
    { speaker: '萨洛', text: '「愿赌服输。你们缺治疗、缺向导，还缺一个懂地下规矩的人。我倒是知道三个合适的。」' },
    { speaker: '萨洛', text: '「先说艾琳——静默神殿的白枝修女。她今晚在神殿，为阵亡守卫主持安魂仪式。去的时候脚步轻些，她不喜欢有人把死者的安宁当成过场。」' },
    { speaker: '萨洛', text: '「她会治疗，会净化，也能把快崩溃的人从噩梦边上拉回来。但记住，她不是随队药箱。你若把伤员当累赘，她会第一个停下脚步。」' },
    { speaker: '萨洛', text: '「第二个，布洛克·铁锅。他就在二楼。别看他整天抱着酒杯，他闻一闻靴底的泥，就知道你从哪片菌毯踩回来。」' },
    { speaker: '萨洛', text: '「孢海的风向、毒囊的颜色、魔物什么时候迁徙，他比公会地图还熟。想请动他，带上采样许可和报酬，再陪他喝一轮。他不信空话，只信酒后还站得稳的人。」' },
    { speaker: '萨洛', text: '「至于第三个，凯娅。她在黑市。那姑娘开锁像翻书，拆陷阱像解谜，听暗号时比神殿司祭听祷词还认真。」' },
    { speaker: '主持人', text: '萨洛撕下一张窄纸条，在上面写下一句话，又用指节压着推到你面前。' },
    { speaker: '萨洛', text: '「找她的时候，先说我告诉你的这句：\u2018断缆不问来路。\u2019这不是信物，只能让她愿意听你把话说完。」' },
    { speaker: '萨洛', text: '「但她只相信看得见的筹码。公会徽记在她眼里不值钱，这张纸条也最多只能让她愿意听你把话说完。」' },
    { speaker: '萨洛', text: '「她最近想要一颗钻石。奥兰爵的幸运盲盒里正好有，二十金一次。能不能抽到，看骰子，也看你舍不舍得赌。」' },
    { speaker: '瑟琳', text: '「明白了。先去静默神殿找艾琳，再回来见布洛克，最后带着暗号和筹码去黑市找凯娅。」' },
    { speaker: '萨洛', text: '「顺序不错。至少听起来，你们还没打算把所有麻烦一起塞进行囊。」' }
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
  bgm: '/assets/bgm/temple.mp3',
  statePatch: {
    al_trust: 55,
    trust_al: 55,
    ailin_answer_pending: true,
  },
  events: ['艾琳提出同行资格问题'],
  lastEvent: '在静默神殿见到艾琳，她等待你回答修女与药箱的问题',
  lines: [
    // ===== 静默神殿 =====
    { speaker: '主持人', text: '静默神殿嵌在倒悬石拱深处。门前没有钟，只有一排不滴蜡的白枝烛悬在半空，火光安静得像凝固的雪。' },
    { speaker: '主持人', text: '你们踏入大厅时，外面的主缆震动被厚重石墙隔绝，只剩下修女们低声诵念安魂祷词。那声音很轻，却像一条缓慢流过黑暗的河。', bgImage: '/assets/scenes/11temple-prayer.webp' },
    { speaker: '主持人', text: '大厅中央陈列着阵亡守卫的遗物：断裂的缆扣、破损的护符、染泥的手套，以及几封没能寄出的家书。每一件遗物旁，都放着一枚写有姓名的小木牌。' },
    { speaker: '瑟琳', text: '「先为他们祈祷吧。这里保存的不只是名字，也是我们必须下去的理由。」' },
    { speaker: '主持人', text: '你们停在遗物台前。烛光掠过瑟琳的银杖，映出几道转瞬即逝的细小裂纹。' },
    { speaker: '艾琳', text: '「愿白枝引导他们穿过无声之地。愿后来者记住，牺牲不是数字，失踪也不是。」'},
    { speaker: '主持人', text: '祷词结束后，修女们依次退开。艾琳没有立刻看向你们，而是俯身整理一封家书的折角，动作轻得像是在替死者掖好最后一角衣襟。' },
    { speaker: '主持人', text: '直到确认每枚木牌都摆正，她才收起圣徽，望向你们胸前的公会徽记。她的神情温和，却没有半点可以被敷衍的软弱。' },
    { speaker: '艾琳', text: '「公会的人很少在安魂仪式后立刻来找我。通常这意味着，下面又有事情发生了。」' },
    { speaker: '瑟琳', text: '「我们要前往无光孢海，调查地底堡垒失联与魔物上涌。队伍需要你的治疗和净化。」' },
    { speaker: '艾琳', text: '「治疗和净化……大家总是先提这两个词。」' },
    { speaker: '主持人', text: '她低头看了一眼自己的药箱。箱角有许多旧划痕，白枝修会的徽章被擦得很亮，像是被无数次握紧过。' },
    { speaker: '艾琳', text: '「可我能做的，不只是让伤口闭合。有人被孢毒折磨到分不清同伴和怪物，有人从深处回来后再也不敢闭眼。那些也需要被救。」' },
    { speaker: '艾琳', text: '「所以我先问清楚。你们需要的是一名修女，还是一个随队药箱？」' },
    { speaker: '主持人', text: '她看向你，目光平静，却像在等待一个足以决定同行资格的答案。' },
  ],
  hints: [],
};

const CATHEDRAL_AILIN_RECRUIT_FINALE: ScriptedScene = {
  id: 'cathedral-ailin-recruit-finale',
  manualOnly: true,
  triggers: ['艾琳回答判定后入队'],
  setArea: '逆穹悬城·静默神殿',
  bgImage: '/assets/scenes/11temple-prayer.webp',
  bgm: '/assets/bgm/temple.mp3',
  statePatch: {
    al_recruited: true,
    temple_ailin_recruited: true,
    ailin_answer_pending: false,
  },
  events: ['艾琳加入队伍'],
  lastEvent: '艾琳加入远征队',
  lines: [
    { speaker: '主持人', text: '她将白枝修会的徽章别在药箱上，又从遗物台旁取下一小束未点燃的白枝烛，放进行囊。' },
    { speaker: '艾琳', text: '「孢毒、恐惧和伤口不会等人。既然你们要下去，我最好现在就开始准备。」' },
    { speaker: '主持人', text: '艾琳为队伍做了简短祈祷。柔和的白光沿着你们的护腕缓缓散开，像一层薄而坚定的庇护。' },
    { speaker: '艾琳', text: '「走吧。愿我们带回真相，也带回那些还没被写进名单里的名字。」' },
  ],
  hints: [
    '回到回声酒馆寻找布洛克',
    '请求艾琳翻阅牺牲者遗录【宗教DC12】',
    '请艾琳展示白枝修会巡礼经文',
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
    { speaker: '主持人', text: '你们回到回声酒馆时，炉火已经烧得更旺。萨洛没说话，只用擦杯子的手朝角落抬了抬下巴。', bgImage: '/assets/scenes/09brock-tavern-table.webp' },
    { speaker: '主持人', text: '那里坐着一个宽肩矮壮的男人。铁锅搁在桌边，酒杯压着一张皱巴巴的孢海草图，旁边还摊着几片晒干的菌片。' },
    { speaker: '布洛克', text: '「别站门口挡风。你们一身公会的味道，我隔着三张桌子我都闻得出来。」', portrait: '/assets/characters/senluo/brock_tavern.webp' },
    { speaker: '萨洛', text: '「布洛克，他们是米娜派来的。」' },
    { speaker: '布洛克', text: '「我听见了。所以我才还坐着，没把他们赶出去。」' },
    { speaker: '主持人', text: '布洛克捻起一片干菌，放在鼻前闻了闻，又把它丢回袋子里。那动作随意，却像是在检查某种比地图更可靠的证据。' },
    { speaker: '布洛克', text: '「公会的人总说自己只是采样。结果呢？会发光的、会咬人的、会救命的，全被他们塞进箱子，最后再问我为什么箱子会长腿逃跑。」' },
    { speaker: '艾琳', text: '「我们不是来搬空孢海的。我们需要你带路，也需要你告诉我们哪些东西不能碰。」' },
    { speaker: '布洛克', text: '「这话比\u2018为了城市\u2019顺耳一点。」' },
    { speaker: '主持人', text: '他抬眼看向艾琳，又看了看你们，目光停在沾着神殿白光的护腕上。粗硬的眉毛微微松了些。' },
    { speaker: '布洛克', text: '「白枝修会的修女都来了？看来这次不是普通送死队。」' },
    { speaker: '瑟琳', text: '「我们准备进入无光孢海，调查堡垒失联和魔物上涌。那里的深层环境远比公会记录复杂，所以想请你担任向导。」' },
    { speaker: '布洛克', text: '「说得对。孢海不会因为你带着公会徽记就让路。风向错了，呼吸会骗你；颜色错了，水也能毒死人。」' },
    { speaker: '主持人', text: '布洛克把酒杯推到桌中央，杯底撞在木桌上，发出沉闷的一声。' },
    { speaker: '布洛克', text: '「想让我跟你们下去，可以。先陪我喝一轮。」' },
    { speaker: '艾琳', text: '「布洛克。」' },
    { speaker: '布洛克', text: '「放心，修女。我不会灌死人。」' },
    { speaker: '布洛克', text: '「孢海里的气味、毒尘、幻听，比这杯酒难受多了。连酒劲都扛不住的人，到了下面只会把同伴认成怪物。」' },
    { speaker: '萨洛', text: '「三轮。先过体质豁免，再拼骰子点数。站得稳是一种本事，知道什么时候停手，也是。」' },
    { speaker: '布洛克', text: '「赢了，我带路。输了也不是不能谈，但下去以后，谁敢乱碰菌毯，我就用这口锅敲醒谁。」' },
    { speaker: '瑟琳', text: '「小心点。他不是在玩酒桌游戏，而是在看你失去优势时会不会乱来。」' },
    { speaker: '布洛克', text: '「银杖小姐说得没错。来吧，让我看看你们是一支队伍，还是一群会走路的事故。」' }
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
    brock_recruited: true,
    brock_spore_sample_deal: true,
  },
  events: ['布洛克加入队伍'],
  lastEvent: '布洛克接受采样与报酬条件，加入远征队',
  lines: [
    // ===== 布洛克加入队伍 =====
    { speaker: '布洛克', text: '「酒量没倒，骰子也没把你们卖了。行，我承认，你们至少不是一群只会喊口号的公会新人。」', bgImage: '/assets/scenes/09brock-tavern-table.webp', portrait: '/assets/characters/senluo/brock_tavern.webp' },
    { speaker: '布洛克', text: '「但条件先说清楚。下去以后，帮我采集三份活性孢子。要活的，不能烧，不能泡酒，更不能像上次那群蠢货一样，把活样本扔进城市排水沟。」' },
    { speaker: '艾琳', text: '「活性孢子如果处理不当，会污染浅层水道。」' },
    { speaker: '布洛克', text: '「听见没？修女都比公会仓库管理员懂这个。」' },
    { speaker: '瑟琳', text: '「报酬由公会结算，采样流程和样本归属会写进附约。我们也会按你的要求处理样本。」' },
    { speaker: '布洛克', text: '「你说话像本账册，不过账册至少可靠。」' },
    { speaker: '主持人', text: '布洛克把桌上的菌片一片片收回袋子，又将铁锅扣在背包外侧。锅底磕上铁扣，发出沉稳的一声。' },
    { speaker: '布洛克', text: '「好，我加入。进了孢海以后听我指挥。别看见发光的东西就伸手，别听见声音就回头，别觉得自己比地底活得更久的东西聪明。」' },
    { speaker: '萨洛', text: '「恭喜，你们获得了一名向导，以及一口会骂人的锅。」' },
    { speaker: '布洛克', text: '「锅比你可靠。」' },
    { speaker: '主持人', text: '萨洛笑着继续擦杯子。远征队里，又多了一名熟悉孢海、脾气粗硬却经验可靠的生存专家。' }
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
    kaiya_passphrase_pending: true,
    kaiya_passphrase_failed: false,
  },
  events: ['抵达黑市', '等待输入凯娅暗号'],
  lastEvent: '抵达黑市，等待输入凯娅的暗号',
  lines: [
    // ===== 黑市·凯娅 =====
    { speaker: '主持人', text: '黑市藏在补给市场背后的斜巷里。冷光灯被黑布遮住，只照亮摊位上的半张桌面。厚重帘幕隔开一间间铺子，也将讨价还价声切得断断续续。', bgImage: '/assets/scenes/07blackmarket-stall.webp' },
    { speaker: '主持人', text: '这里没有人高声招揽生意。摊主们只用目光衡量客人的钱袋、武器，以及是否值得招惹。' },
    { speaker: '主持人', text: '你们在一处旧护符摊前停下。摊主低头擦拭一枚裂纹护符，像是完全没有注意到你们。' },
    { speaker: '主持人', text: '瑟琳没有替你开口。她只看了一眼你收好的纸条，又退后半步，把说出暗号的机会交给你。' },
  ],
  hints: [],
};

const BLACK_MARKET_KAIYA_CONTACT: ScriptedScene = {
  id: 'blackmarket-kaiya-contact',
  manualOnly: true,
  triggers: ['黑市暗号正确，凯娅现身'],
  setArea: '逆穹悬城·黑市',
  bgImage: '/assets/scenes/07blackmarket-stall.webp',
  statePatch: {
    blackmarket_unlocked: true,
    kaiya_intro_seen: true,
    kaiya_passphrase_pending: false,
    kaiya_passphrase_failed: false,
    kaiya_passphrase_used: true,
  },
  events: ['凯娅现身', '幸运盲盒已开放'],
  lastEvent: '在黑市说出暗号，凯娅愿意听完来意',
  lines: [
    { speaker: '主持人', text: '摊主的手指停了一瞬，又继续擦拭护符。下一刻，一个声音从摊位后的阴影里传来。' },
    { speaker: '凯娅', text: '「断缆不问来路……哼，萨洛连这个都交给你了？行，我听你说完。」', portrait: '/assets/characters/kelaiya/kaiya_blackmarket.webp' },
    { speaker: '凯娅', text: '「只问筹码够不够。」' },
    { speaker: '主持人', text: '一名披着短斗篷的女人靠在石柱旁，指尖正转着一只钱袋。你低头看去，才发现那正是自己的。' },
    { speaker: '凯娅', text: '「放心，一枚都没少。我只是想确认，公会这次派来的究竟是远征队，还是一群连口袋都看不住的尸体。」' },
    { speaker: '布洛克', text: '「手倒是挺快。」' },
    { speaker: '凯娅', text: '「你发现得也不算太慢。至少这支队伍还没完全没救。」' },
    { speaker: '艾琳', text: '「测试可以，但偷窃不是让人信任的好方法。」' },
    { speaker: '凯娅', text: '「在这里，信任不是先给的，是先活下来再慢慢谈的。」' },
    { speaker: '主持人', text: '凯娅把钱袋抛还给你，动作轻巧得像只是归还一件借来的小玩意。' },
    { speaker: '瑟琳', text: '「我们要进入无光孢海，调查堡垒失联和魔物上涌。队伍还缺一名熟悉锁具、陷阱和地下暗线的成员。」' },
    { speaker: '凯娅', text: '「说得很客气。换成黑市的说法，就是你们需要一个能打开不该打开的门、看穿不该踩的地砖，还知道脏交易该问谁的人。」' },
    { speaker: '瑟琳', text: '「你符合这些条件。」' },
    { speaker: '凯娅', text: '「我当然符合。问题是，你们付不付得起。」' },
    { speaker: '艾琳', text: '「你愿意加入远征队吗？」' },
    { speaker: '凯娅', text: '「愿意是最便宜的词。这里的人说愿意时，通常已经在算怎么反悔了。」' },
    { speaker: '凯娅', text: '「我的条件很简单：一颗未经附魔、没有追踪印记的天然钻石。交到我手里，我就跟你们下去；拿不出来，我们今天就当没见过。」' },
    { speaker: '布洛克', text: '「你要钻石做什么？磨刀？」' },
    { speaker: '凯娅', text: '「买退路。你们有公会，有神殿，有学派。我只有能放进掌心里的东西。」' },
    { speaker: '主持人', text: '旁边的帘幕忽然被人挑开。一名衣着考究的商人推着木箱走来，脸上的笑容热情得近乎刻意。' },
    { speaker: '奥兰', text: '「谈到钻石，怎么能少了奥兰爵？幸运盲盒，二十金一次。骰点超过十八，钻石立刻带走。」' },
    { speaker: '奥兰', text: '「连续十次没有抽中，我按规矩保底。黑市当然讲信誉，只不过信誉通常需要另付费用。」' },
    { speaker: '艾琳', text: '「所以你是在诱导他们赌博。」' },
    { speaker: '奥兰', text: '「修女小姐，我提供的是机会。至于希望、冲动和后悔，那都是客人自己带来的。」' },
    { speaker: '凯娅', text: '「别被他的笑骗了。箱子是真的，钻石也是真的，只是他很擅长让你觉得下一次一定会中。」' },
    { speaker: '奥兰', text: '「凯娅小姐，你这样评价老朋友，会影响我的生意。」' },
    { speaker: '凯娅', text: '「我们不是朋友。你还欠我两把匕首和一张真的通行证。」' },
    { speaker: '艾琳', text: '「我仍然不赞成用赌博决定远征队的人选。」' },
    { speaker: '凯娅', text: '「这座城每天都在赌博。守卫赌主缆不会断，矿工赌下一镐不会挖穿巢穴，而你们赌地底堡垒里还有值得救的人。」' },
    { speaker: '凯娅', text: '「至少在这里，骰子不会假装自己代表正义。」' },
    { speaker: '瑟琳', text: '「我们只需要拿到钻石。先确认规则，再决定是否下注。」' },
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
    { speaker: '主持人', text: '钻石落入凯娅掌心时，她没有立刻收起，而是举到冷光灯下缓缓转动。她检查了切面，又用指甲轻敲边缘，直到确认上面没有附魔刻痕和追踪印记。' },
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
// 云苓告别 → 赠送护身符 → 返回公会
// ============================================================
const YUNLING_FAREWELL: ScriptedScene = {
  id: 'yunling-farewell',
  manualOnly: true,
  triggers: ['云苓告别完成'],
  setArea: '逆穹悬城·黑市深处',
  bgImage: '/assets/scenes/12yunling-apothecary.webp',
  statePatch: {
    yunling_farewell_done: true,
  },
  events: ['云苓赠予护身符'],
  lastEvent: '云苓赠予你一枚护身符，愿你活着回来',
  lines: [
    { speaker: '主持人', text: '交易结束后，云苓没有立刻收起药瓶。她低头在柜台下翻找片刻，取出一枚小小的护身符。' },
    { speaker: '主持人', text: '护身符用细绳系着，里面封着一片干燥的蓝色菌叶和一小截白枝烛芯，外壳被磨得很光滑，像是被人反复握过。' },
    { speaker: '云苓', text: '「这个也拿着。」' },
    { speaker: '艾琳', text: '「护身符？」' },
    { speaker: '云苓', text: '「不是神迹，也不是保命符。只是能让人想起来，呼吸乱的时候先停一下，手发抖的时候别急着拔剑。」' },
    { speaker: '云苓', text: '「下了孢海以后，别逞强，别乱喝药，别把疼痛当勇敢。能回来买第二次药的人，才算真正聪明。」' },
    { speaker: '主持人', text: '她把护身符推到你面前，语气依旧平静，却难得没有催你们付钱或让路。' },
    { speaker: '云苓', text: '「愿你们走过毒雾时还记得自己的名字，听见黑暗说话时还认得同伴的声音。」' },
    { speaker: '云苓', text: '「还有……活着回来。欠我的药钱也好，没买的药也好，都可以下次再算。」' },
    { speaker: '主持人', text: '你收下护身符。细绳落入掌心时，带着一点药铺里的温度，也带着某种说不清的安心感。' },
  ],
  hints: [
    '返回公会登记',
    '查看云苓的护身符',
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
  bgImage: '/assets/scenes/07blackmarket-stall.webp',
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
    { speaker: '云苓', text: '「还没领远征装备，就先来找药？不错。至少你们知道，武器能杀怪物，药才能让人走得更远。」'},
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
    '返回公会登记',
  ],
};

// ============================================================
// 公会正式登记五人小队 → 领取物资 → 出发
// ============================================================
const GUILD_FINAL_REGISTRATION: ScriptedScene = {
  id: 'guild-final-registration',
  triggers: ['返回冒险者公会找赫尔曼正式登记小队', '回公会正式登记小队', '正式登记小队', '找赫尔曼登记小队', '返回公会登记'],
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
    currentNodeId: 'guild-final-registration',
    inventory: '长剑,冒险者工具包,抗孢面罩,冷光灯,止血粉,解毒剂,缆梯安全扣,公会补给箱,虚构骰子x3,万能骰子x3',
  },
  events: ['五人远征队登记完成', '公会物资已领取'],
  lastEvent: '在冒险者公会登记五人小队，并领取前往无光孢海的正式物资',
  lines: [
    // ===== 公会登记与远征物资 =====

    { speaker: '主持人', text: '你们回到公会任务室时，炉火已经烧低。地图桌旁空出了五个签名位，旁边摆着临时编队铜牌和一支沾着黑墨的羽笔。' },
    { speaker: '主持人', text: '桌面上铺着降渊路线图。缆梯、孢海据点、黑石之门和地底堡垒被红线依次连起，最深处的地心之门封印则被厚重的红蜡圈住。' },
    { speaker: '主持人', text: '赫尔曼站在地图前，黑石单片镜映着烛火，却没有半点暖意。米娜则将队伍契约、物资清单和一只沉重的公会补给箱推到桌上。箱体边缘还残留着旧远征队的编号刻痕。' },

    { speaker: '赫尔曼', text: '「五人到齐。赏金猎人{name}，逆钟学派观测法师瑟琳，白枝修女艾琳，深层生存专家布洛克，以及黑市暗线协助者凯娅。」' },
    { speaker: '主持人', text: '他的目光依次扫过每个人，像是在确认你们不是名单上的名字，而是真正会走进深处的人。' },
    { speaker: '赫尔曼', text: '「治疗、净化、法术观测、孢海生存、机关暗线和正面行动能力已经补齐。从规则上说，你们有资格领取下潜许可。」' },
    { speaker: '凯娅', text: '「从规则上说？听起来可不像祝福。」' },
    { speaker: '赫尔曼', text: '「祝福留给神殿。公会只负责把风险说清楚。」' },

    { speaker: '米娜', text: '「签名之前，正式委托重申一遍。」' },
    { speaker: '主持人', text: '米娜翻开契约，指尖压住最上方的任务条款。她的声音依旧平稳，却比第一次见面时更慢了一些。' },
    { speaker: '米娜', text: '「第一，前往地底堡垒；第二，调查堡垒与历次远征队失联原因；第三，确认地心之门封印状态；第四，查明深层魔物上涌源头。」' },
    { speaker: '米娜', text: '「如发现生还者，优先带回。如无法带回，则必须取得可靠证据。遗物、记录、影像石、样本编号都可以，口头猜测不会被登记为调查结果。」' },
    { speaker: '艾琳', text: '「名字也要带回来。」' },
    { speaker: '米娜', text: '「是。若确认阵亡，必须记录姓名、遗物和最后位置。」' },

    { speaker: '赫尔曼', text: '「旧地图显示，黑石之门是通往深层堡垒区的关键入口。穿过那里之后，你们就会进入十年来无人带回完整消息的区域。」' },
    { speaker: '主持人', text: '他用手杖点了点地图上那道黑色门形标记。木桌发出沉闷的一声，像有什么东西在地底深处回应。' },
    { speaker: '赫尔曼', text: '「不要指望公会能及时支援。降渊缆梯只能送你们下去，不能保证把你们完整带回来。」' },
    { speaker: '布洛克', text: '「这话倒是实在。下面真出事，能救命的通常不是规章，是绳扣、方向感和别乱碰东西的脑子。」' },
    { speaker: '赫尔曼', text: '「所以你在队伍里。」' },

    { speaker: '主持人', text: '米娜打开补给箱。抗孢面罩、冷光灯、止血粉、解毒剂、缆梯安全扣、样本瓶和密封滤网被分门别类地固定在箱内，每一格都贴着编号。' },
    { speaker: '米娜', text: '「这些是五人份基础远征物资。抗孢面罩用于穿越高浓度孢尘区，冷光灯用于低能见度环境，安全扣必须全程系在缆梯索上。」' },
    { speaker: '米娜', text: '「止血粉和解毒剂只能处理常规伤势。遇到污染、黑石侵蚀或深层变异，不要硬撑，立刻让艾琳和瑟琳判断。」' },
    { speaker: '米娜', text: '「样本瓶和滤网用于收集孢子、菌丝和污染残留。样本必须封存编号，不能直接塞进背包，更不能带回城里乱放。」' },

    { speaker: '艾琳', text: '「急救包和解毒剂交给我检查。下去之后，任何伤口都要先处理，再决定是否继续行动。」' },
    { speaker: '布洛克', text: '「样本瓶和滤网我来管。孢海里的东西不是装进瓶子就算采样，封错了，整支队伍都得跟着倒霉。」' },
    { speaker: '凯娅', text: '「我检查锁扣、暗袋和箱底。公会物资也不是没有被人调包过，尤其是写着\u2018全新\u2019两个字的时候。」' },
    { speaker: '米娜', text: '「这批是我亲自封存的。」' },
    { speaker: '凯娅', text: '「那我就更该看看。认真负责的人，也会被不认真负责的人拖累。」' },
    { speaker: '瑟琳', text: '「我会记录法阵反应、污染波动、主缆震动残响和队伍状态。进入深层后，任何异常都必须第一时间汇报。」' },

    { speaker: '主持人', text: '你在契约末尾签下名字。墨迹尚未干透，瑟琳便在旁边写下属于逆钟学派的细长签名。' },
    { speaker: '主持人', text: '艾琳的字迹端正而温和，布洛克的签名像被斧头劈进纸里，凯娅则只留下一个利落的短名，像随时准备从契约边缘溜走。' },
    { speaker: '主持人', text: '五个名字并排落在同一张远征契约上。那一刻，任务室里安静了下来，连补给箱里的玻璃瓶碰撞声都显得格外清楚。' },

    { speaker: '赫尔曼', text: '「从现在起，你们是逆穹城第七远征小队。任务目标确认，风险等级记为最高。」' },
    { speaker: '赫尔曼', text: '「我不要求你们像英雄一样下去。我只要求你们像活人一样回来。」' },
    { speaker: '米娜', text: '「补给领取完毕后，前往降渊缆梯。守卫会为你们开放下行通道。」' },
    { speaker: '瑟琳', text: '「队伍完整，委托确认，物资领取完毕。」' },
    { speaker: '瑟琳', text: '「下一站，降渊缆梯。」' },

    { speaker: '主持人', text: '补给箱被合上，沉重的锁扣声在任务室里回响。你们离开地图桌，朝通往深渊的方向走去。' }
  ],
  hints: [
    '前往降渊缆梯中枢',
    '检查公会补给箱【调查DC12】',
    '向赫尔曼确认黑暗之门记录【调查DC13】',
  ],
};

// ============================================================
// 降渊缆梯 → 直接进入垂降剧情
// ============================================================
const ELEVATOR_DESCENT: ScriptedScene = {
  id: 'elevator-descent',
  triggers: ['前往降渊缆梯中枢', '前往降渊缆梯', '去缆梯', '降渊缆梯', '乘缆梯前往孢海据点', '前往第一层', '准备前往第一层'],
  setArea: '降渊缆梯·垂降途中',
  bgImage: '/assets/scenes/ele2.webp',
  statePatch: {
    elevator_descent_started: true,
    reach_elevator_hub: true,
    currentNodeId: 'elevator-descent',
  },
  events: ['降渊缆梯启动'],
  lastEvent: '乘降渊缆梯从逆穹悬城前往无光孢海第一层',

  lines: [
      { speaker: '主持人', text: '降渊缆梯中枢位于逆穹城最下缘。九条秘银主缆自穹顶垂入深井，巨型绞盘缓慢转动，层层咬合的齿轮声在空洞中回荡，像某种沉睡巨兽压得极低的呼吸。' },
      { speaker: '主持人', text: '护栏之外，蓝绿色孢光在深渊下方一层层漂浮，时明时暗。吊舱悬在轨道尽头，金属外壳覆着冷白霜痕，只等最后一次安全核验。' },
      { speaker: '温妮', text: '「站稳，别把手伸到护栏外。上一个这么做的人，现在只剩一只手套还挂在三号缆上。」' },
      { speaker: '主持人', text: '检修台后探出一个矮个子的少女。她脸上沾着机油，护目镜被推到额头上，怀里夹着一卷厚得吓人的缆梯维护图，腰间挂满扳手、铜尺和叮当作响的小铜铃。' },
      { speaker: '温妮', text: '「温妮·铜铃，缆梯检修员。你们要是能完整回来，记得顺便告诉公会——我的维护预算至少该再翻一倍。」' },
      { speaker: '主持人', text: '她一边说，一边俯身检查吊舱锁扣，动作利落得像在给一头脾气古怪的机械兽套上缰绳。' },
      { speaker: '温妮', text: '「我看看……治疗、银杖、孢海向导、黑市手，再加一个负责站在最前面的。」' },
      { speaker: '温妮', text: '「配置不错。至少不像前几支队伍那样，光看名单就知道是在给深渊送饭。」' },
      { speaker: '布洛克', text: '「这孩子嘴不讨喜，但她看缆索的本事是真的。」' },
      { speaker: '温妮', text: '「谢谢。你夸人也一样不中听。」' },
      { speaker: '主持人', text: '温妮把一枚测振铜片贴上主缆，铜片立刻发出细小的颤鸣。她皱了皱眉，把结果记进油污斑驳的记录板。' },
      { speaker: '温妮', text: '「听好了。最近主缆回响比记录快了半拍，绞盘负载也在涨。机械不会撒谎，下面有东西正在影响缆梯。」' },
      { speaker: '瑟琳', text: '「我也记录到了异常震动残响。不是单纯磨损，更像深层有什么东西在干扰回路。」' },
      { speaker: '温妮', text: '「对，所以别把这趟路当成普通升降。下去以后，安全扣别离身，冷光灯别乱晃，听见缆索尖叫就立刻趴低。」' },
      { speaker: '温妮', text: '「你们怕不怕我不管，缆梯只怕乱动的人。」' },
      { speaker: '艾琳', text: '「我会盯着队伍状态。若有人呼吸紊乱或出现眩晕，立刻停下检查。」' },
      { speaker: '凯娅', text: '「我喜欢她。至少她把\u2018会死人\u2019这件事说得很清楚。」' },
      { speaker: '温妮', text: '「那你应该也会喜欢这个——」' },
      { speaker: '主持人', text: '她把五枚缆梯安全扣依次拍到你们手里，金属冰得像刚从井底捞出来。' },
      { speaker: '温妮', text: '「挂好，锁紧，别嫌麻烦。等真掉下去的时候，你们会发现规则比祈祷可靠。」' },
      { speaker: '瑟琳', text: '「装备确认。所有人上吊舱，安全扣锁紧。」' },
      { speaker: '主持人', text: '吊舱铁门在齿轮牵引下缓缓打开，深渊的冷风立刻从下方涌上来，带着湿冷矿尘、金属腥气和极淡的孢粉甜味。' },
      { speaker: '主持人', text: '你们依次踏入吊舱。随着最后一道锁扣合拢，逆穹城的灯火被栏杆切碎在身后，而真正的幽暗深层，正沿着主缆下方无声张开。' }
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
      { speaker: '主持人', text: '吊舱最终落在一座钉入岩壁的钢木平台上。平台被数根铆钉梁死死咬进石层，脚下每一步都能听见金属在深处发出轻微的回响。' },
      { speaker: '主持人', text: '这里仍有符文灯、守卫和补给箱，却安静得不像一处前线据点。那不是秩序带来的安静，而像所有人都在刻意压低呼吸，生怕被黑暗里的什么东西听见。' },
      { speaker: '主持人', text: '淡蓝色孢尘覆在护栏、箱盖和守卫肩甲上，像一层没有融化的霜。平台外侧，巨型真菌如倒塌塔楼般从黑暗中升起，菌盖深处闪着不规律的冷光，忽明忽暗，像远处正在眨动的眼睛。' },

      { speaker: '主持人', text: '一名披着旧守夜披风的男人从灯影里走出。他背着短弩，肩上别着一枚蓝伞形状的旧徽记，靴边和披风下摆都沾满了洗不净的孢粉。' },
      { speaker: '尼布', text: '「蓝伞尼布，孢海据点守夜人。你们是逆穹城派来的远征队？」' },
      { speaker: '瑟琳', text: '「是。第七远征小队，准备进入无光孢海。」' },
      { speaker: '主持人', text: '尼布点了点头，没有露出欢迎的神情，只是多看了你们几眼，像是在确认这次下来的人能活多久。' },

      { speaker: '尼布', text: '「浅层地图可以给你们，旧巡逻记录也还能翻。但先记住两件事。」' },
      { speaker: '主持人', text: '他把一卷卷边发潮的地图拍在补给箱上，手指随即按住其中几处被深蓝墨水反复圈出的区域。' },
      { speaker: '尼布', text: '「第一，别追那些异常荧光。它们有些会移动，有些会引路，还有些专门把人带到菌毯边界外面去。」' },
      { speaker: '尼布', text: '「第二，别回应远处的喊声。会喊人的东西，不一定还是人；有些声音甚至不是在叫你，只是在学你们城里人说话。」' },
  ],
  hints: [
    '整理阵亡者名册',
    '翻看旧巡逻记录',
  ],
  clues: [
    {
      id: 'spore_sea_map',
      name: '无光孢海地图',
      description: '尼布交给你的浅层巡逻地图。标注了蓝伞浅滩、骨柱湿地、废弃据点和黑石之门的大致方位，但更深处仍是一片空白。',
      source: '孢海据点 · 尼布',
      tags: ['孢海', '地图', '关键道具'],
      imageUrl: '/assets/icons/items/map.png',
    },
  ],
};

// ============================================================
// 孢海据点 · 整理阵亡者名册
// ============================================================
const OUTPOST_NAME_LIST: ScriptedScene = {
  id: 'outpost-name-list',
  triggers: ['整理阵亡者名册'],
  setArea: '无光孢海·孢海据点',
  bgImage: '/assets/scenes/jidi.webp',
  bgm: '/assets/bgm/bgm_04b_fungal_sea_explore.mp3',
  statePatch: { outpost_name_list_checked: true,third_patrol_names_confirmed: true,last_event:'整理了第三巡逻队的残缺名册' },
  events: ['整理第三巡逻队名册','艾琳信任+5'],
  lastEvent: '在孢海据点整理阵亡者名册，确认第三巡逻队部分成员',
  hints: [],
  lines: [
    { speaker: '主持人', text: '你走到据点内侧的记录板前。几枚身份牌被临时钉在木板上，有的完整，有的只剩半截，旁边的姓名栏还空着。' },
    { speaker: '艾琳', text: '「这些不是数字。每一个空格后面，都有一个等不到消息的人。」' },
    { speaker: '主持人', text: '你逐一核对身份牌、遗物和残缺名册，从被孢尘浸花的字迹里整理出第三巡逻队的部分名单。' },
    { speaker: '尼布', text: '「……原来他们最后还是留下了名字。」' },
    { speaker: '艾琳', text: '「只要还有人记得，就不算完全留在黑暗里。」' },
  ],
  clues: [{ id:'clue_third_patrol_roster',name:'第三巡逻队残缺名册',description:'你在孢海据点整理出的残缺名册，记录了第三巡逻队的部分姓名与遗物。',source:'孢海据点·记录板',tags:['巡逻队','名册','调查'] }],
};

// ============================================================
// 孢海据点 · 翻看旧巡逻记录
// ============================================================
const OUTPOST_PATROL_LOG: ScriptedScene = {
  id: 'outpost-patrol-log',
  triggers: ['翻看旧巡逻记录'],
  setArea: '无光孢海·孢海据点',
  bgImage: '/assets/scenes/jidi.webp',
  bgm: '/assets/bgm/bgm_04b_fungal_sea_explore.mp3',
  statePatch: { patrol_log_checked: true,clue_voice_mimic: true,route_broken_bridge_unlocked: true,last_event:'翻看了旧巡逻记录' },
  events: ['发现巡逻记录中的偏航线索'],
  lastEvent: '翻看旧巡逻记录，发现第三巡逻队因回应远处的喊声而偏离路线',
  hints: [],
  lines: [
    { speaker: '主持人', text: '你翻开旧巡逻记录。最近几页的墨迹比前面潦草，路线标记被反复划掉，又用深蓝墨水重新圈起。' },
    { speaker: '瑟琳', text: '「这里。第三巡逻队原本不该靠近东侧断梁。」' },
    { speaker: '布洛克', text: '「他们偏航了。风向不对，脚印却往荧光更亮的地方去了。」' },
    { speaker: '主持人', text: '最后一行记录写得极重：东侧断梁后方传来求救声，疑似失踪队员，第三巡逻队改变路线，随后未归。' },
    { speaker: '尼布', text: '「我告诉过他们，别回应远处的喊声。」' },
    { speaker: '凯娅', text: '「他们还是去了。」' },
    { speaker: '尼布', text: '「人就是这样。明知道可能是陷阱，还是会希望那真的是同伴。」' },
  ],
  clues: [{ id:'clue_patrol_log_page',name:'巡逻记录残页',description:'第三巡逻队在东侧断梁附近听见求救声后偏离路线，随后未归。',source:'孢海据点·巡逻记录本',tags:['巡逻队','记录','调查'] }],
};

// ============================================================
// 艾琳支线前置 · 发现伤员
// ============================================================
const AILIN_WOUNDED_PRE: ScriptedScene = {
  id: 'ailin-wounded-pre',
  manualOnly: true,
  triggers: ['艾琳支线前置'],
  setArea: '无光孢海·孢海据点',
  bgImage: '/assets/scenes/jidi.webp',
  bgm: '/assets/bgm/bgm_04b_fungal_sea_explore.mp3',
  statePatch: { ailin_wounded_pre_seen: true,last_event:'艾琳发现两名重伤的第三巡逻队幸存者' },
  events: ['艾琳发现重伤员'],
  lastEvent: '在孢海据点发现第三巡逻队两名重伤幸存者，艾琳请求停下救治',
  lines: [
    { speaker: '艾琳', text: '「等等。」' },
    { speaker: '主持人', text: '艾琳的脚步忽然停下。她的目光越过补给箱，落向平台角落。那里有两名守卫裹着毛毯靠在墙边，呼吸急促，指缝和颈侧残留着没能完全净化掉的暗色孢痕。' },
    { speaker: '主持人', text: '其中一人似乎已经烧得神志不清，嘴唇不断开合，反复念着几个模糊的名字。另一人怀里攥着半截断裂的身份牌，指节因为用力而发白。' },
    { speaker: '艾琳', text: '「他们不是普通孢毒。污染已经进了伤口，还伴随精神错乱。」' },
    { speaker: '尼布', text: '「第三巡逻队带回来的。活着回来的只有这两个，其他人……还没来得及写进名册。」' },
    { speaker: '艾琳', text: '「没写进名册，就等于还没人替他们确认死亡。」' },
    { speaker: '尼布', text: '「据点人手不够。我们只能先守住平台，没人有空慢慢核对遗物和证词。」' },
    { speaker: '艾琳', text: '「伤者要稳定，阵亡者也要有名字。」' },
    { speaker: '主持人', text: '她握紧药箱提带，指尖因为用力而微微发白。你想起她在静默神殿说过的话：能救的人要救，无法带回的人，至少要带回名字。' },
    { speaker: '瑟琳', text: '「如果现在停下，进入孢海的时间会延后。但这些伤员也许知道第三巡逻队遭遇了什么。」' },
    { speaker: '布洛克', text: '「耽误一点时间，总比带着瞎眼情报往菌毯里撞强。」' },
    { speaker: '凯娅', text: '「而且那半截身份牌看起来不是自然断的。有人在混乱里抢过它。」' },
    { speaker: '艾琳', text: '「{name}，我想留下来先处理他们。不是为了拖慢队伍，而是因为我们接下来要走的路，可能正是他们没能走完的那条。」' },
  ],
  hints: ['停下协助艾琳救治伤员【进入艾琳支线】','无视伤员继续前进'],
};

// ============================================================
// 艾琳支线 · 白枝下的名字（固定剧情，无检定）
// ============================================================
const AILIN_SIDEQUEST: ScriptedScene = {
  id: 'ailin-sidequest',
  manualOnly: true,
  triggers: ['艾琳支线白枝下的名字'],
  setArea: '无光孢海·孢海据点伤员棚',
  bgImage: '/assets/scenes/ailin_side_tent_interior.webp',
  bgm: '/assets/bgm/bgm_04b_fungal_sea_explore.mp3',
  statePatch: { ailin_backstory_revealed: true,third_patrol_names_recorded: true,wounded_guard_stabilized: true },
  events: ['艾琳揭露身世','记录了第三巡逻队姓名','稳定了伤员'],
  lastEvent: '艾琳揭露了成为修女的真正原因，并完整记录了第三巡逻队的失踪成员姓名',
  lines: [
    { speaker: '主持人', text: '你们将两名伤员抬到避风的符文灯下。平台外侧的孢光一明一暗，像有什么东西正在黑暗里缓慢呼吸。' },
    { speaker: '艾琳', text: '「把他们的面罩解开一半，别完全摘掉。布洛克，压住他的肩膀；凯娅，帮我找身份牌和随身物。」' },
    { speaker: '布洛克', text: '「这人烧得不轻。孢毒进血了。」' },
    { speaker: '艾琳', text: '「还没到放弃的时候。」' },
    { speaker: '主持人', text: '艾琳取出白枝圣徽，将净化光压进伤员发黑的伤口。伤员猛地弓起身体，像是被什么看不见的东西从梦里拖了出来。' },
    { speaker: '伤员', text: '「队长……别过去……那不是她……那声音不是她……」' },
    { speaker: '瑟琳', text: '「他在重复巡逻记录里的异常呼喊。」' },
    { speaker: '艾琳', text: '「先别追问路线。他现在分不清眼前和记忆。」' },
    { speaker: '凯娅', text: '「找到了。半截身份牌，还有一张被孢尘泡烂的巡逻名册。」' },
    { speaker: '艾琳', text: '「给我。」' },
    { speaker: '主持人', text: '艾琳接过身份牌，小心擦去上面的孢尘。牌面只剩半个名字，边缘像是被人硬生生掰断。' },
    { speaker: '艾琳', text: '「名字不能只剩半个。」' },
    { speaker: '凯娅', text: '「你对这种事很执着。」' },
    { speaker: '艾琳', text: '「是。」' },
    { speaker: '主持人', text: '短暂的沉默里，只有伤员急促的呼吸声和远处绞盘的回响。艾琳没有立刻解释，而是先把伤口重新包好。' },
    { speaker: '艾琳', text: '「我小时候住在城市下缘。那时候我父亲是缆梯守卫，负责接应从深层回来的远征队。」' },
    { speaker: '艾琳', text: '「有一年，深层回来的吊舱只带回了三只补给箱和一面烧黑的队旗。名单上写着：失踪十二人。」' },
    { speaker: '艾琳', text: '「其中一个是我父亲。」' },
    { speaker: '主持人', text: '她说得很平静，像这段话已经在心里重复过无数遍，早就磨去了最锋利的痛。' },
    { speaker: '艾琳', text: '「公会那时候很忙。新的事故、新的失踪、新的委托，一件接一件。对他们来说，那只是十二个未归名额。」' },
    { speaker: '艾琳', text: '「可对我来说，那不是一个数字。那是一个会在换班后给我带热面包的人，是会把破掉的护腕重新缝好的人。」' },
    { speaker: '瑟琳', text: '「后来呢？」' },
    { speaker: '艾琳', text: '「静默神殿的一位白枝修女陪我找了三个月。最后，她只找到一枚烧裂的身份牌。」' },
    { speaker: '艾琳', text: '「她把身份牌交给我时说：\u2018人也许回不来了，但名字不能留在下面。名字是死者回家的路。\u2019」' },
    { speaker: '主持人', text: '艾琳低头看着手中的半截身份牌，拇指轻轻擦过残缺的刻痕。' },
    { speaker: '艾琳', text: '「所以我去了静默神殿。起初只是想学会怎么替父亲祈祷，后来才明白，祈祷不是让痛苦消失。」' },
    { speaker: '艾琳', text: '「祈祷是提醒活着的人，不要把别人的痛苦整理成一串方便归档的数字。」' },
    { speaker: '伤员', text: '「名字……我记得……队长叫……」' },
    { speaker: '主持人', text: '伤员忽然攥住艾琳的袖口，像是拼命抓住一根即将断开的缆绳。' },
    { speaker: '艾琳', text: '「慢慢说，我在听。」' },
    { speaker: '伤员', text: '「罗德……伊芙……还有……还有卡恩……别让他们……别让他们没人知道……」' },
    { speaker: '主持人', text: '艾琳没有打断他。她一边维持净化术，一边用另一只手把这些名字写在名册残页上。每写下一个名字，笔尖都停顿片刻。' },
    { speaker: '艾琳', text: '「我记下了。你没有把他们丢在外面。」' },
  ],
  hints: ['帮艾琳记录伤员说出的名字','优先追问第三巡逻队路线'],
};

// ============================================================
// 艾琳支线 · 收束剧情
// ============================================================
const AILIN_SIDEQUEST_COMPLETE: ScriptedScene = {
  id: 'ailin-sidequest-complete',
  manualOnly: true,
  triggers: ['艾琳支线收束'],
  setArea: '无光孢海·孢海据点出口',
  bgImage: '/assets/scenes/jidi.webp',
  bgm: '/assets/bgm/bgm_04b_fungal_sea_explore.mp3',
  statePatch: { ailin_wounded_names_done: true, completedAilinSideQuest: true, currentNodeId: 'battle_blue_shoal_01' },
  events: ['伤员稳定','姓名记录完成'],
  lastEvent: '伤员稳定后，尼布承诺会将姓名补进据点名册',
  lines: [
    { speaker: '主持人', text: '伤员的呼吸终于平稳下来。尼布叫来守卫，将他们抬回据点内侧的临时病床。' },
    { speaker: '尼布', text: '「我会把这些名字补进据点名册。至少他们不会只剩一句未归。」' },
    { speaker: '艾琳', text: '「谢谢。」' },
    { speaker: '尼布', text: '「该谢的是你们。这里的人守久了，有时候会忘记自己不是石头。」' },
    { speaker: '布洛克', text: '「走吧。再拖下去，风向该变了。」' },
    { speaker: '凯娅', text: '「而且我们现在知道了：浅滩外的声音不可信，身份牌也可能被人动过。比空着手进去强。」' },
    { speaker: '瑟琳', text: '「我已将伤员证词和第三巡逻队姓名记录标入路线备注。进入孢海后，若听见呼喊，全队不得擅自回应。」' },
    { speaker: '艾琳', text: '「我准备好了。」' },
    { speaker: '主持人', text: '艾琳重新背起药箱。白枝圣徽在孢光下泛着柔和的亮，像一盏不愿熄灭的小灯。' },
  ],
  clues: [
    { id: 'clue_third_patrol_names', name: '第三巡逻队姓名记录', description: '艾琳根据伤员证词整理出的姓名记录。上面写着罗德、伊芙、卡恩等名字。', source: '孢海据点·伤员证词', tags: ['巡逻队','姓名','调查'] },
    { id: 'clue_broken_identity_tag', name: '断裂的身份牌', description: '第三巡逻队伤员身上的半截身份牌，断口很新，似乎有人在混乱中争抢过它。', source: '孢海据点·伤员随身物', tags: ['巡逻队','身份牌','调查'] },
  ],
  hints: ['前往蓝伞浅滩','让布洛克判断前方风向【感知DC13】','确认旧巡逻路线上的荧光标记【感知DC14】'],
};

// ============================================================
// 无视艾琳请求 · 继续主线（信任-20）
// ============================================================
const IGNORE_AILIN: ScriptedScene = {
  id: 'ignore-ailin',
  triggers: ['无视伤员继续前进'],
  setArea: '无光孢海·孢海据点',
  bgImage: '/assets/scenes/jidi.webp',
  bgm: '/assets/bgm/bgm_04b_fungal_sea_explore.mp3',
  statePatch: { ailin_request_ignored: true,wounded_testimony_missed: true,ailin_sidequest_skipped: true },
  events: ['拒绝艾琳救治请求','艾琳信任-20'],
  lastEvent: '拒绝了艾琳救治伤员的请求，失去伤员证词线索',
  lines: [
    { speaker: '主持人', text: '你没有停下。平台外侧的孢光仍在闪烁，吊舱后的符文灯把你们的影子拉得很长。' },
    { speaker: '艾琳', text: '「……现在就走？」' },
    { speaker: '瑟琳', text: '「继续前进能节省时间，但我们会失去确认伤员证词的机会。」' },
    { speaker: '布洛克', text: '「路是你选的。只是别忘了，孢海里没问清楚的事，通常会在更糟的时候追上来。」' },
    { speaker: '凯娅', text: '「无视麻烦不等于麻烦消失。只是它会换个地方等你。」' },
    { speaker: '主持人', text: '艾琳沉默地收紧药箱提带。她没有争辩，也没有离队，只是走回队伍时，脚步比之前慢了一些。' },
    { speaker: '艾琳', text: '「我会继续履行队伍职责。伤者、孢毒和污染，我都会处理。」' },
    { speaker: '主持人', text: '她停顿片刻，没有看你。' },
    { speaker: '艾琳', text: '「但有些名字，错过了就不一定还能找回来。」' },
    { speaker: '尼布', text: '「那就走吧。愿你们别在下面听见他们的声音。」' },
  ],
  hints: ['前往蓝伞浅滩','让布洛克判断前方风向【感知DC13】','确认旧巡逻路线上的荧光标记【感知DC14】'],
};

// ============================================================
// 蓝伞浅滩前置 · 抵达 + 发现异常
// ============================================================
const ENTER_BLUE_SHOAL: ScriptedScene = {
  id: 'enter-blue-shoal',
  manualOnly: true,
  triggers: ['进入蓝伞浅滩前置'],
  setArea: '无光孢海·蓝伞浅滩',
  bgImage: '/assets/scenes/16blue-umbrella-shoal.webp',
  bgm: '/assets/bgm/bgm_04b_fungal_sea_explore.mp3',
  statePatch: {},
  events: ['踏入蓝伞浅滩','发现孢化兽和拟声菌团'],
  lastEvent: '进入蓝伞浅滩，菌毯下爬出孢化兽和拟声菌团',
  lines: [
    { speaker: '主持人', text: '你们离开孢海据点时，身后的符文灯一点点远去。钢木平台的轮廓被孢尘吞没，只剩尼布最后一句警告还像冷铁一样压在耳边。' },
    { speaker: '尼布', text: '「记住，别追异常荧光，别回应远处喊声。能分清同伴声音的人，才有机会回来。」' },
    { speaker: '主持人', text: '前方没有真正意义上的道路，只有几条被旧巡逻队踩出的浅痕，在蓝绿色孢光里若隐若现。每走一步，靴底都会陷进柔软的菌毯，发出潮湿而细小的声响。' },
    { speaker: '布洛克', text: '「跟着我踩过的地方走。别嫌慢，孢海里走快的人通常都被埋得很浅。」' },
    { speaker: '凯娅', text: '「听起来像是经验之谈。」' },
    { speaker: '布洛克', text: '「是。也是别人用命留下来的教程。」' },
    { speaker: '主持人', text: '空气里的味道渐渐变甜，像发酵的果酒，又像潮湿木头长出霉斑后的气息。抗孢面罩隔住了大部分孢尘，却挡不住那股让人隐隐犯困的闷意。' },
    { speaker: '艾琳', text: '「如果有人胸口发紧、眼前发亮，立刻告诉我。不要等到自己站不稳。」' },
    { speaker: '瑟琳', text: '「主缆残响正在减弱，孢尘浓度上升。我们已经离开据点防护范围。」' },
    { speaker: '主持人', text: '继续向前后，黑暗忽然开阔起来。无数巨大的蓝伞真菌从浅滩中升起，菌柄粗得像石柱，菌盖层层舒展，像一片倒扣在地底的幽蓝森林。', bgImage: '/assets/scenes/16blue-umbrella-shoal.webp' },
    { speaker: '主持人', text: '菌盖边缘垂下细长的发光菌丝，随风轻轻摇晃。远远望去，它们像一盏盏沉在黑暗里的灯，又像许多悬在半空的水母。' },
    { speaker: '主持人', text: '浅滩地面覆盖着厚厚的蓝色菌毯，积水在菌毯缝隙间缓慢流动，倒映出头顶菌盖的冷光。偶尔有孢泡从水面浮起，破裂时散出一圈细小的荧光尘。' },
    { speaker: '凯娅', text: '「这里漂亮得不像安全地方。」' },
    { speaker: '布洛克', text: '「你终于说了句对的。蓝伞浅滩平时不会亮成这样。」' },
    { speaker: '瑟琳', text: '「亮度变化有规律吗？」' },
    { speaker: '布洛克', text: '「没有。正常蓝伞菌会跟风向一起闪，像呼吸。现在这些……更像是在互相传信。」' },
    { speaker: '主持人', text: '话音刚落，远处一片菌盖忽然亮起，随后另一片、第三片、第四片接连回应。冷蓝色光斑沿着浅滩深处一路扩散，像有什么看不见的东西正在水面下移动。' },
    { speaker: '艾琳', text: '「那里有人影。」' },
    { speaker: '主持人', text: '菌丝帘幕后，几个模糊的轮廓一闪而过。它们的高度接近人类，动作却过于僵硬，像被看不见的线吊着前行。' },
    { speaker: '凯娅', text: '「不对。没有脚步声。」' },
    { speaker: '布洛克', text: '「也没有呼吸声。」' },
    { speaker: '主持人', text: '风从浅滩深处吹来，带来一阵极轻的呼喊。那声音断断续续，像被厚厚的菌毯捂住，又像有人隔着很远的水面喊你们。' },
  { condition: 'flags.clue_voice_mimic', speaker: '瑟琳', text: '「别回应。巡逻记录里提到过，第三巡逻队就是在听见求救声后偏离路线。」' },
  { condition: 'flags.wounded_guard_stabilized', speaker: '艾琳', text: '「伤员说过，那声音会模仿死者。所有人保持队形，不要离开灯光范围。」' },
  { condition: '!flags.clue_voice_mimic && !flags.wounded_guard_stabilized', speaker: '瑟琳', text: '「声音来源不稳定。它不像正常回声，更像在试探我们的反应。」' },
    { speaker: '主持人', text: '你们没有回应。那声音停顿片刻，忽然变得更近。菌毯深处鼓起几个圆形凸包，像有什么东西正从下面顶开湿软的地面。' },
    { speaker: '布洛克', text: '「后退半步，别踩到鼓起来的地方！」' },
    { speaker: '主持人', text: '第一团凸包猛地破开，喷出一阵蓝绿色孢尘。几只覆满菌丝的兽形生物从菌毯下爬出，骨刺与菌壳纠缠在一起，空洞的眼窝里亮着冷光。' },
    { speaker: '艾琳', text: '「孢化兽……它们已经不是普通野兽了。」' },
    { speaker: '主持人', text: '与此同时，先前那些人影也从菌丝帘幕后滑了出来。它们没有五官，身体像由一团团湿软菌块拼成，却从腹腔里发出断续的人声。' },
    { speaker: '菌团', text: '「……别走……救我……」' },
    { speaker: '凯娅', text: '「我现在更讨厌会说话的东西了。」' },
    { speaker: '布洛克', text: '「拟声菌团。别听它们说什么，打散核心，不然它们会一直学你们的声音。」' },
    { speaker: '瑟琳', text: '「第七远征小队，准备战斗。保持距离，不要让孢尘包围队伍。」' },
    { speaker: '主持人', text: '蓝伞浅滩的冷光骤然变亮。孢兽压低身体，菌团在水面上缓慢铺开，战斗已经无法避免。' },
  ],
  hints: [],
  battlePrep: [
    {
      id: 'blue-shoal-prep-ignore-voices',
      label: '保持沉默，识破拟声诱导【观察/奥秘DC14】',
      type: 'battlePrep',
      canUseRerollItems: true,
      desc: '根据先前收集到的情报，判断这些求救声是否是拟声菌团的诱导。',
      check: { skill: 'observe', altSkill: 'arcana', dc: 14, label: '观察 / 奥秘 DC 14' },
      successText: '你们没有回应那些求救声。结合先前的线索，你们迅速判断出声音并非来自活人，而是拟声菌团在试探队伍反应。',
      failText: '你们虽然没有立刻回应，但那声音越来越像熟悉的人。短暂的迟疑让队伍阵型出现了一瞬间松动。',
      successEffect: {
        flags: { blue_shoal_prep_ignore_voices_success: true },
        battleEffects: {
          disableEnemySkillFirstRound: ['voice_disruption'],
          allyMentalResistBonus: 2,
          allyMentalResistRounds: 1,
        },
      },
      failEffect: {
        flags: { blue_shoal_prep_ignore_voices_failed: true },
        battleEffects: {
          randomBacklineDebuff: {
            id: 'voice_lure',
            name: '声音牵引',
            duration: 1,
            initiativePenalty: 2,
            attackPenaltyVsEnemyType: { enemyType: 'fungal_mimic', value: 1 },
          },
        },
      },
    },
    {
      id: 'blue-shoal-prep-find-core',
      label: '用符文灯寻找拟声菌团核心【观察/奥秘DC15】',
      type: 'battlePrep',
      canUseRerollItems: true,
      desc: '照向拟声菌团腹腔，尝试在开战前找出它们真正的核心。',
      check: { skill: 'observe', altSkill: 'arcana', dc: 15, label: '观察 / 奥秘 DC 15' },
      successText: '符文灯的冷光刺入菌团腹腔，你们看见几枚暗蓝色核心正在湿软菌块中缓慢收缩。那些断续的求救声短暂失真，变成了刺耳杂音。',
      failText: '符文灯扫过菌团身体，却只照出一层层湿软菌块。下一刻，菌团突然模仿出你们的声音，干扰了队伍判断。',
      successEffect: {
        flags: { blue_shoal_prep_find_core_success: true },
        battleEffects: {
          targetEnemyType: 'fungal_mimic',
          attackBonusFirstRound: 2,
          bonusDamageOnFirstHit: '1d4',
        },
      },
      failEffect: {
        flags: { blue_shoal_prep_find_core_failed: true },
        battleEffects: {
          enemyTypeBuff: { enemyType: 'fungal_mimic', initiativeBonusFirstRound: 2 },
        },
      },
    },
    {
      id: 'blue-shoal-prep-avoid-bulges',
      label: '听从布洛克指挥，避开菌毯鼓包【生存/感知DC13】',
      type: 'battlePrep',
      canUseRerollItems: true,
      desc: '根据菌毯鼓起的位置，提前避开孢化兽破土突袭。',
      check: { skill: 'survival', altSkill: 'perception', dc: 13, label: '生存 / 感知 DC 13' },
      successText: '布洛克用斧柄敲了敲几处鼓起的菌毯，立刻示意众人后撤。下一秒，孢化兽从你们原本站立的位置破土而出，却扑了个空。',
      failText: '你们刚刚后撤，另一侧菌毯却猛然炸开。孢化兽从意料之外的位置冲出，逼得前排仓促举盾。',
      successEffect: {
        flags: { blue_shoal_prep_avoid_bulges_success: true },
        battleEffects: {
          targetEnemyType: 'spore_beast',
          enemyAttackPenaltyFirstRound: 2,
          frontlineAcBonus: 1,
          frontlineAcBonusRounds: 1,
        },
      },
      failEffect: {
        flags: { blue_shoal_prep_avoid_bulges_failed: true },
        battleEffects: {
          enemyTypeBuff: { enemyType: 'spore_beast', attackBonusFirstRound: 1 },
        },
      },
    },
    {
      id: 'blue-shoal-prep-mask',
      label: '整理抗孢面罩，压低呼吸【体质DC10】',
      type: 'battlePrep',
      canUseRerollItems: true,
      desc: '重新压紧抗孢面罩，减少孢尘对队伍的影响。',
      check: { skill: 'endurance', dc: 10, label: '体质 DC 10' },
      successText: '你们重新压紧抗孢面罩，放慢呼吸。甜腻的孢尘气味被隔在面罩之外，脑中的昏沉感稍稍退去。',
      successEffect: {
        flags: { blue_shoal_prep_mask_success: true },
        battleEffects: {
          allyStatus: [
            {
              id: 'steady_breath',
              name: '稳息',
              duration: 2,
              sporeDamageReduce: 2,
              sporeResistBonus: 2,
            },
          ],
        },
      },
    },
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
  bgImage: '/assets/scenes/bg-08-blue-cap-shallows.webp',
  bgm: '/assets/bgm/bgm_04b_fungal_sea_explore.mp3',
  statePatch: {
    blue_shoal_battle_done: true,
    completedBlueShoalBattle: true,
    battle_blue_shoal_result: 'win',
    discovered_deep_corruption: true,
    discovered_blue_shoal_corruption: true,
    currentNodeId: 'sidequest_brock_echo_grove',
  },
  events: ['蓝伞浅滩战斗结束', '发现污染异常', '旧远征路线重新出现', '布洛克注意到回声菌林方向'],
  lastEvent: '蓝伞浅滩战斗结束，众人发现孢化生物并非主动狩猎，而是被更深处的污染驱赶到浅滩外围。布洛克注意到远处回声菌林的异常呼救声。',
  lines: [
    { speaker: '主持人', text: '最后一只孢化生物倒在菌毯里。它的身体没有像普通孢兽那样慢慢融入浅滩，反而从伤口深处渗出几缕灰黑色的细丝。' },
    { speaker: '主持人', text: '那些细丝刚接触到蓝色菌毯，周围的荧光便迅速暗了下去，像有一小片夜色被硬生生按进了浅滩。' },
    { condition: 'flags.blue_shoal_prep_ignore_voices_success || flags.blue_shoal_prep_ignore_voices_great_success', speaker: '主持人', text: '因为你们在战前识破了拟声诱导，菌团残骸中的声音很快失去了节奏，只剩下几段破碎而空洞的杂音。' },
    { condition: 'flags.blue_shoal_prep_find_core_success', speaker: '主持人', text: '先前被符文灯照出的暗蓝色核心已经裂开，核心内部并不是正常菌质，而是一圈圈像烧焦血管般的黑色纹路。' },
    { condition: 'flags.blue_shoal_prep_mask_success', speaker: '主持人', text: '抗孢面罩替你们挡住了大部分战后扬起的孢尘。即便如此，那股发甜的腐败气味还是从面罩边缘挤了进来。' },
    { speaker: '艾琳', text: '「这些伤口不对。孢毒通常会扩散、寄生、吞噬，但这些痕迹……更像是被什么东西从里面烧穿了。」' },
    { speaker: '瑟琳', text: '「不是蓝伞浅滩本身造成的污染。污染源在更深处，浅滩只是被波及。」' },
    { speaker: '布洛克', text: '「所以它们不是来狩猎的。」' },
    { speaker: '凯娅', text: '「那它们是在逃？」' },
    { speaker: '布洛克', text: '「对。能把孢化兽和拟声菌团一起往外赶的东西，最好别急着给它起名字。」' },
    { condition: 'flags.clue_voice_mimic', speaker: '瑟琳', text: '「巡逻记录里说第三巡逻队听见求救声后偏离路线。现在看来，他们当时遇到的不是单一菌团，而是一整片正在迁移的拟声群落。」' },
    { condition: 'flags.wounded_guard_stabilized', speaker: '艾琳', text: '「那个伤员身上的污染残留，和这些孢化兽伤口里的痕迹很接近。它们很可能都来自同一个方向。」' },
    { speaker: '主持人', text: '浅滩尽头，几根半埋在菌毯下的木桩露了出来。木桩上绑着褪色的红绳，旁边还有被刮花的远征队路标。' },
    { speaker: '凯娅', text: '「旧路标。箭头被人重新刻过，而且刻得很急。」' },
    { speaker: '主持人', text: '路标指向浅滩外侧的一片低矮菌林。那里的蓝光比周围更暗，菌柄细密地挤在一起，风吹过时，会发出像人声一样的细碎回响。' },
    { speaker: '瑟琳', text: '「回声菌林。旧远征停靠点前的最后一段缓冲区。」' },
    { speaker: '布洛克', text: '「不。」' },
    { speaker: '主持人', text: '布洛克忽然停下脚步。他盯着那片菌林，原本握着斧柄的手指慢慢收紧。' },
    { speaker: '凯娅', text: '「你认识这里？」' },
    { speaker: '布洛克', text: '「我认识那种声音。」' },
    { speaker: '主持人', text: '远处的菌林深处，传来一声极轻的呼喊。那声音不像刚才的拟声菌团那样直接求救，而是断断续续地重复着某个名字。' },
    { speaker: '布洛克', text: '「别跟着喊。也别问它在喊谁。」' },
    { speaker: '艾琳', text: '「布洛克？」' },
    { speaker: '布洛克', text: '「先找到声音的规律。回声菌林不会平白无故学人说话，除非它曾经听过很多遍。」' },
    { speaker: '主持人', text: '蓝伞浅滩的冷光在你们身后逐渐暗下去。前方，旧路标、灰黑污染和布洛克沉默的表情一起指向了同一个地方。' },
  ],
  hints: [
    '跟随布洛克调查回声菌林',
    '听布洛克解释呼救声规律【生存DC13】',
    '协助布洛克配置净化粉【自然DC14】',
  ],
};

// ============================================================
// 蓝伞浅滩战后固定结算
// ============================================================


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

// ============================================================
// 压缩第一幕收束路线（旧支线数据保留，但不再自动触发）
// ============================================================
const ACT1_BLUE_SHOAL_AFTERMATH_COMPRESSED: ScriptedScene = {
  id: 'act1-blue-shoal-aftermath-compressed', manualOnly: true,
  triggers: ['蓝伞浅滩战后余波'], setArea: '无光孢海·蓝伞浅滩',
  bgImage: '/assets/scenes/10blue-shoal-after-battle.webp', bgm: '/assets/bgm/bgm_04b_fungal_sea_explore.mp3',
  statePatch: { compressedAct1EndingStarted: true, blueShoalAftermathSeen: true, currentNodeId: 'act1-blue-shoal-aftermath-compressed' },
  lastEvent: '蓝伞浅滩的战斗结束，队伍发现通往黑石根区的远征标记',
  lines: [
    { speaker: '主持人', text: '最后一只孢化地底兽倒在蓝伞菌的冷光下。浅滩重新安静，只剩水滴从破损的护甲上滑落。' },
    { speaker: '布洛克', text: '「这不是普通的巡逻队徽记。是旧远征要塞的。」' },
    { speaker: '凯娅', text: '「路标指向黑石根区。旧路还没有完全塌。」' },
    { speaker: '瑟琳', text: '「我们走那条路。再绕远，就会错过黑石脉冲的间隔。」' },
  ],
  hints: ['沿远征标记前往黑石根区'],
};

const ACT1_BLACK_ROOT_ENTRANCE: ScriptedScene = {
  id: 'act1-black-root-entrance', manualOnly: true, triggers: ['进入黑石根区'],
  setArea: '无光孢海·黑石根区入口', bgImage: '/assets/scenes/11black-root-entrance.webp',
  bgm: '/assets/bgm/bgm_04b_fungal_sea_explore.mp3',
  statePatch: { blackRootEntranceSeen: true, currentNodeId: 'act1-black-root-entrance' },
  lastEvent: '抵达黑石根区入口，发现幸存者的血迹',
  lines: [
    { speaker: '主持人', text: '菌丝在这里变得像烧焦的树根，深深嵌进岩层。一枚破损的方尖碑碎片卡在旧路标旁。' },
    { speaker: '艾琳', text: '「有新鲜血迹。不是我们的。」' },
    { speaker: '凯娅', text: '「往前。拖行痕迹还没被孢尘盖住。」' },
  ], hints: ['追踪血迹寻找幸存者'],
};

const ACT1_LAIN_SURVIVOR: ScriptedScene = {
  id: 'act1-lain-survivor-event', manualOnly: true, triggers: ['发现莱因'],
  setArea: '无光孢海·黑石根区废营', bgImage: '/assets/scenes/12lain-survivor-site.webp',
  statePatch: { lainEncountered: true, currentNodeId: 'act1-lain-survivor-event' },
  lastEvent: '在黑石根区发现重伤的远征队员莱因',
  lines: [
    { speaker: '主持人', text: '一名披着旧远征斗篷的男人靠在断墙下。他的呼吸很浅，手里死死攅着半枚身份牌。' },
    { speaker: '莱因', text: '「门……还在吃人的时间。别让它……看见你们。」' },
    { speaker: '艾琳', text: '「他还活着，但精神污染很严重。」' },
    { speaker: '瑟琳', text: '「选择权在你。只是这一次，选择会被记住。」' },
  ],
  hints: ['救治莱因并带他同行', '先追问莱因发生了什么', '检查莱因的伤势与身份牌', '取走身份牌线索后离开', '无视莱因，继续前进'],
};

const ACT1_SERIN_CRACK: ScriptedScene = {
  id: 'act1-black-root-rest-serin-crack', manualOnly: true, triggers: ['黑石根区休整'],
  setArea: '无光孢海·黑石根区休整点', bgImage: '/assets/scenes/13black-root-rest-point.webp',
  statePatch: { currentNodeId: 'act1-black-root-rest-serin-crack' },
  lastEvent: '黑暗之门前休整，瑟琳的银杖出现裂痕',
  lines: [
    { speaker: '主持人', text: '休整时，你看见瑟琳正用手指按住银杖上一道新的裂纹。裂纹里的冷光与黑石脉冲同步闪动。' },
    { speaker: '瑟琳', text: '「只是法术负荷。我还能继续。」' },
    { speaker: '艾琳', text: '「你说得太快了。」' },
  ],
  hints: ['安慰瑟琳，要求她先休息', '克制地追问银杖裂痕', '只问这会如何影响任务', '强迫瑟琳说出真相', '要求瑟琳强行继续施法'],
};

const ACT1_BOSS_CORE_CHOICE: ScriptedScene = {
  ...BLACKSTONE_CORE_CHOICE,
  id: 'act1-boss-core-choice',
  bgImage: '/assets/scenes/14dark-gate-forecourt-battle.webp',
  statePatch: { ...BLACKSTONE_CORE_CHOICE.statePatch, blackstoneGatekeeperDefeated: true, currentNodeId: 'act1-boss-core-choice' },
};

const ACT1_ENDINGS: ScriptedScene[] = [
  ['guardian-remains', '守门者仍在', '核心稳定下来，封印未破。莱因在艾琳的搀扶下重新站稳，你们带着一名幸存者走向开启的门。'],
  ['wounded-through-gate', '带伤者穿门', '核心碎裂，封锁随之崩塌。莱因咳出一口黑血，但你们没有丢下他，一同穿过破碎的石门。'],
  ['cold-expedition', '冷静的远征', '核心稳定，封锁保留。队伍没有停下等待任何人，只带着沉默与任务穿过黑石门。'],
  ['gate-split-open', '裂门而下', '核心粉碎，封锁解除。黑石门在你们面前轰然洞开，没有幸存者，也没有回头的理由。'],
].map(([id, title, text]) => ({
  id: `act1-ending-${id}`, manualOnly: true, triggers: [title], setArea: '黑暗之门',
  bgImage: `/assets/scenes/ending-${id}.webp`, statePatch: { currentNodeId: `act1-ending-${id}`, act1EndingId: id },
  lastEvent: `第一幕结局：${title}`, lines: [{ speaker: '主持人', text }], hints: ['穿过黑暗之门'],
}));

const ACT1_OCEAN_REVEAL: ScriptedScene = {
  id: 'act1-ending-ocean-reveal', manualOnly: true, triggers: ['穿过黑暗之门'],
  setArea: '地下海洋·黑暗之门彼端', bgImage: '/assets/scenes/15underground-ocean-reveal.webp',
  statePatch: { undergroundOceanRevealed: true, currentNodeId: 'act1-ending-ocean-reveal' },
  lastEvent: '黑暗之门后的地下海洋显现',
  lines: [
    { speaker: '主持人', text: '门后不是地底堡垒，也不是更深的岩层。' },
    { speaker: '主持人', text: '一片没有天空的地下海洋在你们脚下展开。远处的微光像灯塔一样在黑潮上明灭。' },
    { speaker: '瑟琳', text: '「第一道门打开了。真正的远征，现在才开始。」' },
  ], hints: ['结束第一幕'],
};

const ACT1_GAME_COMPLETE: ScriptedScene = {
  id: 'act1-game-complete', manualOnly: true, triggers: ['结束第一幕'], setArea: '第一幕·完',
  bgImage: '/assets/scenes/15underground-ocean-reveal.webp',
  statePatch: { act1GameCompleted: true, currentNodeId: 'act1-game-complete' },
  lastEvent: '第一幕结束', lines: [{ speaker: '主持人', text: '第一幕《地心之门》结束。你的选择已被记录。' }], hints: ['[第一幕结束]'],
};

const ACT1_BAD_ENDING: ScriptedScene = {
  id: 'act1-bad-ending-time-reset', manualOnly: true, triggers: ['逆时归零'], setArea: '逆时归零',
  bgImage: '/assets/scenes/14dark-gate-forecourt-battle.webp',
  statePatch: { act1EndingId: 'time-reset', act1GameCompleted: true, currentNodeId: 'act1-bad-ending-time-reset', blackstone_gatekeeper_result: 'lose' },
  lastEvent: '坏结局：逆时归零',
  lines: [
    { speaker: '主持人', text: '小队倒在黑石根区。所有声音都变得遥远，像被厚重石层隔开。' },
    { speaker: '瑟琳', text: '「对不起……这一次，还是来不及。」' },
    { speaker: '瑟琳', text: '「如果你醒来后什么都不记得，也请你……再走一次。」' },
    { speaker: '主持人', text: '银杖彻底裂开。你眼前出现逆穹悬城最初的灯火。你回到了最初，不记得自己曾经失败。游戏结束。' },
  ], hints: ['[第一幕结束 · 逆时归零]'],
};

export const SCRIPTED_SCENES: ScriptedScene[] = [
  OPENING,
  OPENING_SUSPENSE,
  TUTORIAL_BATTLE_AFTER,
  GUILD_ARRIVAL,
  TAVERN_INTRO,
  SALO_COMPANION_INTEL,
  CATHEDRAL_AILIN_RECRUIT,
  CATHEDRAL_AILIN_RECRUIT_FINALE,
  BROCK_TAVERN_INTRO,
  BROCK_RECRUITED,
  BLACK_MARKET_KAIYA_INTRO,
  BLACK_MARKET_KAIYA_CONTACT,
  KAIYA_RECRUITED,
  YUNLING_BLACK_MARKET,
  YUNLING_FAREWELL,
  GUILD_FINAL_REGISTRATION,
  ELEVATOR_DESCENT,
  SPORE_OUTPOST_ARRIVAL,
  OUTPOST_NAME_LIST,
  OUTPOST_PATROL_LOG,
  AILIN_WOUNDED_PRE,
  AILIN_SIDEQUEST,
  AILIN_SIDEQUEST_COMPLETE,
  IGNORE_AILIN,
  ENTER_BLUE_SHOAL,
  AFTER_BATTLE_BLUE_SHOAL,
  ABANDONED_FORWARD_POST,
  RHEIN_ENCOUNTER,
  PRE_BOSS_REST,
  BLACKSTONE_CORE_CHOICE,
  ACT1_BLUE_SHOAL_AFTERMATH_COMPRESSED,
  ACT1_BLACK_ROOT_ENTRANCE,
  ACT1_LAIN_SURVIVOR,
  ACT1_SERIN_CRACK,
  ACT1_BOSS_CORE_CHOICE,
  ...ACT1_ENDINGS,
  ACT1_OCEAN_REVEAL,
  ACT1_GAME_COMPLETE,
  ACT1_BAD_ENDING,
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
