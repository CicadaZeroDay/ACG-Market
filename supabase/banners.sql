-- =============================================
-- ACG Market - Banners Table
-- Run this in Supabase SQL Editor
-- =============================================

-- Create banners table
CREATE TABLE IF NOT EXISTS banners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slot VARCHAR(20) NOT NULL CHECK (slot IN ('hero', 'mid', 'grid')),
  title TEXT,
  subtitle TEXT,
  image_url TEXT,
  link_url TEXT,
  link_target VARCHAR(10) DEFAULT '_blank' CHECK (link_target IN ('_blank', '_self')),
  bg_color VARCHAR(20) DEFAULT '#111',
  text_color VARCHAR(20) DEFAULT '#FFD200',
  cta_text VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast active banner queries
CREATE INDEX IF NOT EXISTS idx_banners_active ON banners(slot, is_active, priority DESC);

-- Enable Row Level Security
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

-- Public read policy (anyone can view active banners)
CREATE POLICY "Public can view active banners" ON banners
  FOR SELECT USING (is_active = true);

-- Admin full access (requires authenticated user with admin role)
-- Uncomment if you have auth set up:
-- CREATE POLICY "Admins can manage banners" ON banners
--   FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- For now, allow all operations (disable in production with proper auth)
CREATE POLICY "Allow all for development" ON banners
  FOR ALL USING (true);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_banners_updated_at
  BEFORE UPDATE ON banners
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- Insert Sample Banners
-- =============================================

INSERT INTO banners (slot, title, subtitle, cta_text, link_url, link_target, priority, is_active) VALUES
-- Hero Banners (carousel)
('hero', 'Лови момент — скидка 30%', 'Только 3 дня! Размещайся на топовых каналах по специальной цене', 'Забрать скидку', '#packages', '_self', 10, true),
('hero', '+15 новых каналов', 'Свежие площадки с охватом 500K+ уже в каталоге', 'Смотреть каналы', '#channels', '_self', 5, true),
('hero', 'Black Friday — до 50% OFF', 'Легендарная распродажа стартовала. Не пропусти!', 'За скидками', '#packages', '_self', 3, false),

-- Mid Banner
('mid', 'Приведи друга — заработай 10%', 'Получай бонус с каждой покупки приглашённого друга', 'Участвовать', 'https://t.me/kyshkovinsta_bot', '_blank', 1, true),

-- Grid Banner (in channel cards)
('grid', 'Хочешь в каталог?', 'Добавь свой канал и получай заказы от 100K+ клиентов', 'Стать партнёром', 'https://t.me/kyshkovinsta_bot', '_blank', 1, true);

-- =============================================
-- Useful Queries for Management
-- =============================================

-- View all banners
-- SELECT * FROM banners ORDER BY slot, priority DESC;

-- Activate/Deactivate banner
-- UPDATE banners SET is_active = false WHERE id = 'banner-uuid';

-- Schedule banner (shows only during specific dates)
-- UPDATE banners SET starts_at = '2025-01-15', ends_at = '2025-01-31' WHERE id = 'banner-uuid';

-- Change priority (higher = shown first in carousel)
-- UPDATE banners SET priority = 20 WHERE id = 'banner-uuid';

-- Delete banner
-- DELETE FROM banners WHERE id = 'banner-uuid';
