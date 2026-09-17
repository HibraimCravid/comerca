import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';
import {
  ArrowRight,
  Sparkles,
  Zap,
  TrendingUp,
  ShieldCheck,
  Globe2,
  Wallet,
} from 'lucide-react';

/**
 * WelcomeGate
 * Advertising / sign-up landing page shown to first-time visitors before
 * they can access the platform. Automatically prompts the register modal
 * on load, and only completing the sign-up form grants entry to the app.
 */
export const WelcomeGate: React.FC = () => {
  const { openAuthModal } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => openAuthModal('register'), 700);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const features = [
    {
      icon: <Zap className="w-5 h-5 text-emerald-400" />,
      title: 'Pagamento em 15 segundos',
      desc: 'Multicaixa Express aprova compras instantaneamente no telemóvel do comprador.',
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-emerald-400" />,
      title: 'Comissões automáticas',
      desc: 'Sistema de afiliados com link exclusivo e cookie de 60 dias de rastreio.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      title: 'Sem mensalidade',
      desc: 'Só paga 10% quando vender de verdade. Sem taxas ocultas.',
    },
    {
      icon: <Globe2 className="w-5 h-5 text-emerald-400" />,
      title: '4 moedas suportadas',
      desc: 'Fature em Kwanza (AOA), Dólar (USD), Euro (EUR) ou Real (BRL).',
    },
    {
      icon: <Wallet className="w-5 h-5 text-emerald-400" />,
      title: 'Levantamento rápido',
      desc: 'Transfira o saldo direto para o seu banco angolano (BAI, BFA, BIC e outros).',
    },
    {
      icon: <Sparkles className="w-5 h-5 text-emerald-400" />,
      title: 'Tutorial guiado',
      desc: 'Aprenda a vender do 0% ao 100% logo no seu primeiro dia na plataforma.',
    },
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0 },
  };

  const featureGrid = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.08, delayChildren: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-white flex flex-col overflow-hidden relative">
      {/* Ambient animated glow */}
      <motion.div
        className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[36rem] h-[36rem] bg-emerald-500/10 blur-3xl rounded-full pointer-events-none"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />

      {/* Top brand bar */}
      <motion.header
        className="px-6 py-5 flex items-center justify-between max-w-7xl mx-auto w-full relative"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg overflow-hidden shadow-md">
            <img src="/logo-icon.png" alt="Comerça" className="w-full h-full object-cover" />
          </div>
          <span className="font-bold text-lg tracking-tight">Comerça</span>
        </div>
        <button
          id="gate-login-link-btn"
          onClick={() => openAuthModal('login')}
          className="text-sm font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          Já tenho conta — Entrar
        </button>
      </motion.header>

      {/* Hero / Ad content */}
      <main className="flex-1 flex items-center relative">
        <div className="max-w-4xl mx-auto px-6 py-12 sm:py-16 text-center">
          <motion.img
            src="/logo-full.png"
            alt="Comerça"
            className="h-16 sm:h-20 mx-auto mb-8 object-contain"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          />

          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-6"
            initial="hidden"
            animate="show"
            variants={fadeUp}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-semibold text-emerald-300">
              A Plataforma de Comércio Digital de Angola para o Mundo
            </span>
          </motion.div>

          <motion.h1
            className="text-3xl sm:text-5xl font-extrabold leading-tight mb-5 tracking-tight"
            initial="hidden"
            animate="show"
            variants={fadeUp}
            transition={{ duration: 0.55, delay: 0.2 }}
          >
            Comece a vender os seus{' '}
            <span className="text-emerald-400">cursos, ebooks e serviços</span> hoje mesmo
          </motion.h1>

          <motion.p
            className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed"
            initial="hidden"
            animate="show"
            variants={fadeUp}
            transition={{ duration: 0.55, delay: 0.3 }}
          >
            Receba em Kwanza, Dólar, Euro ou Real com Multicaixa Express, cartão internacional
            e muito mais. Crie a sua conta grátis em menos de 1 minuto e comece a faturar.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-3 justify-center mb-12"
            initial="hidden"
            animate="show"
            variants={fadeUp}
            transition={{ duration: 0.55, delay: 0.4 }}
          >
            <motion.button
              id="gate-register-btn"
              onClick={() => openAuthModal('register')}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-base shadow-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              Criar Conta Grátis
              <ArrowRight className="w-4 h-4" />
            </motion.button>
            <motion.button
              id="gate-login-btn"
              onClick={() => openAuthModal('login')}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-base transition-colors cursor-pointer"
            >
              Já tenho conta
            </motion.button>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto text-left"
            initial="hidden"
            animate="show"
            variants={featureGrid}
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                transition={{ duration: 0.45 }}
                whileHover={{ y: -3 }}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="mb-2">{f.icon}</div>
                <p className="font-bold text-sm mb-1">{f.title}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>

      <motion.footer
        className="text-center text-[11px] text-slate-500 pb-6 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.9 }}
      >
        © 2026 Comerça. Todos os direitos reservados.
      </motion.footer>
    </div>
  );
};
