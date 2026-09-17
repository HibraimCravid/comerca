import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Currency, Order } from '../../types';
import { formatCurrency, convertCurrency, EXCHANGE_LAST_UPDATED } from '../../utils/currency';
import confetti from 'canvas-confetti';
import {
  X,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Building,
  CheckCircle2,
  Tag,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Lock,
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    activeCheckoutProductId,
    activeAffiliateRefCode,
    closeCheckout,
    products,
    coupons,
    completePurchase,
    navigate,
    selectedCurrency,
    setSelectedCurrency,
  } = useApp();

  if (!activeCheckoutProductId) return null;

  const product = products.find((p) => p.id === activeCheckoutProductId);
  if (!product) return null;

  // State
  const [buyerName, setBuyerName] = useState('João Manuel Baptista');
  const [buyerEmail, setBuyerEmail] = useState('joao.baptista@gmail.com');
  const [buyerPhone, setBuyerPhone] = useState('+244 923 881 223');
  const [paymentMethod, setPaymentMethod] = useState<Order['paymentMethod']>('multicaixa_express');
  const [taxIdCPF, setTaxIdCPF] = useState('');
  const [taxIdNIF, setTaxIdNIF] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');
  const [pixKey, setPixKey] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Price calculations
  const basePrice = product.discountPrice || product.price;
  const { convertedAmount: baseConverted } = convertCurrency(
    basePrice,
    product.currency,
    selectedCurrency
  );

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') {
      discountAmount = (baseConverted * appliedCoupon.value) / 100;
    } else {
      const { convertedAmount: couponValConverted } = convertCurrency(
        appliedCoupon.value,
        'AOA',
        selectedCurrency
      );
      discountAmount = Math.min(baseConverted, couponValConverted);
    }
  }

  const finalAmount = Math.max(0, baseConverted - discountAmount);

  const handleApplyCoupon = () => {
    setCouponError('');
    if (!couponCode.trim()) return;

    const coup = coupons.find(
      (c) => c.code.toUpperCase() === couponCode.trim().toUpperCase() && c.active
    );

    if (!coup) {
      setCouponError('Cupão inválido ou expirado.');
      return;
    }

    setAppliedCoupon(coup);
  };

  const handlePay = () => {
    if (!buyerName || !buyerEmail || !buyerPhone) {
      alert('Por favor preencha o seu nome, email e número de telemóvel.');
      return;
    }
    if (paymentMethod === 'pix' && !taxIdCPF.trim()) {
      alert('Por favor introduza o seu CPF para pagar com PIX.');
      return;
    }
    if (paymentMethod === 'paypal' && !paypalEmail.trim()) {
      alert('Por favor introduza o email da sua conta PayPal.');
      return;
    }
    if (
      (paymentMethod === 'card' || paymentMethod === 'bank_transfer' || paymentMethod === 'international_card') &&
      !taxIdNIF.trim()
    ) {
      alert('Por favor introduza o seu NIF para emissão da fatura.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const order = completePurchase({
        productId: product.id,
        buyerName,
        buyerEmail,
        buyerPhone,
        paidAmount: finalAmount,
        paidCurrency: selectedCurrency,
        paymentMethod,
        affiliateCode: activeAffiliateRefCode || undefined,
      });

      setIsProcessing(false);
      setCompletedOrder(order);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Safe fallback
      }
    }, 1200);
  };

  return (
    <div
      id="checkout-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        id="checkout-container"
        className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Top Header Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md overflow-hidden">
              <img src="/logo-icon.png" alt="Comerça" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="font-bold text-sm">Checkout Seguro Comerça</span>
              <p className="text-[10px] text-emerald-400 font-medium">
                Encriptação bancária SSL 256-bit
              </p>
            </div>
          </div>
          <button
            onClick={closeCheckout}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {completedOrder ? (
          /* Success Screen */
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Pagamento Aprovado com Sucesso!
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-md mx-auto">
              Parabéns, {buyerName.split(' ')[0]}! O seu acesso ao produto "
              <span className="font-bold text-slate-900 dark:text-white">
                {product.title}
              </span>
              " foi libertado instantaneamente.
            </p>

            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl max-w-md mx-auto mt-6 text-left border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">ID do Pedido:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-white">
                  {completedOrder.id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Valor Pago:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(completedOrder.paidAmount, completedOrder.paidCurrency)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Método Utilizado:</span>
                <span className="font-medium text-slate-800 dark:text-white capitalize">
                  {completedOrder.paymentMethod.replace('_', ' ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Comprovativo enviado para:</span>
                <span className="font-medium text-slate-800 dark:text-white">
                  {completedOrder.buyerEmail}
                </span>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                id="checkout-goto-course-btn"
                onClick={() => {
                  closeCheckout();
                  if (product.type === 'course') {
                    navigate('course_player', product.id);
                  } else {
                    navigate('buyer_library');
                  }
                }}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-xl shadow-md transition-colors cursor-pointer"
              >
                Acessar Conteúdo Agora
              </button>
              <button
                onClick={closeCheckout}
                className="px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold text-sm rounded-xl transition-colors cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <div className="p-6 max-h-[80vh] overflow-y-auto">
            {/* Product Summary Mini Card */}
            <div className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 mb-6">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-20 h-20 rounded-lg object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  {product.category}
                </span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                  {product.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Por {product.creatorName}
                </p>

                {activeAffiliateRefCode && (
                  <div className="mt-1 inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded">
                    <Sparkles className="w-3 h-3" />
                    Indicação: Ref {activeAffiliateRefCode}
                  </div>
                )}
              </div>
            </div>

            {/* Currency Choice Bar */}
            <div className="mb-6 flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Moeda do Pagamento:
              </span>
              <div className="flex gap-1.5">
                {(['AOA', 'USD', 'EUR', 'BRL'] as Currency[]).map((curr) => (
                  <button
                    key={curr}
                    onClick={() => setSelectedCurrency(curr)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedCurrency === curr
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {curr === 'AOA' ? 'Kwanza (Kz)' : curr === 'USD' ? 'Dólar ($)' : curr === 'EUR' ? 'Euro (€)' : 'Real (R$)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Buyer Details Form */}
            <div className="space-y-4 mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Dados do Comprador
              </h4>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="Ex: João Baptista"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Email (para receber acesso)
                  </label>
                  <input
                    type="email"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    placeholder="joao@exemplo.ao"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Número de Telemóvel (WhatsApp / Express)
                  </label>
                  <input
                    type="tel"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    placeholder="+244 923 000 000"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="mb-6 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Forma de Pagamento
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Multicaixa Express */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('multicaixa_express')}
                  className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                    paymentMethod === 'multicaixa_express'
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-1 ring-emerald-500'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white">
                      Multicaixa Express
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Validação instantânea no telemóvel
                    </div>
                  </div>
                </button>

                {/* Referência Multicaixa */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('multicaixa_ref')}
                  className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                    paymentMethod === 'multicaixa_ref'
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-1 ring-emerald-500'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white">
                      Referência Multicaixa
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Pague no ATM ou Internet Banking
                    </div>
                  </div>
                </button>

                {/* Cartão de Débito/Crédito */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-1 ring-emerald-500'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white">
                      Cartão Visa / Mastercard / TPA
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Nacional e Internacional
                    </div>
                  </div>
                </button>

                {/* Transferência Bancária */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank_transfer')}
                  className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-1 ring-emerald-500'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white">
                      Transferência Bancária (IBAN)
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      BAI, BFA, Atlântico, BIC, etc.
                    </div>
                  </div>
                </button>

                {/* PIX */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('pix')}
                  className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                    paymentMethod === 'pix'
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-1 ring-emerald-500'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white">
                      PIX
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Compradores no Brasil (BRL)
                    </div>
                  </div>
                </button>

                {/* PayPal */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                    paymentMethod === 'paypal'
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-1 ring-emerald-500'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white">
                      PayPal
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Compradores internacionais
                    </div>
                  </div>
                </button>
              </div>

              {/* Dynamic Instructions per Method */}
              {paymentMethod === 'multicaixa_express' && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2">
                  <Smartphone className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                  <div>
                    <p className="font-semibold">Como pagar com Multicaixa Express:</p>
                    <p className="mt-0.5 text-emerald-800 dark:text-emerald-300">
                      Ao clicar em "Concluir Pagamento", uma notificação surgirá no seu telemóvel (
                      {buyerPhone}) para introduzir o seu PIN de 4 dígitos no Multicaixa Express.
                    </p>
                  </div>
                </div>
              )}

              {paymentMethod === 'multicaixa_ref' && (
                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                  <div className="flex justify-between font-mono">
                    <span className="text-slate-500">Entidade:</span>
                    <span className="font-bold text-slate-900 dark:text-white">00192 (Comerça)</span>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span className="text-slate-500">Referência gerada:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      891 402 783
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 pt-1">
                    Válida por 48 horas em qualquer ATM ou app bancária de Angola.
                  </div>
                </div>
              )}

              {paymentMethod === 'pix' && (
                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-3">
                  <div className="flex justify-between font-mono">
                    <span className="text-slate-500">Chave PIX (Comerça):</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      pagamentos@comerca.ao
                    </span>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      CPF do pagador
                    </label>
                    <input
                      type="text"
                      required
                      value={taxIdCPF}
                      onChange={(e) => setTaxIdCPF(e.target.value)}
                      placeholder="000.000.000-00"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Obrigatório para pagamentos via PIX, conforme exigido pelo Banco Central do Brasil.
                    </p>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Sua chave PIX (para eventual reembolso)
                    </label>
                    <input
                      type="text"
                      value={pixKey}
                      onChange={(e) => setPixKey(e.target.value)}
                      placeholder="CPF, email ou telemóvel"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'paypal' && (
                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-3">
                  <p className="text-slate-500">
                    Será redirecionado para o PayPal para concluir o pagamento em {selectedCurrency}.
                  </p>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Email da conta PayPal
                    </label>
                    <input
                      type="email"
                      required
                      value={paypalEmail}
                      onChange={(e) => setPaypalEmail(e.target.value)}
                      placeholder="oseuemail@exemplo.com"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              )}

              {(paymentMethod === 'card' ||
                paymentMethod === 'bank_transfer' ||
                paymentMethod === 'international_card') && (
                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    NIF (Número de Identificação Fiscal)
                  </label>
                  <input
                    type="text"
                    required
                    value={taxIdNIF}
                    onChange={(e) => setTaxIdNIF(e.target.value)}
                    placeholder="Ex: 005839201LA042"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Necessário para emissão da fatura-recibo desta compra.
                  </p>
                </div>
              )}
            </div>

            {/* Coupon Box */}
            <div className="mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Cupão de desconto (ex: COMERCA15)"
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white bg-white dark:bg-slate-800"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="px-4 py-2 bg-slate-800 dark:bg-slate-700 text-white rounded-lg text-xs font-semibold hover:bg-slate-700 transition-colors"
                >
                  Aplicar
                </button>
              </div>

              {appliedCoupon && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Cupão "{appliedCoupon.code}" aplicado com sucesso!
                </p>
              )}
              {couponError && (
                <p className="text-xs text-rose-500 font-medium mt-1">{couponError}</p>
              )}
            </div>

            {/* Price Total Summary */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs mb-6">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Subtotal:</span>
                <span>{formatCurrency(baseConverted, selectedCurrency)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>Desconto cupão:</span>
                  <span>- {formatCurrency(discountAmount, selectedCurrency)}</span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between text-sm font-bold text-slate-900 dark:text-white">
                <span>Total a Pagar:</span>
                <span className="text-base text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(finalAmount, selectedCurrency)}
                </span>
              </div>

              <p className="text-[10px] text-slate-400 pt-1">
                Taxa de câmbio de referência atualizada em {EXCHANGE_LAST_UPDATED}.
              </p>
            </div>

            {/* Final Pay Button */}
            <button
              id="checkout-confirm-pay-btn"
              onClick={handlePay}
              disabled={isProcessing}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold text-base rounded-xl shadow-lg transition-all transform hover:scale-[1.01] active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isProcessing ? (
                <span>A processar pagamento seguro...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>
                    Pagar {formatCurrency(finalAmount, selectedCurrency)} e Aceder Agora
                  </span>
                </>
              )}
            </button>

            <div className="mt-4 flex items-center justify-center gap-6 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Garantia de {product.refundPeriodDays} dias
              </span>
              <span>Acesso imediato</span>
              <span>Suporte 24/7</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
