'use client'

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Clock, CheckCircle2, Bike, ChefHat, Bell, XCircle } from 'lucide-react';

export default function OrderManagementPage() {
  const params = useParams();
  const { restaurantId } = params;

  const [activeTab, setActiveTab] = useState('new');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 1. Verileri Çekme ve Formatlama ---
  const fetchOrders = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/restaurant/${restaurantId}/orders`, {
        credentials: 'include'
      });
      
      if (res.ok) {
        const data = await res.json();
        
        // Backend verisini UI formatına dönüştür
        const formattedOrders = data.map(order => ({
          id: order.order_id,
          customer: order.customer_name || "Misafir",
          // Backend'den gelen item objelerini string'e çeviriyoruz: "Burger x2"
          items: order.items.map(item => `${item.name} x${item.quantity}`), 
          total: order.total_price,
          // ISO tarihini hesapla
          timeRaw: order.created_at, 
          time: getTimeAgo(order.created_at),
          // Backend statülerini Frontend sekmelerine eşle
          status: mapBackendStatusToFrontend(order.status), 
          note: order.order_note || "" // Eğer not varsa
        }));

        setOrders(formattedOrders);
      }
    } catch (error) {
      console.error("Siparişler yüklenemedi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (restaurantId) fetchOrders();
    
    // Opsiyonel: Her 30 saniyede bir veriyi tazelemek için interval eklenebilir
    const interval = setInterval(() => {
        if (restaurantId) fetchOrders();
    }, 30000);
    return () => clearInterval(interval);

  }, [restaurantId]);

  // --- Yardımcı Fonksiyonlar ---

  // Backend (DB) -> Frontend (Tab) Eşleşmesi
  const mapBackendStatusToFrontend = (status) => {
    switch(status) {
        case 'pending': return 'new';
        case 'preparing': return 'preparing';
        case 'out_for_delivery': return 'delivering';
        case 'delivered': return 'completed';
        default: return status;
    }
  };

  // Frontend (Action) -> Backend (API) Eşleşmesi
  const mapFrontendStatusToBackend = (status) => {
    switch(status) {
        case 'new': return 'pending';
        case 'preparing': return 'preparing';
        case 'delivering': return 'out_for_delivery';
        case 'completed': return 'delivered';
        default: return status;
    }
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInMinutes = Math.floor((now - past) / 60000);

    if (diffInMinutes < 1) return "Şimdi";
    if (diffInMinutes < 60) return `${diffInMinutes} dk önce`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} sa önce`;
    return "Dün";
  };

  // --- 2. Durum Değiştirme (API Call) ---
  const updateStatus = async (orderId, newFrontendStatus) => {
    const backendStatus = mapFrontendStatusToBackend(newFrontendStatus);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/restaurant/order/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: backendStatus }),
        credentials: 'include'
      });

      if (res.ok) {
        // UI'ı anında güncelle (Optimistic Update)
        setOrders(prevOrders => prevOrders.map(order => 
          order.id === orderId ? { ...order, status: newFrontendStatus } : order
        ));
      } else {
        alert("Durum güncellenemedi, lütfen tekrar deneyin.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // --- UI Yapılandırması ---
  const tabs = [
    { id: 'new', label: 'Yeni Siparişler', icon: Bell, count: orders.filter(o => o.status === 'new').length },
    { id: 'preparing', label: 'Hazırlanıyor', icon: ChefHat, count: orders.filter(o => o.status === 'preparing').length },
    { id: 'delivering', label: 'Yolda', icon: Bike, count: orders.filter(o => o.status === 'delivering').length },
    { id: 'completed', label: 'Tamamlandı', icon: CheckCircle2, count: orders.filter(o => o.status === 'completed').length },
  ];

  const filteredOrders = orders.filter(order => order.status === activeTab);

  if (loading) return <div className="p-10 text-center text-gray-500">Siparişler yükleniyor...</div>;

  return (
    <div className="font-sans text-gray-900 h-[calc(100vh-80px)] flex flex-col p-6">
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black">Siparişler</h1>
        <p className="text-gray-500 text-sm">Gelen siparişleri anlık takip edin.</p>
      </div>

      {/* Sekmeler */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-xl w-fit mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-white text-black shadow-sm'
                : 'text-gray-500 hover:text-black'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
            {tab.count > 0 && (
                <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full ${
                    activeTab === tab.id ? 'bg-black text-white' : 'bg-gray-300 text-white'
                }`}>
                    {tab.count}
                </span>
            )}
          </button>
        ))}
      </div>

      {/* Sipariş Listesi */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-20">
        {filteredOrders.length > 0 ? filteredOrders.map((order) => (
          <div key={order.id} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            
            <div className="flex justify-between items-start mb-4">
                <div>
                    <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-lg text-black">#{order.id.slice(0, 6)}</span>
                        <span className="text-xs font-medium text-gray-400 flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                            <Clock size={12} /> {order.time}
                        </span>
                    </div>
                    <h3 className="text-gray-900 font-semibold mt-1">{order.customer}</h3>
                </div>
                <div className="text-right">
                    <span className="block font-bold text-xl text-black">₺{order.total}</span>
                    {/* Ödeme yöntemi backend'den gelmediği için şimdilik statik veya gizli */}
                    {/* <span className="text-xs text-gray-400">Online Ödeme</span> */}
                </div>
            </div>

            <hr className="border-gray-50 my-4" />

            {/* Ürünler */}
            <ul className="space-y-2 mb-4">
                {order.items.map((item, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
                        {item}
                    </li>
                ))}
            </ul>

            {order.note && (
                <div className="bg-yellow-50 text-yellow-800 text-xs p-3 rounded-lg mb-4 font-medium border border-yellow-100">
                    Not: {order.note}
                </div>
            )}

            {/* Aksiyon Butonları */}
            <div className="flex justify-end gap-3 pt-2">
                {order.status === 'new' && (
                    <>
                        <button 
                            onClick={() => updateStatus(order.id, 'cancelled')}
                            className="px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            Reddet
                        </button>
                        <button 
                            onClick={() => updateStatus(order.id, 'preparing')}
                            className="px-6 py-2 bg-black text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-colors shadow-lg shadow-black/20"
                        >
                            Onayla & Hazırla
                        </button>
                    </>
                )}
                
                {order.status === 'preparing' && (
                    <button 
                        onClick={() => updateStatus(order.id, 'delivering')}
                        className="px-6 py-2 bg-black text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
                    >
                        <Bike size={18} />
                        Kuryeye Ver
                    </button>
                )}

                {order.status === 'delivering' && (
                    <button 
                        onClick={() => updateStatus(order.id, 'completed')}
                        className="px-6 py-2 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                        <CheckCircle2 size={18} />
                        Teslim Edildi
                    </button>
                )}
            </div>

          </div>
        )) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 pb-20">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 size={32} className="opacity-20 text-black" />
                </div>
                <p>Bu aşamada sipariş bulunmuyor.</p>
            </div>
        )}
      </div>

    </div>
  );
}