import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";
import { sfx } from "../utils/audio";
import { SkillEffectOverlay, inferSkillEffect } from "./SkillEffectOverlay";
import type { SkillEffectConfig } from "./SkillEffectOverlay";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { LineSegments2 } from "three/examples/jsm/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry.js";
import type { DiceResult } from "../types/game";
import type { DiceEventType } from "../core/events/GameEvent";

export type DieType = "d4" | "d6" | "d8" | "d10" | "d12" | "d20";

export interface DiceRollOverlayProps {
  dice: DiceResult | null;
  dieType?: DieType;
  onClose: () => void;
  attackMode?: boolean;
  attackMissed?: boolean;
  targetAc?: number;
  diceKind?: string;        // "命中判定" / "伤害掷骰" / "治疗掷骰" / "检定" 等
  charSkill?: string;        // "艾琳 · 白枝护盾"
  showD20Calc?: boolean;    // 命中骰时显示 D20+加值=总计 vs AC
  rerollDecision?: {
    fictionQuantity: number;
    omniQuantity: number;
    rerollUsed: boolean;
    onConfirm: () => void;
    onUseFiction: () => void;
    onUseOmni: (chosenD20: number) => void;
    omniMax?: number;
  };
  comparisonRolls?: {
    initial: number;
    reroll: number;
    selected: 'initial' | 'reroll';
  };
}

export interface Dice3DViewProps {
  dieType?: DieType;
  roll?: number | null;
  rolling?: boolean;
  revealed?: boolean;
  size?: number;
  className?: string;
  faceStyle?: "numbers" | "pips";
  showResultBadge?: boolean;
  variant?: "attack" | "default";
}

const DIE_SIDES: Record<DieType, number> = {
  d4: 4,
  d6: 6,
  d8: 8,
  d10: 10,
  d12: 12,
  d20: 20,
};

function normalizeAbilityLabel(raw: string): string {
  const value = raw.trim().toLowerCase().replace(/[【】\[\]_\s-]/g, '');
  if (!value) return '';
  const aliases: Array<[RegExp, string]> = [
    [/^(str|strength|力量|athletics|运动)$/, '力量'],
    [/^(dex|dexterity|敏捷|acrobatics|sleightofhand|stealth|体操|巧手|隐匿)$/, '敏捷'],
    [/^(con|constitution|体质)$/, '体质'],
    [/^(int|intelligence|智力|arcana|history|investigation|nature|religion|奥秘|历史|调查|自然|宗教)$/, '智力'],
    [/^(wis|wisdom|感知|perception|insight|medicine|survival|animalhandling|察觉|洞悉|医药|求生|驯兽)$/, '感知'],
    [/^(cha|charisma|魅力|deception|intimidation|performance|persuasion|欺瞒|威吓|表演|游说)$/, '魅力'],
  ];
  return aliases.find(([pattern]) => pattern.test(value))?.[1] ?? raw.replace(/[【】\[\]]/g, '');
}

function diceSizeForCount(count: number): number {
  if (count <= 1) return 220;
  if (count === 2) return 170;
  if (count === 3) return 140;
  return 120;
}

interface FormattedDiceResult {
  dieLabel: string;
  roll: string;
  total: string;
  dc?: string;
  success?: boolean;
  attr?: string;
  verdict?: string;
  eventType?: DiceEventType;
  formula?: string;
  rolls?: number[];
  modifier?: number;
  /** 纯伤害/治疗骰多骰子（dice_test类型） */
  multiDice?: { count: number; dieType: DieType; rolls: number[] };
  /** attack_roll / skill_check 附带的伤害骰 */
  damageDice?: { count: number; dieType: DieType; rolls: number[]; bonus: number; total: number };
  /** 优势/劣势双 D20 */
  advDice?: { type: "advantage" | "disadvantage"; rolls: [number, number] };
}

function dieTypeFromDice(dice: DiceResult, fallback: DieType): DieType {
  const canonical = dice.event?.diceSides;
  if (canonical && [4, 6, 8, 10, 12, 20].includes(canonical)) return `d${canonical}` as DieType;
  const raw = String(dice.data["骰子"] ?? dice.data.die ?? fallback).toLowerCase();
  if (raw.includes("d4")) return "d4";
  if (raw.includes("d6")) return "d6";
  if (raw.includes("d8")) return "d8";
  if (raw.includes("d10")) return "d10";
  if (raw.includes("d12")) return "d12";
  if (raw.includes("d20")) return "d20";
  return fallback;
}

function extractAdvDice(d: Record<string, any>): FormattedDiceResult["advDice"] {
  const type = d["优势掷骰"];
  const rolls = d["优势骰"];
  if (!type || !rolls || rolls.length !== 2) return undefined;
  return { type: type as "advantage" | "disadvantage", rolls: rolls as [number, number] };
}

