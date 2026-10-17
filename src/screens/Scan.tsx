import { useEffect, useState } from 'preact/hooks';
import { Button, Page, SignalReminder } from '../components/ui';
import { T } from '../content/ui';
import { speak, stopSpeaking } from '../lib/speech';
import {
  atRoot,
  currentList,
  currentOption,
  scanBack,
  scanNext,
  scanYes,
  startScan,
  type ScanState,
} from '../lib/tree';
import { useWakeLock } from '../lib/wakeLock';
import { useNav } from '../nav';
import { useApp, useLang } from '../state';
import { useSay } from './Message';

/*
 * Partner mode: the relative holds the phone, offers one option at a time
 * (reading it, showing it, or letting the phone say it) and presses YES when
 * the patient signals. In ask mode the top level is phrased as questions:
 * "May masakit ba sa iyo?"
 */
export function Scan(props: { ask: boolean }) {
  const { settings, setSettings } = useApp();
  const { tr, lang } = useLang();
  const nav = useNav();
  const say = useSay();
  useWakeLock();

  const [state, setState] = useState<ScanState>(startScan);
  const [wrapped, setWrapped] = useState(false);
  const [ended, setEnded] = useState<'stopped' | 'askDone' | null>(null);

  const option = currentOption(state);
  const list = currentList(state);
  const asQuestion = props.ask && atRoot(state);
  const prompt = asQuestion && option.question ? option.question[lang] : option.label[lang];

  useEffect(() => {
    if (!ended && settings.speakOptions) speak(prompt, lang, settings.rate);
  }, [prompt, ended, settings.speakOptions]);
  useEffect(() => stopSpeaking, []);

  const mode = props.ask ? 'ask' : 'scan';

  const yes = () => {
    setWrapped(false);
    const r = scanYes(state);
    if (r.kind === 'leaf') say(r.node, mode);
    else setState(r.state);
  };

  const no = () => {
    const r = scanNext(state);
    if (r.kind !== 'move') return;
    // In ask mode, saying no to every top-level question means "nothing for now".
    if (r.wrapped && asQuestion) {
      setEnded('askDone');
      return;
    }
    setWrapped(!!r.wrapped);
    setState(r.state);
  };

  if (ended) {
    return (
      <Page title={tr(props.ask ? T.modes.ask : T.modes.scan)}>
        <h1>{tr(ended === 'stopped' ? T.scan.stoppedTitle : T.scan.askEndTitle)}</h1>
        <p class="lead">{tr(ended === 'stopped' ? T.scan.stoppedBody : T.scan.askEndBody)}</p>
        <div class="stack">
          <Button
            variant="primary"
            big
            onClick={() => {
              setState(startScan());
              setEnded(null);
            }}
          >
            {tr(T.visit.tryAgain)}
          </Button>
          <Button onClick={nav.home}>{tr(T.common.home)}</Button>
        </div>
      </Page>
    );
  }

  const crumbs = state.path.slice(1).map((n) => n.label[lang]);

  return (
    <Page title={tr(props.ask ? T.modes.ask : T.modes.scan)} class="scan-page">
      <SignalReminder />
      <p class="muted">{tr(asQuestion ? T.scan.askInstruction : T.scan.instruction)}</p>
      {crumbs.length > 0 && <p class="crumbs">{crumbs.join(' › ')}</p>}

      <div class={`scan-card ${option.urgent ? 'scan-urgent' : ''}`}>
        {option.icon && <span class="scan-icon">{option.icon}</span>}
        <span>{prompt}</span>
      </div>
      <p class="muted center">
        {state.index + 1} / {list.length}
        {wrapped && <> · {tr(T.scan.wrapped)}</>}
      </p>

      <div class="answers">
        <Button variant="yes" big onClick={yes}>
          {tr(T.common.yes)}
        </Button>
        <Button variant="no" big onClick={no}>
          {tr(T.scan.noNext)}
        </Button>
      </div>
      <div class="row">
        <Button
          disabled={atRoot(state)}
          onClick={() => {
            setWrapped(false);
            setState(scanBack(state));
          }}
        >
          ← {tr(T.common.back)}
        </Button>
        <Button onClick={() => speak(prompt, lang, settings.rate)}>🔊 {tr(T.scan.repeat)}</Button>
        <Button
          onClick={() => {
            stopSpeaking();
            setEnded('stopped');
          }}
        >
          ✋ {tr(T.scan.stop)}
        </Button>
      </div>
      <label class="toggle">
        <input
          type="checkbox"
          checked={settings.speakOptions}
          onChange={(e) => setSettings({ speakOptions: e.currentTarget.checked })}
        />
        {tr(T.scan.phoneVoice)}
      </label>
    </Page>
  );
}
