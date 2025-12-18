'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Store, MapPin, DollarSign, AlignLeft } from 'lucide-react';

export default function CreateRestaurantPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    city: '',
    district: '',
    full_address: '',
    min_order_price: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'min_order_price' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // [NEXT.JS]: Backend İsteği

      const _response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/restaurant/info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // <--- BU SATIRI EKLEYİN
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });


      const response = await _response.json()
      if (response.success) {
        alert('Restoran başarıyla oluşturuldu!');
        router.push('/admin/restaurants');
      }



    } catch (error) {
      console.error("Restoran ekleme hatası:", error);
      alert("Bir hata oluştu: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">

      <div className="w-full max-w-3xl">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => window.location.href = '/admin/restaurants'}
            className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Yeni Restoran Ekle</h1>
            <p className="text-sm text-gray-500">İşletme bilgilerinizi girerek yeni bir şube oluşturun.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Genel Bilgiler Kartı */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-black flex items-center gap-2 pb-2 border-b border-gray-50">
              <Store size={20} />
              Genel Bilgiler
            </h2>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Restoran Adı</label>
              <input
                name="name"
                type="text"
                placeholder="Örn: Burger Lab - Kadıköy"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Açıklama</label>
              <div className="relative">
                <textarea
                  name="description"
                  placeholder="İşletmenizi kısaca anlatın..."
                  rows={3}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all pl-10"
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
                <AlignLeft className="absolute left-3 top-3.5 text-gray-400" size={18} />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Minimum Sepet Tutarı (TL)</label>
              <div className="relative">
                <input
                  name="min_order_price"
                  type="number"
                  min="0"
                  placeholder="0.00"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all pl-10"
                  value={formData.min_order_price}
                  onChange={handleChange}
                />
                <DollarSign className="absolute left-3 top-3.5 text-gray-400" size={18} />
              </div>
            </div>
          </div>

          {/* Adres Bilgileri Kartı */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-black flex items-center gap-2 pb-2 border-b border-gray-50">
              <MapPin size={20} />
              Konum Bilgileri
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">İl</label>
                <input
                  name="city"
                  type="text"
                  placeholder="İstanbul"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">İlçe</label>
                <input
                  name="district"
                  type="text"
                  placeholder="Kadıköy"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                  value={formData.district}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Açık Adres</label>
              <textarea
                name="full_address"
                placeholder="Mahalle, Sokak, No..."
                rows={2}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                value={formData.full_address}
                onChange={handleChange}
                required
              ></textarea>
            </div>
          </div>

          {/* Kaydet Butonu */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-800 transition-all shadow-xl shadow-black/20 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed w-full md:w-auto justify-center"
            >
              {loading ? (
                'Oluşturuluyor...'
              ) : (
                <>
                  <Save size={20} />
                  Restoranı Oluştur
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}