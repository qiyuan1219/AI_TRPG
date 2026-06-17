/**
 * 同伴支线管理模块
 *
 * 职责：
 *  - 定义第一幕四条同伴支线的完整数据
 *  - 定义支线插入点的流程结构
 *  - 定义信任值分档与反馈规则
 *  - 提供 AI 主持人通用约束
 *
 * 原则：
 *  - 支线必定触发，信任值不决定是否触发
 *  - 信任值只影响语气、信息深度、奖励强度和结局反馈
 *  - 支线不改变主线结局分支
 *  - 不能替代两场普通战斗和 Boss 战
 */

// ============================================================
// 基础类型
// ============================================================

/** 信任值分档 */
export type TrustBand = 'low' | 'normal' | 'high' | 'veryHigh';

/** 支线插入类型 */
export type SideQuestInsertion =
  | { type: 'after'; sceneId: string }
  | { type: 'before'; sceneId: string };

/** 检定定义 */
export interface SideQuestCheck {
  id: string;
  skill: string;          // 技能名（如 '医疗', '生存', '调查'）
  dc: number;
  label: string;          // 展示标签
}

/** 信任选择 */
export interface SideQuestTrustChoice {
  choice: string;
  trustChange: Record<string, number>;  // 同伴 -> 信任变化
  result: string;
}

/** 信任值反馈文本 */
export interface SideQuestTrustFeedback {
  low: string;
  normal: string;
  high: string;
  veryHigh: string;
}

/** 奖励定义 */
export interface SideQuestReward {
  id: string;
  name: string;
  condition: string;
  effect: string;
}

/** 危机定义 */
export interface SideQuestCrisis {
  type: 'medical_crisis' | 'minor_encounter';
  title: string;
  description: string;
  successResult: string;
  failResult: string;
  enemies?: Array<{ enemyId: string; count: number }>;
  environmentalHazards?: string[];
}

/** AI 主持人约束 */
export interface SideQuestAIRules {
  role: string;
  goals: string[];
  hardRules: string[];
  forbidden: string[];   // 禁止回答的话题
}

// ============================================================
// 完整的同伴支线定义
// ============================================================

export interface CompanionSideQuestDef {
  id: string;
  eventId: string;           // 对应后端 SIDE_EVENT_DEFINITIONS 的 key
  type: 'companion_sidequest';
  companion: string;         // 'ailin' | 'brock' | 'kaiya' | 'serin'
  title: string;
  location: string;
  insertion: SideQuestInsertion;
  description: string;

  /** 固定开场对话（前端展示，后端也有对应版） */
  fixedIntro: Array<{
    speaker: string;
    text: string;
    portrait?: string;
  }>;

  /** 玩家目标 */
  objectives: string[];

  /** 可用检定 */
  checks: SideQuestCheck[];

  /** 危机 */
  crisis?: SideQuestCrisis;

  /** 信任选择 */
  trustChoices: SideQuestTrustChoice[];

  /** 信任值反馈 */
  trustFeedback: SideQuestTrustFeedback;

  /** 奖励 */
  rewards: SideQuestReward[];

  /** 自由对话可聊话题 */
  chatTopics: string[];

  /** AI 主持人约束 */
  aiRules: SideQuestAIRules;

  /** 结局反馈台词（按 trustLevel） */
  endingFeedback: {
    high: string;
    low: string;
  };
}

// ============================================================
// 全局信任值规则
// ============================================================

export const TRUST_BANDS = {
  thresholds: {
    low: [0, 39],
    normal: [40, 69],
    high: [70, 84],
    veryHigh: [85, 100],
  },
  effects: {
    low: '同伴只给必要信息，语气疏离，奖励较少',
    normal: '正常提供专业判断，完成支线可获得基础奖励',
    high: '主动补充个人看法或额外线索，奖励增强',
    veryHigh: '开放私人情绪或深层动机，提供特殊奖励或 Boss 前提示',
  },
} as const;

export function getTrustBand(trust: number): TrustBand {
  if (trust <= 39) return 'low';
  if (trust <= 69) return 'normal';
  if (trust <= 84) return 'high';
  return 'veryHigh';
}

// ============================================================
// 通用 AI 主持人约束
// ============================================================

