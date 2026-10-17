import { Button, Page } from '../components/ui';
import { T } from '../content/ui';
import { formatDate, type Lang, type Text } from '../i18n';
import { VERIFY_TOTAL, callNameOf, noLabel, yesLabel } from '../lib/profile';
import { useApp, useLang } from '../state';

/*
 * A bedside card for the nurse, in both languages, so whoever is on shift knows
 * how this patient says yes and no when the family isn't there.
 */
export function Card() {
  const { profile } = useApp();
  const { tr } = useLang();
  if (!profile) return <Page title={tr(T.home.card)}>{null}</Page>;

  const both = (f: (lang: Lang) => string) => (
    <>
      {f('fil')}
      {f('fil') !== f('en') && <span class="card-en"> / {f('en')}</span>}
    </>
  );
  const label = (text: Text) => both((l) => text[l]);
  const name = [profile.name, profile.callName && profile.callName !== profile.name ? `(${profile.callName})` : '']
    .filter(Boolean)
    .join(' ');

  return (
    <Page title={tr(T.home.card)}>
      <p class="muted no-print">{tr(T.card.explain)}</p>
      <div class="bedside-card">
        <h2>{name || callNameOf(profile, 'fil')}</h2>
        <dl>
          <dt>{label(T.card.yes)}</dt>
          <dd class="card-big">{both((l) => yesLabel(profile, l))}</dd>
          <dt>{label(T.card.no)}</dt>
          <dd class="card-big">{both((l) => noLabel(profile, l))}</dd>
          <dt>{label(T.card.reliability)}</dt>
          <dd>
            {profile.verifyScore} / {VERIFY_TOTAL}
          </dd>
          <dt>{label(T.card.reads)}</dt>
          <dd>{label(T.answers[profile.canRead])}</dd>
          <dt>{label(T.card.hears)}</dt>
          <dd>{label(T.answers[profile.hearsPhone])}</dd>
          <dt>{label(T.card.prefers)}</dt>
          <dd>{label(T.preference[profile.preference])}</dd>
          <dt>{label(T.card.howTo)}</dt>
          <dd>{label(T.card.howToText)}</dd>
          <dt>{label(T.card.checked)}</dt>
          <dd>{formatDate(profile.updatedAt, 'en')}</dd>
        </dl>
      </div>
      <div class="no-print">
        <Button variant="primary" onClick={() => window.print()}>
          {tr(T.card.print)}
        </Button>
      </div>
    </Page>
  );
}
