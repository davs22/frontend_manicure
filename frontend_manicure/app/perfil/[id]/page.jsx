"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiGetUserById, apiFollowUser, apiUnfollowUser, getCurrentUser, apiGetFollowStatus } from '@/utils/api';

export default function PerfilPublico() {
  const params = useParams();
  const router = useRouter();
  const idPerfil = params?.id;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Estados para o botão seguir
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const currentUser = getCurrentUser();
  const isMe = currentUser && String(currentUser.id) === String(idPerfil);

  useEffect(() => {
    async function loadPerfil() {
      if (!idPerfil) return;
      
      try {
        setLoading(true);
        const data = await apiGetUserById(idPerfil);
        setUser(data);

        if (!isMe && currentUser) {
            try {
                const status = await apiGetFollowStatus(idPerfil);
                setIsFollowing(!!status);
            } catch(e) { 
                setIsFollowing(false); 
            }
        }
      } catch (e) { 
        console.error("Erro ao carregar perfil:", e);
        setError("Não foi possível carregar este perfil.");
      } finally { 
        setLoading(false); 
      }
    }
    loadPerfil();
  }, [idPerfil, isMe]); // Removido currentUser para evitar loops

  const handleFollow = async () => {
      if (followLoading) return;
      setFollowLoading(true);

      const novoStatus = !isFollowing;
      setIsFollowing(novoStatus);
      
      setUser(prev => ({
          ...prev,
          seguidores: novoStatus ? (prev.seguidores || 0) + 1 : (prev.seguidores || 0) - 1
      }));

      try {
          if (novoStatus) await apiFollowUser(idPerfil);
          else await apiUnfollowUser(idPerfil);
      } catch (e) {
          setIsFollowing(!novoStatus); 
          setUser(prev => ({
            ...prev,
            seguidores: !novoStatus ? (prev.seguidores || 0) + 1 : (prev.seguidores || 0) - 1
        }));
          alert("Erro ao realizar ação.");
      } finally {
          setFollowLoading(false);
      }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-pink-600 font-bold animate-pulse">Carregando perfil...</div>;
  if (error) return <div className="text-center mt-20 text-red-500 bg-red-50 p-4 rounded-lg mx-auto max-w-md">{error}</div>;
  if (!user) return <div className="text-center mt-20 text-gray-500">Usuário não encontrado.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 pb-20">
      {/* Botão Voltar */}
      <button onClick={() => router.back()} className="mb-6 text-gray-500 hover:text-pink-600 font-bold flex items-center gap-2 transition">
        ← Voltar
      </button>
      
      {/* --- NOVO LAYOUT DO CARD (Correção Visual) --- */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
            
            {/* 1. FOTO DE PERFIL */}
            <div className="flex-shrink-0">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                    {user.urlFotoPerfil ? (
                        <img src={user.urlFotoPerfil} alt={user.nome} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-4xl font-bold text-gray-400">
                            {user.nome?.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>
            </div>

            {/* 2. INFORMAÇÕES */}
            <div className="flex-grow text-center md:text-left w-full">
                
                {/* Nome e Badge */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-2 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center justify-center md:justify-start gap-2 flex-wrap">
                            {user.nome}
                            {(user.isManicure || user.especialidade) && (
                                <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide align-middle">
                                    Manicure
                                </span>
                            )}
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">{user.email}</p>
                    </div>

                    {/* Botão de Ação (No Desktop fica à direita) */}
                    {!isMe && (
                        <button 
                            onClick={handleFollow} 
                            disabled={followLoading}
                            className={`px-6 py-2 rounded-full font-bold transition shadow-sm hover:scale-105 active:scale-95 disabled:opacity-50
                                ${isFollowing 
                                    ? "bg-gray-100 text-gray-600 border border-gray-200" 
                                    : "bg-pink-600 text-white hover:bg-pink-700"
                                }`}
                        >
                            {followLoading ? "..." : (isFollowing ? "Seguindo" : "Seguir")}
                        </button>
                    )}
                </div>

                {/* Detalhes Profissionais */}
                {(user.especialidade || user.regiao) && (
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-600 dark:text-gray-300 mt-4 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl inline-flex">
                        {user.especialidade && <span>💅 {user.especialidade}</span>}
                        {user.regiao && <span>📍 {user.regiao}</span>}
                    </div>
                )}

                {/* Estatísticas */}
                <div className="flex justify-center md:justify-start gap-8 mt-6 border-t border-gray-100 dark:border-gray-700 pt-4">
                    <div>
                        <span className="block text-xl font-bold text-gray-900 dark:text-white">{user.seguidores || 0}</span>
                        <span className="text-xs text-gray-500 uppercase">Seguidores</span>
                    </div>
                    <div>
                        <span className="block text-xl font-bold text-gray-900 dark:text-white">{user.seguindo || 0}</span>
                        <span className="text-xs text-gray-500 uppercase">Seguindo</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}