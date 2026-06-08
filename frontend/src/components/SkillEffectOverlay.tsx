import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface SkillEffectConfig {
  kind: "slash" | "bash" | "pierce" | "fire" | "ice" | "lightning" | "arcane" | "radiant" | "heal" | "fail";
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
} as const;

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
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
  const isPhysical = config.kind === "slash" || config.kind === "bash" || config.kind === "pierce";
  const isMagic = config.kind === "fire" || config.kind === "ice" || config.kind === "lightning" || config.kind === "arcane";

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

      {/* 治疗上升 */}
      {config.kind === "heal" && (
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
    </div>
  );
}

/* 推导：从 DiceResult 推算效果类型 */
export function inferSkillEffect(diceData: Record<string, any> | null | undefined): SkillEffectConfig | null {
  try {
    if (!diceData) return null;
    const attr = String(diceData["属性"] ?? diceData["武器"] ?? "");
    const success = Boolean(diceData["成功"] ?? diceData["命中"]);

    if (!success) return { kind: "fail" };

    const kindMap: [RegExp, SkillEffectConfig["kind"]][] = [
      [/火|炎|燃|灼|flare|burn|flame/i, "fire"],
      [/冰|霜|冻|cold|frost|chill|freeze/i, "ice"],
      [/雷|电|闪|lightning|shock|spark/i, "lightning"],
      [/光|圣|耀|radiant|holy/i, "radiant"],
      [/刺|穿|pierce|stab|rapier|匕首/i, "pierce"],
      [/钝|锤|打|bash|bludgeon|mace|hammer/i, "bash"],
      [/挥|砍|斩|剑|斧|slash|cleave|sword|axe/i, "slash"],
      [/奥|秘|魔|arcane|spell|magic/i, "arcane"],
      [/治|愈|疗|heal|cure|restore/i, "heal"],
    ];

    for (const [re, kind] of kindMap) {
      if (re.test(attr)) return { kind };
    }
    return { kind: "slash" };
  } catch {
    return null;
  }
}
