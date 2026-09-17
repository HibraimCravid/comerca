const { GoogleGenAI } = require('@google/genai');

let aiClient = null;
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
    });
  }
  return aiClient;
}

const COMERCA_KNOWLEDGE = `
Você é o assistente inteligente oficial da plataforma Comerça, com inteligência Gemini.
Seu objetivo é explicar como funciona a plataforma Comerça e ensinar os usuários a usar o sistema do 0% até o 100%, além de auxiliá-los no tutorial do primeiro dia.

SOBRE A COMERÇA:
- Comerça é a principal plataforma de infoprodutos e comércio digital feita para Angola e com alcance global.
- Permite vender cursos em vídeo, ebooks (PDF), mentorias e ficheiros digitais.
- Suporta 4 moedas: Kwanza Angolano (AOA / Kz), Dólar Americano (USD / $), Euro (EUR / €) e Real Brasileiro (BRL / R$).
- Meios de pagamento locais e globais:
  * Multicaixa Express (notificação instantânea no telemóvel para confirmação com PIN em 15 segundos).
  * Referência Multicaixa (pagamento em caixas ATM ou homebanking).
  * Cartão de Crédito/Débito (Visa, Mastercard), PIX e PayPal para compradores internacionais.
- Taxa justa da plataforma: 10% do valor de cada venda aprovada, independente do preço. Não há mensalidades nem taxas ocultas.
- Levantamentos bancários: para contas bancárias em Angola (IBAN AO06 de bancos como BAI, BFA, Banco Atlântico, BIC, Sol, etc.) com taxa fixa de 500 Kz por transferência e sem valor mínimo de levantamento.

ROTEIRO DE USO DO 0% AO 100%:
- 0% Início: Criar conta e escolher o objetivo (Produtor, Afiliado ou Aluno).
- 25% Configuração da Conta: Preencher o perfil, definir a moeda padrão de visualização (AOA, USD, EUR, BRL) e cadastrar o IBAN angolano verificado.
- 50% Cadastro ou Afiliação:
  * Produtores: Clicam em "Produtos" -> "Novo Produto", inserem nome, descrição, carregam imagem de capa, definem o formato (Curso em Vídeo ou Ebook PDF), configuram preço e ativam comissão de afiliação (ex: 30% a 60%).
  * Afiliados: Acessam o "Marketplace", escolhem produtos com alta procura, clicam em "Afiliar-se com 1 clique" e recebem seu link exclusivo com cookie de 60 dias.
- 75% Vendas & Checkout: Compartilhar o link de checkout transparente nas redes sociais (WhatsApp, Instagram, YouTube). O cliente compra e recebe acesso imediato na sua área de membros.
- 100% Escala & Lucro: Acompanhar métricas em tempo real no Dashboard (receitas por província em Angola, vendas por hora, conversão), gerir alunos e solicitar levantamento do saldo disponível na Carteira para o banco.

TUTORIAL DO PRIMEIRO DIA:
No primeiro dia, o usuário deve:
1. Conhecer a interface (barra superior, menu lateral e seletores de moeda).
2. Definir o perfil (Produtor, Afiliado ou Aluno).
3. Configurar os dados bancários na aba Carteira/Configurações.
4. Experimentar a criação do 1º produto ou afiliar-se a um produto no Marketplace.
5. Fazer uma simulação de checkout para ver como o cliente paga via Multicaixa Express.

DIRETRIZES DE RESPOSTA:
- Responda em português claro, simpático, motivador e objetivo.
- Use formatação clara com tópicos e destaque em negrito.
- Sempre sugira a próxima ação prática que o usuário pode tomar na plataforma.
`;

