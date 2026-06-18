import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BattlePrepChoice, BattlePrepResolveResult, BattlePrepResultType } from '../utils/battlePrep';
import { evaluateCondition, getRerollItemQuantity, resolveBattlePrepChoice } from '../utils/battlePrep';
import type { DiceResult } from '../types/game';

interface BattlePrepPanelProps {
  choices: BattlePrepChoice[];
  gameState: any;
  onResolve: (choice: BattlePrepChoice, result: BattlePrepResolveResult) => void;
  onReroll: (itemId: 'fiction-dice' | 'omni-dice', chosenD20?: number) => void;
  onConfirm: () => void;
  onEnterBattle: () => void;
  resolvedResult: BattlePrepResolveResult | null;
  resolvedChoice: BattlePrepChoice | null;
  diceResult: DiceResult | null;
  narration?: string;
  narrationLoading?: boolean;
  canContinue?: boolean;
  continueLabel?: string;
}

function getChoiceStatus(choice: BattlePrepChoice, state: any): {
  isGreatSuccess: boolean;
  isAutoSuccess: boolean;
} {
  const isGreatSuccess =
    Boolean(choice.greatSuccessWhen) &&
    evaluateCondition(choice.greatSuccessWhen, state);
  const isAutoSuccess =
    Boolean(choice.alwaysSuccess) ||
    (Boolean(choice.autoSuccessWhen) &&
      evaluateCondition(choice.autoSuccessWhen, state));
  return { isGreatSuccess, isAutoSuccess };
}

function formatDiceText(roll?: BattlePrepResolveResult['roll']): string {
  if (!roll) return '';
  return `D20: ${roll.d20} + ${roll.modifier} = ${roll.total} / DC ${roll.dc}`;
}

function getResultLabel(result: BattlePrepResultType): string {
  switch (result) {
    case 'greatSuccess':
      return '大成功';
    case 'success':
      return '成功';
    case 'failed':
      return '失败';
  }
}

function getResultColor(result: BattlePrepResultType): string {
  switch (result) {
    case 'greatSuccess':
      return 'text-amber-400';
    case 'success':
      return 'text-emerald-400';
    case 'failed':
      return 'text-red-400';
  }
}

