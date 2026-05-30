import { motion } from 'motion/react';
import { ShieldAlert, Users, Calendar, MapPin, Award, CheckCircle } from 'lucide-react';
import { DESA_APARATUR } from '../data/mockData';

export default function TentangDesa() {
  const visi = 'Mewujudkan Desa Harumandala yang mandiri, berbudaya luhur, berkeadilan sosial, unggul dalam pertanian terpadu dan pariwisata berbasis pemberdayaan warga melalui sinergi teknologi informasi.';
  const misi = [
    'Meningkatkan transparansi tata kelola pemerintahan desa berbasis layanan sistem informasi digital terpadu.',
    'Pemberdayaan klaster UMKM, pertanian organik, serta BUMDes sebagai roda utama penggerak perekonomian mandiri warga.',
    'Pembangunan infrastruktur jalan usaha tani dan sarana publik merata untuk mempercepat kelayakan niaga hasil bumi.',
    'Melestarikan warisan tradisi budaya, kesenian lokal, anyaman bambu, dan kriya batik pedesaan.',
    'Mewujudkan layanan kesehatan ramah lansia, gizi balita prima, dan fasilitas beasiswa pendidikan dhuafa.'
  ];

  const statistics = [
    { label: 'Luas Wilayah', value: '345 Hektar', desc: 'Sawah basah, perbukitan & perkebunan' },
    { label: 'Jumlah Penduduk', value: '4.850 Jiwa', desc: 'Terbagi dalam 1.250 Kepala Keluarga' },
    { label: 'Batas Wilayah', value: 'Kecamatan Cigugur', desc: 'Pesisir perbukitan subur selatan Jawa Barat' },
    { label: 'Sektor Utama', value: 'Pertanian & Kriya', desc: 'Kopi, Padi organik, Anyaman, Kriya Kayu' }
  ];

  return (
    <div id="tentang-desa-root" className="space-y-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Intro Header */}
      <div className="text-center md:text-left flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-stone-200 pb-8">
        <div className="space-y-2">
          <span className="text-xs font-semibold text-emerald-800 uppercase tracking-widest block">Mengenal Tanah Kelahiran</span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-stone-900 font-serif tracking-tight">Sekilas Tentang Harumandala</h1>
          <p className="text-sm text-stone-500 max-w-2xl leading-relaxed">
            Menjunjung kedaulatan pangan, mengolah kreativitas tradisi, dan membangun kemandirian ekonomi inklusif melalui sinergi internet pedesaan.
          </p>
        </div>
      </div>

      {/* Profile & History Row */}
      <section id="village-profile" className="grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5 space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-850 rounded-3xl transform -rotate-2 scale-102 opacity-10" />
            <img
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=600&auto=format&fit=crop"
              alt="Profil Desa"
              className="rounded-3xl shadow-md border border-stone-100 object-cover w-full h-[380px]"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
        <div className="lg:col-span-7 space-y-6">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block">Sejarah & Letak Geografis</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif leading-tight">Keindahan Tersembunyi di Lembah Hijau Cigugur</h2>
          <p className="text-stone-600 leading-relaxed text-sm">
            Terletak sekitar 35 km dari pusat pemerintahan kabupaten, <strong>Desa Harumandala</strong> dianugerahi tanah subur dengan iklim tropis sejuk perbukitan. Desa ini didirikan sejak lama sebagai pusat pemukiman petani perkebunan kopi dan pengrajin lokal.
          </p>
          <p className="text-stone-600 leading-relaxed text-sm">
            Hingga saat ini, tradisi keluhuran budi gotong-royong terus berurat nadi di tengah warga. Terdiri dari 8 dusun utama (Sukamanah, Jelat, Mandala Mekar, Cibuluh, Cileutak, Ciranca, Cikarees, dan Ciamapag), kami berkomitmen bersama mempertahankan kelestarian alam sambil merangkul digitalisasi untuk melebarkan pasar produk unggulan warga.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="flex items-start gap-2 text-stone-500">
              <MapPin className="h-5 w-5 text-emerald-800 shrink-0 mt-0.5" />
              <span className="text-xs italic leading-tight">Pangandaran - Jawa Barat</span>
            </div>
            <div className="flex items-start gap-2 text-stone-500">
              <Award className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <span className="text-xs italic leading-tight">Juara Pembina UMKM Digital Terpadu 2025</span>
            </div>
          </div>
        </div>
      </section>

      {/* Demographics numbers */}
      <section id="village-demographics" className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-stone-100 p-8 rounded-3xl">
        {statistics.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-stone-200/65 space-y-2 shadow-sm text-center md:text-left">
            <span className="text-stone-400 block text-[9px] uppercase font-bold tracking-wider">{stat.label}</span>
            <span className="text-lg md:text-xl font-extrabold text-emerald-950 block font-sans">{stat.value}</span>
            <span className="text-stone-500 block text-[11px] leading-snug">{stat.desc}</span>
          </div>
        ))}
      </section>

      {/* Vision & Mission Card layout */}
      <section id="vision-mission" className="grid lg:grid-cols-2 gap-12">
        {/* Visi */}
        <div className="bg-emerald-950 rounded-3xl p-8 md:p-10 shadow-lg text-white border border-emerald-800 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-xs font-mono tracking-widest text-amber-400 uppercase font-semibold">Cita-cita Mulia</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-sans">Visi Utama Pemdes</h3>
            <p className="text-emerald-100 text-sm sm:text-base font-sans font-light leading-relaxed italic border-l-2 border-amber-400 pl-4 py-1">
              "{visi}"
            </p>
          </div>
          <div className="pt-6 text-xs text-emerald-300 font-mono">
            Rencana Strategis Pembangunan Sektor Jangka Panjang (RPJMDes)
          </div>
        </div>

        {/* Misi */}
        <div className="bg-white rounded-3xl p-8 md:p-10 border border-stone-200 shadow-sm space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-widest block">Langkah Konkret</span>
            <h3 className="text-2xl font-extrabold text-stone-900 font-serif">Misi Kerja Unggulan</h3>
          </div>
          <ul className="space-y-4 text-xs sm:text-sm text-stone-600 font-sans font-light leading-relaxed">
            {misi.map((m, idx) => (
              <li key={idx} className="flex gap-3 items-start">
                <div className="bg-emerald-50 text-emerald-850 rounded-full p-1 shrink-0 mt-0.5">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Aparatur Desa Organizational Profile */}
      <section id="village-aparatur" className="space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-semibold text-emerald-800 uppercase tracking-widest block">Pejabat Publik</span>
          <h2 className="text-3xl font-bold text-stone-900 font-serif">Aparatur Pemerintahan Desa</h2>
          <p className="text-stone-500 max-w-xl mx-auto text-sm leading-relaxed">
            Siap melayani warga dengan tulus dan transparan demi kemakmuran bersama Desa Harumandala.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {DESA_APARATUR.map((officer, index) => (
            <div
              key={index}
              id={`officer-card-${index}`}
              className="bg-white rounded-2xl border border-stone-250/70 p-6 flex flex-col justify-between space-y-4 hover:shadow-md transition-all group"
            >
              <div className="space-y-3 text-center sm:text-left">
                <div className="relative text-5xl bg-stone-50 p-6 rounded-2xl w-max mx-auto sm:mx-0 shadow-inner group-hover:scale-102 transition-transform">
                  {officer.image}
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 leading-tight block group-hover:text-emerald-800 transition-colors">{officer.name}</h3>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-800 font-semibold block mt-0.5">{officer.role}</span>
                </div>
                <p className="text-xs text-stone-500 leading-relaxed font-sans font-light">
                  {officer.bio}
                </p>
              </div>
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400 font-mono">
                <span>Dusun Dinas</span>
                <span className="text-stone-700 font-semibold">Sekretariat Balai Desa</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Office Hours & Emergency numbers */}
      <section id="village-hours" className="grid md:grid-cols-12 gap-8 items-stretch">
        <div className="md:col-span-12 lg:col-span-7 bg-white p-6 md:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-widest block">Pelayanan Publik</span>
            <h3 className="text-xl font-bold font-sans text-stone-900">Jam Operasional Pelayanan Administrasi</h3>
            <p className="text-xs text-stone-400">Balai Desa melayani surat menyurat, pendaftaran UMKM, sengketa, dan KTP.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 text-stone-400 uppercase tracking-wider text-[10px] font-bold bg-stone-50 pr-2">
                  <th className="py-2.5 px-3">Hari Dinas</th>
                  <th className="py-2.5 px-3">Jam Kerja</th>
                  <th className="py-2.5 px-3">Status Layanan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-600">
                <tr>
                  <td className="py-3 px-3 font-semibold text-stone-900">Senin - Kamis</td>
                  <td className="py-3 px-3 font-mono">08:00 - 15:00 WIB</td>
                  <td className="py-3 px-3 text-emerald-600 font-semibold flex items-center gap-1">● Layanan Penuh</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-stone-900">Jumat</td>
                  <td className="py-3 px-3 font-mono">08:00 - 11:30 WIB</td>
                  <td className="py-3 px-3 text-emerald-600 font-semibold flex items-center gap-1">● Istirahat Cepat</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-stone-400">Sabtu - Minggu</td>
                  <td className="py-3 px-3 font-mono text-stone-400">Tutup Kepegawaian</td>
                  <td className="py-3 px-3 text-amber-600 font-semibold flex items-center gap-1">⚠ Hanya Darurat</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="md:col-span-12 lg:col-span-5 bg-emerald-950 p-6 md:p-8 rounded-3xl text-white space-y-6 flex flex-col justify-between border border-emerald-850">
          <div className="space-y-2">
            <span className="text-xs font-mono tracking-widest text-amber-400 uppercase font-semibold">Respons Cepat Darurat</span>
            <h3 className="text-xl font-bold font-sans">Saluran Bantuan Terpadu</h3>
            <p className="text-emerald-100 text-xs sm:text-sm font-sans font-light leading-relaxed">
              Bila terjadi bencana, kendala krusial, atau butuh bantuan darurat desa mengenai keamanan, kesehatan, dan pemadam kebakaran, hubungi nomor di bawah:
            </p>
          </div>
          <div className="space-y-3 pt-2" id="footer-contact">
            <div className="bg-emerald-900/60 rounded-xl p-3 border border-emerald-800 flex justify-between items-center text-xs">
              <span className="font-medium text-stone-100">📞 Nomor Kedes Harumandala</span>
              <strong className="text-amber-400 font-mono font-bold">+62 811-2233-4455</strong>
            </div>
            <div className="bg-emerald-900/60 rounded-xl p-3 border border-emerald-800 flex justify-between items-center text-xs">
              <span className="font-medium text-stone-100">🚨 Ambulans Desa Siaga</span>
              <strong className="text-amber-400 font-mono font-bold">+62 855-1234-567</strong>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
