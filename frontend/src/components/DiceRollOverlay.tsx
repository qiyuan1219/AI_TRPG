import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import * as THREE from 'three';
import type { DiceResult } from '../types/game';

export interface DiceRollOverlayProps {
  dice: DiceResult | null;
  onClose: () => void;
}

// ── 结果格式化 ──
function formatResult(dice: DiceResult) {
  const d = dice.data;
  if (dice.type === 'skill_check') {
    const raw = d['掷骰']?.replace('D20=', '') || '?';
    return {
      label: d['成功'] ? '检定成功' : '检定失败',
      roll: raw,
      total: String(d['总计'] ?? '?'),
      dc: String(d['DC'] ?? '?'),
      success: Boolean(d['成功']),
      attr: String(d['属性'] ?? ''),
    };
  }
  if (dice.type === 'attack_roll') {
    const raw = d['攻击掷骰']?.match(/D20=(\d+)/)?.[1] || '?';
    return {
      label: d['命中'] ? '命中!' : '未命中',
      roll: raw,
      total: String(d['总计'] ?? '?'),
      dc: 'AC' + String(d['目标AC'] ?? '?'),
      success: Boolean(d['命中']),
      attr: String(d['武器'] ?? ''),
    };
  }
  return { label: '掷骰', roll: '?', total: '?', dc: '?', success: false, attr: '' };
}

// ── 生成 1-20 的数字纹理 (canvas-based sprite) ──
function createNumberTexture(num: number, size: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#1a1206';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `bold ${size * 0.55}px serif`;
  ctx.fillText(String(num), size / 2, size / 2);
  return new THREE.CanvasTexture(canvas);
}

// ── 计算二十面体 20 个面的中心与法线 ──
function icosaFaceData(radius: number) {
  const geo = new THREE.IcosahedronGeometry(radius, 0);
  const pos = geo.attributes.position.array as Float32Array;
  const faces: { center: THREE.Vector3; normal: THREE.Vector3 }[] = [];
  for (let i = 0; i < 20; i++) {
    const i9 = i * 9;
    const a = new THREE.Vector3(pos[i9], pos[i9 + 1], pos[i9 + 2]);
    const b = new THREE.Vector3(pos[i9 + 3], pos[i9 + 4], pos[i9 + 5]);
    const c = new THREE.Vector3(pos[i9 + 6], pos[i9 + 7], pos[i9 + 8]);
    const center = a.clone().add(b).add(c).multiplyScalar(1 / 3);
    const normal = new THREE.Vector3().crossVectors(b.clone().sub(a), c.clone().sub(a)).normalize();
    if (normal.dot(center) < 0) normal.negate();
    faces.push({ center, normal });
  }
  return faces;
}

// ── 3D 骰子画布 (纯 Three.js, 无 fiber) ──
function useDiceCanvas(spinning: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- 初始化 ---
    const w = 220, h = 220;
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(38, w / h, 0.5, 20);
    camera.position.set(0, 0.3, 4.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // 光照
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const p1 = new THREE.PointLight(0xfff8e7, 1.2);
    p1.position.set(4, 3, 5);
    scene.add(p1);
    const p2 = new THREE.PointLight(0x8b7d6b, 0.5);
    p2.position.set(-3, -2, -4);
    scene.add(p2);
    const d1 = new THREE.DirectionalLight(0xffe0a0, 0.6);
    d1.position.set(0, 5, 2);
    scene.add(d1);

    // 骰子组
    const diceGroup = new THREE.Group();

    // 主体: 金色二十面体
    const bodyGeo = new THREE.IcosahedronGeometry(1.5, 0);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xc9a050, metalness: 0.55, roughness: 0.35 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    diceGroup.add(body);

    // 棱线
    const edgeGeo = new THREE.EdgesGeometry(bodyGeo, 12);
    const edgeMat = new THREE.LineBasicMaterial({ color: 0x5a3d1a, transparent: true, opacity: 0.7 });
    diceGroup.add(new THREE.LineSegments(edgeGeo, edgeMat));

    // 面数精灵
    const faceData = icosaFaceData(1.5);
    faceData.forEach(({ center, normal }, i) => {
      const tex = createNumberTexture(i + 1, 64);
      const spriteMat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(0.5, 0.5, 1);
      const pos = center.clone().add(normal.clone().multiplyScalar(0.07));
      sprite.position.copy(pos);
      diceGroup.add(sprite);
    });

    scene.add(diceGroup);

    // --- 动画循环 ---
    let animId = 0;
    const clock = new THREE.Clock();
    const floatBase = diceGroup.position.clone();

    function animate() {
      animId = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.1);

      if (spinning) {
        diceGroup.rotation.x += dt * 9;
        diceGroup.rotation.y += dt * 7;
        diceGroup.rotation.z += dt * 5;
        diceGroup.position.copy(floatBase);
      } else {
        diceGroup.rotation.y += dt * 0.3;
        diceGroup.position.y = floatBase.y + Math.sin(Date.now() * 0.001) * 0.08;
      }

      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [spinning]);

  return containerRef;
}

