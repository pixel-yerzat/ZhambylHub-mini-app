import React, { useState } from 'react';
import { useApp } from '@/context';
import { 
  Rocket, Check, ChevronRight 
} from 'lucide-react';
import { hapticFeedback } from '@/utils/telegram';
import { USER_ROLES } from '@/constants/roles';
import { ModalStackSheet } from '@/components/common/ModalStackSheet';

export const RoleSelectionModal = () => {
  const { user, updateUserRole, lang, closeModal } = useApp();

  const [selectedRole, setSelectedRole] = useState(user.role || 'developer');
  const [skillsOrInterest, setSkillsOrInterest] = useState(user.skillsOrInterest || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roles = USER_ROLES.map(r => ({
    id: r.id,
    title: lang === 'ru' ? r.titleRu : r.titleKz,
    desc: lang === 'ru' ? r.descRu : r.descKz,
    icon: r.icon,
    badgeColor: r.badgeColor,
    defaultTag: r.defaultTag
  }));

  const handleSelect = (roleId) => {
    hapticFeedback.selection();
    setSelectedRole(roleId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    hapticFeedback.impact('heavy');

    const roleObj = roles.find(r => r.id === selectedRole);

    await updateUserRole({
      role: selectedRole,
      roleTitle: roleObj?.title.split('/')[0].trim() || 'Резидент',
      skillsOrInterest: skillsOrInterest.trim() || roleObj?.defaultTag || ''
    });

    setIsSubmitting(false);
  };

  return (
    <ModalStackSheet
      onClose={user.hasOnboarded ? closeModal : () => {}}
      showCloseBtn={user.hasOnboarded}
      maxWidth="max-w-md"
    >
      <div className="p-5 flex flex-col">
        {/* Header Hero */}
        <div className="text-center pb-4 border-b border-[rgba(186,215,247,0.12)] space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-[rgba(102,58,243,0.18)] border border-[rgba(102,58,243,0.35)] flex items-center justify-center mx-auto mb-2 text-[#d8ecf8]">
            <Rocket className="w-6 h-6 text-[#a78bfa]" />
          </div>
          <h2 className="font-display text-lg font-bold text-white">
            {lang === 'ru' ? 'Добро пожаловать в Zhambyl Hub!' : 'Zhambyl Hub-қа қош келдіңіз!'}
          </h2>
          <p className="text-xs text-[#9da7ba]">
            {lang === 'ru' 
              ? 'Выберите вашу роль в инновационной экосистеме Тараза' 
              : 'Тараз инновациялық экожүйесіндегі рөліңізді таңдаңыз'}
          </p>
        </div>

        {/* Roles List */}
        <form onSubmit={handleSubmit} className="space-y-3 pt-4 pb-6">
          <div className="space-y-2">
            {roles.map((r) => {
              const Icon = r.icon;
              const isSelected = selectedRole === r.id;

              return (
                <div
                  key={r.id}
                  onClick={() => handleSelect(r.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-[rgba(102,58,243,0.22)] border-[#663af3] shadow-[0_0_16px_rgba(102,58,243,0.35)]'
                      : 'bg-[rgba(186,214,247,0.03)] border-[rgba(186,215,247,0.1)] hover:border-[rgba(186,215,247,0.25)]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected 
                        ? 'bg-[#663af3] text-white shadow-[0_0_10px_rgba(102,58,243,0.5)]' 
                        : 'bg-[rgba(186,214,247,0.06)] text-[#9da7ba]'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-display text-xs font-semibold text-white block truncate">
                        {r.title}
                      </span>
                      <span className="text-[11px] text-[#9da7ba] leading-tight block">
                        {r.desc}
                      </span>
                    </div>
                  </div>

                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${
                    isSelected 
                      ? 'bg-[#663af3] border-[#663af3] text-white' 
                      : 'border-[rgba(186,215,247,0.2)]'
                  }`}>
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Optional Skills Input */}
          <div className="pt-2">
            <label className="block text-[11px] font-mono text-[#9da7ba] uppercase mb-1">
              {lang === 'ru' ? 'Ваш стек технологий или проект (опционально)' : 'Технологиялық стек немесе жоба'}
            </label>
            <input
              type="text"
              value={skillsOrInterest}
              onChange={(e) => setSkillsOrInterest(e.target.value)}
              placeholder="React, Python, AgroTech AI, MVP..."
              className="glass-input text-xs"
            />
          </div>

          {/* Save Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-violet w-full py-3 text-xs font-bold flex items-center justify-center gap-2"
            >
              <span>
                {isSubmitting 
                  ? (lang === 'ru' ? 'Сохранение...' : 'Сақталуда...') 
                  : (lang === 'ru' ? 'Продолжить' : 'Жалғастыру')}
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </ModalStackSheet>
  );
};
