# 布洛克喝酒游戏机制说明

## 1. 机制目标

布洛克的喝酒游戏用于表现玩家与布洛克之间的互动。

玩家需要在多回合中完成喝酒挑战。每回合先进行体质豁免，成功后才能喝酒。喝酒会减少当前酒量。当酒量归零时，游戏结束。

游戏结束后，根据玩家完成挑战所用的回合数，增加布洛克的信任值，并触发布洛克对应的结果台词。

---

## 2. 初始参数

| 参数 | 数值 |
|---|---:|
| 初始酒量 | 10 |
| 初始 AC | 8 |
| AC 每回合增长 | +2 |
| AC 上限 | 18 |
| 酒量骰 | 1D4 |

---

## 3. 每回合流程

每一回合由以下步骤构成：

### 3.1 体质豁免

玩家投掷：

```ts
D20 + 体质加值
```

判定是否达到当前 AC。

```ts
D20 + conMod >= currentAC
```

若达到或超过当前 AC，则体质豁免成功。

若未达到当前 AC，则体质豁免失败。

---

### 3.2 自然 20 规则

如果玩家在体质豁免中投出自然点数 20：

```ts
D20 === 20
```

则触发特殊成功：

```ts
当前酒量直接归零
游戏立即结束
不再投掷 1D4 酒量骰
```

---

### 3.3 体质豁免成功

如果体质豁免成功，且不是自然 20：

```ts
投掷 1D4
当前酒量 -= 1D4 结果
```

酒量最低为 0。

```ts
alcohol = Math.max(0, alcohol - drinkRoll)
```

---

### 3.4 体质豁免失败

如果体质豁免失败：

```ts
玩家被酒气呛到
本回合无法喝酒
当前酒量不减少
直接进入下一回合
```

---

### 3.5 AC 增长

每回合结束后，如果游戏尚未结束，则 AC 增加 2。

```ts
currentAC = Math.min(18, currentAC + 2)
```

AC 最高为 18。

---

## 4. 游戏结束条件

当玩家当前酒量小于等于 0 时，喝酒游戏结束。

```ts
if (alcohol <= 0) {
  endGame()
}
```

---

## 5. 信任值结算

游戏结束后，根据玩家完成挑战所用的回合数，增加布洛克的信任值。

| 完成回合数 | 布洛克信任值增加 |
|---:|---:|
| 1 回合 | +15 |
| 2 回合 | +13 |
| 3 回合 | +10 |
| 4 回合 | +8 |
| 5 回合 | +5 |
| 6 回合 | +3 |
| 大于 6 回合 | +0 |

---

## 6. 布洛克结果台词

### 1 回合完成

```ts
「……一口就见底？哈！我收回前言，你这家伙不是来喝酒的，你是来吓酒桶的！」
```

### 2 回合完成

```ts
「够狠！这酒连矿道里的老矮人都得慢慢咽，你倒是敢往喉咙里灌。」
```

### 3 回合完成

```ts
「不错，有点本事。能在第三轮前喝完的人，至少不会在孢海里被第一阵怪味熏倒。」
```

### 4 回合完成

```ts
「还行，脸色是差了点，但手没抖。跟你下深层，我多少能放心一些。」
```

### 5 回合完成

```ts
「勉强过关。酒量不算漂亮，不过你至少没把杯子扣我桌上。」
```

### 6 回合完成

```ts
「喝得慢了点，但能撑到最后也算有骨气。行吧，我记你一分。」
```

### 大于 6 回合完成

```ts
「啧，酒喝完是喝完了，可这速度……到了无光孢海，别指望菌雾等你慢慢适应。」
```

---

## 7. 返回数据结构

建议将喝酒游戏封装为一个独立函数：

```ts
playBrockDrinkingGame(conMod: number)
```

函数返回：

```ts
{
  totalRounds: number;
  trustGain: number;
  finalDialogue: string;
  logs: DrinkingRoundLog[];
}
```

其中 `logs` 记录每一回合的详细信息。

```ts
type DrinkingRoundLog = {
  round: number;
  ac: number;
  d20: number;
  conMod: number;
  total: number;
  success: boolean;
  natural20: boolean;
  drinkRoll: number | null;
  alcoholBefore: number;
  alcoholAfter: number;
  message: string;
};
```

---

## 8. TypeScript 核心实现

