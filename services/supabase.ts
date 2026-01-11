import { createClient } from '@supabase/supabase-js';
import { Channel, Package, Product } from '../types';

// Use environment variables if available, fallback to provided configuration
// Note: If the hardcoded key is invalid, the service will fallback to mock data.
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ewyuzdnqrnuktbxoofiq.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3eXV6ZG5xcm51a3RieG9vZmlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MTI2ODcsImV4cCI6MjA2MTA4ODY4N30.geAdxeXwPgdHZLf4M_xBEK09ygQ82vMQnDBXXwmBqvM';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Mock data for fallback when API fails (e.g. invalid key)
const MOCK_CHANNELS: Channel[] = [
  { id: '1', created_at: new Date().toISOString(), name: 'Crypto Insider', username: '@crypto_insider', subscribers: 154000, type: 'channel', is_active: true },
  { id: '2', created_at: new Date().toISOString(), name: 'Tech Startups', username: '@tech_startups', subscribers: 89000, type: 'channel', is_active: true },
  { id: '3', created_at: new Date().toISOString(), name: 'Design & UI', username: '@design_daily', subscribers: 45000, type: 'chat', is_active: true },
  { id: '4', created_at: new Date().toISOString(), name: 'Global News', username: '@world_news', subscribers: 500000, type: 'channel', is_active: true },
  { id: '5', created_at: new Date().toISOString(), name: 'Meme King', username: '@memeking_official', subscribers: 230000, type: 'channel', is_active: true },
  { id: '6', created_at: new Date().toISOString(), name: 'Business Daily', username: '@business_daily', subscribers: 112000, type: 'channel', is_active: true },
  { id: '7', created_at: new Date().toISOString(), name: 'Fashion Week', username: '@fashion_week', subscribers: 78000, type: 'channel', is_active: true },
  { id: '8', created_at: new Date().toISOString(), name: 'Crypto Chat', username: '@crypto_chat_en', subscribers: 15000, type: 'chat', is_active: true },
  { id: '9', created_at: new Date().toISOString(), name: 'Developers Den', username: '@devs_den', subscribers: 34000, type: 'chat', is_active: true },
  { id: '10', created_at: new Date().toISOString(), name: 'Health & Fitness', username: '@fit_life', subscribers: 145000, type: 'channel', is_active: true },
  { id: '11', created_at: new Date().toISOString(), name: 'Travel Guide', username: '@travel_the_world', subscribers: 210000, type: 'channel', is_active: true },
  { id: '12', created_at: new Date().toISOString(), name: 'Movies & Cinema', username: '@cinema_fans', subscribers: 95000, type: 'channel', is_active: true },
  // Additional Channels
  { id: '13', created_at: new Date().toISOString(), name: 'Startup Ideas', username: '@startup_ideas', subscribers: 67000, type: 'channel', is_active: true },
  { id: '14', created_at: new Date().toISOString(), name: 'Marketing Pro', username: '@marketing_pro', subscribers: 125000, type: 'channel', is_active: true },
  { id: '15', created_at: new Date().toISOString(), name: 'AI Revolution', username: '@ai_news_daily', subscribers: 310000, type: 'channel', is_active: true },
  { id: '16', created_at: new Date().toISOString(), name: 'Freelance Jobs', username: '@freelance_board', subscribers: 88000, type: 'chat', is_active: true },
  { id: '17', created_at: new Date().toISOString(), name: 'Music Hits', username: '@music_vibes', subscribers: 420000, type: 'channel', is_active: true },
  { id: '18', created_at: new Date().toISOString(), name: 'Science Fact', username: '@science_daily', subscribers: 195000, type: 'channel', is_active: true },
  { id: '19', created_at: new Date().toISOString(), name: 'Gaming World', username: '@gamers_hub', subscribers: 280000, type: 'chat', is_active: true },
  { id: '20', created_at: new Date().toISOString(), name: 'History Channel', username: '@history_facts', subscribers: 160000, type: 'channel', is_active: true },
  { id: '21', created_at: new Date().toISOString(), name: 'Car Enthusiasts', username: '@auto_drive', subscribers: 220000, type: 'channel', is_active: true },
  { id: '22', created_at: new Date().toISOString(), name: 'Cooking Master', username: '@chef_recipes', subscribers: 135000, type: 'channel', is_active: true },
];

