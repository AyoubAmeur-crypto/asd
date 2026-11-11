export interface GalleryItem {
  id: string;
  src: string;
  title: string;
  category: 'podium' | 'audience' | 'jury' | 'ceremony' | 'atmosphere';
  caption: string;
  featured?: boolean;
  orientation: 'landscape' | 'portrait';
}

export const OFFICIAL_LOGOS = {
  asdWhite: '/assets/logo-white.png',
  asdBlack: '/assets/logo-black.png',
  tgdTransparent: '/assets/logo tgd no bg.png',
  tgdBlack: '/assets/png.png',
} as const;

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'podium-speaker-suit',
    src: '/assets/Copy of IMG_4476.JPG',
    title: 'Passion at the Rostrum',
    category: 'podium',
    caption: 'A university orator delivers a passionate address before the grand amphitheater screen.',
    featured: true,
    orientation: 'landscape',
  },
  {
    id: 'stage-awards-lineup',
    src: '/assets/Copy of IMG_4712.JPG',
    title: 'The Arena Assembly',
    category: 'ceremony',
    caption: 'Official stage presentation and certificate ceremony of the All-Star Debate delegation.',
    featured: true,
    orientation: 'landscape',
  },
  {
    id: 'jury-row-deliberation',
    src: '/assets/Copy of IMG_4622.JPG',
    title: 'The Critical Bench',
    category: 'jury',
    caption: 'Adjudicators scrutinize arguments, evaluating rebuttal depth, structure, and rhetorical balance.',
    featured: true,
    orientation: 'landscape',
  },
  {
    id: 'podium-orator-flag',
    src: '/assets/Copy of IMG_4568.JPG',
    title: 'Rhetoric & Conviction',
    category: 'podium',
    caption: 'Eloquence and parliamentary debate technique under stage spotlights.',
    featured: true,
    orientation: 'landscape',
  },
  {
    id: 'ceremony-champions-banner',
    src: '/assets/DSC_1475.JPG',
    title: 'Triumph & Recognition',
    category: 'ceremony',
    caption: 'Debaters celebrate their victory on stage alongside the official All-Star Debate banner.',
    featured: true,
    orientation: 'portrait',
  },
  {
    id: 'debater-contemplation',
    src: '/assets/Copy of IMG_4593.JPG',
    title: 'The Anatomy of Refutation',
    category: 'atmosphere',
    caption: 'Intense contemplation as opposing arguments unfold on the competition floor.',
    featured: false,
    orientation: 'landscape',
  },
  {
    id: 'debater-active-notes',
    src: '/assets/Copy of IMG_4451.JPG',
    title: 'Real-Time Cross-Analysis',
    category: 'atmosphere',
    caption: 'Rapid note-taking and tactical strategy during parliamentary floor clashes.',
    featured: false,
    orientation: 'landscape',
  },
  {
    id: 'audience-engaged-hall',
    src: '/assets/Copy of IMG_4400.JPG',
    title: 'The Captivated Assembly',
    category: 'audience',
    caption: 'Students, faculty and debate enthusiasts filling the ENSA Fès amphitheater.',
    featured: false,
    orientation: 'landscape',
  },
  {
    id: 'best-speaker-trophy',
    src: '/assets/DSC_1404.JPG',
    title: 'Best Speaker Distinction',
    category: 'ceremony',
    caption: 'Honoring exceptional oratory prowess with the coveted All-Star star trophy.',
    featured: false,
    orientation: 'portrait',
  },
  {
    id: 'ceremony-winners-group',
    src: '/assets/DSC_1453.JPG',
    title: 'Collective Excellence',
    category: 'ceremony',
    caption: 'Medalists and finalists commemorating their shared dedication to competitive debate.',
    featured: false,
    orientation: 'portrait',
  },
  {
    id: 'audience-hall-focus',
    src: '/assets/Copy of IMG_4642.JPG',
    title: 'Audience in Focus',
    category: 'audience',
    caption: 'Spectators immersed in the multilingual intellectual confrontations.',
    featured: false,
    orientation: 'landscape',
  },
  {
    id: 'speaker-podium-energy',
    src: '/assets/Copy of IMG_4594.JPG',
    title: 'Dialectical Friction',
    category: 'podium',
    caption: 'High-stakes debate discourse delivered with poise and conviction.',
    featured: false,
    orientation: 'landscape',
  },
  {
    id: 'debater-strategy-session',
    src: '/assets/Copy of IMG_4597.JPG',
    title: 'Team Strategy Session',
    category: 'atmosphere',
    caption: 'Collaborative formulation of rebuttal angles in the debater lounge.',
    featured: false,
    orientation: 'landscape',
  },
  {
    id: 'adjudication-panel-notes',
    src: '/assets/Copy of IMG_4616.JPG',
    title: 'Adjudication in Progress',
    category: 'jury',
    caption: 'Evaluating comparative weighing, POI adherence and argument crystallization.',
    featured: false,
    orientation: 'landscape',
  },
  {
    id: 'stage-honors-close',
    src: '/assets/DSC_1485.JPG',
    title: 'Celebrating Merit',
    category: 'ceremony',
    caption: 'Recognition of university debate champions across Arabic, French, and English arenas.',
    featured: false,
    orientation: 'portrait',
  },
  {
    id: 'stage-final-ovation',
    src: '/assets/DSC_1491.JPG',
    title: 'The Final Ovation',
    category: 'ceremony',
    caption: 'Closing remarks and ceremony honoring participants and jury members.',
    featured: false,
    orientation: 'portrait',
  },
];

export const HERO_FEATURED_IMAGE = GALLERY_ITEMS[1]; // Stage awards lineup (The Arena Assembly)
export const ABOUT_FEATURED_IMAGE = GALLERY_ITEMS[3]; // Speaker with flag (Rhetoric & Conviction)
export const EXPERIENCE_FEATURED_IMAGE = GALLERY_ITEMS[0]; // Podium speaker suit

