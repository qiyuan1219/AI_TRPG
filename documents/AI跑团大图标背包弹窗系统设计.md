# AI 跑团游戏：大图标格子背包与物品弹窗系统设计

## 1. 设计目标

本系统用于 AI 跑团 / 视觉小说式冒险游戏中的背包界面。

目标不是做一个复杂的传统 RPG 仓库系统，而是做一个清晰、有游戏感、能服务剧情调查的背包系统：

```text
大图标格子背包
↓
点击物品图标
↓
弹出物品详情框
↓
根据物品类型执行：使用 / 装备 / 查看全文 / 查看线索 / 当前场景使用
```

核心体验：

- 玩家能直观看到自己获得了哪些物品。
- 图标格子要足够大，方便点击。
- 物品详细信息不占用主背包界面，而是通过弹窗展示。
- 档案、线索、关键物品可以影响后续剧情和行动选项。
- 背包不仅是“存东西”，也是“调查资料库”和“剧情触发器”。

---

## 2. 推荐界面结构

主背包界面采用大图标网格，而不是左侧格子 + 右侧详情栏。

```text
┌────────────────────────────────────────────┐
│ 背包                                       │
├────────────────────────────────────────────┤
│ 全部  消耗品  装备  关键物品  档案  线索   │
├────────────────────────────────────────────┤
│                                            │
│   [图标]   [图标]   [图标]   [图标]        │
│                                            │
│   [图标]   [图标]   [图标]   [图标]        │
│                                            │
│   [图标]   [图标]   [图标]   [图标]        │
│                                            │
└────────────────────────────────────────────┘
```

点击任意格子后，打开居中的物品详情弹窗：

```text
┌──────────────────────────────┐
│ 远征队失联报告                │
│                              │
│          [大图标]             │
│                              │
│ 类型：档案                    │
│ 来源：冒险者公会              │
│ 稀有度：重要                  │
│                              │
│ 摘要：                        │
│ 一份记录失联远征队最后行动轨迹 │
│ 的公会认证报告。               │
│                              │
│ [查看全文]        [关闭]       │
└──────────────────────────────┘
```

---

## 3. 背包分类

建议背包上方设置分类页签：

```text
全部 / 消耗品 / 装备 / 关键物品 / 档案 / 线索
```

分类含义：

| 分类 | 用途 | 示例 |
|---|---|---|
| 全部 | 显示所有已获得内容 | 全部物品 |
| 消耗品 | 可直接使用并消耗 | 治疗药水、解毒剂、止血粉 |
| 装备 | 可装备到角色身上 | 长剑、护盾、护甲、饰品 |
| 关键物品 | 推进剧情或场景交互 | 公会徽记、降渊通行牌、封印钥石 |
| 档案 | 可阅读的剧情资料 | 远征队失联报告、矿道草图、怪物记录 |
| 线索 | 调查获得的信息标签 | 孢化地底兽活动痕迹、信标同时熄灭 |

---

## 4. 格子设计

### 4.1 格子尺寸

如果游戏是 1920×1080 横屏界面，建议：

```text
背包弹窗宽度：1100px ~ 1300px
背包弹窗高度：720px ~ 820px
格子大小：100px ~ 120px
推荐格子大小：108px
格子间距：12px ~ 16px
每行数量：5 ~ 6 个
每页容量：24 ~ 30 个
```

CSS 示例：

```css
.inventory-grid {
  display: grid;
  grid-template-columns: repeat(6, 108px);
  gap: 14px;
  justify-content: center;
}

.inventory-slot {
  width: 108px;
  height: 108px;
}
```

### 4.2 格子显示内容

每个格子只显示核心信息，不塞详细文字。

```text
┌──────────┐
│   NEW    │
│          │
│   图标   │
│          │
│      x2  │
└──────────┘
```

建议显示：

| 元素 | 说明 |
|---|---|
| 物品图标 | 主视觉，玩家主要依靠图标识别物品 |
| 数量角标 | 可堆叠物品显示 x2、x5 |
| NEW 标记 | 新获得物品显示红点或 NEW |
| 稀有度边框 | 普通、稀有、重要、任务物品 |
| 当前可用高亮 | 当前场景可使用的关键物品可微微发光 |
| 不可用置灰 | 当前不能使用的按钮置灰，但物品本身仍可查看 |

