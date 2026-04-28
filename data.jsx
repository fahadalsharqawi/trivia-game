// Mejlis — game data: categories, sample questions, packs
// Sample content is illustrative; real packs would be edited by hosts.

const I18N = {
  en: {
    appName: 'Mejlis',
    library: 'Library',
    packs: 'Packs',
    history: 'History',
    settings: 'Settings',
    create: 'Create pack',
    startGame: 'Start a game',
    pickPack: 'Pick a pack',
    yourPacks: 'Your packs',
    discover: 'Discover',
    lastPlayed: 'Last played',
    questions: 'questions',
    teams: 'Teams',
    teamA: 'Team A',
    teamB: 'Team B',
    rounds: 'Rounds',
    lifelines: 'Lifelines',
    timer: 'Timer',
    seconds: 's',
    cancel: 'Cancel',
    begin: 'Begin →',
    boardTitle: 'Pick a tile',
    boardSub: 'Six categories. Three tiers. Harder questions, more points.',
    pass: 'Pass',
    reveal: 'Reveal answer',
    correct: 'Correct',
    wrong: 'Not this time',
    answer: 'Answer',
    rematch: 'Rematch?',
    newGame: 'New game',
    final: 'Final',
    takesTheNight: 'takes the night',
    tied: 'A tie. The mejlis splits the win.',
    home: 'Home',
    play: 'Play',
    endGame: 'End game',
    confirmEnd: 'End the round?',
    confirmEndSub: 'Scores are final. The mejlis goes home.',
    keepPlaying: 'Keep playing',
    yes: 'End it',
    paused: 'Paused',
    resume: 'Resume',
    callFriend: 'Call a friend',
    skipQ: 'Skip',
    doublePts: 'Double or nothing',
    used: 'Used',
    available: 'Available',
    points: 'pts',
    of: 'of',
    streak: 'streak',
    twoTeams: 'Two teams. One night.',
    welcomeSub: 'Pick a pack, split the room, settle the night.',
    welcomeHost: 'Welcome back, host',
  },
  ar: {
    appName: 'مجلس',
    library: 'المكتبة',
    packs: 'الحزم',
    history: 'السجل',
    settings: 'الإعدادات',
    create: 'إنشاء حزمة',
    startGame: 'ابدأ اللعبة',
    pickPack: 'اختر حزمة',
    yourPacks: 'حزماتك',
    discover: 'استكشاف',
    lastPlayed: 'آخر لعبة',
    questions: 'سؤال',
    teams: 'الفرق',
    teamA: 'فريق أ',
    teamB: 'فريق ب',
    rounds: 'الجولات',
    lifelines: 'الوسائل',
    timer: 'المؤقت',
    seconds: 'ث',
    cancel: 'إلغاء',
    begin: '← ابدأ',
    boardTitle: 'اختر مربع',
    boardSub: 'ست فئات. ثلاث درجات. الأصعب نقاط أكثر.',
    pass: 'تخطي',
    reveal: 'كشف الجواب',
    correct: 'صحيح',
    wrong: 'مرة ثانية',
    answer: 'الإجابة',
    rematch: 'جولة ثانية؟',
    newGame: 'لعبة جديدة',
    final: 'الختام',
    takesTheNight: 'يفوز بالليلة',
    tied: 'تعادل. المجلس يقسم الفوز.',
    home: 'الرئيسية',
    play: 'لعب',
    endGame: 'إنهاء',
    confirmEnd: 'تنهي الجولة؟',
    confirmEndSub: 'النقاط نهائية. المجلس يفض.',
    keepPlaying: 'استمر',
    yes: 'أنهِ',
    paused: 'متوقف',
    resume: 'استئناف',
    callFriend: 'اتصل بصديق',
    skipQ: 'تخطي السؤال',
    doublePts: 'مضاعفة النقاط',
    used: 'استخدمت',
    available: 'متاحة',
    points: 'نقطة',
    of: 'من',
    streak: 'متتالية',
    twoTeams: 'فريقَين. ليلة وحدة.',
    welcomeSub: 'اختر حزمة، قسّم الغرفة، اقضِ الليلة.',
    welcomeHost: 'أهلاً بك، يا مضيّف',
  },
};

const TIERS = {
  easy:   { id: 'easy',   en: 'Easy',   ar: 'سهل',  pts: 100, color: 'var(--olive-500)',   colorLight: 'var(--olive-300)' },
  medium: { id: 'medium', en: 'Medium', ar: 'وسط',  pts: 200, color: 'var(--saffron-500)', colorLight: 'var(--saffron-300)' },
  hard:   { id: 'hard',   en: 'Hard',   ar: 'صعب',  pts: 300, color: 'var(--rose-500)',    colorLight: 'var(--rose-300)' },
};

