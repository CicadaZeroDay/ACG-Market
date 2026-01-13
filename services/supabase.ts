import { createClient } from '@supabase/supabase-js';
import { Channel, Package, Product, Banner, Review } from '../types';

// Use environment variables if available, fallback to provided configuration
// Note: If the hardcoded key is invalid, the service will fallback to mock data.
const SUPABASE_URL = 'https://ewyuzdnqrnuktbxoofiq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3eXV6ZG5xcm51a3RieG9vZmlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1MzYyMDQsImV4cCI6MjA4MzExMjIwNH0.rh08OeY1ba-uTidZAiG3W3fWZMxQ8WvHuKUxapo5mj4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Mock data for fallback when API fails (e.g. invalid key)
const MOCK_CHANNELS: Channel[] = [
  { id: '1', name: 'HR КАНАЛ', username: '@hr_channel', subscribers: 154000, type: 'channel', logo_color: '#10b981' },
  { id: '2', name: 'АРБИТРАЖ ЧАТ', username: '@arbitrage_chat', subscribers: 89000, type: 'chat', logo_color: '#3b82f6' },
  { id: '3', name: 'IT Вакансии', username: '@it_jobs', subscribers: 45000, type: 'channel', logo_color: '#8b5cf6' },
  { id: '4', name: 'Маркетинг PRO', username: '@marketing_pro', subscribers: 125000, type: 'channel', logo_color: '#f43f5e' },
  { id: '5', name: 'Crypto News', username: '@crypto_news', subscribers: 230000, type: 'channel', logo_color: '#f97316' },
  { id: '6', name: 'Freelance Чат', username: '@freelance_chat', subscribers: 88000, type: 'chat', logo_color: '#06b6d4' },
];

// Helper to generate products for channels
const generateProducts = (channels: Channel[]): Product[] => {
  const products: Product[] = [];
  channels.forEach(channel => {
    const multiplier = Math.max(0.5, channel.subscribers / 50000);

    // Размещение рекламы
    products.push({
      id: `p_${channel.id}_ad`,
      channel_id: channel.id,
      name: 'Размещение рекламы',
      product_type: 'ad',
      base_price: Math.round(100 * multiplier),
      top_6h_price: Math.round(20 * multiplier),
      pin_24h_price: Math.round(40 * multiplier),
      pin_48h_price: Math.round(70 * multiplier),
      is_active: true
    });

    // Размещение вакансии
    products.push({
      id: `p_${channel.id}_vacancy`,
      channel_id: channel.id,
      name: 'Размещение вакансии',
      product_type: 'vacancy',
      base_price: Math.round(80 * multiplier),
      top_6h_price: Math.round(15 * multiplier),
      pin_24h_price: Math.round(30 * multiplier),
      pin_48h_price: Math.round(50 * multiplier),
      is_active: true
    });

    // Размещение резюме (только для чатов)
    if (channel.type === 'chat') {
      products.push({
        id: `p_${channel.id}_resume`,
        channel_id: channel.id,
        name: 'Размещение резюме',
        product_type: 'resume',
        base_price: Math.round(50 * multiplier),
        top_6h_price: 0,
        pin_24h_price: Math.round(20 * multiplier),
        pin_48h_price: Math.round(35 * multiplier),
        is_active: true
      });
    }
  });
  return products;
};

const MOCK_PRODUCTS: Product[] = generateProducts(MOCK_CHANNELS);

const MOCK_PACKAGES: Package[] = [
  { id: 'pkg1', name: 'Смарт', slug: 'smart', category: 'ad', description: 'Быстрый старт для новых проектов', price: 250, posts_count: 5, includes_pin: true, pin_count: 1, bonus_posts: 1, discount_percent: 50, is_popular: false },
  { id: 'pkg2', name: 'Профи', slug: 'pro', category: 'ad', description: 'Оптимальный выбор для масштабирования', price: 390, posts_count: 12, includes_pin: true, pin_count: 3, bonus_posts: 3, discount_percent: 60, is_popular: true },
  { id: 'pkg3', name: 'VIP', slug: 'vip', category: 'ad', description: 'Максимальный охват и поддержка', price: 1000, posts_count: 30, includes_pin: true, pin_count: 10, bonus_posts: 10, discount_percent: 45, is_popular: false },
];

const MOCK_REVIEWS: Review[] = [
  {
    id: 'review-1',
    author_name: 'Анна Ковальчук',
    author_avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    author_company: 'Digital Agency',
    text: 'Разместили рекламу на 5 каналах — получили 200+ заявок за неделю! Сервис топ, менеджеры помогли с креативом. Обязательно вернёмся ещё 🔥',
    rating: 5,
    date: '2025-01-10',
    is_active: true
  },
  {
    id: 'review-2',
    author_name: 'Мария Светлова',
    author_avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    author_company: 'HR Manager',
    text: 'Искали специалистов через HR каналы — закрыли 3 вакансии за 2 недели. Цены адекватные, охваты реальные. Рекомендую!',
    rating: 5,
    date: '2025-01-08',
    is_active: true
  },
  {
    id: 'review-3',
    author_name: 'Елена Миронова',
    author_avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
    author_company: 'Crypto Project',
    text: 'Продвигали крипто-проект. Взяли пакет Platinum — результат превзошёл ожидания. Подписчики живые, конверсия в разы выше чем у конкурентов.',
    rating: 5,
    date: '2025-01-05',
    is_active: true
  },
  {
    id: 'review-4',
    author_name: 'Ольга Демченко',
    author_avatar: 'https://randomuser.me/api/portraits/women/85.jpg',
    author_company: 'Онлайн-школа',
    text: 'Запускали вебинар, нужны были быстро регистрации. ACG Market сделал всё за 24 часа — собрали 500+ участников. Буду работать только с вами!',
    rating: 5,
    date: '2025-01-03',
    is_active: true
  },
  {
    id: 'review-5',
    author_name: 'Наталья Волкова',
    author_avatar: 'https://randomuser.me/api/portraits/women/90.jpg',
    author_company: 'E-commerce',
    text: 'Отличный сервис! Удобный интерфейс, прозрачные цены. Менеджер всегда на связи. Результаты отслеживаем — ROI положительный.',
    rating: 4,
    date: '2024-12-28',
    is_active: true
  }
];

