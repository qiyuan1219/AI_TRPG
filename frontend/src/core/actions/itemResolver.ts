import { getItemDefinition } from '../items/ItemCatalog';
import { registerActionResolver } from './registry';

registerActionResolver('item.use', (state, action) => {
  const definition = getItemDefinition(action.itemId);
  if (!definition) {
    return {
      schemaVersion: 1,
      accepted: false,
      actionId: action.id,
      events: [],
      patches: [],
      errors: [`未登记物品：${action.itemId}`],
      needsNarration: false,
    };
  }

  const heal = definition.effects?.find((effect) => effect.type === 'heal');
  if (heal?.type === 'heal') {
    return {
      schemaVersion: 1,
      accepted: true,
      actionId: action.id,
      events: [{ type: 'item.used', catalogId: definition.catalogId, effect: heal }],
      patches: [],
      errors: [],
      needsNarration: true,
      metadata: { effectRequiresRulesRoll: heal.formula },
    };
  }

  return {
    schemaVersion: 1,
    accepted: true,
    actionId: action.id,
    events: [{ type: 'item.used', catalogId: definition.catalogId }],
    patches: [],
    errors: [],
    needsNarration: true,
  };
});