export const COMPANION_SIDE_QUEST_AI_RULES: SideQuestAIRules = {
  role: '你是专业、老练的暗黑奇幻跑团主持人。',
  goals: [
    '突出当前同伴的专业能力和性格底线。',
    '让玩家通过选择影响信任值。',
    '根据当前信任值改变同伴开放程度和奖励。',
    '支线结束后必须回到主线。',
  ],
  hardRules: [
    '同伴支线必定触发，信任值不决定是否触发。',
    '信任值只影响语气、信息深度、奖励强度和结局反馈。',
    '自由对话期间不改变信任值。',
    '支线不能替代两场普通战斗和 Boss 战。',
    '支线危机可以有小遭遇、危险检定或救援，但不能改变主线胜负。',
    'AI不能决定战斗伤害、死亡或状态，只能描述程序结算。',
    '不得提前揭露黑暗之门后方是地下海洋。',
    '不得提前解释地底堡垒失联真相。',
    'NPC不能替玩家做关键选择。',
  ],
  forbidden: [
    '黑暗之门后方具体是什么',
    '地下海洋反转',
    '地底堡垒完整失联真相',
    '第二幕之后路线',
    '同伴尚未公开的完整个人秘密',
  ],
};

// ============================================================
// 支线一：艾琳 —— 白枝下的名字
// ============================================================

const AILIN_SIDE_QUEST: CompanionSideQuestDef = {
  id: 'sidequest_ailin_wounded_names',
  eventId: 'ailin_wounded_names',
  type: 'companion_sidequest',
  companion: 'ailin',
  title: '白枝下的名字',
  location: '孢海据点伤员棚',
  insertion: { type: 'after', sceneId: 'spore_outpost_arrival' },
  description: '抵达孢海据点并进入出发前整备后，艾琳利用尼布核对路线的时间检查伤员污染程度、整理阵亡者名册。体现她对"伤者不是负担、牺牲者不是数字"的底线。',

  fixedIntro: [
    {
      speaker: '主持人',
      text: '尼布把浅层地图压在补给箱上，转身去找巡逻日志。布洛克蹲在平台边缘辨认风向，凯娅拆开第一只补给箱的封扣，队伍暂时被分成几条整备线。',
    },
    {
      speaker: '主持人',
      text: '艾琳没有打断整备，只是把药箱放到伤员棚门口。帘布后传来压抑的咳嗽声，染蓝的绷带堆在铁盆里，白枝木牌上写着上一批巡逻队的名字。',
    },
    {
      speaker: '艾琳',
      text: '「给我一刻钟。我先判断污染有没有扩散，能稳定一个算一个。等尼布把路线核完，我们再一起出发。」',
      portrait: '/assets/characters/ailin/ailin_white_branch.webp',
    },
    {
      speaker: '尼布',
      text: '「他们是上一批巡逻队。能站着回来的只有两个，能说完整话的一个都没有。」',
    },
    {
      speaker: '瑟琳',
      text: '「我们不会因此耽误路线确认。相反，他们可能知道蓝伞浅滩为什么突然变亮。」',
    },
    {
      speaker: '艾琳',
      text: '「那就先让他们活下来，再让他们说话。」',
    },
  ],

  objectives: [
    '在据点整备时间内帮艾琳确认伤员污染程度。',
    '从伤员或遗物中获得浅滩异常线索。',
    '决定如何平衡救治伤员与出发效率。',
    '整理阵亡者名册，为后续"莱因选择"做道德铺垫。',
  ],

  checks: [
    { id: 'medicine_pollution', skill: '医疗', dc: 12, label: '判断伤员污染程度' },
    { id: 'religion_white_branch', skill: '宗教', dc: 12, label: '协助艾琳完成白枝祈祷' },
    { id: 'investigate_belongings', skill: '调查', dc: 13, label: '检查阵亡者遗物和巡逻记录' },
    { id: 'insight_wounded', skill: '洞察', dc: 13, label: '从伤员断续话语中提取有效信息' },
  ],

  crisis: {
    type: 'medical_crisis',
    title: '污染发作',
    description:
      '一名伤员突然剧烈抽搐，蓝色孢尘从绷带下渗出。若处理失败，他不会立刻变成怪物，但会失去说出线索的机会。',
    successResult: '稳定伤员，获得浅滩异常光带线索。',
    failResult: '伤员昏迷，艾琳仍会完成基础救治，但无法获得完整线索。',
  },

  trustChoices: [
    {
      choice: '陪艾琳去伤员棚确认污染情况',
      trustChange: { ailin: +10 },
      result: '获得伤员线索；艾琳对玩家明显认可。',
    },
    {
      choice: '询问救治需要多久，并安排其他人同时整备',
      trustChange: { ailin: +6, serin: +2 },
      result: '兼顾效率与救援，队伍节奏最好。',
    },
    {
      choice: '要求艾琳只做快速分诊，别拖延进入浅滩',
      trustChange: { ailin: -4 },
      result: '艾琳会照做，但语气变冷。',
    },
    {
      choice: '认为伤员已经没用，要求立刻出发',
      trustChange: { ailin: -12 },
      result: '艾琳强压怒意；后续莱因选择时她会更严厉地看待玩家。',
    },
  ],

  trustFeedback: {
    low: '艾琳只完成必要治疗，不主动解释白枝修会理念。',
    normal: '艾琳说明污染伤口必须先清洗再治疗，并提醒队伍不要硬撑。',
    high: '艾琳主动告诉玩家：她不是害怕死亡，而是害怕有人被当作无名损耗。',
    veryHigh:
      '艾琳将一枚白枝布符交给玩家，表示"如果你倒下，我会先把你当人救，而不是当任务损耗计算"。',
  },

  rewards: [
    {
      id: 'white_branch_bandage',
      name: '白枝绷带',
      condition: '协助艾琳稳定伤员',
      effect: '后续可用于一次污染伤口处理或濒危救治提示。',
    },
    {
      id: 'patrol_last_words',
      name: '巡逻队遗言线索',
      condition: '成功通过洞察或调查检定',
      effect: '提前知道蓝伞浅滩中"异常荧光会引诱人靠近"。',
    },
  ],

  chatTopics: [
    '为什么艾琳坚持救伤员',
    '白枝修会怎么看待牺牲',
    '她是否害怕带不回所有人',
    '如果队伍中有人被污染，她会怎么做',
    '她对接下来进入蓝伞浅滩的担忧',
  ],

  aiRules: {
    ...COMPANION_SIDE_QUEST_AI_RULES,
    goals: [
      ...COMPANION_SIDE_QUEST_AI_RULES.goals,
      '让玩家感受到伤员不是数字，名字值得被记住。',
      '强调白枝修会对"不放弃任何一个人"的坚持。',
    ],
    hardRules: COMPANION_SIDE_QUEST_AI_RULES.hardRules,
  },

  endingFeedback: {
    high: '「你记住了他们的名字。无论门后是什么，我们都不是空手来到这里。」',
    low: '「任务还没结束。只是有些名字，已经没人会替他们念出来了。」',
  },
};

