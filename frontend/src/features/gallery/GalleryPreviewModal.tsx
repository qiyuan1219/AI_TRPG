import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { GalleryAsset } from './galleryTypes';
import { getGalleryCategoryLabel } from './galleryUtils';

interface GalleryPreviewModalProps {
  assets: GalleryAsset[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

export function GalleryPreviewModal({ assets, index, onIndexChange, onClose }: GalleryPreviewModalProps) {
  const [uiHidden, setUiHidden] = useState(false);
  const asset = assets[index];
  const total = assets.length;

  useEffect(() => {
    setUiHidden(false);
  }, [asset?.id]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (!asset) return;
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') onIndexChange((index - 1 + total) % total);
      if (event.key === 'ArrowRight') onIndexChange((index + 1) % total);
      if (event.key === ' ') {
        event.preventDefault();
        setUiHidden((value) => !value);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [asset, index, onClose, onIndexChange, total]);

  if (!asset) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={`gallery-preview-backdrop ${uiHidden ? 'is-ui-hidden' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={`预览素材：${asset.title}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <button type="button" className="gallery-preview-hit-area" aria-label="关闭预览" onClick={onClose} />
        <button type="button" className="gallery-preview-nav is-prev" onClick={() => onIndexChange((index - 1 + total) % total)}>
          ←
        </button>
        <button type="button" className="gallery-preview-nav is-next" onClick={() => onIndexChange((index + 1) % total)}>
          →
        </button>

        <motion.section
          className="gallery-preview-stage"
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="gallery-preview-media">
            {asset.mediaType === 'image' && <img src={asset.path} alt={asset.title} />}
            {asset.mediaType === 'audio' && (
              <div className="gallery-audio-preview">
                <span>♪</span>
                <audio controls src={asset.path} />
              </div>
            )}
            {asset.mediaType === 'video' && <video controls src={asset.path} />}
            {asset.mediaType === 'unknown' && <p>暂不支持预览该素材类型。</p>}
          </div>

          <footer className="gallery-preview-info">
            <div>
              <b>{asset.title}</b>
              <span>{index + 1} / {total} · {getGalleryCategoryLabel(asset.category)}</span>
              <small>{asset.path}</small>
            </div>
            <div>
              <button type="button" onClick={() => setUiHidden((value) => !value)}>隐藏 UI</button>
              <button type="button" onClick={onClose}>关闭</button>
            </div>
          </footer>
        </motion.section>
      </motion.div>
    </AnimatePresence>
  );
}

