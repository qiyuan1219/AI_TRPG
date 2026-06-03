import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { LineSegments2 } from "three/examples/jsm/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry.js";
import type { DiceResult } from "../types/game";

export type DieType = "d4" | "d8" | "d12" | "d20";

export interface DiceRollOverlayProps {
  dice: DiceResult | null;
  dieType?: DieType;
  onClose: () => void;
}

const DIE_SIDES: Record<DieType, number> = {
  d4: 4,
  d8: 8,
  d12: 12,
  d20: 20,
};

interface FormattedDiceResult {
  dieLabel: string;
  roll: string;
  total: string;
  dc?: string;
  success?: boolean;
  attr?: string;
  verdict?: string;
}

function dieTypeFromDice(dice: DiceResult, fallback: DieType): DieType {
  const raw = String(dice.data["骰子"] ?? dice.data.die ?? fallback).toLowerCase();
  if (raw.includes("d4")) return "d4";
  if (raw.includes("d8")) return "d8";
  if (raw.includes("d12")) return "d12";
  if (raw.includes("d20")) return "d20";
  return fallback;
}

function formatResult(dice: DiceResult, fallbackDieType: DieType): FormattedDiceResult {
  const d = dice.data;
  const resolvedDieType = dieTypeFromDice(dice, fallbackDieType);
  const dieLabel = `D${DIE_SIDES[resolvedDieType]}`;

  if (dice.type === "dice_test") {
    const raw = String(d["结果"] ?? d.roll ?? d["掷骰"]?.match(/D\d+=(\d+)/)?.[1] ?? "?");
    return {
      dieLabel,
      roll: raw,
      total: raw,
      attr: "骰子测试",
      verdict: "结果已生成",
    };
  }

  if (dice.type === "skill_check") {
    const raw = d["掷骰"]?.replace("D20=", "") || "?";
    return {
      dieLabel: "D20",
      roll: raw,
      total: String(d["总计"] ?? "?"),
      dc: String(d["DC"] ?? "?"),
      success: Boolean(d["成功"]),
      attr: String(d["属性"] ?? ""),
    };
  }
  const raw = d["攻击掷骰"]?.match(/D20=(\d+)/)?.[1] || "?";
  return {
    dieLabel: "D20",
    roll: raw,
    total: String(d["总计"] ?? "?"),
    dc: "AC" + String(d["目标AC"] ?? "?"),
    success: Boolean(d["命中"]),
    attr: String(d["武器"] ?? ""),
  };
}

function createDieGeometry(dieType: DieType, radius: number) {
  switch (dieType) {
    case "d4":
      return new THREE.TetrahedronGeometry(radius, 0);
    case "d8":
      return new THREE.OctahedronGeometry(radius, 0);
    case "d12":
      return new THREE.DodecahedronGeometry(radius, 0);
    case "d20":
    default:
      return new THREE.IcosahedronGeometry(radius, 0);
  }
}

function polyFaceData(geo: THREE.BufferGeometry) {
  const pos = geo.attributes.position.array as Float32Array;
  const groups: { center: THREE.Vector3; normal: THREE.Vector3; count: number }[] = [];

  for (let i = 0; i < pos.length; i += 9) {
    const a = new THREE.Vector3(pos[i], pos[i + 1], pos[i + 2]);
    const b = new THREE.Vector3(pos[i + 3], pos[i + 4], pos[i + 5]);
    const c = new THREE.Vector3(pos[i + 6], pos[i + 7], pos[i + 8]);
    const center = a
      .clone()
      .add(b)
      .add(c)
      .multiplyScalar(1 / 3);
    const normal = new THREE.Vector3()
      .crossVectors(b.clone().sub(a), c.clone().sub(a))
      .normalize();
    if (normal.dot(center) < 0) normal.negate();

    const group = groups.find((item) => item.normal.dot(normal) > 0.98);
    if (group) {
      group.center.add(center);
      group.normal.add(normal);
      group.count += 1;
    } else {
      groups.push({ center, normal, count: 1 });
    }
  }

  return groups.map((group) => {
    const center = group.center.multiplyScalar(1 / group.count);
    const normal = group.normal.normalize();
    if (normal.dot(center) < 0) normal.negate();
    return { center, normal };
  });
}

function makeNumTex(num: number): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#d4a843";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "bold 35px Georgia, serif";
  ctx.fillText(String(num), 32, 32);
  return new THREE.CanvasTexture(c);
}

