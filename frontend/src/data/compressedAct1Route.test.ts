import { describe, expect, it } from 'vitest';
import { getEncounterConfigById } from './encounterFlows';
import { getScriptedScene } from './scriptedScenes';

const PRE_REVEAL_SCENES = [
  'act1-blue-shoal-aftermath-compressed',
  'act1-black-root-entrance',
  'act1-lain-survivor-event',
  'act1-black-root-rest-serin-crack',
  'act1-boss-core-choice',
];

describe('compressed act 1 route data', () => {
  it('routes blue shoal and boss victories into the compressed ending flow', () => {
    expect(getEncounterConfigById('blue-shoal')?.afterSceneId).toBe('act1-blue-shoal-aftermath-compressed');
    expect(getEncounterConfigById('boss-gatekeeper')?.afterSceneId).toBe('act1-boss-core-choice');
  });

  it('uses the dedicated one-shot battle prep choices at blue shoal', () => {
    const scene = getScriptedScene('enter-blue-shoal');
    expect(scene?.hints).toEqual([]);
    expect(scene?.battlePrep?.map((choice) => choice.id)).toEqual([
      'blue-shoal-prep-ignore-voices',
      'blue-shoal-prep-find-core',
      'blue-shoal-prep-avoid-bulges',
      'blue-shoal-prep-mask',
    ]);
    expect(scene?.battlePrep?.map((choice) => choice.label)).toEqual([
      '保持沉默，识破拟声诱导【观察/奥秘DC14】',
      '用符文灯寻找拟声菌团核心【观察/奥秘DC15】',
      '听从布洛克指挥，避开菌毯鼓包【生存/感知DC13】',
      '整理抗孢面罩，压低呼吸【体质DC10】',
    ]);
  });

  it('contains every required playable scene', () => {
    const ids = [
      ...PRE_REVEAL_SCENES,
      'act1-ending-guardian-remains',
      'act1-ending-wounded-through-gate',
      'act1-ending-cold-expedition',
      'act1-ending-gate-split-open',
      'act1-ending-ocean-reveal',
      'act1-game-complete',
      'act1-bad-ending-time-reset',
    ];
    ids.forEach((id) => expect(getScriptedScene(id), id).toBeTruthy());
  });

  it('does not reveal the underground ocean before its dedicated scene', () => {
    PRE_REVEAL_SCENES.forEach((id) => {
      const text = getScriptedScene(id)?.lines.map((line) => line.text).join('\n') || '';
      expect(text, id).not.toMatch(/地下海洋|海风|海浪|海声|盐味/);
    });
  });
});
