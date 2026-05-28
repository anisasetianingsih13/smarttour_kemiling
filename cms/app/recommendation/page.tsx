"use client";

import { useEffect, useState } from "react";

interface TourismPlace {
  id: number;
  name: string;
  description: string;
  category: string;
  isIndoor: boolean;
  latitude: number;
  longitude: number;
  rating: number;
  imageUrl?: string;
  distance: number;
}

interface WeatherDetail {
  condition: string;
  description: string;
  temp: number;
}

interface RecommendationResponse {
  success: boolean;
  weather: string;
  source: string;
  recommendations: TourismPlace[];
  metadata?: {
    weather_detail: WeatherDetail;
  };
}

export default function RecommendationPage() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [loadingCoords, setLoadingCoords] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<RecommendationResponse | null>(null);

  // Retrieve GPS Coordinates from browser
  const getGPSLocation = () => {
    setLoadingCoords(true);
    setError(null);
    setData(null);

    if (typeof window === "undefined" || !navigator.geolocation) {
      setError("Browser Anda tidak mendukung sistem navigasi GPS.");
      setLoadingCoords(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoadingCoords(false);
      },
      (err) => {
        console.error("GPS access error:", err);
        let errorMsg = "Gagal mengakses koordinat lokasi Anda.";
        if (err.code === 1) {
          errorMsg = "Izin GPS ditolak browser. Silakan berikan izin akses lokasi untuk menemukan wisata terdekat dan rekomendasi berbasis cuaca.";
        } else if (err.code === 2) {
          errorMsg = "Sinyal GPS tidak ditemukan. Pastikan fitur lokasi perangkat Anda telah diaktifkan.";
        } else if (err.code === 3) {
          errorMsg = "Waktu pencarian koordinat GPS habis (timeout). Silakan coba lagi.";
        }
        setError(errorMsg);
        setLoadingCoords(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    getGPSLocation();
  }, []);

  // Query recommendation-service API when coordinates are available
  useEffect(() => {
    if (!coords) return;

    const fetchRecommendations = async () => {
      setLoadingData(true);
      setError(null);

      try {
        const res = await fetch(
          `http://localhost:3002/api/recommendation?lat=${coords.lat}&lng=${coords.lng}`
        );

        if (!res.ok) {
          throw new Error(`API returned status code ${res.status}`);
        }

        const json: RecommendationResponse = await res.json();
        setData(json);
      } catch (err: any) {
        console.error("Fetch recommendations failed:", err);
        setError(
          "Gagal menghubungi layanan rekomendasi (Port 3002). Pastikan backend service berjalan dan CORS diaktifkan."
        );
      } finally {
        setLoadingData(false);
      }
    };

    fetchRecommendations();
  }, [coords]);

  const formatDistance = (meters: number) => {
    if (meters < 1000) {
      return `${meters} meter`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
  };

  // Helper weather SVGs
  const renderWeatherIcon = (condition: string) => {
    const cond = condition.toLowerCase();
    if (cond.includes("rain") || cond.includes("drizzle") || cond.includes("storm")) {
      return (
        <svg className="w-16 h-16 text-blue-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      );
    } else if (cond.includes("cloud")) {
      return (
        <svg className="w-16 h-16 text-slate-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      );
    } else {
      return (
        <svg className="w-16 h-16 text-amber-500 animate-spin" style={{ animationDuration: '8s' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
        </svg>
      );
    }
  };

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
          <button
            onClick={getGPSLocation}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-emerald-600 shadow-sm hover:bg-slate-50 hover:text-emerald-700 hover:border-slate-300 transition-all duration-200 cursor-pointer"
          >
            <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Perbarui Lokasi GPS
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col justify-start">
        
        {/* Loading GPS state */}
        {loadingCoords && (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin mb-4" />
            <h3 className="text-lg font-bold text-slate-700 mb-1">Membaca Koordinat GPS Browser</h3>
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              Harap berikan izin akses lokasi jika diminta oleh browser untuk menghitung jarak wisata terdekat.
            </p>
          </div>
        )}

        {/* Loading Data API state */}
        {!loadingCoords && loadingData && (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 border-4 border-slate-200 border-t-teal-500 rounded-full animate-spin mb-4" />
            <h3 className="text-lg font-bold text-slate-700 mb-1">Menghitung Rekomendasi Pintar</h3>
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              Menghubungi Recommendation Service dan menyinkronkan cuaca koordinat Anda...
            </p>
          </div>
        )}

        {/* Error state */}
        {!loadingCoords && !loadingData && error && (
          <div className="max-w-2xl mx-auto w-full my-8 bg-red-50 border border-red-100 rounded-2xl p-6 text-center shadow-md">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-red-800 mb-2">Terjadi Hambatan Sistem</h3>
            <p className="text-sm text-red-600 mb-6 leading-relaxed">{error}</p>
            <button
              onClick={getGPSLocation}
              className="px-6 py-2.5 rounded-xl bg-red-600 text-sm font-semibold text-white shadow-sm hover:bg-red-700 transition duration-200 cursor-pointer"
            >
              Coba Cari Ulang GPS
            </button>
          </div>
        )}

        {/* Active Data Success UI */}
        {!loadingCoords && !loadingData && !error && data && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Weather overview display box */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-sm">
              <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex items-center gap-5 text-center md:text-left flex-col md:flex-row z-10">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
                  {renderWeatherIcon(data.weather)}
                </div>
                <div>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-200">
                      Live Weather
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${
                      data.source === 'openweather' 
                        ? 'bg-blue-50 text-blue-600 border-blue-200' 
                        : 'bg-amber-50 text-amber-600 border-amber-200'
                    }`}>
                      Source: {data.source}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
                    Cuaca Kemiling: {data.weather === 'Clear' ? 'Cerah' : data.weather === 'Clouds' ? 'Berawan' : data.weather}
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Suhu rata-rata <span className="font-semibold text-slate-700">{data.metadata?.weather_detail?.temp ?? 27}°C</span> ({data.metadata?.weather_detail?.description ?? 'berawan tipis'}).
                  </p>
                </div>
              </div>

              <div className="border-t md:border-t-0 md:border-l border-slate-200 pt-6 md:pt-0 md:pl-8 text-center md:text-right max-w-xs w-full md:w-auto z-10">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Koordinat Anda</p>
                <p className="text-sm font-mono font-medium text-slate-600 bg-slate-50 px-2 py-1 rounded-md inline-block">
                  {coords?.lat.toFixed(5)}, {coords?.lng.toFixed(5)}
                </p>
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                  Rekomendasi dihitung menggunakan radius real-time dari posisi Anda.
                </p>
              </div>
            </div>

            {/* Recommendations Section Header */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Tempat Wisata yang Direkomendasikan</h3>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {data.weather.toLowerCase().includes('rain') 
                      ? "Menampilkan lokasi Wisata Indoor agar liburan Anda tetap nyaman dari hujan."
                      : "Menampilkan semua lokasi Wisata yang diurutkan dari Jarak Terdekat."}
                  </p>
                </div>
                <span className="self-start sm:self-auto text-xs text-slate-600 font-semibold bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm">
                  {data.recommendations.length} Wisata Ditemukan
                </span>
              </div>

              {/* Empty state */}
              {data.recommendations.length === 0 ? (
                <div className="bg-white border border-dashed border-slate-300 rounded-2xl py-16 text-center mt-6 shadow-sm">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-slate-200 text-lg">
                    📂
                  </div>
                  <h4 className="text-md font-bold text-slate-700">Tidak Ada Rekomendasi Cocok</h4>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1 leading-normal">
                    Tidak ditemukan tempat wisata dengan kriteria cuaca saat ini ({data.weather}).
                  </p>
                </div>
              ) : (
                /* Recommendations Grid List */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {data.recommendations.map((place) => (
                    <div 
                      key={place.id}
                      className="bg-white border border-slate-200/60 hover:border-emerald-500/40 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 group hover:shadow-lg hover:-translate-y-0.5"
                    >
                      {/* Image Frame */}
                      <div className="h-48 w-full bg-slate-100 relative overflow-hidden flex items-center justify-center">
                        {place.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img 
                            src={place.imageUrl} 
                            alt={place.name} 
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center text-slate-400">
                            <span className="text-4xl mb-1">🌴</span>
                            <span className="text-[10px] uppercase tracking-wider font-bold opacity-60 text-slate-400">SmartTour Kemiling</span>
                          </div>
                        )}

                        {/* Floating Distance Badge */}
                        <div className="absolute left-3 top-3 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-sm text-xs font-bold text-slate-700 shadow-sm border border-slate-100">
                          📍 {formatDistance(place.distance)}
                        </div>

                        {/* Floating Category/Indoor Badges */}
                        <div className="absolute right-3 top-3 flex flex-col gap-1.5 items-end">
                          <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-white/95 backdrop-blur-sm text-teal-600 shadow-sm rounded-lg border border-slate-100">
                            {place.category}
                          </span>
                          {place.isIndoor && (
                            <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500 text-white rounded-lg shadow-sm">
                              Indoor
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content Card Body */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <h4 className="font-bold text-base text-slate-800 group-hover:text-emerald-600 transition duration-200 line-clamp-1">
                              {place.name}
                            </h4>
                            <div className="flex items-center gap-1 shrink-0 text-amber-600 font-bold text-xs bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                              ⭐ {place.rating.toFixed(1)}
                            </div>
                          </div>
                          
                          <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-6">
                            {place.description}
                          </p>
                        </div>

                        <div className="border-t border-slate-100 pt-4 flex items-center justify-between text-[11px] font-medium text-slate-400">
                          <span>Lat: {place.latitude.toFixed(4)}</span>
                          <span>Lng: {place.longitude.toFixed(4)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-6 mt-16 bg-white text-center shadow-inner">
        <p className="text-xs text-slate-400 font-medium">
          &copy; 2026 SmartTour Kemiling. Real-Time Geospatial & Weather Integration layer.
        </p>
      </footer>
    </div>
  );
}