```ts
export type DrinkingRoundLog = {
  round: number;
  ac: number;
  d20: number;
  conMod: number;
  total: number;
  success: boolean;
  natural20: boolean;
  drinkRoll: number | null;
  alcoholBefore: number;
  alcoholAfter: number;
  message: string;
};

export type DrinkingGameResult = {
  totalRounds: number;
  trustGain: number;
  finalDialogue: string;
  logs: DrinkingRoundLog[];
};

function rollDice(sides: number): number {
  return Math.floor(Math.random() * sides) + 1;
}

function getBrockTrustGain(totalRounds: number): number {
  if (totalRounds === 1) return 15;
  if (totalRounds === 2) return 13;
  if (totalRounds === 3) return 10;
  if (totalRounds === 4) return 8;
  if (totalRounds === 5) return 5;
  if (totalRounds === 6) return 3;
  return 0;
}

function getBrockFinalDialogue(totalRounds: number): string {
  if (totalRounds === 1) {
    return "「……一口就见底？哈！我收回前言，你这家伙不是来喝酒的，你是来吓酒桶的！」";
  }

  if (totalRounds === 2) {
    return "「够狠！这酒连矿道里的老矮人都得慢慢咽，你倒是敢往喉咙里灌。」";
  }

  if (totalRounds === 3) {
    return "「不错，有点本事。能在第三轮前喝完的人，至少不会在孢海里被第一阵怪味熏倒。」";
  }

  if (totalRounds === 4) {
    return "「还行，脸色是差了点，但手没抖。跟你下深层，我多少能放心一些。」";
  }

  if (totalRounds === 5) {
    return "「勉强过关。酒量不算漂亮，不过你至少没把杯子扣我桌上。」";
  }

  if (totalRounds === 6) {
    return "「喝得慢了点，但能撑到最后也算有骨气。行吧，我记你一分。」";
  }

  return "「啧，酒喝完是喝完了，可这速度……到了无光孢海，别指望菌雾等你慢慢适应。」";
}

export function playBrockDrinkingGame(conMod: number): DrinkingGameResult {
  let alcohol = 10;
  let ac = 8;
  let round = 1;

  const logs: DrinkingRoundLog[] = [];

  while (alcohol > 0) {
    const alcoholBefore = alcohol;

    const d20 = rollDice(20);
    const total = d20 + conMod;
    const natural20 = d20 === 20;
    const success = natural20 || total >= ac;

    let drinkRoll: number | null = null;
    let message = "";

    if (natural20) {
      alcohol = 0;

      message =
        `第${round}回合：你投出自然20！烈酒入口的一瞬间，你像是完全无视了酒劲，直接将杯中酒一饮而尽。`;
    } else if (success) {
      drinkRoll = rollDice(4);
      alcohol = Math.max(0, alcohol - drinkRoll);

      message =
        `第${round}回合：体质豁免 D20=${d20}，体质加值=${conMod}，总值=${total}，成功达到 AC ${ac}。` +
        `你继续喝酒，酒量骰 1D4=${drinkRoll}，剩余酒量 ${alcohol}。`;
    } else {
      message =
        `第${round}回合：体质豁免 D20=${d20}，体质加值=${conMod}，总值=${total}，未达到 AC ${ac}。` +
        `你被浓烈酒气呛到，本回合没能喝下去，剩余酒量仍为 ${alcohol}。`;
    }

    logs.push({
      round,
      ac,
      d20,
      conMod,
      total,
      success,
      natural20,
      drinkRoll,
      alcoholBefore,
      alcoholAfter: alcohol,
      message,
    });

    if (alcohol <= 0) {
      break;
    }

    round += 1;
    ac = Math.min(18, ac + 2);
  }

  const totalRounds = round;
  const trustGain = getBrockTrustGain(totalRounds);
  const finalDialogue = getBrockFinalDialogue(totalRounds);

  return {
    totalRounds,
    trustGain,
    finalDialogue,
    logs,
  };
}
```

---

## 9. 前端调用示例

```ts
const conMod = player.stats.conMod;

const result = playBrockDrinkingGame(conMod);

addNpcTrust("brock", result.trustGain);

result.logs.forEach((log) => {
  addGameLog(log.message);
});

addDialogue({
  speaker: "布洛克",
  text: result.finalDialogue,
  portrait: "/assets/characters/senluo/brock_tavern.webp",
});
```

---

## 10. Codex 实现要求

请修改布洛克喝酒小游戏机制。

### 规则要求

1. 玩家初始酒量 `alcohol = 10`。
2. 初始体质豁免 AC 为 `8`。
3. 每回合 AC 增加 `2`，但最高不超过 `18`。
4. 每回合先进行体质豁免，投掷 `D20 + 玩家体质加值 conMod`。
5. 如果 D20 自然点数为 `20`，则酒量直接归零，游戏立即结束，不再投 `1D4`。
6. 如果 `D20 + conMod >= 当前 AC`，则体质豁免成功，再投掷 `1D4`，酒量减少对应点数。
7. 如果体质豁免失败，则玩家被酒气呛到，本回合无法喝酒，酒量不减少，进入下一回合。
8. 当酒量 `<= 0` 时，游戏结束。
9. 游戏结束后，根据完成回合数增加布洛克信任值。
10. 游戏结束后，根据完成回合数输出布洛克对应台词。

### 返回结果要求

请将该逻辑封装成一个可复用函数，例如：

```ts
playBrockDrinkingGame(conMod)
```

函数需要返回：

```ts
{
  totalRounds,
  trustGain,
  finalDialogue,
  logs
}
```

其中 `logs` 需要记录每回合的：

```ts
round
ac
d20
conMod
total
success
natural20
drinkRoll
alcoholBefore
alcoholAfter
message
```

### 游戏结束后的处理

喝酒游戏结束时，需要执行以下逻辑：

1. 将 `trustGain` 增加到布洛克的信任值上。
2. 将每一回合的 `message` 显示到游戏日志中。
3. 让布洛克说出 `finalDialogue`。
