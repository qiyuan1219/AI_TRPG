import { describe, expect, it } from 'vitest';
import { clearContentPacksForTest, getContentPack, registerContentPack } from './contentRegistry';
import { validateContentPack } from './validateContentPack';
import { BASE_CONTENT_PACK } from '../packs/base/index';

describe('ContentPack registry', () => {
  it('validates and registers the base content pack', () => {
    clearContentPacksForTest();
    expect(validateContentPack(BASE_CONTENT_PACK).valid).toBe(true);
    registerContentPack(BASE_CONTENT_PACK);
    expect(getContentPack('base')?.version).toBe('1.0.0');
  });
});
