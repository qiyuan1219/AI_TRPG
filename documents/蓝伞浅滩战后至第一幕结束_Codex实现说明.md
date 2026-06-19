# 《地心之门》蓝伞浅滩战后至第一幕游戏结束实现说明（Codex 版）

> 任务目标：让 Codex 按照当前项目**已经重构后的代码结构**，实现从“蓝伞浅滩战斗胜利”开始，到“第一幕四结局 + 地下海洋反转 + 游戏结束”的完整流程。  
> 适用范围：第一幕压缩收尾版。  
> 核心要求：**复用现有代码、复用现有系统、不要走旧的蓝伞浅滩战后路线、不要推倒重写。**

---

## 0. 最高优先级要求

### 0.1 必须沿用当前重构后的代码结构

Codex 执行前必须先阅读当前代码。  
本任务不是让 Codex 自己重新设计系统，而是基于当前已经重构后的项目继续接入剧情。

必须优先复用：

1. 当前剧情节点数据结构。
2. 当前剧情推进函数。
3. 当前选择按钮 / 行动按钮组件。
4. 当前骰子判定流程。
5. 当前 AI 续写流程。
6. 当前战斗触发与战斗胜利回调。
7. 当前战斗配置结构。
8. 当前存档快照与恢复逻辑。
9. 当前背景图 / 立绘 / 敌人图 / 道具图标引用方式。
10. 当前同伴信任值与支线奖励结构。
11. 当前测试工具、测试目录、构建流程。
12. 当前 TypeScript 类型和 helper 组织方式。

禁止：

1. 禁止新建一套平行剧情引擎。
2. 禁止新建一套平行战斗引擎。
3. 禁止新建一套平行存档系统。
4. 禁止绕开现有状态管理直接写全局变量。
5. 禁止为了本流程大规模改动已稳定通过测试的旧逻辑。
6. 禁止把蓝伞浅滩前的流程重写一遍。
7. 禁止把当前已拆分出来的模块重新塞回 `App.tsx` 或大型组件中。

允许：

1. 新增剧情节点数据。
2. 新增少量类型字段。
3. 新增少量 helper。
4. 新增 Boss 战斗配置。
5. 新增结局映射表。
6. 新增素材路径常量。
7. 新增必要测试。

总体要求：

> 能复用就复用，只在现有代码缺口处最小新增。  
> 这是本次重构希望达到的目标之一，Codex 必须遵守。

---

### 0.2 蓝伞浅滩战斗胜利后必须改走新压缩主线

当前项目里蓝伞浅滩战斗后可能已经接入或预留了旧路线，例如：

1. 布洛克支线：`block_echo_forest` / “回声菌林的假歌”。
2. 凯娅支线：`kaiya_broken_seals` / “少了两个封扣”。
3. 骨柱湿地剧情。
4. 骨柱湿地普通战斗。
5. 废弃据点后续。
6. 其他旧的无光孢海中段探索节点。

**本次不要走这些旧路线。**

蓝伞浅滩战斗胜利后，必须进入新的压缩收尾主线：

```text
蓝伞浅滩战斗胜利
→ 蓝伞浅滩战后余波
→ 黑石根区入口
→ 莱因事件
→ Boss 前休整 / 瑟琳银杖裂痕
→ 黑石门卫 Boss
→ Boss 核心处理选择
→ 四结局之一
→ 地下海洋反转
→ 第一幕游戏结束
```

推荐新增一个明确开关或常量：

```ts
const ENABLE_COMPRESSED_ACT1_ENDING = true;
```

如果当前代码已经有类似 feature flag / route flag / chapter config，则复用现有方式，不要新建多余机制。

伪代码示例：

```ts
function resolveBlueShoalVictoryNextNode(state: GameState): string {
  if (ENABLE_COMPRESSED_ACT1_ENDING) {
    return 'act1-blue-shoal-aftermath-compressed';
  }

  return getLegacyBlueShoalNextNode(state);
}
```

注意：

1. 旧路线不要删除，先保留。
2. 只是在当前主线入口处断开旧路线。
3. 后续如果还有时间，可以再把布洛克支线、凯娅支线、骨柱湿地重新接回。
4. 当前 demo 交付以压缩版第一幕结尾为准。

---

## 1. 本次新增流程总览

### 1.1 新主线节点顺序

建议节点 ID 如下。Codex 可以根据当前项目命名规范微调，但含义必须保持一致。

```text
act1-blue-shoal-aftermath-compressed
act1-black-root-entrance
act1-lain-survivor-event
act1-black-root-rest-serin-crack
battle-blackstone-gatekeeper
act1-boss-core-choice
act1-ending-guardian-remains
act1-ending-wounded-through-gate
act1-ending-cold-expedition
act1-ending-gate-split-open
act1-ending-ocean-reveal
act1-game-complete
act1-bad-ending-time-reset
```

### 1.2 流程图

```text
蓝伞浅滩战斗胜利
  ↓
act1-blue-shoal-aftermath-compressed
  ↓
act1-black-root-entrance
  ↓
act1-lain-survivor-event
  ├─ 帮助莱因 → state.lainHelped = true
  └─ 无视莱因 → state.lainHelped = false
  ↓
act1-black-root-rest-serin-crack
  ↓
battle-blackstone-gatekeeper
  ├─ Boss 战胜利 → act1-boss-core-choice
  └─ 小队团灭 → act1-bad-ending-time-reset
  ↓
act1-boss-core-choice
  ├─ 稳定核心 → state.bossCoreChoice = 'stabilize'
  └─ 破坏核心 → state.bossCoreChoice = 'destroy'
  ↓
resolveAct1Ending(state)
  ├─ lainHelped=true  + stabilize → act1-ending-guardian-remains
  ├─ lainHelped=true  + destroy   → act1-ending-wounded-through-gate
  ├─ lainHelped=false + stabilize → act1-ending-cold-expedition
  └─ lainHelped=false + destroy   → act1-ending-gate-split-open
  ↓
act1-ending-ocean-reveal
  ↓
act1-game-complete
```

---

## 2. 状态字段设计

优先复用现有剧情状态字段、flag 结构、progress 结构。  
若当前已有 `storyFlags`、`eventFlags`、`gameFlags`、`completedEvents`、`storyState` 等字段，请按现有结构新增。