// Phosphor SVG icons inlined — single weight per surface
const ICON = {
  history: '<svg viewBox="0 0 256 256" fill="currentColor"><path d="M232 96a8 8 0 0 1-8 8h-29.32A104 104 0 1 1 64 207.36a8 8 0 0 1 12.86-9.51A88 88 0 1 0 76.21 86l11.18 11.21a8 8 0 0 1-5.66 13.66H32a8 8 0 0 1-8-8V53.66a8 8 0 0 1 13.66-5.66L48.41 58.74A104 104 0 0 1 224 88a8 8 0 0 1 8 8Zm-104 0a8 8 0 0 0-8 8v32a8 8 0 0 0 4 6.92l24 13.86a8 8 0 1 0 8-13.86L136 131.38V104a8 8 0 0 0-8-8Z"/></svg>',
  cinema: '<svg viewBox="0 0 256 256" fill="currentColor"><path d="M232 56v144a16 16 0 0 1-16 16H40a16 16 0 0 1-16-16V56a16 16 0 0 1 16-16h176a16 16 0 0 1 16 16ZM72 88H56v32h16Zm0 64H56v32h16Zm128-64h-16v32h16Zm0 64h-16v32h16Z"/></svg>',
  sports: '<svg viewBox="0 0 256 256" fill="currentColor"><path d="M223.93 130.59A95.78 95.78 0 0 0 192 56a95.78 95.78 0 0 0-128 0 95.78 95.78 0 0 0-31.93 74.59 96 96 0 0 0 191.86 0ZM128 24a72.07 72.07 0 0 1 64 39.07L161.21 96H94.79L64 63.07A72.07 72.07 0 0 1 128 24ZM48 80l16 16-16 16-16-16Zm80 152a72.07 72.07 0 0 1-64-39.07L94.79 160h66.42L192 192.93A72.07 72.07 0 0 1 128 232Zm80-64-16-16 16-16 16 16Z"/></svg>',
  music: '<svg viewBox="0 0 256 256" fill="currentColor"><path d="M212.92 25.69a8 8 0 0 0-6.86-1.45l-128 32A8 8 0 0 0 72 64v110.1A36 36 0 1 0 88 204V102.24l112-28v77.86A36 36 0 1 0 216 182V32a8 8 0 0 0-3.08-6.31Z"/></svg>',
  science: '<svg viewBox="0 0 256 256" fill="currentColor"><path d="M223.94 219.1 168 124.07V40h8a8 8 0 0 0 0-16H80a8 8 0 0 0 0 16h8v84.07L32.06 219.1A16 16 0 0 0 45.88 240h164.24a16 16 0 0 0 13.82-20.9Z"/></svg>',
  food: '<svg viewBox="0 0 256 256" fill="currentColor"><path d="M232 80h-24V72a48 48 0 0 0-93.59-15.66A48 48 0 0 0 24 72v8a16 16 0 0 0-16 16v40a96 96 0 0 0 192 0v-40a16 16 0 0 0-16-16Zm-72-32a32 32 0 0 1 32 32H128a32 32 0 0 1 32-32ZM72 40a32 32 0 0 1 32 32H40a32 32 0 0 1 32-32Z"/></svg>',
  language: '<svg viewBox="0 0 256 256" fill="currentColor"><path d="M239.65 226.55-149 51.91A21.76 21.76 0 0 0 130.55 40h-5.1a21.76 21.76 0 0 0-18.7 11.9L16.34 226.55a8 8 0 1 0 14.32 7.18L57.36 184h141.28l26.69 49.69a8 8 0 0 0 14.32-7.16ZM65.91 168 128 51.61 190.09 168Z"/></svg>',
  geo: '<svg viewBox="0 0 256 256" fill="currentColor"><path d="M128 24a104 104 0 1 0 104 104A104.12 104.12 0 0 0 128 24ZM92.42 71.7C77 78 60.27 89.91 53.13 117.94 80.69 116 88.6 105.94 92.42 71.7Z"/></svg>',
  poetry: '<svg viewBox="0 0 256 256" fill="currentColor"><path d="M208 24h-72a40 40 0 0 0-32 16 40 40 0 0 0-32-16H40a16 16 0 0 0-16 16v144a16 16 0 0 0 16 16h64a24 24 0 0 1 24 24 8 8 0 0 0 16 0 24 24 0 0 1 24-24h64a16 16 0 0 0 16-16V40a16 16 0 0 0-16-16Z"/></svg>',
};

