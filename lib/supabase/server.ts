import { createClient } from '@supabase/supabase-js';
import { Channel, Product, Package, Banner, Review } from '@/lib/types';

const SUPABASE_URL = 'https://ewyuzdnqrnuktbxoofiq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3eXV6ZG5xcm51a3RieG9vZmlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1MzYyMDQsImV4cCI6MjA4MzExMjIwNH0.rh08OeY1ba-uTidZAiG3W3fWZMxQ8WvHuKUxapo5mj4';

// Server-side Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Mock data for fallback
const MOCK_CHANNELS: Channel[] = [
  { id: 'c1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', name: 'HR КАНАЛ', username: '@hr_channel', subscribers: 154000, type: 'channel', logo_color: '#10b981' },
  { id: 'c2b3c4d5-e6f7-4a8b-9c0d-1e2f3a4b5c6d', name: 'АРБИТРАЖ ЧАТ', username: '@arbitrage_chat', subscribers: 89000, type: 'chat', logo_color: '#3b82f6' },
  { id: 'c3c4d5e6-f7a8-4b9c-0d1e-2f3a4b5c6d7e', name: 'IT Вакансии', username: '@it_jobs', subscribers: 45000, type: 'channel', logo_color: '#8b5cf6' },
  { id: 'c4d5e6f7-a8b9-4c0d-1e2f-3a4b5c6d7e8f', name: 'Маркетинг PRO', username: '@marketing_pro', subscribers: 125000, type: 'channel', logo_color: '#f43f5e' },
  { id: 'c5e6f7a8-b9c0-4d1e-2f3a-4b5c6d7e8f9a', name: 'Crypto News', username: '@crypto_news', subscribers: 230000, type: 'channel', logo_color: '#f97316' },
  { id: 'c6f7a8b9-c0d1-4e2f-3a4b-5c6d7e8f9a0b', name: 'Freelance Чат', username: '@freelance_chat', subscribers: 88000, type: 'chat', logo_color: '#06b6d4' },
];

const generateProductUUID = (channelId: string, suffix: string): string => {
  const base = channelId.substring(0, 8);
  const suffixMap: Record<string, string> = {
    'ad': 'ad00-0000-0000-000000000001',
    'vacancy': 'vc00-0000-0000-000000000002',
    'resume': 'rs00-0000-0000-000000000003'
  };
  return `${base}-${suffixMap[suffix] || 'xx00-0000-0000-000000000000'}`;
};

