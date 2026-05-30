import { useState, useEffect, useRef } from 'react';
import { 
  Bot, X, Mic, MicOff, Volume2, VolumeX, Calculator, 
  HelpCircle, Sparkles, ChevronRight, MessageSquare, 
  Plus, Minus, ShoppingCart, Send, Info, CheckCircle2,
  AlertCircle, Landmark, Play, Square
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Umkm, Product } from '../types';

interface AsistenDigitalProps {
  umkmList: Umkm[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function AsistenDigital({
  umkmList,
  activeTab,
  setActiveTab
}: AsistenDigitalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'calc' | 'voice'>('chat');
  
  // Voice Recognition states
  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [voiceFeedback, setVoiceFeedback] = useState('Tekan tombol mikrofon lalu bicaralah...');
  const [isRecognitionSupported, setIsRecognitionSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Voice Synthesis states
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Calculator states
  const [selectedUmkmId, setSelectedUmkmId] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [dusunDestination, setDusunDestination] = useState('sukamanah');
  const [shippingNotes, setShippingNotes] = useState('');

  // Dialog Chat states
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string; date: string }>>([
    { 
      sender: 'bot', 
      text: 'Sampurasun! Selamat datang di Portal Desa Harumandala. Saya adalah Asisten Pendamping Digital Anda. Apa ada yang bisa saya bantu hari ini?',
      date: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Check support for speech
  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
      
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setIsRecognitionSupported(true);
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = 'id-ID';
        
        rec.onstart = () => {
          setIsListening(true);
          setVoiceFeedback('Sistem sedang mendengarkan suara Anda...');
        };

        rec.onresult = (event: any) => {
          const resultText = event.results[0][0].transcript;
          setVoiceText(resultText);
          handleVoiceCommand(resultText);
        };

        rec.onerror = (event: any) => {
          console.error(event);
          setIsListening(false);
          setVoiceFeedback('Suara kurang jelas. Silakan coba lagi.');
        };

        rec.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = rec;
      }
    }
  }, []);

  // Stop reading text when component unmounts or expands
  useEffect(() => {
    return () => {
      cancelSpeech();
    };
  }, []);

  const startVoiceRecognition = () => {
    if (recognitionRef.current && !isListening) {
      setVoiceText('');
      setVoiceFeedback('Menginisiasi mikrofon... Silakan bicara setelah suara berdering.');
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const stopVoiceRecognition = () => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Text to Speech speaker
  const speakText = (text: string) => {
    if (!synthRef.current) return;
    
    cancelSpeech();

    // Clean text from bracket links / emojis
    const cleanText = text
      .replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '')
      .replace(/\*+/g, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'id-ID';
    
    // Attempt to pick Indonesian voice
    const voices = synthRef.current.getVoices();
    const idVoice = voices.find(v => v.lang.includes('id') || v.lang.includes('ID'));
    if (idVoice) {
      utterance.voice = idVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  };

  const cancelSpeech = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  // Processspoken command
  const handleVoiceCommand = (rawText: string) => {
    const text = rawText.toLowerCase().trim();
    setVoiceFeedback(`Menafsirkan: "${rawText}"`);

    // Add user voice chat history
    addChatMessage(rawText, 'user');

    // Rule matches
    if (text.includes('katalog') || text.includes('umkm') || text.includes('produk') || text.includes('galeri')) {
      setActiveTab('umkm');
      const response = 'Mengalihkan Anda ke Direktori Galeri Produk UMKM Desa Harumandala.';
      setVoiceFeedback(`Berhasil: ${response}`);
      addChatMessage(response, 'bot');
      speakText(response);
    } else if (text.includes('beranda') || text.includes('depan') || text.includes('menu utama')) {
      setActiveTab('beranda');
      const response = 'Membuka Halaman Beranda Utama Desa Harumandala.';
      setVoiceFeedback(`Berhasil: ${response}`);
      addChatMessage(response, 'bot');
      speakText(response);
    } else if (text.includes('sejarah') || text.includes('tentang') || text.includes('aparatur') || text.includes('profil')) {
      setActiveTab('tentang');
      const response = 'Membuka Lembaran Profil, Aparatur, dan Sejarah Desa Harumandala.';
      setVoiceFeedback(`Berhasil: ${response}`);
      addChatMessage(response, 'bot');
      speakText(response);
    } else if (text.includes('berita') || text.includes('kabar') || text.includes('warta') || text.includes('pengumuman')) {
      setActiveTab('berita');
      const response = 'Membuka Portal Warta Kabar Kegiatan dan Pengumuman Desa.';
      setVoiceFeedback(`Berhasil: ${response}`);
      addChatMessage(response, 'bot');
      speakText(response);
    } else if (text.includes('cari') || text.includes('temukan')) {
      // Extract search query
      const searchWord = text.replace('cari', '').replace('temukan', '').trim();
      setActiveTab('umkm');
      
      // Dispatch standard browser event to search
      setTimeout(() => {
        const event = new CustomEvent('global-search', { detail: searchWord });
        window.dispatchEvent(event);
      }, 300);

      const response = `Mencari produk "${searchWord}" di Galeri Niaga...`;
      setVoiceFeedback(`Berhasil: ${response}`);
      addChatMessage(response, 'bot');
      speakText(response);
    } else {
      // General QA match through voice
      const reply = matchFAQResponse(text);
      setVoiceFeedback(`Selesai dianalisis.`);
      addChatMessage(reply, 'bot');
      speakText(reply);
    }
  };

  const addChatMessage = (text: string, sender: 'bot' | 'user') => {
    setChatMessages(prev => [...prev, {
      sender,
      text,
      date: getCurrentTime()
    }]);

    // Auto scroll chat box
    setTimeout(() => {
      const container = document.getElementById('digital-chat-box-container');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 100);
  };

  // Simple static FAQ rule processor
  const matchFAQResponse = (text: string): string => {
    const q = text.toLowerCase();
    if (q.includes('cara beli') || q.includes('cara memesan') || q.includes('bagaimana beli') || q.includes('order')) {
      return 'Untuk membeli produk warga Desa Harumandala, Anda tidak perlu repot membuat akun. Cukup jelajahi tab "Katalog UMKM", pilih produk kesukaan Anda, lalu klik tombol "Hubungi WA" (WhatsApp). Anda akan langsung terhubung secara gratis dan tanpa potongan komisi dengan pengusaha aslinya melalui WhatsApp.';
    }
    if (q.includes('daftar umkm') || q.includes('cara mendaftar') || q.includes('daftarkan') || q.includes('registrasi')) {
      return 'Bagi warga Desa Harumandala yang memiliki usaha, Anda bisa mendaftar secara mandiri! Buka halaman "Produk UMKM", klik tombol kuning "+ Daftar UMKM Anda" di kanan atas, lalu isi rincian usaha Anda. Setelah itu, bawa fotokopi KTP/KK ke Sekretariat Balai Desa untuk memperoleh lencana hijau "Diverifikasi Pemdes" dan pengurusan NIB gratis.';
    }
    if (q.includes('lencana hijau') || q.includes('verifikasi') || q.includes('verified')) {
      return 'Lencana Hijau "Diverifikasi Pemdes" adalah tanda sah dari Pemerintah Desa Harumandala bahwa pemilik usaha tersebut adalah warga asli beridentitas terdaftar, produk terjamin kebersihan/aspek usahanya, dan telah didampingi oleh dinas terkait untuk kepastian keamanan berniaga Anda.';
    }
    if (q.includes('ongkir') || q.includes('ongkos kirim') || q.includes('kirim')) {
      return 'Portal Desa kami menyediakan "Simulasi Kalkulator Belanja & Ongkir" mandiri di dalam asisten ini! Desentralisasi pengantaran dikelola mandiri oleh Karang Taruna dan BUMDes Harumandala. Ongkos kirim antar dusun sangat murah (Free hingga Rp3.000 saja) sedangkan luar desa menyesuaikan tarif reguler paket.';
    }
    if (q.includes('dusun') || q.includes('kampung') || q.includes('alamat')) {
      return 'Desa Harumandala terdiri dari 8 Dusun administratif utama, yaitu: Dusun Sukamanah, Dusun Jelat, Dusun Mandala Mekar, Dusun Cibuluh, Dusun Cileutak, Dusun Ciranca, Dusun Cikarees, dan Dusun Ciamapag. Semuanya terintegrasi ke dalam pengayoman Pemerintah Desa Harumandala.';
    }
    if (q.includes('aspirasi') || q.includes('saran') || q.includes('sampaikan ide') || q.includes('pesan kades')) {
      return 'Anda bisa menyampaikan aspirasi, saran, kritik, atau ide produk baru langsung ke Sekretariat secara online dan aman melalui formulir "Kotak Pesan Terpadu Warga" di bagian bawah Halaman Utama Beranda.';
    }
    if (q.includes('terima kasih') || q.includes('nuhun') || q.includes('haturnuhun')) {
      return 'Sama-sama! Senang sekali bisa membantu Anda. Jika ada hal lain seputar administrasi kemudahan usaha Desa Harumandala, silakan tanyakan lagi.';
    }
    return 'Maaf, saya belum mengenali pertanyaan tersebut karena keterbatasan kosakata saya. Silakan klik salah satu tombol panduan faq di bawah yang paling menggambarkan keperluan Anda.';
  };

  const handleFAQClick = (question: string) => {
    addChatMessage(question, 'user');
    const reply = matchFAQResponse(question);
    setTimeout(() => {
      addChatMessage(reply, 'bot');
      speakText(reply);
    }, 450);
  };

  // Calculator computations
  const currentSelectedUmkm = umkmList.find(u => u.id === selectedUmkmId);
  const currentProduct = currentSelectedUmkm?.products[0]; // simple multi-product simulation helper
  
  // Parse numeric price from product price string ("Rp 25.000" or "25.000" etc.)
  const parsePrice = (priceStr: string | undefined): number => {
    if (!priceStr) return 0;
    const cleanNumbers = priceStr.replace(/\D/g, '');
    return parseInt(cleanNumbers, 10) || 0;
  };

  const productPrice = currentProduct ? parsePrice(currentProduct.price) : 0;
  const subtotal = productPrice * quantity;

  // Local shipping fee computation between dusuns of Harumandala
  const getShippingFee = () => {
    if (!selectedUmkmId) return 0;
    
    // Simulating home dusun of UMKM based on address text
    const umkmAddress = currentSelectedUmkm?.address.toLowerCase() || '';
    let umkmDusun = 'sukamanah';
    if (umkmAddress.includes('jelat')) umkmDusun = 'jelat';
    else if (umkmAddress.includes('mandala')) umkmDusun = 'mandala-mekar';
    else if (umkmAddress.includes('cibuluh')) umkmDusun = 'cibuluh';
    else if (umkmAddress.includes('cileutak')) umkmDusun = 'cileutak';
    else if (umkmAddress.includes('ciranca')) umkmDusun = 'ciranca';
    else if (umkmAddress.includes('cikarees')) umkmDusun = 'cikarees';
    else if (umkmAddress.includes('ciamapag')) umkmDusun = 'ciamapag';

    if (dusunDestination === 'luar_kabupaten') {
      return 25000; // Outer province package
    }
    if (dusunDestination === 'luar_desa') {
      return 10000; // Outer district/subdistrict Cigugur
    }
    // Intra-village deliveries
    if (umkmDusun === dusunDestination) {
      return 0; // Same dusun is always FREE of delivery courier fees! Warga initiative.
    }
    return 3000; // Inter-dusun delivery is flat Rp 3.000 by local Karang Taruna riders
  };

  const shippingFee = getShippingFee();
  const totalCost = subtotal + shippingFee;

  // Format IDR helper
  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  };

  const sendCalcToWhatsapp = () => {
    if (!currentSelectedUmkm || !currentProduct) return;
    
    const formattedDestination = dusunDestination === 'luar_desa' 
      ? 'Luar Desa Harumandala (Kec. Cigugur)'
      : dusunDestination === 'luar_kabupaten'
      ? 'Luar Kabupaten / Pengiriman Kurir Nasional'
      : `Dusun ${dusunDestination.replace('-', ' ').toUpperCase()} (Trans-Harumandala)`;

    const waText = 
`*SIMULASI NOTA BELANJA DIGITAL PORTAL DESA*
Halo *${currentSelectedUmkm.name}*, saya ingin memesan produk Anda melalui rincian otomatis kalkulator asisten portal desa Harumandala:

📦 *Produk:* ${currentProduct.name}  
🔢 *Jumlah:* ${quantity} unit  
💵 *Harga Satuan:* ${currentProduct.price}  
───────────────  
💳 *Subtotal:* ${formatIDR(subtotal)}  
🚚 *Ongkos Kirim:* ${formatIDR(shippingFee)} (${formattedDestination})  
💰 *TOTAL TERTAGIH:* *${formatIDR(totalCost)}*  

📍 *Alamat Pengiriman:*  
Dusung Tujuan: ${formattedDestination}
Catatan Tambahan: ${shippingNotes || '-'}

Mohon konfirmasi pesanan ini ya Pak/Bu, terima kasih!`;

    const waLink = `https://wa.me/${currentSelectedUmkm.whatsapp}?text=${encodeURIComponent(waText)}`;
    window.open(waLink, '_blank');
  };

  // Set default selection on mount of panel
  useEffect(() => {
    if (umkmList.length > 0 && !selectedUmkmId) {
      setSelectedUmkmId(umkmList[0].id);
    }
  }, [umkmList, selectedUmkmId]);

  return (
    <>
      {/* Floating Action Trigger (FAB) Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              className="mb-2 mr-1"
            >
              <div className="bg-emerald-950 text-white text-[10px] px-3 py-1 rounded-full shadow-lg border border-emerald-800 font-sans tracking-wide flex items-center space-x-1 uppercase scale-90 font-bold origin-bottom-right">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping"></span>
                <span>Asisten Online</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          id="btn-trigger-floating-asisten"
          onClick={() => {
            setIsOpen(!isOpen);
            cancelSpeech();
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`h-14 w-14 rounded-full flex items-center justify-center shadow-xl border cursor-pointer text-white transition-colors duration-300 ${
            isOpen 
              ? 'bg-amber-500 border-amber-400 text-emerald-950' 
              : 'bg-emerald-850 hover:bg-emerald-900 border-emerald-700'
          }`}
          title="Klik untuk membuka Asisten Digital Harumandala"
        >
          {isOpen ? <X className="h-6 w-6 stroke-[2.5]" /> : <Bot className="h-7 w-7" />}
        </motion.button>
      </div>

      {/* Floating Digital Panel Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="panel-asisten-digital-layer"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed bottom-24 right-4 sm:right-6 w-[94vw] sm:w-[420px] h-[550px] bg-white rounded-3xl border border-stone-200 shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header Banner */}
            <div className="bg-emerald-950 text-white px-5 py-4 flex items-center justify-between border-b border-emerald-900 shrink-0">
              <div className="flex items-center space-x-3">
                <div className="bg-amber-500 p-2 rounded-lg text-emerald-950 shadow-md">
                  <Bot className="h-5 w-5 fill-emerald-950" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-tight leading-none">Pemandu Digital Harumandala</h3>
                  <span className="text-[10px] text-emerald-300 inline-block mt-0.5 font-light">Asisten Inklusif Ramah Lansia</span>
                </div>
              </div>
              <div className="flex items-center space-x-1.5">
                {isSpeaking && (
                  <button
                    onClick={cancelSpeech}
                    className="p-1.5 bg-red-600 rounded-lg text-white hover:bg-red-700 transition"
                    title="Hentikan pembacaan suara"
                  >
                    <VolumeX className="h-3.5 w-3.5 animate-bounce" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-emerald-300 hover:text-white hover:bg-emerald-900 rounded-lg transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Accessibility Segment Switcher Tabs */}
            <div className="flex bg-stone-100 p-1.5 border-b border-stone-200 text-xs gap-1 shrink-0">
              <button
                onClick={() => { setActiveSubTab('chat'); cancelSpeech(); }}
                className={`flex-1 flex items-center justify-center py-2 rounded-xl font-medium transition-all ${
                  activeSubTab === 'chat' 
                    ? 'bg-white text-emerald-950 shadow-sm font-semibold' 
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <MessageSquare className="h-3.5 w-3.5 mr-1" />
                <span>Asisten FAQ</span>
              </button>
              <button
                onClick={() => { setActiveSubTab('calc'); cancelSpeech(); }}
                className={`flex-1 flex items-center justify-center py-2 rounded-xl font-medium transition-all ${
                  activeSubTab === 'calc' 
                    ? 'bg-white text-emerald-950 shadow-sm font-semibold' 
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Calculator className="h-3.5 w-3.5 mr-1" />
                <span>Hitung Ongkir</span>
              </button>
              <button
                onClick={() => { setActiveSubTab('voice'); cancelSpeech(); }}
                className={`flex-1 flex items-center justify-center py-2 rounded-xl font-medium transition-all ${
                  activeSubTab === 'voice' 
                    ? 'bg-white text-emerald-950 shadow-sm font-semibold' 
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Mic className="h-3.5 w-3.5 mr-1" />
                <span>Pencari Suara</span>
              </button>
            </div>

            {/* Content Body Panels */}
            <div className="flex-1 overflow-hidden bg-stone-50" id="digital-asisten-main-viewport">
              
              {/* TAB 1: FAQ INTERACTIVE BOT */}
              {activeSubTab === 'chat' && (
                <div className="h-full flex flex-col justify-between">
                  {/* Messages list */}
                  <div 
                    id="digital-chat-box-container" 
                    className="flex-grow p-4 overflow-y-auto space-y-4"
                  >
                    {chatMessages.map((msg, i) => (
                      <div 
                        key={i} 
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[85%] rounded-2xl p-3.5 text-xs shadow-sm leading-relaxed ${
                            msg.sender === 'user' 
                              ? 'bg-emerald-850 text-white rounded-tr-none' 
                              : 'bg-white text-stone-800 border border-stone-200/80 rounded-tl-none font-sans'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <span className="font-bold text-[10px] tracking-wider uppercase opacity-75">
                              {msg.sender === 'user' ? 'Pertanyaan Anda' : 'Tim Pendamping Desa'}
                            </span>
                            <span className="text-[9px] opacity-50">{msg.date}</span>
                          </div>
                          <p>{msg.text}</p>
                          
                          {/* TTS Option for BOT response */}
                          {msg.sender === 'bot' && (
                            <button
                              onClick={() => speakText(msg.text)}
                              className="mt-2.5 flex items-center space-x-1 text-emerald-700 hover:text-emerald-950 text-[10px] font-bold border border-emerald-100 rounded-lg px-2 py-1 bg-emerald-50 max-w-max"
                            >
                              <Volume2 className="h-3 w-3 animate-pulse" />
                              <span>Putar Audio Deskripsi</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Suggestion Quick Tags */}
                  <div className="p-3 bg-white border-t border-stone-200 space-y-2 shrink-0">
                    <span className="text-[10px] px-1 uppercase tracking-widest text-stone-400 font-bold block">
                      Klik Pertanyaan Umum (FAQ) untuk Laybipula / Orang Awam:
                    </span>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pb-1">
                      {[
                        'Bagaimana cara memesan?',
                        'Bagaimana mendaftarkan usaha baru saya di portal?',
                        'Apa itu Lencana Hijau terverifikasi Pemdes?',
                        'Sebutkan dusun di Desa Harumandala?',
                        'Bagaimana cara menyampaikan aspirasi?',
                      ].map((q) => (
                        <button
                          key={q}
                          onClick={() => handleFAQClick(q)}
                          className="px-2.5 py-1.5 bg-stone-100 hover:bg-emerald-50 hover:text-emerald-900 border border-stone-200/60 rounded-lg text-[10px] text-stone-700 text-left transition"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ESTIMASI TRANSAKSI & ONGKIR */}
              {activeSubTab === 'calc' && (
                <div className="h-full overflow-y-auto p-5 space-y-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
                    <Info className="h-4.5 w-4.5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="font-bold">Inovasi Layanan Antar-Dusun:</span>
                      <p className="leading-relaxed">
                        Pengiriman barang antar dusun dijalankan langsung oleh petugas logistik Karang Taruna Harumandala. Kurir internal ini memotong harga layanan paket agar transaksi desa berputar secara langsung!
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3.5">
                    {/* Select UMKM */}
                    <div>
                      <label className="text-[11px] uppercase font-bold text-stone-400 block mb-1.5">1. Pilih Usaha UMKM Warga</label>
                      <select
                        value={selectedUmkmId}
                        onChange={(e) => {
                          setSelectedUmkmId(e.target.value);
                          setQuantity(1);
                        }}
                        className="w-full bg-white border border-stone-200 focus:outline-none focus:border-emerald-600 rounded-xl px-3.5 py-2.5 text-xs text-stone-800"
                      >
                        <option value="">-- Pilih UMKM --</option>
                        {umkmList.map(u => (
                          <option key={u.id} value={u.id}>{u.name} ({u.owner})</option>
                        ))}
                      </select>
                    </div>

                    {/* Display Product Detail */}
                    {currentProduct && (
                      <div className="bg-white rounded-2xl p-4 border border-stone-200 space-y-3 shadow-xs">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={currentProduct.image} 
                            alt={currentProduct.name} 
                            className="h-12 w-12 object-cover rounded-xl shrink-0" 
                          />
                          <div className="flex-1 min-w-0">
                            <span className="block font-bold text-xs text-stone-800 truncate">{currentProduct.name}</span>
                            <span className="block text-emerald-800 font-mono text-xs font-bold leading-none mt-1">{currentProduct.price}</span>
                          </div>
                        </div>

                        {/* Quantity input target min 44px for thumbs */}
                        <div className="flex items-center justify-between bg-stone-50 p-2 rounded-xl">
                          <span className="text-stone-500 text-xs">Atur Jumlah Beli:</span>
                          <div className="flex items-center space-x-1.5">
                            <button
                              onClick={() => setQuantity(q => Math.max(1, q - 1))}
                              className="h-10 w-10 bg-white hover:bg-stone-100 border border-stone-200 rounded-xl flex items-center justify-center text-stone-600 transition"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-10 text-center font-bold font-mono text-sm text-stone-800">{quantity}</span>
                            <button
                              onClick={() => setQuantity(q => q + 1)}
                              className="h-10 w-10 bg-white hover:bg-stone-100 border border-stone-200 rounded-xl flex items-center justify-center text-stone-600 transition"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Shipping Destination */}
                    <div>
                      <label className="text-[11px] uppercase font-bold text-stone-400 block mb-1.5">2. Dusun Tujuan Pengiriman</label>
                      <select
                        value={dusunDestination}
                        onChange={(e) => setDusunDestination(e.target.value)}
                        className="w-full bg-white border border-stone-200 focus:outline-none focus:border-emerald-600 rounded-xl px-3.5 py-2.5 text-xs text-stone-800"
                      >
                        <option value="sukamanah">Dusun Sukamanah (Sama Dusun / FREE)</option>
                        <option value="jelat">Dusun Jelat</option>
                        <option value="mandala-mekar">Dusun Mandala Mekar</option>
                        <option value="cibuluh">Dusun Cibuluh</option>
                        <option value="cileutak">Dusun Cileutak</option>
                        <option value="ciranca">Dusun Ciranca</option>
                        <option value="cikarees">Dusun Cikarees</option>
                        <option value="ciamapag">Dusun Ciamapag</option>
                        <option value="luar_desa">Luar Desa (Kec. Cigugur)</option>
                        <option value="luar_kabupaten">Luar Kabupaten / Nasional</option>
                      </select>
                    </div>

                    {/* Delivery Notes */}
                    <div>
                      <label className="text-[11px] uppercase font-bold text-stone-400 block mb-1.5">3. Alamat Detail & Catatan Kurir</label>
                      <textarea
                        value={shippingNotes}
                        onChange={(e) => setShippingNotes(e.target.value)}
                        placeholder="Contoh: RT 03/RW02, samping Mushola Al-Hidayah, titip pos ronda depan jika mati lampu"
                        className="w-full text-xs bg-white border border-stone-200 focus:outline-none focus:border-emerald-600 rounded-xl px-3.5 py-2.5 h-16 resize-none font-sans"
                      />
                    </div>

                    {/* Calc Result Block */}
                    {selectedUmkmId && currentProduct && (
                      <div className="bg-emerald-950 text-emerald-100 rounded-2xl p-4.5 space-y-3.5 shadow-md">
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block border-b border-emerald-900 pb-1.5">Estimasi Transaksi</span>
                        
                        <div className="space-y-1.5 text-xs font-sans">
                          <div className="flex justify-between">
                            <span className="opacity-75">Subtotal Produk ({quantity}x):</span>
                            <span className="font-mono font-semibold">{formatIDR(subtotal)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="opacity-75">Ongkos Kirim Desa:</span>
                            <span className="font-mono font-semibold">
                              {shippingFee === 0 ? 'Gratis Ongkir (Rp0)' : formatIDR(shippingFee)}
                            </span>
                          </div>
                          <div className="flex justify-between text-white font-bold border-t border-emerald-900/60 pt-2.5 text-sm">
                            <span>TOTAL KESELURUHAN:</span>
                            <span className="font-mono text-amber-400">{formatIDR(totalCost)}</span>
                          </div>
                        </div>

                        <button
                          onClick={sendCalcToWhatsapp}
                          className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-emerald-950 rounded-xl text-xs font-black transition shadow-md flex items-center justify-center space-x-2"
                        >
                          <Send className="h-4 w-4" />
                          <span>Kirim Rincian Langsung ke WA UMKM</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: VOICE SEARCH & ACTIONS */}
              {activeSubTab === 'voice' && (
                <div className="h-full flex flex-col justify-between p-6">
                  <div className="space-y-4">
                    <div className="text-center space-y-2">
                      <span className="text-xs font-semibold text-emerald-800 uppercase tracking-widest block">Fitur Asisten Akustik</span>
                      <h4 className="text-lg font-bold text-stone-900 font-serif">Pencarian Suara Gema Desa</h4>
                      <p className="text-xs text-stone-500 leading-relaxed max-w-sm mx-auto">
                        Cukup ucapkan barang yang Anda cari atau bagian portal yang ingin Anda buka, asisten kami akan langsung menganalisis dan mengantarkan Anda ke sana secara otomatis.
                      </p>
                    </div>

                    {/* Microphone container */}
                    <div className="flex flex-col items-center justify-center py-6 space-y-4">
                      {isListening ? (
                        <div className="relative">
                          {/* Pulsing animation */}
                          <div className="absolute inset-0 bg-red-500/25 rounded-full animate-ping scale-150"></div>
                          <button
                            onClick={stopVoiceRecognition}
                            className="relative h-20 w-20 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg border-4 border-white cursor-pointer"
                          >
                            <MicOff className="h-8 w-8" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={startVoiceRecognition}
                          disabled={!isRecognitionSupported}
                          className={`h-20 w-20 rounded-full flex items-center justify-center shadow-lg border-4 border-white cursor-pointer transition-colors duration-200 ${
                            isRecognitionSupported 
                              ? 'bg-emerald-800 hover:bg-emerald-950 text-white' 
                              : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                          }`}
                        >
                          <Mic className="h-8 w-8" />
                        </button>
                      )}

                      <div className="text-center min-h-[40px] space-y-1">
                        <p className={`text-xs ${isListening ? 'text-red-500 font-bold animate-pulse' : 'text-stone-700'}`}>
                          {isListening ? 'Sedang Mendengarkan Suara Anda...' : 'Mikrofon Sedia / Standby'}
                        </p>
                        <p className="text-[11px] text-stone-400 max-w-xs">{voiceFeedback}</p>
                      </div>
                    </div>

                    {/* Output Text Block */}
                    {voiceText && (
                      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-center">
                        <span className="text-[10px] text-emerald-700 block uppercase font-bold tracking-wider mb-0.5">Suara Terjemah:</span>
                        <p className="text-stone-800 text-xs italic font-medium">"{voiceText}"</p>
                      </div>
                    )}
                  </div>

                  {/* Commands hints list */}
                  <div className="bg-stone-100 p-3.5 rounded-2xl border border-stone-200/50 text-xs text-stone-600 space-y-1.5">
                    <span className="font-bold flex items-center text-stone-800 text-[10px] uppercase tracking-widest leading-none mb-1">
                      <Sparkles className="h-3 w-3 text-amber-500 mr-1" />
                      Daftar Kalimat yang Bisa Anda Katakan:
                    </span>
                    <ul className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] font-mono list-disc list-inside">
                      <li>"Cari Kopi"</li>
                      <li>"Cari Anyaman"</li>
                      <li>"Buka Katalog"</li>
                      <li>"Mengenal Desa"</li>
                      <li>"Buka Berita"</li>
                      <li>"Kembali Beranda"</li>
                    </ul>
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
