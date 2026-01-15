// Til sozlamalari va tarjimalar
export type Language = 'uz' | 'ru' | 'en';

export interface Translations {
  // Common
  back: string;
  save: string;
  cancel: string;
  loading: string;
  error: string;
  success: string;

  // Home Page
  home: {
    title: string;
    subtitle: string;
    quickAccess: string;
    createRoom: string;
    roomCodePlaceholder: string;
    newGame: string;
    joinGame: string;
    availableRooms: string;
    openRooms: string;
    noRooms: string;
    players: string;
    join: string;
    stats: string;
    leaderboard: string;
    rules: string;
    settings: string;
    enterRoomCode: string;
    invalidRoomCode: string;
    roomNotFound: string;
  };

  // Settings Page
  settings: {
    title: string;
    audio: string;
    backgroundMusic: string;
    backgroundMusicDesc: string;
    volume: string;
    autoPlay: string;
    autoPlayDesc: string;
    voice: string;
    maleVoice: string;
    femaleVoice: string;
    other: string;
    vibration: string;
    vibrationDesc: string;
    notifications: string;
    notificationsDesc: string;
    language: string;
    about: string;
    version: string;
    telegramWebApp: string;
    copyright: string;
    developer: string;
  };

  // Rules Page
  rules: {
    title: string;
    whatIsMafia: string;
    mafiaDescription: string;
    roles: string;
    civilian: string;
    civilianDesc: string;
    mafia: string;
    mafiaDesc: string;
    don: string;
    donDesc: string;
    sheriff: string;
    sheriffDesc: string;
    doctor: string;
    doctorDesc: string;
    phases: string;
    roleAssignment: string;
    roleAssignmentDesc: string;
    nightStart: string;
    nightStartDesc: string;
    morning: string;
    morningDesc: string;
    discussion: string;
    discussionDesc: string;
    voting: string;
    votingDesc: string;
    lastWord: string;
    lastWordDesc: string;
    winConditions: string;
    civilianWin: string;
    civilianWinDesc: string;
    mafiaWin: string;
    mafiaWinDesc: string;
    importantRules: string;
    rule1: string;
    rule2: string;
    rule3: string;
    rule4: string;
    rule5: string;
    audioNarrator: string;
    audioNarratorDesc: string;
  };

  // Leaderboard
  leaderboard: {
    title: string;
    allTime: string;
    thisMonth: string;
    thisWeek: string;
    wins: string;
    winRate: string;
  };

  // Stats
  stats: {
    title: string;
    overview: string;
    totalGames: string;
    wins: string;
    losses: string;
    winRate: string;
    byRole: string;
    streaks: string;
    bestStreak: string;
    currentStreak: string;
  };

  // Game
  game: {
    waiting: string;
    starting: string;
    yourRole: string;
    night: string;
    day: string;
    discussion: string;
    voting: string;
    lastWord: string;
    gameOver: string;
    mafiaWins: string;
    civilianWins: string;
  };

  // Create Room
  createRoom: {
    title: string;
    roomName: string;
    roomNamePlaceholder: string;
    playersCount: string;
    minPlayers: string;
    maxPlayers: string;
    minimum: string;
    maximum: string;
    timeSettings: string;
    discussionTime: string;
    votingTime: string;
    nightTime: string;
    storyVariant: string;
    randomStory: string;
    variant: string;
    storyHint: string;
    rolesDistribution: string;
    playersFor: string;
    classic: string;
    detective: string;
    horror: string;
    create: string;
    enterRoomName: string;
    minute: string;
    minutes: string;
    seconds: string;
  };

  // Lobby
  lobby: {
    waitingPlayers: string;
    shareCode: string;
    copyLink: string;
    copied: string;
    startGame: string;
    leave: string;
    host: string;
    minPlayersNeeded: string;
  };
}

