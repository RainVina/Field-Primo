import { createContext } from 'preact';
import { useContext } from 'preact/hooks';
import type { Mode } from './lib/profile';

export type Screen =
  | { name: 'home' }
  | { name: 'setup' }
  | { name: 'visit' }
  | { name: 'tap' }
  | { name: 'scan'; ask: boolean }
  | { name: 'message'; entryId: string; mode: Mode }
  | { name: 'history' }
  | { name: 'card' }
  | { name: 'guide' }
  | { name: 'settings' }
  | { name: 'noResponse' };

export interface Nav {
  screen: Screen;
  /** Open a screen. replace=true swaps the current one (no extra Back step). */
  go: (screen: Screen, opts?: { replace?: boolean }) => void;
  back: () => void;
  home: () => void;
}

export const NavCtx = createContext<Nav>(null as unknown as Nav);

export function useNav(): Nav {
  return useContext(NavCtx);
}

export function modeScreen(mode: Mode): Screen {
  if (mode === 'tap') return { name: 'tap' };
  return { name: 'scan', ask: mode === 'ask' };
}
