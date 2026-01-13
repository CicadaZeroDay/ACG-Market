-- =============================================
-- ACG Market - Reviews Table
-- Run this in Supabase SQL Editor
-- =============================================

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_name VARCHAR(100) NOT NULL,
  author_avatar TEXT,
  author_company VARCHAR(100),
  text TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  image_url TEXT,
  date DATE DEFAULT CURRENT_DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast active reviews queries
CREATE INDEX IF NOT EXISTS idx_reviews_active ON reviews(is_active, date DESC);

-- Enable Row Level Security
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Public read policy (anyone can view active reviews)
CREATE POLICY "Public can view active reviews" ON reviews
  FOR SELECT USING (is_active = true);

-- For development, allow all operations (disable in production with proper auth)
CREATE POLICY "Allow all for development" ON reviews
  FOR ALL USING (true);

-- Auto-update updated_at timestamp (reuse function if exists from banners)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- Insert Sample Reviews
-- =============================================

INSERT INTO reviews (author_name, author_avatar, author_company, text, rating, date, is_active) VALUES
-- Review 1
('Анна Ковальчук',
 'https://randomuser.me/api/portraits/women/44.jpg',
 'Digital Agency',
 'Разместили рекламу на 5 каналах — получили 200+ заявок за неделю! Сервис топ, менеджеры помогли с креативом. Обязательно вернёмся ещё!',
 5,
 '2025-01-10',
 true),

-- Review 2
('Мария Светлова',
 'https://randomuser.me/api/portraits/women/68.jpg',
 'HR Manager',
 'Искали специалистов через HR каналы — закрыли 3 вакансии за 2 недели. Цены адекватные, охваты реальные. Рекомендую!',
 5,
 '2025-01-08',
 true),

-- Review 3
('Елена Миронова',
 'https://randomuser.me/api/portraits/women/33.jpg',
 'Crypto Project',
 'Продвигали крипто-проект. Взяли пакет Platinum — результат превзошёл ожидания. Подписчики живые, конверсия в разы выше чем у конкурентов.',
 5,
 '2025-01-05',
 true),

-- Review 4
('Ольга Демченко',
 'https://randomuser.me/api/portraits/women/85.jpg',
 'Онлайн-школа',
 'Запускали вебинар, нужны были быстро регистрации. ACG Market сделал всё за 24 часа — собрали 500+ участников. Буду работать только с вами!',
 5,
 '2025-01-03',
 true),

-- Review 5
('Наталья Волкова',
 'https://randomuser.me/api/portraits/women/90.jpg',
 'E-commerce',
 'Отличный сервис! Удобный интерфейс, прозрачные цены. Менеджер всегда на связи. Результаты отслеживаем — ROI положительный.',
 4,
 '2024-12-28',
 true);

-- =============================================
-- Useful Queries for Management
-- =============================================

-- View all reviews
-- SELECT * FROM reviews ORDER BY date DESC;

-- Activate/Deactivate review
-- UPDATE reviews SET is_active = false WHERE id = 'review-uuid';

-- Add new review
-- INSERT INTO reviews (author_name, author_avatar, author_company, text, rating)
-- VALUES ('Name', 'avatar_url', 'Company', 'Review text', 5);

-- Update review rating
-- UPDATE reviews SET rating = 5 WHERE id = 'review-uuid';

-- Delete review
-- DELETE FROM reviews WHERE id = 'review-uuid';

-- Get average rating
-- SELECT AVG(rating)::numeric(3,2) as avg_rating FROM reviews WHERE is_active = true;
