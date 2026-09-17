import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowRight,
  Sparkles,
  Target,
  Heart,
  Rocket,
  Users2,
  Quote,
} from 'lucide-react';

export const AboutView: React.FC = () => {
  const { navigate, openAuthModal } = useApp();
  const [activeYear, setActiveYear] = useState(0);

  const founders = [
    {
      name: 'Kelmir Queta',
      role: 'Fundador e Criador',
      initials: 'KQ',
    },
    {
      name: 'Luidislau Cravid',
      role: 'Fundador e Criador',
      initials: 'LC',
    },
    {
      name: 'Hibraim Cravid',
      role: 'Fundador e Criador',
      initials: 'HC',
    },
  ];

  const yearline = [
    {
      year: '2024',
      title: 'A ideia',
      desc: 'Tudo começou com uma pergunta simples: por que é tão difícil, para um produtor de conteúdo em Angola, vender um curso ou um ebook online e receber o dinheiro sem complicação? Faltava uma plataforma feita de raiz para a realidade angolana.',
    },
    {
      year: '2025',
      title: 'A construção',
      desc: 'Kelmir Queta, Luidislau Cravid e Hibraim Cravid juntaram-se para transformar essa ideia em código, ecrã e produto real — pensado para tirar barreiras do caminho de quem quer vender, sem burocracia nem taxas escondidas.',
    },
    {
      year: '2026',
      title: 'Nasce a Comerça',
      desc: 'A plataforma abre as portas: qualquer produtor, professor, consultor ou criador pode publicar o seu produto digital, e qualquer afiliado pode divulgar e ganhar comissão — tudo em Kwanza, Dólar, Euro ou Real.',
    },
    {
      year: '2027',
      title: 'Próximo capítulo',
      desc: 'O objetivo é crescer para além de Angola, chegando a mais criadores da lusofonia, com mais formas de pagamento e mais ferramentas para quem vende na Comerça.',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Nossa História — Kiwify-style year timeline */}
      <section className="pt-14 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-6xl mx-auto">
          {/* Year selector timeline */}
          <div className="flex items-center gap-6 sm:gap-10 overflow-x-auto pb-2 mb-12">
            {yearline.map((y, idx) => (
              <button
                key={y.year}
                onClick={() => setActiveYear(idx)}
                className="flex flex-col items-center gap-3 shrink-0 cursor-pointer group"
              >
                <span
                  className={`text-lg sm:text-xl font-extrabold transition-colors ${
                    activeYear === idx
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-300 dark:text-slate-700 group-hover:text-slate-400'
                  }`}
                >
                  {y.year}
                </span>
                <span className="relative w-full h-px bg-slate-200 dark:bg-slate-800 min-w-16">
                  <span
                    className={`absolute -top-[5px] left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 transition-colors ${
                      activeYear === idx
                        ? 'bg-emerald-500 border-emerald-500'
                        : 'bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700'
                    }`}
                  />
                </span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Overlapping illustrative cards (no stock photos of real people) */}
            <div className="relative h-72 sm:h-80 max-w-md mx-auto lg:mx-0 w-full">
              <div className="absolute top-0 right-0 w-56 sm:w-64 h-44 sm:h-52 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-xl flex flex-col items-center justify-center gap-2 text-white">
                <div className="w-14 h-14 rounded-full bg-white/15 flex items-center justify-center font-bold text-xl">
                  {founders[activeYear % founders.length]?.initials}
                </div>
                <p className="font-bold text-sm">{founders[activeYear % founders.length]?.name}</p>
                <p className="text-[11px] text-emerald-100">Fundador e Criador</p>
              </div>
              <div className="absolute bottom-0 left-0 w-52 sm:w-60 h-40 sm:h-48 rounded-2xl bg-slate-900 dark:bg-slate-800 shadow-xl flex flex-col items-center justify-center gap-2 text-white border border-slate-800 dark:border-slate-700">
                <Sparkles className="w-7 h-7 text-emerald-400" />
                <p className="font-extrabold text-2xl">{yearline[activeYear].year}</p>
                <p className="text-[11px] text-slate-400 px-4 text-center">{yearline[activeYear].title}</p>
              </div>
            </div>

            {/* Text */}
            <div>
              <h2 className="text-emerald-600 dark:text-emerald-400 font-extrabold text-2xl sm:text-3xl mb-4">
                Nossa história
              </h2>
              <p className="text-lg sm:text-xl text-slate-700 dark:text-slate-300 leading-relaxed">
                {yearline[activeYear].desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <section className="py-14 bg-white dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center sm:text-left">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center mx-auto sm:mx-0 mb-3">
              <Target className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-1.5">A Nossa Missão</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Dar a qualquer criador angolano as ferramentas para transformar conhecimento em
              receita, sem barreiras técnicas ou financeiras.
            </p>
          </div>
          <div className="text-center sm:text-left">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center mx-auto sm:mx-0 mb-3">
              <Rocket className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-1.5">A Nossa Visão</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Ser a referência de comércio digital em Angola e na lusofonia, ligando produtores,
              afiliados e alunos num só ecossistema.
            </p>
          </div>
          <div className="text-center sm:text-left">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center mx-auto sm:mx-0 mb-3">
              <Heart className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-1.5">Os Nossos Valores</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Simplicidade, transparência nas taxas e compromisso com o sucesso de quem vende
              na plataforma.
            </p>
          </div>
        </div>
      </section>

      {/* Founders */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
              <Users2 className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Quem Construiu a Comerça
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Os fundadores
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {founders.map((f) => (
              <div
                key={f.name}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-lg mx-auto mb-4 shadow-md">
                  {f.initials}
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white">{f.name}</h3>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                  {f.role}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 max-w-2xl mx-auto text-center">
            <Quote className="w-6 h-6 text-emerald-500 mx-auto mb-3" />
            <p className="text-slate-600 dark:text-slate-300 italic leading-relaxed">
              "Construímos a Comerça a pensar em cada produtor que só precisa de uma
              oportunidade justa para vender o que sabe fazer."
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Sparkles className="w-8 h-8 text-emerald-400 mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Faça parte desta história
          </h2>
          <p className="text-slate-300 mb-8">
            Crie a sua conta grátis e comece a vender os seus produtos digitais hoje mesmo.
          </p>
          <button
            id="about-cta-register-btn"
            onClick={() => openAuthModal('register')}
            className="px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-base shadow-lg transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            Criar Conta Grátis
            <ArrowRight className="w-4 h-4" />
          </button>
          <div className="mt-4">
            <button
              onClick={() => navigate('home')}
              className="text-slate-400 hover:text-white text-sm font-medium cursor-pointer"
            >
              Voltar à página inicial
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
