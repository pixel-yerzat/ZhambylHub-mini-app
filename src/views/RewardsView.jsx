import React, { useState } from 'react';
import { useApp } from '@/context';
import { 
  Sparkles, Gift, ShoppingBag, Trophy 
} from 'lucide-react';
import { hapticFeedback } from '@/utils/telegram';

export const RewardsView = () => {
  const { 
    points = 0, 
    rewards = [], 
    purchaseReward = () => {}, 
    purchasedItems = [], 
    leaderboard = [], 
    lang 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState('store');

  const handleBuy = (reward) => {
    hapticFeedback.impact('heavy');
    purchaseReward(reward);
  };

  return (
    <div className="app-main-content space-y-6 pt-4 pb-8">
      {/* Points Balance Card */}
      <div className="glass-card space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#9da7ba] uppercase font-mono tracking-wider">
              {lang === 'ru' ? 'Баланс Hub Points' : 'Hub Points балансыңыз'}
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="font-display text-2xl font-bold text-white">
                {points.toLocaleString()}
              </h2>
              <span className="text-xs text-[#a78bfa] font-bold">pts</span>
            </div>
            <p className="text-xs text-[#c7d3ea] mt-0.5">
              {lang === 'ru' 
                ? 'Обменивайте баллы на официальный мерч и сервисы Hub' 
                : 'Баллдарды ресми мерчке айырбастаңыз'}
            </p>
          </div>

          <div className="w-10 h-10 rounded-full bg-[rgba(102,58,243,0.18)] border border-[rgba(102,58,243,0.35)] flex items-center justify-center text-xl shrink-0">
            💎
          </div>
        </div>
      </div>

      {/* Subtabs Selector */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[rgba(186,214,247,0.06)] border border-[rgba(186,215,247,0.12)] w-full">
        <button
          onClick={() => {
            hapticFeedback.selection();
            setActiveSubTab('store');
          }}
          className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'store'
              ? 'bg-[#663af3] text-white shadow-[0_0_12px_rgba(102,58,243,0.4)]'
              : 'text-[#9da7ba] hover:text-white'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>{lang === 'ru' ? 'Магазин мерча' : 'Дүкен'}</span>
        </button>

        <button
          onClick={() => {
            hapticFeedback.selection();
            setActiveSubTab('leaderboard');
          }}
          className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'leaderboard'
              ? 'bg-[#663af3] text-white shadow-[0_0_12px_rgba(102,58,243,0.4)]'
              : 'text-[#9da7ba] hover:text-white'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>{lang === 'ru' ? 'Рейтинг лидеров' : 'Үздіктер'}</span>
        </button>
      </div>

      {/* SUBTAB 1: STORE */}
      {activeSubTab === 'store' && (
        <div className="space-y-3">
          {rewards.length === 0 ? (
            <div className="glass-card text-center p-8 space-y-2">
              <Gift className="w-8 h-8 text-[#9da7ba] mx-auto opacity-60" />
              <p className="text-xs font-semibold text-white">Мерч скоро появится</p>
              <p className="text-[11px] text-[#9da7ba]">Команда Zhambyl Hub готовит фирменные худи, футболки и стикерпаки!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {rewards.map((reward) => {
                const canAfford = points >= reward.price;
                const isOwned = purchasedItems.includes(reward.id);

                return (
                  <div
                    key={reward.id}
                    className="glass-card !p-3 flex flex-col justify-between space-y-3 relative group"
                  >
                    <div className="space-y-2">
                      <div className="w-full h-24 rounded-xl bg-[rgba(186,214,247,0.04)] border border-[rgba(186,215,247,0.08)] flex items-center justify-center text-3xl">
                        {reward.icon || '🎁'}
                      </div>
                      <div>
                        <h4 className="font-display text-xs font-bold text-white truncate">
                          {reward.title}
                        </h4>
                        <span className="text-[10px] text-[#9da7ba] block mt-0.5 line-clamp-1">
                          {reward.desc}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-1 border-t border-[rgba(186,215,247,0.08)]">
                      <span className="font-mono text-xs font-bold text-[#a78bfa] block">
                        {reward.price} pts
                      </span>
                      <button
                        onClick={() => handleBuy(reward)}
                        disabled={!canAfford || isOwned}
                        className={`w-full py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                          isOwned
                            ? 'bg-[rgba(38,150,132,0.2)] text-[#80cbc4] border border-[#269684]/40 cursor-default'
                            : canAfford
                            ? 'bg-[#663af3] hover:bg-[#7c4dff] text-white shadow-[0_0_10px_rgba(102,58,243,0.4)]'
                            : 'bg-[rgba(186,214,247,0.05)] text-[#9da7ba] border border-[rgba(186,215,247,0.1)] cursor-not-allowed'
                        }`}
                      >
                        {isOwned ? 'Получено' : canAfford ? 'Забрать' : 'Не хватает pts'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: LEADERBOARD */}
      {activeSubTab === 'leaderboard' && (
        <div className="space-y-2.5">
          {leaderboard.length === 0 ? (
            <div className="glass-card text-center p-8 space-y-2">
              <Trophy className="w-8 h-8 text-[#9da7ba] mx-auto opacity-60" />
              <p className="text-xs font-semibold text-white">Таблица лидеров формируется</p>
              <p className="text-[11px] text-[#9da7ba]">Проявляйте активность, посещайте ивенты и оценивайте проекты!</p>
            </div>
          ) : (
            leaderboard.map((userItem, index) => (
              <div
                key={userItem.id || index}
                className="glass-card !p-3 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                    index === 0 ? 'bg-[#ffab91] text-black shadow-[0_0_10px_rgba(255,171,145,0.6)]' :
                    index === 1 ? 'bg-[#c7d3ea] text-black' :
                    index === 2 ? 'bg-[#d8ecf8] text-black' :
                    'bg-[rgba(186,214,247,0.06)] text-[#9da7ba]'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <span className="font-display text-xs font-semibold text-white block truncate">
                      {userItem.name}
                    </span>
                    <span className="text-[10px] text-[#9da7ba] truncate block">
                      {userItem.roleTitle || 'Резидент'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 font-mono text-xs text-[#a78bfa] font-bold shrink-0">
                  <span>{userItem.points}</span>
                  <span className="text-[10px] text-[#9da7ba]">pts</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
