# P0 架构迁移说明

## 当前权威链路

```text
BattleTestScreen
  -> GameAction(battle.skill)
  -> frontend ActionResolver
  -> POST /api/battles/{battleId}/actions
  -> BattleEngine
  -> BattleEvent + updatedBattleState
  -> SQLite battle_sessions + GameState.battle
  -> 原战斗 UI / 骰子动画 / KP 叙述
```

前端不再为实际战斗生成命中骰、伤害骰，不再修改战斗 HP，也不再自行推进权威回合。旧计算辅助函数暂留在组件文件中作为迁移期死代码，不在实际调用链上；后续可在 UI 拆分时物理删除。

## Canonical GameState v2

新状态包含 `session/story/player/party/battle/inventoryState/quests/flags/logs`。为避免一次性破坏现有脚本，旧扁平字段暂时保留；所有读取与写入存档都会经过 `migrate_game_state()`。`inventoryState` 是规范库存，旧 `inventory` 字符串仅作为兼容投影。

## Patch 权限

- AI 只能提出候选补丁；`validate_patch()` 拒绝 AI 修改金币、库存、玩家/同伴 HP、信任和战斗状态。
- 既有脚本 UI 仍通过兼容适配器提交补丁，但同样经过路径合法性校验。
- 战斗数值只由 `BattleEngine` 产生并持久化。

## 存档与恢复

每次战斗开始和动作完成都会保存 `battleState/actionLog/eventLog/diceLog/rngSeed/rngCursor`。手动存档包含同一战斗快照；读档会把快照恢复到 `battle_sessions`，刷新页面或重启服务后可按 `gameId + encounterId` 继续。

## 回滚点

若需临时回滚前端切流，只回滚 `BattleTestScreen.tsx`、`core/battle` 与 `core/actions/battleResolver.ts` 即可；GameState v2 和 SQLite 新表均为向后兼容的增量结构，不需要删除数据库字段。不要删除旧扁平字段，直至剧情、物品和商店均迁移到 ActionResolver。
