import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, ProductType, Currency } from '../../types';
import { formatCurrency, convertCurrency } from '../../utils/currency';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  FileText,
  Video,
  Music,
  Code,
  Briefcase,
  Share2,
  Upload,
  Link,
  Save,
  X,
} from 'lucide-react';

export const ProductsManager: React.FC = () => {
  const {
    products,
    createProduct,
    updateProduct,
    selectedCurrency,
    openCheckout,
    navigate,
    user,
    affiliateLinks,
  } = useApp();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Educação');
  const [type, setType] = useState<ProductType>('ebook');
  const [price, setPrice] = useState<number>(15000);
  const [discountPrice, setDiscountPrice] = useState<number>(12000);
  const [currency, setCurrency] = useState<Currency>('AOA');
  const [imageUrl, setImageUrl] = useState('');
  const [affiliateEnabled, setAffiliateEnabled] = useState(true);
  const [affiliateCommissionPercent, setAffiliateCommissionPercent] = useState(35);
  const [refundPeriodDays, setRefundPeriodDays] = useState(7);
  const [hasCertificate, setHasCertificate] = useState(true);

  // Modules / Lessons state for course
  const [moduleTitle, setModuleTitle] = useState('Módulo 1: Introdução');
  const [lessonTitle, setLessonTitle] = useState('Aula 1.1: Boas-vindas');

  const categoriesList = [
    'Educação',
    'Tecnologia',
    'Programação',
    'Design',
    'Marketing',
    'Negócios',
    'Finanças',
    'Música',
    'Fotografia',
    'Desenvolvimento pessoal',
    'Templates',
    'Software',
    'Ferramentas',
    'Outros',
  ];

  const productTypes: { value: ProductType; label: string; icon: any }[] = [
    { value: 'ebook', label: 'Ebook / Livro Digital', icon: FileText },
    { value: 'video', label: 'Vídeo / Palestra', icon: Video },
    { value: 'audio', label: 'Áudio / Podcast', icon: Music },
    { value: 'software', label: 'Software / Script', icon: Code },
    { value: 'document', label: 'Documento / Template', icon: FileText },
    { value: 'community', label: 'Comunidade / Grupo VIP', icon: Briefcase },
    { value: 'digital_service', label: 'Serviço Digital / Mentoria', icon: Briefcase },
    { value: 'custom', label: 'Produto Personalizado', icon: Package },
  ];

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setTitle('');
    setDescription('');
    setCategory('Educação');
    setType('ebook');
    setPrice(15000);
    setDiscountPrice(12000);
    setCurrency('AOA');
    setImageUrl('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80');
    setAffiliateEnabled(true);
    setAffiliateCommissionPercent(35);
    setRefundPeriodDays(7);
    setHasCertificate(true);
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setTitle(p.title);
    setDescription(p.description);
    setCategory(p.category);
    setType(p.type);
    setPrice(p.price);
    setDiscountPrice(p.discountPrice || p.price);
    setCurrency(p.currency);
    setImageUrl(p.imageUrl);
    setAffiliateEnabled(p.affiliateEnabled);
    setAffiliateCommissionPercent(p.affiliateCommissionPercent);
    setRefundPeriodDays(p.refundPeriodDays);
    setHasCertificate(p.hasCertificate || false);
    setIsCreateModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Por favor insira o nome do produto.');
      return;
    }

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        title,
        description,
        category,
        type,
        price: Number(price),
        discountPrice: Number(discountPrice),
        currency,
        imageUrl: imageUrl || editingProduct.imageUrl,
        affiliateEnabled,
        affiliateCommissionPercent: Number(affiliateCommissionPercent),
        refundPeriodDays: Number(refundPeriodDays),
        hasCertificate,
      });
    } else {
      createProduct({
        title,
        description,
        category,
        type,
        price: Number(price),
        discountPrice: Number(discountPrice),
        currency,
        imageUrl:
          imageUrl ||
          'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
        affiliateEnabled,
        affiliateCommissionPercent: Number(affiliateCommissionPercent),
        refundPeriodDays: Number(refundPeriodDays),
        hasCertificate,
        modules:
          type === 'course'
            ? [
                {
                  id: `mod_${Date.now()}`,
                  title: moduleTitle || 'Módulo 1: Introdução',
                  lessons: [
                    {
                      id: `les_${Date.now()}`,
                      title: lessonTitle || 'Aula 1.1: Comece por aqui',
                      durationMinutes: 15,
                      description: 'Primeiros passos e introdução ao conteúdo do curso.',
                      completed: false,
                    },
                  ],
                },
              ]
            : undefined,
      });
    }

    setIsCreateModalOpen(false);
  };

  const [activeTab, setActiveTab] = useState<'meus' | 'producoes' | 'afiliacoes'>('meus');

  const myActiveProducts = products.filter((p) => p.creatorId === user.id && p.status === 'active');
  const myDraftProducts = products.filter((p) => p.creatorId === user.id && p.status !== 'active');
  const myAffiliatedProductIds = new Set(
    affiliateLinks.filter((a) => a.affiliateId === user.id).map((a) => a.productId)
  );
  const myAffiliatedProducts = products.filter((p) => myAffiliatedProductIds.has(p.id));

  const baseListForTab =
    activeTab === 'meus' ? myActiveProducts : activeTab === 'producoes' ? myDraftProducts : myAffiliatedProducts;

  const filteredProducts = baseListForTab.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchType = selectedType === 'all' || p.type === selectedType;
    return matchSearch && matchType;
  });

  return (
    <div className="flex-1 bg-[#f8fafc] dark:bg-slate-950 p-6 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Title & CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Gestão de Produtos Digitais
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Crie cursos, ebooks, ficheiros e configure comissões de afiliados.
            </p>
          </div>

          <button
            id="create-new-product-btn"
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Criar Novo Produto
          </button>
        </div>

        {/* Tabs: Meus Produtos / Minhas Produções / Minhas Afiliações */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('meus')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 -mb-px transition-colors cursor-pointer ${
              activeTab === 'meus'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Meus Produtos ({myActiveProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('producoes')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 -mb-px transition-colors cursor-pointer ${
              activeTab === 'producoes'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Minhas Produções ({myDraftProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('afiliacoes')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 -mb-px transition-colors cursor-pointer ${
              activeTab === 'afiliacoes'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Minhas Afiliações ({myAffiliatedProducts.length})
          </button>
        </div>

        {/* Filters Bar */}
        <div className="sticky top-16 z-10 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar por nome ou categoria..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs text-slate-400 whitespace-nowrap">Tipo:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="text-xs font-semibold px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="all">Todos os tipos</option>
              <option value="course">Cursos Online</option>
              <option value="ebook">Ebooks</option>
              <option value="video">Vídeos</option>
              <option value="templates">Templates</option>
              <option value="digital_service">Serviços Digitais</option>
            </select>
          </div>
        </div>

        {/* Products Table / Cards */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                  <th className="px-6 py-3.5 font-semibold">Produto</th>
                  <th className="px-6 py-3.5 font-semibold">Tipo</th>
                  <th className="px-6 py-3.5 font-semibold">Preço</th>
                  <th className="px-6 py-3.5 font-semibold">Vendas</th>
                  <th className="px-6 py-3.5 font-semibold">Afiliados</th>
                  <th className="px-6 py-3.5 font-semibold">Estado</th>
                  <th className="px-6 py-3.5 font-semibold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="text-xs sm:text-sm divide-y divide-slate-100 dark:divide-slate-800">
                {filteredProducts.map((p) => {
                  const { convertedAmount } = convertCurrency(
                    p.discountPrice || p.price,
                    p.currency,
                    selectedCurrency
                  );

                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.imageUrl}
                            alt={p.title}
                            className="w-12 h-12 rounded-lg object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 dark:text-white truncate max-w-xs sm:max-w-sm">
                              {p.title}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {p.category} • Criado em {p.createdAt}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 capitalize">
                          {p.type}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {formatCurrency(convertedAmount, selectedCurrency)}
                        </div>
                        {p.currency !== selectedCurrency && (
                          <div className="text-[10px] text-slate-400">
                            Original: {formatCurrency(p.discountPrice || p.price, p.currency)}
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-800 dark:text-slate-200">
                        {p.salesCount} vendas
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {p.affiliateEnabled ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-xs flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {p.affiliateCommissionPercent}% comissão
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">Desativado</span>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                          {p.status.toUpperCase()}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                        <button
                          onClick={() => openCheckout(p.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="Testar Checkout"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="Editar Produto"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Criar/Editar Produto */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden my-8">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingProduct ? 'Editar Produto' : 'Publicar Novo Produto Digital'}
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nome do Produto *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Mestria em Negócios Digitais em Angola"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Descrição Completa
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explique os benefícios, conteúdo e o que o aluno/cliente irá aprender..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Categoria
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  >
                    {categoriesList.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tipo de Conteúdo
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as ProductType)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  >
                    {productTypes.map((pt) => (
                      <option key={pt.value} value={pt.value}>
                        {pt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Preço Normal
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Preço Promocional
                  </label>
                  <input
                    type="number"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Moeda Base
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as Currency)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="AOA">Kwanza (AOA)</option>
                    <option value="USD">Dólar Americano (USD / $)</option>
                    <option value="EUR">Euro (EUR / €)</option>
                    <option value="BRL">Real Brasileiro (BRL / R$)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  URL da Imagem de Capa
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>

              {/* Affiliate settings */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-white">
                    Programa de Afiliados
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={affiliateEnabled}
                      onChange={(e) => setAffiliateEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>

                {affiliateEnabled && (
                  <div>
                    <label className="block text-[11px] text-slate-600 dark:text-slate-300 mb-1">
                      Comissão do Afiliado (% sobre o valor líquido)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={80}
                      value={affiliateCommissionPercent}
                      onChange={(e) => setAffiliateCommissionPercent(Number(e.target.value))}
                      className="w-32 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-bold bg-white dark:bg-slate-800"
                    />
                    <span className="text-xs text-slate-500 ml-2">%</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  {editingProduct ? 'Guardar Alterações' : 'Publicar Produto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
