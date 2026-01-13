/**
 * Stripe Checkout Service
 *
 * БЕЗОПАСНОСТЬ:
 * - Отправляет только product_id, НЕ цены
 * - Валидирует UUID перед отправкой
 * - Проверяет что redirect URL ведёт на Stripe
 * - Использует таймауты для защиты от DoS
 * - Не раскрывает детали ошибок пользователю
 */

import { CartItem } from '../types';

// Endpoint для создания Stripe сессии
const STRIPE_WEBHOOK_URL = 'https://n8n.kyshkov.com/webhook/stripe-checkout';

// Регулярное выражение для валидации UUID
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Регулярное выражение для проверки Stripe URL
const STRIPE_URL_REGEX = /^https:\/\/checkout\.stripe\.com\//;

// Максимум товаров в заказе
const MAX_ITEMS = 50;

// Таймаут запроса (30 секунд)
const REQUEST_TIMEOUT = 30000;

export interface StripeCheckoutItem {
  product_id: string;
  options: {
    top_6h: boolean;
    pin_24h: boolean;
    pin_48h: boolean;
    pin_72h: boolean;
  };
}

export interface StripeCheckoutRequest {
  items: StripeCheckoutItem[];
  success_url: string;
  cancel_url: string;
}

export interface StripeCheckoutResponse {
  url: string;
  session_id?: string;
}

export interface CheckoutError {
  message: string;
  code?: string;
}

/**
 * Валидирует UUID формат
 */
function isValidUUID(id: string): boolean {
  return UUID_REGEX.test(id);
}

/**
 * Преобразует CartItem в безопасный формат для отправки
 * ВАЖНО: Не отправляем цены, только ID и опции
 */
function sanitizeCartItem(item: CartItem): StripeCheckoutItem | null {
  // Проверяем что referenceId существует и валиден
  if (!item.referenceId) {
    console.warn('Cart item missing referenceId:', item.id);
    return null;
  }

  // Валидируем UUID для всех товаров (включая пакеты)
  if (!isValidUUID(item.referenceId)) {
    console.warn('Invalid UUID format:', item.referenceId);
    return null;
  }

  // Извлекаем опции из extras массива
  const extras = item.extras || [];

  return {
    product_id: item.referenceId,
    options: {
      top_6h: extras.includes('top6'),
      pin_24h: extras.includes('pin24'),
      pin_48h: extras.includes('pin48'),
      pin_72h: extras.includes('pin72')
    }
  };
}

/**
 * Генерирует безопасные URL для редиректа
 * Использует только текущий домен (защита от open redirect)
 */
function getSecureRedirectUrls(): { success_url: string; cancel_url: string } {
  const origin = window.location.origin;

  return {
    success_url: `${origin}/checkout/success`,
    cancel_url: `${origin}/checkout/cancel`
  };
}

/**
 * Основная функция для создания Stripe Checkout сессии
 */
export async function createStripeCheckout(cart: CartItem[]): Promise<StripeCheckoutResponse> {
  // ═══════════════════════════════════════════════════════════════
  // 1. ВАЛИДАЦИЯ КОРЗИНЫ
  // ═══════════════════════════════════════════════════════════════

  if (!cart || !Array.isArray(cart) || cart.length === 0) {
    throw new CheckoutValidationError('Корзина пуста');
  }

  if (cart.length > MAX_ITEMS) {
    throw new CheckoutValidationError(`Максимум ${MAX_ITEMS} товаров в заказе`);
  }

  // ═══════════════════════════════════════════════════════════════
  // 2. САНИТИЗАЦИЯ ДАННЫХ
  // ═══════════════════════════════════════════════════════════════

  const items: StripeCheckoutItem[] = [];

  for (const cartItem of cart) {
    const sanitized = sanitizeCartItem(cartItem);
    if (sanitized) {
      items.push(sanitized);
    }
  }

  if (items.length === 0) {
    throw new CheckoutValidationError('Нет валидных товаров для оплаты');
  }

  // ═══════════════════════════════════════════════════════════════
  // 3. БЕЗОПАСНЫЕ URL ДЛЯ РЕДИРЕКТА
  // ═══════════════════════════════════════════════════════════════

  const { success_url, cancel_url } = getSecureRedirectUrls();

  // ═══════════════════════════════════════════════════════════════
  // 4. ОТПРАВКА ЗАПРОСА С ТАЙМАУТОМ
  // ═══════════════════════════════════════════════════════════════

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(STRIPE_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        // Не отправляем лишних заголовков
      },
      body: JSON.stringify({
        items,
        success_url,
        cancel_url
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    // ═══════════════════════════════════════════════════════════════
    // 5. ОБРАБОТКА ОТВЕТА
    // ═══════════════════════════════════════════════════════════════

    if (!response.ok) {
      // Не показываем детали ошибки пользователю
      console.error('Stripe checkout error:', response.status);
      throw new CheckoutServerError('Ошибка создания платежа');
    }

    const data = await response.json();

    // DEBUG: Логируем ответ от сервера
    console.log('Stripe webhook response:', data);

    // ═══════════════════════════════════════════════════════════════
    // 6. ВАЛИДАЦИЯ ОТВЕТА
    // ═══════════════════════════════════════════════════════════════

    if (!data.url) {
      console.error('Missing URL in response. Full response:', JSON.stringify(data));
      throw new CheckoutServerError('URL оплаты не получен');
    }

    // Проверяем что URL ведёт на Stripe (защита от подмены)
    if (!STRIPE_URL_REGEX.test(data.url)) {
      console.error('Invalid redirect URL received:', data.url);
      throw new CheckoutServerError('Некорректный URL оплаты');
    }

    return {
      url: data.url,
      session_id: data.session_id
    };

  } catch (error) {
    clearTimeout(timeoutId);

    // DEBUG: Логируем полную ошибку
    console.error('Full checkout error:', error);

    if (error instanceof CheckoutValidationError || error instanceof CheckoutServerError) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new CheckoutServerError('Превышено время ожидания');
      }
      console.error('Checkout error:', error.message);
    }

    throw new CheckoutServerError('Ошибка соединения с сервером оплаты');
  }
}

/**
 * Выполняет редирект на Stripe Checkout
 */
export async function redirectToStripeCheckout(cart: CartItem[]): Promise<void> {
  const { url } = await createStripeCheckout(cart);

  // Безопасный редирект (URL уже проверен)
  window.location.href = url;
}

/**
 * Класс ошибки валидации
 */
export class CheckoutValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CheckoutValidationError';
  }
}

/**
 * Класс серверной ошибки
 */
export class CheckoutServerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CheckoutServerError';
  }
}