// O'zbek tili
export const uz: Translations = {
  back: '← Orqaga',
  save: '💾 Saqlash',
  cancel: 'Bekor qilish',
  loading: 'Yuklanmoqda...',
  error: 'Xatolik yuz berdi',
  success: 'Muvaffaqiyatli!',

  home: {
    title: "🎭 Mafia O'yini",
    subtitle: "Ovozli boshlovchi bilan",
    quickAccess: "Tezkor kirish",
    createRoom: "Yangi xona yaratish",
    roomCodePlaceholder: "Xona kodi (masalan: ABC123)",
    newGame: "🎮 Yangi o'yin",
    joinGame: "🚪 O'yinga qo'shilish",
    availableRooms: "📋 Mavjud xonalar",
    openRooms: "Ochiq xonalar",
    noRooms: "Hozircha xonalar yo'q",
    players: "o'yinchi",
    join: "Kirish",
    stats: 'Statistika',
    leaderboard: 'Reyting',
    rules: 'Qoidalar',
    settings: 'Sozlamalar',
    enterRoomCode: 'Xona kodini kiriting',
    invalidRoomCode: "Xona kodi 4-8 ta belgidan iborat bo'lishi kerak",
    roomNotFound: 'Xona topilmadi',
  },

  settings: {
    title: '⚙️ Sozlamalar',
    audio: "🔊 Audio sozlamalari",
    backgroundMusic: 'Fon musiqasi',
    backgroundMusicDesc: "Fon musiqasini yoqish/o'chirish",
    volume: 'Balandlik',
    autoPlay: "Avtomatik o'ynash",
    autoPlayDesc: 'Ovozli hikoyalarni avtomatik boshlash',
    voice: '🎙️ Hikoyachi ovozi',
    maleVoice: 'Erkak ovozi',
    femaleVoice: 'Ayol ovozi',
    other: '📱 Boshqa sozlamalar',
    vibration: 'Tebranish',
    vibrationDesc: 'Telefon tebranishini yoqish',
    notifications: 'Bildirishnomalar',
    notificationsDesc: "O'yin bildirishnomalarini olish",
    language: '🌐 Til',
    about: 'ℹ️ Ilova haqida',
    version: 'Versiya',
    telegramWebApp: 'Telegram Web App',
    copyright: '© 2024 Mafia Game UZ',
    developer: '👨‍💻 Dasturchi',
  },

  rules: {
    title: '📜 Qoidalar',
    whatIsMafia: "🎭 Mafia o'yini nima?",
    mafiaDescription: "Mafia — bu psixologik rol o'yini. O'yinchilar ikki guruhga bo'linadi: tinch aholi va mafia. Maqsad — qarama-qarshi jamoani yo'q qilish.",
    roles: '👥 Rollar',
    civilian: 'Tinch aholi',
    civilianDesc: "Oddiy fuqarolar. Mafialarni topib, ovoz berish orqali ularni yo'q qilishlari kerak.",
    mafia: 'Mafia',
    mafiaDesc: "Har kecha bir tinch aholini o'ldiradi. Kunduzi oddiy fuqaro bo'lib ko'rinishi kerak.",
    don: "Don (Mafia boshlig'i)",
    donDesc: "Mafia jamosining boshlig'i. Sheriffni topish uchun maxsus qobiliyatga ega.",
    sheriff: 'Komissar (Sheriff)',
    sheriffDesc: "Har kecha bir o'yinchini tekshiradi va uning mafia yoki yo'qligini biladi.",
    doctor: 'Doktor',
    doctorDesc: "Har kecha bir o'yinchini himoya qiladi. Himoya qilingan o'yinchi o'lmaydi.",
    phases: "🌙 O'yin bosqichlari",
    roleAssignment: 'Rollar taqsimlanadi',
    roleAssignmentDesc: "O'yinchilarga tasodifiy rollar beriladi. Faqat o'zingiz bilasiz!",
    nightStart: 'Tun boshlanadi',
    nightStartDesc: "Shahar uxlaydi. Mafia, Sheriff va Doktor o'z harakatlarini qiladi.",
    morning: 'Tong otadi',
    morningDesc: "Kechasi kim o'ldirilgani e'lon qilinadi.",
    discussion: 'Muhokama',
    discussionDesc: "O'yinchilar mafialarni topish uchun muhokama qiladi.",
    voting: 'Ovoz berish',
    votingDesc: "O'yinchilar eng shubhali odamga ovoz beradi. Eng ko'p ovoz olgan o'yinchi o'yindan chiqadi.",
    lastWord: "So'nggi so'z",
    lastWordDesc: "Chiqariladigan o'yinchi so'nggi so'zini aytadi.",
    winConditions: "🏆 G'alaba sharti",
    civilianWin: "Tinch aholi g'alaba qozadi",
    civilianWinDesc: "Agar barcha mafialar yo'q qilinsa",
    mafiaWin: "Mafia g'alaba qozadi",
    mafiaWinDesc: "Agar mafialar soni tinch aholiga teng bo'lsa",
    importantRules: '📌 Muhim qoidalar',
    rule1: "O'z rolingizni hech kimga aytmang!",
    rule2: 'Tun vaqtida gaplashmang',
    rule3: "O'yindan chiqqan o'yinchilar rollarini oshkor qila olmaydi",
    rule4: "Hurmatli bo'ling va boshqa o'yinchilarga hurmat ko'rsating",
    rule5: 'Audio hikoyachini diqqat bilan tinglang',
    audioNarrator: '🎧 Audio hikoyachi',
    audioNarratorDesc: "Bizning o'yinimizda professional audio hikoyachi bor! U o'yinning har bir bosqichida atmosferali hikoyalarni aytib beradi. 50 dan ortiq turli hikoya variantlari mavjud!",
  },

  leaderboard: {
    title: '🏆 Reyting',
    allTime: 'Barcha vaqt',
    thisMonth: 'Bu oy',
    thisWeek: 'Bu hafta',
    wins: "g'alaba",
    winRate: "G'alaba foizi",
  },

  stats: {
    title: 'Statistika',
    overview: 'Umumiy natijalar',
    totalGames: "Jami o'yinlar",
    wins: "G'alabalar",
    losses: "Mag'lubiyatlar",
    winRate: "G'alaba foizi",
    byRole: "Rollar bo'yicha",
    streaks: 'Seriyalar',
    bestStreak: 'Eng yaxshi seriya',
    currentStreak: 'Joriy seriya',
  },

  game: {
    waiting: "O'yinchilar kutilmoqda...",
    starting: "O'yin boshlanmoqda...",
    yourRole: 'Sizning rolingiz',
    night: '🌙 Tun',
    day: '☀️ Kun',
    discussion: '💬 Muhokama',
    voting: '🗳️ Ovoz berish',
    lastWord: "💭 So'nggi so'z",
    gameOver: "O'yin tugadi!",
    mafiaWins: "Mafia g'alaba qildi!",
    civilianWins: "Tinch aholi g'alaba qildi!",
  },

  createRoom: {
    title: "➕ Yangi xona",
    roomName: 'Xona nomi',
    roomNamePlaceholder: "Masalan: Do'stlar bilan o'yin",
    playersCount: "O'yinchilar soni",
    minPlayers: "Minimal o'yinchilar",
    maxPlayers: "Maksimal o'yinchilar",
    minimum: "Minimum",
    maximum: "Maximum",
    timeSettings: "⏱️ Vaqt sozlamalari",
    discussionTime: 'Muhokama vaqti',
    votingTime: 'Ovoz berish vaqti',
    nightTime: 'Tun vaqti',
    storyVariant: '🎭 Hikoya varianti',
    randomStory: '🎲 Tasodifiy',
    variant: "Variant",
    storyHint: "50 dan ortiq turli hikoya varianti mavjud. Har safar yangi tajriba!",
    rolesDistribution: "🎭 Rollar taqsimoti",
    playersFor: "o'yinchi uchun",
    classic: 'Klassik',
    detective: 'Detektiv',
    horror: "Qo'rqinchli",
    create: "Xona yaratish",
    enterRoomName: "Xona nomini kiriting",
    minute: "daqiqa",
    minutes: "daqiqa",
    seconds: "soniya",
  },

  lobby: {
    waitingPlayers: "O'yinchilar kutilmoqda",
    shareCode: 'Kodni ulashing',
    copyLink: 'Havolani nusxalash',
    copied: 'Nusxalandi!',
    startGame: "🎮 O'yinni boshlash",
    leave: '🚪 Chiqish',
    host: 'Xona egasi',
    minPlayersNeeded: "Kamida {min} o'yinchi kerak",
  },
};

