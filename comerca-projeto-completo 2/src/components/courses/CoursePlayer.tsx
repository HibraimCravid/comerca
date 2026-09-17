import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  PlayCircle,
  CheckCircle2,
  Download,
  MessageSquare,
  Award,
  ChevronLeft,
  ChevronRight,
  FileText,
  Clock,
  Sparkles,
  Send,
  Star,
  Share2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CoursePlayer: React.FC = () => {
  const { products, activeCourseId, navigate, user } = useApp();

  // Find course or fallback to first course product
  const course =
    products.find((p) => p.id === activeCourseId && p.type === 'course') ||
    products.find((p) => p.type === 'course') ||
    products[0];

  const modules = course.modules || [
    {
      id: 'm1',
      title: 'Módulo 1: Fundamentos & Mentalidade',
      lessons: [
        {
          id: 'l1',
          title: 'Aula 1: Bem-vindo à Formação e Visão Geral',
          durationMinutes: 12,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          description: 'Nesta primeira aula vamos conhecer a estrutura da formação e os passos para o sucesso.',
          completed: true,
        },
        {
          id: 'l2',
          title: 'Aula 2: Configuração de Ferramentas em Angola',
          durationMinutes: 24,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          description: 'Como configurar pagamentos Multicaixa, bancos parceiros e contas para receber.',
          completed: false,
        },
      ],
    },
    {
      id: 'm2',
      title: 'Módulo 2: Criação de Ofertas de Alto Valor',
      lessons: [
        {
          id: 'l3',
          title: 'Aula 3: Estruturação do Produto Digital',
          durationMinutes: 30,
          description: 'Definição de preço, bónus e garantia incondicional.',
          completed: false,
        },
        {
          id: 'l4',
          title: 'Aula 4: Técnicas de Copywriting e Tráfego',
          durationMinutes: 28,
          description: 'Como atrair clientes qualificados no WhatsApp e Instagram.',
          completed: false,
        },
      ],
    },
  ];

  // Course state
  const [activeLessonId, setActiveLessonId] = useState(modules[0]?.lessons[0]?.id || 'l1');
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(['l1']);
  const [comments, setComments] = useState([
    {
      id: 'c1',
      name: 'Manuel Fernandes',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      time: 'Há 2 dias',
      text: 'Excelente explicação! Consegui configurar a minha conta BAI em menos de 10 minutos.',
    },
    {
      id: 'c2',
      name: 'Carla Silva',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      time: 'Ontem',
      text: 'O material complementar em PDF está espetacular. Muito obrigada professor!',
    },
  ]);
  const [newComment, setNewComment] = useState('');
  const [showCertificate, setShowCertificate] = useState(false);

  // Flattened lessons for next/prev
  const allLessons = modules.flatMap((m) => m.lessons);
  const currentLessonIndex = allLessons.findIndex((l) => l.id === activeLessonId);
  const currentLesson = allLessons[currentLessonIndex] || allLessons[0];

  const totalLessons = allLessons.length;
  const completedCount = completedLessonIds.length;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

  const toggleLessonComplete = (id: string) => {
    if (completedLessonIds.includes(id)) {
      setCompletedLessonIds(completedLessonIds.filter((item) => item !== id));
    } else {
      const updated = [...completedLessonIds, id];
      setCompletedLessonIds(updated);

      if (updated.length === totalLessons) {
        // Trigger certificate & celebration!
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.5 },
        });
        setShowCertificate(true);
      }
    }
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setComments([
      {
        id: `c_${Date.now()}`,
        name: user.name,
        avatar: user.avatar,
        time: 'Agora mesmo',
        text: newComment.trim(),
      },
      ...comments,
    ]);
    setNewComment('');
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0b1120] text-slate-100 min-h-screen">
      {/* Top Course Nav */}
      <header className="h-16 bg-[#0f172a] border-b border-slate-800 px-6 flex items-center justify-between sticky top-16 z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('buyer_library')}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            title="Voltar à Minha Biblioteca"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
              Área de Membros • Formação Activa
            </span>
            <h2 className="text-sm sm:text-base font-bold text-white truncate max-w-md">
              {course.title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Progress bar */}
          <div className="hidden sm:flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-300">
              Progresso: {progressPercent}%
            </span>
            <div className="w-32 bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
              <div
                style={{ width: `${progressPercent}%` }}
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
              ></div>
            </div>
          </div>

          {progressPercent === 100 && (
            <button
              onClick={() => setShowCertificate(true)}
              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5 animate-bounce"
            >
              <Award className="w-4 h-4" />
              Ver Certificado
            </button>
          )}
        </div>
      </header>

      {/* Main Player + Sidebar Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Video Player & Content (70%) */}
        <div className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-8">
          {/* Video Box */}
          <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center group">
            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3 border border-emerald-500/40 group-hover:scale-110 transition-transform">
                <PlayCircle className="w-10 h-10" />
              </div>
              <p className="text-base font-bold text-white">{currentLesson?.title}</p>
              <p className="text-xs text-slate-400 mt-1">
                Duração: {currentLesson?.durationMinutes} minutos • Vídeo em Alta Definição (1080p)
              </p>
            </div>

            {/* Video Controls bar simulation */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <button className="text-white hover:text-emerald-400 font-bold">
                  ▶ Reproduzir
                </button>
                <span>00:00 / {currentLesson?.durationMinutes}:00</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  1080p
                </span>
                <span>Áudio PT-AO</span>
              </div>
            </div>
          </div>

          {/* Lesson Action Controls */}
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <h1 className="text-xl font-bold text-white">{currentLesson?.title}</h1>
              <p className="text-xs text-slate-400 mt-1">
                Instrutor: {course.creatorName} • Atualizado recentemente
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleLessonComplete(currentLesson?.id || '')}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                  completedLessonIds.includes(currentLesson?.id || '')
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {completedLessonIds.includes(currentLesson?.id || '')
                    ? 'Aula Concluída'
                    : 'Marcar como Concluída'}
                </span>
              </button>
            </div>
          </div>

          {/* Description and Downloads */}
          <div className="mt-6 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-200 mb-2">Resumo da Aula</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {currentLesson?.description ||
                  'Nesta aula terá acesso aos métodos comprovados de estruturação de infoprodutos adaptados ao mercado de Angola.'}
              </p>
            </div>

            {/* Material de Apoio (Downloads) */}
            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-1.5">
                <Download className="w-4 h-4" />
                Ficheiros e Materiais Complementares
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href="#download"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Download do PDF complementar iniciado com sucesso!');
                  }}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700/60 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <div>
                      <p className="text-xs font-semibold text-white">Guia_Pratico_Infoprodutos.pdf</p>
                      <p className="text-[10px] text-slate-400">PDF • 4.2 MB</p>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-slate-400" />
                </a>

                <a
                  href="#download"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Download da Planilha Excel iniciado!');
                  }}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700/60 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-blue-400" />
                    <div>
                      <p className="text-xs font-semibold text-white">Planilha_Precificacao_AOA.xlsx</p>
                      <p className="text-[10px] text-slate-400">Excel • 1.1 MB</p>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-slate-400" />
                </a>
              </div>
            </div>

            {/* Comments & Discussion */}
            <div className="pt-6 border-t border-slate-800">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                Dúvidas & Discussão com o Instrutor ({comments.length})
              </h3>

              <form onSubmit={handlePostComment} className="mb-6 flex gap-3">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Tem alguma dúvida sobre esta aula? Escreva aqui..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Enviar
                </button>
              </form>

              <div className="space-y-3">
                {comments.map((cmt) => (
                  <div key={cmt.id} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <img
                        src={cmt.avatar}
                        alt={cmt.name}
                        className="w-6 h-6 rounded-full object-cover ring-1 ring-emerald-500/30"
                      />
                      <span className="text-xs font-bold text-slate-200">{cmt.name}</span>
                      <span className="text-[10px] text-slate-500">{cmt.time}</span>
                    </div>
                    <p className="text-xs text-slate-300 pl-8">{cmt.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Modules & Lessons Navigation Sidebar (30%) */}
        <div className="w-full lg:w-96 bg-[#0f172a] border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col h-auto lg:h-full">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-sm text-white">Conteúdo do Curso</h3>
            <span className="text-xs text-slate-400">
              {completedCount}/{totalLessons} Aulas
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {modules.map((mod, mIdx) => (
              <div key={mod.id} className="rounded-xl bg-slate-900/80 border border-slate-800 overflow-hidden">
                <div className="px-3.5 py-2.5 bg-slate-800/60 border-b border-slate-800">
                  <h4 className="text-xs font-bold text-slate-200">{mod.title}</h4>
                </div>

                <div className="divide-y divide-slate-800/60">
                  {mod.lessons.map((les) => {
                    const isCurrent = les.id === activeLessonId;
                    const isDone = completedLessonIds.includes(les.id);

                    return (
                      <button
                        key={les.id}
                        onClick={() => setActiveLessonId(les.id)}
                        className={`w-full p-3 text-left flex items-start gap-2.5 transition-colors cursor-pointer ${
                          isCurrent
                            ? 'bg-emerald-500/10 text-emerald-400 font-semibold'
                            : 'hover:bg-slate-800/70 text-slate-300'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <PlayCircle className="w-4 h-4 text-slate-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs leading-snug truncate">{les.title}</p>
                          <span className="text-[10px] text-slate-500 block mt-0.5">
                            {les.durationMinutes} min
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-2xl w-full max-w-2xl p-8 border-4 border-amber-400 shadow-2xl relative text-center">
            <button
              onClick={() => setShowCertificate(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 text-lg font-bold"
            >
              ✕
            </button>

            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4 border-2 border-amber-400">
              <Award className="w-10 h-10" />
            </div>

            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
              República de Angola • Plataforma Comerça
            </span>

            <h2 className="text-3xl font-serif font-bold text-slate-900 mt-2">
              Certificado de Conclusão
            </h2>

            <p className="text-sm text-slate-600 mt-4 max-w-lg mx-auto leading-relaxed">
              Certificamos que{' '}
              <span className="font-bold text-slate-900 underline text-base">
                {user.name}
              </span>{' '}
              concluiu com êxito todas as etapas e avaliações do curso digital:
            </p>

            <p className="text-lg font-bold text-emerald-700 mt-2">
              "{course.title}"
            </p>

            <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 px-6">
              <div>
                <p className="font-bold text-slate-800">{course.creatorName}</p>
                <p className="text-[11px]">Instrutor Responsável</p>
              </div>
              <div className="text-right">
                <p className="font-mono font-bold text-slate-800">
                  LUK-CERT-{Math.floor(100000 + Math.random() * 900000)}
                </p>
                <p className="text-[11px]">Autenticação Digital Verificada</p>
              </div>
            </div>

            <div className="mt-8 flex justify-center gap-3">
              <button
                onClick={() => alert('Download do Certificado em PDF de alta qualidade!')}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Descarregar PDF Oficial
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
