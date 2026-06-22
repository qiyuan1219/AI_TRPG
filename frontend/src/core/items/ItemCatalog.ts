import { shopItems } from '../../data/shopItems';
import type { ItemDefinition } from './ItemTypes';

const CORE_ITEMS: ItemDefinition[] = [
  { catalogId: 'fiction_dice', name: '虚构骰子', aliases: ['fiction-dice'], type: 'consumable', description: '可用于骰子判定重投一次 D20，取较高总值。', icon: 'fiction-dice', rarity: 'rare', stackable: true, effects: [{ type: 'reroll', rerollType: 'fiction_dice' }] },
  { catalogId: 'omni_dice', name: '万能骰子', aliases: ['omni-dice'], type: 'consumable', description: '可用于骰子判定重投，并指定合法骰面点数。', icon: 'omni-dice', rarity: 'rare', stackable: true, effects: [{ type: 'reroll', rerollType: 'omni_dice' }] },
  { catalogId: 'healing_potion', name: '治疗药水', aliases: ['小红瓶', '回血'], type: 'consumable', description: '普通冒险者常备的红色药剂。', icon: 'potion-red', rarity: 'common', stackable: true, effects: [{ type: 'heal', formula: '1d12' }] },
  { catalogId: 'small_healing_potion', name: '小瓶治疗药水', aliases: ['小瓶治疗液'], type: 'consumable', description: '容量较小的应急治疗药剂。', icon: 'small_bottle_therapeutic_solution', rarity: 'common', stackable: true, effects: [{ type: 'heal', formula: '1d6' }] },
  { catalogId: 'coagulation_powder', name: '止血粉', type: 'consumable', description: '用于处理流血与浅层创口。', icon: 'powder', rarity: 'common', stackable: true },
  { catalogId: 'antitoxin', name: '解毒剂', aliases: ['弱效解毒剂'], type: 'consumable', description: '缓解常见毒素与孢粉刺激。', icon: 'vial-green', rarity: 'common', stackable: true },
  { catalogId: 'purification_heart', name: '净化之心', type: 'consumable', description: '用于压制深层污染的高阶药剂。', icon: 'heart-vial', rarity: 'rare', stackable: false },
  { catalogId: 'longsword', name: '长剑', type: 'equipment', description: '可靠的近战武器。', icon: 'sword', rarity: 'common', stackable: false, metadata: { equipSlot: 'weapon' } },
  { catalogId: 'adventurer_kit', name: '冒险者工具包', type: 'quest', description: '基础野外工具。', icon: 'backpack', rarity: 'common', stackable: false },
  { catalogId: 'spore_mask', name: '抗孢面罩', type: 'quest', description: '深入孢海时过滤孢粉的制式面罩。', icon: 'spore-mask', rarity: 'uncommon', stackable: false },
  { catalogId: 'cold_lamp', name: '冷光灯', aliases: ['冷光棒'], type: 'quest', description: '不会引燃孢粉的冷光照明工具。', icon: 'cold_light_stick', rarity: 'common', stackable: true },
  { catalogId: 'elevator_safety_hook', name: '缆梯安全扣', type: 'quest', description: '降渊缆梯通行安全扣具。', icon: 'cable-clip', rarity: 'common', stackable: false },
  { catalogId: 'guild_supply_crate', name: '公会补给箱', type: 'quest', description: '公会签发的远征基础补给。', icon: 'supply-crate', rarity: 'story', stackable: false },
  { catalogId: 'diamond', name: '钻石', aliases: ['干净的钻石'], type: 'material', description: '贵重宝石。', icon: 'diamond', rarity: 'rare', stackable: true },
  { catalogId: 'guild_badge', name: '公会徽记', type: 'quest', description: '冒险者公会认证身份徽记。', icon: 'badge', rarity: 'story', stackable: false },
  { catalogId: 'gold', name: '金币', aliases: ['G', 'GP'], type: 'currency', description: '逆穹城通用货币。', icon: 'coin', rarity: 'common', stackable: true },
  { catalogId: 'third_expedition_report', name: '第三远征队失联报告', type: 'document', description: '记录第三远征队失联情况。', icon: 'scroll-sealed', rarity: 'story', stackable: false },
  { catalogId: 'missing_expedition_registry', name: '失踪远征队登记册', type: 'document', description: '公会登记的失踪远征队名单。', icon: 'scroll-list', rarity: 'story', stackable: false },
  { catalogId: 'third_patrol_record', name: '第三巡逻队记录', type: 'document', description: '第三巡逻队的行动记录。', icon: 'scroll-log', rarity: 'story', stackable: false },
  { catalogId: 'wounded_purification_report', name: '伤员净化报告', type: 'document', description: '伤员污染与净化记录。', icon: 'scroll-medicine', rarity: 'story', stackable: false },
  { catalogId: 'blue_umbrella_spore_powder', name: '蓝伞孢粉', aliases: ['稀释蓝伞孢粉'], type: 'material', description: '从蓝伞浅滩孢兽残骸中收集的净化孢粉，能暂时压制黑根污染。', icon: 'spore-powder', rarity: 'story', stackable: true },
  { catalogId: 'guardian_protocol_page', name: '守门者协议残页', type: 'document', description: '记录黑石门卫并非处刑装置，而是封印系统最后执行者的残页。', icon: 'scroll-sealed', rarity: 'story', stackable: false },
  { catalogId: 'guardian_true_name_rubbing', name: '门卫真名拓片', type: 'document', description: '从黑石门廊拓下的古名：格朗-赫尔。', icon: 'note-pencil', rarity: 'story', stackable: false },
  { catalogId: 'black_root_sample', name: '黑根样本', type: 'material', description: '从封印裂缝旁剥离的黑色根丝，是斩断黑根路线的关键证据。', icon: 'black-obelisk-shard', rarity: 'story', stackable: true },
  { catalogId: 'laine_memory_anchor', name: '莱因的记忆锚点', aliases: ['莱因的记忆残片'], type: 'quest', description: '莱因残存记忆中最稳定的一段，可作为逆钟锚定材料。', icon: 'clue', rarity: 'story', stackable: false },
  { catalogId: 'kaiya_code_note', name: '凯娅的暗号', aliases: ['黑市暗号纸条'], type: 'quest', description: '写有“断缆不问来路”的暗号纸条。', icon: 'note-pin', rarity: 'story', stackable: false },
  { catalogId: 'yunling_charm', name: '云苓的护身符', type: 'quest', description: '封着蓝色菌叶和白枝烛芯的护身符。', icon: 'yunling-charm', rarity: 'story', stackable: false },
  { catalogId: 'fortress_emblem', name: '远征要塞徽记', type: 'quest', description: '刻有通往黑石根区旧路的要塞徽记。', icon: 'fortress-emblem', rarity: 'story', stackable: false },
  { catalogId: 'lain_dogtag', name: '莱因的身份牌', type: 'quest', description: '黑石根区幸存者莱因的身份标识。', icon: 'lain-dogtag', rarity: 'story', stackable: false },
  { catalogId: 'item_laine_black_cable_badge', name: '莱因的黑缆识别牌', aliases: ['莱因黑缆识别牌'], type: 'quest', description: '刻有堡垒维护口令的半损坏识别牌，可用于门禁、协议覆盖和逆钟锚定。', icon: 'lain-dogtag', rarity: 'story', stackable: false },
  { catalogId: 'item_laine_black_cable_badge_damaged', name: '损坏的莱因黑缆识别牌', type: 'quest', description: '被孢丝和黑根残响侵蚀的识别牌，仍保留部分门禁权限。', icon: 'lain-dogtag', rarity: 'rare', stackable: false },
  { catalogId: 'item_laine_bloodstained_gauntlet', name: '莱因的染血护手', type: 'quest', description: '保留莱因失控前记忆残响的护手，可作为逆钟锚点替代材料。', icon: 'badge', rarity: 'story', stackable: false },
  { catalogId: 'item_laine_memory_splinter', name: '莱因的记忆残片', type: 'quest', description: '从严重孢化的记忆回声中保存下来的碎片。', icon: 'black-obelisk-shard', rarity: 'story', stackable: false },
  { catalogId: 'item_fortress_entry_map_laine_marked', name: '莱因标记的堡垒路线图', type: 'quest', description: '标出维护井、调律室和封印大厅侧门的内部路线图。', icon: 'map-folded', rarity: 'story', stackable: false },
  { catalogId: 'black_obelisk_shard', name: '黑色方尖碑碎片', type: 'quest', description: '与黑石脉冲同步发光的封印碎片。', icon: 'black-obelisk-shard', rarity: 'story', stackable: false },
  { catalogId: 'silver_staff_charm', name: '银杖护符', type: 'quest', description: '瑟琳从裂开的银杖上取下的信任之证。', icon: 'silver-staff-charm', rarity: 'story', stackable: false },
  { catalogId: 'active_spore_sample', name: '活性孢子样本', type: 'material', description: '从异常孢群中安全封存的活性样本，可用于研究与净化。', icon: 'spore-sample', rarity: 'uncommon', stackable: true },
  { catalogId: 'unstable_spore_sample', name: '不稳定孢子样本', type: 'material', description: '结构已经开始崩坏的孢子样本，研究价值有限。', icon: 'spore-sample', rarity: 'common', stackable: true },
  { catalogId: 'black_root_fragment', name: '黑根碎片', type: 'quest', description: '随封印脉冲收缩的污染黑根碎片，可用于辨认中继结构。', icon: 'black-obelisk-shard', rarity: 'rare', stackable: true },
  { catalogId: 'blue_cap_fungus', name: '蓝伞菌盖', type: 'consumable', description: '未被污染的蓝伞菌盖，可缓解轻度孢毒并辅助净化。', icon: 'spore-sample', rarity: 'uncommon', stackable: true },
  { catalogId: 'black_cable_badge', name: '黑缆守卫徽章', aliases: ['破损黑缆守卫徽章'], type: 'quest', description: '黑缆守卫的身份徽章，旧堡垒门禁仍可能识别。', icon: 'badge', rarity: 'story', stackable: false },
  { catalogId: 'teal_spore_crystal', name: '青蓝孢晶', type: 'material', description: '被黑石脉冲影响后结晶的孢质。', icon: 'diamond', rarity: 'rare', stackable: true },
  { catalogId: 'fortress_badge_fragment', name: '堡垒徽章残片', type: 'quest', description: '矮人排水渠中找到的旧堡垒徽章残片。', icon: 'fortress-emblem', rarity: 'uncommon', stackable: false },
  { catalogId: 'mithril_cable_fiber', name: '秘银缆丝', type: 'material', description: '从断裂主缆上取下的秘银纤维，韧性依旧惊人。', icon: 'cable-clip', rarity: 'rare', stackable: true },
  { catalogId: 'bone_spore_core', name: '骨孢核心', type: 'quest', description: '骨柱孢兽留下的核心，仍残留拟声群落的节律。', icon: 'black-obelisk-shard', rarity: 'rare', stackable: false },
  { catalogId: 'commander_seal', name: '远征队长私印', type: 'quest', description: '第三远征队队长的私人印章，证明日志来源无误。', icon: 'badge', rarity: 'story', stackable: false },
  { catalogId: 'white_branch_candle_core', name: '白枝烛芯', type: 'quest', description: '白枝修会用于稳定意识污染的仪式材料。', icon: 'yunling-charm', rarity: 'rare', stackable: true },
  { catalogId: 'fortress_entry_map', name: '地底堡垒入口残图', aliases: ['破损地底堡垒入口残图'], type: 'quest', description: '标有堡垒外环、维护井和封印控制大厅的残缺地图。', icon: 'map-folded', rarity: 'story', stackable: false },
  { catalogId: 'underground_fortress_emblem', name: '地底堡垒徽章', type: 'quest', description: '封蜡锁箱中保存的堡垒维护徽章。', icon: 'fortress-emblem', rarity: 'story', stackable: false },
  { catalogId: 'blackstone_tuning_fork', name: '黑石调律叉', aliases: ['破损黑石调律叉'], type: 'quest', description: '用于校准封印脉冲的古代调律工具。', icon: 'silver-staff-charm', rarity: 'rare', stackable: false },
  { catalogId: 'eileen_thread_charm', name: '艾琳的白线护符', type: 'quest', description: '艾琳在营地夜火旁编成的护符，可稳定恐惧中的意识。', icon: 'yunling-charm', rarity: 'story', stackable: false },
  { catalogId: 'brock_spore_filter', name: '布洛克孢子滤片', type: 'quest', description: '布洛克用活性样本制作的滤片，可提高孢毒抗性。', icon: 'spore-mask', rarity: 'rare', stackable: false },
  { catalogId: 'kaiya_spare_lockpick', name: '凯娅的备用锁针', type: 'quest', description: '凯娅交给你的备用锁针，可辅助一次机关或开锁行动。', icon: 'cable-clip', rarity: 'rare', stackable: false },
  { catalogId: 'reverse_clock_chalk', name: '逆钟粉笔', type: 'quest', description: '瑟琳配制的银色粉笔，用于绘制逆钟锚定阵。', icon: 'silver-staff-charm', rarity: 'story', stackable: false },
  { catalogId: 'old_fortress_supply', name: '旧堡垒补给', type: 'consumable', description: '维护井暗格中保存完好的应急补给。', icon: 'supply-crate', rarity: 'uncommon', stackable: true },
  { catalogId: 'fortress_side_key', name: '堡垒侧门钥匙', type: 'quest', description: '可以无声开启部分堡垒内环侧门的旧钥匙。', icon: 'cable-clip', rarity: 'rare', stackable: false },
  { catalogId: 'rune_guard_plate', name: '符文护板', type: 'equipment', description: '古代封印战争留下的护板，可承受一次强烈脉冲。', icon: 'badge', rarity: 'rare', stackable: false, metadata: { equipSlot: 'armor' } },
  { catalogId: 'blackstone_bolt', name: '黑石弩矢', type: 'consumable', description: '能短暂破坏黑石护盾结构的特制弩矢。', icon: 'black-obelisk-shard', rarity: 'rare', stackable: true },
  { catalogId: 'old_healing_kit', name: '旧式治疗包', type: 'consumable', description: '堡垒军械库封存的制式治疗包。', icon: 'backpack', rarity: 'uncommon', stackable: true },
  { catalogId: 'unstable_seal_flare', name: '不稳定封印照明弹', type: 'consumable', description: '老化的封印照明弹，仍能短暂干扰黑石目标。', icon: 'cold_light_stick', rarity: 'uncommon', stackable: true },
  { catalogId: 'purified_blackstone_core', name: '净化黑石核心', type: 'quest', description: '经白枝烛芯与蓝伞菌盖稳定的核心，是修复守门者的关键材料。', icon: 'purification-heart', rarity: 'story', stackable: false },
  { catalogId: 'unstable_purified_core', name: '不稳定净化核心', type: 'quest', description: '净化反应尚未完全稳定的黑石核心，使用时伴随风险。', icon: 'purification-heart', rarity: 'rare', stackable: false },
  { catalogId: 'guardian_oath_shard', name: '守门者誓约碎片', type: 'quest', description: '阿格洛恩重新想起职责时脱落的誓约碎片。', icon: 'black-obelisk-shard', rarity: 'story', stackable: false },
  { catalogId: 'cracked_gatekeeper_core', name: '裂纹守门者核心', type: 'quest', description: '斩断黑根后留下的门卫核心残片。', icon: 'black-obelisk-shard', rarity: 'story', stackable: false },
  { catalogId: 'reverse_clock_anchor_shard', name: '逆钟锚点碎片', type: 'quest', description: '从被延长的封印瞬间中析出的银色碎片。', icon: 'silver-staff-charm', rarity: 'story', stackable: false },
  { catalogId: 'silent_gate_report', name: '寂静之门报告', type: 'quest', description: '记录强制暂封真相、等待下一次远征开启的密封报告。', icon: 'scroll-sealed', rarity: 'story', stackable: false },
  { catalogId: 'helman_personal_note', name: '赫尔曼的抽屉笔记', type: 'document', description: '一张从赫尔曼私人抽屉夹层中找到的便签，字迹潦草而急促。', icon: 'note-pencil', rarity: 'rare', stackable: false },
  { catalogId: 'commission_letter_detail', name: '指名委托书原件', type: 'document', description: '三个月前送达的指名委托书，羊皮纸边缘略微发黄。', icon: 'scroll-quill', rarity: 'common', stackable: false },
  { catalogId: 'salo_intel_notes', name: '萨洛的情报卡片', type: 'document', description: '几张用细绳捆在一起的情报卡片，每条情报写在一张扑克牌大小的硬纸片上。', icon: 'cards', rarity: 'uncommon', stackable: false },
  { catalogId: 'tavern_rumor_board', name: '酒馆传闻便条', type: 'document', description: '钉在酒馆布告栏角落的几张便条，写着矿工和守卫的零星见闻。', icon: 'note-pin', rarity: 'common', stackable: false },
  { catalogId: 'nibu_patrol_journal', name: '尼布的巡逻日志', type: 'document', description: '孢海据点守夜人尼布的皮面日志，记录了最近几周的据点周边巡逻情况。', icon: 'journal', rarity: 'common', stackable: false },
  { catalogId: 'yunling_expedition_medicine_record', name: '远征队用药记录', type: 'document', description: '云苓保存的一份用药记录，追踪了每一支远征队的药剂需求变化。', icon: 'scroll-medicine', rarity: 'uncommon', stackable: false },
];

