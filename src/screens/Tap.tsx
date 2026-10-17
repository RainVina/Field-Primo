import { useRef, useState } from 'preact/hooks';
import { Page } from '../components/ui';
import { ROOT, type PhraseNode } from '../content/phrases';
import { T } from '../content/ui';
import { isLeaf, optionsOf } from '../lib/tree';
import { useWakeLock } from '../lib/wakeLock';
import { useLang } from '../state';
import { useSay } from './Message';

/** Taps closer than this to a screen change are ignored (shaky hands double-tap). */
const TAP_GUARD_MS = 600;

/** Direct selection: the patient taps big buttons themselves. */
export function Tap() {
  const { tr, lang } = useLang();
  const say = useSay();
  const [path, setPath] = useState<PhraseNode[]>([ROOT]);
  const changedAt = useRef(Date.now());
  useWakeLock();

  const node = path[path.length - 1];
  const options = optionsOf(node);

  const choose = (option: PhraseNode) => {
    if (Date.now() - changedAt.current < TAP_GUARD_MS) return;
    changedAt.current = Date.now();
    if (isLeaf(option)) say(option, 'tap');
    else setPath([...path, option]);
  };

  const up = () => {
    changedAt.current = Date.now();
    setPath(path.slice(0, -1));
  };

  return (
    <Page title={node === ROOT ? tr(T.modes.tap) : node.label[lang]}>
      <h1 class="tap-title">{node === ROOT ? tr(T.tap.title) : node.label[lang]}</h1>
      <div class="tap-grid">
        {options.map((o) => (
          <button key={o.id} class={`tap-btn ${o.urgent ? 'tap-urgent' : ''}`} onClick={() => choose(o)}>
            {o.icon && <span class="tap-icon">{o.icon}</span>}
            {o.label[lang]}
          </button>
        ))}
        {path.length > 1 && (
          <button class="tap-btn tap-back" onClick={up}>
            ← {tr(T.common.back)}
          </button>
        )}
      </div>
    </Page>
  );
}
