export function normalizeContractSignature(value: string) {
  return value.normalize('NFKC').trim().replace(/\s+/g, ' ');
}

export function isContractSignatureValid(signature: string, playerName: string) {
  const expected = normalizeContractSignature(playerName);
  return Boolean(expected) && normalizeContractSignature(signature) === expected;
}
