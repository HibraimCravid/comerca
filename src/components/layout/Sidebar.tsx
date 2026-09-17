import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Package,
  TrendingUp,
  Users,
  Share2,
  ShoppingBag,
  Wallet,
  CreditCard,
  Tag,
  Link as LinkIcon,
  GraduationCap,
  MessageSquare,
  ShieldAlert,
  Settings,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentView, navigate, user, currentRole } = useApp();

  const navigationItems = [
    { id: 'getting_started', label: 'Como Começar', icon: Sparkles },
    { id: 'dashboard', label: 'Painel Principal', icon: LayoutDashboard },
    { id: 'products', label: 'Produtos', icon: Package },
    { id: 'vendas', label: 'Vendas', icon: TrendingUp },
    { id: 'afiliados', label: 'Afiliados', icon: Share2 },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
    { id: 'carteira', label: 'Carteira & Levantamentos', icon: Wallet },
    { id: 'pagamentos', label: 'Pagamentos & Gateways', icon: CreditCard },
    { id: 'cupons', label: 'Cupons & Descontos', icon: Tag },
    { id: 'links_checkout', label: 'Links & Checkout', icon: LinkIcon },
    { id: 'buyer_library', label: 'Área do Aluno / Cursos', icon: GraduationCap },
    { id: 'community', label: 'Rede & Comunidade', icon: MessageSquare },
    ...(user.roles.includes('admin')
      ? [{ id: 'admin', label: 'Painel Admin', icon: ShieldAlert }]
      : []),
    { id: 'settings', label: 'Configurações', icon: Settings },
    { id: 'suporte', label: 'Suporte & Ajuda', icon: HelpCircle },
  ];

  return (
    <aside
      id="sleek-app-sidebar"
      className="w-64 bg-[#0f172a] text-slate-300 flex flex-col shrink-0 min-h-screen border-r border-slate-800 select-none"
    >
      {/* Sidebar Header Logo */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-800/60">
        <div className="w-10 h-10 rounded-lg overflow-hidden shadow-md">
          <img src="/logo-icon.png" alt="Comerça" className="w-full h-full object-cover rounded-lg" />
        </div>
        <div>
          <span className="text-white font-bold text-lg tracking-tight block leading-tight">
            Comerça
          </span>
          <span className="text-[11px] text-slate-400 font-medium">
            Plataforma Digital
          </span>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Navegação
        </div>
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentView === item.id ||
            (item.id === 'buyer_library' && currentView === 'course_player');

          return (
            <button
              key={item.id}
              id={`sidebar-link-${item.id}`}
              onClick={() => navigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md font-medium text-xs transition-all text-left cursor-pointer ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 font-semibold border-l-2 border-emerald-500'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive ? 'text-emerald-400' : 'text-slate-400'
                }`}
              />
              <span className="truncate">{item.label}</span>
              {item.id === 'community' && (
                <span className="ml-auto w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom User Card */}
      <div className="p-4 border-t border-slate-800 bg-[#0b1120]">
        <div
          onClick={() => navigate('settings')}
          className="flex items-center gap-3 p-2 bg-slate-800/80 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
        >
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover ring-1 ring-emerald-500/40"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{user.name}</p>
            <p className="text-[10px] text-slate-400 truncate">
              {currentRole === 'creator'
                ? 'Produtor Verificado'
                : currentRole === 'affiliate'
                ? 'Afiliado Activo'
                : currentRole === 'admin'
                ? 'Super Administrador'
                : 'Aluno Comerça'}
            </p>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
        </div>
      </div>
    </aside>
  );
};
