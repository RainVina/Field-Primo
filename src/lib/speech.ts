import type { Lang } from '../i18n';

/*
 * Text-to-speech using the phone's built-in voices. Filipino voices are not
 * available on every phone; when there is none we still set the language and
 * let the phone choose. Recorded human voices will replace this for the fixed
 * phrases later.
 */

const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;
let voices: SpeechSynthesisVoice[] = [];

function refresh() {
  voices = speechSynthesis.getVoices();
}

if (supported) {
  refresh();
  speechSynthesis.addEventListener?.('voiceschanged', refresh);
}

const LANG_TAG: Record<Lang, string> = { fil: 'fil-PH', en: 'en-PH' };

function findVoice(lang: Lang): SpeechSynthesisVoice | undefined {
  const pattern = lang === 'fil' ? /^(fil|tl)\b/i : /^en[-_]PH/i;
  const fallback = lang === 'en' ? /^en\b/i : null;
  return voices.find((v) => pattern.test(v.lang)) ?? (fallback ? voices.find((v) => fallback.test(v.lang)) : undefined);
}

export function speechSupported(): boolean {
  return supported;
}

/** Name of the voice that will be used, or null if the phone has no voice for this language. */
export function voiceFor(lang: Lang): string | null {
  return findVoice(lang)?.name ?? null;
}

export function speak(text: string, lang: Lang, rate = 0.9): void {
  if (!supported) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = LANG_TAG[lang];
  const voice = findVoice(lang);
  if (voice) u.voice = voice;
  u.rate = rate;
  speechSynthesis.speak(u);
}

export function stopSpeaking(): void {
  if (supported) speechSynthesis.cancel();
}
