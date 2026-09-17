import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  X,
  Smartphone,
  CreditCard,
  Package,
  TrendingUp,
  DollarSign,
  Building2,
  Users,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';

interface FirstDayTutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirstDayTutorialModal: React.FC<FirstDayTutorialModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { navigate, setCheckoutModalOpen, setCheckoutProduct } = useApp();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const steps = [
    {
      title: 'Bem-vindo à Comerça!',
      subtitle: 'A plataforma de comércio digital de Angola para o mundo',
      badge: 'Passo 1 de 6 • Boas-vindas',
      icon: Sparkles,
      iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      description:
        'A Comerça foi criada especialmente para que produtores de conteúdo, professores, autores e afiliados possam vender infoprodutos com facilidade em Angola e internacionalmente.',
      highlights: [
        'Venda cursos com aulas em vídeo, ebooks em PDF, mentorias e ficheiros digitais',
        'Receba pagamentos locais em Kwanzas (Multicaixa Express) e internacionais',
        'Área de membros automática e segura para entrega imediata aos alunos',
      ],
      action: {
        text: 'Começar Tour',
        onClick: () => setCurrentStep(1),
      },
    },
    {
      title: 'Escolha o seu Objetivo Principal',
      subtitle: 'A Comerça adapta-se ao que precisa hoje',
      badge: 'Passo 2 de 6 • Perfil & Papel',
      icon: Users,
      iconBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      description:
        'Pode atuar em uma ou várias frentes com a mesma conta gratuita:',
      cards: [
        {
          role: 'Produtor de Conteúdo',
          desc: 'Cadastre cursos e ebooks, defina os preços e receba 100% das vendas deduzidas apenas da taxa de 10%.',
          color: 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30',
        },
        {
          role: 'Afiliado Digital',
          desc: 'Escolha produtos prontos no Marketplace, gere o seu link de afiliação e ganhe de 30% a 60% de comissão por venda.',
          color: 'border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/30',
        },
        {
          role: 'Aluno / Comprador',
          desc: 'Compre com segurança em segundos e aceda aos seus cursos e downloads na biblioteca pessoal.',
          color: 'border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/30',
        },
      ],
      action: {
        text: 'Avançar para Moedas',
        onClick: () => setCurrentStep(2),
      },
    },
    {
      title: '4 Moedas para Faturar Globalmente',
      subtitle: 'Kwanza (AOA), Dólar (USD), Euro (EUR) e Real (BRL)',
      badge: 'Passo 3 de 6 • Moedas Globais',
      icon: DollarSign,
      iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
      description:
        'O seu público não está limitado a Luanda ou Angola. Com o suporte multimoeda:',
      highlights: [
        'Kwanza (Kz / AOA): Moeda nativa para vendas em Angola com Multicaixa Express.',
        'Dólar Americano ($ / USD): Venda para clientes nos Estados Unidos e globalmente via cartão de crédito.',
        'Euro (€ / EUR): Ideal para a comunidade de compradores em Portugal e Europa.',
        'Real (R$ / BRL): Conecte-se com clientes e afiliados no Brasil.',
      ],
      note: 'Use a pílula de moedas no topo da página [Kz | $ | € | R$] para converter os preços e saldos a qualquer momento!',
      action: {
        text: 'Ver Produtos & Afiliações',
        onClick: () => setCurrentStep(3),
      },
    },
    {
      title: 'Produtos & Links de Divulgação',
      subtitle: 'Como colocar a sua oferta no ar em minutos',
      badge: 'Passo 4 de 6 • Catálogo & Links',
      icon: Package,
      iconBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
      description:
        'Criar e divulgar produtos na Comerça é intuitivo e não exige conhecimentos técnicos:',
      highlights: [
        'Aceda a "Produtos" e clique em "Novo Produto" para cadastrar módulos e aulas.',
        'Defina preço promocional, imagem atrativa e garanta suporte contra pirataria.',
        'Ative o programa de afiliados para que outras pessoas vendam por si!',
        'No Marketplace, afiliados clicam em "Afiliar-se" e obtêm links com cookies de 60 dias.',
      ],
      action: {
        text: 'Entender o Checkout',
        onClick: () => setCurrentStep(4),
      },
    },
    {
      title: 'Checkout & Pagamento Multicaixa Express',
      subtitle: 'Aprovação em 15 segundos direto no telemóvel',
      badge: 'Passo 5 de 6 • Pagamento Local',
      icon: Smartphone,
      iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      description:
        'O maior diferencial da Comerça em Angola é a experiência fluida de compra:',
      highlights: [
        'O cliente insere o número de telefone no checkout limpo e rápido.',
        'Recebe um alerta instantâneo no telemóvel para digitar o PIN do Multicaixa Express.',
        'Assim que confirma, o acesso é liberado instantaneamente!',
        'Também disponível: Referência Multicaixa (ATM/Online) e Cartões Visa/Mastercard.',
      ],
      action: {
        text: 'Ver Carteira & Levantamentos',
        onClick: () => setCurrentStep(5),
      },
    },
    {
      title: 'Carteira & Levantamento Bancário',
      subtitle: 'Transfira os seus lucros para a sua conta em Angola',
      badge: 'Passo 6 de 6 • Recebimento',
      icon: Building2,
      iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      description:
        'Receber o seu dinheiro é garantido, simples e transparente:',
      highlights: [
        'Taxa fixa de apenas 500 Kz por transferência bancária, independentemente do montante.',
        'Mínimo de levantamento: 10.000 Kz (ou $15).',
        'Compatível com todos os bancos angolanos com IBAN (AO06): BAI, BFA, Atlântico, BIC, Sol, etc.',
        'Acompanhe o saldo disponível e valores pendentes em tempo real.',
      ],
      action: {
        text: 'Concluir Tutorial do 1º Dia 🎉',
        onClick: () => handleCompleteTutorial(),
      },
    },
  ];

  const handleCompleteTutorial = () => {
    try {
      localStorage.setItem('comerca_tutorial_completed', 'true');
      localStorage.setItem('comerca_first_day_tour_done', 'true');
    } catch {
      // ignore
    }

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    onClose();
  };

  const step = steps[currentStep];
  const IconComponent = step.icon;

  return (
    <div
      id="first-day-tutorial-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              Tutorial do 1º Dia
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {currentStep + 1} de {steps.length}
            </span>
          </div>

          <button
            id="close-tutorial-modal-btn"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5">
          <div
            className="bg-emerald-500 h-1.5 transition-all duration-300 ease-out"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl shrink-0 ${step.iconBg}`}>
              <IconComponent className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {step.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                {step.subtitle}
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {step.description}
          </p>

          {/* Highlights */}
          {step.highlights && (
            <div className="space-y-2.5 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              {step.highlights.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          )}

          {/* Cards for Role Step */}
          {step.cards && (
            <div className="space-y-2">
              {step.cards.map((c, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl border text-xs leading-relaxed ${c.color}`}
                >
                  <p className="font-bold text-slate-900 dark:text-white">
                    {c.role}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                    {c.desc}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Note */}
          {step.note && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs text-amber-800 dark:text-amber-300">
              💡 {step.note}
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 flex items-center justify-between gap-3">
          <button
            id="prev-tutorial-step-btn"
            disabled={currentStep === 0}
            onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
              currentStep === 0
                ? 'opacity-40 cursor-not-allowed text-slate-400'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Anterior
          </button>

          <div className="flex items-center gap-2">
            <button
              id="skip-tutorial-btn"
              onClick={handleCompleteTutorial}
              className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 px-3 py-2"
            >
              Pular
            </button>

            <button
              id="next-tutorial-step-btn"
              onClick={step.action.onClick}
              className="px-4 py-2 text-xs sm:text-sm font-bold rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs hover:shadow-md transition-all flex items-center gap-1.5"
            >
              {step.action.text}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
