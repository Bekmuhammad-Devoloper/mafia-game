import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RulesPage.css';

export const RulesPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="rules-page">
      <header className="rules-header">
        <button className="btn-back" onClick={() => navigate('/')}>
          ← Orqaga
        </button>
        <h1>📜 Qoidalar</h1>
      </header>

      <section className="rules-section">
        <h2>🎭 Mafia o'yini nima?</h2>
        <p>
          Mafia — bu psixologik rol o'yini. O'yinchilar ikki guruhga bo'linadi: 
          tinch aholi va mafia. Maqsad — qarama-qarshi jamoani yo'q qilish.
        </p>
      </section>

      <section className="rules-section">
        <h2>👥 Rollar</h2>
        
        <div className="role-card">
          <div className="role-card__icon">👤</div>
          <div className="role-card__content">
            <h3>Tinch aholi</h3>
            <p>Oddiy fuqarolar. Mafialarni topib, ovoz berish orqali ularni yo'q qilishlari kerak.</p>
          </div>
        </div>

        <div className="role-card role-card--mafia">
          <div className="role-card__icon">🔫</div>
          <div className="role-card__content">
            <h3>Mafia</h3>
            <p>Har kecha bir tinch aholini o'ldiradi. Kunduzi oddiy fuqaro bo'lib ko'rinishi kerak.</p>
          </div>
        </div>

        <div className="role-card role-card--don">
          <div className="role-card__icon">🎩</div>
          <div className="role-card__content">
            <h3>Don (Mafia boshlig'i)</h3>
            <p>Mafia jamosining boshlig'i. Sheriffni topish uchun maxsus qobiliyatga ega.</p>
          </div>
        </div>

        <div className="role-card role-card--sheriff">
          <div className="role-card__icon">🔍</div>
          <div className="role-card__content">
            <h3>Komissar (Sheriff)</h3>
            <p>Har kecha bir o'yinchini tekshiradi va uning mafia yoki yo'qligini biladi.</p>
          </div>
        </div>

        <div className="role-card role-card--doctor">
          <div className="role-card__icon">💉</div>
          <div className="role-card__content">
            <h3>Doktor</h3>
            <p>Har kecha bir o'yinchini himoya qiladi. Himoya qilingan o'yinchi o'lmaydi.</p>
          </div>
        </div>
      </section>

      <section className="rules-section">
        <h2>🌙 O'yin bosqichlari</h2>
        
        <div className="phase-list">
          <div className="phase-item">
            <div className="phase-item__number">1</div>
            <div className="phase-item__content">
              <h4>🎭 Rollar taqsimlanadi</h4>
              <p>O'yinchilarga tasodifiy rollar beriladi. Faqat o'zingiz bilas!</p>
            </div>
          </div>

          <div className="phase-item">
            <div className="phase-item__number">2</div>
            <div className="phase-item__content">
              <h4>🌙 Tun boshlanadi</h4>
              <p>Shahar uxlaydi. Mafia, Sheriff va Doktor o'z harakatlarini qiladi.</p>
            </div>
          </div>

          <div className="phase-item">
            <div className="phase-item__number">3</div>
            <div className="phase-item__content">
              <h4>☀️ Tong otadi</h4>
              <p>Kechasi kim o'ldirilgani e'lon qilinadi.</p>
            </div>
          </div>

          <div className="phase-item">
            <div className="phase-item__number">4</div>
            <div className="phase-item__content">
              <h4>💬 Muhokama</h4>
              <p>O'yinchilar mafialarni topish uchun muhokama qiladi.</p>
            </div>
          </div>

          <div className="phase-item">
            <div className="phase-item__number">5</div>
            <div className="phase-item__content">
              <h4>🗳️ Ovoz berish</h4>
              <p>O'yinchilar eng shubhali odamga ovoz beradi. Eng ko'p ovoz olgan o'yinchi o'yindan chiqadi.</p>
            </div>
          </div>

          <div className="phase-item">
            <div className="phase-item__number">6</div>
            <div className="phase-item__content">
              <h4>💭 So'nggi so'z</h4>
              <p>Chiqariladigan o'yinchi so'nggi so'zini aytadi.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rules-section">
        <h2>🏆 G'alaba sharti</h2>
        <div className="win-conditions">
          <div className="win-condition win-condition--civilian">
            <span className="win-condition__icon">👥</span>
            <div className="win-condition__text">
              <h4>Tinch aholi g'alaba qozodi</h4>
              <p>Agar barcha mafialar yo'q qilinsa</p>
            </div>
          </div>
          <div className="win-condition win-condition--mafia">
            <span className="win-condition__icon">🔫</span>
            <div className="win-condition__text">
              <h4>Mafia g'alaba qozodi</h4>
              <p>Agar mafialar soni tinch aholiga teng bo'lsa</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rules-section">
        <h2>📌 Muhim qoidalar</h2>
        <ul className="rules-list">
          <li>O'z rolingizni hech kimga aytmang!</li>
          <li>Tun vaqtida gaplashmang</li>
          <li>O'yindan chiqqan o'yinchilar rollarini oshkor qila olmaydi</li>
          <li>Hurmatli bo'ling va boshqa o'yinchilarga hurmat ko'rsating</li>
          <li>Audio hikoyachini diqqat bilan tinglang</li>
        </ul>
      </section>

      <section className="rules-section">
        <h2>🎧 Audio hikoyachi</h2>
        <p>
          Bizning o'yinimizda professional audio hikoyachi bor! 
          U o'yinning har bir bosqichida atmosferali hikoyalarni aytib beradi. 
          50 dan ortiq turli hikoya variantlari mavjud!
        </p>
      </section>
    </div>
  );
};

export default RulesPage;
