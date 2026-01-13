import { createClient } from '@supabase/supabase-js';
import { Channel, Product, Package, Banner, Review } from '@/lib/types';

const SUPABASE_URL = 'https://ewyuzdnqrnuktbxoofiq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3eXV6ZG5xcm51a3RieG9vZmlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1MzYyMDQsImV4cCI6MjA4MzExMjIwNH0.rh08OeY1ba-uTidZAiG3W3fWZMxQ8WvHuKUxapo5mj4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Client-side marketplace service for dynamic data fetching
export const marketplaceService = {
  async getChannels(): Promise<Channel[]> {
    const { data, error } = await supabase
      .from('channels')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  },

  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*, channels(*)')
      .eq('is_active', true);

    if (error) throw error;
    return data || [];
  },

  async getPackages(): Promise<Package[]> {
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .order('price');

    if (error) throw error;
    return data || [];
  },

  async getBanners(slot?: string): Promise<Banner[]> {
    let query = supabase
      .from('banners')
      .select('*')
      .eq('is_active', true)
      .order('priority', { ascending: false });

    if (slot) {
      query = query.eq('slot', slot);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async getReviews(): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('is_active', true)
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  }
};
