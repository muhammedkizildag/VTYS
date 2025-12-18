'use client'

import React from 'react';
import { ArrowLeft, Star, Heart, Clock } from 'lucide-react';

export default function FavoritesPage() {
  
  // Örnek Favori Restoranlar
  const favorites = [
    {
      id: 1,
      name: 'Burger Lab',
      rating: 4.8,
      time: '20-30 dk',
      minPrice: '₺150',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=60',
      tags: ['Burger', 'American']
    },
    {
      id: 3,
      name: 'Sushi Co',
      rating: 4.9,
      time: '40-50 dk',
      minPrice: '₺350',
      image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=500&q=60',
      tags: ['Sushi', 'Asian']
    },
    {
        id: 5,
        name: 'Pide & Lahmacun',
        rating: 4.7,
        time: '25-35 dk',
        minPrice: '₺120',
        image: 'https://images.unsplash.com/photo-1626804475297-411dbe6314c9?auto=format&fit=crop&w=500&q=60',
        tags: ['Pide', 'Kebap']
      }
  ];

  return (
    <div className="bg-white min-h-screen pb-24 font-sans">
      
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100 flex items-center sticky top-0 z-10">
        <button 
            onClick={() => window.location.href = '/profile'} 
            className="mr-4 p-1 hover:bg-gray-100 rounded-full"
        >
            <ArrowLeft size={20} className="text-black" />
        </button>
        <h1 className="text-lg font-bold text-black">Favorilerim</h1>
      </div>

      {/* Liste */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((restaurant) => (
          <div key={restaurant.id} className="group cursor-pointer">
            {/* Kart Görseli */}
            <div className="relative h-48 w-full overflow-hidden rounded-md border border-gray-200">
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Favori Butonu (Dolu Kalp) */}
              <button className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors">
                <Heart size={16} className="text-red-500 fill-current" />
              </button>
              {/* Süre Rozeti */}
              <div className="absolute bottom-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-md text-xs font-semibold text-black flex items-center shadow-sm">
                <Clock size={12} className="mr-1" />
                {restaurant.time}
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
                    {restaurant.tags.join(', ')} • {restaurant.minPrice} min.
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

        {/* Favori Yoksa Gösterilecek Boş Durum */}
        {favorites.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Heart size={24} className="text-gray-300" />
                </div>
                <p className="text-gray-500">Henüz favori restoranın yok.</p>
                <button className="mt-4 text-sm font-bold text-black underline">Restoranları Keşfet</button>
            </div>
        )}
      </div>
    </div>
  );
}