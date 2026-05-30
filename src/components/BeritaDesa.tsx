import React, { useState } from 'react';
import { Search, Calendar, User, Eye, X, MailOpen, BellRing, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Berita } from '../types';

interface BeritaDesaProps {
  beritaList: Berita[];
}

export default function BeritaDesa({ beritaList }: BeritaDesaProps) {
  const [newsFilter, setNewsFilter] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBerita, setSelectedBerita] = useState<Berita | null>(null);
  const [subscribePhone, setSubscribePhone] = useState('');
  const [subscribeOk, setSubscribeOk] = useState(false);

  const categories = ['Semua', 'UMKM & Ekonomi', 'Kegiatan Desa', 'Pengumuman', 'Infrastruktur'];

  // Search and Filter logic
  const filteredArticles = beritaList.filter((post) => {
    const matchesCategory = newsFilter === 'Semua' || post.category === newsFilter;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscribePhone) return;
    setSubscribeOk(true);
    setSubscribePhone('');
    setTimeout(() => setSubscribeOk(false), 5000);
  };

  return (
    <div id="berita-desa-root" className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Article Intro Header */}
      <div className="text-center md:text-left flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-stone-200 pb-8">
        <div className="space-y-2">
          <span className="text-xs font-semibold text-emerald-800 uppercase tracking-widest block">Warta Kabar Harumandala</span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-stone-900 font-serif tracking-tight">Kabar Desa & Info UMKM</h1>
          <p className="text-sm text-stone-500 max-w-2xl leading-relaxed">
            Dapatkan informasi terkini seputar bazar lokal, perkembangan infrastruktur tani, penyaluran bantuan BUMDes, dan agenda kemasyarakatan penting.
          </p>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="grid md:grid-cols-12 gap-4">
        
        {/* News Filters Menu */}
        <div className="md:col-span-8 flex flex-wrap gap-2 items-center" id="news-category-switch">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`news-chip-${cat.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => setNewsFilter(cat)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                newsFilter === cat
                  ? 'bg-amber-500 text-emerald-950 shadow-sm'
                  : 'bg-stone-100 hover:bg-stone-250/60 text-stone-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Local News Search Input */}
        <div className="md:col-span-4 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
          <input
            id="news-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kabar berita terkini..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-stone-200 focus:border-emerald-600 focus:outline-none rounded-xl text-xs"
          />
        </div>

      </div>

      {/* Grid of Articles */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-20 bg-stone-50 rounded-2xl border border-stone-100 space-y-3" id="news-empty-container">
          <AlertCircle className="h-10 w-10 text-stone-300 mx-auto" />
          <h3 className="text-base font-bold text-stone-800">Artikel Tidak Ditemukan</h3>
          <p className="text-xs text-stone-500 max-w-xs mx-auto">
            Kami tidak menemukan berita atau kegiatan di kategori "{newsFilter}" yang cocok dengan pencarian Anda.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" id="news-grid-cards">
          {filteredArticles.map((post) => (
            <div
              key={post.id}
              id={`news-card-${post.id}`}
              className="bg-white rounded-2xl border border-stone-205/60 overflow-hidden shadow-sm flex flex-col justify-between group hover:shadow-md transition-all duration-300"
            >
              <div className="h-44 relative overflow-hidden bg-stone-200">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-3 left-3 bg-emerald-950/95 backdrop-blur-md text-[#ffffff] px-3 py-1 rounded-full text-[10px] font-bold shadow-sm uppercase tracking-wider">
                  {post.category}
                </span>
              </div>
              
              {/* Content body card */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 text-[10px] text-stone-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5" />
                      {post.author}
                    </span>
                  </div>
                  
                  <h3 className="font-extrabold text-stone-900 group-hover:text-emerald-850 transition-colors text-base leading-snug">
                    {post.title}
                  </h3>
                  
                  <p className="text-stone-500 text-xs font-light leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[10px] text-stone-400 font-mono">
                    <Eye className="h-3.5 w-3.5" />
                    {post.views} Dilihat
                  </span>
                  
                  <button
                    id={`btn-read-news-${post.id}`}
                    onClick={() => setSelectedBerita(post)}
                    className="text-xs font-bold text-emerald-850 hover:text-emerald-950 transition-colors cursor-pointer"
                  >
                    Selengkapnya →
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* WhatsApp Subscription banner panel */}
      <section id="alert-signup-section" className="bg-stone-100 rounded-3xl p-8 border border-stone-200 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute left-0 bottom-0 text-stone-200 text-9xl opacity-40 pointer-events-none translate-y-12">
          <MailOpen />
        </div>
        <div className="relative z-10 space-y-1.5 max-w-md">
          <span className="bg-emerald-100 border border-emerald-250 text-emerald-800 text-[9px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full inline-flex items-center gap-1">
            <BellRing className="h-3 w-3 text-emerald-700" />
            <span>Digital Warta Terpadu</span>
          </span>
          <h3 className="text-xl font-bold font-sans text-stone-900 leading-tight">Langganan Info Desa Lewat WhatsApp</h3>
          <p className="text-xs text-stone-500 leading-relaxed font-sans font-light">
            Sering ketinggalan pengumuman pencairan bansos pendaftaran NIB atau expo pasar tani? Masukkan nomor WA Anda untuk menerima notifikasi langsung per minggu.
          </p>
        </div>

        {subscribeOk ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-emerald-900 text-white p-4 rounded-xl text-center text-xs w-full md:w-80 border border-emerald-750"
          >
            <span>🎉 Pendaftaran sukses! Anda terdaftar dalam WhatsApp blast Desa.</span>
          </motion.div>
        ) : (
          <form onSubmit={handleSubscribe} className="relative z-10 w-full md:w-auto flex flex-col sm:flex-row gap-2">
            <input
              id="sub-phone-input"
              type="tel"
              required
              value={subscribePhone}
              onChange={(e) => setSubscribePhone(e.target.value)}
              placeholder="Masukkan nomor WA (Contoh: 08123...)"
              className="bg-white border border-stone-250 focus:border-emerald-600 focus:outline-none rounded-xl px-4 py-3 text-xs min-w-[240px]"
            />
            <button
              id="sub-phone-submit"
              type="submit"
              className="py-3 px-6 bg-emerald-850 hover:bg-emerald-950 text-white rounded-xl text-xs font-bold transition-all shadow-md text-nowrap cursor-pointer"
            >
              Aktifkan Warta
            </button>
          </form>
        )}
      </section>

      {/* Model: Deep Reading Article Modal */}
      <AnimatePresence>
        {selectedBerita && (
          <div
            id="news-reading-modal"
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-hidden shadow-2xl border border-stone-200 flex flex-col"
            >
              
              {/* Header inside modal */}
              <div className="p-4 bg-stone-50 border-b border-stone-150 flex justify-between items-center sm:px-6">
                <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-emerald-800 bg-white border border-emerald-100 rounded-full px-3 py-1">
                  Kategori: {selectedBerita.category}
                </span>
                
                <button
                  id="close-news-reading-btn"
                  onClick={() => setSelectedBerita(null)}
                  className="p-1.5 hover:bg-stone-200 rounded-full transition-all text-stone-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Scrollable news text body */}
              <div className="overflow-y-auto flex-1 p-6 space-y-6 sm:px-10">
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-xs font-mono text-stone-400">
                    <span className="flex items-center gap-1">📅 {selectedBerita.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">👤 Jurnalis: {selectedBerita.author}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">👁 {selectedBerita.views} Pembaca</span>
                  </div>
                  
                  <h2 className="text-xl sm:text-2xl font-black text-stone-900 leading-tight font-sans">
                    {selectedBerita.title}
                  </h2>
                </div>

                {/* Banner image illustration */}
                <div className="h-64 sm:h-80 bg-stone-200 rounded-2xl overflow-hidden shadow-inner border border-stone-100">
                  <img
                    src={selectedBerita.image}
                    alt={selectedBerita.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Actual Paragraph Content */}
                <div className="text-xs sm:text-sm text-stone-700 leading-relaxed font-sans font-light whitespace-pre-wrap">
                  {selectedBerita.content}
                </div>

              </div>

              {/* Bottom footer bar modal close actions */}
              <div className="bg-stone-50 p-4 border-t border-stone-150 text-right">
                <button
                  id="close-bottom-reading-btn"
                  onClick={() => setSelectedBerita(null)}
                  className="px-6 py-2.5 bg-emerald-850 hover:bg-emerald-950 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Selesai Membaca
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
