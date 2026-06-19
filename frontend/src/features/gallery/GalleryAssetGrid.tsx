import type { GalleryAsset } from './galleryTypes';
import { GalleryAssetCard } from './GalleryAssetCard';

interface GalleryAssetGridProps {
  assets: GalleryAsset[];
  onOpen: (index: number) => void;
}

export function GalleryAssetGrid({ assets, onOpen }: GalleryAssetGridProps) {
  if (!assets.length) {
    return (
      <div className="gallery-empty">
        <b>这个分类暂时没有素材</b>
        <span>把素材放进 frontend/public/assets 后重新生成 manifest 即可出现。</span>
      </div>
    );
  }

  return (
    <section className="gallery-asset-grid" aria-label="素材网格">
      {assets.map((asset, index) => (
        <GalleryAssetCard key={asset.id} asset={asset} onOpen={() => onOpen(index)} />
      ))}
    </section>
  );
}

