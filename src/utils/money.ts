const SCALE = 2;
const FACTOR = 10n ** BigInt(SCALE);

const toScaled = (amount: string): bigint => {
  const [whole = '0', fraction = ''] = amount.split('.');
  return (
    BigInt(whole) * FACTOR + BigInt(fraction.padEnd(SCALE, '0').slice(0, SCALE))
  );
};

const fromScaled = (amount: bigint): string =>
  `${amount / FACTOR}.${(amount % FACTOR).toString().padStart(SCALE, '0')}`;

export const multiplyMoney = (amount: string, count: number): string =>
  fromScaled(toScaled(amount) * BigInt(count));

export const addMoney = (left: string, right: string): string =>
  fromScaled(toScaled(left) + toScaled(right));

export const compareMoney = (left: string, right: string): number =>
  toScaled(left) > toScaled(right)
    ? 1
    : toScaled(left) < toScaled(right)
      ? -1
      : 0;
