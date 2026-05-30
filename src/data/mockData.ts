import { Umkm, Berita, Aparatur } from '../types';

export const INITIAL_UMKM: Umkm[] = [
  {
    id: 'umkm-1',
    name: 'Kopi Robusta Harumandala Cigugur',
    owner: 'Pak Bowo Semedi',
    description: 'Kopi Robusta asli yang ditanam secara organik di perbukitan Harumandala Cigugur. Melalui proses sortasi ketat dan penyangraian tradisional untuk rasa autentik, pahit cokelat mantap, dan aroma wangi rempah alami.',
    category: 'Pertanian',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop',
    logo: '☕',
    whatsapp: '6281234567890',
    address: 'RT 03 / RW 01, Dusun Sukamanah, Desa Harumandala',
    priceRange: 'Rp 25.000 - Rp 85.000',
    rating: 4.9,
    isVerified: true,
    products: [
      {
        name: 'Kopi Robusta Menoreh Medium Roast 250g',
        price: '35.000',
        description: 'Biji kopi atau bubuk halus sangrai tingkat kematangan sedang, cocok untuk kopi tubruk harian.',
        image: 'https://images.unsplash.com/photo-1610631780747-aa99d554a7c0?q=80&w=400&auto=format&fit=crop'
      },
      {
        name: 'Kopi Robusta Menoreh Dark Roast Premium 250g',
        price: '40.000',
        description: 'Penyangraian gelap dengan aroma cokelat karamel yang tebal tanpa ampas berlebihan.',
        image: 'https://images.unsplash.com/photo-1587049016473-b1219cef4a6f?q=80&w=400&auto=format&fit=crop'
      },
      {
        name: 'Paket Bundling Sajian Tamu (3 Pack x 200g)',
        price: '100.000',
        description: 'Tiga varietas kopi robusta giling medium siap seduh untuk hidangan khas pedesaan.',
        image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=400&auto=format&fit=crop'
      }
    ],
    createdAt: '2026-01-15'
  },
  {
    id: 'umkm-2',
    name: 'Anyaman Bambu Lestari',
    owner: 'Ibu Warsini',
    description: 'Industri kreatif anyaman bambu rumah tangga yang merintis pembuatan alat perlengkapan rumah, wadah hantaran, dan dekorasi estetik modern dari bambu lokal berkualitas tinggi yang tahan jamur.',
    category: 'Kerajinan',
    image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=600&auto=format&fit=crop',
    logo: '🧺',
    whatsapp: '6289876543210',
    address: 'RT 12 / RW 04, Dusun Jelat, Desa Harumandala',
    priceRange: 'Rp 15.000 - Rp 150.000',
    rating: 4.8,
    isVerified: true,
    products: [
      {
        name: 'Rantang Bambu Hantaran 2 Tingkat',
        price: '45.000',
        description: 'Rantang anyaman bambu kokoh dengan pegangan kayu, ramah lingkungan untuk wadah soto atau lauk katering.',
        image: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?q=80&w=400&auto=format&fit=crop'
      },
      {
        name: 'Topi Caping Hias Anyaman Rapi',
        price: '30.000',
        description: 'Caping bambu pelindung sinar matahari tradisional dengan motif anyam rapat khas Jawa Tengah.',
        image: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?q=80&w=400&auto=format&fit=crop'
      },
      {
        name: 'Vase Anyam Ranting Estetik',
        price: '25.000',
        description: 'Wadah tanaman kering bergaya rustic untuk sudut ruang tamu atau atas bufet.',
        image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?q=80&w=400&auto=format&fit=crop'
      }
    ],
    createdAt: '2026-02-10'
  },
  {
    id: 'umkm-3',
    name: 'Gethuk Goreng & Jamu Gendong Ibu Hartini',
    owner: 'Ibu Hartini',
    description: 'Menyajikan kuliner khas legendaris gethuk goreng singkong empuk legit manis gula kelapa murni, serta jamu tradisional basah (kunyit asam, beras kencur, temulawak) tanpa pengawet yang menyehatkan tubuh.',
    category: 'Kuliner',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600&auto=format&fit=crop',
    logo: '🍪',
    whatsapp: '628551234567',
    address: 'RT 01 / RW 02, Dusun Mandala Mekar, Desa Harumandala',
    priceRange: 'Rp 10.000 - Rp 40.000',
    rating: 4.7,
    isVerified: true,
    products: [
      {
        name: 'Gethuk Goreng Legit Gula Aren (Besek Besar)',
        price: '35.000',
        description: 'Satu wadah anyaman bambu (besek) penuh gethuk singkong goreng hangat manis legit renyah.',
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=400&auto=format&fit=crop'
      },
      {
        name: 'Botol Jamu Kunyit Asam Segar 1 Liter',
        price: '20.000',
        description: 'Dibuat dari rimpang kunyit segar pilihan dan asam jawa asli berkhasiat melancarkan sirkulasi.',
        image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=400&auto=format&fit=crop'
      },
      {
        name: 'Jamu Beras Kencur Hangat Botol Kemasan',
        price: '12.000',
        description: 'Minuman berenergi tradisional penyegar badan pegal linu dari saripati kencur asli.',
        image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?q=80&w=400&auto=format&fit=crop'
      }
    ],
    createdAt: '2026-03-01'
  },
  {
    id: 'umkm-4',
    name: 'Batik Tulis Srikandi Sido Mukti',
    owner: 'Ibu Rahayu Wijayanti',
    description: 'Seni batik tulis tradisional eksklusif bertema flora fauna lokal Harumandala yang dikerjakan dengan canting oleh perajin wanita lansia setempat untuk memberdayakan ekonomi perempuan pedesaan.',
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=600&auto=format&fit=crop',
    logo: '🧣',
    whatsapp: '6282244668800',
    address: 'RT 07 / RW 03, Dusun Cibuluh, Desa Harumandala',
    priceRange: 'Rp 150.000 - Rp 1.500.000',
    rating: 5.0,
    isVerified: true,
    products: [
      {
        name: 'Kain Batik Tulis Motif Parang Mulyo 2m',
        price: '350.000',
        description: 'Dibuat menggunakan lilin malam alami di atas kain katun primisima premium super halus.',
        image: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=400&auto=format&fit=crop'
      },
      {
        name: 'Selendang Batik Sutra Cap Tradisional',
        price: '180.000',
        description: 'Sopan dan berkilau mewah, selendang sutra batik bermotif lurik modern dipadukan tradisional.',
        image: 'https://images.unsplash.com/photo-1583258292688-d0213df4a3a8?q=80&w=400&auto=format&fit=crop'
      }
    ],
    createdAt: '2025-12-18'
  },
  {
    id: 'umkm-5',
    name: 'Homestay Pendopo Asri Desa Harumandala',
    owner: 'Pak Lurah Sugeng Widodo',
    description: 'Layanan akomodasi wisata homestay berkonsep joglo kayu kuno yang asri di kelilingi bentangan sawah padi hijau. Tamu dapat merasakan kehidupan bertani, membajak sawah, dan menikmati santapan pagi desa asli.',
    category: 'Wisata & Jasa',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600&auto=format&fit=crop',
    logo: '🏡',
    whatsapp: '6281122334455',
    address: 'RT 02 / RW 01, Dusun Cileutak, Desa Harumandala',
    priceRange: 'Rp 150.000 - Rp 350.000',
    rating: 4.9,
    isVerified: true,
    products: [
      {
        name: 'Sewa Kamar Limasan Kebun 1 Malam',
        price: '175.000',
        description: 'Kamar khas Jawa berkapasitas 2 orang termasuk sarapan nasi liwet dan wedang jahe sereh hangat.',
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=400&auto=format&fit=crop'
      },
      {
        name: 'Paket Tur Edukasi Tani Pelajar (per orang)',
        price: '50.000',
        description: 'Tur keliling kebun organik, praktik memetik teh/padi, membuat anyaman bambu kecil, dan makan siang bersama baceman sawah.',
        image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=400&auto=format&fit=crop'
      }
    ],
    createdAt: '2026-04-22'
  }
];

