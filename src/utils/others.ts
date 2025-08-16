export function round(n: number, p = 2) {
  return Math.round(n * 10 ** p) / 10 ** p;
}
