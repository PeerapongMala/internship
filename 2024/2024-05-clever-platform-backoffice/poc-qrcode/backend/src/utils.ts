/**
 * Generates a random string of a specified length using alphanumeric characters.
 * The function ensures the generated string is unique by checking against a cache (`cached`).
 *
 * @param {number} length - The length of the desired random string.
 * @param {Map<string, any>} cached - A Map used to track already generated strings to avoid duplicates.
 * @param {number} attemptLimit - The maximum number of attempts to generate a unique string before recursively increasing the string length.
 *
 * @returns {string} A random string of the specified length that is not present in the cache.
 */
export function generateRandomString(
  length: number,
  cache: Map<string, any>,
  attemptLimit: number = 5
) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  while (--attemptLimit > 0) {
    let randomString = "";
    for (let i = 0; i < length; i++) {
      randomString += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    if (!cache.has(randomString)) {
      return randomString;
    }
  }
  return generateRandomString(length + 1, cache, attemptLimit + 1);
}
