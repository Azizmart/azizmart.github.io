export interface Product {
  name: string;
  price: string;
  description: string;
  image: string;
}

export interface Umkm {
  id: string;
  name: string;
  owner: string;
  description: string;
  category: 'Kuliner' | 'Kerajinan' | 'Fashion' | 'Pertanian' | 'Wisata & Jasa';
  image: string;
  logo: string;
  whatsapp: string; // WhatsApp number
  address: string;
  priceRange: string;
  rating: number;
  isVerified: boolean;
  products: Product[];
  createdAt: string;
}

export interface Berita {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'UMKM & Ekonomi' | 'Kegiatan Desa' | 'Pengumuman' | 'Infrastruktur';
  date: string;
  author: string;
  image: string;
  views: number;
}

export interface Aparatur {
  name: string;
  role: string;
  image: string;
  bio: string;
}

export interface Aspirasi {
  id: string;
  name: string;
  dusun: string;
  message: string;
  status: 'Belum Dibaca' | 'Sedang Ditindaklanjuti' | 'Selesai';
  date: string;
}

