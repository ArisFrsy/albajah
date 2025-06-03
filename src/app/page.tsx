// Misalkan file ini disimpan sebagai: components/CompanyProfileDashboardGreen.tsx
// atau pages/profil-perusahaan-hijau.tsx jika menggunakan Next.js Pages Router

import React from 'react';

import { dummyAdvertise } from './dummyAdvertise';
import { dummyGallery } from './dummyGallery';
import { paketHajiUmrah } from './dummyProduct';
import { izinAlBahjah } from './izin-albahjah'; // Sesuaikan path jika perlu

import { redirect } from 'next/navigation';
// Import ikon dari lucide-react
import {
  ExternalLink,
  ImageIcon,
  Package,
  ShieldCheck,
  Plane,
  Landmark,
  Briefcase,
  Award,
  FileText,
  Clock,
  MapPin,
  CheckCircle,
  Building,
} from 'lucide-react';

// Mendefinisikan tipe data untuk type safety (opsional namun direkomendasikan)
interface Advertise {
  id: number;
  name: string;
  image: string;
  description: string;
}

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
}

interface Harga {
  idr: number | null;
  usd: number | null;
}

// Asumsi variabel gambar yang diimpor adalah objek dengan properti 'src' atau string path
interface ImportedImage {
  src: string;
  height?: number;
  width?: number;
  blurDataURL?: string;
}

interface SubPaket {
  id: number;
  namaSubPaket: string;
  slug: string;
  deskripsi: string;
  harga: Harga;
  gambar: (ImportedImage | string)[];
  durasi?: string;
  hotel_makkah?: string;
  hotel_madinah?: string;
  penerbangan?: string;
  keberangkatan_hijriah?: string;
  keberangkatan_masehi?: string;
  include?: string[];
  perlengkapan?: string[];
}

interface Paket {
  id: number;
  namaPaket: string;
  deskripsi: string;
  harga: Harga;
  durasi: string | null;
  destinasi?: string[];
  gambar: string;
  lokasi: string;
  subPaket: SubPaket[];
}

interface Izin {
  nama: string;
  nomor: string;
  berlaku_mulai?: string;
  berlaku_mula?: string;
  deskripsi: string;
}

// Helper function untuk mendapatkan src gambar dari subPaket
const getSubPaketImageSrc = (gambarArray: (ImportedImage | string)[]): string => {
  if (!gambarArray || gambarArray.length === 0) {
    return '/images/placeholder.jpg'; // Fallback image
  }
  const firstImage = gambarArray[0];
  if (typeof firstImage === 'string') {
    return firstImage;
  }
  return firstImage.src || '/images/placeholder.jpg';
};


