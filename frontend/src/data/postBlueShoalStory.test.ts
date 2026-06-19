import { describe, expect, it } from 'vitest';
import { getEncounterConfigById } from './encounterFlows';
import { getScriptedScene } from './scriptedScenes';
import {
  getBoneMarshPrepActions,
  getGatekeeperPrepActions,
  getPostBlueShoalHintState,
  getPostBlueShoalHints,
  POST_BLUE_SHOAL_IDS,
  resolvePostBlueShoalAction,
} from './postBlueShoalStory';

describe('expanded post-blue-shoal story', () => {
  it('registers every story, battle transition, ending and epilogue scene', () => {
    const ids = [
      ...Object.values(POST_BLUE_SHOAL_IDS),
      'ending-failure-gate-opens',
    ];
    ids.forEach((id) => expect(getScriptedScene(id), id).toBeTruthy());
    expect(getEncounterConfigById('bone-pillar-wetland')?.introSceneId).toBe(POST_BLUE_SHOAL_IDS.bonePrebattle);
    expect(getEncounterConfigById('boss-gatekeeper')?.introSceneId).toBe(POST_BLUE_SHOAL_IDS.bossPrebattle);
    expect(getEncounterConfigById('boss-gatekeeper')?.afterSceneId).toBe(POST_BLUE_SHOAL_IDS.afterBoss);
    expect(getScriptedScene('after-battle-blue-shoal')).toBeNull();
  });

  it('enforces investigation action limits without blocking the main route', () => {
    const initial = { currentNodeId: POST_BLUE_SHOAL_IDS.aftermath, blueShoalInvestigationActions: 0 };
    expect(getPostBlueShoalHints(initial)).toContain('离开蓝伞浅滩，继续向骨柱湿地前进');
    const ready = { ...initial, blueShoalInvestigationActions: 2 };
    expect(getPostBlueShoalHints(ready)).toContain('离开蓝伞浅滩，继续向骨柱湿地前进');
    const exit = resolvePostBlueShoalAction(ready, '离开蓝伞浅滩，继续向骨柱湿地前进');
    expect(exit?.nextSceneId).toBe(POST_BLUE_SHOAL_IDS.route);
    expect(exit?.skipAiNarration).toBe(true);
  });

  it('keeps completed investigation actions visible so the UI can disable them', () => {
    const state = {
      currentNodeId: POST_BLUE_SHOAL_IDS.aftermath,
      blueShoalInvestigationActions: 2,
      postAction_inspect_severed_black_cable: true,
    };
    expect(getPostBlueShoalHints(state)).toContain('检查被人为切断的黑缆残片【观察DC10】');
    expect(getPostBlueShoalHintState(state, '检查被人为切断的黑缆残片【观察DC10】')).toEqual({
      disabled: true,
      reason: '已完成',
    });
    expect(getPostBlueShoalHintState(
      { currentNodeId: POST_BLUE_SHOAL_IDS.aftermath, blueShoalInvestigationActions: 1 },
      '离开蓝伞浅滩，继续向骨柱湿地前进',
    ).disabled).toBe(true);
    expect(getPostBlueShoalHintState(state, '离开蓝伞浅滩，继续向骨柱湿地前进').disabled).toBe(false);
  });

  it('awards local state from the locked final roll', () => {
    const state = {
      currentNodeId: POST_BLUE_SHOAL_IDS.aftermath,
      blueShoalInvestigationActions: 0,
      inventory: '',
      lastStoryCheckResult: { dc: 12, finalRoll: { d20: 20, total: 24, success: true } },
    };
    const resolved = resolvePostBlueShoalAction(state, '检查孢兽尸体，判断它们为何聚集【生态DC12】');
    expect(resolved?.patch.inventory).toContain('活性孢子样本');
    expect(resolved?.patch.inventory).toContain('黑根碎片');
    expect(resolved?.patch.clue_spores_follow_seal_pulse).toBe(true);
    expect(resolved?.patch.blueShoalInvestigationActions).toBe(1);
  });

  it('does not reuse the previous dice result for an unchecked companion action', () => {
    const resolved = resolvePostBlueShoalAction({
      currentNodeId: POST_BLUE_SHOAL_IDS.aftermath,
      blueShoalInvestigationActions: 0,
      lastStoryCheckResult: { dc: 18, finalRoll: { d20: 2, total: 3, success: false } },
    }, '询问伙伴对异常的判断');

    expect(resolved?.lines[0]).toContain('瑟琳确认脉冲逆向泄出');
    expect(resolved?.lines.join('\n')).not.toContain('检定失败');
  });

  it('uses one-shot managed battle prep choices and filters boss options by rewards', () => {
    expect(getBoneMarshPrepActions()).toHaveLength(5);
    expect(getGatekeeperPrepActions({ inventory: '', se_trust: 0 }).map((choice) => choice.id)).toEqual(['pre_gatekeeper_break_black_root']);
    const unlocked = getGatekeeperPrepActions({
      inventory: '黑石调律叉,净化黑石核心,逆钟粉笔',
      gatekeeper_true_name_known: true,
      reverse_clock_method_known: true,
      reverse_clock_anchor_ready: true,
      laine_memory_anchor_obtained: true,
      laine_full_testimony_obtained: true,
      documents: [{ id: 'doc_laine_full_testimony' }],
    }).map((choice) => choice.id);
    expect(unlocked).toContain('pre_gatekeeper_tuning_fork');
    expect(unlocked).toContain('pre_gatekeeper_true_name');
    expect(unlocked).toContain('pre_gatekeeper_purified_core');
    expect(unlocked).toContain('pre_gatekeeper_reverse_clock_anchor');
    const laineActions = getGatekeeperPrepActions({
      laine_alive: true,
      laine_stabilized: true,
      laine_full_testimony_obtained: true,
      reverse_clock_method_known: true,
      inventory: '莱因的黑缆识别牌',
    }).map((choice) => choice.id);
    expect(laineActions).toContain('laine_call_gatekeeper');
    expect(laineActions).toContain('use_laine_badge_override');
    expect(laineActions).toContain('use_laine_memory_anchor');
  });

  it('requires Yunling purification heart to save Laine and unlock his testimony route', () => {
    const campExit = resolvePostBlueShoalAction({
      currentNodeId: POST_BLUE_SHOAL_IDS.camp,
      expeditionCampActions: 3,
    }, '结束营地调查，检查岩棚里的金属声');
    expect(campExit?.nextSceneId).toBe(POST_BLUE_SHOAL_IDS.laineSurvivor);
    expect(campExit?.patch.laine_alive).toBe(true);

    const withoutHeart = {
      ...campExit?.patch,
      currentNodeId: POST_BLUE_SHOAL_IDS.laineSurvivor,
    };
    expect(getPostBlueShoalHints(withoutHeart)).toEqual([
      '使用云苓的净化之心解救莱因',
      '不救莱因，继续前进',
    ]);
    expect(getPostBlueShoalHintState(
      withoutHeart,
      '使用云苓的净化之心解救莱因',
    )).toEqual({
      disabled: true,
      reason: '需要先在云苓商店购买并持有净化之心',
    });
    const leave = resolvePostBlueShoalAction(
      withoutHeart,
      '不救莱因，继续前进',
    );
    expect(leave).toMatchObject({
      nextSceneId: POST_BLUE_SHOAL_IDS.campNight,
      skipAiNarration: true,
      patch: { laine_left_behind: true, core_purification_known: false },
    });

    const withHeart = {
      ...campExit?.patch,
      currentNodeId: POST_BLUE_SHOAL_IDS.laineSurvivor,
      inventory: '长剑,净化之心',
      purification_heart_owned: true,
    };
    expect(getPostBlueShoalHints(withHeart)).toContain('使用云苓的净化之心解救莱因');
    const saved = resolvePostBlueShoalAction(withHeart, '使用云苓的净化之心解救莱因');
    expect(saved).toMatchObject({
      nextSceneId: POST_BLUE_SHOAL_IDS.laineDecision,
      skipAiNarration: true,
      patch: {
        purification_heart_used_on_laine: true,
        laine_stabilized: true,
        core_purification_known: true,
      },
    });
    expect(saved?.patch.inventory).not.toContain('净化之心');
    expect(getPostBlueShoalHints({
      currentNodeId: POST_BLUE_SHOAL_IDS.fortressInner,
    })?.join('\n')).not.toContain('净化一枚被污染的黑石核心');
    expect(getPostBlueShoalHints({
      currentNodeId: POST_BLUE_SHOAL_IDS.fortressInner,
      purification_heart_used_on_laine: true,
      core_purification_known: true,
    })?.join('\n')).toContain('净化一枚被污染的黑石核心');
  });

  it('allows core stabilization only after saving Laine with purification heart', () => {
    const base = {
      currentNodeId: POST_BLUE_SHOAL_IDS.finalChoice,
      truthScore: 0,
      mercyScore: 0,
      sealScore: 0,
      reverseClockScore: 0,
    };
    expect(getPostBlueShoalHints(base)).toEqual(['稳定 Boss 核心', '破坏 Boss 核心']);
    expect(getPostBlueShoalHintState(base, '稳定 Boss 核心')).toEqual({
      disabled: true,
      reason: '必须先用净化之心救下莱因，并从证词中得知核心可以被净化',
    });

    const endingA = resolvePostBlueShoalAction(
      {
        ...base,
        laine_alive: true,
        laine_stabilized: true,
        laine_left_behind: false,
        purification_heart_used_on_laine: true,
        core_purification_known: true,
      },
      '稳定 Boss 核心',
    );
    expect(getPostBlueShoalHints({
      ...base,
      laine_alive: true,
      laine_stabilized: true,
      laine_left_behind: false,
      purification_heart_used_on_laine: true,
      core_purification_known: true,
    })).toEqual(['稳定 Boss 核心', '破坏 Boss 核心']);
    const endingB = resolvePostBlueShoalAction(
      {
        ...base,
        laine_alive: true,
        laine_stabilized: true,
        laine_left_behind: false,
        purification_heart_used_on_laine: true,
        core_purification_known: true,
      },
      '破坏 Boss 核心',
    );
    const blockedStabilize = resolvePostBlueShoalAction(
      { ...base, laine_alive: true, laine_left_behind: true },
      '稳定 Boss 核心',
    );
    const endingD = resolvePostBlueShoalAction(
      { ...base, laine_alive: false, laine_mercy_killed: true },
      '破坏 Boss 核心',
    );

    expect(endingA).toMatchObject({ nextSceneId: POST_BLUE_SHOAL_IDS.endingA, skipAiNarration: true });
    expect(endingB).toMatchObject({ nextSceneId: POST_BLUE_SHOAL_IDS.endingB, skipAiNarration: true });
    expect(blockedStabilize).toMatchObject({ nextSceneId: POST_BLUE_SHOAL_IDS.endingD, skipAiNarration: true });
    expect(endingD).toMatchObject({ nextSceneId: POST_BLUE_SHOAL_IDS.endingD, skipAiNarration: true });
  });

  it('plays the core CG, ending CG, ocean reveal and final summary in order', () => {
    expect(getScriptedScene(POST_BLUE_SHOAL_IDS.endingA)?.lines.map((line) => line.bgImage)).toEqual([
      '/assets/CG/cg05.png', '/assets/CG/cg01.png', '/assets/CG/cg01.png',
    ]);
    expect(getScriptedScene(POST_BLUE_SHOAL_IDS.endingB)?.lines.map((line) => line.bgImage)).toEqual([
      '/assets/CG/cg06.png', '/assets/CG/cg02.png', '/assets/CG/cg02.png',
    ]);
    expect(getScriptedScene(POST_BLUE_SHOAL_IDS.endingC)?.lines.map((line) => line.bgImage)).toEqual([
      '/assets/CG/cg05.png', '/assets/CG/cg03.png', '/assets/CG/cg03.png',
    ]);
    expect(getScriptedScene(POST_BLUE_SHOAL_IDS.endingD)?.lines.map((line) => line.bgImage)).toEqual([
      '/assets/CG/cg06.png', '/assets/CG/cg04.png', '/assets/CG/cg04.png',
    ]);
    expect(getScriptedScene(POST_BLUE_SHOAL_IDS.epilogue)?.bgImage).toBe('/assets/scenes/15underground-ocean-reveal.webp');

    const ocean = resolvePostBlueShoalAction(
      { currentNodeId: POST_BLUE_SHOAL_IDS.endingA },
      '穿过黑暗之门',
    );
    const complete = resolvePostBlueShoalAction(
      { currentNodeId: POST_BLUE_SHOAL_IDS.epilogue },
      '结束第一幕',
    );
    expect(ocean?.nextSceneId).toBe(POST_BLUE_SHOAL_IDS.epilogue);
    expect(complete?.nextSceneId).toBe(POST_BLUE_SHOAL_IDS.complete);
  });
});