const CATEGORIES = [
  { id: 'history',  en: 'History',   ar: 'التاريخ',   icon: ICON.history,  sub: { en: 'Kuwait, Gulf, world',   ar: 'الكويت، الخليج، العالم' } },
  { id: 'cinema',   en: 'Cinema',    ar: 'السينما',   icon: ICON.cinema,   sub: { en: 'Films & series',        ar: 'أفلام ومسلسلات' } },
  { id: 'sports',   en: 'Sports',    ar: 'الرياضة',   icon: ICON.sports,   sub: { en: 'Local & global',        ar: 'محلية وعالمية' } },
  { id: 'music',    en: 'Music',     ar: 'الموسيقى',  icon: ICON.music,    sub: { en: 'Khaleeji & pop',        ar: 'خليجية وعالمية' } },
  { id: 'science',  en: 'Science',   ar: 'العلوم',    icon: ICON.science,  sub: { en: 'Body & world',          ar: 'الجسد والعالم' } },
  { id: 'food',     en: 'Food',      ar: 'الطعام',    icon: ICON.food,     sub: { en: 'Recipes & origins',     ar: 'وصفات وأصول' } },
  { id: 'language', en: 'Language',  ar: 'اللغة',     icon: ICON.language, sub: { en: 'Words, sayings',        ar: 'كلمات وأمثال' } },
  { id: 'geo',      en: 'Geography', ar: 'الجغرافيا', icon: ICON.geo,      sub: { en: 'Places & flags',        ar: 'أماكن وأعلام' } },
  { id: 'poetry',   en: 'Poetry',    ar: 'الشعر',     icon: ICON.poetry,   sub: { en: 'Verses & poets',        ar: 'أبيات وشعراء' } },
];

// Sample question content for the board — each (category, tier) cell has one Q.
// Mix of Khaleeji-relevant + global. Real packs would be much larger.
const QUESTIONS = {
  history: {
    easy:   { q_en: 'Which year did Kuwait gain independence?',                                       q_ar: 'في أي عام استقلت الكويت؟',                                       a_en: '1961',                a_ar: '١٩٦١' },
    medium: { q_en: 'Who was the first ruler of the Al-Sabah dynasty?',                               q_ar: 'من هو أول حاكم من أسرة آل صباح؟',                                a_en: 'Sabah I bin Jaber',   a_ar: 'صباح الأول بن جابر' },
    hard:   { q_en: 'In what year was the Treaty of Uqair signed, defining Kuwait\'s borders?',        q_ar: 'في أي عام وُقّعت اتفاقية العقير التي رسمت حدود الكويت؟',         a_en: '1922',                a_ar: '١٩٢٢' },
  },
  cinema: {
    easy:   { q_en: 'Which director made "Wadjda", the first Saudi feature film?',                     q_ar: 'من أخرج فيلم "وجدة"، أول فيلم سعودي روائي طويل؟',              a_en: 'Haifaa al-Mansour',   a_ar: 'هيفاء المنصور' },
    medium: { q_en: '"Bab Al-Hara" first aired on which Arab TV channel?',                              q_ar: 'مسلسل "باب الحارة" بُث أول مرة على أي قناة؟',                  a_en: 'MBC',                 a_ar: 'إم بي سي' },
    hard:   { q_en: 'Which Egyptian film won the Cannes Jury Prize in 1997?',                           q_ar: 'أي فيلم مصري فاز بجائزة لجنة التحكيم في كان عام ١٩٩٧؟',         a_en: 'Destiny (Al-Massir)', a_ar: 'المصير' },
  },
  sports: {
    easy:   { q_en: 'Which country won the 2022 FIFA World Cup?',                                       q_ar: 'من فاز بكأس العالم لكرة القدم ٢٠٢٢؟',                            a_en: 'Argentina',           a_ar: 'الأرجنتين' },
    medium: { q_en: 'Kuwait\'s national football team is nicknamed?',                                  q_ar: 'ما لقب منتخب الكويت لكرة القدم؟',                              a_en: 'The Blues (Al-Azraq)', a_ar: 'الأزرق' },
    hard:   { q_en: 'Who was the first Arab to medal in Olympic 100m sprint history?',                   q_ar: 'من أول عربي حقق ميدالية أولمبية في سباق ١٠٠م؟',                a_en: 'Hassiba Boulmerka*',  a_ar: 'حسيبة بولمرقة*' },
  },
  music: {
    easy:   { q_en: 'Who is known as the "Star of the East"?',                                          q_ar: 'من تُلقّب بـ "كوكب الشرق"؟',                                    a_en: 'Umm Kulthum',         a_ar: 'أم كلثوم' },
    medium: { q_en: 'What instrument is Naseer Shamma famous for playing?',                              q_ar: 'بأي آلة اشتهر نصير شمة؟',                                       a_en: 'The oud',             a_ar: 'العود' },
    hard:   { q_en: 'In which year did Abdul Halim Hafez pass away?',                                   q_ar: 'في أي عام توفي عبد الحليم حافظ؟',                              a_en: '1977',                a_ar: '١٩٧٧' },
  },
  science: {
    easy:   { q_en: 'How many bones are in the adult human body?',                                       q_ar: 'كم عدد عظام جسم الإنسان البالغ؟',                              a_en: '206',                 a_ar: '٢٠٦' },
    medium: { q_en: 'What gas do plants release during photosynthesis?',                                 q_ar: 'ما الغاز الذي تطلقه النباتات خلال البناء الضوئي؟',              a_en: 'Oxygen',              a_ar: 'الأكسجين' },
    hard:   { q_en: 'What is the name of the longest bone in the human body?',                          q_ar: 'ما اسم أطول عظم في جسم الإنسان؟',                              a_en: 'The femur',           a_ar: 'عظم الفخذ' },
  },
  food: {
    easy:   { q_en: 'Which spice gives biryani its golden color?',                                      q_ar: 'ما التابل الذي يعطي البرياني لونه الذهبي؟',                    a_en: 'Saffron',             a_ar: 'الزعفران' },
    medium: { q_en: 'What is the main ingredient of "machboos"?',                                        q_ar: 'ما المكوّن الأساسي لـ "المجبوس"؟',                              a_en: 'Rice',                a_ar: 'الأرز' },
    hard:   { q_en: 'In which Gulf country did "luqaimat" originate?',                                  q_ar: 'في أي دولة خليجية نشأت "اللقيمات"؟',                            a_en: 'Disputed (UAE/Oman)', a_ar: 'متنازع عليه (الإمارات/عُمان)' },
  },
};

