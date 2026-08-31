import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, Gift, ShoppingBag, Trophy 
} from 'lucide-react';
import { hapticFeedback } from '../utils/telegram';

export const RewardsView = () => {
  const { 
    points, 
    rewards, 
    purchaseReward, 
    purchasedItems, 
    leaderboard, 
    lang 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState('store');

  const handleBuy = (reward) => {
    hapticFeedback.impact('heavy');
    purchaseReward(reward);
  };

  return (
    <div className="space-y-4 pb-6 px-4 pt-3">
      {/* Points Balance Card */}
      <div className="glass-card p-5 space-y-2">
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
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[rgba(186,214,247,0.06)] border border-[rgba(186,215,247,0.12)]">
        <button
          onClick={() => {
            hapticFeedback.selection();
            setActiveSubTab('store');
          }}
          className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'store'
              ? 'bg-[#663af3] text-white shadow-[0_0_12px_rgba(102,58,243,0.35)]'
              : 'text-[#9da7ba] hover:text-white'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>{lang === 'ru' ? 'Hub Store' : 'Дүкен'}</span>
        </button>

        <button
          onClick={() => {
            hapticFeedback.selection();
            setActiveSubTab('leaderboard');
          }}
          className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'leaderboard'
              ? 'bg-[#663af3] text-white shadow-[0_0_12px_rgba(102,58,243,0.35)]'
              : 'text-[#9da7ba] hover:text-white'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>{lang === 'ru' ? 'Топ лидеров' : 'Үздіктер'}</span>
        </button>

        <button
          onClick={() => {
            hapticFeedback.selection();
            setActiveSubTab('my_purchases');
          }}
          className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'my_purchases'
              ? 'bg-[#663af3] text-white shadow-[0_0_12px_rgba(102,58,243,0.35)]'
              : 'text-[#9da7ba] hover:text-white'
          }`}
        >
          <Gift className="w-3.5 h-3.5" />
          <span>{lang === 'ru' ? 'Мои призы' : 'Сыйлықтар'}</span>
        </button>
      </div>

      {/* Tab 1: Store */}
      {activeSubTab === 'store' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-2.5">
            {rewards.map((item) => {
              const canAfford = points >= item.price;

              return (
                <div
                  key={item.id}
                  className="glass-card p-4 flex flex-col justify-between space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-10 h-10 rounded-full bg-[rgba(186,214,247,0.06)] border border-[rgba(186,215,247,0.12)] flex items-center justify-center text-xl shrink-0">
                      {item.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="badge badge-violet text-[10px]">
                          {item.tag}
                        </span>
                        <span className="font-mono text-xs font-semibold text-white flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-[#a78bfa]" />
                          {item.price.toLocaleString()} pts
                        </span>
                      </div>

                      <h4 className="font-display text-sm font-semibold text-white mt-1 leading-snug">
                        {lang === 'ru' ? item.title : (item.titleKz || item.title)}
                      </h4>
                      <p className="text-xs text-[#9da7ba] mt-0.5 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[rgba(186,215,247,0.08)]">
                    <span className="text-[10px] text-[#9da7ba] font-mono">
                      Осталось: {item.inStock} шт.
                    </span>

                    <button
                      onClick={() => handleBuy(item)}
                      disabled={!canAfford}
                      className={`text-xs !py-1 !px-3 rounded-full font-medium transition-all ${
                        canAfford
                          ? 'btn-violet'
                          : 'bg-[rgba(186,214,247,0.06)] border border-[rgba(186,215,247,0.12)] text-[#9da7ba] cursor-not-allowed opacity-50'
                      }`}
                    >
                      {canAfford 
                        ? (lang === 'ru' ? 'Получить' : 'Алу') 
                        : (lang === 'ru' ? `Не хватает ${item.price - points} pts` : `Жетпейді`)}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Leaderboard */}
      {activeSubTab === 'leaderboard' && (
        <div className="space-y-3">
          <div className="glass-card divide-y divide-[rgba(186,215,247,0.08)]">
            {leaderboard.map((lead) => (
              <div
                key={lead.rank}
                className="flex items-center justify-between p-3"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`font-mono text-xs font-bold w-4 text-center ${
                    lead.rank === 1 ? 'text-[#ffab91]' : lead.rank === 2 ? 'text-[#d8ecf8]' : lead.rank === 3 ? 'text-[#a78bfa]' : 'text-[#9da7ba]'
                  }`}>
                    #{lead.rank}
                  </span>

                  <div className="w-7 h-7 rounded-full bg-[rgba(186,214,247,0.08)] flex items-center justify-center text-sm shrink-0">
                    {lead.avatar}
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{lead.name}</p>
                    <p className="text-[10px] text-[#9da7ba]">{lead.badge}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-mono text-xs font-semibold text-white">
                    {lead.points.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-[#a78bfa] block font-mono">pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: My Purchases */}
      {activeSubTab === 'my_purchases' && (
        <div className="space-y-3">
          {purchasedItems.length === 0 ? (
            <div className="glass-card p-8 text-center space-y-2">
              <p className="text-sm font-semibold text-white">У вас пока нет купленных призов</p>
              <p className="text-xs text-[#9da7ba]">
                Зарабатывайте баллы на ивентах и получайте фирменный мерч!
              </p>
            </div>
          ) : (
            purchasedItems.map((item) => (
              <div
                key={item.id}
                className="glass-card p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <h4 className="text-xs font-bold text-white">{item.title}</h4>
                      <p className="text-[10px] text-[#9da7ba]">{item.date}</p>
                    </div>
                  </div>
                  <span className="badge badge-teal text-[10px]">К выдаче</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[rgba(186,215,247,0.08)] text-xs">
                  <span className="text-[#c7d3ea]">Код:</span>
                  <span className="font-mono font-bold text-[#80cbc4]">
                    {item.code}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