---

## 5. 点击物品后的弹窗逻辑

点击格子后：

```text
打开背包
↓
点击物品图标
↓
打开居中详情弹窗
↓
根据物品类型显示不同信息和按钮
↓
执行使用 / 装备 / 查看全文 / 查看关联档案
```

建议弹窗打开时：

- 背包背景加半透明黑色遮罩。
- 弹窗居中显示。
- 弹窗可以通过关闭按钮、Esc、点击遮罩关闭。
- 点击新物品后取消 `isNew` 标记。

---

## 6. 不同物品类型的弹窗设计

### 6.1 消耗品弹窗

示例：治疗药水

```text
┌──────────────────────────────┐
│ 治疗药水                      │
│                              │
│            [药水图标]          │
│                              │
│ 类型：消耗品                  │
│ 数量：3                       │
│ 稀有度：普通                  │
│                              │
│ 效果：恢复 1d8 + 2 点生命值。 │
│                              │
│ 说明：普通冒险者常备的红色药剂。 │
│                              │
│ [使用]   [丢弃]   [关闭]       │
└──────────────────────────────┘
```

操作：

- 使用：执行效果，数量 -1。
- 丢弃：移除指定数量。
- 关闭：关闭弹窗。

---

### 6.2 装备弹窗

示例：磨损长剑

```text
┌──────────────────────────────┐
│ 磨损长剑                      │
│                              │
│            [长剑图标]          │
│                              │
│ 类型：武器                    │
│ 稀有度：普通                  │
│ 伤害：1d8 + 力量              │
│                              │
│ 说明：陪你走过许多战斗的旧剑。 │
│                              │
│ [装备]   [查看]   [关闭]       │
└──────────────────────────────┘
```

如果已经装备，则按钮显示：

```text
[卸下]
```

装备后更新：

```js
gameState.player.equipment.weapon = "worn_longsword";
```

---

### 6.3 关键物品弹窗

示例：公会徽记

```text
┌──────────────────────────────┐
│ 公会徽记                      │
│                              │
│            [徽记图标]          │
│                              │
│ 类型：关键物品                │
│ 稀有度：任务                  │
│                              │
│ 说明：                        │
│ 冒险者公会认证身份的徽记，     │
│ 可用于核验委托权限。           │
│                              │
│ [当前场景使用]   [关闭]        │
└──────────────────────────────┘
```

如果当前场景不能使用：

```text
[当前场景无法使用]
```

按钮置灰。

关键物品通常不允许丢弃，避免玩家丢失主线道具。

---

### 6.4 档案弹窗

示例：远征队失联报告

```text
┌──────────────────────────────┐
│ 远征队失联报告                │
│                              │
│            [报告图标]          │
│                              │
│ 类型：档案                    │
│ 来源：冒险者公会              │
│ 稀有度：重要                  │
│                              │
│ 摘要：                        │
│ 一份记录失联远征队最后行动轨迹 │
│ 的公会认证报告。               │
│                              │
│ [查看全文]   [关闭]            │
└──────────────────────────────┘
```

点击“查看全文”后，打开更大的档案阅读弹窗。

```text
┌────────────────────────────────┐
│ 远征队失联报告                  │
├────────────────────────────────┤
│ 一、队伍信息                    │
│ 第三远征队共七人，于三个月前... │
│                                │
│ 二、最后记录                    │
│ 队伍在深层矿道发现蓝绿色菌斑... │
│                                │
│ 三、异常情况                    │
│ 所有信标在同一时间熄灭。        │
│                                │
│ 四、残缺备注                    │
│ 不要靠近发光铆钉尽头。          │
│                                │
│ [返回]   [关闭]                 │
└────────────────────────────────┘
```

---

### 6.5 线索弹窗

示例：远征队曾遭遇孢化地底兽

