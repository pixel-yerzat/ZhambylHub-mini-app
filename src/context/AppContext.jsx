import React, { useState, useEffect, useCallback } from 'react';
import { getTelegramWebApp, getSystemTheme, hapticFeedback } from '@/utils/telegram';
import { AppContext } from './AppContextInstance';
import { 
  syncUserProfileToSupabase, 
  fetchEventsFromSupabase,
  createEventInSupabase,
  fetchProjectsFromSupabase,
  createProjectInSupabase,
  rateProjectInSupabase,
  fetchWinningProjectsFromSupabase,
  fetchUserEventRegistrationsFromSupabase,
  registerForEventInSupabase,
  hubApi
} from '@/services';
import { STORAGE_KEYS } from '@/constants/app';
import { INITIAL_PAST_WINNERS } from '@/data/mockData';

export const AppProvider = ({ children }) => {
  // 1. Theme
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved) return saved;
    return getSystemTheme();
  });

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
    localStorage.setItem(STORAGE_KEYS.THEME, theme);

    const tg = getTelegramWebApp();
    const handleTgTheme = () => {
      if (theme === 'system' || !localStorage.getItem(STORAGE_KEYS.THEME)) {
        const newTheme = tg?.colorScheme || getSystemTheme();
        setTheme(newTheme);
        applyTheme(newTheme);
      }
    };

    if (tg?.onEvent) {
      tg.onEvent('themeChanged', handleTgTheme);
    }

    const mediaQuery = window.matchMedia?.('(prefers-color-scheme: dark)');
    const handleOsTheme = (e) => {
      if (theme === 'system' || !localStorage.getItem(STORAGE_KEYS.THEME)) {
        const newTheme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
        applyTheme(newTheme);
      }
    };

    mediaQuery?.addEventListener?.('change', handleOsTheme);

    return () => {
      if (tg?.offEvent) tg.offEvent('themeChanged', handleTgTheme);
      mediaQuery?.removeEventListener?.('change', handleOsTheme);
    };
  }, [theme]);

  const toggleTheme = () => {
    hapticFeedback.selection();
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // 2. User & Language
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore invalid JSON */ }
    }
    const localId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    return {
      id: localId,
      firstName: '',
      lastName: '',
      username: '',
      phone: '',
      role: 'developer',
      roleTitle: 'Разработчик',
      skillsOrInterest: '',
      hasOnboarded: false
    };
  });

  const [lang, setLang] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.LANG) || 'ru';
  });

  // 3. Events & Registrations
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EVENTS);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore invalid JSON */ }
    }
    return [];
  });

  const [myRegistrations, setMyRegistrations] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore invalid JSON */ }
    }
    return [];
  });

  // 4. Projects & PDF Pitch Decks
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore invalid JSON */ }
    }
    return [];
  });

  // 5. Reviewed Presentations
  const [reviewedPresentations, setReviewedPresentations] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REVIEWED_DECKS);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore invalid JSON */ }
    }
    return [];
  });

  // 6. Past Hackathon Winners (for AI originality checking)
  const [pastWinners, setPastWinners] = useState(INITIAL_PAST_WINNERS);

  // 7. Modals & Toasts
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real data from Supabase & Backend on mount
  useEffect(() => {
    const loadFromSupabase = async () => {
      setIsLoading(true);

      // 1. Fetch Events
      const dbEvents = await fetchEventsFromSupabase();
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
      const dbProjects = await fetchProjectsFromSupabase();
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
          status: p.status || 'approved',
          rating: Number(p.rating) || 5.0,
          reviewsCount: p.reviews_count || 1,
          metrics: p.metrics || []
        })));
      }

      // 3. Fetch Past Winners from Supabase 'winning_projects' table / Backend API
      const dbWinners = await fetchWinningProjectsFromSupabase();
      if (dbWinners && dbWinners.length > 0) {
        setPastWinners(dbWinners.map(w => ({
          id: w.id,
          title: w.title,
          description: w.description,
          category: w.category,
          eventName: w.event_name,
          year: w.year_or_date || '2024',
          track: w.winning_track,
          features: w.key_features || []
        })));
      } else {
        const apiWinners = await hubApi.getPastWinners();
        if (apiWinners && apiWinners.length > 0) {
          setPastWinners(apiWinners.map(w => ({
            id: w.id,
            title: w.title,
            description: w.description,
            category: w.category,
            eventName: w.event_name || w.eventName,
            year: w.year_or_date || w.year || '2024',
            track: w.winning_track || w.track,
            features: w.key_features || w.features || []
          })));
        }
      }

      // 4. Fetch User Registrations
      if (user.id) {
        const dbRegs = await fetchUserEventRegistrationsFromSupabase(user.id);
        if (dbRegs) {
          setMyRegistrations(dbRegs.map(r => ({
            id: r.id,
            eventId: r.event_id,
            eventTitle: r.event_title,
            attendeeName: r.attendee_name,
            attendeePhone: r.attendee_phone,
            registrationType: r.registration_type,
            projectName: r.project_name,
            projectDesc: r.project_desc,
            teamMembers: r.team_members,
            demoUrl: r.demo_or_github_url,
            pdfDeckUrl: r.pdf_deck_url,
            status: r.status,
            createdAt: r.created_at ? new Date(r.created_at).toLocaleDateString('ru-RU') : '2026'
          })));
        }
      }

      setIsLoading(false);
    };

    loadFromSupabase();
  }, [user.id]);

  // Persist Local State
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANG, lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(myRegistrations));
  }, [myRegistrations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REVIEWED_DECKS, JSON.stringify(reviewedPresentations));
  }, [reviewedPresentations]);

  // Toast
  const showToast = useCallback((title, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3800);
  }, []);

  // Update Role & Sync
  const updateUserRole = async (roleData) => {
    const updatedUser = {
      ...user,
      firstName: roleData.firstName !== undefined ? roleData.firstName : user.firstName,
      lastName: roleData.lastName !== undefined ? roleData.lastName : user.lastName,
      phone: roleData.phone !== undefined ? roleData.phone : user.phone,
      role: roleData.role || user.role,
      roleTitle: roleData.roleTitle || user.roleTitle,
      skillsOrInterest: roleData.skillsOrInterest !== undefined ? roleData.skillsOrInterest : user.skillsOrInterest,
      hasOnboarded: true
    };

    setUser(updatedUser);

    const result = await syncUserProfileToSupabase(updatedUser);
    if (result?.success) {
      showToast('Профиль сохранен в Supabase!', `Роль: ${updatedUser.roleTitle}`);
    }

    closeModal();
    return updatedUser;
  };

  // Register for Event (Listener or Pitch Team with Gemini AI Competition Verification)
  const registerForEvent = async (event, registrationData) => {
    const isAlready = myRegistrations.some(r => r.eventId === event.id || r.event_id === event.id);
    if (isAlready) {
      showToast('Вы уже зарегистрированы!', 'Запись сохранена в профиле');
      return { success: false, error: 'Вы уже зарегистрированы на это событие' };
    }

    let aiVerdict = null;
    let finalStatus = 'confirmed';
    let rejectionReason = null;
    let similarityScore = null;
    let backendResult = null;

    // 🤖 IF registering as Pitch Team / Project for competition, run Google Gemini AI Verification!
    const isPitchRegistration = Boolean(
      (registrationData.registrationType === 'pitch_team' || 
       registrationData.registrationType === 'pitch_project' ||
       registrationData.isPitch ||
       event.hasProjects) && 
      registrationData.projectName?.trim()
    );

    if (isPitchRegistration) {
      backendResult = await hubApi.submitProject({
        name: registrationData.projectName.trim(),
        short_desc: registrationData.projectDesc || 'Проект на хакатоне / соревновании',
        category: registrationData.projectCategory || 'AI & IT Solutions',
        stage: registrationData.projectStage || 'MVP / Prototype',
        tag: 'Hackathon',
        founder_name: registrationData.attendeeName || `${user.firstName} ${user.lastName}`.trim(),
        founder_phone: registrationData.attendeePhone || user.phone || '',
        founder_role: 'Hackathon Team Lead',
        team_members: registrationData.teamMembers || '',
        demo_url: registrationData.demoOrGithubUrl || '',
        logo_icon: '🚀',
        pdf_deck_url: registrationData.pdfDeckUrl || null,
        event_id: event.id,
        event_title: event.title
      }, user.id);

      const status = backendResult?.data?.status || backendResult?.status;
      if (status) {
        finalStatus = status;
        aiVerdict = backendResult?.data?.ai_analysis || backendResult?.ai_analysis || null;
        rejectionReason = backendResult?.data?.rejection_reason || backendResult?.rejection_reason || backendResult?.message || null;
        similarityScore = backendResult?.data?.similarity_score ?? backendResult?.similarity_score ?? null;

        // If AI rejects due to past winner or duplicate submission for competition
        if (finalStatus === 'rejected_duplicate' || finalStatus === 'rejected_past_winner' || finalStatus === 'rejected') {
          showToast('Заявка отклонена AI', rejectionReason || 'Проект не допущен к соревнованию (дубликат или прошлый победитель).');
          return {
            success: false,
            status: finalStatus,
            rejectionReason,
            similarityScore,
            aiAnalysis: aiVerdict
          };
        }
      } else if (backendResult && backendResult.success === false && !backendResult.isNetworkError) {
        showToast('Ошибка проверки', backendResult.error || 'Не удалось отправить проект на проверку.');
        return {
          success: false,
          error: backendResult.error || 'Ошибка проверки проекта'
        };
      }

      // If backend was offline, fallback to direct Supabase project insert
      if (backendResult?.isNetworkError) {
        const projectPayload = {
          name: registrationData.projectName.trim(),
          category: registrationData.projectCategory || 'AI & IT Solutions',
          tag: 'Hackathon',
          stage: registrationData.projectStage || 'MVP / Prototype',
          short_desc: registrationData.projectDesc || 'Проект для участия в хакатоне',
          founder_id: user.id,
          founder_name: registrationData.attendeeName || `${user.firstName} ${user.lastName}`.trim(),
          founder_phone: registrationData.attendeePhone || '',
          team_members: registrationData.teamMembers || '',
          demo_url: registrationData.demoOrGithubUrl || '',
          logo_icon: '🚀',
          pdf_deck_url: registrationData.pdfDeckUrl || null,
          pdf_deck_name: registrationData.pdfFileName || 'pitch_deck.pdf',
          pdf_deck_size: registrationData.pdfFileSize || '2.0 MB',
          status: finalStatus === 'manual_review' ? 'manual_review' : 'approved'
        };

        const projectRes = await createProjectInSupabase(projectPayload);
        if (projectRes?.success && projectRes.data) {
          setProjects(prev => [projectRes.data, ...prev]);
        }
      } else if (backendResult?.data) {
        // Backend already saved the project to Supabase, update local state
        setProjects(prev => [
          {
            id: backendResult.data.id,
            name: backendResult.data.name || registrationData.projectName.trim(),
            category: backendResult.data.category || registrationData.projectCategory || 'AI & IT Solutions',
            tag: 'Hackathon',
            stage: registrationData.projectStage || 'MVP / Prototype',
            shortDesc: registrationData.projectDesc || 'Проект для участия в хакатоне',
            founder: registrationData.attendeeName || `${user.firstName} ${user.lastName}`.trim(),
            founderId: user.id,
            founderPhone: registrationData.attendeePhone || '',
            teamMembers: registrationData.teamMembers || '',
            demoUrl: registrationData.demoOrGithubUrl || '',
            logoIcon: '🚀',
            pdfDeckUrl: registrationData.pdfDeckUrl || null,
            pdfDeckName: registrationData.pdfFileName || 'pitch_deck.pdf',
            pdfDeckSize: registrationData.pdfFileSize || '2.0 MB',
            status: finalStatus === 'manual_review' ? 'manual_review' : 'approved',
            rating: 5.0,
            reviewsCount: 1,
            metrics: []
          },
          ...prev.filter(p => p.id !== backendResult.data.id)
        ]);
      }
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
      status: finalStatus === 'manual_review' ? 'manual_review' : 'confirmed',
      aiAnalysis: aiVerdict,
      similarityScore,
      rejectionReason,
      createdAt: new Date().toLocaleDateString('ru-RU')
    };

    // Save to Supabase (only if not already created by backend pitch submission)
    if (!isPitchRegistration || !backendResult?.success) {
      const dbRegRes = await registerForEventInSupabase({
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
        status: newReg.status
      });

      if (dbRegRes?.success && dbRegRes.data?.id) {
        newReg.id = dbRegRes.data.id;
      }
    }

    setMyRegistrations(prev => [newReg, ...prev]);

    showToast('Регистрация подтверждена!', 'Запись сохранена в профиле.');
    hapticFeedback.impact('heavy');
    return { success: true, registration: newReg, status: finalStatus, aiAnalysis: aiVerdict };
  };

  // Add Project with Google Gemini AI Verification Service
  const addNewProject = async (projectData) => {
    let aiVerdict = null;
    let finalStatus = 'approved';
    let rejectionReason = null;
    let similarityScore = null;

    // 1. Submit to Gemini AI Verification Service Backend
    const backendResult = await hubApi.submitProject({
      name: projectData.name,
      short_desc: projectData.shortDesc,
      category: projectData.category || 'AI & IT Solutions',
      stage: projectData.stage || 'Idea / MVP',
      tag: projectData.tag || 'Startup',
      founder_name: `${user.firstName} ${user.lastName}`.trim() || 'Zhambyl Innovator',
      founder_phone: projectData.founderPhone || user.phone || '',
      founder_role: user.roleTitle || 'Founder & Team Lead',
      team_members: projectData.teamMembers || '',
      demo_url: projectData.demoUrl || '',
      logo_icon: projectData.logoIcon || 'Rocket',
      pdf_deck_url: projectData.pdfDeckUrl || null,
      event_id: projectData.eventId || null,
      event_title: projectData.eventTitle || null
    }, user.id);

    if (backendResult?.success && backendResult.data) {
      finalStatus = backendResult.data.status || 'approved';
      aiVerdict = backendResult.data.ai_analysis || null;
      rejectionReason = backendResult.data.rejection_reason || null;
      similarityScore = backendResult.data.similarity_score ?? null;
    }

    const newProj = {
      id: backendResult?.data?.id || `proj-${Date.now()}`,
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
      status: finalStatus,
      aiAnalysis: aiVerdict,
      similarityScore,
      rejectionReason,
      metrics: [
        { label: 'Статус', value: finalStatus === 'approved' ? 'Одобрен AI' : 'Проверка AI' },
        { label: 'Питч-дек', value: 'PDF загружен' },
        { label: 'Питч', value: 'Готов к защите' }
      ]
    };

    // 2. Direct Supabase insertion only if backend was offline / unreachable
    if (backendResult?.isNetworkError) {
      const supabaseRes = await createProjectInSupabase({
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

      if (supabaseRes?.success && supabaseRes.data?.id) {
        newProj.id = supabaseRes.data.id;
      }
    }

    setProjects(prev => [newProj, ...prev]);

    if (finalStatus === 'approved') {
      showToast('Проект одобрен AI!', 'Прошел проверку на оригинальность и зарегистрирован.');
    } else if (finalStatus === 'rejected_duplicate' || finalStatus === 'rejected_past_winner') {
      showToast('Заявка отклонена AI', rejectionReason || 'Проект не прошел проверку на уникальность.');
    } else {
      showToast('Заявка принята', 'Отправлена на рассмотрение жюри.');
    }

    return {
      project: newProj,
      backendResult,
      status: finalStatus,
      aiAnalysis: aiVerdict,
      rejectionReason,
      similarityScore
    };
  };

  // Add Event
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

  const openModal = useCallback((type, data = null) => {
    hapticFeedback.impact('light');
    setActiveModal(type);
    setModalData(data);
  }, []);

  const closeModal = useCallback(() => {
    hapticFeedback.impact('light');
    setActiveModal(null);
    setModalData(null);
  }, []);

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
      myRegistrations,
      registerForEvent,
      projects,
      addNewProject,
      pastWinners,
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