// ============================================================
// 支线二：布洛克 —— 回声菌林的假歌
// ============================================================

const BROCK_SIDE_QUEST: CompanionSideQuestDef = {
  id: 'sidequest_brock_echo_grove',
  eventId: 'block_echo_forest',
  type: 'companion_sidequest',
  companion: 'brock',
  title: '回声菌林的假歌',
  location: '回声菌林',
  insertion: { type: 'after', sceneId: 'battle_blue_shoal_01' },
  description: '离开蓝伞浅滩后，菌林深处传来断续求救声。布洛克判断那是回声菌林的拟声诱捕，带领队伍找到污染菌核。',

  fixedIntro: [
    {
      speaker: '主持人',
      text: '浅滩战斗结束后，前方菌林里传来断断续续的呼救声。声音很远，却每隔数息重复一次，连停顿都几乎一样。',
    },
    {
      speaker: '布洛克',
      text: '「别急着过去。活人喊救命，不会每隔七次呼吸重复一遍。」',
    },
    {
      speaker: '艾琳',
      text: '「如果真的有人呢？」',
    },
    {
      speaker: '布洛克',
      text: '「那就更要先看清楚。孢海会骗人，但它骗人的方式有规律。」',
    },
  ],

  objectives: [
    '分辨呼救声是真是假。',
    '找到污染菌核。',
    '决定净化、绕行或焚烧菌林。',
    '保护队伍不被菌丝拖散。',
  ],

  checks: [
    { id: 'survival_echo_pattern', skill: '生存', dc: 13, label: '判断回声菌林的声音规律' },
    { id: 'insight_fake_voice', skill: '洞察', dc: 13, label: '分辨呼救声是否像真人' },
    { id: 'perception_spore_core', skill: '感知', dc: 14, label: '寻找污染菌核位置' },
    { id: 'nature_cleanse_powder', skill: '自然', dc: 14, label: '协助布洛克配置净化粉' },
  ],

  crisis: {
    type: 'minor_encounter',
    title: '污染菌核遭遇',
    description: '拟声孢群和污染藤蔓包围了污染菌核，必须在狭窄菌道内破坏或净化它。',
    successResult: '击败污染菌核，回声恢复正常。',
    failResult: '队伍被孢粉逼退，布洛克救场但污染加重。',
    enemies: [
      { enemyId: 'echo_fungus_servant', count: 2 },
      { enemyId: 'spore_thread_cluster', count: 1 },
    ],
    environmentalHazards: ['菌丝拖拽', '孢粉致幻', '狭窄菌道限制移动'],
  },

  trustChoices: [
    {
      choice: '听布洛克解释，先观察声音规律',
      trustChange: { brock: +8 },
      result: '提前发现污染菌核，危机开局获得位置优势。',
    },
    {
      choice: '协助布洛克配置净化粉',
      trustChange: { brock: +10 },
      result: '可以净化菌核，减少后续孢粉干扰。',
    },
    {
      choice: '质疑他太慢，但仍允许他判断',
      trustChange: { brock: +3 },
      result: '布洛克嘴上不满，但认可玩家没有乱来。',
    },
    {
      choice: '直接用火烧开道路',
      trustChange: { brock: -10 },
      result: '快速通过，但健康菌林受损，支线奖励降低。',
    },
    {
      choice: '不管真假，立刻冲向呼救声',
      trustChange: { brock: -6 },
      result: '触发菌丝伏击。',
    },
  ],

  trustFeedback: {
    low: '布洛克只说"往那边走会死"，不解释生态原因。',
    normal: '布洛克正常说明回声菌林如何诱捕猎物。',
    high: '布洛克主动解释菌林原本会净水、分解尸体、养育蓝伞幼菌。',
    veryHigh:
      '布洛克承认自己不是保护蘑菇胜过保护人，而是不想看见完整生态被污染拧坏。',
  },

  rewards: [
    {
      id: 'ironpot_antidote_pill',
      name: '铁锅解毒丸',
      condition: '成功识别污染源或协助配置净化粉',
      effect: '可抵消一次轻度孢子污染、中毒或短暂失明。',
    },
    {
      id: 'warm_spore_stew',
      name: '暖孢浓汤',
      condition: '尊重布洛克判断，且没有大规模烧毁健康菌林',
      effect: '一次性营地道具，可在后续战斗前提供轻量状态加成。',
    },
    {
      id: 'echo_fungus_powder',
      name: '回声菌粉',
      condition: '高信任且成功净化菌核',
      effect: '后续可让 AI 主持人提示一次拟声、幻听或诱捕类危险。',
    },
  ],

  chatTopics: [
    '回声菌林为什么会模仿人声',
    '为什么不能直接烧掉菌林',
    '孢海生态是否有善恶',
    '他为什么总把危险和食物放在一起讲',
    '后续骨柱湿地会有什么风险',
  ],

  aiRules: {
    ...COMPANION_SIDE_QUEST_AI_RULES,
    goals: [
      ...COMPANION_SIDE_QUEST_AI_RULES.goals,
      '让玩家理解孢海不是纯恶之地，而是被污染扭曲的完整生态。',
      '突出布洛克对生态的尊重和他粗暴外表下的细腻。',
    ],
    hardRules: COMPANION_SIDE_QUEST_AI_RULES.hardRules,
  },

  endingFeedback: {
    high: '「你不是只会砍东西的人，这很好。孢海里能活下来的，往往是肯停下来看看脚下的。」',
    low: '「你还活着，不代表你走对了路。只是今天孢海没把账算完。」',
  },
};