const CompanyProfileDashboardGreenPage = () => {
  redirect('/dashboard'); // Redirect ke halaman dashboard

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      {/* Header Utama */}
      <header className="bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 text-white shadow-2xl sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between items-center py-4">
          <div className="flex items-center gap-3">
            <Building size={36} />
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Al-Bahjah Tour & Travel
            </h1>
          </div>
          <nav className="mt-2 sm:mt-0">
            <ul className="flex space-x-3 sm:space-x-4 text-sm sm:text-base">
              {['Layanan', 'Rekanan', 'Galeri', 'Legalitas'].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="hover:text-yellow-300 transition-colors duration-300 pb-1 border-b-2 border-transparent hover:border-yellow-300"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8 space-y-16 mt-8">
        {/* Bagian Hero */}
        <section className="relative text-center py-16 md:py-24 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-10"
            style={{ backgroundImage: "url('/images/gallery/gallery_2.jpg')" }} // Ganti dengan gambar hero yang relevan
          ></div>
          <div className="relative z-10 px-4">
            <h2 className="text-4xl lg:text-5xl font-extrabold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-700">
                Perjalanan Ibadah Aman & Terpercaya
              </span>
            </h2>
            <p className="text-lg text-slate-700 max-w-3xl mx-auto mb-8">
              Al-Bahjah Tour & Travel berkomitmen memberikan pengalaman Haji dan Umrah terbaik, dibimbing langsung oleh para asatidz berpengalaman, sesuai tuntunan Al-Qur'an dan As-Sunnah.
            </p>
            <a
              href="#layanan"
              className="inline-block bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transform transition-all duration-300 text-lg"
            >
              Lihat Paket Kami
            </a>
          </div>
        </section>

        {/* Bagian Paket Haji & Umrah */}
        <section id="layanan" className="scroll-mt-24">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800 mb-12 flex items-center justify-center gap-3">
            <Package size={40} className="text-green-600" /> Paket Layanan Unggulan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paketHajiUmrah.map((paket: Paket) => (
              <div
                key={paket.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col transform hover:scale-[1.02] transition-all duration-300 border border-gray-100 hover:shadow-2xl"
              >
                <img
                  src={paket.gambar}
                  alt={paket.namaPaket}
                  className="w-full h-60 object-cover"
                />
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-2xl font-semibold text-green-700 mb-3">
                    {paket.namaPaket}
                  </h3>
                  <p className="text-slate-600 text-sm mb-4 flex-grow">
                    {paket.deskripsi}
                  </p>
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center gap-2 text-slate-500">
                      <MapPin size={16} />
                      <span>Lokasi: {paket.lokasi}</span>
                    </div>
                    {paket.durasi && (
                      <div className="flex items-center gap-2 text-slate-500">
                        <Clock size={16} />
                        <span>Durasi: {paket.durasi}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-xl font-bold text-emerald-600 mt-auto mb-5">
                    Mulai Rp {paket.harga.idr?.toLocaleString('id-ID') || 'N/A'}
                    {paket.harga.usd && ` / $${paket.harga.usd.toLocaleString('en-US')}`}
                  </div>
                  <p className="text-xs text-slate-500 mb-5">
                    {paket.subPaket.length} pilihan jadwal tersedia.
                  </p>
                  <button className="w-full bg-green-600 text-white py-3 px-5 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 transition duration-300 font-medium flex items-center justify-center gap-2 text-base">
                    Lihat Detail <ExternalLink size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bagian Rekanan Maskapai */}
        <section id="rekanan" className="scroll-mt-24 py-16 bg-slate-100 rounded-2xl shadow-lg border border-gray-200">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800 mb-12 flex items-center justify-center gap-3">
            <Plane size={40} className="text-green-600" /> Maskapai Penerbangan Rekanan
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-x-6 gap-y-8 items-center px-4 sm:px-8">
            {dummyAdvertise.map((airline: Advertise) => (
              <div
                key={airline.id}
                title={airline.description}
                className="flex flex-col items-center justify-center p-3 sm:p-4 bg-white rounded-xl shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 h-full"
              >
                <img
                  src={airline.image}
                  alt={airline.name}
                  className="h-12 sm:h-16 object-contain mb-2"
                />
                <p className="text-xs sm:text-sm text-slate-700 font-medium text-center">
                  {airline.name}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Bagian Galeri */}
        <section id="galeri" className="scroll-mt-24">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800 mb-12 flex items-center justify-center gap-3">
            <ImageIcon size={40} className="text-green-600" /> Galeri Perjalanan
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
            {dummyGallery.slice(0, 8).map((image: GalleryImage) => (
              <div
                key={image.id}
                className="aspect-w-1 aspect-h-1 rounded-xl overflow-hidden shadow-lg transform hover:scale-105 hover:shadow-2xl transition-all duration-300 group"
              >
                <img
                  src={image.src.replace('public/', '/')}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 flex items-center justify-center">
                  <ExternalLink size={32} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            ))}
          </div>
          {dummyGallery.length > 8 && (
            <div className="text-center mt-10">
              <button className="bg-green-600 text-white py-3 px-8 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 transition duration-300 font-semibold text-base">
                Lihat Semua Galeri
              </button>
            </div>
          )}
        </section>

        {/* Bagian Legalitas & Akreditasi */}
        <section id="legalitas" className="scroll-mt-24 py-16 bg-white rounded-2xl shadow-xl border border-gray-200">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800 mb-12 flex items-center justify-center gap-3">
            <ShieldCheck size={40} className="text-green-600" /> Legalitas & Akreditasi Resmi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
            {izinAlBahjah.map((izin: Izin, index: number) => (
              <div
                key={index}
                className="p-6 bg-slate-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-green-500 flex flex-col"
              >
                <div className="flex items-start gap-4 mb-3">
                  {izin.nama.toLowerCase().includes('akreditasi') || izin.nama.toLowerCase().includes('izin pihk') ? (
                    <Award size={36} className="text-green-600 flex-shrink-0 mt-1" />
                  ) : izin.nama.toLowerCase().includes('kemenkunham') ? (
                    <Landmark size={36} className="text-green-600 flex-shrink-0 mt-1" />
                  ) : izin.nama.toLowerCase().includes('nib') ? (
                    <Briefcase size={36} className="text-green-600 flex-shrink-0 mt-1" />
                  ) : (
                    <FileText size={36} className="text-green-600 flex-shrink-0 mt-1" />
                  )}
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800">
                      {izin.nama}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      <span className="font-medium">No:</span> {izin.nomor}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-slate-500 mb-3">
                  <span className="font-medium">Berlaku Mulai:</span>{' '}
                  {izin.berlaku_mulai || izin.berlaku_mula || 'N/A'}
                </p>
                <p className="text-sm text-slate-600 leading-relaxed flex-grow">
                  {izin.deskripsi}
                </p>
                <CheckCircle size={20} className="text-emerald-500 mt-4 self-end" />
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-slate-300 py-12 text-center mt-16">
        <div className="container mx-auto px-4">
          <Building size={32} className="mx-auto mb-4 text-green-400" />
          <p className="text-lg font-semibold mb-2">Al-Bahjah Tour & Travel</p>
          <p className="text-sm mb-1">
            Jl. Pangeran Cakrabuana No. 179, Sendang, Kel. Sumber, Kec. Sumber, Kab. Cirebon, Jawa Barat 45611
          </p>
          <p className="text-sm mb-4">Telepon: (0231) 8851045 | Email: info@albahjahtourtravel.com</p>
          <div className="flex justify-center space-x-4 mb-6">
            {/* Tambahkan ikon media sosial di sini jika ada */}
          </div>
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} Al-Bahjah Tour & Travel. Hak Cipta Dilindungi Undang-Undang.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CompanyProfileDashboardGreenPage;