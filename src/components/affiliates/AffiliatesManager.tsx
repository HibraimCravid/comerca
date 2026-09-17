import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, convertCurrency } from '../../utils/currency';
import {
  Share2,
  Copy,
  Check,
  TrendingUp,
  MousePointer,
  ShoppingBag,
  DollarSign,
  ExternalLink,
  Sparkles,
  Link,
  Percent,
  MessageCircle,
} from 'lucide-react';

export const AffiliatesManager: React.FC = () => {
  const {
    affiliateLinks,
    products,
    selectedCurrency,
    joinAffiliateProgram,
    openCheckout,
  } = useApp();

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const totalEarnings = affiliateLinks.reduce((sum, item) => sum + item.totalEarnings, 0);
  const totalClicks = affiliateLinks.reduce((sum, item) => sum + item.clicks, 0);
  const totalSales = affiliateLinks.reduce((sum, item) => sum + item.salesCount, 0);
  const conversionRate = totalClicks > 0 ? ((totalSales / totalClicks) * 100).toFixed(1) : '0.0';

  const copyToClipboard = (code: string) => {
    const fullLink = `${window.location.origin}/?ref=${code}`;
    navigator.clipboard.writeText(fullLink);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  // Products available to affiliate
  const availableToAffiliate = products.filter(
    (p) => p.affiliateEnabled && !affiliateLinks.some((a) => a.productId === p.id)
  );

  return (
    <div className="flex-1 bg-[#f8fafc] dark:bg-slate-950 p-6 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Painel do Afiliado & Links de Divulgação
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Divulgue produtos de alta conversão, acompanhe métricas de cliques e receba comissões automáticas.
          </p>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Total Ganho em Comissões</span>
              <DollarSign className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {formatCurrency(
                convertCurrency(totalEarnings, 'AOA', selectedCurrency).convertedAmount,
                selectedCurrency
              )}
            </p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">
              Disponível para levantamento
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Total de Cliques nos Links</span>
              <MousePointer className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {totalClicks.toLocaleString()}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Tráfego monitorizado</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Vendas Realizadas</span>
              <ShoppingBag className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {totalSales}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Pedidos confirmados</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Taxa de Conversão</span>
              <TrendingUp className="w-4 h-4 text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {conversionRate}%
            </p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">
              Excelente desempenho
            </p>
          </div>
        </div>

        {/* My Active Affiliate Links Table */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Os Meus Links de Afiliado Activos
            </h3>
            <span className="text-xs text-slate-400">
              {affiliateLinks.length} produtos promovidos
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                  <th className="px-6 py-3.5 font-semibold">Produto</th>
                  <th className="px-6 py-3.5 font-semibold">Código / Link</th>
                  <th className="px-6 py-3.5 font-semibold">Comissão</th>
                  <th className="px-6 py-3.5 font-semibold">Cliques</th>
                  <th className="px-6 py-3.5 font-semibold">Vendas</th>
                  <th className="px-6 py-3.5 font-semibold">Ganhos</th>
                  <th className="px-6 py-3.5 font-semibold text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="text-xs sm:text-sm divide-y divide-slate-100 dark:divide-slate-800">
                {affiliateLinks.map((link) => {
                  const { convertedAmount } = convertCurrency(
                    link.totalEarnings,
                    link.currency,
                    selectedCurrency
                  );

                  return (
                    <tr
                      key={link.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white max-w-xs truncate">
                        {link.productTitle}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <code className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-emerald-600 dark:text-emerald-400 font-bold">
                            {link.code}
                          </code>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(link.code)}
                            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded cursor-pointer"
                            title="Copiar link"
                          >
                            {copiedCode === link.code ? (
                              <Check className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                          <a
                            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                              `Olá! Recomendo este conteúdo na Comerça: "${link.productTitle}". Acesse pelo meu link oficial: ${window.location.origin}/?ref=${link.code}`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded cursor-pointer"
                            title="Partilhar no WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap font-semibold text-emerald-600 dark:text-emerald-400">
                        {link.commissionPercent}% por venda
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
                        {link.clicks}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900 dark:text-white">
                        {link.salesCount}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(convertedAmount, selectedCurrency)}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => openCheckout(link.productId, link.code)}
                          className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-md hover:bg-emerald-100 transition-colors"
                        >
                          Testar Checkout
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Explore more products to affiliate */}
        {availableToAffiliate.length > 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">
              Produtos Disponíveis para Nova Afiliação
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Comece a promover estes produtos e ganhe comissões de até 50% por cada venda.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableToAffiliate.map((p) => (
                <div
                  key={p.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between"
                >
                  <div className="flex gap-3">
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      className="w-16 h-16 rounded-lg object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2">
                        {p.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Preço: {formatCurrency(p.discountPrice || p.price, p.currency)}
                      </p>
                      <span className="inline-block mt-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                        {p.affiliateCommissionPercent}% comissão
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const newLink = joinAffiliateProgram(p.id);
                      copyToClipboard(newLink.code);
                    }}
                    className="mt-4 w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Afiliar-se & Gerar Link</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
