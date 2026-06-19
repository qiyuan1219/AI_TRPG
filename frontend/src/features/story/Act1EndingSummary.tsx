import './Act1EndingSummary.css';

interface Act1EndingSummaryProps {
  endingId?: string;
  onReturnTitle: () => void;
}

const ENDINGS: Record<string, { code: string; title: string; lines: string[] }> = {
  'guardian-remains': {
    code: 'A',
    title: '守门者仍在',
    lines: [
      '你救下了莱因，也让失控的黑石门卫重新沉眠。',
      '旧防线没有被彻底摧毁，而是为你们留下了关于“门开错了”的关键证词。',
    ],
  },
  'wounded-through-gate': {
    code: 'B',
    title: '带伤者穿门',
    lines: [
      '你强行击碎了黑石门卫的核心，却没有丢下莱因。',
      '黑暗之门在震动中开启，队伍带着幸存者和更沉重的风险继续前进。',
    ],
  },
  'cold-expedition': {
    code: 'C',
    title: '冷静的远征',
    lines: [
      '你没有停下救助莱因，但谨慎地稳定了黑石门卫的核心。',
      '远征得以平稳推进，只是那位堡垒幸存者的声音永远留在了黑根深处。',
    ],
  },
  'gate-split-open': {
    code: 'D',
    title: '裂门而下',
    lines: [
      '你无视莱因，也选择强行破坏黑石门卫核心。',
      '黑暗之门被粗暴撕开，队伍获得了前进道路，却失去了最多线索与余地。',
    ],
  },
};

export function Act1EndingSummary({ endingId, onReturnTitle }: Act1EndingSummaryProps) {
  const ending = ENDINGS[String(endingId || '')] || ENDINGS['guardian-remains'];

  return (
    <main className="act1-ending-summary">
      <div className="act1-ending-summary__glow" aria-hidden="true" />
      <section className="act1-ending-summary__card" aria-label={`达成结局 ${ending.code}：${ending.title}`}>
        <p className="act1-ending-summary__eyebrow">THE EARTHCORE GATE</p>
        <h1>第一幕结束</h1>
        <div className="act1-ending-summary__rule" />
        <p className="act1-ending-summary__achieved">达成结局 {ending.code}</p>
        <h2>结局 {ending.code}：{ending.title}</h2>
        <div className="act1-ending-summary__copy">
          {ending.lines.map((line) => <p key={line}>{line}</p>)}
        </div>
        <button type="button" onClick={onReturnTitle}>返回标题界面</button>
      </section>
    </main>
  );
}

