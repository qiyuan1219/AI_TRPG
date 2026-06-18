import type { ContentPack } from './contentPack';

const packs = new Map<string, ContentPack>();

export function registerContentPack(pack: ContentPack) {
  packs.set(pack.packId, pack);
}

export function getContentPack(packId: string) {
  return packs.get(packId);
}

export function listContentPacks() {
  return [...packs.values()];
}

export function clearContentPacksForTest() {
  packs.clear();
}
