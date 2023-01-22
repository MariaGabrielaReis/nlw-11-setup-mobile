export function generateProgressPercent(total: number, completed: number) {
  return Math.round((total / completed) * 100);
}
