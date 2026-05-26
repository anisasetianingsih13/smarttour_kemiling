'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

export default function EditWisataPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    category: '',
    description: '',
    latitude: '',
    longitude: '',
    isIndoor: false,
    rating: '',
    imageUrl: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/tourism/${id}`);
        const d = res.data;
        setForm({
          name: d.name || '',
          category: d.category || '',
          description: d.description || '',
          latitude: String(d.latitude || ''),
          longitude: String(d.longitude || ''),
          isIndoor: d.isIndoor || false,
          rating: String(d.rating || ''),
          imageUrl: d.imageUrl || '',
        });
      } catch {
        setError('Gagal memuat data wisata.');
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.patch(`/tourism/${id}`, {
        ...form,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
        rating: form.rating ? parseFloat(form.rating) : undefined,
      });
      router.push('/dashboard/wisata');
    } catch {
      setError('Gagal memperbarui data.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="flex items-center justify-center h-64"><p className="text-gray-500">Memuat data...</p></div>;
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/wisata" className="text-gray-400 hover:text-gray-600 text-sm">
          ← Kembali
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Edit Wisata</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Tempat *</label>
          <input name="name" required value={form.name} onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
          <select name="category" required value={form.category} onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Pilih kategori...</option>
            <option value="Kuliner">Kuliner</option>
            <option value="Alam">Alam</option>
            <option value="Budaya">Budaya</option>
            <option value="Hiburan">Hiburan</option>
            <option value="Belanja">Belanja</option>
            <option value="Religi">Religi</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi *</label>
          <textarea name="description" required value={form.description} onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Latitude *</label>
            <input name="latitude" required type="number" step="any" value={form.latitude} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Longitude *</label>
            <input name="longitude" required type="number" step="any" value={form.longitude} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rating (0-5)</label>
          <input name="rating" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL Gambar (opsional)</label>
          <input name="imageUrl" type="url" value={form.imageUrl} onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex items-center gap-3">
          <input name="isIndoor" id="isIndoor" type="checkbox" checked={form.isIndoor}
            onChange={handleChange}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
          <label htmlFor="isIndoor" className="text-sm font-medium text-gray-700">
            Wisata Indoor
          </label>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
            {loading ? 'Memperbarui...' : 'Perbarui'}
          </button>
          <Link href="/dashboard/wisata"
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg font-medium transition-colors">
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
}
