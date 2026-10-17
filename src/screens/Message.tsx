import { useEffect } from 'preact/hooks';
import { AnswerButtons, Button, DraftNote, Page } from '../components/ui';
import type { PhraseNode } from '../content/phrases';
import { T } from '../content/ui';
import { fill, formatDate, formatTime, type Lang, type Text } from '../i18n';
import type { Mode } from '../lib/profile';
import { speak } from '../lib/speech';
import { useWakeLock } from '../lib/wakeLock';
import { findNode } from '../lib/tree';
import { modeScreen, useNav } from '../nav';
import { useApp, useLang } from '../state';

/** Record what the patient picked, say it aloud, and show it full screen. */
export function useSay() {
  const { addEntry, settings } = useApp();
  const nav = useNav();
  return (node: PhraseNode, mode: Mode) => {
    const text = node.say ?? node.label;
    const entry = addEntry({ nodeId: node.id, text, urgent: !!node.urgent, mode });
    speak(text[settings.lang], settings.lang, settings.rate);
    nav.go({ name: 'message', entryId: entry.id, mode });
  };
}

function fillTip(tip: Text, lang: Lang): string {
  const now = Date.now();
  return fill(tip, lang, { today: formatDate(now, lang), now: formatTime(now, lang) });
}

export function Message(props: { entryId: string; mode: Mode }) {
  const { history, setEntryStatus, settings } = useApp();
  const { tr, lang } = useLang();
  const nav = useNav();
  useWakeLock();

  const entry = history.find((e) => e.id === props.entryId);
  useEffect(() => {
    if (!entry) nav.home();
  }, [entry]);
  if (!entry) return null;

  const node = findNode(entry.nodeId);
  const text = entry.text[lang];
  const backToMode = () => nav.go(modeScreen(props.mode), { replace: true });

  return (
    <Page>
      {entry.urgent && entry.status !== 'rejected' && <div class="urgent-banner">{tr(T.message.urgent)}</div>}

      <p class="message-text">{text}</p>

      {entry.status === 'pending' && (
        <>
          <h2>{tr(T.message.confirmQ)}</h2>
          <p class="muted">{tr(T.message.confirmHint)}</p>
          <AnswerButtons onYes={() => setEntryStatus(entry.id, 'confirmed')} onNo={() => setEntryStatus(entry.id, 'rejected')} />
        </>
      )}

      {entry.status === 'confirmed' && (
        <>
          <p class="ok">✓ {tr(T.message.confirmed)}</p>
          {node?.familyTip && (
            <div class="tip">
              <strong>{tr(T.message.tipTitle)}</strong> {fillTip(node.familyTip, lang)}
            </div>
          )}
          <div class="stack">
            <Button variant="primary" big onClick={backToMode}>
              {tr(T.message.more)}
            </Button>
            <Button onClick={nav.home}>{tr(T.message.done)}</Button>
          </div>
        </>
      )}

      {entry.status === 'rejected' && (
        <>
          <p>{tr(T.message.rejected)}</p>
          {/* Back to the same list, since the right answer is often next to the wrong one. */}
          <Button variant="primary" big onClick={nav.back}>
            {tr(T.message.tryAgain)}
          </Button>
        </>
      )}

      <Button onClick={() => speak(text, lang, settings.rate)}>🔊 {tr(T.message.repeat)}</Button>
      {node?.familyTip && <DraftNote />}
    </Page>
  );
}
