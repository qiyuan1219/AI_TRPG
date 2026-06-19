import type { GalleryAsset } from './galleryTypes';
import { getGalleryCardClass, getGalleryCategoryLabel } from './galleryUtils';

interface GalleryAssetCardProps {
  asset: GalleryAsset;
  onOpen: () => void;
}

export function GalleryAssetCard({ asset, onOpen }: GalleryAssetCardProps) {
  return (
    <button type="button" className={`gallery-asset-card ${getGalleryCardClass(asset)}`} onClick={onOpen}>
      <span className="gallery-asset-thumb">
        {asset.mediaType === 'image' ? (
          <img src={asset.path} alt={asset.title} loading="lazy" />
        ) : asset.mediaType === 'audio' ? (
          <i aria-hidden="true">♪</i>
        ) : asset.mediaType === 'video' ? (
          <video src={asset.path} muted preload="metadata" />
        ) : (
          <i aria-hidden="true">?</i>
        )}
      </span>
      <span className="gallery-asset-copy">
        <b>{asset.title}</b>
        <small>{getGalleryCategoryLabel(asset.category)}</small>
      </span>
    </button>
  );
}

