import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Currency } from '../../types';
import { ANGOLAN_BANKS } from '../../data/financialAccountTypes';
import {
  User,
  Shield,
  CreditCard,
  Building,
  Key,
  CheckCircle2,
  FileCheck,
  Save,
  Globe,
  Bell,
  Smartphone,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { user, setUser, selectedCurrency, setSelectedCurrency } = useApp();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [bi, setBi] = useState('004928192LA041');
  const [nif, setNif] = useState('5419281920');
  const [selectedBank, setSelectedBank] = useState('BAI - Banco Angolano de Investimentos');
  const [iban, setIban] = useState('AO06 0040 0000 1234 5678 9012 3');
  const [isSaved, setIsSaved] = useState(false);

  // Keep the form fields in sync with the account's real data (e.g. what
  // was filled in during registration), instead of only capturing it once
  // when this component first mounted.
  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone);
  }, [user.name, user.email, user.phone]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      ...user,
      name,
      email,
      phone,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="flex-1 bg-[#f8fafc] dark:bg-slate-950 p-6 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Configurações da Conta & Conformidade
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Faça a gestão dos seus dados pessoais, documentos fiscais para levantamentos e preferências de moeda.
          </p>
        </div>

        {isSaved && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            As suas configurações foram atualizadas com sucesso!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Personal Info Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-500" />
              Informações do Perfil
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Principal
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Telemóvel (WhatsApp / Express)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Moeda Padrão de Visualização
                </label>
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value as Currency)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="AOA">Kwanza Angolano (AOA / Kz)</option>
                  <option value="USD">Dólar Americano (USD / $)</option>
                  <option value="EUR">Euro (€)</option>
                  <option value="BRL">Real Brasileiro (R$)</option>
                </select>
              </div>
            </div>
          </div>

          {/* KYC Angola Document & Tax Info */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-500" />
                Dados Fiscais & KYC (Angola)
              </h3>
              {user.kycStatus === 'verified' && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                  VERIFICADO
                </span>
              )}
              {user.kycStatus === 'pending' && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                  EM ANÁLISE
                </span>
              )}
              {user.kycStatus === 'unsubmitted' && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                  NÃO SUBMETIDO
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              O nome completo usado aqui é o nome legal que fica associado à sua conta após
              verificação, e é o único nome aceite como titular numa conta bancária para
              levantamentos — isto protege contra fraude e lavagem de dinheiro.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Bilhete de Identidade (BI) ou Passaporte
                </label>
                <input
                  type="text"
                  value={bi}
                  onChange={(e) => setBi(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  NIF (Número de Identificação Fiscal)
                </label>
                <input
                  type="text"
                  value={nif}
                  onChange={(e) => setNif(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>

            {user.kycStatus !== 'verified' && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setUser({ ...user, kycStatus: 'pending' });
                    // Simulated review — this project has no real KYC provider
                    // connected yet, so approval here is a demo stand-in.
                    setTimeout(() => {
                      setUser((prev) => ({ ...prev, kycStatus: 'verified' }));
                    }, 4000);
                  }}
                  disabled={user.kycStatus === 'pending'}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  {user.kycStatus === 'pending' ? 'A analisar documentos...' : 'Submeter Documentos para Verificação'}
                </button>
                <p className="text-[10px] text-slate-400 mt-2">
                  É preciso ter o KYC verificado para poder solicitar o primeiro levantamento.
                </p>
              </div>
            )}
          </div>

          {/* Bank Account for Withdrawals */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-500" />
              Conta Bancária Principal para Recebimentos
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Banco em Angola
                </label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {ANGOLAN_BANKS.map((bankName) => (
                    <option key={bankName} value={bankName}>
                      {bankName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  IBAN Angolano (AO06...)
                </label>
                <input
                  type="text"
                  value={iban}
                  onChange={(e) => setIban(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Guardar Configurações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
