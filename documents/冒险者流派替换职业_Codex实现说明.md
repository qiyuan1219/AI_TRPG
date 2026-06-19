# 开局职业选择改为「冒险者流派」实现说明

## 目标

将开局的五职业选择改为五种「冒险者流派」。

原职业：

- 战士
- 游荡者
- 法师
- 牧师
- 圣骑士

改为：

- 铁缆流
- 影步流
- 秘析流
- 共鸣流
- 均衡流

核心原则：

1. 五个流派的战斗技能完全相同。
2. 五个流派的非战斗技能完全相同。
3. 差异只来自六维属性 `attributes`。
4. HP、AC、先攻全部由六维属性派生。
5. 不再为不同流派写死特殊 HP / AC。
6. 选择流派后保存 `selectedStyleId` 和 `player.attributes`。
7. 不再保存新的 `selectedClassId`。
8. 旧存档中的 `selectedClassId` 需要兼容迁移。

---

## 一、属性公式

统一使用下面公式：

```ts
function getModifier(value: number): number {
  return Math.floor((value - 10) / 2);
}

function getMaxHp(attributes: Attributes): number {
  return 36 + getModifier(attributes.con) * 3;
}

function getAc(attributes: Attributes): number {
  return 13 + getModifier(attributes.dex);
}

function rollInitiative(attributes: Attributes): number {
  return rollD20() + getModifier(attributes.dex);
}
```

属性修正示例：

| 属性值 | 修正值 |
|---:|---:|
| 8 | -1 |
| 10 | +0 |
| 12 | +1 |
| 13 | +1 |
| 14 | +2 |
| 15 | +2 |
| 16 | +3 |

---

## 二、五个流派数值总览

| 流派 | 力量 | 敏捷 | 体质 | 智力 | 感知 | 魅力 | HP | AC | 先攻 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 铁缆流 | 15 +2 | 10 +0 | 16 +3 | 10 +0 | 12 +1 | 10 +0 | 45 | 13 | +0 |
| 影步流 | 10 +0 | 16 +3 | 12 +1 | 10 +0 | 15 +2 | 10 +0 | 39 | 16 | +3 |
| 秘析流 | 8 -1 | 12 +1 | 12 +1 | 16 +3 | 15 +2 | 10 +0 | 39 | 14 | +1 |
| 共鸣流 | 8 -1 | 12 +1 | 12 +1 | 12 +1 | 13 +1 | 16 +3 | 39 | 14 | +1 |
| 均衡流 | 12 +1 | 12 +1 | 13 +1 | 12 +1 | 12 +1 | 12 +1 | 39 | 14 | +1 |

---

## 三、流派数据结构

请用下面数据替换原来的职业数据。

```ts
const PLAYER_STYLES = [
  {
    id: 'iron-cable',
    name: '铁缆流',
    hotkey: 'W',
    tagline: '稳健抗压，适合正面承受风险。',
    summary: '体质与力量较高，血量最高，适合在危险环境中稳定推进。',
    attributes: {
      str: 15,
      dex: 10,
      con: 16,
      int: 10,
      wis: 12,
      cha: 10,
    },
    derived: {
      hp: 45,
      ac: 13,
      initiativeModifier: 0,
    },
    advantages: [
      '血量最高',
      '力量与体质检定稳定',
      '适合承受危险',
    ],
    limitations: [
      '先攻较低',
      '潜行与交涉普通',
      '解谜与奥术分析不突出',
    ],
  },

  {
    id: 'shadow-step',
    name: '影步流',
    hotkey: 'R',
    tagline: '敏捷侦察，适合先手行动。',
    summary: '敏捷与感知较高，擅长潜行、侦察、发现陷阱和规避伏击。',
    attributes: {
      str: 10,
      dex: 16,
      con: 12,
      int: 10,
      wis: 15,
      cha: 10,
    },
    derived: {
      hp: 39,
      ac: 16,
      initiativeModifier: 3,
    },
    advantages: [
      '先攻最高',
      '潜行与侦察能力强',
      '容易发现陷阱和伏击',
    ],
    limitations: [
      '血量一般',
      '力量检定普通',
      '交涉与奥术分析不突出',
    ],
  },

  {
    id: 'arcane-analysis',
    name: '秘析流',
    hotkey: 'M',
    tagline: '理性分析，适合解谜和识破异常。',
    summary: '智力与感知较高，擅长奥术、历史、机关、异常规则和线索分析。',
    attributes: {
      str: 8,
      dex: 12,
      con: 12,
      int: 16,
      wis: 15,
      cha: 10,
    },
    derived: {
      hp: 39,
      ac: 14,
      initiativeModifier: 1,
    },
    advantages: [
      '智力最高',
      '解谜与奥术检定强',
      '容易识破异常规则',
    ],
    limitations: [
      '力量最低',
      '近身压制和搬运较弱',
      '交涉能力普通',
    ],
  },

  {
    id: 'resonance',
    name: '共鸣流',
    hotkey: 'C',
    tagline: '善于共情，适合交涉和建立信任。',
    summary: '魅力最高，兼具一定感知，擅长交涉、安抚、套话和提升 NPC 信任。',
    attributes: {
      str: 8,
      dex: 12,
      con: 12,
      int: 12,
      wis: 13,
      cha: 16,
    },
    derived: {
      hp: 39,
      ac: 14,
      initiativeModifier: 1,
    },
    advantages: [
      '魅力最高',
      '交涉和安抚能力强',
      '更容易提升 NPC 信任',
    ],
    limitations: [
      '力量较弱',
      '硬碰硬能力不突出',
      '高难度奥术分析不如秘析流',
    ],
  },

  {
    id: 'balanced',
    name: '均衡流',
    hotkey: 'P',
    tagline: '六维均衡，适合第一次游玩。',
    summary: '没有明显短板，所有检定都有基础表现，适合想体验完整内容的新手。',
    attributes: {
      str: 12,
      dex: 12,
      con: 13,
      int: 12,
      wis: 12,
      cha: 12,
    },
    derived: {
      hp: 39,
      ac: 14,
      initiativeModifier: 1,
    },
    advantages: [
      '没有明显短板',
      '所有检定都有基础加值',
      '适合体验完整内容',
    ],
    limitations: [
      '没有极端强项',
      '高 DC 检定不如专精流派',
      '战斗和剧情都偏稳但不爆发',
    ],
  },
];
```

