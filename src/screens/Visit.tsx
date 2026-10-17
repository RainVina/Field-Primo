import { useEffect, useState } from 'preact/hooks';
import { Button, Page, SignalReminder } from '../components/ui';
import { T } from '../content/ui';
import { fill } from '../i18n';
import { callNameOf, selfMode, yesAsk } from '../lib/profile';
import { modeScreen, useNav } from '../nav';
import { useApp, useLang } from '../state';

/*
 * Start of every visit: a quick hello that doubles as a check that the signal
 * still works today, then the patient gets the first word: "May gusto ka bang
 * sabihin?" They have been alone for hours and may have been waiting to say it.
 */
export function Visit() {
  const { profile } = useApp();
  const { tr, lang } = useLang();
  const nav = useNav();
  const [step, setStep] = useState<'hello' | 'ask' | 'nothing' | 'quiet'>('hello');

  useEffect(() => {
    if (!profile) nav.go({ name: 'setup' }, { replace: true });
  }, [profile]);
  if (!profile) return null;

  const call = callNameOf(profile, lang);

  return (
    <Page title={tr(T.home.startVisit)}>
      <SignalReminder />
      {step === 'hello' && (
        <>
          <h1>{tr(T.visit.helloTitle)}</h1>
          <p>{tr(T.visit.helloSay)}</p>
          <p class="say-line big">{fill(T.visit.helloLine, lang, { call, ask: yesAsk(profile, lang) })}</p>
          <div class="stack">
            <Button variant="yes" big onClick={() => setStep('ask')}>
              {tr(T.visit.responded)}
            </Button>
            <Button big onClick={() => setStep('quiet')}>
              {tr(T.visit.noResponse)}
            </Button>
          </div>
        </>
      )}

      {step === 'ask' && (
        <>
          <h1>{tr(T.visit.askTitle)}</h1>
          <p class="say-line big">{tr(T.visit.askLine)}</p>
          <div class="answers">
            <Button variant="yes" big onClick={() => nav.go(modeScreen(selfMode(profile)), { replace: true })}>
              {tr(T.common.yes)}
            </Button>
            <Button variant="no" big onClick={() => setStep('nothing')}>
              {tr(T.common.no)}
            </Button>
          </div>
        </>
      )}

      {step === 'nothing' && (
        <>
          <h1>{tr(T.visit.nothingTitle)}</h1>
          <p class="lead">{tr(T.visit.nothingBody)}</p>
          <div class="stack">
            <Button variant="primary" big onClick={() => nav.go({ name: 'scan', ask: true }, { replace: true })}>
              {tr(T.modes.ask)}
            </Button>
            <Button onClick={() => nav.go({ name: 'guide' }, { replace: true })}>{tr(T.visit.thingsToDo)}</Button>
          </div>
        </>
      )}

      {step === 'quiet' && (
        <>
          <h1>{tr(T.visit.quietTitle)}</h1>
          <p class="lead">{tr(T.visit.quietBody)}</p>
          <div class="stack">
            <Button variant="primary" big onClick={() => setStep('hello')}>
              {tr(T.visit.tryAgain)}
            </Button>
            <Button onClick={() => nav.go({ name: 'noResponse' }, { replace: true })}>{tr(T.visit.thingsToDo)}</Button>
          </div>
        </>
      )}
    </Page>
  );
}
