'use client'

import React, { useEffect, useState } from 'react';
import { Trash2, Plus, Minus, ChevronRight, Utensils } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const router = useRouter();
  // Örnek Sepet Verisi (State)
  const [cartItems, setCartItems] = useState([
    // {
    //   id: 1,
    //   name: "Truffle Burger",
    //   options: ["Ekstra Cheddar", "Karamelize Soğan"],
    //   price: 325, // Opsiyonlar dahil birim fiyat
    //   quantity: 1,
    //   image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=200&q=60"
    // },
    // {
    //   id: 2,
    //   name: "Cajun Patates",
    //   options: [],
    //   price: 90,
    //   quantity: 2,
    //   image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=200&q=60"
    // }
  ]);

  useEffect(() => {

    (async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customer/cart`, {
        credentials: 'include'
      });

      const d = await res.json();
      console.log(d)
      setCartItems(d);
    })()


  }, []);


  const updateQuantity = (id, change) => {
    setCartItems(items => items.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + change;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
  const deliveryFee = 0;
  const total = subtotal + deliveryFee;

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <Utensils className="text-gray-300" size={32} />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Sepetin boş</h2>
        <p className="text-gray-500 mt-2 text-center text-sm">Lezzetli yemekler keşfetmek için menülere göz atabilirsin.</p>
        <button className="mt-6 px-8 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors">
          Restoranları Keşfet
        </button>
      </div>
    );
  }

  const handleOrderCreate = async () => {

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customer/create-order`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const d = await response.json();
      console.log(d);
      router.refresh();
      
    }   
    catch (e) {
      console.log('error: ' + e);
    }
  }

  return (
    <div className="bg-white min-h-screen pb-32 font-sans">

      {/* Sayfa Başlığı */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md px-4 py-4 border-b border-gray-100">
        <h1 className="text-lg font-bold text-center">Sepetim ({cartItems.length})</h1>
      </div>

      <div className="max-w-screen-md mx-auto px-4 py-6">

        {/* Restoran Bilgisi (Opsiyonel) */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <div>
            <p className="text-xs text-gray-400 font-medium">Siparişin Hazırlanacağı Yer</p>
            <h2 className="text-base font-bold text-black mt-0.5">Burger Lab - Kadıköy</h2>
          </div>
          <button className="text-xs font-semibold text-black underline">Menüye Git</button>
        </div>

        {/* Ürün Listesi */}
        <div className="space-y-6">
          {cartItems.map((item) => (
            <div key={item.id} className="flex gap-4">
              {/* Görsel */}
              <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>

              {/* Detaylar */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-900 text-sm">{item.product_name}</h3>
                    <span className="font-semibold text-sm">₺{item.unit_price * item.quantity}</span>
                  </div>

                </div>

                {/* Aksiyonlar */}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-3 bg-gray-50 rounded-full p-1 border border-gray-100">
                    <button
                      className="w-6 h-6 flex items-center justify-center bg-white rounded-full shadow-sm text-black hover:bg-gray-100 disabled:opacity-50"
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={12} strokeWidth={3} />
                    </button>
                    <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                    <button
                      className="w-6 h-6 flex items-center justify-center bg-white rounded-full shadow-sm text-black hover:bg-gray-100"
                    >
                      <Plus size={12} strokeWidth={3} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sipariş Notu */}
        <div className="mt-8">
          <label className="text-sm font-semibold text-gray-900 block mb-2">Sipariş Notu</label>
          <textarea
            placeholder="Zile basmayın, kapıya asın vb."
            className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent min-h-[80px] bg-gray-50"
          ></textarea>
        </div>

        {/* Özet */}
        <div className="mt-8 space-y-3 py-6 border-t border-gray-100">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Ara Toplam</span>
            <span>₺{subtotal}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Teslimat Ücreti</span>
            <span>₺{deliveryFee}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-black pt-3 border-t border-gray-100">
            <span>Toplam</span>
            <span>₺{total}</span>
          </div>
        </div>

      </div>

      {/* Sabit Onay Butonu (Sticky Footer) */}
      <div className="fixed bottom-[70px] left-0 right-0 p-4 bg-white border-t border-gray-100 z-20">
        {/* bottom değeri navigasyon barının yüksekliğine göre ayarlanır */}
        <div className="max-w-screen-md mx-auto">
          <button onClick={handleOrderCreate} className="w-full bg-black text-white py-3.5 rounded-full font-bold flex items-center justify-between px-6 hover:bg-gray-800 transition-colors shadow-lg shadow-black/10">
            <span>Sepeti Onayla</span>
            <span className="bg-white/20 px-2 py-0.5 rounded text-sm">₺{total}</span>
          </button>
        </div>
      </div>

    </div>
  );
}