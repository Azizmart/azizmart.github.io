import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Filter, ShieldCheck, Phone, CheckCircle2, ShoppingCart, X, HelpCircle, ArrowRight, Mic, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Umkm, Product } from '../types';

interface UmkmCatalogProps {
  umkmList: Umkm[];
  onAddUmkm: (newUmkm: Umkm) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
}

export default function UmkmCatalog({
  umkmList,
  onAddUmkm,
  categoryFilter,
  setCategoryFilter,
}: UmkmCatalogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUmkm, setSelectedUmkm] = useState<Umkm | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // States for Voice & Speech features
  const [isListeningLocal, setIsListeningLocal] = useState(false);
  const [speakingProductId, setSpeakingProductId] = useState<string | null>(null);
  const recognitionRefLocal = useRef<any>(null);
  const synthRefLocal = useRef<SpeechSynthesis | null>(null);

  // Initialize Speech components
  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRefLocal.current = window.speechSynthesis;

      // Handle custom global-search event from AsistenDigital
      const handleGlobalSearch = (e: Event) => {
        const customEvent = e as CustomEvent<string>;
        if (customEvent.detail) {
          setSearchQuery(customEvent.detail);
        }
      };
      window.addEventListener('global-search', handleGlobalSearch);

      // Local Speech Recognition setup
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = 'id-ID';

        rec.onstart = () => {
          setIsListeningLocal(true);
        };

        rec.onresult = (event: any) => {
          const resultText = event.results[0][0].transcript;
          // Trim punctuation
          const trimmed = resultText.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim();
          setSearchQuery(trimmed);
        };

        rec.onerror = () => {
          setIsListeningLocal(false);
        };

        rec.onend = () => {
          setIsListeningLocal(false);
        };

        recognitionRefLocal.current = rec;
      }

      return () => {
        window.removeEventListener('global-search', handleGlobalSearch);
        if (synthRefLocal.current) {
          synthRefLocal.current.cancel();
        }
      };
    }
  }, []);

  const triggerLocalVoiceSearch = () => {
    if (!recognitionRefLocal.current) {
      alert('Pencarian suara belum didukung di peramban ini atau membutuhkan pendelegasian izin mikrofon.');
      return;
    }
    if (isListeningLocal) {
      recognitionRefLocal.current.stop();
    } else {
      recognitionRefLocal.current.start();
    }
  };

  const handleSpeakDescription = (id: string, textToSpeak: string) => {
    if (!synthRefLocal.current) return;

    if (speakingProductId === id) {
      synthRefLocal.current.cancel();
      setSpeakingProductId(null);
      return;
    }

    synthRefLocal.current.cancel();
    
    const cleanText = textToSpeak
      .replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '')
      .replace(/\*+/g, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'id-ID';

    const voices = synthRefLocal.current.getVoices();
    const idVoice = voices.find(v => v.lang.includes('id') || v.lang.includes('ID'));
    if (idVoice) {
      utterance.voice = idVoice;
    }

    utterance.onstart = () => {
      setSpeakingProductId(id);
    };

    utterance.onend = () => {
      setSpeakingProductId(null);
    };

    utterance.onerror = () => {
      setSpeakingProductId(null);
    };

    synthRefLocal.current.speak(utterance);
  };

  // Form states for new UMKM
  const [newName, setNewName] = useState('');
  const [newOwner, setNewOwner] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<'Kuliner' | 'Kerajinan' | 'Fashion' | 'Pertanian' | 'Wisata & Jasa'>('Kuliner');
  const [newWhatsapp, setNewWhatsapp] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newPriceRange, setNewPriceRange] = useState('');
  const [newLogo, setNewLogo] = useState('🛍️');
  const [selectedImagePreset, setSelectedImagePreset] = useState(0);

  // Pre-configured Unsplash images to make listings gorgeous instantly
  const IMAGE_PRESETS = [
    { url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop', label: 'Roti & Makanan' },
    { url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=600&auto=format&fit=crop', label: 'Kerajinan & Seni' },
    { url: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=600&auto=format&fit=crop', label: 'Pakaian & Tenun' },
    { url: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?q=80&w=600&auto=format&fit=crop', label: 'Hasil Tani / Kebun' },
    { url: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=600&auto=format&fit=crop', label: 'Wisata Desa' },
  ];

  const categories: string[] = ['Semua', 'Kuliner', 'Kerajinan', 'Fashion', 'Pertanian', 'Wisata & Jasa'];

  // Filter & Search Logic
  const filteredUmkm = umkmList.filter((umkm) => {
    const matchesCategory = categoryFilter === 'Semua' || umkm.category === categoryFilter;
    const matchesSearch =
      umkm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      umkm.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      umkm.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      umkm.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      umkm.products.some((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newOwner || !newDesc || !newWhatsapp || !newAddress || !newPriceRange) {
      alert('Sila lengkapi semua isian formulir.');
      return;
    }

    // Clean whatsapp number (replace non-digits)
    const rawWa = newWhatsapp.replace(/\D/g, '');
    const cleanWa = rawWa.startsWith('0') ? '62' + rawWa.substring(1) : rawWa;

    const newUmkm: Umkm = {
      id: `umkm-${Date.now()}`,
      name: newName,
      owner: newOwner,
      description: newDesc,
      category: newCategory,
      image: IMAGE_PRESETS[selectedImagePreset].url,
      logo: newLogo,
      whatsapp: cleanWa,
      address: newAddress,
      priceRange: newPriceRange,
      rating: 4.8,
      isVerified: false, // Default newly registered to false until verified by admin
      products: [
        {
          name: `Produk Perdana ${newName}`,
          price: newPriceRange.split('-')[0].trim() || '25.000',
          description: 'Produk lokal terbaik hasil karya unggulan masyarakat asli Desa Harumandala.',
          image: IMAGE_PRESETS[selectedImagePreset].url
        }
      ],
      createdAt: new Date().toISOString().substring(0, 10),
    };

    onAddUmkm(newUmkm);
    setIsRegisterOpen(false);

    // Reset Form
    setNewName('');
    setNewOwner('');
    setNewDesc('');
    setNewCategory('Kuliner');
    setNewWhatsapp('');
    setNewAddress('');
    setNewPriceRange('');
    setNewLogo('🛍️');
    setSelectedImagePreset(0);
  };

  const getWaLink = (umkm: Umkm, product?: Product) => {
    const baseText = `Halo *${umkm.name}*, saya mengunjungi portal online Desa Harumandala.\n\n`;
    const orderText = product
      ? `Saya tertarik memesan produk berikut:\n*Nama Produk:* ${product.name}\n*Harga:* Rp ${product.price}\n\nApakah stok tersedia saat ini?`
      : `Saya ingin bertanya mengenai usaha Bapak/Ibu. Apakah bisa berkonsultasi mengenai detail produk?`;
    
    return `https://wa.me/${umkm.whatsapp}?text=${encodeURIComponent(baseText + orderText)}`;
  };

  return (
    <div id="umkm-catalog-root" className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Intro Header */}
      <div className="text-center md:text-left flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-stone-200 pb-8">
        <div className="space-y-2">
          <span className="text-xs font-semibold text-emerald-800 uppercase tracking-widest block">Galeri Niaga Online</span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-stone-900 font-serif tracking-tight">Direktori UMKM Harumandala</h1>
          <p className="text-sm text-stone-500 max-w-2xl leading-relaxed">
            Temukan dan beli produk langsung dari warga desa. Transaksi tanpa potongan perantara, didukung keamanan komunikasi WhatsApp jalur resmi langsung ke produsen.
          </p>
        </div>
        <button
          id="btn-trigger-register-umkm"
          onClick={() => setIsRegisterOpen(true)}
          className="w-full md:w-auto px-5 py-3.5 bg-emerald-850 hover:bg-emerald-900 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-emerald-900/10 transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Daftarkan UMKM Anda</span>
        </button>
      </div>

      {/* Controls Bar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-4 shadow-sm" id="catalog-controls">
        <div className="flex flex-col lg:flex-row gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 h-4.5 w-4.5 text-stone-400" />
            <input
              id="catalog-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama usaha, pemilik, produk unggulan, atau dusun asal..."
              className="w-full pl-11 pr-12 py-3 bg-stone-50/70 border border-stone-200 focus:border-emerald-600 focus:outline-none rounded-xl text-sm placeholder-stone-400 font-sans"
            />
            <button
              id="btn-voice-search-local"
              onClick={triggerLocalVoiceSearch}
              className={`absolute right-3 top-2 p-1.5 rounded-lg transition-colors ${
                isListeningLocal 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : 'text-stone-400 hover:text-emerald-800 hover:bg-stone-100'
              }`}
              title="Ucapkan kata kunci pencarian Anda"
            >
              <Mic className="h-4 w-4" />
            </button>
            {isListeningLocal && (
              <span className="absolute right-12 top-3 text-[10px] text-red-500 font-mono animate-pulse">Mendengarkan...</span>
            )}
          </div>

          {/* Quick Stats Helper */}
          <div className="hidden lg:flex items-center text-xs text-stone-500 gap-2 px-3 bg-stone-50 rounded-xl">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Daftar real-time: <strong className="text-emerald-950 font-bold">{filteredUmkm.length}</strong> usaha ditemukan</span>
          </div>

        </div>

        {/* Categories Chips */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-stone-100" id="category-chips-list">
          <div className="flex items-center text-stone-400 mr-2 text-xs font-semibold uppercase tracking-wider">
            <Filter className="h-3.5 w-3.5 mr-1" />
            <span>Kategori:</span>
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              id={`chip-${cat.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all ${
                categoryFilter === cat
                  ? 'bg-amber-500 text-emerald-950 font-semibold shadow-sm'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredUmkm.length === 0 && (
        <div className="text-center py-16 bg-stone-50 rounded-2xl border border-stone-100 space-y-4" id="empty-results-box">
          <div className="text-5xl">🔍</div>
          <h3 className="text-lg font-bold text-stone-800">Pencarian Tidak Ditemukan</h3>
          <p className="text-sm text-stone-500 max-w-sm mx-auto leading-relaxed">
            Maaf, kami tidak menemukan UMKM yang sesuai dengan kata kunci "{searchQuery}" di kategori "{categoryFilter}".
          </p>
          <button
            id="reset-search-btn"
            onClick={() => { setSearchQuery(''); setCategoryFilter('Semua'); }}
            className="px-4 py-2 bg-emerald-850 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold transition-all"
          >
            Reset Semua Filter
          </button>
        </div>
      )}

      {/* Grid of Results */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" id="catalog-grid-items">
        {filteredUmkm.map((umkm) => (
          <div
            key={umkm.id}
            id={`umkm-card-${umkm.id}`}
            className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
          >
            
            {/* Header Cover */}
            <div className="h-44 relative overflow-hidden">
              <img
                src={umkm.image}
                alt={umkm.name}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-emerald-950 text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
                {umkm.category}
              </span>

              {umkm.isVerified && (
                <span className="absolute top-3 right-3 bg-emerald-600/90 backdrop-blur-md text-white font-bold px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider flex items-center space-x-1 shadow-sm">
                  <ShieldCheck className="h-3 w-3" />
                  <span>Diverifikasi Pemdes</span>
                </span>
              )}
            </div>

            {/* Profile Info */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                
                {/* Meta details */}
                <div className="flex items-center space-x-2 text-stone-400 text-xs font-mono">
                  <span className="text-base bg-stone-100 p-1.5 rounded-lg">{umkm.logo}</span>
                  <div>
                    <span className="text-stone-850 font-sans block font-semibold leading-none">{umkm.owner}</span>
                    <span className="text-[9px] text-stone-400 block tracking-wider mt-0.5">Pemilik Usaha</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-stone-900 group-hover:text-emerald-800 transition-colors leading-snug">
                  {umkm.name}
                </h3>

                <p className="text-stone-500 text-xs leading-relaxed line-clamp-3">
                  {umkm.description}
                </p>

                <div className="text-xs bg-stone-50/70 border border-stone-100 rounded-lg p-2.5 space-y-1">
                  <span className="text-stone-400 block text-[9px] uppercase font-bold tracking-wider">Lokasi Outlet</span>
                  <span className="text-stone-700 italic block font-sans font-light leading-snug">{umkm.address}</span>
                </div>

              </div>

              {/* Specs and Buttons */}
              <div className="pt-4 border-t border-stone-100 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest block">Rentang Harga</span>
                    <span className="text-sm font-extrabold text-emerald-950 font-mono">{umkm.priceRange}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest block">Skor</span>
                    <span className="text-sm font-extrabold text-amber-500 font-mono">★ {umkm.rating.toFixed(1)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    id={`btn-view-products-${umkm.id}`}
                    onClick={() => setSelectedUmkm(umkm)}
                    className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center space-x-1"
                  >
                    <span>{umkm.products.length} Produk</span>
                  </button>
                  <a
                    id={`btn-wa-direct-main-${umkm.id}`}
                    href={getWaLink(umkm)}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center space-x-1"
                  >
                    <Phone className="h-3.5 w-3.5 fill-white text-emerald-600" />
                    <span>Hubungi WA</span>
                  </a>
                </div>

                <button
                  id={`btn-speak-umkm-${umkm.id}`}
                  onClick={() => handleSpeakDescription(umkm.id, `Usaha ${umkm.name}, milik ${umkm.owner}. Deskripsi usaha: ${umkm.description}. Berlokasi di ${umkm.address}.`)}
                  className={`w-full py-2 rounded-xl text-xs font-semibold border flex items-center justify-center space-x-1.5 transition-all ${
                    speakingProductId === umkm.id 
                      ? 'bg-red-50 border-red-200 text-red-650 animate-pulse' 
                      : 'bg-stone-50 hover:bg-stone-100 border-stone-200/80 text-stone-600'
                  }`}
                  title="Dengarkan deskripsi ini dibacakan nyaring"
                >
                  {speakingProductId === umkm.id ? (
                    <>
                      <VolumeX className="h-3.5 w-3.5 text-red-600" />
                      <span>Hentikan Suara</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="h-3.5 w-3.5 text-stone-500" />
                      <span>Dengarkan Deskripsi Usaha</span>
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>
        ))}
      </div>

      {/* Model: Detailed Product Showcase Modal */}
      <AnimatePresence>
        {selectedUmkm && (
          <div
            id="umkm-products-modal"
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-stone-200 flex flex-col"
            >
              
              {/* Modal Cover Header */}
              <div className="p-6 border-b border-stone-150 flex justify-between items-center bg-stone-50">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl bg-white p-2 rounded-xl shadow-inner inline-block">{selectedUmkm.logo}</span>
                  <div>
                    <h3 className="font-bold text-stone-900 text-lg leading-tight">{selectedUmkm.name}</h3>
                    <p className="text-xs text-stone-400">Pemilik: <strong>{selectedUmkm.owner}</strong> — {selectedUmkm.category}</p>
                  </div>
                </div>
                <button
                  id="close-umkm-modal-btn"
                  onClick={() => setSelectedUmkm(null)}
                  className="p-2 hover:bg-stone-200 rounded-full transition-all text-stone-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal scrollable body */}
              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                
                {/* Brand description statement inside dialog */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">Profil Singkat</span>
                  <p className="text-xs text-stone-600 leading-relaxed font-sans font-light">
                    {selectedUmkm.description}
                  </p>
                </div>

                <div className="space-y-4">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest block">Katalog Produk ({selectedUmkm.products.length})</span>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {selectedUmkm.products.map((prod, i) => (
                      <div
                        key={i}
                        className="border border-stone-100 rounded-2xl overflow-hidden flex flex-col justify-between bg-stone-50/55 shadow-inner"
                      >
                        <div className="h-32 bg-stone-200 relative">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute bottom-2 right-2 bg-emerald-950/90 text-white font-mono text-[11px] px-2 py-0.5 rounded font-bold">
                            Rp {prod.price}
                          </span>
                        </div>
                        <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                          <div>
                            <h4 className="font-bold text-stone-900 text-sm leading-tight line-clamp-1">{prod.name}</h4>
                            <p className="text-[11px] text-stone-500 mt-1 line-clamp-2 leading-relaxed">{prod.description}</p>
                          </div>
                          
                          <a
                            id={`btn-order-wa-${prod.name.replace(/\s+/g, '-').toLowerCase()}`}
                            href={getWaLink(selectedUmkm, prod)}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-center rounded-xl text-[11px] font-bold transition-all flex items-center justify-center space-x-1.5"
                          >
                            <ShoppingCart className="h-3.5 w-3.5" />
                            <span>Beli lewat WhatsApp</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
              
              {/* Sticky bottom banner for security help */}
              <div className="bg-emerald-50 p-4 border-t border-emerald-100 flex items-center justify-between text-xs text-emerald-800">
                <span className="font-medium flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Transaksi Terlindungi Jalur WhatsApp Pribadi Penjual</span>
                </span>
                <a
                  href={`tel:${selectedUmkm.whatsapp}`}
                  className="font-bold text-emerald-900 underline hover:text-emerald-950"
                >
                  Hubungi Rumah Usaha
                </a>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Model: Register New UMKM Form Modal */}
      <AnimatePresence>
        {isRegisterOpen && (
          <div
            id="register-umkm-modal"
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-stone-200 flex flex-col"
            >
              
              {/* Header */}
              <div className="p-6 border-b border-stone-150 flex justify-between items-center bg-stone-50">
                <div>
                  <h3 className="font-bold text-stone-900 text-lg leading-tight">Daftarkan Rumah Usaha UMKM Desa</h3>
                  <p className="text-xs text-stone-400 mt-0.5">Formulir Pendaftaran Terintegrasi Portal Desa Harumandala</p>
                </div>
                <button
                  id="close-register-modal-btn"
                  onClick={() => setIsRegisterOpen(false)}
                  className="p-2 hover:bg-stone-250 rounded-full transition-all text-stone-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Scrollable Form */}
              <form onSubmit={handleRegisterSubmit} className="overflow-y-auto flex-1 p-6 space-y-6 text-left">
                
                {/* Form Warning Notification info box */}
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-amber-900 text-xs space-y-1">
                  <span className="font-bold block">Pemberitahuan Kelayakan Berusaha:</span>
                  <p className="leading-relaxed">
                    Setiap pendaftaran baru akan didaftarkan secara otomatis ke dalam sistem portal di bagian bawah peninjauan. Untuk menerima status lencana hijau <strong className="text-emerald-800">"Diverifikasi Pemdes"</strong> serta pendaftaran izin nomor NIB gratis, silakan serahkan KTP atau fotokopi KK Anda ke Sekretariat Balai Desa Harumandala pada jam kerja dinas.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1.5">Nama Usaha / Merk Dagang *</label>
                    <input
                      id="form-register-name"
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      required
                      placeholder="Contoh: Sanggar Batik Sekarjagat"
                      className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-600 focus:outline-none rounded-xl px-4 py-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1.5">Nama Pemilik Usaha *</label>
                    <input
                      id="form-register-owner"
                      type="text"
                      value={newOwner}
                      onChange={(e) => setNewOwner(e.target.value)}
                      required
                      placeholder="Contoh: Ibu Rina Ambarwati"
                      className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-600 focus:outline-none rounded-xl px-4 py-2.5 text-sm"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1.5">Nomor WhatsApp Usaha *</label>
                    <input
                      id="form-register-wa"
                      type="tel"
                      value={newWhatsapp}
                      onChange={(e) => setNewWhatsapp(e.target.value)}
                      required
                      placeholder="Contoh: 08123456789"
                      className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-600 focus:outline-none rounded-xl px-4 py-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1.5">Kategori Bidang *</label>
                    <select
                      id="form-register-category"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-600 focus:outline-none rounded-xl px-4 py-2.5 text-sm"
                    >
                      <option value="Kuliner">Kuliner</option>
                      <option value="Kerajinan">Kerajinan</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Pertanian">Pertanian</option>
                      <option value="Wisata & Jasa">Wisata & Jasa</option>
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1.5">Kisaran Rentang Harga Dagang *</label>
                    <input
                      id="form-register-pricerange"
                      type="text"
                      value={newPriceRange}
                      onChange={(e) => setNewPriceRange(e.target.value)}
                      required
                      placeholder="Contoh: Rp 15.000 - Rp 50.000"
                      className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-600 focus:outline-none rounded-xl px-4 py-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1.5">Emoji Logo (Pilih salah satu) *</label>
                    <select
                      id="form-register-logo"
                      value={newLogo}
                      onChange={(e) => setNewLogo(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-600 focus:outline-none rounded-xl px-4 py-2.5 text-sm text-[16px]"
                    >
                      <option value="🍪">🍪 Makanan Ringan / Kue</option>
                      <option value="☕">☕ Warung / Kopi</option>
                      <option value="🧺">🧺 Bambu / Kerajinan Anyam</option>
                      <option value="🧣">🧣 Pakaian / Kain Batik</option>
                      <option value="🍃">🍃 Tani Olahan / Madu</option>
                      <option value="🏡">🏡 Penginapan / Jasa</option>
                      <option value="🛍️">🛍️ Lain-lain</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1.5">Keterangan Singkat Deskripsi Usaha *</label>
                  <textarea
                    id="form-register-desc"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    required
                    rows={3}
                    placeholder="Contoh: Menjual madu hutan murni hasil budidaya alami lebah klanceng desa tanpa campuran..."
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-600 focus:outline-none rounded-xl px-4 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1.5">Alamat Lengkap / Dusun & Unit RT *</label>
                  <input
                    id="form-register-address"
                    type="text"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    required
                    placeholder="Contoh: RT 02 / RW 01, Dusun Sukamanah"
                    className="w-full bg-stone-50 border border-stone-200 focus:border-emerald-600 focus:outline-none rounded-xl px-4 py-2.5 text-sm"
                  />
                </div>

                {/* Cover Image Preset Picker */}
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-stone-600">Pilih Foto Sampul Visual Usaha *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2" id="preset-image-grid">
                    {IMAGE_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        id={`btn-preset-img-${idx}`}
                        type="button"
                        onClick={() => setSelectedImagePreset(idx)}
                        className={`border rounded-xl overflow-hidden text-left cursor-pointer transition-all ${
                          selectedImagePreset === idx
                            ? 'border-emerald-700 ring-2 ring-emerald-600/40'
                            : 'border-stone-200 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <div className="h-14 bg-stone-100">
                          <img
                            src={preset.url}
                            alt={preset.label}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <span className="block text-[9px] font-bold p-1 text-center bg-stone-100 text-stone-700 whitespace-nowrap overflow-hidden text-ellipsis">
                          {preset.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit button modal action */}
                <div className="pt-4 border-t border-stone-150 flex flex-col-reverse sm:flex-row justify-end gap-3">
                  <button
                    id="btn-cancel-register"
                    type="button"
                    onClick={() => setIsRegisterOpen(false)}
                    className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-all text-center"
                  >
                    Batalkan
                  </button>
                  <button
                    id="btn-submit-new-umkm"
                    type="submit"
                    className="px-6 py-2.5 bg-emerald-850 hover:bg-emerald-950 text-white rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center space-x-1"
                  >
                    <span>Daftarkan Sekarang</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>

              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
