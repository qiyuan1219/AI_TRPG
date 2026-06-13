import type { GameState, SceneVisual } from '../types/game';

export const DND_SCENES: SceneVisual[] = [
  {
    id: 'inverse-city',
    title: '逆穹悬城',
    subtitle: '倒挂在穹顶下的奇迹城邦',
    aliases: ['逆穹悬城', '逆穹城', '倒挂城市', '城市', '城中', '主缆街', '入城平台'],
    themeClass: 'scene-crown-city',
    backgroundImage: '/assets/scenes/01inverse-city-first-sight.webp',
    bgStages: [
      {
        trigger: '你们刚离开主缆街口，前方忽然传来一阵刺耳的金属摩擦声',
        image: '/assets/scenes/02tutorial-battle-trigger.webp',
      },
      {
        trigger: '最后一只裂隙爬兽被银白色光芒逼退',
        image: '/assets/scenes/03post-battle-street.webp',
      },
    ],
  },
  {
    id: 'guild',
    title: '冒险者公会',
    subtitle: '委托、远征档案与失踪者名单',
    aliases: ['冒险者公会', '公会', '公会大厅'],
    themeClass: 'scene-guild',
    backgroundImage: '/assets/scenes/04guild-interior.webp',
    bgStages: [
      {
        trigger: '推开厚重的橡木门',
        image: '/assets/scenes/04guild-interior.webp',
      },
    ],
  },
  {
    id: 'tavern',
    title: '回声酒馆',
    subtitle: '传闻、情报与一杯暖酒',
    aliases: ['回声酒馆', '酒馆', '萨洛'],
    themeClass: 'scene-guild',
    backgroundImage: '/assets/scenes/06tavern-interior.webp',
  },
  {
    id: 'market',
    title: '补给市场',
    subtitle: '抗孢面罩、冷光灯、远征工具与黑市讲价',
    aliases: ['补给市场', '市场', '黑市', '黑市摊位', '奥兰', '讲价'],
    themeClass: 'scene-library',
    backgroundImage: '/assets/scenes/07blackmarket-stall.webp',
  },
  {
    id: 'forge',
    title: '匠炉区',
    subtitle: '武器锻造、装备维修与工程之谜',
    aliases: ['匠炉区', '匠炉', '武器店'],
    themeClass: 'scene-chapel',
  },
  {
    id: 'temple',
    title: '静默神殿',
    subtitle: '治疗、安魂与远征者遗录',
    aliases: ['静默神殿', '神殿'],
    themeClass: 'scene-sanctum',
    backgroundImage: '/assets/scenes/05temple-interior.png',
    bgStages: [
      {
        trigger: '静默神殿',
        image: '/assets/scenes/05temple-interior.png',
      },
    ],
  },
  {
    id: 'observatory',
    title: '黑石观测台',
    subtitle: '地脉震动、魔力脉冲与时间异常',
    aliases: ['黑石观测台', '观测台', '黑石台'],
    themeClass: 'scene-tomb',
  },
  {
    id: 'cable-elevator',
    title: '降渊缆梯',
    subtitle: '九条秘银主缆垂向深渊',
    aliases: ['降渊缆梯', '缆梯', '缆梯中枢', '吊舱', '垂降'],
    themeClass: 'scene-maze',
    backgroundImage: '/assets/scenes/elevator-hub.webp',
  },
  {
    id: 'spore-outpost',
    title: '孢海据点',
    subtitle: '半废弃的前线安全点',
    aliases: ['孢海据点', '据点', '缆梯底部'],
    themeClass: 'scene-chapel',
  },
  {
    id: 'blue-cap-shallows',
    title: '蓝伞浅滩',
    subtitle: '巨大菌伞像沉默的灯塔',
    aliases: ['蓝伞浅滩', '浅滩', '蓝伞'],
    themeClass: 'scene-library',
  },
  {
    id: 'echo-fungus-forest',
    title: '回声菌林',
    subtitle: '菌柱间传来模仿人声的低语',
    aliases: ['回声菌林', '菌林', '回声区'],
    themeClass: 'scene-maze',
  },
  {
    id: 'bone-pillar-marsh',
    title: '骨柱湿地',
    subtitle: '菌毯陷落与寄生魔物的领地',
    aliases: ['骨柱湿地', '湿地', '骨柱'],
    themeClass: 'scene-tomb',
  },
  {
    id: 'blackstone-root',
    title: '黑石根区',
    subtitle: '黑色方尖碑碎片在菌丝中发光',
    aliases: ['黑石根区', '黑石区', '根区', '黑石'],
    themeClass: 'scene-sanctum',
  },
  {
    id: 'dark-gate-vestibule',
    title: '黑暗之门前庭',
    subtitle: '三重时间纹路封印的古老入口',
    aliases: ['黑暗之门前庭', '前庭', '黑门前', '黑暗之门', '门前'],
    themeClass: 'scene-sanctum',
  },
];

export function resolveDndScene(state: GameState): SceneVisual {
  const area = String(state.current_area || '');
  const matched = DND_SCENES.find((scene) =>
    scene.aliases.some((alias) => area.includes(alias)),
  );

  if (matched) return matched;
  return DND_SCENES[0];
}