// ============================================================
// 支线三：凯娅 —— 少了两个封扣
// ============================================================

const KAIYA_SIDE_QUEST: CompanionSideQuestDef = {
  id: 'sidequest_kaiya_broken_seals',
  eventId: 'kaiya_broken_seals',
  type: 'companion_sidequest',
  companion: 'kaiya',
  title: '少了两个封扣',
  location: '前线废弃据点暗道',
  insertion: { type: 'after', sceneId: 'abandoned_forward_post_intro' },
  description: '凯娅发现据点补给箱少了两个封扣，切口很新。表面是偷补给，实际是黑市标记、怪物巢穴和暗道入口。',

  fixedIntro: [
    {
      speaker: '主持人',
      text: '废弃据点的补给箱排成一列，大多已经空了。凯娅却没有看箱子里面，而是蹲在最外侧的锁扣旁。',
    },
    {
      speaker: '凯娅',
      text: '「少了两个封扣，切口很新。不是魔物咬的，是人手。」',
      portrait: '/assets/characters/kelaiya/kaiya_blackmarket.webp',
    },
    {
      speaker: '布洛克',
      text: '「偷补给？」',
    },
    {
      speaker: '凯娅',
      text: '「如果只是偷补给，我会觉得这里的人很有求生欲。问题是这个切法……像是在开一条别人故意留下的路。」',
    },
  ],

  objectives: [
    '调查补给箱封扣。',
    '找到隐藏暗道。',
    '判断暗道是捷径、黑市仓库还是怪物巢穴。',
    '决定是否拿走暗道补给，以及是否留下交换物避免欠账。',
  ],

  checks: [
    { id: 'investigate_broken_seals', skill: '调查', dc: 12, label: '调查补给箱封扣' },
    { id: 'thieves_tools_lock', skill: '巧手', dc: 13, label: '拆除暗门机关锁' },
    { id: 'perception_lair_noise', skill: '感知', dc: 13, label: '听见暗道深处怪物动静' },
    { id: 'survival_lair_marks', skill: '生存', dc: 13, label: '识别怪物巢穴痕迹' },
    { id: 'insight_kaiya', skill: '洞察', dc: 14, label: '判断凯娅是否隐瞒黑市标记来历' },
  ],

  crisis: {
    type: 'minor_encounter',
    title: '暗道遭遇',
    description: '狭窄暗道中遭遇巢穴怪物，需在保护补给箱的同时击退敌人。',
    successResult: '击退怪物，完整保留补给和暗道情报。',
    failResult: '补给出品受损，暗道在战斗中有部分坍塌。',
    enemies: [
      { enemyId: 'tunnel_lurker', count: 1 },
      { enemyId: 'spore_rat_swarm', count: 1 },
    ],
    environmentalHazards: ['绊线机关', '暗道坍塌倒计时', '补给袋被咬断'],
  },

  trustChoices: [
    {
      choice: '让凯娅先检查暗门和陷阱',
      trustChange: { kaiya: +8 },
      result: '避开第一处机关，战斗不会被伏击开局。',
    },
    {
      choice: '追问她和黑市标记的关系，但不指责',
      trustChange: { kaiya: +6 },
      result: '凯娅承认"认识，但不是朋友"，并解释标记含义。',
    },
    {
      choice: '帮她一起拆机关锁',
      trustChange: { kaiya: +10 },
      result: '保留补给箱完整，获得更好奖励。',
    },
    {
      choice: '直接拿走补给，不管欠账标记',
      trustChange: { kaiya: -6 },
      result: '获得补给，但后续可能留下奥兰旧账标记。',
    },
    {
      choice: '指责她把队伍带进黑市陷阱',
      trustChange: { kaiya: -12 },
      result: '凯娅继续合作，但不再主动解释机关细节。',
    },
  ],

  trustFeedback: {
    low: '凯娅保持礼貌讽刺，只说必要危险。',
    normal: '凯娅正常说明黑市标记、怪物痕迹和暗道风险。',
    high: '凯娅主动提醒哪些补给可以拿，哪些拿了会惹麻烦。',
    veryHigh:
      '凯娅透露她熟悉奥兰，是因为曾替他追过一批被怪物拖走的货。她讨厌欠账，也讨厌把同伴卖进账本里。',
  },

  rewards: [
    {
      id: 'softpaw_lockpick',
      name: '软爪锁针',
      condition: '高信任，且玩家尊重凯娅的机关判断',
      effect: '可用于一次机关、暗门或束缚类检定的剧情加成。',
    },
    {
      id: 'blackmarket_cold_light',
      name: '黑市冷光灯',
      condition: '成功保留补给箱，且未粗暴破坏暗道',
      effect: '限次照明道具，可在孢雾、暗道或骨柱湿地中提供安全光源。',
    },
    {
      id: 'hunter_hemostatic_powder',
      name: '猎人止血粉',
      condition: '击退怪物并保护补给',
      effect: '可用于一次轻伤处理或流血状态缓解。',
    },
    {
      id: 'orlan_old_seal',
      name: '奥兰旧封条',
      condition: '玩家选择记录欠账或留下交换物',
      effect: '后续可作为与奥兰交涉的剧情凭证，不影响第一幕结局。',
    },
  ],

  chatTopics: [
    '她和奥兰到底熟不熟',
    '她为什么不喜欢欠账',
    '她如何判断怪物巢穴',
    '她为什么总用交易口吻说话',
    '她是否真的会背叛队伍',
  ],

  aiRules: {
    ...COMPANION_SIDE_QUEST_AI_RULES,
    goals: [
      ...COMPANION_SIDE_QUEST_AI_RULES.goals,
      '展示凯娅的机关判断能力和黑市知识。',
      '让玩家感受地下暗道的危险与情报的价值。',
    ],
    hardRules: COMPANION_SIDE_QUEST_AI_RULES.hardRules,
  },

  endingFeedback: {
    high: '「这次我没有把最危险的东西藏起来。别误会，这不是免费服务，只是我觉得你值得赊账。」',
    low: '「合作愉快。至少我们都还没亏本。」',
  },
};

