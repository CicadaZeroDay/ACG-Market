-- =============================================
-- ACG Market - Crypto Payments Table
-- Run this in Supabase SQL Editor
-- =============================================

-- Create crypto_payments table
CREATE TABLE IF NOT EXISTS crypto_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id VARCHAR(100) NOT NULL,
  amount_usd DECIMAL(10,2) NOT NULL,
  crypto_currency VARCHAR(50) NOT NULL,
  wallet_address TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'verifying', 'completed', 'expired', 'failed')),
  tx_hash_provided TEXT,
  tx_hash_verified TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast queries
CREATE INDEX IF NOT EXISTS idx_crypto_payments_order ON crypto_payments(order_id);
CREATE INDEX IF NOT EXISTS idx_crypto_payments_status ON crypto_payments(status);
CREATE INDEX IF NOT EXISTS idx_crypto_payments_expires ON crypto_payments(expires_at) WHERE status = 'pending';

-- Enable Row Level Security
ALTER TABLE crypto_payments ENABLE ROW LEVEL SECURITY;

-- For development, allow all operations (disable in production with proper auth)
CREATE POLICY "Allow all for development" ON crypto_payments
  FOR ALL USING (true);

-- Auto-update updated_at timestamp (reuse function if exists from other tables)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_crypto_payments_updated_at
  BEFORE UPDATE ON crypto_payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- Useful Queries for Management
-- =============================================

-- View all payments
-- SELECT * FROM crypto_payments ORDER BY created_at DESC;

-- View pending payments
-- SELECT * FROM crypto_payments WHERE status = 'pending' ORDER BY created_at DESC;

-- Mark payment as completed
-- UPDATE crypto_payments SET status = 'completed', verified_at = now() WHERE id = 'payment-uuid';

-- Check expired payments
-- UPDATE crypto_payments SET status = 'expired' WHERE status = 'pending' AND expires_at < now();
