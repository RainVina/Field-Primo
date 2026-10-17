import type { Text } from '../i18n';

/*
 * Ways a patient might say YES, in the order families are asked to try them.
 * REVIEW STATUS: draft, pending speech-language pathologist review.
 */

export type SignalId = 'squeeze' | 'finger' | 'thumb' | 'blink' | 'look' | 'nod' | 'other';

export interface Signal {
  id: SignalId;
  label: Text;
  /** How the relative sets up the try. */
  how: Text;
  /** Completes "Kung naririnig mo ako, ___." */
  ask: Text;
  caution?: Text;
}

export const SIGNALS: Signal[] = [
  {
    id: 'squeeze',
    label: { fil: 'Pisil ng kamay', en: 'Hand squeeze' },
    how: {
      fil: 'Ilagay ang dalawang daliri mo sa palad niya.',
      en: 'Put two of your fingers in their palm.',
    },
    ask: { fil: 'pisilin mo ang kamay ko', en: 'squeeze my hand' },
    caution: {
      fil: 'Minsan kusang kumakapit ang kamay. Hintayin ang pisil na sumusunod sa sinabi mo, tapos ipabitaw: "Bitaw na."',
      en: 'Hands sometimes grip on their own. Look for a squeeze that follows your words, then ask them to let go: "Now let go."',
    },
  },
  {
    id: 'finger',
    label: { fil: 'Galaw ng daliri', en: 'Finger movement' },
    how: {
      fil: 'Hawakan nang magaan ang kamay niya para maramdaman mo kahit kaunting galaw.',
      en: 'Hold their hand lightly so you can feel even a small movement.',
    },
    ask: { fil: 'igalaw mo ang daliri mo', en: 'move your finger' },
  },
  {
    id: 'thumb',
    label: { fil: 'Thumbs up', en: 'Thumbs up' },
    how: { fil: 'Tingnan ang kamay niya.', en: 'Watch their hand.' },
    ask: { fil: 'mag-thumbs up ka', en: 'give me a thumbs up' },
  },
  {
    id: 'blink',
    label: { fil: 'Kurap', en: 'Blink' },
    how: {
      fil: 'Pumuwesto kung saan ka niya nakikita. Tingnan ang mata niya.',
      en: 'Stand where they can see you. Watch their eyes.',
    },
    ask: { fil: 'kumurap ka nang dahan-dahan', en: 'blink slowly' },
    caution: {
      fil: 'Kusang kumukurap ang mata. Hanapin ang mabagal at sadyang kurap.',
      en: 'Eyes blink on their own. Look for a slow, deliberate blink.',
    },
  },
  {
    id: 'look',
    label: { fil: 'Tingin pataas', en: 'Look up' },
    how: { fil: 'Tingnan ang mata niya.', en: 'Watch their eyes.' },
    ask: { fil: 'tumingin ka pataas', en: 'look up' },
  },
  {
    id: 'nod',
    label: { fil: 'Tango', en: 'Nod' },
    how: { fil: 'Tingnan ang ulo niya.', en: 'Watch their head.' },
    ask: { fil: 'tumango ka', en: 'nod your head' },
  },
];

export const OTHER_SIGNAL_LABEL: Text = { fil: 'Iba pa', en: 'Something else' };

export type NoSignal = 'twice' | 'headshake' | 'none';

export const NO_SIGNALS: { id: NoSignal; label: Text; caution?: Text }[] = [
  { id: 'twice', label: { fil: 'Parehong senyas, dalawang beses', en: 'Same signal, twice' } },
  { id: 'headshake', label: { fil: 'Iling ng ulo', en: 'Head shake' } },
  {
    id: 'none',
    label: { fil: 'Walang galaw', en: 'No movement' },
    caution: {
      fil: 'Mahirap ito: hindi mo malalaman kung "hindi" ang sagot niya o pagod lang siya. Mas mabuti ang "dalawang beses" kung kaya niya.',
      en: 'This is hard: you can\'t tell a "no" from being too tired to answer. "Twice" is better if they can do it.',
    },
  },
];