// ============================================================
// 支线四：瑟琳 —— 银杖的第一次裂痕
// ============================================================

const SERIN_SIDE_QUEST: CompanionSideQuestDef = {
  id: 'sidequest_serin_cracked_silver_staff',
  eventId: 'serin_cracked_silver_staff',
  type: 'companion_sidequest',
  companion: 'serin',
  title: '银杖的第一次裂痕',
  location: '黑石根区前沿休整点',
  insertion: { type: 'before', sceneId: 'boss_blackstone_gatekeeper' },
  description: 'Boss 战前休整点，瑟琳的银杖在黑石脉冲中出现裂痕。她第一次明显慌乱，不是怕法杖损坏，而是怕自己控制不住某些事。',

  fixedIntro: [
    {
      speaker: '主持人',
      text: '休整时，黑石根区深处传来一次低沉脉冲。瑟琳手中的银杖忽然亮起，又迅速暗下去。',
    },
    {
      speaker: '主持人',
      text: '你看见杖身上出现了一道细小裂痕。瑟琳下意识握紧银杖，脸色比刚才更白。',
    },
    {
      speaker: '瑟琳',
      text: '「没事……只是魔力回流不稳。」',
    },
    {
      speaker: '凯娅',
      text: '「你说这话的时候，看起来一点都不像没事。」',
    },
    {
      speaker: '瑟琳',
      text: '「我还能继续。」',
    },
  ],

  objectives: [
    '判断瑟琳是否真的没事。',
    '选择安慰、追问、要求她休息或要求她继续施法。',
    '获得黑石干扰魔法的线索。',
    '根据信任值获得 Boss 前提示或银杖护符。',
  ],

  checks: [
    { id: 'insight_serin_fear', skill: '洞察', dc: 13, label: '察觉瑟琳不是单纯担心法杖损坏' },
    { id: 'arcana_blackstone_pulse', skill: '奥秘', dc: 14, label: '判断黑石脉冲会干扰法术稳定性' },
    { id: 'medicine_fatigue', skill: '医疗', dc: 12, label: '确认瑟琳是否过度疲劳' },
  ],

  // 瑟琳支线没有危机战斗，更倾向叙事和选择
  crisis: undefined,

  trustChoices: [
    {
      choice: '安慰她，并要求她先休息',
      trustChange: { serin: +10 },
      result: '瑟琳承认自己害怕"又一次来不及"，但不解释真正含义。',
    },
    {
      choice: '追问她隐瞒了什么，但语气克制',
      trustChange: { serin: +5 },
      result: '瑟琳说明黑石会干扰魔法，但不说未来身份。',
    },
    {
      choice: '只问法杖会不会影响任务',
      trustChange: { serin: 0 },
      result: '瑟琳给出任务层面的回答，保持克制。',
    },
    {
      choice: '粗暴逼问她到底知道什么',
      trustChange: { serin: -15 },
      result: '瑟琳封闭情绪，只回答任务信息。',
    },
    {
      choice: '要求她继续施法，不要拖慢队伍',
      trustChange: { serin: -20 },
      result: '瑟琳照做，但明显疲惫，后续特殊提示关闭。',
    },
  ],

  trustFeedback: {
    low: '瑟琳只说"我还能继续"，不提供额外解释。',
    normal: '瑟琳说明黑石会干扰魔法稳定性。',
    high: '瑟琳给予银杖护符，可作为一次抵抗黑石异常或孢子幻觉的剧情道具。',
    veryHigh:
      '瑟琳除给予银杖护符外，还在 Boss 战前主动提示一个环境危险或安全站位。她会承认："我不是只担心任务失败，我也担心你。"',
  },

  rewards: [
    {
      id: 'silver_staff_charm',
      name: '银杖护符',
      condition: '瑟琳信任值达到 70 以上，且玩家没有强迫她继续施法',
      effect: '可作为一次抵抗黑石异常或孢子幻觉的剧情道具。',
    },
    {
      id: 'serin_boss_position_hint',
      name: '瑟琳的战前提示',
      condition: '瑟琳信任值达到 85 以上',
      effect: 'Boss 战开场前，AI 主持人提示一个环境危险或安全站位。',
    },
  ],

  chatTopics: [
    '银杖为什么会裂',
    '黑石为什么会干扰魔法',
    '她为什么害怕"来不及"',
    '她是否需要休息',
    '她对 Boss 前方危险的判断',
  ],

  aiRules: {
    ...COMPANION_SIDE_QUEST_AI_RULES,
    goals: [
      ...COMPANION_SIDE_QUEST_AI_RULES.goals,
      '暗示黑石会干扰法术，为 Boss 战铺垫。',
      '让玩家感到她隐瞒了什么，但不能揭露未来身份。',
      '强化她对玩家过度关心的异常感。',
    ],
    hardRules: COMPANION_SIDE_QUEST_AI_RULES.hardRules,
  },

  endingFeedback: {
    high: '「无论门后是什么，请记得回头看一眼。不是因为退路还在，而是因为还有人在等你回来。」',
    low: '「门开了。保持队形，不要分散。」',
  },
};

