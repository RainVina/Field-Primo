import { Button, Page } from '../components/ui';
import { T } from '../content/ui';
import { formatDate, formatTime } from '../i18n';
import type { HistoryEntry } from '../state';
import { useApp, useLang } from '../state';

/** Everything the patient said on this phone, newest first, grouped by day. */
export function History() {
  const { history, clearHistory } = useApp();
  const { tr, lang } = useLang();

  const days: { day: string; entries: HistoryEntry[] }[] = [];
  for (const e of history) {
    const day = formatDate(e.at, lang);
    if (days[days.length - 1]?.day !== day) days.push({ day, entries: [] });
    days[days.length - 1].entries.push(e);
  }

  const status = (e: HistoryEntry) =>
    e.status === 'confirmed' ? `✓ ${tr(T.history.confirmed)}` : e.status === 'rejected' ? `✗ ${tr(T.history.rejected)}` : `? ${tr(T.history.pending)}`;

  return (
    <Page title={tr(T.history.title)}>
      {history.length === 0 && <p class="lead">{tr(T.history.empty)}</p>}
      {days.map((d) => (
        <section key={d.day}>
          <h2>{d.day}</h2>
          <ul class="history">
            {d.entries.map((e) => (
              <li key={e.id} class={`history-item ${e.status} ${e.urgent ? 'urgent' : ''}`}>
                <span class="history-time">{formatTime(e.at, lang)}</span>
                <span class="history-text">{e.text[lang]}</span>
                <span class="history-status">{status(e)}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
      {history.length > 0 && (
        <Button
          variant="danger"
          onClick={() => {
            if (confirm(tr(T.history.clearConfirm))) clearHistory();
          }}
        >
          {tr(T.history.clear)}
        </Button>
      )}
    </Page>
  );
}
