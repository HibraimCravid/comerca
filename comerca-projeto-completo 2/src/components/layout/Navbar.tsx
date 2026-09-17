import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Currency, UserRole } from '../../types';
import { formatCurrency } from '../../utils/currency';
import {
  Store,
  Bell,
  Sun,
  Moon,
  User,
  LogOut,
  ChevronDown,
  Globe,
  Sparkles,
  ShoppingBag,
  Layers,
  HelpCircle,
  Users,
  Shield,
  Briefcase,
  GraduationCap,
  Share2,
  UserPlus,
  LogIn,
  BookOpen,
} from 'lucide-react';

interface NavbarProps {
  onOpenTutorial?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenTutorial }) => {
  const {
    user,
    currentRole,
    setCurrentRole,
    selectedCurrency,
    setSelectedCurrency,
    currentView,
    navigate,
    notifications,
    markNotificationsRead,
    isDarkMode,
    toggleDarkMode,
    openAuthModal,
    openCheckout,
    availableBalance,
    isAuthenticated,
    logout,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const rolesList: { role: UserRole; label: string; icon: any }[] = [
    { role: 'creator', label: 'Modo Produtor', icon: Briefcase },
    { role: 'affiliate', label: 'Modo Afiliado', icon: Share2 },
    { role: 'buyer', label: 'Modo Aluno / Comprador', icon: GraduationCap },
    { role: 'admin', label: 'Modo Administrador', icon: Shield },
  ];

  return (
    <nav
      id="main-navbar"
      className={`sticky top-0 z-40 w-full transition-colors border-b ${
        isDarkMode
          ? 'bg-slate-900/95 border-slate-800 text-slate-100'
          : 'bg-white/95 border-slate-200 text-slate-800'
      } backdrop-blur-md`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <button
              id="brand-logo-btn"
              onClick={() => navigate('home')}
              className="flex items-center gap-3 group text-left cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg overflow-hidden shadow-sm transition-transform group-hover:scale-105">
                <img src="/logo-icon.png" alt="Comerça" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                  Comerça
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400">
                    AO
                  </span>
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium -mt-0.5">
                  Comércio Digital
                </p>
              </div>
            </button>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Currency Selector Pill */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
              {(['AOA', 'USD', 'EUR', 'BRL'] as Currency[]).map((cur) => (
                <button
                  key={cur}
                  id={`curr-btn-${cur}`}
                  onClick={() => setSelectedCurrency(cur)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                    selectedCurrency === cur
                      ? 'bg-white dark:bg-slate-700 shadow-xs text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {cur === 'AOA' ? 'Kz' : cur === 'USD' ? '$' : cur === 'EUR' ? '€' : 'R$'}
                </button>
              ))}
            </div>

            {/* Role Switcher Pill */}
            <div className="hidden md:flex items-center">
              <select
                id="active-role-selector"
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value as UserRole)}
                className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="creator">Produtor</option>
                <option value="affiliate">Afiliado</option>
                <option value="buyer">Aluno / Comprador</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            {/* Tutorial 1º Dia Button */}
            {onOpenTutorial && (
              <button
                id="open-day1-tutorial-nav-btn"
                onClick={onOpenTutorial}
                className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition-colors cursor-pointer"
                title="Abrir Tutorial do 1º Dia"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Tutorial 1º Dia</span>
              </button>
            )}

            {/* Dark Mode Toggle */}
            <button
              id="toggle-dark-mode-btn"
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isDarkMode ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                id="notifications-bell-btn"
                onClick={() => {
                  setIsNotifOpen(!isNotifOpen);
                  if (!isNotifOpen && unreadCount > 0) markNotificationsRead();
                }}
                className="relative p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                )}
              </button>

              {/* Notification Popover */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Notificações
                    </span>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      {notifications.length} avisos
                    </span>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    {notifications.map((item) => (
                      <div
                        key={item.id}
                        className={`p-3 text-xs hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                          !item.read ? 'bg-emerald-50/50 dark:bg-emerald-950/20' : ''
                        }`}
                      >
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {item.title}
                        </p>
                        <p className="text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                          {item.message}
                        </p>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">
                          {item.timestamp}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Auth Action Buttons & User Profile */}
            {!isAuthenticated ? (
              <div className="flex items-center gap-2">
                <button
                  id="navbar-login-btn"
                  onClick={() => openAuthModal('login')}
                  className="px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Entrar</span>
                </button>
                <button
                  id="navbar-register-btn"
                  onClick={() => openAuthModal('register')}
                  className="px-3.5 py-1.5 text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Criar Conta</span>
                </button>
              </div>
            ) : (
              <div className="relative flex items-center gap-2">
                <button
                  id="user-profile-menu-btn"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-lg object-cover ring-2 ring-emerald-500/30"
                  />
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-bold text-slate-800 dark:text-white leading-tight">
                      {user.name.split(' ')[0]}
                    </p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase">
                      {currentRole === 'creator'
                        ? 'Produtor'
                        : currentRole === 'affiliate'
                        ? 'Afiliado'
                        : currentRole === 'admin'
                        ? 'Admin'
                        : 'Comprador'}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {user.email}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-[11px] bg-slate-50 dark:bg-slate-800 p-2 rounded-lg">
                        <span className="text-slate-500 dark:text-slate-400">Saldo:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(availableBalance, selectedCurrency)}
                        </span>
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        id="dropdown-goto-getting-started"
                        onClick={() => {
                          navigate('getting_started');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-center gap-2 cursor-pointer font-semibold"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        Guia: Como Começar
                      </button>
                      <button
                        id="dropdown-goto-dashboard"
                        onClick={() => {
                          navigate('dashboard');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                      >
                        <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                        Painel Geral
                      </button>
                      <button
                        id="dropdown-goto-wallet"
                        onClick={() => {
                          navigate('carteira');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                      >
                        <Store className="w-3.5 h-3.5 text-slate-400" />
                        Minha Carteira & Levantamentos
                      </button>
                      <button
                        id="dropdown-goto-settings"
                        onClick={() => {
                          navigate('settings');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                      >
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        Meu Perfil & KYC
                      </button>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                      <button
                        id="dropdown-switch-account"
                        onClick={() => {
                          openAuthModal('login');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                      >
                        <LogIn className="w-3.5 h-3.5 text-slate-400" />
                        Trocar de Conta / Iniciar Sessão
                      </button>
                      <button
                        id="dropdown-register-new"
                        onClick={() => {
                          openAuthModal('register');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                      >
                        <UserPlus className="w-3.5 h-3.5 text-slate-400" />
                        Criar Nova Conta
                      </button>
                      <button
                        id="dropdown-logout"
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Terminar Sessão
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <Layers className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Expandable Nav */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-slate-200 dark:border-slate-800 space-y-1">
            <button
              onClick={() => {
                navigate('home');
                setIsMobileMenuOpen(false);
              }}
              className="w-full px-3 py-2 text-left text-sm font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              Início
            </button>

            {onOpenTutorial && (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenTutorial();
                }}
                className="w-full px-3 py-2 text-left text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Tutorial do 1º Dia</span>
              </button>
            )}

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <button
                onClick={() => {
                  openAuthModal('login');
                  setIsMobileMenuOpen(false);
                }}
                className="flex-1 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-lg text-center cursor-pointer"
              >
                Entrar
              </button>
              <button
                onClick={() => {
                  openAuthModal('register');
                  setIsMobileMenuOpen(false);
                }}
                className="flex-1 py-2 text-xs font-bold bg-emerald-500 text-white rounded-lg text-center shadow-xs cursor-pointer"
              >
                Criar Conta
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