```text
┌──────────────────────────────┐
│ 远征队曾遭遇孢化地底兽        │
│                              │
│            [菌斑图标]          │
│                              │
│ 类型：线索                    │
│ 来源：远征队失联报告          │
│                              │
│ 说明：                        │
│ 第三远征队在失联前报告过疑似   │
│ 孢化地底兽的活动痕迹。         │
│                              │
│ 关联档案：远征队失联报告       │
│                              │
│ [查看关联档案]   [关闭]        │
└──────────────────────────────┘
```

---

## 7. 推荐组件拆分

React 组件建议这样拆：

```text
InventoryPanel
├── InventoryTabs
├── InventoryGrid
│   └── InventorySlot
├── ItemDetailModal
│   ├── ConsumableDetail
│   ├── EquipmentDetail
│   ├── KeyItemDetail
│   ├── DocumentDetail
│   └── ClueDetail
└── DocumentReaderModal
```

MVP 阶段至少实现：

```text
InventoryPanel
InventoryTabs
InventoryGrid
InventorySlot
ItemDetailModal
DocumentReaderModal
```

后期再拆分各类详情组件。

---

## 8. 数据结构设计

### 8.1 背包状态

```js
const inventoryState = {
  slots: [
    {
      slotId: 0,
      itemId: "healing_potion",
      quantity: 3,
      isNew: false
    },
    {
      slotId: 1,
      itemId: "guild_badge",
      quantity: 1,
      isNew: false
    },
    {
      slotId: 2,
      itemId: "report_missing_expedition_01",
      quantity: 1,
      isNew: true
    }
  ],

  selectedSlotId: null,
  isItemModalOpen: false,

  equipped: {
    weapon: "longsword",
    shield: "blue_crest_shield",
    armor: "worn_armor",
    accessory: null
  }
};
```

### 8.2 物品数据库

物品定义和玩家持有状态要分开。

```js
const itemDatabase = {
  healing_potion: {
    id: "healing_potion",
    name: "治疗药水",
    type: "consumable",
    category: "consumable",
    icon: "/assets/icons/healing_potion.png",
    rarity: "common",
    stackable: true,
    maxStack: 9,
    description: "普通冒险者常备的红色药剂，味道辛辣。",
    effectText: "恢复 1d8 + 2 点生命值。",
    useEffect: {
      type: "heal",
      formula: "1d8+2"
    }
  },

  guild_badge: {
    id: "guild_badge",
    name: "公会徽记",
    type: "key_item",
    category: "key_item",
    icon: "/assets/icons/guild_badge.png",
    rarity: "quest",
    stackable: false,
    description: "冒险者公会认证身份的徽记，可用于核验委托权限。",
    useCondition: {
      sceneHasInteractable: "guild_seal_device"
    }
  },

  report_missing_expedition_01: {
    id: "report_missing_expedition_01",
    name: "远征队失联报告",
    type: "document",
    category: "archive",
    icon: "/assets/icons/report_scroll.png",
    rarity: "important",
    stackable: false,
    description: "一份记录失联远征队最后行动轨迹的公会认证报告。",
    documentId: "doc_missing_expedition_01"
  },

  expedition_saw_spore_beasts: {
    id: "expedition_saw_spore_beasts",
    name: "远征队曾遭遇孢化地底兽",
    type: "clue",
    category: "clue",
    icon: "/assets/icons/clue_spore.png",
    rarity: "important",
    stackable: false,
    description: "第三远征队在失联前报告过疑似孢化地底兽的活动痕迹。",
    clueId: "clue_expedition_saw_spore_beasts"
  }
};
```

### 8.3 档案数据库

档案全文不要直接塞在物品数据库里，建议单独存。

