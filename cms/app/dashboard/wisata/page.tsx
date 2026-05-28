'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

interface TourismPlace {
  id: number;
  name: string;
  category: string;
  description: string;
  latitude: number;
  longitude: number;
  isIndoor: boolean;
  rating: number;
  imageUrl?: string;
}

export default function WisataPage() {
  const [wisata, setWisata] = useState<TourismPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchWisata = async () => {
    try {
      const res = await api.get('/tourism');
      setWisata(res.data?.data || []);
    } catch {
      setError('Gagal memuat data wisata. Pastikan Backend berjalan di port 3001.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWisata();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus wisata ini?')) return;
    try {
      await api.delete(`/tourism/${id}`);
      setWisata(wisata.filter((w) => w.id !== id));
    } catch {
      alert('Gagal menghapus data.');
    }
    setDeleteId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Memuat data...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Data Wisata</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola semua tempat wisata Kemiling</p>
        </div>
        <Link
          href="/dashboard/wisata/tambah"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + Tambah Wisata
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="text-left px-6 py-4 font-medium text-gray-600">Nama</th>
              <th className="text-left px-6 py-4 font-medium text-gray-600">Kategori</th>
              <th className="text-left px-6 py-4 font-medium text-gray-600">Tipe</th>
              <th className="text-left px-6 py-4 font-medium text-gray-600">Rating</th>
              <th className="text-left px-6 py-4 font-medium text-gray-600">Koordinat</th>
              <th className="text-left px-6 py-4 font-medium text-gray-600">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {wisata.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center px-6 py-12 text-gray-400">
                  Belum ada data wisata. Tambah data pertama Anda.
                </td>
              </tr>
            ) : (
              wisata.map((item) => (
                <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{item.name}</td>
                  <td className="px-6 py-4 text-gray-600">{item.category}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.isIndoor
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {item.isIndoor ? 'Indoor' : 'Outdoor'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{item.rating ?? '-'}</td>
                  <td className="px-6 py-4 text-gray-500 text-xs">
                    {item.latitude}, {item.longitude}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/wisata/${item.id}/edit`}
                        className="text-blue-600 hover:underline text-xs"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-500 hover:underline text-xs"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
