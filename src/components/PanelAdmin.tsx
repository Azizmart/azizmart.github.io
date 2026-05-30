import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Lock, Unlock, LogOut, Edit2, Trash2, Plus, 
  Check, X, FileText, ShoppingBag, Radio, Sparkles, MessageSquare, 
  ChevronRight, Calendar, User, Eye, ArrowLeft, Heart, CheckCircle2,
  AlertCircle, HelpCircle, AlertTriangle, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Umkm, Berita, Aspirasi, Product } from '../types';

interface PanelAdminProps {
  umkmList: Umkm[];
  setUmkmList: React.Dispatch<React.SetStateAction<Umkm[]>>;
  beritaList: Berita[];
  setBeritaList: (berita: Berita[]) => void;
  setActiveTab: (tab: string) => void;
}

export default function PanelAdmin({
  umkmList,
  setUmkmList,
  beritaList,
  setBeritaList,
  setActiveTab
}: PanelAdminProps) {
  // Passphrase security states
  const [passphrase, setPassphrase] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');

  // Sub tab tracking inside admin panel
  const [adminTab, setAdminTab] = useState<'umkm' | 'berita' | 'aspirasi'>('umkm');

  // Aspirasi / Warga feedback states
  const [aspirasiList, setAspirasiList] = useState<Aspirasi[]>([]);

  // Form states for adding/editing UMKM
  const [isUmkmModalOpen, setIsUmkmModalOpen] = useState(false);
  const [umkmEditingId, setUmkmEditingId] = useState<string | null>(null);
  const [umkmForm, setUmkmForm] = useState({
    name: '',
    owner: '',
    description: '',
    category: 'Kuliner' as Umkm['category'],
    image: '',
    logo: '🍪',
    whatsapp: '',
    address: '',
    priceRange: '',
    isVerified: true,
    rating: 4.8,
    // single product helper
    productName: '',
    productPrice: '',
    productDesc: '',
    productImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=400&auto=format&fit=crop'
  });

  // Form states for adding/editing news/berita
  const [isBeritaModalOpen, setIsBeritaModalOpen] = useState(false);
  const [beritaEditingId, setBeritaEditingId] = useState<string | null>(null);
  const [beritaForm, setBeritaForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'UMKM & Ekonomi' as Berita['category'],
    author: '',
    image: ''
  });

  // Load and check authentication & feedback upon mounting
  useEffect(() => {
    // Autologin helper for ease of use by elders
    const savedAuth = localStorage.getItem('harumandala_admin_auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }

    // Load Aspirasi feedback list from localStore
    loadAspirasi();
  }, []);

  const loadAspirasi = () => {
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
      const hasBudiman = list.some(item => item.id === 'asp-budiman' || item.message.includes('tolong sistem ini ditindak'));
      if (!hasBudiman) {
        const updated = [defaultAspirasi[0], ...list];
        setAspirasiList(updated);
        localStorage.setItem('harumandala_aspirasi', JSON.stringify(updated));
      } else {
        setAspirasiList(list);
      }
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Default master password "adminharumandala"
    const cleaned = passphrase.trim().toLowerCase();
    if (cleaned === 'adminharumandala' || cleaned === 'desaadmin' || cleaned === 'kades123') {
      setIsAuthenticated(true);
      setAuthError('');
      localStorage.setItem('harumandala_admin_auth', 'true');
    } else {
      setAuthError('Kata sandi salah! Hubungi Sekretaris Desa jika lupa kunci pengaman.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('harumandala_admin_auth');
  };

  // --- UMKM METHODS ---
  const handleOpenAddUmkm = () => {
    setUmkmEditingId(null);
    setUmkmForm({
      name: '',
      owner: '',
      description: '',
      category: 'Kuliner',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=600&auto=format&fit=crop',
      logo: '🍪',
      whatsapp: '6281122334455',
      address: 'RT 01 / RW 01, Dusun Sukamanah',
      priceRange: 'Rp 10.000 - Rp 50.000',
      isVerified: true,
      rating: 4.8,
      productName: 'Kripik Renyah Tradisional',
      productPrice: '15.000',
      productDesc: 'Dibuat hand-made resep turun temurun tanpa pewarna.',
      productImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=400&auto=format&fit=crop'
    });
    setIsUmkmModalOpen(true);
  };

  const handleOpenEditUmkm = (umkm: Umkm) => {
    setUmkmEditingId(umkm.id);
    const firstProd = umkm.products && umkm.products.length > 0 ? umkm.products[0] : {
      name: 'Produk Unggulan',
      price: '25.000',
      description: 'Deskripsi singkat produk',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=400&auto=format&fit=crop'
    };

    setUmkmForm({
      name: umkm.name,
      owner: umkm.owner,
      description: umkm.description,
      category: umkm.category,
      image: umkm.image,
      logo: umkm.logo || '🍪',
      whatsapp: umkm.whatsapp,
      address: umkm.address,
      priceRange: umkm.priceRange,
      isVerified: umkm.isVerified,
      rating: umkm.rating || 4.8,
      productName: firstProd.name,
      productPrice: firstProd.price,
      productDesc: firstProd.description,
      productImage: firstProd.image
    });
    setIsUmkmModalOpen(true);
  };

  const handleSaveUmkmModel = (e: React.FormEvent) => {
    e.preventDefault();
    const productItem: Product = {
      name: umkmForm.productName || 'Produk Unggulan',
      price: umkmForm.productPrice || '20.000',
      description: umkmForm.productDesc || 'Sajian sehat terbuat dari komoditas lokal.',
      image: umkmForm.productImage || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=400&auto=format&fit=crop'
    };

    if (umkmEditingId) {
      // Editing existing UMKM
      const updated = umkmList.map(u => {
        if (u.id === umkmEditingId) {
          return {
            ...u,
            name: umkmForm.name,
            owner: umkmForm.owner,
            description: umkmForm.description,
            category: umkmForm.category,
            image: umkmForm.image,
            logo: umkmForm.logo,
            whatsapp: umkmForm.whatsapp.replace(/\D/g, ''), // clean numbers only
            address: umkmForm.address,
            priceRange: umkmForm.priceRange,
            isVerified: umkmForm.isVerified,
            products: [productItem] // overwrite or preserve list helper
          };
        }
        return u;
      });
      setUmkmList(updated);
      localStorage.setItem('harumandala_umkms', JSON.stringify(updated));
    } else {
      // Adding new UMKM
      const newItem: Umkm = {
        id: 'umkm-' + Math.random().toString(36).substring(2, 9),
        name: umkmForm.name,
        owner: umkmForm.owner,
        description: umkmForm.description,
        category: umkmForm.category,
        image: umkmForm.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=600&auto=format&fit=crop',
        logo: umkmForm.logo,
        whatsapp: umkmForm.whatsapp.replace(/\D/g, ''),
        address: umkmForm.address,
        priceRange: umkmForm.priceRange,
        rating: umkmForm.rating,
        isVerified: umkmForm.isVerified,
        products: [productItem],
        createdAt: new Date().toISOString().split('T')[0]
      };
      const updated = [newItem, ...umkmList];
      setUmkmList(updated);
      localStorage.setItem('harumandala_umkms', JSON.stringify(updated));
    }
    setIsUmkmModalOpen(false);
  };

  const handleDeleteUmkm = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data UMKM ini dari portal resmi desa?')) {
      const updated = umkmList.filter(u => u.id !== id);
      setUmkmList(updated);
      localStorage.setItem('harumandala_umkms', JSON.stringify(updated));
    }
  };

  const handleToggleVerified = (id: string) => {
    const updated = umkmList.map(u => {
      if (u.id === id) {
        return { ...u, isVerified: !u.isVerified };
      }
      return u;
    });
    setUmkmList(updated);
    localStorage.setItem('harumandala_umkms', JSON.stringify(updated));
  };


  // --- BERITA METHODS ---
  const handleOpenAddBerita = () => {
    setBeritaEditingId(null);
    setBeritaForm({
      title: '',
      excerpt: '',
      content: '',
      category: 'UMKM & Ekonomi',
      author: 'Humas Desa Harumandala',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop'
    });
    setIsBeritaModalOpen(true);
  };

  const handleOpenEditBerita = (berita: Berita) => {
    setBeritaEditingId(berita.id);
    setBeritaForm({
      title: berita.title,
      excerpt: berita.excerpt,
      content: berita.content,
      category: berita.category,
      author: berita.author,
      image: berita.image
    });
    setIsBeritaModalOpen(true);
  };

  const handleSaveBeritaModel = (e: React.FormEvent) => {
    e.preventDefault();
    if (beritaEditingId) {
      const updated = beritaList.map(b => {
        if (b.id === beritaEditingId) {
          return {
            ...b,
            title: beritaForm.title,
            excerpt: beritaForm.excerpt,
            content: beritaForm.content,
            category: beritaForm.category,
            author: beritaForm.author,
            image: beritaForm.image
          };
        }
        return b;
      });
      setBeritaList(updated);
      localStorage.setItem('harumandala_news', JSON.stringify(updated));
    } else {
      const newItem: Berita = {
        id: 'news-' + Math.random().toString(36).substring(2, 9),
        title: beritaForm.title,
        excerpt: beritaForm.excerpt,
        content: beritaForm.content,
        category: beritaForm.category,
        date: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
        author: beritaForm.author || 'Sekretariat Desa',
        image: beritaForm.image || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop',
        views: 12
      };
      const updated = [newItem, ...beritaList];
      setBeritaList(updated);
      localStorage.setItem('harumandala_news', JSON.stringify(updated));
    }
    setIsBeritaModalOpen(false);
  };

  const handleDeleteBerita = (id: string) => {
    if (confirm('Hapus warta kabar berita ini?')) {
      const updated = beritaList.filter(b => b.id !== id);
      setBeritaList(updated);
      localStorage.setItem('harumandala_news', JSON.stringify(updated));
    }
  };


  // --- ASPIRASI METHODS ---
  const handleUpdateAspirasiStatus = (id: string, newStatus: Aspirasi['status']) => {
    const updated = aspirasiList.map(a => {
      if (a.id === id) {
        return { ...a, status: newStatus };
      }
      return a;
    });
    setAspirasiList(updated);
    localStorage.setItem('harumandala_aspirasi', JSON.stringify(updated));
  };

  const handleDeleteAspirasi = (id: string) => {
    if (confirm('Hapus pesan aspirasi warga ini?')) {
      const updated = aspirasiList.filter(a => a.id !== id);
      setAspirasiList(updated);
      localStorage.setItem('harumandala_aspirasi', JSON.stringify(updated));
    }
  };

  const handleClearAllAspirasi = () => {
    if (confirm('PERINGATAN! Anda akan menghapus semua pesan saran warga dari kotak masuk. Lanjutkan?')) {
      setAspirasiList([]);
      localStorage.setItem('harumandala_aspirasi', JSON.stringify([]));
    }
  };

  // Form input helper
  const updateUmkmFormField = (field: string, val: any) => {
    setUmkmForm(prev => ({ ...prev, [field]: val }));
  };

  const updateBeritaFormField = (field: string, val: any) => {
    setBeritaForm(prev => ({ ...prev, [field]: val }));
  };


  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-16 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-emerald-950 text-white px-6 py-8 text-center space-y-3 relative">
            <div className="absolute top-4 right-4 bg-emerald-900 border border-emerald-800 rounded-lg py-1 px-2.5 text-[9px] text-amber-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-ping"></span>
              <span>Sistem Terkunci</span>
            </div>
            
            <div className="bg-amber-500 rounded-full h-14 w-14 flex items-center justify-center text-emerald-950 mx-auto shadow-md">
              <Lock className="h-6 w-6 stroke-[2.5]" />
            </div>
            <h2 className="text-xl font-bold font-serif">Akses Sekretariat Desa</h2>
            <p className="text-xs text-emerald-300 max-w-xs mx-auto leading-relaxed">
              Silakan masukkan Kata Sandi Penjaga Sandbox Portal (BUMDes / Kades) untuk membuka akses Admin Pengelola Portal.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1.5">KATA SANDI ADMINISTRATOR</label>
              <div className="relative">
                <input
                  type="password"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  placeholder="Masukkan katasandi..."
                  className="w-full bg-stone-50 border border-stone-200 focus:outline-none focus:border-emerald-600 rounded-xl pl-4 pr-10 py-3 text-sm text-stone-850"
                  required
                  autoFocus
                />
                <span className="absolute right-3.5 top-3.5 text-stone-400">
                  <Unlock className="h-4 w-4" />
                </span>
              </div>
            </div>

            {authError && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-700 text-xs flex items-start gap-2">
                <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{authError}</span>
              </div>
            )}

            <div className="bg-amber-50 rounded-xl p-3 border border-amber-200/60 space-y-1 text-[11px] text-amber-800 leading-relaxed font-sans">
              <span className="font-bold flex items-center gap-1 text-amber-900">
                <Sparkles className="h-3 w-3" />
                Saran Kunci Akses Cepat (Orang Awam):
              </span>
              <p>Anda bisa menggunakan katasandi instan berikut:</p>
              <code className="bg-white/80 border border-amber-350 px-1.5 py-0.5 rounded font-mono font-bold font-emerald-950 block mt-1 w-max">
                adminharumandala
              </code>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-850 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition shadow-md"
            >
              Masuk Dashboard Administrasi
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" id="admin-dashboard-root">
      
      {/* Upper Status Title Banner */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="h-12 w-12 bg-emerald-100 rounded-xl text-emerald-850 flex items-center justify-center">
            <ShieldCheck className="h-6 w-6 stroke-[2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-stone-900 font-serif leading-none">Dashboard Pengelola Harumandala</h1>
              <span className="bg-emerald-100 text-emerald-800 text-[9px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider font-mono">
                Sesi Aman
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">
              Portal Pengawas BUMDes & Informasi Warga. Gunakan panel ini untuk menambah kearifan lokal produk warga, meninjau aspirasi, dan meng-apdet berita.
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 border border-red-200 hover:bg-red-50 text-red-650 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          title="Keluar dari sesi administrator"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Keluar Sesi</span>
        </button>
      </div>

      {/* Primary Tab Bar Menu */}
      <div className="flex bg-stone-200 p-1.5 rounded-2xl gap-2 font-sans w-full max-w-md">
        <button
          onClick={() => setAdminTab('umkm')}
          className={`flex-1 py-3 text-xs rounded-xl font-bold transition flex items-center justify-center space-x-2 ${
            adminTab === 'umkm' 
              ? 'bg-white text-emerald-950 shadow-sm' 
              : 'text-stone-600 hover:text-stone-850'
          }`}
        >
          <ShoppingBag className="h-4 w-4" />
          <span>Kelora UMKM ({umkmList.length})</span>
        </button>
        <button
          onClick={() => setAdminTab('berita')}
          className={`flex-1 py-3 text-xs rounded-xl font-bold transition flex items-center justify-center space-x-2 ${
            adminTab === 'berita' 
              ? 'bg-white text-emerald-950 shadow-sm' 
              : 'text-stone-600 hover:text-stone-850'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Berita Desa ({beritaList.length})</span>
        </button>
        <button
          onClick={() => setAdminTab('aspirasi')}
          className={`flex-1 py-3 text-xs rounded-xl font-bold transition flex items-center justify-center space-x-2 ${
            adminTab === 'aspirasi' 
              ? 'bg-white text-emerald-950 shadow-sm' 
              : 'text-stone-600 hover:text-stone-850'
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          <span>Aspirasi warga ({aspirasiList.length})</span>
        </button>
      </div>


      {/* SECTION 1: MANAGE UMKM */}
      {adminTab === 'umkm' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden"
        >
          {/* Header inside segment */}
          <div className="px-6 py-5 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
            <div>
              <h3 className="font-bold text-stone-900 text-sm tracking-tight leading-none">Daftar UMKM dalam Sistem</h3>
              <span className="text-stone-500 text-[11px] block mt-1">Gunakan lencana hijau untuk memberikan hak istimewa terverifikasi kelayakan Pemdes</span>
            </div>
            
            <button
              onClick={handleOpenAddUmkm}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-sm transition"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span>Daftar Usaha Baru</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-stone-50 text-[10px] uppercase font-mono tracking-wider font-bold text-stone-500 border-b border-stone-100">
                  <th className="px-6 py-3.5">Logo & Nama Usaha</th>
                  <th className="px-6 py-3.5">Kategori</th>
                  <th className="px-6 py-3.5">Pemilik / Pengelola</th>
                  <th className="px-6 py-3.5">Sertifikat Pemdes</th>
                  <th className="px-6 py-3.5">Kontak WhatsApp</th>
                  <th className="px-6 py-3.5 text-right">Aksi Manajemen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
                {umkmList.map((umkm) => (
                  <tr key={umkm.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-6 py-4 font-sans font-medium">
                      <div className="flex items-center space-x-3">
                        <span className="inline-flex h-9 w-9 items-center justify-center bg-stone-100 rounded-lg text-lg shadow-inner">
                          {umkm.logo}
                        </span>
                        <div className="min-w-0">
                          <span className="block font-bold text-stone-900 truncate max-w-[200px]">{umkm.name}</span>
                          <span className="block text-[10px] text-stone-400 capitalize truncate max-w-[200px]">{umkm.address}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-stone-100 rounded text-stone-700 font-medium font-mono text-[10px]">
                        {umkm.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-stone-900">{umkm.owner}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleVerified(umkm.id)}
                        className={`inline-flex px-2.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider items-center space-x-1 transition-colors ${
                          umkm.isVerified 
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                            : 'bg-stone-100 text-stone-400 border border-stone-200/60'
                        }`}
                        title="Klik untuk mengubah verifikasi Pemdes"
                      >
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>{umkm.isVerified ? 'Aktif Terverifikasi' : 'Belum Diverifikasi'}</span>
                      </button>
                    </td>
                    <td className="px-6 py-4 font-mono select-all font-medium text-stone-600">+{umkm.whatsapp}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditUmkm(umkm)}
                          className="p-1.5 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-lg transition"
                          title="Ubah detail produk dan data usaha"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteUmkm(umkm.id)}
                          className="p-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg transition"
                          title="Hapus usaha"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}


      {/* SECTION 2: MANAGE NEWS */}
      {adminTab === 'berita' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden"
        >
          <div className="px-6 py-5 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
            <div>
              <h3 className="font-bold text-stone-900 text-sm tracking-tight leading-none">Manajemen Warta Kabar</h3>
              <span className="text-stone-500 text-[11px] block mt-1">Publikasikan agenda pembangunan pertanian, bazar UMKM, keputusan BUMDes di sini</span>
            </div>
            
            <button
              onClick={handleOpenAddBerita}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-sm transition"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span>Buat Artikel Warta</span>
            </button>
          </div>

          <div className="divide-y divide-stone-100">
            {beritaList.map((berita) => (
              <div key={berita.id} className="p-6 flex flex-col sm:flex-row gap-6 hover:bg-stone-50/30 transition-colors">
                <img 
                  src={berita.image} 
                  alt={berita.title} 
                  className="w-full sm:w-32 h-20 object-cover rounded-xl shrink-0 bg-stone-100 border border-stone-100" 
                />
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center space-x-2.5 text-[10px] font-mono font-medium text-stone-400">
                    <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded uppercase font-bold">{berita.category}</span>
                    <span className="flex items-center"><Calendar className="h-3 w-3 mr-1" /> {berita.date}</span>
                    <span className="flex items-center"><User className="h-3 w-3 mr-1" /> {berita.author}</span>
                  </div>
                  <h4 className="font-bold text-stone-900 text-base leading-snug font-serif">{berita.title}</h4>
                  <p className="text-stone-500 text-xs truncate max-w-4xl">{berita.excerpt}</p>
                </div>
                <div className="flex items-center gap-1.5 self-start sm:self-center">
                  <button
                    onClick={() => handleOpenEditBerita(berita)}
                    className="px-3 py-1.5 text-xs bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-lg transition font-medium flex items-center gap-1"
                  >
                    <Edit2 className="h-3 w-3" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteBerita(berita.id)}
                    className="p-2 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg transition"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}


      {/* SECTION 3: MANAGE ASPIRASI CITIZENS */}
      {adminTab === 'aspirasi' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Top stats info */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-emerald-50 to-white">
            <div className="flex items-start space-x-3.5">
              <div className="bg-amber-500 p-2.5 rounded-xl text-emerald-950">
                <MessageSquare className="h-5 w-5 fill-emerald-950" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-sm tracking-tight leading-none font-serif">Kotak Masuk Saran Online</h3>
                <span className="text-stone-500 text-[11px] block mt-1.5 leading-relaxed">
                  Menampilkan pesan-pesan, usulan kemakmuran, dan kritik konstruktif yang dikirim warga secara digital dari portal Beranda.
                </span>
              </div>
            </div>

            {aspirasiList.length > 0 && (
              <button
                onClick={handleClearAllAspirasi}
                className="px-4 py-2 border border-red-200 hover:bg-red-50 text-red-650 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Kosongkan Semua Kotak Masuk</span>
              </button>
            )}
          </div>

          {/* Messages lists */}
          {aspirasiList.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-stone-200/60 max-w-xl mx-auto space-y-3">
              <div className="text-4xl">📭</div>
              <h4 className="font-bold text-stone-850 text-base font-serif">Kotak Aspirasi Masih Kosong</h4>
              <p className="text-stone-500 text-xs leading-relaxed">
                Belum ada warga yang mengirimkan saran mingguan ini, atau Anda baru saja membersihkannya. Sedia siaga menerima saran kapan saja.
              </p>
              <button
                onClick={loadAspirasi}
                className="text-emerald-750 font-bold hover:underline text-xs flex items-center justify-center mx-auto gap-1"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Muat Ulang Pesan Demo</span>
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6" id="aspirasi-grid-panel">
              {aspirasiList.map((asp) => (
                <div 
                  key={asp.id}
                  className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Header card info */}
                    <div className="flex items-start justify-between gap-1.5 border-b border-stone-100 pb-3 shrink-0">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-black text-stone-900 text-sm block leading-none">{asp.name}</span>
                          <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded tracking-normal normal-case" title="Nama disensor untuk publik guna melindungi privasi warga">
                            🔒 Disensor Publik
                          </span>
                        </div>
                        <span className="text-[10px] text-stone-400 block font-light mt-1">
                          Warga Dusun {asp.dusun.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                      <span className="text-[10.5px] text-stone-400 font-mono font-medium">{asp.date}</span>
                    </div>

                    {/* Inner message body block */}
                    <p className="text-xs text-stone-700 leading-relaxed font-sans italic p-2.5 bg-stone-50 rounded-xl border border-stone-100 font-medium">
                      "{asp.message}"
                    </p>
                  </div>

                  {/* Actions & dynamic state tag */}
                  <div className="flex items-center justify-between pt-3 border-t border-stone-100 gap-3 shrink-0">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider font-mono font-bold text-stone-400 block mb-1">Ubah Status Tindak Lanjut</span>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleUpdateAspirasiStatus(asp.id, 'Belum Dibaca')}
                          className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition ${
                            asp.status === 'Belum Dibaca' 
                              ? 'bg-red-500 text-white font-extrabold shadow-sm' 
                              : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                          }`}
                        >
                          Baru
                        </button>
                        <button
                          onClick={() => handleUpdateAspirasiStatus(asp.id, 'Sedang Ditindaklanjuti')}
                          className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition ${
                            asp.status === 'Sedang Ditindaklanjuti' 
                              ? 'bg-amber-500 text-emerald-950 font-extrabold shadow-sm' 
                              : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                          }`}
                        >
                          Proses
                        </button>
                        <button
                          onClick={() => handleUpdateAspirasiStatus(asp.id, 'Selesai')}
                          className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition ${
                            asp.status === 'Selesai' 
                              ? 'bg-emerald-600 text-white font-extrabold shadow-sm' 
                              : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                          }`}
                        >
                          Selesai
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteAspirasi(asp.id)}
                      className="p-2 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl"
                      title="Hapus aspiarasi ini"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}


      {/* Overlay Modal 1: Add/Edit UMKM */}
      <AnimatePresence>
        {isUmkmModalOpen && (
          <div className="fixed inset-0 bg-emerald-950/45 dark:bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-2xl border border-stone-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="bg-emerald-950 text-white px-6 py-4 flex items-center justify-between shrink-0">
                <span className="font-serif font-black text-sm uppercase tracking-wide">
                  {umkmEditingId ? 'Edit Data UMKM Terdaftar' : 'Pendaftaran Formulir UMKM Desa'}
                </span>
                <button onClick={() => setIsUmkmModalOpen(false)} className="text-emerald-300 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveUmkmModel} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-500 font-bold mb-1">Nama Usaha UMKM</label>
                    <input
                      type="text"
                      className="w-full bg-stone-50 border border-stone-200 px-3 py-2.5 rounded-xl text-stone-800"
                      value={umkmForm.name}
                      onChange={(e) => updateUmkmFormField('name', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-stone-500 font-bold mb-1">Nama Pemilik / Produsen</label>
                    <input
                      type="text"
                      className="w-full bg-stone-50 border border-stone-200 px-3 py-2.5 rounded-xl text-stone-800"
                      value={umkmForm.owner}
                      onChange={(e) => updateUmkmFormField('owner', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-500 font-bold mb-1">Deskripsi Usaha Singkat</label>
                  <textarea
                    rows={3}
                    className="w-full bg-stone-50 border border-stone-200 px-3 py-2.5 rounded-xl text-stone-800"
                    value={umkmForm.description}
                    onChange={(e) => updateUmkmFormField('description', e.target.value)}
                    required
                  />
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-stone-500 font-bold mb-1">Kategori Sektor</label>
                    <select
                      className="w-full bg-stone-100 border border-stone-200 px-3 py-2.5 rounded-xl text-stone-800 font-semibold"
                      value={umkmForm.category}
                      onChange={(e) => updateUmkmFormField('category', e.target.value)}
                    >
                      <option value="Kuliner">Kuliner</option>
                      <option value="Kerajinan">Kerajinan</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Pertanian">Pertanian</option>
                      <option value="Wisata & Jasa">Wisata & Jasa</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-stone-500 font-bold mb-1">Hiasan Emoji Logo</label>
                    <select
                      className="w-full bg-stone-100 border border-stone-200 px-3 py-2.5 rounded-xl text-stone-850"
                      value={umkmForm.logo}
                      onChange={(e) => updateUmkmFormField('logo', e.target.value)}
                    >
                      <option value="☕">☕ Kopi / Minuman</option>
                      <option value="🍪">🍪 Jajanan / Kue</option>
                      <option value="🧺">🧺 Kerajinan / Tas</option>
                      <option value="🧣">🧣 Pakaian / Kain</option>
                      <option value="🍃">🍃 Petani / Hasil Bumi</option>
                      <option value="🏡">🏡 Penginapan / Wisata</option>
                      <option value="🍯">🍯 Madu / Herbal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-stone-500 font-bold mb-1">Nomor WA Pengusaha</label>
                    <input
                      type="text"
                      className="w-full bg-stone-50 border border-stone-200 px-3 py-2.5 rounded-xl text-stone-800 font-mono"
                      value={umkmForm.whatsapp}
                      placeholder="Contoh: 628112345678"
                      onChange={(e) => updateUmkmFormField('whatsapp', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-500 font-bold mb-1">Rentang Harga Produk</label>
                    <input
                      type="text"
                      className="w-full bg-stone-50 border border-stone-200 px-3 py-2.5 rounded-xl text-stone-800"
                      value={umkmForm.priceRange}
                      placeholder="Contoh: Rp 10.000 - Rp 50.000"
                      onChange={(e) => updateUmkmFormField('priceRange', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-stone-500 font-bold mb-1">Alamat Dusun Lengkap</label>
                    <input
                      type="text"
                      className="w-full bg-stone-50 border border-stone-200 px-3 py-2.5 rounded-xl text-stone-00 text-stone-800"
                      value={umkmForm.address}
                      placeholder="RT 02/RW 01, Dusun Sukamanah"
                      onChange={(e) => updateUmkmFormField('address', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-500 font-bold mb-1">URL Cover Banner Ilustrasi Usaha (Unsplash)</label>
                  <input
                    type="url"
                    className="w-full bg-stone-50 border border-stone-200 px-3 py-2.5 rounded-xl text-stone-800 font-mono"
                    value={umkmForm.image}
                    onChange={(e) => updateUmkmFormField('image', e.target.value)}
                  />
                </div>

                {/* Sub-group: Dynamic Product catalog detail */}
                <div className="bg-stone-100 p-4 rounded-2xl border border-stone-200/80 space-y-3">
                  <span className="font-bold text-[10px] text-stone-400 block uppercase tracking-wider">Detail Informasi Produk Unggulan</span>
                  
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-600 font-medium mb-1">Nama Barang Unggulan</label>
                      <input
                        type="text"
                        className="w-full bg-white border border-stone-200 px-3 py-2 rounded-lg text-stone-800"
                        value={umkmForm.productName}
                        onChange={(e) => updateUmkmFormField('productName', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-stone-600 font-medium mb-1">Harga Satuan (Hanya angka, contoh: 25.000)</label>
                      <input
                        type="text"
                        className="w-full bg-white border border-stone-200 px-3 py-2 rounded-lg text-stone-800 font-mono"
                        value={umkmForm.productPrice}
                        onChange={(e) => updateUmkmFormField('productPrice', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-600 font-medium mb-1">Deskripsi Tambahan Barang</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-stone-200 px-3 py-2 rounded-lg text-stone-700"
                      value={umkmForm.productDesc}
                      onChange={(e) => updateUmkmFormField('productDesc', e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2.5 pt-4 border-t border-stone-100 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsUmkmModalOpen(false)}
                    className="px-4 py-2 text-stone-500 font-bold hover:bg-stone-100 rounded-xl"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-850 hover:bg-emerald-950 text-white font-bold rounded-xl"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* Overlay Modal 2: Add/Edit Berita */}
      <AnimatePresence>
        {isBeritaModalOpen && (
          <div className="fixed inset-0 bg-emerald-950/45 dark:bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-xl border border-stone-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="bg-emerald-950 text-white px-6 py-4 flex items-center justify-between shrink-0">
                <span className="font-serif font-black text-sm uppercase tracking-wide">
                  {beritaEditingId ? 'Edit Artikel Warta' : 'Tulis Warta Baru Desa'}
                </span>
                <button onClick={() => setIsBeritaModalOpen(false)} className="text-emerald-300 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveBeritaModel} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
                <div>
                  <label className="block text-stone-500 font-bold mb-1">Judul Artikel Warta</label>
                  <input
                    type="text"
                    className="w-full bg-stone-50 border border-stone-200 px-3 py-2.5 rounded-xl text-stone-800 font-serif font-bold text-sm"
                    value={beritaForm.title}
                    onChange={(e) => updateBeritaFormField('title', e.target.value)}
                    required
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-500 font-bold mb-1">Kategori Berita</label>
                    <select
                      className="w-full bg-stone-100 border border-stone-200 px-3 py-2.5 rounded-xl text-stone-850 font-bold"
                      value={beritaForm.category}
                      onChange={(e) => updateBeritaFormField('category', e.target.value)}
                    >
                      <option value="UMKM & Ekonomi">UMKM & Ekonomi</option>
                      <option value="Kegiatan Desa">Kegiatan Desa</option>
                      <option value="Pengumuman">Pengumuman</option>
                      <option value="Infrastruktur">Infrastruktur</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-stone-500 font-bold mb-1">Penulis Konten (Author)</label>
                    <input
                      type="text"
                      className="w-full bg-stone-50 border border-stone-200 px-3 py-2.5 rounded-xl text-stone-800"
                      value={beritaForm.author}
                      onChange={(e) => updateBeritaFormField('author', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-500 font-bold mb-1">Ringkasan Singkat (Excerpt)</label>
                  <input
                    type="text"
                    className="w-full bg-stone-50 border border-stone-200 px-3 py-2.5 rounded-xl text-stone-700"
                    placeholder="Ringkasan 1 kalimat yang tampil di kartu daftar..."
                    value={beritaForm.excerpt}
                    onChange={(e) => updateBeritaFormField('excerpt', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-stone-500 font-bold mb-1">Isi Artikel Warta Lengkap</label>
                  <textarea
                    rows={8}
                    className="w-full bg-stone-50 border border-stone-200 px-3 py-2.5 rounded-xl text-stone-800 leading-relaxed font-sans"
                    placeholder="Tuliskan berita secara detil di sini..."
                    value={beritaForm.content}
                    onChange={(e) => updateBeritaFormField('content', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-stone-500 font-bold mb-1">Link URL Foto Sampul Artikel</label>
                  <input
                    type="url"
                    className="w-full bg-stone-50 border border-stone-200 px-3 py-2.5 rounded-xl text-stone-850 font-mono"
                    value={beritaForm.image}
                    onChange={(e) => updateBeritaFormField('image', e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-4 border-t border-stone-100 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsBeritaModalOpen(false)}
                    className="px-4 py-2 text-stone-500 font-bold hover:bg-stone-100 rounded-xl"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-850 hover:bg-emerald-950 text-white font-bold rounded-xl"
                  >
                    Simpan Perubahan
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
