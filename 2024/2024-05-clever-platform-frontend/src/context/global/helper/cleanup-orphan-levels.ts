/**
 * Cleanup script for orphan levels
 *
 * This script identifies and removes "orphan" levels - levels that exist in StoreLevel
 * but don't belong to any existing lesson or sublesson.
 *
 * Background:
 * - Bug: When deleting lessons/sublessons, levels were not being deleted
 * - This caused memory leaks and storage issues
 * - This script cleans up existing orphan data from affected users
 *
 * Usage:
 * - Call cleanupOrphanLevels() on app initialization or when needed
 * - Safe to run multiple times (idempotent)
 */

import StoreLessons from '@global/store/global/lessons';
import StoreSublessons from '@global/store/global/sublessons';
import StoreLevel from '@global/store/global/level';
import { debugLog, warnAlways } from './debug-logger';

export interface OrphanLevelCleanupResult {
  totalLevels: number;
  orphanLevels: number;
  cleanedLevelIds: string[];
  summary: string;
}

/**
 * Identifies and removes orphan levels from the store
 *
 * A level is considered orphan if:
 * 1. Its sublesson_id doesn't exist in StoreSublessons, OR
 * 2. Its lesson_id doesn't exist in StoreLessons
 *
 * @returns Cleanup result with statistics
 */
export function cleanupOrphanLevels(): OrphanLevelCleanupResult {
  const levels = StoreLevel.MethodGet().getLevels();
  const allLessons = StoreLessons.MethodGet().all();
  const allSublessons = StoreSublessons.MethodGet().all();

  const cleanedLevelIds: string[] = [];
  let totalLevels = 0;

  debugLog('🧹 [cleanupOrphanLevels] Starting orphan level cleanup...');

  for (const [levelId, level] of Object.entries(levels)) {
    if (!level) continue;
    totalLevels++;

    const sublessonId = String(level.sub_lesson_id);
    const lessonId = String(level.lesson_id);

    // Check if sublesson exists
    const sublessonExists = allSublessons[sublessonId] !== undefined;

    // Check if lesson exists
    const lessonExists = allLessons[lessonId] !== undefined;

    if (!sublessonExists || !lessonExists) {
      warnAlways(
        `🧹 Found orphan level ${levelId}: ` +
        `sublesson ${sublessonId} exists=${sublessonExists}, ` +
        `lesson ${lessonId} exists=${lessonExists}`
      );
      cleanedLevelIds.push(levelId);
    }
  }

  // Remove orphan levels
  if (cleanedLevelIds.length > 0) {
    const state = StoreLevel.StoreGet().getState();
    const newLevels = { ...state.levels };

    for (const levelId of cleanedLevelIds) {
      delete newLevels[levelId];
    }

    StoreLevel.StoreGet().setState({ ...state, levels: newLevels });

    warnAlways(
      `🧹 [cleanupOrphanLevels] Cleaned ${cleanedLevelIds.length} orphan levels ` +
      `out of ${totalLevels} total levels`
    );
  } else {
    debugLog(`🧹 [cleanupOrphanLevels] No orphan levels found (${totalLevels} levels checked)`);
  }

  const summary = `Cleaned ${cleanedLevelIds.length}/${totalLevels} orphan levels`;

  return {
    totalLevels,
    orphanLevels: cleanedLevelIds.length,
    cleanedLevelIds,
    summary,
  };
}

/**
 * Gets statistics about orphan levels WITHOUT cleaning them up
 * Useful for debugging and monitoring
 */
export function getOrphanLevelStats(): Omit<OrphanLevelCleanupResult, 'cleanedLevelIds'> {
  const levels = StoreLevel.MethodGet().getLevels();
  const allLessons = StoreLessons.MethodGet().all();
  const allSublessons = StoreSublessons.MethodGet().all();

  let totalLevels = 0;
  let orphanCount = 0;

  for (const [levelId, level] of Object.entries(levels)) {
    if (!level) continue;
    totalLevels++;

    const sublessonId = String(level.sub_lesson_id);
    const lessonId = String(level.lesson_id);

    const sublessonExists = allSublessons[sublessonId] !== undefined;
    const lessonExists = allLessons[lessonId] !== undefined;

    if (!sublessonExists || !lessonExists) {
      orphanCount++;
    }
  }

  return {
    totalLevels,
    orphanLevels: orphanCount,
    summary: `Found ${orphanCount}/${totalLevels} orphan levels`,
  };
}
