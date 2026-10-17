import { describe, expect, it } from 'vitest';
import {
  noLabel,
  preferenceFrom,
  recommendedMode,
  reliability,
  scoreAnswers,
  verifyQuestions,
  yesLabel,
  type Profile,
} from '../src/lib/profile';

const base: Profile = {
  name: 'Roberto',
  callName: 'Pa',
  yesSignal: 'squeeze',
  yesOther: '',
  noSignal: 'twice',
  verifyScore: 4,
  canRead: 'yes',
  hearsPhone: 'yes',
  canPoint: 'yes',
  preference: 'self',
  updatedAt: 0,
};

describe('yes/no check', () => {
  it('mixes yes and no answers so a patient who always signals yes fails', () => {
    const qs = verifyQuestions('Roberto');
    expect(qs.filter((q) => q.expected === 'yes')).toHaveLength(2);
    expect(scoreAnswers(qs, ['yes', 'yes', 'yes', 'yes'])).toBe(2);
    expect(reliability(2)).toBe('unreliable');
  });

  it('never uses a wrong name that starts like the real one', () => {
    const wrong = verifyQuestions('Pedro')[1].text.en;
    expect(wrong).not.toMatch(/Pedro/);
    expect(wrong).not.toMatch(/ P/);
  });

  it('works without a name', () => {
    const qs = verifyQuestions('  ');
    expect(qs).toHaveLength(4);
    expect(scoreAnswers(qs, ['yes', 'no', 'yes', 'no'])).toBe(4);
  });

  it('treats 3 of 4 as partly reliable', () => {
    expect(reliability(4)).toBe('reliable');
    expect(reliability(3)).toBe('partly');
  });
});

describe('signals and modes', () => {
  it('describes yes and no for the bedside card', () => {
    expect(yesLabel(base, 'fil')).toBe('Pisil ng kamay, isang beses');
    expect(noLabel(base, 'en')).toBe('Hand squeeze, twice');
    expect(yesLabel({ ...base, yesSignal: 'other', yesOther: 'raises eyebrows' }, 'en')).toBe('raises eyebrows, once');
  });

  it('respects the patient preference', () => {
    expect(preferenceFrom('yes', 'no')).toBe('self');
    expect(preferenceFrom('no', 'yes')).toBe('asked');
    expect(preferenceFrom('yes', 'yes')).toBe('either');
    expect(recommendedMode({ ...base, preference: 'asked' })).toBe('ask');
  });

  it('only recommends tapping when they can both read and point', () => {
    expect(recommendedMode(base)).toBe('tap');
    expect(recommendedMode({ ...base, canRead: 'no' })).toBe('scan');
    expect(recommendedMode({ ...base, canPoint: 'unsure' })).toBe('scan');
  });
});