function extractDamageDice(d: Record<string, any>): FormattedDiceResult["damageDice"] {
  if (!d["附带伤害骰"]) return undefined;
  const rolls: number[] = d["全部伤害掷骰"];
  const dieType = dieTypeFromRaw(String(d["伤害骰面"] ?? "d6")) ?? "d6";
  if (!rolls || rolls.length === 0) return undefined;
  return {
    count: rolls.length,
    dieType,
    rolls,
    bonus: Number(d["伤害加值"] ?? 0),
    total: Number(d["伤害总计"] ?? 0),
  };
}

function dieTypeFromRaw(raw: string): DieType | null {
  const lower = raw.toLowerCase();
  if (lower.includes("d4")) return "d4";
  if (lower.includes("d6")) return "d6";
  if (lower.includes("d8")) return "d8";
  if (lower.includes("d10")) return "d10";
  if (lower.includes("d12")) return "d12";
  if (lower.includes("d20")) return "d20";
  return null;
}

export function getFinalFace(diceSides: number, rolls: number[]): number | null {
  const face = Number(rolls[0]);
  return Number.isInteger(face) && face >= 1 && face <= diceSides ? face : null;
}

export function formatResult(dice: DiceResult, fallbackDieType: DieType): FormattedDiceResult {
  const d = dice.data;
  const resolvedDieType = dieTypeFromDice(dice, fallbackDieType);
  const dieLabel = `D${DIE_SIDES[resolvedDieType]}`;

  if (dice.event) {
    const event = dice.event;
    const finalFace = getFinalFace(event.diceSides, event.rolls);
    const multiDice = event.rolls.length > 1
      ? { count: event.rolls.length, dieType: resolvedDieType, rolls: event.rolls }
      : undefined;
    const isDamage = event.type === 'damage';
    const isHealing = event.type === 'healing';
    return {
      dieLabel,
      roll: finalFace === null ? '?' : String(finalFace),
      total: String(event.total),
      dc: event.type === 'attack' && event.ac !== undefined
        ? `AC${event.ac}`
        : event.dc !== undefined ? String(event.dc) : undefined,
      success: event.success,
      attr: [event.actorName, event.skillName].filter(Boolean).join(' · '),
      verdict: isDamage || isHealing ? `结果：${event.total}` : undefined,
      eventType: event.type,
      formula: event.formula,
      rolls: event.rolls,
      modifier: event.modifier,
      multiDice,
    };
  }

  if (dice.type === "dice_test") {
    const raw = String(d["结果"] ?? d.roll ?? d["掷骰"]?.match(/D\d+=(\d+)/)?.[1] ?? "?");
    const allRolls: number[] | undefined = d["全部掷骰"];
    const multiDice = allRolls && allRolls.length > 1
      ? { count: allRolls.length, dieType: dieTypeFromDice(dice, fallbackDieType), rolls: allRolls }
      : undefined;
    return {
      dieLabel,
      roll: raw,
      total: String(d["总计"] ?? raw),
      attr: String(d["属性"] ?? "骰子测试"),
      verdict: String(d["描述"] ?? "结果已生成"),
      multiDice,
    };
  }

  if (dice.type === "skill_check") {
    const raw = d["掷骰"]?.replace("D20=", "") || "?";
    const damageDice = extractDamageDice(d);
    const advDice = extractAdvDice(d);
    return {
      dieLabel: "D20",
      roll: raw,
      total: String(d["总计"] ?? "?"),
      dc: String(d["DC"] ?? "?"),
      success: Boolean(d["成功"]),
      attr: String(d["属性"] ?? ""),
      damageDice,
      advDice,
    };
  }
  const raw = d["攻击掷骰"]?.match(/D20=(\d+)/)?.[1] || "?";
  const damageDice = extractDamageDice(d);
  const advDice = extractAdvDice(d);
  return {
    dieLabel: "D20",
    roll: raw,
    total: String(d["总计"] ?? "?"),
    dc: "AC" + String(d["目标AC"] ?? "?"),
    success: Boolean(d["命中"]),
    attr: String(d["武器"] ?? ""),
    damageDice,
    advDice,
  };
}

function createDieGeometry(dieType: DieType, radius: number) {
  switch (dieType) {
    case "d4":
      return new THREE.TetrahedronGeometry(radius * 0.82, 0);
    case "d6":
      return new THREE.BoxGeometry(radius * 1.15, radius * 1.15, radius * 1.15);
    case "d8":
      return new THREE.OctahedronGeometry(radius * 1.1, 0);
    case "d10":
      return new THREE.CylinderGeometry(radius * 0.9, radius * 0.9, radius * 1.95, 10, 1, false);
    case "d12":
      return new THREE.DodecahedronGeometry(radius * 0.98, 0);
    case "d20":
    default:
      return new THREE.IcosahedronGeometry(radius, 0);
  }
}

