import { useState, useEffect, useMemo } from 'react';
import { marketplaceService } from '@/lib/supabase/client';
import { Channel, Product, Package, Banner, Review } from '@/lib/types';

interface MarketplaceData {
  channels: Channel[];
  products: Product[];
  packages: Package[];
  banners: Banner[];
  reviews: Review[];
  loading: boolean;
  error: string | null;
}

interface BannerSelectors {
  heroBanners: Banner[];
  midBanner: Banner | undefined;
  gridBanner: Banner | undefined;
}

export function useMarketplaceData(): MarketplaceData & BannerSelectors {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [c, p, pkg, b, r] = await Promise.all([
          marketplaceService.getChannels(),
          marketplaceService.getProducts(),
          marketplaceService.getPackages(),
          marketplaceService.getBanners(),
          marketplaceService.getReviews()
        ]);
        setChannels(c);
        setProducts(p);
        setPackages(pkg);
        setBanners(b);
        setReviews(r);
        setError(null);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to load data';
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Banner filtering by slot
  const heroBanners = useMemo(() => banners.filter(b => b.slot === 'hero'), [banners]);
  const midBanner = useMemo(() => banners.find(b => b.slot === 'mid'), [banners]);
  const gridBanner = useMemo(() => banners.find(b => b.slot === 'grid'), [banners]);

  return {
    channels,
    products,
    packages,
    banners,
    reviews,
    loading,
    error,
    heroBanners,
    midBanner,
    gridBanner
  };
}
