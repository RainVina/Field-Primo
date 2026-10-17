import { Button, DraftNote, Page } from '../components/ui';
import { T } from '../content/ui';
import { fill, formatDate } from '../i18n';
import { useNav } from '../nav';
import { useLang } from '../state';

/*
 * When the patient can't respond (sedated, asleep, too weak), say so honestly,
 * and still give the family something meaningful to do.
 */
export function NoResponse() {
  const { tr, lang } = useLang();
  const nav = useNav();
  const today = formatDate(Date.now(), lang);
  return (
    <Page>
      <h1>{tr(T.noResponse.title)}</h1>
      <p class="lead">{tr(T.noResponse.body)}</p>
      <h2>{tr(T.noResponse.doTitle)}</h2>
      <ul class="do-list">
        {T.noResponse.items.map((item, i) => (
          <li key={i}>{fill(item, lang, { today })}</li>
        ))}
      </ul>
      <Button variant="primary" big onClick={nav.home}>
        {tr(T.noResponse.tryLater)}
      </Button>
      <DraftNote />
    </Page>
  );
}
