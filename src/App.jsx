import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from '@/context';
import { useTelegram } from '@/hooks';
import { Header, BottomNav } from '@/components/layout';
import { NotificationToast } from '@/components/common';
import { 
  HomeView, 
  EventsView, 
  ProjectsView, 
  ProfileView 
} from '@/views';
import { 
  PresentationViewerModal, 
  EventDetailModal, 
  SubmitProjectModal, 
  RoleSelectionModal 
} from '@/components/modals';

function AppContent() {
  const [activeTab, setActiveTab] = useState('home');
  const { activeModal } = useApp();

  // Initialize Telegram SDK & WebApp theme integration
  useTelegram();

  // Reset scroll position immediately when changing tabs
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [activeTab]);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView setActiveTab={setActiveTab} />;
      case 'events':
        return <EventsView />;
      case 'projects':
        return <ProjectsView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <HomeView setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#05060f] text-[#d1e4fa] relative selection:bg-[#663af3] selection:text-white">
      {/* Background blueprint grid */}
      <div className="app-background-grid" />

      {/* Spotlight Conic Ambient Halo */}
      <div className="spotlight-halo" />

      {/* Mobile TMA Viewport Container */}
      <div className="app-viewport">
        {/* Sticky Glass Header with Fixed Standard Height (Transparent on Home) */}
        <Header isTransparent={activeTab === 'home'} />

        {/* In-App Toast Notifications */}
        <NotificationToast />

        {/* Main Content Area */}
        <main className="w-full flex-1 flex flex-col">
          {renderActiveTab()}
        </main>

        {/* Glassmorphic Bottom Navigation Bar */}
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Global Modals Layer - Controlled strictly by activeModal to prevent duplicate overlays */}
      {activeModal === 'change-role' && <RoleSelectionModal />}
      {activeModal === 'presentation' && <PresentationViewerModal />}
      {activeModal === 'event-detail' && <EventDetailModal />}
      {activeModal === 'submit-project' && <SubmitProjectModal />}
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