const generateProducts = (channels: Channel[]): Product[] => {
  const products: Product[] = [];
  channels.forEach(channel => {
    const multiplier = Math.max(0.5, channel.subscribers / 50000);
    products.push({
      id: generateProductUUID(channel.id, 'ad'),
      channel_id: channel.id,
      name: 'Размещение рекламы',
      product_type: 'ad',
      base_price: Math.round(100 * multiplier),
      top_6h_price: Math.round(20 * multiplier),
      pin_24h_price: Math.round(40 * multiplier),
      pin_48h_price: Math.round(70 * multiplier),
      is_active: true
    });
    products.push({
      id: generateProductUUID(channel.id, 'vacancy'),
      channel_id: channel.id,
      name: 'Размещение вакансии',
      product_type: 'vacancy',
      base_price: Math.round(80 * multiplier),
      top_6h_price: Math.round(15 * multiplier),
      pin_24h_price: Math.round(30 * multiplier),
      pin_48h_price: Math.round(50 * multiplier),
      is_active: true
    });
    if (channel.type === 'chat') {
      products.push({
        id: generateProductUUID(channel.id, 'resume'),
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

const MOCK_PRODUCTS = generateProducts(MOCK_CHANNELS);

const MOCK_PACKAGES: Package[] = [
  { id: '64f43509-ee65-463b-ab9a-84e382f4d421', name: 'GOLD', slug: 'gold', category: 'ad', description: 'Идеально для первых шагов', price: 99, posts_count: 5, includes_pin: true, pin_count: 1, bonus_posts: 0, discount_percent: 0, is_popular: false },
  { id: 'f5ac9447-e9b0-48cc-8abf-968b4ae30ecc', name: 'PLATINUM', slug: 'platinum', category: 'ad', description: 'Для стабильного дохода', price: 299, posts_count: 15, includes_pin: true, pin_count: 5, bonus_posts: 0, discount_percent: 0, is_popular: true },
  { id: '695c95c4-7a67-478d-bc9b-e69504e087c9', name: 'EXCLUSIVE', slug: 'exclusive', category: 'ad', description: 'Полное доминирование', price: 999, posts_count: 50, includes_pin: true, pin_count: 99, bonus_posts: 0, discount_percent: 0, is_popular: false },
];

const MOCK_REVIEWS: Review[] = [
  { id: 'review-1', author_name: 'Анна Ковальчук', author_avatar: 'https://randomuser.me/api/portraits/women/44.jpg', author_company: 'Digital Agency', text: 'Разместили рекламу на 5 каналах — получили 200+ заявок за неделю! Сервис топ, менеджеры помогли с креативом.', rating: 5, date: '2025-01-10', is_active: true },
  { id: 'review-2', author_name: 'Мария Светлова', author_avatar: 'https://randomuser.me/api/portraits/women/68.jpg', author_company: 'HR Manager', text: 'Искали специалистов через HR каналы — закрыли 3 вакансии за 2 недели. Цены адекватные, охваты реальные.', rating: 5, date: '2025-01-08', is_active: true },
  { id: 'review-3', author_name: 'Елена Миронова', author_avatar: 'https://randomuser.me/api/portraits/women/33.jpg', author_company: 'Crypto Project', text: 'Продвигали крипто-проект. Взяли пакет Platinum — результат превзошёл ожидания.', rating: 5, date: '2025-01-05', is_active: true },
];

const MOCK_BANNERS: Banner[] = [
  { id: 'mock-hero-1', slot: 'hero', title: 'Лови момент — скидка 30%', subtitle: 'Только 3 дня! Размещайся на топовых каналах по специальной цене', cta_text: 'Забрать скидку', link_url: '#packages', link_target: '_self', bg_color: '#0a0a0a', text_color: '#FFD200', is_active: true, priority: 10 },
  { id: 'mock-hero-2', slot: 'hero', title: '+15 новых каналов', subtitle: 'Свежие площадки с охватом 500K+ уже в каталоге', cta_text: 'Смотреть каналы', link_url: '#channels', link_target: '_self', bg_color: '#0a0a0a', text_color: '#FFD200', is_active: true, priority: 5 },
  { id: 'mock-mid-1', slot: 'mid', title: 'Приведи друга — заработай 10%', subtitle: 'Получай бонус с каждой покупки приглашённого друга', cta_text: 'Участвовать', link_url: '#', link_target: '_blank', bg_color: '#0d0d0d', text_color: '#FFD200', is_active: true, priority: 1 },
  { id: 'mock-grid-1', slot: 'grid', title: 'Хочешь в каталог?', subtitle: 'Добавь свой канал и получай заказы', cta_text: 'Стать партнёром', link_url: '#', link_target: '_blank', bg_color: '#0d0d0d', text_color: '#FFD200', is_active: true, priority: 1 },
];

// Server-side data fetching functions
export async function getChannels(): Promise<Channel[]> {
  try {
    const { data, error } = await supabase.from('channels').select('*').order('name');
    if (error) throw error;
    return data && data.length > 0 ? data : MOCK_CHANNELS;
  } catch {
    return MOCK_CHANNELS;
  }
}

export async function getProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase.from('products').select('*').eq('is_active', true);
    if (error) throw error;
    return data && data.length > 0 ? data : MOCK_PRODUCTS;
  } catch {
    return MOCK_PRODUCTS;
  }
}

export async function getPackages(): Promise<Package[]> {
  try {
    const { data, error } = await supabase.from('packages').select('*').order('price');
    if (error) throw error;
    return data && data.length > 0 ? data : MOCK_PACKAGES;
  } catch {
    return MOCK_PACKAGES;
  }
}

export async function getBanners(): Promise<Banner[]> {
  try {
    const now = new Date().toISOString();
    const { data, error } = await supabase.from('banners').select('*').eq('is_active', true).order('priority', { ascending: false });
    if (error) throw error;
    const filtered = (data || []).filter(b => {
      const startsOk = !b.starts_at || new Date(b.starts_at) <= new Date(now);
      const endsOk = !b.ends_at || new Date(b.ends_at) >= new Date(now);
      return startsOk && endsOk;
    });
    return filtered.length > 0 ? filtered : MOCK_BANNERS;
  } catch {
    return MOCK_BANNERS;
  }
}

export async function getReviews(): Promise<Review[]> {
  try {
    const { data, error } = await supabase.from('reviews').select('*').eq('is_active', true).order('date', { ascending: false });
    if (error) throw error;
    return data && data.length > 0 ? data : MOCK_REVIEWS;
  } catch {
    return MOCK_REVIEWS;
  }
}

// Fetch all data at once
export async function getAllMarketplaceData() {
  const [channels, products, packages, banners, reviews] = await Promise.all([
    getChannels(),
    getProducts(),
    getPackages(),
    getBanners(),
    getReviews(),
  ]);

  return { channels, products, packages, banners, reviews };
}
