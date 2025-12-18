'use client'

import React, { useEffect, useState } from 'react';
import { Package, MapPin, Calendar, ChevronRight } from 'lucide-react';

export default function PastOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // YENİ ROTA: /customer/past-orders
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customer/past-orders`, {
          credentials: 'include' // Token (Cookie) gönderimi için gerekli
        });

        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (error) {
        console.error("Siparişler çekilemedi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Statüye göre etiket rengi ve metni
  const getStatusBadge = (status) => {
    const statuses = {
      pending: { label: 'Hazırlanıyor', color: 'bg-yellow-100 text-yellow-700' },
      preparing: { label: 'Mutfakta', color: 'bg-blue-100 text-blue-700' },
      out_for_delivery: { label: 'Yolda', color: 'bg-purple-100 text-purple-700' },
      delivered: { label: 'Teslim Edildi', color: 'bg-green-100 text-green-700' },
      cancelled: { label: 'İptal Edildi', color: 'bg-red-100 text-red-700' },
    };

    const current = statuses[status] || statuses.pending;

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${current.color}`}>
        {current.label}
      </span>
    );
  };

  // Tarih Formatlama Fonksiyonu
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-8 bg-gray-200 rounded-full mb-2"></div>
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-md mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Package className="text-black" />
        Geçmiş Siparişlerim
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
            <Package size={48} className="mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900">Henüz siparişin yok</h3>
            <p className="text-gray-500 text-sm mt-1">Lezzetli yemekler keşfetmeye hemen başla!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.order_id} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              
              {/* Üst Kısım: Restoran ve Durum */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-black">{order.restaurant_name}</h3>
                  <div className="flex items-center text-xs text-gray-500 mt-1 gap-2">
                    <span className="flex items-center gap-1">
                        <MapPin size={12} /> {order.restaurant_district}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                        <Calendar size={12} /> {formatDate(order.created_at)}
                    </span>
                  </div>
                </div>
                <div>
                    {getStatusBadge(order.status)}
                </div>
              </div>

              <hr className="border-gray-50 my-3" />

              {/* Orta Kısım: Ürün Listesi (Özet) */}
              <div className="space-y-2 mb-4">
                {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                            <span className="bg-gray-100 text-black font-bold text-xs px-1.5 py-0.5 rounded">
                                {item.quantity}x
                            </span>
                            <span>{item.name}</span>
                        </div>
                        {/* Birim fiyat backend'den geliyorsa: */}
                        <span className="text-xs text-gray-500">₺{item.price}</span>
                    </div>
                ))}
              </div>

              {/* Alt Kısım: Toplam ve Buton */}
              <div className="flex justify-between items-center pt-2 mt-2 border-t border-gray-50">
                <div className="flex flex-col">
                    <span className="text-xs text-gray-400">Toplam Tutar</span>
                    <span className="font-bold text-lg text-black">₺{order.total_price}</span>
                </div>
                
                <button className="flex items-center gap-1 text-sm font-semibold text-black hover:underline">
                    Detaylar
                    <ChevronRight size={16} />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}