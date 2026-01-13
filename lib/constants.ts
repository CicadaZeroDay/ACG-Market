// Package UUIDs - must match database
export const PACKAGE_IDS = {
  gold: '64f43509-ee65-463b-ab9a-84e382f4d421',
  platinum: 'f5ac9447-e9b0-48cc-8abf-968b4ae30ecc',
  exclusive: '695c95c4-7a67-478d-bc9b-e69504e087c9'
} as const;

// Package prices
export const PACKAGE_PRICES = {
  gold: 99,
  platinum: 299,
  exclusive: 999
} as const;

// App configuration
export const APP_CONFIG = {
  name: 'ACG Market',
  domain: 'https://acgm.app',
  telegramBot: 'kyshkovinsta_bot',
  supportedLanguages: ['ru', 'ua', 'en'] as const,
  defaultLanguage: 'ru' as const,
} as const;

// Supabase configuration
export const SUPABASE_CONFIG = {
  url: 'https://ewyuzdnqrnuktbxoofiq.supabase.co',
  // Note: anon key is safe to expose client-side
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3eXV6ZG5xcm51a3RieG9vZmlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1MzYyMDQsImV4cCI6MjA4MzExMjIwNH0.rh08OeY1ba-uTidZAiG3W3fWZMxQ8WvHuKUxapo5mj4'
} as const;

// Stripe webhook (n8n)
export const STRIPE_CONFIG = {
  webhookUrl: 'https://n8n.kyshkov.com/webhook/stripe-checkout',
  timeout: 30000
} as const;

// Theme colors
export const THEME_COLORS = {
  yellow: '#FFD200',
  dark: '#0a0a0a',
  card: '#111111',
  hover: '#1a1a1a',
  border: '#2a2a2a'
} as const;
