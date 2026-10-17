import type { Text } from '../i18n';

/*
 * All screen text, grouped by screen. Filipino is written the way families talk
 * (Taglish where natural). REVIEW STATUS: draft, needs a native-speaker pass;
 * anything clinical needs nurse / SLP review.
 */

const t = (fil: string, en: string): Text => ({ fil, en });

export const T = {
  appName: t('Field Primo', 'Field Primo'),

  common: {
    back: t('Balik', 'Back'),
    home: t('Home', 'Home'),
    yes: t('OO', 'YES'),
    no: t('HINDI', 'NO'),
    noAnswer: t('Walang sagot', 'No answer'),
    unsure: t('Hindi sigurado', 'Not sure'),
    next: t('Susunod', 'Next'),
    skip: t('Laktawan', 'Skip'),
    cancel: t('Huwag na', 'Cancel'),
    draft: t('Draft — susuriin pa ng nurse at speech pathologist.', 'Draft — pending review by a nurse and speech pathologist.'),
    signalReminder: t('OO = {yes} · HINDI = {no}', 'YES = {yes} · NO = {no}'),
    privacy: t(
      'Lahat ng impormasyon ay nasa phone na ito lang. Walang ipinapadala kahit saan.',
      'Everything stays on this phone. Nothing is sent anywhere.',
    ),
  },

  answers: {
    yes: t('Oo', 'Yes'),
    no: t('Hindi', 'No'),
    unsure: t('Hindi sigurado', 'Not sure'),
  },

  preference: {
    self: t('Gusto niyang siya ang pumili ng sasabihin', 'Wants to choose what to say themselves'),
    asked: t('Gusto niyang tanungin siya', 'Wants to be asked questions'),
    either: t('Okay sa kanya pareho', 'Fine with either'),
    unsure: t('Hindi pa alam', 'Not known yet'),
  },

  modes: {
    tap: t('Pipindot siya', 'They tap'),
    tapDesc: t('Kung nakikita at naaabot niya ang screen.', 'If they can see and reach the screen.'),
    scan: t('Isa-isang ipapakita', 'One at a time'),
    scanDesc: t(
      'Ikaw ang magbabasa o magpapakita ng pagpipilian. Sesenyas siya sa gusto niya.',
      'You read or show the options. They signal at the one they want.',
    ),
    ask: t('Tatanungin ko siya', 'I ask them'),
    askDesc: t('Mga OO/HINDI na tanong, isa-isa.', 'Yes/no questions, one at a time.'),
    recommended: t('Inirerekomenda', 'Recommended'),
  },

  welcome: {
    tagline: t(
      'Para maintindihan ang mahal mo sa ICU na hindi makapagsalita.',
      "Helps you understand your loved one in the ICU who can't speak.",
    ),
    body: t(
      'Tutulungan ka nitong hanapin kung paano siya makakasagot, at bibigyan siya ng paraan para masabi ang gusto niya.',
      'This helps you find how they can answer, and gives them a way to say what they want.',
    ),
    start: t('Simulan', 'Start'),
  },

  home: {
    forPatient: t('Para kay {call}', 'For {call}'),
    startVisit: t('Simulan ang bisita', 'Start the visit'),
    ways: t('Paraan ng pag-uusap', 'Ways to talk'),
    history: t('Mga nasabi niya', 'What they said'),
    card: t('Card para sa nurse', 'Card for the nurse'),
    guide: t('Gabay para sa pamilya', 'Guide for family'),
    settings: t('Settings', 'Settings'),
    redoSetup: t('Ulitin ang setup', 'Redo setup'),
    notResponding: t('Hindi siya sumasagot ngayon', "They aren't responding right now"),
    iosInstall: t(
      'Sa iPhone: pindutin ang Share (⬆) → "Add to Home Screen", tapos doon ito buksan. Kung hindi, baka burahin ng iPhone ang setup at mga nasabi niya pagkalipas ng ilang araw.',
      'On iPhone: tap Share (⬆) → "Add to Home Screen", then open it from there. Otherwise the iPhone may delete the setup and history after a few days.',
    ),
    unreliable: t(
      'Hindi pa sigurado ang OO/HINDI niya. Ulitin ang check bago umasa sa mga sagot.',
      "Their yes/no isn't reliable yet. Redo the check before relying on answers.",
    ),
  },

  visit: {
    helloTitle: t('Kumustahin muna siya', 'Say hello first'),
    helloSay: t('Hawakan siya at sabihin:', 'Touch them gently and say:'),
    helloLine: t('"{call}, nandito ako. Kung naririnig mo ako, {ask}."', '"{call}, I\'m here. If you can hear me, {ask}."'),
    responded: t('Sumagot siya', 'They responded'),
    noResponse: t('Hindi sumagot', 'No response'),
    askTitle: t('Ngayon, itanong:', 'Now ask:'),
    askLine: t('"May gusto ka bang sabihin?"', '"Is there something you want to say?"'),
    nothingTitle: t('Okay. Hindi kailangang laging may sasabihin.', "Okay. There doesn't always have to be something to say."),
    nothingBody: t(
      'Pwede mo siyang tanungin isa-isa kung gusto niya, o samahan mo lang siya.',
      'You can ask them questions one at a time if they want, or simply be with them.',
    ),
    thingsToDo: t('Mga pwedeng gawin habang nandito', 'Things to do while you are here'),
    quietTitle: t('Baka natutulog o pagod lang siya.', 'They may be asleep or just tired.'),
    quietBody: t(
      'Subukan ulit pagkalipas ng ilang minuto. Hindi natin alam kung naririnig ka niya, pero ligtas at mabuti na kausapin mo pa rin siya.',
      "Try again in a few minutes. We don't know if they can hear you, but it is safe and good to keep talking to them.",
    ),
    tryAgain: t('Subukan ulit', 'Try again'),
  },

  scan: {
    instruction: t('Basahin o ipakita ito. Hintayin ang senyas niya.', 'Read or show this. Wait for their signal.'),
    askInstruction: t('Itanong ito. Hintayin ang sagot niya.', 'Ask this. Wait for their answer.'),
    noNext: t('HINDI / susunod', 'NO / next'),
    repeat: t('Ulitin', 'Repeat'),
    stop: t('Tigil', 'Stop'),
    wrapped: t('Balik sa simula ng listahan', 'Back to the start of the list'),
    phoneVoice: t('Boses ng phone', 'Phone voice'),
    stoppedTitle: t('Tumigil muna.', 'Stopped for now.'),
    stoppedBody: t('Hayaan siyang magpahinga. Sabihin: "Okay lang. Nandito lang ako."', 'Let them rest. Say: "It\'s okay. I\'m right here."'),
    askEndTitle: t('Wala na raw siyang ibang gustong sabihin ngayon.', 'They have nothing else to say for now.'),
    askEndBody: t(
      'Sabihin: "Sige. Sabihin mo lang kung may kailangan ka. Nandito lang ako."',
      'Say: "Okay. Let me know if you need anything. I\'m right here."',
    ),
  },

  tap: {
    title: t('Pindutin ang gusto mong sabihin', 'Tap what you want to say'),
  },

  message: {
    confirmQ: t('Ito ba ang gusto mong sabihin?', 'Is this what you want to say?'),
    confirmHint: t('Itanong sa kanya at hintayin ang OO o HINDI.', 'Ask them and wait for yes or no.'),
    urgent: t('TAWAGIN ANG NURSE NGAYON', 'CALL THE NURSE NOW'),
    confirmed: t('Naintindihan.', 'Understood.'),
    rejected: t('Okay, subukan ulit.', "Okay, let's try again."),
    tipTitle: t('Para sa iyo:', 'For you:'),
    tryAgain: t('Subukan ulit', 'Try again'),
    more: t('May iba pa?', 'Something else?'),
    done: t('Tapos na muna', 'Done for now'),
    repeat: t('Ulitin ang boses', 'Say it again'),
  },

  history: {
    title: t('Mga nasabi niya', 'What they said'),
    empty: t('Wala pang nasasabi.', 'Nothing said yet.'),
    confirmed: t('Kinumpirma niya', 'Confirmed'),
    rejected: t('Hindi ito ang ibig niyang sabihin', 'Not what they meant'),
    pending: t('Hindi nakumpirma', 'Not confirmed'),
    clear: t('Burahin lahat', 'Delete all'),
    clearConfirm: t(
      'Buburahin ang lahat ng nasabi niya sa phone na ito. Hindi na ito maibabalik. Sigurado ka ba?',
      "This deletes everything they said from this phone. It can't be undone. Are you sure?",
    ),
  },

  card: {
    explain: t(
      'Ipakita ito sa nurse, o kopyahin sa papel at iwan sa tabi ng kama.',
      'Show this to the nurse, or copy it onto paper and leave it at the bedside.',
    ),
    print: t('I-print', 'Print'),
    patient: t('Pasyente', 'Patient'),
    yes: t('OO', 'YES'),
    no: t('HINDI', 'NO'),
    reads: t('Nakakabasa ng malaking text', 'Can read large text'),
    hears: t('Naririnig ang phone', 'Hears the phone'),
    prefers: t('Gusto', 'Prefers'),
    howTo: t('Paano kausapin', 'How to talk with them'),
    howToText: t(
      'Isang OO/HINDI na tanong lang bawat isa. Maghintay ng hanggang 10 segundo bago magtanong ulit.',
      'Ask one yes/no question at a time. Wait up to 10 seconds before asking again.',
    ),
    checked: t('Huling check', 'Last checked'),
    reliability: t('OO/HINDI na maaasahan', 'Reliable yes/no'),
  },

  settings: {
    language: t('Wika / Language', 'Wika / Language'),
    speakOptions: t('Basahin nang malakas ang bawat pagpipilian', 'Read each option aloud'),
    rate: t('Bilis ng boses', 'Voice speed'),
    slower: t('Mas mabagal', 'Slower'),
    faster: t('Mas mabilis', 'Faster'),
    textSize: t('Laki ng text', 'Text size'),
    voice: t('Boses sa phone na ito', 'Voice on this phone'),
    noVoice: t(
      'Walang Filipino na boses sa phone na ito, kaya default na boses ang gagamitin. Sa susunod na bersyon, may naka-record na boses.',
      'This phone has no voice for this language, so the default voice will be used. A later version will have recorded voices.',
    ),
    noSpeech: t('Walang text-to-speech ang browser na ito.', 'This browser has no text-to-speech.'),
    test: t('Subukan ang boses', 'Test the voice'),
    testLine: t('Mahal kita. Nandito ako.', "I love you. I'm here."),
    deleteAll: t('Burahin ang lahat ng data', 'Delete all data'),
    deleteAllConfirm: t(
      'Buburahin ang setup at lahat ng nasabi niya sa phone na ito. Hindi na ito maibabalik. Sigurado ka ba?',
      "This deletes the setup and everything they said from this phone. It can't be undone. Are you sure?",
    ),
  },

  setup: {
    title: t('Setup', 'Setup'),
    introTitle: t('Gagawin natin ito nang dahan-dahan.', "We'll do this slowly, step by step."),
    introBody: t(
      'Mga 5–10 minuto ito. Hahanapin natin kung paano siya makakasagot ng OO at HINDI. Pwede kang tumigil anumang oras.',
      "This takes about 5–10 minutes. We'll find how they can answer yes and no. You can stop at any time.",
    ),
    begin: t('Simulan', 'Begin'),

    awakeQ: t(
      'Gising ba siya at medyo sumasagot (dumidilat, gumagalaw, o tumitingin kapag kinausap)?',
      'Are they awake and responding a little (opening eyes, moving, or looking when spoken to)?',
    ),
    awakeYes: t('Oo', 'Yes'),
    awakeNo: t('Hindi / tulog / hindi sigurado', 'No / asleep / not sure'),

    nameTitle: t('Sino ang pasyente?', 'Who is the patient?'),
    nameLabel: t('Pangalan (hal. Roberto)', 'First name (e.g. Roberto)'),
    callLabel: t('Tawag ninyo sa kanya (hal. Pa, Lola)', 'What you call them (e.g. Dad, Lola)'),
    nameNote: t(
      'Pwedeng laktawan. Gagamitin ito sa mga tanong at sa card. Hindi ito lalabas sa phone.',
      'You can skip these. They are used in questions and on the card. They never leave the phone.',
    ),

    signalTitle: t('Paano siya pinakamadaling sumagot ng OO?', 'How can they most easily say YES?'),
    signalBody: t('Pumili ng isa para subukan. Kung hindi gumana, subukan ang iba.', "Pick one to try. If it doesn't work, try another."),
    didntWork: t('hindi gumana', "didn't work"),
    noneWorked: t('Wala sa mga ito ang gumana', 'None of these worked'),
    otherLabel: t('Ilarawan ang senyas (hal. "itinataas ang kilay")', 'Describe the signal (e.g. "raises eyebrows")'),
    tryThis: t('Subukan ito', 'Try this'),

    tryStep2: t('Sabihin nang malinaw at dahan-dahan:', 'Say clearly and slowly:'),
    tryLine: t('"{call}, kung naririnig mo ako, {ask}."', '"{call}, if you can hear me, {ask}."'),
    tryStep3: t('Maghintay ng hanggang 10 segundo. Gawin ito 2–3 beses.', 'Wait up to 10 seconds. Do this 2–3 times.'),
    tryQ: t('Ginawa ba niya ito tuwing hiniling mo?', 'Did they do it each time you asked?'),
    tryWorked: t('Oo, ginawa niya', 'Yes, they did'),
    tryFailed: t('Hindi / minsan lang', 'No / only sometimes'),

    noTitle: t('Paano naman siya sasagot ng HINDI?', 'How will they say NO?'),
    noBody: t('Pumili, tapos subukan din ito sa kanya.', 'Choose one, then try it with them too.'),

    verifyTitle: t('Suriin natin kung maaasahan ang OO at HINDI.', "Let's check that yes and no are reliable."),
    verifyBody: t(
      'Itanong ang bawat tanong at pindutin ang sagot niya. Hindi ito pagsusulit para sa kanya — gusto lang nating malaman kung maiintindihan natin siya.',
      "Ask each question and tap their answer. This isn't a test of them — we just want to know if we can understand them.",
    ),
    verifyProgress: t('Tanong {n} sa {total}', 'Question {n} of {total}'),
    verifyScore: t('{score} sa {total} ang tama', '{score} of {total} correct'),
    reliable: t('Maaasahan ang OO at HINDI niya.', 'Their yes and no are reliable.'),
    partly: t(
      'Halos maaasahan. Para sa mahahalagang sagot, itanong ulit para sigurado.',
      'Mostly reliable. For important answers, ask again to be sure.',
    ),
    unreliable: t('Hindi pa maaasahan ang OO at HINDI ngayon.', "Their yes and no aren't reliable right now."),
    unreliableBody: t(
      'Karaniwan ito sa ICU — dahil sa gamot, pagod, o pagkalito. Hindi ito nangangahulugang hindi ka niya kilala. Subukan ulit mamaya o sa susunod na bisita. Sa ngayon, huwag umasa sa mga sagot niya para sa mahahalagang bagay.',
      "This is common in the ICU — from medicine, tiredness, or confusion. It doesn't mean they don't know you. Try again later or next visit. For now, don't rely on their answers for important things.",
    ),
    retry: t('Ulitin ang check', 'Redo the check'),
    continueAnyway: t('Ituloy pa rin', 'Continue anyway'),

    eyesQ: t('Bukas ba ang mata niya ngayon?', 'Are their eyes open right now?'),
    eyesClosed: t('Hindi / nakapikit', 'No / closed'),
    visionHold: t(
      'Hawakan ang phone sa harap ng mukha niya, mga isang dangkal ang layo. Itanong ang dalawang ito:',
      'Hold the phone in front of their face, about a hand-span away. Ask these two:',
    ),
    visionWord: t('TUBIG', 'WATER'),
    visionQ1: t('"Ang nakasulat ba ay KAPE?"', '"Does it say COFFEE?"'),
    visionQ2: t('"Ang nakasulat ba ay TUBIG?"', '"Does it say WATER?"'),
    visionYes: t('Nababasa niya ang malaking text.', 'They can read large text.'),
    visionNo: t(
      'Mukhang hindi niya mabasa ang screen ngayon. Ikaw ang magbabasa nang malakas para sa kanya.',
      "It seems they can't read the screen right now. You'll read aloud for them.",
    ),

    hearTitle: t('Naririnig ba niya ang phone?', 'Can they hear the phone?'),
    hearBody: t(
      'Ilapit ang phone sa tainga niya. Huwag kang magsalita. Pindutin ang "Patugtugin".',
      'Hold the phone near their ear. Don\'t speak. Tap "Play".',
    ),
    play: t('Patugtugin', 'Play'),
    hearLine: t('{call}, kung naririnig mo ang boses na ito, {ask}.', '{call}, if you can hear this voice, {ask}.'),
    hearQ: t('Sumenyas ba siya ng OO?', 'Did they signal yes?'),
    hardOfHearing: t(
      'Kung mahina ang pandinig niya: magsalita malapit sa tainga, dahan-dahan at malinaw. Hawakan muna siya bago magsalita para alam niyang nandiyan ka.',
      "If they're hard of hearing: speak close to their ear, slowly and clearly. Touch them before speaking so they know you're there.",
    ),

    pointTitle: t('Kaya ba niyang pumindot sa screen?', 'Can they tap the screen?'),
    pointBody: t(
      'Ilapit ang phone sa kamay niya, kung saan niya ito nakikita. Sabihin: "Pindutin mo ang BERDE."',
      'Hold the phone near their hand, where they can see it. Say: "Tap the GREEN one."',
    ),
    pointTry: t('Subukan', 'Try it'),
    pointCant: t('Hindi niya kaya', "They can't"),
    pointTarget: t('BERDE', 'GREEN'),
    pointRound: t('Subok {n} sa 2', 'Try {n} of 2'),
    pointYes: t('Kaya niyang pumindot.', 'They can tap.'),
    pointNo: t(
      'Mahirap pa sa kanya ang pumindot. Gagamitin natin ang "Isa-isang ipapakita".',
      'Tapping is hard for them for now. We\'ll use "One at a time".',
    ),

    prefTitle: t('Itanong sa kanya kung paano niya gustong mag-usap.', 'Ask them how they want to talk.'),
    prefNote: t(
      'Iba-iba ang tao. May ayaw na tinatanong nang tinatanong; may mas gusto naman ito.',
      'People differ. Some hate being asked question after question; others prefer it.',
    ),
    prefQ1: t(
      '"Gusto mo bang IKAW ang pipili ng gusto mong sabihin, at maghihintay lang kami?"',
      '"Do you want to choose what to say YOURSELF, while we wait?"',
    ),
    prefQ2: t('"O gusto mo bang KAMI ang magtanong sa iyo, isa-isa?"', '"Or do you want US to ask you questions, one at a time?"'),

    doneTitle: t('Handa na.', 'All set.'),
    doneStart: t('Simulan ang pag-uusap', 'Start talking'),
    doneCard: t('Gumawa ng card para sa nurse', 'Make a card for the nurse'),
    doneMode: t('Paraan na inirerekomenda', 'Recommended way'),
  },

  noResponse: {
    title: t('Hindi pa siya makasagot ngayon.', "They can't respond right now."),
    body: t(
      'Baka dahil sa gamot (sedation), pagod, o kalagayan niya. Hindi natin alam kung naririnig ka niya — pero maraming pamilya ang patuloy na kumakausap, at ligtas at mabuti itong gawin.',
      "It may be from medicine (sedation), tiredness, or their condition. We don't know if they can hear you — but many families keep talking to them, and it is safe and good to do.",
    ),
    doTitle: t('Mga pwede mong gawin ngayon', 'Things you can do now'),
    items: [
      t('Hawakan ang kamay niya at sabihin kung sino ka: "Si [pangalan mo] ito. Nandito ako."', 'Hold their hand and say who you are: "It\'s [your name]. I\'m here."'),
      t('Sabihin kung nasaan siya at anong araw: "Nasa ospital ka. Ngayon ay {today}."', 'Tell them where they are and the day: "You\'re in the hospital. Today is {today}."'),
      t('Magkuwento tungkol sa pamilya, sa bahay, at sa mga bagay na gusto niya.', 'Talk about family, home, and the things they love.'),
      t('Magdasal o kumanta nang mahina, kung ito ang nakasanayan ninyo.', 'Pray or sing softly, if that is your way.'),
      t('Itanong sa nurse kung ano ang plano at kailan pwedeng subukan ulit makipag-usap.', 'Ask the nurse about the plan and when to try communicating again.'),
      t('Bago umalis, sabihin kung kailan ka babalik.', "Before leaving, tell them when you'll be back."),
    ],
    tryLater: t('Subukan ulit mamaya', 'Try again later'),
  },
};
