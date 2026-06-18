import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { animationRandom } from "../core/random/secureRandom";

export interface SkillEffectConfig {
  kind: "slash" | "bash" | "pierce" | "fire" | "ice" | "lightning" | "arcane" | "radiant" | "heal" | "fail" | "poison" | "shadow" | "wind" | "earth" | "water" | "shield" | "buff" | "debuff" | "critical";
  attacker?: string;
  target?: string;
}

interface SkillEffectOverlayProps {
  config: SkillEffectConfig | null;
  onDone?: () => void;
}

/* 配置表 */
const FX_CONFIG = {
  slash:     { particles: 6,  colors: ["#e8d5a3","#d4a843","#ffffff"], glyph: "⚔️",  duration: 0.7 },
  bash:      { particles: 4,  colors: ["#c9b896","#a89060","#fff"],     glyph: "💥",  duration: 0.6 },
  pierce:    { particles: 3,  colors: ["#e0e0ff","#a0c0f0","#fff"],     glyph: "🗡️",  duration: 0.55 },
  fire:      { particles: 9,  colors: ["#ff6b35","#ff8c42","#ffd700"],  glyph: "🔥",  duration: 0.8 },
  ice:       { particles: 7,  colors: ["#a8e6ff","#6ec8e0","#ffffff"],  glyph: "❄️",  duration: 0.75 },
  lightning: { particles: 5,  colors: ["#ffe066","#ffffff","#aaccff"],  glyph: "⚡",  duration: 0.5 },
  arcane:    { particles: 8,  colors: ["#c084fc","#a855f7","#e4d4ff"],  glyph: "✨",  duration: 0.8 },
  radiant:   { particles: 6,  colors: ["#fef08a","#ffe066","#ffffff"],  glyph: "☀️",  duration: 0.7 },
  heal:      { particles: 8,  colors: ["#86efac","#4ade80","#bbf7d0"],  glyph: "💚",  duration: 0.8 },
  fail:      { particles: 2,  colors: ["#888","#555"],                   glyph: "💨",  duration: 0.45 },
  poison:    { particles: 7,  colors: ["#a3e635","#84cc16","#4d7c0f"],  glyph: "🧪",  duration: 0.85 },
  shadow:    { particles: 6,  colors: ["#6b21a8","#3b0764","#1e1b4b"],  glyph: "🌑",  duration: 0.75 },
  wind:      { particles: 8,  colors: ["#e0f2fe","#bae6fd","#ffffff"],  glyph: "🍃",  duration: 0.7 },
  earth:     { particles: 5,  colors: ["#a16207","#854d0e","#713f12"],  glyph: "🪨",  duration: 0.65 },
  water:     { particles: 7,  colors: ["#38bdf8","#0284c7","#e0f2fe"],  glyph: "💧",  duration: 0.7 },
  shield:    { particles: 4,  colors: ["#c7d2fe","#a5b4fc","#ffffff"],  glyph: "🛡️",  duration: 0.6 },
  buff:      { particles: 6,  colors: ["#fbbf24","#f59e0b","#fef3c7"],  glyph: "⬆️",  duration: 0.65 },
  debuff:    { particles: 5,  colors: ["#dc2626","#991b1b","#7f1d1d"],  glyph: "⬇️",  duration: 0.65 },
  critical:  { particles: 12, colors: ["#fbbf24","#f59e0b","#ffffff","#fef08a"], glyph: "⭐", duration: 0.9 },
} as const;

type FxKind = keyof typeof FX_CONFIG;

function rand(min: number, max: number) {
  return animationRandom(min, max);
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  delay: number;
  size: number;
}

function makeParticles(count: number, colors: readonly string[]): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.cos(rand(0, Math.PI * 2)) * rand(60, 220),
    y: Math.sin(rand(0, Math.PI * 2)) * rand(60, 220),
    color: colors[i % colors.length],
    delay: rand(0, 0.1),
    size: rand(8, 16),
  }));
}