建议新增字段：

```ts
type BossCoreChoice = 'destroy' | 'stabilize';
type Act1EndingId =
  | 'guardian-remains'
  | 'wounded-through-gate'
  | 'cold-expedition'
  | 'gate-split-open'
  | 'time-reset';

interface Act1CompressedEndingFlags {
  compressedAct1EndingStarted?: boolean;
  blueShoalAftermathSeen?: boolean;
  blackRootEntranceSeen?: boolean;
  lainEncountered?: boolean;
  lainHelped?: boolean;
  lainIgnored?: boolean;
  serinStaffCrackSeen?: boolean;
  serinStaffCharmObtained?: boolean;
  blackstoneGatekeeperDefeated?: boolean;
  bossCoreChoice?: BossCoreChoice;
  act1EndingId?: Act1EndingId;
  undergroundOceanRevealed?: boolean;
  act1GameCompleted?: boolean;
}
```

如果当前代码不适合新增嵌套对象，就用扁平字段：

```ts
compressedAct1EndingStarted: boolean
blueShoalAftermathSeen: boolean
blackRootEntranceSeen: boolean
lainEncountered: boolean
lainHelped: boolean
lainIgnored: boolean
serinStaffCrackSeen: boolean
serinStaffCharmObtained: boolean
blackstoneGatekeeperDefeated: boolean
bossCoreChoice: 'destroy' | 'stabilize' | null
act1EndingId: 'guardian-remains' | 'wounded-through-gate' | 'cold-expedition' | 'gate-split-open' | 'time-reset' | null
undergroundOceanRevealed: boolean
act1GameCompleted: boolean
```

要求：

1. 存档必须包含这些字段。
2. 读档恢复后，当前节点、背景、结局状态必须正确。
3. 不允许只存在内存变量里。
4. 如果有旧存档，新增字段必须有默认值，不能导致存档读取崩溃。
5. 存档恢复逻辑必须复用当前 `saveSnapshot` / `saveRestore` 或对应的已重构模块。

---

## 3. 素材路径清单

用户已经准备好素材。Codex 实现时必须把素材路径统一放入现有素材 registry / 常量表 / 数据文件中，避免在多个组件里硬编码。

### 3.1 场景背景

统一放在：

```text
frontend/public/assets/scenes/
```

前端引用路径：

```ts
const COMPRESSED_ACT1_SCENES = {
  blueShoalAfterBattle: '/assets/scenes/10blue-shoal-after-battle.webp',
  blackRootEntrance: '/assets/scenes/11black-root-entrance.webp',
  lainSurvivorSite: '/assets/scenes/12lain-survivor-site.webp',
  blackRootRestPoint: '/assets/scenes/13black-root-rest-point.webp',
  darkGateForecourtBattle: '/assets/scenes/14dark-gate-forecourt-battle.webp',
  undergroundOceanReveal: '/assets/scenes/15underground-ocean-reveal.webp',
};
```

用途对应：

| 素材 | 用途 |
|---|---|
| `/assets/scenes/10blue-shoal-after-battle.webp` | 蓝伞浅滩战后余波 |
| `/assets/scenes/11black-root-entrance.webp` | 黑石根区入口，旧路被封死 |
| `/assets/scenes/12lain-survivor-site.webp` | 莱因事件地点 |
| `/assets/scenes/13black-root-rest-point.webp` | Boss 前休整点，瑟琳银杖裂痕 |
| `/assets/scenes/14dark-gate-forecourt-battle.webp` | 黑暗之门前庭 / Boss 战场 |
| `/assets/scenes/15underground-ocean-reveal.webp` | 统一地下海洋反转 |

---

### 3.2 结局 CG

```ts
const ACT1_ENDING_CGS = {
  guardianRemains: '/assets/scenes/ending-guardian-remains.webp',
  woundedThroughGate: '/assets/scenes/ending-wounded-through-gate.webp',
  coldExpedition: '/assets/scenes/ending-cold-expedition.webp',
  gateSplitOpen: '/assets/scenes/ending-gate-split-open.webp',
};
```

用途对应：

| 结局 | 素材 |
|---|---|
| 守门者仍在 | `/assets/scenes/ending-guardian-remains.webp` |
| 带伤者穿门 | `/assets/scenes/ending-wounded-through-gate.webp` |
| 冷静的远征 | `/assets/scenes/ending-cold-expedition.webp` |
| 裂门而下 | `/assets/scenes/ending-gate-split-open.webp` |

---

### 3.3 敌人素材

```ts
const ACT1_BOSS_ENEMIES = {
  gatekeeper: '/assets/enemies/enemy-gatekeeper.webp',
  gatekeeperCoreExposed: '/assets/enemies/enemy-gatekeeper-core-exposed.webp',
  blackRootMinion: '/assets/enemies/enemy-black-root-minion.webp',
};
```

用途对应：

| 素材 | 用途 |
|---|---|
| `/assets/enemies/enemy-gatekeeper.webp` | 黑石门卫 Boss 基础战斗模型 |
| `/assets/enemies/enemy-gatekeeper-core-exposed.webp` | 核心暴露阶段差分 |
| `/assets/enemies/enemy-black-root-minion.webp` | 黑石根须小怪 / Boss 召唤物 |

---

### 3.4 道具图标

```ts
const ACT1_CLUE_ITEMS = {
  fortressEmblem: '/assets/icons/items/item-fortress-emblem.png',
  lainDogtag: '/assets/icons/items/item-lain-dogtag.png',
  blackObeliskShard: '/assets/icons/items/item-black-obelisk-shard.png',
  silverStaffCharm: '/assets/icons/items/item-silver-staff-charm.png',
};
```

用途对应：

| 道具 | 素材 |
|---|---|
| 地底堡垒徽记 | `/assets/icons/items/item-fortress-emblem.png` |
| 莱因的断裂军牌 | `/assets/icons/items/item-lain-dogtag.png` |
| 黑色方尖碑碎片 | `/assets/icons/items/item-black-obelisk-shard.png` |
| 银杖护符 | `/assets/icons/items/item-silver-staff-charm.png` |

---

### 3.5 立绘 / 差分

