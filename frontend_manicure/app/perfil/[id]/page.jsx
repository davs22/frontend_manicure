"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
// ✅ CORREÇÃO: Usa o alias absoluto '@/utils/api'
import { apiGetUserById, apiFollowUser, apiUnfollowUser, getCurrentUser, apiGetFollowStatus } from '@/utils/api';

export default function PerfilPublico() {
  const params = useParams();
  const router = useRouter();
  const idPerfil = params?.id; // Pega o ID da URL (ex: 5)

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Estados para o botão seguir
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const currentUser = getCurrentUser();
  // Verifica se o perfil aberto é o do próprio usuário logado
  const isMe = currentUser && String(currentUser.id) === String(idPerfil);

  useEffect(() => {
    async function loadPerfil() {
      if (!idPerfil) return;
      
      try {
        setLoading(true);
        // 1. Busca dados do usuário
        const data = await apiGetUserById(idPerfil);
        setUser(data);

        // 2. Se não for eu, verifico se já sigo
        if (!isMe && currentUser) {
            try {
                const status = await apiGetFollowStatus(idPerfil);
                setIsFollowing(!!status);
            } catch(e) { 
                console.warn("Não foi possível verificar status de seguir", e);
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
  }, [idPerfil, isMe]); // Removemos currentUser do array para evitar loops

  const handleFollow = async () => {
      if (followLoading) return;
      setFollowLoading(true);

      const novoStatus = !isFollowing;
      setIsFollowing(novoStatus); // Otimista
      
      // Atualiza contador visualmente na hora
      setUser(prev => ({
          ...prev,
          seguidores: novoStatus ? (prev.seguidores || 0) + 1 : (prev.seguidores || 0) - 1
      }));

      try {
          if (novoStatus) await apiFollowUser(idPerfil);
          else await apiUnfollowUser(idPerfil);
      } catch (e) {
          // Reverte se der erro
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

  if (loading) return <div className="text-center mt-20 text-pink-600 font-bold animate-pulse">Carregando perfil...</div>;
  if (error) return <div className="text-center mt-20 text-red-500 bg-red-50 p-4 rounded-lg mx-auto max-w-md">{error}</div>;
  if (!user) return <div className="text-center mt-20 text-gray-500">Usuário não encontrado.</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 pb-20">
      <button onClick={() => router.back()} className="mb-4 text-gray-500 hover:text-pink-600 font-bold flex items-center gap-1 transition">
        ← Voltar
      </button>
      
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
        {/* Capa Colorida */}
        <div className="h-32 bg-gradient-to-r from-pink-500 to-purple-600"></div>
        
        <div className="px-8 pb-8 text-center -mt-16">
            {/* Foto de Perfil */}
            <div className="w-32 h-32 mx-auto rounded-full border-4 border-white dark:border-gray-800 bg-white shadow-lg overflow-hidden flex items-center justify-center">
                {user.urlFotoPerfil ? (
                    <img src={user.urlFotoPerfil} alt={user.nome} className="w-full h-full object-cover" />
                ) : (
                    <div className="text-4xl font-bold text-gray-300 bg-gray-100 w-full h-full flex items-center justify-center">
                        {user.nome?.charAt(0).toUpperCase()}
                    </div>
                )}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">{user.nome}</h1>
            <p className="text-gray-500 text-sm">{user.email}</p>
            
            {/* Estatísticas */}
            <div className="flex justify-center gap-8 my-6 border-y border-gray-100 dark:border-gray-700 py-4">
                <div>
                    <span className="block text-2xl font-bold text-gray-800 dark:text-white">{user.seguidores || 0}</span>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Seguidores</span>
                </div>
                <div>
                    <span className="block text-2xl font-bold text-gray-800 dark:text-white">{user.seguindo || 0}</span>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Seguindo</span>
                </div>
            </div>

            {/* Badge de Manicure */}
            {(user.isManicure || user.especialidade) && (
                <div className="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-xl mb-6 border border-pink-100 dark:border-pink-800 animate-fadeIn">
                    <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Manicure Profissional</span>
                    <div className="mt-3 flex flex-wrap justify-center gap-4 text-sm text-gray-700 dark:text-gray-300">
                        {user.especialidade && <span>💅 {user.especialidade}</span>}
                        {user.regiao && <span>📍 {user.regiao}</span>}
                    </div>
                </div>
            )}

            {/* Botão de Ação (Seguir) */}
            {!isMe && (
                <button 
                    onClick={handleFollow} 
                    disabled={followLoading}
                    className={`px-8 py-2 rounded-full font-bold text-lg transition shadow-md hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                        ${isFollowing 
                            ? "bg-gray-100 text-gray-600 border border-gray-300" 
                            : "bg-pink-600 text-white hover:bg-pink-700"
                        }`}
                >
                    {followLoading ? "..." : (isFollowing ? "Seguindo" : "Seguir")}
                </button>
            )}
        </div>
      </div>
    </div>
  );
}