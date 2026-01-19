'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase/client';

interface CryptoCheckoutProps {
  orderId: string;
  amountUsd: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface CryptoOption {
  id: string;
  name: string;
  network: string;
  icon: string;
  address: string;
  minDeposit: string;
  processingTime: string;
}

const CRYPTO_OPTIONS: CryptoOption[] = [
  {
    id: 'USDT_TRC20',
    name: 'USDT',
    network: 'Tron (TRC-20)',
    icon: '💎',
    address: 'TA6cwUPYLBg76bUVFwBmHdmU7J8PCLBmpK',
    minDeposit: '5 USDT',
    processingTime: '~1 хв',
  },
  {
    id: 'BTC',
    name: 'Bitcoin',
    network: 'Bitcoin Network',
    icon: '₿',
    address: '34maYP8LaEYLL4axS8mheRavMLisjtJC7J',
    minDeposit: '0.0001 BTC',
    processingTime: '~45 хв',
  },
];

type Step = 'select' | 'payment' | 'verify' | 'success';

export default function CryptoCheckout({
  orderId,
  amountUsd,
  onSuccess,
  onCancel,
}: CryptoCheckoutProps) {
  const [step, setStep] = useState<Step>('select');
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoOption | null>(null);
  const [txHash, setTxHash] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [copied, setCopied] = useState<'address' | 'amount' | null>(null);

  const createPayment = async (crypto: CryptoOption) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: dbError } = await supabase
        .from('crypto_payments')
        .insert({
          order_id: orderId,
          amount_usd: amountUsd,
          crypto_currency: crypto.id,
          wallet_address: crypto.address,
          status: 'pending',
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        })
        .select()
        .single();

      if (dbError) {
        // If table doesn't exist, proceed anyway for testing
        console.warn('DB Error (proceeding anyway):', dbError.message);
        setPaymentId(`temp_${Date.now()}`);
      } else {
        setPaymentId(data.id);
      }

