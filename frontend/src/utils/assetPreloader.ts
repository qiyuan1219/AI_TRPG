import type { ScriptedLine, ScriptedScene } from '../data/scriptedScenes';
import { resolvePortraitPath } from '../data/characterRegistry';
import type { SceneVisual, StoryLine } from '../types/game';

type Priority = 'high' | 'normal' | 'low';

const IMAGE_RE = /\.(png|jpe?g|webp|gif|svg)(?:[?#].*)?$/i;
const MAX_CONCURRENT_IMAGE_PRELOADS = 2;
const preloadedImages = new Set<string>();
const pendingImages = new Set<string>();
const imageQueue: Array<{ src: string; priority: Priority }> = [];
let activeImageLoads = 0;

function isBrowser() {
  return typeof window !== 'undefined' && typeof Image !== 'undefined';
}

function normalizeAssetPath(src?: string | null) {
  const value = String(src || '').trim();
  if (!value) return '';
  if (value.startsWith('data:') || value.startsWith('blob:')) return '';
  return value;
}

function isImageAsset(src?: string | null) {
  const value = normalizeAssetPath(src);
  return Boolean(value && IMAGE_RE.test(value));
}

function enqueueImage(src: string, priority: Priority) {
  if (!isBrowser() || !isImageAsset(src)) return;
  if (preloadedImages.has(src) || pendingImages.has(src)) return;

  pendingImages.add(src);
  const item = { src, priority };
  if (priority === 'high') imageQueue.unshift(item);
  else imageQueue.push(item);
  runQueue();
}

function runQueue() {
  if (!isBrowser()) return;
  while (activeImageLoads < MAX_CONCURRENT_IMAGE_PRELOADS && imageQueue.length) {
    const item = imageQueue.shift();
    if (!item) return;

    activeImageLoads += 1;
    const img = new Image();
    img.decoding = 'async';

    const finish = () => {
      activeImageLoads = Math.max(0, activeImageLoads - 1);
      pendingImages.delete(item.src);
      preloadedImages.add(item.src);
      window.setTimeout(runQueue, item.priority === 'low' ? 120 : 0);
    };

    img.onload = finish;
    img.onerror = finish;
    img.src = item.src;
  }
}

function addAsset(target: Set<string>, src?: string | null) {
  const value = normalizeAssetPath(src);
  if (isImageAsset(value)) target.add(value);
}

function collectLineAssets(line?: Pick<StoryLine | ScriptedLine, 'speaker' | 'portrait' | 'bgImage'> | null) {
  const assets = new Set<string>();
  if (!line) return assets;
  addAsset(assets, line.bgImage);
  addAsset(assets, line.portrait);
  addAsset(assets, resolvePortraitPath(line.speaker));
  return assets;
}

export function preloadImageAssets(paths: Array<string | null | undefined>, priority: Priority = 'normal') {
  for (const path of paths) {
    const value = normalizeAssetPath(path);
    if (value) enqueueImage(value, priority);
  }
}

export function preloadStoryLineAssets(lines: Array<StoryLine | undefined | null>, priority: Priority = 'normal') {
  const assets = new Set<string>();
  for (const line of lines) {
    for (const asset of collectLineAssets(line)) assets.add(asset);
  }
  preloadImageAssets([...assets], priority);
}

export function preloadScriptedSceneAssets(
  scene: ScriptedScene,
  options: { lines?: ScriptedLine[]; eagerLineCount?: number } = {},
) {
  const lines = options.lines ?? scene.lines;
  const eagerLineCount = options.eagerLineCount ?? 3;

  preloadImageAssets([scene.bgImage, ...lines.slice(0, eagerLineCount).flatMap((line) => [...collectLineAssets(line)])], 'high');

  const restAssets = new Set<string>();
  for (const line of lines.slice(eagerLineCount)) {
    for (const asset of collectLineAssets(line)) restAssets.add(asset);
  }
  preloadImageAssets([...restAssets], 'low');
}

export function preloadSceneVisualAssets(scene?: SceneVisual | null, priority: Priority = 'normal') {
  if (!scene) return;
  preloadImageAssets([
    scene.backgroundImage,
    ...(scene.bgStages || []).map((stage) => stage.image),
  ], priority);
}

