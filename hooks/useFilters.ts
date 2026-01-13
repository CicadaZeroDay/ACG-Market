import { useState, useMemo } from 'react';
import { Channel, Product, FilterType } from '@/lib/types';

interface UseFiltersOptions {
  channels: Channel[];
  products: Product[];
}

interface FilterState {
  filter: FilterType;
  searchQuery: string;
}

interface Stats {
  channels: number;
  chats: number;
  subs: string | number;
  minPrice: number;
}

interface UseFiltersReturn extends FilterState {
  setFilter: (filter: FilterType) => void;
  setSearchQuery: (query: string) => void;
  filteredChannels: Channel[];
  stats: Stats;
}

export function useFilters({ channels, products }: UseFiltersOptions): UseFiltersReturn {
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter Logic
  const filteredChannels = useMemo(() => {
    return channels.filter(c => {
      const matchesType = filter === 'all' || c.type === filter;
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (c.username || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [channels, filter, searchQuery]);

  // Stats
  const stats = useMemo<Stats>(() => {
    const totalSubs = channels.reduce((acc, c) => acc + c.subscribers, 0);
    const minPrice = products.length > 0 ? Math.min(...products.map(p => p.base_price)) : 0;
    return {
      channels: channels.filter(c => c.type === 'channel').length,
      chats: channels.filter(c => c.type === 'chat').length,
      subs: totalSubs >= 1000 ? (totalSubs / 1000).toFixed(0) + 'K' : totalSubs,
      minPrice
    };
  }, [channels, products]);

  return {
    filter,
    searchQuery,
    setFilter,
    setSearchQuery,
    filteredChannels,
    stats
  };
}