/** d6 立方体六面：法线 + 面中心（手动硬编，BoxGeometry 顶点计算不准） */
function d6FaceData(r: number) {
  return [
    { normal: new THREE.Vector3(0, 1, 0), center: new THREE.Vector3(0, r, 0) },   // 1 顶面
    { normal: new THREE.Vector3(0, -1, 0), center: new THREE.Vector3(0, -r, 0) },  // 2 底面
    { normal: new THREE.Vector3(1, 0, 0), center: new THREE.Vector3(r, 0, 0) },   // 3 右面
    { normal: new THREE.Vector3(-1, 0, 0), center: new THREE.Vector3(-r, 0, 0) },  // 4 左面
    { normal: new THREE.Vector3(0, 0, 1), center: new THREE.Vector3(0, 0, r) },   // 5 前面
    { normal: new THREE.Vector3(0, 0, -1), center: new THREE.Vector3(0, 0, -r) },  // 6 后面
  ];
}

function d10FaceData(r: number) {
  const sideRadius = r * 0.82;
  return Array.from({ length: 10 }, (_, i) => {
    const angle = (Math.PI * 2 * i) / 10;
    const normal = new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle)).normalize();
    return {
      normal,
      center: normal.clone().multiplyScalar(sideRadius),
    };
  });
}

/**
 * 从几何体提取面数据。
 * @param geo 几何体
 * @param sides 面数（用于跳过重复分组）
 */
function polyFaceData(geo: THREE.BufferGeometry, sides: number) {
  const pos = geo.attributes.position.array as Float32Array;
  const vertsPerSide = (pos.length / 9 / sides) | 0; // 每个面有多少个三角形
  const result: { center: THREE.Vector3; normal: THREE.Vector3 }[] = [];

  for (let f = 0; f < sides; f++) {
    const center = new THREE.Vector3();
    // 用第一个三角形的法线代表整个面
    const i0 = f * vertsPerSide * 9;
    const a = new THREE.Vector3(pos[i0], pos[i0 + 1], pos[i0 + 2]);
    const b = new THREE.Vector3(pos[i0 + 3], pos[i0 + 4], pos[i0 + 5]);
    const c = new THREE.Vector3(pos[i0 + 6], pos[i0 + 7], pos[i0 + 8]);
    const normal = new THREE.Vector3()
      .crossVectors(b.clone().sub(a), c.clone().sub(a))
      .normalize();

    // 该面所有三角形的中心取平均
    for (let t = 0; t < vertsPerSide; t++) {
      const idx = (f * vertsPerSide + t) * 9;
      const va = new THREE.Vector3(pos[idx], pos[idx + 1], pos[idx + 2]);
      const vb = new THREE.Vector3(pos[idx + 3], pos[idx + 4], pos[idx + 5]);
      const vc = new THREE.Vector3(pos[idx + 6], pos[idx + 7], pos[idx + 8]);
      center.add(va).add(vb).add(vc);
    }
    center.multiplyScalar(1 / (vertsPerSide * 3));

    if (normal.dot(center) < 0) normal.negate();
    result.push({ center, normal });
  }
  return result;
}

function makeNumTex(num: number, isAttack: boolean = false): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 72;
  c.height = 72;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = isAttack ? "#f0d060" : "#d4a843";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "bold 70px Georgia, serif";
  ctx.fillText(String(num), 36, 36);
  return new THREE.CanvasTexture(c);
}

function makePipTex(num: number): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 128;
  const ctx = c.getContext("2d")!;

  ctx.fillStyle = "#f8f3df";
  ctx.beginPath();
  ctx.roundRect(10, 10, 108, 108, 18);
  ctx.fill();
  ctx.strokeStyle = "rgba(40, 45, 52, 0.22)";
  ctx.lineWidth = 4;
  ctx.stroke();

  const positions: Record<number, Array<[number, number]>> = {
    1: [[64, 64]],
    2: [[40, 40], [88, 88]],
    3: [[40, 40], [64, 64], [88, 88]],
    4: [[40, 40], [88, 40], [40, 88], [88, 88]],
    5: [[40, 40], [88, 40], [64, 64], [40, 88], [88, 88]],
    6: [[40, 36], [88, 36], [40, 64], [88, 64], [40, 92], [88, 92]],
  };

  ctx.fillStyle = "#1f2830";
  positions[num]?.forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fill();
  });

  return new THREE.CanvasTexture(c);
}