如果项目中已有角色立绘 registry，请把以下差分接入现有 registry。  
如果用户暂未提供具体文件名，先按以下约定预留：

```ts
const ACT1_CHARACTER_PORTRAITS = {
  lainNormal: '/assets/characters/lain-survivor-normal.png',
  lainAlert: '/assets/characters/lain-survivor-alert.png',
  lainWounded: '/assets/characters/lain-survivor-wounded.png',
  serinStaffCracked: '/assets/characters/serin-staff-cracked.png',
};
```

若当前项目角色立绘实际目录不是 `/assets/characters/`，请按当前已有目录调整，不要新建不一致目录。

---

## 4. 新增道具 / 线索

优先复用现有背包和线索道具系统。

### 4.1 地底堡垒徽记

```ts
{
  id: 'item-fortress-emblem',
  name: '地底堡垒徽记',
  type: 'clue',
  icon: '/assets/icons/items/item-fortress-emblem.png',
  description: '一枚锈蚀的旧军用徽记，中央的堡垒塔纹被爪痕划穿。它不该出现在蓝伞浅滩。'
}
```

获得节点：

```text
act1-blue-shoal-aftermath-compressed
```

用途：

1. 说明地底堡垒痕迹已经出现在浅层孢海。
2. 为莱因身份做铺垫。
3. 为 Boss 身上的堡垒旧封印标记做铺垫。

---

### 4.2 莱因的断裂军牌

```ts
{
  id: 'item-lain-dogtag',
  name: '莱因的断裂军牌',
  type: 'clue',
  icon: '/assets/icons/items/item-lain-dogtag.png',
  description: '一枚断裂的堡垒军牌，刻线已经模糊。它被黑色根须纤维缠住，像是从很深的地方被拖回。'
}
```

获得节点：

```text
act1-lain-survivor-event
```

获得条件：

1. 玩家帮助莱因；或
2. 玩家检查莱因装备；或
3. 玩家选择只拿线索后离开。

若玩家完全无视并直接离开，可以不给该道具。

---

### 4.3 黑色方尖碑碎片

```ts
{
  id: 'item-black-obelisk-shard',
  name: '黑色方尖碑碎片',
  type: 'clue',
  icon: '/assets/icons/items/item-black-obelisk-shard.png',
  description: '一块竖向黑色晶石碎片，表面刻有极细的古代封印线。裂缝深处透出暗红热光。'
}
```

获得节点建议：

```text
act1-black-root-entrance
```

若剧情节奏更合适，也可以在 Boss 结局后追加获得或更新描述。

---

### 4.4 银杖护符

```ts
{
  id: 'item-silver-staff-charm',
  name: '银杖护符',
  type: 'clue',
  icon: '/assets/icons/items/item-silver-staff-charm.png',
  description: '瑟琳临时用银杖裂片与护符绳结成的小护符。裂纹里有微弱的蓝白色光。'
}
```

获得节点：

```text
act1-black-root-rest-serin-crack
```

获得条件：

```text
瑟琳信任值 >= 70
且玩家没有粗暴逼问
且玩家没有要求瑟琳继续强行施法
```

如果当前信任值系统已有奖励判定，复用已有方式。

---

## 5. 剧情节点详细设计

以下文本可以直接写入剧情数据，也可以根据当前文本结构拆成 `lines`、`choices`、`effects`、`nextNodeId` 等。

---

### 5.1 节点：act1-blue-shoal-aftermath-compressed

背景：

```text
/assets/scenes/10blue-shoal-after-battle.webp
```

进入条件：

```text
蓝伞浅滩战斗胜利
```

进入时设置：

```ts
blueShoalAftermathSeen = true
compressedAct1EndingStarted = true
```

剧情文本：

```text
蓝伞浅滩重新安静下来。

漂浮在半空的孢尘缓缓落下，像一场倒过来的细雪。被斩断的菌丝没有立刻枯萎，而是在湿冷的地面上轻轻抽动，仿佛还在寻找刚才模仿过的人声。

瑟琳蹲下检查一截拟声菌团的残片。银杖顶端的微光照在菌肉上，照出一圈极细的黑色纹路。

瑟琳：“这不是普通孢化。它们像是被什么东西……从更深处拉长了。”

艾琳低声念了一句白枝祷词，替战场上残留的尸骨与遗物做了简短安魂。

艾琳：“它们不是单纯死在这里的。有人经过这里，然后被迫改变了路线。”

布洛克用斧背拨开一片蓝伞菌盖，露出下面半枚锈蚀的金属徽记。徽记已经被菌丝缠住，但还能看出地底堡垒的旧军纹。

布洛克：“这东西不该在浅滩。堡垒的人就算撤退，也不会把军徽丢在这种地方。”

凯娅半蹲在一块湿石旁，用指尖轻轻刮下一点黑色粉末。

凯娅：“有拖拽痕。不是怪物拖猎物，是有人穿着重甲，被一路拖向更深处。”
```

玩家选项：

```ts
[
  {
    id: 'inspect-emblem',
    label: '检查地底堡垒徽记',
    effect: ['addItem:item-fortress-emblem'],
    next: 'act1-black-root-entrance'
  },
  {
    id: 'inspect-black-powder',
    label: '检查黑色粉末',
    effect: ['addClue:blackstone-contamination-trace'],
    next: 'act1-black-root-entrance'
  },
  {
    id: 'ask-serin',
    label: '询问瑟琳对异常纹路的判断',
    effect: ['serinTrust:+1'],
    next: 'act1-black-root-entrance'
  },
  {
    id: 'regroup',
    label: '整理队伍，确认继续前进',
    next: 'act1-black-root-entrance'
  }
]
```

实现要求：

1. 这里可以不做骰子判定，避免拖慢收尾节奏。
2. 所有选项最终都进入 `act1-black-root-entrance`。
3. 至少保证地底堡垒徽记或等价线索能被加入背包。
4. 如果玩家没选检查徽记，可以在离开时由布洛克自动递给玩家，避免主线线索丢失。

---

### 5.2 节点：act1-black-root-entrance

背景：

```text
/assets/scenes/11black-root-entrance.webp
```

进入时设置：

```ts
blackRootEntranceSeen = true
```

剧情文本：

