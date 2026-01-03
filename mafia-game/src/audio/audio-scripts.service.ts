import { Injectable } from '@nestjs/common';
import { AudioCategory } from '@prisma/client';

// ============================================
// OVOZLI SKRIPTLAR - 50+ VARIANTLAR
// ============================================

export interface AudioScript {
  category: AudioCategory;
  variant: number;
  textUz: string;
  textRu?: string;
}

@Injectable()
export class AudioScriptsService {
  
  // ============================================
  // O'YIN BOSHLANISHI - 5 VARIANT
  // ============================================
  private readonly gameStartScripts: AudioScript[] = [
    {
      category: AudioCategory.GAME_START,
      variant: 1,
      textUz: `Assalomu alaykum, aziz o'yinchilar! Bizning qishlog'imizga qorong'i kunlar 
keldi. Mafia shaharni qo'lga kiritmoqda. Sizlar tinch aholining yagona 
umidi sizlar. Keling, birgalikda yovuzlikni yengamiz!`,
    },
    {
      category: AudioCategory.GAME_START,
      variant: 2,
      textUz: `Tun bo'yi shahar jimjit. Lekin bu jim-jitlik aldamchi. Qorong'ilikda 
dahshatli sir yashiringan. Mafia o'rtangizda... Kim ekanligini bilib 
olishingiz kerak... Toki juda kech bo'lmasdan...`,
    },
    {
      category: AudioCategory.GAME_START,
      variant: 3,
      textUz: `Qadim zamonlardan beri bu shahar tinchlikda yashardi. Ammo bir kuni, 
qorong'i kuchlar bu yerga kirib keldi. Endi har bir tun - sinovdan, har 
bir kun - kurashdan iborat. Sizning hikoyangiz bugun boshlanadi...`,
    },
    {
      category: AudioCategory.GAME_START,
      variant: 4,
      textUz: `Tayyor bo'linglar, o'yinchilar! Bu oddiy o'yin emas, bu aql, jasorat va 
ishonch sinovi! Mafia sizni aldamoqchi bo'ladi, lekin sizda kuch bor - 
birgalikdagi kuch! O'yin boshlansin!`,
    },
    {
      category: AudioCategory.GAME_START,
      variant: 5,
      textUz: `Nima bo'lyapti? Shahar aholisi kamayib bormoqda... Har kecha kimdir 
g'oyib bo'ladi. Siz detektivlarsiz, siz qutqaruvchilarsiz. Sirni ochishga 
tayyormisiz?`,
    },
  ];

  // ============================================
  // TUN BOSHLANISHI - 5 VARIANT
  // ============================================
  private readonly nightStartScripts: AudioScript[] = [
    {
      category: AudioCategory.NIGHT_START,
      variant: 1,
      textUz: `Quyosh botdi... Shahar uxlayapti... Ammo hamma uxlamaydi. Qorong'ilikda 
sirli qadamlar eshitilmoqda. Tun o'z sirlari bilan keldi...`,
    },
    {
      category: AudioCategory.NIGHT_START,
      variant: 2,
      textUz: `Tunning jim-jitligida faqat shamol tovushi. Uylar zulmatga cho'mdi. Lekin 
bir nechta ko'zlar hali ochiq... Mafia uyg'ondi...`,
    },
    {
      category: AudioCategory.NIGHT_START,
      variant: 3,
      textUz: `Yulduzlar osmondan qarab turibdi. Ular hamma narsani ko'rishadi. Bugun 
kechada kim hayotini yo'qotadi? Tun o'z hukmini chiqarmoqda...`,
    },
    {
      category: AudioCategory.NIGHT_START,
      variant: 4,
      textUz: `Shahar uxlaydi, lekin xavf uxlamaydi. Qorong'i soyalar ko'chalarni kezib 
yuribdi. Tun jamoasi ishga tushdi...`,
    },
    {
      category: AudioCategory.NIGHT_START,
      variant: 5,
      textUz: `Soat yarim tunni ko'rsatmoqda. Eng qorong'i vaqt keldi. Kimningdir taqdiri 
bugun kechada hal bo'ladi...`,
    },
  ];

