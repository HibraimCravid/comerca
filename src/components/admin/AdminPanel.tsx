import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, convertCurrency } from '../../utils/currency';
import {
  ShieldCheck,
  Users,
  Package,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileCheck,
  Building,
  DollarSign,
  Search,
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const {
    products,
    orders,
    withdrawRequests,
    selectedCurrency,
    approveWithdrawal,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'withdrawals' | 'products' | 'kyc'>('withdrawals');

  // Total platform GMV
  const platformGMV = orders.reduce((sum, o) => {
    return o.status === 'approved' ? sum + o.paidAmount : sum;
  }, 0);

  // Platform cut estimation (10% flat per approved order)
  const approvedOrders = orders.filter((o) => o.status === 'approved');
  const platformRevenue = approvedOrders.reduce((sum, o) => {
    return sum + o.paidAmount * 0.1;
  }, 0);

  return (
    <div className="flex-1 bg-[#f8fafc] dark:bg-slate-950 p-6 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center border border-slate-800 shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Painel de Supervisão e Administração Comerça
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Controlo de conformidade KYC, moderação de produtos e aprovação de levantamentos bancários em Angola.
            </p>
          </div>
        </div>

        {/* 4 Admin Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-xs text-slate-400 font-medium block">Volume Geral Transacionado</span>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {formatCurrency(
                convertCurrency(platformGMV, 'AOA', selectedCurrency).convertedAmount,
                selectedCurrency
              )}
            </p>
            <span className="text-[10px] text-emerald-600 font-bold mt-1 block">GMV Total em Produção</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-xs text-slate-400 font-medium block">Receita Líquida da Plataforma</span>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {formatCurrency(
                convertCurrency(platformRevenue, 'AOA', selectedCurrency).convertedAmount,
                selectedCurrency
              )}
            </p>
            <span className="text-[10px] text-slate-400 mt-1 block">Taxa de 10% por venda</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-xs text-slate-400 font-medium block">Levantamentos Pendentes</span>
            <p className="text-2xl font-bold text-amber-500 mt-1">
              {(withdrawRequests || []).filter((r) => r.status === 'pending').length}
            </p>
            <span className="text-[10px] text-slate-400 mt-1 block">Aguardam autorização bancária</span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-xs text-slate-400 font-medium block">Produtos sob Moderação</span>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {(products || []).length}
            </p>
            <span className="text-[10px] text-emerald-600 font-bold mt-1 block">100% Verificados</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('withdrawals')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'withdrawals'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            Fila de Levantamentos Interbancários ({(withdrawRequests || []).length})
          </button>
          <button
            onClick={() => setActiveTab('kyc')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'kyc'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            Verificação KYC / NIF de Produtores
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'products'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            Auditoria de Conteúdos Digitais
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'withdrawals' && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                    <th className="px-6 py-3.5 font-semibold">Data / ID</th>
                    <th className="px-6 py-3.5 font-semibold">Titular</th>
                    <th className="px-6 py-3.5 font-semibold">Banco & IBAN</th>
                    <th className="px-6 py-3.5 font-semibold">Valor</th>
                    <th className="px-6 py-3.5 font-semibold">Estado</th>
                    <th className="px-6 py-3.5 font-semibold text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="text-xs sm:text-sm divide-y divide-slate-100 dark:divide-slate-800">
                  {(withdrawRequests || []).map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold text-slate-900 dark:text-white block">
                          {req.id}
                        </span>
                        <span className="text-[11px] text-slate-400">{req.date || req.requestedAt}</span>
                      </td>

                      <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">
                        {req.accountHolder || req.userName}
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {req.bankName || (req.methodTitle ? req.methodTitle.split(' - ')[0] : 'Banco Angolano')}
                        </p>
                        <p className="font-mono text-xs text-slate-400">
                          {req.iban || (req.methodTitle && req.methodTitle.includes(' - ') ? req.methodTitle.split(' - ')[1] : req.accountDetails || 'AO06...')}
                        </p>
                      </td>

                      <td className="px-6 py-4 font-extrabold text-slate-900 dark:text-white">
                        {formatCurrency(req.amount, req.currency)}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            req.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                          }`}
                        >
                          {req.status === 'completed' ? 'PAGO' : 'PENDENTE'}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        {req.status === 'pending' && (
                          <button
                            onClick={() => approveWithdrawal(req.id)}
                            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer"
                          >
                            Autorizar Pagamento
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'kyc' && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Produtores Verificados (Regulação BNA & Conformidade Fiscal)
            </h3>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
                  AM
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-900 dark:text-white">
                    António Manuel (Produtor Oficial)
                  </p>
                  <p className="text-xs text-slate-400">
                    BI: 004928192LA041 • NIF: 5419281920 • Luanda, Angola
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 text-xs font-bold rounded-full flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                KYC Aprovado
              </span>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-4">
              Produtos Digitais Aprovados no Marketplace
            </h3>
            <div className="space-y-3">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img src={p.imageUrl} className="w-10 h-10 rounded object-cover" />
                    <div>
                      <p className="font-bold text-xs text-slate-900 dark:text-white">{p.title}</p>
                      <p className="text-[11px] text-slate-400">
                        {p.category} • {formatCurrency(p.price, p.currency)} • Por {p.creatorName}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">
                    CONFORME
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
