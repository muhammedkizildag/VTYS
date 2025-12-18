'use client'

import React, { use, useEffect, useState } from 'react';
import { DollarSign, ShoppingBag, Users, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';

export default function DashboardPage({ params }) {
    params = use(params)
    const [data, setData] = useState({
        turnover: 5,
        total_order_count: 0,
        new_customer_count: 0,
        orders: []

    });

    useEffect(() => {
        (async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/restaurant/get-restaurant-dashboard/${params.restaurantId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
            });
            const _data = await res.json();

            setData(_data);

            console.log(_data);
        })();

    }, []);


    // İstatistik Kartı Bileşeni
    const StatCard = ({ icon: Icon, label, value, trend, trendUp }) => (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gray-50 rounded-xl text-black">
                    <Icon size={24} />
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                    {trend}
                </span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{label}</h3>
            <p className="text-2xl font-bold text-black mt-1">{value}</p>
        </div>
    );

    return (
        <div className="space-y-8">

            {/* Başlık */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-black">Panel Özeti</h1>
                    <p className="text-gray-500">Burger Lab - Kadıköy şubesi istatistikleri</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        Restoran Açık
                    </span>
                </div>
            </div>

            {/* İstatistik Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={DollarSign} label="Günlük Ciro" value={"₺"+data.turnover} trend="+12%" trendUp={true} />
                <StatCard icon={ShoppingBag} label="Toplam Sipariş" value={data.total_order_count} trend="+5%" trendUp={true} />
                <StatCard icon={Users} label="Yeni Müşteri" value={data.new_customer_count} trend="-2%" trendUp={false} />
                <StatCard icon={Clock} label="Ort. Hazırlama" value="18 dk" trend="Sabit" trendUp={true} />
            </div>

            {/* Son Siparişler Tablosu */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="font-bold text-lg text-black">Son Siparişler</h2>
                    <button className="text-sm font-semibold text-black hover:underline">Tümünü Gör</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium">
                            <tr>
                                <th className="px-6 py-4">Sipariş ID</th>
                                <th className="px-6 py-4">Müşteri</th>
                                <th className="px-6 py-4">Tutar</th>
                                <th className="px-6 py-4">Durum</th>
                                <th className="px-6 py-4">Zaman</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.orders.map((i, ind) => (
                                <tr key={i} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-mono font-medium">#{ind}</td>
                                    <td className="px-6 py-4">{i.customer_name}</td>
                                    <td className="px-6 py-4 font-bold">₺{i.total_price}</td>
                                    <td className="px-6 py-4">
                                        <span className="flex items-center gap-1.5 text-green-600 font-bold bg-green-50 w-fit px-2 py-1 rounded">
                                            <CheckCircle2 size={14} /> Hazırlanıyor
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">14:3</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}