  // ============================================
  // MAFIA UYG'ONISHI - 5 VARIANT
  // ============================================
  private readonly mafiaWakeScripts: AudioScript[] = [
    {
      category: AudioCategory.MAFIA_WAKE,
      variant: 1,
      textUz: `Mafia, ko'zlaringizni oching! Siz bir-biringizni ko'rishingiz mumkin. 
Bugun kim sizning qurboningiz bo'ladi? Tanglang...`,
    },
    {
      category: AudioCategory.MAFIA_WAKE,
      variant: 2,
      textUz: `Shahar zulmatga botgan. Faqat sizlar, qorong'i jamoa, faol bo'lasiz. 
Kimni tanlaysiz? Sizning vaqtingiz boshlandi...`,
    },
    {
      category: AudioCategory.MAFIA_WAKE,
      variant: 3,
      textUz: `Mafiya! Sening vaqting keldi. Qaysi tinch aholi vakili bugun so'nggi 
marta quyoshni ko'radi? Qaroringizni yetkating...`,
    },
    {
      category: AudioCategory.MAFIA_WAKE,
      variant: 4,
      textUz: `Qorong'i kuchlar faollashdi. Mafia, siz bugun kimni tanlaysiz? Ehtiyot 
bo'ling, har bir tanlov muhim...`,
    },
    {
      category: AudioCategory.MAFIA_WAKE,
      variant: 5,
      textUz: `Soyalar harakatga keldi. Mafia a'zolari, sizning rejangiz nima? Kim 
yo'qolib ketishi kerak?`,
    },
  ];

  // ============================================
  // SHERIFF UYG'ONISHI - 5 VARIANT
  // ============================================
  private readonly sheriffWakeScripts: AudioScript[] = [
    {
      category: AudioCategory.SHERIFF_WAKE,
      variant: 1,
      textUz: `Komissar, uyg'oning! Sen politsiyaning eng yaxshi detektivisisan. Bugun 
kimni tekshirmoqchisan? Tanlang va haqiqatni bilib oling...`,
    },
    {
      category: AudioCategory.SHERIFF_WAKE,
      variant: 2,
      textUz: `Shahar sherifi! Sening intuitsiyangga tayanamiz. Birini tanlang va uning 
haqiqiy yuzini ko'ring...`,
    },
    {
      category: AudioCategory.SHERIFF_WAKE,
      variant: 3,
      textUz: `Komissar, vaqting boshlandi. Sen kimdan shubhalanasan? Bir kishini tekshir, 
lekin ehtiyot bo'l - faqat bir imkoniyating bor...`,
    },
    {
      category: AudioCategory.SHERIFF_WAKE,
      variant: 4,
      textUz: `Politsiya boshlig'i! Shahar seni himoyachisi sifatida biladi. Kimni 
surishtirasiz? Qaroringizni qiling...`,
    },
    {
      category: AudioCategory.SHERIFF_WAKE,
      variant: 5,
      textUz: `Detektiv! Sizning tajribangiz bugun kerak. Birini tanlang va uning sirini 
oching...`,
    },
  ];

  // ============================================
  // DOKTOR UYG'ONISHI - 5 VARIANT
  // ============================================
  private readonly doctorWakeScripts: AudioScript[] = [
    {
      category: AudioCategory.DOCTOR_WAKE,
      variant: 1,
      textUz: `Doktor, uyg'oning! Sen hayot qutqaruvchisan. Bugun kimni himoya qilasan? 
Tanlang va uni o'limdan saqlang...`,
    },
    {
      category: AudioCategory.DOCTOR_WAKE,
      variant: 2,
      textUz: `Shifokor! Shahar senga umid bog'lagan. Bir kishini tanlang va uni qo'riqlang. 
Kim sizning himoyangizga muhtoj?`,
    },
    {
      category: AudioCategory.DOCTOR_WAKE,
      variant: 3,
      textUz: `Doktor, vaqting boshlandi. Bugun kimning hayoti xavf ostida? Uni toping 
va himoya qiling...`,
    },
    {
      category: AudioCategory.DOCTOR_WAKE,
      variant: 4,
      textUz: `Tibbiy yordam kerak! Doktor, siz kimni hayotda qoldirasiz? Tezda qaror 
qiling...`,
    },
    {
      category: AudioCategory.DOCTOR_WAKE,
      variant: 5,
      textUz: `Shifokor, shahar seni chaqirmoqda. Bir kishini tanlang va unga yordam 
bering...`,
    },
  ];

