import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  PlayCircle,
  Download,
  BookOpen,
  Calendar,
  Sparkles,
  ExternalLink,
  Award,
} from 'lucide-react';

export const BuyerLibrary: React.FC = () => {
  const { products, navigate, user } = useApp();

  // Show user's acquired courses/products
  const myPurchases = products.slice(0, 4);

  return (
    <div className="flex-1 bg-[#f8fafc] dark:bg-slate-950 p-6 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Minha Área de Membros & Conteúdos
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Aceda aos seus cursos adquiridos, ebooks descarregáveis e mentorias.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {myPurchases.map((item, idx) => {
            const progress = idx === 0 ? 80 : idx === 1 ? 40 : 100;

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      {item.type === 'course'
                        ? 'Curso Online'
                        : item.type === 'ebook'
                        ? 'Ebook'
                        : 'Mentoria'}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Por {item.creatorName}</p>

                    {item.type === 'course' && (
                      <div className="mt-4">
                        <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                          <span>Progresso</span>
                          <span className="text-emerald-600 dark:text-emerald-400">
                            {progress}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${progress}%` }}
                            className="bg-emerald-500 h-full rounded-full"
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5 pt-0">
                  {item.type === 'course' ? (
                    <button
                      onClick={() => navigate('course_player', item.id)}
                      className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <PlayCircle className="w-4 h-4" />
                      Continuar Curso
                    </button>
                  ) : item.type === 'ebook' ? (
                    <button
                      onClick={() => alert('Download do Ebook em formato PDF iniciado!')}
                      className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      Descarregar Ebook (PDF)
                    </button>
                  ) : (
                    <button
                      onClick={() => alert('Sessão agendada com o mentor!')}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Calendar className="w-4 h-4" />
                      Aceder ao Link da Mentoria
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
