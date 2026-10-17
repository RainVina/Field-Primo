import { Button, Page, SignalReminder } from '../components/ui';
import { T } from '../content/ui';
import { fill } from '../i18n';
import { callNameOf, recommendedMode, reliability, type Mode } from '../lib/profile';
import { modeScreen, useNav } from '../nav';
import { useApp, useLang } from '../state';

export function Home() {
  const { profile, setSettings } = useApp();
  const { tr, lang } = useLang();
  const nav = useNav();

  const langToggle = (
    <div class="lang-toggle">
      <button class={lang === 'fil' ? 'on' : ''} onClick={() => setSettings({ lang: 'fil' })}>
        Filipino
      </button>
      <button class={lang === 'en' ? 'on' : ''} onClick={() => setSettings({ lang: 'en' })}>
        English
      </button>
    </div>
  );

  if (!profile) {
    return (
      <Page noHeader>
        {langToggle}
        <h1 class="app-title">{tr(T.appName)}</h1>
        <p class="lead">{tr(T.welcome.tagline)}</p>
        <p>{tr(T.welcome.body)}</p>
        <Button variant="primary" big onClick={() => nav.go({ name: 'setup' })}>
          {tr(T.welcome.start)}
        </Button>
        <div class="stack">
          <Button onClick={() => nav.go({ name: 'guide' })}>{tr(T.home.guide)}</Button>
          <Button onClick={() => nav.go({ name: 'settings' })}>{tr(T.home.settings)}</Button>
        </div>
        <p class="muted small">{tr(T.common.privacy)}</p>
      </Page>
    );
  }

  const recommended = recommendedMode(profile);
  const modes: { mode: Mode; label: string; desc: string }[] = [
    { mode: 'tap', label: tr(T.modes.tap), desc: tr(T.modes.tapDesc) },
    { mode: 'scan', label: tr(T.modes.scan), desc: tr(T.modes.scanDesc) },
    { mode: 'ask', label: tr(T.modes.ask), desc: tr(T.modes.askDesc) },
  ];

  return (
    <Page noHeader>
      {langToggle}
      <h1 class="app-title">{fill(T.home.forPatient, lang, { call: callNameOf(profile, lang) })}</h1>
      <SignalReminder />
      {reliability(profile.verifyScore) === 'unreliable' && <p class="warn">{tr(T.home.unreliable)}</p>}

      <Button variant="primary" big onClick={() => nav.go({ name: 'visit' })}>
        {tr(T.home.startVisit)}
      </Button>

      <h2>{tr(T.home.ways)}</h2>
      <div class="stack">
        {modes.map((m) => (
          <button key={m.mode} class="mode-card" onClick={() => nav.go(modeScreen(m.mode))}>
            <strong>{m.label}</strong>
            {m.mode === recommended && <span class="badge">{tr(T.modes.recommended)}</span>}
            <span class="muted">{m.desc}</span>
          </button>
        ))}
      </div>

      <div class="stack">
        <Button onClick={() => nav.go({ name: 'history' })}>{tr(T.home.history)}</Button>
        <Button onClick={() => nav.go({ name: 'card' })}>{tr(T.home.card)}</Button>
        <Button onClick={() => nav.go({ name: 'guide' })}>{tr(T.home.guide)}</Button>
        <Button onClick={() => nav.go({ name: 'noResponse' })}>{tr(T.home.notResponding)}</Button>
        <Button onClick={() => nav.go({ name: 'setup' })}>{tr(T.home.redoSetup)}</Button>
        <Button onClick={() => nav.go({ name: 'settings' })}>{tr(T.home.settings)}</Button>
      </div>
      <p class="muted small">
        {tr(T.common.privacy)} · v0.1 prototype
      </p>
    </Page>
  );
}
