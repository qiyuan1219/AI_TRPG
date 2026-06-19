export type GalleryCategory =
  | 'all'
  | 'scene'
  | 'cg'
  | 'character'
  | 'chibi'
  | 'enemy'
  | 'item'
  | 'building'
  | 'ui'
  | 'map'
  | 'audio'
  | 'video'
  | 'other';

export type GalleryMediaType = 'image' | 'audio' | 'video' | 'unknown';

export interface GalleryAsset {
  id: string;
  title: string;
  path: string;
  category: Exclude<GalleryCategory, 'all'>;
  mediaType: GalleryMediaType;
  ext: string;
  fileName: string;
  folder: string;
  tags: string[];
  sortKey: string;
}

