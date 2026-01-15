import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../i18n';
import './RulesPage.css';

export const RulesPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="rules-page">
      <header className="rules-header">
        <button className="btn-back" onClick={() => navigate('/')}>
          {t.back}
        </button>
        <h1>{t.rules.title}</h1>
      </header>

      <section className="rules-section">
        <h2>{t.rules.whatIsMafia}</h2>
        <p>{t.rules.mafiaDescription}</p>
      </section>

      <section className="rules-section">
        <h2>{t.rules.roles}</h2>
        
        <div className="role-card">
          <img src="/images/role.oddiyaholi.png" alt={t.rules.civilian} className="role-card__icon-img" />
          <div className="role-card__content">
            <h3>{t.rules.civilian}</h3>
            <p>{t.rules.civilianDesc}</p>
          </div>
        </div>

        <div className="role-card role-card--mafia">
          <img src="/images/role.mafiya.png" alt={t.rules.mafia} className="role-card__icon-img" />
          <div className="role-card__content">
            <h3>{t.rules.mafia}</h3>
            <p>{t.rules.mafiaDesc}</p>
          </div>
        </div>

        <div className="role-card role-card--don">
          <img src="/images/role.don.png" alt={t.rules.don} className="role-card__icon-img" />
          <div className="role-card__content">
            <h3>{t.rules.don}</h3>
            <p>{t.rules.donDesc}</p>
          </div>
        </div>

        <div className="role-card role-card--sheriff">
          <img src="/images/role.kamissar.png" alt={t.rules.sheriff} className="role-card__icon-img" />
          <div className="role-card__content">
            <h3>{t.rules.sheriff}</h3>
            <p>{t.rules.sheriffDesc}</p>
          </div>
        </div>

        <div className="role-card role-card--doctor">
          <img src="/images/role.doctor.png" alt={t.rules.doctor} className="role-card__icon-img" />
          <div className="role-card__content">
            <h3>{t.rules.doctor}</h3>
            <p>{t.rules.doctorDesc}</p>
          </div>
        </div>
      </section>

      <section className="rules-section">
        <h2><img src="/images/icon-night.svg" alt="" className="section-icon" /> {t.rules.phases}</h2>
        
        <div className="phase-list">
          <div className="phase-item">
            <img src="/images/icon-roles.svg" alt={t.rules.roleAssignment} className="phase-item__icon" />
            <div className="phase-item__content">
              <h4>{t.rules.roleAssignment}</h4>
              <p>{t.rules.roleAssignmentDesc}</p>
            </div>
          </div>

          <div className="phase-item">
            <img src="/images/icon-night.svg" alt={t.rules.nightStart} className="phase-item__icon" />
            <div className="phase-item__content">
              <h4>{t.rules.nightStart}</h4>
              <p>{t.rules.nightStartDesc}</p>
            </div>
          </div>

          <div className="phase-item">
            <img src="/images/icon-morning.svg" alt={t.rules.morning} className="phase-item__icon" />
            <div className="phase-item__content">
              <h4>{t.rules.morning}</h4>
              <p>{t.rules.morningDesc}</p>
            </div>
          </div>

          <div className="phase-item">
            <img src="/images/icon-discussion.svg" alt={t.rules.discussion} className="phase-item__icon" />
            <div className="phase-item__content">
              <h4>{t.rules.discussion}</h4>
              <p>{t.rules.discussionDesc}</p>
            </div>
          </div>

          <div className="phase-item">
            <img src="/images/icon-voting.svg" alt={t.rules.voting} className="phase-item__icon" />
            <div className="phase-item__content">
              <h4>{t.rules.voting}</h4>
              <p>{t.rules.votingDesc}</p>
            </div>
          </div>

          <div className="phase-item">
            <img src="/images/icon-lastword.svg" alt={t.rules.lastWord} className="phase-item__icon" />
            <div className="phase-item__content">
              <h4>{t.rules.lastWord}</h4>
              <p>{t.rules.lastWordDesc}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rules-section">
        <h2>{t.rules.winConditions}</h2>
        <div className="win-conditions">
          <div className="win-condition win-condition--civilian">
            <img src="/images/role.oddiyaholi.png" alt={t.rules.civilian} className="win-condition__icon-img" />
            <div className="win-condition__text">
              <h4>{t.rules.civilianWin}</h4>
              <p>{t.rules.civilianWinDesc}</p>
            </div>
          </div>
          <div className="win-condition win-condition--mafia">
            <img src="/images/role.mafiya.png" alt={t.rules.mafia} className="win-condition__icon-img" />
            <div className="win-condition__text">
              <h4>{t.rules.mafiaWin}</h4>
              <p>{t.rules.mafiaWinDesc}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rules-section">
        <h2>{t.rules.importantRules}</h2>
        <ul className="rules-list">
          <li>{t.rules.rule1}</li>
          <li>{t.rules.rule2}</li>
          <li>{t.rules.rule3}</li>
          <li>{t.rules.rule4}</li>
          <li>{t.rules.rule5}</li>
        </ul>
      </section>

      <section className="rules-section">
        <h2>{t.rules.audioNarrator}</h2>
        <p>{t.rules.audioNarratorDesc}</p>
      </section>
    </div>
  );
};

export default RulesPage;