export const INITIAL_BERITA: Berita[] = [
  {
    id: 'berita-1',
    title: 'Pelatihan Pemasaran Digital Sukses Pacu Omzet Perajin Bambu Desa',
    excerpt: 'Pemerintah Desa Harumandala memfasilitasi pelatihan pemasaran digital gratis untuk mematangkan jangkauan pasar online perajin anyaman bambu lokal.',
    content: `Harumandala – Guna mendongkrak ketahanan ekonomi warga, Pemerintah Desa Harumandala bekerja sama dengan Dinas Perindustrian dan Perdagangan serta praktisi e-commerce menyelenggarakan pelatihan intensif bertema "UMKM Desa Go Digital" di Balai Desa Balairung Makmur.

Kegiatan yang diikuti lebih dari 35 pelaku UMKM kuliner, perajin anyaman, dan pegiat tani ini mengajarkan cara pembuatan deskripsi produk yang memikat, foto produk sederhana bermodal handphone pintar, pengelolaan toko online gratis, hingga optimalisasi pemasaran via media sosial dan WhatsApp Business.

Kepala Desa Harumandala, Bapak Sugeng Widodo menyampaikan, "Selama ini produk bambu dan kopi kita sangat unggul, namun hanya dikenal oleh pembeli lokal sekitar kabupaten. Dengan digitalisasi, kami bertekad anyaman rantang dan kopi kemasan buatan warga Harumandala bisa dikirim ke seluruh nusantara bahkan mancanegara."

Sebagai hasil instan pelatihan, sekarang Anyaman Bambu Lestari milik Ibu Warsini berhasil membuka toko online pertama dan melakukan pengiriman perdana luar provinsi. Program pendampingan ini dijadwalkan berlangsung berkala setiap bulannya sebagai bentuk komitmen dinamis aparatur desa.`,
    category: 'UMKM & Ekonomi',
    date: '28 Mei 2026',
    author: 'Sekdes Amri Setiawan',
    image: 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?q=80&w=600&auto=format&fit=crop',
    views: 145
  },
  {
    id: 'berita-2',
    title: 'Pembangunan Akses Jalan Sawah Dusun Sukamanah Mudahkan Evakuasi Hasil Bumi',
    excerpt: 'Peralihan jalan tanah becek menjadi jalan beton di areal pertanian Sukamanah kini memperlancar mobilisasi pengangkutan gabah dan hasil kopi robusta.',
    content: `Harumandala – Melalui alokasi Dana Desa TA 2026, pembangunan jalan sawah ramah lingkungan berupa pengerasan jalan beton sepanjang 450 meter di komplek pertanian Dusun Sukamanah selesai 100% diproses warga lewat gotong royong.

Sebelumnya, jalan sawah ini berupa jalan tanah liat liat yang sangat licin bila diguyur hujan berat. Kondisi tersebut memaksa petani pengangkut gabah basah membayar biaya angkut pikul manual tambahan yang memberatkan keuntungan bersih paska panen.

Ketua Kelompok Tani "Mulyo Sejati", Mbah Sukarmo, menceritakan kebahagiaannya. "Dulu kalau panen dalam kondisi hujan, motor roda tiga tidak bisa masuk, sekarung kopi harus dipikul 1 kilometer. Sekarang, setelah dibeton rapi, truk pengumpul bisa bersandar langsung dekat sawah. Ongkos kirim terpangkas setengah!"

Selain memudahkan transportasi hasil pertanian, jalan beton baru ini juga kerap dijadikan sarana olahraga pagi jalan sehat warga sambil menghirup udara sawah yang jernih di pagi hari.`,
    category: 'Infrastruktur',
    date: '20 Mei 2026',
    author: 'Kasi Pemerintahan Bambang',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=600&auto=format&fit=crop',
    views: 89
  },
  {
    id: 'berita-3',
    title: 'Agenda Festival Umkm Dan Gelar Budaya Harumandala Di Bulan Juni',
    excerpt: 'Catat tanggalnya! Bazar kuliner rakyat, pertunjukan reog, pameran produk organik eksklusif, hingga temu bisnis investor siap meramaikan balai desa.',
    content: `Harumandala – Kabar gembira bagi seluruh warga desa dan pencinta wisata lokal. Pemerintah Desa Harumandala berkolaborasi dengan komunitas karang taruna akan memamerkan parade produk budaya bertajuk "Seni & UMKM Raya Harumandala 2026".

Festival ini dipersiapkan matang bertempat di Area Lapangan Hijau dan Pendopo Joglo Utama Desa dari tanggal 12 Juni hingga 14 Juni 2026.

Kegiatan menarik yang ditawarkan selama 3 hari festival meliputi:
1. Bazar 1000 Gethuk dan Jamu gratis bagi pengunjung lokal.
2. Kompetisi Menyangrai Kopi Tradisional tingkat kecamatan.
3. Stan Khusus Konsultasi Pendaftaran NIB (Nomor Induk Berusaha) gratis dari Dinas Perizinan.
4. Pentas Kesenian Jathilan dan Tari Srikandi Panah asli pedesaan.

"Kami mengundang seluruh pemuda, pegiat wisata, dan media kabupaten untuk datang memeriahkan pagelaran akbar ini. Inilah momentum terbaik untuk bangga buatan lokal Harumandala!" tutur Mas Fandi selaku Ketua Karang Taruna Desa.`,
    category: 'Kegiatan Desa',
    date: '15 Mei 2026',
    author: 'Karang Taruna Karyatama',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=600&auto=format&fit=crop',
    views: 210
  }
];

