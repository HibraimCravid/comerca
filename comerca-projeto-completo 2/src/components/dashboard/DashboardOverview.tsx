import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, convertCurrency } from '../../utils/currency';
import {
  TrendingUp,
  ArrowUpRight,
  Package,
  Users,
  Wallet,
  Calendar,
  Filter,
  CheckCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  const {
    user,
    selectedCurrency,
    setSelectedCurrency,
    availableBalance,
    orders,
    products,
    navigate,
    openCheckout,
    joinAffiliateProgram,
  } = useApp();

  const [timeframe, setTimeframe] = useState<'7d' | '30d' | 'all'>('7d');
  const [drillMonth, setDrillMonth] = useState<number | null>(null);
  const [monthGrouping, setMonthGrouping] = useState<'dias' | 'semanas'>('dias');

  // --- Real calculations derived from the orders placed on the platform ---
  const approvedOrders = orders.filter((o) => o.status === 'approved');
  const totalSalesCount = approvedOrders.length;

  const todayStr = new Date().toISOString().slice(0, 10);
  const ordersToday = approvedOrders.filter((o) => o.createdAt.slice(0, 10) === todayStr);

  const sumConverted = (list: typeof orders, field: 'paidAmount' | 'affiliateCommission') =>
    list.reduce((total, o) => {
      const { convertedAmount } = convertCurrency(o[field], o.paidCurrency, selectedCurrency);
      return total + convertedAmount;
    }, 0);

  const salesToday = sumConverted(ordersToday, 'paidAmount');

  const now = new Date();
  const ordersThisMonth = approvedOrders.filter((o) => {
    const d = new Date(o.createdAt.replace(' ', 'T'));
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const monthlyRevenue = sumConverted(ordersThisMonth, 'paidAmount');
  const commissionsPaid = sumConverted(approvedOrders, 'affiliateCommission');

  const conversionRate =
    products.length > 0 ? Math.min(99, +(totalSalesCount / (products.length * 25) * 100).toFixed(1)) : 0;

  // --- Real chart data (no more hardcoded demo numbers) ---
  const dayLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const monthLabels = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
  ];

  const sumOrdersForDay = (dateKey: string) =>
    sumConverted(
      approvedOrders.filter((o) => o.createdAt.slice(0, 10) === dateKey),
      'paidAmount'
    );

  const getLastNDaysPoints = (n: number) => {
    const points: { key: string; label: string; val: number }[] = [];
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().slice(0, 10);
      const label = n <= 7 ? dayLabels[d.getDay()] : String(d.getDate());
      points.push({ key: dateKey, label, val: sumOrdersForDay(dateKey) });
    }
    return points;
  };

  const getYearMonthsPoints = () => {
    const year = now.getFullYear();
    return monthLabels.map((label, monthIndex) => {
      const val = sumConverted(
        approvedOrders.filter((o) => {
          const d = new Date(o.createdAt.replace(' ', 'T'));
          return d.getFullYear() === year && d.getMonth() === monthIndex;
        }),
        'paidAmount'
      );
      return { key: `${year}-${monthIndex}`, label, val, monthIndex };
    });
  };

  const getMonthDaysPoints = (monthIndex: number) => {
    const year = now.getFullYear();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const points: { key: string; label: string; val: number }[] = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      points.push({ key: dateKey, label: String(day), val: sumOrdersForDay(dateKey) });
    }
    return points;
  };

  const getMonthWeeksPoints = (monthIndex: number) => {
    const days = getMonthDaysPoints(monthIndex);
    const weeks: { key: string; label: string; val: number }[] = [];
    for (let i = 0; i < days.length; i += 7) {
      const chunk = days.slice(i, i + 7);
      weeks.push({
        key: `sem-${i / 7 + 1}`,
        label: `Sem ${Math.floor(i / 7) + 1}`,
        val: chunk.reduce((sum, d) => sum + d.val, 0),
      });
    }
    return weeks;
  };

  let chartPoints: { key: string; label: string; val: number; monthIndex?: number }[];
  if (timeframe === 'all' && drillMonth !== null) {
    chartPoints = monthGrouping === 'dias' ? getMonthDaysPoints(drillMonth) : getMonthWeeksPoints(drillMonth);
  } else if (timeframe === '7d') {
    chartPoints = getLastNDaysPoints(7);
  } else if (timeframe === '30d') {
    chartPoints = getLastNDaysPoints(30);
  } else {
    chartPoints = getYearMonthsPoints();
  }

  const maxVal = Math.max(1, ...chartPoints.map((p) => p.val));

  // --- Advanced metrics: card approval, refunds, boletos, chargeback, affiliate network sales ---
  const cardOrders = orders.filter(
    (o) => o.paymentMethod === 'card' || o.paymentMethod === 'international_card'
  );
  const cardApprovalRate =
    cardOrders.length > 0
      ? Math.round((cardOrders.filter((o) => o.status === 'approved').length / cardOrders.length) * 100)
      : 0;

  const refundedOrders = orders.filter((o) => o.status === 'refunded');
  const refundRate = orders.length > 0 ? +((refundedOrders.length / orders.length) * 100).toFixed(1) : 0;

  const boletoOrders = orders.filter((o) => o.paymentMethod === 'multicaixa_ref');
  const boletosGenerated = boletoOrders.length;
  const boletoConversionRate =
    boletoOrders.length > 0
      ? Math.round((boletoOrders.filter((o) => o.status === 'approved').length / boletoOrders.length) * 100)
      : 0;

  const chargebackOrders = orders.filter((o) => o.status === 'cancelled');
  const chargebackRate = orders.length > 0 ? +((chargebackOrders.length / orders.length) * 100).toFixed(1) : 0;

  const affiliateNetworkSales = approvedOrders.filter((o) => !!o.affiliateId).length;

  // Featured product for sidebar preview
  const featuredProduct = products[0];

  return (
    <div className="flex-1 flex flex-col bg-[#f8fafc] dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen">
      {/* Sleek Dashboard Header */}
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 sm:px-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">
            Resumo Financeiro
          </h1>
          <p className="text-[11px] text-slate-400 hidden sm:block">
            Métricas de desempenho e vendas em tempo real
          </p>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          {/* Currency Switcher */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setSelectedCurrency('AOA')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                selectedCurrency === 'AOA'
                  ? 'bg-white dark:bg-slate-700 shadow-xs text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              AOA
            </button>
            <button
              onClick={() => setSelectedCurrency('USD')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                selectedCurrency === 'USD'
                  ? 'bg-white dark:bg-slate-700 shadow-xs text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              USD
            </button>
            <button
              onClick={() => setSelectedCurrency('EUR')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                selectedCurrency === 'EUR'
                  ? 'bg-white dark:bg-slate-700 shadow-xs text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              EUR
            </button>
            <button
              onClick={() => setSelectedCurrency('BRL')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                selectedCurrency === 'BRL'
                  ? 'bg-white dark:bg-slate-700 shadow-xs text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              BRL
            </button>
          </div>

          {/* Saldo Badge */}
          <div className="hidden md:block relative px-4 border-l border-slate-200 dark:border-slate-800 text-right">
            <span className="text-[10px] font-semibold text-slate-400 block uppercase tracking-wider">
              Saldo Disponível
            </span>
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              {formatCurrency(availableBalance, selectedCurrency)}
            </span>
          </div>
        </div>
      </header>

      {/* Main Section */}
      <section className="p-6 sm:p-8 flex-1 flex flex-col gap-6 sm:gap-8 max-w-7xl w-full mx-auto">
        {/* Top Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
          {/* Total de Vendas (contagem real) */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Total de Vendas
            </p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              {totalSalesCount}
            </p>
            <div className="mt-2 flex items-center text-xs text-slate-400 dark:text-slate-500 font-semibold">
              <Package className="w-3.5 h-3.5 mr-1" />
              {ordersToday.length} hoje
            </div>
          </div>

          {/* Vendas Hoje */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Vendas Hoje
            </p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              {formatCurrency(salesToday, selectedCurrency)}
            </p>
            <div className="mt-2 flex items-center text-xs text-emerald-600 dark:text-emerald-400 font-bold">
              <ArrowUpRight className="w-3.5 h-3.5 mr-1" />
              {ordersToday.length} {ordersToday.length === 1 ? 'venda aprovada' : 'vendas aprovadas'}
            </div>
          </div>

          {/* Receita Mensal */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Receita Mensal
            </p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              {formatCurrency(monthlyRevenue, selectedCurrency)}
            </p>
            <div className="mt-2 flex items-center text-xs text-emerald-600 dark:text-emerald-400 font-bold">
              <ArrowUpRight className="w-3.5 h-3.5 mr-1" />
              {ordersThisMonth.length} pedidos este mês
            </div>
          </div>

          {/* Comissões Pagas */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Comissões Pagas a Afiliados
            </p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              {formatCurrency(commissionsPaid, selectedCurrency)}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-medium">
              {approvedOrders.filter((o) => o.affiliateId).length} vendas com afiliado
            </p>
          </div>

          {/* Taxa de Conversão */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Taxa de Conversão do Checkout
              </p>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
                {conversionRate >= 3 ? 'Alta' : 'Normal'}
              </span>
            </div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              {conversionRate}%
            </p>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
              <div
                style={{ width: `${Math.min(100, conversionRate * 10)}%` }}
                className="bg-emerald-500 h-full rounded-full"
              ></div>
            </div>
          </div>
        </div>

        {/* Interactive Performance Graph & Breakdown */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Evolução de Vendas & Faturação
              </h3>
              <p className="text-xs text-slate-400">
                {timeframe === 'all' && drillMonth !== null
                  ? `${monthLabels[drillMonth]} de ${now.getFullYear()} — por ${monthGrouping === 'dias' ? 'dia' : 'semana'}`
                  : timeframe === '7d'
                  ? 'Últimos 7 dias'
                  : timeframe === '30d'
                  ? 'Últimos 30 dias'
                  : `Todos os meses de ${now.getFullYear()} — clique num mês para ver os dias`}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-end">
              {timeframe === 'all' && drillMonth !== null && (
                <>
                  <button
                    onClick={() => setDrillMonth(null)}
                    className="px-3 py-1 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    ← Voltar aos meses
                  </button>
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-md p-0.5">
                    {(['dias', 'semanas'] as const).map((g) => (
                      <button
                        key={g}
                        onClick={() => setMonthGrouping(g)}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                          monthGrouping === g
                            ? 'bg-emerald-500 text-white'
                            : 'text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {g === 'dias' ? 'Dias' : 'Semanas'}
                      </button>
                    ))}
                  </div>
                </>
              )}
              {(['7d', '30d', 'all'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setTimeframe(t);
                    setDrillMonth(null);
                  }}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                    timeframe === t
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {t === '7d' ? '7 Dias' : t === '30d' ? '30 Dias' : 'Geral'}
                </button>
              ))}
            </div>
          </div>

          {/* Bar / Trend Chart */}
          <div className="mt-6 pt-2">
            <div className="h-48 flex items-end justify-between gap-1 sm:gap-2 px-2 overflow-x-auto">
              {chartPoints.map((pt) => {
                const heightPercent = Math.round((pt.val / maxVal) * 100);
                const isClickableMonth = timeframe === 'all' && drillMonth === null && pt.monthIndex !== undefined;
                return (
                  <div
                    key={pt.key}
                    onClick={() => {
                      if (isClickableMonth) {
                        setDrillMonth(pt.monthIndex!);
                        setMonthGrouping('dias');
                      }
                    }}
                    className={`flex-1 min-w-[6px] flex flex-col items-center gap-2 group relative ${
                      isClickableMonth ? 'cursor-pointer' : 'cursor-default'
                    }`}
                  >
                    {/* Tooltip */}
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-bold py-1 px-2 rounded pointer-events-none whitespace-nowrap shadow-md z-10">
                      {formatCurrency(pt.val, selectedCurrency)}
                    </div>
                    {/* Bar */}
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-36 rounded-t-md flex items-end overflow-hidden">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full bg-emerald-500 group-hover:bg-emerald-400 transition-all rounded-t-md"
                      ></div>
                    </div>
                    <span className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {pt.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Advanced Metrics: card approval, refunds, boletos, chargeback, affiliate network */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Aprovação de Cartão
            </p>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              {cardApprovalRate}%
            </p>
            <p className="text-[10px] text-slate-400 mt-1">{cardOrders.length} tentativas</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Taxa de Reembolsos
            </p>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              {refundRate}%
            </p>
            <p className="text-[10px] text-slate-400 mt-1">{refundedOrders.length} reembolsadas</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Boletos Gerados
            </p>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              {boletosGenerated}
            </p>
            <p className="text-[10px] text-slate-400 mt-1">Referência Multicaixa</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Conversão de Boletos
            </p>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              {boletoConversionRate}%
            </p>
            <p className="text-[10px] text-slate-400 mt-1">Pagos vs. gerados</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Chargeback
            </p>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              {chargebackRate}%
            </p>
            <p className="text-[10px] text-slate-400 mt-1">{chargebackOrders.length} canceladas</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Vendas via Rede de Afiliados
            </p>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              {affiliateNetworkSales}
            </p>
            <p className="text-[10px] text-slate-400 mt-1">de {totalSalesCount} vendas totais</p>
          </div>
        </div>

        {/* Destaque Marketplace (o histórico de vendas agora vive só na aba "Vendas") */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
          {/* Destaque Marketplace (Matching Sleek Interface Design) */}
          <div className="bg-[#0f172a] text-white rounded-xl shadow-lg p-6 flex flex-col justify-between border border-slate-800">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Destaque Marketplace</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Alta Procura
                </span>
              </div>

              {featuredProduct && (
                <div className="bg-slate-800/90 rounded-lg p-4 mb-4 border border-slate-700">
                  <div className="w-full aspect-video rounded-md mb-3 overflow-hidden bg-slate-700 relative group">
                    <img
                      src={featuredProduct.imageUrl}
                      alt={featuredProduct.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => openCheckout(featuredProduct.id)}
                        className="px-3 py-1.5 bg-emerald-500 text-white rounded text-xs font-bold shadow"
                      >
                        Ver Detalhes
                      </button>
                    </div>
                  </div>
                  <h4 className="font-bold text-sm leading-tight line-clamp-2">
                    {featuredProduct.title}
                  </h4>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-slate-400 italic truncate max-w-[120px]">
                      Por: {featuredProduct.creatorName.split(' ')[0]}
                    </span>
                    <span className="text-emerald-400 font-bold text-sm">
                      {formatCurrency(
                        convertCurrency(
                          featuredProduct.discountPrice || featuredProduct.price,
                          featuredProduct.currency,
                          selectedCurrency
                        ).convertedAmount,
                        selectedCurrency
                      )}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-auto space-y-3">
              <div className="flex items-center justify-between text-xs border-t border-slate-800 pt-4">
                <span className="text-slate-400">Comissão de Afiliado:</span>
                <span className="font-bold text-emerald-400">
                  {featuredProduct?.affiliateCommissionPercent || 40}%
                </span>
              </div>

              <button
                id="dashboard-promote-featured-btn"
                onClick={() => {
                  if (featuredProduct) {
                    joinAffiliateProgram(featuredProduct.id);
                    navigate('afiliados');
                  }
                }}
                className="w-full py-3 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-lg text-sm transition-transform hover:scale-[1.02] active:scale-95 cursor-pointer shadow-md"
              >
                Promover Agora
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Sleek Dashboard Footer */}
      <footer className="h-12 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 font-medium">
        <span>Comerça © 2026 • Feito para Luanda e para o Mundo</span>
        <div className="flex gap-4">
          <button onClick={() => navigate('settings')} className="hover:text-slate-600 dark:hover:text-slate-300">
            Termos de Uso
          </button>
          <button onClick={() => navigate('settings')} className="hover:text-slate-600 dark:hover:text-slate-300">
            Segurança da Conta
          </button>
          <button onClick={() => navigate('suporte')} className="hover:text-slate-600 dark:hover:text-slate-300">
            Central de Ajuda
          </button>
        </div>
      </footer>
    </div>
  );
};
