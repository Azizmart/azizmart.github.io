import { useState, useEffect } from 'react';
import { Menu, X, Landmark, ShoppingBag, BookOpen, Info, PhoneCall } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'beranda', label: 'Beranda', icon: Landmark },
    { id: 'umkm', label: 'UMKM Desa', icon: ShoppingBag },
    { id: 'tentang', label: 'Tentang Desa', icon: Info },
    { id: 'berita', label: 'Berita & Kegiatan', icon: BookOpen },
  ];

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-emerald-950/95 backdrop-blur-md shadow-lg py-3 border-b border-emerald-800/30'
          : 'bg-emerald-900 py-4 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <div
            id="navbar-brand"
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => setActiveTab('beranda')}
          >
            <div className="bg-amber-500 p-2 rounded-xl text-emerald-950 shadow-md">
              <Landmark className="h-6 w-6" />
            </div>
            <div>
              <span className="block text-xl font-bold font-sans text-white tracking-tight">
                Harumandala
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-amber-400 font-mono font-medium -mt-1">
                Portal Desa & UMKM
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1" id="desktop-menu-items">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-btn-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${
                    isActive
                      ? 'text-white font-semibold'
                      : 'text-emerald-100 hover:text-white hover:bg-emerald-800/40'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTabUnderline"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-amber-400"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Call to Action Button */}
          <div className="hidden md:block">
            <button
              id="cta-emergency-contact"
              onClick={() => {
                const element = document.getElementById('footer-contact');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                } else {
                  setActiveTab('tentang');
                  setTimeout(() => {
                    document.getElementById('footer-contact')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }
              }}
              className="px-4 py-2 border border-amber-500/50 hover:border-amber-500 bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-emerald-950 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 flex items-center space-x-2 shadow-inner"
            >
              <PhoneCall className="h-3.5 w-3.5" />
              <span>Kontak Penting</span>
            </button>
          </div>

          {/* Mobile hamburger menu */}
          <div className="md:hidden flex items-center">
            <button
              id="mobile-menu-trigger"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-emerald-100 hover:text-white hover:bg-emerald-800/50 focus:outline-none transition-all"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-emerald-950 border-b border-emerald-800/50 px-4 pt-2 pb-6 space-y-2 overflow-hidden shadow-2xl"
          >
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-mobile-${item.id}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-base font-medium flex items-center space-x-3 transition-all ${
                    isActive
                      ? 'bg-amber-500 text-emerald-950 font-semibold shadow-md'
                      : 'text-emerald-100 hover:bg-emerald-900/60 hover:text-white'
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            <div className="pt-4 border-t border-emerald-800/50">
              <button
                id="mobile-cta-contact"
                onClick={() => {
                  setIsOpen(false);
                  const element = document.getElementById('footer-contact');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    setActiveTab('tentang');
                    setTimeout(() => {
                      document.getElementById('footer-contact')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }
                }}
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-emerald-950 text-center font-bold rounded-xl shadow-md flex items-center justify-center space-x-2"
              >
                <PhoneCall className="h-4 w-4" />
                <span>Hubungi Pemerintah Desa</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