export function DiceRollOverlay({ dice, dieType = "d20", onClose, attackMode = false, attackMissed = false, targetAc = 0, diceKind, charSkill, showD20Calc, rerollDecision, comparisonRolls }: DiceRollOverlayProps) {
  const [show, setShow] = useState(false);
  const [rolling, setRolling] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [effectRevealed, setEffectRevealed] = useState(false);
  const [skillFx, setSkillFx] = useState<SkillEffectConfig | null>(null);
  const [closed, setClosed] = useState(false);
  const [showOmniPicker, setShowOmniPicker] = useState(false);
  const omniMax = rerollDecision?.omniMax ?? 20;
  const [chosenD20, setChosenD20] = useState(omniMax);
  useEffect(() => setChosenD20(omniMax), [omniMax, dice?.event?.rollId]);
  const timerRef = useRef<number[]>([]);
  const closeTimerRef = useRef<number | null>(null);
  const skillEffectRef = useRef<SkillEffectConfig | null>(null);

  // dice 变化 → 滚动→揭示→特效延迟→等待点击
  useEffect(() => {
    if (!dice) {
      setShow(false);
      return;
    }

    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];

    setShow(true);
    setRolling(true);
    setRevealed(false);
    setEffectRevealed(false);
    setSkillFx(null);
    setClosed(false);
    setShowOmniPicker(false);
    if (closeTimerRef.current) { window.clearTimeout(closeTimerRef.current); closeTimerRef.current = null; }

    // 音效：开始滚动
    sfx.diceRoll();

    // 阶段1：滚动结束 → 显示骰面
    const t1 = window.setTimeout(() => {
      setRolling(false);
      sfx.diceStop();
      window.setTimeout(() => setRevealed(true), 400);
    }, 800);

    // 阶段2：骰面显示后，弹出技能特效
    const t2 = window.setTimeout(() => setEffectRevealed(true), 1800);

    timerRef.current = [t1, t2];

    return () => timerRef.current.forEach(clearTimeout);
  }, [dice]); // eslint-disable-line react-hooks/exhaustive-deps

  // 始终渲染 Canvas 容器（即使隐藏），确保 ref 始终有效
  const result = dice ? formatResult(dice, dieType) : null;
  const bonus = dice ? Number(dice.data["加值"] ?? 0) : 0;
  const resultDieType = dice ? dieTypeFromDice(dice, dieType) : dieType;
  const resultSides = DIE_SIDES[resultDieType];
  const isNatMax = Number(result?.roll) === resultSides;
  const isNat1 = result?.roll === "1";
  const dcLabel = result?.dc ? (String(result.dc).startsWith("AC") ? String(result.dc).replace(/\s+/g, "") : `DC${String(result.dc).replace(/^DC\s*/i, "")}`) : "";
  const isDamageLike = result?.eventType === 'damage' || result?.eventType === 'healing';
  const criticalMultiplier = Number(dice?.data["大成功倍率"] ?? dice?.event?.metadata?.criticalMultiplier ?? 1);
  const isCriticalEffect = isDamageLike && criticalMultiplier > 1;
  const fixedBonusLabel = result?.eventType === 'healing' ? '固定治疗' : '固定伤害';

  // 推断技能特效类型
  const skillEffect = useMemo(() => (dice ? inferSkillEffect(dice.data) : null), [dice]);
  // 保存到 ref，避免关闭后 dice 变 null 导致特效丢失
  useEffect(() => { skillEffectRef.current = skillEffect; }, [skillEffect]);

  // 特效弹出时播放判定音效（不触发技能特效，留到关闭后触发）
  useEffect(() => {
    if (effectRevealed && result) {
      const isCrit = isNatMax && !isNat1;
      sfx.verdict(Boolean(result.success), isCrit);
    }
  }, [effectRevealed]); // eslint-disable-line

  // 用户关闭骰子界面后1秒，触发技能特效
  useEffect(() => {
    if (!closed) return;
    closeTimerRef.current = window.setTimeout(() => {
      if (skillEffectRef.current) setSkillFx({ ...skillEffectRef.current });
    }, 1000);
    return () => {
      if (closeTimerRef.current) { window.clearTimeout(closeTimerRef.current); closeTimerRef.current = null; }
    };
  }, [closed]); // eslint-disable-line

  function closeOverlay() {
    if (!effectRevealed || closed || rerollDecision) return;
    setClosed(true);
    onClose?.();
  }

  useEffect(() => {
    if (!effectRevealed || closed) return;
    const onKeyDown = () => closeOverlay();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [effectRevealed, closed]); // eslint-disable-line

  return (
    <>
    <div
      className="dice-overlay"
      style={{ display: show ? "flex" : "none" }}
      onClick={closeOverlay}
    >
      <motion.div
        className="dice-modal dice-modal-3d"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: show ? 1 : 0.6, opacity: show ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
      >
        {(charSkill || diceKind) && (
          <div className="dice-top-context">
            {diceKind && <span>{diceKind}</span>}
            {charSkill && <b>{charSkill}</b>}
          </div>
        )}

        {comparisonRolls ? (
          <div className="dice-multi-row dice-reroll-comparison">
            {([
              { key: 'initial', label: '初次判定', roll: comparisonRolls.initial },
              { key: 'reroll', label: '重投结果', roll: comparisonRolls.reroll },
            ] as const).map((entry) => {
              const picked = comparisonRolls.selected === entry.key;
              return <div className="dice-multi-item" key={entry.key}>
                <span className="dice-comparison-label">{entry.label}</span>
                <Dice3DView dieType="d20" roll={entry.roll} rolling={entry.key === 'reroll' && rolling}
                  revealed={entry.key === 'initial' || revealed} size={170} showResultBadge={false} />
                <motion.span className={`dice-multi-num ${picked ? 'dice-adv-picked' : 'dice-adv-unused'}`}
                  initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  {entry.roll}{picked ? ' ✓ 最终采用' : ''}
                </motion.span>
              </div>;
            })}
          </div>
        ) : result?.damageDice && !attackMode ? (
          /* 非攻击模式：D20 + 伤害骰组合显示 */
          <div className="dice-multi-row">
            <div className="dice-multi-item">
              <Dice3DView
                key={`${dice?.data["id"] ?? "roll"}-d20`}
                dieType={resultDieType}
                roll={Number(result?.roll)}
                rolling={rolling}
                revealed={revealed}
                size={200}
              />
            </div>
            <span className="dice-plus-sep">+</span>
            {result.damageDice.rolls.map((rollValue, idx) => (
              <div className="dice-multi-item" key={`dmg-${idx}`}>
                <Dice3DView
                  key={`${dice?.data["id"] ?? "roll"}-dmg-${idx}`}
                  dieType={result.damageDice!.dieType}
                  roll={rollValue}
                  rolling={rolling}
                  revealed={revealed}
                  size={diceSizeForCount(result.damageDice!.count)}
                  showResultBadge={false}
                />
                {revealed && (
                  <motion.span
                    className={`dice-multi-num ${rollValue === DIE_SIDES[result.damageDice!.dieType] ? "text-teal" : ""} ${rollValue === 1 ? "text-danger" : ""}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 360 }}
                  >
                    {rollValue}
                  </motion.span>
                )}
              </div>
            ))}
          </div>
        ) : result?.multiDice ? (
          /* 纯伤害/治疗多骰子 */
          <div className="dice-multi-row">
            {result.multiDice.rolls.map((rollValue, idx) => (
              <div className="dice-multi-item" key={idx}>
                <Dice3DView
                  key={`${dice?.data["id"] ?? "roll"}-${idx}`}
                  dieType={result.multiDice!.dieType}
                  roll={rollValue}
                  rolling={rolling}
                  revealed={revealed}
                  size={diceSizeForCount(result.multiDice!.count)}
                  showResultBadge={false}
                />
                {revealed && (
                  <motion.span
                    className={`dice-multi-num ${rollValue === DIE_SIDES[result.multiDice!.dieType] ? "text-teal" : ""} ${rollValue === 1 ? "text-danger" : ""}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.25, type: "spring", stiffness: 360 }}
                  >
                    {rollValue}
                  </motion.span>
                )}
              </div>
            ))}
          </div>
        ) : result?.advDice ? (
          /* 优势/劣势双 D20 */
          <div className="dice-multi-row">
            {result.advDice.rolls.map((rollValue, idx) => {
              const isPicked = result.advDice!.type === "advantage"
                ? rollValue === Math.max(...result.advDice!.rolls)
                : rollValue === Math.min(...result.advDice!.rolls);
              return (
                <div className="dice-multi-item" key={`adv-${idx}`}>
                  <Dice3DView
                    key={`${dice?.data["id"] ?? "roll"}-adv-${idx}`}
                    dieType="d20"
                    roll={rollValue}
                    rolling={rolling}
                    revealed={revealed}
                    size={160}
                    showResultBadge={false}
                    variant="attack"
                  />
                  {revealed && (
                    <motion.span
                      className={`dice-multi-num ${isPicked ? "dice-adv-picked" : "dice-adv-unused"} ${rollValue === 20 ? "text-teal" : ""} ${rollValue === 1 ? "text-danger" : ""}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.25, type: "spring", stiffness: 360 }}
                    >
                      {rollValue}
                      {isPicked ? " ✓" : ""}
                    </motion.span>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <Dice3DView
            key={dice ? (dice.data["id"] ?? "roll") : "idle"}
            dieType={resultDieType}
            roll={Number(result?.roll)}
            rolling={rolling}
            revealed={revealed}
            variant={attackMode ? "attack" : "default"}
          />
        )}

        {revealed && result && (
          <motion.div
            className="dice-info"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* 第一行：DC/AC 目标（攻击命中时显示AC，技能检定已融入公式行） */}
            {dcLabel && dice?.type !== 'skill_check' && !isDamageLike && <div className="dice-dc-highlight">{dcLabel}</div>}

            {isDamageLike && result.formula && <div className="dice-dc-highlight">公式：{result.formula}</div>}

            {/* 第二行：计算式 */}
            <div className="dice-calc dice-calc-v2">
              <span className="dice-result-prefix">结果：</span>
              {isDamageLike ? (
                <>
                  {(result.rolls ?? []).map((rv, idx) => (
                    <span key={idx} className="dice-eq-roll">
                      {idx > 0 && <span className="dice-eq-sep">+</span>}{rv}
                    </span>
                  ))}
                  <span className="dice-eq-note">（点数）</span>
                  {Number(result.modifier ?? 0) !== 0 && (
                    <>
                      <span className="dice-eq-sep">{Number(result.modifier) >= 0 ? '+' : '-'}</span>
                      <span className="dice-eq-bonus">{Math.abs(Number(result.modifier))}</span>
                      <span className="dice-eq-note">（{fixedBonusLabel}）</span>
                    </>
                  )}
                  {isCriticalEffect && <span className="dice-eq-note">（大成功效果翻倍）</span>}
                  <span className="dice-eq-sep">=</span>
                  <span className="dice-total dice-eq-total">{result.total}</span>
                </>
              ) : result.multiDice ? (
                <>
                  <span className="dice-total dice-eq-total">{result.total}</span>
                  <span className="dice-eq-sep">=</span>
                  {result.multiDice.rolls.map((rv, idx) => (
                    <span key={idx} className="dice-eq-roll">{rv}</span>
                  ))}
                  <span className="dice-eq-note">（点数）</span>
                  {(() => {
                    const statMod = Number(dice?.data["属性加值"] ?? bonus);
                    const profMod = Number(dice?.data["熟练加值"] ?? 0);
                    const ability = normalizeAbilityLabel(String(dice?.data["六维"] ?? dice?.data["属性"] ?? dice?.data["检定属性"] ?? ""));
                    if (statMod !== 0 || profMod !== 0) {
                      return (
                        <>
                          <span className="dice-eq-sep">+</span>
                          <span className="dice-eq-bonus">{statMod}</span>
                          {ability ? <span className="dice-eq-note">（{ability}加值）</span> : <span className="dice-eq-note">（属性加值）</span>}
                          {profMod > 0 && (
                            <>
                              <span className="dice-eq-sep">+</span>
                              <span className="dice-eq-bonus">{profMod}</span>
                              <span className="dice-eq-note">（熟练加值）</span>
                            </>
                          )}
                        </>
                      );
                    }
                    return null;
                  })()}
                </>
              ) : showD20Calc ? (
                <>
                  {/* 命中 D20：D20+属性加值+熟练=总计 vs AC */}
                  <span className="dice-total dice-eq-total">{result.total}</span>
                  <span className="dice-eq-sep">=</span>
                  <span className={`dice-eq-roll ${isNatMax ? "text-teal" : ""} ${isNat1 ? "text-danger" : ""}`}>{result.roll}</span>
                  <span className="dice-eq-note">（点数）</span>
                  {(() => {
                    const statMod = Number(dice?.data["属性加值"] ?? bonus);
                    const profMod = Number(dice?.data["熟练加值"] ?? 0);
                    const ability = normalizeAbilityLabel(String(dice?.data["六维"] ?? dice?.data["属性"] ?? dice?.data["检定属性"] ?? ""));
                    if (statMod !== 0 || profMod !== 0) {
                      return (
                        <>
                          <span className="dice-eq-sep">+</span>
                          <span className="dice-eq-bonus">{statMod}</span>
                          {ability ? <span className="dice-eq-note">（{ability}加值）</span> : <span className="dice-eq-note">（属性加值）</span>}
                          {profMod > 0 && (
                            <>
                              <span className="dice-eq-sep">+</span>
                              <span className="dice-eq-bonus">{profMod}</span>
                              <span className="dice-eq-note">（熟练加值）</span>
                            </>
                          )}
                        </>
                      );
                    }
                    return null;
                  })()}
                </>
              ) : result.damageDice ? (
                <>
                  <span className="dice-total dice-eq-total">{result.total}</span>
                  <span className="dice-eq-sep">=</span>
                  <span className="dice-eq-roll">{result.roll}</span>
                  <span className="dice-eq-note">（D20）</span>
                  {(() => {
                    const statMod = Number(dice?.data["属性加值"] ?? bonus);
                    const profMod = Number(dice?.data["熟练加值"] ?? 0);
                    const ability = normalizeAbilityLabel(String(dice?.data["六维"] ?? dice?.data["属性"] ?? dice?.data["检定属性"] ?? ""));
                    if (statMod !== 0 || profMod !== 0) {
                      return (
                        <>
                          <span className="dice-eq-sep">+</span>
                          <span className="dice-eq-bonus">{statMod}</span>
                          {ability ? <span className="dice-eq-note">（{ability}加值）</span> : <span className="dice-eq-note">（属性加值）</span>}
                          {profMod > 0 && (
                            <>
                              <span className="dice-eq-sep">+</span>
                              <span className="dice-eq-bonus">{profMod}</span>
                              <span className="dice-eq-note">（熟练加值）</span>
                            </>
                          )}
                        </>
                      );
                    }
                    return null;
                  })()}
                </>
              ) : (
                <>
                  {/* 单骰子 — 拆分属性加值 + 熟练加值 */}
                  <span className="dice-total dice-eq-total">{result.total}</span>
                  <span className="dice-eq-sep">=</span>
                  <span className={`dice-eq-roll ${isNatMax ? "text-teal" : ""} ${isNat1 ? "text-danger" : ""}`}>{result.roll}</span>
                  <span className="dice-eq-note">（点数）</span>
                  {(() => {
                    const statMod = Number(dice?.data["属性加值"] ?? 0);
                    const profMod = Number(dice?.data["熟练加值"] ?? 0);
                    const ability = normalizeAbilityLabel(String(dice?.data["六维"] ?? dice?.data["属性"] ?? dice?.data["检定属性"] ?? ""));
                    if (statMod !== 0 || profMod !== 0) {
                      return (
                        <>
                          <span className="dice-eq-sep">+</span>
                          <span className="dice-eq-bonus">{statMod}</span>
                          {ability ? <span className="dice-eq-note">（{ability}加值）</span> : <span className="dice-eq-note">（属性加值）</span>}
                          {profMod > 0 && (
                            <>
                              <span className="dice-eq-sep">+</span>
                              <span className="dice-eq-bonus">{profMod}</span>
                              <span className="dice-eq-note">（熟练加值）</span>
                            </>
                          )}
                        </>
                      );
                    }
                    return null;
                  })()}
                  {dcLabel && (
                    <>
                      <span className="dice-eq-sep">{result.success ? "≥" : "<"}</span>
                      <span className="dice-eq-dc">{dcLabel}</span>
                    </>
                  )}
                </>
              )}
            </div>

            {/* 第三行：成败 */}
            {effectRevealed && (result.verdict || typeof result.success === "boolean") && (
              <motion.div
                className={`dice-verdict ${
                  typeof result.success === "boolean"
                    ? result.success
                      ? "verdict-success"
                      : "verdict-fail"
                    : "verdict-neutral"
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.05, type: "spring", stiffness: 360, damping: 14 }}
              >
                {attackMissed
                  ? "失败"
                  : result.verdict ||
                  (isNatMax
                    ? "大成功"
                    : isNat1
                      ? "大失败"
                      : result.success
                        ? "成功"
                        : "失败")}
              </motion.div>
            )}
          </motion.div>
        )}
        {effectRevealed && rerollDecision && (
          <div className="dice-reroll-actions" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="dice-reroll-confirm" onClick={rerollDecision.onConfirm}>确定</button>
            {!rerollDecision.rerollUsed && <>
              <button type="button" disabled={rerollDecision.fictionQuantity <= 0} onClick={rerollDecision.onUseFiction}>
                {rerollDecision.fictionQuantity > 0 ? `使用虚构骰子（剩余 ${rerollDecision.fictionQuantity}）` : '虚构骰子不足'}
              </button>
              <button type="button" disabled={rerollDecision.omniQuantity <= 0} onClick={() => setShowOmniPicker((value) => !value)}>
                {rerollDecision.omniQuantity > 0 ? `使用万能骰子（剩余 ${rerollDecision.omniQuantity}）` : '万能骰子不足'}
              </button>
            </>}
            {showOmniPicker && !rerollDecision.rerollUsed && (
              <div className="dice-omni-picker">
                <span>指定 D{omniMax} 点数</span>
                <input type="number" min={1} max={omniMax} value={chosenD20} onChange={(event) => setChosenD20(Number(event.target.value))} />
                <button type="button" onClick={() => rerollDecision.onUseOmni(chosenD20)}>采用</button>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* 点击继续提示 */}
      {effectRevealed && !rerollDecision && (
        <motion.div
          className="dice-continue-hint"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <span>点击任意键以继续</span>
        </motion.div>
      )}
    </div>

    <SkillEffectOverlay config={skillFx} onDone={() => setSkillFx(null)} />
    </>
  );
}

export function Dice3DView({
  dieType = "d20",
  roll = null,
  rolling = false,
  revealed = false,
  size = 220,
  className = "",
  faceStyle = "numbers",
  showResultBadge = true,
  variant = "default",
}: Dice3DViewProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    diceGroup: THREE.Group;
    renderer: THREE.WebGLRenderer;
    animId: number;
  } | null>(null);
  const spinningRef = useRef(false);

  useEffect(() => {
    spinningRef.current = rolling;
  }, [rolling]);

  useEffect(() => {
    const container = canvasRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-2.5, 2.5, 2.5, -2.5, 0.1, 20);
    camera.position.set(0, 0, 4.8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const p1 = new THREE.PointLight(0xfff8e7, 1.6);
    p1.position.set(4, 3, 5);
    scene.add(p1);
    const p2 = new THREE.PointLight(0x8b7d6b, 0.6);
    p2.position.set(-3, -2, -4);
    scene.add(p2);
    const d1 = new THREE.DirectionalLight(0xffe8b0, 0.8);
    d1.position.set(0, 5, 2);
    scene.add(d1);

    const diceGroup = new THREE.Group();
    const dieSides = DIE_SIDES[dieType];
    const bodyGeo = createDieGeometry(dieType, 1.5);
    const isAttackD20 = variant === "attack" && dieType === "d20";
    diceGroup.add(
      new THREE.Mesh(
        bodyGeo,
        new THREE.MeshStandardMaterial({
          color: isAttackD20 ? 0x6b1a1a : 0x4a2080,
          metalness: 0.45,
          roughness: 0.25,
        }),
      ),
    );
    const eg = new LineSegmentsGeometry().fromEdgesGeometry(
      new THREE.EdgesGeometry(bodyGeo, 12),
    );
    diceGroup.add(
      new LineSegments2(
        eg,
        new LineMaterial({
          color: isAttackD20 ? 0xe8c547 : 0xd4a843,
          linewidth: 0.03,
          worldUnits: true,
        }),
      ),
    );

    const faceData =
      dieType === "d6"
        ? d6FaceData(1.5 * 1.15 / 2)
        : dieType === "d10"
          ? d10FaceData(1.5 * 0.9)
        : polyFaceData(bodyGeo, dieSides);
    const planeSize = dieType === "d6" ? 1.2 * 0.58 : dieType === "d10" ? 0.72 : 0.55;
    const usePips = dieType === "d6" && faceStyle === "pips";
    faceData.forEach(({ center, normal }, i) => {
      const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(planeSize, planeSize),
        new THREE.MeshBasicMaterial({
          map: usePips ? makePipTex(i + 1) : makeNumTex(i + 1, isAttackD20),
          transparent: true,
          side: THREE.DoubleSide,
        }),
      );
      plane.position.copy(center).add(normal.clone().multiplyScalar(0.015));
      plane.setRotationFromQuaternion(
        new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal),
      );
      diceGroup.add(plane);
    });

    scene.add(diceGroup);

    const faceNormals = faceData.map((f) => f.normal);
    const cameraDir = new THREE.Vector3(0, 0, 1);
    let targetQ: THREE.Quaternion | null = null;
    let startQ: THREE.Quaternion | null = null;
    let alignStart = 0;

    let animId = 0;
    const clock = new THREE.Clock();
    function animate() {
      animId = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.1);

      if (targetQ && startQ) {
        const elapsed = Date.now() - alignStart;
        const t = Math.min(elapsed / 50, 1.0);
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        diceGroup.quaternion.copy(startQ).slerp(targetQ, eased);
        if (t >= 1.0) {
          targetQ = null;
          startQ = null;
        }
      } else if (spinningRef.current) {
        diceGroup.rotation.x += dt * 9;
        diceGroup.rotation.y += dt * 7;
        diceGroup.rotation.z += dt * 5;
      }

      renderer.render(scene, camera);
    }
    animate();

    (diceGroup.userData as any).faceToCamera = (faceIdx: number) => {
      const faceNormal = faceNormals[faceIdx];
      if (!faceNormal) return;
      startQ = diceGroup.quaternion.clone();
      targetQ = new THREE.Quaternion().setFromUnitVectors(
        faceNormal.clone(),
        cameraDir,
      );
      alignStart = Date.now();
    };

    sceneRef.current = { diceGroup, renderer, animId };
    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      sceneRef.current = null;
    };
  }, [dieType, faceStyle, size, variant]);

  useEffect(() => {
    const rollNumber = Number(roll);
    const sides = DIE_SIDES[dieType];
    if (rolling || !Number.isInteger(rollNumber) || rollNumber < 1 || rollNumber > sides) return;

    spinningRef.current = false;
    const ud = sceneRef.current?.diceGroup.userData as any;
    if (ud?.faceToCamera) ud.faceToCamera(rollNumber - 1);
  }, [dieType, rolling, roll]);

  const sides = DIE_SIDES[dieType];
  const rollNumber = Number(roll);
  const isNatMax = rollNumber === sides;
  const isNat1 = rollNumber === 1;

  return (
    <div
      className={`dice-canvas-wrap ${className}`.trim()}
      ref={canvasRef}
      style={{ width: size, height: size }}
    >
      {showResultBadge && revealed && Number.isFinite(rollNumber) && (
        <motion.div
          className={`dice-result-badge ${isNatMax ? "badge-crit" : ""} ${isNat1 ? "badge-fumble" : ""}`}
          initial={{ scale: 0, rotateZ: -30 }}
          animate={{ scale: 1, rotateZ: 0 }}
          transition={{ type: "spring", stiffness: 360, damping: 16 }}
        >
          <span className="badge-num">{rollNumber}</span>
        </motion.div>
      )}
    </div>
  );
}