```text
队伍沿着浅滩边缘继续前进。

原本应该通往骨柱湿地的路线被大片黑色菌根封死。那些根须不像普通植物，它们紧贴着岩壁与地面，沿着某种古老封印纹路生长，将旧路一层层缝住。

旧地图上，蓝伞浅滩之后本该还有一段湿地。

可现在，湿地入口消失了。

只剩一道狭窄、幽暗、向下倾斜的裂隙仍然可以通行。

瑟琳：“路线不对。不是我们走错了，是路被改写了。”

布洛克：“旧图没错。错的是路。”

凯娅：“听起来真让人安心。路都会撒谎了。”

裂隙边缘有一块竖向黑色晶石碎片，像是从某座方尖碑上剥落下来。它的表面刻着极细的封印线，裂纹深处有暗红热光一闪即灭。
```

选项：

```ts
[
  {
    id: 'take-obelisk-shard',
    label: '收起黑色方尖碑碎片',
    effect: ['addItem:item-black-obelisk-shard'],
    next: 'act1-lain-survivor-event'
  },
  {
    id: 'ask-route',
    label: '询问旧路线为什么消失',
    next: 'act1-lain-survivor-event'
  },
  {
    id: 'enter-crack',
    label: '进入向下裂隙',
    next: 'act1-lain-survivor-event'
  }
]
```

实现要求：

1. 明确告诉玩家：骨柱湿地旧路被封死。
2. 不要把玩家带入骨柱湿地旧节点。
3. 这里是压缩版主线改道的叙事解释。
4. 黑色方尖碑碎片是主线线索，建议确保获得。

---

### 5.3 节点：act1-lain-survivor-event

背景：

```text
/assets/scenes/12lain-survivor-site.webp
```

进入时设置：

```ts
lainEncountered = true
```

NPC：

```text
莱因
```

剧情文本：

```text
队伍在黑色菌根之间发现了一个幸存者。

他高大、消瘦，身上穿着严重锈蚀的堡垒重甲。胸口的地底堡垒徽记被爪痕划穿，一只护手不见了，披风被孢子腐蚀得只剩半片。

他坐在一块黑石旁，手里死死攥着一枚断裂的军牌。周围没有完整尸体，只有散落的甲片、断剑和被黑根缠住的旧补给箱。

他抬头看见队伍时，眼神先是涣散，随后猛地恢复一瞬清醒。

莱因：“点名……第一队，报数……不对，少了三个人。不，是多了三个人……长官，我没有离队，我只是……我只是还在往下走。”

莱因：“别回答第三下敲门声。”

莱因：“它会学你们。先学声音，再学影子。等你发现影子不对的时候，门已经开错了。”

瑟琳的手指微微收紧，银杖顶端的光暗了一瞬。

瑟琳：“他是地底堡垒的人。”

艾琳：“他还活着，但精神和身体都被污染拖到了极限。”

凯娅：“这种状态还能从更深处爬回来？他不是运气好，是有什么东西故意让他回来。”
```

关键选择：

```ts
[
  {
    id: 'help-lain',
    label: '帮助莱因：安抚、治疗并保护他',
    effect: [
      'lainHelped:true',
      'lainIgnored:false',
      'addItem:item-lain-dogtag',
      'ailinTrust:+2',
      'serinTrust:+2'
    ],
    next: 'act1-black-root-rest-serin-crack'
  },
  {
    id: 'question-lain',
    label: '追问莱因：询问地底堡垒和黑暗之门',
    effect: [
      'lainHelped:true',
      'lainIgnored:false',
      'addItem:item-lain-dogtag',
      'serinTrust:+1'
    ],
    next: 'act1-black-root-rest-serin-crack'
  },
  {
    id: 'inspect-equipment',
    label: '检查莱因装备和断裂军牌',
    effect: [
      'addItem:item-lain-dogtag',
      'addClue:fortress-survivor-proof'
    ],
    next: 'act1-black-root-rest-serin-crack'
  },
  {
    id: 'ignore-lain',
    label: '无视莱因，任务优先，继续前进',
    effect: [
      'lainHelped:false',
      'lainIgnored:true',
      'serinTrust:-3',
      'ailinTrust:-4'
    ],
    next: 'act1-black-root-rest-serin-crack'
  },
  {
    id: 'take-clue-leave',
    label: '只拿走可用线索，然后离开',
    effect: [
      'lainHelped:false',
      'lainIgnored:true',
      'addItem:item-lain-dogtag',
      'kaiyaTrust:+1',
      'serinTrust:-1'
    ],
    next: 'act1-black-root-rest-serin-crack'
  }
]
```

若玩家帮助莱因，追加提示：

```text
莱因短暂清醒，断断续续地吐出几个词。

莱因：“胸口的黑石不是心脏……是锁。锁坏了，但锁还在响。”

莱因：“别站在根下面……它先抓影子，再抓人。”
```

若玩家无视莱因，追加提示：

```text
莱因没有再看向队伍。他只是坐在黑石旁，继续重复混乱的军令。

莱因：“换岗……关门……上一扇门……再上一扇……我们早就该关上了……”
```

实现要求：

1. 玩家必须明确选择帮助 / 无视。
2. `lainHelped` 是后续结局分支的硬条件。
3. 莱因不能加入战斗队伍，不占同伴位。
4. 莱因不能说地下海洋、海浪、海声、盐味。
5. 莱因不能解释完整真相。
6. 莱因不能揭露瑟琳来自未来。

---

### 5.4 节点：act1-black-root-rest-serin-crack

背景：

```text
/assets/scenes/13black-root-rest-point.webp
```

进入时设置：

```ts
serinStaffCrackSeen = true
```

剧情文本：

```text
队伍抵达黑石根区前沿。

这里已经不像普通孢海。蓝绿色菌光被压到极低，黑色根须从洞壁垂下，像倒挂的枯树。地面上散落着堡垒旧军队的标记石、断裂缆扣和被烧黑的封印钉。

远处，黑暗之门的轮廓第一次出现在视野尽头。

它不是完整的门，更像三圈嵌入地层的巨大封印环。环与环之间错位严重，黑色结晶菌丝从缝隙里钻出，把古代纹路缝合得像一条伤口。

瑟琳忽然停住。

她手中的银杖发出一声极轻的裂响。

杖身上出现了一道细小裂纹。

瑟琳第一次露出明显慌乱。那不是因为法杖损坏，而是因为她认出了某种不该在这里出现的黑石脉冲。

瑟琳：“不要靠近那些亮起的纹路。它们会干扰法术，也会干扰人的判断。”
```

