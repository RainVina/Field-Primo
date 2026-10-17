import type { Text } from '../i18n';

/*
 * Everything the patient can say from the menus.
 *
 * REVIEW STATUS: draft. The wording needs a native-speaker pass, and every
 * `urgent` flag and `familyTip` is medical content that must be reviewed by an
 * ICU nurse and a speech-language pathologist before real use.
 *
 * Order matters: in partner mode options are offered one at a time, so the most
 * urgent and most common items come first.
 */

export interface PhraseNode {
  id: string;
  /** Short label for the button or scan card. */
  label: Text;
  icon?: string;
  /** Yes/no phrasing the relative reads in "ask me" mode (categories only). */
  question?: Text;
  /** What gets shown and spoken when the patient picks this. Leaves only. */
  say?: Text;
  children?: PhraseNode[];
  /** Show "call the nurse now". */
  urgent?: boolean;
  /** Suggestion for the relative after the message. May use {today} / {now}. */
  familyTip?: Text;
}

const TIP_CALL_NURSE_NOW: Text = {
  fil: 'Tawagin agad ang nurse.',
  en: 'Call the nurse right away.',
};

// ---------------------------------------------------------------- Pain

interface PainLocation {
  id: string;
  label: Text;
  say: Text;
  /** Pain here goes to the nurse even when it's mild. */
  alwaysUrgent?: boolean;
}

const PAIN_LOCATIONS: PainLocation[] = [
  { id: 'head', label: { fil: 'Ulo', en: 'Head' }, say: { fil: 'Masakit ang ulo ko.', en: 'My head hurts.' } },
  {
    id: 'chest',
    label: { fil: 'Dibdib', en: 'Chest' },
    say: { fil: 'Masakit ang dibdib ko.', en: 'My chest hurts.' },
    alwaysUrgent: true,
  },
  {
    id: 'throat',
    label: { fil: 'Lalamunan o bibig', en: 'Throat or mouth' },
    say: { fil: 'Masakit ang lalamunan o bibig ko.', en: 'My throat or mouth hurts.' },
  },
  { id: 'stomach', label: { fil: 'Tiyan', en: 'Stomach' }, say: { fil: 'Masakit ang tiyan ko.', en: 'My stomach hurts.' } },
  { id: 'back', label: { fil: 'Likod', en: 'Back' }, say: { fil: 'Masakit ang likod ko.', en: 'My back hurts.' } },
  {
    id: 'arm',
    label: { fil: 'Braso o kamay', en: 'Arm or hand' },
    say: { fil: 'Masakit ang braso o kamay ko.', en: 'My arm or hand hurts.' },
  },
  {
    id: 'leg',
    label: { fil: 'Binti o paa', en: 'Leg or foot' },
    say: { fil: 'Masakit ang binti o paa ko.', en: 'My leg or foot hurts.' },
  },
  {
    id: 'line',
    label: { fil: 'Kung saan may tubo o swero', en: 'Where a tube or IV is' },
    say: { fil: 'Masakit kung saan nakakabit ang tubo o swero.', en: 'It hurts where a tube or IV is.' },
  },
  {
    id: 'all',
    label: { fil: 'Buong katawan', en: 'All over' },
    say: { fil: 'Masakit ang buong katawan ko.', en: 'I hurt all over.' },
  },
];

const PAIN_LEVELS: { id: string; label: Text; say: Text; urgent: boolean }[] = [
  { id: 'mild', label: { fil: 'Kaunti lang', en: 'A little' }, say: { fil: 'Kaunti lang.', en: 'Just a little.' }, urgent: false },
  {
    id: 'moderate',
    label: { fil: 'Katamtaman', en: 'Medium' },
    say: { fil: 'Katamtaman ang sakit.', en: 'Medium pain.' },
    urgent: false,
  },
  {
    id: 'severe',
    label: { fil: 'Sobrang sakit', en: 'Very bad' },
    say: { fil: 'Sobrang sakit!', en: 'It is very bad!' },
    urgent: true,
  },
];

