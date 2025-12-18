'use client'

import React, { useState, useEffect } from 'react';
import { ChevronLeft, Star, Clock, Info, Plus, Search, Bike, X, Minus, Check } from 'lucide-react';

import { useParams, useRouter } from 'next/navigation';
import ProductModal from '@/components/ui/ProductModal'; // Bileşeni dosyalara ayırınca buradan çekin


export default function RestaurantDetail() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('Popüler');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [restaurant, setRestaurant] = useState();
  const params = useParams();
  const { id } = params; // URL'den restoran ID'sini al

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;


    const fetchRestaurantInfo = async () => {
      try {
        // Yeni oluşturduğumuz tekil restoran endpoint'ine istek atıyoruz
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customer/get-restaurant/${id}`, {
          method: 'GET',
          credentials: 'include'
        });

        if (res.ok) {
          const data = await res.json();
          console.log(data)
          setRestaurant(data);
        }
      } catch (e) {
        console.error("Restoran bilgileri alınamadı:", e);
      }
    }

    fetchRestaurantInfo();

    const fetchProducts = async () => {
      try {
        // Backend'deki get-products endpoint'ine istek at
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customer/get-products?restaurant_id=${id}`, {
          method: 'GET',
          credentials: 'include'
        });
        const data = await res.json();
        setProducts(data);
      } catch (e) {
        console.error("Ürünler yüklenemedi", e);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [id]);

  const handleAddToCart = async (product) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customer/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          restaurant_id: id, // URL'den gelen id (restoran id'si)
          product_id: product.product_id
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert("Ürün sepete eklendi!");
        // Opsiyonel: Sepet ikonundaki sayıyı güncellemek için context kullanılabilir
      } else {
        alert("Hata: " + data.message);
      }

    } catch (e) {
      console.error("Sepete eklenemedi", e);
    }
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProduct(null), 200);
  };

  // Navigasyon
  const goBack = () => {
    router.back();
  };

  // const restaurant = {
  //   name: "Burger Lab",
  //   rating: 4.8,
  //   reviewCount: "(500+)",
  //   minBasket: "150 TL",
  //   deliveryTime: "20-30 dk",
  //   image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1000&q=80",
  //   tags: ["Burger", "Amerikan", "Sokak Lezzetleri"]
  // };

  const menuItems = [
    { id: 1, name: "Truffle Burger", description: "150gr dana köfte, trüf mayonez.", price: 285, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=200&q=60", category: "Popüler" },
    { id: 2, name: "Cheeseburger", description: "150gr dana köfte, cheddar.", price: 240, image: "https://images.unsplash.com/photo-1551782450-17144efb9c50?auto=format&fit=crop&w=200&q=60", category: "Burgerler" },
  ];

  return (
    <div className="bg-white min-h-screen pb-24 font-sans text-gray-900">
      <div className="relative h-64 w-full">
        <button onClick={goBack} className="absolute top-4 left-4 z-10 p-2 bg-white/90 backdrop-blur-md rounded-full shadow-sm hover:bg-white"><ChevronLeft size={24} className="text-black" /></button>
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button className="p-2 bg-white/90 backdrop-blur-md rounded-full shadow-sm"><Search size={20} className="text-black" /></button>
          <button className="p-2 bg-white/90 backdrop-blur-md rounded-full shadow-sm"><Info size={20} className="text-black" /></button>
        </div>
        <img src={restaurant ?  restaurant.image:''} alt={restaurant ? restaurant.name:''} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      </div>

      <div className="relative -mt-10 px-4">
        <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
          <div className="flex justify-between items-start">
            <div><h1 className="text-2xl font-bold text-black">{restaurant ? `${restaurant.name} - ${restaurant.district}`:''}</h1><p className="text-sm text-gray-500 mt-1">{''}</p></div>
            <div className="flex flex-col items-end"><div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-md border border-green-100"><Star size={14} className="text-green-600 fill-current" /><span className="text-sm font-bold text-green-700">{restaurant ? restaurant.rating:''}</span></div><span className="text-xs text-gray-400 mt-1">{restaurant ? restaurant.reviewCount:''}</span></div>
          </div>
          <hr className="my-4 border-gray-100" />
          <div className="flex items-center justify-between text-sm"><div className="flex items-center gap-2 text-gray-700"><Clock size={16} className="text-gray-400" /><span>{restaurant ? restaurant.deliveryTime:''}</span></div><div className="flex items-center gap-2 text-gray-700"><Bike size={16} className="text-gray-400" /><span>{restaurant ? restaurant.minBasket:''} min.</span></div></div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-6">
        <h2 className="text-lg font-bold text-black mb-4">Popüler</h2>
        <div className="space-y-4">
          {products.map((item) => (
            <div key={item.id} className="group flex justify-between gap-4 p-3 border border-gray-100 rounded-lg hover:border-gray-300 transition-all cursor-pointer bg-white shadow-sm hover:shadow-md">
              <div className="flex flex-col justify-between flex-1">
                <div><h3 className="font-bold text-gray-900">{item.name}</h3><p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p></div>
                <div className="mt-3"><span className="font-semibold text-black">₺{item.unit_price}</span></div>
              </div>
              <div className="relative h-24 w-24 flex-shrink-0"><img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-md" /><button onClick={e => handleAddToCart(item)} className="absolute -bottom-2 -right-2 bg-black text-white p-2 rounded-full shadow-lg"><Plus size={16} strokeWidth={3} /></button></div>
            </div>
          ))}
        </div>
      </div>

      <ProductModal isOpen={isModalOpen} onClose={handleCloseModal} product={selectedProduct} />
    </div>
  );
}