import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ActionPanel } from './ActionPanel';
import { BattleTestScreen, type BattleConfig, type BattleResult } from './BattleTestScreen';
import { DialogueLog } from './DialogueLog';
import { DiceRollOverlay } from './DiceRollOverlay';
import { VisualNovelStage } from './VisualNovelStage';
import type { EventFeedItem } from './EventFeed';
import {
  chatCompanionSideEvent,
  chooseCompanionSideEvent,
  completeCompanionSideEventBattle,
  getCompanionSideEventFeedback,
  startCompanionSideEvent,
  type CompanionSideEventChoice,
  type CompanionSideEventChoiceResult,
  type CompanionSideEventInfo,
  type CompanionSideEventState,
} from '../services/api';
import type { ActionSuggestion, DiceResult, SceneVisual, StoryLine } from '../types/game';

export interface CompanionEventCompleteResult {
  event: CompanionSideEventInfo;
  state: CompanionSideEventState;
}

interface CompanionEventTestScreenProps {
  onBack: () => void;
  onComplete?: (result: CompanionEventCompleteResult) => void;
  eventId?: string;
  initialTrust?: number;
  playerName?: string;
  returnLabel?: string;
  testMode?: boolean;
}

type RuntimePhase = 'narrating' | 'action' | 'battle';

const PHASE_LABELS: Record<CompanionSideEventState['phase'], string> = {
  opening: '支线开端',
  crisis: '危机处理中',
  battle_pending: '支线战斗',
  dialogue: '自由交谈',
};

const ECHO_FOREST_SCENE: SceneVisual = {
  id: 'companion-echo-forest',
  title: '回声菌林',
  subtitle: '同伴支线 / 第一幕',
  aliases: ['回声菌林', '地心之门'],
  themeClass: 'scene-maze',
};

const FREE_CHAT_SUGGESTIONS: ActionSuggestion[] = [
  { id: 'block-past', label: '问问布洛克以前是做什么的', text: '问问布洛克以前是做什么的' },
  { id: 'burn-forest', label: '问问为什么不能直接烧掉菌林', text: '问问为什么不能直接烧掉菌林' },
  { id: 'spore-morality', label: '问问孢海生态有没有善恶', text: '问问孢海生态有没有善恶' },
  { id: 'wetland-risk', label: '问问骨柱湿地接下来有什么风险', text: '问问骨柱湿地接下来有什么风险' },
  { id: 'end-side-quest', label: '没有什么想问的了，我们继续前进吧', text: '没有什么想问的了' },
];

