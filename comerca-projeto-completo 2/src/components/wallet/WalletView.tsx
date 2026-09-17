import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, convertCurrency } from '../../utils/currency';
import { ANGOLAN_BANKS } from '../../data/financialAccountTypes';
import {
  Wallet,
  ArrowDownToLine,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building,
  CreditCard,
  History,
  FileText,
  DollarSign,
  Send,
  X,
} from 'lucide-react';

export const WalletView: React.FC = () => {
  const {
    availableBalance,
    pendingBalance,
    walletTransactions,
    withdrawRequests,
    requestWithdrawal,
    selectedCurrency,
    user,
    navigate,
  } = useApp();

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(50000);
  const [selectedBank, setSelectedBank] = useState('BAI - Banco Angolano de Investimentos');
  const [iban, setIban] = useState('AO06 0040 0000 1234 5678 9012 3');
  const [accountHolder, setAccountHolder] = useState(user.name);
  const [notes, setNotes] = useState('');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  // Keep the account holder name in sync with the real logged-in user.
  useEffect(() => {
    setAccountHolder(user.name);
  }, [user.name]);

  const withdrawFee = 500; // 500 Kz flat fee
  const netWithdraw = Math.max(0, withdrawAmount - withdrawFee);

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount > availableBalance) {
      alert('O valor solicitado é superior ao seu saldo disponível.');
      return;
    }

    requestWithdrawal({
      amount: withdrawAmount,
      currency: 'AOA',
      bankName: selectedBank,
      iban,
      accountHolder,
    });

    setWithdrawSuccess(true);
    setTimeout(() => {
      setWithdrawSuccess(false);
      setIsWithdrawModalOpen(false);
    }, 1800);
  };

  return (
    <div className="flex-1 bg-[#f8fafc] dark:bg-slate-950 p-6 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Title & Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Carteira & Levantamentos Financeiros
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Controle o seu fluxo de caixa, saldos disponíveis e transfira para o seu banco em Angola.
            </p>
          </div>

          {user.kycStatus === 'verified' ? (
            <button
              onClick={() => setIsWithdrawModalOpen(true)}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
            >
              <ArrowDownToLine className="w-4 h-4" />
              Solicitar Levantamento
            </button>
          ) : (
            <button
              onClick={() => navigate('settings')}
              className="px-5 py-2.5 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
            >
              <AlertCircle className="w-4 h-4" />
              {user.kycStatus === 'pending' ? 'KYC em análise' : 'Verificar identidade (KYC) para levantar'}
            </button>
          )}
        </div>

        {user.kycStatus !== 'verified' && (
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p>
              Antes do primeiro levantamento, é preciso verificar a sua identidade (KYC) em{' '}
              <button onClick={() => navigate('settings')} className="font-bold underline cursor-pointer">
                Definições
              </button>{' '}
              — isto protege a sua conta e a plataforma contra fraude e lavagem de dinheiro.
            </p>
          </div>
        )}

        {/* 3 Balances Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Saldo Disponível */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-bl-full pointer-events-none"></div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Saldo Disponível para Levantamento
            </span>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
              {formatCurrency(
                convertCurrency(availableBalance, 'AOA', selectedCurrency).convertedAmount,
                selectedCurrency
              )}
            </p>
            <div className="mt-3 flex items-center text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              Libertado para transferência imediata
            </div>
          </div>

          {/* Saldo Pendente */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Saldo Pendente (Garantia de 7 a 14 dias)
            </span>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
              {formatCurrency(
                convertCurrency(pendingBalance, 'AOA', selectedCurrency).convertedAmount,
                selectedCurrency
              )}
            </p>
            <div className="mt-3 flex items-center text-xs text-amber-600 dark:text-amber-400 font-medium">
              <Clock className="w-4 h-4 mr-1.5" />
              Proteção anti-fraude e prazo de reembolso
            </div>
          </div>

          {/* Saldo Total */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Património Total na Plataforma
            </span>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
              {formatCurrency(
                convertCurrency(availableBalance + pendingBalance, 'AOA', selectedCurrency)
                  .convertedAmount,
                selectedCurrency
              )}
            </p>
            <div className="mt-3 flex items-center text-xs text-slate-400 font-medium">
              <Wallet className="w-4 h-4 mr-1.5 text-slate-400" />
              Actualizado em tempo real
            </div>
          </div>
        </div>

        {/* 2-Column Section: Withdrawal History & Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Withdrawal Requests */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Histórico de Levantamentos
              </h3>
              <span className="text-xs text-slate-400">
                {(withdrawRequests || []).length} solicitações
              </span>
            </div>

            <div className="p-4 divide-y divide-slate-100 dark:divide-slate-800">
              {(withdrawRequests || []).length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">Nenhuma solicitação de levantamento.</p>
              ) : (
                (withdrawRequests || []).map((req) => {
                  const bankDisplay = req.bankName || (req.methodTitle ? req.methodTitle.split(' - ')[0] : 'Banco Angolano');
                  const ibanDisplay = req.iban || (req.methodTitle && req.methodTitle.includes(' - ') ? req.methodTitle.split(' - ')[1] : req.accountDetails || 'AO06 0000 0000 0000 0');
                  return (
                    <div key={req.id} className="py-3.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          <Building className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-xs text-slate-900 dark:text-white">
                            {bankDisplay.split(' - ')[0]}
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                            {ibanDisplay.slice(0, 14)}...
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-xs text-slate-900 dark:text-white">
                          {formatCurrency(req.amount, req.currency)}
                        </p>
                        <span
                          className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${
                            req.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                              : req.status === 'processing'
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400'
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                          }`}
                        >
                          {req.status === 'completed'
                            ? 'CONCLUÍDO'
                            : req.status === 'processing'
                            ? 'EM PROCESSAMENTO'
                            : 'PENDENTE'}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Wallet Ledger / Transactions */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Extrato Financeiro Detalhado
              </h3>
              <span className="text-xs text-slate-400">Últimos movimentos</span>
            </div>

            <div className="p-4 divide-y divide-slate-100 dark:divide-slate-800">
              {walletTransactions.map((tx) => (
                <div key={tx.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-xs text-slate-900 dark:text-white">
                      {tx.description}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {tx.date} • Ref: {tx.id}
                    </p>
                  </div>

                  <div className="text-right">
                    <span
                      className={`font-bold text-xs ${
                        tx.amount > 0
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {tx.amount > 0 ? '+' : ''}
                      {formatCurrency(tx.amount, tx.currency)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Solicitar Levantamento */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">Solicitar Transferência Bancária</h3>
              <button
                onClick={() => setIsWithdrawModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {withdrawSuccess ? (
              <div className="p-8 text-center">
                <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-lg text-slate-900 dark:text-white">
                  Pedido Submetido com Sucesso!
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  O valor será creditado na sua conta bancária num prazo de 2 a 24 horas úteis.
                </p>
              </div>
            ) : (
              <form onSubmit={handleWithdrawSubmit} className="p-6 space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700 dark:text-slate-300">
                      Valor a Levantar (Kwanza)
                    </span>
                    <span className="text-emerald-600 font-bold">
                      Disponível: {formatCurrency(availableBalance, 'AOA')}
                    </span>
                  </div>
                  <input
                    type="number"
                    min={1}
                    max={availableBalance}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Sem valor mínimo • Taxa fixa de processamento interbancário: 500 Kz
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Banco de Destino em Angola
                  </label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  >
                    {ANGOLAN_BANKS.map((bankName) => (
                      <option key={bankName} value={bankName}>
                        {bankName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    IBAN Angolano (AO06...)
                  </label>
                  <input
                    type="text"
                    required
                    value={iban}
                    onChange={(e) => setIban(e.target.value)}
                    placeholder="AO06 0040 0000 0000 0000 0000 0"
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Titular da Conta Bancária
                  </label>
                  <input
                    type="text"
                    required
                    readOnly
                    disabled
                    value={accountHolder}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-400 cursor-not-allowed"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Bloqueado — tem de corresponder ao nome verificado no seu KYC, para evitar fraude e lavagem de dinheiro.
                  </p>
                </div>

                {/* Calculation breakdown */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                  <div className="flex justify-between text-slate-500">
                    <span>Valor solicitado:</span>
                    <span>{formatCurrency(withdrawAmount, 'AOA')}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Taxa de processamento:</span>
                    <span>- {formatCurrency(withdrawFee, 'AOA')}</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-900 dark:text-white pt-1 border-t border-slate-200 dark:border-slate-700">
                    <span>Valor Líquido a Receber:</span>
                    <span className="text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(netWithdraw, 'AOA')}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsWithdrawModalOpen(false)}
                    className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-md cursor-pointer"
                  >
                    Confirmar Levantamento
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