// ============================================================
// 支线汇总表
// ============================================================

export const COMPANION_SIDE_QUESTS: Record<string, CompanionSideQuestDef> = {
  ailin: AILIN_SIDE_QUEST,
  brock: BROCK_SIDE_QUEST,
  kaiya: KAIYA_SIDE_QUEST,
  serin: SERIN_SIDE_QUEST,
};

/** 按 companion id 获取支线定义 */
export function getSideQuest(companion: string): CompanionSideQuestDef | undefined {
  return COMPANION_SIDE_QUESTS[companion];
}

// ============================================================
// 第一幕后半段流程结构
// ============================================================

export interface FlowStep {
  id: string;
  type: 'fixed_scene' | 'companion_sidequest' | 'battle' | 'fixed_choice' | 'rest_and_free_talk';
  description: string;
  companion?: string;           // 同伴支线时用
  battleType?: 'normal' | 'boss';
  battleId?: string;
  choices?: string[];
  nextOnWin?: string;
  nextOnLose?: string;
}

export const ACT1_UNDERGROUND_FLOW: FlowStep[] = [
  {
    id: 'spore_outpost_arrival',
    type: 'fixed_scene',
    description: '抵达孢海据点，尼布登场，确认浅层路线。',
  },
  {
    id: 'sidequest_ailin_wounded_names',
    type: 'companion_sidequest',
    companion: 'ailin',
    description: '艾琳处理伤员与阵亡者名册，体现她的底线。',
  },
  {
    id: 'battle_blue_shoal_01',
    type: 'battle',
    battleType: 'normal',
    battleId: 'enemy_pack_blue_shoal',
    description: '普通战斗一：蓝伞浅滩遭遇战。',
    nextOnWin: 'sidequest_brock_echo_grove',
    nextOnLose: 'defeat_normal_retry',
  },
  {
    id: 'sidequest_brock_echo_grove',
    type: 'companion_sidequest',
    companion: 'brock',
    description: '布洛克识破回声菌林假歌，处理污染菌核。',
  },
  {
    id: 'abandoned_forward_post_intro',
    type: 'fixed_scene',
    description: '抵达前线废弃据点，发现失踪远征队痕迹。',
  },
  {
    id: 'sidequest_kaiya_broken_seals',
    type: 'companion_sidequest',
    companion: 'kaiya',
    description: '凯娅调查补给箱封扣和黑市暗道。',
  },
  {
    id: 'battle_bone_marsh_02',
    type: 'battle',
    battleType: 'normal',
    battleId: 'enemy_pack_bone_marsh',
    description: '普通战斗二：骨柱湿地遭遇战。',
    nextOnWin: 'rhein_encounter_choice',
    nextOnLose: 'defeat_normal_retry',
  },
  {
    id: 'rhein_encounter_choice',
    type: 'fixed_choice',
    description: '关键选择一：帮助莱因或无视莱因。',
    choices: ['help_rhein', 'ignore_rhein'],
  },
  {
    id: 'pre_boss_rest_intro',
    type: 'rest_and_free_talk',
    description: 'Boss 战前休整，检查补给和队伍状态。',
  },
  {
    id: 'sidequest_serin_cracked_silver_staff',
    type: 'companion_sidequest',
    companion: 'serin',
    description: '瑟琳银杖裂痕，触发主线伏笔和 Boss 前提示。',
  },
  {
    id: 'boss_blackstone_gatekeeper',
    type: 'battle',
    battleType: 'boss',
    battleId: 'boss_blackstone_gatekeeper',
    description: 'Boss 战：黑石门卫。',
    nextOnWin: 'choice_blackstone_core',
    nextOnLose: 'ending_bad_time_reset',
  },
  {
    id: 'choice_blackstone_core',
    type: 'fixed_choice',
    description: '关键选择二：破坏核心或稳定核心。',
    choices: ['destroy_core', 'stabilize_core'],
  },
];

