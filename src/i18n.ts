export type Lang = 'fil' | 'en';

/** Every piece of user-facing text exists in both languages. */
export type Text = Record<Lang, string>;

/** Replace {placeholders} in a text, e.g. fill(T, lang, { call: 'Pa' }). */
export function fill(text: Text, lang: Lang, vars: Record<string, string> = {}): string {
  return text[lang].replace(/\{(\w+)\}/g, (match, key: string) => vars[key] ?? match);
}

export function formatDate(at: number, lang: Lang): string {
  return new Intl.DateTimeFormat(lang === 'fil' ? 'fil-PH' : 'en-PH', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(at);
}

export function formatTime(at: number, lang: Lang): string {
  return new Intl.DateTimeFormat(lang === 'fil' ? 'fil-PH' : 'en-PH', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(at);
}