  // ============================================
  // DON UYG'ONISHI - 5 VARIANT
  // ============================================
  private readonly donWakeScripts: AudioScript[] = [
    {
      category: AudioCategory.DON_WAKE,
      variant: 1,
      textUz: `Don, sizning navbatingiz! Siz mafia boshlig'isiz. Sheriffni topishingiz kerak. 
Kimni tekshirasiz?`,
    },
    {
      category: AudioCategory.DON_WAKE,
      variant: 2,
      textUz: `Qorong'ilik hukmroni! Don, siz sheriffni izlashingiz kerak. Bir kishini tanlang 
va uning kimligini bilib oling...`,
    },
    {
      category: AudioCategory.DON_WAKE,
      variant: 3,
      textUz: `Don! Sizning maxfiy missiyangiz - sheriffni topish. Kim sheriff bo'lishi mumkin? 
Tekshiring...`,
    },
    {
      category: AudioCategory.DON_WAKE,
      variant: 4,
      textUz: `Mafia boshlig'i! Siz sheriffni topib, uni yo'q qilishingiz kerak. Birini 
tanlang va tekshiring...`,
    },
    {
      category: AudioCategory.DON_WAKE,
      variant: 5,
      textUz: `Don, sizning kuchingiz sheriffni topishda. Kim bu qahramon? Siringizni 
ochishga vaqt keldi...`,
    },
  ];

  // ============================================
  // TONG - HECH KIM O'LMAGAN - 5 VARIANT
  // ============================================
  private readonly morningNoDeathScripts: AudioScript[] = [
    {
      category: AudioCategory.MORNING_NO_DEATH,
      variant: 1,
      textUz: `Quyosh chiqdi! Shahar uyg'onmoqda... Va ajoyib yangilik - bugun hamma 
tirik! Ehtimol doktor o'z ishini yaxshi qildi, yoki mafia xato qildi...`,
    },
    {
      category: AudioCategory.MORNING_NO_DEATH,
      variant: 2,
      textUz: `Tong ochildi! Odamlar ko'chaga chiqishdi va hayratlanishdi - hamma joyida! 
Bu mo'jiza yoki omadmi? Nima bo'lganini bilamiz...`,
    },
    {
      category: AudioCategory.MORNING_NO_DEATH,
      variant: 3,
      textUz: `Yangi kun boshlandi! Va bu kun yaxshi boshlanmoqda - hech kim yo'qolmadi! 
Lekin ehtiyot bo'ling, xavf hali ham mavjud...`,
    },
    {
      category: AudioCategory.MORNING_NO_DEATH,
      variant: 4,
      textUz: `Eshiting, eshiting! Bugun ajoyib yangilik bor - barcha qishloq aholisi 
sog'-omon! Lekin mafia hali ham oramizda...`,
    },
    {
      category: AudioCategory.MORNING_NO_DEATH,
      variant: 5,
      textUz: `Kun yorishdi! Va birinchi yangilik - hech qanday fojia yo'q! Hammamiz 
tirikman. Lekin kurash davom etmoqda...`,
    },
  ];

  // ============================================
  // TONG - KIMDIR O'LDI - 5 VARIANT
  // ============================================
  private readonly morningDeathScripts: AudioScript[] = [
    {
      category: AudioCategory.MORNING_DEATH,
      variant: 1,
      textUz: `Tong ochildi... Lekin bu qora tong. Kecha {playerName} bizni tark etdi. Shahar 
yana bir farzandini yo'qotdi. Uning xotirasi abadiy qolsin...`,
    },
    {
      category: AudioCategory.MORNING_DEATH,
      variant: 2,
      textUz: `Fojiali yangilik! Bugun ertalab {playerName} uyida tirik topilmadi. Mafia yana 
zarba berdi. Unga rahmat bo'lsin...`,
    },
    {
      category: AudioCategory.MORNING_DEATH,
      variant: 3,
      textUz: `Shahar qayg'uda! Kecha {playerName} o'ldirildi. Endi bizni bitta kam qoldi. Kim 
keyingi bo'ladi? Kim bu jinoyatchi?`,
    },
    {
      category: AudioCategory.MORNING_DEATH,
      variant: 4,
      textUz: `Og'ir yangilik... {playerName} orasida endi yo'q. Kecha qorong'ilik uni olib 
ketdi. Shahar yig'lamoqda...`,
    },
    {
      category: AudioCategory.MORNING_DEATH,
      variant: 5,
      textUz: `Dahshatli tong! {playerName} hayotdan ko'z yumdi. Mafia yana g'alaba qozondi. 
Lekin biz taslim bo'lmaymiz!`,
    },
  ];

