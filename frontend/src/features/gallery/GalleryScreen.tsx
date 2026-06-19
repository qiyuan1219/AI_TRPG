import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { galleryManifest } from '../../data/generated/galleryManifest';
import type { GalleryCategory } from './galleryTypes';
import { GalleryAssetGrid } from './GalleryAssetGrid';
import { GalleryCategoryTabs } from './GalleryCategoryTabs';
import { GalleryPreviewModal } from './GalleryPreviewModal';
import { GALLERY_CATEGORY_ORDER, getGalleryCategoryLabel, sortGalleryAssets } from './galleryUtils';
import { useGalleryUnlocks } from './useGalleryUnlocks';

interface GalleryScreenProps {
  onBack: () => void;
}

export function GalleryScreen({ onBack }: GalleryScreenProps) {
  const [category, setCategory] = useState<GalleryCategory>('all');
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const { isUnlocked } = useGalleryUnlocks();

  const assets = useMemo(() => sortGalleryAssets(galleryManifest.filter(isUnlocked)), [isUnlocked]);
  const filteredAssets = useMemo(
    () => category === 'all' ? assets : assets.filter((asset) => asset.category === category),
    [assets, category],
  );
  const counts = useMemo(() => {
    const base = Object.fromEntries(GALLERY_CATEGORY_ORDER.map((item) => [item, 0])) as Record<GalleryCategory, number>;
    base.all = assets.length;
    for (const asset of assets) base[asset.category] += 1;
    return base;
  }, [assets]);

  return (
    <main className="gallery-screen">
      <div className="gallery-background" />
      <motion.section
        className="gallery-shell"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <header className="gallery-header">
          <div>
            <p className="eyebrow">EARTH GATE ARCHIVE</p>
            <h1>素材画廊</h1>
            <span>自动收录 frontend/public/assets 下的角色、场景、道具、敌人与音频素材。</span>
          </div>
          <button type="button" className="gallery-back-button" onClick={onBack}>返回标题</button>
        </header>

        <div className="gallery-layout">
          <aside className="gallery-sidebar">
            <b>分类</b>
            <GalleryCategoryTabs active={category} counts={counts} onSelect={(next) => {
              setCategory(next);
              setPreviewIndex(null);
            }} />
          </aside>

          <section className="gallery-content">
            <div className="gallery-content-title">
              <div>
                <b>{getGalleryCategoryLabel(category)}</b>
                <span>{filteredAssets.length} / {assets.length} 个素材</span>
              </div>
              <small>点击卡片进入视觉小说式大图欣赏；Esc 关闭，←/→ 切换，Space 隐藏 UI。</small>
            </div>
            <GalleryAssetGrid assets={filteredAssets} onOpen={setPreviewIndex} />
          </section>
        </div>
      </motion.section>

      {previewIndex !== null && (
        <GalleryPreviewModal
          assets={filteredAssets}
          index={previewIndex}
          onIndexChange={setPreviewIndex}
          onClose={() => setPreviewIndex(null)}
        />
      )}
    </main>
  );
}