> 注意：`derived` 字段可以用于 UI 展示，但实际战斗里仍然要通过公式从 `attributes` 动态计算，避免后续数值不一致。

---

## 四、五个流派详细说明

### 1. 铁缆流

定位：稳健抗压，适合正面承受风险。

属性：

```txt
力量 15  +2
敏捷 10  +0
体质 16  +3
智力 10  +0
感知 12  +1
魅力 10  +0

HP 45
AC 13
先攻 +0
```

优势：

- 血量最高
- 力量与体质检定稳定
- 适合承受危险

限制：

- 先攻较低
- 潜行与交涉普通
- 解谜与奥术分析不突出

---

### 2. 影步流

定位：敏捷侦察，适合先手行动。

属性：

```txt
力量 10  +0
敏捷 16  +3
体质 12  +1
智力 10  +0
感知 15  +2
魅力 10  +0

HP 39
AC 16
先攻 +3
```

优势：

- 先攻最高
- 潜行与侦察能力强
- 容易发现陷阱和伏击

限制：

- 血量一般
- 力量检定普通
- 交涉与奥术分析不突出

---

### 3. 秘析流

定位：理性分析，适合解谜和识破异常。

属性：

```txt
力量 8   -1
敏捷 12  +1
体质 12  +1
智力 16  +3
感知 15  +2
魅力 10  +0

HP 39
AC 14
先攻 +1
```

优势：

- 智力最高
- 解谜与奥术检定强
- 容易识破异常规则

限制：

- 力量最低
- 近身压制和搬运较弱
- 交涉能力普通

---

### 4. 共鸣流

定位：善于共情，适合交涉和建立信任。

属性：

```txt
力量 8   -1
敏捷 12  +1
体质 12  +1
智力 12  +1
感知 13  +1
魅力 16  +3

HP 39
AC 14
先攻 +1
```

优势：

- 魅力最高
- 交涉和安抚能力强
- 更容易提升 NPC 信任

限制：

- 力量较弱
- 硬碰硬能力不突出
- 高难度奥术分析不如秘析流

---

### 5. 均衡流

定位：六维均衡，适合第一次游玩。

属性：

```txt
力量 12  +1
敏捷 12  +1
体质 13  +1
智力 12  +1
感知 12  +1
魅力 12  +1

HP 39
AC 14
先攻 +1
```

优势：

- 没有明显短板
- 所有检定都有基础加值
- 适合体验完整内容

限制：

- 没有极端强项
- 高 DC 检定不如专精流派
- 战斗和剧情都偏稳但不爆发

---

## 五、统一战斗技能

五个流派显示完全相同的战斗技能，不要再按流派区分。

```ts
const COMMON_COMBAT_SKILLS = [
  {
    id: 'basic-attack',
    name: '基础攻击',
    desc: '攻击检定：D20 + 熟练值 + 当前武器属性修正 vs AC。',
  },
  {
    id: 'defensive-stance',
    name: '防守架势',
    desc: '本回合进入防守状态，AC +2，或获得少量临时护盾。',
  },
  {
    id: 'tactical-aid',
    name: '战术援护',
    desc: '指定一名队友，使其下一次命中检定 +2。',
  },
  {
    id: 'emergency-treatment',
    name: '应急处理',
    desc: '消耗道具或行动点，恢复少量生命，或移除轻度异常状态。',
  },
];
```

UI 显示：

```txt
战斗技能

基础攻击
攻击检定：D20 + 熟练值 + 当前武器属性修正 vs AC

防守架势
本回合 AC +2，或获得少量临时护盾

战术援护
指定一名队友，使其下一次命中检定 +2

应急处理
消耗道具或行动点，恢复少量生命，或移除轻度异常状态
```

