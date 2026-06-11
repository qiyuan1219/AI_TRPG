import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DND_SCENES } from '../data/dndScenes';
import { resolvePortraitPath } from '../data/characterRegistry';

interface SceneBgTestScreenProps {
  onBack: () => void;
}

/** 自动从所有场景中收集的背景条目 */
interface BgEntry {
  key: string;
  sceneId: string;
  sceneTitle: string;
  label: string;
  image: string;
  trigger: string;
}

const TEST_CHARACTERS = [
  { id: 'none', label: '无立绘', portrait: null },
  { id: 'selin', label: '瑟琳', portrait: resolvePortraitPath('瑟琳') },
  { id: 'guard', label: '守卫', portrait: resolvePortraitPath('守卫') },
];

/** 遍历所有场景，自动收集所有背景图 */
function collectAllBackgrounds(): BgEntry[] {
  const entries: BgEntry[] = [];

  for (const scene of DND_SCENES) {
    const stages = scene.bgStages || [];

    // 场景的主背景图
    if (scene.backgroundImage) {
      const firstTrigger = stages[0]?.trigger || '—';
      entries.push({
        key: `${scene.id}-main`,
        sceneId: scene.id,
        sceneTitle: scene.title,
        label: stages.length > 0 ? '初见' : '主背景',
        image: scene.backgroundImage,
        trigger: firstTrigger,
      });
    }

    // bgStages 中的额外阶段
    for (let i = 0; i < stages.length; i++) {
      const stage = stages[i];
      // 如果 stage.image 和主背景相同，跳过（已在上面添加）
      if (stage.image === scene.backgroundImage) continue;

      entries.push({
        key: `${scene.id}-stage${i}`,
        sceneId: scene.id,
        sceneTitle: scene.title,
        label: `阶段${i + 1}`,
        image: stage.image,
        trigger: stage.trigger,
      });
    }
  }

  return entries;
}

