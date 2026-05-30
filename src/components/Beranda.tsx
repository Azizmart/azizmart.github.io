import { motion } from 'motion/react';
import { ArrowRight, Star, Heart, ShieldCheck, TreePine, Sparkles, MessageSquare, Coffee, CheckCircle2, Clock, Search, AlertCircle, HelpCircle } from 'lucide-react';
import { Umkm, Aspirasi } from '../types';
import React, { useState, useEffect } from 'react';

interface BerandaProps {
  umkmList: Umkm[];
  setActiveTab: (tab: string) => void;
  setCategoryFilter: (category: string) => void;
}

export default function Beranda({ umkmList, setActiveTab, setCategoryFilter }: BerandaProps) {
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackDusun, setFeedbackDusun] = useState('sukamanah');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  // Status Aspirasi Tracking states
  const [aspirasiList, setAspirasiList] = useState<Aspirasi[]>([]);
  const [aspSearchQuery, setAspSearchQuery] = useState('');
  const [aspSelectedDusun, setAspSelectedDusun] = useState('Semua');

  const featuredUmkm = umkmList.slice(0, 3);

  const filteredAspirasi = aspirasiList.filter((asp) => {
    const matchesSearch = asp.name.toLowerCase().includes(aspSearchQuery.toLowerCase()) || 
                          asp.message.toLowerCase().includes(aspSearchQuery.toLowerCase());
    const matchesDusun = aspSelectedDusun === 'Semua' || asp.dusun === aspSelectedDusun;
    return matchesSearch && matchesDusun;
  });

  const stats = [
    { value: '50+', label: 'UMKM Aktif', color: 'text-amber-500' },
    { value: '5', label: 'Sektor Utama', color: 'text-emerald-500' },
    { value: '150+', label: 'Produk Unggulan', color: 'text-blue-500' },
    { value: 'Rp 65M', label: 'Putaran BUMDes', color: 'text-rose-500' },
  ];

  const handleCategoryClick = (category: string) => {
    setCategoryFilter(category);
    setActiveTab('umkm');
  };

  // Load aspirations history
  useEffect(() => {
    const saved = localStorage.getItem('harumandala_aspirasi');
    let list: Aspirasi[] = [];
    if (saved) {
      try {
        list = JSON.parse(saved);
      } catch (err) {
        list = [];
      }
    }

    // Default placeholder if none exists yet in localStorage
    const defaultAspirasi: Aspirasi[] = [
      {
        id: 'asp-budiman',
        name: 'Budiman',
        dusun: 'jelat',
        message: 'tolong sistem ini ditindak di evaluasi lagi, terutama dalam harga-harga nya',
        status: 'Belum Dibaca',
        date: '30 Mei 2026, 07:49'
      },
      {
        id: 'asp-demo-1',
        name: 'Ibu Ratna',
        dusun: 'cibuluh',
        message: 'Mohon dibantu pelatihan pemasaran online (TikTok/Insta) untuk ibu-ibu PKK pembuat anyaman lidi di dusun kami agar orderan lancar.',
        status: 'Belum Dibaca',
        date: '28 Mei 2026, 14:20'
      },
      {
        id: 'asp-demo-2',
        name: 'Karta Taruna Mandala',
        dusun: 'mandala-mekar',
        message: 'Usulan agar diadakan Bazar Bulanan di Lapangan Balai Desa Harumandala setiap tanggal muda untuk meramaikan stand pengusaha lokal.',
        status: 'Sedang Ditindaklanjuti',
        date: '26 Mei 2026, 09:12'
      }
    ];

    if (!saved) {
      setAspirasiList(defaultAspirasi);
      localStorage.setItem('harumandala_aspirasi', JSON.stringify(defaultAspirasi));
    } else {
      // Ensure Budiman's item is in the list for demonstration
      const hasBudiman = list.some(item => item.id === 'asp-budiman' || item.message.includes('tolong sistem ini ditindak'));
      if (!hasBudiman) {
        const updated = [defaultAspirasi[0], ...list];
        setAspirasiList(updated);
        localStorage.setItem('harumandala_aspirasi', JSON.stringify(updated));
      } else {
        setAspirasiList(list);
      }
    }
  }, []);

  const censorName = (name: string): string => {
    if (!name) return 'Warga';
    const trimmed = name.trim();
    return trimmed.split(' ').map(word => {
      if (word.length <= 1) return '*';
      if (word.length === 2) return word[0] + '*';
      if (word.length === 3) return word[0] + '**';
      return word[0] + '*'.repeat(word.length - 2) + word[word.length - 1];
    }).join(' ');
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackName || !feedbackMsg) return;

    // Load current aspirasi list, insert new item, and save back to localStorage
    const savedAspirasiStr = localStorage.getItem('harumandala_aspirasi');
    let currentAspirasi = [];
    if (savedAspirasiStr) {
      try {
        currentAspirasi = JSON.parse(savedAspirasiStr);
      } catch (err) {
        currentAspirasi = [];
      }
    }

    const newAspirasiItem: Aspirasi = {
      id: 'asp-' + Math.random().toString(36).substring(2, 9),
      name: feedbackName,
      dusun: feedbackDusun,
      message: feedbackMsg,
      status: 'Belum Dibaca',
      date: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    const updated = [newAspirasiItem, ...currentAspirasi];
    setAspirasiList(updated);
    localStorage.setItem('harumandala_aspirasi', JSON.stringify(updated));

    setFeedbackSent(true);
    setFeedbackName('');
    setFeedbackMsg('');
    setFeedbackDusun('sukamanah');
    setTimeout(() => setFeedbackSent(false), 5000);
  };

  return (
    <div id="beranda-container" className="space-y-20 pb-16">
      {/* Hero Section */}
      <section id="hero-section" className="relative h-[85vh] min-h-[550px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/village_hero_banner_1780090339709.png"
            alt="Pemandangan Desa Harumandala"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-emerald-950/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl text-left text-white space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 bg-emerald-800/80 px-3 py-1.5 rounded-full border border-emerald-500/30 text-xs font-semibold text-amber-400"
            >
              <TreePine className="h-4.5 w-4.5" />
              <span>Sinergi Ekonomi Pedesaan Digital 2026</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-serif font-extrabold tracking-tight text-white leading-tight"
            >
              Dukung <span className="text-amber-400">UMKM Lokal</span>, Sejahterakan <span className="text-emerald-400">Desa Kita</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-emerald-100 font-sans font-light leading-relaxed"
            >
              Selamat datang di portal resmi UMKM Desa Harumandala. Jelajahi aneka cita rasa legendaris, kerajinan anyaman istimewa, batik canting tulis pilihan, dan ragam produk pertanian organik berkualitas tinggi.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4"
            >
              <button
                id="hero-cta-explore"
                onClick={() => handleCategoryClick('Semua')}
                className="px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold rounded-xl shadow-lg hover:shadow-amber-500/20 transition-all duration-300 flex items-center justify-center space-x-2 group"
              >
                <span>Mulai Belanja Online</span>
                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                id="hero-cta-tentang"
                onClick={() => setActiveTab('tentang')}
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl border border-white/20 backdrop-blur-sm transition-all duration-300 text-center"
              >
                Mengenal Harumandala
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl p-8 md:p-10 border border-stone-100 flex flex-wrap justify-between items-center gap-6">
          <div className="w-full lg:w-1/3 space-y-2">
            <span className="text-xs font-semibold text-emerald-700 tracking-widest uppercase block">Kemandirian Finansial</span>
            <h2 className="text-2xl font-bold text-stone-900 font-serif">Kekuatan Ekonomi dari Bawah</h2>
            <p className="text-sm text-stone-500 leading-relaxed">
              Melalui kolaborasi digital, kami membawa produk terbaik para perajin dan petani desa langsung ke genggaman pasar modern.
            </p>
          </div>
          <div className="w-full lg:w-1/2 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center p-3 rounded-2xl bg-stone-50">
                <span className={`block text-3xl font-black ${stat.color} tracking-tight`}>{stat.value}</span>
                <span className="block text-xs font-medium text-stone-600 mt-1">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sambutan Lurah */}
      <section id="lurah-welcome" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-emerald-950 to-teal-900 rounded-3xl overflow-hidden shadow-xl border border-emerald-800">
          <div className="grid md:grid-cols-12 gap-8 p-8 md:p-12 items-center">
            <div className="md:col-span-4 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-amber-400 rounded-2xl transform rotate-3 scale-105" />
                <div className="relative bg-emerald-900 p-8 rounded-2xl text-6xl text-center shadow-lg border border-emerald-800">
                  👨‍💼
                </div>
              </div>
            </div>
            <div className="md:col-span-8 text-white space-y-4">
              <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold font-mono">Sambutan Kepala Desa</span>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif">Gotong Royong Mengangkat Produk Lokal</h2>
              <p className="text-emerald-100 font-light leading-relaxed italic text-sm sm:text-base">
                "Puji syukur kami panjatkan, digitalisasi UMKM Desa Harumandala ini dirancang agar produk ciptaan ibu-ibu, pemuda, dan warga tani kita bisa diakses secara global, nyaman melalui WhatsApp langsung ke produsen tanpa komisi berat. Menghubungi mereka berarti Anda berkontribusi langsung pada biaya sekolah anak petani dan kemajuan ekonomi inklusif warga kami secara ril."
              </p>
              <div className="pt-2">
                <span className="font-bold block text-stone-150">Sugeng Widodo</span>
                <span className="text-xs text-amber-400 block font-mono">Kepala Desa Harumandala</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories Grid */}
      <section id="categories-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-semibold text-emerald-800 uppercase tracking-widest block">Klaster Komoditas</span>
          <h2 className="text-3xl font-bold text-stone-900 font-serif">Kategori Produk Unggulan</h2>
          <p className="text-stone-500 max-w-xl mx-auto text-sm leading-relaxed">
            Pilihlah ketegori komoditas di bawah untuk melihat rincian pengusaha UMKM lokal yang siap memenuhi kebutuhan Anda.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { name: 'Kuliner', icon: '🍪', color: 'bg-orange-50 text-orange-700 hover:bg-orange-100 border-orange-200' },
            { name: 'Kerajinan', icon: '🧺', color: 'bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200' },
            { name: 'Fashion', icon: '🧣', color: 'bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200' },
            { name: 'Pertanian', icon: '🍃', color: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200' },
            { name: 'Wisata & Jasa', icon: '🏡', color: 'bg-cyan-50 text-cyan-700 hover:bg-cyan-100 border-cyan-200' },
          ].map((cat) => (
            <button
              key={cat.name}
              id={`cat-card-${cat.name.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => handleCategoryClick(cat.name)}
              className={`p-6 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center space-y-3 cursor-pointer group hover:scale-[1.03] hover:shadow-md ${cat.color}`}
            >
              <span className="text-4xl transform group-hover:rotate-12 transition-transform duration-300">{cat.icon}</span>
              <span className="text-sm font-semibold tracking-wide block">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Businesses Carousel/Grid */}
      <section id="featured-umkm" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-widest block">Mitra Pilihan</span>
            <h2 className="text-3xl font-bold text-stone-900 font-serif">UMKM Unggulan Minggu Ini</h2>
          </div>
          <button
            id="featured-explore-all"
            onClick={() => handleCategoryClick('Semua')}
            className="px-5 py-2.5 bg-emerald-850 hover:bg-emerald-900 text-white rounded-xl text-sm font-semibold flex items-center space-x-2 transition-all shadow-md group"
          >
            <span>Semua UMKM Desa</span>
            <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {featuredUmkm.map((umkm) => (
            <div
              key={umkm.id}
              id={`featured-card-${umkm.id}`}
              className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-all duration-300"
            >
              <div className="h-48 relative overflow-hidden">
                <img
                  src={umkm.image}
                  alt={umkm.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-emerald-900 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                  {umkm.category}
                </span>
                {umkm.isVerified && (
                  <span className="absolute top-3 right-3 bg-emerald-600/90 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm uppercase tracking-wider flex items-center space-x-1">
                    <ShieldCheck className="h-3 w-3 inline" />
                    <span>Terverifikasi</span>
                  </span>
                )}
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-stone-500 text-xs">
                    <span className="bg-stone-100 px-2.5 py-1 rounded text-stone-700 font-mono text-[10px]">{umkm.logo} {umkm.owner}</span>
                  </div>
                  <h3 className="font-bold text-stone-900 text-lg leading-tight group-hover:text-emerald-800 transition-colors">
                    {umkm.name}
                  </h3>
                  <p className="text-stone-500 text-xs line-clamp-2 leading-relaxed">
                    {umkm.description}
                  </p>
                </div>
                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-stone-400 block tracking-wider">Rentang Harga</span>
                    <span className="text-sm font-bold text-emerald-900 font-mono">{umkm.priceRange}</span>
                  </div>
                  <button
                    id={`featured-view-${umkm.id}`}
                    onClick={() => {
                      setCategoryFilter('Semua');
                      setActiveTab('umkm');
                      setTimeout(() => {
                        const card = document.getElementById(`umkm-card-${umkm.id}`);
                        card?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    className="p-2.5 bg-stone-50 hover:bg-emerald-50 text-emerald-850 hover:text-emerald-900 rounded-xl transition-all border border-stone-100"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Support Village Products */}
      <section id="why-local-section" className="bg-stone-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest block">Manfaat Sosial</span>
            <h2 className="text-3xl font-bold text-stone-900 font-serif">Mengapa Memilih Produk Harumandala?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-stone-200/65 space-y-4 shadow-sm">
              <div className="bg-emerald-50 text-emerald-800 p-3 rounded-2xl w-max">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-stone-950 text-lg">Keuntungan 100% Untuk Produsen</h3>
              <p className="text-sm text-stone-500 leading-relaxed">
                Tanpa potongan komisi platform perantara. Transaksi terjadi langsung dari e-commerce desa ke nomor WhatsApp pribadi pengrajin/produsen.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-stone-200/65 space-y-4 shadow-sm">
              <div className="bg-amber-50 text-amber-700 p-3 rounded-2xl w-max">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-stone-950 text-lg">Bahan Alami & Warisan Budaya</h3>
              <p className="text-sm text-stone-500 leading-relaxed">
                Dibuat menggunakan ilmu turun temurun dari anyaman lokal, lilin malam murni, kopi lereng pegunungan segar, tanpa zat pewarna toksik.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-stone-200/65 space-y-4 shadow-sm">
              <div className="bg-blue-50 text-blue-700 p-3 rounded-2xl w-max">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-stone-950 text-lg">Terjamin Resmi Pemerintah Desa</h3>
              <p className="text-sm text-stone-500 leading-relaxed">
                Tiap usaha dalam portal ini diverifikasi langsung oleh sekretariat desa, memberikan jaminan kepemilikan usaha warga yang asli dan tepercaya.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Citizen Feedback Form / Suggestions */}
      <section id="feedback-section" className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-emerald-950 rounded-3xl p-8 md:p-12 shadow-xl border border-emerald-800 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 text-emerald-900 text-9xl opacity-10 pointer-events-none translate-x-10 translate-y-10">
            <MessageSquare />
          </div>
          <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
            <div className="bg-emerald-900 px-3 py-1.5 rounded-full inline-flex items-center space-x-1 border border-emerald-800 text-[11px] font-mono text-amber-400">
              <Sparkles className="h-3 w-3" />
              <span>Aspirasi & Saran Warga Desa</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">Kotak Pesan Terpadu Warga</h2>
            <p className="text-emerald-100 text-xs sm:text-sm font-light leading-relaxed">
              Mempunyai ide produk baru, kritik untuk portal desa ini, atau pengaduan kualitas layanan UMKM? Kirimkan aspirasi Anda langsung ke Sekretariat Desa secara online dan rahasia.
            </p>

            {feedbackSent ? (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-emerald-900 border border-emerald-700 p-6 rounded-2xl text-stone-100 font-medium text-center space-y-2"
              >
                <div className="text-3xl">🎉</div>
                <h4 className="font-bold text-amber-400 text-lg">Saran Terkirim</h4>
                <p className="text-xs text-emerald-200">
                  Terima kasih atas aspirasi Anda. Sekretariat desa akan memproses saran ini paling lambat 1x24 jam kerja.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-4 text-left pt-2">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-emerald-200 mb-1.5">Nama Lengkap / Inisial</label>
                    <input
                      id="feedback-input-name"
                      type="text"
                      value={feedbackName}
                      onChange={(e) => setFeedbackName(e.target.value)}
                      required
                      placeholder="Contoh: Budi Santoso"
                      className="w-full bg-emerald-900/60 border border-emerald-800 focus:border-amber-400 focus:outline-none rounded-xl px-4 py-2.5 text-white placeholder-emerald-600/70 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-emerald-200 mb-1.5">Dusun Domisili</label>
                    <select
                      id="feedback-input-dusun"
                      value={feedbackDusun}
                      onChange={(e) => setFeedbackDusun(e.target.value)}
                      className="w-full bg-emerald-900/60 border border-emerald-800 focus:border-amber-400 focus:outline-none rounded-xl px-4 py-2.5 text-white text-sm"
                    >
                      <option className="bg-emerald-950 text-white" value="sukamanah">Dusun Sukamanah</option>
                      <option className="bg-emerald-950 text-white" value="jelat">Dusun Jelat</option>
                      <option className="bg-emerald-950 text-white" value="mandala-mekar">Dusun Mandala Mekar</option>
                      <option className="bg-emerald-950 text-white" value="cibuluh">Dusun Cibuluh</option>
                      <option className="bg-emerald-950 text-white" value="cileutak">Dusun Cileutak</option>
                      <option className="bg-emerald-950 text-white" value="ciranca">Dusun Ciranca</option>
                      <option className="bg-emerald-950 text-white" value="cikarees">Dusun Cikarees</option>
                      <option className="bg-emerald-950 text-white" value="ciamapag">Dusun Ciamapag</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-emerald-200 mb-1.5">Isi Pesan / Aspirasi</label>
                  <textarea
                    id="feedback-input-msg"
                    rows={4}
                    value={feedbackMsg}
                    onChange={(e) => setFeedbackMsg(e.target.value)}
                    required
                    placeholder="Tuliskan ide pengembangan UMKM Anda atau pendapat di sini..."
                    className="w-full bg-emerald-900/60 border border-emerald-800 focus:border-amber-400 focus:outline-none rounded-xl px-4 py-2.5 text-white placeholder-emerald-600/70 text-sm"
                  />
                </div>
                <div className="text-center pt-2">
                  <button
                    id="feedback-submit-btn"
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3 bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold rounded-xl shadow-lg transition-all text-sm"
                  >
                    Kirim Aspirasi Sekarang
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Citizen Feedback Tracker Section */}
      <section id="feedback-tracker-section" className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-stone-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-stone-100 pb-5">
            <div>
              <h2 className="text-xl font-bold font-serif text-stone-900 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span>Pantau Status Tindak Lanjut Aspirasi</span>
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Ketik nama atau inisial Anda untuk memeriksa status respon terbaru dari Sekretaris Desa resmi.
              </p>
            </div>

            {/* Micro input controls */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-60">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Cari nama pengirim..."
                  value={aspSearchQuery}
                  onChange={(e) => setAspSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 focus:outline-none focus:border-emerald-600 rounded-xl text-xs"
                />
              </div>

              <select
                value={aspSelectedDusun}
                onChange={(e) => setAspSelectedDusun(e.target.value)}
                className="bg-stone-50 border border-stone-200 px-3 py-2 rounded-xl text-xs text-stone-600"
              >
                <option value="Semua">Semua Dusun</option>
                <option value="sukamanah">Dusun Sukamanah</option>
                <option value="jelat">Dusun Jelat</option>
                <option value="mandala-mekar">Dusun Mandala Mekar</option>
                <option value="cibuluh">Dusun Cibuluh</option>
                <option value="cileutak">Dusun Cileutak</option>
                <option value="ciranca">Dusun Ciranca</option>
                <option value="cikarees">Dusun Cikarees</option>
                <option value="ciamapag">Dusun Ciamapag</option>
              </select>
            </div>
          </div>

          {/* List/Grid of status */}
          {filteredAspirasi.length === 0 ? (
            <div className="text-center py-10 bg-stone-50/50 rounded-2xl border border-dashed border-stone-200">
              <span className="text-3xl block">🔍</span>
              <p className="text-xs text-stone-500 font-medium mt-2">Tidak ditemukan data aspirasi yang cocok.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {filteredAspirasi.map((asp) => {
                let statusBadge = '';
                let statusText = '';
                let iconElement = null;

                switch (asp.status) {
                  case 'Belum Dibaca':
                    statusBadge = 'bg-red-50 text-red-700 border border-red-200';
                    statusText = 'Belum Dibaca / Antre';
                    iconElement = <Clock className="h-3.5 w-3.5 mt-0.5 text-red-500" />;
                    break;
                  case 'Sedang Ditindaklanjuti':
                    statusBadge = 'bg-amber-50 text-amber-800 border border-amber-200';
                    statusText = 'Sedang Ditindaklanjuti Pemdes';
                    iconElement = <Clock className="h-3.5 w-3.5 mt-0.5 text-amber-500 animate-pulse" />;
                    break;
                  case 'Selesai':
                    statusBadge = 'bg-emerald-50 text-emerald-800 border border-emerald-200';
                    statusText = 'Tanggapan Selesai & Sukses';
                    iconElement = <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 text-emerald-600" />;
                    break;
                  default:
                    statusBadge = 'bg-stone-50 text-stone-600 border border-stone-200';
                    statusText = 'Ditinjau';
                    iconElement = <Clock className="h-3.5 w-3.5 mt-0.5 text-stone-400" />;
                }

                return (
                  <div
                    key={asp.id}
                    className="p-4 bg-stone-50 hover:bg-stone-100/50 rounded-2xl border border-stone-200/80 transition-all flex flex-col justify-between gap-3"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-1">
                        <div>
                          <span className="font-extrabold text-stone-900 text-xs block flex items-center gap-1.5 flex-wrap">
                            <span>{censorName(asp.name)}</span>
                            <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-emerald-700 bg-emerald-50 border-emerald-100 px-1.5 py-0.5 rounded border font-sans tracking-wide">
                              🔒 Identitas Terlindungi
                            </span>
                          </span>
                          <span className="text-[10px] text-stone-400 uppercase tracking-wider font-mono">
                            Dusun {asp.dusun.replace('-', ' ')}
                          </span>
                        </div>
                        <span className="text-[9.5px] text-stone-400 font-mono">{asp.date}</span>
                      </div>
                      
                      <p className="text-stone-700 text-xs line-clamp-2 italic p-2 bg-white rounded-lg border border-stone-100 font-medium">
                        "{asp.message}"
                      </p>
                    </div>

                    <div className={`p-2.5 rounded-xl flex items-start gap-2 text-[11px] font-semibold ${statusBadge}`}>
                      {iconElement}
                      <div>
                        <span className="font-bold block leading-none">{statusText}</span>
                        {asp.status === 'Belum Dibaca' && (
                          <span className="text-[10px] opacity-75 block mt-0.5 font-light">Pesan masuk aman dalam antrean Pembina Desa.</span>
                        )}
                        {asp.status === 'Sedang Ditindaklanjuti' && (
                          <span className="text-[10px] opacity-75 block mt-0.5 font-light">Sedang dibahas dalam musyawarah pelaksana BUMDes resmi.</span>
                        )}
                        {asp.status === 'Selesai' && (
                          <span className="text-[10px] opacity-75 block mt-0.5 font-light">Aspirasi telah diakomodasi dan dikoordinasikan.</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
