const crypto = require('crypto');

function sign(email, code, expiresAt, secret) {
  return crypto
    .createHmac('sha256', secret)
    .update(`${email.toLowerCase().trim()}:${code}:${expiresAt}`)
    .digest('hex');
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ valid: false, error: 'Method not allowed' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ valid: false, error: 'JSON inválido' }) };
  }

  const { email, code, token, expiresAt } = body;

  if (!email || !code || !token || !expiresAt) {
    return {
      statusCode: 400,
      body: JSON.stringify({ valid: false, error: 'Dados em falta. Peça um novo código.' }),
    };
  }

  const secret = process.env.CODE_SIGNING_SECRET;
  if (!secret || secret === 'MY_CODE_SIGNING_SECRET') {
    return {
      statusCode: 500,
      body: JSON.stringify({
        valid: false,
        error: 'CODE_SIGNING_SECRET não está configurado nas variáveis de ambiente da Netlify.',
      }),
    };
  }

  if (Date.now() > Number(expiresAt)) {
    return { statusCode: 200, body: JSON.stringify({ valid: false, error: 'Código expirado. Peça um novo código.' }) };
  }

  const expectedToken = sign(email, String(code).trim(), Number(expiresAt), secret);

  const valid =
    expectedToken.length === String(token).length &&
    crypto.timingSafeEqual(Buffer.from(expectedToken), Buffer.from(String(token)));

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(
      valid ? { valid: true } : { valid: false, error: 'Código incorreto.' }
    ),
  };
};