export function DiceRollOverlay({ dice, dieType = "d20", onClose }: DiceRollOverlayProps) {
  const [show, setShow] = useState(false);
  const [rolling, setRolling] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    diceGroup: THREE.Group;
    renderer: THREE.WebGLRenderer;
    animId: number;
  } | null>(null);
  const spinningRef = useRef(false);
  const timerRef = useRef<number[]>([]);

  // 初始化 Three.js：容器始终存在，只建一次
  useEffect(() => {
    const container = canvasRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-2.5, 2.5, 2.5, -2.5, 0.1, 20);
    camera.position.set(0, 0.3, 4.8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(220, 220);
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
    diceGroup.add(
      new THREE.Mesh(
        bodyGeo,
        new THREE.MeshStandardMaterial({
          color: 0x4a2080,
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
          color: 0xd4a843,
          linewidth: 0.03,
          worldUnits: true,
        }),
      ),
    );

    const faceData = polyFaceData(bodyGeo).slice(0, dieSides);
    faceData.forEach(({ center, normal }, i) => {
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: makeNumTex(i + 1),
          transparent: true,
          depthTest: false,
        }),
      );
      sprite.scale.set(0.45, 0.45, 1);
      sprite.position.copy(center).add(normal.clone().multiplyScalar(0.01));
      diceGroup.add(sprite);
    });

    scene.add(diceGroup);

    // 减速状态
    let decelerating = false;
    let decelStart = 0;
    let speedX = 0,
      speedY = 0,
      speedZ = 0;

    let animId = 0;
    const clock = new THREE.Clock();
    function animate() {
      animId = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.1);

      if (decelerating) {
        // 300ms ease-out 减速到零
        const elapsed = Date.now() - decelStart;
        const t = Math.min(elapsed / 300, 1.0);
        const factor = 1 - t; // 线性衰减
        diceGroup.rotation.x += dt * speedX * factor;
        diceGroup.rotation.y += dt * speedY * factor;
        diceGroup.rotation.z += dt * speedZ * factor;
        if (t >= 1.0) {
          decelerating = false;
        }
      } else if (spinningRef.current) {
        diceGroup.rotation.x += dt * 9;
        diceGroup.rotation.y += dt * 7;
        diceGroup.rotation.z += dt * 5;
      }

      renderer.render(scene, camera);
    }
    animate();

    // 暴露减速方法
    (diceGroup.userData as any).startDecel = () => {
      speedX = 9;
      speedY = 7;
      speedZ = 5;
      decelerating = true;
      decelStart = Date.now();
    };

    sceneRef.current = { diceGroup, renderer, animId };
    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
      if (container.contains(renderer.domElement))
        container.removeChild(renderer.domElement);
      sceneRef.current = null;
    };
  }, [dieType]);

  // dice 变化 → 滚动→揭示
  useEffect(() => {
    if (!dice) {
      setShow(false);
      return;
    }

    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];

    spinningRef.current = true;
    setShow(true);
    setRolling(true);
    setRevealed(false);

    const t1 = window.setTimeout(() => {
      spinningRef.current = false;

      // 触发自然减速
      const ud = sceneRef.current?.diceGroup.userData as any;
      if (ud?.startDecel) ud.startDecel();

      // 300ms 减速完成后显示结果
      setRolling(false);
      window.setTimeout(() => setRevealed(true), 300);
    }, 1800);

    const t2 = window.setTimeout(() => onClose(), 4600);
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

  return (
    <div
      className="dice-overlay"
      style={{ display: show ? "flex" : "none" }}
      onClick={revealed ? onClose : undefined}
    >
      <motion.div
        className="dice-modal dice-modal-3d"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: show ? 1 : 0.6, opacity: show ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Canvas 容器：始终存在，仅 CSS display 控制 */}
        <div
          className="dice-canvas-wrap"
          ref={canvasRef}
          style={{ display: show ? "" : "none" }}
        >
          {revealed && result && (
            <motion.div
              className={`dice-result-badge ${isNatMax ? "badge-crit" : ""} ${isNat1 ? "badge-fumble" : ""}`}
              initial={{ scale: 0, rotateZ: -30 }}
              animate={{ scale: 1, rotateZ: 0 }}
              transition={{ type: "spring", stiffness: 360, damping: 16 }}
            >
              <span className="badge-num">{result.roll}</span>
            </motion.div>
          )}
        </div>

        {revealed && result && (
          <motion.div
            className="dice-info"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {result.attr && <div className="dice-attr">{result.attr}</div>}
            <div className="dice-calc">
              <span>{result.dieLabel}</span>
              <span
                className={`dice-roll-val ${isNatMax ? "text-teal" : ""} ${isNat1 ? "text-danger" : ""}`}
              >
                {result.roll}
              </span>
              {bonus !== 0 && (
                <>
                  <span>{bonus > 0 ? "+" : ""}</span>
                  <span>{bonus}</span>
                </>
              )}
              {(bonus !== 0 || result.total !== result.roll) && (
                <>
                  <span>=</span>
                  <span className="dice-total">{result.total}</span>
                </>
              )}
            </div>
            {result.dc && (
              <div className="dice-dc">
                <span>/</span>
                <span>DC {result.dc.replace("AC", "").trim()}</span>
              </div>
            )}
            {(result.verdict || typeof result.success === "boolean") && (
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
                transition={{ delay: 0.1, type: "spring", stiffness: 400 }}
              >
                {result.verdict ||
                  (isNatMax
                    ? "🎉 大成功!"
                    : isNat1
                      ? "💀 大失败!"
                      : result.success
                        ? "通过 ✓"
                        : "失败 ✗")}
              </motion.div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
