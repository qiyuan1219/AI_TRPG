# 4项潜在Bug专项调查报告

> 调查日期：2026-06-20  
> 调查范围：结局C触发、防御技能配置、防御技能生效、骨柱湿地后BGM

---

## Bug 1：结局C（冷静的远征）无法正常触发 🔴 确认

### 根本原因

存在**两条互相矛盾的结局路由路径**，且 `resolveEnding` 函数永远不会返回 endingC。

### 路径A：`resolveEnding`（`postBlueShoalStory.ts:2881-2911`）

```typescript
function resolveEnding(state, patch, id) {
  const helpedLaine = Boolean(...); // 是否用净化之心救莱因

  if (id === "stabilize_boss_core") {
    if (!helpedLaine) {
      patch.bossCoreChoice = "destroy";
      return POST_BLUE_SHOAL_IDS.endingD;  // ← 强行跳D，永远不会到C
    }
    return POST_BLUE_SHOAL_IDS.endingA;     // ← 救了莱因就是A
  }
  patch.bossCoreChoice = "destroy";
  return helpedLaine ? POST_BLUE_SHOAL_IDS.endingB : POST_BLUE_SHOAL_IDS.endingD;
}
```

**问题**：当 `!helpedLaine` 且选了 "stabilize_boss_core" 时，应该返回**结局C**，但代码返回的是**结局D**。这个函数只返回 A/B/D，**结局C 是死代码**。

### 路径B：`routeAct1Ending`（`App.tsx:4175-4200`）✅ 正确

```typescript
if (!helpedRhein && coreChoice === 'stabilize') endingId = 'ending_cold_expedition'; // C ✅
```

**但这条路径永远不会被走到**，因为：

1. `getPostBlueShoalHintState`（`postBlueShoalStory.ts:1175-1190`）将"稳定 Boss 核心"设为 **disabled**，原因是"必须先用净化之心救下莱因"
2. 即使玩家通过某种方式选择，也会进 `resolvePostBlueShoalAction` → `resolveEnding`，永远返回 D

### 修复方向

在 `resolveEnding` 第 2898-2903 行，修改为：

```typescript
if (id === "stabilize_boss_core") {
  if (!helpedLaine) {
    patch.bossCoreChoice = "stabilize";   // ← 改为 stabilize
    return POST_BLUE_SHOAL_IDS.endingC;   // ← 返回 C 而不是 D
  }
  patch.bossCoreChoice = "stabilize";
  return POST_BLUE_SHOAL_IDS.endingA;
}
```

同时移除 `getPostBlueShoalHintState` 中对"稳定核心"选项的 disabled 条件（行 1174-1190），允许未救莱因的玩家也能选择稳定核心。

---

## Bug 2：我方角色三技能没有换成防御 🔴 确认（后端缺失）

### 前端：✅ 配置正确

`sharedPartyBattleSkills.ts` 中所有 5 个角色的第三个技能都是防御技能：

| 角色 | 防御技能ID | 行号 |
|---|---|---|
| 冒险者 | `defenseSkill('TA3')` | 22 |
| 瑟琳 | `defenseSkill('SE3')` | 27 |
| 布洛克 | `defenseSkill('SN3')` | 32 |
| 艾琳 | `defenseSkill('AL3')` | 37 |
| 凯娅 | `defenseSkill('KL3')` | 42 |

### 后端：❌ 缺少防御技能注册

`battle_engine.py:70-193` — **SKILLS 字典中没有任何防御技能**。所有注册的技能都是攻击/治疗/范围法术。

`battle_engine.py:258-281` — **DEFAULT_CHARACTERS 的 skillIds 不包含防御技能**：

```python
# 冒险者
"skillIds": ["warrior_slash"],           # ← 只有1个，无 TA3

# 瑟琳
"skillIds": ["selin_bolt", "selin_starburst"],  # ← 无 SE3

# 布洛克
"skillIds": ["brock_pan", "brock_bomb"],        # ← 无 SN3
```

### 实际影响

通过 `authoritativeAdapter` → `battleController.start()` 的正常战斗路径，防御技能会被前端动态注入到后端 `state["skills"]` 中，**理论上可用**。但：

- 如果任何代码路径直接使用 `DEFAULT_CHARACTERS`（后端 fallback），角色完全没有防御技能
- `battle_engine.py:383-384` 要求 `skill["id"] in actor.get("skillIds", [])`，这要求前端正确传入

**修复方向**：在后端 `SKILLS` 字典和 `DEFAULT_CHARACTERS.skillIds` 中注册防御技能。

---

## Bug 3：防御技能不生效 🟡 部分确认

### 防御技能生效流程（正常路径）

**Step 1**：`authoritativeAdapter.ts:38-76` — `toSkill` 将防御技能转换为：
```typescript
{
  id: 'TA3',
  name: '防御',
  requiresHitRoll: false,
  targetType: 'self',
  effects: [{ type: 'damage_reduction_once', value: 0.5, duration: 99, name: '防御' }],
}
```

