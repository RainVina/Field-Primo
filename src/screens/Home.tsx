import { Button, Page, SignalReminder } from '../components/ui';
import { T } from '../content/ui';
import { fill } from '../i18n';
import { callNameOf, recommendedMode, reliability, type Mode } from '../lib/profile';
import { modeScreen, useNav } from '../nav';
import { useApp, useLang } from '../state';

/*
 * Safari on iPhone deletes a website's saved data after about 7 days without a
 * visit, unless the site was added to the Home Screen.
 */
const needsIosInstall =
  (/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) &&
  !(navigator as { standalone?: boolean }).standalone &&
  !matchMedia('(display-mode: standalone)').matches;

/*
 * The app is usable immediately: the ways to talk are on the first screen.
 * Setup is optional; once done it adds the visit check, the signal reminder,
 * a recommended mode and the nurse card.
 */
export function Home() {
  const { profile, setSettings } = useApp();
  const { tr, lang } = useLang();
  const nav = useNav();

  const recommended = profile ? recommendedMode(profile) : null;
  const modes: { mode: Mode; label: string; desc: string }[] = [
    { mode: 'tap', label: tr(T.modes.tap), desc: tr(T.modes.tapDesc) },
    { mode: 'scan', label: tr(T.modes.scan), desc: tr(T.modes.scanDesc) },
    { mode: 'ask', label: tr(T.modes.ask), desc: tr(T.modes.askDesc) },
  ];

  return (
    <Page noHeader>
      <div class="lang-toggle">
        <button class={lang === 'fil' ? 'on' : ''} onClick={() => setSettings({ lang: 'fil' })}>
          Filipino
        </button>
        <button class={lang === 'en' ? 'on' : ''} onClick={() => setSettings({ lang: 'en' })}>
          English
        </button>
      </div>
      {needsIosInstall && <p class="note">{tr(T.home.iosInstall)}</p>}

      {profile ? (
        <h1 class="app-title">{fill(T.home.forPatient, lang, { call: callNameOf(profile, lang) })}</h1>
      ) : (
        <>
          <h1 class="app-title">{tr(T.appName)}</h1>
          <p class="lead">{tr(T.welcome.tagline)}</p>
        </>
      )}
      <SignalReminder />
      {profile && reliability(profile.verifyScore) === 'unreliable' && <p class="warn">{tr(T.home.unreliable)}</p>}

      {profile && (
        <Button variant="primary" big onClick={() => nav.go({ name: 'visit' })}>
          {tr(T.home.startVisit)}
        </Button>
      )}

      <h2>{profile ? tr(T.home.ways) : tr(T.welcome.pick)}</h2>
      <div class="stack">
        {modes.map((m) => (
          <button key={m.mode} class="mode-card" onClick={() => nav.go(modeScreen(m.mode))}>
            <strong>{m.label}</strong>
            {m.mode === recommended && <span class="badge">{tr(T.modes.recommended)}</span>}
            <span class="muted">{m.desc}</span>
          </button>
        ))}
      </div>

      {!profile && (
        <div class="stack">
          <Button onClick={() => nav.go({ name: 'setup' })}>{tr(T.welcome.setup)}</Button>
          <p class="muted small">{tr(T.welcome.setupWhy)}</p>
        </div>
      )}

      <div class="stack">
        <Button onClick={() => nav.go({ name: 'history' })}>{tr(T.home.history)}</Button>
        {profile && <Button onClick={() => nav.go({ name: 'card' })}>{tr(T.home.card)}</Button>}
        <Button onClick={() => nav.go({ name: 'guide' })}>{tr(T.home.guide)}</Button>
        <Button onClick={() => nav.go({ name: 'noResponse' })}>{tr(T.home.notResponding)}</Button>
        {profile && <Button onClick={() => nav.go({ name: 'setup' })}>{tr(T.home.redoSetup)}</Button>}
        <Button onClick={() => nav.go({ name: 'settings' })}>{tr(T.home.settings)}</Button>
      </div>
      <p class="muted small">{tr(T.common.privacy)} · v0.1 prototype</p>
    </Page>
  );
}
