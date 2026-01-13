import { getAllMarketplaceData } from '@/lib/supabase/server';
import { MarketplacePage } from '@/components/MarketplacePage';

// Revalidate every 60 seconds
export const revalidate = 60;

export default async function Home() {
  // Server-side data fetching
  const { channels, products, packages, banners, reviews } = await getAllMarketplaceData();

  return (
    <MarketplacePage
      initialChannels={channels}
      initialProducts={products}
      initialPackages={packages}
      initialBanners={banners}
      initialReviews={reviews}
    />
  );
}