/** 根据 sceneId 查找应在此场景后插入的支线 */
export function getSideQuestAfterScene(sceneId: string): CompanionSideQuestDef | undefined {
  for (const quest of Object.values(COMPANION_SIDE_QUESTS)) {
    if (quest.insertion.type === 'after' && quest.insertion.sceneId === sceneId) {
      return quest;
    }
  }
  return undefined;
}

/** 根据 sceneId 查找应在此场景前插入的支线 */
export function getSideQuestBeforeScene(sceneId: string): CompanionSideQuestDef | undefined {
  for (const quest of Object.values(COMPANION_SIDE_QUESTS)) {
    if (quest.insertion.type === 'before' && quest.insertion.sceneId === sceneId) {
      return quest;
    }
  }
  return undefined;
}

// ============================================================
// 结局反馈映射
// ============================================================

export const ENDING_COMPANION_FEEDBACK = {
  ailin: {
    high: '「你记住了他们的名字。无论门后是什么，我们都不是空手来到这里。」',
    low: '「任务还没结束。只是有些名字，已经没人会替他们念出来了。」',
  },
  brock: {
    high: '「你不是只会砍东西的人，这很好。孢海里能活下来的，往往是肯停下来看看脚下的。」',
    low: '「你还活着，不代表你走对了路。只是今天孢海没把账算完。」',
  },
  kaiya: {
    high: '「这次我没有把最危险的东西藏起来。别误会，这不是免费服务，只是我觉得你值得赊账。」',
    low: '「合作愉快。至少我们都还没亏本。」',
  },
  serin: {
    high: '「无论门后是什么，请记得回头看一眼。不是因为退路还在，而是因为还有人在等你回来。」',
    low: '「门开了。保持队形，不要分散。」',
  },
} as const;

/** 根据同伴 id 和信任值获取结局旁白 */
export function getEndingFeedback(
  companion: string,
  trust: number,
): string {
  const feedback = ENDING_COMPANION_FEEDBACK[companion as keyof typeof ENDING_COMPANION_FEEDBACK];
  if (!feedback) return '';
  return trust >= 70 ? feedback.high : feedback.low;
}
