'use client'

import React, { useState } from 'react';
import { Search, X, Clock, TrendingUp, ChevronRight, Star } from 'lucide-react';

export default function SearchPage() {
  const [query, setQuery] = useState('');

  // Örnek Veriler
  const recentSearches = ["Burger King", "Starbucks", "Döner"];
  const popularCuisines = ["Burger", "Pizza", "Lahmacun", "Sushi", "Tatlı", "Çiğ Köfte"];
  
  // Örnek Arama Sonuçları (Dummy Data)
  const allRestaurants = [
    { id: 1, name: "Burger Lab", rating: 4.8, tags: ["Burger", "Amerikan"], image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=200&q=60" },
    { id: 2, name: "Pizza Locale", rating: 4.5, tags: ["Pizza", "İtalyan"], image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=200&q=60" },
    { id: 3, name: "Sushi Co", rating: 4.9, tags: ["Sushi", "Asya"], image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=200&q=60" },
  ];

  // Basit Filtreleme Mantığı
  const filteredResults = allRestaurants.filter(r => 
    r.name.toLowerCase().includes(query.toLowerCase()) || 
    r.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="bg-white min-h-screen pb-24 font-sans text-gray-900">
      
      {/* Arama Input Alanı */}
      <div className="sticky top-0 z-10 bg-white p-4 border-b border-gray-100">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Restoran veya mutfak ara..."
            className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
            autoFocus
          />
          <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
          
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="absolute right-3 top-3.5 text-gray-400 hover:text-black"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="p-4">
        {/* DURUM 1: Henüz arama yapılmadıysa */}
        {query === '' ? (
          <div className="space-y-8">
            
            {/* Son Aramalar */}
            <section>
              <h2 className="text-sm font-bold text-gray-900 mb-3">Son Aramalar</h2>
              <div className="space-y-1">
                {recentSearches.map((item, index) => (
                  <button 
                    key={index}
                    onClick={() => setQuery(item)}
                    className="w-full flex items-center justify-between py-3 text-left group"
                  >
                    <div className="flex items-center gap-3 text-gray-500 group-hover:text-black transition-colors">
                      <Clock size={16} />
                      <span className="text-sm">{item}</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-300" />
                  </button>
                ))}
              </div>
            </section>

            {/* Popüler Mutfaklar */}
            <section>
              <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <TrendingUp size={16} className="text-black" />
                Popüler Mutfaklar
              </h2>
              <div className="flex flex-wrap gap-2">
                {popularCuisines.map((cuisine, index) => (
                  <button
                    key={index}
                    onClick={() => setQuery(cuisine)}
                    className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-full text-sm font-medium text-gray-700 hover:bg-black hover:text-white transition-colors"
                  >
                    {cuisine}
                  </button>
                ))}
              </div>
            </section>
          </div>
        ) : (
          /* DURUM 2: Arama yapılıyorsa (Sonuç Listesi) */
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h2 className="text-sm font-semibold text-gray-500">Sonuçlar</h2>
            
            {filteredResults.length > 0 ? (
              filteredResults.map((restaurant) => (
                <div key={restaurant.id} className="flex gap-4 p-3 border border-gray-100 rounded-lg hover:border-gray-300 transition-colors cursor-pointer">
                  <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden shrink-0">
                    <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h3 className="font-bold text-gray-900">{restaurant.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1 text-green-700 bg-green-50 px-1.5 py-0.5 rounded text-xs font-bold">
                         <Star size={10} fill="currentColor" />
                         {restaurant.rating}
                      </div>
                      <span className="text-xs text-gray-500">{restaurant.tags.join(', ')}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <ChevronRight size={20} className="text-gray-300" />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500 text-sm">Aradığınız kriterlere uygun sonuç bulunamadı.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}