// "Packs" — collections shown in the library. The active pack populates the board.
const PACKS = [
  { id: 'pack-khaleej',  en: 'Khaleeji Classics',  ar: 'كلاسيكيات الخليج', count: 180, last: '3 days ago', color: 'var(--saffron-500)',  hot: true,  desc_en: 'Gulf history, music, food, dialect.', desc_ar: 'تاريخ الخليج وموسيقاه وطعامه ولهجاته.' },
  { id: 'pack-cinema',   en: 'Reel Arab',          ar: 'سينما عربية',     count: 120, last: 'last week',  color: 'var(--rose-500)',     hot: false, desc_en: 'A century of Arab film and TV.',     desc_ar: 'قرن من السينما والتلفزيون العربي.' },
  { id: 'pack-poetry',   en: 'Mu\'allaqat',        ar: 'المعلّقات',       count: 60,  last: 'never',      color: 'var(--teal-500)',     hot: false, desc_en: 'Pre-Islamic poetry, classical verse.',desc_ar: 'الشعر الجاهلي والكلاسيكي.' },
  { id: 'pack-world',    en: 'World General',      ar: 'ثقافة عامة',      count: 240, last: 'last month', color: 'var(--saffron-700)',  hot: false, desc_en: 'Mixed bag for casual rooms.',         desc_ar: 'خليط للجلسات الهادئة.' },
  { id: 'pack-sports',   en: 'Yalla Match',        ar: 'يلا ماتش',        count: 90,  last: '2 weeks',    color: 'var(--olive-500)',    hot: false, desc_en: 'Football, formula, fights.',          desc_ar: 'كرة، فورمولا، ملاكمة.' },
  { id: 'pack-kids',     en: 'Family Friendly',    ar: 'ودّية',           count: 100, last: 'never',      color: 'var(--teal-700)',     hot: false, desc_en: 'For when grandma is playing too.',    desc_ar: 'للجدّة حين تشاركنا.' },
];

// Default 6-pick category set that maps onto the board
const DEFAULT_BOARD_CATS = ['history','cinema','sports','music','science','food'];

const HISTORY_GAMES = [
  { date: 'Tonight',         pack: 'Khaleeji Classics', winner: 'Al-Diwaniya', score: '2,400 – 1,800' },
  { date: 'Yesterday',       pack: 'Reel Arab',         winner: 'Al-Salmiya',  score: '1,900 – 1,700' },
  { date: '2 weeks ago',     pack: 'World General',     winner: 'Al-Diwaniya', score: '3,100 – 2,600' },
  { date: 'Last month',      pack: 'Yalla Match',       winner: 'Al-Salmiya',  score: '2,800 – 2,400' },
];

Object.assign(window, { I18N, TIERS, CATEGORIES, QUESTIONS, PACKS, DEFAULT_BOARD_CATS, HISTORY_GAMES, ICON });
