export type Currency = 'AOA' | 'EUR' | 'BRL' | 'USD';

export type UserRole = 'buyer' | 'creator' | 'affiliate' | 'admin' | 'support';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  avatar: string;
  country: string;
  preferredCurrency: Currency;
  roles: UserRole[];
  currentActiveRole: UserRole;
  verified: boolean;
  kycStatus: 'pending' | 'verified' | 'unsubmitted';
  createdAt: string;
}

export type ProductType = 
  | 'course' 
  | 'ebook' 
  | 'video' 
  | 'audio' 
  | 'software' 
  | 'document' 
  | 'community' 
  | 'digital_service' 
  | 'custom';

export interface CourseLesson {
  id: string;
  title: string;
  durationMinutes: number;
  videoUrl?: string;
  description: string;
  completed?: boolean;
  attachments?: { name: string; size: string; url: string }[];
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: CourseLesson[];
}

export interface Product {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  type: ProductType;
  price: number;
  currency: Currency;
  discountPrice?: number;
  status: 'active' | 'pending_approval' | 'rejected' | 'draft';
  salesCount: number;
  rating: number;
  reviewsCount: number;
  affiliateEnabled: boolean;
  affiliateCommissionPercent: number;
  refundPeriodDays: number;
  files?: { name: string; size: string; type: string }[];
  modules?: CourseModule[];
  hasCertificate?: boolean;
  createdAt: string;
}

export interface Order {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  creatorId: string;
  affiliateId?: string;
  affiliateCode?: string;
  originalAmount: number;
  originalCurrency: Currency;
  paidAmount: number;
  paidCurrency: Currency;
  exchangeRateUsed: number;
  paymentMethod: 'multicaixa_express' | 'multicaixa_ref' | 'card' | 'bank_transfer' | 'international_card' | 'pix' | 'paypal';
  paymentReference?: string;
  entityNumber?: string;
  status: 'approved' | 'pending' | 'cancelled' | 'refunded';
  platformFee: number;
  affiliateCommission: number;
  creatorNetEarnings: number;
  createdAt: string;
}

export interface AffiliateLink {
  id: string;
  code: string;
  productId: string;
  productTitle: string;
  affiliateId: string;
  commissionPercent: number;
  clicks: number;
  salesCount: number;
  totalEarnings: number;
  currency: Currency;
  status: 'approved' | 'pending' | 'rejected';
  createdAt: string;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  date: string;
  description: string;
  type: 'sale' | 'commission' | 'withdrawal' | 'refund' | 'platform_fee';
  amount: number;
  currency: Currency;
  status: 'completed' | 'pending' | 'processing' | 'cancelled' | 'refunded';
  orderId?: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  currency: Currency;
  feeAmount: number;
  netAmount: number;
  methodId: string;
  methodTitle: string;
  accountDetails: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  requestedAt: string;
  processedAt?: string;
  bankName?: string;
  iban?: string;
  accountHolder?: string;
  date?: string;
}

export interface BankAccountMethod {
  id: string;
  userId: string;
  isPrimary: boolean;
  country: string;
  category: string; // ex: Contas para Pessoas, Contas Empresariais, Contas para Pagamentos
  accountType: string; // ex: Multicaixa Express, Conta Corrente / À Ordem, IBAN AO06
  bankName: string;
  holderName: string;
  accountNumberOrIban: string;
  phoneOrIdNumber?: string;
  currency: Currency;
}

export interface Coupon {
  id: string;
  code: string;
  productId?: string;
  category?: string;
  type: 'percent' | 'fixed';
  value: number; // 20 for 20% or 5000 for 5000 Kz
  minOrderAmount?: number;
  usageLimit: number;
  maxUses?: number;
  timesUsed: number;
  usedCount?: number;
  startDate: string;
  expirationDate: string;
  expiresAt?: string;
  active: boolean;
}

export interface Ticket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  category: 'payment' | 'access' | 'withdrawal' | 'affiliate' | 'general';
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  messages: {
    id: string;
    sender: 'user' | 'support';
    senderName: string;
    message: string;
    timestamp: string;
  }[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'sale' | 'commission' | 'withdrawal' | 'course' | 'security' | 'system';
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorBadge: string;
  content: string;
  likes: number;
  likedByMe?: boolean;
  commentsCount: number;
  timestamp: string;
  productTag?: string;
}

export interface PlatformConfig {
  transactionFeePercent: number; // e.g., 10 (10% flat, no fixed component)
  fixedTransactionFeeAOA: number; // kept for compatibility, currently 0 (flat % fee only)
  fixedTransactionFeeEUR: number; // e.g., 0.50 €
  fixedTransactionFeeUSD: number; // e.g., 0.50 $
  fixedTransactionFeeBRL: number; // e.g., 2.50 R$
  withdrawalFeeAOA: number; // e.g., 500 Kz
  withdrawalFeeEUR: number; // e.g., 1.50 €
  withdrawalFeeUSD: number; // e.g., 1.50 $
  withdrawalFeeBRL: number; // e.g., 5.00 R$
  minWithdrawalAOA: number; // 10000 Kz
  minWithdrawalEUR: number; // 15 EUR
  minWithdrawalUSD: number; // 15 USD
  minWithdrawalBRL: number; // 50 BRL
}
