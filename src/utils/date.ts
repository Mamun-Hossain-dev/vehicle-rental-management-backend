const DAY_MS = 86_400_000;

export const inclusiveDays = (start: string, end: string): number => {
  const [sy, sm, sd] = start.split('-').map(Number);
  const [ey, em, ed] = end.split('-').map(Number);
  return (Date.UTC(ey!, em! - 1, ed) - Date.UTC(sy!, sm! - 1, sd)) / DAY_MS + 1;
};