const SHOP_CATALOG: ItemDefinition[] = shopItems.map((item) => ({
  catalogId: item.id,
  name: item.name,
  aliases: item.aliases,
  type: 'consumable',
  description: item.desc,
  icon: item.icon,
  rarity: item.type === 'rare' ? 'rare' : 'common',
  stackable: item.repeatable,
}));

export const ITEM_CATALOG = new Map(
  [...SHOP_CATALOG, ...CORE_ITEMS].map((item) => [item.catalogId, item] as const),
);

const ALIASES = new Map<string, string>();
ITEM_CATALOG.forEach((item) => {
  [item.catalogId, item.name, ...(item.aliases || [])].forEach((alias) => ALIASES.set(alias.trim().toLowerCase(), item.catalogId));
});

export function resolveCatalogId(value: string): string {
  return ALIASES.get(String(value || '').trim().toLowerCase()) || 'legacy_unknown';
}

export function getItemDefinition(value: string): ItemDefinition | undefined {
  const id = ITEM_CATALOG.has(value) ? value : resolveCatalogId(value);
  return ITEM_CATALOG.get(id);
}

export function getLegacyInventoryDefinition(name: string) {
  const item = getItemDefinition(name);
  if (!item) return undefined;
  const category = item.type === 'consumable' ? 'consumable'
    : item.type === 'equipment' ? 'equipment'
      : item.type === 'document' ? 'archive'
        : item.type === 'clue' ? 'clue' : 'key_item';
  return {
    id: item.catalogId,
    type: item.type === 'quest' || item.type === 'material' || item.type === 'currency' ? 'key_item' : item.type,
    category,
    icon: item.icon,
    rarity: item.rarity === 'story' ? 'quest' : item.rarity,
    summary: item.description,
    effectText: item.effects?.map((effect) => effect.type === 'heal' ? `恢复 ${effect.formula} 点生命值。` : '可用于剧情判定重投。').join(''),
    stackable: item.stackable,
    equipSlot: item.metadata?.equipSlot,
  };
}
