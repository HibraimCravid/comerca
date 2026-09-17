import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, convertCurrency } from '../../utils/currency';
import {
  BarChart3,
  Globe2,
  Smartphone,
  CreditCard,
  Building,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { selectedCurrency } = useApp();

  const provinces = [
    { name: 'Luanda', share: 64, amount: 2450000 },
    { name: 'Benguela', share: 14, amount: 537000 },
    { name: 'Huambo', share: 8, amount: 307000 },
    { name: 'Huíla (Lubango)', share: 6, amount: 230000 },
    { name: 'Cabinda', share: 4, amount: 153000 },
    { name: 'Outras Províncias / Diáspora', share: 4, amount: 153000 },
  ];

  return (
    <div className="flex-1 bg-[#f8fafc] dark:bg-slate-950 p-6 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Analytics de Tráfego & Gateways de Pagamento
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Distribuição geográfica de vendas por províncias de Angola e estado de conexão com as redes interbancárias.
          </p>
        </div>

        {/* Payment Gateways Status Banner */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-emerald-500" />
            Estado dos Gateways de Pagamento em Angola
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 dark:text-white">
                  Rede Multicaixa Express (EMIS)
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-2">
                100% Operacional • Latência: 450ms
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Conexão direta para validação via telemóvel em Angola.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 dark:text-white">
                  Referência Multicaixa (ATM)
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-2">
                Operacional (Entidade 00192)
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Geração automática com prazo de 48h.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 dark:text-white">
                  Cartões Internacionais (Visa / MC)
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-2">
                Operacional (Euro e Real)
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Processamento com 3D Secure anti-fraude.
              </p>
            </div>
          </div>
        </div>

        {/* Geographic Sales Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-emerald-500" />
            Vendas por Região & Província
          </h3>

          <div className="space-y-4">
            {provinces.map((prov) => {
              const converted = convertCurrency(prov.amount, 'AOA', selectedCurrency).convertedAmount;

              return (
                <div key={prov.name}>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-800 dark:text-slate-200">{prov.name}</span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {formatCurrency(converted, selectedCurrency)} ({prov.share}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${prov.share}%` }}
                      className="bg-emerald-500 h-full rounded-full"
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