// ── 主组件 ──
export function DiceRollOverlay({ dice, onClose }: DiceRollOverlayProps) {
  const [phase, setPhase] = useState<'rolling' | 'reveal' | 'idle'>('idle');
  const containerRef = useDiceCanvas(phase === 'rolling');

  useEffect(() => {
    if (!dice) {
      setPhase('idle');
      return;
    }

    setPhase('rolling');
    const revealTimer = window.setTimeout(() => {
      setPhase('reveal');
      const closeTimer = window.setTimeout(() => onClose(), 2800);
      return () => window.clearTimeout(closeTimer);
    }, 1800);

    return () => window.clearTimeout(revealTimer);
  }, [dice, onClose]);

  if (!dice || phase === 'idle') return null;

  const result = formatResult(dice);
  const bonus = Number(dice.data['加值'] ?? 0);
  const isNat20 = result.roll === '20';
  const isNat1 = result.roll === '1';

  return (
    <AnimatePresence>
      <motion.div
        className="dice-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={phase === 'reveal' ? onClose : undefined}
      >
        <motion.div
          className="dice-modal dice-modal-3d"
          initial={{ scale: 0.7, y: 40 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── 3D 骰子画布 ── */}
          <div className="dice-canvas-wrap" ref={containerRef}>
            {/* 揭示时叠加结果数字 */}
            <AnimatePresence>
              {phase === 'reveal' && (
                <motion.div
                  className={`dice-result-badge ${isNat20 ? 'badge-crit' : ''} ${isNat1 ? 'badge-fumble' : ''}`}
                  initial={{ scale: 0, rotateZ: -30 }}
                  animate={{ scale: 1, rotateZ: 0 }}
                  transition={{ type: 'spring', stiffness: 360, damping: 16, delay: 0.15 }}
                >
                  <span className="badge-num">{result.roll}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── 检定信息 ── */}
          <motion.div
            className="dice-info"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: phase === 'reveal' ? 1 : 0, y: phase === 'reveal' ? 0 : 12 }}
            transition={{ delay: 0.2, duration: 0.35 }}
          >
            {result.attr && <div className="dice-attr">{result.attr}</div>}

            <div className="dice-calc">
              <span>D20</span>
              <span className={`dice-roll-val ${isNat20 ? 'text-teal' : ''} ${isNat1 ? 'text-danger' : ''}`}>
                {result.roll}
              </span>
              {bonus !== 0 && (
                <>
                  <span>{bonus > 0 ? '+' : ''}</span>
                  <span>{bonus}</span>
                </>
              )}
              <span>=</span>
              <span className="dice-total">{result.total}</span>
            </div>

            <div className="dice-dc">
              <span>/</span>
              <span>DC {result.dc.replace('AC', '').trim()}</span>
            </div>

            <motion.div
              className={`dice-verdict ${result.success ? 'verdict-success' : 'verdict-fail'}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 400 }}
            >
              {isNat20 ? '🎉 大成功!' : isNat1 ? '💀 大失败!' : result.success ? '通过 ✓' : '失败 ✗'}
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
