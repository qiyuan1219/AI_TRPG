import { describe, expect, it, vi } from 'vitest';
import { randomUuid } from './secureRandom';

describe('randomUuid', () => {
  it('uses native randomUUID when available', () => {
    const nativeUuid = '11111111-2222-4333-8444-555555555555';
    expect(randomUuid({ randomUUID: () => nativeUuid })).toBe(nativeUuid);
  });

  it('generates an RFC 4122 v4 UUID when randomUUID is unavailable', () => {
    const getRandomValues = vi.fn((values: Uint8Array) => {
      values.set(Array.from({ length: 16 }, (_, index) => index));
      return values;
    });

    expect(randomUuid({ getRandomValues })).toBe('00010203-0405-4607-8809-0a0b0c0d0e0f');
    expect(getRandomValues).toHaveBeenCalledOnce();
  });
});
