interface CryptoLike {
  randomUUID?: () => string;
  getRandomValues?: (values: Uint8Array) => Uint8Array;
}

export function randomUuid(cryptoApi: CryptoLike | undefined = globalThis.crypto as CryptoLike | undefined) {
  if (typeof cryptoApi?.randomUUID === 'function') return cryptoApi.randomUUID();
  if (typeof cryptoApi?.getRandomValues !== 'function') {
    throw new Error('当前浏览器不支持安全随机数');
  }

  const bytes = cryptoApi.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (value) => value.toString(16).padStart(2, '0'));
  return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex.slice(6, 8).join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10).join('')}`;
}

function randomUint32() {
  const value = new Uint32Array(1);
  crypto.getRandomValues(value);
  return value[0];
}

export function randomIntInclusive(min: number, max: number) {
  const low = Math.ceil(min);
  const high = Math.floor(max);
  if (high < low) throw new Error('随机范围无效');
  const span = high - low + 1;
  const maxUint = 0x100000000;
  const limit = maxUint - (maxUint % span);
  let value = randomUint32();
  while (value >= limit) value = randomUint32();
  return low + (value % span);
}

export function randomIndex(length: number) {
  if (!Number.isInteger(length) || length <= 0) throw new Error('随机列表不能为空');
  return randomIntInclusive(0, length - 1);
}

export function animationRandom(min = 0, max = 1) {
  return min + (randomUint32() / 0xffffffff) * (max - min);
}
