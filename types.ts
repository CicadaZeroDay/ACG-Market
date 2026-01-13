export interface Channel {
  id: string;
  name: string;
  username?: string;
  telegram_link?: string;
  subscribers: number;
  type: 'channel' | 'chat';
  description?: string;
  logo?: string;
  logo_color?: string;
}

export interface Product {
  id: string;
  channel_id: string;
  name: string;
  product_type: 'ad' | 'vacancy' | 'resume' | 'offer' | 'subscription' | 'branding';
  base_price: number;
  top_6h_price: number;
  pin_24h_price: number;
  pin_48h_price: number;
  pin_72h_price?: number;
  includes_website?: boolean;
  is_active: boolean;
}

export interface Package {
  id: string;
  name: string;
  slug?: string;
  category: 'vacancy' | 'ad';
  description: string;
  posts_count: number;
  includes_pin: boolean;
  pin_count: number;
  bonus_posts: number;
  price: number;
  is_popular: boolean;
  discount_percent: number;
}

export interface CartItem {
  id: number; // unique timestamp id for cart list
  type: 'product' | 'package';
  referenceId: string; // product id or package id
  name: string;
  details: string;
  price: number;
  // Specific to channels/products
  channelName?: string;
  extras?: string[]; 
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon?: string;
  is_active: boolean;
}

export type FilterType = 'all' | 'channel' | 'chat';

export interface Banner {
  id: string;
  slot: 'hero' | 'mid' | 'grid';
  title?: string;
  subtitle?: string;
  image_url?: string;
  link_url?: string;
  link_target?: '_blank' | '_self';
  bg_color?: string;
  text_color?: string;
  cta_text?: string;
  is_active: boolean;
  priority: number;
  starts_at?: string;
  ends_at?: string;
}

export interface Review {
  id: string;
  author_name: string;
  author_avatar?: string;
  author_company?: string;
  text: string;
  rating: number;
  image_url?: string;
  date: string;
  is_active: boolean;
}