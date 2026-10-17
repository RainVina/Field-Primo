import type { ComponentChildren } from 'preact';
import { T } from '../content/ui';
import { fill } from '../i18n';
import { noLabel, yesLabel } from '../lib/profile';
import { useNav } from '../nav';
import { useApp, useLang } from '../state';

/** Standard screen frame: header with Back / Home, scrollable body. */
export function Page(props: { title?: string; children: ComponentChildren; noHeader?: boolean; class?: string }) {
  const nav = useNav();
  const { tr } = useLang();
  return (
    <div class={`page ${props.class ?? ''}`}>
      {!props.noHeader && (
        <header class="topbar">
          <button class="topbar-btn" onClick={nav.back}>
            ← {tr(T.common.back)}
          </button>
          <span class="topbar-title">{props.title}</span>
          <button class="topbar-btn" onClick={nav.home}>
            {tr(T.common.home)}
          </button>
        </header>
      )}
      <main class="page-body">{props.children}</main>
    </div>
  );
}

export function Button(props: {
  onClick: () => void;
  children: ComponentChildren;
  variant?: 'primary' | 'yes' | 'no' | 'quiet' | 'danger';
  big?: boolean;
  disabled?: boolean;
}) {
  const cls = ['btn', `btn-${props.variant ?? 'quiet'}`, props.big ? 'btn-big' : ''].join(' ');
  return (
    <button class={cls} onClick={props.onClick} disabled={props.disabled}>
      {props.children}
    </button>
  );
}

/** Large YES / NO (+ optional third) answer buttons the relative taps. */
export function AnswerButtons(props: { onYes: () => void; onNo: () => void; onUnsure?: () => void; unsureLabel?: string }) {
  const { tr } = useLang();
  return (
    <div class="answers">
      <Button variant="yes" big onClick={props.onYes}>
        {tr(T.common.yes)}
      </Button>
      <Button variant="no" big onClick={props.onNo}>
        {tr(T.common.no)}
      </Button>
      {props.onUnsure && (
        <Button onClick={props.onUnsure}>{props.unsureLabel ?? tr(T.common.noAnswer)}</Button>
      )}
    </div>
  );
}

/** "YES = hand squeeze, once · NO = ..." so the relative never has to remember. */
export function SignalReminder() {
  const { profile } = useApp();
  const { lang, tr } = useLang();
  // Setup is optional; without it, suggest a signal the family can agree on now.
  if (!profile) return <p class="signal-reminder">{tr(T.common.signalHint)}</p>;
  return (
    <p class="signal-reminder">
      {fill(T.common.signalReminder, lang, { yes: yesLabel(profile, lang), no: noLabel(profile, lang) })}
    </p>
  );
}

export function DraftNote() {
  const { tr } = useLang();
  return <p class="draft-note">{tr(T.common.draft)}</p>;
}
