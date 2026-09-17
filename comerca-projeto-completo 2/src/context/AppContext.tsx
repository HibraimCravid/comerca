import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Currency,
  User,
  UserRole,
  Product,
  Order,
  AffiliateLink,
  WalletTransaction,
  BankAccountMethod,
  WithdrawalRequest,
  Coupon,
  Ticket,
  NotificationItem,
  CommunityPost,
  PlatformConfig,
} from '../types';
import {
  CURRENT_USER,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_AFFILIATE_LINKS,
  INITIAL_WALLET_TRANSACTIONS,
  INITIAL_WITHDRAWAL_METHODS,
  INITIAL_WITHDRAWALS,
  INITIAL_COUPONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_TICKETS,
  INITIAL_COMMUNITY_POSTS,
  INITIAL_CONFIG,
} from '../data/mockData';
import { convertCurrency } from '../utils/currency';

interface AppContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  updateUser: (data: Partial<User>) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  selectedCurrency: Currency;
  setSelectedCurrency: (curr: Currency) => void;
  products: Product[];
  orders: Order[];
  refundOrder: (orderId: string) => void;
  affiliateLinks: AffiliateLink[];
  walletTransactions: WalletTransaction[];
  withdrawalMethods: BankAccountMethod[];
  withdrawals: WithdrawalRequest[];
  withdrawRequests: WithdrawalRequest[];
  coupons: Coupon[];
  tickets: Ticket[];
  notifications: NotificationItem[];
  communityPosts: CommunityPost[];
  platformConfig: PlatformConfig;
  purchasedProductIds: string[];
  currentView: string;
  activeCourseId: string | null;
  activeCheckoutProductId: string | null;
  activeAffiliateRefCode: string | null;
  isDarkMode: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register' | 'forgot';
  isAuthenticated: boolean;
  login: (userData?: { name?: string; email?: string; phone?: string; role?: UserRole }) => void;
  logout: () => void;
  
  // Actions
  navigate: (view: string, courseId?: string) => void;
  openCheckout: (productId: string, affiliateCode?: string) => void;
  closeCheckout: () => void;
  setCheckoutModalOpen?: (open: boolean) => void;
  setCheckoutProduct?: (product: any) => void;
  completePurchase: (orderData: {
    productId: string;
    buyerName: string;
    buyerEmail: string;
    buyerPhone: string;
    paidAmount: number;
    paidCurrency: Currency;
    paymentMethod: Order['paymentMethod'];
    affiliateCode?: string;
  }) => Order;
  createProduct: (data: Partial<Product>) => Product;
  updateProduct: (productId: string, data: Partial<Product>) => void;
  toggleLessonCompleted: (courseId: string, moduleId: string, lessonId: string) => void;
  joinAffiliateProgram: (productId: string) => AffiliateLink;
  getAffiliateLink: (productId: string) => AffiliateLink | undefined;
  clearActiveAffiliateRefCode: () => void;
  requestWithdrawal: (
    amountOrParams:
      | number
      | {
          amount: number;
          currency?: Currency;
          bankName?: string;
          iban?: string;
          accountHolder?: string;
          methodId?: string;
        },
    methodId?: string
  ) => { success: boolean; message: string };
  addWithdrawalMethod: (method: Omit<BankAccountMethod, 'id' | 'userId' | 'isPrimary'>) => void;
  removeWithdrawalMethod: (id: string) => void;
  setPrimaryWithdrawalMethod: (id: string) => void;
  createCoupon: (coupon: any) => void;
  toggleCouponActive: (id: string) => void;
  toggleCouponStatus: (id: string) => void;
  submitTicket: (subject: string, category: Ticket['category'], priority: Ticket['priority'], message: string) => void;
  replyTicket: (ticketId: string, message: string) => void;
  addCommunityPost: (content: string, productTag?: string) => void;
  likeCommunityPost: (postId: string) => void;
  adminApproveProduct: (productId: string) => void;
  adminRejectProduct: (productId: string) => void;
  adminProcessWithdrawal: (withdrawalId: string, status: 'completed' | 'rejected') => void;
  approveWithdrawal: (withdrawalId: string) => void;
  updatePlatformConfig: (newConfig: Partial<PlatformConfig>) => void;
  markNotificationsRead: () => void;
  toggleDarkMode: () => void;
  openAuthModal: (mode?: 'login' | 'register' | 'forgot') => void;
  closeAuthModal: () => void;
  availableBalance: number;
  pendingBalance: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem('comerca_user_profile');
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<User>;
        return { ...CURRENT_USER, ...parsed };
      }
    } catch {
      // fall through to defaults
    }
    return CURRENT_USER;
  });
  const [currentRole, setCurrentRole] = useState<UserRole>(user.currentActiveRole);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('AOA');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>(INITIAL_AFFILIATE_LINKS);
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>(INITIAL_WALLET_TRANSACTIONS);
  const [withdrawalMethods, setWithdrawalMethods] = useState<BankAccountMethod[]>(INITIAL_WITHDRAWAL_METHODS);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(INITIAL_WITHDRAWALS);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(INITIAL_COMMUNITY_POSTS);
  const [platformConfig, setPlatformConfig] = useState<PlatformConfig>(INITIAL_CONFIG);
  const [purchasedProductIds, setPurchasedProductIds] = useState<string[]>([
    'prod_python_01',
    'prod_marketing_02',
  ]);

  const [currentView, setCurrentView] = useState<string>('home');
  const [activeCourseId, setActiveCourseId] = useState<string | null>('prod_python_01');
  const [activeCheckoutProductId, setActiveCheckoutProductId] = useState<string | null>(null);
  const [activeAffiliateRefCode, setActiveAffiliateRefCode] = useState<string | null>(null);

  // Auto-detect referral code from URL on startup (?ref=CODE or ?aff=CODE)
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const ref = urlParams.get('ref') || urlParams.get('aff') || urlParams.get('afiliado');
      const prodParam = urlParams.get('product') || urlParams.get('p');
      if (ref) {
        setActiveAffiliateRefCode(ref);
        localStorage.setItem('comerca_active_ref', ref);
        // Track click on this affiliate link if present in state
        setAffiliateLinks((prev) =>
          prev.map((item) =>
            item.code.toUpperCase() === ref.toUpperCase()
              ? { ...item, clicks: (item.clicks || 0) + 1 }
              : item
          )
        );
      } else {
        const stored = localStorage.getItem('comerca_active_ref');
        if (stored) {
          setActiveAffiliateRefCode(stored);
        }
      }
      if (prodParam) {
        setActiveCheckoutProductId(prodParam);
      }
    } catch {
      // safe fallback
    }
  }, []);

  const clearActiveAffiliateRefCode = () => {
    setActiveAffiliateRefCode(null);
    try {
      localStorage.removeItem('comerca_active_ref');
    } catch {
      // safe fallback
    }
  };

  const getAffiliateLink = (productId: string): AffiliateLink | undefined => {
    return (
      affiliateLinks.find(
        (a) =>
          a.productId === productId &&
          (a.affiliateId === user.id || a.affiliateId === 'user_antonio_01')
      ) || affiliateLinks.find((a) => a.productId === productId)
    );
  };

  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('comerca_authenticated') === 'true';
    } catch {
      return false;
    }
  });

  // Calculate wallet balances dynamically
  const availableBalance = walletTransactions
    .filter((tx) => tx.status === 'completed')
    .reduce((sum, tx) => {
      const { convertedAmount } = convertCurrency(tx.amount, tx.currency, selectedCurrency);
      return sum + convertedAmount;
    }, 1250400); // Baseline starting balance for realistic demo

  const pendingBalance = walletTransactions
    .filter((tx) => tx.status === 'pending' || tx.status === 'processing')
    .reduce((sum, tx) => {
      const { convertedAmount } = convertCurrency(tx.amount, tx.currency, selectedCurrency);
      return sum + convertedAmount;
    }, 85000);

  const navigate = (view: string, courseId?: string) => {
    setCurrentView(view);
    if (courseId) {
      setActiveCourseId(courseId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openCheckout = (productId: string, affiliateCode?: string) => {
    setActiveCheckoutProductId(productId);
    if (affiliateCode) {
      setActiveAffiliateRefCode(affiliateCode);
    }
  };

  const closeCheckout = () => {
    setActiveCheckoutProductId(null);
    setActiveAffiliateRefCode(null);
  };

  const completePurchase = (orderData: {
    productId: string;
    buyerName: string;
    buyerEmail: string;
    buyerPhone: string;
    paidAmount: number;
    paidCurrency: Currency;
    paymentMethod: Order['paymentMethod'];
    affiliateCode?: string;
  }): Order => {
    const product = products.find((p) => p.id === orderData.productId);
    if (!product) throw new Error('Produto não encontrado');

    const affiliate = affiliateLinks.find((a) => a.code === orderData.affiliateCode);

    // Calculate platform fee and net earnings
    const platformFee = Math.round(
      orderData.paidAmount * (platformConfig.transactionFeePercent / 100) +
        (orderData.paidCurrency === 'AOA'
          ? platformConfig.fixedTransactionFeeAOA
          : orderData.paidCurrency === 'EUR'
          ? platformConfig.fixedTransactionFeeEUR
          : orderData.paidCurrency === 'USD'
          ? platformConfig.fixedTransactionFeeUSD
          : platformConfig.fixedTransactionFeeBRL)
    );

    let affiliateCommission = 0;
    if (affiliate && product.affiliateEnabled) {
      affiliateCommission = Math.round(
        (orderData.paidAmount * product.affiliateCommissionPercent) / 100
      );
    }

    const creatorNetEarnings = orderData.paidAmount - platformFee - affiliateCommission;

    const newOrder: Order = {
      id: `ord_${Date.now().toString().slice(-6)}`,
      productId: product.id,
      productTitle: product.title,
      productImage: product.imageUrl,
      buyerId: user.id,
      buyerName: orderData.buyerName,
      buyerEmail: orderData.buyerEmail,
      buyerPhone: orderData.buyerPhone,
      creatorId: product.creatorId,
      affiliateId: affiliate ? affiliate.affiliateId : undefined,
      affiliateCode: orderData.affiliateCode,
      originalAmount: product.discountPrice || product.price,
      originalCurrency: product.currency,
      paidAmount: orderData.paidAmount,
      paidCurrency: orderData.paidCurrency,
      exchangeRateUsed: 1,
      paymentMethod: orderData.paymentMethod,
      status: 'approved',
      platformFee,
      affiliateCommission,
      creatorNetEarnings,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };

    setOrders((prev) => [newOrder, ...prev]);
    setPurchasedProductIds((prev) => Array.from(new Set([...prev, product.id])));

    // Update product sales count
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, salesCount: p.salesCount + 1 } : p))
    );

    // Add wallet transaction for creator
    const creatorTx: WalletTransaction = {
      id: `tx_${Date.now().toString().slice(-6)}`,
      userId: product.creatorId,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      description: `Venda aprovada: ${product.title} (${orderData.buyerName})`,
      type: 'sale',
      amount: creatorNetEarnings,
      currency: orderData.paidCurrency,
      status: 'completed',
      orderId: newOrder.id,
    };
    setWalletTransactions((prev) => [creatorTx, ...prev]);

    // Update affiliate stats if applicable
    if (affiliate) {
      setAffiliateLinks((prev) =>
        prev.map((a) =>
          a.id === affiliate.id
            ? {
                ...a,
                salesCount: a.salesCount + 1,
                totalEarnings: a.totalEarnings + affiliateCommission,
              }
            : a
        )
      );

      const affTx: WalletTransaction = {
        id: `tx_aff_${Date.now().toString().slice(-6)}`,
        userId: affiliate.affiliateId,
        date: new Date().toISOString().replace('T', ' ').slice(0, 16),
        description: `Comissão de afiliado: ${product.title}`,
        type: 'commission',
        amount: affiliateCommission,
        currency: orderData.paidCurrency,
        status: 'completed',
        orderId: newOrder.id,
      };
      setWalletTransactions((prev) => [affTx, ...prev]);
    }

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: 'Nova venda aprovada!',
      message: `${orderData.buyerName} comprou "${product.title}" (${orderData.paidAmount} ${orderData.paidCurrency}).`,
      timestamp: 'Agora mesmo',
      read: false,
      type: 'sale',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return newOrder;
  };

  const createProduct = (data: Partial<Product>): Product => {
    const newProduct: Product = {
      id: `prod_${Date.now()}`,
      creatorId: user.id,
      creatorName: user.name,
      creatorAvatar: user.avatar,
      title: data.title || 'Sem título',
      description: data.description || '',
      category: data.category || 'Outros',
      imageUrl:
        data.imageUrl ||
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
      type: data.type || 'course',
      price: data.price || 10000,
      currency: data.currency || 'AOA',
      discountPrice: data.discountPrice,
      status: 'active',
      salesCount: 0,
      rating: 5.0,
      reviewsCount: 0,
      affiliateEnabled: data.affiliateEnabled ?? true,
      affiliateCommissionPercent: data.affiliateCommissionPercent || 30,
      refundPeriodDays: data.refundPeriodDays || 7,
      files: data.files || [],
      modules: data.modules || [],
      hasCertificate: data.hasCertificate ?? false,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    setProducts((prev) => [newProduct, ...prev]);

    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: 'Produto publicado com sucesso!',
      message: `"${newProduct.title}" já está disponível para venda e no marketplace.`,
      timestamp: 'Agora mesmo',
      read: false,
      type: 'course',
    };
    setNotifications((prev) => [notif, ...prev]);

    return newProduct;
  };

  const updateProduct = (productId: string, data: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, ...data } : p))
    );
  };

  const toggleLessonCompleted = (courseId: string, moduleId: string, lessonId: string) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id !== courseId || !prod.modules) return prod;
        return {
          ...prod,
          modules: prod.modules.map((mod) => {
            if (mod.id !== moduleId) return mod;
            return {
              ...mod,
              lessons: mod.lessons.map((les) =>
                les.id === lessonId ? { ...les, completed: !les.completed } : les
              ),
            };
          }),
        };
      })
    );
  };

  const joinAffiliateProgram = (productId: string): AffiliateLink => {
    // Ensure user has 'affiliate' role in their account
    setUser((prev) => {
      if (!prev.roles.includes('affiliate')) {
        return {
          ...prev,
          roles: [...prev.roles, 'affiliate'],
        };
      }
      return prev;
    });

    const existing = affiliateLinks.find(
      (a) =>
        a.productId === productId &&
        (a.affiliateId === user.id || a.affiliateId === 'user_antonio_01')
    );
    if (existing) return existing;

    const prod = products.find((p) => p.id === productId);
    const code = `LUK-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const newLink: AffiliateLink = {
      id: `aff_${Date.now()}`,
      code,
      productId,
      productTitle: prod ? prod.title : 'Produto Digital',
      affiliateId: user.id,
      commissionPercent: prod?.affiliateCommissionPercent || 30,
      clicks: 0,
      salesCount: 0,
      totalEarnings: 0,
      currency: prod ? prod.currency : 'AOA',
      status: 'approved',
      createdAt: new Date().toISOString().slice(0, 10),
    };

    setAffiliateLinks((prev) => [newLink, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        title: 'Programa de afiliados ativado',
        message: `O seu link de afiliado (${code}) para "${newLink.productTitle}" foi gerado com sucesso! Divulgue e ganhe comissões.`,
        timestamp: 'Agora mesmo',
        read: false,
        type: 'commission',
      },
      ...prev,
    ]);

    return newLink;
  };

  const updateUser = (updatedData: Partial<User>) => {
    setUser((prev) => ({
      ...prev,
      ...updatedData,
    }));
  };

  const refundOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'refunded' as const } : o))
    );
    setNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        title: 'Reembolso Concluído',
        message: `O pedido ${orderId} foi reembolsado com sucesso ao cliente.`,
        timestamp: 'Agora mesmo',
        read: false,
        type: 'system',
      },
      ...prev,
    ]);
  };

  const setCheckoutModalOpen = (open: boolean) => {
    if (!open) {
      closeCheckout();
    }
  };

  const setCheckoutProduct = (product: any) => {
    if (typeof product === 'string') {
      openCheckout(product);
    } else if (product?.id) {
      openCheckout(product.id);
    } else {
      closeCheckout();
    }
  };

  const requestWithdrawal = (
    amountOrParams:
      | number
      | {
          amount: number;
          currency?: Currency;
          bankName?: string;
          iban?: string;
          accountHolder?: string;
          methodId?: string;
        },
    methodIdParam?: string
  ) => {
    let amount: number;
    let currency: Currency = selectedCurrency;
    let bankName = 'BAI - Banco Angolano de Investimentos';
    let iban = 'AO06 0040 0000 1234 5678 9012 3';
    let accountHolder = user.name;
    let methodId = methodIdParam || 'custom_bank';

    if (typeof amountOrParams === 'number') {
      amount = amountOrParams;
      const method = withdrawalMethods.find((m) => m.id === methodIdParam);
      if (method) {
        bankName = method.bankName;
        iban = method.accountNumberOrIban;
        accountHolder = method.holderName;
        currency = method.currency || selectedCurrency;
      }
    } else {
      amount = amountOrParams.amount;
      if (amountOrParams.currency) currency = amountOrParams.currency;
      if (amountOrParams.bankName) bankName = amountOrParams.bankName;
      if (amountOrParams.iban) iban = amountOrParams.iban;
      if (amountOrParams.accountHolder) accountHolder = amountOrParams.accountHolder;
      if (amountOrParams.methodId) methodId = amountOrParams.methodId;
    }

    const minAmount =
      currency === 'AOA'
        ? platformConfig.minWithdrawalAOA
        : currency === 'EUR'
        ? platformConfig.minWithdrawalEUR
        : currency === 'USD'
        ? platformConfig.minWithdrawalUSD
        : platformConfig.minWithdrawalBRL;

    if (amount < minAmount) {
      return {
        success: false,
        message: `O valor mínimo para levantamento é ${minAmount} ${currency}.`,
      };
    }

    if (amount > availableBalance) {
      return {
        success: false,
        message: 'Saldo disponível insuficiente para realizar este levantamento.',
      };
    }

    const fee =
      currency === 'AOA'
        ? platformConfig.withdrawalFeeAOA
        : currency === 'EUR'
        ? platformConfig.withdrawalFeeEUR
        : currency === 'USD'
        ? platformConfig.withdrawalFeeUSD
        : platformConfig.withdrawalFeeBRL;

    const netAmount = Math.max(0, amount - fee);
    const dateStr = new Date().toISOString().replace('T', ' ').slice(0, 16);

    const newWd: WithdrawalRequest = {
      id: `wd_${Date.now().toString().slice(-6)}`,
      userId: user.id,
      userName: accountHolder,
      accountHolder: accountHolder,
      amount,
      currency,
      feeAmount: fee,
      netAmount,
      methodId,
      methodTitle: `${bankName} - ${iban}`,
      accountDetails: `Titular: ${accountHolder} | ${bankName} | ${iban}`,
      bankName,
      iban,
      status: 'pending',
      requestedAt: dateStr,
      date: dateStr,
    };

    setWithdrawals((prev) => [newWd, ...prev]);

    // Deduct transaction
    const wdTx: WalletTransaction = {
      id: `tx_wd_${Date.now().toString().slice(-6)}`,
      userId: user.id,
      date: dateStr,
      description: `Pedido de levantamento para ${bankName}`,
      type: 'withdrawal',
      amount: -amount,
      currency,
      status: 'pending',
    };
    setWalletTransactions((prev) => [wdTx, ...prev]);

    return {
      success: true,
      message: `Levantamento de ${amount} ${currency} solicitado com sucesso! Em análise pela tesouraria.`,
    };
  };

  const addWithdrawalMethod = (method: Omit<BankAccountMethod, 'id' | 'userId' | 'isPrimary'>) => {
    const isFirst = withdrawalMethods.length === 0;
    const newMethod: BankAccountMethod = {
      ...method,
      id: `mth_${Date.now()}`,
      userId: user.id,
      isPrimary: isFirst,
    };
    setWithdrawalMethods((prev) => [...prev, newMethod]);
  };

  const removeWithdrawalMethod = (id: string) => {
    setWithdrawalMethods((prev) => prev.filter((m) => m.id !== id));
  };

  const setPrimaryWithdrawalMethod = (id: string) => {
    setWithdrawalMethods((prev) =>
      prev.map((m) => ({ ...m, isPrimary: m.id === id }))
    );
  };

  const createCoupon = (coupon: any) => {
    const newCoupon: Coupon = {
      ...coupon,
      id: `coup_${Date.now()}`,
      timesUsed: 0,
      usedCount: 0,
      usageLimit: coupon.usageLimit ?? coupon.maxUses ?? 100,
      maxUses: coupon.maxUses ?? coupon.usageLimit ?? 100,
      startDate: coupon.startDate || new Date().toISOString().slice(0, 10),
      expirationDate: coupon.expirationDate || coupon.expiresAt || '2026-12-31',
      expiresAt: coupon.expiresAt || coupon.expirationDate || '2026-12-31',
      active: coupon.active !== undefined ? coupon.active : true,
    };
    setCoupons((prev) => [newCoupon, ...prev]);
  };

  const toggleCouponActive = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
  };

  const toggleCouponStatus = (id: string) => {
    toggleCouponActive(id);
  };

  const submitTicket = (
    subject: string,
    category: Ticket['category'],
    priority: Ticket['priority'],
    message: string
  ) => {
    const newTicket: Ticket = {
      id: `tkt_${Date.now().toString().slice(-5)}`,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      subject,
      category,
      priority,
      status: 'open',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      messages: [
        {
          id: `msg_${Date.now()}`,
          sender: 'user',
          senderName: user.name,
          message,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        },
      ],
    };
    setTickets((prev) => [newTicket, ...prev]);
  };

  const replyTicket = (ticketId: string, message: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        return {
          ...t,
          status: 'in_progress',
          messages: [
            ...t.messages,
            {
              id: `msg_${Date.now()}`,
              sender: 'user',
              senderName: user.name,
              message,
              timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
            },
          ],
        };
      })
    );
  };

  const addCommunityPost = (content: string, productTag?: string) => {
    const newPost: CommunityPost = {
      id: `post_${Date.now()}`,
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar,
      authorBadge: 'Membro Comerça',
      content,
      likes: 1,
      likedByMe: true,
      commentsCount: 0,
      timestamp: 'Agora mesmo',
      productTag,
    };
    setCommunityPosts((prev) => [newPost, ...prev]);
  };

  const likeCommunityPost = (postId: string) => {
    setCommunityPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const liked = !p.likedByMe;
        return {
          ...p,
          likedByMe: liked,
          likes: liked ? p.likes + 1 : p.likes - 1,
        };
      })
    );
  };

  const adminApproveProduct = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, status: 'active' } : p))
    );
  };

  const adminRejectProduct = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, status: 'rejected' } : p))
    );
  };

  const adminProcessWithdrawal = (withdrawalId: string, status: 'completed' | 'rejected') => {
    setWithdrawals((prev) =>
      prev.map((w) =>
        w.id === withdrawalId
          ? {
              ...w,
              status,
              processedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
            }
          : w
      )
    );
  };

  const updatePlatformConfig = (newConfig: Partial<PlatformConfig>) => {
    setPlatformConfig((prev) => ({ ...prev, ...newConfig }));
  };

  const markNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const openAuthModal = (mode: 'login' | 'register' | 'forgot' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = (userData?: {
    name?: string;
    email?: string;
    phone?: string;
    role?: UserRole;
    isNewAccount?: boolean;
  }) => {
    if (userData) {
      setUser((prev) => {
        const updated: User = {
          ...prev,
          name: userData.name || prev.name,
          email: userData.email || prev.email,
          phone: userData.phone || prev.phone,
          currentActiveRole: userData.role || prev.currentActiveRole,
          roles: userData.role && !prev.roles.includes(userData.role)
            ? [...prev.roles, userData.role]
            : prev.roles,
          kycStatus: userData.isNewAccount ? 'unsubmitted' : prev.kycStatus,
        };
        try {
          localStorage.setItem(
            'comerca_user_profile',
            JSON.stringify({
              name: updated.name,
              email: updated.email,
              phone: updated.phone,
              currentActiveRole: updated.currentActiveRole,
              roles: updated.roles,
              kycStatus: updated.kycStatus,
            })
          );
        } catch {
          // safe fallback
        }
        return updated;
      });
      if (userData.role) {
        setCurrentRole(userData.role);
      }
    }
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
    try {
      localStorage.setItem('comerca_authenticated', 'true');
    } catch {
      // safe fallback
    }

    setNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        title: 'Sessão iniciada com sucesso',
        message: `Bem-vindo(a) de volta à Comerça, ${userData?.name || user.name}!`,
        timestamp: 'Agora mesmo',
        read: false,
        type: 'system',
      },
      ...prev,
    ]);
  };

  const logout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('comerca_authenticated');
    } catch {
      // safe fallback
    }
    navigate('home');
    setNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        title: 'Sessão terminada',
        message: 'A sua sessão foi encerrada com segurança.',
        timestamp: 'Agora mesmo',
        read: false,
        type: 'system',
      },
      ...prev,
    ]);
  };

  const approveWithdrawal = (withdrawalId: string) => {
    adminProcessWithdrawal(withdrawalId, 'completed');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        updateUser,
        currentRole,
        setCurrentRole,
        selectedCurrency,
        setSelectedCurrency,
        products,
        orders,
        refundOrder,
        affiliateLinks,
        walletTransactions,
        withdrawalMethods,
        withdrawals,
        withdrawRequests: withdrawals,
        coupons,
        tickets,
        notifications,
        communityPosts,
        platformConfig,
        purchasedProductIds,
        currentView,
        activeCourseId,
        activeCheckoutProductId,
        activeAffiliateRefCode,
        isDarkMode,
        isAuthModalOpen,
        authModalMode,
        isAuthenticated,
        login,
        logout,
        navigate,
        openCheckout,
        closeCheckout,
        setCheckoutModalOpen,
        setCheckoutProduct,
        completePurchase,
        createProduct,
        updateProduct,
        toggleLessonCompleted,
        joinAffiliateProgram,
        getAffiliateLink,
        clearActiveAffiliateRefCode,
        requestWithdrawal,
        addWithdrawalMethod,
        removeWithdrawalMethod,
        setPrimaryWithdrawalMethod,
        createCoupon,
        toggleCouponActive,
        toggleCouponStatus,
        submitTicket,
        replyTicket,
        addCommunityPost,
        likeCommunityPost,
        adminApproveProduct,
        adminRejectProduct,
        adminProcessWithdrawal,
        approveWithdrawal,
        updatePlatformConfig,
        markNotificationsRead,
        toggleDarkMode,
        openAuthModal,
        closeAuthModal,
        availableBalance,
        pendingBalance,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
