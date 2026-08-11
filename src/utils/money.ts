const SCALE = 2;
const FACTOR = 10n ** BigInt(SCALE);

export const multiplyMoney = (amount: string, count: number): string => {
  const [whole = '0', fraction = ''] = amount.split('.');
  const scaled =
    BigInt(whole) * FACTOR +
    BigInt(fraction.padEnd(SCALE, '0').slice(0, SCALE));
  const total = scaled * BigInt(count);
  return `${total / FACTOR}.${(total % FACTOR).toString().padStart(SCALE, '0')}`;
};
