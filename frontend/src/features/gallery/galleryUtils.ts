import type { GalleryAsset, GalleryCategory } from './galleryTypes';

export const GALLERY_CATEGORY_LABELS: Record<GalleryCategory, string> = {
  all: '全部',
  scene: '场景背景',
  cg: '剧情 CG',
  character: '角色立绘',
  chibi: 'Q版角色',
  enemy: '敌人图鉴',
  item: '道具图标',
  building: '建筑图标',
  ui: 'UI 素材',
  map: '地图素材',
  audio: '音频素材',
  video: '视频素材',
  other: '其他',
};

export const GALLERY_CATEGORY_ORDER: GalleryCategory[] = [
  'all',
  'scene',
  'cg',
  'character',
  'chibi',
  'enemy',
  'item',
  'building',
  'ui',
  'map',
  'audio',
  'video',
  'other',
];

export function getGalleryCategoryLabel(category: GalleryCategory) {
  return GALLERY_CATEGORY_LABELS[category] || category;
}

export function getGalleryCardClass(asset: GalleryAsset) {
  if (asset.category === 'scene' || asset.category === 'cg' || asset.category === 'map') return 'is-wide';
  if (asset.category === 'character' || asset.category === 'chibi' || asset.category === 'enemy') return 'is-portrait';
  return 'is-square';
}

export function sortGalleryAssets(assets: GalleryAsset[]) {
  return [...assets].sort((a, b) => a.sortKey.localeCompare(b.sortKey, 'zh-Hans-CN'));
}