---

## 六、统一非战斗技能

五个流派显示完全相同的非战斗技能，不要再按流派区分。

```ts
const COMMON_NON_COMBAT_SKILLS = [
  {
    id: 'observe',
    name: '观察',
    attribute: 'wis',
    desc: '感知 DC 12-18',
  },
  {
    id: 'stealth',
    name: '潜行',
    attribute: 'dex',
    desc: '敏捷 DC 12-18',
  },
  {
    id: 'negotiate',
    name: '交涉',
    attribute: 'cha',
    desc: '魅力 DC 12-18',
  },
  {
    id: 'analyze',
    name: '解析',
    attribute: 'int',
    desc: '智力 DC 12-18',
  },
  {
    id: 'force',
    name: '强行突破',
    attribute: 'str',
    desc: '力量 DC 12-18',
  },
  {
    id: 'endure',
    name: '耐受',
    attribute: 'con',
    desc: '体质 DC 12-18',
  },
];
```

UI 显示：

```txt
非战斗技能

观察
感知 DC 12-18

潜行
敏捷 DC 12-18

交涉
魅力 DC 12-18

解析
智力 DC 12-18

强行突破
力量 DC 12-18

耐受
体质 DC 12-18
```

---

## 七、选择流派后的保存逻辑

玩家点击“深入地下城”后，保存：

```ts
selectedStyleId: selectedStyle.id,
player: {
  ...state.player,
  styleId: selectedStyle.id,
  styleName: selectedStyle.name,
  attributes: selectedStyle.attributes,
  maxHp: getMaxHp(selectedStyle.attributes),
  hp: getMaxHp(selectedStyle.attributes),
  ac: getAc(selectedStyle.attributes),
}
```

不要再保存新的：

```ts
selectedClassId
```

如果项目其他地方还读取 `selectedClassId`，请改为读取：

```ts
selectedStyleId
player.styleId
```

---

## 八、旧存档兼容

如果旧存档存在 `selectedClassId`，请自动映射到新流派：

```ts
const CLASS_TO_STYLE_MAP: Record<string, string> = {
  warrior: 'iron-cable',
  rogue: 'shadow-step',
  mage: 'arcane-analysis',
  cleric: 'resonance',
  paladin: 'balanced',
};
```

兼容逻辑：

```ts
function migrateClassToStyle(save: any) {
  if (save.selectedStyleId) return save;

  const oldClassId = save.selectedClassId;
  const mappedStyleId = CLASS_TO_STYLE_MAP[oldClassId] || 'balanced';
  const style =
    PLAYER_STYLES.find(item => item.id === mappedStyleId) ||
    PLAYER_STYLES.find(item => item.id === 'balanced');

  return {
    ...save,
    selectedStyleId: mappedStyleId,
    selectedClassId: undefined,
    player: {
      ...save.player,
      styleId: style.id,
      styleName: style.name,
      attributes: style.attributes,
      maxHp: getMaxHp(style.attributes),
      hp: Math.min(save.player?.hp ?? getMaxHp(style.attributes), getMaxHp(style.attributes)),
      ac: getAc(style.attributes),
    },
  };
}
```

---

## 九、UI 修改要求

### 左侧卡片显示

- 热键
- 流派名
- 简介 `summary`

### 右侧详情显示

- 流派名
- HP
- AC
- 六维雷达图
- 每个属性的数值和修正值
- 优势
- 限制
- 统一战斗技能
- 统一非战斗技能

### 页面文案替换

| 原文案 | 新文案 |
|---|---|
| 选择职业 | 选择冒险者流派 |
| 职业 | 流派 |
| selectedClass | selectedStyle |
| classId | styleId |

“深入地下城”按钮逻辑不变，只是保存的数据从职业改为流派。

---

## 十、验收标准

1. 开局页面不再出现战士、游荡者、法师、牧师、圣骑士。
2. 页面显示五种流派：铁缆流、影步流、秘析流、共鸣流、均衡流。
3. 五个流派的战斗技能完全一致。
4. 五个流派的非战斗技能完全一致。
5. 五个流派的 HP 和 AC 由属性公式动态计算。
6. 铁缆流显示 HP 45、AC 13、先攻 +0。
7. 影步流显示 HP 39、AC 16、先攻 +3。
8. 秘析流显示 HP 39、AC 14、先攻 +1。
9. 共鸣流显示 HP 39、AC 14、先攻 +1。
10. 均衡流显示 HP 39、AC 14、先攻 +1。
11. 选择流派后保存 `selectedStyleId` 和 `player.attributes`。
12. 不再保存新的 `selectedClassId`。
13. 旧存档中如果存在 `selectedClassId`，可以自动迁移为对应 `selectedStyleId`。
14. 雷达图仍然正常显示六维属性。
15. 进入后续剧情和战斗时，角色 HP、AC、检定修正正常。
