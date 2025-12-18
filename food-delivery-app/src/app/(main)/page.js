'use client'

import React, { useEffect, useState } from 'react';
import { Star, Clock, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('Hepsi');
  const [restaurants, setRestaurants] = useState([]);

  const router = useRouter();

  useEffect(() => {
    // 1. Seçili Adresi Kontrol Et
    const checkAddressAndFetchRestaurants = async () => {
      try {
        // Önce seçili adresi sor
        const addressRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customer/selected-address`, {
          method: 'GET',
          credentials: 'include'
        });
        // Eğer cevap boşsa veya 200/201 dönmüyorsa ya da içerik yoksa yönlendir
        // Not: Controller getSelectedAddress metodun result.rows[0] dönüyor. 
        // Eğer kayıt yoksa undefined/boş dönebilir.
        if (addressRes.ok) {

          const addressData = (await addressRes.json())[0];
          console.log(addressData)

          // Eğer adres verisi boşsa veya id yoksa
          if (!addressData || !addressData.address_id) {
              router.push('/profile/addresses');
            return; // Fonksiyonu durdur, restoranları çekmesin
          }
        } else {
          // Hata varsa veya status uygun değilse (örn: henüz login değilse veya adres yoksa)
          // Duruma göre login'e veya adrese atabilirsin, şimdilik adrese:
          // router.push('/profile/addresses');
          // (Opsiyonel: Burada kullanıcının login olup olmadığını anlamak için auth kontrolü de gerekebilir)
        }

        // 2. Adres varsa Restoranları Çek
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customer/get-restaurants`, {
          method: 'GET',
          credentials: 'include'
        });
        setRestaurants(await res.json());

      } catch (e) {
        console.log(e);
      }
    };

    checkAddressAndFetchRestaurants();

  }, []);


  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customer/get-restaurants`, {
          method: 'GET',
          credentials: 'include'
        });

        setRestaurants(await res.json());
        console.log((await res.json()));

      }

      catch (e) {
        console.log(e);
      }
    })();


  }, []);

  // Örnek Kategori Verisi
  const categories = [
    { id: 1, name: 'Hepsi', icon: '🍽️' },
    { id: 2, name: 'Burger', icon: '🍔' },
    { id: 3, name: 'Pizza', icon: '🍕' },
    { id: 4, name: 'Sushi', icon: '🍣' },
    { id: 5, name: 'Tatlı', icon: '🍰' },
    { id: 6, name: 'Kebap', icon: '🥙' },
  ];

  // Örnek Restoran Verisi
  // const restaurants = [
  //   {
  //     id: 1,
  //     name: 'Burger Lab',
  //     rating: 4.8,
  //     time: '20-30 dk',
  //     minPrice: '₺150',
  //     image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=60',
  //     tags: ['Burger', 'American']
  //   },
  //   {
  //     id: 2,
  //     name: 'Pizza Locale',
  //     rating: 4.5,
  //     time: '30-45 dk',
  //     minPrice: '₺200',
  //     image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=500&q=60',
  //     tags: ['Pizza', 'Italian']
  //   },
  //   {
  //     id: 3,
  //     name: 'Sushi Co',
  //     rating: 4.9,
  //     time: '40-50 dk',
  //     minPrice: '₺350',
  //     image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=500&q=60',
  //     tags: ['Sushi', 'Asian']
  //   },
  //   {
  //     id: 4,
  //     name: 'Tatlı Köşesi',
  //     rating: 4.3,
  //     time: '15-25 dk',
  //     minPrice: '₺80',
  //     image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=500&q=60',
  //     tags: ['Tatlı', 'Kahve']
  //   }
  // ];

  return (
    <div className="max-w-screen-xl mx-auto font-sans text-gray-900">

      {/* Arama Çubuğu (Sadece Anasayfaya Özel Olduğu İçin Burada Kaldı) */}
      {/* Header içinde değil, sayfa içeriğinin başında duruyor */}
      <div className="px-4 py-4">
        <div className="relative">
          {/* İkon için search icon import edilmeli veya svg kullanılmalı, 
                 burada basitlik için text placeholder kullanıldı */}
          <input
            type="text"
            placeholder="Ne yemek istersin?"
            className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent placeholder-gray-400 text-sm bg-gray-50"
          />
        </div>
      </div>

      {/* Kategoriler - Yatay Scroll */}
      {/* <div className="pb-6 pt-2 overflow-x-auto no-scrollbar pl-4">
        <div className="flex space-x-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all duration-200 border ${activeCategory === cat.name
                ? 'bg-black text-white border-black'
                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-800'
                }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div> */}

      {/* Popüler Başlığı */}
      <div className="px-4 mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-black">Restoranlar</h2>
        <a href="#" className="text-sm font-medium text-gray-500 hover:text-black">Tümü</a>
      </div>

      {/* Restoran Listesi */}
      <div className="px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant) => (
          <div key={restaurant.restaurant_id} className="group cursor-pointer" onClick={e => router.push('/restaurant/' + restaurant.restaurant_id)}>
            {/* Kart Görseli */}
            <div className="relative h-48 w-full overflow-hidden rounded-md border border-gray-200">
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Favori Butonu */}
              <button className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors">
                <Heart size={16} className="text-black" />
              </button>
              {/* Süre Rozeti */}
              <div className="absolute bottom-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-md text-xs font-semibold text-black flex items-center shadow-sm">
                <Clock size={12} className="mr-1" />
                {restaurant.time ?? '0'}
              </div>
            </div>

            {/* Kart Bilgileri */}
            <div className="mt-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-black group-hover:text-gray-700 transition-colors">
                    {restaurant.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {/* {restaurant.tags.join(', ')}  */}
                    • {restaurant.min_order_price} min.
                  </p>
                </div>
                <div className="flex items-center bg-gray-100 px-2 py-1 rounded-md">
                  <Star size={12} className="text-black fill-current mr-1" />
                  <span className="text-xs font-bold">{restaurant.rating}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}