```js
const documentDatabase = {
  doc_missing_expedition_01: {
    id: "doc_missing_expedition_01",
    title: "远征队失联报告",
    source: "冒险者公会",
    sections: [
      {
        heading: "队伍信息",
        body: "第三远征队共七人，于三个月前从逆穹城前线堡垒出发，目标为地底堡垒旧址。"
      },
      {
        heading: "最后记录",
        body: "队伍在深层矿道发现大面积蓝绿色菌斑，并报告有疑似孢化地底兽的活动痕迹。"
      },
      {
        heading: "异常情况",
        body: "通讯中断前，队长曾提到矿道墙壁中传来类似敲击声的回音，随后所有信标同时熄灭。"
      },
      {
        heading: "残缺备注",
        body: "不要靠近发光铆钉尽头。"
      }
    ],
    relatedClues: [
      "clue_expedition_saw_spore_beasts",
      "clue_all_beacons_went_dark",
      "clue_glowing_rivets_warning"
    ]
  }
};
```

### 8.4 线索数据库

```js
const clueDatabase = {
  clue_expedition_saw_spore_beasts: {
    id: "clue_expedition_saw_spore_beasts",
    name: "远征队曾遭遇孢化地底兽",
    source: "report_missing_expedition_01",
    description: "第三远征队在失联前报告过疑似孢化地底兽的活动痕迹。",
    relatedDocuments: ["report_missing_expedition_01"],
    tags: ["monster", "spore", "expedition"]
  }
};
```

---

## 9. 弹窗状态设计

React 状态示例：

```js
const [activeTab, setActiveTab] = useState("all");
const [selectedSlotId, setSelectedSlotId] = useState(null);
const [isItemModalOpen, setIsItemModalOpen] = useState(false);
const [readingDocumentId, setReadingDocumentId] = useState(null);
```

点击格子：

```js
function handleSlotClick(slotId) {
  setSelectedSlotId(slotId);
  setIsItemModalOpen(true);
  markSlotAsViewed(slotId);
}
```

关闭物品弹窗：

```js
function closeItemModal() {
  setIsItemModalOpen(false);
  setSelectedSlotId(null);
}
```

查看档案全文：

```js
function openDocument(documentId) {
  setReadingDocumentId(documentId);
}
```

关闭档案弹窗：

```js
function closeDocument() {
  setReadingDocumentId(null);
}
```

---

## 10. 按钮显示逻辑

根据物品类型决定弹窗按钮：

```js
function getAvailableActions(item, currentScene, equipped) {
  switch (item.type) {
    case "consumable":
      return ["use", "discard", "close"];

    case "equipment":
      if (Object.values(equipped).includes(item.id)) {
        return ["unequip", "inspect", "close"];
      }
      return ["equip", "inspect", "close"];

    case "key_item":
      if (canUseItemInScene(item, currentScene)) {
        return ["use_in_scene", "close"];
      }
      return ["disabled_use_in_scene", "close"];

    case "document":
      return ["read", "close"];

    case "clue":
      return ["view_related_document", "close"];

    default:
      return ["inspect", "close"];
  }
}
```

---

## 11. 当前场景使用关键物品

关键物品不是随时都能用，而是需要当前场景满足条件。

示例：公会徽记只能在存在 `guild_seal_device` 的场景中使用。

```js
function canUseItemInScene(item, currentScene) {
  if (!item.useCondition) {
    return false;
  }

  if (item.useCondition.sceneHasInteractable) {
    return currentScene.interactables.some(
      obj => obj.id === item.useCondition.sceneHasInteractable
    );
  }

  return false;
}
```

如果当前场景可以使用，按钮显示：

```text
[当前场景使用]
```

如果不能使用，按钮置灰：

```text
[当前场景无法使用]
```

---

## 12. 使用消耗品逻辑

```js
function useConsumable(itemId, gameState) {
  const item = itemDatabase[itemId];

  if (!item || item.type !== "consumable") {
    return {
      success: false,
      message: "这个物品不能直接使用。"
    };
  }

  if (item.useEffect?.type === "heal") {
    const healAmount = rollFormula(item.useEffect.formula);

    gameState.player.hp = Math.min(
      gameState.player.maxHp,
      gameState.player.hp + healAmount
    );

    removeItemFromInventory(itemId, 1);

    return {
      success: true,
      message: `你使用了${item.name}，恢复了 ${healAmount} 点生命值。`
    };
  }

  return {
    success: false,
    message: "这个物品现在无法使用。"
  };
}
```

---

