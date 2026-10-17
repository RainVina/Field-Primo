import { useEffect, useState } from 'preact/hooks';
import { Button, Page } from '../components/ui';
import { T } from '../content/ui';
import { speak, speechSupported, voiceFor } from '../lib/speech';
import { useNav } from '../nav';
import { useApp, useLang, type Settings as S } from '../state';

export function Settings() {
  const { settings, setSettings, setProfile, clearHistory } = useApp();
  const { tr, lang } = useLang();
  const nav = useNav();

  // Voices load asynchronously on some phones; re-check shortly after opening.
  const [voice, setVoice] = useState(voiceFor(lang));
  useEffect(() => {
    setVoice(voiceFor(lang));
    const id = setTimeout(() => setVoice(voiceFor(lang)), 800);
    return () => clearTimeout(id);
  }, [lang]);

  const sizes: S['textScale'][] = [1, 1.25, 1.5];

  return (
    <Page title={tr(T.home.settings)}>
      <h2>{tr(T.settings.language)}</h2>
      <div class="lang-toggle">
        <button class={lang === 'fil' ? 'on' : ''} onClick={() => setSettings({ lang: 'fil' })}>
          Filipino
        </button>
        <button class={lang === 'en' ? 'on' : ''} onClick={() => setSettings({ lang: 'en' })}>
          English
        </button>
      </div>

      <h2>{tr(T.settings.textSize)}</h2>
      <div class="lang-toggle">
        {sizes.map((s) => (
          <button key={s} class={settings.textScale === s ? 'on' : ''} onClick={() => setSettings({ textScale: s })}>
            <span style={{ fontSize: `${s}em` }}>A</span>
          </button>
        ))}
      </div>

      <h2>{tr(T.settings.voice)}</h2>
      {speechSupported() ? (
        <>
          <p>{voice ?? <span class="warn">{tr(T.settings.noVoice)}</span>}</p>
          <label class="toggle">
            <input
              type="checkbox"
              checked={settings.speakOptions}
              onChange={(e) => setSettings({ speakOptions: e.currentTarget.checked })}
            />
            {tr(T.settings.speakOptions)}
          </label>
          <label class="field">
            {tr(T.settings.rate)}
            <input
              type="range"
              min="0.6"
              max="1.3"
              step="0.1"
              value={settings.rate}
              onInput={(e) => setSettings({ rate: Number(e.currentTarget.value) })}
            />
            <span class="range-labels">
              <span>{tr(T.settings.slower)}</span>
              <span>{tr(T.settings.faster)}</span>
            </span>
          </label>
          <Button onClick={() => speak(tr(T.settings.testLine), lang, settings.rate)}>🔊 {tr(T.settings.test)}</Button>
        </>
      ) : (
        <p class="warn">{tr(T.settings.noSpeech)}</p>
      )}

      <p class="muted">{tr(T.common.privacy)}</p>
      <Button
        variant="danger"
        onClick={() => {
          if (!confirm(tr(T.settings.deleteAllConfirm))) return;
          setProfile(null);
          clearHistory();
          nav.home();
        }}
      >
        {tr(T.settings.deleteAll)}
      </Button>
    </Page>
  );
}
