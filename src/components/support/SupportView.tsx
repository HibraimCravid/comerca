import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  HelpCircle,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Send,
  CheckCircle2,
  Phone,
  Mail,
  Clock,
} from 'lucide-react';

export const SupportView: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  const faqs = [
    {
      q: 'Como funciona o pagamento via Multicaixa Express?',
      a: 'Ao selecionar Multicaixa Express no checkout, insere o seu número de telemóvel associado ao serviço. Receberá uma notificação instantânea no telefone para confirmar com o seu PIN de 4 dígitos. A confirmação e libertação do produto ocorrem em menos de 15 segundos.',
    },
    {
      q: 'Qual o prazo para receber levantamentos na minha conta bancária em Angola?',
      a: 'Os levantamentos para bancos locais (BAI, BFA, Atlântico, BIC, SOL, etc.) são processados de 2 a 24 horas úteis, com uma taxa fixa de 500 Kz para despesas de liquidação interbancária.',
    },
    {
      q: 'Como funciona a garantia e o período de retenção anti-fraude?',
      a: 'Para garantir a segurança de compradores e produtores, cada venda possui uma garantia incondicional de 7 a 14 dias (conforme definido pelo produtor). Durante esse período, o valor fica no Saldo Pendente e migra automaticamente para Saldo Disponível logo a seguir.',
    },
    {
      q: 'Posso vender para clientes em Portugal, Brasil e outros países?',
      a: 'Sim! A plataforma aceita pagamentos internacionais em Euro (€) e Real (R$) via cartões Visa e Mastercard, convertendo os saldos para a moeda da sua preferência com taxas de câmbio atualizadas.',
    },
    {
      q: 'A Comerça cobra mensalidade?',
      a: 'Não. Não cobramos mensalidade nem taxa de inscrição. Apenas cobramos 10% quando realizar vendas com sucesso.',
    },
  ];

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;
    setTicketSubmitted(true);
    setTimeout(() => {
      setTicketSubmitted(false);
      setSubject('');
      setMessage('');
    }, 2500);
  };

  return (
    <div className="flex-1 bg-[#f8fafc] dark:bg-slate-950 p-6 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Central de Suporte & Ajuda Comerça
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Respostas para dúvidas frequentes e suporte dedicado para produtores e compradores.
          </p>
        </div>

        {/* FAQs */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
            Perguntas Frequentes
          </h2>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div
                key={i}
                className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-4 py-3 text-left font-semibold text-xs sm:text-sm text-slate-800 dark:text-white flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <span>{f.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50/50 dark:bg-slate-800/30">
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Open Ticket Form */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            Abrir Ticket de Apoio ao Cliente
          </h2>
          <p className="text-xs text-slate-400 mb-4">
            A nossa equipa em Luanda responde no prazo médio de 2 horas úteis.
          </p>

          {ticketSubmitted ? (
            <div className="p-6 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl border border-emerald-300 text-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="font-bold text-sm text-emerald-900 dark:text-emerald-200">
                Ticket enviado com sucesso!
              </p>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">
                Receberá uma notificação no seu telemóvel e email assim que respondido.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitTicket} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Assunto
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Ex: Dúvida sobre validação Multicaixa Express"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mensagem Detalhada
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Descreva o que aconteceu ou a sua dúvida com o máximo de detalhes..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Submeter Ticket
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