  // ============================================
  // MUHOKAMA - 5 VARIANT
  // ============================================
  private readonly discussionScripts: AudioScript[] = [
    {
      category: AudioCategory.DISCUSSION,
      variant: 1,
      textUz: `Endi muhokama vaqti! Sizda {time} daqiqa bor. Kim jinoyatchi deb 
o'ylaysizlar? Gapiring, fikrlaringizni bildiring, lekin ehtiyot bo'ling - 
har bir so'z muhim!`,
    },
    {
      category: AudioCategory.DISCUSSION,
      variant: 2,
      textUz: `Majlis boshlandi! Kimdir aybdor, kimdir gunohsiz. Sizning vazifangiz - 
haqiqatni topish. Muhokamangiz boshlandi...`,
    },
    {
      category: AudioCategory.DISCUSSION,
      variant: 3,
      textUz: `Endi gap navbati! Har biringiz o'z fikringizni aytishi mumkin. Kim 
shubhali? Kim ishonchli? {time} daqiqa ichida hal qiling!`,
    },
    {
      category: AudioCategory.DISCUSSION,
      variant: 4,
      textUz: `Shahar aholisi yig'ildi! Gapirish vaqti keldi. Kimni ayblamoqchisiz? 
Dalillaringiz bormi? Eshiting va qaror qiling!`,
    },
    {
      category: AudioCategory.DISCUSSION,
      variant: 5,
      textUz: `Muhokama maydoni! Har bir so'z, har bir qarash muhim. {time} daqiqa - bu 
haqiqatni topish uchun yetarli vaqtmi? Ko'ramiz...`,
    },
  ];

  // ============================================
  // OVOZ BERISH - 5 VARIANT
  // ============================================
  private readonly votingScripts: AudioScript[] = [
    {
      category: AudioCategory.VOTING,
      variant: 1,
      textUz: `Ovoz berish vaqti! Har biringiz bitta ovozga egasiz. Kim ketishi kerak? 
Kimni ketkazasiz? Baho bering!`,
    },
    {
      category: AudioCategory.VOTING,
      variant: 2,
      textUz: `Hukm chiqarish vaqti keldi! Kimni qishloqdan haydamoqchisiz? Ovozlaringizni 
bering...`,
    },
    {
      category: AudioCategory.VOTING,
      variant: 3,
      textUz: `Demokratiya ishlayapti! Har bir ovoz muhim. Kim eng ko'p ovoz oladi? 
Boshlang!`,
    },
    {
      category: AudioCategory.VOTING,
      variant: 4,
      textUz: `Sud vaqti! Nomzodlar tayyorlangan. Endi sizning ovozingiz kerak. Kim 
ketadi?`,
    },
    {
      category: AudioCategory.VOTING,
      variant: 5,
      textUz: `Qaror qabul qilish lahzasi! Qaysi nomzod ketishi kerak? Ovoz bering!`,
    },
  ];

  // ============================================
  // ELIMINATSIYA - 5 VARIANT
  // ============================================
  private readonly eliminationScripts: AudioScript[] = [
    {
      category: AudioCategory.ELIMINATION,
      variant: 1,
      textUz: `Qaror qabul qilindi! {playerName} eng ko'p ovoz oldi. Endi uning so'nggi so'zi. 
Eshitamiz...`,
    },
    {
      category: AudioCategory.ELIMINATION,
      variant: 2,
      textUz: `Xalq hukm chiqardi! {playerName}, sen surilding. Bizga nima demoqchisan? 
Oxirgi imkoniyat...`,
    },
    {
      category: AudioCategory.ELIMINATION,
      variant: 3,
      textUz: `{playerName}! Shahar aholisi seni aybdor deb topdi. Endi so'nggi so'zing. 
30 soniya...`,
    },
    {
      category: AudioCategory.ELIMINATION,
      variant: 4,
      textUz: `Hukm - {playerName} ketadi! Lekin avval so'nggi so'zni eshitamiz. Gap senda...`,
    },
    {
      category: AudioCategory.ELIMINATION,
      variant: 5,
      textUz: `{playerName}, sening vaqting tugadi. Ammo oldin, nima demoqchisan? Oxirgi 
imkoniyat...`,
    },
  ];

