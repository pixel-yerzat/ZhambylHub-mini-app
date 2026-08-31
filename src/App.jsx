import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { initTelegramApp } from './utils/telegram';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { EventsView } from './components/EventsView';
import { ProjectsView } from './components/ProjectsView';
import { RewardsView } from './components/RewardsView';
import { ProfileView } from './components/ProfileView';
import { PresentationViewerModal } from './components/PresentationViewerModal';
import { EventDetailModal } from './components/EventDetailModal';
import { TicketModal } from './components/TicketModal';
import { SubmitProjectModal } from './components/SubmitProjectModal';
import { RoleSelectionModal } from './components/RoleSelectionModal';
import { NotificationToast } from './components/NotificationToast';

function AppContent() {
  const [activeTab, setActiveTab] = useState('home');
  const { user, activeModal } = useApp();

  useEffect(() => {
    initTelegramApp();
  }, []);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView setActiveTab={setActiveTab} />;
      case 'events':
        return <EventsView />;
      case 'projects':
        return <ProjectsView />;
      case 'rewards':
        return <RewardsView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <HomeView setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#05060f] text-[#d1e4fa] relative selection:bg-[#663af3] selection:text-white">
      {/* Background blueprint grid */}
      <div className="app-background-grid"></div>

      {/* Spotlight Conic Ambient Halo */}
      <div className="spotlight-halo"></div>

      {/* Mobile TMA Viewport Container */}
      <div className="app-viewport">
        {/* Sticky Glass Header */}
        <Header />

        {/* In-App Toast Notifications */}
        <NotificationToast />

        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-md mx-auto">
          {renderActiveTab()}
        </main>

        {/* Glassmorphic Bottom Navigation Bar */}
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* First-time Onboarding Role Selection Modal */}
        {!user.hasOnboarded && <RoleSelectionModal />}

        {/* Change Role Modal */}
        {activeModal === 'change-role' && <RoleSelectionModal />}

        {/* Global Modals */}
        {activeModal === 'presentation' && <PresentationViewerModal />}
        {activeModal === 'event-detail' && <EventDetailModal />}
        {activeModal === 'ticket' && <TicketModal />}
        {activeModal === 'submit-project' && <SubmitProjectModal />}
        {activeModal === 'rewards' && (
          <div className="modal-overlay" onClick={() => {}}>
            {setActiveTab('rewards')}
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
