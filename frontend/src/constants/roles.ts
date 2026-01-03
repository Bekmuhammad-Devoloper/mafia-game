// Rollar konstantalari
export const ROLES = {
  CIVILIAN: {
    id: 'CIVILIAN',
    name: "Tinch aholi",
    nameUz: "Oddiy fuqaro",
    image: '/images/role.oddiyaholi.png',
    color: '#3498db',
    gradient: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
    description: "Mafiyani topib, ovoz berish orqali yo'q qilish vazifasi."
  },
  MAFIA: {
    id: 'MAFIA',
    name: "Mafiya",
    nameUz: "Mafiya",
    image: '/images/role.mafiya.png',
    color: '#e74c3c',
    gradient: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
    description: "Tungi paytda tinch aholini o'ldirish vazifasi."
  },
  DON: {
    id: 'DON',
    name: "Don",
    nameUz: "Don",
    image: '/images/role.don.png',
    color: '#9b59b6',
    gradient: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)',
    description: "Mafiya boshlig'i. Komissarni topish uchun tekshirish huquqi bor."
  },
  SHERIFF: {
    id: 'SHERIFF',
    name: "Komissar",
    nameUz: "Komissar",
    image: '/images/role.kamissar.png',
    color: '#f39c12',
    gradient: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)',
    description: "Tungi paytda o'yinchilarni tekshirish huquqi bor."
  },
  DOCTOR: {
    id: 'DOCTOR',
    name: "Doktor",
    nameUz: "Shifokor",
    image: '/images/role.doctor.png',
    color: '#2ecc71',
    gradient: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)',
    description: "Tungi paytda bir o'yinchini davolash huquqi bor."
  }
} as const;

export type RoleId = keyof typeof ROLES;

// Rol rasmini olish funksiyasi
export const getRoleImage = (roleId: string): string => {
  const role = ROLES[roleId as RoleId];
  return role?.image || '/images/role.oddiyaholi.png';
};

// Rol ma'lumotini olish
export const getRoleInfo = (roleId: string) => {
  return ROLES[roleId as RoleId] || ROLES.CIVILIAN;
};

// Rollarni o'yinchilar soniga qarab hisoblash
// Mafiya o'yini klassik qoidalari:
// - Mafiya jamoasi: taxminan o'yinchilarning 1/3 qismi (Don + oddiy mafiyalar)
// - Tinch aholi: qolgan o'yinchilar (Komissar + Doktor + oddiy fuqarolar)
export const calculateRoles = (playerCount: number) => {
  // Mafiya jamoasi soni (Don bilan birga)
  const mafiaTeamCount = Math.floor(playerCount / 3);
  
  // Don har doim 1 ta
  const don = 1;
  
  // Oddiy mafiya = mafiya jamoasi - Don
  const mafia = Math.max(0, mafiaTeamCount - don);
  
  // Maxsus rollar (Komissar va Doktor)
  const sheriff = 1;
  const doctor = 1;
  
  // Tinch aholi = jami o'yinchilar - mafiya jamoasi - komissar - doktor
  const civilian = playerCount - mafiaTeamCount - sheriff - doctor;
  
  // Jami tekshiruv: civilian + mafia + don + sheriff + doctor = playerCount
  // console.log(`Players: ${playerCount}, Civilian: ${civilian}, Mafia: ${mafia}, Don: ${don}, Sheriff: ${sheriff}, Doctor: ${doctor}, Total: ${civilian + mafia + don + sheriff + doctor}`);
  
  return {
    civilian: Math.max(1, civilian),
    mafia: Math.max(0, mafia),
    don,
    sheriff,
    doctor
  };
};
