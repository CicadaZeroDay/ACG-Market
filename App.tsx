import React, { useEffect, useState, useMemo } from 'react';
import { marketplaceService } from './services/supabase';
import { Channel, Product, Package, FilterType, CartItem } from './types';
import { ChannelCard } from './components/ChannelCard';
import { CartDrawer } from './components/CartDrawer';
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
  Globe
} from 'lucide-react';

function App() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
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
        const [c, p, pkg] = await Promise.all([
          marketplaceService.getChannels(),
          marketplaceService.getProducts(),
          marketplaceService.getPackages()
        ]);
        setChannels(c);
        setProducts(p);
        setPackages(pkg);
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
                 onClick={() => scrollToPackage('pkg1')} 
                 className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all group"
               >
                 <div className="flex items-center gap-3"><PackageIcon size={18} className="group-hover:text-acg-yellow transition-colors" /> {t.packages.smart}</div>
                 <span className="px-2 py-0.5 rounded-md bg-green-500/10 text-green-400 text-[10px] font-bold border border-green-500/20">-50%</span>
               </button>
               <button 
                 onClick={() => scrollToPackage('pkg2')} 
                 className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all group"
               >
                 <div className="flex items-center gap-3"><TrendingUp size={18} className="group-hover:text-acg-yellow transition-colors" /> {t.packages.pro}</div>
                 <span className="px-2 py-0.5 rounded-md bg-green-500/10 text-green-400 text-[10px] font-bold border border-green-500/20">-60%</span>
               </button>
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

          {/* Packages Section */}
          {packages.length > 0 && (
            <div id="packages" className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-acg-yellow/10 rounded-lg">
                  <PackageIcon className="text-acg-yellow" size={20} />
                </div>
                <h2 className="text-xl font-bold tracking-tight">{t.packages.title}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {packages.map((pkg) => (
                  <div 
                    id={`package-${pkg.id}`}
                    key={pkg.id} 
                    className={`relative bg-[#111] border rounded-2xl p-6 transition-all duration-500 
                      ${highlightedPackageId === pkg.id 
                        ? 'border-acg-yellow ring-2 ring-acg-yellow/50 shadow-[0_0_50px_rgba(255,210,0,0.25)] scale-[1.03] z-10' 
                        : pkg.is_popular 
                          ? 'border-acg-yellow/40 bg-gradient-to-br from-[#111] to-acg-yellow/5 hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]' 
                          : 'border-white/5 hover:border-white/10 hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]'
                      }`}
                  >
                    {pkg.is_popular && (
                      <div className="absolute top-4 right-[-10px] bg-acg-yellow text-black text-[10px] font-bold px-3 py-1 uppercase tracking-wider transform rotate-3 shadow-lg flex items-center gap-1 z-10">
                        <Zap size={10} fill="black" /> {t.packages.popular}
                      </div>
                    )}
                    <h3 className="text-2xl font-black mb-2 text-white">{pkg.name}</h3>
                    <p className="text-zinc-400 text-sm mb-6 h-10 leading-relaxed">{pkg.description}</p>
                    
                    <div className="space-y-4 mb-8 bg-black/20 p-4 rounded-xl">
                       <div className="flex items-center gap-3 text-sm text-zinc-300 font-medium">
                         <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 shadow-[0_0_10px_rgba(34,197,94,0.2)]"><Check size={12} strokeWidth={3} /></div>
                         {pkg.posts_count} {t.packages.posts}
                       </div>
                       {pkg.includes_help && (
                         <div className="flex items-center gap-3 text-sm text-zinc-300 font-medium">
                            <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 shadow-[0_0_10px_rgba(34,197,94,0.2)]"><Check size={12} strokeWidth={3} /></div>
                            {t.packages.help}
                         </div>
                       )}
                       {pkg.includes_stats && (
                         <div className="flex items-center gap-3 text-sm text-zinc-300 font-medium">
                            <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 shadow-[0_0_10px_rgba(34,197,94,0.2)]"><Check size={12} strokeWidth={3} /></div>
                            {t.packages.stats}
                         </div>
                       )}
                    </div>

                    <div className="flex items-end gap-3 mb-6">
                      <span className="text-4xl font-black text-acg-yellow tracking-tight">${pkg.price}</span>
                      {pkg.discount_percent > 0 && (
                        <span className="bg-green-500/10 text-green-400 px-2 py-1 rounded-lg text-xs font-bold mb-2 border border-green-500/20">-{pkg.discount_percent}% {t.packages.discount}</span>
                      )}
                    </div>

                    <button 
                      onClick={() => addPackageToCart(pkg)}
                      className={`w-full py-3.5 font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${pkg.is_popular ? 'bg-acg-yellow text-black hover:bg-[#FFE066] shadow-[0_0_20px_rgba(255,210,0,0.15)]' : 'bg-zinc-800 text-white hover:bg-white hover:text-black border border-white/5'}`}
                    >
                      {t.packages.select}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

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
                {filteredChannels.map(channel => (
                  <ChannelCard 
                    key={channel.id} 
                    channel={channel} 
                    products={products.filter(p => p.channel_id === channel.id)}
                    onAddToCart={addToCart}
                    onBuyNow={buyNow}
                    t={t}
                  />
                ))}
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
    </div>
  );
}

export default App;