export function SceneBgTestScreen({ onBack }: SceneBgTestScreenProps) {
  const [activeBgKey, setActiveBgKey] = useState<string | null>(null);
  const [activeCharacter, setActiveCharacter] = useState(TEST_CHARACTERS[0].id);

  // 自动枚举所有背景
  const allBgEntries = useMemo(() => collectAllBackgrounds(), []);
  const activeEntry = allBgEntries.find((e) => e.key === activeBgKey);
  const currentBg = activeEntry?.image ?? null;
  const currentPortrait = TEST_CHARACTERS.find((c) => c.id === activeCharacter)?.portrait ?? null;

  // 按场景分组
  const grouped = useMemo(() => {
    const map = new Map<string, BgEntry[]>();
    for (const entry of allBgEntries) {
      if (!map.has(entry.sceneId)) map.set(entry.sceneId, []);
      map.get(entry.sceneId)!.push(entry);
    }
    return map;
  }, [allBgEntries]);

  // 找场景信息
  const sceneForBg = activeEntry
    ? DND_SCENES.find((s) => s.id === activeEntry.sceneId)
    : null;

  return (
    <main className="test-screen">
      <motion.section
        className="test-layout"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <header className="test-header">
          <div>
            <p className="eyebrow">TEST LAB</p>
            <h1>场景背景</h1>
          </div>
          <button type="button" className="ghost-button" onClick={onBack}>
            返回
          </button>
        </header>

        {/* 背景预览区 */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16/9',
            borderRadius: 8,
            overflow: 'hidden',
            border: '1px solid rgba(231,211,161,0.2)',
            background: '#0d1016',
          }}
        >
          <div
            style={{
              position: 'absolute', inset: 0, zIndex: 1,
              background: 'linear-gradient(180deg, rgba(0,0,0,0.12), rgba(0,0,0,0.62)), linear-gradient(90deg, rgba(0,0,0,0.3), transparent 32%, transparent 68%, rgba(0,0,0,0.35))',
            }}
          />

          <AnimatePresence>
            {currentBg && (
              <motion.div
                key={`test-bg-${activeBgKey}`}
                style={{
                  position: 'absolute', inset: 0, zIndex: 0,
                  backgroundImage: `url(${currentBg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: currentPortrait ? 0.6 : 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {currentPortrait && (
              <div style={{ position: 'absolute', inset: 0, zIndex: 2, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                <motion.img
                  key={activeCharacter}
                  src={currentPortrait}
                  alt={activeCharacter}
                  style={{ maxHeight: '90%', objectFit: 'contain' }}
                  initial={{ opacity: 0, filter: 'blur(8px) brightness(1.4)' }}
                  animate={{ opacity: 1, filter: 'blur(0px) brightness(1)' }}
                  exit={{ opacity: 0, filter: 'blur(4px) brightness(0.8)', transition: { duration: 0.5 } }}
                  transition={{ duration: 0.7 }}
                />
              </div>
            )}
          </AnimatePresence>

          {activeEntry && (
            <div
              style={{
                position: 'absolute', top: 12, left: 12, zIndex: 3,
                background: 'rgba(0,0,0,0.65)', color: 'var(--gold-soft)',
                padding: '4px 12px', borderRadius: 4, fontSize: '0.85rem',
                backdropFilter: 'blur(8px)',
              }}
            >
              {activeEntry.sceneTitle} · {activeEntry.label}
            </div>
          )}
        </div>

        {/* 控制面板 */}
        <div style={{ display: 'grid', gap: 16, marginTop: 16 }}>

          {/* 按场景分组列出所有背景 */}
          {Array.from(grouped.entries()).map(([sceneId, entries]) => (
            <div
              key={sceneId}
              style={{
                padding: 18, borderRadius: 8,
                border: '1px solid rgba(231,211,161,0.2)',
                background: 'rgba(16,19,26,0.82)',
              }}
            >
              <h3 style={{ margin: '0 0 10px', color: 'var(--gold-soft)', fontSize: '1rem' }}>
                {DND_SCENES.find((s) => s.id === sceneId)?.title || sceneId}
                <span style={{ color: 'var(--muted)', fontSize: '0.75rem', marginLeft: 8 }}>
                  ({entries.length} 张)
                </span>
              </h3>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {entries.map((entry) => (
                  <button
                    key={entry.key}
                    type="button"
                    className={activeBgKey === entry.key ? 'start-button' : 'ghost-button'}
                    onClick={() => setActiveBgKey(entry.key)}
                    style={{ fontSize: '0.8rem' }}
                  >
                    {entry.label}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* 当前选中背景信息 */}
          {activeEntry && (
            <div
              style={{
                padding: 18, borderRadius: 8,
                border: '1px solid rgba(231,211,161,0.2)',
                background: 'rgba(16,19,26,0.82)',
              }}
            >
              <h3 style={{ margin: '0 0 8px', color: 'var(--gold-soft)', fontSize: '1rem' }}>当前背景</h3>
              <table style={{ width: '100%', fontSize: '0.82rem', color: 'var(--text)' }}>
                <tbody>
                  <tr>
                    <td style={{ color: 'var(--muted)', padding: '2px 12px 2px 0', whiteSpace: 'nowrap' }}>场景</td>
                    <td>{activeEntry.sceneTitle}</td>
                  </tr>
                  <tr>
                    <td style={{ color: 'var(--muted)', padding: '2px 12px 2px 0', whiteSpace: 'nowrap' }}>阶段</td>
                    <td>{activeEntry.label}</td>
                  </tr>
                  <tr>
                    <td style={{ color: 'var(--muted)', padding: '2px 12px 2px 0', whiteSpace: 'nowrap' }}>触发词</td>
                    <td>"{activeEntry.trigger}"</td>
                  </tr>
                  <tr>
                    <td style={{ color: 'var(--muted)', padding: '2px 12px 2px 0', whiteSpace: 'nowrap' }}>路径</td>
                    <td style={{ fontSize: '0.75rem', wordBreak: 'break-all' }}>{activeEntry.image}</td>
                  </tr>
                  <tr>
                    <td style={{ color: 'var(--muted)', padding: '2px 12px 2px 0', whiteSpace: 'nowrap' }}>CSS 主题</td>
                    <td>{sceneForBg?.themeClass || '—'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* 角色立绘切换 */}
          <div
            style={{
              padding: 18, borderRadius: 8,
              border: '1px solid rgba(231,211,161,0.2)',
              background: 'rgba(16,19,26,0.82)',
            }}
          >
            <h3 style={{ margin: '0 0 12px', color: 'var(--gold-soft)', fontSize: '1rem' }}>角色立绘（测试透明度）</h3>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {TEST_CHARACTERS.map((ch) => (
                <button
                  key={ch.id}
                  type="button"
                  className={activeCharacter === ch.id ? 'start-button' : 'ghost-button'}
                  onClick={() => setActiveCharacter(ch.id)}
                  style={{ fontSize: '0.82rem' }}
                >
                  {ch.label}
                </button>
              ))}
            </div>
          </div>

          {/* 统计总览 */}
          <div
            style={{
              padding: 18, borderRadius: 8,
              border: '1px solid rgba(231,211,161,0.2)',
              background: 'rgba(16,19,26,0.82)',
            }}
          >
            <h3 style={{ margin: '0 0 4px', color: 'var(--gold-soft)', fontSize: '1rem' }}>总览</h3>
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.78rem' }}>
              共 {grouped.size} 个场景，{allBgEntries.length} 张背景图。
              新增场景背景只需在 <code>dndScenes.ts</code> 中添加配置即可自动出现在此处。
            </p>
          </div>
        </div>
      </motion.section>
    </main>
  );
}
