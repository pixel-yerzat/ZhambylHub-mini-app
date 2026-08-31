import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  INITIAL_EVENTS, 
  INITIAL_PROJECTS, 
  INITIAL_REWARDS, 
  INITIAL_QUESTS, 
  LEADERBOARD 
} from '../data/mockData';
import { getTelegramUser, hapticFeedback } from '../utils/telegram';
import { syncUserProfileToSupabase } from '../services/supabase';
import confetti from 'canvas-confetti';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // 1. User & Language
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('zh_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    const baseUser = getTelegramUser();
    return {
      ...baseUser,
      role: null,
      roleTitle: 'Резидент',
      skillsOrInterest: '',
      hasOnboarded: false // will trigger role selection modal on first launch
    };
  });

  const [lang, setLang] = useState(() => {
    return localStorage.getItem('zh_lang') || 'ru';
  });

  // 2. Hub Points Balance & Transaction Log
  const [points, setPoints] = useState(() => {
    const saved = localStorage.getItem('zh_points');
    return saved !== null ? parseInt(saved, 10) : 350;
  });

  const [pointHistory, setPointHistory] = useState(() => {
    const saved = localStorage.getItem('zh_point_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 'tx-1', date: 'Сегодня', description: 'Приветственный бонус резидента', amount: 350, type: 'plus' }
    ];
  });

  // 3. Events & Registrations (Tickets)
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [myTickets, setMyTickets] = useState(() => {
    const saved = localStorage.getItem('zh_tickets');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  // 4. Projects & User Submitted Startups
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('zh_projects');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_PROJECTS;
  });

  // 5. Reviewed Presentations Log
  const [reviewedPresentations, setReviewedPresentations] = useState(() => {
    const saved = localStorage.getItem('zh_reviewed_decks');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  // 6. Quests & Store Purchases
  const [quests, setQuests] = useState(() => {
    const saved = localStorage.getItem('zh_quests');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_QUESTS;
  });

  const [purchasedItems, setPurchasedItems] = useState(() => {
    const saved = localStorage.getItem('zh_purchases');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  // 7. Active Modals State
  const [activeModal, setActiveModal] = useState(null); // 'event-detail' | 'presentation' | 'ticket' | 'submit-project' | 'change-role' | null
  const [modalData, setModalData] = useState(null);

  // 8. In-App Notifications / Toast
  const [toasts, setToasts] = useState([]);

  // Save changes to LocalStorage
  useEffect(() => {
    localStorage.setItem('zh_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('zh_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('zh_points', points.toString());
  }, [points]);

  useEffect(() => {
    localStorage.setItem('zh_point_history', JSON.stringify(pointHistory));
  }, [pointHistory]);

  useEffect(() => {
    localStorage.setItem('zh_tickets', JSON.stringify(myTickets));
  }, [myTickets]);

  useEffect(() => {
    localStorage.setItem('zh_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('zh_reviewed_decks', JSON.stringify(reviewedPresentations));
  }, [reviewedPresentations]);

  useEffect(() => {
    localStorage.setItem('zh_quests', JSON.stringify(quests));
  }, [quests]);

  useEffect(() => {
    localStorage.setItem('zh_purchases', JSON.stringify(purchasedItems));
  }, [purchasedItems]);

  // Add Points & Fire Effects
  const addPoints = (amount, description) => {
    setPoints(prev => {
      const newPoints = prev + amount;
      // Sync points to Supabase in background
      syncUserProfileToSupabase({ ...user, points: newPoints });
      return newPoints;
    });

    const newTx = {
      id: `tx-${Date.now()}`,
      date: 'Сегодня, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      description,
      amount,
      type: 'plus'
    };
    setPointHistory(prev => [newTx, ...prev]);
    showToast(`+${amount} Hub Points! 🎉`, description);
    hapticFeedback.notification('success');
    
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#663af3', '#d8ecf8', '#027dea', '#ffffff']
      });
    } catch (e) {}
  };

  // Show Toast
  const showToast = (title, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3800);
  };

  // Update User Role & Sync to Supabase
  const updateUserRole = async (roleData) => {
    const updatedUser = {
      ...user,
      role: roleData.role,
      roleTitle: roleData.roleTitle,
      skillsOrInterest: roleData.skillsOrInterest,
      hasOnboarded: true
    };

    setUser(updatedUser);

    // Give welcome bonus if first onboarding
    if (!user.hasOnboarded) {
      addPoints(100, 'Бонус за выбор роли резидента');
    }

    // Sync to Supabase
    const result = await syncUserProfileToSupabase(updatedUser);
    if (result.success) {
      showToast('Профиль сохранен в Supabase!', `Роль: ${roleData.roleTitle}`);
    }

    closeModal();
    return updatedUser;
  };

  // Register for an Event
  const registerForEvent = (event, registrationData) => {
    const isAlready = myTickets.some(t => t.eventId === event.id);
    if (isAlready) {
      showToast('Вы уже зарегистрированы!', 'Билет доступен в разделе «Профиль»');
      return false;
    }

    const ticketNumber = `ZH-${Math.floor(100000 + Math.random() * 900000)}`;
    const newTicket = {
      id: `tkt-${Date.now()}`,
      ticketNumber,
      eventId: event.id,
      eventTitle: event.title,
      eventDate: event.date,
      eventTime: event.time,
      location: event.location,
      role: registrationData.role || 'listener',
      hasProject: !!registrationData.projectId || registrationData.role === 'project',
      projectName: registrationData.projectName || null,
      projectId: registrationData.projectId || null,
      attendeeName: registrationData.attendeeName || `${user.firstName} ${user.lastName}`.trim(),
      attendeePhone: registrationData.attendeePhone || '+7 (705) ***-**-**',
      qrData: `https://zhambylhub.kz/pass/verify?ticket=${ticketNumber}&user=${user.id}`,
      registeredAt: new Date().toLocaleDateString('ru-RU')
    };

    setMyTickets(prev => [newTicket, ...prev]);

    // Give points
    addPoints(event.rewardPoints || 50, `Регистрация на: ${event.title}`);

    // Update quest
    setQuests(prev => prev.map(q => q.action === 'register_event' ? { ...q, isDone: true } : q));

    hapticFeedback.impact('heavy');
    return newTicket;
  };

  // Submit new Project
  const addNewProject = (projectData) => {
    const newProj = {
      id: `proj-${Date.now()}`,
      name: projectData.name,
      category: projectData.category || 'AI & IT Solutions',
      tag: projectData.tag || 'Startup',
      stage: projectData.stage || 'Idea / MVP',
      rating: 5.0,
      reviewsCount: 1,
      founder: `${user.firstName} ${user.lastName}`.trim() || 'Zhambyl Innovator',
      founderRole: user.roleTitle || 'Founder & Team Lead',
      logoIcon: projectData.logoIcon || '💡',
      shortDesc: projectData.shortDesc,
      shortDescKz: projectData.shortDesc,
      metrics: [
        { label: 'Статус', value: 'На модерации Hub' },
        { label: 'Слайдов', value: `${projectData.slides?.length || 4} слайда` },
        { label: 'Питч', value: 'Готов к Demo Day' }
      ],
      presentation: {
        title: `${projectData.name} Pitch Deck`,
        slidesCount: projectData.slides?.length || 4,
        slides: projectData.slides || [
          {
            slideNumber: 1,
            title: projectData.name,
            subtitle: projectData.shortDesc,
            type: 'cover',
            highlights: ['Zhambyl Hub Ecosystem', 'Ready for Pitching'],
            badge: 'Cover',
            content: projectData.shortDesc
          }
        ]
      }
    };

    setProjects(prev => [newProj, ...prev]);
    addPoints(150, `Добавление стартапа: ${projectData.name}`);
    setQuests(prev => prev.map(q => q.action === 'add_project' ? { ...q, isDone: true } : q));
    showToast('Проект добавлен в экосистему Zhambyl Hub!', 'Вам начислено +150 Hub Points');
    return newProj;
  };

  // Review presentation & rate
  const ratePresentation = (projectId, ratings, comment) => {
    const hasReviewed = reviewedPresentations.includes(projectId);
    
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const avgScore = ((ratings.problem + ratings.solution + ratings.market + ratings.pitch) / 4);
        const newCount = (p.reviewsCount || 1) + 1;
        const newRating = Number(((p.rating * (newCount - 1) + avgScore) / newCount).toFixed(1));
        return { ...p, rating: newRating, reviewsCount: newCount };
      }
      return p;
    }));

    if (!hasReviewed) {
      setReviewedPresentations(prev => [...prev, projectId]);
      addPoints(35, `Оценка презентации стартапа`);
      setQuests(prev => {
        const count = reviewedPresentations.length + 1;
        if (count >= 2) {
          return prev.map(q => q.action === 'review_presentation' ? { ...q, isDone: true } : q);
        }
        return prev;
      });
    } else {
      showToast('Оценка обновлена!', 'Спасибо за ваш экспертный фидбек.');
    }
  };

  // Purchase item in Hub Store
  const purchaseReward = (reward) => {
    if (points < reward.price) {
      showToast('Недостаточно Hub Points', `Вам нужно еще ${reward.price - points} баллов`);
      hapticFeedback.notification('warning');
      return false;
    }

    setPoints(prev => {
      const newPoints = prev - reward.price;
      syncUserProfileToSupabase({ ...user, points: newPoints });
      return newPoints;
    });

    const newTx = {
      id: `tx-${Date.now()}`,
      date: 'Сегодня, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      description: `Покупка: ${reward.title}`,
      amount: -reward.price,
      type: 'minus'
    };
    setPointHistory(prev => [newTx, ...prev]);
    
    const purchaseCode = `ZH-GIFT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPurchase = {
      id: `pch-${Date.now()}`,
      rewardId: reward.id,
      title: reward.title,
      code: purchaseCode,
      price: reward.price,
      icon: reward.icon,
      date: new Date().toLocaleDateString('ru-RU')
    };

    setPurchasedItems(prev => [newPurchase, ...prev]);
    showToast('Поздравляем с покупкой! 🎁', `Код: ${purchaseCode}. Покажите на ресепшене.`);
    hapticFeedback.notification('success');
    return true;
  };

  // Claim Daily Quest
  const claimDaily = () => {
    const dailyQuest = quests.find(q => q.action === 'daily');
    if (dailyQuest && !dailyQuest.isDone) {
      addPoints(dailyQuest.points, 'Ежедневный вход в Hub Mini App');
      setQuests(prev => prev.map(q => q.action === 'daily' ? { ...q, isDone: true } : q));
    } else {
      showToast('Ежедневный бонус уже получен', 'Приходите завтра за новыми баллами!');
    }
  };

  const openModal = (type, data = null) => {
    hapticFeedback.impact('light');
    setActiveModal(type);
    setModalData(data);
  };

  const closeModal = () => {
    hapticFeedback.impact('light');
    setActiveModal(null);
    setModalData(null);
  };

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      updateUserRole,
      lang,
      setLang,
      points,
      pointHistory,
      addPoints,
      events,
      myTickets,
      registerForEvent,
      projects,
      addNewProject,
      ratePresentation,
      reviewedPresentations,
      rewards: INITIAL_REWARDS,
      purchasedItems,
      purchaseReward,
      quests,
      claimDaily,
      leaderboard: LEADERBOARD,
      activeModal,
      modalData,
      openModal,
      closeModal,
      toasts,
      showToast
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