const MOCK_BANNERS: Banner[] = [
  {
    id: 'mock-hero-1',
    slot: 'hero',
    title: 'Лови момент — скидка 30%',
    subtitle: 'Только 3 дня! Размещайся на топовых каналах по специальной цене',
    cta_text: 'Забрать скидку',
    link_url: '#packages',
    link_target: '_self',
    bg_color: '#0a0a0a',
    text_color: '#FFD200',
    is_active: true,
    priority: 10
  },
  {
    id: 'mock-hero-2',
    slot: 'hero',
    title: '+15 новых каналов',
    subtitle: 'Свежие площадки с охватом 500K+ уже в каталоге',
    cta_text: 'Смотреть каналы',
    link_url: '#channels',
    link_target: '_self',
    bg_color: '#0a0a0a',
    text_color: '#FFD200',
    is_active: true,
    priority: 5
  },
  {
    id: 'mock-mid-1',
    slot: 'mid',
    title: 'Приведи друга — заработай 10%',
    subtitle: 'Получай бонус с каждой покупки приглашённого друга',
    cta_text: 'Участвовать',
    link_url: '#',
    link_target: '_blank',
    bg_color: '#0d0d0d',
    text_color: '#FFD200',
    is_active: true,
    priority: 1
  },
  {
    id: 'mock-grid-1',
    slot: 'grid',
    title: 'Хочешь в каталог?',
    subtitle: 'Добавь свой канал и получай заказы',
    cta_text: 'Стать партнёром',
    link_url: '#',
    link_target: '_blank',
    bg_color: '#0d0d0d',
    text_color: '#FFD200',
    is_active: true,
    priority: 1
  }
];

export const marketplaceService = {
  async getChannels(): Promise<Channel[]> {
    try {
      const { data, error } = await supabase
        .from('channels')
        .select('*')
        .order('name');

      console.log('Channels response:', { data, error });

      if (error) {
        console.warn('Supabase Error (Channels):', error.message);
        throw error;
      }
      return data && data.length > 0 ? data : MOCK_CHANNELS;
    } catch (e) {
      console.log('Falling back to mock channels data', e);
      return MOCK_CHANNELS;
    }
  },

  async getProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, channels(*)')
        .eq('is_active', true);

      console.log('Products response:', { data, error });

      if (error) {
         console.warn('Supabase Error (Products):', error.message);
         throw error;
      }
      return data && data.length > 0 ? data : MOCK_PRODUCTS;
    } catch (e) {
      console.log('Falling back to mock products data', e);
      return MOCK_PRODUCTS;
    }
  },

  async getPackages(): Promise<Package[]> {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .order('price');

      console.log('Packages response:', { data, error });

      if (error) {
         console.warn('Supabase Error (Packages):', error.message);
         throw error;
      }
      return data && data.length > 0 ? data : MOCK_PACKAGES;
    } catch (e) {
      console.log('Falling back to mock packages data', e);
      return MOCK_PACKAGES;
    }
  },

  async getBanners(slot?: string): Promise<Banner[]> {
    try {
      const now = new Date().toISOString();
      let query = supabase
        .from('banners')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: false });

      if (slot) {
        query = query.eq('slot', slot);
      }

      const { data, error } = await query;

      console.log('Banners response:', { data, error });

      if (error) {
        console.warn('Supabase Error (Banners):', error.message);
        throw error;
      }

      // Filter by date range client-side for simplicity
      const filtered = (data || []).filter(b => {
        const startsOk = !b.starts_at || new Date(b.starts_at) <= new Date(now);
        const endsOk = !b.ends_at || new Date(b.ends_at) >= new Date(now);
        return startsOk && endsOk;
      });

      return filtered.length > 0 ? filtered : MOCK_BANNERS.filter(b => !slot || b.slot === slot);
    } catch (e) {
      console.log('Falling back to mock banners data', e);
      return MOCK_BANNERS.filter(b => !slot || b.slot === slot);
    }
  },

  async getReviews(): Promise<Review[]> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('is_active', true)
        .order('date', { ascending: false });

      console.log('Reviews response:', { data, error });

      if (error) {
        console.warn('Supabase Error (Reviews):', error.message);
        throw error;
      }
      return data && data.length > 0 ? data : MOCK_REVIEWS;
    } catch (e) {
      console.log('Falling back to mock reviews data', e);
      return MOCK_REVIEWS;
    }
  }
};