  // ============================================
  // TINCH AHOLI G'ALABASI - 5 VARIANT
  // ============================================
  private readonly winCiviliansScripts: AudioScript[] = [
    {
      category: AudioCategory.WIN_CIVILIANS,
      variant: 1,
      textUz: `Tabriklaymiz! Tinch aholi g'alaba qozondi! Mafia mag'lub bo'ldi! Shahar 
yana tinch-totuvlikda yashaydi. Qahramonlar - sizlar!`,
    },
    {
      category: AudioCategory.WIN_CIVILIANS,
      variant: 2,
      textUz: `G'alaba! Yaxshilik yovuzlikni yengdi! Mafia butunlay yo'q qilindi. 
Shahar xalqi bayram qilmoqda! Siz - qahramonlar!`,
    },
    {
      category: AudioCategory.WIN_CIVILIANS,
      variant: 3,
      textUz: `Hurmatli o'yinchilar! Siz ajoyib ish qildingiz! Mafia yo'q etildi, shahar 
qutqarildi! Tinch aholi - g'oliblar!`,
    },
    {
      category: AudioCategory.WIN_CIVILIANS,
      variant: 4,
      textUz: `Dahshatli kunlar tugadi! Siz mafiyani topdingiz va yengdingiz! Shahar sizga 
minnatdor! Tinch aholi - chempionlar!`,
    },
    {
      category: AudioCategory.WIN_CIVILIANS,
      variant: 5,
      textUz: `Bayram! Shahar qayta tiklandi! Mafia parchalandi! Tinch aholi - siz 
g'alabaga erishdingiz! Tabriklaymiz!`,
    },
  ];

  // ============================================
  // MAFIA G'ALABASI - 5 VARIANT
  // ============================================
  private readonly winMafiaScripts: AudioScript[] = [
    {
      category: AudioCategory.WIN_MAFIA,
      variant: 1,
      textUz: `Qorong'ilik g'alaba qozondi... Mafia shaharni egalladi. Tinch aholi 
mag'lub bo'ldi. Keyingi safar yaxshiroq bo'lsin...`,
    },
    {
      category: AudioCategory.WIN_MAFIA,
      variant: 2,
      textUz: `Afsuski, yovuzlik yengdi. Mafia juda aqlli o'ynadi. Shahar qorong'ilikka 
botdi. Mafia - g'oliblar...`,
    },
    {
      category: AudioCategory.WIN_MAFIA,
      variant: 3,
      textUz: `Fojia! Mafia barcha to'siqlarni engdi. Tinch aholi yo'qotdi. Ammo keyingi 
o'yinda revans olishingiz mumkin!`,
    },
    {
      category: AudioCategory.WIN_MAFIA,
      variant: 4,
      textUz: `Qorong'i kuchlar hukmronlik qildi. Mafia juda kuchli bo'ldi. Shahar mag'lub. 
Ammo umidsiz bo'lmang - keyingi safar g'alaba sizniki!`,
    },
    {
      category: AudioCategory.WIN_MAFIA,
      variant: 5,
      textUz: `Mafia g'alaba qozondi! Ular juda professional o'ynashdi. Tinch aholi 
mag'lubiyatga uchradi. Keyingi o'yinda omadingiz bilan!`,
    },
  ];

  // ============================================
  // ROL SKRIPTLARI
  // ============================================
  private readonly roleScripts: AudioScript[] = [
    {
      category: AudioCategory.ROLE_CIVILIAN,
      variant: 1,
      textUz: `{playerName}, siz - Tinch aholisiz. Sizning vazifangiz - mafiyani topish va 
yo'q qilish. Omad!`,
    },
    {
      category: AudioCategory.ROLE_MAFIA,
      variant: 1,
      textUz: `{playerName}, siz - Mafiyasiz! Sizning sherikingiz - {partnerName}. Birgalikda 
shaharni qo'lga kiriting!`,
    },
    {
      category: AudioCategory.ROLE_DON,
      variant: 1,
      textUz: `{playerName}, siz - Donsiz! Siz mafia boshlig'isiz va juda ehtiyotkor 
bo'lishingiz kerak!`,
    },
    {
      category: AudioCategory.ROLE_SHERIFF,
      variant: 1,
      textUz: `{playerName}, siz - Komissarsiz! Har kecha birini tekshiring va mafiyani 
toping!`,
    },
    {
      category: AudioCategory.ROLE_DOCTOR,
      variant: 1,
      textUz: `{playerName}, siz - Doktorsiz! Har kecha birini davolab, hayotini 
qutqaring!`,
    },
  ];

