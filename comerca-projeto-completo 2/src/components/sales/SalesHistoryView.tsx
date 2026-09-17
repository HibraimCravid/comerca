import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, convertCurrency } from '../../utils/currency';
import {
  TrendingUp,
  Search,
  Filter,
  Download,
  Calendar,
  CreditCard,
  Building,
  Smartphone,
  CheckCircle2,
  Clock,
  RotateCcw,
} from 'lucide-react';

export const SalesHistoryView: React.FC = () => {
  const { orders, refundOrder, selectedCurrency } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      o.buyerName.toLowerCase().includes(search.toLowerCase()) ||
      o.productTitle.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalSalesRevenue = orders
    .filter((o) => o.status === 'approved')
    .reduce((sum, o) => {
      return sum + convertCurrency(o.paidAmount, o.paidCurrency, selectedCurrency).convertedAmount;
    }, 0);

  return (
    <div className="flex-1 bg-[#f8fafc] dark:bg-slate-950 p-6 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Histórico Geral de Vendas
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Todos os pedidos processados na sua conta em tempo real.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Relatório CSV de vendas exportado com sucesso!')}
              className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 hover:bg-slate-50"
            >
              <Download className="w-4 h-4" />
              Exportar Relatório CSV
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="sticky top-16 z-10 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar por comprador, produto ou ID..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Estado:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs font-semibold px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">Todos os estados</option>
              <option value="approved">Aprovados</option>
              <option value="pending">Pendentes</option>
              <option value="refunded">Reembolsados</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                  <th className="px-6 py-3.5 font-semibold">ID / Data</th>
                  <th className="px-6 py-3.5 font-semibold">Cliente</th>
                  <th className="px-6 py-3.5 font-semibold">Produto</th>
                  <th className="px-6 py-3.5 font-semibold">Valor</th>
                  <th className="px-6 py-3.5 font-semibold">Método</th>
                  <th className="px-6 py-3.5 font-semibold">Estado</th>
                  <th className="px-6 py-3.5 font-semibold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="text-xs sm:text-sm divide-y divide-slate-100 dark:divide-slate-800">
                {filteredOrders.map((order) => {
                  const { convertedAmount } = convertCurrency(
                    order.paidAmount,
                    order.paidCurrency,
                    selectedCurrency
                  );

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono text-xs font-bold text-slate-900 dark:text-white block">
                          {order.id}
                        </span>
                        <span className="text-[11px] text-slate-400">{order.createdAt}</span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {order.buyerName}
                        </div>
                        <div className="text-[11px] text-slate-400">{order.buyerEmail}</div>
                        <div className="text-[10px] text-slate-500">{order.buyerPhone}</div>
                      </td>

                      <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200 max-w-xs truncate">
                        {order.productTitle}
                        {order.affiliateCode && (
                          <span className="block text-[10px] text-emerald-600 dark:text-emerald-400">
                            Afiliado: {order.affiliateCode}
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-900 dark:text-white">
                        {formatCurrency(convertedAmount, selectedCurrency)}
                        {order.paidCurrency !== selectedCurrency && (
                          <div className="text-[10px] text-slate-400">
                            {formatCurrency(order.paidAmount, order.paidCurrency)}
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap capitalize text-slate-600 dark:text-slate-300 text-xs">
                        {order.paymentMethod.replace('_', ' ')}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            order.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                              : order.status === 'pending'
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                              : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                          }`}
                        >
                          {order.status === 'approved'
                            ? 'APROVADO'
                            : order.status === 'pending'
                            ? 'PENDENTE'
                            : 'REEMBOLSADO'}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {order.status === 'approved' && (
                          <button
                            onClick={() => {
                              if (confirm(`Deseja reembolsar a venda ${order.id}?`)) {
                                refundOrder(order.id);
                              }
                            }}
                            className="px-2.5 py-1 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded font-semibold"
                            title="Emitir reembolso"
                          >
                            Reembolsar
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