function generateSmartFallback(message) {
  const q = message.toLowerCase();

  if (q.includes('0%') || q.includes('100%') || q.includes('roteiro') || q.includes('passo a passo')) {
    return `🎯 **Roteiro Completo Comerça: Do 0% ao 100%**

Aqui está o seu caminho para ter sucesso e lucrar na Comerça:

1. **0% - Início Rápido**: Crie a sua conta gratuita e defina se é **Produtor**, **Afiliado** ou **Aluno**.
2. **25% - Configuração da Conta**: Aceda a *Definições* e *Carteira* para definir a sua moeda preferida (Kwanza, Dólar, Euro ou Real) e cadastrar o seu IBAN bancário (AO06).
3. **50% - Produtos & Catálogo**:
   - **Se for Produtor**: Vá a *Produtos* > *Novo Produto*, cadastre o seu curso em vídeo ou ebook em PDF, defina o preço e a percentagem de comissão de afiliados.
   - **Se for Afiliado**: Vá a *Marketplace*, selecione um produto com alta procura e afilie-se com 1 clique para obter o seu link exclusivo.
4. **75% - Divulgação & Checkout**: Partilhe o link do produto nas suas redes sociais (WhatsApp, Instagram, etc.). O comprador paga em segundos com **Multicaixa Express** ou Cartão Internacional (USD/EUR).
5. **100% - Escala & Levantamentos**: Acompanhe as vendas no *Painel*, veja os lucros a entrar na *Carteira* e faça levantamento para a sua conta bancária angolana (sem valor mínimo, taxa fixa de 500 Kz).

💡 *Dica*: Pode clicar no botão **"Tutorial 1º Dia"** no menu do assistente para fazer o tour interativo passo a passo!`;
  }

  if (q.includes('multicaixa') || q.includes('pagamento') || q.includes('express') || q.includes('pagar')) {
    return `💳 **Como Funciona o Pagamento na Comerça:**

A Comerça oferece os métodos mais práticos e seguros para compradores em Angola e no exterior:

- 📱 **Multicaixa Express (Mais Popular em Angola)**:
  1. O cliente insere o número de telemóvel associado ao Multicaixa Express no checkout.
  2. Em até 15 segundos, recebe uma notificação instantânea no telemóvel da EMIS.
  3. Confirma o pagamento com o PIN do Multicaixa Express.
  4. O pagamento é aprovado instantaneamente e o acesso ao curso/ebook é libertado na hora!
- 🏧 **Referência Multicaixa**: Gera Entidade, Referência e Valor para pagamento no ATM ou Internet Banking.
- 💳 **Cartão Visa/Mastercard, PIX e PayPal**: Aceita pagamentos em **Dólar ($)**, **Euro (€)** e **Real (R$)** para compradores em Portugal, Brasil, EUA ou qualquer país do mundo.

💡 *Zero Complicação*: O produtor e o afiliado não precisam de ter TPA físico nem contrato com a EMIS; a Comerça gere tudo automaticamente.`;
  }

  if (q.includes('afiliado') || q.includes('comiss') || q.includes('afiliar')) {
    return `🤝 **Como Ganhar Dinheiro como Afiliado na Comerça:**

Como afiliado digital, pode faturar sem precisar criar nenhum produto:

1. **Aceda ao Marketplace**: Navegue pelos cursos, ebooks e mentorias disponíveis.
2. **Escolha o Produto**: Verifique o valor da comissão (geralmente entre 30% a 60% por venda) e a pontuação do produto.
3. **Afilie-se com 1 Clique**: Clique em *"Afiliar-se Agora"*. O seu link exclusivo é gerado na hora com cookie de 60 dias.
4. **Divulgue o seu Link**: Envie o link para grupos de WhatsApp, redes sociais ou crie conteúdo recomendando o material.
5. **Receba Automaticamente**: Cada vez que alguém comprar pelo seu link, a sua comissão cai automaticamente na sua *Carteira*, pronta para ser levantada para o seu banco!`;
  }

  if (q.includes('taxa') || q.includes('preco') || q.includes('custo') || q.includes('levantar') || q.includes('saque') || q.includes('banco') || q.includes('iban')) {
    return `💰 **Taxas Transparentes e Levantamentos na Comerça:**

- **Sem Mensalidades**: Não paga nada para criar conta nem para manter produtos na plataforma.
- **Taxa por Venda Aprovada**: **10%** do valor da venda, independentemente do preço. Só paga quando faturar!
- **Levantamento Bancário em Angola**:
  - Taxa fixa de apenas **500 Kz** por transferência bancária.
  - **Sem valor mínimo de levantamento** — pode levantar qualquer saldo disponível.
  - Suporte a todos os bancos angolanos com IBAN (AO06): BAI, BFA, Banco Atlântico, BIC, Standard Bank, Sol, etc.
  - Liquidação rápida diretamente na sua conta bancária, após aprovação do KYC.`;
  }

  if (q.includes('primeiro dia') || q.includes('tutorial') || q.includes('comecar') || q.includes('começar') || q.includes('iniciar')) {
    return `🚀 **Tutorial do Primeiro Dia na Comerça:**

Bem-vindo! No seu primeiro dia, recomendamos seguir estes 4 passos simples:

1. **Faça o Tour Interativo**: Clique na aba **"Tutorial 1º Dia"** aqui no canto inferior direito para ver a demonstração das telas.
2. **Complete o seu Perfil**: Vá a *Definições* e preencha o seu nome, telemóvel e banco com IBAN.
3. **Defina a sua Moeda de Exibição**: Use o seletor no topo para alternar entre **Kz (AOA)**, **$ (USD)**, **€ (EUR)** e **R$ (BRL)**.
4. **Faça um Teste Prático**:
   - Vá ao *Marketplace*, clique num produto e clique em *"Comprar Agora"* para ver o modal de checkout real a funcionar!
   - Se for produtor, vá a *Produtos* e crie um rascunho do seu primeiro curso ou ebook.

Precisa de ajuda em algum destes passos? Pergunte-me qualquer detalhe!`;
  }

  return `✨ **Olá! Sou o Assistente Inteligente da Comerça (Gemini AI).**

Estou aqui para te orientar a aproveitar 100% da plataforma:

- **Como Começar**: Posso guiá-lo no seu primeiro dia, passo a passo.
- **Vender Infoprodutos**: Aprenda a criar cursos em vídeo, ebooks em PDF e mentorias.
- **Vender em Moedas Globais**: Fature em **Kwanza (Kz)**, **Dólares ($)**, **Euros (€)** ou **Reais (R$)**.
- **Pagamentos Multicaixa Express**: Entenda como os clientes pagam em 15 segundos no telemóvel.
- **Ganhar com Afiliações**: Descubra como promover produtos de outros produtores e ganhar comissões automáticas.
- **Levantamentos**: Saiba como receber os lucros diretamente na sua conta bancária em Angola, sem valor mínimo.

Qual é a sua dúvida neste momento ou gostaria de ver o **Roteiro do 0% ao 100%**?`;
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'JSON inválido' }) };
  }

  const { message, history = [], userRole = 'creator' } = body;

  if (!message || typeof message !== 'string') {
    return { statusCode: 400, body: JSON.stringify({ error: 'Message is required' }) };
  }

  const ai = getGeminiClient();

  if (!ai) {
    const reply = generateSmartFallback(message);
    return { statusCode: 200, body: JSON.stringify({ reply, source: 'knowledge_base' }) };
  }

  try {
    const formattedHistory = Array.isArray(history)
      ? history.slice(-6).map((h) => ({
          role: h.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: h.content }],
        }))
      : [];

    const promptWithContext = `O utilizador tem perfil '${userRole}' e perguntou: "${message}".
Responda de forma completa, prática e estruturada sobre como funciona a Comerça ou como usar a funcionalidade solicitada.`;

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Gemini request timeout')), 8000)
    );

    const generatePromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [...formattedHistory, { role: 'user', parts: [{ text: promptWithContext }] }],
      config: { systemInstruction: COMERCA_KNOWLEDGE, temperature: 0.7 },
    });

    const response = await Promise.race([generatePromise, timeoutPromise]);
    const reply = response.text || generateSmartFallback(message);
    return { statusCode: 200, body: JSON.stringify({ reply, source: 'gemini' }) };
  } catch (error) {
    console.error('Gemini API Error, utilizing smart fallback:', error);
    const reply = generateSmartFallback(message);
    return { statusCode: 200, body: JSON.stringify({ reply, source: 'fallback' }) };
  }
};
