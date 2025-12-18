'use client'

import { useState } from "react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const router = useRouter();

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = {
            name: name,
            email: email,
            password: password
        };

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
            method: "POST", 
            headers: {
                'Content-Type': 'application/json' // Sunucuya JSON gönderdiğimizi belirtiyoruz
            },
            body: JSON.stringify(data)
        });

        setLoading(false);
        console.log(await res.json());
    };

    return (
        <div className="flex flex-col w-full bg-white p-8 border border-gray-200 rounded-xl shadow-sm">
            <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-black">Kayıt Ol</h2>
                <p className="text-sm text-gray-500 mt-2">Hemen aramıza katıl ve sipariş ver</p>
            </div>

            <form onSubmit={handleSignup} className="flex flex-col space-y-4">
                <div>
                    <label className="text-xs font-semibold text-gray-700 uppercase mb-1 block">Ad Soyad</label>
                    <input
                        type="text"
                        disabled={loading}
                        placeholder="Adınız Soyadınız"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                        required
                    />
                </div>

                <div>
                    <label className="text-xs font-semibold text-gray-700 uppercase mb-1 block">Email</label>
                    <input
                        type="email"
                        disabled={loading}
                        placeholder="ornek@email.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                        required
                    />
                </div>

                <div>
                    <label className="text-xs font-semibold text-gray-700 uppercase mb-1 block">Şifre</label>
                    <input
                        type="password"
                        disabled={loading}
                        placeholder="••••••••"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-colors duration-200 disabled:opacity-70 mt-2"
                >
                    {loading ? 'Kayıt Yapılıyor...' : 'Hesap Oluştur'}
                </button>
            </form>

            <div className="mt-6 text-center text-sm">
                <span className="text-gray-500">Zaten hesabın var mı? </span>
                <Link href="/login" className="font-bold text-black hover:underline">Giriş Yap</Link>
            </div>
        </div>
    );
}