export const DESA_APARATUR: Aparatur[] = [
  {
    name: 'Bapak Sugeng Widodo',
    role: 'Kepala Desa Harumandala',
    image: '👨‍💼',
    bio: 'Menjabat sejak 2022 dengan fokus utama peningkatan infrastruktur digital pedesaan, tata kelola dana desa yang transparan, dam pemberdayaan UMKM berbasis kesetaraan peluang ekonomi warga.'
  },
  {
    name: 'Bapak Amri Setiawan, S.IP',
    role: 'Sekretaris Desa',
    image: '🧑‍💻',
    bio: 'Membidangi penyusunan rancangan peraturan desa terpadu, administrasi pelayanan publik kilat 10 menit, serta koordinasi hubungan dengan dinas tingkat kabupaten.'
  },
  {
    name: 'Ibu Listiana Astuti, S.E',
    role: 'Kaur Keuangan & Bendahara',
    image: '👩‍💼',
    bio: 'Bertanggung jawab atas efisiensi arus kas keuangan desa, pelaporan sistem keuangan desa (Siskeudes), dan akuntabilitas audit modal BUMDes.'
  },
  {
    name: 'Ibu Rahmawati Nur',
    role: 'Kasi Kesejahteraan Rakyat',
    image: '👩‍🌾',
    bio: 'Fokus dalam merancang bantalan pengaman bantuan sosial masyarakat, bantuan bibit pertanian unggul, serta fasilitasi pengembangan sarana kesenian pemuda desa.'
  }
];
