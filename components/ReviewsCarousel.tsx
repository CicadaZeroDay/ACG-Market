'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Review } from '@/lib/types';
import { Star, ChevronLeft, ChevronRight, Quote, MessageCircle } from 'lucide-react';
import { translations } from '@/lib/translations';

type TranslationType = typeof translations.ru;

interface ReviewsCarouselProps {
  reviews: Review[];
  t: TranslationType;
}

export const ReviewsCarousel: React.FC<ReviewsCarouselProps> = ({ reviews, t }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const activeReviews = reviews.filter(r => r.is_active);

  const nextSlide = useCallback(() => {
    if (activeReviews.length <= 1 || isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % activeReviews.length);
    setTimeout(() => setIsAnimating(false), 500);
  }, [activeReviews.length, isAnimating]);

  const prevSlide = useCallback(() => {
    if (activeReviews.length <= 1 || isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + activeReviews.length) % activeReviews.length);
    setTimeout(() => setIsAnimating(false), 500);
  }, [activeReviews.length, isAnimating]);

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Auto-scroll
  useEffect(() => {
    if (isPaused || activeReviews.length <= 1) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide, activeReviews.length]);

  if (activeReviews.length === 0) return null;

  const currentReview = activeReviews[currentIndex];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <section
      className="relative py-16"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-acg-yellow/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-acg-yellow/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="text-center mb-12 relative">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-acg-yellow/10 border border-acg-yellow/20 rounded-full mb-4">
          <MessageCircle size={16} className="text-acg-yellow" />
          <span className="text-acg-yellow text-sm font-medium">{t.reviews?.title || 'Отзывы клиентов'}</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
          {t.reviews?.heading || 'Что говорят наши клиенты'}
        </h2>
        <p className="text-zinc-500 max-w-2xl mx-auto">
          {t.reviews?.subtitle || 'Реальные отзывы от тех, кто уже работает с нами'}
        </p>
      </div>

      {/* Carousel Container */}
      <div className="relative max-w-4xl mx-auto px-4">
        {/* Glow effect */}
        <div className="absolute -inset-4 bg-acg-yellow/10 rounded-3xl blur-2xl opacity-30" />

        {/* Review Card */}
        <div className="relative bg-gradient-to-b from-zinc-900/80 to-zinc-900/40 border border-acg-yellow/20 rounded-2xl overflow-hidden backdrop-blur-sm">
          {/* Quote Icon */}
          <div className="absolute top-6 right-6 opacity-10">
            <Quote size={80} className="text-acg-yellow" />
          </div>

          <div className="p-8 md:p-12">
            {/* Author Info */}
            <div className="flex items-center gap-4 mb-6">
              {currentReview.author_avatar ? (
                <img
                  src={currentReview.author_avatar}
                  alt={currentReview.author_name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-acg-yellow/30"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-acg-yellow/20 flex items-center justify-center">
                  <span className="text-acg-yellow text-xl font-bold">
                    {currentReview.author_name.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <h4 className="text-white font-semibold text-lg">{currentReview.author_name}</h4>
                {currentReview.author_company && (
                  <p className="text-zinc-500 text-sm">{currentReview.author_company}</p>
                )}
              </div>
              <div className="ml-auto flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={i < currentReview.rating ? 'text-acg-yellow fill-acg-yellow' : 'text-zinc-600'}
                  />
                ))}
              </div>
            </div>

            {/* Review Text */}
            <blockquote className="text-lg md:text-xl text-zinc-300 leading-relaxed mb-6 min-h-[80px]">
              "{currentReview.text}"
            </blockquote>

            {/* Screenshot if exists */}
            {currentReview.image_url && (
              <div className="mt-6 rounded-lg overflow-hidden border border-zinc-800">
                <img
                  src={currentReview.image_url}
                  alt="Скриншот отзыва"
                  className="w-full max-h-64 object-contain bg-zinc-900"
                />
              </div>
            )}

            {/* Date */}
            <div className="mt-6 text-zinc-600 text-sm">
              {formatDate(currentReview.date)}
            </div>
          </div>

          {/* Navigation Arrows */}
          {activeReviews.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-acg-yellow/20 border border-zinc-700 hover:border-acg-yellow/50 rounded-full transition-all"
                aria-label="Предыдущий отзыв"
              >
                <ChevronLeft size={24} className="text-white" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-acg-yellow/20 border border-zinc-700 hover:border-acg-yellow/50 rounded-full transition-all"
                aria-label="Следующий отзыв"
              >
                <ChevronRight size={24} className="text-white" />
              </button>
            </>
          )}
        </div>

        {/* Dots Navigation */}
        {activeReviews.length > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {activeReviews.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-8 bg-acg-yellow'
                    : 'w-2 bg-zinc-600 hover:bg-zinc-500'
                }`}
                aria-label={`Отзыв ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Counter */}
        {activeReviews.length > 1 && (
          <div className="text-center mt-4 text-zinc-600 text-sm">
            {currentIndex + 1} / {activeReviews.length}
          </div>
        )}
      </div>
    </section>
  );
};
