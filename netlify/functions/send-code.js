const crypto = require('crypto');

const CODE_TTL_MS = 10 * 60 * 1000; // 10 minutes

function sign(email, code, expiresAt, secret) {
  return crypto
    .createHmac('sha256', secret)
    .update(`${email.toLowerCase().trim()}:${code}:${expiresAt}`)
    .digest('hex');
}

function generateSixDigitCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendCodeByEmail(toEmail, name, code) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromAddress = process.env.RESEND_FROM_EMAIL || 'Comerça <onboarding@resend.dev>';

  if (!apiKey || apiKey === 'MY_RESEND_API_KEY') {
    // No email provider configured: log server-side only (visible in the
    // Netlify function logs, never sent back to the browser).
    console.info(`[Comerça] (sem RESEND_API_KEY) código para ${toEmail}: ${code}`);
    return false;
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [toEmail],
        subject: 'O seu código de confirmação Comerça',
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
            <h2 style="color:#059669;">Confirme a sua conta na Comerça</h2>
            <p>Olá ${name || ''},</p>
            <p>Use o código abaixo para confirmar o seu email e concluir o cadastro:</p>
            <p style="font-size: 32px; font-weight: bold; letter-spacing: 8px; text-align:center; background:#f0fdf4; padding: 16px; border-radius: 12px;">${code}</p>
            <p style="color:#64748b; font-size: 12px;">Este código expira em 10 minutos. Se não foi você quem pediu isto, ignore este email.</p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Resend API error:', errText);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Failed to send email via Resend:', error);
    return false;
  }
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

  const { email, name } = body;
  if (!email || typeof email !== 'string') {
    return { statusCode: 400, body: JSON.stringify({ error: 'Email é obrigatório' }) };
  }

  const secret = process.env.CODE_SIGNING_SECRET;
  if (!secret || secret === 'MY_CODE_SIGNING_SECRET') {
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: 'CODE_SIGNING_SECRET não está configurado nas variáveis de ambiente da Netlify.',
      }),
    };
  }

  const code = generateSixDigitCode();
  const expiresAt = Date.now() + CODE_TTL_MS;
  const token = sign(email, code, expiresAt, secret);

  const delivered = await sendCodeByEmail(email, name || '', code);

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      success: true,
      delivered,
      expiresAt,
      token,
      // Shown on-screen only when it wasn't actually emailed (no email
      // service configured / delivery failed) — never sent when delivered.
      code: delivered ? undefined : code,
      message: delivered
        ? 'Código enviado para o seu email.'
        : 'Serviço de email ainda não está configurado — o código está aqui em baixo, só para testes.',
    }),
  };
};
