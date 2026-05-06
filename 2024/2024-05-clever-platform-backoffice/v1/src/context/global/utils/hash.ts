export function generateUniqueHash(): string {
  // Current timestamp
  const time = Date.now().toString(36);

  // High-res time (in case multiple calls per ms)
  const perf = (
    typeof performance !== 'undefined' ? performance.now() : Math.random() * 1000
  ).toString(36);

  // Random part
  const random = Math.random().toString(36).substring(2, 10);

  return `${time}-${perf}-${random}`;
}