## 13. 添加物品逻辑

当行动检定成功后，系统可能收到：

```json
{
  "state_updates": {
    "add_items": ["healing_potion"],
    "add_documents": ["report_missing_expedition_01"],
    "add_clues": ["expedition_saw_spore_beasts"]
  }
}
```

添加到背包：

```js
function addItemToInventory(itemId, quantity = 1) {
  const item = itemDatabase[itemId];

  if (!item) {
    console.warn(`Unknown item: ${itemId}`);
    return;
  }

  if (item.stackable) {
    const existingSlot = inventoryState.slots.find(
      slot => slot.itemId === itemId && slot.quantity < item.maxStack
    );

    if (existingSlot) {
      existingSlot.quantity = Math.min(
        existingSlot.quantity + quantity,
        item.maxStack
      );
      existingSlot.isNew = true;
      return;
    }
  }

  const emptySlotIndex = findEmptySlot();

  if (emptySlotIndex === -1) {
    inventoryState.pendingItems.push({ itemId, quantity });
    return;
  }

  inventoryState.slots[emptySlotIndex] = {
    slotId: emptySlotIndex,
    itemId,
    quantity,
    isNew: true
  };
}
```

---

## 14. 背包容量建议

MVP 阶段不建议做严格容量限制。

推荐方案：

```text
视觉上是格子背包
逻辑上容量暂时无限
格子不够时自动分页
```

例如：

```text
第 1 页：30 格
第 2 页：30 格
第 3 页：30 格
```

原因：

- 你们是剧情探索 / AI 跑团游戏，不是硬核生存游戏。
- 如果玩家因为背包满了拿不到关键报告单，会影响主线体验。
- 后期可以再加入负重、仓库、整理、丢弃等系统。

---

## 15. 与剧情系统联动

背包系统的核心价值是参与剧情判断。

### 15.1 道具解锁行动

```js
const action = {
  id: "use_guild_badge_on_gate",
  label: "使用公会徽记核验身份",
  type: "use_item",
  target: "sealed_gate",
  visibleWhen: {
    hasItem: "guild_badge"
  }
};
```

### 15.2 档案解锁对话

```js
const action = {
  id: "ask_about_missing_expedition",
  label: "询问书记员第三远征队失联报告",
  type: "talk",
  target: "guild_clerk",
  visibleWhen: {
    hasDocument: "report_missing_expedition_01"
  }
};
```

### 15.3 线索解锁调查方式

```js
const action = {
  id: "inspect_glowing_rivets_carefully",
  label: "根据报告提醒，谨慎调查发光铆钉尽头",
  type: "investigate",
  target: "glowing_rivets",
  visibleWhen: {
    hasClue: "glowing_rivets_warning"
  }
};
```

---

## 16. UI 风格建议

适配暗黑奇幻 / 逆穹城 / 羊皮纸 / 符文风格。

### 16.1 视觉关键词

```text
暗色半透明背景
羊皮纸或深色皮革质感面板
暗金色边框
大图标格子
鼠标悬停时边框发光
任务物品金色边框
档案羊皮纸图标
线索蓝绿色微光
```

### 16.2 颜色建议

```text
主背景：#15100C / #1B1512
面板：#2A211B
格子：#3A2E25
边框：#8A6A3D
高亮：#D6A85A
魔法蓝绿：#4FC3B1
危险红：#9B2F2F
文字主色：#E8D8B8
文字弱化：#A99778
```

### 16.3 弹窗尺寸建议

```css
.item-modal {
  width: 560px;
  min-height: 520px;
}

.document-modal {
  width: 760px;
  height: 720px;
}
```

---

## 17. MVP 实现范围

第一版建议实现：

```text
1. 大图标格子背包 UI
2. 分类页签：全部 / 消耗品 / 装备 / 关键物品 / 档案 / 线索
3. 点击格子打开详情弹窗
4. 消耗品可以使用
5. 装备可以装备 / 卸下
6. 档案可以打开全文
7. 关键物品在特定场景可以使用
8. 线索可以查看来源和关联档案
9. 新获得物品显示 NEW
10. 道具、档案、线索可以通过 visibleWhen 解锁后续行动
```

