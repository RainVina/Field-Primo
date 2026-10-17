import { useEffect, useState } from 'preact/hooks';
import { stopSpeaking } from './lib/speech';
import { NavCtx, type Nav, type Screen } from './nav';
import { Card } from './screens/Card';
import { Guide } from './screens/Guide';
import { History } from './screens/History';
import { Home } from './screens/Home';
import { Message } from './screens/Message';
import { NoResponse } from './screens/NoResponse';
import { Scan } from './screens/Scan';
import { Settings } from './screens/Settings';
import { Setup } from './screens/Setup';
import { Tap } from './screens/Tap';
import { Visit } from './screens/Visit';
import { useApp } from './state';

/*
 * Screens are a simple stack. Each push also adds a browser history entry so the
 * Android back button goes back one screen instead of closing the app.
 */
export function App() {
  const { settings } = useApp();
  const [stack, setStack] = useState<Screen[]>([{ name: 'home' }]);

  useEffect(() => {
    const onPop = () => {
      stopSpeaking();
      setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    document.documentElement.lang = settings.lang;
    document.documentElement.style.setProperty('--scale', String(settings.textScale));
  }, [settings.lang, settings.textScale]);

  const screen = stack[stack.length - 1];

  const nav: Nav = {
    screen,
    go: (next, opts) => {
      stopSpeaking();
      if (opts?.replace) {
        setStack((s) => [...s.slice(0, -1), next]);
      } else {
        history.pushState(null, '');
        setStack((s) => [...s, next]);
      }
      window.scrollTo(0, 0);
    },
    back: () => {
      if (stack.length > 1) history.back();
    },
    home: () => {
      stopSpeaking();
      setStack([{ name: 'home' }]);
      window.scrollTo(0, 0);
    },
  };

  return (
    <NavCtx.Provider value={nav}>
      <ScreenView screen={screen} />
    </NavCtx.Provider>
  );
}

function ScreenView({ screen }: { screen: Screen }) {
  switch (screen.name) {
    case 'home':
      return <Home />;
    case 'setup':
      return <Setup />;
    case 'visit':
      return <Visit />;
    case 'tap':
      return <Tap />;
    case 'scan':
      // key resets scan position when switching between scan and ask mode
      return <Scan key={String(screen.ask)} ask={screen.ask} />;
    case 'message':
      return <Message entryId={screen.entryId} mode={screen.mode} />;
    case 'history':
      return <History />;
    case 'card':
      return <Card />;
    case 'guide':
      return <Guide />;
    case 'settings':
      return <Settings />;
    case 'noResponse':
      return <NoResponse />;
  }
}
