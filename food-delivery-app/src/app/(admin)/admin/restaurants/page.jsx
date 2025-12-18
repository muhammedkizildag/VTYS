'use client'

import React, { useEffect, useState } from 'react';
import { Plus, ArrowRight, Store, Utensils } from 'lucide-react';
import { useRouter } from 'next/navigation';


export default function SelectRestaurantPage() {


  const [restaurants, setRestaurants] = useState([]);

  const router = useRouter();

  useEffect(() => {

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/restaurant/info`, {
      method: 'GET',
      credentials: 'include'
    }).then(async (r) => {
      const data = await r.json();
      console.log(data);

      setRestaurants(data.restaurant)


    });

  }, []);



  const handleSelectRestaurant = (id) => {
    // Seçilen restoranın dashboard'una yönlendir
    router.push(`/admin/${id}/dashboard`);
    
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">

      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black">Restoranlarım</h1>
            <p className="text-gray-500 mt-2">Yönetmek istediğiniz işletmeyi seçin.</p>
          </div>
          <button onClick={() => router.push('/admin/restaurants/new')} className="flex items-center gap-2 bg-black text-white px-5 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors">
            <Plus size={20} />
            Yeni Restoran Ekle
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              onClick={() => handleSelectRestaurant(restaurant.restaurant_id)}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-black transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden">
                  <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${restaurant.status === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                  {restaurant.status}
                </span>
              </div>

              <h2 className="text-xl font-bold text-black group-hover:text-gray-700 transition-colors">
                {restaurant.name}
              </h2>

              <div className="flex items-center gap-2 text-sm text-gray-500 mt-6 pt-4 border-t border-gray-50">
                <span>Yönetim Paneline Git</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}

          {/* Yeni Ekle Placeholder Kartı */}
          <button className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-black hover:text-black transition-all min-h-[200px]">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
              <Store size={24} />
            </div>
            <span className="font-bold">Yeni Şube Aç</span>
          </button>
        </div>
      </div>

    </div>
  );
}




const mockData = [{
      id: "1",
      name: "Burger Lab - Kadıköy",
      status: "Aktif",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=200&q=60"
    },
    {
      id: "2",
      name: "Burger Lab - Beşiktaş",
      status: "Kapalı",
      image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=200&q=60"
    }]