**Step 2**：`battle_engine.py:465-484` — `submit_action` 中的 fallback 处理：
```python
elif skill.get("effects"):
    for resolved_target in targets:
        applied_effects = [copy.deepcopy(effect) for effect in skill.get("effects", [])]
        resolved_target.setdefault("statuses", []).extend(applied_effects)
```
正确将 `damage_reduction_once` 状态添加到角色身上。

**Step 3**：`battle_engine.py:620-631` — 受到伤害时 `_apply_damage` 检查并消费状态：
```python
for status in target.get("statuses", []):
    if isinstance(status, dict) and status.get("type") == "damage_reduction_once":
        reduction_value = float(status.get("value", 0.5))
        reduction_multiplier *= max(0.0, 1.0 - reduction_value)
        consumed_statuses.append(copy.deepcopy(status))
```
**只在命中时消费**（miss 不会进入 `_apply_damage`），逻辑正确。

### 潜在失败方式

| 场景 | 原因 |
|---|---|
| 后端 `SKILLS` 中无防御技能 → `skill = None` | `battle_engine.py:383` 会抛 `ValueError("invalid skill")` |
| 后端 `DEFAULT_CHARACTERS` 直接使用时 | 角色 skillIds 不含 TA3/SE3 等，无法选防御 |
| 防御技能 ID 不存在于 actor.skillIds | `battle_engine.py:384` 检查失败 |

### 结论

通过正常战斗流程（前端适配器→权威后端），**防御技能应该生效**。但如果玩家遇到防御不生效的情况，最可能的原因是某个代码路径直接使用了后端的 `DEFAULT_CHARACTERS`，导致角色没有防御技能可用。

---

## Bug 4：骨柱湿地以后剧情 BGM 缺失 🔴 确认

### 根本原因

**Ending 场景（A/B/C/D）和 Complete 场景没有设置 `bgm` 属性**，且它们的 `setArea` 不匹配 `resolveBgmTrack` 中的任何回退模式，导致 BGM 返回空字符串。

### BGM 配置一览

| 场景 | setArea | bgm属性 | resolveBgmTrack结果 |
|---|---|---|---|
| boneInvestigation | 无光孢海·骨柱湿地 | ✅ 显式bgm | 正常 |
| bonePrebattle | 无光孢海·骨柱湿地伏击区 | ✅ `BGM`(fungalSea) | 正常 |
| boneAftermath 至 finalChoice | 含"孢海/堡垒/地心之门" | ✅ `BGM`(fungalSea) | 正常 |
| **endingA** | `地心之门·封印重启` | ❌ 无bgm | **→ 空字符串** |
| **endingB** | `地心之门·破裂门体` | ❌ 无bgm | **→ 空字符串** |
| **endingC** | `地心之门·稳定通道` | ❌ 无bgm | **→ 空字符串** |
| **endingD** | `地心之门·崩裂通道` | ❌ 无bgm | **→ 空字符串** |
| epilogue | `地下深海·黑暗之门彼端` | ❌ 无bgm | → bossBattle（碰巧匹配"黑暗之门"） |
| **complete** | `第一幕·完` | ❌ 无bgm | **→ 空字符串** |

### `resolveBgmTrack` 回退链（`App.tsx:164-187`）

```
优先: currentLine?.bgm          → 所有ending行都无
↓
区域名匹配:
  "静默神殿|教堂" → temple        → 不匹配  
  "冒险者公会|回声酒馆" → guildCompanions → 不匹配
  "黑市" → blackMarket            → 不匹配
  "孢海" → fungalSea              → ending不匹配
  "降渊缆梯" → elevatorDescent    → 不匹配
  "逆穹悬城" → inverseCity        → 不匹配
  "boss|Boss|首领|守护者|黑暗之门" → bossBattle → ending不匹配
↓
文本内容匹配 → ending面积太小
↓
return ''  ← ← endingA/B/C/D 和 complete 最终返回空字符串
```

### 修复方向

为所有 ending 场景和 complete 场景添加显式 `bgm` 属性。建议使用 `BGM`（fungalSea）或新建一个结局专用 BGM 音轨。

---

## 总结

| Bug | 严重度 | 状态 | 核心修复 |
|---|---|---|---|
| 结局C无法触发 | 🔴 致命 | 确认 | `resolveEnding` 中 `!helpedLaine + stabilize` → 返回endingC；移除 disabled 条件 |
| 三技能无防御 | 🔴 高 | 确认（后端缺失） | 后端 `SKILLS` + `DEFAULT_CHARACTERS` 注册防御技能 |
| 防御不生效 | 🟡 中 | 部分确认 | 正常路径可用，需确保不用 DEFAULT_CHARACTERS fallback |
| BGM缺失 | 🔴 高 | 确认 | Ending/Complete场景添加显式bgm |

---

*报告完毕。*
