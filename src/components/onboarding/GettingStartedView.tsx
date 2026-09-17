import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Sparkles,
  BookOpen,
  ShoppingBag,
  Briefcase,
  Share2,
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  Circle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Smartphone,
  CreditCard,
  Building,
  ShieldCheck,
  TrendingUp,
  Video,
  Award,
  ExternalLink,
  DollarSign,
  UserPlus,
  LogIn,
} from 'lucide-react';

export const GettingStartedView: React.FC = () => {
  const {
    currentRole,
    setCurrentRole,
    navigate,
    openAuthModal,
    openCheckout,
    isAuthenticated,
    user,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'buyer' | 'creator' | 'affiliate'>(
    currentRole === 'creator'
      ? 'creator'
      : currentRole === 'affiliate'
      ? 'affiliate'
      : 'buyer'
  );

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Gamified onboarding checklist state
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({
    account_created: isAuthenticated,
    profile_checked: true,
  });

  const toggleStep = (stepId: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepId]: !prev[stepId],
    }));
  };

  const buyerFaqs = [
    {
      q: 'Como recebo o acesso ao meu curso ou ebook após pagar?',
      a: 'A libertação é 100% automática e instantânea. Se pagar por Multicaixa Express ou Cartão, o acesso é disponibilizado na hora na sua Área de Membros ("Minha Área"). Se pagar por Referência Multicaixa (ATM), a confirmação ocorre em poucos minutos após o pagamento no caixa eletrónico ou app do banco.',
    },
    {
      q: 'Como funciona o pagamento por Multicaixa Express?',
      a: 'Ao selecionar Multicaixa Express no checkout da Comerça, basta introduzir o seu número de telemóvel angolano (+244). Receberá imediatamente uma notificação no seu telefone solicitando o PIN de 4 dígitos. Após confirmar, a compra é aprovada em menos de 15 segundos.',
    },
    {
      q: 'Posso assistir às aulas no telemóvel sem gastar muitos dados de internet?',
      a: 'Sim! O player de cursos da Comerça foi otimizado para redes móveis de Angola (Unitel e Africell), permitindo ajustar a qualidade do vídeo e fazer o download de materiais complementares em PDF e planilhas.',
    },
    {
      q: 'Tenho garantia se o curso não cumprir o que promete?',
      a: 'Sim. Todos os produtos na Comerça possuem garantia incondicional de 7 a 14 dias (conforme estipulado pelo produtor). Pode solicitar o reembolso direto pelo suporte se não ficar satisfeito.',
    },
  ];

  const creatorFaqs = [
    {
      q: 'Quais são as taxas cobradas pela Comerça?',
      a: 'A Comerça não cobra qualquer mensalidade ou custo de inscrição. Cobramos apenas uma comissão competitiva de 10% sobre as vendas aprovadas, independentemente do preço. Se não vender nada, não paga nada.',
    },
    {
      q: 'Como transfiro o dinheiro das minhas vendas para a minha conta bancária em Angola?',
      a: 'Pode solicitar o levantamento para qualquer banco angolano (BAI, BFA, Millennium Atlântico, Banco BIC, SOL, etc.) através do seu IBAN AO06. Os pagamentos são processados em até 24 horas úteis com uma taxa fixa de liquidação de 500 Kz.',
    },
    {
      q: 'Como os meus vídeos e materiais digitais são protegidos contra pirataria?',
      a: 'A Comerça conta com streaming seguro com assinatura digital, prevenção de cópia de conteúdo e marca d’água dinâmica na tela com o email e telefone do comprador para evitar gravações não autorizadas.',
    },
    {
      q: 'Posso vender para clientes em Portugal, Brasil e no estrangeiro?',
      a: 'Com certeza! A plataforma aceita pagamentos internacionais em Dólar ($), Euro (€) e Real (R$) via cartões Visa e Mastercard, convertendo os saldos para a moeda da sua preferência com taxas de câmbio oficiais.',
    },
  ];

  const affiliateFaqs = [
    {
      q: 'Como a Comerça sabe que a venda foi realizada pelo meu link?',
      a: 'Cada afiliado recebe um link exclusivo com código de rastreamento (ex: ?ref=LUK-XXXXX). Utilizamos tecnologia de cookies avançada (atribuição do último clique) para garantir que a sua comissão seja creditada na sua carteira de forma 100% segura.',
    },
    {
      q: 'Quanto posso ganhar como afiliado na Comerça?',
      a: 'As comissões são definidas pelos produtores e variam entre 20% e 50% do valor do produto. Em cursos de 30.000 Kz com 40% de comissão, recebe 12.000 Kz limpos por cada venda gerada.',
    },
    {
      q: 'Preciso pagar para ser afiliado na plataforma?',
      a: 'Não! O cadastro como afiliado é 100% gratuito. Pode afiliar-se a centenas de cursos e produtos digitais no marketplace com apenas um clique.',
    },
  ];

  return (
    <div className="flex-1 bg-[#f8fafc] dark:bg-slate-950 p-6 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white p-6 sm:p-10 border border-slate-800 shadow-xl">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              Guia Completo de Boas-Vindas
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Como Começar na <span className="text-emerald-400">Comerça</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              O seu guia passo a passo para comprar cursos, publicar produtos digitais ou lucrar com comissões de afiliados na maior plataforma de comércio digital de Angola.
            </p>

            {/* Quick Auth Trigger Bar */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              {!isAuthenticated ? (
                <>
                  <button
                    id="getting-started-register-btn"
                    onClick={() => openAuthModal('register')}
                    className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4" />
                    Criar Conta Gratuita
                  </button>
                  <button
                    id="getting-started-login-btn"
                    onClick={() => openAuthModal('login')}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-bold rounded-xl border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" />
                    Já Tenho Conta (Entrar)
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/15">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-emerald-400"
                  />
                  <div className="text-xs">
                    <span className="text-slate-300">Conectado como:</span>{' '}
                    <strong className="text-white">{user.name}</strong>
                  </div>
                  <button
                    onClick={() => openAuthModal('login')}
                    className="text-[11px] text-emerald-400 hover:underline font-bold ml-2 cursor-pointer"
                  >
                    Trocar Conta
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Onboarding Checklist for Users */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                Checklist de Primeiros Passos
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Complete estas tarefas para dominar todas as ferramentas da plataforma.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full">
              {Object.values(completedSteps).filter(Boolean).length} de 5 concluídos
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            {[
              { id: 'account_created', title: '1. Criar e verificar conta', desc: 'Registo gratuito com telemóvel e email' },
              { id: 'role_chosen', title: '2. Escolher a sua modalidade', desc: 'Produtor, Afiliado ou Aluno' },
              { id: 'bank_configured', title: '3. Cadastrar conta bancária', desc: 'IBAN AO06 para recebimento de levantamentos' },
              { id: 'product_or_course', title: '4. Publicar ou escolher produto', desc: 'Cursos, Ebooks ou Programas de Afiliados' },
              { id: 'test_checkout', title: '5. Testar checkout Express', desc: 'Simulação de pagamento Multicaixa' },
            ].map((step) => {
              const isDone = !!completedSteps[step.id];
              return (
                <button
                  key={step.id}
                  onClick={() => toggleStep(step.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                    isDone
                      ? 'border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-950/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className={`text-xs font-bold ${isDone ? 'text-emerald-800 dark:text-emerald-300' : 'text-slate-800 dark:text-slate-200'}`}>
                      {step.title}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {step.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Navigation for Personas */}
        <div className="flex border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => {
              setActiveTab('buyer');
              setCurrentRole('buyer');
            }}
            className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'buyer'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-900 rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Guia do Aluno & Comprador</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('creator');
              setCurrentRole('creator');
            }}
            className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'creator'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-900 rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Guia do Produtor de Conteúdo</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('affiliate');
              setCurrentRole('affiliate');
            }}
            className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'affiliate'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-900 rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>Guia do Afiliado Digital</span>
          </button>
        </div>

        {/* 1. GUIA DO ALUNO & COMPRADOR */}
        {activeTab === 'buyer' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Steps Container */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-emerald-500" />
                  Jornada do Aluno: Como Aprender e Ter Sucesso
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Siga estes 3 passos simples para adquirir conteúdos de alta qualidade e assistir às aulas.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Step 1 */}
                <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="w-8 h-8 rounded-lg bg-emerald-500 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                      1
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      Explorar o Marketplace
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Navegue por centenas de cursos, ebooks e mentorias de programação, marketing, finanças e design criados pelos melhores especialistas de Angola.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('marketplace')}
                    className="mt-4 w-full py-2 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Ver Marketplace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Step 2 */}
                <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="w-8 h-8 rounded-lg bg-emerald-500 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                      2
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      Pagar com Multicaixa Express
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Selecione Multicaixa Express e insira o seu número de telemóvel. Autorize com o PIN no seu telefone e a aprovação é concluída em 15 segundos.
                    </p>
                  </div>
                  <button
                    onClick={() => openCheckout('prod_python_01')}
                    className="mt-4 w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Testar Checkout</span>
                    <Smartphone className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Step 3 */}
                <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="w-8 h-8 rounded-lg bg-emerald-500 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                      3
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      Aceder à Área de Membros
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Assista às aulas em vídeo no reprodutor integrado, marque módulos concluídos, descarregue anexos e emita o seu Certificado Digital de Conclusão.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('buyer_library')}
                    className="mt-4 w-full py-2 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Minha Área de Cursos</span>
                    <Video className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Buyer FAQs */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-emerald-500" />
                Dúvidas Frequentes dos Compradores
              </h3>

              <div className="space-y-3">
                {buyerFaqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                      className="w-full px-4 py-3.5 text-left font-semibold text-xs sm:text-sm text-slate-800 dark:text-white flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      {openFaqIndex === idx ? (
                        <ChevronUp className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </button>
                    {openFaqIndex === idx && (
                      <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50/50 dark:bg-slate-800/30">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. GUIA DO PRODUTOR DE CONTEÚDO */}
        {activeTab === 'creator' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-emerald-500" />
                  Jornada do Produtor: Como Vender Produtos Digitais
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Passo a passo para transformar o seu conhecimento num negócio altamente rentável em Angola e além-fronteiras.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Step 1 */}
                <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="w-8 h-8 rounded-lg bg-emerald-500 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                      1
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      Cadastrar o seu Produto
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Crie cursos com módulos e aulas em vídeo, ebooks em PDF ou mentorias. Defina títulos persuasivos, capas profissionais e preços em Kwanza (AOA), Dólar (USD), Euro ou Real.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('products')}
                    className="mt-4 w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Criar Meu Produto</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Step 2 */}
                <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="w-8 h-8 rounded-lg bg-emerald-500 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                      2
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      Configurar Conta Bancária (IBAN)
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Cadastre a sua conta nos bancos BAI, BFA, Millennium Atlântico, BIC, SOL ou Standard Bank. Insira o seu NIF e BI para receber transferências automáticas.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('carteira')}
                    className="mt-4 w-full py-2 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Configurar Carteira</span>
                    <Building className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Step 3 */}
                <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="w-8 h-8 rounded-lg bg-emerald-500 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                      3
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      Partilhar Links & Vender
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Copie o link de checkout rápido e envie diretamente aos seus contactos no WhatsApp, redes sociais ou ative afiliados para venderem por si.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('links_checkout')}
                    className="mt-4 w-full py-2 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Links de Pagamento</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Creator FAQs */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-emerald-500" />
                Dúvidas Frequentes dos Produtores
              </h3>

              <div className="space-y-3">
                {creatorFaqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                      className="w-full px-4 py-3.5 text-left font-semibold text-xs sm:text-sm text-slate-800 dark:text-white flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      {openFaqIndex === idx ? (
                        <ChevronUp className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </button>
                    {openFaqIndex === idx && (
                      <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50/50 dark:bg-slate-800/30">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. GUIA DO AFILIADO DIGITAL */}
        {activeTab === 'affiliate' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-emerald-500" />
                  Jornada do Afiliado: Como Ganhar Comissões Diárias
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Recomende cursos e produtos de terceiros e receba comissões automáticas diretamente na sua carteira.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Step 1 */}
                <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="w-8 h-8 rounded-lg bg-emerald-500 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                      1
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      Escolher Produtos Vencedores
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Aceda ao marketplace e filtre por produtos com afiliação ativa e comissões atrativas (de 25% a 50% por cada venda aprovada).
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('marketplace')}
                    className="mt-4 w-full py-2 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Ver Marketplace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Step 2 */}
                <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="w-8 h-8 rounded-lg bg-emerald-500 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                      2
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      Gerar Link de Afiliado Exclusivo
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Com um único clique, o sistema gera o seu código de referência. Todas as pessoas que comprarem através do seu link gerarão comissões automáticas para si.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('afiliados')}
                    className="mt-4 w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Painel de Afiliados</span>
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Step 3 */}
                <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="w-8 h-8 rounded-lg bg-emerald-500 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                      3
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      Acompanhar & Levantar Ganhos
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Visualize cliques, taxa de conversão e comissões acumuladas em tempo real. Solicite o levantamento bancário para o seu banco em Angola.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('carteira')}
                    className="mt-4 w-full py-2 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Aceder à Carteira</span>
                    <DollarSign className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Affiliate FAQs */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-emerald-500" />
                Dúvidas Frequentes dos Afiliados
              </h3>

              <div className="space-y-3">
                {affiliateFaqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                      className="w-full px-4 py-3.5 text-left font-semibold text-xs sm:text-sm text-slate-800 dark:text-white flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      {openFaqIndex === idx ? (
                        <ChevronUp className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </button>
                    {openFaqIndex === idx && (
                      <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50/50 dark:bg-slate-800/30">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
