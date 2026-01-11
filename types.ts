export interface Channel {
  id: string;
  created_at: string;
  name: string;
  username?: string;
  subscribers: number;
  type: 'channel' | 'chat';
  is_active: boolean;
  avatar_url?: string; // Optional if not in DB, but good for UI
}

export interface Product {
  id: string;
  channel_id: string;
  name: string;
  product_type: 'post' | 'pin' | 'subscription' | 'branding' | 'native'; // Adjust based on DB
  base_price: number;
  top_6h_price: number;
  pin_24h_price: number;
  pin_48h_price: number;
  is_active: boolean;
}

export interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  posts_count: number;
  includes_help: boolean;
  includes_stats: boolean;
  includes_guarantee: boolean;
  bonus_posts: number;
  discount_percent: number;
  is_popular: boolean;
  is_active: boolean;
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

export type FilterType = 'all' | 'channel' | 'chat';