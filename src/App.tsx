import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Beranda from './components/Beranda';
import UmkmCatalog from './components/UmkmCatalog';
import TentangDesa from './components/TentangDesa';
import BeritaDesa from './components/BeritaDesa';
import AsistenDigital from './components/AsistenDigital';
import PanelAdmin from './components/PanelAdmin';
import { INITIAL_UMKM, INITIAL_BERITA } from './data/mockData';
import { Umkm, Berita } from './types';
import { Landmark, Phone, Mail, MapPin, Share2, Heart, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path === '/admin' || path.endsWith('/admin')) {
        return 'admin';
      }
    }
    return 'beranda';
  });
  const [categoryFilter, setCategoryFilter] = useState('Semua');
  const [umkmList, setUmkmList] = useState<Umkm[]>([]);
  const [beritaList, setBeritaList] = useState<Berita[]>([]);

  // Listen to browser navigation back/forward (popstate) to properly update activeTab
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handlePopState = () => {
        const path = window.location.pathname;
        if (path === '/admin' || path.endsWith('/admin')) {
          setActiveTab('admin');
        } else {
          setActiveTab('beranda');
        }
      };

      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, []);

  // Update high-level URL state based on active tab selection without affecting the user interface reload
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (activeTab === 'admin') {
        if (path !== '/admin' && !path.endsWith('/admin')) {
          window.history.pushState({ tab: 'admin' }, '', '/admin');
        }
      } else {
        if (path === '/admin' || path.endsWith('/admin')) {
          window.history.pushState({ tab: activeTab }, '', '/');
        } else if (window.location.hash) {
          // Clean up legacy hash if any exists in URL
          window.history.replaceState({ tab: activeTab }, '', path);
        }
      }
    }
  }, [activeTab]);

  // Load and preserve registered local MSMEs & News in client-side localStorage
  useEffect(() => {
    // 1. UMKM loading
    const savedUmkm = localStorage.getItem('harumandala_umkms');
    if (savedUmkm) {
      try {
        setUmkmList(JSON.parse(savedUmkm));
      } catch (err) {
        setUmkmList(INITIAL_UMKM);
      }
    } else {
      setUmkmList(INITIAL_UMKM);
      localStorage.setItem('harumandala_umkms', JSON.stringify(INITIAL_UMKM));
    }

    // 2. Berita / News loading
    const savedBerita = localStorage.getItem('harumandala_news');
    if (savedBerita) {
      try {
        setBeritaList(JSON.parse(savedBerita));
      } catch (err) {
        setBeritaList(INITIAL_BERITA);
      }
    } else {
      setBeritaList(INITIAL_BERITA);
      localStorage.setItem('harumandala_news', JSON.stringify(INITIAL_BERITA));
    }
  }, []);

  const handleAddUmkm = (newUmkm: Umkm) => {
    const updated = [newUmkm, ...umkmList];
    setUmkmList(updated);
    localStorage.setItem('harumandala_umkms', JSON.stringify(updated));
  };

  const handleUpdateBeritaList = (updatedBerita: Berita[]) => {
    setBeritaList(updatedBerita);
    localStorage.setItem('harumandala_news', JSON.stringify(updatedBerita));
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'beranda':
        return (
          <Beranda
            umkmList={umkmList}
            setActiveTab={setActiveTab}
            setCategoryFilter={setCategoryFilter}
          />
        );
      case 'umkm':
        return (
          <UmkmCatalog
            umkmList={umkmList}
            onAddUmkm={handleAddUmkm}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
          />
        );
      case 'tentang':
        return <TentangDesa />;
      case 'berita':
        return <BeritaDesa beritaList={beritaList} />;
      case 'admin':
        return (
          <PanelAdmin
            umkmList={umkmList}
            setUmkmList={setUmkmList}
            beritaList={beritaList}
            setBeritaList={handleUpdateBeritaList}
            setActiveTab={setActiveTab}
          />
        );
      default:
        return (
          <Beranda
            umkmList={umkmList}
            setActiveTab={setActiveTab}
            setCategoryFilter={setCategoryFilter}
          />
        );
    }
  };

  // Automatically scroll to top on tab transition to mimic standard page load
  useEffect(() => {
    handleScrollToTop();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-between text-stone-850 font-sans antialiased">
      
      {/* Dynamic Header Navbar navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container margin padding offsets */}
      <main className="flex-grow pt-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Primary Village Footer */}
      <footer id="primary-footer" className="bg-emerald-950 text-emerald-100 border-t border-emerald-800/40">
        
        {/* Upper Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            
            {/* Logo Brand Profile */}
            <div className="md:col-span-4 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-amber-500 p-2.5 rounded-xl text-emerald-950 shadow-md">
                  <Landmark className="h-6 w-6" />
                </div>
                <div>
                  <span className="block text-2xl font-black text-stone-50 leading-none">Harumandala</span>
                  <span className="block text-[10px] tracking-widest text-amber-400 font-mono uppercase mt-0.5">Kabupaten Pangandaran</span>
                </div>
              </div>
              <p className="text-xs text-emerald-200/85 leading-relaxed font-sans font-light">
                Gerbang digitalisasi komoditi niaga dan pusat aspirasi warga Desa Harumandala. Kolaborasi erat karang taruna, perajin rumah tangga, petani kopi, serta BUMDes mandiri lestari untuk kejayaan ekonomi lokal.
              </p>
              <div className="flex space-x-3 pt-1">
                <a href="#" className="p-2.5 bg-emerald-900 hover:bg-amber-500 hover:text-emerald-950 rounded-xl transition-all text-emerald-200 shadow-sm">
                  <Share2 className="h-4 w-4" />
                </a>
                <a href="mailto:sekretariat@harumandala-desa.id" className="p-2.5 bg-emerald-900 hover:bg-amber-500 hover:text-emerald-950 rounded-xl transition-all text-emerald-200 shadow-sm">
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Quick Sitemaps navigation helper */}
            <div className="md:col-span-3 space-y-4">
              <h4 className="text-xs uppercase font-mono tracking-widest text-amber-400 font-bold">Menu Navigasi</h4>
              <ul className="space-y-2.5 text-xs">
                {[
                  { id: 'beranda', label: 'Beranda Utama' },
                  { id: 'umkm', label: 'Produk UMKM Terverifikasi' },
                  { id: 'tentang', label: 'Profil Aparatur & Pemerintah' },
                  { id: 'berita', label: 'Warta Kegiatan & Pengumuman' },
                  { id: 'admin', label: 'Panel Pengelola Desa (Admin)' },
                ].map((link) => (
                  <li key={link.id}>
                    <button
                      id={`footer-link-${link.id}`}
                      onClick={() => setActiveTab(link.id)}
                      className={`hover:text-amber-400 hover:underline transition-all font-medium text-left ${
                        activeTab === link.id ? 'text-amber-400 font-bold' : 'text-emerald-200/80'
                      }`}
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Direct Address of Sekretariat */}
            <div className="md:col-span-5 space-y-4">
              <h4 className="text-xs uppercase font-mono tracking-widest text-amber-400 font-bold">Sekretariat Balai Desa</h4>
              <div className="space-y-3.5 text-xs font-sans font-light">
                <div className="flex items-start space-x-2.5">
                  <MapPin className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <span className="text-emerald-100 leading-relaxed">
                    Jl. Siliwangi No. 12, Dusun Sukamanah, <br />
                    Desa Harumandala, Kec. Cigugur, Kabupaten Pangandaran, <br />
                    Jawa Barat, ZIP 46392
                  </span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Phone className="h-4 w-4 text-amber-500 shrink-0" />
                  <span className="text-emerald-100 font-mono">+62 (265) 750-1122 / +62 812-3498-5566</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Mail className="h-4 w-4 text-amber-500 shrink-0" />
                  <span className="text-emerald-100">humas@harumandala-desa.id</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Lower Banner Copyright */}
        <div className="bg-emerald-950/80 border-t border-emerald-900 py-6 text-center text-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-3">
            <span className="text-emerald-300">
              © {new Date().getFullYear()} Pemerintah Desa Harumandala. Hak Cipta Dilindungi Undang-Undang.
              <button 
                id="btn-access-operator-desa"
                onClick={() => setActiveTab('admin')} 
                className="ml-2 hover:text-amber-400 underline decoration-dotted font-semibold cursor-pointer focus:outline-none"
              >
                Akses Operator Desa
              </button>
            </span>
            <span className="flex items-center text-[10px] uppercase font-mono tracking-wider text-emerald-400 font-bold">
              <span>Diberdayakan dengan</span>
              <Heart className="h-3.5 w-3.5 text-rose-500 animate-pulse inline mx-1 cursor-pointer" />
              <span>BUMDes Harumandala Lestari Sinergi</span>
            </span>
          </div>
        </div>

      </footer>

      {/* Floating Modern Accessibility and Voice Assistant layer */}
      <AsistenDigital
        umkmList={umkmList}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}