const BLOCK_ECHO_FOREST_BATTLE_CONFIG: BattleConfig = {
  units: [
    {
      id: 'side-adventurer',
      name: '冒险者',
      faction: 'ally',
      role: '战士 Lv.3 / 前排护卫',
      portrait: '冒',
      model: 'adventurer',
      hp: 30,
      maxHp: 30,
      ac: 18,
      speed: 30,
      proficiency: 2,
      abilities: { str: 16, dex: 13, con: 15, int: 10, wis: 12, cha: 8 },
      resourceProfile: ['攻击', '护卫', '治疗'],
      statuses: ['前排'],
      traits: ['HP30/AC18', '护住布洛克'],
      skills: [
        { id: 'adv-cleave', name: '稳步斩击', resource: '战斗技能', source: '职业技能', formula: 'STR+熟练 vs AC；1d8+3', effect: '压制污染藤蔓', cooldown: '每回合1次', rule: '攻击检定', roll: { kind: 'attack', ability: 'str', targetAc: 13, label: '稳步斩击' }, tags: ['攻击'] },
        { id: 'adv-guard', name: '盾牌压制', resource: '战斗技能', source: '职业技能', formula: 'STR运动 DC13；1d4+3', effect: '挡住拟声孢群', cooldown: '每回合1次', rule: '技能检定', roll: { kind: 'ability', ability: 'str', dc: 13, label: '盾牌压制' }, tags: ['检定'] },
        { id: 'adv-breath', name: '回气', resource: '战斗技能', source: '职业技能', formula: '恢复1d8+3', effect: '稳定呼吸，抵抗孢粉', cooldown: '每战斗1次', rule: '治疗骰', roll: { kind: 'healing', dieType: 'd8', diceCount: 1, bonus: 3, label: '回气' }, tags: ['治疗'] },
      ],
      nonCombatSkills: [],
    },
    {
      id: 'side-block',
      name: '布洛克·铁锅',
      faction: 'ally',
      role: '矮人·孢海生态专家',
      portrait: '锅',
      model: 'senluo',
      hp: 42,
      maxHp: 42,
      ac: 16,
      speed: 25,
      proficiency: 2,
      abilities: { str: 16, dex: 12, con: 16, int: 10, wis: 15, cha: 8 },
      resourceProfile: ['攻击', '治疗', '净化'],
      statuses: ['净化菌核'],
      traits: ['HP42/AC16', '铁锅护身'],
      skills: [
        { id: 'block-pan', name: '铁锅猛击', resource: '战斗技能', source: '队友技能', formula: 'STR+熟练 vs AC；1d8+3钝击', effect: '敲散拟声孢群', cooldown: '每回合1次', rule: '攻击检定', roll: { kind: 'attack', ability: 'str', targetAc: 13, label: '铁锅猛击' }, tags: ['攻击'] },
        { id: 'block-soup', name: '暖孢浓汤', resource: '战斗技能', source: '队友技能', formula: '恢复2d6+3', effect: '用药汤稳住队友呼吸', cooldown: '每战斗2次', rule: '治疗骰', roll: { kind: 'healing', dieType: 'd6', diceCount: 2, bonus: 3, label: '暖孢浓汤' }, tags: ['治疗'] },
        { id: 'block-powder', name: '净化粉爆散', resource: '战斗技能', source: '队友技能', formula: '范围CON豁免DC14；2d6净化', effect: '压制污染菌核', cooldown: '每战斗1次', rule: '范围豁免', roll: { kind: 'save', dc: 14, targetSaveBonus: 2, label: '净化粉爆散' }, tags: ['范围'] },
      ],
      nonCombatSkills: [],
    },
    {
      id: 'echo-spore-swarm',
      name: '拟声孢群',
      faction: 'enemy',
      role: '孢海诱捕群',
      portrait: '孢',
      model: 'crawler',
      hp: 24,
      maxHp: 24,
      ac: 13,
      speed: 25,
      proficiency: 2,
      abilities: { str: 8, dex: 14, con: 12, int: 4, wis: 10, cha: 5 },
      resourceProfile: ['拟声', '孢尘'],
      statuses: ['模仿呼救'],
      traits: ['HP24/AC13'],
      skills: [
        { id: 'spore-bite', name: '拟声扑咬', resource: '战斗技能', source: '敌方技能', formula: 'DEX+熟练 vs AC；1d4+2', effect: '干扰队伍阵型', cooldown: '每回合1次', rule: '攻击检定', roll: { kind: 'attack', ability: 'dex', targetAc: 16, label: '拟声扑咬' }, tags: ['攻击'] },
        { id: 'spore-dust', name: '迷向孢尘', resource: '战斗技能', source: '敌方技能', formula: 'CON豁免DC12；1d4毒素', effect: '孢粉压迫呼吸', cooldown: '每回合1次', rule: '豁免技能', roll: { kind: 'save', dc: 12, targetSaveBonus: 2, label: '迷向孢尘' }, tags: ['豁免'] },
      ],
      nonCombatSkills: [],
    },
    {
      id: 'tainted-vines',
      name: '污染藤蔓',
      faction: 'enemy',
      role: '菌丝缠绕体',
      portrait: '藤',
      model: 'crawler',
      hp: 30,
      maxHp: 30,
      ac: 12,
      speed: 15,
      proficiency: 2,
      abilities: { str: 14, dex: 10, con: 14, int: 3, wis: 9, cha: 4 },
      resourceProfile: ['缠绕', '拖拽'],
      statuses: ['污染'],
      traits: ['HP30/AC12'],
      skills: [
        { id: 'vine-whip', name: '藤蔓抽打', resource: '战斗技能', source: '敌方技能', formula: 'STR+熟练 vs AC；1d6+2', effect: '抽打前排', cooldown: '每回合1次', rule: '攻击检定', roll: { kind: 'attack', ability: 'str', targetAc: 16, label: '藤蔓抽打' }, tags: ['攻击'] },
        { id: 'vine-bind', name: '菌丝缠腿', resource: '战斗技能', source: '敌方技能', formula: 'DEX豁免DC12；1d4污染', effect: '拖慢队伍', cooldown: '每回合1次', rule: '豁免技能', roll: { kind: 'save', dc: 12, targetSaveBonus: 2, label: '菌丝缠腿' }, tags: ['豁免'] },
      ],
      nonCombatSkills: [],
    },
    {
      id: 'tainted-core',
      name: '污染菌核',
      faction: 'enemy',
      role: '支线核心目标',
      portrait: '核',
      model: 'crawler',
      hp: 34,
      maxHp: 34,
      ac: 14,
      speed: 0,
      proficiency: 2,
      abilities: { str: 10, dex: 8, con: 16, int: 4, wis: 12, cha: 6 },
      resourceProfile: ['污染脉冲', '孢粉爆发'],
      statuses: ['核心'],
      traits: ['HP34/AC14', '击破后支线胜利'],
      skills: [
        { id: 'core-pulse', name: '污染脉冲', resource: '战斗技能', source: '敌方技能', formula: 'CON豁免DC13；1d6毒素', effect: '污染脉冲扩散', cooldown: '每回合1次', rule: '豁免技能', roll: { kind: 'save', dc: 13, targetSaveBonus: 2, label: '污染脉冲' }, tags: ['豁免'] },
        { id: 'core-harden', name: '菌壳收缩', resource: '战斗技能', source: '敌方技能', formula: '剧情防御', effect: '收缩菌壳防御', cooldown: '剧情', rule: '行为', roll: { kind: 'none' }, tags: ['行为'] },
      ],
      nonCombatSkills: [],
    },
  ],
  quickRules: [
    { title: '目标', text: '击败污染菌核和护卫孢群，战斗胜利后支线进入结算。' },
    { title: '布洛克', text: '布洛克可攻击、治疗，也能用净化粉压制污染。' },
    { title: '节奏', text: '本场沿用现有测试战斗规则：先攻、选技能、指定目标、掷骰结算。' },
  ],
  eyebrow: 'SIDE EVENT COMBAT',
  title: '回声菌林清剿战',
  subtitle: '冒险者与布洛克压制拟声孢群、污染藤蔓和污染菌核。',
  backLabel: '返回支线',
  rerollLog: '支线战斗重置：重新投先攻并恢复双方生命值。',
  initialLog: '布洛克锁定污染菌核，拟声孢群和藤蔓同时围上来。',
  initiativeNote: '5 位单位同时进行 1D20 先攻判定，数值最高者先行动。',
  winTitle: '污染菌核被压制',
  loseTitle: '队伍被孢粉逼退',
  winText: '污染菌核失去活性，布洛克抓住机会开始净化菌林。',
  loseText: '孢粉逼退了队伍，布洛克勉强救场，但污染已经加重。',
  completeLabel: '回到支线',
};

