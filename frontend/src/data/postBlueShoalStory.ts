import type {
  GameState,
  ArchiveDocument,
  InvestigationClue,
} from "../types/game";
import type { ScriptedScene } from "./scriptedScenes";
import { buildTrustPatch, getCompanionTrust } from "../utils/trust";

export const POST_BLUE_SHOAL_IDS = {
  aftermath: "after-battle-blue-shoal-expanded-v2",
  route: "bone-wetland-approach-v2",
  boneInvestigation: "bone-wetland-route-choice-v2",
  bonePrebattle: "bone-beast-prebattle-v2",
  boneAftermath: "after-battle-bone-beast-v2",
  camp: "third-expedition-camp-v2",
  laineSurvivor: "laine-survivor-scene-v2",
  laineDecision: "laine-stabilization-v2",
  campNight: "camp-night-companion-scene-v2",
  fortressOuter: "fortress-outer-ring-v2",
  fortressInner: "fortress-protocol-investigation-v2",
  sealChamber: "blackstone-guardian-approach-v2",
  bossPrebattle: "guardian-prebattle-choice-v2",
  afterBoss: "after-battle-blackstone-guardian-v2",
  finalChoice: "final-ending-choice-v2",
  endingA: "ending-act1-a-guardian-remains-v2",
  endingB: "ending-act1-b-carrying-wounded-v2",
  endingC: "ending-act1-c-cold-expedition-v2",
  endingD: "ending-act1-d-break-gate-v2",
  epilogue: "epilogue-return-to-city-v2",
  complete: "post-blue-shoal-game-complete-v2",
} as const;

export type PostBlueShoalOutcome =
  | "great"
  | "success"
  | "partial"
  | "failure"
  | "critical";

export interface PostBlueShoalResolution {
  patch: GameState;
  lines: string[];
  nextSceneId?: string;
  /** 固定推进出口直接播放下一段脚本，不经过 AI 续写。 */
  skipAiNarration?: boolean;
}

const BGM = "/assets/bgm/bgm_04b_fungal_sea_explore.mp3";
const BLUE_SHOAL_BGM = "/assets/bgm/bgm_09_observatory.mp3";

const LEGACY_POST_BLUE_SHOAL_NODE_IDS: Record<string, string> = {
  "after-battle-blue-shoal-expanded": POST_BLUE_SHOAL_IDS.aftermath,
  "route-to-bone-marsh": POST_BLUE_SHOAL_IDS.route,
  "bone-pillar-marsh-investigation": POST_BLUE_SHOAL_IDS.boneInvestigation,
  "prebattle-bone-marsh": POST_BLUE_SHOAL_IDS.bonePrebattle,
  "after-battle-bone-marsh": POST_BLUE_SHOAL_IDS.boneAftermath,
  "third-expedition-camp": POST_BLUE_SHOAL_IDS.camp,
  "laine-survivor-scene": POST_BLUE_SHOAL_IDS.laineSurvivor,
  "laine-stabilization-or-interrogation": POST_BLUE_SHOAL_IDS.laineDecision,
  "camp-night-companion-scene": POST_BLUE_SHOAL_IDS.campNight,
  "fortress-outer-ring": POST_BLUE_SHOAL_IDS.fortressOuter,
  "fortress-inner-investigation": POST_BLUE_SHOAL_IDS.fortressInner,
  "seal-control-chamber": POST_BLUE_SHOAL_IDS.sealChamber,
  "prebattle-blackstone-gatekeeper": POST_BLUE_SHOAL_IDS.bossPrebattle,
  "final-seal-choice": POST_BLUE_SHOAL_IDS.finalChoice,
  "epilogue-return-to-city": POST_BLUE_SHOAL_IDS.epilogue,
  "post-blue-shoal-game-complete": POST_BLUE_SHOAL_IDS.complete,
  "ending-A-guardian-remains": POST_BLUE_SHOAL_IDS.endingA,
  "ending-B-cut-black-root": POST_BLUE_SHOAL_IDS.endingB,
  "ending-C-reverse-clock-anchor": POST_BLUE_SHOAL_IDS.endingC,
  "ending-D-forced-seal": POST_BLUE_SHOAL_IDS.endingD,
};

export function normalizePostBlueShoalNodeId(nodeId?: string | null) {
  const id = String(nodeId || "");
  return LEGACY_POST_BLUE_SHOAL_NODE_IDS[id] || id;
}

