import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { HomeView } from './components/home/HomeView';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { ProductsManager } from './components/products/ProductsManager';
import { SalesHistoryView } from './components/sales/SalesHistoryView';
import { AffiliatesManager } from './components/affiliates/AffiliatesManager';
import { WalletView } from './components/wallet/WalletView';
import { CoursePlayer } from './components/courses/CoursePlayer';
import { BuyerLibrary } from './components/courses/BuyerLibrary';
import { CouponsManager } from './components/coupons/CouponsManager';
import { CheckoutLinksView } from './components/links/CheckoutLinksView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { CommunityView } from './components/community/CommunityView';
import { AdminPanel } from './components/admin/AdminPanel';
import { SettingsView } from './components/settings/SettingsView';
import { SupportView } from './components/support/SupportView';
import { GettingStartedView } from './components/onboarding/GettingStartedView';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { AuthModal } from './components/auth/AuthModal';
import { GeminiAssistantWidget } from './components/ai/GeminiAssistantWidget';
import { FirstDayTutorialModal } from './components/onboarding/FirstDayTutorialModal';
import { WelcomeGate } from './components/gate/WelcomeGate';
import { AboutView } from './components/about/AboutView';
import { LegalView } from './components/legal/LegalView';
import { MarketplaceView } from './components/marketplace/MarketplaceView';

const MainLayout: React.FC = () => {
  const { currentView, isAuthenticated } = useApp();
  const [isTutorialOpen, setIsTutorialOpen] = React.useState(false);

  // Check if first-time user to automatically present the Day 1 Tutorial
  React.useEffect(() => {
    try {
      const hasCompletedTutorial = localStorage.getItem('comerca_tutorial_completed');
      if (!hasCompletedTutorial) {
        // Automatically prompt the Day 1 tutorial for a warm first-day onboarding
        const timer = setTimeout(() => {
          setIsTutorialOpen(true);
        }, 800);
        return () => clearTimeout(timer);
      }
    } catch {
      // ignore
    }
  }, []);

  // Route view selector
  const renderView = () => {
    switch (currentView) {
      case 'getting_started':
        return <GettingStartedView />;
      case 'home':
        return <HomeView />;
      case 'dashboard':
        return <DashboardOverview />;
      case 'marketplace':
        return <MarketplaceView />;
      case 'products':
        return <ProductsManager />;
      case 'vendas':
        return <SalesHistoryView />;
      case 'afiliados':
        return <AffiliatesManager />;
      case 'carteira':
      case 'levantamentos':
        return <WalletView />;
      case 'buyer_library':
        return <BuyerLibrary />;
      case 'course_player':
        return <CoursePlayer />;
      case 'cupons':
        return <CouponsManager />;
      case 'links_checkout':
        return <CheckoutLinksView />;
      case 'analytics':
      case 'pagamentos':
        return <AnalyticsView />;
      case 'community':
        return <CommunityView />;
      case 'admin':
        return <AdminPanel />;
      case 'settings':
        return <SettingsView />;
      case 'suporte':
        return <SupportView />;
      case 'sobre':
        return <AboutView />;
      case 'legal':
        return <LegalView />;
      default:
        return <DashboardOverview />;
    }
  };

  const isCoursePlayer = currentView === 'course_player';

  // First-time / logged-out visitors see the advertising sign-up page and
  // are immediately prompted to log in or create an account before
  // reaching any part of the platform.
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0b1120] font-sans antialiased">
        <WelcomeGate />
        <AuthModal />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans antialiased text-slate-900 dark:text-slate-100">
      {/* Sleek Top Navigation Bar */}
      <Navbar onOpenTutorial={() => setIsTutorialOpen(true)} />

      {/* Main Container with Sidebar + Content */}
      <div className="flex-1 flex w-full">
        {/* Sidebar is hidden in focused full-screen course player for immersive experience */}
        {!isCoursePlayer && (
          <div className="hidden md:block shrink-0">
            <Sidebar />
          </div>
        )}

        {/* Dynamic Screen View */}
        <main className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
          {renderView()}
        </main>
      </div>

      {/* Floating Gemini AI Assistant (Bottom-Right) */}
      <GeminiAssistantWidget onOpenTutorial={() => setIsTutorialOpen(true)} />

      {/* Modals */}
      <FirstDayTutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
      />
      <CheckoutModal />
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