      setSelectedCrypto(crypto);
      setStep('payment');
    } catch (err) {
      // Even on error, allow proceeding to payment step for testing
      console.warn('Payment creation error:', err);
      setPaymentId(`temp_${Date.now()}`);
      setSelectedCrypto(crypto);
      setStep('payment');
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async () => {
    if (!txHash.trim()) {
      setError('Введіть TX Hash');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Зберігаємо TX Hash
      await supabase
        .from('crypto_payments')
        .update({
          tx_hash_provided: txHash.trim(),
          status: 'verifying',
        })
        .eq('id', paymentId);

      // Викликаємо Edge Function для перевірки
      const response = await fetch('/api/verify-crypto-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, txHash: txHash.trim() }),
      });

      const result = await response.json();

      if (result.success) {
        setStep('success');
        onSuccess?.();
      } else {
        setError(result.message || 'Платіж не знайдено. Зачекайте підтвердження мережі.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка верифікації');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: 'address' | 'amount') => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const getQRUrl = (address: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(address)}`;
  };

  // Крок 1: Вибір криптовалюти
  if (step === 'select') {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg">
        <h3 className="text-xl font-semibold mb-2">Оплата криптовалютою</h3>
        <p className="text-gray-500 mb-6">Виберіть спосіб оплати</p>

        <div className="space-y-3">
          {CRYPTO_OPTIONS.map((crypto) => (
            <button
              key={crypto.id}
              onClick={() => createPayment(crypto)}
              disabled={loading}
              className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-purple-500 bg-white flex items-center justify-between transition-all disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{crypto.icon}</span>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">{crypto.name} <span className="font-normal text-gray-500">•</span> {crypto.network}</div>
                </div>
              </div>
              <div className="text-right text-sm text-gray-500">
                <div>{crypto.processingTime}</div>
                <div>мін. {crypto.minDeposit}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-xl flex justify-between items-center">
          <span className="text-gray-600">До оплати:</span>
          <span className="font-bold text-xl text-gray-900">${amountUsd.toFixed(2)}</span>
        </div>

        {onCancel && (
          <button onClick={onCancel} className="mt-4 w-full p-3 text-gray-500 hover:text-gray-700">
            ← Назад
          </button>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>
        )}
      </div>
    );
  }

  // Крок 2: Інструкції оплати
  if (step === 'payment' && selectedCrypto) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg">
        <h3 className="text-xl font-semibold mb-2">Надішліть {selectedCrypto.name}</h3>
        <p className="text-gray-500 mb-4">{selectedCrypto.network}</p>

        <div className="flex justify-center mb-6">
          <div className="p-4 bg-white rounded-xl shadow-sm border">
            <img src={getQRUrl(selectedCrypto.address)} alt="QR Code" className="w-48 h-48" />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">Сума:</label>
          <div
            onClick={() => copyToClipboard(amountUsd.toString(), 'amount')}
            className="flex items-center justify-between p-4 bg-purple-50 rounded-xl cursor-pointer hover:bg-purple-100"
          >
            <span className="font-mono text-2xl font-bold text-purple-700">${amountUsd.toFixed(2)}</span>
            <span className="text-sm text-purple-600">
              {copied === 'amount' ? '✓ Скопійовано!' : 'Копіювати'}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm text-gray-500 mb-1">Адреса гаманця:</label>
          <div
            onClick={() => copyToClipboard(selectedCrypto.address, 'address')}
            className="p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100"
          >
            <div className="font-mono text-sm break-all mb-2 text-gray-900 font-medium">{selectedCrypto.address}</div>
            <div className="text-sm text-gray-500 text-right">
              {copied === 'address' ? '✓ Скопійовано!' : 'Натисніть щоб копіювати'}
            </div>
          </div>
        </div>

        <button
          onClick={() => setStep('verify')}
          className="w-full p-4 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700"
        >
          Я оплатив — ввести TX Hash
        </button>

        <button
          onClick={() => { setStep('select'); setSelectedCrypto(null); }}
          className="mt-3 w-full p-3 text-gray-500 hover:text-gray-700"
        >
          ← Обрати інший спосіб
        </button>
      </div>
    );
  }

  // Крок 3: Верифікація TX Hash
  if (step === 'verify' && selectedCrypto) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg">
        <h3 className="text-xl font-semibold mb-2">Підтвердження оплати</h3>
        <p className="text-gray-500 mb-6">Введіть TX Hash вашої транзакції</p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">TX Hash:</label>
          <input
            type="text"
            value={txHash}
            onChange={(e) => setTxHash(e.target.value)}
            placeholder="Вставте TX Hash транзакції..."
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none font-mono text-sm text-gray-900 bg-white placeholder-gray-400"
          />
          <p className="mt-2 text-sm text-gray-500">
            TX Hash можна знайти в історії транзакцій вашого гаманця
          </p>
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded-xl">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Сума:</span>
            <span className="font-semibold text-gray-900">${amountUsd.toFixed(2)} {selectedCrypto.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Мережа:</span>
            <span className="font-semibold text-gray-900">{selectedCrypto.network}</span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>
        )}

        <button
          onClick={verifyPayment}
          disabled={loading || !txHash.trim()}
          className="w-full p-4 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loading ? 'Перевіряємо...' : 'Перевірити оплату'}
        </button>

        <button
          onClick={() => setStep('payment')}
          className="mt-3 w-full p-3 text-gray-500 hover:text-gray-700"
        >
          ← Назад до інструкцій
        </button>
      </div>
    );
  }

  // Крок 4: Успіх
  if (step === 'success') {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg text-center">
        <div className="text-6xl mb-4">✅</div>
        <h3 className="text-2xl font-semibold text-green-700 mb-2">Оплату підтверджено!</h3>
        <p className="text-gray-600 mb-6">Дякуємо за покупку!</p>
        <div className="p-4 bg-green-50 rounded-xl text-sm text-green-700">
          Сума: ${amountUsd.toFixed(2)} {selectedCrypto?.name}
        </div>
      </div>
    );
  }

  return null;
}