选项：

```ts
[
  {
    id: 'comfort-serin',
    label: '安慰瑟琳，并要求她先休息',
    effect: ['serinTrust:+10', 'maybeAddSilverStaffCharm'],
    next: 'battle-blackstone-gatekeeper'
  },
  {
    id: 'ask-serin-carefully',
    label: '克制地追问她为什么害怕',
    effect: ['serinTrust:+5', 'maybeAddSilverStaffCharm'],
    next: 'battle-blackstone-gatekeeper'
  },
  {
    id: 'ask-task-impact',
    label: '只询问这会不会影响接下来的战斗',
    effect: ['serinTrust:+0'],
    next: 'battle-blackstone-gatekeeper'
  },
  {
    id: 'force-answer',
    label: '粗暴逼问她到底隐瞒了什么',
    effect: ['serinTrust:-15'],
    next: 'battle-blackstone-gatekeeper'
  },
  {
    id: 'force-cast',
    label: '要求她继续施法，不要拖慢队伍',
    effect: ['serinTrust:-20'],
    next: 'battle-blackstone-gatekeeper'
  }
]
```

奖励判定：

```ts
function maybeAddSilverStaffCharm(state: GameState) {
  if (getSerinTrust(state) >= 70 && !state.forcedSerinCast && !state.forcedSerinAnswer) {
    addItem('item-silver-staff-charm');
    state.serinStaffCharmObtained = true;
  }
}
```

允许瑟琳说：

```text
“我不能解释全部。但我可以告诉你，这扇门现在不稳定。它不是简单的入口，它更像……被迫指向了错误方向的路标。”
```

禁止瑟琳说：

1. 她来自未来。
2. 玩家未来身份。
3. 地底堡垒完整真相。
4. 黑暗之门后方反转。
5. 地下海洋相关词。

实现要求：

1. 优先复用当前同伴支线系统中的 `serin_cracked_silver_staff`，如果该事件已实现，不要重新写一套。
2. 如果已有事件能直接触发，就在这里调用现有事件。
3. 如果当前事件入口绑定在旧 Boss 前节点，则改接到新节点。
4. 不要让瑟琳用时间魔法解决 Boss。

---

## 6. 黑石门卫 Boss 战

### 6.1 战斗配置

Boss 战场背景：

```text
/assets/scenes/14dark-gate-forecourt-battle.webp
```

Boss 素材：

```text
/assets/enemies/enemy-gatekeeper.webp
```

核心暴露差分：

```text
/assets/enemies/enemy-gatekeeper-core-exposed.webp
```

召唤小怪：

```text
/assets/enemies/enemy-black-root-minion.webp
```

建议敌人：

```ts
{
  id: 'blackstone-gatekeeper',
  name: '黑石门卫',
  hp: 80,
  image: '/assets/enemies/enemy-gatekeeper.webp',
  phase2Image: '/assets/enemies/enemy-gatekeeper-core-exposed.webp',
}
```

若当前战斗系统已有 Boss 配置格式，请按现有格式写，不要自行创造新格式。

### 6.2 战斗阶段表现

阶段一：黑根苏醒

```text
地面黑石根须收缩，形成环形战场。黑石门卫从菌根和碎石中缓慢抬起。黑暗之门远处的三圈封印纹路短暂亮起。
```

阶段二：封锁展开

```text
地面出现亮起的黑石纹路。瑟琳提醒队伍不要长时间站在发光区域。孢粉脉冲短暂干扰视野，暗红热裂从地面缝隙里一闪即灭。
```

阶段三：核心暴露

```text
黑石门卫胸口核心暴露。那枚核心一半像心脏，一半像锁。菌丝冷光、黑石暗光和暗红热裂在核心周围交替闪烁。
```

### 6.3 Boss 战结果

战斗胜利后：

```ts
blackstoneGatekeeperDefeated = true
nextNode = 'act1-boss-core-choice'
```

战斗失败 / 小队团灭后：

```ts
act1EndingId = 'time-reset'
nextNode = 'act1-bad-ending-time-reset'
```

实现要求：

1. Boss 战本体优先复用当前战斗系统。
2. 不要为了“稳定核心 / 破坏核心”重写战斗引擎。
3. 推荐在 Boss 血量归零或战斗胜利后，进入剧情选择节点 `act1-boss-core-choice`。
4. “稳定核心 / 破坏核心”作为战后剧情选择处理。
5. Boss 不说完整人话，只能发出古代警戒音、菌丝震鸣和门体共鸣。
6. Boss 战中 AI 只描述程序判定结果，不得改写胜负和伤害。

---

## 7. Boss 核心处理选择

节点：

```text
act1-boss-core-choice
```

背景：

```text
/assets/scenes/14dark-gate-forecourt-battle.webp
```

剧情文本：

```text
黑石门卫的动作逐渐迟缓。

它胸口的黑石核心完全暴露出来。那枚核心一半像心脏，一半像古代锁芯。青绿色菌光、深暗黑石光与暗红热裂在核心周围交替闪烁。

瑟琳举起裂开的银杖，声音压得很低。

瑟琳：“现在可以强行破坏它，也可以尝试稳定它。两种方法都能让我们接近黑暗之门。”

布洛克：“砍碎它最快。但我得说，这东西不像单纯的怪物。”

凯娅：“锁坏了可以砸，当然也可以开。问题是，你想留下多少麻烦给以后？”

艾琳：“如果它曾经是守门的东西，也许它不是我们的敌人，只是已经失控太久了。”

你必须做出选择。
```

选项：

```ts
[
  {
    id: 'stabilize-core',
    label: '稳定核心，保留封印',
    effect: ['bossCoreChoice:stabilize'],
    next: 'resolveAct1Ending'
  },
  {
    id: 'destroy-core',
    label: '破坏核心，强行开路',
    effect: ['bossCoreChoice:destroy'],
    next: 'resolveAct1Ending'
  }
]
```

结局解析函数：