// Helper to generate products for channels
const generateProducts = (channels: Channel[]): Product[] => {
  const products: Product[] = [];
  channels.forEach(channel => {
    // Determine price multiplier based on subs
    const multiplier = Math.max(0.5, channel.subscribers / 50000);
    
    products.push({
      id: `p_${channel.id}_1`,
      channel_id: channel.id,
      name: channel.type === 'chat' ? 'Закреп в чате' : 'Рекламный пост',
      product_type: channel.type === 'chat' ? 'pin' : 'post',
      base_price: Math.round(100 * multiplier),
      top_6h_price: channel.type === 'chat' ? 0 : Math.round(20 * multiplier),
      pin_24h_price: Math.round(40 * multiplier),
      pin_48h_price: Math.round(70 * multiplier),
      is_active: true
    });

    if (channel.type === 'channel') {
      products.push({
        id: `p_${channel.id}_2`,
        channel_id: channel.id,
        name: 'Нативная интеграция',
        product_type: 'native',
        base_price: Math.round(250 * multiplier),
        top_6h_price: 0,
        pin_24h_price: 0,
        pin_48h_price: 0,
        is_active: true
      });
    }
  });
  return products;
};

const MOCK_PRODUCTS: Product[] = generateProducts(MOCK_CHANNELS);

const MOCK_PACKAGES: Package[] = [
  // Renamed to 'Smart' to match Sidebar 'Смарт' and updated discount to 50%
  { id: 'pkg1', name: 'Smart', description: 'Быстрый старт для новых проектов', price: 299, posts_count: 5, includes_help: true, includes_stats: false, includes_guarantee: false, bonus_posts: 1, discount_percent: 50, is_popular: false, is_active: true },
  // Renamed to 'Pro' to match Sidebar 'Профи' and updated discount to 60%
  { id: 'pkg2', name: 'Pro', description: 'Оптимальный выбор для масштабирования', price: 599, posts_count: 12, includes_help: true, includes_stats: true, includes_guarantee: true, bonus_posts: 3, discount_percent: 60, is_popular: true, is_active: true },
  // Renamed to 'Business'
  { id: 'pkg3', name: 'Business', description: 'Максимальный охват и поддержка', price: 1499, posts_count: 30, includes_help: true, includes_stats: true, includes_guarantee: true, bonus_posts: 10, discount_percent: 45, is_popular: false, is_active: true },
];

export const marketplaceService = {
  async getChannels(): Promise<Channel[]> {
    try {
      const { data, error } = await supabase
        .from('channels')
        .select('*')
        .eq('is_active', true)
        .order('subscribers', { ascending: false });
      
      if (error) {
        console.warn('Supabase Error (Channels):', error.message);
        throw error;
      }
      return data && data.length > 0 ? data : MOCK_CHANNELS;
    } catch (e) {
      console.log('Falling back to mock channels data');
      return MOCK_CHANNELS;
    }
  },

  async getProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true);
      
      if (error) {
         console.warn('Supabase Error (Products):', error.message);
         throw error;
      }
      return data && data.length > 0 ? data : MOCK_PRODUCTS;
    } catch (e) {
      console.log('Falling back to mock products data');
      return MOCK_PRODUCTS;
    }
  },

  async getPackages(): Promise<Package[]> {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true });
      
      if (error) {
         console.warn('Supabase Error (Packages):', error.message);
         throw error;
      }
      return data && data.length > 0 ? data : MOCK_PACKAGES;
    } catch (e) {
      console.log('Falling back to mock packages data');
      return MOCK_PACKAGES;
    }
  }
};