export const POST_BLUE_SHOAL_SCENES: ScriptedScene[] = [
  {
    id: POST_BLUE_SHOAL_IDS.aftermath,
    manualOnly: true,
    triggers: ["蓝伞浅滩战后扩展"],
    setArea: "无光孢海·蓝伞浅滩战场",
    bgImage: "/assets/scenes/10blue-shoal-after-battle.webp",
    bgm: BLUE_SHOAL_BGM,
    statePatch: {
      postBlueShoalExpandedStarted: true,
      blue_shoal_aftermath_v2_done: true,
      currentNodeId: POST_BLUE_SHOAL_IDS.aftermath,
      blueShoalInvestigationActions: 0,
    },
    lastEvent: "蓝伞浅滩战斗结束，开始调查战场异常",
    lines: [
      {
        speaker: "主持人",
        text: "战斗结束后，蓝伞浅滩并没有真正安静下来。被斩碎的菌丝散落在浅水与岩缝之间，仍一下一下抽动，像某种濒死的东西还在隔着地面呼吸。",
      },
      {
        speaker: "主持人",
        text: "蓝伞菌盖上的荧光忽明忽暗，水洼里倒映出的不只是你们的影子。偶尔有细微波纹从战场中央扩散开来，可周围没有风，也没有活物走动。",
      },
      {
        speaker: "布洛克",
        text: "「先别收武器。」布洛克用斧柄挑开一团焦黑菌毯，脸色比刚才更沉，「这些孢兽不是来捕食的。它们像是被什么东西从更深处赶出来的。」",
      },
      {
        speaker: "主持人",
        text: "菌毯底部有几道被硬生生撕开的沟痕，方向全部朝向浅滩之外，仿佛整片孢海曾在某一瞬间集体后退，又被迫重新涌上来。",
      },
      {
        speaker: "艾琳",
        text: "艾琳跪在浅水边，将白枝圣徽按向地面。圣徽没有立刻发光，反而被一层细小的蓝绿色孢尘覆盖，像是这里的污染正在抵抗净化。",
      },
      {
        speaker: "艾琳",
        text: "「不只是孢毒。」她低声说，「这里残留着某种恐惧，像是被反复压进土地里，又被刚才的战斗翻了出来。」",
      },
      {
        speaker: "瑟琳",
        text: "瑟琳抬起法杖，银灰色符文在杖端短暂倒转。「这里留下了封印脉冲的余波。地底堡垒还在回应，但回应方式不对，像是有人把求救信号和驱赶命令叠在了一起。」",
      },
      {
        speaker: "凯娅",
        text: "凯娅蹲在一截断裂的黑缆旁，指尖擦过缆线切口。「这不是孢兽咬断的。切面太整齐，像是有人提前处理过。」",
      },
      {
        speaker: "主持人",
        text: "你们这才注意到，浅滩战场上散落着三类异常痕迹：菌群集体迁徙的沟痕、封印脉冲留下的逆转余波，以及一段被人为破坏的黑缆残片。",
      },
      {
        speaker: "瑟琳",
        text: "「继续前进前，最好先弄清楚这里到底发生了什么。否则下一次，我们可能连敌人从哪里来都不知道。」",
      },
      { speaker: "凯娅", text: "「也就是说，真正值钱的线索，还没露头。」" },
    ],
    hints: [],
  },
  {
    id: POST_BLUE_SHOAL_IDS.route,
    manualOnly: true,
    triggers: ["前往骨柱湿地"],
    setArea: "无光孢海·湿地岔路",
    bgImage: "/assets/scenes/11black-root-entrance.webp",
    bgm: BGM,
    statePatch: {
      blue_shoal_expanded_done: true,
      blue_shoal_aftermath_v2_done: true,
      bone_wetland_entered: true,
      currentNodeId: POST_BLUE_SHOAL_IDS.route,
    },
    lastEvent: "离开蓝伞浅滩，选择前往骨柱湿地的路线",
    lines: [
      {
        speaker: "主持人",
        text: "离开蓝伞浅滩后，孢海的光变得更低。蓝伞菌的柔光被身后甩远，前方只剩一片贴着地面流动的雾，像湿地本身正在缓慢吐息。",
      },
      {
        speaker: "主持人",
        text: "这里的地面不像真正的地面。靴底陷入柔软菌毯，下面传来空响，仿佛你们踩在一层覆盖深井的皮肤上。尼布留下的发光铆钉在前方分成四列，分别没入不同方向。",
      },
      {
        speaker: "布洛克",
        text: "「第一条是发光桩道。」布洛克指向最规整的一列铆钉，「尼布那小子走过的安全线，绕远，但能避开大部分软泥坑和孢兽巢。想少惹麻烦，就看准这些桩。」",
      },
      {
        speaker: "凯娅",
        text: "「第二条是旧排水渠。」凯娅蹲下看向一排半埋在菌毯里的矮人石孔，「窄、滑、恶心，但能绕到湿地侧面。走得好，就是伏击别人；走不好，就是把自己塞进泥里。」",
      },
      {
        speaker: "布洛克",
        text: "「第三条沿菌毯脊线走。」他用斧柄拨开一层发亮孢尘，「那地方能看清孢群往哪儿迁。懂生态的人能提前判断骨柱湿地里有什么东西在动，不懂的人只会吸一肚子孢粉。」",
      },
      {
        speaker: "瑟琳",
        text: "「第四条是断裂秘银缆索。」瑟琳望向雾中横过裂隙的暗银色残缆，「风险最高，但那上面可能残留封印回路的痕迹。若能取到样本，也许能解释蓝伞浅滩的异常脉冲。」",
      },
      {
        speaker: "艾琳",
        text: "「所以，发光桩道更安全，旧排水渠更适合绕行，菌毯脊线能看懂孢群变化，秘银缆索则可能接近封印真相。」艾琳轻按圣徽，「但每一条路都不会白白放人过去。」",
      },
      {
        speaker: "凯娅",
        text: "「说简单点：稳路保命，暗路抢位，菌路拿情报，缆路赌大线索。」凯娅笑了笑，「现在看你们想怎么进骨柱湿地。」",
      },
      {
        speaker: "主持人",
        text: "四条路线沉默地伸向雾中。你们可以在继续深入前做出数次准备，但同一条路线没有必要重复尝试。",
      },
    ],
    hints: [],
  },

  {
    id: POST_BLUE_SHOAL_IDS.boneInvestigation,
    manualOnly: true,
    triggers: ["抵达骨柱湿地"],
    setArea: "无光孢海·骨柱湿地",
    bgImage: "/assets/scenes/bg-10-bone-pillar-marsh.webp",
    bgm: "/assets/bgm/bgm_12_v2_candidate1_raw.mp3",
    statePatch: {
      currentNodeId: POST_BLUE_SHOAL_IDS.boneInvestigation,
      boneMarshActions: 0,
    },
    lastEvent: "抵达会模仿人声的骨柱湿地",
    lines: [
      {
        speaker: "主持人",
        text: "穿过湿地岔路后，脚下的菌毯逐渐变硬，颜色也从蓝绿转为灰白。雾气贴着地面翻滚，像一层被骨头撑起的潮水。",
      },
      {
        speaker: "主持人",
        text: "骨柱湿地没有水声，却有潮声。一根根苍白骨柱从菌毯中伸出，有的像肋骨，有的像断裂的手指，青绿色孢光沿骨缝缓慢上升。",
      },
      {
        speaker: "布洛克",
        text: "「到了。」布洛克压低声音，「别碰那些骨柱，别踩柱根，尤其别相信从雾里传出来的熟人声。」",
      },
      {
        speaker: "主持人",
        text: "他话音刚落，远处便传来尼布的声音：“这边安全，跟着铆钉走。”那声音温和、清晰，甚至连停顿都和本人一模一样。",
      },
      {
        speaker: "艾琳",
        text: "「不要回应。」艾琳立刻按住圣徽，声音很轻，却没有犹豫，「它不是在说话，是在等我们承认它。」",
      },
      {
        speaker: "主持人",
        text: "雾中很快又响起第二个声音。这一次，它像是队伍里某个人在叫你的名字，语气焦急，位置忽左忽右，仿佛只要你回头，就能看见有人落在了后面。",
      },
      {
        speaker: "凯娅",
        text: "「终于开始像个陷阱了。问题是，它想骗我们走过去，还是想拖延我们别继续往前？」",
      },
      {
        speaker: "主持人",
        text: "瑟琳抬起法杖，银灰符文在雾中划出短暂的圆弧。",
      },
      {
        speaker: "瑟琳",
        text: "「骨柱之间有回声回路，声音不是随机出现的。它们在读取我们的记忆残响，再用熟悉的声音制造方向误判。」",
      },
      {
        speaker: "布洛克",
        text: "「骨柱湿地里通常有三样东西最要命：会学人说话的回声菌、藏在柱根下的孢兽巢，还有被菌毯盖住的旧路标。」",
      },
      {
        speaker: "艾琳",
        text: "「如果能找出声音的源头，或许可以让它短时间安静下来。如果能净化柱根，也许能削弱这里的污染。」",
      },
      {
        speaker: "凯娅",
        text: "「如果能找到旧路标，我们就不用被这片鬼地方牵着鼻子走。」",
      },
      {
        speaker: "主持人",
        text: "骨柱之间的雾越来越厚，熟悉的声音在远处一遍遍呼唤。继续深入前，你们必须先决定要调查哪里。",
      },
    ],
    hints: [],
  },

  {
    id: POST_BLUE_SHOAL_IDS.bonePrebattle,
    manualOnly: true,
    triggers: ["骨柱湿地伏击"],
    setArea: "无光孢海·骨柱湿地伏击区",
    bgImage: "/assets/scenes/bg-10-bone-pillar-marsh.webp",
    bgm: BGM,
    statePatch: {
      currentNodeId: POST_BLUE_SHOAL_IDS.bonePrebattle,
      bone_beast_pre_action_done: true,
    },
    lastEvent: "骨柱湿地伏击出现，只够进行一次战前行动",
    lines: [
      {
        speaker: "主持人",
        text: "骨柱间的雾突然塌下。拟声菌丝从石柱背后滑出，一头披着苍白骨片的孢兽缓慢站起。",
      },
      {
        speaker: "瑟琳",
        text: "「它们在等同一个心跳。还有时间做一个准备动作——只够一个。」",
      },
    ],
    hints: [],
  },
  {
    id: POST_BLUE_SHOAL_IDS.boneAftermath,
    manualOnly: true,
    triggers: ["骨柱湿地战后"],
    setArea: "无光孢海·骨柱湿地尽头",
    bgImage: "/assets/scenes/bg-10-bone-pillar-marsh.webp",
    bgm: BGM,
    statePatch: {
      currentNodeId: POST_BLUE_SHOAL_IDS.boneAftermath,
      bone_marsh_battle_done: true,
      bone_beast_battle_done: true,
      battle_bone_marsh_result: "win",
    },
    lastEvent: "穿过骨柱湿地，发现第三远征队营地",
    lines: [
      {
        speaker: "主持人",
        text: "最后一只拟声菌团伏在折断的骨柱下，菌膜随着最后一次抽搐层层塌陷。它没有发出兽类的哀鸣，而是挤出几个彼此重叠的人声。",
      },
      {
        speaker: "拟声菌团",
        text: "「三号缆索断了……把伤员送回医疗帐……莱因，别让他们从里面开门……」",
      },
      {
        speaker: "主持人",
        text: "那些话不是临死时随意拼出的诱饵。呼吸、停顿、甚至远处金属撞击的回声都属于同一段记忆——第三远征队覆灭前，被菌群吞下的最后几分钟。",
      },
      {
        speaker: "瑟琳",
        text: "「萨洛说失联前的求援方向一直在变，公会报告却记录他们始终驻守同一片区域。现在解释得通了：移动的不是远征队，是有人借他们的声音从堡垒里面发出假信号。」",
      },
      {
        speaker: "艾琳",
        text: "艾琳蹲下检查残留在菌膜里的药液结晶。「这和伤员净化记录里的剂量一致。第三远征队不是瞬间被杀死的；他们救治过伤员，也撑过了一段时间。」",
      },
      {
        condition: "flags.pre_bone_take_high_ground",
        speaker: "主持人",
        text: "战前抢下的骨柱高点此刻也派上了用场：从高处望去，所有逃窜沟痕都绕开营地中央那盏仍在闪烁的冷光灯。",
      },
      {
        condition: "flags.pre_bone_purify_spores",
        speaker: "艾琳",
        text: "「幸好先净化了周围孢尘。」艾琳收起圣徽，「我们听见的是被污染保存的旧记忆，不是新一轮诱导。」",
      },
      {
        condition: "flags.pre_bone_brock_bait",
        speaker: "布洛克",
        text: "布洛克剖开诱饵旁留下的菌丝：「它们宁愿扑向诱饵也不肯靠近营地。后面有东西连孢兽都在躲。」",
      },
      {
        condition: "flags.pre_bone_kaia_trap",
        speaker: "凯娅",
        text: "凯娅从战前拆除的陷阱里抽出半截黑缆：「这条缆线被人改成了阻拦索，切口朝里——布置它的人防的是堡垒方向。」",
      },
      {
        condition: "flags.pre_bone_serin_pulse",
        speaker: "瑟琳",
        text: "瑟琳将战前读到的脉冲节奏与拟声残片重叠，确认那句‘别从里面开门’恰好发生在一次封印逆转的峰值。",
      },
      {
        condition: "yunling_farewell_done",
        speaker: "主持人",
        text: "云苓的护身符贴在胸前微微发热，封在里面的蓝色菌叶与白枝烛芯同时褪去一层颜色，替你挡下了拟声菌团消散时最后一阵记忆回响。",
      },
      {
        speaker: "布洛克",
        text: "布洛克检查战前行动留下的痕迹，又望向孢兽倒下的位置。「它们不是守着这里。它们是在挡住后面的营地，或者——被后面那东西赶出来。」",
      },
      {
        speaker: "主持人",
        text: "凯娅从菌泥中挑出半枚压扁的黑缆扣。扣环内侧的受力痕朝向堡垒，证明有人曾从营地方向拼命拉住一条通往内部的缆索。",
      },
      {
        speaker: "凯娅",
        text: "「记下来。门不是被外面的东西撞开的——有人在里面开门，而远征队里有人试过阻止它。」",
      },
      {
        speaker: "主持人",
        text: "战场终于沉入寂静。雾后露出倾斜的帐杆、向内倒伏的拒马、断裂的旗帜和被菌毯半吞没的补给箱。第三远征队营地就在前方；那里看不见活人，却有一盏冷光灯仍在断断续续地亮。",
      },
    ],
    hints: [],
  },
  {
    id: POST_BLUE_SHOAL_IDS.camp,
    manualOnly: true,
    triggers: ["调查第三远征队营地"],
    setArea: "无光孢海·第三远征队营地",
    bgImage: "/assets/scenes/12lain-survivor-site.webp",
    bgm: BGM,
    statePatch: {
      currentNodeId: POST_BLUE_SHOAL_IDS.camp,
      expedition_camp_found: true,
      third_camp_found: true,
      expedition_camp_initialized: true,
    },
    lastEvent: "进入第三远征队遗弃营地",
    lines: [
      {
        speaker: "主持人",
        text: "营地外围的拒马全部朝向堡垒，而不是朝向孢海。木桩背面布满刀斧劈砍留下的缺口，说明最后的冲突发生在防线内侧；第三远征队并非被外部兽群一拥而上地撕碎。",
      },
      {
        speaker: "主持人",
        text: "营火旁叠着吃空的口粮袋，医疗帐外排着三只清洗过的水盆，一口锅被反复加热到锅底开裂。这里的人在第一次出事后又活了数日，救治、轮岗、修补防线，直到某个命令让一切彻底失控。",
      },
      {
        speaker: "瑟琳",
        text: "「失联报告把这里写成一次突发袭击，但营地至少经历过三轮值守。公会收到的最后通信，很可能已经不是他们本人发出的。」",
      },
      {
        speaker: "艾琳",
        text: "艾琳在医疗帐门口找到一行用炭写下的字：‘仍能说出自己名字的人，先救。’旁边的计数每天都在减少，却从未归零。",
      },
      {
        speaker: "布洛克",
        text: "「有人撑到了最后，也有人一直在修那条黑缆。」布洛克指向通往堡垒的拖痕，「不是为了开门，是为了把门拽回去。」",
      },
      {
        speaker: "凯娅",
        text: "凯娅望向指挥帐、医疗帐、地图桌和封蜡锁箱。「先把他们没来得及带走的真相拼起来。要是还有人活着，他会需要我们先知道该问什么。」",
      },
    ],
    hints: [],
  },
  {
    id: POST_BLUE_SHOAL_IDS.laineSurvivor,
    manualOnly: true,
    triggers: ["发现莱因"],
    setArea: "无光孢海·第三远征队营地岩棚",
    bgImage: "/assets/scenes/12lain-survivor-site.webp",
    bgm: BGM,
    statePatch: {
      currentNodeId: POST_BLUE_SHOAL_IDS.laineSurvivor,
      laine_found: true,
      laine_alive: true,
    },
    lastEvent: "在营地岩棚发现第三远征队最后一个活人莱因",
    lines: [
      {
        speaker: "主持人",
        text: "你们准备离开营地时，凯娅忽然抬手。风里传来一道很轻的金属摩擦声，来自营地后方一座塌了一半的岩棚。",
      },
      {
        speaker: "主持人",
        text: "几根断裂的黑缆插在岩壁里。岩棚深处，一名重甲兵靠坐在石壁下，胸甲被血和孢液糊住，半边肩膀缠满随呼吸收缩的青绿色菌丝。",
      },
      { speaker: "布洛克", text: "「有人。还活着。」" },
      { speaker: "莱因", text: "「别……别回应它。它会用你认识的声音叫你。」" },
      { speaker: "艾琳", text: "「他还活着，而且意识没有完全被孢声吞掉。」" },
      { speaker: "瑟琳", text: "「黑缆守卫，莱因。第三远征队最后一个活人。」" },
    ],
    hints: [],
  },
  {
    id: POST_BLUE_SHOAL_IDS.laineDecision,
    manualOnly: true,
    triggers: ["处理莱因伤势与证词"],
    setArea: "第三远征队营地·岩棚深处",
    bgImage: "/assets/scenes/12lain-survivor-site.webp",
    bgm: BGM,
    statePatch: { currentNodeId: POST_BLUE_SHOAL_IDS.laineDecision },
    lastEvent: "莱因在清醒与孢声之间说出黑石门卫真相",
    lines: [
      {
        speaker: "主持人",
        text: "莱因的意识像一盏快熄灭的灯。每当他闭眼，喉咙里都会响起另一个温柔而熟悉的声音：“回来吧，莱因。”",
      },
      {
        speaker: "莱因",
        text: "「那不是队长。队长死在门前了。那东西只是学会了他的声音。」",
      },
      { speaker: "瑟琳", text: "「黑石门卫呢？」" },
      {
        speaker: "莱因",
        text: "「它在守门。它一直都在守门。是我们……把假命令带进去了。」",
      },
      {
        condition: "purification_heart_used_on_laine",
        speaker: "莱因",
        text: "「净化之心压住了我体内的黑石侵蚀……同样的净化反应，也能稳定门卫的核心。别把它当成只能砸碎的怪物。」",
      },
    ],
    hints: [],
  },
  {
    id: POST_BLUE_SHOAL_IDS.campNight,
    manualOnly: true,
    triggers: ["营地夜谈"],
    setArea: "第三远征队营地·夜火",
    bgImage: "/assets/scenes/13black-root-rest-point.webp",
    bgm: BGM,
    statePatch: { currentNodeId: POST_BLUE_SHOAL_IDS.campNight },
    lastEvent: "进入堡垒前，与一名伙伴进行夜谈",
    lines: [
      {
        speaker: "主持人",
        text: "夜晚在地底没有真正降临，只是孢光变得更冷。你们在远征队留下的石圈里点起一小团火。",
      },
      {
        speaker: "主持人",
        text: "明天就要进入地底堡垒。今晚，队伍里的每个人似乎都有话想说。",
      },
      {
        condition: "laine_alive && !laine_left_behind",
        speaker: "主持人",
        text: "莱因靠在火光边缘，没有真正睡着。每隔一会儿，他都会睁眼确认队伍和自己的手仍在原处。",
      },
      {
        condition: "laine_left_behind && !purification_heart_used_on_laine",
        speaker: "主持人",
        text: "岩棚已经被黑暗吞没。没有净化之心，队伍既没能带走莱因，也没能取得他关于黑石门卫核心的证词。",
      },
    ],
    hints: [],
  },
  {
    id: POST_BLUE_SHOAL_IDS.fortressOuter,
    manualOnly: true,
    triggers: ["抵达地底堡垒外环"],
    setArea: "地底堡垒·外环",
    bgImage: "/assets/scenes/bg-11-blackstone-root.webp",
    bgm: BGM,
    statePatch: {
      currentNodeId: POST_BLUE_SHOAL_IDS.fortressOuter,
      fortress_outer_ring_entered: true,
    },
    lastEvent: "抵达仍在运行的地底堡垒门禁",
    lines: [
      {
        speaker: "主持人",
        text: "地底堡垒从孢海尽头升起，像一块被黑暗浸透的巨骨。黑石与旧铜铆接的外墙爬满青绿色菌丝。",
      },
      {
        speaker: "主持人",
        text: "正门刻着三英雄时代的誓词：“此门不开，深渊不入；此城不退，众生不坠。”",
      },
      {
        speaker: "瑟琳",
        text: "「菌丝正在模仿另一条命令。它们想让门禁相信，门内的人要回来了。」",
      },
      {
        condition: "laine_stabilized && !laine_left_behind",
        speaker: "莱因",
        text: "「外环门禁不是锁，是问答。它会问你从哪条缆来。回答它：从断缆回到门前。」",
      },
      {
        condition: "laine_alive && laine_spore_worsened && !laine_left_behind",
        speaker: "莱因",
        text: "「别走左边……不，是右边。等等，我又听见队长了。」",
      },
      {
        condition: "laine_left_behind",
        speaker: "拟声菌团",
        text: "「你们为什么不带我走？」",
      },
      {
        condition: "laine_mercy_killed",
        speaker: "主持人",
        text: "莱因的黑缆识别牌在门禁前泛起残光。艾琳看了它一眼，什么也没有说。",
      },
    ],
    hints: [],
  },
  {
    id: POST_BLUE_SHOAL_IDS.fortressInner,
    manualOnly: true,
    triggers: ["进入地底堡垒"],
    setArea: "地底堡垒·内环大厅",
    bgImage: "/assets/scenes/bg-12-dark-gate-vestibule.webp",
    bgm: BGM,
    statePatch: {
      currentNodeId: POST_BLUE_SHOAL_IDS.fortressInner,
      fortressInnerActions: 0,
    },
    lastEvent: "进入仍在运行的地底堡垒遗迹",
    lines: [
      {
        speaker: "主持人",
        text: "堡垒内部没有彻底死去。墙内符文管线一明一暗，节奏乱得像病人的脉搏。",
      },
      {
        speaker: "主持人",
        text: "大厅中央的缺头石像握着断剑，底座上刻着：“守门者可沉睡，不可遗忘。”",
      },
    ],
    hints: [],
  },
  {
    id: POST_BLUE_SHOAL_IDS.sealChamber,
    manualOnly: true,
    triggers: ["进入封印控制大厅"],
    setArea: "地底堡垒·封印控制大厅",
    bgImage: "/assets/scenes/14dark-gate-forecourt-battle.webp",
    bgm: BGM,
    statePatch: { currentNodeId: POST_BLUE_SHOAL_IDS.sealChamber },
    lastEvent: "在地心之门前发现被错误命令劫持的守门者",
    lines: [
      {
        speaker: "主持人",
        text: "地心之门仍然闭合，却不再严丝合缝。门缝中透出极细的暗红光，像一道尚未愈合的伤口。",
      },
      {
        speaker: "主持人",
        text: "黑石门卫单膝跪在门前。它抬起头，眼中没有愤怒，只有一道被反复覆盖的命令。",
      },
      {
        speaker: "黑石门卫",
        text: "「维护队返航。开启外层封锁。迎接门内指令。」",
      },
      {
        condition: "expedition_truth_complete",
        speaker: "瑟琳",
        text: "「门内污染伪造了维护命令。它以为自己在修复封印，实际上正在一点点打开门。」",
      },
      {
        condition: "!expedition_truth_complete",
        speaker: "瑟琳",
        text: "「它的命令被污染了。细节还不完整，但任由它继续执行，门一定会打开。」",
      },
      {
        condition: "flags.clue_gatekeeper_not_evil || clue_gatekeeper_not_evil",
        speaker: "艾琳",
        text: "「它不是想放深渊进来。它只是被迫相信，开门才是守门。」",
      },
    ],
    hints: [],
  },
  {
    id: POST_BLUE_SHOAL_IDS.bossPrebattle,
    manualOnly: true,
    triggers: ["黑石门卫战前行动"],
    setArea: "地心之门·守门者阵前",
    bgImage: "/assets/scenes/14dark-gate-forecourt-battle.webp",
    bgm: BGM,
    statePatch: { currentNodeId: POST_BLUE_SHOAL_IDS.bossPrebattle },
    lastEvent: "黑石门卫起身，只剩一次战前准备机会",
    lines: [
      {
        speaker: "主持人",
        text: "门内低语骤然重叠，黑石门卫抓住巨刃站起。它正在执行错误命令，却仍用身体挡在门前。",
      },
      {
        speaker: "瑟琳",
        text: "「我们只能做一次准备。之后，无论它记不记得自己是谁，都必须先让它停下来。」",
      },
    ],
    hints: [],
  },
  {
    id: POST_BLUE_SHOAL_IDS.finalChoice,
    manualOnly: true,
    triggers: ["最终封印选择"],
    setArea: "地心之门·破损封印阵",
    bgImage: "/assets/scenes/14dark-gate-forecourt-battle.webp",
    bgm: BGM,
    statePatch: {
      currentNodeId: POST_BLUE_SHOAL_IDS.finalChoice,
      boss_battle_done: true,
      battle_blackstone_gatekeeper_result: "win",
      core_choice_pending: false,
    },
    lastEvent: "黑石门卫被压制，地心之门等待最终处置",
    lines: [
      {
        speaker: "主持人",
        text: "黑石门卫单膝跪在地心之门前，胸口核心裂开。青绿色菌丝和暗红光从裂缝里一同涌出。",
      },
      {
        speaker: "瑟琳",
        text: "「还有一次机会。不是很多时间，但够我们做一个选择。」",
      },
      { speaker: "艾琳", text: "「它还没有完全消失。」" },
      { speaker: "布洛克", text: "「要砸就现在砸，要救也得现在救。」" },
      { speaker: "凯娅", text: "「稳定它，或者砸碎它。没有稳赚的选项，你来定。」" },
    ],
    hints: [],
  },
  {
    id: POST_BLUE_SHOAL_IDS.afterBoss,
    manualOnly: true,
    triggers: ["黑石门卫战后"],
    setArea: "地心之门·黑门之前",
    bgImage: "/assets/scenes/dark-gate-after-battle.webp",
    bgm: BGM,
    statePatch: {
      currentNodeId: POST_BLUE_SHOAL_IDS.afterBoss,
      boss_battle_done: true,
      blackstone_guardian_defeated: true,
      battle_blackstone_gatekeeper_result: "win",
    },
    lastEvent: "黑石门卫跪倒在黑门之前，队伍必须决定最后处置方式。",
    lines: [
      {
        speaker: "主持人",
        text: "黑石门卫跪倒在黑门前。它没有彻底碎裂，巨刃断成两截，胸口核心布满裂纹，左臂仍死死卡在门缝里。",
      },
      {
        speaker: "主持人",
        text: "黑根被你们斩断了大半，却还有更深的部分从门后探出，像不甘心退回黑暗的手指。大厅里的符文忽明忽暗，每一次亮起，你都能看见门卫胸口深处残留的蓝光。",
      },
      { speaker: "门后声音", text: "「开门。救我。回家。执行命令。」" },
      {
        speaker: "主持人",
        text: "最后，所有声音合成一个与你完全相同的声音：「你已经走到这里了。现在只差最后一步。」",
      },
      {
        speaker: "艾琳",
        text: "「不要回应。现在该由活人决定，而不是门后的东西替我们说话。」",
      },
      { speaker: "布洛克", text: "布洛克握紧斧头，第一次没有急着砍下去。" },
      { speaker: "凯娅", text: "「现在总该由活人说话了。」" },
      { speaker: "瑟琳", text: "「稳定核心，或是彻底破坏它。我们只有这两个选择。」" },
      {
        condition: "laine_alive && !laine_left_behind",
        speaker: "莱因",
        text: "莱因扶着墙站起来，看向门卫。「它站了十年。别让它最后只被记成怪物。」",
      },
    ],
    hints: ["继续到最终处置选择"],
  },
  {
    id: POST_BLUE_SHOAL_IDS.endingA,
    manualOnly: true,
    triggers: ["结局A：守门者仍在"],
    setArea: "地心之门·封印重启",
    bgImage: "/assets/CG/cg05.png",
    statePatch: {
      ending: "guardian-remains",
      endingId: "guardian-remains",
      act1EndingId: "guardian-remains",
      act1EndingCode: "A",
      act1_ending_title: "守门者仍在",
      bossCoreChoice: "stabilize",
      core_choice_pending: false,
      currentNodeId: POST_BLUE_SHOAL_IDS.endingA,
    },
    lastEvent: "结局A：守门者仍在",
    lines: [
      {
        speaker: "主持人",
        text: "你将双手按上裸露的黑石核心。瑟琳校准脉冲，艾琳压住污染，核心的震动终于从失控的轰鸣变回缓慢而稳定的心跳。",
        bgImage: "/assets/CG/cg05.png",
      },
      {
        speaker: "主持人",
        text: "黑石门卫眼中的红光逐渐熄灭。它没有被彻底摧毁，而是重新沉入守门协议的长眠，旧防线也为你们留下了关于“门开错了”的证词。",
        bgImage: "/assets/CG/cg01.png",
      },
      {
        speaker: "莱因",
        text: "「阿格洛恩，回到门前。第三远征队……归队。」",
        bgImage: "/assets/CG/cg01.png",
      },
    ],
    hints: ["穿过黑暗之门"],
  },
  {
    id: POST_BLUE_SHOAL_IDS.endingB,
    manualOnly: true,
    triggers: ["结局B：带伤者穿门"],
    setArea: "地心之门·破裂门体",
    bgImage: "/assets/CG/cg06.png",
    statePatch: {
      ending: "wounded-through-gate",
      endingId: "wounded-through-gate",
      act1EndingId: "wounded-through-gate",
      act1EndingCode: "B",
      act1_ending_title: "带伤者穿门",
      bossCoreChoice: "destroy",
      core_choice_pending: false,
      currentNodeId: POST_BLUE_SHOAL_IDS.endingB,
    },
    lastEvent: "结局B：带伤者穿门",
    lines: [
      {
        speaker: "主持人",
        text: "你将武器送进核心最深处。黑石在巨响中碎裂，封锁与错误命令一同崩塌，地心之门被粗暴地撕开。",
        bgImage: "/assets/CG/cg06.png",
      },
      {
        speaker: "主持人",
        text: "门体在震动中变得更加不稳定，但你们没有丢下莱因。艾琳扶住他的肩膀，队伍带着唯一的幸存者走向门后。",
        bgImage: "/assets/CG/cg02.png",
      },
      {
        speaker: "莱因",
        text: "「别丢下守门的人……别再丢下……」",
        bgImage: "/assets/CG/cg02.png",
      },
    ],
    hints: ["穿过黑暗之门"],
  },
  {
    id: POST_BLUE_SHOAL_IDS.endingC,
    manualOnly: true,
    triggers: ["结局C：冷静的远征"],
    setArea: "地心之门·稳定通道",
    bgImage: "/assets/CG/cg05.png",
    statePatch: {
      ending: "cold-expedition",
      endingId: "cold-expedition",
      act1EndingId: "cold-expedition",
      act1EndingCode: "C",
      act1_ending_title: "冷静的远征",
      bossCoreChoice: "stabilize",
      core_choice_pending: false,
      currentNodeId: POST_BLUE_SHOAL_IDS.endingC,
    },
    lastEvent: "结局C：冷静的远征",
    lines: [
      {
        speaker: "主持人",
        text: "你选择稳定核心。瑟琳封住逆向脉冲，门体在可控的震动中缓慢开启，队伍几乎没有付出额外损伤。",
        bgImage: "/assets/CG/cg05.png",
      },
      {
        speaker: "主持人",
        text: "这是一条理性、冷静而有效的道路。只是没有莱因的人证，关于守门者和第三远征队的最后真相，永远留在了黑根深处。",
        bgImage: "/assets/CG/cg03.png",
      },
      {
        speaker: "艾琳",
        text: "艾琳最后回望了一次来路，没有责问，只把白枝圣徽握得更紧。",
        bgImage: "/assets/CG/cg03.png",
      },
    ],
    hints: ["穿过黑暗之门"],
  },
  {
    id: "ending-failure-gate-opens",
    manualOnly: true,
    triggers: ["门缝开启"],
    setArea: "地心之门·红色孢雨",
    bgImage: "/assets/scenes/ending-gate-split-open.webp",
    statePatch: {
      ending: "gate_opens",
      endingId: "gate_opens",
      act1EndingId: "gate_opens",
      act1_ending_title: "门缝开启",
      act1GameCompleted: true,
      gate_open_failure_triggered: true,
      currentNodeId: "ending-failure-gate-opens",
    },
    lastEvent: "坏结局：门缝开启",
    lines: [
      {
        speaker: "主持人",
        text: "门内的声音更快。封印阵上的符文同时倒转，地心之门打开了一道缝。那已经足够。",
      },
      {
        condition: "laine_alive",
        speaker: "主持人",
        text: "莱因用最后一点清醒挡到门前，却被门缝里涌出的红光吞没。",
      },
      {
        condition: "!laine_alive",
        speaker: "拟声菌团",
        text: "「别让门开。」那是莱因的声音。",
      },
      {
        speaker: "主持人",
        text: "你们回到城市时，人们仍在欢呼。直到第一场红色孢雨落下，没有人知道灾难已经把手伸进门缝。",
      },
    ],
    hints: ["结束"],
  },
  {
    id: POST_BLUE_SHOAL_IDS.endingD,
    manualOnly: true,
    triggers: ["结局D：裂门而下"],
    setArea: "地心之门·崩裂通道",
    bgImage: "/assets/CG/cg06.png",
    statePatch: {
      ending: "gate-split-open",
      endingId: "gate-split-open",
      act1EndingId: "gate-split-open",
      act1EndingCode: "D",
      act1_ending_title: "裂门而下",
      bossCoreChoice: "destroy",
      core_choice_pending: false,
      currentNodeId: POST_BLUE_SHOAL_IDS.endingD,
    },
    lastEvent: "结局D：裂门而下",
    lines: [
      {
        speaker: "主持人",
        text: "你没有再为核心留下余地。最后一击贯穿黑石，守门协议与封锁同时粉碎，整座大厅在门体开裂的轰鸣中摇晃。",
        bgImage: "/assets/CG/cg06.png",
      },
      {
        speaker: "主持人",
        text: "没有莱因，也没有足够的人证与余地。你们得到了一条继续向下的道路，却以最不稳定、最冷酷的方式失去了最多线索。",
        bgImage: "/assets/CG/cg04.png",
      },
      {
        speaker: "瑟琳",
        text: "「门开了。至于我们放出来了什么，只能继续往前找答案。」",
        bgImage: "/assets/CG/cg04.png",
      },
    ],
    hints: ["穿过黑暗之门"],
  },
  {
    id: POST_BLUE_SHOAL_IDS.epilogue,
    manualOnly: true,
    triggers: ["穿过黑暗之门"],
    setArea: "地下深海·黑暗之门彼端",
    bgImage: "/assets/scenes/15underground-ocean-reveal.webp",
    statePatch: { currentNodeId: POST_BLUE_SHOAL_IDS.epilogue },
    lastEvent: "黑暗之门后显露出无边的地下深海",
    lines: [
      {
        speaker: "主持人",
        text: "你们穿过黑暗之门。门后不是另一座堡垒，也不是继续下沉的矿道。",
      },
      {
        speaker: "主持人",
        text: "一片没有天空的深海在脚下铺开，遥远微光如同沉没的群星，在黑潮尽头缓慢明灭。",
      },
      {
        speaker: "主持人",
        text: "旅程还未结束。一行人的冒险，才刚刚开始。",
      },
    ],
    hints: ["结束第一幕"],
  },
  {
    id: POST_BLUE_SHOAL_IDS.complete,
    manualOnly: true,
    triggers: ["扩展第一幕结束"],
    setArea: "第一幕·完",
    statePatch: {
      currentNodeId: POST_BLUE_SHOAL_IDS.complete,
      act1GameCompleted: true,
    },
    lastEvent: "第一幕扩展剧情结束",
    lines: [],
    hints: [],
  },
];

