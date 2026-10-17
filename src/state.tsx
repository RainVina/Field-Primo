import { createContext, type ComponentChildren } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';
import type { Lang, Text } from './i18n';
import type { Mode, Profile } from './lib/profile';
import { KEYS, load, save } from './lib/storage';

export interface Settings {
  lang: Lang;
  /** Phone reads each option aloud in partner and ask modes. */
  speakOptions: boolean;
  rate: number;
  textScale: 1 | 1.25 | 1.5;
}

export interface HistoryEntry {
  id: string;
  at: number;
  nodeId: string;
  /** Stored in both languages so a relative can read it in either. */
  text: Text;
  urgent: boolean;
  /** pending until the patient confirms "yes, that's what I meant". */
  status: 'pending' | 'confirmed' | 'rejected';
  mode: Mode;
}

const DEFAULT_SETTINGS: Settings = { lang: 'fil', speakOptions: true, rate: 0.9, textScale: 1 };

interface AppState {
  settings: Settings;
  setSettings: (s: Partial<Settings>) => void;
  profile: Profile | null;
  setProfile: (p: Profile | null) => void;
  history: HistoryEntry[];
  addEntry: (e: Omit<HistoryEntry, 'id' | 'at' | 'status'>) => HistoryEntry;
  setEntryStatus: (id: string, status: HistoryEntry['status']) => void;
  clearHistory: () => void;
}

const Ctx = createContext<AppState>(null as unknown as AppState);

/** Like useState, but kept in localStorage. */
function usePersisted<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => load(key, fallback));
  useEffect(() => save(key, value), [key, value]);
  return [value, setValue] as const;
}

export function AppProvider({ children }: { children: ComponentChildren }) {
  const [settings, setSettingsRaw] = usePersisted<Settings>(KEYS.settings, DEFAULT_SETTINGS);
  const [profile, setProfile] = usePersisted<Profile | null>(KEYS.profile, null);
  const [history, setHistory] = usePersisted<HistoryEntry[]>(KEYS.history, []);

  const state: AppState = {
    settings: { ...DEFAULT_SETTINGS, ...settings },
    setSettings: (s) => setSettingsRaw((prev) => ({ ...prev, ...s })),
    profile,
    setProfile,
    history,
    addEntry: (e) => {
      const entry: HistoryEntry = { ...e, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, at: Date.now(), status: 'pending' };
      setHistory((h) => [entry, ...h]);
      return entry;
    },
    setEntryStatus: (id, status) => setHistory((h) => h.map((e) => (e.id === id ? { ...e, status } : e))),
    clearHistory: () => setHistory([]),
  };

  return <Ctx.Provider value={state}>{children}</Ctx.Provider>;
}

export function useApp(): AppState {
  return useContext(Ctx);
}

/** Shorthand used everywhere: const { tr, lang } = useLang(); tr(T.home.title) */
export function useLang() {
  const { settings } = useApp();
  const lang = settings.lang;
  return { lang, tr: (text: Text) => text[lang] };
}
