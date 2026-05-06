import type { SessionState } from '../types';
import { seedData } from './seedData';

const STORAGE_KEY = 'oms_session';

export function loadSession(): SessionState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as SessionState;
    }
  } catch {
    // corrupted data — fall back to seed
  }
  const initial = structuredClone(seedData);
  saveSession(initial);
  return initial;
}

export function saveSession(state: SessionState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetSession(): SessionState {
  localStorage.removeItem(STORAGE_KEY);
  const fresh = structuredClone(seedData);
  saveSession(fresh);
  return fresh;
}

/** Simulate async delay (300-800ms) */
export function simulateAsync<T>(fn: () => T): Promise<T> {
  const delay = 300 + Math.random() * 500;
  return new Promise((resolve) => {
    setTimeout(() => resolve(fn()), delay);
  });
}