const DOCUMENTS: Record<string, ArchiveDocument> = {
  doc_patrol_record_03: document(
    "doc_patrol_record_03",
    "第三巡逻队记录",
    "浅层巡逻队关于拟声诱捕的最后记录。",
    "蓝伞浅滩·守卫遗物",
    "第三巡逻队，浅层孢海外缘记录。第一次听见呼救时，我们以为是第二队的人。声音能叫出每个人的名字。尼布说不要回应，不要回头。蓝伞浅滩不是异常源头，只是被更深处的东西推到了这里。",
  ),
  doc_bone_pillar_rubbing: document(
    "doc_bone_pillar_rubbing",
    "骨柱铭文拓片",
    "证明骨柱曾属于封印冷却结构。",
    "骨柱湿地",
    "拓片上反复出现“冷却”“承载”“守门者”三组古代符号。所谓骨柱并非天然形成，而是封印冷却结构被孢化后留下的生物化支撑柱。",
  ),
  doc_expedition_commander_final_log: document(
    "doc_expedition_commander_final_log",
    "远征队长最后日志",
    "揭示黑石门卫收到伪造维护命令。",
    "第三远征队营地·指挥帐",
    "降渊第十七日。守门者还在回应，但它回应的不是我们。门内侧伪造了维护队返航命令。后来者必须记住：门卫不是敌人，真正的敌人藏在命令里。不要急着摧毁守门者，除非已经没有别的选择。",
  ),
  doc_expedition_medical_log: document(
    "doc_expedition_medical_log",
    "远征队用药记录",
    "记录孢化早期的可逆净化方案。",
    "第三远征队营地·医疗帐",
    "早期孢化并非立刻不可逆。白枝烛芯可稳定意识，蓝伞菌盖可缓解孢毒，经过调律的黑石核心能够承载净化反应。",
  ),
  doc_last_transmission: document(
    "doc_last_transmission",
    "第三远征队最后通信",
    "记录守门者真名与协议覆盖方法。",
    "第三远征队营地·通讯器",
    "最后通信断续重复同一个古地底语名字：阿格洛恩——站在门前者。真名指令可暂时覆盖门内伪造的维护命令。",
  ),
  doc_gate_access_log: document(
    "doc_gate_access_log",
    "堡垒门禁记录",
    "记录门内伪造的维护队返航请求。",
    "地底堡垒外环",
    "门禁在无人返航的时期仍收到来自内侧的维护队请求。所有请求使用相同声纹，却轮流署上失踪人员的姓名。",
  ),
  doc_seal_maintenance_log: document(
    "doc_seal_maintenance_log",
    "封印维护日志",
    "说明黑石门卫是封印维护执行体。",
    "地底堡垒·维护室",
    "黑石门卫并非战斗兵器，而是封印维护核心的外部人格化执行体。重置门卫可使用维护徽章、调律叉、真名协议与净化核心；缺失越多，风险越高。",
  ),
  doc_gatekeeper_protocol: document(
    "doc_gatekeeper_protocol",
    "黑石门卫协议",
    "记载守门者阿格洛恩的真名覆写协议。",
    "地底堡垒·协议碑",
    "协议锁确认：守门者阿格洛恩只服从封印维护职责。真名、誓约与正确调律可以唤回职责记忆，并制造短暂清醒窗口。",
  ),
  doc_laine_testimony: document(
    "doc_laine_testimony",
    "莱因的断续证词",
    "第三远征队幸存者关于伪造命令的证词。",
    "第三远征队营地·莱因",
    "黑石门卫没有背叛。第三远征队把一条来自门内的假维护命令带进堡垒，门卫只是被迫把开门当成守门。",
  ),
  doc_laine_full_testimony: document(
    "doc_laine_full_testimony",
    "莱因的完整证词",
    "包含守门者状态、伪造命令与撤离经过的完整证词。",
    "第三远征队营地·莱因",
    "门卫阿格洛恩始终挡在门前。门内信号使用死者声纹伪造维护队返航命令，逐层覆盖守门协议。第三远征队试图撤回命令失败，队长死前要求后来者先唤醒门卫职责，再处置黑根。",
  ),
  doc_black_cable_last_order: document(
    "doc_black_cable_last_order",
    "黑缆最后命令",
    "记录第三远征队撤离莱因的最后命令。",
    "莱因的黑缆识别牌",
    "最后命令：莱因携维护识别牌撤离；其余队员留守门前，阻止内侧返航指令继续覆盖守门协议。",
  ),
  doc_gatekeeper_protocol_fragment: document(
    "doc_gatekeeper_protocol_fragment",
    "守门者协议残片",
    "莱因记忆中的真名唤醒协议。",
    "莱因证词",
    "守门者阿格洛恩，回到门前。真名不是控制指令，而是唤醒其原始职责的身份确认。",
  ),
};

const CLUES: Record<string, InvestigationClue> = {
  clue_voice_mimic: clue(
    "clue_voice_mimic",
    "拟声菌团会模仿人声",
    "远处求救声可能在确认你是否听见；不要回应，也不要回头。",
    "第三巡逻队记录",
    ["doc_patrol_record_03"],
  ),
  clue_spores_follow_seal_pulse: clue(
    "clue_spores_follow_seal_pulse",
    "孢群受封印脉冲牵引",
    "孢兽并非主动迁徙，而是随着错误的黑石脉冲向外逃亡。",
    "蓝伞浅滩",
  ),
  clue_black_cable_sabotaged: clue(
    "clue_black_cable_sabotaged",
    "黑缆遭到人为破坏",
    "残片上的平行工具纹证明黑缆在战斗前就被人为切断。",
    "蓝伞浅滩·黑缆残片",
  ),
  clue_gatekeeper_not_evil: clue(
    "clue_gatekeeper_not_evil",
    "黑石门卫并非恶意",
    "守门者仍在履行职责，只是被门内伪造的维护命令劫持。",
    "地底堡垒",
    ["doc_expedition_commander_final_log", "doc_seal_maintenance_log"],
  ),
  clue_gate_pulse_forced_open: clue(
    "clue_gate_pulse_forced_open",
    "堡垒正在被迫开门",
    "封印不是自然衰退，而是某个内侧信号正在持续改写开门指令。",
    "骨柱湿地·拟声记忆残片",
  ),
  clue_mimic_voice_pattern: clue(
    "clue_mimic_voice_pattern",
    "拟声群落的重复规律",
    "拟声诱捕每隔固定数息重复一次，可据此判断菌核位置。",
    "骨柱湿地",
  ),
  clue_gatekeeper_order_forged: clue(
    "clue_gatekeeper_order_forged",
    "门卫命令被伪造",
    "第三远征队带入堡垒的返航命令来自门内污染，并非真正维护指令。",
    "莱因证词",
    ["doc_laine_testimony", "doc_laine_full_testimony"],
  ),
  clue_laine_heard_true_name: clue(
    "clue_laine_heard_true_name",
    "莱因听见守门者真名",
    "阿格洛恩不是控制口令，而是让门卫记起守门职责的真名。",
    "莱因证词",
    ["doc_laine_full_testimony"],
  ),
  clue_spore_corruption_reversible: clue(
    "clue_spore_corruption_reversible",
    "早期孢化仍可逆转",
    "莱因仍能回应自己的名字，证明早期意识污染可以被稳定。",
    "莱因伤势判断",
    ["doc_expedition_medical_log"],
  ),
  clue_fortress_side_route: clue(
    "clue_fortress_side_route",
    "堡垒维护侧路",
    "莱因画出的残缺路线仍标明一条避开正门机关的维护侧路。",
    "莱因路线草图",
  ),
  clue_true_name_command: clue(
    "clue_true_name_command",
    "真名协议存在",
    "残缺口令“守门者，回到门前”能够削弱伪造命令。",
    "莱因记忆",
  ),
};

function document(
  id: string,
  name: string,
  summary: string,
  source: string,
  body: string,
): ArchiveDocument {
  return {
    id,
    name,
    type: "document",
    category: "archive",
    rarity: "key",
    icon: "scroll-sealed",
    summary,
    source,
    readable: true,
    content: { title: name, sections: [{ heading: "正文", body }] },
  };
}

function clue(
  id: string,
  name: string,
  description: string,
  source: string,
  relatedDocuments: string[] = [],
): InvestigationClue {
  return {
    id,
    name,
    description,
    source,
    icon: "clue",
    tags: ["地心之门", "后半幕"],
    relatedDocuments,
  };
}

function hasReward(list: unknown, id: string) {
  return (
    Array.isArray(list) &&
    list.some((entry) =>
      typeof entry === "string" ? entry === id : entry?.id === id,
    )
  );
}

function mergeReward<T extends { id: string }>(list: unknown, reward: T): T[] {
  const current = Array.isArray(list) ? [...list] : [];
  return hasReward(current, reward.id) ? current : [...current, reward];
}

