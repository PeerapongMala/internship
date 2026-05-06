/**
 * Calculate the mode from an array of numbers or strings.
 * @param scores Array of numbers or strings to calculate the mode from
 * @returns The mode (the most frequently occurring value) or 0 if no data
 */
/**
 * [3, 2, 3, 3, 2]; // mode = 3 (appears 3 times)
 * [1, 2, 2, 2, 3]; // mode = 2 (appears 3 times)
 * [1, 1, 2, 2, 3]; // mode = 1 (appears 2 times, takes the first one found)
 * [0, 0, 0, 0, 0]; // mode = 0
 * ['2', '3', '2', '3', '2']; // mode = 2 (appears 3 times)
 */

export const calculateMode = (scores: (string | number)[]): number => {
  const numericScores = scores.map((score) => {
    const num = typeof score === 'string' ? parseInt(score, 10) : score;
    return isNaN(num) ? 0 : num;
  });

  if (numericScores.length === 0) return 0;

  // If all values are zero
  if (numericScores.every((score) => score === 0)) return 0;

  // Filter out zeros
  const filtered = numericScores.filter((score) => score !== 0);

  if (filtered.length === 0) return 0;

  // Count frequency
  const frequencyMap: { [key: number]: number } = {};
  filtered.forEach((score) => {
    frequencyMap[score] = (frequencyMap[score] || 0) + 1;
  });

  let maxFrequency = 0;
  let mode = 0;

  Object.entries(frequencyMap).forEach(([score, frequency]) => {
    const numericScore = parseInt(score, 10);
    if (frequency > maxFrequency) {
      maxFrequency = frequency;
      mode = numericScore;
    }
  });

  return mode;
};