// Rus tili
export const ru: Translations = {
  back: '← Назад',
  save: '💾 Сохранить',
  cancel: 'Отмена',
  loading: 'Загрузка...',
  error: 'Произошла ошибка',
  success: 'Успешно!',

  home: {
    title: '🎭 Игра Мафия',
    subtitle: 'С голосовым ведущим',
    quickAccess: 'Быстрый доступ',
    createRoom: 'Создать комнату',
    roomCodePlaceholder: 'Код комнаты (например: ABC123)',
    newGame: '🎮 Новая игра',
    joinGame: '🚪 Присоединиться',
    availableRooms: '📋 Доступные комнаты',
    openRooms: 'Открытые комнаты',
    noRooms: 'Пока нет комнат',
    players: 'игроков',
    join: 'Войти',
    stats: 'Статистика',
    leaderboard: 'Рейтинг',
    rules: 'Правила',
    settings: 'Настройки',
    enterRoomCode: 'Введите код комнаты',
    invalidRoomCode: 'Код комнаты должен содержать 4-8 символов',
    roomNotFound: 'Комната не найдена',
  },

  settings: {
    title: '⚙️ Настройки',
    audio: '🔊 Настройки звука',
    backgroundMusic: 'Фоновая музыка',
    backgroundMusicDesc: 'Включить/выключить фоновую музыку',
    volume: 'Громкость',
    autoPlay: 'Автовоспроизведение',
    autoPlayDesc: 'Автоматически запускать озвучку',
    voice: '🎙️ Голос рассказчика',
    maleVoice: 'Мужской голос',
    femaleVoice: 'Женский голос',
    other: '📱 Другие настройки',
    vibration: 'Вибрация',
    vibrationDesc: 'Включить вибрацию телефона',
    notifications: 'Уведомления',
    notificationsDesc: 'Получать игровые уведомления',
    language: '🌐 Язык',
    about: 'ℹ️ О приложении',
    version: 'Версия',
    telegramWebApp: 'Telegram Web App',
    copyright: '© 2024 Mafia Game UZ',
    developer: '👨‍💻 Разработчик',
  },

  rules: {
    title: '📜 Правила',
    whatIsMafia: '🎭 Что такое Мафия?',
    mafiaDescription: 'Мафия — это психологическая ролевая игра. Игроки делятся на две группы: мирные жители и мафия. Цель — уничтожить противоположную команду.',
    roles: '👥 Роли',
    civilian: 'Мирный житель',
    civilianDesc: 'Обычные граждане. Должны найти и устранить мафию голосованием.',
    mafia: 'Мафия',
    mafiaDesc: 'Каждую ночь убивает одного мирного жителя. Днём должна притворяться обычным гражданином.',
    don: 'Дон (Глава мафии)',
    donDesc: 'Глава мафиозной семьи. Имеет особую способность находить шерифа.',
    sheriff: 'Комиссар (Шериф)',
    sheriffDesc: 'Каждую ночь проверяет одного игрока и узнаёт, мафия он или нет.',
    doctor: 'Доктор',
    doctorDesc: 'Каждую ночь защищает одного игрока. Защищённый игрок не погибает.',
    phases: '🌙 Фазы игры',
    roleAssignment: 'Раздача ролей',
    roleAssignmentDesc: 'Игрокам случайно назначаются роли. Только вы знаете свою роль!',
    nightStart: 'Наступает ночь',
    nightStartDesc: 'Город засыпает. Мафия, шериф и доктор совершают свои действия.',
    morning: 'Наступает утро',
    morningDesc: 'Объявляется, кто был убит ночью.',
    discussion: 'Обсуждение',
    discussionDesc: 'Игроки обсуждают, кто может быть мафией.',
    voting: 'Голосование',
    votingDesc: 'Игроки голосуют за самого подозрительного. Игрок с наибольшим числом голосов выбывает.',
    lastWord: 'Последнее слово',
    lastWordDesc: 'Выбывающий игрок произносит последнее слово.',
    winConditions: '🏆 Условия победы',
    civilianWin: 'Мирные жители побеждают',
    civilianWinDesc: 'Если все мафиози устранены',
    mafiaWin: 'Мафия побеждает',
    mafiaWinDesc: 'Если число мафии сравнялось с мирными',
    importantRules: '📌 Важные правила',
    rule1: 'Не раскрывайте свою роль!',
    rule2: 'Не разговаривайте во время ночи',
    rule3: 'Выбывшие игроки не раскрывают свои роли',
    rule4: 'Уважайте других игроков',
    rule5: 'Внимательно слушайте рассказчика',
    audioNarrator: '🎧 Аудио рассказчик',
    audioNarratorDesc: 'В нашей игре есть профессиональный аудио рассказчик! Он озвучивает каждую фазу игры. Более 50 вариантов историй!',
  },

  leaderboard: {
    title: '🏆 Рейтинг',
    allTime: 'За всё время',
    thisMonth: 'Этот месяц',
    thisWeek: 'Эта неделя',
    wins: 'побед',
    winRate: 'Процент побед',
  },

  stats: {
    title: 'Статистика',
    overview: 'Общие результаты',
    totalGames: 'Всего игр',
    wins: 'Победы',
    losses: 'Поражения',
    winRate: 'Процент побед',
    byRole: 'По ролям',
    streaks: 'Серии',
    bestStreak: 'Лучшая серия',
    currentStreak: 'Текущая серия',
  },

  game: {
    waiting: 'Ожидание игроков...',
    starting: 'Игра начинается...',
    yourRole: 'Ваша роль',
    night: '🌙 Ночь',
    day: '☀️ День',
    discussion: '💬 Обсуждение',
    voting: '🗳️ Голосование',
    lastWord: '💭 Последнее слово',
    gameOver: 'Игра окончена!',
    mafiaWins: 'Мафия победила!',
    civilianWins: 'Мирные жители победили!',
  },

  createRoom: {
    title: '➕ Новая комната',
    roomName: 'Название комнаты',
    roomNamePlaceholder: 'Например: Игра с друзьями',
    playersCount: 'Количество игроков',
    minPlayers: 'Минимум игроков',
    maxPlayers: 'Максимум игроков',
    minimum: 'Минимум',
    maximum: 'Максимум',
    timeSettings: '⏱️ Настройки времени',
    discussionTime: 'Время обсуждения',
    votingTime: 'Время голосования',
    nightTime: 'Время ночи',
    storyVariant: '🎭 Вариант истории',
    randomStory: '🎲 Случайный',
    variant: 'Вариант',
    storyHint: 'Более 50 различных вариантов историй. Каждый раз новый опыт!',
    rolesDistribution: '🎭 Распределение ролей',
    playersFor: 'игроков',
    classic: 'Классика',
    detective: 'Детектив',
    horror: 'Ужасы',
    create: 'Создать комнату',
    enterRoomName: 'Введите название комнаты',
    minute: 'минута',
    minutes: 'минут',
    seconds: 'секунд',
  },

  lobby: {
    waitingPlayers: 'Ожидание игроков',
    shareCode: 'Поделитесь кодом',
    copyLink: 'Копировать ссылку',
    copied: 'Скопировано!',
    startGame: '🎮 Начать игру',
    leave: '🚪 Выйти',
    host: 'Владелец комнаты',
    minPlayersNeeded: 'Нужно минимум {min} игроков',
  },
};

