import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Link2, Copy, Check, ExternalLink, Smartphone, Code, Eye } from 'lucide-react';

export const CheckoutLinksView: React.FC = () => {
  const { products, openCheckout } = useApp();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 bg-[#f8fafc] dark:bg-slate-950 p-6 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Links de Pagamento & Checkout Rápido
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Partilhe links diretos de checkout no WhatsApp, Instagram ou incorpore botões de compra no seu website.
          </p>
        </div>

        <div className="space-y-4">
          {products.map((p) => {
            const checkoutUrl = `${window.location.origin}/checkout/${p.id}`;
            const whatsappMsg = encodeURIComponent(
              `Olá! Aqui está o link oficial para adquirir "${p.title}" via Multicaixa Express ou Cartão: ${checkoutUrl}`
            );
            const whatsappUrl = `https://wa.me/?text=${whatsappMsg}`;

            return (
              <div
                key={p.id}
                className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img src={p.imageUrl} className="w-16 h-16 rounded-lg object-cover shrink-0" />
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{p.title}</h3>
                    <p className="text-xs text-slate-400">{p.category} • Preço: {p.price.toLocaleString()} {p.currency}</p>
                    <code className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded mt-1 inline-block">
                      {checkoutUrl}
                    </code>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleCopy(p.id, checkoutUrl)}
                    className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg flex items-center gap-1"
                  >
                    {copiedId === p.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" /> Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copiar Link
                      </>
                    )}
                  </button>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg flex items-center gap-1"
                  >
                    <Smartphone className="w-3.5 h-3.5" /> WhatsApp
                  </a>

                  <button
                    onClick={() => openCheckout(p.id)}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" /> Abrir Checkout
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
