# Field Primo

A phone app that helps ICU patients who can't speak (intubated, very weak, lying
flat) communicate with the family member at their bedside, and helps that family
member know what to do.

**Status: v0.1 proof of concept.** All wording is a draft. Every medical item
(urgent flags, tips for the family, the family guide) is pending review by an ICU
nurse and a speech-language pathologist. Do not use with patients yet.

## What it does

- **Setup, one step at a time.** Walks a relative through finding the patient's
  most reliable YES signal (squeeze, finger, thumbs up, blink, look up, nod, or
  something else), choosing a NO signal, checking that yes/no is reliable with
  questions whose answers are known, checking whether the patient can read the
  screen, hear the phone, and tap, and asking the patient how they prefer to talk.
- **Three ways to talk**, all using the same phrase list:
  - *Pipindot siya / They tap*: big buttons for patients who can see and point.
  - *Isa-isang ipapakita / One at a time*: partner-assisted scanning. The relative
    offers options one at a time (or lets the phone say them) and presses YES when
    the patient signals. Works with eyes closed and with any yes signal.
  - *Tatanungin ko siya / I ask them*: the same, phrased as yes/no questions, for
    patients who prefer to be asked.
- **Every message is confirmed by the patient** ("Ito ba ang gusto mong
  sabihin?"), shown huge, and spoken aloud. Urgent ones show *TAWAGIN ANG NURSE
  NGAYON*. Some come with a suggestion for the relative (for "Anong araw ngayon?"
  it shows today's date).
- **Start of each visit**: a quick hello that re-checks the signal, then gives the
  patient the first word: "May gusto ka bang sabihin?"
- **History** of everything said, with times and whether the patient confirmed it.
  Never deleted automatically.
- **Bedside card** for the nurse, in Filipino and English, with the patient's
  yes/no signals and preferences.
- **Honest "can't respond right now" path** with things the family can still do.
- **Family guide**: arriving, how to talk, when to call the nurse, delirium,
  questions for the doctor, leaving.
- Filipino (Taglish) and English, switchable at any time.

## Privacy

Nothing leaves the phone. There is no server, no account, and no analytics. The
app is static files; after the first load it works offline. Data is kept in the
browser's local storage on that phone, and can be deleted from Settings.

## Running it

Requires Node 22.

```sh
npm install
npm run dev        # http://localhost:5173, and on your Wi-Fi network for phones
npm test           # unit tests for navigation, the yes/no check, and content
npm run build      # production build into dist/
npm run preview    # serve the production build
```

To try it on a phone during development, run `npm run dev`, then open the
"Network" URL it prints on a phone connected to the same Wi-Fi. (The offline
service worker only runs in the production build or on HTTPS.)

### Publishing

`.github/workflows/deploy.yml` publishes to GitHub Pages on every push to `main`.
One-time setup: repo **Settings → Pages → Source: GitHub Actions**. The app will
then be at `https://<user>.github.io/<repo>/`. Opening it once and choosing
"Add to Home screen" installs it.

## Code map

| Path | What's there |
| --- | --- |
| `src/content/phrases.ts` | Everything the patient can say: categories, phrases, urgent flags, family tips |
| `src/content/ui.ts` | All screen text in both languages |
| `src/content/signals.ts` | The yes/no signals families try |
| `src/content/guide.ts` | The family guide |
| `src/lib/tree.ts` | Partner-scanning logic (pure functions, tested) |
| `src/lib/profile.ts` | Patient profile, the yes/no reliability check, mode choice |
| `src/lib/speech.ts` | Text-to-speech with the phone's built-in voices |
| `src/state.tsx` | App state saved to the phone (settings, profile, history) |
| `src/screens/` | One file per screen |

Reviewers (native speakers, nurses, SLPs) only need to read the files in
`src/content/`.

Stack: [Preact](https://preactjs.com) (same API as React, ~4 KB), TypeScript,
Vite, and `vite-plugin-pwa` for offline support. Preact is the only runtime
dependency.

## Known limits of v0.1

- No spelling yet (planned next: letter-by-letter spelling with error-tolerant
  word guesses, always showing what was actually entered).
- Speech uses the phone's built-in voices. Many phones, including iPhones, have no
  Filipino voice, so Filipino text is read by a non-Filipino voice. Recorded human
  voices for the fixed phrases are planned.
- The tap screen scrolls when a list is long, which is hard for patients with
  imprecise hands.
- Profile and history can't yet be moved to another family member's phone.
