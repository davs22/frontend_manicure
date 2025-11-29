"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
// ✅ AJUSTE DE CAMINHOS: Os imports devem ser exatos para a estrutura 'app/component/...'
import Feed from "./component/post/Feed";
import AuthPage from "./component/auth/AuthPage";
import FeedUsuarios from "./component/Feed/FeedUsuarios"; 
import FiltroManicures from "./component/Home/FiltroManicures"; // O NOVO FILTRO
import { logout, getCurrentUser } from "./utils/api";


export default function Home() {
    const [authModal, setAuthModal] = useState(false);
    const [isLogged, setIsLogged] = useState(false);
    const [search, setSearch] = useState("");
    const router = useRouter();
    
    useEffect(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
        setIsLogged(!!token);
    }, []);

    const handleLogout = () => { logout(); setIsLogged(false); window.location.reload(); };
    const irPara = (url) => { 
        // Se não estiver logado, bloqueia acesso a rotas privadas
        const user = getCurrentUser();
        if (!user && (url.includes('agendamentos') || url.includes('perfil'))) { 
            setAuthModal(true); return; 
        } 
        router.push(url); 
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter' && search.trim()) {
            router.push(`/pesquisa?q=${encodeURIComponent(search)}`);
        }
    };

    return (
        // 1. DIV PRINCIPAL: Garante que a página cubra toda a altura e largura (min-h-screen w-full)
        <div className="min-h-screen w-full bg-gray-50 dark:bg-black text-black dark:text-white">
            {authModal && <AuthPage onClose={() => { setAuthModal(false); if(typeof window !== 'undefined' && localStorage.getItem("token")) setIsLogged(true); }} />}

            {/* HEADER CORRIGIDO: Layout que se adapta ao PC e celular */}
            <header className="flex flex-col md:flex-row justify-between items-center py-3 px-4 sm:px-6 bg-white dark:bg-black sticky top-0 z-40 border-b border-gray-100 dark:border-gray-800 gap-3 md:gap-6">
                
                {/* LOGO */}
                <div className="flex items-center gap-2 cursor-pointer flex-shrink-0" onClick={() => router.push('/')}>
                    <span className="text-2xl sm:text-3xl">💅</span>
                    <h1 className="text-xl sm:text-2xl font-extrabold text-pink-600">Belanetic</h1>
                </div>

                {/* BUSCA CENTRAL */}
                <div className="relative w-full md:w-80 my-1 md:my-0 order-3 md:order-none flex-grow md:flex-grow-0">
                    <input type="text" placeholder="Pesquisar..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={handleSearch}
                        className="w-full bg-gray-100 dark:bg-gray-900 border-none rounded-full py-2 px-4 pl-9 text-sm focus:ring-2 focus:ring-pink-500 placeholder-gray-400" />
                    <span className="absolute left-3 top-2.5 text-gray-400 text-xs">🔍</span>
                </div>

                {/* BOTÕES DE NAVEGAÇÃO */}
                <div className="flex items-center space-x-3 text-sm font-bold text-gray-600 dark:text-gray-300 order-2 md:order-none">
                    <button onClick={() => irPara('/agendamentos')} className="hover:text-pink-600 text-xs sm:text-sm">📅 Agenda</button>
                    <button onClick={() => irPara('/posts')} className="hover:text-pink-600 text-xs sm:text-sm">📷 Feed</button>
                    <button onClick={() => irPara('/perfil')} className="hover:text-pink-600 text-xs sm:text-sm">👤 Perfil</button>
                    {isLogged ? 
                        <button onClick={handleLogout} className="text-red-500 border border-red-200 px-3 py-1 rounded-full text-xs sm:text-sm hover:bg-red-50">Sair</button> : 
                        <button onClick={() => setAuthModal(true)} className="bg-pink-600 text-white px-4 py-2 rounded-full text-xs sm:text-sm hover:bg-pink-700">Entrar</button>
                    }
                </div>
            </header>

            <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-4 py-6 max-w-[1200px] mx-auto">
                
                {/* 🎯 CORREÇÃO RESPONSIVA 🎯 */}
                
                {/* ESQUERDA (Painel de Boas Vindas) - Opcional, só para PC */}
                <div className="hidden lg:block lg:col-span-3">
                    <div className="sticky top-20 bg-white dark:bg-gray-900 rounded-xl p-5 border border-pink-100 dark:border-gray-800 shadow-sm">
                        <h3 className="font-bold text-pink-700">Painel</h3>
                        <p className="text-xs text-gray-500 mt-1 mb-4">Gerencie sua beleza ou seu negócio.</p>
                        {isLogged && <button onClick={() => irPara('/agendamentos')} className="w-full bg-pink-50 text-pink-600 py-2 rounded-lg text-sm font-bold hover:bg-pink-100">Minha Agenda</button>}
                    </div>
                </div>

                {/* DIREITA (Filtros e Sugestões) - NO MOBILE: aparece primeiro (order-1) */}
                <div className="col-span-1 lg:col-span-3 order-1 lg:order-none"> 
                    <div className="sticky top-20 space-y-6">
                        
                        {/* FILTRO DE MANICURES (VISÍVEL NO CELULAR) */}
                        <FiltroManicures />
                        
                        {/* SUGESTÕES DE QUEM SEGUIR (VISÍVEL NO CELULAR) */}
                        <FeedUsuarios />
                    </div>
                </div>
                
                {/* CENTRO (Feed de Posts) - NO MOBILE: aparece por último, abaixo dos filtros (order-2) */}
                <div className="col-span-1 lg:col-span-6 order-2 lg:order-none"> 
                    <Feed />
                </div>
            </main>
        </div>
    );
}