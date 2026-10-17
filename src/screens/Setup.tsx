import { useState } from 'preact/hooks';
import { AnswerButtons, Button, DraftNote, Page } from '../components/ui';
import { NO_SIGNALS, OTHER_SIGNAL_LABEL, SIGNALS, type NoSignal, type SignalId } from '../content/signals';
import { T } from '../content/ui';
import { fill } from '../i18n';
import {
  VERIFY_TOTAL,
  callNameOf,
  noLabel,
  preferenceFrom,
  recommendedMode,
  reliability,
  scoreAnswers,
  verifyQuestions,
  yesAsk,
  yesLabel,
  type Answer,
  type Profile,
} from '../lib/profile';
import { speak, speechSupported } from '../lib/speech';
import { modeScreen, useNav } from '../nav';
import { useApp, useLang } from '../state';

/*
 * Step-by-step setup for a relative who is probably frightened and in a hurry.
 * One instruction per screen, big buttons, and every step can be answered
 * "not sure". The result is a Profile saved on the phone, so later visits
 * skip straight to a quick hello check.
 */

type Step =
  | 'intro'
  | 'awake'
  | 'name'
  | 'signal'
  | 'try'
  | 'no'
  | 'verify'
  | 'verifyResult'
  | 'eyes'
  | 'vision'
  | 'visionResult'
  | 'hear'
  | 'point'
  | 'pointTest'
  | 'pointResult'
  | 'pref'
  | 'done';

const EMPTY: Profile = {
  name: '',
  callName: '',
  yesSignal: 'squeeze',
  yesOther: '',
  noSignal: 'twice',
  verifyScore: 0,
  canRead: 'unsure',
  hearsPhone: 'unsure',
  canPoint: 'unsure',
  preference: 'unsure',
  updatedAt: 0,
};

