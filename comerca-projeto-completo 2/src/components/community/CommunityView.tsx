import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MessageSquare, ThumbsUp, Send, Sparkles, Share2, Award } from 'lucide-react';

export const CommunityView: React.FC = () => {
  const { user } = useApp();
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState([
    {
      id: 'p1',
      author: 'Carlos Domingos',
      role: 'Produtor Top 1%',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      time: 'Há 3 horas',
      content:
        'Acabei de bater a marca de 5.000.000 Kz em vendas este mês no meu curso de Finanças usando o checkout otimizado para Multicaixa Express! A taxa de aprovação em Angola melhorou drasticamente.',
      likes: 42,
      comments: 9,
    },
    {
      id: 'p2',
      author: 'Teresa Gonçalves',
      role: 'Super Afiliada',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      time: 'Ontem',
      content:
        'Dica para quem está a começar como afiliado: foquem-se em grupos de WhatsApp e conteúdos curtos no TikTok com o vosso link da Comerça. As comissões automáticas caem na carteira e o levantamento cai em menos de 12 horas no BAI!',
      likes: 67,
      comments: 18,
    },
  ]);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    setPosts([
      {
        id: `p_${Date.now()}`,
        author: user.name,
        role: 'Produtor Comerça',
        avatar: user.avatar,
        time: 'Agora mesmo',
        content: newPost.trim(),
        likes: 0,
        comments: 0,
      },
      ...posts,
    ]);
    setNewPost('');
  };

  const handleLike = (id: string) => {
    setPosts(
      posts.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p))
    );
  };

  return (
    <div className="flex-1 bg-[#f8fafc] dark:bg-slate-950 p-6 sm:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Comunidade de Produtores & Afiliados
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Partilhe estratégias de vendas, casos de sucesso e faça networking com a elite digital de Angola.
          </p>
        </div>

        {/* Post creation box */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
          <form onSubmit={handleCreatePost} className="space-y-3">
            <textarea
              rows={3}
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Partilhe um resultado, uma dica de tráfego ou faça uma pergunta à comunidade..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            ></textarea>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                Publicar no Feed
              </button>
            </div>
          </form>
        </div>

        {/* Posts Feed */}
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={post.avatar}
                  alt={post.author}
                  className="w-9 h-9 rounded-full object-cover ring-1 ring-emerald-500/30"
                />
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                    {post.author}
                  </h4>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                    {post.role} • {post.time}
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {post.content}
              </p>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-6 text-xs text-slate-500">
                <button
                  onClick={() => handleLike(post.id)}
                  className="flex items-center gap-1.5 hover:text-emerald-600 transition-colors"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{post.likes} gostos</span>
                </button>
                <div className="flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4" />
                  <span>{post.comments} comentários</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