function choiceLabel(choice: CompanionSideEventChoice) {
  const check = choice.check ? `【${choice.check.label}DC${choice.check.dc}】` : '';
  return `${choice.label}${check}`;
}

function splitFeedback(text: string) {
  return text
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}|\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function SideEventStatusPanel({
  event,
  state,
}: {
  event: CompanionSideEventInfo | null;
  state: CompanionSideEventState | null;
}) {
  if (!event || !state) return null;

  const threatPercent = Math.max(0, Math.min(100, (state.threat / Math.max(state.max_threat, 1)) * 100));
  const trustPercent = Math.max(0, Math.min(100, state.trust));
  const phaseLabel = PHASE_LABELS[state.phase] || '支线进行中';

  return (
    <aside className="side-event-status" aria-label="当前支线状态">
      <header>
        <small>当前支线同伴</small>
        <strong>{event.companion.name}</strong>
        <span>{phaseLabel}</span>
      </header>

      <div className="side-event-meter">
        <div>
          <span>布洛克信任</span>
          <b>
            {state.trust}（{state.trust_band}）
          </b>
        </div>
        <i style={{ width: `${trustPercent}%` }} />
      </div>

      <div className="side-event-meter side-event-threat">
        <div>
          <span>菌林威胁</span>
          <b>
            {state.threat}/{state.max_threat}
          </b>
        </div>
        <i style={{ width: `${threatPercent}%` }} />
      </div>

      <div className="side-event-stat-row">
        <span>孢子污染</span>
        <b>{state.contamination}</b>
      </div>

      <div className="side-event-rewards">
        <span>支线奖励</span>
        {state.rewards.length ? (
          <div>
            {state.rewards.map((reward) => (
              <b key={reward}>{reward}</b>
            ))}
          </div>
        ) : (
          <em>尚未获得</em>
        )}
      </div>
    </aside>
  );
}

