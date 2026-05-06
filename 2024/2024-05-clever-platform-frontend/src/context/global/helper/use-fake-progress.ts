import { useEffect, useState } from 'react';

/**
 * Custom hook for fake progress animation
 *
 * @param isActive - Whether the progress should be animating
 * @param realProgress - Real progress value (0-100) from actual download/update
 * @returns Current progress value (0-100)
 *
 * @description
 * This hook provides smooth fake progress animation that:
 * - Starts animating when isActive becomes true
 * - Gradually increases progress by random increments (1-4% per 200ms)
 * - Caps at 95% to wait for real completion
 * - Switches to real progress when available
 * - Resets to 0 when isActive becomes false
 *
 * @example
 * ```tsx
 * const fakeProgress = useFakeProgress(showModal, downloadProgress);
 * ```
 */
export const useFakeProgress = (isActive: boolean, realProgress: number): number => {
  const [fakeProgress, setFakeProgress] = useState(0);

  useEffect(() => {
    if (isActive) {
      setFakeProgress(0);
      const interval = setInterval(() => {
        setFakeProgress((prev) => {
          // Use real progress if available, otherwise use fake
          if (realProgress > 0) {
            return realProgress;
          }
          // Fake progress: gradually increase but never reach 100
          const increment = Math.random() * 3 + 1; // 1-4% per tick
          const next = prev + increment;
          return next >= 95 ? 95 : next; // Cap at 95% until real completion
        });
      }, 200); // Update every 200ms

      return () => clearInterval(interval);
    } else {
      setFakeProgress(0);
    }
  }, [isActive, realProgress]);

  return fakeProgress;
};