暂时不建议第一版做：

```text
复杂负重
拖拽排序
物品耐久
物品分解
商店买卖
仓库
批量丢弃
复杂筛选搜索
```

---

## 18. 给 Codex 的实现提示词

下面这段可以直接复制给 Codex：

```text
请帮我实现一个 AI 跑团游戏的“大图标格子背包 + 物品详情弹窗”系统。

项目背景：
这是一个 React 前端的 AI 跑团 / 视觉小说式冒险游戏。背包不仅存放普通道具，还要存放关键物品、可阅读档案和调查线索。玩家点击背包中的大图标格子后，应弹出详情框，可以查看信息、使用道具、装备物品或阅读档案。

核心设计要求：

1. 背包主界面使用大图标格子显示，不要使用右侧固定详情栏。
2. 每个格子大小约 100px 到 120px，推荐 108px。
3. 每个格子显示：
   - 物品图标
   - 数量角标
   - NEW 标记
   - 稀有度边框
4. 背包顶部有分类页签：
   - 全部
   - 消耗品
   - 装备
   - 关键物品
   - 档案
   - 线索
5. 点击任意物品格子后，打开居中的物品详情弹窗。
6. 详情弹窗中显示：
   - 大图标
   - 名称
   - 类型
   - 稀有度
   - 来源
   - 描述
   - 效果说明
   - 操作按钮
7. 不同类型的物品显示不同按钮：
   - consumable：使用、丢弃、关闭
   - equipment：装备 / 卸下、查看、关闭
   - key_item：当前场景使用、关闭
   - document：查看全文、关闭
   - clue：查看关联档案、关闭
8. document 类型点击“查看全文”后，打开更大的档案阅读弹窗。
9. clue 类型点击“查看关联档案”后，打开相关档案阅读弹窗。
10. key_item 只有在当前场景满足 useCondition 时，“当前场景使用”按钮才可点击，否则置灰并显示“当前场景无法使用”。
11. consumable 使用后减少数量，数量为 0 时从背包中移除。
12. equipment 装备后更新 gameState.player.equipment；已装备时按钮显示“卸下”。
13. 点击新获得物品后取消 NEW 标记。
14. 背包容量 MVP 阶段不做硬限制，格子不够时自动分页。
15. 道具、档案、线索需要能通过 visibleWhen 影响后续行动选项。
16. UI 风格偏暗黑奇幻：
   - 深色皮革 / 羊皮纸面板
   - 暗金色边框
   - 大图标格子
   - 鼠标悬停边框发光
   - 任务物品金色边框
   - 线索使用蓝绿色微光
17. 请使用 React 组件化实现，至少包含：
   - InventoryPanel
   - InventoryTabs
   - InventoryGrid
   - InventorySlot
   - ItemDetailModal
   - DocumentReaderModal
18. 请设计并使用以下数据结构：
   - itemDatabase
   - documentDatabase
   - clueDatabase
   - gameState.inventory
   - gameState.player.equipment
19. 请提供示例数据：
   - 治疗药水 healing_potion
   - 公会徽记 guild_badge
   - 远征队失联报告 report_missing_expedition_01
   - 远征队曾遭遇孢化地底兽 expedition_saw_spore_beasts
20. 请保证代码结构清晰，方便后续接入 AI 叙事系统返回的 state_updates。

建议组件结构：

InventoryPanel
├── InventoryTabs
├── InventoryGrid
│   └── InventorySlot
├── ItemDetailModal
└── DocumentReaderModal

请先不要做复杂负重、拖拽排序、商店买卖、仓库和物品耐久，优先实现 MVP。
```

---

## 19. 总结

最终推荐方案：

```text
背包主界面：大图标格子
点击物品：打开详情弹窗
普通道具：可使用
装备：可装备 / 卸下
关键物品：特定场景使用
档案：可打开全文
线索：可查看来源和关联档案
```

这套设计既有传统游戏背包的直观体验，又能承载 AI 跑团游戏最重要的调查、档案和线索系统。
