import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { LineSegments2 } from "three/examples/jsm/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry.js";
import type { DiceResult } from "../types/game";

export type DieType = "d4" | "d6" | "d8" | "d10" | "d12" | "d20";

export interface DiceRollOverlayProps {
  dice: DiceResult | null;
  dieType?: DieType;
  onClose: () => void;
}

export interface Dice3DViewProps {
  dieType?: DieType;
  roll?: number | null;
  rolling?: boolean;
  revealed?: boolean;
  size?: number;
  className?: string;
}

const DIE_SIDES: Record<DieType, number> = {
  d4: 4,
  d6: 6,
  d8: 8,
  d10: 10,
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
  if (raw.includes("d6")) return "d6";
  if (raw.includes("d8")) return "d8";
  if (raw.includes("d10")) return "d10";
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
      total: String(d["总计"] ?? raw),
      attr: String(d["属性"] ?? "骰子测试"),
      verdict: String(d["描述"] ?? "结果已生成"),
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
    case "d6":
      return new THREE.BoxGeometry(radius * 2, radius * 2, radius * 2);
    case "d8":
      return new THREE.OctahedronGeometry(radius, 0);
    case "d10":
      return new THREE.CylinderGeometry(radius * 0.82, radius * 0.82, radius * 1.95, 10, 1, false);
    case "d12":
      return new THREE.DodecahedronGeometry(radius, 0);
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

function makeNumTex(num: number): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 72;
  c.height = 72;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#d4a843";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "bold 70px Georgia, serif";
  ctx.fillText(String(num), 36, 36);
  return new THREE.CanvasTexture(c);
}

export function DiceRollOverlay({ dice, dieType = "d20", onClose }: DiceRollOverlayProps) {
  const [show, setShow] = useState(false);
  const [rolling, setRolling] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const timerRef = useRef<number[]>([]);

  // dice 变化 → 滚动→揭示
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

    const t1 = window.setTimeout(() => {
      setRolling(false);
      window.setTimeout(() => setRevealed(true), 950);
    }, 1200);

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
        <Dice3DView
          dieType={resultDieType}
          roll={Number(result?.roll)}
          rolling={rolling}
          revealed={revealed}
        />

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

export function Dice3DView({
  dieType = "d20",
  roll = null,
  rolling = false,
  revealed = false,
  size = 220,
  className = "",
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

    const faceData =
      dieType === "d6"
        ? d6FaceData(1.5)
        : dieType === "d10"
          ? d10FaceData(1.5)
        : polyFaceData(bodyGeo, dieSides);
    const planeSize = dieType === "d6" ? 1.2 : dieType === "d10" ? 0.72 : 0.55;
    faceData.forEach(({ center, normal }, i) => {
      const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(planeSize, planeSize),
        new THREE.MeshBasicMaterial({
          map: makeNumTex(i + 1),
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
  }, [dieType, size]);

  useEffect(() => {
    const rollNumber = Number(roll);
    if (rolling || !Number.isFinite(rollNumber) || rollNumber < 1) return;

    spinningRef.current = false;
    const ud = sceneRef.current?.diceGroup.userData as any;
    if (ud?.faceToCamera) ud.faceToCamera(rollNumber - 1);
  }, [rolling, roll]);

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
      {revealed && Number.isFinite(rollNumber) && (
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
