// ========================================
// File: src/app/api/lead/route.ts
// Description: Приём заявок → Telegram + Email (гарантированная доставка в РФ)
// ========================================

import { Resend } from 'resend';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const RESEND_API_KEY = process.env.RESEND_API_KEY; // Ключ от Resend (бесплатно)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'info@avtovishki-arenda.ru';

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

const hits = new Map<string, { count: number; ts: number }>();

function rateLimited(ip: string): boolean {
  if (hits.size > 1000) hits.clear();
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now - rec.ts > 60_000) {
    hits.set(ip, { count: 1, ts: now });
    return false;
  }
  rec.count += 1;
  return rec.count > 3;
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';

  if (rateLimited(ip)) {
    return Response.json({ ok: false, error: 'too_many_requests' }, { status: 429 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: 'bad_json' }, { status: 400 });
  }

  if (body.honeypot) {
    console.log(`[Honeypot] Blocked IP: ${ip}`);
    return Response.json({ ok: true }); // Обманываем бота
  }

  const { name, phone, message, service, model, city } = body ?? {};
  const cleanPhone = String(phone).replace(/\D/g, '');
  
  if (!phone || cleanPhone.length < 10) {
    return Response.json({ ok: false, error: 'phone_required' }, { status: 400 });
  }

  const text = [
    '🔔 *Новая заявка с avtovishki-arenda.ru*',
    '',
    `👤 *Имя:* ${name || 'Не указано'}`,
    `📞 *Телефон:* [${phone}](tel:+${cleanPhone})`,
    service ? `🛠 *Услуга:* ${service}` : null,
    model ? `🚜 *Модель:* ${model}` : null,
    city ? `📍 *Город:* ${city}` : null,
    message ? `💬 *Сообщение:* ${message}` : null,
    '',
    `🕐 ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })} МСК`,
  ].filter(Boolean).join('\n');

  let telegramSuccess = false;

  // 1. Попытка отправки в Telegram
  if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text,
          parse_mode: 'Markdown',
          disable_web_page_preview: true,
        }),
        // Добавляем таймаут, чтобы не вешать сервер при блокировке РФ
        signal: AbortSignal.timeout(5000), 
      });
      const data = await res.json();
      if (data.ok) telegramSuccess = true;
      else console.error('Telegram API error:', data);
    } catch (e) {
      console.warn('Telegram отправка не удалась (возможна блокировка):', e);
    }
  }

  // 2. Гарантированная отправка на Email (если Telegram не сработал или как дублирование)
  let emailSuccess = false;
  if (resend && !telegramSuccess) {
    try {
      await resend.emails.send({
        from: 'ATR-Arenda <onboarding@resend.dev>', // Для начала используем тестовый домен Resend
        to: [ADMIN_EMAIL],
        subject: `🔔 Новая заявка: ${name || 'Клиент'} (${phone})`,
        html: text.replace(/\n/g, '<br>').replace(/\*(.*?)\*/g, '<b>$1</b>'),
      });
      emailSuccess = true;
    } catch (e) {
      console.error('Resend Email error:', e);
    }
  }

  // Если оба канала недоступны, возвращаем ошибку, чтобы форма показала "Позвоните нам"
  if (!telegramSuccess && !emailSuccess) {
    console.error('CRITICAL: Все каналы связи (TG + Email) недоступны');
    return Response.json({ ok: false, error: 'all_channels_failed' }, { status: 502 });
  }

  return Response.json({ ok: true, fallback: !telegramSuccess });
}