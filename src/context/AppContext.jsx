import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTelegramUser, getTelegramWebApp, getSystemTheme, hapticFeedback } from '../utils/telegram';
import { 
  syncUserProfileToSupabase, 
  fetchUserProfileFromSupabase,
  fetchEventsFromSupabase,
  createEventInSupabase,
  updateEventStatusInSupabase,
  fetchProjectsFromSupabase,
  createProjectInSupabase,
  updateProjectStatusInSupabase,
  rateProjectInSupabase,
  fetchUserEventRegistrationsFromSupabase,
  registerForEventInSupabase
} from '../services/supabase';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // 1. Theme (Auto-detects from device / Telegram & allows toggle)
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('zh_theme');
    if (saved) return saved;
    return getSystemTheme(); // 'light' | 'dark'
  });

  // Apply theme to DOM and listen for OS / Telegram changes
  useEffect(() => {
    const applyTheme = (t) => {
      const activeTheme = t === 'system' ? getSystemTheme() : t;
      document.documentElement.setAttribute('data-theme', activeTheme);
      if (activeTheme === 'light') {
        document.body.classList.add('theme-light');
        document.body.classList.remove('theme-dark');
      } else {
        document.body.classList.add('theme-dark');
        document.body.classList.remove('theme-light');
      }
    };

    applyTheme(theme);
    localStorage.setItem('zh_theme', theme);

    // Listen to Telegram WebApp Theme changes
    const tg = getTelegramWebApp();
    const handleTgTheme = () => {
      if (theme === 'system' || !localStorage.getItem('zh_theme')) {
        const newTheme = tg?.colorScheme || getSystemTheme();
        setTheme(newTheme);
        applyTheme(newTheme);
      }
    };

    if (tg?.onEvent) {
      tg.onEvent('themeChanged', handleTgTheme);
    }

    // Listen to OS prefers-color-scheme
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleOsTheme = (e) => {
      if (theme === 'system' || !localStorage.getItem('zh_theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
        applyTheme(newTheme);
      }
    };

    mediaQuery.addEventListener?.('change', handleOsTheme);

    return () => {
      if (tg?.offEvent) tg.offEvent('themeChanged', handleTgTheme);
      mediaQuery.removeEventListener?.('change', handleOsTheme);
    };
  }, [theme]);

  const toggleTheme = () => {
    hapticFeedback.selection();
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // 2. User & Language
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
      hasOnboarded: false
    };
  });

  const [lang, setLang] = useState(() => {
    return localStorage.getItem('zh_lang') || 'ru';
  });

  // 3. Events & Registrations
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('zh_events');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  const [myRegistrations, setMyRegistrations] = useState(() => {
    const saved = localStorage.getItem('zh_registrations');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  // 4. Projects & PDF Pitch Decks
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('zh_projects');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  // 5. Reviewed Presentations
  const [reviewedPresentations, setReviewedPresentations] = useState(() => {
    const saved = localStorage.getItem('zh_reviewed_decks');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  // 6. Modals & Toasts
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real data from Supabase on mount
  useEffect(() => {
    const loadFromSupabase = async () => {
      setIsLoading(true);

      // 1. Fetch Events
      const dbEvents = await fetchEventsFromSupabase(user.role === 'moderator');
      if (dbEvents) {
        setEvents(dbEvents.map(e => ({
          id: e.id,
          title: e.title,
          titleKz: e.title_kz,
          shortDesc: e.short_desc,
          shortDescKz: e.short_desc_kz,
          description: e.description,
          imageUrl: e.image_url,
          date: e.date,
          time: e.time,
          location: e.location,
          locationShort: e.location_short,
          categoryName: e.category_name,
          hasProjects: e.has_projects,
          status: e.status,
          isFeatured: e.is_featured,
          participatingProjects: e.participating_project_ids || []
        })));
      }

      // 2. Fetch Projects
      const dbProjects = await fetchProjectsFromSupabase(user.role === 'moderator');
      if (dbProjects) {
        setProjects(dbProjects.map(p => ({
          id: p.id,
          name: p.name,
          category: p.category,
          tag: p.tag,
          stage: p.stage,
          shortDesc: p.short_desc,
          founder: p.founder_name,
          founderId: p.founder_id,
          founderPhone: p.founder_phone,
          teamMembers: p.team_members,
          demoUrl: p.demo_url,
          logoIcon: p.logo_icon || '🚀',
          pdfDeckUrl: p.pdf_deck_url,
          pdfDeckName: p.pdf_deck_name,
          pdfDeckSize: p.pdf_deck_size,
          status: p.status,
          rating: Number(p.rating) || 5.0,
          reviewsCount: p.reviews_count || 1,
          metrics: p.metrics || []
        })));
      }

      // 3. Fetch Event Registrations for current user
      if (user.id) {
        const dbRegs = await fetchUserEventRegistrationsFromSupabase(user.id);
        if (dbRegs) {
          setMyRegistrations(dbRegs.map(r => ({
            id: r.id,
            eventId: r.event_id,
            eventTitle: r.event_title,
            attendeeName: r.attendee_name,
            attendeePhone: r.attendee_phone,
            telegramUsername: r.telegram_username,
            registrationType: r.registration_type,
            projectName: r.project_name,
            projectDesc: r.project_desc,
            teamMembers: r.team_members,
            pdfDeckUrl: r.pdf_deck_url,
            demoUrl: r.demo_or_github_url,
            status: r.status,
            createdAt: r.created_at
          })));
        }
      }

      setIsLoading(false);
    };

    loadFromSupabase();
  }, [user.id, user.role]);

  // Persist Local State
  useEffect(() => {
    localStorage.setItem('zh_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('zh_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('zh_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('zh_registrations', JSON.stringify(myRegistrations));
  }, [myRegistrations]);

  useEffect(() => {
    localStorage.setItem('zh_reviewed_decks', JSON.stringify(reviewedPresentations));
  }, [reviewedPresentations]);

  // Toast
  const showToast = (title, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3800);
  };

  // Update Role & Sync
  const updateUserRole = async (roleData) => {
    const updatedUser = {
      ...user,
      role: roleData.role,
      roleTitle: roleData.roleTitle,
      skillsOrInterest: roleData.skillsOrInterest,
      hasOnboarded: true
    };

    setUser(updatedUser);

    const result = await syncUserProfileToSupabase(updatedUser);
    if (result.success) {
      showToast('Профиль сохранен в Supabase!', `Роль: ${roleData.roleTitle}`);
    }

    closeModal();
    return updatedUser;
  };

  // Register for Event (Listener or Pitch Team)
  const registerForEvent = async (event, registrationData) => {
    const isAlready = myRegistrations.some(r => r.eventId === event.id || r.event_id === event.id);
    if (isAlready) {
      showToast('Вы уже зарегистрированы!', 'Запись сохранена в профиле');
      return false;
    }

    const newReg = {
      id: `reg-${Date.now()}`,
      eventId: event.id,
      eventTitle: event.title,
      attendeeName: registrationData.attendeeName || `${user.firstName} ${user.lastName}`.trim(),
      attendeePhone: registrationData.attendeePhone || '',
      telegramUsername: registrationData.telegramUsername || user.username || '',
      registrationType: registrationData.registrationType || 'listener',
      projectName: registrationData.projectName || null,
      projectDesc: registrationData.projectDesc || null,
      teamMembers: registrationData.teamMembers || null,
      projectStage: registrationData.projectStage || null,
      projectCategory: registrationData.projectCategory || null,
      demoUrl: registrationData.demoOrGithubUrl || null,
      pdfDeckUrl: registrationData.pdfDeckUrl || null,
      status: 'confirmed',
      createdAt: new Date().toLocaleDateString('ru-RU')
    };

    setMyRegistrations(prev => [newReg, ...prev]);

    // Save to Supabase
    await registerForEventInSupabase({
      event_id: String(event.id).length === 36 ? event.id : null,
      event_title: event.title,
      user_id: user.id,
      attendee_name: newReg.attendeeName,
      attendee_phone: newReg.attendeePhone,
      telegram_username: newReg.telegramUsername,
      registration_type: newReg.registrationType,
      project_name: newReg.projectName,
      project_desc: newReg.projectDesc,
      team_members: newReg.teamMembers,
      project_stage: newReg.projectStage,
      project_category: newReg.projectCategory,
      demo_or_github_url: newReg.demoUrl,
      pdf_deck_url: newReg.pdfDeckUrl,
      status: 'confirmed'
    });

    showToast('Регистрация подтверждена!', 'Уведомление придет в Telegram перед началом.');
    hapticFeedback.impact('heavy');
    return newReg;
  };

  // Add Project with PDF Pitch Deck
  const addNewProject = async (projectData) => {
    const newProj = {
      id: `proj-${Date.now()}`,
      name: projectData.name,
      category: projectData.category || 'AI & IT Solutions',
      tag: projectData.tag || 'Startup',
      stage: projectData.stage || 'Idea / MVP',
      rating: 5.0,
      reviewsCount: 1,
      founder: `${user.firstName} ${user.lastName}`.trim() || 'Zhambyl Innovator',
      founderId: user.id,
      founderPhone: projectData.founderPhone || '',
      teamMembers: projectData.teamMembers || '',
      demoUrl: projectData.demoUrl || '',
      founderRole: user.roleTitle || 'Founder & Team Lead',
      logoIcon: projectData.logoIcon || 'Rocket',
      shortDesc: projectData.shortDesc,
      shortDescKz: projectData.shortDesc,
      pdfDeckUrl: projectData.pdfDeckUrl,
      pdfDeckName: projectData.pdfDeckName || 'pitch_deck.pdf',
      pdfDeckSize: projectData.pdfDeckSize || '2.4 MB',
      status: projectData.status || 'approved',
      metrics: [
        { label: 'Статус', value: projectData.status === 'pending' ? 'На модерации' : 'Опубликован' },
        { label: 'Питч-дек', value: 'PDF загружен' },
        { label: 'Питч', value: 'Готов к защите' }
      ]
    };

    setProjects(prev => [newProj, ...prev]);

    // Sync to Supabase
    await createProjectInSupabase({
      name: newProj.name,
      category: newProj.category,
      tag: newProj.tag,
      stage: newProj.stage,
      short_desc: newProj.shortDesc,
      founder_id: user.id,
      founder_name: newProj.founder,
      founder_phone: newProj.founderPhone,
      team_members: newProj.teamMembers,
      demo_url: newProj.demoUrl,
      logo_icon: newProj.logoIcon,
      pdf_deck_url: newProj.pdfDeckUrl,
      pdf_deck_name: newProj.pdfDeckName,
      pdf_deck_size: newProj.pdfDeckSize,
      status: newProj.status
    });

    showToast('Питч-дек успешно загружен!', 'Проект отправлен в базу Supabase');
    return newProj;
  };

  // Add Event (Moderator / Organizer)
  const addNewEvent = async (eventData) => {
    const newEv = {
      id: `ev-${Date.now()}`,
      title: eventData.title,
      shortDesc: eventData.shortDesc,
      description: eventData.description || eventData.shortDesc,
      imageUrl: eventData.imageUrl || null,
      date: eventData.date,
      time: eventData.time,
      location: eventData.location,
      locationShort: eventData.locationShort,
      categoryName: eventData.categoryName,
      hasProjects: !!eventData.hasProjects,
      status: eventData.status || 'approved',
      isFeatured: false,
      participatingProjects: []
    };

    setEvents(prev => [newEv, ...prev]);

    // Save to Supabase
    await createEventInSupabase({
      title: newEv.title,
      short_desc: newEv.shortDesc,
      description: newEv.description,
      image_url: newEv.imageUrl,
      date: newEv.date,
      time: newEv.time,
      location: newEv.location,
      location_short: newEv.locationShort,
      category_name: newEv.categoryName,
      has_projects: newEv.hasProjects,
      status: newEv.status,
      created_by: user.id
    });

    showToast('Мероприятие создано!', 'Опубликовано в экосистеме Zhambyl Hub');
    return newEv;
  };

  // Moderation
  const approveProject = async (projectId) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status: 'approved' } : p));
    await updateProjectStatusInSupabase(projectId, 'approved');
    showToast('Стартап одобрен!', 'Проект опубликован в каталоге');
  };

  const rejectProject = async (projectId) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status: 'rejected' } : p));
    await updateProjectStatusInSupabase(projectId, 'rejected');
    showToast('Проект отклонен', 'Статус обновлен в Supabase');
  };

  const approveEvent = async (eventId) => {
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, status: 'approved' } : e));
    await updateEventStatusInSupabase(eventId, 'approved');
    showToast('Ивент опубликован!', 'Мероприятие доступно в календаре');
  };

  const rejectEvent = async (eventId) => {
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, status: 'rejected' } : e));
    await updateEventStatusInSupabase(eventId, 'rejected');
    showToast('Ивент отклонен', 'Статус обновлен');
  };

  // Rate Project
  const ratePresentation = async (projectId, ratings, comment) => {
    const hasReviewed = reviewedPresentations.includes(projectId);
    const avgScore = ((ratings.problem + ratings.solution + ratings.market + ratings.pitch) / 4);

    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const newCount = (p.reviewsCount || 1) + 1;
        const newRating = Number(((p.rating * (newCount - 1) + avgScore) / newCount).toFixed(1));
        return { ...p, rating: newRating, reviewsCount: newCount };
      }
      return p;
    }));

    if (!hasReviewed) {
      setReviewedPresentations(prev => [...prev, projectId]);
      showToast('Оценка сохранена!', 'Спасибо за ваш экспертный фидбек.');
    } else {
      showToast('Оценка обновлена!', 'Спасибо за фидбек.');
    }

    // Save to Supabase
    await rateProjectInSupabase({
      project_id: String(projectId).length === 36 ? projectId : null,
      user_id: user.id,
      problem_score: ratings.problem,
      solution_score: ratings.solution,
      market_score: ratings.market,
      pitch_score: ratings.pitch,
      avg_score: Number(avgScore.toFixed(1)),
      comment
    });
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
      theme,
      setTheme,
      toggleTheme,
      user,
      setUser,
      updateUserRole,
      lang,
      setLang,
      events,
      addNewEvent,
      approveEvent,
      rejectEvent,
      myRegistrations,
      registerForEvent,
      projects,
      addNewProject,
      approveProject,
      rejectProject,
      ratePresentation,
      reviewedPresentations,
      activeModal,
      modalData,
      openModal,
      closeModal,
      toasts,
      showToast,
      isLoading
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
