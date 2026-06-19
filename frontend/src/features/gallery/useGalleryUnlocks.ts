import type { GalleryAsset } from './galleryTypes';

const GALLERY_DEBUG_UNLOCK_ALL = true;

export function useGalleryUnlocks() {
  return {
    unlockAll: GALLERY_DEBUG_UNLOCK_ALL,
    isUnlocked: (_asset: GalleryAsset) => GALLERY_DEBUG_UNLOCK_ALL,
  };
}