export function Setup() {
  const { profile, setProfile, settings } = useApp();
  const { tr, lang } = useLang();
  const nav = useNav();

  const [step, setStep] = useState<Step>('intro');
  // Redoing setup starts from what we already know (names especially).
  const [p, setP] = useState<Profile>(() => ({ ...EMPTY, ...profile }));
  const [failed, setFailed] = useState<SignalId[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [visionAnswers, setVisionAnswers] = useState<Answer[]>([]);
  const [pointHits, setPointHits] = useState<boolean[]>([]);
  const [prefAnswers, setPrefAnswers] = useState<Answer[]>([]);

  const update = (patch: Partial<Profile>) => setP((prev) => ({ ...prev, ...patch }));
  const call = callNameOf(p, lang);
  const questions = verifyQuestions(p.name);

  const finish = (patch: Partial<Profile>) => {
    const final = { ...p, ...patch, updatedAt: Date.now() };
    setP(final);
    setProfile(final);
    setStep('done');
  };

  let body;
  switch (step) {
    case 'intro':
      body = (
        <>
          <h1>{tr(T.setup.introTitle)}</h1>
          <p class="lead">{tr(T.setup.introBody)}</p>
          <Button variant="primary" big onClick={() => setStep('awake')}>
            {tr(T.setup.begin)}
          </Button>
        </>
      );
      break;

    case 'awake':
      body = (
        <>
          <h1>{tr(T.setup.awakeQ)}</h1>
          <div class="stack">
            <Button variant="primary" big onClick={() => setStep('name')}>
              {tr(T.setup.awakeYes)}
            </Button>
            <Button big onClick={() => nav.go({ name: 'noResponse' }, { replace: true })}>
              {tr(T.setup.awakeNo)}
            </Button>
          </div>
        </>
      );
      break;

    case 'name':
      body = (
        <>
          <h1>{tr(T.setup.nameTitle)}</h1>
          <label class="field">
            {tr(T.setup.nameLabel)}
            <input value={p.name} onInput={(e) => update({ name: e.currentTarget.value })} autocomplete="off" />
          </label>
          <label class="field">
            {tr(T.setup.callLabel)}
            <input value={p.callName} onInput={(e) => update({ callName: e.currentTarget.value })} autocomplete="off" />
          </label>
          <p class="muted">{tr(T.setup.nameNote)}</p>
          <Button variant="primary" big onClick={() => setStep('signal')}>
            {tr(T.common.next)}
          </Button>
        </>
      );
      break;

    case 'signal':
      body = (
        <>
          <h1>{tr(T.setup.signalTitle)}</h1>
          <p>{tr(T.setup.signalBody)}</p>
          <div class="stack">
            {SIGNALS.map((s) => (
              <Button
                key={s.id}
                big
                variant={failed.includes(s.id) ? 'quiet' : 'primary'}
                onClick={() => {
                  update({ yesSignal: s.id });
                  setStep('try');
                }}
              >
                {s.label[lang]}
                {failed.includes(s.id) && <span class="muted"> · {tr(T.setup.didntWork)}</span>}
              </Button>
            ))}
            <label class="field">
              {tr(OTHER_SIGNAL_LABEL)}: {tr(T.setup.otherLabel)}
              <input value={p.yesOther} onInput={(e) => update({ yesOther: e.currentTarget.value })} />
            </label>
            {p.yesOther.trim() && (
              <Button
                big
                onClick={() => {
                  update({ yesSignal: 'other' });
                  setStep('try');
                }}
              >
                {tr(T.setup.tryThis)}: {p.yesOther}
              </Button>
            )}
            <Button onClick={() => nav.go({ name: 'noResponse' }, { replace: true })}>{tr(T.setup.noneWorked)}</Button>
          </div>
        </>
      );
      break;

    case 'try': {
      const signal = SIGNALS.find((s) => s.id === p.yesSignal);
      body = (
        <>
          <h1>{p.yesSignal === 'other' ? p.yesOther : signal!.label[lang]}</h1>
          <ol class="steps">
            {signal && <li>{signal.how[lang]}</li>}
            <li>
              {tr(T.setup.tryStep2)}
              <p class="say-line">{fill(T.setup.tryLine, lang, { call, ask: yesAsk(p, lang) })}</p>
            </li>
            <li>{tr(T.setup.tryStep3)}</li>
          </ol>
          {signal?.caution && <p class="note">{signal.caution[lang]}</p>}
          <h2>{tr(T.setup.tryQ)}</h2>
          <div class="stack">
            <Button variant="yes" big onClick={() => setStep('no')}>
              {tr(T.setup.tryWorked)}
            </Button>
            <Button
              big
              onClick={() => {
                if (p.yesSignal !== 'other') setFailed((f) => [...f, p.yesSignal]);
                setStep('signal');
              }}
            >
              {tr(T.setup.tryFailed)}
            </Button>
          </div>
        </>
      );
      break;
    }

    case 'no': {
      const options = NO_SIGNALS.filter((n) => n.id !== 'headshake' || p.yesSignal === 'nod');
      body = (
        <>
          <h1>{tr(T.setup.noTitle)}</h1>
          <p>{tr(T.setup.noBody)}</p>
          <div class="stack">
            {options.map((n) => (
              <div key={n.id}>
                <Button
                  big
                  variant="primary"
                  onClick={() => {
                    update({ noSignal: n.id as NoSignal });
                    setAnswers([]);
                    setStep('verify');
                  }}
                >
                  {n.label[lang]}
                </Button>
                {n.caution && <p class="note">{n.caution[lang]}</p>}
              </div>
            ))}
          </div>
        </>
      );
      break;
    }

    case 'verify': {
      const i = answers.length;
      const q = questions[i];
      const record = (a: Answer) => {
        const next = [...answers, a];
        setAnswers(next);
        if (next.length === questions.length) {
          update({ verifyScore: scoreAnswers(questions, next) });
          setStep('verifyResult');
        }
      };
      body = (
        <>
          {i === 0 && (
            <>
              <h1>{tr(T.setup.verifyTitle)}</h1>
              <p>{tr(T.setup.verifyBody)}</p>
            </>
          )}
          <p class="muted">{fill(T.setup.verifyProgress, lang, { n: String(i + 1), total: String(questions.length) })}</p>
          <p class="signal-reminder">
            {fill(T.common.signalReminder, lang, { yes: yesLabel(p, lang), no: noLabel(p, lang) })}
          </p>
          <p class="say-line big">{q.text[lang]}</p>
          <AnswerButtons onYes={() => record('yes')} onNo={() => record('no')} onUnsure={() => record('unsure')} />
        </>
      );
      break;
    }

    case 'verifyResult': {
      const r = reliability(p.verifyScore);
      body = (
        <>
          <h1>{tr(r === 'reliable' ? T.setup.reliable : r === 'partly' ? T.setup.partly : T.setup.unreliable)}</h1>
          <p class="muted">
            {fill(T.setup.verifyScore, lang, { score: String(p.verifyScore), total: String(VERIFY_TOTAL) })}
          </p>
          {r === 'unreliable' && <p>{tr(T.setup.unreliableBody)}</p>}
          <div class="stack">
            {r !== 'unreliable' && (
              <Button variant="primary" big onClick={() => setStep('eyes')}>
                {tr(T.common.next)}
              </Button>
            )}
            <Button
              big={r === 'unreliable'}
              variant={r === 'unreliable' ? 'primary' : 'quiet'}
              onClick={() => {
                setAnswers([]);
                setStep('verify');
              }}
            >
              {tr(T.setup.retry)}
            </Button>
            {r === 'unreliable' && <Button onClick={() => setStep('eyes')}>{tr(T.setup.continueAnyway)}</Button>}
          </div>
        </>
      );
      break;
    }

    case 'eyes':
      body = (
        <>
          <h1>{tr(T.setup.eyesQ)}</h1>
          <div class="stack">
            <Button
              variant="primary"
              big
              onClick={() => {
                setVisionAnswers([]);
                setStep('vision');
              }}
            >
              {tr(T.answers.yes)}
            </Button>
            <Button
              big
              onClick={() => {
                update({ canRead: 'no', canPoint: 'no' });
                setStep('hear');
              }}
            >
              {tr(T.setup.eyesClosed)}
            </Button>
          </div>
        </>
      );
      break;

    case 'vision': {
      // Q1 expects NO (it doesn't say KAPE), Q2 expects YES.
      const i = visionAnswers.length;
      const record = (a: Answer) => {
        const next = [...visionAnswers, a];
        setVisionAnswers(next);
        if (next.length === 2) {
          update({ canRead: next[0] === 'no' && next[1] === 'yes' ? 'yes' : 'no' });
          setStep('visionResult');
        }
      };
      body = (
        <>
          <p>{tr(T.setup.visionHold)}</p>
          <p class="say-line">{tr(i === 0 ? T.setup.visionQ1 : T.setup.visionQ2)}</p>
          <div class="vision-word">{tr(T.setup.visionWord)}</div>
          <AnswerButtons onYes={() => record('yes')} onNo={() => record('no')} onUnsure={() => record('unsure')} />
        </>
      );
      break;
    }

    case 'visionResult':
      body = (
        <>
          <h1>{tr(p.canRead === 'yes' ? T.setup.visionYes : T.setup.visionNo)}</h1>
          <Button
            variant="primary"
            big
            onClick={() => {
              if (p.canRead !== 'yes') update({ canPoint: 'no' });
              setStep('hear');
            }}
          >
            {tr(T.common.next)}
          </Button>
        </>
      );
      break;

    case 'hear': {
      const next = () => setStep(p.canRead === 'yes' ? 'point' : 'pref');
      body = (
        <>
          <h1>{tr(T.setup.hearTitle)}</h1>
          {speechSupported() ? (
            <>
              <p>{tr(T.setup.hearBody)}</p>
              <Button
                variant="primary"
                big
                onClick={() => speak(fill(T.setup.hearLine, lang, { call, ask: yesAsk(p, lang) }), lang, settings.rate)}
              >
                ▶ {tr(T.setup.play)}
              </Button>
              <h2>{tr(T.setup.hearQ)}</h2>
              <AnswerButtons
                onYes={() => {
                  update({ hearsPhone: 'yes' });
                  next();
                }}
                onNo={() => {
                  update({ hearsPhone: 'no' });
                  next();
                }}
                onUnsure={() => {
                  update({ hearsPhone: 'unsure' });
                  next();
                }}
                unsureLabel={tr(T.common.unsure)}
              />
            </>
          ) : (
            <>
              <p>{tr(T.settings.noSpeech)}</p>
              <Button onClick={next}>{tr(T.common.skip)}</Button>
            </>
          )}
          <p class="note">{tr(T.setup.hardOfHearing)}</p>
        </>
      );
      break;
    }

    case 'point':
      body = (
        <>
          <h1>{tr(T.setup.pointTitle)}</h1>
          <p>{tr(T.setup.pointBody)}</p>
          <div class="stack">
            <Button
              variant="primary"
              big
              onClick={() => {
                setPointHits([]);
                setStep('pointTest');
              }}
            >
              {tr(T.setup.pointTry)}
            </Button>
            <Button
              big
              onClick={() => {
                update({ canPoint: 'no' });
                setStep('pointResult');
              }}
            >
              {tr(T.setup.pointCant)}
            </Button>
          </div>
        </>
      );
      break;

    case 'pointTest': {
      // Target is on top for the first try and on the bottom for the second.
      const round = pointHits.length;
      const targetTop = round === 0;
      const hit = (top: boolean) => {
        const next = [...pointHits, top === targetTop];
        setPointHits(next);
        if (next.length === 2) {
          const hits = next.filter(Boolean).length;
          update({ canPoint: hits === 2 ? 'yes' : hits === 1 ? 'unsure' : 'no' });
          setStep('pointResult');
        }
      };
      const zone = (top: boolean) => (
        <button class={`point-zone ${top === targetTop ? 'target' : ''}`} onClick={() => hit(top)}>
          {top === targetTop ? tr(T.setup.pointTarget) : ''}
        </button>
      );
      return (
        <div class="point-test">
          {zone(true)}
          <p class="point-round">{fill(T.setup.pointRound, lang, { n: String(round + 1) })}</p>
          {zone(false)}
        </div>
      );
    }

    case 'pointResult':
      body = (
        <>
          <h1>{tr(p.canPoint === 'yes' ? T.setup.pointYes : T.setup.pointNo)}</h1>
          <Button
            variant="primary"
            big
            onClick={() => {
              setPrefAnswers([]);
              setStep('pref');
            }}
          >
            {tr(T.common.next)}
          </Button>
        </>
      );
      break;

    case 'pref': {
      const i = prefAnswers.length;
      const record = (a: Answer) => {
        const next = [...prefAnswers, a];
        setPrefAnswers(next);
        if (next.length === 2) finish({ preference: preferenceFrom(next[0], next[1]) });
      };
      body = (
        <>
          {i === 0 && <h1>{tr(T.setup.prefTitle)}</h1>}
          {i === 0 && <p class="note">{tr(T.setup.prefNote)}</p>}
          <p class="say-line big">{tr(i === 0 ? T.setup.prefQ1 : T.setup.prefQ2)}</p>
          <AnswerButtons onYes={() => record('yes')} onNo={() => record('no')} onUnsure={() => record('unsure')} />
        </>
      );
      break;
    }

    case 'done': {
      const mode = recommendedMode(p);
      const modeLabel = tr(mode === 'tap' ? T.modes.tap : mode === 'scan' ? T.modes.scan : T.modes.ask);
      body = (
        <>
          <h1>{tr(T.setup.doneTitle)}</h1>
          <dl class="summary">
            <dt>{tr(T.card.yes)}</dt>
            <dd>{yesLabel(p, lang)}</dd>
            <dt>{tr(T.card.no)}</dt>
            <dd>{noLabel(p, lang)}</dd>
            <dt>{tr(T.card.reliability)}</dt>
            <dd>{fill(T.setup.verifyScore, lang, { score: String(p.verifyScore), total: String(VERIFY_TOTAL) })}</dd>
            <dt>{tr(T.card.reads)}</dt>
            <dd>{tr(T.answers[p.canRead])}</dd>
            <dt>{tr(T.card.hears)}</dt>
            <dd>{tr(T.answers[p.hearsPhone])}</dd>
            <dt>{tr(T.card.prefers)}</dt>
            <dd>{tr(T.preference[p.preference])}</dd>
            <dt>{tr(T.setup.doneMode)}</dt>
            <dd>
              <strong>{modeLabel}</strong>
            </dd>
          </dl>
          <div class="stack">
            <Button variant="primary" big onClick={() => nav.go(modeScreen(mode), { replace: true })}>
              {tr(T.setup.doneStart)}
            </Button>
            <Button onClick={() => nav.go({ name: 'card' }, { replace: true })}>{tr(T.setup.doneCard)}</Button>
          </div>
        </>
      );
      break;
    }
  }

  return (
    <Page title={tr(T.setup.title)}>
      {body}
      <DraftNote />
    </Page>
  );
}
