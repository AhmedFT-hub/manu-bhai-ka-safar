import { PROPS } from './assets'

// The seven stops on Manu Bhai's journey. Content carried over from the
// original script; each maps to a content overlay (overlayId).
export const CHAPTERS = [
  {
    id: 1, overlayId: 1,
    location: 'The Village Entrance', locationHi: 'Gaon Ka Darwaza',
    kidSpeech: 'Look — our welcome gate! ✨', ctaLabel: 'Step Inside ✨', enterLabel: 'Click the gate to step inside',
    beats: [
      { hi: 'Swagat Hai, Manu Bhai!', en: 'Welcome — to a journey made just for you.' },
      { hi: '4 crore bacche quality early learning se door the.', en: 'When you began, 40 million children had no access to quality learning.' },
      { hi: 'Aap ne darwaza khola. Woh kabhi band nahi hua.', en: 'You opened the door. It has never closed since.' },
    ],
  },
  {
    id: 2, overlayId: 2,
    location: 'The Peepal Tree Lane', locationHi: 'Purana Peepal',
    kidSpeech: 'This old peepal has seen so much! 🌳', ctaLabel: 'Learn More ✨', enterLabel: 'Click the tree to read its notes',
    beats: [
      { hi: 'Yahan se shuru hua tha sab kuch.', en: 'Everything started right here, under this tree.' },
      { hi: '23 lakh workers aap ke saath khade hain.', en: '2.3 million workers stand alongside you today.' },
      { hi: 'Har ek ne ek bacche ka haath thamaa.', en: "Every single one has held a child's hand." },
    ],
  },
  {
    id: 3, overlayId: 3,
    location: 'The Notice Board', locationHi: 'Notice Board',
    kidSpeech: 'Look what the children made! 🎨', ctaLabel: 'See the Drawings ✨', enterLabel: 'Click the board to see the drawings',
    beats: [
      { hi: 'Bacchon ke sapne rang-birange hain.', en: "Children's dreams are vivid and full of colour." },
      { hi: 'Inke drawings mein dikhta hai — ek better India.', en: 'In their drawings you can see a better India.' },
      { hi: 'Aap ne unhein crayon diya. Duniya badal gayi.', en: 'You gave them the crayon. The world changed.' },
    ],
  },
  {
    id: 4, overlayId: 4,
    location: 'The Aanganwadi', locationHi: 'Aanganwadi Kendra',
    kidSpeech: 'This is where care and learning begin! 🏠', ctaLabel: 'Come Inside ✨', enterLabel: 'Click to step into the aanganwadi',
    beats: [
      { hi: 'Ek kamra. Ek teacher. Ek zindagi badal di.', en: 'One room. One teacher. One life transformed.' },
      { hi: 'Poshan Tracker ne 11 crore bachon ki sehat track ki.', en: "Poshan Tracker has monitored 110 million children's health." },
      { hi: 'Content Bank ne seekhna interesting bana diya.', en: 'The Content Bank made learning something to look forward to.' },
    ],
  },
  {
    id: 5, overlayId: 5,
    location: 'The New School', locationHi: 'Naya Vidyalay',
    kidSpeech: 'We built this school together! 🏫', ctaLabel: 'See the School ✨', enterLabel: 'Click to enter the school',
    beats: [
      { hi: 'Nayi deewarein. Naye sapne.', en: 'New walls. New dreams.' },
      { hi: '3.5 lakh aanganwadis upgrade kiye gaye.', en: '350,000 aanganwadis upgraded — because of you.' },
      { hi: 'Aaj har bacche ke paas ek jagah hai seekhne ke liye.', en: 'Today every child has a place to learn.' },
    ],
  },
  {
    id: 6, overlayId: 6,
    location: 'The Memory Wall', locationHi: 'Tasveeron Ki Deewar',
    kidSpeech: 'Every photo tells a story! 📸', ctaLabel: 'See the Photos ✨', enterLabel: 'Click the wall to see the photos',
    beats: [
      { hi: 'Yeh chehere hain aapke safar ke saathi.', en: 'These faces are the companions of your journey.' },
      { hi: 'Field mein, ghar mein, school mein — hamesha maujood.', en: 'In the field, at home, in school — always present.' },
      { hi: 'Aap ne unhe dekha. Unhe sunaa. Yeh kaafi tha.', en: 'You saw them. You heard them. That was enough.' },
    ],
  },
  {
    id: 7, overlayId: 7,
    location: 'Celebration Chowk', locationHi: 'Jashn Ka Chowk',
    kidSpeech: 'Today is your day, Manu Bhai! 🎉', ctaLabel: 'Celebrate ✨', enterLabel: 'Click to join the celebration',
    beats: [
      { hi: 'Happy Birthday, Manu Bhai! 🎂', en: 'Today we celebrate you and everything you have built.' },
      { hi: 'Aapka safar sirf shuru hua hai.', en: 'Your journey has only just begun.' },
      { hi: 'Agle padaav pe milte hain — muskaan aur badi hogi. 🌟', en: 'See you at the next milestone — smiles will grow even wider.' },
    ],
  },
]

// Painterly "moments along the road" — shown as framed snapshots while the boy
// walks the stretch between stop `gapAfter` and the next. (Different art style
// reads intentionally, like postcards from the journey.)
export const MOMENTS = [
  { gapAfter: 0, img: PROPS.goat,    hi: 'Raaste mein ek nanhi bakri mili.',   en: 'A little goat trots along the road.' },
  { gapAfter: 1, img: PROPS.chai,    hi: 'Ramu ki chai pe gaon rukta hai.',     en: "The whole village pauses at Ramu's chai stall." },
  { gapAfter: 2, img: PROPS.pump,    hi: 'Handpump pe thandi paani ki dhaar.',  en: 'Cool water from the old hand pump.' },
  { gapAfter: 3, img: PROPS.cart,    hi: 'Bail-gaadi dheere dheere ghar chali.', en: 'A bullock cart rolls slowly home.' },
  { gapAfter: 4, img: PROPS.washing, hi: 'Aangan mein sookhti rangeen kapde.',   en: 'Bright clothes drying in the courtyard.' },
  { gapAfter: 5, img: PROPS.crow,    hi: 'Taar pe baitha ek kauwa dekhta raha.', en: 'A crow on the wire watches it all.' },
]
