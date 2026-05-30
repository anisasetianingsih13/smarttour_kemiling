"use client";

import Link from "next/link";

export default function RecommendationPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Header Sticky */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-white shadow-md shadow-emerald-500/20">
              ST
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                SmartTour Kemiling
              </h1>
              <p className="text-xs text-slate-400 font-medium">Recommendation System</p>
            </div>
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-emerald-600 shadow-sm hover:bg-slate-50 hover:text-emerald-700 hover:border-slate-300 transition-all duration-200 cursor-pointer"
          >
            ← Kembali ke Dashboard
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col justify-center items-center">
        <div className="max-w-2xl w-full bg-white border border-slate-200/80 rounded-3xl p-8 md:p-12 text-center shadow-lg relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute left-0 bottom-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Visual Migration Indicator */}
          <div className="relative w-32 h-32 mx-auto mb-8 flex items-center justify-center">
            {/* Pulsing rings */}
            <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-2 rounded-full bg-teal-500/10 animate-pulse" />
            
            {/* Central Mobile Phone Device Icon */}
            <div className="relative w-20 h-20 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-3xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <span className="text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-200 mb-4 inline-block">
            Sistem Telah Dimigrasi
          </span>

          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight mb-4">
            Fitur Rekomendasi Telah Berpindah ke Aplikasi Mobile
          </h2>

          <p className="text-sm md:text-base text-slate-500 leading-relaxed mb-8 max-w-lg mx-auto">
            Halaman Rekomendasi di CMS ini tidak lagi didukung secara aktif sebagai antarmuka utama pengguna. Fitur rekomendasi berbasis cuaca real-time dan lokasi GPS kini sepenuhnya berjalan di <strong>Aplikasi User Flutter (Mobile Client)</strong> demi efisiensi dan pengalaman yang lebih personal.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition duration-200 cursor-pointer"
            >
              Ke Dashboard Admin
            </Link>
            <Link
              href="/dashboard/wisata"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-600 shadow-sm hover:bg-slate-50 transition duration-200 cursor-pointer"
            >
              Kelola Data Wisata
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-6 bg-white text-center shadow-inner">
        <p className="text-xs text-slate-400 font-medium">
          &copy; 2026 SmartTour Kemiling. Real-Time Mobile Integration layer.
        </p>
      </footer>
    </div>
  );
}