import type { Lang, Text } from '../i18n';
import { NO_SIGNALS, SIGNALS, type NoSignal, type SignalId } from '../content/signals';

export type Answer = 'yes' | 'no' | 'unsure';
export type Preference = 'self' | 'asked' | 'either' | 'unsure';
export type Mode = 'tap' | 'scan' | 'ask';

/** What setup learned about the patient. Stored only on this phone. */
export interface Profile {
  /** Real first name, used for the check questions and the bedside card. */
  name: string;
  /** What the family calls them ("Pa", "Lola Nena"). Used when talking to them. */
  callName: string;
  yesSignal: SignalId;
  /** Free-text description when yesSignal is "other". */
  yesOther: string;
  noSignal: NoSignal;
  /** Correct answers out of VERIFY_TOTAL in the last check. */
  verifyScore: number;
  canRead: Answer;
  hearsPhone: Answer;
  canPoint: Answer;
  preference: Preference;
  updatedAt: number;
}

// ---------------------------------------------------------------- Signal text

function signalName(p: Profile, lang: Lang): string {
  if (p.yesSignal === 'other') return p.yesOther;
  return SIGNALS.find((s) => s.id === p.yesSignal)!.label[lang];
}

export function yesLabel(p: Profile, lang: Lang): string {
  const name = signalName(p, lang);
  if (p.noSignal !== 'twice') return name;
  return lang === 'fil' ? `${name}, isang beses` : `${name}, once`;
}

export function noLabel(p: Profile, lang: Lang): string {
  if (p.noSignal !== 'twice') return NO_SIGNALS.find((s) => s.id === p.noSignal)!.label[lang];
  const name = signalName(p, lang);
  return lang === 'fil' ? `${name}, dalawang beses` : `${name}, twice`;
}

/** Completes "Kung naririnig mo ako, ___." for this patient's yes signal. */
export function yesAsk(p: Pick<Profile, 'yesSignal' | 'yesOther'>, lang: Lang): string {
  if (p.yesSignal === 'other') return lang === 'fil' ? `gawin mo ang senyas natin (${p.yesOther})` : `do our signal (${p.yesOther})`;
  return SIGNALS.find((s) => s.id === p.yesSignal)!.ask[lang];
}

/** "Pa" if set, else the name, else a neutral fallback. */
export function callNameOf(p: Pick<Profile, 'name' | 'callName'>, lang: Lang): string {
  return p.callName.trim() || p.name.trim() || (lang === 'fil' ? 'Mahal' : 'Dear');
}

// ---------------------------------------------------------------- Verification

/*
 * Before trusting a signal, the relative asks questions they already know the
 * answer to, mixing yes and no. REVIEW STATUS: draft, pending SLP review of the
 * questions and of the thresholds below.
 */

export interface CheckQuestion {
  text: Text;
  expected: 'yes' | 'no';
}

const WRONG_NAMES = ['Pedro', 'Maria', 'Jose', 'Rosa', 'Carlos', 'Linda'];

export function verifyQuestions(name: string): CheckQuestion[] {
  const hospital: CheckQuestion = { text: { fil: 'Nasa ospital ka ba ngayon?', en: 'Are you in the hospital now?' }, expected: 'yes' };
  const home: CheckQuestion = { text: { fil: 'Nasa bahay ka ba ngayon?', en: 'Are you at home now?' }, expected: 'no' };
  const clean = name.trim();
  if (clean) {
    const first = clean[0].toLowerCase();
    const wrong = WRONG_NAMES.find((n) => n[0].toLowerCase() !== first)!;
    return [
      hospital,
      { text: { fil: `Ang pangalan mo ba ay ${wrong}?`, en: `Is your name ${wrong}?` }, expected: 'no' },
      { text: { fil: `Ang pangalan mo ba ay ${clean}?`, en: `Is your name ${clean}?` }, expected: 'yes' },
      home,
    ];
  }
  return [
    hospital,
    { text: { fil: 'Nasa eroplano ka ba ngayon?', en: 'Are you on an airplane now?' }, expected: 'no' },
    { text: { fil: 'Tao ka ba?', en: 'Are you a person?' }, expected: 'yes' },
    home,
  ];
}

export const VERIFY_TOTAL = 4;

export type Reliability = 'reliable' | 'partly' | 'unreliable';

export function reliability(score: number): Reliability {
  if (score >= VERIFY_TOTAL) return 'reliable';
  if (score === VERIFY_TOTAL - 1) return 'partly';
  return 'unreliable';
}

export function scoreAnswers(questions: CheckQuestion[], answers: Answer[]): number {
  return questions.reduce((n, q, i) => n + (answers[i] === q.expected ? 1 : 0), 0);
}

// ---------------------------------------------------------------- Preference & mode

export function preferenceFrom(wantsSelf: Answer, wantsAsked: Answer): Preference {
  if (wantsSelf === 'yes' && wantsAsked === 'yes') return 'either';
  if (wantsSelf === 'yes') return 'self';
  if (wantsAsked === 'yes') return 'asked';
  return 'unsure';
}

/** The patient's own way of saying things, when they start the conversation. */
export function selfMode(p: Profile): Mode {
  return p.canPoint === 'yes' && p.canRead === 'yes' ? 'tap' : 'scan';
}

export function recommendedMode(p: Profile): Mode {
  return p.preference === 'asked' ? 'ask' : selfMode(p);
}
