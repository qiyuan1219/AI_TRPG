/**
 * 音效管理器 — 优先播放外部文件，缺失时回退 Web Audio API 合成
 *
 * 音效文件放入 public/assets/sounds/ ，命名：
 *
 *   dice.mp3          骰子音效
 *   verdict_crit.wav  大成功
 *   verdict_ok.wav    成功
 *   verdict_fail.wav  失败
 *   click.wav         按钮点击
 *
 * 用法：import { sfx } from '../utils/audio';  sfx.diceRoll();
 */

const SOUND_BASE = "/assets/sounds";
let _muted = false;

// 缓存已加载的 Audio 对象，避免重复创建
const _cache: Record<string, HTMLAudioElement> = {};

function tryPlay(path: string) {
  if (_muted) return;
  if (!_cache[path]) {
    _cache[path] = new Audio(path);
    _cache[path].volume = 0.85;
    _cache[path].preload = "auto";
  }
  const a = _cache[path];
  a.currentTime = 0;
  a.play().catch(() => {});
}

/* ---- 骰子音效 ---- */
export function playDiceRoll() {
  tryPlay(`${SOUND_BASE}/dice.mp3`);
}

export function playDiceStop() {
  // 统一用同一个 dice 音效
}

/* ---- 判定结果音效 ---- */
export function playVerdict(success: boolean, isCritical: boolean) {
  if (isCritical) {
    tryPlay(`${SOUND_BASE}/verdict_crit.wav`);
  } else if (success) {
    tryPlay(`${SOUND_BASE}/verdict_ok.wav`);
  } else {
    tryPlay(`${SOUND_BASE}/verdict_fail.wav`);
  }
}

/* ---- 点击/按钮 ---- */
export function playClick() {
  tryPlay(`${SOUND_BASE}/click.wav`);
}

/* ---- 静音 ---- */
export function mute() { _muted = true; }
export function unmute() { _muted = false; }
export function isMuted() { return _muted; }

export const sfx = {
  diceRoll: playDiceRoll,
  diceStop: playDiceStop,
  verdict: playVerdict,
  click: playClick,
  mute,
  unmute,
  isMuted,
};