```ts
function resolveAct1Ending(state: GameState): Act1EndingId {
  if (state.lainHelped && state.bossCoreChoice === 'stabilize') {
    return 'guardian-remains';
  }

  if (state.lainHelped && state.bossCoreChoice === 'destroy') {
    return 'wounded-through-gate';
  }

  if (!state.lainHelped && state.bossCoreChoice === 'stabilize') {
    return 'cold-expedition';
  }

  return 'gate-split-open';
}
```

实现要求：

1. `bossCoreChoice` 是后续结局分支硬条件。
2. 这里必须是玩家选择，不能由 NPC 自动决定。
3. 同伴只能给意见，不能替玩家做最终选择。
4. 两个选项都能通关，不存在“正确答案”。

---

## 8. 四个正常结局

四个结局只影响：

1. 结局 CG。
2. 结局文本。
3. 同伴评价。
4. 玩家获得线索数量。
5. 门开启方式。
6. 统一反转前的队伍状态。

四个结局之后都必须进入：

```text
act1-ending-ocean-reveal
```

---

### 8.1 结局 A：守门者仍在

节点：

```text
act1-ending-guardian-remains
```

条件：

```text
lainHelped = true
bossCoreChoice = 'stabilize'
```

CG：

```text
/assets/scenes/ending-guardian-remains.webp
```

进入时设置：

```ts
act1EndingId = 'guardian-remains'
```

文本：

```text
黑石门卫没有彻底倒下。

它缓慢跪回黑石根区深处，胸口的黑石核心不再暴走，像一枚被重新扣上的锁。那些原本狂乱抽动的黑色根须垂落下来，重新变成沉默的门前防线。

莱因在瑟琳和艾琳的协助下短暂清醒。他抬头看向黑暗之门，声音低得像从很远的地方传来。

莱因：“堡垒……没有开门。是路开错了。我们守的是门，可门把我们送去了别处……”

瑟琳明显松了一口气，却没有解释更多。

黑暗之门在低沉回响中稳定开启。
```

下一节点：

```text
act1-ending-ocean-reveal
```

---

### 8.2 结局 B：带伤者穿门

节点：

```text
act1-ending-wounded-through-gate
```

条件：

```text
lainHelped = true
bossCoreChoice = 'destroy'
```

CG：

```text
/assets/scenes/ending-wounded-through-gate.webp
```

进入时设置：

```ts
act1EndingId = 'wounded-through-gate'
```

文本：

```text
黑石核心被强行击碎。

黑石门卫庞大的身体失去支撑，沉重地倒在门前庭边缘。门体边缘浮现出细密裂纹，封印环发出不稳定的低鸣。

队伍在震动中护住莱因。他没有完全清醒，只是死死抓住那枚地底堡垒徽记，像是在确认自己没有再次被丢下。

莱因：“别丢下守门的人……别再丢下……”

瑟琳第一时间检查玩家和莱因的伤势。她没有责备，只是看向门体裂纹的眼神更加沉重。

黑暗之门被强行打开。
```

下一节点：

```text
act1-ending-ocean-reveal
```

---

### 8.3 结局 C：冷静的远征

节点：

```text
act1-ending-cold-expedition
```

条件：

```text
lainHelped = false
bossCoreChoice = 'stabilize'
```

CG：

```text
/assets/scenes/ending-cold-expedition.webp
```

进入时设置：

```ts
act1EndingId = 'cold-expedition'
```

文本：

```text
黑石门卫被稳定下来。

它重新沉入黑石根区，像一座恢复沉默的旧防线。门前机制暂时收束，封印纹路按顺序亮起，黑暗之门以相对平稳的方式开启。

队伍得到了更完整的门体结构线索，却缺少那个幸存者的证词。

远处，莱因的声音已经听不清了。也许他仍坐在黑根边缘重复军令，也许黑暗已经把他的声音吞没。

瑟琳没有指责玩家，只是语气比平时更冷。

瑟琳：“任务继续。”

黑暗之门稳定开启。
```

下一节点：

```text
act1-ending-ocean-reveal
```

---

### 8.4 结局 D：裂门而下

节点：

```text
act1-ending-gate-split-open
```

条件：

```text
lainHelped = false
bossCoreChoice = 'destroy'
```

CG：

```text
/assets/scenes/ending-gate-split-open.webp
```

进入时设置：

```ts
act1EndingId = 'gate-split-open'
```

文本：

```text
黑石核心被强行破坏。

封印纹路像被从内部撕开，黑石根区剧烈震动。黑暗之门开启得更快，也更粗暴。门环之间的错位被强行拉开，留下刺眼的裂光。

莱因没有出现在门前。远处似乎传来一声模糊的盔甲拖动声，随后被黑石震动盖过。

瑟琳握着裂开的银杖，先确认队伍还能行动，然后才低声开口。

瑟琳：“继续走。不要停在这里。”

黑暗之门裂开式开启。
```

下一节点：

```text
act1-ending-ocean-reveal
```

---

## 9. 统一地下海洋反转

节点：

```text
act1-ending-ocean-reveal
```

背景：

```text
/assets/scenes/15underground-ocean-reveal.webp
```

进入时设置：

```ts
undergroundOceanRevealed = true
```

重要限制：

1. 只有进入该节点后，才能首次出现地下海洋、海风、潮声、黑色水面等描述。
2. 此前所有节点都禁止明示地下海洋。
3. 这里是第一幕最终反转，必须有足够停顿感。

文本：

```text
黑暗之门终于开启。

一开始，所有人都以为自己会看见地底堡垒的外墙、哨塔、断裂缆桥，或者至少看见旧图中标注的堡垒层入口。

但门后传来的不是堡垒的回声。

是一阵辽阔、潮湿、陌生的风。

黑暗尽头亮起灰蓝色的微光。队伍踏过门槛，脚下的黑石地面忽然变成湿冷的岩岸。

远处，有看不见边界的黑色水面在地下穹顶下缓缓起伏。无数远古遗迹的尖顶从水中露出，像沉没在另一个时代的墓碑。

旧地图上，黑暗之门后应该是地底堡垒。

可现在，门后是一片地下海洋。

瑟琳站在队伍后方，没有立刻说话。

她看起来震惊，却不是完全没有预料。

第一幕结束。
```

选项：

