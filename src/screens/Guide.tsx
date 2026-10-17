import { DraftNote, Page } from '../components/ui';
import { GUIDE } from '../content/guide';
import { T } from '../content/ui';
import { fill, formatDate } from '../i18n';
import { useLang } from '../state';

export function Guide() {
  const { tr, lang } = useLang();
  const today = formatDate(Date.now(), lang);
  return (
    <Page title={tr(T.home.guide)}>
      <DraftNote />
      {GUIDE.map((section, i) => (
        <details key={section.id} class="guide-section" open={i === 0}>
          <summary>{tr(section.title)}</summary>
          <ul>
            {section.items.map((item, j) => (
              <li key={j}>{fill(item, lang, { today })}</li>
            ))}
          </ul>
        </details>
      ))}
    </Page>
  );
}
