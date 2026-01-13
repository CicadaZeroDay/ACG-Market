import React, { useEffect, useState, useMemo } from 'react';
import { marketplaceService } from './services/supabase';
import { Channel, Product, Package, FilterType, CartItem, Banner, Review } from './types';
import { ChannelCard } from './components/ChannelCard';
import { CartDrawer } from './components/CartDrawer';
import { GuaranteesSection } from './components/GuaranteesSection';
import { CRMWidget } from './components/CRMWidget';
import { HeroBanner } from './components/HeroBanner';
import { MidBanner } from './components/MidBanner';
import { GridBanner } from './components/GridBanner';
import { ReviewsCarousel } from './components/ReviewsCarousel';
import { translations, Language } from './translations';
import {
  Search,
  LayoutGrid,
  MessageCircle,
  Mic2,
  Package as PackageIcon,
  ShoppingCart,
  TrendingUp,
  BarChart3,
  Users,
  DollarSign,
  Loader2,
  Check,
  Zap,
  Globe,
  Sparkles,
  Crown,
  Rocket,
  MessageSquare
} from 'lucide-react';

function App() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // UX State for highlighting packages
  const [highlightedPackageId, setHighlightedPackageId] = useState<string | null>(null);
  
  // Localization
  const [language, setLanguage] = useState<Language>('ru');
  const t = translations[language];

  // Fetch Data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // We load mock data if API fails, so we expect this to always succeed eventually
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
      } catch (err: any) {
        // Should catch unlikely errors, but service mostly handles fallbacks
        setError(err.message || 'Failed to load data');
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
  const stats = useMemo(() => {
    const totalSubs = channels.reduce((acc, c) => acc + c.subscribers, 0);
    const minPrice = products.length > 0 ? Math.min(...products.map(p => p.base_price)) : 0;
    return {
      channels: channels.filter(c => c.type === 'channel').length,
      chats: channels.filter(c => c.type === 'chat').length,
      subs: totalSubs >= 1000 ? (totalSubs / 1000).toFixed(0) + 'K' : totalSubs,
      minPrice
    };
  }, [channels, products]);

  // Cart Logic
  const createCartItem = (channel: Channel, product: Product, extras: string[], price: number): CartItem => {
    const extraNames: Record<string, string> = { top6: t.product.top6, pin24: t.product.pin24, pin48: t.product.pin48 };
    const details = `${product.name}` + (extras.length > 0 ? ` + ${extras.map(e => extraNames[e]).join(', ')}` : '');
    
    return {
      id: Date.now(),
      type: 'product',
      referenceId: product.id,
      name: product.name,
      channelName: channel.name,
      details,
      price,
      extras
    };
  };

  const addToCart = (channel: Channel, product: Product, extras: string[], price: number) => {
    const newItem = createCartItem(channel, product, extras, price);
    setCart([...cart, newItem]);
    setIsCartOpen(true);
  };

  const buyNow = (channel: Channel, product: Product, extras: string[], price: number) => {
    const newItem = createCartItem(channel, product, extras, price);
    setCart([...cart, newItem]);
    setIsCartOpen(true);
    // In a real app, this might trigger a direct checkout modal instead of just opening cart
  };

  const addPackageToCart = (pkg: Package) => {
    const newItem: CartItem = {
      id: Date.now(),
      type: 'package',
      referenceId: pkg.id,
      name: pkg.name,
      details: t.cart.package,
      price: pkg.price
    };
    setCart([...cart, newItem]);
    setIsCartOpen(true);
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  // UX Function to scroll and highlight package
  const scrollToPackage = (pkgId: string) => {
    const element = document.getElementById(`package-${pkgId}`);
    if (element) {
      // Scroll smoothly to center
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Set highlight state
      setHighlightedPackageId(pkgId);
      // Remove highlight after 2 seconds
      setTimeout(() => setHighlightedPackageId(null), 2000);
    }
  };

  const cartTotal = useMemo(() => cart.reduce((acc, item) => acc + item.price, 0), [cart]);

  if (loading) {
    return (
      <div className="min-h-screen bg-acg-dark flex items-center justify-center text-acg-yellow">
        <Loader2 size={64} className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-acg-dark flex items-center justify-center text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-acg-dark text-white flex font-sans selection:bg-acg-yellow selection:text-black">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-[280px] bg-[#0f0f0f] border-r border-white/5 flex-col fixed h-full z-20">
        <div className="p-8 pb-6">
          <div className="cursor-pointer group flex items-center gap-0">
            {/* Split Colored Logo */}
            <h1 className="font-black text-3xl tracking-tighter transform group-hover:scale-[1.02] transition-transform duration-300">
              <span className="text-acg-yellow drop-shadow-[0_0_8px_rgba(255,210,0,0.4)]">ACG</span>
              <span className="text-white ml-1.5">Market</span>
            </h1>
          </div>
          <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold mt-1 pl-1">{t.sidebar.officialStore}</p>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-8 overflow-y-auto custom-scrollbar">
          <div>
            <h3 className="text-[10px] uppercase text-zinc-500 font-extrabold tracking-wider mb-3 px-4">{t.sidebar.catalog}</h3>
            <div className="space-y-1">
              <button 
                onClick={() => setFilter('all')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${filter === 'all' ? 'bg-acg-yellow text-black shadow-[0_0_15px_rgba(255,210,0,0.3)]' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
              >
                <div className="flex items-center gap-3"><LayoutGrid size={18} className={filter === 'all' ? 'text-black' : 'group-hover:text-acg-yellow transition-colors'} /> {t.sidebar.all}</div>
                <span className={`text-xs font-bold ${filter === 'all' ? 'opacity-100 bg-black/20 px-2 py-0.5 rounded-md' : 'opacity-40'}`}>{channels.length}</span>
              </button>
              <button 
                onClick={() => setFilter('channel')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${filter === 'channel' ? 'bg-acg-yellow text-black shadow-[0_0_15px_rgba(255,210,0,0.3)]' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
              >
                <div className="flex items-center gap-3"><Mic2 size={18} className={filter === 'channel' ? 'text-black' : 'group-hover:text-acg-yellow transition-colors'} /> {t.sidebar.channels}</div>
                <span className={`text-xs font-bold ${filter === 'channel' ? 'opacity-100 bg-black/20 px-2 py-0.5 rounded-md' : 'opacity-40'}`}>{stats.channels}</span>
              </button>
              <button 
                onClick={() => setFilter('chat')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${filter === 'chat' ? 'bg-acg-yellow text-black shadow-[0_0_15px_rgba(255,210,0,0.3)]' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
              >
                <div className="flex items-center gap-3"><MessageCircle size={18} className={filter === 'chat' ? 'text-black' : 'group-hover:text-acg-yellow transition-colors'} /> {t.sidebar.chats}</div>
                <span className={`text-xs font-bold ${filter === 'chat' ? 'opacity-100 bg-black/20 px-2 py-0.5 rounded-md' : 'opacity-40'}`}>{stats.chats}</span>
              </button>
            </div>
          </div>

          <div>
             <h3 className="text-[10px] uppercase text-zinc-500 font-extrabold tracking-wider mb-3 px-4">{t.sidebar.packages}</h3>
             <div className="space-y-1">
               <button
                 onClick={() => scrollToPackage('gold')}
                 className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all group"
               >
                 <div className="flex items-center gap-3"><Rocket size={16} className="group-hover:text-acg-yellow transition-colors" /> GOLD</div>
                 <span className="text-xs font-bold text-zinc-500">$99</span>
               </button>
               <button
                 onClick={() => scrollToPackage('platinum')}
                 className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all group"
               >
                 <div className="flex items-center gap-3"><TrendingUp size={16} className="group-hover:text-acg-yellow transition-colors" /> PLATINUM</div>
                 <div className="flex items-center gap-2">
                   <span className="px-1.5 py-0.5 rounded bg-acg-yellow/20 text-acg-yellow text-[9px] font-bold">ХИТ</span>
                   <span className="text-xs font-bold text-zinc-500">$299</span>
                 </div>
               </button>
               <button
                 onClick={() => scrollToPackage('exclusive')}
                 className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all group"
               >
                 <div className="flex items-center gap-3"><Crown size={16} className="group-hover:text-acg-yellow transition-colors" /> EXCLUSIVE</div>
                 <span className="text-xs font-bold text-acg-yellow">$999</span>
               </button>
               <a
                 href="https://t.me/kyshkovinsta_bot?start=ai_custom"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all group"
               >
                 <div className="flex items-center gap-3"><Sparkles size={16} className="group-hover:text-acg-yellow transition-colors" /> CUSTOM</div>
                 <span className="text-xs text-zinc-600">→</span>
               </a>
             </div>
          </div>
        </nav>

        {/* Language Switcher in Sidebar */}
        <div className="px-6 py-4">
           <div className="flex items-center gap-2 p-2.5 bg-black/40 rounded-xl border border-white/5">
             <Globe size={14} className="text-zinc-500 ml-1" />
             <div className="flex gap-3 text-xs font-bold mx-auto">
               <button onClick={() => setLanguage('ru')} className={`${language === 'ru' ? 'text-acg-yellow' : 'text-zinc-600 hover:text-white'} transition-colors`}>RU</button>
               <span className="text-zinc-800">|</span>
               <button onClick={() => setLanguage('ua')} className={`${language === 'ua' ? 'text-acg-yellow' : 'text-zinc-600 hover:text-white'} transition-colors`}>UA</button>
               <span className="text-zinc-800">|</span>
               <button onClick={() => setLanguage('en')} className={`${language === 'en' ? 'text-acg-yellow' : 'text-zinc-600 hover:text-white'} transition-colors`}>EN</button>
             </div>
           </div>
        </div>

        <div className="p-6 border-t border-white/5 bg-black/20">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-gradient-to-r from-acg-yellow to-[#FFAA00] text-black font-extrabold py-3.5 px-4 rounded-xl flex items-center justify-between hover:translate-y-[-2px] hover:shadow-[0_4px_20px_rgba(255,210,0,0.25)] transition-all duration-300"
          >
            <span className="flex items-center gap-2.5"><ShoppingCart size={20} /> {t.sidebar.cart}</span>
            <span className="bg-black text-acg-yellow min-w-[24px] h-6 flex items-center justify-center rounded-full text-xs font-bold">{cart.length}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-[280px] flex flex-col min-h-screen bg-[#0a0a0a]">
        {/* Sticky Header */}
        <header className="sticky top-0 z-30 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 px-4 sm:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="lg:hidden flex items-center gap-3 w-full">
            <h1 className="font-black text-2xl tracking-tighter">
              <span className="text-acg-yellow drop-shadow-[0_0_5px_rgba(255,210,0,0.5)]">ACG</span>
              <span className="text-white ml-1">Market</span>
            </h1>
            <button onClick={() => setIsCartOpen(true)} className="ml-auto relative w-10 h-10 flex items-center justify-center bg-white/5 rounded-full active:scale-95 transition-transform">
              <ShoppingCart size={20} />
              {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-acg-yellow text-black text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0a0a0a]">{cart.length}</span>}
            </button>
          </div>

          <h2 className="hidden md:block text-2xl font-black text-white/90">
            {t.header.title}
          </h2>

          <div className="relative w-full md:w-[320px] group">
            <input 
              type="text" 
              placeholder={t.header.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#151515] border border-white/10 text-white px-5 py-3 pl-11 rounded-xl focus:outline-none focus:border-acg-yellow/50 focus:ring-1 focus:ring-acg-yellow/50 focus:bg-white/5 transition-all placeholder:text-zinc-600"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-acg-yellow transition-colors" size={18} />
          </div>
        </header>

        <div className="p-4 sm:p-8 flex-1 overflow-y-auto custom-scrollbar">
          {/* Mobile Lang Switcher */}
          <div className="lg:hidden mb-6 flex justify-end">
             <div className="flex items-center gap-3 text-sm font-bold bg-[#151515] p-2 rounded-lg border border-white/5 shadow-sm">
               <button onClick={() => setLanguage('ru')} className={`${language === 'ru' ? 'text-acg-yellow' : 'text-zinc-500'}`}>RU</button>
               <span className="text-zinc-700">|</span>
               <button onClick={() => setLanguage('ua')} className={`${language === 'ua' ? 'text-acg-yellow' : 'text-zinc-500'}`}>UA</button>
               <span className="text-zinc-700">|</span>
               <button onClick={() => setLanguage('en')} className={`${language === 'en' ? 'text-acg-yellow' : 'text-zinc-500'}`}>EN</button>
             </div>
          </div>

          {/* Hero Banner Carousel */}
          {heroBanners.length > 0 && <HeroBanner banners={heroBanners} />}

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
             {[
               { icon: Mic2, label: t.stats.channels, value: stats.channels },
               { icon: MessageCircle, label: t.stats.chats, value: stats.chats },
               { icon: Users, label: t.stats.subs, value: stats.subs },
               { icon: DollarSign, label: t.stats.minPrice, value: `$${stats.minPrice}` }
             ].map((s, i) => (
               <div key={i} className="bg-[#111] border border-white/5 rounded-2xl p-5 hover:border-acg-yellow/30 hover:bg-[#151515] transition-all duration-300 group cursor-default">
                 <s.icon className="text-zinc-600 mb-2 group-hover:text-acg-yellow group-hover:scale-110 transition-all duration-300 origin-left" size={24} />
                 <div className="text-2xl font-black text-white">{s.value}</div>
                 <div className="text-xs text-zinc-500 uppercase font-bold tracking-wider mt-1">{s.label}</div>
               </div>
             ))}
          </div>

          {/* Premium Packages Section */}
          <div id="packages" className="mb-16">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-black mb-3">
                Выберите свой <span className="text-acg-yellow">уровень</span>
              </h2>
              <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
                От первых шагов до полного доминирования на рынке
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {/* GOLD Card */}
              <div id="package-gold" className="card-gold rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center gap-2 mb-4">
                  <Rocket className="text-acg-yellow/60" size={20} />
                  <span className="text-xs font-bold uppercase tracking-wider text-acg-yellow/50">Для старта</span>
                </div>
                <h3 className="text-2xl font-black text-white mb-2">GOLD</h3>
                <p className="text-zinc-500 text-sm mb-6 min-h-[40px]">Идеально для первых шагов</p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <Check size={14} className="text-acg-yellow/70" /> 5 публикаций
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <Check size={14} className="text-acg-yellow/70" /> 1 закреп
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <Check size={14} className="text-acg-yellow/70" /> Базовая аналитика
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-3xl font-black text-white">$99</span>
                </div>

                <button
                  onClick={() => addPackageToCart({ id: 'gold', name: 'GOLD', slug: 'gold', category: 'ad', description: 'Идеально для первых шагов', price: 99, posts_count: 5, includes_pin: true, pin_count: 1, bonus_posts: 0, discount_percent: 0, is_popular: false })}
                  className="w-full py-3 bg-zinc-800 text-white font-semibold rounded-xl hover:bg-acg-yellow hover:text-black transition-all duration-300"
                >
                  Начать
                </button>
              </div>

              {/* PLATINUM Card */}
              <div id="package-platinum" className="card-platinum rounded-2xl p-6 animate-fade-in-up relative" style={{ animationDelay: '0.2s' }}>
                <div className="absolute top-4 right-4 bg-acg-yellow/20 text-acg-yellow text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                  Хит
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="text-acg-yellow/70" size={20} />
                  <span className="text-xs font-bold uppercase tracking-wider text-acg-yellow/50">Для роста</span>
                </div>
                <h3 className="text-2xl font-black text-white mb-2">PLATINUM</h3>
                <p className="text-zinc-500 text-sm mb-6 min-h-[40px]">Для стабильного дохода</p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <Check size={14} className="text-acg-yellow" /> 15 публикаций
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <Check size={14} className="text-acg-yellow" /> 5 закрепов
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <Check size={14} className="text-acg-yellow" /> Приоритетная поддержка
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <Check size={14} className="text-acg-yellow" /> Расширенная аналитика
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-3xl font-black text-white">$299</span>
                </div>

                <button
                  onClick={() => addPackageToCart({ id: 'platinum', name: 'PLATINUM', slug: 'platinum', category: 'ad', description: 'Для стабильного дохода', price: 299, posts_count: 15, includes_pin: true, pin_count: 5, bonus_posts: 0, discount_percent: 0, is_popular: true })}
                  className="w-full py-3 bg-acg-yellow/90 text-black font-semibold rounded-xl hover:bg-acg-yellow transition-all duration-300"
                >
                  Выбрать
                </button>
              </div>

              {/* EXCLUSIVE Card */}
              <div id="package-exclusive" className="card-exclusive rounded-2xl p-6 animate-fade-in-up relative" style={{ animationDelay: '0.3s' }}>
                <div className="absolute top-4 right-4 bg-acg-yellow text-black text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <Crown size={10} /> VIP
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <Crown className="text-acg-yellow" size={20} />
                  <span className="text-xs font-bold uppercase tracking-wider text-acg-yellow/70">Максимум</span>
                </div>
                <h3 className="text-2xl font-black text-acg-yellow mb-2">EXCLUSIVE</h3>
                <p className="text-zinc-500 text-sm mb-6 min-h-[40px]">Полное доминирование</p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-zinc-300">
                    <Check size={14} className="text-acg-yellow" /> 50 публикаций
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-300">
                    <Check size={14} className="text-acg-yellow" /> Безлимит закрепов
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-300">
                    <Check size={14} className="text-acg-yellow" /> Личный менеджер 24/7
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-300">
                    <Check size={14} className="text-acg-yellow" /> Эксклюзивные площадки
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-300">
                    <Check size={14} className="text-acg-yellow" /> Гарантия результата
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-3xl font-black text-acg-yellow">$999</span>
                </div>

                <button
                  onClick={() => addPackageToCart({ id: 'exclusive', name: 'EXCLUSIVE', slug: 'exclusive', category: 'ad', description: 'Полное доминирование', price: 999, posts_count: 50, includes_pin: true, pin_count: 99, bonus_posts: 0, discount_percent: 0, is_popular: false })}
                  className="w-full py-3 bg-acg-yellow text-black font-bold rounded-xl hover:bg-white transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,210,0,0.3)]"
                >
                  Получить доступ
                </button>
              </div>

              {/* CUSTOM Card - AI/Manager */}
              <div id="package-custom" className="card-custom rounded-2xl p-6 animate-fade-in-up relative" style={{ animationDelay: '0.4s' }}>
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="text-acg-yellow/70" size={20} />
                  <span className="text-xs font-bold uppercase tracking-wider text-acg-yellow/50">Персональный</span>
                </div>
                <h3 className="text-2xl font-black text-white mb-2">CUSTOM</h3>
                <p className="text-zinc-500 text-sm mb-6 min-h-[40px]">ИИ соберёт идеальный пакет</p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <Sparkles size={14} className="text-acg-yellow/70" /> Анализ ваших целей
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <Sparkles size={14} className="text-acg-yellow/70" /> Персональная подборка
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <Sparkles size={14} className="text-acg-yellow/70" /> Оптимальный бюджет
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <MessageSquare size={14} className="text-acg-yellow/70" /> Консультация
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-xl font-bold text-zinc-400">Индивидуально</span>
                </div>

                <div className="space-y-2">
                  <a
                    href="https://t.me/kyshkovinsta_bot?start=ai_custom"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-zinc-800 text-white font-semibold rounded-xl hover:bg-acg-yellow hover:text-black transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Sparkles size={16} /> Подобрать с ИИ
                  </a>
                  <a
                    href="https://t.me/kyshkovinsta_bot?start=manager"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 border border-zinc-700 text-zinc-400 font-medium rounded-xl hover:border-acg-yellow hover:text-acg-yellow transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                  >
                    <MessageSquare size={14} /> Написать менеджеру
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Mid Banner */}
          {midBanner && <MidBanner banner={midBanner} />}

          {/* Guarantees Section */}
          <GuaranteesSection t={t} />

          {/* Reviews Carousel */}
          {reviews.length > 0 && <ReviewsCarousel reviews={reviews} t={t} />}

          {/* Channels Grid */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-acg-yellow/10 rounded-lg">
                <LayoutGrid className="text-acg-yellow" size={20} />
              </div>
              <h2 className="text-xl font-bold tracking-tight">{t.sidebar.all}</h2>
            </div>

            {filteredChannels.length === 0 ? (
               <div className="text-center py-20 text-zinc-500 bg-[#111] rounded-3xl border border-white/5">
                 <Search size={48} className="mx-auto mb-4 opacity-20" />
                 <p className="text-lg font-medium">{t.product.notFound}</p>
               </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {filteredChannels.map((channel, index) => (
                  <React.Fragment key={channel.id}>
                    {/* Insert GridBanner at position 4 (5th item) */}
                    {index === 4 && gridBanner && (
                      <GridBanner banner={gridBanner} t={t} />
                    )}
                    <ChannelCard
                      channel={channel}
                      products={products.filter(p => p.channel_id === channel.id)}
                      onAddToCart={addToCart}
                      onBuyNow={buyNow}
                      t={t}
                    />
                  </React.Fragment>
                ))}
                {/* If less than 5 channels, show GridBanner at the end */}
                {filteredChannels.length < 5 && filteredChannels.length > 0 && gridBanner && (
                  <GridBanner banner={gridBanner} t={t} />
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onRemove={removeFromCart}
        total={cartTotal}
        t={t}
      />

      {/* CRM Widget - Floating Telegram Button */}
      <CRMWidget t={t} botUsername="kyshkovinsta_bot" hidden={isCartOpen} />
    </div>
  );
}

export default App;