```ts
[
  {
    id: 'finish-act1',
    label: '结束第一幕',
    next: 'act1-game-complete'
  }
]
```

---

## 10. 第一幕游戏结束节点

节点：

```text
act1-game-complete
```

进入时设置：

```ts
act1GameCompleted = true
```

建议 UI：

```text
第一幕：逆穹城与无光孢海
已完成
```

结算内容：

```text
你的远征队穿过了黑暗之门。

你们没有抵达旧图中的地底堡垒。

门后是一片不该存在于这里的地下海洋。

地底堡垒究竟去了哪里？
莱因看到的“门开错了”是什么意思？
黑色方尖碑碎片为何会出现在门前？
瑟琳为什么没有真正惊讶？

这些问题，将留在更深处。
```

按钮建议：

```ts
[
  {
    id: 'back-title',
    label: '返回标题',
    action: 'returnToTitle'
  },
  {
    id: 'view-ending-record',
    label: '查看结局记录',
    action: 'openEndingRecord'
  }
]
```

如果当前已有结局界面 / 游戏结束界面，请复用，不要新建一套 UI。

---

## 11. 坏结局：逆时归零

节点：

```text
act1-bad-ending-time-reset
```

触发条件：

```text
黑石门卫 Boss 战中小队团灭
```

注意：

1. 该结局只在 Boss 战团灭时触发。
2. 普通剧情不能让玩家主动要求瑟琳使用强力时间魔法。
3. 不能完整揭露瑟琳来自未来。
4. 主角不能保留清晰记忆。
5. 该结局触发后游戏结束，不进入地下海洋反转。

文本：

```text
小队倒在黑石根区。

黑石门卫胸口的核心光芒压过孢海冷光。所有声音都变得遥远，像被厚重石层隔开。

瑟琳拖着裂开的银杖来到主角身边。她第一次完全失去平静。

瑟琳：“对不起……这一次，还是来不及。”

瑟琳：“如果你醒来后什么都不记得，也请你……再走一次。”

瑟琳：“我会付出代价。你只要活下去。”

银杖彻底裂开。

黑石纹路倒流，孢子停在半空。队伍的声音逐渐远去，只剩瑟琳的声音还在黑暗里回响。

你眼前出现逆穹悬城最初的灯火。

你回到了最初。

你不记得无光孢海，不记得黑石门卫，不记得自己曾经失败。

但有一瞬间，你似乎听见有人在很远的地方说：

“请再来一次。”

游戏结束。
```

进入时设置：

```ts
act1EndingId = 'time-reset'
act1GameCompleted = true
```

---

## 12. 结局映射表

建议新增一个小型纯函数，便于测试。

```ts
export function resolveAct1EndingId(
  lainHelped: boolean,
  bossCoreChoice: 'destroy' | 'stabilize'
): Act1EndingId {
  if (lainHelped && bossCoreChoice === 'stabilize') {
    return 'guardian-remains';
  }

  if (lainHelped && bossCoreChoice === 'destroy') {
    return 'wounded-through-gate';
  }

  if (!lainHelped && bossCoreChoice === 'stabilize') {
    return 'cold-expedition';
  }

  return 'gate-split-open';
}
```

测试用例：

```ts
expect(resolveAct1EndingId(true, 'stabilize')).toBe('guardian-remains');
expect(resolveAct1EndingId(true, 'destroy')).toBe('wounded-through-gate');
expect(resolveAct1EndingId(false, 'stabilize')).toBe('cold-expedition');
expect(resolveAct1EndingId(false, 'destroy')).toBe('gate-split-open');
```

---

## 13. 路由改造点

Codex 需要找到当前蓝伞浅滩战斗胜利后的跳转逻辑。可能关键词：

```text
blue_shoal
blueShoal
after-battle-blue-shoal
afterBattleBlueShoal
completedBlueShoalBattle
battle_blue_shoal_result
blue_shoal_battle_done
```

将原有后续路由改为：

```ts
if (battleId === 'blue-shoal' && result === 'win') {
  setFlag('blue_shoal_battle_done', true);
  setFlag('completedBlueShoalBattle', true);
  setFlag('battle_blue_shoal_result', 'win');

  if (ENABLE_COMPRESSED_ACT1_ENDING) {
    return goToStoryNode('act1-blue-shoal-aftermath-compressed');
  }

  return goToStoryNode(getLegacyBlueShoalNextNode(state));
}
```

关键要求：

1. 保留原有蓝伞浅滩胜利 flag。
2. 不破坏已有测试。
3. 新增压缩路由后，旧支线不应自动触发。
4. 新路由应可存档、读档、刷新恢复。

---

## 14. Boss 战接入点

Codex 需要复用现有战斗配置系统。  
不要单独写一个 Boss 战页面。

建议：

1. 新增黑石门卫战斗配置。
2. 复用当前战斗触发函数。
3. 复用当前战斗胜利回调。
4. 胜利后跳转 `act1-boss-core-choice`。
5. 失败后跳转 `act1-bad-ending-time-reset`。

伪代码：

```ts
startBattle({
  battleId: 'blackstone-gatekeeper',
  config: BLACKSTONE_GATEKEEPER_BATTLE_CONFIG,
  onWinNextNode: 'act1-boss-core-choice',
  onLoseNextNode: 'act1-bad-ending-time-reset',
});
```

如果当前战斗系统不支持 `onLoseNextNode`，按当前已有失败处理方式最小扩展。

---

## 15. 同伴与信任值处理

当前队伍是固定五人：

```text
主角 + 瑟琳 + 艾琳 + 布洛克 + 凯娅
```

本次流程中这些角色都会出现台词，但不需要新增招募逻辑。

信任值影响：

1. 莱因帮助：
   - 瑟琳小幅增加。
   - 艾琳小幅增加。
2. 莱因无视：
   - 瑟琳小幅降低。
   - 艾琳小幅降低。
3. 瑟琳裂杖节点：
   - 安慰休息：+10。
   - 克制追问：+5。
   - 只问任务影响：0。
   - 粗暴逼问：-15。
   - 要求继续施法：-20。

若当前信任值系统已有 helper，必须复用。

---

## 16. AI 主持限制

所有 AI 续写 / 旁白必须遵守：