export function SkillEffectOverlay({ config, onDone }: SkillEffectOverlayProps) {
  const [show, setShow] = useState(false);

  /* 粒度：config 变化时才生成粒子，不随 render 波动 */
  const particles = useMemo(() => {
    if (!config) return [] as Particle[];
    const fx = FX_CONFIG[config.kind] ?? FX_CONFIG.fail;
    return makeParticles(fx.particles, fx.colors);
  }, [config]);

  useEffect(() => {
    if (!config) { setShow(false); return; }
    setShow(true);
    const fx = FX_CONFIG[config.kind] ?? FX_CONFIG.fail;
    const ms = (fx.duration + 0.15) * 1000;
    const t = setTimeout(() => {
      setShow(false);
      onDone?.();
    }, ms);
    return () => clearTimeout(t);
  }, [config]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!config || !show) return null;

  const fx = FX_CONFIG[config.kind] ?? FX_CONFIG.fail;
  const isPhysical = config.kind === "slash" || config.kind === "bash" || config.kind === "pierce" || config.kind === "earth";
  const isMagic = config.kind === "fire" || config.kind === "ice" || config.kind === "lightning" || config.kind === "arcane" || config.kind === "poison" || config.kind === "shadow" || config.kind === "water" || config.kind === "wind";
  const isBuff = config.kind === "buff" || config.kind === "shield";
  const isDebuff = config.kind === "debuff" || config.kind === "poison";

  return (
    <div className="skill-fx-overlay">
      {/* 闪光底衬 */}
      <motion.div
        className="skill-fx-flash"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.35, 0.12, 0] }}
        transition={{ duration: fx.duration, times: [0, 0.15, 0.4, 1] }}
        style={{ background: fx.colors[0] }}
      />

      {/* 中心图案 */}
      <motion.div
        className="skill-fx-glyph"
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: [0.3, 1.3, 1.8], opacity: [0, 1, 0] }}
        transition={{ duration: fx.duration, times: [0, 0.25, 1] }}
      >
        {fx.glyph}
      </motion.div>

      {/* 飞散粒子 (使用 useMemo 生成的固定 seed，不再在 render 中 random) */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="skill-fx-particle"
            initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
            animate={{ x: p.x, y: p.y, opacity: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: fx.duration * 0.7, delay: p.delay, ease: "easeOut" }}
            style={{
              width: p.size,
              height: p.size,
              background: p.color,
              borderRadius: config.kind === "bash" ? "2px" : "50%",
              boxShadow: `0 0 ${p.size * 1.5}px ${p.color}`,
            }}
          />
        ))}
      </AnimatePresence>

      {/* 命中线（物理） */}
      {isPhysical && (
        <div className="skill-fx-impact-lines">
          {[0, 45, 90, -45, -90].map((deg, i) => (
            <motion.div
              key={i}
              className="skill-fx-line"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: [0, 1.4, 2], opacity: [0, 0.9, 0] }}
              transition={{ duration: 0.4, delay: i * 0.03 }}
              style={{
                transform: `rotate(${deg}deg)`,
                background:
                  config.kind === "slash" ? "linear-gradient(90deg, transparent, #ffe8a0, #fff)" :
                  config.kind === "pierce" ? "linear-gradient(90deg, transparent, #c0d0ff, #fff)" :
                  config.kind === "earth" ? "linear-gradient(90deg, transparent, #d4a84a, #fff)" :
                  "linear-gradient(90deg, transparent, #d4c0a0, #fff)",
              }}
            />
          ))}
        </div>
      )}

      {/* 魔法环 */}
      {isMagic && (
        <motion.div
          className="skill-fx-ring"
          initial={{ scale: 0.2, opacity: 0, borderWidth: 6 }}
          animate={{ scale: [0.2, 1.6, 2.2], opacity: [0.8, 0.4, 0], borderWidth: [6, 3, 0] }}
          transition={{ duration: fx.duration }}
          style={{
            borderColor: fx.colors[0],
            boxShadow: `0 0 30px ${fx.colors[0]}, inset 0 0 20px ${fx.colors[1]}`,
          }}
        />
      )}

      {/* 治疗/增益上升 */}
      {(config.kind === "heal" || isBuff) && (
        <motion.div
          className="skill-fx-heal-rise"
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: -180, opacity: [0, 0.8, 0] }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {["+","+","+","+","+"].map((s, i) => (
            <span key={i} style={{
              left: `${rand(-60, 60)}px`,
              fontSize: `${rand(18, 32)}px`,
              color: fx.colors[i % 3],
              textShadow: `0 0 12px ${fx.colors[0]}`,
            }}>{s}</span>
          ))}
        </motion.div>
      )}

      {/* 减益下降 */}
      {isDebuff && !isMagic && (
        <motion.div
          className="skill-fx-heal-rise"
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: 80, opacity: [0, 0.8, 0] }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          {["-","-","-","-"].map((s, i) => (
            <span key={i} style={{
              left: `${rand(-50, 50)}px`,
              fontSize: `${rand(18, 28)}px`,
              color: fx.colors[i % 3],
              textShadow: `0 0 12px ${fx.colors[0]}`,
            }}>{s}</span>
          ))}
        </motion.div>
      )}

      {/* 暴击额外光效 */}
      {config.kind === "critical" && (
        <motion.div
          className="skill-fx-ring"
          initial={{ scale: 0.1, opacity: 0, borderWidth: 8 }}
          animate={{ scale: [0.1, 2, 3], opacity: [1, 0.6, 0], borderWidth: [8, 4, 0] }}
          transition={{ duration: 0.7 }}
          style={{
            borderColor: "#fbbf24",
            boxShadow: "0 0 50px #fbbf24, 0 0 100px #f59e0b, inset 0 0 30px #fef08a",
          }}
        />
      )}
    </div>
  );
}

/* 推导：从 DiceResult 推算效果类型 */
export function inferSkillEffect(diceData: Record<string, any> | null | undefined): SkillEffectConfig | null {
  try {
    if (!diceData) return null;
    // 直接使用掷骰时写入的特效类型
    const fxKind = diceData["fxKind"] ?? diceData["effectKind"] ?? diceData["特效类型"];
    const validKinds = new Set(["slash","bash","pierce","fire","ice","lightning","arcane","radiant","heal","fail","poison","shadow","wind","earth","water","shield","buff","debuff","critical"]);
    const hasSuccessSignal = Object.prototype.hasOwnProperty.call(diceData, "成功") || Object.prototype.hasOwnProperty.call(diceData, "命中");
    const success = hasSuccessSignal ? Boolean(diceData["成功"] ?? diceData["命中"]) : true;

    if (!success) return { kind: "fail" };

    if (fxKind && typeof fxKind === "string" && validKinds.has(fxKind)) {
      return { kind: fxKind as SkillEffectConfig["kind"] };
    }

    return { kind: "slash" };
  } catch {
    return null;
  }
}
