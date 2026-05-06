/**
 * Matches a given path against a glob pattern.
 * Supports:
 * - '*' for a single path segment (e.g., /users/`*`/profile matches /users/123/profile)
 * - '**' for zero or more path segments (e.g., /docs/`**`/index.html matches /docs/api/v1/index.html)
 * - Exact matches
 *
 * @param base The current URL pathname (e.g., "/grade-system/evaluation/report/123/phorpor5/create")
 * @param pattern The glob pattern (e.g., "/grade-system/evaluation/report/`*`/ phorpor5; /**")
 * @returns boolean indicating if the path matches the pattern
 */
export function matchWithGlob(base: string, pattern: string): boolean {
  // Normalize paths: remove leading/trailing slashes for consistent segment splitting
  const pathSegments = base.split('/').filter((s) => s !== '');
  const patternSegments = pattern.split('/').filter((s) => s !== '');

  let pathIdx = 0;
  let patternIdx = 0;

  while (pathIdx < pathSegments.length && patternIdx < patternSegments.length) {
    const patternSegment = patternSegments[patternIdx];
    const pathSegment = pathSegments[pathIdx];

    if (patternSegment === '**') {
      // '**' matches zero or more path segments
      // Try to match the rest of the pattern with the rest of the path
      // If we match the rest of the pattern by skipping some path segments, it's a match.
      // This greedy approach tries to consume as many path segments as possible.
      let nextPatternIdx = patternIdx + 1;
      if (nextPatternIdx === patternSegments.length) {
        // If '**' is the last segment, it matches everything remaining in the path
        return true;
      }

      // Look for the next non-glob segment in the pattern
      let foundMatch = false;
      for (let i = pathIdx; i <= pathSegments.length; i++) {
        if (
          matchWithGlob(
            pathSegments.slice(i).join('/'),
            patternSegments.slice(nextPatternIdx).join('/'),
          )
        ) {
          foundMatch = true;
          break;
        }
      }
      return foundMatch;
    } else if (patternSegment === '*') {
      // '*' matches any single path segment
      pathIdx++;
      patternIdx++;
    } else if (patternSegment === pathSegment) {
      // Exact segment match
      pathIdx++;
      patternIdx++;
    } else {
      // Mismatch
      return false;
    }
  }

  // After iterating, check if both have been fully consumed.
  // Handle trailing '**' in pattern (e.g., /a/b matches /a/b/**)
  while (patternIdx < patternSegments.length && patternSegments[patternIdx] === '**') {
    patternIdx++;
  }

  return pathIdx === pathSegments.length && patternIdx === patternSegments.length;
}
