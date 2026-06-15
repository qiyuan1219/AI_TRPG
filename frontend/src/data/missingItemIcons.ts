export interface MissingItemIcon {
  token: string;
  label: string;
  suggestedFile: string;
  usedBy: string[];
}

export const MISSING_REAL_ITEM_ICONS: MissingItemIcon[] = [
  { token: 'scroll-sealed', label: '封蜡报告卷轴', suggestedFile: '/assets/icons/items/scroll-sealed.png', usedBy: ['第三远征队失联报告'] },
  { token: 'book-open', label: '打开的登记册', suggestedFile: '/assets/icons/items/book-open.png', usedBy: ['失踪远征队登记册'] },
  { token: 'note-pencil', label: '铅笔便签', suggestedFile: '/assets/icons/items/note-pencil.png', usedBy: ['赫尔曼的抽屉笔记'] },
  { token: 'scroll-quill', label: '羽笔委托书', suggestedFile: '/assets/icons/items/scroll-quill.png', usedBy: ['指名委托书原件'] },
  { token: 'cards', label: '情报卡片组', suggestedFile: '/assets/icons/items/cards.png', usedBy: ['萨洛的情报卡片'] },
  { token: 'note-pin', label: '图钉便条', suggestedFile: '/assets/icons/items/note-pin.png', usedBy: ['酒馆传闻便条'] },
  { token: 'book-prayer', label: '祈祷名册', suggestedFile: '/assets/icons/items/book-prayer.png', usedBy: ['牺牲者遗录'] },
  { token: 'scroll-holy', label: '圣纹经文', suggestedFile: '/assets/icons/items/scroll-holy.png', usedBy: ['白枝修会巡礼经文'] },
  { token: 'book-accounts', label: '旧账本', suggestedFile: '/assets/icons/items/book-accounts.png', usedBy: ['奥兰的盲盒账本'] },
  { token: 'map-tunnel', label: '暗道草图', suggestedFile: '/assets/icons/items/map-tunnel.png', usedBy: ['黑市暗道草图'] },
  { token: 'scroll-log', label: '检修/巡逻日志', suggestedFile: '/assets/icons/items/scroll-log.png', usedBy: ['缆梯检修日志', '尼布的巡逻日志'] },
  { token: 'scroll-list', label: '补给清单', suggestedFile: '/assets/icons/items/scroll-list.png', usedBy: ['据点补给清单'] },
  { token: 'map-parchment', label: '羊皮纸地图', suggestedFile: '/assets/icons/items/map-parchment.png', usedBy: ['孢子海浅层地图'] },
  { token: 'note-blood', label: '染污布条', suggestedFile: '/assets/icons/items/note-blood.png', usedBy: ['巡逻队遗言线索'] },
  { token: 'journal-leaf', label: '生态笔记本', suggestedFile: '/assets/icons/items/journal-leaf.png', usedBy: ['布洛克的孢海生态笔记'] },
  { token: 'scroll-torn', label: '残破撤离记录', suggestedFile: '/assets/icons/items/scroll-torn.png', usedBy: ['废弃据点撤离记录'] },
  { token: 'scroll-dark', label: '黑斑污染报告', suggestedFile: '/assets/icons/items/scroll-dark.png', usedBy: ['黑石污染初步报告'] },
  { token: 'book-skull', label: '怪物图鉴', suggestedFile: '/assets/icons/items/book-skull.png', usedBy: ['骨柱湿地怪物图鉴'] },
  { token: 'scroll-star', label: '银杖观测笔记', suggestedFile: '/assets/icons/items/scroll-star.png', usedBy: ['瑟琳的银杖观测笔记'] },
  { token: 'note-torn', label: '断片证言', suggestedFile: '/assets/icons/items/note-torn.png', usedBy: ['莱因的断片证言'] },
  { token: 'scroll-medicine', label: '用药记录', suggestedFile: '/assets/icons/items/scroll-medicine.png', usedBy: ['远征队用药记录'] },
  { token: 'clue', label: '线索标记', suggestedFile: '/assets/icons/items/clue.png', usedBy: ['所有线索类道具'] },
  { token: 'default', label: '默认物品占位', suggestedFile: '/assets/icons/items/default.png', usedBy: ['尚未登记图标的普通物品'] },
];
