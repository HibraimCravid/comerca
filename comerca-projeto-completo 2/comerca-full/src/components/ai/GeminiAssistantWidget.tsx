import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Bot,
  Send,
  X,
  Minimize2,
  Maximize2,
  ChevronRight,
  CheckCircle2,
  Circle,
  HelpCircle,
  TrendingUp,
  Compass,
  ArrowRight,
  RotateCcw,
  BookOpen,
  DollarSign,
  Smartphone,
  Check,
  Flame,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  actionButton?: {
    label: string;
    view: string;
  };
}

interface GeminiAssistantWidgetProps {
  onOpenTutorial: () => void;
}

export const GeminiAssistantWidget: React.FC<GeminiAssistantWidgetProps> = ({
  onOpenTutorial,
}) => {
  const { currentRole, currentView, navigate } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'roadmap' | 'tutorial'>('chat');
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasPromptedTour, setHasPromptedTour] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 0% to 100% Roadmap checklist items
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('comerca_roadmap_progress');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      step_account: true, // Account is active
      step_role: true,
      step_currency: false,
      step_bank: false,
      step_product: false,
      step_checkout: false,
      step_sale: false,
      step_withdraw: false,
    };
  });

  const toggleStep = (key: string) => {
    setCompletedSteps((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem('comerca_roadmap_progress', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const totalStepsCount = 8;
  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const completionPercentage = Math.round((completedCount / totalStepsCount) * 100);

  // Initial messages
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `👋 Olá! Sou o **Assistente Gemini da Comerça**!

Estou aqui para te acompanhar em toda a jornada — do **0% até ao 100%** de maestria na plataforma.

✨ **O que posso fazer por ti hoje:**
- Explicar passo a passo como funciona a Comerça
- Ensinar a cadastrar produtos, vender cursos e ebooks
- Mostrar como receber pagamentos rápidos via **Multicaixa Express (15 segundos)** e Cartão em **Dólar ($)**, **Kwanza (Kz)**, **Euro (€)** ou **Real (R$)**
- Ajudar no teu **Tutorial do Primeiro Dia**

Clica numa das perguntas rápidas abaixo ou escreve qualquer dúvida!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // First-day tour prompt bubble
  useEffect(() => {
    try {
      const tourDone = localStorage.getItem('comerca_first_day_tour_done');
      if (!tourDone && !hasPromptedTour) {
        setHasPromptedTour(true);
      }
    } catch {
      // ignore
    }
  }, [hasPromptedTour]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (isOpen && activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, activeTab]);

  const quickQuestions = [
    'Como funciona a Comerça do 0% ao 100%?',
    'Como funciona o pagamento por Multicaixa Express?',
    'Como vender em Dólares ($) e Kwanzas (Kz)?',
    'Como ser afiliado e ganhar comissões?',
    'Quais são as taxas e prazos de levantamento?',
    'O que fazer no meu primeiro dia?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    // Determine relevant action button based on user question
    let suggestedAction: { label: string; view: string } | undefined;
    const lower = text.toLowerCase();
    if (lower.includes('produto') || lower.includes('curso') || lower.includes('ebook')) {
      suggestedAction = { label: 'Ir para Produtos', view: 'products' };
    } else if (lower.includes('afiliad') || lower.includes('comiss')) {
      suggestedAction = { label: 'Ver Marketplace de Afiliados', view: 'marketplace' };
    } else if (lower.includes('levant') || lower.includes('carteira') || lower.includes('saldo') || lower.includes('banco')) {
      suggestedAction = { label: 'Abrir Carteira', view: 'carteira' };
    } else if (lower.includes('venda') || lower.includes('pagamento') || lower.includes('multicaixa')) {
      suggestedAction = { label: 'Ver Histórico de Vendas', view: 'vendas' };
    } else if (lower.includes('comecar') || lower.includes('começar') || lower.includes('guia')) {
      suggestedAction = { label: 'Ver Guia Completo', view: 'getting_started' };
    }

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          userRole: currentRole,
          history: messages.slice(-4).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) {
        throw new Error('Falha na resposta do servidor');
      }

      const data = await res.json();
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Desculpe, não consegui processar a resposta agora. Pode tentar novamente?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionButton: suggestedAction,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Error fetching Gemini AI reply:', err);
      // Fallback message
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: `A Comerça permite vender produtos digitais e receber em Kwanzas (Multicaixa Express), Dólares, Euros ou Reais com taxa de apenas 10%.

Precisa de ajuda com o roteiro do 0% ao 100% ou prefere iniciar o Tutorial do 1º Dia?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionButton: { label: 'Ver Guia de Primeiros Passos', view: 'getting_started' },
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Simple and safe text formatting for markdown-like syntax
  const renderFormattedContent = (content: string) => {
    return content.split('\n').map((line, idx) => {
      // Empty lines
      if (!line.trim()) {
        return <div key={idx} className="h-2" />;
      }

      // Check if line is bullet
      const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ');
      const cleanLine = isBullet ? line.trim().substring(2) : line;

      // Parse bold **text**
      const parts = cleanLine.split(/(\*\*.*?\*\*)/g);

      const parsedLine = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="font-bold text-slate-900 dark:text-white">
              {part.substring(2, part.length - 2)}
            </strong>
          );
        }
        return part;
      });

      if (isBullet) {
        return (
          <div key={idx} className="flex items-start gap-2 my-0.5 pl-1">
            <span className="text-emerald-500 font-bold shrink-0">•</span>
            <span className="text-slate-700 dark:text-slate-200">{parsedLine}</span>
          </div>
        );
      }

      return (
        <p key={idx} className="my-0.5 text-slate-700 dark:text-slate-200">
          {parsedLine}
        </p>
      );
    });
  };

  const roadmapPhases = [
    {
      percentage: '0% a 20%',
      title: 'Fase 1: Entrada & Perfil',
      description: 'Crie a sua conta gratuita e escolha o seu papel inicial.',
      steps: [
        { id: 'step_account', label: 'Conta criada com sucesso na Comerça' },
        { id: 'step_role', label: 'Definir objetivo (Produtor, Afiliado ou Aluno)' },
      ],
    },
    {
      percentage: '21% a 40%',
      title: 'Fase 2: Moedas & Dados Bancários',
      description: 'Configure a sua carteira para receber pagamentos locais e internacionais.',
      steps: [
        { id: 'step_currency', label: 'Definir moedas ativas (Kwanza, Dólar, Euro, Real)' },
        { id: 'step_bank', label: 'Cadastrar IBAN angolano (AO06) verificado' },
      ],
    },
    {
      percentage: '41% a 60%',
      title: 'Fase 3: Produtos & Afiliação',
      description: 'Cadastre o seu primeiro infoproduto ou afilie-se a produtos com alta conversão.',
      steps: [
        { id: 'step_product', label: 'Criar curso / ebook ou afiliar-se no Marketplace' },
      ],
    },
    {
      percentage: '61% a 80%',
      title: 'Fase 4: Divulgação & Checkout',
      description: 'Distribua o link exclusivo e processe pagamentos rápidos via Multicaixa Express.',
      steps: [
        { id: 'step_checkout', label: 'Testar e validar link de checkout transparente' },
        { id: 'step_sale', label: 'Realizar a 1ª venda com notificação instantânea' },
      ],
    },
    {
      percentage: '81% a 100%',
      title: 'Fase 5: Escala & Levantamento dos Lucros',
      description: 'Acompanhe as métricas por província e levante o saldo para o seu banco.',
      steps: [
        { id: 'step_withdraw', label: 'Solicitar levantamento bancário para a sua conta' },
      ],
    },
  ];

  return (
    <>
      {/* Floating Action Badge in Bottom-Right */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {/* Floating Bubble Hint for first-time visitors */}
        {!isOpen && hasPromptedTour && (
          <div className="mb-3 animate-bounce">
            <div className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white px-3.5 py-2 rounded-xl shadow-lg border border-emerald-500/30 flex items-center gap-2 text-xs font-medium max-w-xs">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Precisa de ajuda? Fale com o <strong>Gemini IA</strong> ou inicie o <strong>Tutorial do 1º Dia</strong>!</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setHasPromptedTour(false);
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 ml-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Floating Button */}
        {!isOpen && (
          <button
            id="open-gemini-ai-widget-btn"
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
              setHasPromptedTour(false);
            }}
            className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-linear-to-r from-emerald-600 via-teal-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-semibold text-sm shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 cursor-pointer border border-white/20"
          >
            <div className="relative">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-300"></span>
              </span>
            </div>
            <div className="flex flex-col text-left">
              <span className="leading-tight text-xs font-bold text-white flex items-center gap-1">
                Gemini IA Comerça
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 text-white font-mono">
                  {completionPercentage}%
                </span>
              </span>
              <span className="text-[11px] text-emerald-100 font-normal">
                Como usar do 0% ao 100%
              </span>
            </div>
          </button>
        )}
      </div>

      {/* Floating Chat & Roadmap Window */}
      {isOpen && (
        <div
          id="gemini-assistant-window"
          className={`fixed bottom-6 right-6 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl transition-all duration-300 flex flex-col overflow-hidden ${
            isMinimized
              ? 'w-80 h-16'
              : 'w-[92vw] sm:w-[440px] h-[580px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="px-4 py-3.5 bg-linear-to-r from-slate-900 via-slate-800 to-emerald-950 text-white flex items-center justify-between shrink-0 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-emerald-500 to-teal-400 p-1 flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-white leading-none">
                    Gemini IA • Comerça
                  </h3>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Online
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Guia do 0% ao 100% & Suporte
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                id="toggle-minimize-gemini-widget"
                onClick={() => setIsMinimized((prev) => !prev)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                title={isMinimized ? 'Expandir' : 'Minimizar'}
              >
                {isMinimized ? (
                  <Maximize2 className="w-4 h-4" />
                ) : (
                  <Minimize2 className="w-4 h-4" />
                )}
              </button>
              <button
                id="close-gemini-widget"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                title="Fechar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Navigation Tabs */}
              <div className="flex items-center border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 px-3 py-1.5 gap-1 shrink-0">
                <button
                  id="tab-chat-btn"
                  onClick={() => setActiveTab('chat')}
                  className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                    activeTab === 'chat'
                      ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Bot className="w-3.5 h-3.5" />
                  Chat IA
                </button>

                <button
                  id="tab-roadmap-btn"
                  onClick={() => setActiveTab('roadmap')}
                  className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors relative ${
                    activeTab === 'roadmap'
                      ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  0% a 100%
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                    {completionPercentage}%
                  </span>
                </button>

                <button
                  id="tab-tutorial-btn"
                  onClick={() => {
                    onOpenTutorial();
                  }}
                  className="py-1.5 px-2.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                  title="Abrir Tutorial do 1º Dia"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  1º Dia
                </button>
              </div>

              {/* Main Content Area */}
              {activeTab === 'chat' && (
                <div className="flex-1 flex flex-col min-h-0 bg-slate-50/50 dark:bg-slate-900/40">
                  {/* Messages Scroll Area */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
                    {messages.map((m) => (
                      <div
                        key={m.id}
                        className={`flex gap-2.5 ${
                          m.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {m.role === 'assistant' && (
                          <div className="w-6 h-6 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                            <Sparkles className="w-3.5 h-3.5" />
                          </div>
                        )}

                        <div
                          className={`max-w-[85%] rounded-2xl p-3 shadow-xs leading-relaxed ${
                            m.role === 'user'
                              ? 'bg-emerald-500 text-white rounded-br-xs'
                              : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-bl-xs'
                          }`}
                        >
                          {m.role === 'assistant' ? (
                            <div className="space-y-1">
                              {renderFormattedContent(m.content)}
                            </div>
                          ) : (
                            <p className="whitespace-pre-wrap">{m.content}</p>
                          )}

                          {/* Quick Action Button if provided */}
                          {m.actionButton && (
                            <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700">
                              <button
                                onClick={() => {
                                  navigate(m.actionButton!.view);
                                  setIsOpen(false);
                                }}
                                className="w-full py-1.5 px-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                              >
                                {m.actionButton.label}
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}

                          <div
                            className={`text-[10px] mt-1 text-right ${
                              m.role === 'user'
                                ? 'text-emerald-100'
                                : 'text-slate-400 dark:text-slate-500'
                            }`}
                          >
                            {m.timestamp}
                          </div>
                        </div>
                      </div>
                    ))}

                    {isLoading && (
                      <div className="flex gap-2 items-center text-xs text-slate-500 dark:text-slate-400 pl-8">
                        <div className="flex gap-1">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" />
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                        <span>Gemini está a analisar e a responder...</span>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Quick Suggestion Chips */}
                  <div className="px-3 py-2 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
                    <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-wider">
                      Perguntas Frequentes:
                    </p>
                    <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                      {quickQuestions.map((q, idx) => (
                        <button
                          key={idx}
                          disabled={isLoading}
                          onClick={() => handleSendMessage(q)}
                          className="shrink-0 text-[11px] px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-emerald-600 dark:hover:text-emerald-300 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Input Form */}
                  <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSendMessage();
                      }}
                      className="flex items-center gap-2"
                    >
                      <input
                        id="gemini-chat-input"
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Pergunte sobre como funciona a Comerça..."
                        className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                      />
                      <button
                        id="gemini-send-btn"
                        type="submit"
                        disabled={!inputMessage.trim() || isLoading}
                        className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white transition-colors shrink-0 shadow-xs cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* Roadmap Tab (0% to 100%) */}
              {activeTab === 'roadmap' && (
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-900/40 text-xs">
                  {/* Progress Header Card */}
                  <div className="p-3.5 rounded-xl bg-linear-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                        O seu Progresso de Maestria
                      </span>
                      <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                        {completionPercentage}%
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-2 transition-all duration-300 rounded-full"
                        style={{ width: `${completionPercentage}%` }}
                      />
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-2">
                      Complete as 5 fases para dominar a venda de infoprodutos e faturar em Angola e no mundo.
                    </p>
                  </div>

                  {/* Phases List */}
                  <div className="space-y-3">
                    {roadmapPhases.map((phase, pIdx) => (
                      <div
                        key={pIdx}
                        className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-slate-900 dark:text-white">
                            {phase.title}
                          </h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                            {phase.percentage}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {phase.description}
                        </p>

                        <div className="mt-2.5 space-y-1.5">
                          {phase.steps.map((st) => {
                            const isChecked = !!completedSteps[st.id];
                            return (
                              <button
                                key={st.id}
                                onClick={() => toggleStep(st.id)}
                                className="w-full flex items-center gap-2 text-left p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                              >
                                {isChecked ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                ) : (
                                  <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                                )}
                                <span
                                  className={`${
                                    isChecked
                                      ? 'line-through text-slate-400 dark:text-slate-500'
                                      : 'text-slate-700 dark:text-slate-300'
                                  }`}
                                >
                                  {st.label}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Ask Gemini Button */}
                  <button
                    onClick={() => {
                      setActiveTab('chat');
                      handleSendMessage('O que devo fazer para avançar do meu nível atual de progresso?');
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    <Sparkles className="w-4 h-4" />
                    Perguntar ao Gemini como avançar no Roteiro
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};
