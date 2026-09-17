import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, AffiliateLink } from '../../types';
import { formatCurrency, convertCurrency } from '../../utils/currency';
import {
  ArrowRight,
  Sparkles,
  Star,
  Share2,
  Copy,
  Check,
  MessageCircle,
  X,
  Search,
} from 'lucide-react';

export const MarketplaceView: React.FC = () => {
  const {
    navigate,
    products,
    selectedCurrency,
    openCheckout,
    joinAffiliateProgram,
    affiliateLinks,
    activeAffiliateRefCode,
    clearActiveAffiliateRefCode,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [modalAffiliateProduct, setModalAffiliateProduct] = useState<Product | null>(null);
  const [modalAffiliateLink, setModalAffiliateLink] = useState<AffiliateLink | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const categories = [
    'Todos',
    'Programação',
    'Marketing',
    'Finanças',
    'Design',
    'Negócios',
    'Educação',
  ];

  const filteredProducts = products.filter((p) => {
    const matchesCat = activeCategory === 'Todos' || p.category === activeCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Page Header */}
      <section className="border-b border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Catálogo Completo
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
            Marketplace da Comerça
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Cursos práticos, ebooks e ferramentas criados pelos melhores infoprodutores.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Referral Active Banner */}
        {activeAffiliateRefCode && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                  Link de Indicação Ativo ({activeAffiliateRefCode})
                </p>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                  Você está a navegar com recomendação de um parceiro oficial. A comissão de afiliado será atribuída na sua compra.
                </p>
              </div>
            </div>
            <button
              onClick={clearActiveAffiliateRefCode}
              className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 underline cursor-pointer shrink-0 ml-3"
            >
              Remover
            </button>
          </div>
        )}

        {/* Search + Category Bar — sticky so it never scrolls away, only the list underneath moves */}
        <div className="sticky top-16 z-10 bg-[#f8fafc]/95 dark:bg-slate-950/95 backdrop-blur-md py-3 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 mb-2">
          <div className="relative mb-4">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar cursos, ebooks, mentorias..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-400 mb-4">
          {filteredProducts.length} {filteredProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
        </p>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-slate-400 text-sm">
            Nenhum produto encontrado para essa pesquisa.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const { convertedAmount } = convertCurrency(
                product.discountPrice || product.price,
                product.currency,
                selectedCurrency
              );

              return (
                <div
                  key={product.id}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
                >
                  {/* Product Image */}
                  <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                      {product.type === 'course'
                        ? 'Curso Online'
                        : product.type === 'ebook'
                        ? 'Ebook'
                        : product.type === 'digital_service'
                        ? 'Mentoria'
                        : 'Digital'}
                    </div>
                    {product.affiliateEnabled && (
                      <div className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                        {product.affiliateCommissionPercent}% comissão
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          {product.category}
                        </span>
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="font-bold text-slate-700 dark:text-slate-300">
                            {product.rating}
                          </span>
                          <span>({product.reviewsCount})</span>
                        </div>
                      </div>

                      <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug line-clamp-2">
                        {product.title}
                      </h3>

                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>

                      <div className="mt-3 flex items-center gap-2">
                        <img
                          src={product.creatorAvatar}
                          alt={product.creatorName}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="text-xs text-slate-600 dark:text-slate-300 font-medium truncate">
                          {product.creatorName}
                        </span>
                      </div>
                    </div>

                    {/* Pricing and Action */}
                    <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                          Preço
                        </span>
                        <span className="text-base font-extrabold text-slate-900 dark:text-white">
                          {formatCurrency(convertedAmount, selectedCurrency)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {product.affiliateEnabled && (() => {
                          const isAffiliated = affiliateLinks.some((a) => a.productId === product.id);
                          return (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const link = joinAffiliateProgram(product.id);
                                setModalAffiliateProduct(product);
                                setModalAffiliateLink(link);
                                const fullUrl = `${window.location.origin}/?ref=${link.code}`;
                                navigator.clipboard.writeText(fullUrl);
                                setCopiedCode(link.code);
                                setTimeout(() => setCopiedCode(null), 3000);
                              }}
                              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                                isAffiliated
                                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                                  : 'border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                              }`}
                              title={isAffiliated ? 'Ver link de afiliado gerado' : 'Tornar-se afiliado e receber comissão'}
                            >
                              {isAffiliated ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span>Afiliado</span>
                                </>
                              ) : (
                                <>
                                  <Share2 className="w-3 h-3 text-slate-500" />
                                  <span>Afiliar</span>
                                </>
                              )}
                            </button>
                          );
                        })()}
                        <button
                          id={`marketplace-buy-btn-${product.id}`}
                          onClick={() => openCheckout(product.id)}
                          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
                        >
                          Comprar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Affiliate Link Generation & Sharing Modal */}
      {modalAffiliateProduct && modalAffiliateLink && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Programa Oficial de Afiliados</h3>
                  <p className="text-[11px] text-slate-400">Link exclusivo para divulgar e faturar comissões</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setModalAffiliateProduct(null);
                  setModalAffiliateLink(null);
                }}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Product Snapshot */}
              <div className="flex gap-3.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <img
                  src={modalAffiliateProduct.imageUrl}
                  alt={modalAffiliateProduct.title}
                  className="w-16 h-16 rounded-lg object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                    {modalAffiliateProduct.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Produtor: {modalAffiliateProduct.creatorName}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {modalAffiliateProduct.affiliateCommissionPercent}% de comissão
                    </span>
                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                      Ganhe {formatCurrency(
                        Math.round(
                          ((modalAffiliateProduct.discountPrice || modalAffiliateProduct.price) *
                            modalAffiliateProduct.affiliateCommissionPercent) /
                            100
                        ),
                        modalAffiliateProduct.currency
                      )} por cada venda
                    </span>
                  </div>
                </div>
              </div>

              {/* Affiliate Link Input & Copy */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  O seu Link Exclusivo de Afiliado (rastreia cliques, leads e comissões)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/?ref=${modalAffiliateLink.code}`}
                    className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const fullLink = `${window.location.origin}/?ref=${modalAffiliateLink.code}`;
                      navigator.clipboard.writeText(fullLink);
                      setCopiedCode(modalAffiliateLink.code);
                      setTimeout(() => setCopiedCode(null), 2500);
                    }}
                    className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    {copiedCode === modalAffiliateLink.code ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copiar Link</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5 flex items-center justify-between">
                  <span>Código de afiliado: <strong className="font-mono text-slate-700 dark:text-slate-300">{modalAffiliateLink.code}</strong></span>
                  <span className="text-emerald-600 font-medium">Link ativo e pronto para divulgar</span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    `Olá! Recomendo este conteúdo na Comerça: "${modalAffiliateProduct.title}". Compre através do meu link oficial: ${window.location.origin}/?ref=${modalAffiliateLink.code}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Partilhar no WhatsApp com Contactos</span>
                </a>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const prodId = modalAffiliateProduct.id;
                      const code = modalAffiliateLink.code;
                      setModalAffiliateProduct(null);
                      setModalAffiliateLink(null);
                      openCheckout(prodId, code);
                    }}
                    className="py-2.5 px-3 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition-colors cursor-pointer text-center"
                  >
                    Testar Checkout com Link
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setModalAffiliateProduct(null);
                      setModalAffiliateLink(null);
                      navigate('afiliados');
                    }}
                    className="py-2.5 px-3 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer text-center"
                  >
                    Ir ao Painel de Afiliados
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
