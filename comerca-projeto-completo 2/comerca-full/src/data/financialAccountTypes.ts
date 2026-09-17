export interface AccountTypeCategory {
  categoryName: string;
  description: string;
  types: string[];
}

export const FINANCIAL_ACCOUNT_CATEGORIES: AccountTypeCategory[] = [
  {
    categoryName: 'Contas para Pagamentos e Carteiras Móveis',
    description: 'Métodos diretos para recebimento ágil em Angola e no exterior',
    types: [
      'Multicaixa Express (Número de Telemóvel)',
      'Conta IBAN Nacional (AO06 Angola)',
      'Conta de carteira digital',
      'Conta de pagamentos instantâneos',
      'Conta de pagamentos móveis',
      'Conta virtual',
      'Conta de transferência internacional (SWIFT/SEPA)',
      'Conta de remessas',
      'Conta pré-paga',
      'Conta de dinheiro eletrónico',
    ],
  },
  {
    categoryName: 'Contas para Pessoas',
    description: 'Contas bancárias individuais e familiares',
    types: [
      'Conta à ordem / Conta corrente pessoal',
      'Conta de depósito à ordem',
      'Conta de pagamentos',
      'Conta transacional',
      'Conta salário / ordenado',
      'Conta estudante / jovem',
      'Conta básica',
      'Conta digital / online',
      'Conta premium / private',
      'Conta multicurrency / multimoeda',
      'Conta em moeda estrangeira',
      'Conta conjunta',
      'Conta individual',
      'Conta solidária',
      'Conta de custódia',
    ],
  },
  {
    categoryName: 'Contas Empresariais',
    description: 'Contas para empresas, comerciantes e pessoas coletivas',
    types: [
      'Conta à ordem empresarial / comercial',
      'Conta corporativa',
      'Conta de empresa / negócios',
      'Conta para PME / startup',
      'Conta para empresário individual',
      'Conta de comerciante (Merchant Account)',
      'Conta de tesouraria / operacional',
      'Conta de pagamentos empresariais',
      'Conta de recebimentos',
      'Conta de salários',
      'Conta escrow empresarial',
    ],
  },
  {
    categoryName: 'Contas de Poupança e Investimento',
    description: 'Instrumentos poupança e aplicações financeiras',
    types: [
      'Conta poupança tradicional',
      'Conta poupança remunerada',
      'Conta de depósito a prazo / prazo fixo',
      'Certificado de depósito',
      'Conta poupança programada',
      'Conta de investimento / títulos',
      'Conta de custódia de investimentos',
      'Conta de mercado monetário',
    ],
  },
  {
    categoryName: 'Contas Internacionais',
    description: 'Contas bancárias e transfronteiriças',
    types: [
      'Conta internacional',
      'Conta bancária estrangeira',
      'Conta não residente',
      'Conta de residente',
      'Conta multimoeda internacional',
      'Conta para expatriados',
      'Conta de correspondente bancário',
    ],
  },
  {
    categoryName: 'Contas de Organizações e Especializadas',
    description: 'Institucionais, ONGs, fundações e trusts',
    types: [
      'Conta de ONG / Associação',
      'Conta de Fundação',
      'Conta institucional / pública',
      'Conta escrow / caução / garantia',
      'Conta fiduciária',
      'Conta de projeto',
    ],
  },
];

export const OWNERSHIP_STRUCTURES = [
  'Individual (Titular único)',
  'Empresarial (Sociedade por Quotas / SA)',
  'Empresário em Nome Individual',
  'Conjunta / Solidária',
  'Fiduciária / Representante Legal',
];

export const ANGOLAN_BANKS = [
  'Banco Angolano de Investimentos (BAI)',
  'Banco de Fomento Angola (BFA)',
  'Banco Millennium Atlântico (BMA)',
  'Banco BIC Angola (Banco KEVE)',
  'Banco Sol',
  'Standard Bank Angola',
  'Banco de Poupança e Crédito (BPC)',
  'Banco Comercial Angolano (BCA)',
  'Banco Yetu',
  'Banco Valor',
  'Access Bank Angola',
];
