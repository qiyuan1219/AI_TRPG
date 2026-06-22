import { describe, expect, it } from 'vitest';
import { isContractSignatureValid, normalizeContractSignature } from './contractSignature';

describe('contract signature', () => {
  it('accepts the registered player name after harmless whitespace normalization', () => {
    expect(isContractSignatureValid('  艾琳娜  ', '艾琳娜')).toBe(true);
    expect(normalizeContractSignature('A   B')).toBe('A B');
  });

  it('rejects a different or empty name', () => {
    expect(isContractSignatureValid('冒险者', '艾琳娜')).toBe(false);
    expect(isContractSignatureValid('', '艾琳娜')).toBe(false);
    expect(isContractSignatureValid('艾琳娜', '')).toBe(false);
  });
});
