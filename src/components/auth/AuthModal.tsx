import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  X,
  Lock,
  Mail,
  Phone,
  User,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  MailCheck,
  RotateCw,
} from 'lucide-react';

type AuthMode = 'login' | 'register' | 'forgot' | 'verify';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    authModalMode,
    closeAuthModal,
    login,
    user,
    navigate,
  } = useApp();

  const [mode, setMode] = useState<AuthMode>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('creator');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Email confirmation code state
  const [enteredCode, setEnteredCode] = useState('');
  const [codeError, setCodeError] = useState<string | null>(null);
  const [codeInfo, setCodeInfo] = useState<string | null>(null);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [verifyToken, setVerifyToken] = useState<string | null>(null);
  const [verifyExpiresAt, setVerifyExpiresAt] = useState<number | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Sync mode whenever authModalMode or isAuthModalOpen changes
  useEffect(() => {
    if (isAuthModalOpen) {
      setMode(authModalMode || 'login');
      setSuccessMsg(null);
      setCodeError(null);
      setCodeInfo(null);
      setEnteredCode('');
    }
  }, [authModalMode, isAuthModalOpen]);

  // Resend cooldown ticker
  useEffect(() => {
    if (resendCooldown <= 0) {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
      return;
    }
    cooldownRef.current = setInterval(() => {
      setResendCooldown((s) => Math.max(0, s - 1));
    }, 1000);
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, [resendCooldown]);

  if (!isAuthModalOpen) return null;

  const completeLogin = () => {
    const displayName = mode === 'register' ? (name.trim() || 'Novo Criador') : user.name;
    const displayEmail = email.trim() || user.email;
    const displayPhone = phone.trim() || user.phone;

    setSuccessMsg('Conta confirmada com sucesso!');

    setTimeout(() => {
      login({
        name: displayName,
        email: displayEmail,
        phone: displayPhone,
        role: selectedRole,
        isNewAccount: true,
      });
      navigate('getting_started');
    }, 500);
  };

  // Calls the server, which generates the code, signs it into a token and
  // emails it via Resend. The raw code itself never comes back in the response.
  const sendVerificationCode = async () => {
    setIsSendingCode(true);
    setCodeError(null);
    setCodeInfo(null);
    try {
      const res = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), name: name.trim() }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setCodeInfo(data.error || 'Não foi possível gerar o código. Tente novamente.');
        return;
      }

      setVerifyToken(data.token);
      setVerifyExpiresAt(data.expiresAt);

      if (!data.delivered && data.code) {
        // No email service configured — show the code here so it can still
        // be used to test/confirm the account.
        setCodeInfo(`Modo de teste: o código é ${data.code}`);
      } else if (!data.delivered) {
        setCodeInfo('Não foi possível gerar o código. Tente novamente.');
      }
    } catch {
      setCodeInfo('Não foi possível contactar o servidor para enviar o código. Tente novamente.');
    } finally {
      setIsSendingCode(false);
      setResendCooldown(30);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'login' || mode === 'forgot') {
      const displayName = user.name;
      const displayEmail = email.trim() || user.email;
      const displayPhone = phone.trim() || user.phone;

      setSuccessMsg(
        mode === 'forgot'
          ? 'Instruções enviadas para o seu email!'
          : 'Sessão iniciada com sucesso!'
      );

      if (mode === 'login') {
        setTimeout(() => {
          login({
            name: displayName,
            email: displayEmail,
            phone: displayPhone,
            role: selectedRole,
          });
          navigate('dashboard');
        }, 600);
      }
      return;
    }

    // Registration now requires confirming a code sent to the given email
    // before the account is actually created / access is granted.
    setMode('verify');
    sendVerificationCode();
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyToken || !verifyExpiresAt) {
      setCodeError('O código expirou ou ainda não foi enviado. Peça um novo código.');
      return;
    }
    setIsVerifying(true);
    setCodeError(null);
    try {
      const res = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          code: enteredCode.trim(),
          token: verifyToken,
          expiresAt: verifyExpiresAt,
        }),
      });
      const data = await res.json();
      if (data.valid) {
        completeLogin();
      } else {
        setCodeError(data.error || 'Código incorreto. Verifique e tente novamente.');
      }
    } catch {
      setCodeError('Não foi possível verificar o código. Tente novamente.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
    >
      <div
        id="auth-modal-container"
        className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg overflow-hidden shadow-sm">
              <img src="/logo-icon.png" alt="Comerça" className="w-full h-full object-cover rounded-lg" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                {mode === 'login' && 'Entrar na sua conta'}
                {mode === 'register' && 'Criar conta gratuita'}
                {mode === 'forgot' && 'Recuperar palavra-passe'}
                {mode === 'verify' && 'Confirme o seu email'}
                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                  Comerça
                </span>
              </span>
              <p className="text-[11px] text-slate-400">
                {mode === 'register' && 'Comece a vender produtos digitais ou a aprender hoje mesmo'}
                {mode === 'login' && 'Aceda aos seus cursos, carteira e painel de vendas'}
                {mode === 'forgot' && 'Vamos ajudá-lo a recuperar o acesso'}
                {mode === 'verify' && `Enviámos um código de 6 dígitos para ${email || 'o seu email'}`}
              </p>
            </div>
          </div>

          <button
            id="close-auth-modal-btn"
            onClick={closeAuthModal}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        {mode !== 'verify' && (
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-3 text-xs font-bold transition-colors cursor-pointer ${
              mode === 'login'
                ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500 bg-white dark:bg-slate-900'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Iniciar Sessão
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-3 text-xs font-bold transition-colors cursor-pointer ${
              mode === 'register'
                ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500 bg-white dark:bg-slate-900'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Criar Nova Conta
          </button>
        </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="m-5 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{successMsg} A redirecionar...</span>
          </div>
        )}

        {/* Email Verification Step */}
        {mode === 'verify' && (
          <form onSubmit={handleVerifySubmit} className="p-6 space-y-4 text-xs">
            <div className="flex flex-col items-center text-center py-2">
              <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center mb-3">
                <MailCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed max-w-xs">
                Introduza o código de 6 dígitos que enviámos para{' '}
                <span className="font-bold text-slate-900 dark:text-white">{email}</span> para
                confirmar a sua conta.
              </p>
            </div>

            <div>
              <input
                type="text"
                inputMode="numeric"
                autoFocus
                maxLength={6}
                value={enteredCode}
                onChange={(e) => {
                  setCodeError(null);
                  setEnteredCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                }}
                placeholder="000000"
                className="w-full text-center tracking-[0.6em] text-xl font-bold pl-4 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              {codeError && (
                <p className="text-red-500 font-semibold mt-2 text-center">{codeError}</p>
              )}
            </div>

            {codeInfo && (
              <div className="rounded-xl border border-dashed border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 p-3 text-amber-800 dark:text-amber-300 text-[11px] leading-relaxed">
                {codeInfo}
              </div>
            )}

            <button
              id="auth-verify-submit-btn"
              type="submit"
              disabled={isVerifying || enteredCode.length !== 6}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isVerifying ? 'A confirmar...' : 'Confirmar Código'}</span>
              {!isVerifying && <ArrowRight className="w-4 h-4" />}
            </button>

            <div className="pt-1 text-center text-slate-500 dark:text-slate-400">
              {resendCooldown > 0 ? (
                <p>Pode reenviar o código em {resendCooldown}s</p>
              ) : (
                <button
                  type="button"
                  onClick={sendVerificationCode}
                  disabled={isSendingCode}
                  className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer disabled:opacity-60"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isSendingCode ? 'animate-spin' : ''}`} />
                  {isSendingCode ? 'A enviar...' : 'Reenviar código'}
                </button>
              )}
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-[11px] font-medium cursor-pointer"
              >
                Voltar e corrigir dados
              </button>
            </div>
          </form>
        )}

        {/* Form Body */}
        {mode !== 'verify' && (
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {mode === 'register' && (
            <>
              {/* Role Selection */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Qual é o seu objetivo principal na Comerça?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('creator')}
                    className={`py-2 px-2 rounded-xl font-bold border text-center transition-all cursor-pointer ${
                      selectedRole === 'creator'
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    Vender Cursos
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('affiliate')}
                    className={`py-2 px-2 rounded-xl font-bold border text-center transition-all cursor-pointer ${
                      selectedRole === 'affiliate'
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    Ser Afiliado
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('buyer')}
                    className={`py-2 px-2 rounded-xl font-bold border text-center transition-all cursor-pointer ${
                      selectedRole === 'buyer'
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    Aprender
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nome Completo
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Mateus Sebastião"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Angolan Mobile Phone */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Telemóvel (WhatsApp / Multicaixa Express)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+244 923 000 000"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </>
          )}

          {/* Email */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail@exemplo.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Palavra-passe
              </label>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold hover:underline"
                >
                  Esqueceu-se?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            id="auth-submit-btn"
            type="submit"
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>
              {mode === 'login' && 'Entrar na Conta'}
              {mode === 'register' && 'Continuar e Confirmar Email'}
              {mode === 'forgot' && 'Enviar Instruções de Recuperação'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Footer disclaimer and toggle */}
          <div className="pt-2 text-center text-slate-500 dark:text-slate-400 text-xs">
            {mode === 'login' ? (
              <p>
                Ainda não tem conta na Comerça?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
                >
                  Criar conta gratuita
                </button>
              </p>
            ) : mode === 'register' ? (
              <p>
                Já possui uma conta ativa?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
                >
                  Iniciar sessão
                </button>
              </p>
            ) : (
              <p>
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
                >
                  Voltar ao início de sessão
                </button>
              </p>
            )}
          </div>
        </form>
        )}
      </div>
    </div>
  );
};
