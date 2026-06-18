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
