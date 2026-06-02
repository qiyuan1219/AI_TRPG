import type { GameState, SceneVisual } from '../types/game';

export const DND_SCENES: SceneVisual[] = [
  {
    id: 'crown-city',
    title: '王冠城',
    subtitle: '中央广场与王宫高塔',
    aliases: ['王冠城', '中央广场', '王宫'],
    themeClass: 'scene-crown-city',
  },
  {
    id: 'guild',
    title: '冒险者公会',
    subtitle: '悬赏、同伴与传闻',
    aliases: ['冒险者公会', '公会', '碎盾', '酒馆'],
    themeClass: 'scene-guild',
  },
  {
    id: 'b1-chapel',
    title: 'B1 废弃圣堂',
    subtitle: '腐化圣光仍在穹顶下回响',
    aliases: ['B1', '废弃圣堂', '圣堂'],
    themeClass: 'scene-chapel',
  },
  {
    id: 'b2-library',
    title: 'B2 幽暗书库',
    subtitle: '禁忌文字在暗处翻页',
    aliases: ['B2', '幽暗书库', '书库'],
    themeClass: 'scene-library',
  },
  {
    id: 'b3-maze',
    title: 'B3 囚徒迷宫',
    subtitle: '铁门、回声与追踪印记',
    aliases: ['B3', '囚徒迷宫', '迷宫'],
    themeClass: 'scene-maze',
  },
  {
    id: 'b4-tomb',
    title: 'B4 皇家墓穴',
    subtitle: '王血与旧誓言沉在石棺中',
    aliases: ['B4', '皇家墓穴', '墓穴'],
    themeClass: 'scene-tomb',
  },
  {
    id: 'b5-sanctum',
    title: 'B5 碎冠圣所',
    subtitle: '深渊尽头的王冠残响',
    aliases: ['B5', '碎冠圣所', '圣所', '碎冠'],
    themeClass: 'scene-sanctum',
  },
];

export function resolveDndScene(state: GameState): SceneVisual {
  const area = String(state.current_area || '');
  const matched = DND_SCENES.find((scene) =>
    scene.aliases.some((alias) => area.includes(alias)),
  );

  if (matched) return matched;

  const clearedLevels = Number(state.cleared_levels || 0);
  return DND_SCENES[Math.min(clearedLevels, DND_SCENES.length - 1)] || DND_SCENES[0];
}