const BattlePrepPanel: React.FC<BattlePrepPanelProps> = ({
  choices,
  gameState,
  onResolve,
  onReroll,
  onConfirm,
  onEnterBattle,
  resolvedResult,
  resolvedChoice,
  diceResult,
  narration = '',
  narrationLoading = false,
  canContinue = true,
  continueLabel = '进入战斗',
}) => {
  const [selected, setSelected] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [showOmniPicker, setShowOmniPicker] = React.useState(false);
  const [chosenD20, setChosenD20] = React.useState(20);

  const handleSelect = (choice: BattlePrepChoice) => {
    if (selected || submitting) return;
    setSubmitting(true);
    setSelected(true);

    // 小型延迟让点击反馈可见
    setTimeout(() => {
      const result = resolveBattlePrepChoice(choice, gameState);
      onResolve(choice, result);
      setSubmitting(false);
    }, 300);
  };

  const statusMap = useMemo(
    () => new Map(choices.map((c) => [c.id, getChoiceStatus(c, gameState)])),
    [choices, gameState],
  );
  const check = resolvedResult?.storyCheck;
  const fictionQuantity = getRerollItemQuantity(gameState, 'fiction-dice');
  const omniQuantity = getRerollItemQuantity(gameState, 'omni-dice');
  const canReroll = Boolean(check && !check.rerollUsed && !check.finalized && resolvedChoice?.canUseRerollItems === true);

  return (
    <AnimatePresence mode="wait">
      {!resolvedResult ? (
        <motion.div
          key="choices"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="w-full max-w-3xl mx-auto px-4 py-6"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-amber-300 mb-2">
              战前行动
            </h2>
            <p className="text-sm text-gray-400">
              选择一项行动。系统会进行一次 D20 判定，判定结果会影响接下来的战斗。
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {choices.map((choice) => {
              const status = statusMap.get(choice.id)!;
              return (
                <motion.button
                  key={choice.id}
                  whileHover={{ scale: selected ? 1 : 1.02 }}
                  whileTap={{ scale: selected ? 1 : 0.98 }}
                  onClick={() => handleSelect(choice)}
                  disabled={selected || submitting}
                  className={`
                    relative p-4 rounded-xl border text-left transition-all duration-200
                    ${selected && !submitting ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                    ${status.isGreatSuccess
                      ? 'border-amber-500/60 bg-amber-500/10 hover:border-amber-400 hover:bg-amber-500/20'
                      : status.isAutoSuccess
                        ? 'border-emerald-500/40 bg-emerald-500/10 hover:border-emerald-400 hover:bg-emerald-500/15'
                        : 'border-slate-600/50 bg-slate-800/60 hover:border-slate-500 hover:bg-slate-700/60'}
                  `}
                >
                  {/* 状态标记 */}
                  {status.isGreatSuccess && (
                    <span className="absolute top-2 right-2 text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">
                      线索完整：大成功
                    </span>
                  )}
                  {status.isAutoSuccess && !status.isGreatSuccess && (
                    <span className="absolute top-2 right-2 text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                      {choice.alwaysSuccess ? '稳定成功' : '线索已掌握：自动成功'}
                    </span>
                  )}

                  <div className="flex items-start gap-3 pt-1">
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-base font-semibold mb-1.5 ${
                        status.isGreatSuccess ? 'text-amber-300' :
                        status.isAutoSuccess ? 'text-emerald-300' : 'text-slate-200'
                      }`}>
                        {choice.label}
                      </h3>
                      <p className="text-sm text-gray-400 mb-2 leading-relaxed">
                        {choice.desc}
                      </p>
                      {choice.check && !status.isAutoSuccess && !status.isGreatSuccess && (
                        <span className="text-xs text-amber-500/80 bg-amber-500/10 px-2 py-0.5 rounded">
                          {choice.check.label}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="result"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-3xl mx-auto px-4 py-6"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-amber-300 mb-2">
              战前行动
            </h2>
            <p className={`text-lg font-semibold ${getResultColor(resolvedResult.result)}`}>
              {getResultLabel(resolvedResult.result)}
              {resolvedResult.roll && (
                <span className="text-sm text-gray-400 ml-3">
                  ({formatDiceText(resolvedResult.roll)})
                </span>
              )}
            </p>
          </div>

          {check && (
            <div className="bg-slate-900/70 border border-slate-600/50 rounded-xl p-4 mb-4 space-y-2 text-sm">
              <p className="text-slate-300">初次判定：D20 {check.initialRoll.d20} + {check.modifier} = {check.initialRoll.total} / DC {check.dc}，{check.initialRoll.success ? '成功' : '失败'}</p>
              {check.reroll && <p className="text-amber-300">{check.reroll.itemId === 'fiction-dice' ? '虚构骰子' : '万能骰子'}：D20 {check.reroll.d20} + {check.modifier} = {check.reroll.total}，{check.reroll.success ? '成功' : '失败'}</p>}
              <p className="font-semibold text-white">最终采用：{check.finalRoll.total}，判定{check.finalRoll.success ? '成功' : '失败'}</p>
            </div>
          )}

          <div className="bg-slate-800/70 border border-slate-600/50 rounded-xl p-5 mb-6">
            {resolvedChoice && (
              <p className="text-xs text-amber-300 mb-3">
                {resolvedChoice.label}
              </p>
            )}
            <p className="text-xs uppercase tracking-[0.18em] text-gray-500 mb-2">判定结果</p>
            <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
              {resolvedResult.text}
            </p>
          </div>

          {resolvedResult.finalized && (
            <div className="bg-slate-900/80 border border-amber-500/30 rounded-xl p-5 mb-6">
              <p className="text-xs uppercase tracking-[0.18em] text-amber-400/70 mb-2">AI 续写</p>
              <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">
                {narrationLoading ? '主持人正在根据最终判定续写，请稍候……' : narration}
              </p>
            </div>
          )}

          {/* Dice overlay */}
          {diceResult && (
            <div className="flex justify-center mb-6">
              <div className="bg-slate-700/80 border border-amber-500/30 rounded-lg px-6 py-3 text-center">
                <span className="text-lg font-mono text-amber-300">
                  D20: {String(diceResult.data?.掷骰 || diceResult.data?.攻击掷骰 || diceResult.data?.结果 || '?')}
                </span>
              </div>
            </div>
          )}

          {!resolvedResult.finalized ? <div className="flex flex-wrap justify-center gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onConfirm}
              className="px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-amber-900/30 transition-colors"
            >
              确定
            </motion.button>
            {canReroll && <>
              <button type="button" disabled={fictionQuantity <= 0} onClick={() => onReroll('fiction-dice')}
                className="px-5 py-3 rounded-xl bg-indigo-700 disabled:bg-slate-700 disabled:text-slate-500 text-white">
                {fictionQuantity > 0 ? `使用虚构骰子（剩余 ${fictionQuantity}）` : '虚构骰子不足'}
              </button>
              <button type="button" disabled={omniQuantity <= 0} onClick={() => setShowOmniPicker(true)}
                className="px-5 py-3 rounded-xl bg-violet-700 disabled:bg-slate-700 disabled:text-slate-500 text-white">
                {omniQuantity > 0 ? `使用万能骰子（剩余 ${omniQuantity}）` : '万能骰子不足'}
              </button>
            </>}
          </div> : <div className="text-center">
            <motion.button whileHover={canContinue ? { scale: 1.03 } : undefined} whileTap={canContinue ? { scale: 0.97 } : undefined}
              disabled={!canContinue} onClick={onEnterBattle}
              className="px-8 py-3 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-700 disabled:text-slate-400 text-white rounded-xl font-bold text-lg">
              {narrationLoading ? '等待 AI 续写完成…' : continueLabel}
            </motion.button>
          </div>}

          {showOmniPicker && (
            <div className="fixed inset-0 z-[60] grid place-items-center bg-black/75" onClick={() => setShowOmniPicker(false)}>
              <div className="w-[min(92vw,28rem)] rounded-2xl border border-violet-500/50 bg-slate-900 p-6" onClick={(event) => event.stopPropagation()}>
                <h3 className="text-xl font-bold text-violet-300 mb-2">使用万能骰子</h3>
                <p className="text-sm text-slate-400 mb-4">请选择本次剧情判定的 D20 点数（1~20）。确认后消耗 1 个万能骰子。</p>
                <div className="flex gap-2 mb-4">{[1, 5, 10, 15, 20].map((value) => <button key={value} className="flex-1 rounded bg-slate-700 py-2" onClick={() => setChosenD20(value)}>{value}</button>)}</div>
                <input className="w-full rounded bg-slate-800 border border-slate-600 p-3 mb-4" type="number" min={1} max={20} value={chosenD20} onChange={(e) => setChosenD20(Number(e.target.value))} />
                <div className="flex justify-end gap-3"><button onClick={() => setShowOmniPicker(false)}>取消</button><button className="rounded bg-violet-600 px-4 py-2" onClick={() => { onReroll('omni-dice', chosenD20); setShowOmniPicker(false); }}>确认点数</button></div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BattlePrepPanel;