function addInventory(inventory: unknown, name: string, amount = 1) {
  const entries = String(inventory || "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
  for (let i = 0; i < amount; i += 1) entries.push(name);
  return entries.join(",");
}

function addItemPatch(
  state: GameState,
  patch: GameState,
  name: string,
  amount = 1,
) {
  patch.inventory = addInventory(
    patch.inventory ?? state.inventory,
    name,
    amount,
  );
}

function addDocumentPatch(state: GameState, patch: GameState, id: string) {
  const doc = DOCUMENTS[id];
  if (doc)
    patch.documents = mergeReward(patch.documents ?? state.documents, doc);
}

function addCluePatch(state: GameState, patch: GameState, id: string) {
  const reward = CLUES[id];
  if (reward) {
    patch.clues = mergeReward(patch.clues ?? state.clues, reward);
    patch.flags = { ...(patch.flags ?? state.flags ?? {}), [id]: true };
    patch[id] = true;
  }
}

function setStoryFlag(
  state: GameState,
  patch: GameState,
  key: string,
  value = true,
) {
  patch.flags = {
    ...(state.flags || {}),
    ...(patch.flags || {}),
    [key]: value,
  };
  patch[key] = value;
}

function adjustScore(
  state: GameState,
  patch: GameState,
  key: string,
  delta: number,
) {
  patch[key] = Number(patch[key] ?? state[key] ?? 0) + delta;
}

function adjustLaineRelationship(
  state: GameState,
  patch: GameState,
  delta: number,
) {
  const relationships = {
    ...(state.relationships || {}),
    ...(patch.relationships || {}),
  };
  relationships.laine = Math.max(
    0,
    Math.min(100, Number(relationships.laine ?? 30) + delta),
  );
  patch.relationships = relationships;
}

function removeInventoryItem(inventory: unknown, name: string) {
  const entries = String(inventory || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const index = entries.findIndex((value) => value === name);
  if (index >= 0) entries.splice(index, 1);
  return entries.join(",");
}

function hasUsablePurificationHeart(state: GameState) {
  return Boolean(
    !state.purification_heart_used_on_laine &&
    (
      state.purification_heart_owned ||
      state.yunling_purification_heart_bought ||
      String(state.inventory || "").split(",").some((item) => item.trim() === "净化之心")
    ),
  );
}

function trust(
  state: GameState,
  patch: GameState,
  companion: "serin" | "ailin" | "brock" | "kaiya",
  delta: number,
) {
  const base = { ...state, ...patch };
  Object.assign(
    patch,
    buildTrustPatch(base, {
      [companion]: Math.max(
        0,
        Math.min(100, getCompanionTrust(base, companion) + delta),
      ),
    }),
  );
}

function outcome(state: GameState, action: string): PostBlueShoalOutcome {
  if (!/【[^】]*DC\s*\d+[^】]*】/i.test(action)) return "success";
  const check = state.lastStoryCheckResult;
  const roll = check?.finalRoll;
  if (!roll) return "success";
  if (roll.d20 === 1) return "critical";
  if (roll.d20 === 20 || roll.total >= check.dc + 5) return "great";
  if (roll.total >= check.dc) return "success";
  if (roll.total >= check.dc - 3) return "partial";
  return "failure";
}

function markAction(
  state: GameState,
  patch: GameState,
  id: string,
  counter?: string,
) {
  patch[`postAction_${id}`] = true;
  if (counter) patch[counter] = Number(state[counter] || 0) + 1;
}

function completed(state: GameState, id: string) {
  return Boolean(state[`postAction_${id}`]);
}

const checked = (label: string, skill: string, dc: number) =>
  `${label}【${skill}DC${dc}】`;

export function getPostBlueShoalHints(
  state: GameState,
  nodeId = String(state.currentNodeId || ""),
): string[] | null {
  nodeId = normalizePostBlueShoalNodeId(nodeId);
  const available = (defs: Array<[string, string]>, leave?: string) => {
    const hints = defs.map(([, label]) => label);
    if (leave) hints.push(leave);
    return hints;
  };
  switch (nodeId) {
    case POST_BLUE_SHOAL_IDS.aftermath:
      return available(
        [
          [
            "inspect_spore_beast_body",
            checked("检查孢兽尸体，判断它们为何聚集", "生态", 12),
          ],
          [
            "inspect_severed_black_cable",
            checked("检查被人为切断的黑缆残片", "观察", 10),
          ],
          [
            "track_abnormal_glow",
            checked("追踪浅滩深处的异常蓝光", "感知", 14),
          ],
          [
            "collect_blue_cap_fungus",
            checked("采集尚未腐化的蓝伞菌盖", "生态", 11),
          ],
          ["ask_companion_judgement", "询问伙伴对异常的判断"],
        ],
        "离开蓝伞浅滩，继续向骨柱湿地前进",
      );
    case POST_BLUE_SHOAL_IDS.route:
      return [
        checked("沿尼布留下的发光桩道前进", "观察", 10),
        checked("从矮人旧排水渠绕入湿地", "敏捷", 13),
        checked("沿菌毯脊线观察孢群迁徙", "生态", 13),
        checked("借助断裂秘银缆索横穿裂隙", "力量", 14),
      ];
    case POST_BLUE_SHOAL_IDS.boneInvestigation:
      return available(
        [
          ["rubbing_bone_pillar", "拓印骨柱上的黑石铭文"],
          ["resist_mimic_voice", "判断远处求救声是真是假"],
          [
            "collect_marsh_spores",
            checked("采集骨柱根部的活性孢子", "生态", 12),
          ],
          ["seal_fungal_nest", checked("封闭菌巢通气孔，让它休眠", "生态", 14)],
          ["burn_fungal_nest", checked("直接焚烧菌巢，快速清路", "奥秘", 12)],
          ["avoid_fungal_nest", checked("不冒险处理，绕开菌巢", "敏捷", 12)],
        ],
        "结束调查，继续前进",
      );
    case POST_BLUE_SHOAL_IDS.boneAftermath:
      return available([
        [
          "inspect_bone_spore_core",
          "检查战场留下的骨孢核心",
        ],
        [
          "record_fallen_voice",
          "记录拟声菌团最后模仿的士兵遗言",
        ],
      ]).concat("进入第三远征队营地");
    case POST_BLUE_SHOAL_IDS.camp:
      return available(
        [
          [
            "search_command_tent",
            "搜索远征队长的指挥帐篷",
          ],
          [
            "search_medical_tent",
            "检查医疗帐篷和用药记录",
          ],
          ["search_map_table", "查看被石块压住的堡垒地图"],
          [
            "open_expedition_lockbox",
            checked("打开远征队留下的封蜡锁箱", "敏捷", 14),
          ],
          [
            "repair_expedition_communicator",
            checked("修复损坏的远征队通讯器", "奥秘", 15),
          ],
          [
            "bury_expedition_dead",
            "协助艾琳安葬远征队遗骸",
          ],
        ],
        "结束营地调查，检查岩棚里的金属声",
      );
    case POST_BLUE_SHOAL_IDS.laineSurvivor:
      return [
        "使用云苓的净化之心解救莱因",
        "不救莱因，继续前进",
      ];
    case POST_BLUE_SHOAL_IDS.laineDecision: {
      if (!state.purification_heart_used_on_laine || !state.laine_stabilized) {
        return ["无法稳定莱因，继续前进"];
      }
      return [
        checked("让莱因画出地底堡垒内部路线", "交涉/观察", 13),
        checked("追问莱因：黑石门卫是否有真名或协议口令", "交涉/奥秘", 15),
      ];
    }
    case POST_BLUE_SHOAL_IDS.campNight: {
      if (state.laine_alive && !state.laine_left_behind) {
        return [
          "告诉莱因：你会亲自走到门前",
          "请莱因把知道的一切都告诉你",
          "告诉莱因：我们会用最安全的办法结束这一切",
          "告诉莱因：若必须有人留下，我们不会逃避",
        ];
      }
      return [
        "与艾琳谈谈她为何成为修女",
        "与布洛克核对活性孢子样本",
        "与凯娅谈谈她为什么愿意跟来",
        "与瑟琳讨论逆钟学派和封印",
      ];
    }
    case POST_BLUE_SHOAL_IDS.fortressOuter: {
      const hints: string[] = [];
      if (state.laine_stabilized && !state.laine_left_behind)
        hints.push(checked("使用莱因的黑缆口令通过门禁", "交涉", 11));
      if (
        /莱因的黑缆识别牌|损坏的莱因黑缆识别牌/.test(
          String(state.inventory || ""),
        )
      )
        hints.push(checked("使用莱因的黑缆识别牌接近门禁", "交涉/奥秘", 12));
      if (/黑缆守卫徽章/.test(String(state.inventory || "")))
        hints.push(checked("使用黑缆守卫徽章接近正门门禁", "魅力", 13));
      if (/地底堡垒入口残图/.test(String(state.inventory || "")))
        hints.push(checked("根据堡垒入口残图寻找维护井", "调查", 12));
      hints.push(
        checked("让凯娅破解外墙旧锁", "敏捷", 15),
        checked("沿外墙寻找自然裂缝", "观察", 13),
        checked("强行破开外墙菌丝", "力量", 14),
      );
      return hints;
    }
    case POST_BLUE_SHOAL_IDS.fortressInner: {
      const investigations: Array<[string, string]> = [
          [
            "investigate_seal_maintenance_room",
            checked("调查封印维护室", "奥秘", 13),
          ],
          [
            "read_gatekeeper_protocol",
            checked("读取破损的黑石门卫协议", "奥秘", 14),
          ],
          ["enter_old_armory", checked("进入旧军械库寻找补给", "调查", 12)],
          ["watch_hero_oath_memory", checked("触碰三英雄誓约残影", "宗教", 13)],
        ];
      // 只有净化之心成功救回莱因后，玩家才知道门卫核心也可以被净化。
      if (state.purification_heart_used_on_laine && state.core_purification_known) {
        investigations.push([
            "purify_blackstone_core",
            checked("净化一枚被污染的黑石核心", "宗教", 15),
        ]);
      }
      return available(investigations, "结束调查，前往封印控制大厅");
    }
    case POST_BLUE_SHOAL_IDS.sealChamber:
      return available([
        [
          "compare_forged_command",
          checked("比对伪造命令与远征队日志", "奥秘", 13),
        ],
        [
          "sense_gatekeeper_mind",
          checked("让艾琳判断守门者是否仍有意识", "宗教", 13),
        ],
      ]).concat("接近守门者，寻找最后一次战前准备机会");
    case POST_BLUE_SHOAL_IDS.afterBoss:
      return ["继续到最终处置选择"];
    case POST_BLUE_SHOAL_IDS.finalChoice:
      // 调查评分、证据数量、检定结果均无权改变结局；但“稳定核心”必须先用
      // 云苓的净化之心救回莱因，并从他的证词中得知核心可以被净化。
      return ["稳定 Boss 核心", "破坏 Boss 核心"];
    case POST_BLUE_SHOAL_IDS.epilogue:
      return ["结束第一幕"];
    default:
      if (
        nodeId === POST_BLUE_SHOAL_IDS.endingA ||
        nodeId === POST_BLUE_SHOAL_IDS.endingB ||
        nodeId === POST_BLUE_SHOAL_IDS.endingC ||
        nodeId === POST_BLUE_SHOAL_IDS.endingD
      ) return ["穿过黑暗之门"];
      return null;
  }
}

export interface PostBlueShoalHintState {
  disabled: boolean;
  reason?: string;
}

const POST_BLUE_SHOAL_EXIT_RULES: Record<
  string,
  { counter: string; minimum: number; pattern: RegExp }
> = {
  [POST_BLUE_SHOAL_IDS.aftermath]: {
    counter: "blueShoalInvestigationActions",
    minimum: 2,
    pattern: /离开蓝伞浅滩|向骨柱湿地前进/,
  },
  [POST_BLUE_SHOAL_IDS.boneInvestigation]: {
    counter: "boneMarshActions",
    minimum: 2,
    pattern: /结束调查|继续前进/,
  },
  [POST_BLUE_SHOAL_IDS.camp]: {
    counter: "expeditionCampActions",
    minimum: 3,
    pattern: /结束营地调查|岩棚.*金属声/,
  },
  [POST_BLUE_SHOAL_IDS.fortressInner]: {
    counter: "fortressInnerActions",
    minimum: 3,
    pattern: /结束调查|封印控制大厅/,
  },
};

export function getPostBlueShoalHintState(
  state: GameState,
  hint: string,
  nodeId = String(state.currentNodeId || ""),
): PostBlueShoalHintState {
  const node = normalizePostBlueShoalNodeId(nodeId);
  if (
    node === POST_BLUE_SHOAL_IDS.laineSurvivor &&
    /净化之心.*解救莱因/.test(hint) &&
    !hasUsablePurificationHeart(state)
  ) {
    return { disabled: true, reason: "需要先在云苓商店购买并持有净化之心" };
  }
  if (
    node === POST_BLUE_SHOAL_IDS.finalChoice &&
    /稳定.*Boss.*核心|稳定.*核心/.test(hint)
  ) {
    const canStabilize = Boolean(
      state.purification_heart_used_on_laine &&
      state.core_purification_known &&
      state.laine_alive &&
      state.laine_stabilized &&
      !state.laine_left_behind,
    );
    if (!canStabilize) {
      return {
        disabled: true,
        reason: "必须先用净化之心救下莱因，并从证词中得知核心可以被净化",
      };
    }
  }
  const exitRule = POST_BLUE_SHOAL_EXIT_RULES[node];
  if (exitRule?.pattern.test(hint)) {
    const current = Number(state[exitRule.counter] || 0);
    if (current < exitRule.minimum) {
      return {
        disabled: true,
        reason: `至少完成 ${exitRule.minimum} 次调查后可推进（当前 ${current}/${exitRule.minimum}）`,
      };
    }
    return { disabled: false };
  }

  const actionId = matchActionId(node, hint);
  if (actionId && completed(state, actionId)) {
    return { disabled: true, reason: "已完成" };
  }
  return { disabled: false };
}

export function getBoneMarshPrepActions() {
  return [
    prep(
      "pre_bone_take_high_ground",
      checked("占据骨柱高点，抢先建立视野", "敏捷", 13),
      "dex",
      13,
      { playerInitiativeBonus: 2 },
    ),
    prep(
      "pre_bone_purify_spores",
      checked("协助艾琳净化周围孢尘", "宗教", 13),
      "wis",
      13,
      { sporeResistanceRounds: 2 },
    ),
    prep(
      "pre_bone_brock_bait",
      checked("让布洛克布置菌囊诱饵", "生态", 12),
      "int",
      12,
      { enemyVulnerableFirstRound: true },
    ),
    prep(
      "pre_bone_kaia_trap",
      checked("让凯娅拆除骨柱间的菌丝陷阱", "敏捷", 14),
      "dex",
      14,
      { disableEnemySkillFirstRound: ["entangle"] },
    ),
    prep(
      "pre_bone_serin_pulse",
      checked("协助瑟琳读取黑石脉冲节奏", "奥秘", 14),
      "int",
      14,
      { enemyAcPenalty: 1 },
    ),
  ];
}

export function getGatekeeperPrepActions(state: GameState) {
  const actions = [];
  if (state.laine_alive && state.laine_stabilized && !state.laine_left_behind) {
    actions.push(
      prep(
        "laine_call_gatekeeper",
        checked("让莱因呼唤黑石门卫，证明它仍记得守门职责", "交涉/意志", 15),
        "cha",
        15,
        { enemyDamagePercentPenalty: 15, enemyDamagePenaltyRounds: 2 },
        {
          great: {
            flags: {
              laine_call_gatekeeper_great: true,
              ending_A_guaranteed: true,
            },
            scoreDeltas: { guardian_mercy_score: 3 },
            battleEffects: { skipEnemyStrongAttackFirstPhase: true },
          },
          success: {
            flags: { laine_call_gatekeeper_success: true },
            scoreDeltas: { guardian_mercy_score: 2 },
          },
          fail: { flags: { laine_spore_worsened: true } },
        },
      ),
    );
  }
  if (
    /莱因的黑缆识别牌|损坏的莱因黑缆识别牌/.test(String(state.inventory || ""))
  ) {
    actions.push(
      prep(
        "use_laine_badge_override",
        checked("使用莱因的黑缆识别牌尝试覆盖伪造命令", "奥秘/敏捷", 14),
        "int",
        14,
        { enemyShieldPercentPenalty: 30 },
        {
          great: {
            flags: { laine_badge_override_great: true },
            scoreDeltas: { black_root_decisive_score: 2 },
            battleEffects: { removeEnemyOuterShield: true },
          },
          success: {
            flags: { laine_badge_override_success: true },
            scoreDeltas: {
              black_root_decisive_score: 1,
              guardian_mercy_score: 1,
            },
          },
          fail: {
            flags: { laine_badge_override_failed: true },
            scoreDeltas: { forced_seal_score: 1 },
          },
        },
      ),
    );
  }
  if (
    state.reverse_clock_method_known &&
    (state.laine_full_testimony_obtained ||
      /莱因的染血护手|莱因的记忆残片/.test(String(state.inventory || "")))
  ) {
    actions.push(
      prep(
        "use_laine_memory_anchor",
        checked("以莱因关于门卫失控前的记忆作为逆钟锚点", "奥秘", 16),
        "int",
        16,
        { cancelEnrage: true },
        {
          great: {
            flags: {
              laine_memory_anchor_great: true,
              ending_unlocked_reverse_clock_anchor: true,
            },
            statePatch: {
              reverse_clock_anchor_ready: true,
              laine_memory_anchor_obtained: true,
            },
            scoreDeltas: {
              reverse_clock_anchor_score: 3,
              reverseClockScore: 2,
            },
            trustDeltas: { serin: 5 },
            battleEffects: { cancelEnrage: true },
          },
          success: {
            flags: {
              laine_memory_anchor_success: true,
              ending_unlocked_reverse_clock_anchor: true,
            },
            statePatch: {
              reverse_clock_anchor_ready: true,
              laine_memory_anchor_obtained: true,
            },
            scoreDeltas: {
              reverse_clock_anchor_score: 2,
              reverseClockScore: 1,
            },
            battleEffects: { enrageDamagePenalty: 0.5 },
          },
          fail: {
            flags: { laine_memory_anchor_unstable: true },
            scoreDeltas: { reverse_clock_anchor_score: 1 },
          },
        },
      ),
    );
  }
  if (/黑石调律叉/.test(String(state.inventory || "")))
    actions.push(
      prep(
        "pre_gatekeeper_tuning_fork",
        checked("用黑石调律叉校准封印脉冲", "奥秘", 14),
        "int",
        14,
        { enemyAcPenalty: 2 },
      ),
    );
  if (
    state.gatekeeper_true_name_known ||
    hasReward(state.documents, "doc_gatekeeper_protocol")
  )
    actions.push(
      prep(
        "pre_gatekeeper_true_name",
        checked("呼唤守门者真名“阿格洛恩”", "魅力", 15),
        "cha",
        15,
        { enemyInitiativePenalty: 2 },
      ),
    );
  actions.push(
    prep(
      "pre_gatekeeper_break_black_root",
      checked("破坏连接门卫背后的黑根中继", "力量", 15),
      "str",
      15,
      { disableEnemySkillFirstRound: ["summon"] },
    ),
  );
  if (/净化黑石核心|不稳定净化核心/.test(String(state.inventory || "")))
    actions.push(
      prep(
        "pre_gatekeeper_purified_core",
        checked("将净化黑石核心布置到封印阵边缘", "宗教", 14),
        "wis",
        14,
        { enemyDamagePenalty: 1 },
      ),
    );
  if (canUnlockReverseEnding(state))
    actions.push(
      prep(
        "pre_gatekeeper_reverse_clock_anchor",
        checked("协助瑟琳布置逆钟锚定阵", "奥秘", 15),
        "int",
        15,
        { cancelEnrage: true },
      ),
    );
  return actions;
}

function prep(
  id: string,
  label: string,
  attribute: "str" | "dex" | "int" | "wis" | "cha",
  dc: number,
  battleEffects: Record<string, any>,
  storyEffects: {
    success?: Record<string, any>;
    great?: Record<string, any>;
    fail?: Record<string, any>;
  } = {},
) {
  const effect = (flag: string, extra: Record<string, any> = {}) => ({
    ...extra,
    flags: { [flag]: true, ...(extra.flags || {}) },
    battleEffects: { ...battleEffects, ...(extra.battleEffects || {}) },
  });
  return {
    id,
    label,
    type: "battlePrep" as const,
    canUseRerollItems: true,
    desc: label,
    check: {
      skill: label.match(/【(.+?)DC/)?.[1] || "观察",
      dc,
      label,
      attribute,
    },
    successText: "准备行动成功，为接下来的战斗争取到优势。",
    greatSuccessText: "准备行动取得了超出预期的效果。",
    failText: "准备行动未能完全生效，但战斗仍会继续。",
    successEffect: effect(id, storyEffects.success),
    greatSuccessEffect: effect(id, storyEffects.great || storyEffects.success),
    failEffect: effect(`${id}_failed`, storyEffects.fail),
  };
}

export function getLaineEndingScores(state: GameState) {
  const inventory = String(state.inventory || "");
  const laineScore =
    Number(Boolean(state.laine_alive && state.laine_stabilized)) +
    Number(
      Boolean(
        state.laine_full_testimony_obtained ||
        hasReward(state.documents, "doc_laine_full_testimony"),
      ),
    ) +
    Number(Boolean(state.laine_knows_gatekeeper_name)) +
    Number(/莱因的黑缆识别牌|莱因的识别牌/.test(inventory));
  const truthScore =
    Number(state.truthScore || 0) +
    Number(state.expedition_truth_level || 0) +
    Number(state.expedition_truth_piece_count || 0) +
    Number(hasReward(state.documents, "doc_laine_testimony")) +
    Number(hasReward(state.documents, "doc_laine_full_testimony")) +
    Number(hasReward(state.clues, "clue_gatekeeper_order_forged"));
  const mercyScore =
    Number(state.mercyScore || 0) +
    Number(Boolean(state.laine_stabilized)) +
    Number(getCompanionTrust(state, "ailin") >= 60) +
    Number(!state.bone_marsh_nest_burned);
  const sealScore =
    Number(state.sealScore || 0) +
    Number(hasReward(state.documents, "doc_seal_maintenance_log")) +
    Number(hasReward(state.documents, "doc_gatekeeper_protocol")) +
    Number(
      Boolean(state.guardian_protocol_known || state.gatekeeper_protocol_found),
    ) +
    Number(/黑石调律叉/.test(inventory)) +
    Number(/净化黑石核心/.test(inventory)) +
    Number(
      Boolean(
        state.guardian_name_known ||
        state.gatekeeper_true_name_known ||
        state.laine_knows_gatekeeper_name,
      ),
    );
  const combatPrepScore =
    Number(state.combatPrepScore || 0) +
    Number(state.black_root_decisive_score || 0) +
    Number(state.guardian_mercy_score || 0);
  const reverseClockScore =
    Number(state.reverseClockScore || 0) +
    Number(Boolean(state.reverse_clock_method_known)) +
    Number(getCompanionTrust(state, "serin") >= 60) +
    Number(/逆钟粉笔/.test(inventory)) +
    Number(
      Boolean(
        state.laine_full_testimony_obtained ||
        /莱因的染血护手|莱因的记忆锚点|莱因的记忆残片/.test(inventory),
      ),
    ) +
    Number(state.reverse_clock_anchor_score || 0);
  return {
    laineScore,
    truthScore,
    mercyScore,
    sealScore,
    combatPrepScore,
    reverseClockScore,
  };
}

function canUnlockReverseEnding(state: GameState) {
  const inventory = String(state.inventory || "");
  const { reverseClockScore } = getLaineEndingScores(state);
  const guardianNameKnown = Boolean(
    state.guardian_name_known ||
    state.gatekeeper_true_name_known ||
    state.laine_knows_gatekeeper_name,
  );
  const hasAnchor =
    /莱因的记忆锚点|莱因的记忆残片|莱因的染血护手/.test(inventory) ||
    state.laine_memory_anchor_obtained;
  return Boolean(
    state.ending_unlocked_reverse_clock_anchor ||
    state.flags?.ending_unlocked_reverse_clock_anchor ||
    (state.reverse_clock_anchor_ready &&
      hasAnchor &&
      guardianNameKnown &&
      reverseClockScore >= 3) ||
    (hasAnchor && guardianNameKnown && reverseClockScore >= 4),
  );
}

const OUTCOME_TEXT: Record<PostBlueShoalOutcome, string> = {
  great: "检定大成功。你不仅完成了行动，还发现了额外的关键细节。",
  success: "检定成功。行动顺利完成，可靠的线索被记录下来。",
  partial: "检定部分成功。你达成了目标，但付出了一点代价。",
  failure:
    "检定失败。主要目标没能完全达成，不过队伍仍获得了足以继续前进的保底信息。",
  critical: "检定大失败。现场危险突然升级，队伍只能在损失扩大前撤开。",
};

/**
 * 剧情领域层的分支状态计算。骰子、重投、场景播放与持久化仍全部走 App 现有管线；
 * 这里与现有 buildLainChoicePatch/buildSerinCrackPatch 一样，只返回确定性的本地 patch。
 */
export function resolvePostBlueShoalAction(
  state: GameState,
  action: string,
): PostBlueShoalResolution | null {
  const node = normalizePostBlueShoalNodeId(String(state.currentNodeId || ""));
  if (!getPostBlueShoalHints(state, node)) return null;

  const transition = (
    nextSceneId: string,
    lines: string[] = [],
    patch: GameState = {},
  ): PostBlueShoalResolution => ({ patch, lines, nextSceneId });
  const fixedTransition = (
    nextSceneId: string,
    patch: GameState = {},
  ): PostBlueShoalResolution => ({
    patch,
    lines: [],
    nextSceneId,
    skipAiNarration: true,
  });
  if (
    node === POST_BLUE_SHOAL_IDS.aftermath &&
    /离开蓝伞浅滩|向骨柱湿地/.test(action)
  ) {
    const patch: GameState = {};
    advanceQuest(state, patch, "选择路线并进入骨柱湿地", "调查蓝伞浅滩战场");
    return fixedTransition(POST_BLUE_SHOAL_IDS.route, patch);
  }
  if (
    node === POST_BLUE_SHOAL_IDS.boneInvestigation &&
    /结束调查|继续前进/.test(action)
  ) {
    const patch: GameState = {};
    advanceQuest(state, patch, "穿过骨柱湿地伏击", "调查骨柱湿地");
    return fixedTransition(POST_BLUE_SHOAL_IDS.bonePrebattle, patch);
  }
  if (
    node === POST_BLUE_SHOAL_IDS.boneAftermath &&
    /第三远征队营地/.test(action)
  ) {
    const patch: GameState = {};
    addCluePatch(state, patch, "clue_gate_pulse_forced_open");
    if (state.bone_marsh_mimic_resisted)
      addCluePatch(state, patch, "clue_mimic_voice_pattern");
    if (state.bone_marsh_nest_sealed) trust(state, patch, "brock", 3);
    if (state.bone_marsh_nest_burned) trust(state, patch, "brock", -2);
    advanceQuest(state, patch, "调查第三远征队营地", "穿过骨柱湿地");
    return fixedTransition(POST_BLUE_SHOAL_IDS.camp, patch);
  }
  if (
    node === POST_BLUE_SHOAL_IDS.camp &&
    /结束营地调查|岩棚.*金属声/.test(action)
  ) {
    const patch: GameState = {
      relationships: {
        ...(state.relationships || {}),
        laine: Number(state.relationships?.laine ?? 30),
      },
    };
    setStoryFlag(state, patch, "laine_found");
    setStoryFlag(state, patch, "laine_alive");
    advanceQuest(state, patch, "确认莱因的伤势与证词", "调查第三远征队营地");
    return fixedTransition(POST_BLUE_SHOAL_IDS.laineSurvivor, patch);
  }
  if (
    node === POST_BLUE_SHOAL_IDS.fortressInner &&
    /结束调查|封印控制大厅/.test(action)
  ) {
    const patch: GameState = {};
    advanceQuest(state, patch, "进入封印控制大厅", "调查地底堡垒内环");
    return fixedTransition(POST_BLUE_SHOAL_IDS.sealChamber, patch);
  }
  if (
    node === POST_BLUE_SHOAL_IDS.sealChamber &&
    /接近守门者|战前准备/.test(action)
  ) {
    const patch: GameState = {};
    advanceQuest(
      state,
      patch,
      "压制黑石门卫，阻止错误命令开门",
      "确认守门者被伪造命令劫持",
    );
    return fixedTransition(POST_BLUE_SHOAL_IDS.bossPrebattle, patch);
  }
  if (
    node === POST_BLUE_SHOAL_IDS.afterBoss &&
    /继续|最终|处置|选择/.test(action)
  )
    return fixedTransition(POST_BLUE_SHOAL_IDS.finalChoice);
  if (
    (
      node === POST_BLUE_SHOAL_IDS.endingA ||
      node === POST_BLUE_SHOAL_IDS.endingB ||
      node === POST_BLUE_SHOAL_IDS.endingC ||
      node === POST_BLUE_SHOAL_IDS.endingD
    ) &&
    /穿过.*黑暗之门|进入.*门后/.test(action)
  )
    return fixedTransition(POST_BLUE_SHOAL_IDS.epilogue);
  if (node === POST_BLUE_SHOAL_IDS.epilogue && /结束第一幕/.test(action))
    return fixedTransition(POST_BLUE_SHOAL_IDS.complete);

  const id = matchActionId(node, action);
  if (!id || completed(state, id)) return null;
  const result = outcome(state, action);
  const patch: GameState = { flags: { ...(state.flags || {}) } };
  const lines = /【[^】]*DC\s*\d+[^】]*】/i.test(action)
    ? [OUTCOME_TEXT[result]]
    : [];

  if (node === POST_BLUE_SHOAL_IDS.aftermath) {
    markAction(state, patch, id, "blueShoalInvestigationActions");
    resolveBlueShoalInvestigation(state, patch, lines, id, result);
  } else if (node === POST_BLUE_SHOAL_IDS.route) {
    resolveBoneRoute(state, patch, lines, id, result);
    advanceQuest(state, patch, "调查骨柱湿地", "选择进入骨柱湿地的路线");
    return transition(POST_BLUE_SHOAL_IDS.boneInvestigation, lines, patch);
  } else if (node === POST_BLUE_SHOAL_IDS.boneInvestigation) {
    markAction(state, patch, id, "boneMarshActions");
    resolveBoneInvestigation(state, patch, lines, id, result);
  } else if (node === POST_BLUE_SHOAL_IDS.boneAftermath) {
    markAction(state, patch, id);
    if (id === "inspect_bone_spore_core") {
      addItemPatch(state, patch, "骨孢核心");
      if (result === "great" || result === "success")
        addCluePatch(state, patch, "clue_mimic_voice_pattern");
      lines.push(
        "骨孢核心的脉动与堡垒方向完全同步，其中还残留着被反复覆盖的人声节律。",
      );
    } else {
      addCluePatch(state, patch, "clue_gate_pulse_forced_open");
      lines.push(
        "“门不是从外面开的”被逐字记录下来，成为之后判断封印异常的保底证词。",
      );
    }
  } else if (node === POST_BLUE_SHOAL_IDS.camp) {
    markAction(state, patch, id, "expeditionCampActions");
    resolveCampInvestigation(state, patch, lines, id, result);
  } else if (node === POST_BLUE_SHOAL_IDS.laineSurvivor) {
    resolveLaineApproach(state, patch, lines, id, result);
    if (id === "leave_laine_without_purification_heart") {
      advanceQuest(
        state,
        patch,
        "在夜火旁与一名伙伴交谈",
        "未能解救莱因，继续远征",
      );
      return fixedTransition(POST_BLUE_SHOAL_IDS.campNight, patch);
    }
    advanceQuest(
      state,
      patch,
      "决定如何安置莱因并取得堡垒情报",
      "发现第三远征队幸存者莱因",
    );
    return fixedTransition(POST_BLUE_SHOAL_IDS.laineDecision, patch);
  } else if (node === POST_BLUE_SHOAL_IDS.laineDecision) {
    resolveLaineDecision(state, patch, lines, id, result);
    advanceQuest(
      state,
      patch,
      "在夜火旁与一名伙伴交谈",
      "取得莱因的证词或替代线索",
    );
    return transition(POST_BLUE_SHOAL_IDS.campNight, lines, patch);
  } else if (node === POST_BLUE_SHOAL_IDS.campNight) {
    markAction(state, patch, id);
    resolveCampNight(state, patch, lines, id);
    advanceQuest(state, patch, "进入地底堡垒外环", "完成营地夜谈");
    return transition(POST_BLUE_SHOAL_IDS.fortressOuter, lines, patch);
  } else if (node === POST_BLUE_SHOAL_IDS.fortressOuter) {
    resolveFortressEntry(state, patch, lines, id, result);
    advanceQuest(state, patch, "调查地底堡垒内环", "突破地底堡垒门禁");
    return transition(POST_BLUE_SHOAL_IDS.fortressInner, lines, patch);
  } else if (node === POST_BLUE_SHOAL_IDS.fortressInner) {
    markAction(state, patch, id, "fortressInnerActions");
    resolveFortressInvestigation(state, patch, lines, id, result);
  } else if (node === POST_BLUE_SHOAL_IDS.sealChamber) {
    markAction(state, patch, id);
    if (id === "compare_forged_command") {
      patch.gatekeeper_command_understood = true;
      setStoryFlag(state, patch, "black_root_core_exposed");
      setStoryFlag(state, patch, "guardian_protocol_known");
      adjustScore(state, patch, "truthScore", 1);
      adjustScore(state, patch, "combatPrepScore", 1);
      addItemPatch(state, patch, "黑根样本");
      addCluePatch(state, patch, "clue_gatekeeper_not_evil");
      lines.push(
        "伪造命令沿用了维护协议的格式，却把“封闭通道”替换成了“迎接返航”。污染藏在一个被调换的动词里。",
      );
    } else {
      patch.gatekeeper_consciousness_confirmed =
        result !== "failure" && result !== "critical";
      if (patch.gatekeeper_consciousness_confirmed) {
        setStoryFlag(state, patch, "guardian_mercy_understood");
        adjustScore(state, patch, "mercyScore", 1);
      }
      trust(
        state,
        patch,
        "ailin",
        patch.gatekeeper_consciousness_confirmed ? 3 : 1,
      );
      lines.push(
        "艾琳确认门卫核心深处仍有抵抗：它每一次挥刀前，都在用另一只手压住正在扩大的门缝。",
      );
    }
  } else if (node === POST_BLUE_SHOAL_IDS.finalChoice) {
    const endingId = resolveEnding(state, patch, id);
    return fixedTransition(endingId, patch);
  } else {
    return null;
  }

  patch.last_event = `${id}：${result}`;
  return { patch, lines };
}

function matchActionId(node: string, action: string): string | null {
  const groups: Record<string, Array<[string, RegExp]>> = {
    [POST_BLUE_SHOAL_IDS.aftermath]: [
      ["inspect_spore_beast_body", /检查孢兽尸体/],
      ["inspect_severed_black_cable", /检查.*黑缆残片|人为切断.*黑缆/],
      ["track_abnormal_glow", /追踪.*异常蓝光/],
      ["collect_blue_cap_fungus", /采集.*蓝伞菌盖/],
      ["ask_companion_judgement", /询问伙伴/],
    ],
    [POST_BLUE_SHOAL_IDS.route]: [
      ["route_marked_stakes", /发光桩道/],
      ["route_dwarf_drain", /旧排水渠/],
      ["route_fungal_ridge", /菌毯脊线/],
      ["route_broken_cable", /秘银缆索|断裂.*缆索/],
    ],
    [POST_BLUE_SHOAL_IDS.boneInvestigation]: [
      ["rubbing_bone_pillar", /拓印骨柱/],
      ["resist_mimic_voice", /求救声.*真假/],
      ["collect_marsh_spores", /采集骨柱.*活性孢子/],
      ["seal_fungal_nest", /封闭菌巢/],
      ["burn_fungal_nest", /焚烧菌巢/],
      ["avoid_fungal_nest", /绕开菌巢/],
    ],
    [POST_BLUE_SHOAL_IDS.boneAftermath]: [
      ["inspect_bone_spore_core", /检查.*骨孢核心/],
      ["record_fallen_voice", /记录.*士兵遗言/],
    ],
    [POST_BLUE_SHOAL_IDS.camp]: [
      ["search_command_tent", /指挥帐篷/],
      ["search_medical_tent", /医疗帐篷|用药记录/],
      ["search_map_table", /堡垒地图/],
      ["open_expedition_lockbox", /封蜡锁箱/],
      ["repair_expedition_communicator", /修复.*通讯器/],
      ["bury_expedition_dead", /安葬远征队/],
    ],
    [POST_BLUE_SHOAL_IDS.laineSurvivor]: [
      ["save_laine_with_purification_heart", /使用.*净化之心.*解救莱因/],
      ["leave_laine_without_purification_heart", /不救莱因|放弃使用净化之心|没有净化之心|无法解救莱因/],
    ],
    [POST_BLUE_SHOAL_IDS.laineDecision]: [
      ["use_materials_to_stabilize_laine", /白枝烛芯和蓝伞菌盖稳定莱因/],
      ["ask_laine_draw_fortress_route", /莱因画出.*堡垒.*路线/],
      ["ask_laine_gatekeeper_true_name", /追问莱因.*真名|协议口令/],
      ["leave_laine_behind", /不带莱因继续前进/],
      ["mercy_kill_laine", /最后的仁慈/],
    ],
    [POST_BLUE_SHOAL_IDS.campNight]: [
      ["night_talk_eileen", /艾琳.*为何成为修女/],
      ["night_talk_brock", /布洛克.*活性孢子/],
      ["night_talk_kaia", /凯娅.*为什么愿意/],
      ["night_talk_serin", /瑟琳.*逆钟|逆钟学派/],
      ["night_laine_walk_to_gate", /莱因.*亲自走到门前|你会亲自走到门前/],
      ["night_laine_full_truth", /莱因.*知道的一切|一切都告诉/],
      ["night_laine_safe_end", /最安全的办法结束/],
      ["night_laine_accept_sacrifice", /必须有人留下|不会逃避/],
    ],
    [POST_BLUE_SHOAL_IDS.fortressOuter]: [
      ["enter_laine_password", /莱因的黑缆口令/],
      ["enter_with_laine_badge", /莱因的黑缆识别牌/],
      ["enter_with_black_cable_badge", /黑缆守卫徽章/],
      ["enter_maintenance_well", /入口残图.*维护井|维护井/],
      ["enter_kaia_lock", /凯娅.*外墙旧锁/],
      ["enter_outer_crack", /外墙.*自然裂缝/],
      ["enter_force_wall", /强行破开外墙/],
    ],
    [POST_BLUE_SHOAL_IDS.fortressInner]: [
      ["investigate_seal_maintenance_room", /封印维护室/],
      ["read_gatekeeper_protocol", /黑石门卫协议/],
      ["enter_old_armory", /旧军械库/],
      ["watch_hero_oath_memory", /三英雄誓约残影/],
      ["purify_blackstone_core", /净化.*黑石核心/],
    ],
    [POST_BLUE_SHOAL_IDS.sealChamber]: [
      ["compare_forged_command", /比对伪造命令/],
      ["sense_gatekeeper_mind", /判断守门者.*意识/],
    ],
    [POST_BLUE_SHOAL_IDS.finalChoice]: [
      ["stabilize_boss_core", /稳定.*Boss.*核心|稳定.*核心/],
      ["destroy_boss_core", /破坏.*Boss.*核心|破坏.*核心/],
    ],
  };
  return groups[node]?.find(([, pattern]) => pattern.test(action))?.[0] || null;
}

function resolveBlueShoalInvestigation(
  state: GameState,
  patch: GameState,
  lines: string[],
  id: string,
  result: PostBlueShoalOutcome,
) {
  if (id === "inspect_spore_beast_body") {
    setStoryFlag(state, patch, "blue_shoal_corpse_examined");
    if (result !== "critical")
      setStoryFlag(state, patch, "blue_shoal_drag_marks_found");
    if (result === "great" || result === "success")
      adjustScore(state, patch, "truthScore", 1);
  }
  if (id === "inspect_severed_black_cable") {
    if (result !== "critical")
      setStoryFlag(state, patch, "blue_shoal_black_cable_sabotage_found");
    if (result === "great" || result === "success") {
      addCluePatch(state, patch, "clue_black_cable_sabotaged");
      adjustScore(state, patch, "truthScore", 1);
    }
  }
  if (id === "collect_blue_cap_fungus") {
    if (result === "great" || result === "success" || result === "partial") {
      setStoryFlag(state, patch, "blue_shoal_spore_sample_obtained");
      addItemPatch(
        state,
        patch,
        result === "partial" ? "稀释蓝伞孢粉" : "蓝伞孢粉",
      );
      adjustScore(state, patch, "combatPrepScore", result === "great" ? 2 : 1);
    }
  }
  if (id === "inspect_spore_beast_body") {
    if (result === "great") {
      addItemPatch(state, patch, "活性孢子样本");
      addItemPatch(state, patch, "黑根碎片");
      addCluePatch(state, patch, "clue_spores_follow_seal_pulse");
      trust(state, patch, "brock", 5);
      lines.push(
        "黑色碎片被菌丝环绕，正随着远方封印脉冲收缩。布洛克帮你封存了完整活性样本。",
      );
    } else if (result === "success") {
      addItemPatch(state, patch, "活性孢子样本");
      addCluePatch(state, patch, "clue_spores_follow_seal_pulse");
      lines.push("样本证明孢兽曾受到黑石脉冲驱赶。");
    } else if (result === "partial") {
      addItemPatch(state, patch, "活性孢子样本");
      patch.spore_cough = true;
      lines.push("样本采集成功，但你吸入了少量孢尘。");
    } else if (result === "failure") {
      addItemPatch(state, patch, "不稳定孢子样本");
      lines.push("尸体迅速腐化，只留下不完整样本。");
    } else {
      patch.spore_cough = true;
      trust(state, patch, "brock", -2);
      lines.push("菌囊炸开，孢尘迫使队伍后退。");
    }
    patch.active_spore_sample_count = countInventory(
      patch.inventory ?? state.inventory,
      "活性孢子样本",
    );
  }
  if (id === "inspect_severed_black_cable") {
    if (result === "great") {
      addItemPatch(state, patch, "黑缆切口样本");
      addCluePatch(state, patch, "clue_black_cable_sabotaged");
      trust(state, patch, "kaiya", 3);
      lines.push(
        "凯娅从切口内侧挑出一小片定向切割留下的金属屑，证明黑缆在战斗开始前就被人处理过。",
      );
    } else if (result === "success") {
      addCluePatch(state, patch, "clue_black_cable_sabotaged");
      lines.push(
        "切面上残留着平行工具纹，这段黑缆不是被孢兽扯断，而是遭到人为切割。",
      );
    } else if (result === "partial") {
      addItemPatch(state, patch, "受损黑缆切口样本");
      patch.blue_shoal_black_cable_sabotage_uncertain = true;
      lines.push("切口已经被孢浆腐蚀，但仍能看出不自然的平直边缘。");
    } else if (result === "failure") {
      patch.blue_shoal_black_cable_sabotage_uncertain = true;
      lines.push(
        "黑缆残片碎得太厉害，无法确认使用了什么工具，但自然断裂的可能性很低。",
      );
    } else {
      patch.black_cable_fragment_lost = true;
      lines.push(
        "绷紧的残缆突然崩断，关键切口落进菌毯深处；凯娅只来得及记下它原本的位置。",
      );
    }
  }
  if (id === "track_abnormal_glow") {
    if (result === "great") {
      addItemPatch(state, patch, "青蓝孢晶");
      addItemPatch(state, patch, "黑根碎片");
      addCluePatch(state, patch, "clue_spores_follow_seal_pulse");
      lines.push("蓝光来自被菌丝包裹的黑石碎片，与堡垒脉冲完全同步。");
    } else if (result === "success") {
      addCluePatch(state, patch, "clue_spores_follow_seal_pulse");
      trust(state, patch, "serin", 3);
      lines.push("异常蓝光的方向与地底堡垒一致。");
    } else {
      patch.mimic_voice_haunted = true;
      if (result === "critical") trust(state, patch, "kaiya", -2);
      lines.push("蓝光把你引向错误方向，但绕行留下的痕迹仍指向骨柱湿地。");
    }
  }
  if (id === "collect_blue_cap_fungus") {
    if (result === "great") {
      addItemPatch(state, patch, "蓝伞菌盖", 2);
      trust(state, patch, "brock", 4);
      lines.push("完整菌盖与菌褶粉都被安全封存，可作解毒辅料。");
    } else if (result === "success" || result === "partial") {
      addItemPatch(state, patch, "蓝伞菌盖");
      lines.push("你采到一份可用于稳定孢毒的菌盖。");
    } else if (result === "critical") {
      patch.spore_cough = true;
      lines.push("你误触孢囊，没能取得可用材料。");
    } else lines.push("菌盖已经腐坏，无法使用。");
  }
  if (id === "ask_companion_judgement") {
    addCluePatch(state, patch, "clue_spores_follow_seal_pulse");
    trust(state, patch, "serin", 2);
    trust(state, patch, "ailin", 2);
    trust(state, patch, "brock", 2);
    trust(state, patch, "kaiya", 2);
    lines.push(
      "瑟琳确认脉冲逆向泄出；艾琳提醒孢化者仍可能残留意识；布洛克指出迁徙路线像在逃亡；凯娅则找到了被刻意藏起的旧排水渠标记。",
    );
  }
}

function resolveBoneRoute(
  state: GameState,
  patch: GameState,
  lines: string[],
  id: string,
  result: PostBlueShoalOutcome,
) {
  const route = id.replace("route_", "");
  patch.route_to_bone_marsh = route;
  setStoryFlag(state, patch, "bone_wetland_entered");
  patch.bone_wetland_route =
    id === "route_marked_stakes"
      ? "safe"
      : id === "route_broken_cable"
        ? "fast"
        : id === "route_fungal_ridge"
          ? "sample"
          : result === "failure" || result === "critical"
            ? "lost"
            : "safe";
  if (
    id === "route_fungal_ridge" &&
    (result === "great" || result === "success")
  )
    patch.bone_wetland_sample_quality = result === "great" ? 2 : 1;
  if (
    id === "route_broken_cable" &&
    (result === "failure" || result === "critical")
  )
    setStoryFlag(state, patch, "bone_wetland_echo_voice_triggered");
  if (id === "route_marked_stakes") {
    if (result === "great" || result === "success") {
      trust(state, patch, "ailin", 1);
      lines.push("队伍沿发光桩道避开菌毯陷坑，安全抵达湿地外缘。");
    } else {
      patch.party_fatigued = true;
      lines.push("孢尘遮住部分标记，队伍绕远后仍抵达湿地。");
    }
  }
  if (id === "route_dwarf_drain") {
    if (result === "great") {
      addItemPatch(state, patch, "堡垒徽章残片");
      trust(state, patch, "kaiya", 4);
    } else if (result === "success") patch.bone_marsh_trap_bonus = 2;
    else if (result === "partial") patch.bone_marsh_alert = true;
    else {
      patch.party_fatigued = true;
      if (result === "critical") trust(state, patch, "kaiya", -2);
    }
    lines.push(
      "旧排水渠的闸门在刺耳摩擦声中打开，队伍从被遗忘的矮人管道进入湿地。",
    );
  }
  if (id === "route_fungal_ridge") {
    if (result === "great") {
      addCluePatch(state, patch, "clue_spores_follow_seal_pulse");
      addItemPatch(state, patch, "活性孢子样本");
      trust(state, patch, "brock", 5);
    } else if (result === "success") {
      addItemPatch(state, patch, "活性孢子样本");
      trust(state, patch, "brock", 3);
    } else if (result === "partial") {
      addItemPatch(state, patch, "活性孢子样本");
      patch.spore_cough = true;
    } else {
      patch.party_fatigued = true;
      trust(state, patch, "brock", result === "critical" ? -4 : -1);
    }
    patch.active_spore_sample_count = countInventory(
      patch.inventory ?? state.inventory,
      "活性孢子样本",
    );
    lines.push("从脊线上望去，孢群围绕堡垒形成了一圈不自然的迁徙环流。");
  }
  if (id === "route_broken_cable") {
    if (result === "great") {
      addItemPatch(state, patch, "秘银缆丝");
      trust(state, patch, "serin", 2);
    } else if (result === "success") patch.bone_marsh_map_bonus = 2;
    else if (result === "failure" || result === "critical")
      patch.party_fatigued = true;
    if (result === "critical") patch.mimic_voice_haunted = true;
    lines.push("队伍借断裂缆索越过裂隙，从高处第一次看清骨柱湿地的全貌。");
  }
}

function resolveBoneInvestigation(
  state: GameState,
  patch: GameState,
  lines: string[],
  id: string,
  result: PostBlueShoalOutcome,
) {
  if (id === "rubbing_bone_pillar") {
    if (result === "great") {
      addDocumentPatch(state, patch, "doc_bone_pillar_rubbing");
      addCluePatch(state, patch, "clue_gatekeeper_not_evil");
      trust(state, patch, "serin", 5);
    } else if (result === "success") {
      addDocumentPatch(state, patch, "doc_bone_pillar_rubbing");
      trust(state, patch, "serin", 3);
    } else if (result === "partial") {
      addDocumentPatch(state, patch, "doc_bone_pillar_rubbing");
      patch.bone_rubbing_damaged = true;
    } else if (result === "critical") patch.blackstone_headache = true;
    patch.bone_pillars_artificial = true;
    lines.push(
      "铭文中的“冷却”“承载”“守门者”证明骨柱是封印结构被孢化后的残骸。",
    );
  }
  if (id === "resist_mimic_voice") {
    patch.bone_marsh_mimic_resisted =
      result !== "failure" && result !== "critical";
    if (!patch.bone_marsh_mimic_resisted)
      patch.battleEffects = {
        ...(state.battleEffects || {}),
        enemyInitiativeBonus: result === "critical" ? 2 : 1,
      };
    lines.push(
      patch.bone_marsh_mimic_resisted
        ? "你抓住了呼救声完全相同的停顿，队伍没有回应，并反向锁定菌核方向。"
        : "有人下意识回头，菌丝立刻从声音传来的方向逼近。",
    );
  }
  if (id === "collect_marsh_spores") {
    const amount =
      result === "great"
        ? 2
        : result === "success" || result === "partial"
          ? 1
          : 0;
    if (amount) addItemPatch(state, patch, "活性孢子样本", amount);
    else addItemPatch(state, patch, "不稳定孢子样本");
    if (result === "great") trust(state, patch, "brock", 5);
    else if (result === "success") trust(state, patch, "brock", 3);
    else if (result === "partial") patch.spore_cough = true;
    const count = countInventory(
      patch.inventory ?? state.inventory,
      "活性孢子样本",
    );
    patch.active_spore_sample_count = count;
    if (count >= 3 && !state.brock_sample_promise_completed) {
      patch.brock_sample_promise_completed = true;
      trust(state, patch, "brock", 8);
    }
    lines.push(`活性样本已重新计数：${count}/3。`);
  }
  if (id === "seal_fungal_nest") {
    if (result !== "failure" && result !== "critical") {
      patch.bone_marsh_nest_sealed = true;
      trust(state, patch, "brock", result === "great" ? 6 : 4);
      if (result === "great") addItemPatch(state, patch, "活性孢子样本");
    }
    lines.push(
      patch.bone_marsh_nest_sealed
        ? "通气孔被逐一封住，幼生菌巢安静地进入休眠。"
        : "菌巢没有休眠，但队伍仍清出了一条可通行的窄路。",
    );
  }
  if (id === "burn_fungal_nest") {
    patch.bone_marsh_nest_burned = true;
    trust(
      state,
      patch,
      "brock",
      result === "failure" || result === "critical" ? -8 : -6,
    );
    trust(state, patch, "ailin", -2);
    lines.push(
      "火焰快速清出道路，也把大片仍有生命的幼菌烧成灰。布洛克一路没有再说话。",
    );
  }
  if (id === "avoid_fungal_nest") {
    patch.bone_marsh_nest_ignored = true;
    if (result === "great" || result === "success")
      trust(state, patch, "kaiya", 2);
    else patch.party_fatigued = true;
    lines.push("队伍绕过菌巢，不触碰这片危险生态。");
  }
}

function resolveCampInvestigation(
  state: GameState,
  patch: GameState,
  lines: string[],
  id: string,
  result: PostBlueShoalOutcome,
) {
  const truth = () => {
    patch.expedition_truth_level = Math.min(
      4,
      Number(
        patch.expedition_truth_level ?? state.expedition_truth_level ?? 0,
      ) + 1,
    );
    patch.expedition_truth_piece_count = Math.min(
      5,
      Number(
        patch.expedition_truth_piece_count ??
          state.expedition_truth_piece_count ??
          0,
      ) + 1,
    );
    adjustScore(state, patch, "truthScore", 1);
    if (patch.expedition_truth_level >= 3)
      patch.expedition_truth_complete = true;
  };
  if (id === "search_command_tent")
    setStoryFlag(state, patch, "third_camp_command_log_found");
  if (id === "search_medical_tent")
    setStoryFlag(state, patch, "third_camp_medical_log_found");
  if (id === "repair_expedition_communicator")
    setStoryFlag(state, patch, "third_camp_voice_array_found");
  if (id === "open_expedition_lockbox")
    setStoryFlag(state, patch, "third_camp_blackstone_sample_found");
  if (id === "bury_expedition_dead")
    setStoryFlag(state, patch, "third_camp_personal_tokens_found");
  if (id === "search_command_tent") {
    if (result === "great" || result === "success" || result === "partial") {
      addDocumentPatch(state, patch, "doc_expedition_commander_final_log");
      truth();
      patch.expedition_commander_log_found = true;
      if (result === "great") {
        addItemPatch(state, patch, "远征队长私印");
        trust(state, patch, "serin", 4);
      }
    } else addCluePatch(state, patch, "clue_gatekeeper_not_evil");
    lines.push("日志把真相写得很清楚：队长在第一次拟声袭击后继续组织了三轮值守，并命令全队阻止来自堡垒内侧的返航指令。门卫不是敌人，敌人藏在伪造的命令里。");
    if (state.salo_intel_done)
      lines.push("萨洛情报里那句‘会移动的求援方向’与日志的声纹记录完全吻合：酒馆提前听见的传闻，正是伪造信号泄露到城里的回声。");
  }
  if (id === "search_medical_tent") {
    if (result === "great" || result === "success" || result === "partial") {
      addDocumentPatch(state, patch, "doc_expedition_medical_log");
      patch.expedition_medical_log_found = true;
      if (result !== "partial") truth();
      trust(
        state,
        patch,
        "ailin",
        result === "great" ? 5 : result === "success" ? 3 : 1,
      );
    }
    if (result === "great" || result === "success") addItemPatch(state, patch, "白枝烛芯");
    else if (result === "failure") addItemPatch(state, patch, "弱效解毒剂");
    else if (result === "critical") patch.spore_cough = true;
    if (
      /蓝伞菌盖/.test(String(state.inventory || "")) &&
      (result === "great" || result === "success")
    )
      patch.purification_core_prepared = true;
    lines.push(
      "用药记录证明早期孢化并非不可逆，白枝烛芯与蓝伞菌盖可以稳定意识。",
    );
    if (/伤员净化报告/.test(JSON.stringify(state)))
      lines.push("艾琳把先前取得的《伤员净化报告》摊在记录旁逐项比对，确认两份报告使用的是同一套净化方案；营地里至少有一批伤员在灾变后仍清醒地生活过数日。");
  }
  if (id === "search_map_table") {
    if (result !== "failure" && result !== "critical") {
      addItemPatch(
        state,
        patch,
        result === "partial" ? "破损地底堡垒入口残图" : "地底堡垒入口残图",
      );
      if (result !== "partial") truth();
      patch.fortress_entry_map_found = true;
    }
    lines.push("即使残图不完整，堡垒外环的大方向和维护井位置仍可辨认。地图上还有一道被反复涂黑的箭头，从门内指向营地；旁注写着：‘不是撤退路线，阻止它打开。’");
    if (/第三远征队失联报告/.test(JSON.stringify(state)))
      lines.push("公会《第三远征队失联报告》标注的最后坐标与地图桌上的值守日期相差三天，证明报告里的‘当日团灭’判断并不成立。");
  }
  if (id === "open_expedition_lockbox") {
    const yunlingCharm = /云苓的护身符/.test(String(state.inventory || ""));
    if (yunlingCharm) {
      patch.yunling_charm_warned_blackstone = true;
      lines.push("锁针接触黑石封蜡时，云苓的护身符骤然发热。凯娅顺着这次预警避开了藏在锁舌后的污染针，锁箱没有向堡垒发出警报。");
    }
    if (result === "great" || result === "success") {
      addItemPatch(state, patch, "地底堡垒徽章");
      addItemPatch(state, patch, "黑石调律叉");
      trust(state, patch, "kaiya", result === "great" ? 5 : 3);
      if (result === "great") addItemPatch(state, patch, "治疗药水");
    } else if (result === "partial") {
      addItemPatch(state, patch, "地底堡垒徽章");
      addItemPatch(state, patch, "破损黑石调律叉");
    } else if (result === "critical" && !yunlingCharm) patch.fortress_alert = 1;
    lines.push("锁箱内的徽章与调律工具显然是远征队为进入堡垒准备的最后手段。");
  }
  if (id === "repair_expedition_communicator") {
    if (result === "great") {
      addDocumentPatch(state, patch, "doc_last_transmission");
      patch.gatekeeper_true_name_known = true;
      trust(state, patch, "serin", 5);
    } else if (result === "success" || result === "partial") {
      addDocumentPatch(state, patch, "doc_last_transmission");
      patch.true_name_command_bonus = result === "success" ? 2 : 1;
    } else if (result === "critical") patch.blackstone_headache = true;
    lines.push(
      result === "great"
        ? "通讯器吐出最后一个清晰名字：“阿格洛恩——站在门前者。”"
        : "残缺通信反复提到：真名指令可以覆盖伪造命令。",
    );
  }
  if (id === "bury_expedition_dead") {
    if (result === "great") {
      addItemPatch(state, patch, "白枝烛芯");
      trust(state, patch, "ailin", 6);
      patch.mercy_hidden_score = Number(state.mercy_hidden_score || 0) + 1;
    } else if (result === "success") {
      trust(state, patch, "ailin", 4);
      patch.party_fatigued = false;
    } else if (result === "partial") trust(state, patch, "ailin", 2);
    else trust(state, patch, "ailin", result === "critical" ? -3 : -1);
    lines.push(
      "无论仪式是否完整，艾琳都把每一枚能找到的身份牌念了一遍。死者不再只是失踪记录。",
    );
  }
}

function resolveLaineApproach(
  state: GameState,
  patch: GameState,
  lines: string[],
  id: string,
  result: PostBlueShoalOutcome,
) {
  setStoryFlag(state, patch, "laine_found");
  setStoryFlag(state, patch, "laine_alive");
  if (!state.relationships?.laine)
    patch.relationships = { ...(state.relationships || {}), laine: 30 };

  if (id === "save_laine_with_purification_heart") {
    patch.inventory = removeInventoryItem(state.inventory, "净化之心");
    patch.purification_heart_owned = false;
    patch.purification_heart_used_on_laine = true;
    patch.core_purification_known = true;
    patch.lainHelped = true;
    patch.helpedRhein = true;
    setStoryFlag(state, patch, "laine_stabilized");
    setStoryFlag(state, patch, "laine_testimony_obtained");
    addDocumentPatch(state, patch, "doc_laine_testimony");
    adjustLaineRelationship(state, patch, 25);
    trust(state, patch, "ailin", 6);
    lines.push(
      "净化之心压住了莱因体内的黑石侵蚀。他恢复清醒，并确认同样的净化反应能够稳定黑石门卫的核心。",
    );
    return;
  }

  if (id === "leave_laine_without_purification_heart") {
    setStoryFlag(state, patch, "laine_left_behind");
    patch.lainHelped = false;
    patch.helpedRhein = false;
    patch.core_purification_known = false;
    trust(state, patch, "ailin", -4);
    lines.push(
      "没有净化之心，队伍无法压住莱因体内的黑石侵蚀，也无法从他口中取得关于门卫核心的有效证词。",
    );
    return;
  }

  const strong = result === "great" || result === "success";
  if (id === "laine_stabilize_first" && strong) {
    patch.laine_trust = Math.max(
      Number(state.laine_trust || 0),
      result === "great" ? 2 : 1,
    );
    adjustScore(state, patch, "mercyScore", 1);
  }
  if (id === "laine_question_first") {
    patch.laine_truth_level = Math.max(
      Number(state.laine_truth_level || 0),
      result === "great" ? 3 : strong ? 2 : 1,
    );
    adjustScore(state, patch, "truthScore", result === "great" ? 2 : 1);
  }
  if (id === "laine_check_badge" && result !== "critical") {
    setStoryFlag(state, patch, "laine_badge_obtained");
    setStoryFlag(state, patch, "laine_gave_badge", strong);
  }

  if (id === "laine_stabilize_first") {
    if (result === "great") {
      setStoryFlag(state, patch, "laine_stabilized");
      setStoryFlag(state, patch, "laine_black_cable_badge_obtained");
      addItemPatch(state, patch, "莱因的黑缆识别牌");
      adjustLaineRelationship(state, patch, 20);
      adjustScore(state, patch, "guardian_mercy_score", 2);
      trust(state, patch, "ailin", 5);
      lines.push(
        "艾琳用白枝祷文压住孢丝。莱因恢复清醒，主动解下识别牌：“把这个带到门前。”",
      );
    } else if (result === "success") {
      setStoryFlag(state, patch, "laine_stabilized");
      setStoryFlag(state, patch, "laine_testimony_obtained");
      addDocumentPatch(state, patch, "doc_laine_testimony");
      adjustLaineRelationship(state, patch, 15);
      adjustScore(state, patch, "guardian_mercy_score", 1);
      lines.push("莱因的呼吸逐渐平稳，终于能断续说明门卫仍在抵抗伪造命令。");
    } else if (result === "partial") {
      setStoryFlag(state, patch, "laine_spore_worsened");
      setStoryFlag(state, patch, "laine_testimony_obtained");
      addDocumentPatch(state, patch, "doc_laine_testimony");
      adjustLaineRelationship(state, patch, 8);
      lines.push(
        "伤势暂时止住，证词却被孢声切得支离破碎。莱因仍反复强调：“门卫不是敌人。”",
      );
    } else {
      setStoryFlag(state, patch, "laine_spore_worsened");
      addCluePatch(state, patch, "clue_gatekeeper_order_forged");
      adjustLaineRelationship(state, patch, result === "critical" ? -5 : 3);
      if (result === "critical") patch.laine_next_persuasion_dc_bonus = 2;
      lines.push(
        result === "critical"
          ? "孢丝反扑，莱因把你们误认成拟声幻觉，握紧断剑拒绝靠近。"
          : "稳定术没能压住孢化，但莱因仍挤出一句：“命令是假的。”",
      );
    }
  }

  if (id === "laine_question_first") {
    if (result === "great") {
      setStoryFlag(state, patch, "laine_full_testimony_obtained");
      setStoryFlag(state, patch, "laine_testimony_obtained");
      addDocumentPatch(state, patch, "doc_laine_full_testimony");
      addCluePatch(state, patch, "clue_gatekeeper_order_forged");
      adjustLaineRelationship(state, patch, 12);
      adjustScore(state, patch, "guardian_mercy_score", 2);
      adjustScore(state, patch, "black_root_decisive_score", 1);
      lines.push(
        "莱因强撑着说出完整经过：阿格洛恩始终在守门，第三远征队带进去的返航命令才是污染源。",
      );
    } else if (result === "success") {
      setStoryFlag(state, patch, "laine_testimony_obtained");
      addDocumentPatch(state, patch, "doc_laine_testimony");
      addCluePatch(state, patch, "clue_gatekeeper_order_forged");
      adjustLaineRelationship(state, patch, 8);
      lines.push("莱因确认门卫收到的是门内伪造命令，而不是主动背叛。");
    } else if (result === "partial") {
      setStoryFlag(state, patch, "laine_spore_worsened");
      addCluePatch(state, patch, "clue_gatekeeper_order_forged");
      adjustLaineRelationship(state, patch, 3);
      lines.push("他只说清一句：“门卫收到的是假命令。”随后再次陷入孢声。");
    } else {
      adjustLaineRelationship(state, patch, result === "critical" ? -8 : -5);
      if (result === "critical") {
        setStoryFlag(state, patch, "laine_spore_worsened");
        trust(state, patch, "kaiya", -1);
      }
      lines.push(
        "莱因把你们误认成拟声菌团，断剑横在胸前；但他对“门卫”二字的反应证明那里仍藏着真相。",
      );
    }
  }

  if (id === "laine_check_badge") {
    if (result === "great") {
      addItemPatch(state, patch, "莱因的黑缆识别牌");
      addDocumentPatch(state, patch, "doc_black_cable_last_order");
      setStoryFlag(state, patch, "laine_black_cable_badge_obtained");
      trust(state, patch, "kaiya", 4);
      adjustScore(state, patch, "reverse_clock_anchor_score", 1);
      adjustLaineRelationship(state, patch, 2);
      lines.push(
        "凯娅无损取下识别牌，并从背面读出堡垒维护口令：“从断缆回到门前。”",
      );
    } else if (result === "success") {
      addItemPatch(state, patch, "莱因的黑缆识别牌");
      setStoryFlag(state, patch, "laine_black_cable_badge_obtained");
      trust(state, patch, "kaiya", 2);
      lines.push("识别牌完整保留下来，旧堡垒门禁仍可能承认它。");
    } else if (result === "partial") {
      addItemPatch(state, patch, "损坏的莱因黑缆识别牌");
      setStoryFlag(state, patch, "laine_spore_worsened");
      adjustLaineRelationship(state, patch, -3);
      lines.push("识别牌被取下，但牵动了伤口，只剩部分权限纹路仍在发光。");
    } else {
      adjustLaineRelationship(state, patch, -5);
      if (result === "critical") patch.blackstone_headache = true;
      lines.push(
        result === "critical"
          ? "识别牌内的黑石残响突然刺入意识，迫使所有人后退。"
          : "莱因死死护住识别牌，不许任何人靠近。",
      );
    }
  }

  if (id === "laine_check_infection") {
    if (result === "great") {
      addCluePatch(state, patch, "clue_spore_corruption_reversible");
      adjustScore(state, patch, "guardian_mercy_score", 2);
      trust(state, patch, "ailin", 3);
      trust(state, patch, "brock", 2);
      lines.push(
        "艾琳与布洛克共同确认：这是可逆的早期孢化，莱因仍是伤员，不是怪物。",
      );
    } else if (result === "success") {
      adjustScore(state, patch, "guardian_mercy_score", 1);
      trust(state, patch, "ailin", 2);
      lines.push("莱因仍能回应名字、区分现实与孢声，他还有救。");
    } else if (result === "partial") {
      adjustLaineRelationship(state, patch, 2);
      lines.push("诊断无法完全确定，但莱因仍在用自己的名字抵抗拟声。");
    } else {
      if (result === "critical") {
        setStoryFlag(state, patch, "laine_spore_worsened");
        patch.laine_next_stabilize_dc_bonus = 2;
      } else trust(state, patch, "ailin", -1);
      lines.push("误判让队伍短暂把武器对准伤员，岩棚里的气氛骤然绷紧。");
    }
  }
}

function resolveLaineDecision(
  state: GameState,
  patch: GameState,
  lines: string[],
  id: string,
  result: PostBlueShoalOutcome,
) {
  const strong = result === "great" || result === "success";
  if (id === "use_materials_to_stabilize_laine") {
    if (strong || result === "partial") {
      patch.laine_trust = Math.max(
        Number(state.laine_trust || 0),
        result === "great" ? 3 : 2,
      );
      adjustScore(state, patch, "mercyScore", result === "great" ? 2 : 1);
    }
    patch.inventory = removeInventoryItem(
      patch.inventory ?? state.inventory,
      "蓝伞菌盖",
    );
    if (result === "great") {
      setStoryFlag(state, patch, "laine_stabilized");
      setStoryFlag(state, patch, "laine_full_testimony_obtained");
      setStoryFlag(state, patch, "laine_testimony_obtained");
      setStoryFlag(state, patch, "laine_knows_gatekeeper_name");
      patch.gatekeeper_true_name_known = true;
      addDocumentPatch(state, patch, "doc_laine_full_testimony");
      addCluePatch(state, patch, "clue_laine_heard_true_name");
      adjustScore(state, patch, "guardian_mercy_score", 3);
      adjustLaineRelationship(state, patch, 25);
      trust(state, patch, "ailin", 6);
      lines.push(
        "白枝烛芯与蓝伞菌盖压住了孢化。莱因清楚说出真名“阿格洛恩”，并强调真名是唤醒职责，而非控制。",
      );
    } else if (result === "success") {
      setStoryFlag(state, patch, "laine_stabilized");
      setStoryFlag(state, patch, "laine_escort_to_camp");
      setStoryFlag(state, patch, "laine_testimony_obtained");
      addDocumentPatch(state, patch, "doc_laine_testimony");
      adjustScore(state, patch, "guardian_mercy_score", 2);
      adjustLaineRelationship(state, patch, 18);
      lines.push("莱因的意识稳定下来，已经能够随队走到堡垒外环。");
    } else if (result === "partial") {
      setStoryFlag(state, patch, "laine_stabilized");
      setStoryFlag(state, patch, "laine_spore_worsened");
      setStoryFlag(state, patch, "laine_testimony_obtained");
      addDocumentPatch(state, patch, "doc_laine_testimony");
      adjustScore(state, patch, "guardian_mercy_score", 1);
      lines.push("莱因暂时清醒，却无法长时间行动。证词被艾琳逐句记录下来。");
    } else {
      setStoryFlag(state, patch, "laine_spore_worsened");
      if (result === "failure") {
        addItemPatch(state, patch, "莱因的黑缆识别牌");
        setStoryFlag(state, patch, "laine_black_cable_badge_obtained");
        adjustScore(state, patch, "forced_seal_score", 1);
      } else {
        addItemPatch(state, patch, "莱因的记忆残片");
        adjustLaineRelationship(state, patch, -5);
        trust(state, patch, "ailin", -2);
      }
      lines.push(
        "材料没能彻底压住孢声。莱因仍留下识别牌或记忆残响，主线不会因此中断。",
      );
    }
  }

  if (id === "ask_laine_draw_fortress_route") {
    if (result !== "critical") {
      patch.laine_truth_level = Math.max(
        Number(state.laine_truth_level || 0),
        result === "great" ? 3 : strong ? 2 : 1,
      );
      adjustScore(state, patch, "truthScore", result === "great" ? 2 : 1);
    }
    if (result === "great") {
      addItemPatch(state, patch, "莱因标记的堡垒路线图");
      patch.location_unlock_fortress_maintenance_well = true;
      adjustScore(state, patch, "black_root_decisive_score", 2);
      adjustScore(state, patch, "reverse_clock_anchor_score", 1);
      adjustLaineRelationship(state, patch, 10);
    } else if (result === "success") {
      addItemPatch(state, patch, "莱因标记的堡垒路线图");
      adjustScore(state, patch, "black_root_decisive_score", 1);
      adjustLaineRelationship(state, patch, 6);
    } else if (result === "partial") {
      addCluePatch(state, patch, "clue_fortress_side_route");
      patch.fortress_first_mechanism_bonus = 1;
    } else if (result === "critical") patch.laine_route_mimic_ambush = true;
    if (result === "failure")
      addCluePatch(state, patch, "clue_gatekeeper_order_forged");
    lines.push(
      "莱因用颤抖的手画下堡垒轮廓；即使路线残缺，门卫与伪造命令的方向仍被标了出来。",
    );
  }

  if (id === "ask_laine_gatekeeper_true_name") {
    if (result !== "critical") {
      patch.laine_truth_level = Math.max(
        Number(state.laine_truth_level || 0),
        result === "great" ? 3 : 2,
      );
      setStoryFlag(
        state,
        patch,
        "guardian_name_known",
        result === "great" || result === "success",
      );
      adjustScore(state, patch, "truthScore", result === "great" ? 2 : 1);
    }
    if (result === "great") {
      patch.gatekeeper_true_name_known = true;
      setStoryFlag(state, patch, "laine_knows_gatekeeper_name");
      addCluePatch(state, patch, "clue_laine_heard_true_name");
      addDocumentPatch(state, patch, "doc_gatekeeper_protocol_fragment");
      adjustScore(state, patch, "guardian_mercy_score", 3);
      trust(state, patch, "serin", 4);
      lines.push(
        "莱因记起真名“阿格洛恩”：“真名不是命令，是让它想起自己为什么站在门前。”",
      );
    } else if (result === "success" || result === "partial") {
      addCluePatch(state, patch, "clue_true_name_command");
      patch.true_name_command_bonus = result === "success" ? 2 : 1;
      if (result === "success")
        adjustScore(state, patch, "guardian_mercy_score", 1);
      lines.push(
        "莱因只记得残缺协议：“守门者，回到门前。”这仍足以削弱伪造命令。",
      );
    } else {
      if (result === "critical") {
        adjustLaineRelationship(state, patch, -8);
        trust(state, patch, "ailin", -2);
        setStoryFlag(state, patch, "laine_spore_worsened");
      }
      addCluePatch(state, patch, "clue_gatekeeper_order_forged");
      lines.push("莱因无法想起真名，但他对伪造命令的证词仍被保留下来。");
    }
  }

  if (id === "leave_laine_behind") {
    setStoryFlag(state, patch, "laine_left_behind");
    setStoryFlag(state, patch, "laine_alive");
    adjustLaineRelationship(state, patch, -10);
    trust(state, patch, "ailin", -4);
    trust(state, patch, "kaiya", 2);
    adjustScore(state, patch, "forced_seal_score", 1);
    addItemPatch(state, patch, "莱因的染血护手");
    addCluePatch(state, patch, "clue_gatekeeper_order_forged");
    lines.push(
      "艾琳把白枝符放进莱因掌心。莱因没有责怪你们，只低声说：“别让它用我的声音骗你们。”",
    );
  }

  if (id === "mercy_kill_laine") {
    setStoryFlag(state, patch, "laine_final_words_heard");
    setStoryFlag(state, patch, "laine_alive", false);
    setStoryFlag(state, patch, "laine_mercy_killed");
    addItemPatch(state, patch, "莱因的染血护手");
    trust(state, patch, "ailin", -8);
    trust(state, patch, "brock", -2);
    trust(state, patch, "kaiya", 1);
    adjustScore(state, patch, "black_root_decisive_score", 2);
    adjustScore(state, patch, "forced_seal_score", 1);
    addCluePatch(state, patch, "clue_gatekeeper_order_forged");
    lines.push(
      "莱因没有挣扎，只用最后一点清醒确认站在面前的是人：“别让门开。不管用什么办法。”",
    );
  }
}

function resolveCampNight(
  state: GameState,
  patch: GameState,
  lines: string[],
  id: string,
) {
  if (id === "night_talk_eileen") {
    trust(state, patch, "ailin", 6);
    patch.eileen_backstory_known = true;
    addItemPatch(state, patch, "艾琳的白线护符");
    lines.push(
      "艾琳望着火说：“我们只是站得离死亡太近，所以必须学会不移开眼睛。”",
    );
  }
  if (id === "night_talk_brock") {
    const complete = Number(state.active_spore_sample_count || 0) >= 3;
    trust(state, patch, "brock", complete ? 8 : 2);
    if (complete) {
      patch.brock_sample_promise_completed = true;
      addItemPatch(state, patch, "布洛克孢子滤片");
    }
    lines.push(
      complete
        ? "布洛克收好样本：“你没把孢海当成一堆该烧掉的烂蘑菇。回去我请你喝一杯。”"
        : "布洛克点点头：“还差点样本，不过你至少知道脚下踩的是活东西。”",
    );
  }
  if (id === "night_talk_kaia") {
    trust(state, patch, "kaiya", 6);
    patch.kaia_backstory_known = true;
    addItemPatch(state, patch, "凯娅的备用锁针");
    lines.push(
      "凯娅拨着火：“我不是突然变成好人。我只是讨厌有人把整座城当成可以抵押的筹码。”",
    );
  }
  if (id === "night_talk_serin") {
    trust(state, patch, "serin", 6);
    patch.reverse_clock_method_known = true;
    addItemPatch(state, patch, "逆钟粉笔");
    lines.push(
      "瑟琳在石面画出逆行符文：“不能让封印重新开始，但也许能让它记起，自己原本该停在哪里。”",
    );
  }
  if (id === "night_laine_walk_to_gate") {
    adjustLaineRelationship(state, patch, 8);
    trust(state, patch, "ailin", 2);
    adjustScore(state, patch, "guardian_mercy_score", 1);
    setStoryFlag(state, patch, "laine_joined_final_chamber");
    lines.push(
      "你告诉莱因，他会亲自走到门前。莱因握住裂开的徽记，第一次没有回避明天。",
    );
  }
  if (id === "night_laine_full_truth") {
    adjustLaineRelationship(state, patch, 4);
    trust(state, patch, "serin", 2);
    setStoryFlag(state, patch, "laine_testimony_obtained");
    if (state.laine_testimony_obtained || state.laine_stabilized) {
      addDocumentPatch(state, patch, "doc_laine_full_testimony");
      setStoryFlag(state, patch, "laine_full_testimony_obtained");
    } else addDocumentPatch(state, patch, "doc_laine_testimony");
    lines.push(
      "莱因从队长死亡讲到假命令进入堡垒。瑟琳把每一句证词都写进远征记录。",
    );
  }
  if (id === "night_laine_safe_end") {
    trust(state, patch, "kaiya", 2);
    adjustScore(state, patch, "black_root_decisive_score", 1);
    lines.push(
      "莱因点头：“如果救不了它，就准确地结束污染。别让门里的东西继续借它的手。”",
    );
  }
  if (id === "night_laine_accept_sacrifice") {
    trust(state, patch, "serin", 3);
    adjustScore(state, patch, "reverse_clock_anchor_score", 1);
    adjustScore(state, patch, "reverseClockScore", 1);
    setStoryFlag(state, patch, "laine_memory_anchor_obtained");
    addItemPatch(state, patch, "莱因的记忆锚点");
    lines.push(
      "莱因把识别牌放在火光里：“如果需要一个锚点，至少让留下的人知道自己为什么留下。”",
    );
  }
}

function resolveFortressEntry(
  state: GameState,
  patch: GameState,
  lines: string[],
  id: string,
  result: PostBlueShoalOutcome,
) {
  patch.fortress_entry_method = id;
  if (id === "enter_laine_password") {
    patch.fortress_entry_check_bonus = 2;
    setStoryFlag(state, patch, "laine_joined_final_chamber");
    if (result === "great" || result === "success")
      addDocumentPatch(state, patch, "doc_gate_access_log");
    lines.push(
      "莱因回答：“从断缆回到门前。”外环门禁核对他的声纹，承认第三远征队临时返航权限。",
    );
  }
  if (id === "enter_with_laine_badge") {
    if (result !== "failure" && result !== "critical") {
      addDocumentPatch(state, patch, "doc_gate_access_log");
      adjustScore(state, patch, "guardian_mercy_score", 1);
    } else if (result === "critical")
      patch.fortress_alert = Number(state.fortress_alert || 0) + 1;
    lines.push(
      "识别牌在门禁槽中亮起。即使权限残缺，它仍迫使伪造命令停顿了片刻。",
    );
  }
  if (
    id === "enter_with_black_cable_badge" &&
    (result === "great" || result === "success")
  ) {
    if (result === "great")
      addDocumentPatch(state, patch, "doc_gate_access_log");
    lines.push("门禁迟疑后承认了临时权限，正门无声滑开一道缝。");
  }
  if (id === "enter_maintenance_well") {
    if (result === "great") {
      addItemPatch(state, patch, "旧堡垒补给");
      trust(state, patch, "kaiya", 3);
    }
    if (result === "failure" || result === "critical")
      patch.party_fatigued = true;
    lines.push("队伍沿残图找到维护井，从堡垒侧腹进入。");
  }
  if (id === "enter_kaia_lock") {
    if (result === "great") {
      addItemPatch(state, patch, "堡垒侧门钥匙");
      trust(state, patch, "kaiya", 5);
    } else if (result === "critical") trust(state, patch, "kaiya", -2);
    lines.push("凯娅把最后一枚锁针压进旧锁，外墙暗门在灰尘中松开。");
  }
  if (id === "enter_force_wall") {
    patch.fortress_alert =
      Number(state.fortress_alert || 0) +
      (result === "failure" || result === "critical" ? 2 : 1);
    if (result === "great") trust(state, patch, "brock", 1);
    lines.push("菌丝墙被强行撕开，堡垒深处随即亮起警戒符文。");
  }
  if (id === "enter_outer_crack") {
    if (result === "failure" || result === "critical")
      patch.party_fatigued = true;
    else
      patch.fortress_alert = Math.max(0, Number(state.fortress_alert || 0) - 1);
    lines.push(
      "一条被地层运动撑开的旧裂缝通向内环，狭窄，却避开了大部分门禁。",
    );
  }
}

function resolveFortressInvestigation(
  state: GameState,
  patch: GameState,
  lines: string[],
  id: string,
  result: PostBlueShoalOutcome,
) {
  if (id === "investigate_seal_maintenance_room") {
    if (result !== "failure" && result !== "critical") {
      setStoryFlag(state, patch, "guardian_protocol_known");
      adjustScore(state, patch, "sealScore", 1);
      addItemPatch(state, patch, "守门者协议残页");
    }
    if (result !== "failure" && result !== "critical") {
      addDocumentPatch(state, patch, "doc_seal_maintenance_log");
      addCluePatch(state, patch, "clue_gatekeeper_not_evil");
      if (result === "great") patch.purification_core_prepared = true;
      trust(
        state,
        patch,
        "serin",
        result === "great" ? 5 : result === "success" ? 3 : 1,
      );
    } else if (result === "critical") patch.blackstone_headache = true;
    lines.push(
      "维护日志确认：黑石门卫是封印维护核心的执行体，而不是为杀戮制造的兵器。",
    );
  }
  if (id === "read_gatekeeper_protocol") {
    if (result === "great" || result === "success" || result === "partial") {
      setStoryFlag(state, patch, "guardian_protocol_known");
      addItemPatch(state, patch, "守门者协议残页");
      adjustScore(state, patch, "sealScore", 1);
    }
    if (result === "great") {
      setStoryFlag(state, patch, "guardian_name_known");
      addItemPatch(state, patch, "门卫真名拓片");
      adjustScore(state, patch, "truthScore", 1);
    }
    if (result === "great" || result === "success" || result === "partial") {
      addDocumentPatch(state, patch, "doc_gatekeeper_protocol");
      patch.gatekeeper_protocol_found = true;
      if (result === "great") patch.gatekeeper_true_name_known = true;
    } else if (result === "critical") patch.blackstone_headache = true;
    lines.push(
      "协议碑把同一个名字刻了三遍：阿格洛恩，古地底语意为“站在门前者”。",
    );
  }
  if (id === "enter_old_armory") {
    if (result === "great") {
      addItemPatch(state, patch, "符文护板");
      addItemPatch(state, patch, "黑石弩矢");
      trust(state, patch, "kaiya", 2);
    } else if (result === "success" || result === "partial")
      addItemPatch(
        state,
        patch,
        result === "partial" ? "不稳定封印照明弹" : "旧式治疗包",
      );
    else addItemPatch(state, patch, "旧堡垒材料");
    lines.push(
      "军械库里大多只剩锈蚀空架，但仍有少量封印战争时期的装备可以使用。",
    );
  }
  if (id === "watch_hero_oath_memory") {
    if (result !== "failure" && result !== "critical") {
      patch.hero_oath_memory_seen = true;
      addCluePatch(state, patch, "clue_gatekeeper_not_evil");
      if (result === "great") {
        trust(state, patch, "ailin", 4);
        trust(state, patch, "serin", 4);
      }
    }
    lines.push(
      "残影中的英雄把手按在黑石巨人额前：“你不需要赢，只需要记得自己为何不退。”巨人回答：“我记得。”",
    );
  }
  if (id === "purify_blackstone_core") {
    if (result === "great" || result === "success") {
      adjustScore(state, patch, "sealScore", 1);
      adjustScore(state, patch, "mercyScore", 1);
    }
    if (result === "great" || result === "success") {
      addItemPatch(state, patch, "净化黑石核心");
      trust(state, patch, "ailin", result === "great" ? 6 : 4);
      if (result === "great") trust(state, patch, "serin", 4);
    } else if (result === "partial")
      addItemPatch(state, patch, "不稳定净化核心");
    else if (result === "critical") patch.boss_pulse_empowered = true;
    lines.push(
      result === "great" || result === "success"
        ? "青绿净化光在核心内部稳定下来，为唤回守门者留下了真正的机会。"
        : "核心没有完全稳定，但残留反应仍被谨慎封存。",
    );
  }
}

function resolveEnding(
  state: GameState,
  patch: GameState,
  id: string,
) {
  const helpedLaine = Boolean(
    state.purification_heart_used_on_laine &&
    state.core_purification_known &&
    state.laine_alive &&
    state.laine_stabilized &&
    !state.laine_left_behind &&
    !state.laine_mercy_killed,
  );
  patch.lainHelped = helpedLaine;
  patch.helpedRhein = helpedLaine;
  patch.laine_helped_for_ending = helpedLaine;

  if (id === "stabilize_boss_core") {
    if (!helpedLaine) {
      // 没有净化之心救回莱因，就没有“核心可净化”的情报；非法或旧存档中的
      // 稳定指令不能绕过门槛，只能回到破坏核心的 D 结局。
      patch.bossCoreChoice = "destroy";
      return POST_BLUE_SHOAL_IDS.endingD;
    }
    patch.bossCoreChoice = "stabilize";
    return POST_BLUE_SHOAL_IDS.endingA;
  }

  patch.bossCoreChoice = "destroy";
  return helpedLaine ? POST_BLUE_SHOAL_IDS.endingB : POST_BLUE_SHOAL_IDS.endingD;
}

function countInventory(inventory: unknown, name: string) {
  return String(inventory || "")
    .split(",")
    .map((value) => value.trim())
    .filter(
      (value) =>
        value === name ||
        value.startsWith(`${name}x`) ||
        value.startsWith(`${name}×`),
    )
    .reduce((sum, value) => {
      const quantity = Number(value.match(/[x×](\d+)$/)?.[1] || 1);
      return sum + quantity;
    }, 0);
}

function advanceQuest(
  state: GameState,
  patch: GameState,
  objective: string,
  completed?: string,
) {
  const quest = state.questLog || {};
  const completedObjectives = Array.isArray(quest.completedObjectives)
    ? [...quest.completedObjectives]
    : [];
  if (completed && !completedObjectives.includes(completed))
    completedObjectives.push(completed);
  patch.questLog = {
    ...quest,
    mainQuest: "深入地底堡垒，阻止地心之门开启",
    currentObjective: objective,
    completedObjectives,
    updates: [
      ...(Array.isArray(quest.updates) ? quest.updates : []),
      {
        id: `post-blue-${Date.now()}`,
        title: "地心之门",
        objective,
        createdAt: new Date().toISOString(),
      },
    ],
  };
}