export function CompanionEventTestScreen({
  onBack,
  onComplete,
  eventId = 'ailin_wounded_names',
  initialTrust = 55,
  playerName = '玩家',
  returnLabel = '返回测试',
  testMode = true,
}: CompanionEventTestScreenProps) {
  const nextLineId = useRef(1);
  const nextEventId = useRef(1);
  const completionNotifiedRef = useRef(false);
  const [sessionId, setSessionId] = useState('');
  const [event, setEvent] = useState<CompanionSideEventInfo | null>(null);
  const [state, setState] = useState<CompanionSideEventState | null>(null);
  const [story, setStory] = useState<StoryLine[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [phase, setPhase] = useState<RuntimePhase>('narrating');
  const [sideQuestEnded, setSideQuestEnded] = useState(false); // 支线已结束，等待回退
  const [events, setEvents] = useState<EventFeedItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [showDialogueLog, setShowDialogueLog] = useState(false);
  const [activeDice, setActiveDice] = useState<DiceResult | null>(null);
  const [pendingFeedback, setPendingFeedback] = useState<CompanionSideEventChoiceResult | null>(null);

  useEffect(() => {
    void restart();
  }, []);

  const currentLine = story[activeIndex];
  const canAdvance = activeIndex < story.length - 1;

  const suggestions = useMemo<ActionSuggestion[]>(() => {
    if (!state) return [];
    if (state.phase === 'dialogue') return FREE_CHAT_SUGGESTIONS;
    return state.choices.map((choice) => ({
      id: choice.id,
      label: choiceLabel(choice),
      text: choice.id,
    }));
  }, [state]);

  function makeLine(role: StoryLine['role'], speaker: string, text: string): StoryLine {
    const id = nextLineId.current;
    nextLineId.current += 1;
    return { id, role, speaker, text };
  }

  function addEvent(text: string, tone: EventFeedItem['tone'] = 'state') {
    const id = nextEventId.current;
    nextEventId.current += 1;
    setEvents((prev) => [...prev.slice(-5), { id, text, tone }]);
  }

  function summarizeState(nextState: CompanionSideEventState) {
    if (nextState.rewards.length) addEvent('支线奖励已更新', 'state');
  }

  function appendPhaseGuide(result: CompanionSideEventChoiceResult) {
    if (result.state.phase === 'dialogue') {
      setStory((prev) => [
        ...prev,
        makeLine(
          'kp',
          result.event.companion.name,
          `${result.event.free_chat_prompt} 现在你可以与布洛克自由交谈，AI 会根据你说的话返回内容。`,
        ),
      ]);
      return;
    }

    if (result.state.phase === 'crisis') {
      addEvent(`危机仍在继续：当前第 ${Math.min(result.state.round + 1, 3)}/3 次危机行动。`, 'state');
    }

    if (result.state.phase === 'battle_pending') {
      setStory((prev) => [
        ...prev,
        makeLine('kp', result.event.companion.name, '污染菌核已经暴露。准备进入支线战斗，击败它后布洛克才能完成净化。'),
      ]);
      addEvent('支线战斗即将开始', 'state');
    }
  }

  function appendFeedback(text: string, companionName: string) {
    const paragraphs = splitFeedback(text);
    if (!paragraphs.length) return;

    setStory((prev) => {
      const next = [...prev];
      paragraphs.forEach((paragraph, index) => {
        next.push(makeLine('kp', index === 0 ? '主持人' : companionName, paragraph));
      });
      return next;
    });
  }

  async function restart() {
    setBusy(true);
    completionNotifiedRef.current = false;
    setSideQuestEnded(false);
    setActiveDice(null);
    setPendingFeedback(null);
    setEvents([]);
    try {
      const result = await startCompanionSideEvent(eventId, initialTrust);
      setSessionId(result.session_id);
      setEvent(result.event);
      setState(result.state);
      setStory([makeLine('kp', '主持人', result.event.opening)]);
      setActiveIndex(0);
      setPhase('action');
      addEvent(testMode ? '支线测试已开始' : '同伴支线已开始', 'state');
      summarizeState(result.state);
    } catch (err: any) {
      setStory([makeLine('system', '系统', err?.message || '支线事件启动失败')]);
      setPhase('narrating');
      addEvent(err?.message || '支线事件启动失败', 'error');
    } finally {
      setBusy(false);
    }
  }

  async function choose(choice: CompanionSideEventChoice) {
    if (!sessionId || busy) return;
    setBusy(true);
    setPhase('narrating');
    setStory((prev) => {
      const next = [...prev, makeLine('player', playerName, choice.label)];
      setActiveIndex(next.length - 1);
      return next;
    });

    try {
      const result = await chooseCompanionSideEvent(sessionId, choice.id, false);
      setEvent(result.event);
      setState(result.state);
      summarizeState(result.state);
      if (result.outcome.roll) {
        setActiveDice({
          type: 'skill_check',
          data: {
            ...result.outcome.roll,
            属性: result.outcome.roll['属性'] ?? result.outcome.roll['检定'] ?? '支线检定',
            id: Date.now(),
          },
        });
        addEvent(
          `${result.outcome.roll['检定'] ?? '支线检定'} ${result.outcome.roll['总计']} / DC ${result.outcome.roll['DC']}`,
          'dice',
        );
        setPendingFeedback(result);
        return;
      }
      await loadChoiceFeedback(result);
    } catch (err: any) {
      addEvent(err?.message || '支线选择结算失败', 'error');
      setStory((prev) => [...prev, makeLine('system', '系统', err?.message || '支线选择结算失败')]);
      setBusy(false);
    }
  }

  async function loadChoiceFeedback(fallbackResult: CompanionSideEventChoiceResult) {
    if (!sessionId) return;
    setBusy(true);
    try {
      const result = await getCompanionSideEventFeedback(sessionId);
      setEvent(result.event);
      setState(result.state);
      appendFeedback(result.feedback, result.event.companion.name);
      appendPhaseGuide(result);
    } catch (err: any) {
      addEvent(err?.message || '支线反馈生成失败', 'error');
      appendFeedback(fallbackResult.outcome.phase_note, fallbackResult.event.companion.name);
      appendPhaseGuide(fallbackResult);
    } finally {
      setPendingFeedback(null);
      setBusy(false);
    }
  }

  async function sendChat(message: string) {
    const content = message.trim();
    if (!content || !sessionId || busy) return;
    if (state?.phase !== 'dialogue') {
      addEvent('当前阶段请先使用下方支线选项。', 'error');
      return;
    }

    setBusy(true);
    setPhase('narrating');
    setStory((prev) => {
      const next = [...prev, makeLine('player', playerName, content)];
      setActiveIndex(next.length - 1);
      return next;
    });

    try {
      const result = await chatCompanionSideEvent(sessionId, content);
      setState(result.state);
      setStory((prev) => [...prev, makeLine('kp', event?.companion.name || '布洛克·铁锅', result.reply)]);
    } catch (err: any) {
      addEvent(err?.message || '支线自由对话失败', 'error');
      setStory((prev) => [...prev, makeLine('system', '系统', err?.message || '支线自由对话失败')]);
    } finally {
      setBusy(false);
    }
  }

  async function completeBattle(result?: BattleResult) {
    if (!sessionId || busy) return;
    const outcome = result?.outcome ?? 'lose';
    setBusy(true);
    setPhase('narrating');
    setStory((prev) => {
      const next = [
        ...prev,
        makeLine('system', '系统', outcome === 'win' ? '支线战斗胜利，返回回声菌林。' : '支线战斗失败，返回回声菌林。'),
      ];
      setActiveIndex(next.length - 1);
      return next;
    });

    try {
      const battleResult = await completeCompanionSideEventBattle(sessionId, outcome);
      setEvent(battleResult.event);
      setState(battleResult.state);
      appendFeedback(battleResult.feedback, battleResult.event.companion.name);
      if (battleResult.state.phase === 'dialogue') {
        setStory((prev) => [
          ...prev,
          makeLine(
            'kp',
            battleResult.event.companion.name,
            `${battleResult.event.free_chat_prompt} 现在你可以与布洛克自由交谈，AI 会根据你说的话返回内容。`,
          ),
        ]);
      }
      summarizeState(battleResult.state);
    } catch (err: any) {
      addEvent(err?.message || '支线战斗结算失败', 'error');
      setStory((prev) => [...prev, makeLine('system', '系统', err?.message || '支线战斗结算失败')]);
    } finally {
      setBusy(false);
    }
  }

  function submitAction(text: string) {
    // 选择"没有什么想问的了" → 结束支线
    if (state?.phase === 'dialogue' && /没有什么想问/.test(text)) {
      endSideQuest();
      return;
    }
    const matchedChoice = state?.choices.find((choice) => choice.id === text || choice.label === text);
    if (matchedChoice) {
      void choose(matchedChoice);
      return;
    }
    void sendChat(text);
  }

  /**
   * 结束支线任务：发送告别语 → AI 回应 → 返回上级
   */
  async function endSideQuest() {
    if (!sessionId || busy) return;
    setBusy(true);
    setPhase('narrating');
    const goodbyeMsg = '暂时就这些了，我们继续前进吧';
    setStory((prev) => {
      const next = [...prev, makeLine('player', playerName, goodbyeMsg)];
      setActiveIndex(next.length - 1);
      return next;
    });

    try {
      const result = await chatCompanionSideEvent(sessionId, goodbyeMsg);
      const companionName = event?.companion.name || '同伴';
      const farewell = result.reply
        ? `${result.reply}\n\n——支线任务「${event?.title || '同伴支线'}」结束——`
        : `"嗯，走吧。" 布洛克扛起铁锅，朝骨柱湿地的方向点了点头。\n\n——支线任务「回声菌林的求救声」结束——`;
      setStory((prev) => [...prev, makeLine('kp', companionName, farewell)]);
    } catch {
      setStory((prev) => [
        ...prev,
        makeLine('kp', '布洛克·铁锅', '"走吧，前面的路还长。"\n\n——支线任务「回声菌林的求救声」结束——'),
      ]);
    } finally {
      setBusy(false);
      setSideQuestEnded(true);
    }
  }

  function advanceLine() {
    setActiveIndex((index) => {
      const next = Math.min(index + 1, story.length - 1);
      if (sideQuestEnded && next >= story.length - 1) {
        // 支线结束后，看完告别语自动返回
        if (onComplete && event && state && !completionNotifiedRef.current) {
          completionNotifiedRef.current = true;
          onComplete({ event, state });
        }
        setTimeout(() => onBack(), 500);
        return story.length - 1;
      }
      if (next >= story.length - 1) {
        setPhase(state?.phase === 'battle_pending' ? 'battle' : 'action');
      }
      return next;
    });
  }

  function closeDice() {
    setActiveDice(null);
    if (pendingFeedback) {
      void loadChoiceFeedback(pendingFeedback);
    }
  }

  function actionHelperText() {
    if (state?.phase === 'dialogue') return '现在你可以与布洛克自由交谈，点击提示语可填入输入框。';
    if (state?.phase === 'crisis') {
      return `危机战斗：将威胁降至 0，或完成 3 次行动后结算。当前第 ${Math.min(state.round + 1, 3)}/3 次危机行动，保护布洛克推进最快。`;
    }
    return undefined;
  }

  const actionPanel = phase === 'action' && activeIndex >= story.length - 1 ? (
    <ActionPanel
      suggestions={suggestions}
      disabled={busy}
      onSubmit={submitAction}
      placeholder={state?.phase === 'dialogue' ? '问布洛克关于菌林、过去或骨柱湿地的事' : undefined}
      helperText={actionHelperText()}
      suggestionMode={state?.phase === 'dialogue' ? 'fill' : 'submit'}
    />
  ) : undefined;

  if (phase === 'battle' && state?.phase === 'battle_pending') {
    return (
      <BattleTestScreen
        mode="side-event"
        battleConfigOverride={BLOCK_ECHO_FOREST_BATTLE_CONFIG}
        onBack={() => setPhase('action')}
        onComplete={completeBattle}
      />
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="vn-app companion-event-screen">
      <VisualNovelStage
        scene={ECHO_FOREST_SCENE}
        line={currentLine}
        events={events}
        isStreaming={busy}
        isActionPhase={phase === 'action' && activeIndex >= story.length - 1}
        canAdvance={phase !== 'action' && canAdvance}
        onAdvance={advanceLine}
        actionPanel={actionPanel}
      />

      <DiceRollOverlay dice={activeDice} dieType="d20" onClose={closeDice} />

      <SideEventStatusPanel event={event} state={state} />

      <div className="game-top-actions">
        <button type="button" className="game-log-btn" onClick={() => setShowDialogueLog(true)}>
          📜 对话日志
        </button>
        <button type="button" className="game-title-btn" onClick={onBack}>
          {returnLabel}
        </button>
        {testMode && (
          <button type="button" className="game-save-btn" onClick={restart} disabled={busy}>
            重开支线
          </button>
        )}
      </div>

      <AnimatePresence>
        {showDialogueLog && (
          <DialogueLog
            story={story}
            activeIndex={activeIndex}
            isStreaming={busy}
            onClose={() => setShowDialogueLog(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
