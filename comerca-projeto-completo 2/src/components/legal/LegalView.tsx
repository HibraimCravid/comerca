import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  ShoppingCart,
  ShieldCheck,
  BookOpenCheck,
  Scale,
  Timer,
  ChevronRight,
} from 'lucide-react';

type LegalDoc =
  | 'termos_uso'
  | 'termos_venda'
  | 'termos_compra'
  | 'politica_conteudo'
  | 'responsabilidade'
  | 'sla';

export const LegalView: React.FC = () => {
  const { navigate } = useApp();
  const [active, setActive] = useState<LegalDoc>('termos_uso');

  const docs: { id: LegalDoc; label: string; icon: React.ReactNode }[] = [
    { id: 'termos_uso', label: 'Termos de Uso', icon: <FileText className="w-4 h-4" /> },
    { id: 'termos_venda', label: 'Termos de Venda', icon: <ShoppingCart className="w-4 h-4" /> },
    { id: 'termos_compra', label: 'Termos de Compra', icon: <BookOpenCheck className="w-4 h-4" /> },
    { id: 'politica_conteudo', label: 'Política de Conteúdo', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'responsabilidade', label: 'Termos de Responsabilidade', icon: <Scale className="w-4 h-4" /> },
    { id: 'sla', label: 'SLA — Acordo de Nível de Serviço', icon: <Timer className="w-4 h-4" /> },
  ];

  const content: Record<LegalDoc, { title: string; updated: string; sections: { h: string; p: string }[] }> = {
    termos_uso: {
      title: 'Termos de Uso',
      updated: 'Última atualização: setembro de 2026',
      sections: [
        {
          h: '1. Aceitação dos termos',
          p: 'Ao criar uma conta ou utilizar a Comerça, o utilizador declara que leu, compreendeu e aceita estes Termos de Uso, bem como os demais documentos legais da plataforma (Termos de Venda, Termos de Compra, Política de Conteúdo, Termos de Responsabilidade e SLA).',
        },
        {
          h: '2. Elegibilidade e conta',
          p: 'O utilizador é responsável por manter os seus dados de acesso em sigilo e por toda a atividade realizada na sua conta. A Comerça pode suspender contas que violem estes termos ou a legislação aplicável em Angola.',
        },
        {
          h: '3. Perfis de utilização',
          p: 'A plataforma pode ser utilizada como Produtor (vendendo cursos, ebooks ou serviços), Afiliado (promovendo produtos de terceiros mediante comissão) ou Aluno/Comprador (adquirindo produtos digitais).',
        },
        {
          h: '4. Alterações aos termos',
          p: 'A Comerça pode atualizar estes termos periodicamente. As alterações relevantes serão comunicadas dentro da plataforma antes de entrarem em vigor.',
        },
      ],
    },
    termos_venda: {
      title: 'Termos de Venda',
      updated: 'Última atualização: setembro de 2026',
      sections: [
        {
          h: '1. Taxas da plataforma',
          p: 'A Comerça cobra uma comissão de 10% sobre o valor de cada venda aprovada, independentemente do preço ou da moeda do produto. Não há mensalidades nem taxas de adesão.',
        },
        {
          h: '2. Comissões de afiliados',
          p: 'O produtor define a percentagem de comissão de afiliação por produto. O valor é calculado sobre o preço pago pelo comprador e é apresentado de forma visível na página do produto antes da afiliação.',
        },
        {
          h: '3. Recebimento e levantamentos',
          p: 'Os valores líquidos de vendas aprovadas ficam disponíveis na Carteira do produtor/afiliado e podem ser levantados para conta bancária angolana verificada, sujeitos à taxa fixa de levantamento em vigor.',
        },
        {
          h: '4. Reembolsos',
          p: 'Pedidos de reembolso são avaliados de acordo com o prazo de garantia definido pelo produtor em cada produto. Vendas reembolsadas têm a comissão da plataforma e a comissão de afiliado estornadas proporcionalmente.',
        },
      ],
    },
    termos_compra: {
      title: 'Termos de Compra',
      updated: 'Última atualização: setembro de 2026',
      sections: [
        {
          h: '1. Acesso ao produto',
          p: 'Após a aprovação do pagamento, o comprador recebe acesso imediato ao conteúdo digital adquirido (curso, ebook ou serviço) na sua área de membros.',
        },
        {
          h: '2. Métodos de pagamento aceites',
          p: 'A Comerça aceita Multicaixa Express, Referência Multicaixa, cartão de crédito/débito internacional, PIX e PayPal, consoante a moeda e o país do comprador.',
        },
        {
          h: '3. Identificação fiscal',
          p: 'Para determinados métodos de pagamento pode ser solicitado o Número de Identificação Fiscal (NIF) ou o CPF do comprador, de acordo com a legislação fiscal do país de emissão do pagamento.',
        },
        {
          h: '4. Direito de arrependimento',
          p: 'O comprador pode solicitar reembolso dentro do prazo de garantia definido em cada produto, desde que cumpridas as condições descritas na página do produto.',
        },
      ],
    },
    politica_conteudo: {
      title: 'Política de Conteúdo',
      updated: 'Última atualização: setembro de 2026',
      sections: [
        {
          h: '1. Conteúdo permitido',
          p: 'A Comerça permite a venda de cursos em vídeo, ebooks, mentorias e ficheiros digitais originais ou devidamente licenciados pelo produtor.',
        },
        {
          h: '2. Conteúdo proibido',
          p: 'É proibida a publicação de conteúdo que viole direitos de autor de terceiros, promova discurso de ódio, violência, fraude, ou que seja ilegal ao abrigo da legislação angolana.',
        },
        {
          h: '3. Moderação',
          p: 'Todos os produtos submetidos passam por uma verificação antes de ficarem visíveis no Marketplace. A Comerça pode remover conteúdo que viole esta política a qualquer momento.',
        },
      ],
    },
    responsabilidade: {
      title: 'Termos de Responsabilidade',
      updated: 'Última atualização: setembro de 2026',
      sections: [
        {
          h: '1. Papel da Comerça',
          p: 'A Comerça atua como intermediária tecnológica entre produtores, afiliados e compradores, disponibilizando a infraestrutura de venda, pagamento e distribuição de conteúdo digital.',
        },
        {
          h: '2. Responsabilidade do produtor',
          p: 'O produtor é o único responsável pela qualidade, veracidade, legalidade e entrega do conteúdo anunciado, bem como pelo cumprimento de eventuais garantias oferecidas ao comprador.',
        },
        {
          h: '3. Limitação de responsabilidade',
          p: 'A Comerça não se responsabiliza por danos indiretos decorrentes do uso da plataforma, indisponibilidades pontuais de serviços de terceiros (bancos, processadoras de pagamento) ou pelo conteúdo publicado pelos produtores.',
        },
        {
          h: '4. Indemnização',
          p: 'O utilizador compromete-se a isentar a Comerça de responsabilidade por reclamações de terceiros resultantes do uso indevido da plataforma ou da violação destes termos.',
        },
      ],
    },
    sla: {
      title: 'SLA — Acordo de Nível de Serviço',
      updated: 'Última atualização: setembro de 2026',
      sections: [
        {
          h: '1. Disponibilidade da plataforma',
          p: 'A Comerça compromete-se a manter uma disponibilidade mensal alvo de 99,5%, excluindo janelas de manutenção programada previamente anunciadas.',
        },
        {
          h: '2. Tempo de aprovação de pagamentos',
          p: 'Pagamentos via Multicaixa Express são processados em até 15 segundos. Referências Multicaixa e cartões internacionais podem levar até 24 horas úteis para confirmação, dependendo da instituição financeira.',
        },
        {
          h: '3. Levantamentos bancários',
          p: 'Os pedidos de levantamento para contas bancárias angolanas são processados em até 2 dias úteis a partir da aprovação.',
        },
        {
          h: '4. Suporte ao utilizador',
          p: 'A Central de Ajuda visa responder a tickets em até 24 horas úteis. Incidentes críticos (ex: indisponibilidade total da plataforma) têm prioridade de resposta em até 2 horas.',
        },
      ],
    },
  };

  const active_doc = content[active];

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="bg-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => navigate('home')}
            className="text-slate-400 hover:text-white text-xs font-semibold mb-4 cursor-pointer"
          >
            ← Voltar à página inicial
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Termos, Políticas e SLA
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Tudo o que precisa de saber sobre como a Comerça funciona legalmente.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
        {/* Sidebar tabs */}
        <nav className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
          {docs.map((d) => (
            <button
              key={d.id}
              onClick={() => setActive(d.id)}
              className={`shrink-0 flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-left transition-colors cursor-pointer ${
                active === d.id
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-emerald-300'
              }`}
            >
              <span className="flex items-center gap-2">
                {d.icon}
                {d.label}
              </span>
              <ChevronRight className="w-3.5 h-3.5 hidden lg:block opacity-60" />
            </button>
          ))}
        </nav>

        {/* Document content */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{active_doc.title}</h2>
          <p className="text-xs text-slate-400 mt-1 mb-6">{active_doc.updated}</p>

          <div className="space-y-6">
            {active_doc.sections.map((s) => (
              <div key={s.h}>
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-1.5">
                  {s.h}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {s.p}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
