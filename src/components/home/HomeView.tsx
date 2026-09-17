import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { navigate, openAuthModal } = useApp();

  const steps = [
    {
      step: '01',
      title: 'Crie a sua conta gratuita',
      desc: 'Registe-se em menos de 1 minuto como produtor, afiliado ou comprador com o seu email ou telemóvel.',
    },
    {
      step: '02',
      title: 'Publique o seu produto digital',
      desc: 'Carregue videoaulas, ebooks, ficheiros zip, templates ou consultorias com páginas de checkout instantâneas.',
    },
    {
      step: '03',
      title: 'Configure o pagamento',
      desc: 'Receba em Kwanza (Multicaixa Express, Referência Multicaixa), Euro ou Real de forma automática.',
    },
    {
      step: '04',
      title: 'Venda direto ou com afiliados',
      desc: 'Disponibilize links únicos para dezenas de afiliados promoverem o seu conteúdo e acelerarem as suas vendas.',
    },
    {
      step: '05',
      title: 'Receba os seus ganhos na conta',
      desc: 'Faça o levantamento direto para a sua conta bancária (BAI, BFA, Atlântico, etc.) com rapidez e segurança.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200/80 dark:border-slate-800">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-emerald-500/5 dark:bg-emerald-500/10 blur-3xl pointer-events-none rounded-full"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200/70 dark:border-emerald-800/60 mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                A Plataforma de Comércio Digital de Angola para o Mundo
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
              Qualquer pessoa pode vender{' '}
              <span className="text-emerald-600 dark:text-emerald-400">
                produtos digitais
              </span>{' '}
              e faturar todos os dias.
            </h1>

            {/* Subheadline */}
            <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Crie cursos online, venda ebooks, consultorias e ficheiros digitais.
              Produtores escalam receitas em Kwanza (AOA), Dólar ($), Euro (€) e Real (R$),
              enquanto afiliados promovem e recebem comissões automáticas.
            </p>

            {/* Call to Actions */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                id="hero-start-now-btn"
                onClick={() => openAuthModal('register')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-base shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
              >
                Começar agora
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                id="hero-getting-started-btn"
                onClick={() => navigate('getting_started')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-base hover:bg-slate-200 dark:hover:bg-slate-700 shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                Guia de Início
              </button>
            </div>

            {/* Micro proof points */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Sem mensalidade fixa
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Multicaixa Express & Referência
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Área de membros para cursos integrada
              </span>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-5 gap-4 lg:gap-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-center p-3">
              <p className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white">
                +1.850
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                Produtores Activos
              </p>
            </div>
            <div className="text-center p-3 border-l border-slate-100 dark:border-slate-800">
              <p className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white">
                +4.200
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                Produtos Digitais
              </p>
            </div>
            <div className="text-center p-3 border-l border-slate-100 dark:border-slate-800">
              <p className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white">
                +85.000
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                Compradores & Alunos
              </p>
            </div>
            <div className="text-center p-3 border-l border-slate-100 dark:border-slate-800">
              <p className="text-2xl lg:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                +680M Kz
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                Total Transacionado
              </p>
            </div>
            <div className="col-span-2 md:col-span-1 text-center p-3 border-l border-slate-100 dark:border-slate-800">
              <p className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white">
                14+
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                Países Atendidos
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works Section (5 Steps) */}
      <section className="py-16 lg:py-24 bg-white dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Passo a Passo
            </span>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
              Como funciona a Comerça?
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Do registo ao dinheiro na sua conta bancária em 5 etapas simples e transparentes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {steps.map((item, idx) => (
              <div
                key={item.step}
                className="bg-[#f8fafc] dark:bg-slate-800/80 p-6 rounded-xl border border-slate-200 dark:border-slate-700 relative group hover:border-emerald-500/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-sm mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-300 dark:text-slate-600">
                    <ChevronRight className="w-6 h-6" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marketplace Teaser (full catalog now lives on its own page) */}
      <section className="py-16 lg:py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          Catálogo Completo
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1 mb-3">
          Explore cursos, ebooks e mentorias no Marketplace
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto mb-7">
          Dezenas de produtos digitais de criadores angolanos e da lusofonia, prontos para comprar
          ou promover como afiliado.
        </p>
        <button
          onClick={() => navigate('marketplace')}
          className="px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2 cursor-pointer"
        >
          Ver todo o Marketplace
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>


      {/* Pricing & Transparency Section */}
      <section className="py-16 bg-[#0f172a] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Transparência Total
          </span>
          <h2 className="text-3xl font-bold mt-2">
            Pague apenas quando vender. Zero custos ocultos.
          </h2>
          <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
            Sem custos de adesão, sem taxas mensais e sem surpresas. O seu sucesso é o nosso sucesso.
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-slate-800/80 p-6 rounded-xl border border-slate-700">
              <div className="text-xs font-bold text-emerald-400 uppercase">
                Taxa de Transação
              </div>
              <p className="text-3xl font-extrabold mt-2">10%</p>
              <p className="text-xs text-slate-400 mt-2">
                Por cada venda aprovada, independentemente do preço. Inclui antifraude, emissão de faturas e entrega imediata de acessos.
              </p>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-xl border border-slate-700">
              <div className="text-xs font-bold text-emerald-400 uppercase">
                Área de Membros & Hospedagem
              </div>
              <p className="text-3xl font-extrabold mt-2">Grátis</p>
              <p className="text-xs text-slate-400 mt-2">
                Hospedagem de videoaulas, ficheiros protegidos, downloads controlados e certificados sem limite de alunos.
              </p>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-xl border border-slate-700">
              <div className="text-xs font-bold text-emerald-400 uppercase">
                Levantamentos Bancários
              </div>
              <p className="text-3xl font-extrabold mt-2">500 Kz</p>
              <p className="text-xs text-slate-400 mt-2">
                Taxa fixa por transferência para qualquer banco em Angola (BAI, BFA, Atlântico, BIC, etc.). Sem valor mínimo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 text-white font-bold text-base mb-3">
                <div className="w-7 h-7 rounded-md overflow-hidden">
                  <img src="/logo-icon.png" alt="Comerça" className="w-full h-full object-cover" />
                </div>
                Comerça
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                A infraestrutura definitiva para produtores e afiliados de produtos digitais em Angola e na lusofonia.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
                Plataforma
              </h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => navigate('getting_started')} className="hover:text-white font-medium text-emerald-400">
                    Como Começar
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('sobre')} className="hover:text-white">
                    Sobre Nós
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('marketplace')} className="hover:text-white">
                    Marketplace
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('dashboard')} className="hover:text-white">
                    Painel do Produtor
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('afiliados')} className="hover:text-white">
                    Rede de Afiliados
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('buyer_library')} className="hover:text-white">
                    Área do Aluno
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
                Conformidade & Legal
              </h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => navigate('legal')} className="hover:text-white">
                    Termos de Utilização
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('legal')} className="hover:text-white">
                    Termos de Venda e Compra
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('legal')} className="hover:text-white">
                    Política de Conteúdo
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('legal')} className="hover:text-white">
                    Termos de Responsabilidade
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('legal')} className="hover:text-white">
                    SLA — Nível de Serviço
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
                Suporte & Angola
              </h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Luanda, Angola • Suporte ao cliente 7 dias por semana via Multicaixa e atendimento direto.
              </p>
              <div className="mt-3">
                <button
                  onClick={() => navigate('suporte')}
                  className="px-3 py-1.5 bg-slate-800 text-slate-200 rounded-lg hover:bg-slate-700 font-medium"
                >
                  Abrir Ticket de Suporte
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>© 2026 Comerça. Todos os direitos reservados. Feito com rigor para Luanda e o mundo.</p>
            <div className="flex items-center gap-4">
              <span>AOA / Kz</span>
              <span>•</span>
              <span>USD / $</span>
              <span>•</span>
              <span>EUR / €</span>
              <span>•</span>
              <span>BRL / R$</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};
