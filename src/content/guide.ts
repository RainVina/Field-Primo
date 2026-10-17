import type { Text } from '../i18n';

/*
 * Guidance for the relative at the bedside.
 * REVIEW STATUS: draft. All of this is to be reviewed by an ICU nurse and a
 * speech-language pathologist before real use.
 */

export interface GuideSection {
  id: string;
  title: Text;
  items: Text[];
}

const t = (fil: string, en: string): Text => ({ fil, en });

export const GUIDE: GuideSection[] = [
  {
    id: 'arrive',
    title: t('Pagdating mo', 'When you arrive'),
    items: [
      t('Hawakan siya nang marahan bago magsalita para hindi siya magulat.', "Touch them gently before speaking so they aren't startled."),
      t('Sabihin ang pangalan mo, na nasa ospital siya, at ang araw ngayon ({today}).', "Say your name, that they're in the hospital, and today's date ({today})."),
      t('Bago ka magtanong, itanong muna: "May gusto ka bang sabihin?"', 'Before your own questions, ask: "Is there something you want to say?"'),
      t('Itanong sa nurse kung kumusta ang gabi o araw niya.', 'Ask the nurse how their night or day went.'),
    ],
  },
  {
    id: 'talk',
    title: t('Paano siya kausapin', 'How to talk with them'),
    items: [
      t('Isang tanong lang bawat isa, at OO/HINDI ang sagot.', 'One question at a time, with a yes/no answer.'),
      t('Hintayin ang sagot — hanggang 10 segundo. Huwag madaliin.', "Wait for the answer — up to 10 seconds. Don't rush."),
      t('Kung hindi malinaw ang sagot, itanong ulit sa ibang paraan.', 'If the answer is unclear, ask again a different way.'),
      t('Kausapin siya gaya ng dati. Hindi siya bata.', 'Talk to them the way you always have. They are not a child.'),
      t('Kung pagod na siya, tumigil. Pwedeng ituloy mamaya.', "If they're tired, stop. You can continue later."),
    ],
  },
  {
    id: 'nurse',
    title: t('Kailan tatawag agad ng nurse', 'When to call the nurse right away'),
    items: [
      t('Sabi niya hirap siyang huminga, o mukhang hirap siyang huminga.', 'They say they can\'t breathe well, or they look like they can\'t.'),
      t('Sobrang sakit, o masakit ang dibdib.', 'Very bad pain, or chest pain.'),
      t('Nasusuka siya.', 'They feel like vomiting.'),
      t('Biglang nagbago siya: hindi na sumasagot, sobrang balisa, o hinihila ang tubo.', 'A sudden change: stops responding, very agitated, or pulling at tubes.'),
    ],
  },
  {
    id: 'confused',
    title: t('Kung nalilito siya', 'If they are confused'),
    items: [
      t('Karaniwan ito sa ICU (tinatawag na delirium). Madalas, pansamantala lang ito.', "This is common in the ICU (it's called delirium). It is often temporary."),
      t('Huwag makipagtalo. Sabihin nang mahinahon ang totoo: nasaan siya, anong araw, at ligtas siya.', "Don't argue. Calmly say what's true: where they are, what day it is, and that they're safe."),
      t('Dalhin ang salamin at hearing aid niya kung meron siya.', 'Bring their glasses and hearing aid if they have them.'),
      t('Ipaalam sa nurse.', 'Let the nurse know.'),
    ],
  },
  {
    id: 'doctor',
    title: t('Mga pwedeng itanong sa doktor', 'Questions you can ask the doctor'),
    items: [
      t('Ano ang pinakamalaking problema niya ngayon?', 'What is the biggest problem right now?'),
      t('Ano ang plano para sa susunod na 24 oras?', 'What is the plan for the next 24 hours?'),
      t('Paano ninyo malalaman kung gumagaling siya?', 'How will you know if they are getting better?'),
      t('Kailan posibleng tanggalin ang tubo?', 'When might the tube come out?'),
      t('Ano ang pwede naming gawin para makatulong?', 'What can we do to help?'),
      t('Sino ang pwede naming kausapin kapag may tanong kami?', 'Who can we talk to when we have questions?'),
    ],
  },
  {
    id: 'leave',
    title: t('Bago ka umalis', 'Before you leave'),
    items: [
      t('Itanong kung may gusto pa siyang sabihin.', 'Ask if there is anything else they want to say.'),
      t('Sabihin kung kailan ka babalik.', "Tell them when you'll be back."),
      t('Ipakita sa nurse ang card para alam nila ang senyas niya.', 'Show the nurse the card so they know their signal.'),
      t('Magpaalam nang mahinahon: "Mahal kita. Babalik ako."', 'Say goodbye calmly: "I love you. I\'ll be back."'),
    ],
  },
];