1. 不要提前揭露瑟琳来自未来。
2. 不要提前揭露玩家未来英雄身份。
3. 不要解释三件封印圣遗物。
4. 不要解释完整时间锚点真相。
5. 黑暗之门开启前，不要出现地下海洋、海风、海浪、海声、盐味等明显暗示。
6. 莱因不能说出地下海洋反转。
7. Boss 不能说完整人话。
8. 同伴不能替玩家做关键选择。
9. AI 不能改写程序判定的战斗胜负、伤害、状态。
10. 结局必须由玩家两个关键选择决定：莱因帮助 / 无视，核心破坏 / 稳定。

---

## 17. 测试清单

### 17.1 路由测试

必须验证：

1. 蓝伞浅滩战斗胜利后进入 `act1-blue-shoal-aftermath-compressed`。
2. 蓝伞浅滩战斗胜利后不会进入 `block_echo_forest`。
3. 蓝伞浅滩战斗胜利后不会进入骨柱湿地。
4. 黑石根区入口后进入莱因事件。
5. 莱因事件后进入瑟琳裂杖节点。
6. 瑟琳裂杖节点后进入黑石门卫 Boss。
7. Boss 胜利后进入核心选择。
8. Boss 团灭后进入坏结局。
9. 四个正常结局后都进入地下海洋反转。
10. 地下海洋反转后进入第一幕游戏结束。

### 17.2 结局映射测试

```ts
帮助莱因 + 稳定核心 = 守门者仍在
帮助莱因 + 破坏核心 = 带伤者穿门
无视莱因 + 稳定核心 = 冷静的远征
无视莱因 + 破坏核心 = 裂门而下
```

### 17.3 存档测试

必须验证：

1. 在蓝伞浅滩战后余波存档并读档，背景和节点正确。
2. 在莱因选择后存档并读档，`lainHelped` 不丢失。
3. 在 Boss 前休整点存档并读档，瑟琳裂杖状态不丢失。
4. 在核心选择后存档并读档，`bossCoreChoice` 不丢失。
5. 在四结局节点存档并读档，结局 CG 正确。
6. 在地下海洋反转节点存档并读档，背景正确。
7. 旧存档没有新增字段时不会崩溃。

### 17.4 素材测试

必须验证所有路径有效：

```text
/assets/scenes/10blue-shoal-after-battle.webp
/assets/scenes/11black-root-entrance.webp
/assets/scenes/12lain-survivor-site.webp
/assets/scenes/13black-root-rest-point.webp
/assets/scenes/14dark-gate-forecourt-battle.webp
/assets/scenes/15underground-ocean-reveal.webp
/assets/scenes/ending-guardian-remains.webp
/assets/scenes/ending-wounded-through-gate.webp
/assets/scenes/ending-cold-expedition.webp
/assets/scenes/ending-gate-split-open.webp
/assets/enemies/enemy-gatekeeper.webp
/assets/enemies/enemy-gatekeeper-core-exposed.webp
/assets/enemies/enemy-black-root-minion.webp
/assets/icons/items/item-fortress-emblem.png
/assets/icons/items/item-lain-dogtag.png
/assets/icons/items/item-black-obelisk-shard.png
/assets/icons/items/item-silver-staff-charm.png
```

### 17.5 禁止事项测试

人工检查：

1. 地下海洋只在 `act1-ending-ocean-reveal` 首次出现。
2. 莱因没有说出地下海洋。
3. 瑟琳没有说出自己来自未来。
4. Boss 没有解释完整世界观。
5. 旧蓝伞浅滩后路线没有被自动触发。

---

## 18. 建议提交方式

建议分 2 到 3 个小提交：

### 提交 1：压缩主线路由与剧情节点

内容：

1. 新增素材路径常量。
2. 新增压缩主线剧情节点。
3. 改造蓝伞浅滩胜利后路由。
4. 新增状态字段默认值。
5. 确保旧路线保留但不触发。

提交信息：

```text
feat: add compressed act1 ending route
```

### 提交 2：黑石门卫 Boss 与结局分支

内容：

1. 新增黑石门卫 Boss 配置。
2. 接入 Boss 胜利和失败回调。
3. 新增核心处理选择。
4. 新增四结局映射。
5. 新增地下海洋反转和游戏结束节点。

提交信息：

```text
feat: add blackstone gatekeeper ending branches
```

### 提交 3：测试与存档修复

内容：

1. 新增结局映射测试。
2. 新增蓝伞浅滩后路由测试。
3. 新增存档兼容测试。
4. 修复 TypeScript / 构建问题。

提交信息：

```text
test: cover compressed act1 ending flow
```

---

## 19. 验收标准

完成后必须满足：

1. 蓝伞浅滩战斗胜利后，不再进入布洛克支线、凯娅支线、骨柱湿地等旧路线。
2. 玩家能从蓝伞浅滩战后一路玩到第一幕结束。
3. 莱因帮助 / 无视能正确记录。
4. Boss 胜利后能选择破坏 / 稳定核心。
5. 四种结局能按组合正确触发。
6. 四种结局都能进入地下海洋反转。
7. Boss 团灭能进入坏结局“逆时归零”。
8. 地下海洋反转只在最后出现。
9. 存档读档不破坏新流程。
10. 旧存档不崩溃。
11. 前端测试通过。
12. 后端测试通过。
13. TypeScript + Vite 构建通过。
14. Python compileall 通过。
15. `git diff --check` 通过。
16. 没有无意义大改，没有重新发明已有系统。
17. 复用了当前重构后的剧情、战斗、存档、素材与测试结构。

---

## 20. 给 Codex 的最后提醒

这次任务的关键不是“写很多新代码”，而是把已经重构好的模块真正用起来。

请优先搜索并复用当前项目中已经存在的：

```text
blue_shoal
after-battle-blue-shoal
completedBlueShoalBattle
battle_blue_shoal_result
companionSideQuests
serin_cracked_silver_staff
saveSnapshot
saveRestore
battle config
story node
scene background
item registry
ending screen
```

不要绕开它们。  
不要从零开始。  
不要因为压缩剧情就删除旧支线。  
不要让旧蓝伞浅滩后续节点继续自动触发。  
最终目标是：**最小侵入、最大复用、稳定收束第一幕。**