// Ingliz tili
export const en: Translations = {
  back: '← Back',
  save: '💾 Save',
  cancel: 'Cancel',
  loading: 'Loading...',
  error: 'An error occurred',
  success: 'Success!',

  home: {
    title: '🎭 Mafia Game',
    subtitle: 'With Voice Narrator',
    quickAccess: 'Quick Access',
    createRoom: 'Create New Room',
    roomCodePlaceholder: 'Room code (e.g., ABC123)',
    newGame: '🎮 New Game',
    joinGame: '🚪 Join Game',
    availableRooms: '📋 Available Rooms',
    openRooms: 'Open Rooms',
    noRooms: 'No rooms available',
    players: 'players',
    join: 'Join',
    stats: 'Statistics',
    leaderboard: 'Leaderboard',
    rules: 'Rules',
    settings: 'Settings',
    enterRoomCode: 'Enter room code',
    invalidRoomCode: 'Room code must be 4-8 characters',
    roomNotFound: 'Room not found',
  },

  settings: {
    title: '⚙️ Settings',
    audio: '🔊 Audio Settings',
    backgroundMusic: 'Background Music',
    backgroundMusicDesc: 'Enable/disable background music',
    volume: 'Volume',
    autoPlay: 'Auto Play',
    autoPlayDesc: 'Automatically start voice narration',
    voice: '🎙️ Narrator Voice',
    maleVoice: 'Male Voice',
    femaleVoice: 'Female Voice',
    other: '📱 Other Settings',
    vibration: 'Vibration',
    vibrationDesc: 'Enable phone vibration',
    notifications: 'Notifications',
    notificationsDesc: 'Receive game notifications',
    language: '🌐 Language',
    about: 'ℹ️ About',
    version: 'Version',
    telegramWebApp: 'Telegram Web App',
    copyright: '© 2024 Mafia Game UZ',
    developer: '👨‍💻 Developer',
  },

  rules: {
    title: '📜 Rules',
    whatIsMafia: '🎭 What is Mafia?',
    mafiaDescription: 'Mafia is a psychological role-playing game. Players are divided into two groups: civilians and mafia. The goal is to eliminate the opposing team.',
    roles: '👥 Roles',
    civilian: 'Civilian',
    civilianDesc: 'Regular citizens. Must find and eliminate mafia through voting.',
    mafia: 'Mafia',
    mafiaDesc: 'Kills one civilian each night. Must pretend to be a regular citizen during the day.',
    don: 'Don (Mafia Boss)',
    donDesc: 'Head of the mafia family. Has a special ability to find the sheriff.',
    sheriff: 'Sheriff',
    sheriffDesc: 'Checks one player each night and learns if they are mafia or not.',
    doctor: 'Doctor',
    doctorDesc: 'Protects one player each night. The protected player cannot be killed.',
    phases: '🌙 Game Phases',
    roleAssignment: 'Role Assignment',
    roleAssignmentDesc: 'Players are randomly assigned roles. Only you know your role!',
    nightStart: 'Night Falls',
    nightStartDesc: 'The city sleeps. Mafia, sheriff, and doctor perform their actions.',
    morning: 'Morning Comes',
    morningDesc: 'It is announced who was killed during the night.',
    discussion: 'Discussion',
    discussionDesc: 'Players discuss who might be mafia.',
    voting: 'Voting',
    votingDesc: 'Players vote for the most suspicious person. The player with the most votes is eliminated.',
    lastWord: 'Last Word',
    lastWordDesc: 'The eliminated player says their last word.',
    winConditions: '🏆 Win Conditions',
    civilianWin: 'Civilians Win',
    civilianWinDesc: 'If all mafia members are eliminated',
    mafiaWin: 'Mafia Wins',
    mafiaWinDesc: 'If mafia count equals civilians',
    importantRules: '📌 Important Rules',
    rule1: "Don't reveal your role!",
    rule2: "Don't talk during the night",
    rule3: 'Eliminated players cannot reveal their roles',
    rule4: 'Be respectful to other players',
    rule5: 'Listen carefully to the narrator',
    audioNarrator: '🎧 Audio Narrator',
    audioNarratorDesc: 'Our game has a professional audio narrator! They narrate each phase of the game. Over 50 story variants available!',
  },

  leaderboard: {
    title: '🏆 Leaderboard',
    allTime: 'All Time',
    thisMonth: 'This Month',
    thisWeek: 'This Week',
    wins: 'wins',
    winRate: 'Win Rate',
  },

  stats: {
    title: 'Statistics',
    overview: 'Overview',
    totalGames: 'Total Games',
    wins: 'Wins',
    losses: 'Losses',
    winRate: 'Win Rate',
    byRole: 'By Role',
    streaks: 'Streaks',
    bestStreak: 'Best Streak',
    currentStreak: 'Current Streak',
  },

  game: {
    waiting: 'Waiting for players...',
    starting: 'Game starting...',
    yourRole: 'Your Role',
    night: '🌙 Night',
    day: '☀️ Day',
    discussion: '💬 Discussion',
    voting: '🗳️ Voting',
    lastWord: '💭 Last Word',
    gameOver: 'Game Over!',
    mafiaWins: 'Mafia Wins!',
    civilianWins: 'Civilians Win!',
  },

  createRoom: {
    title: '➕ New Room',
    roomName: 'Room Name',
    roomNamePlaceholder: 'e.g., Game with friends',
    playersCount: 'Number of Players',
    minPlayers: 'Min Players',
    maxPlayers: 'Max Players',
    minimum: 'Minimum',
    maximum: 'Maximum',
    timeSettings: '⏱️ Time Settings',
    discussionTime: 'Discussion Time',
    votingTime: 'Voting Time',
    nightTime: 'Night Time',
    storyVariant: '🎭 Story Variant',
    randomStory: '🎲 Random',
    variant: 'Variant',
    storyHint: 'Over 50 different story variants. A new experience every time!',
    rolesDistribution: '🎭 Roles Distribution',
    playersFor: 'players',
    classic: 'Classic',
    detective: 'Detective',
    horror: 'Horror',
    create: 'Create Room',
    enterRoomName: 'Enter room name',
    minute: 'minute',
    minutes: 'minutes',
    seconds: 'seconds',
  },

  lobby: {
    waitingPlayers: 'Waiting for Players',
    shareCode: 'Share Code',
    copyLink: 'Copy Link',
    copied: 'Copied!',
    startGame: '🎮 Start Game',
    leave: '🚪 Leave',
    host: 'Room Host',
    minPlayersNeeded: 'Need at least {min} players',
  },
};

// Tarjimalar lug'ati
export const translations: Record<Language, Translations> = {
  uz,
  ru,
  en,
};

// Default til
export const defaultLanguage: Language = 'uz';

// Til nomlarini ko'rsatish uchun
export const languageNames: Record<Language, string> = {
  uz: "O'zbekcha",
  ru: 'Русский',
  en: 'English',
};

// Til bayroqlari
export const languageFlags: Record<Language, string> = {
  uz: '🇺🇿',
  ru: '🇷🇺',
  en: '🇬🇧',
};