const TIP_PAIN: Text = {
  fil: 'Sabihin sa nurse kung saan masakit at gaano kasakit. Pwede mong itanong kung may pwedeng ibigay o gawin para dito.',
  en: 'Tell the nurse where it hurts and how bad. You can ask if anything can be given or done for it.',
};

const TIP_PAIN_URGENT: Text = {
  fil: 'Tawagin agad ang nurse. Sabihin kung saan masakit at gaano kasakit.',
  en: 'Call the nurse right away. Tell them where it hurts and how bad.',
};

function painNodes(): PhraseNode[] {
  return PAIN_LOCATIONS.map((loc) => ({
    id: `pain.${loc.id}`,
    label: loc.label,
    children: PAIN_LEVELS.map((level) => {
      const urgent = level.urgent || !!loc.alwaysUrgent;
      return {
        id: `pain.${loc.id}.${level.id}`,
        label: level.label,
        say: { fil: `${loc.say.fil} ${level.say.fil}`, en: `${loc.say.en} ${level.say.en}` },
        urgent,
        familyTip: urgent ? TIP_PAIN_URGENT : TIP_PAIN,
      };
    }),
  }));
}

// ---------------------------------------------------------------- Tree

export const ROOT: PhraseNode = {
  id: 'root',
  label: { fil: 'Simula', en: 'Start' },
  children: [
    {
      id: 'pain',
      icon: '🤕',
      label: { fil: 'Sakit', en: 'Pain' },
      question: { fil: 'May masakit ba sa iyo?', en: 'Are you in pain?' },
      children: painNodes(),
    },
    {
      id: 'needs',
      icon: '🛏️',
      label: { fil: 'Kailangan ko', en: 'I need' },
      question: { fil: 'May kailangan ka ba?', en: 'Do you need something?' },
      children: [
        {
          id: 'needs.nurse',
          label: { fil: 'Tawagin ang nurse', en: 'Call the nurse' },
          say: { fil: 'Pakitawag ang nurse.', en: 'Please call the nurse.' },
          urgent: true,
          familyTip: TIP_CALL_NURSE_NOW,
        },
        {
          id: 'needs.suction',
          label: { fil: 'Pa-suction', en: 'Suction' },
          say: { fil: 'Pa-suction. May plema ako.', en: 'I need suction. There is phlegm.' },
          urgent: true,
          familyTip: {
            fil: 'Tawagin ang nurse para sa suction. Huwag itong subukang gawin mismo.',
            en: 'Call the nurse for suction. Do not try to do it yourself.',
          },
        },
        {
          id: 'needs.position',
          label: { fil: 'Ayusin ang higa', en: 'Change position' },
          say: { fil: 'Pakiayos ang higa ko.', en: 'Please change my position.' },
          familyTip: {
            fil: 'Humingi ng tulong sa nurse. May mga tubo at kable na kailangang ingatan.',
            en: 'Ask the nurse for help. There are tubes and wires that need care.',
          },
        },
        {
          id: 'needs.drymouth',
          label: { fil: 'Tuyo ang bibig', en: 'Dry mouth' },
          say: { fil: 'Tuyo ang bibig ko.', en: 'My mouth is dry.' },
          familyTip: {
            fil: 'Itanong muna sa nurse bago magbigay ng tubig o yelo, baka bawal pa. Kadalasan may pwedeng ipahid sa bibig at labi.',
            en: 'Ask the nurse before giving water or ice; it may not be allowed yet. There is often something to moisten the mouth and lips.',
          },
        },
        {
          id: 'needs.cold',
          label: { fil: 'Nilalamig', en: 'Cold' },
          say: { fil: 'Nilalamig ako.', en: "I'm cold." },
          familyTip: {
            fil: 'Pwedeng dagdagan ang kumot o medyas. Itanong sa nurse kung okay.',
            en: 'An extra blanket or socks may help. Check with the nurse.',
          },
        },
        {
          id: 'needs.hot',
          label: { fil: 'Naiinitan', en: 'Hot' },
          say: { fil: 'Naiinitan ako.', en: "I'm hot." },
          familyTip: {
            fil: 'Pwedeng bawasan ang kumot. Kung mainit siya sa hawak, sabihin sa nurse.',
            en: 'You can remove a blanket. If they feel hot to the touch, tell the nurse.',
          },
        },
        {
          id: 'needs.toilet',
          label: { fil: 'Ihi o dumi', en: 'Pee or poop' },
          say: { fil: 'Kailangan kong umihi o dumumi.', en: 'I need to pee or poop.' },
          familyTip: {
            fil: 'Sabihin sa nurse. Kahit may catheter o diaper na, sabihin pa rin — baka hindi siya komportable.',
            en: 'Tell the nurse. Even if there is a catheter or diaper, say it anyway; they may be uncomfortable.',
          },
        },
        {
          id: 'needs.itch',
          label: { fil: 'Makati', en: 'Itchy' },
          say: { fil: 'May makati sa katawan ko.', en: 'Something itches.' },
        },
        {
          id: 'needs.glasses',
          label: { fil: 'Salamin ko', en: 'My glasses' },
          say: { fil: 'Gusto ko ang salamin ko.', en: 'I want my glasses.' },
          familyTip: {
            fil: 'Kung wala rito ang salamin niya, dalhin sa susunod na bisita.',
            en: "If their glasses aren't here, bring them next visit.",
          },
        },
        {
          id: 'needs.sleep',
          label: { fil: 'Gusto kong matulog', en: 'I want to sleep' },
          say: { fil: 'Gusto ko nang matulog.', en: 'I want to sleep now.' },
          familyTip: {
            fil: 'Hayaan siyang magpahinga. Pwede mo lang hawakan ang kamay niya.',
            en: 'Let them rest. You can just hold their hand.',
          },
        },
      ],
    },
    {
      id: 'feel',
      icon: '💭',
      label: { fil: 'Nararamdaman ko', en: 'I feel' },
      question: { fil: 'May nararamdaman ka bang gusto mong sabihin?', en: 'Is there a feeling you want to tell us?' },
      children: [
        {
          id: 'feel.breathe',
          label: { fil: 'Hirap huminga', en: "Can't breathe well" },
          say: { fil: 'Hirap akong huminga.', en: "I can't breathe well." },
          urgent: true,
          familyTip: TIP_CALL_NURSE_NOW,
        },
        {
          id: 'feel.nausea',
          label: { fil: 'Nasusuka', en: 'Nauseous' },
          say: { fil: 'Nasusuka ako.', en: 'I feel like throwing up.' },
          urgent: true,
          familyTip: TIP_CALL_NURSE_NOW,
        },
        {
          id: 'feel.scared',
          label: { fil: 'Natatakot', en: 'Scared' },
          say: { fil: 'Natatakot ako.', en: "I'm scared." },
          familyTip: {
            fil: 'Hawakan ang kamay niya. Sabihin nang mahinahon: "Nandito ako. Ligtas ka. Inaalagaan ka ng mga doktor at nurse."',
            en: 'Hold their hand. Say calmly: "I\'m here. You\'re safe. The doctors and nurses are taking care of you."',
          },
        },
        {
          id: 'feel.confused',
          label: { fil: 'Nalilito', en: 'Confused' },
          say: { fil: 'Nalilito ako.', en: "I'm confused." },
          familyTip: {
            fil: 'Karaniwan ito sa ICU. Sabihin nang dahan-dahan ang pangalan niya, na nasa ospital siya, at ang araw ngayon ({today}). Huwag makipagtalo kung may sinasabi siyang hindi totoo. Ipaalam sa nurse.',
            en: "This is common in the ICU. Slowly tell them their name, that they're in the hospital, and today's date ({today}). Don't argue if they say things that aren't true. Let the nurse know.",
          },
        },
        {
          id: 'feel.tired',
          label: { fil: 'Pagod', en: 'Tired' },
          say: { fil: 'Pagod ako.', en: "I'm tired." },
          familyTip: {
            fil: 'Pwede munang tumigil. Sabihin: "Okay lang, magpahinga ka. Nandito lang ako."',
            en: 'You can stop for now. Say: "It\'s okay, rest. I\'m right here."',
          },
        },
        {
          id: 'feel.sad',
          label: { fil: 'Malungkot', en: 'Sad' },
          say: { fil: 'Malungkot ako.', en: "I'm sad." },
          familyTip: {
            fil: 'Hindi mo kailangang ayusin ito. Pwedeng sabihin: "Naiintindihan ko. Nandito ako." at hawakan siya.',
            en: 'You don\'t have to fix it. You can say: "I understand. I\'m here." and hold them.',
          },
        },
        {
          id: 'feel.okay',
          label: { fil: 'Okay lang ako', en: "I'm okay" },
          say: { fil: 'Okay lang ako.', en: "I'm okay." },
        },
      ],
    },
    {
      id: 'ask',
      icon: '❓',
      label: { fil: 'Tanong', en: 'Question' },
      question: { fil: 'May gusto ka bang itanong?', en: 'Do you have a question?' },
      children: [
        {
          id: 'ask.where',
          label: { fil: 'Nasaan ako?', en: 'Where am I?' },
          say: { fil: 'Nasaan ako?', en: 'Where am I?' },
          familyTip: {
            fil: 'Sabihin: "Nasa ospital ka, sa ICU. Ligtas ka. Inaalagaan ka nila."',
            en: 'Say: "You\'re in the hospital, in the ICU. You\'re safe. They\'re taking care of you."',
          },
        },
        {
          id: 'ask.what',
          label: { fil: 'Ano ang nangyari?', en: 'What happened?' },
          say: { fil: 'Ano ang nangyari sa akin?', en: 'What happened to me?' },
          familyTip: {
            fil: 'Ipaliwanag nang maikli at simple ang alam mo. Kung hindi ka sigurado, sabihin: "Itatanong natin sa doktor."',
            en: 'Explain briefly and simply what you know. If you\'re not sure, say: "We\'ll ask the doctor."',
          },
        },
        {
          id: 'ask.day',
          label: { fil: 'Anong araw ngayon?', en: 'What day is it?' },
          say: { fil: 'Anong araw ngayon?', en: 'What day is it?' },
          familyTip: { fil: 'Ngayon ay {today}.', en: 'Today is {today}.' },
        },
        {
          id: 'ask.time',
          label: { fil: 'Anong oras na?', en: 'What time is it?' },
          say: { fil: 'Anong oras na?', en: 'What time is it?' },
          familyTip: { fil: 'Ngayon ay {now}.', en: 'It is {now}.' },
        },
        {
          id: 'ask.tube',
          label: { fil: 'Kailan tatanggalin ang tubo?', en: 'When does the tube come out?' },
          say: { fil: 'Kailan tatanggalin ang tubo?', en: 'When will the tube come out?' },
          familyTip: {
            fil: 'Kung hindi mo alam, sabihin nang tapat: "Hindi ko pa alam. Itatanong ko sa doktor." Isulat ang tanong para sa doktor.',
            en: 'If you don\'t know, say honestly: "I don\'t know yet. I\'ll ask the doctor." Write the question down for the doctor.',
          },
        },
        {
          id: 'ask.better',
          label: { fil: 'Gumagaling ba ako?', en: 'Am I getting better?' },
          say: { fil: 'Gumagaling ba ako?', en: 'Am I getting better?' },
          familyTip: {
            fil: 'Maging tapat pero mahinahon. Kung hindi mo alam, sabihin: "Itatanong natin sa doktor. Nandito lang kami."',
            en: 'Be honest but gentle. If you don\'t know, say: "We\'ll ask the doctor. We\'re right here."',
          },
        },
        {
          id: 'ask.home',
          label: { fil: 'Kailan ako uuwi?', en: 'When can I go home?' },
          say: { fil: 'Kailan ako makakauwi?', en: 'When can I go home?' },
          familyTip: {
            fil: 'Kung hindi mo alam, sabihin nang tapat at itanong sa doktor.',
            en: "If you don't know, say so honestly and ask the doctor.",
          },
        },
      ],
    },
    {
      id: 'family',
      icon: '❤️',
      label: { fil: 'Para sa pamilya', en: 'For family' },
      question: { fil: 'May gusto ka bang sabihin sa amin?', en: 'Is there something you want to tell us?' },
      children: [
        {
          id: 'family.love',
          label: { fil: 'Mahal ko kayo', en: 'I love you' },
          say: { fil: 'Mahal ko kayo.', en: 'I love you.' },
        },
        {
          id: 'family.hand',
          label: { fil: 'Hawakan ang kamay ko', en: 'Hold my hand' },
          say: { fil: 'Hawakan mo ang kamay ko.', en: 'Hold my hand.' },
        },
        {
          id: 'family.stay',
          label: { fil: 'Dito ka lang', en: 'Stay with me' },
          say: { fil: 'Dito ka lang sa tabi ko.', en: 'Stay with me.' },
          familyTip: {
            fil: 'Kung kailangan mo nang umalis dahil tapos na ang oras ng bisita, sabihin kung kailan ka babalik: "Babalik ako mamaya/bukas ng [oras]."',
            en: 'If you have to leave because visiting time is over, tell them when you\'ll be back: "I\'ll be back later/tomorrow at [time]."',
          },
        },
        {
          id: 'family.everyone',
          label: { fil: 'Okay ba ang lahat?', en: 'Is everyone okay?' },
          say: { fil: 'Okay lang ba kayong lahat?', en: 'Is everyone okay?' },
          familyTip: {
            fil: 'Magkuwento ng maikling balita tungkol sa pamilya at sa bahay.',
            en: 'Share a little news about the family and home.',
          },
        },
        {
          id: 'family.rest',
          label: { fil: 'Umuwi ka at magpahinga', en: 'Go home and rest' },
          say: { fil: 'Umuwi ka na at magpahinga.', en: 'Go home and rest.' },
        },
        {
          id: 'family.pray',
          label: { fil: 'Ipagdasal ako', en: 'Pray for me' },
          say: { fil: 'Ipagdasal ninyo ako.', en: 'Pray for me.' },
          familyTip: {
            fil: 'Pwede kayong magdasal nang sabay ngayon, kung gusto niya.',
            en: 'You can pray together now, if they want.',
          },
        },
        {
          id: 'family.thanks',
          label: { fil: 'Salamat', en: 'Thank you' },
          say: { fil: 'Salamat.', en: 'Thank you.' },
        },
        {
          id: 'family.sorry',
          label: { fil: 'Patawad', en: "I'm sorry" },
          say: { fil: 'Patawad.', en: "I'm sorry." },
        },
      ],
    },
  ],
};

/**
 * Appended to every list: the patient can always say "it's not here",
 * which is a real message, not a dead end.
 */
export function otherNode(parentId: string): PhraseNode {
  return {
    id: `${parentId}.other`,
    label: { fil: 'Wala rito / iba', en: 'Not here / other' },
    question: {
      fil: 'May iba ka pa bang gustong sabihin na wala rito?',
      en: "Is there something else you want to say that isn't here?",
    },
    say: {
      fil: 'Iba ang gusto kong sabihin. Wala sa listahan.',
      en: "It's something else. It's not on the list.",
    },
    familyTip: {
      fil: 'Subukan ang ibang grupo, o magtanong ng mga OO/HINDI na tanong. (Sa susunod na bersyon, makakapag-spell na siya.)',
      en: 'Try another group, or ask yes/no questions. (In a later version they will be able to spell.)',
    },
  };
}