  // ============================================
  // PLAYER JOINED
  // ============================================
  private readonly playerJoinedScripts: AudioScript[] = [
    {
      category: AudioCategory.PLAYER_JOINED,
      variant: 1,
      textUz: `Xush kelibsiz, {playerName}! O'yinni boshlashni kutyapmiz...`,
    },
    {
      category: AudioCategory.PLAYER_JOINED,
      variant: 2,
      textUz: `{playerName} qo'shildi! Yana {count} kishi kerak...`,
    },
  ];

  // ============================================
  // TIMER WARNING
  // ============================================
  private readonly timerWarningScripts: AudioScript[] = [
    {
      category: AudioCategory.TIMER_WARNING,
      variant: 1,
      textUz: `Vaqt tugamoqda! Faqat 30 soniya qoldi!`,
    },
    {
      category: AudioCategory.TIMER_WARNING,
      variant: 2,
      textUz: `10 soniya! Tez bo'ling!`,
    },
  ];

  // ============================================
  // PUBLIC METODLAR
  // ============================================

  /**
   * Barcha skriptlarni olish
   */
  getAllScripts(): AudioScript[] {
    return [
      ...this.gameStartScripts,
      ...this.nightStartScripts,
      ...this.mafiaWakeScripts,
      ...this.sheriffWakeScripts,
      ...this.doctorWakeScripts,
      ...this.donWakeScripts,
      ...this.morningNoDeathScripts,
      ...this.morningDeathScripts,
      ...this.discussionScripts,
      ...this.votingScripts,
      ...this.eliminationScripts,
      ...this.winCiviliansScripts,
      ...this.winMafiaScripts,
      ...this.roleScripts,
      ...this.playerJoinedScripts,
      ...this.timerWarningScripts,
    ];
  }

  /**
   * Kategoriya bo'yicha skriptni olish
   */
  getScript(category: AudioCategory, variant?: number): AudioScript | undefined {
    const scripts = this.getScriptsByCategory(category);
    
    if (variant) {
      return scripts.find(s => s.variant === variant);
    }
    
    // Random variant
    return scripts[Math.floor(Math.random() * scripts.length)];
  }

  /**
   * Kategoriya bo'yicha barcha skriptlarni olish
   */
  getScriptsByCategory(category: AudioCategory): AudioScript[] {
    switch (category) {
      case AudioCategory.GAME_START:
        return this.gameStartScripts;
      case AudioCategory.NIGHT_START:
        return this.nightStartScripts;
      case AudioCategory.MAFIA_WAKE:
        return this.mafiaWakeScripts;
      case AudioCategory.SHERIFF_WAKE:
        return this.sheriffWakeScripts;
      case AudioCategory.DOCTOR_WAKE:
        return this.doctorWakeScripts;
      case AudioCategory.DON_WAKE:
        return this.donWakeScripts;
      case AudioCategory.MORNING_NO_DEATH:
        return this.morningNoDeathScripts;
      case AudioCategory.MORNING_DEATH:
        return this.morningDeathScripts;
      case AudioCategory.DISCUSSION:
        return this.discussionScripts;
      case AudioCategory.VOTING:
        return this.votingScripts;
      case AudioCategory.ELIMINATION:
        return this.eliminationScripts;
      case AudioCategory.WIN_CIVILIANS:
        return this.winCiviliansScripts;
      case AudioCategory.WIN_MAFIA:
        return this.winMafiaScripts;
      case AudioCategory.ROLE_CIVILIAN:
      case AudioCategory.ROLE_MAFIA:
      case AudioCategory.ROLE_DON:
      case AudioCategory.ROLE_SHERIFF:
      case AudioCategory.ROLE_DOCTOR:
        return this.roleScripts.filter(s => s.category === category);
      case AudioCategory.PLAYER_JOINED:
        return this.playerJoinedScripts;
      case AudioCategory.TIMER_WARNING:
        return this.timerWarningScripts;
      default:
        return [];
    }
  }

  /**
   * Skript matnini parametrlar bilan to'ldirish
   */
  fillTemplate(text: string, params: Record<string, string>): string {
    let result = text;
    for (const [key, value] of Object.entries(params)) {
      result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
    }
    return result;
  }
}
