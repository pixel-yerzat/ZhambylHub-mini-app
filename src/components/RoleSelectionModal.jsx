import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Code2, Rocket, Briefcase, Users, 
  Check, ChevronRight, ShieldAlert 
} from 'lucide-react';
import { hapticFeedback } from '../utils/telegram';

export const RoleSelectionModal = () => {
  const { user, updateUserRole, lang } = useApp();

  const [selectedRole, setSelectedRole] = useState(user.role || 'developer');
  const [skillsOrInterest, setSkillsOrInterest] = useState(user.skillsOrInterest || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roles = [
    {
      id: 'developer',
      title: lang === 'ru' ? 'Разработчик / Инженер' : 'Әзірлеуші / Инженер',
      desc: lang === 'ru' ? 'Пишу код, создаю AI и участвую в хакатонах' : 'Код жазамын, хакатондарға қатысамын',
      icon: Code2,
      badgeColor: 'badge-teal',
      defaultTag: 'Fullstack / AI Developer'
    },
    {
      id: 'founder',
      title: lang === 'ru' ? 'Фаундер / Стартапер' : 'Фаундер / Стартапер',
      desc: lang === 'ru' ? 'Загружаю PDF питч-дек, ищу инвестиции и команду' : 'PDF питч-дек жүктеймін, инвестиция іздеймін',
      icon: Rocket,
      badgeColor: 'badge-violet',
      defaultTag: 'Startup Founder & Lead'
    },
    {
      id: 'investor',
      title: lang === 'ru' ? 'Инвестор / Бизнес-ангел' : 'Инвестор / Бизнес-періште',
      desc: lang === 'ru' ? 'Изучаю PDF презентации проектов региона' : 'Өңірдің IT жобаларының PDF дектерін қараймын',
      icon: Briefcase,
      badgeColor: 'badge-amber',
      defaultTag: 'Venture / Angel Investor'
    },
    {
      id: 'community',
      title: lang === 'ru' ? 'Комьюнити / Гость' : 'Қоғамдастық / Қонақ',
      desc: lang === 'ru' ? 'Посещаю ивенты, учусь и нахожу единомышленников' : 'Іс-шараларға қатысып, білім аламын',
      icon: Users,
      badgeColor: 'badge-blue',
      defaultTag: 'Community Member'
    },
    {
      id: 'moderator',
      title: lang === 'ru' ? 'Модератор / Команда Hub' : 'Модератор / Hub Командасы',
      desc: lang === 'ru' ? 'Создаю ивенты, модерирую стартапы и команды' : 'Іс-шаралар құрамын, жобаларды тексеремін',
      icon: ShieldAlert,
      badgeColor: 'badge-violet',
      defaultTag: 'Zhambyl Hub Administrator'
    }
  ];

  const handleSelect = (roleId) => {
    hapticFeedback.selection();
    setSelectedRole(roleId);
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    hapticFeedback.impact('heavy');

    const roleObj = roles.find(r => r.id === selectedRole);
    await updateUserRole({
      role: selectedRole,
      roleTitle: roleObj ? roleObj.title : 'Резидент',
      skillsOrInterest: skillsOrInterest || roleObj?.defaultTag || ''
    });

    setIsSubmitting(false);
  };

  return (
    <div className="modal-overlay z-50">
      <div 
        className="modal-sheet max-w-md max-h-[92vh] flex flex-col p-5 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="text-center space-y-1.5 pt-1">
          <div className="eyebrow-container">
            <div className="eyebrow-line"></div>
            <span className="eyebrow-text">
              {lang === 'ru' ? 'Добро пожаловать' : 'Қош келдіңіз'}
            </span>
            <div className="eyebrow-line"></div>
          </div>

          <h2 className="font-display text-xl font-bold text-gradient-skywash leading-tight">
            {lang === 'ru' ? 'Кто вы в Zhambyl Hub?' : 'Zhambyl Hub-тағы рөліңіз?'}
          </h2>

          <p className="text-xs text-[#c7d3ea] leading-relaxed max-w-xs mx-auto">
            {lang === 'ru'
              ? 'Выберите роль в экосистеме. Данные сохраняются в Supabase.'
              : 'Экожүйедегі рөліңізді таңдаңыз.'}
          </p>
        </div>

        {/* Roles List */}
        <div className="space-y-2 max-h-[50vh] overflow-y-auto no-scrollbar pr-1">
          {roles.map((r) => {
            const Icon = r.icon;
            const isSelected = selectedRole === r.id;

            return (
              <div
                key={r.id}
                onClick={() => handleSelect(r.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  isSelected
                    ? 'bg-[rgba(102,58,243,0.18)] border-[#663af3] shadow-[0_0_16px_rgba(102,58,243,0.3)]'
                    : 'bg-[rgba(186,214,247,0.03)] border-[rgba(186,215,247,0.1)] hover:bg-[rgba(186,214,247,0.06)]'
                }`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                  isSelected 
                    ? 'bg-[#663af3] text-white shadow-[0_0_10px_#663af3]' 
                    : 'bg-[rgba(186,214,247,0.06)] text-[#d1e4fa]'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-display text-sm font-semibold text-white truncate">
                      {r.title}
                    </h4>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-[#663af3] text-white flex items-center justify-center text-[10px]">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#9da7ba] mt-0.5 leading-snug">
                    {r.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Optional input */}
        <div>
          <label className="text-[11px] text-[#9da7ba]">
            {lang === 'ru' 
              ? 'Специализация / Стартап / Должность (необязательно):' 
              : 'Мамандығыңыз / Стартап / Қызметіңіз:'}
          </label>
          <input
            type="text"
            value={skillsOrInterest}
            onChange={(e) => setSkillsOrInterest(e.target.value)}
            placeholder={
              selectedRole === 'developer' 
                ? 'Например: React, Python, AI' 
                : selectedRole === 'founder' 
                ? 'Название стартапа' 
                : selectedRole === 'moderator'
                ? 'Менеджер проектов / Координатор'
                : 'Сфера интересов'
            }
            className="glass-input text-xs mt-1"
          />
        </div>

        {/* Submit CTA */}
        <div className="pt-1">
          <button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="w-full btn-violet text-xs !py-3 font-semibold justify-center shadow-[0_0_20px_rgba(102,58,243,0.4)]"
          >
            {isSubmitting ? (
              <span>Сохранение в Supabase...</span>
            ) : (
              <>
                <span>{lang === 'ru' ? 'Войти в Zhambyl Hub' : 'Кіру'}</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
