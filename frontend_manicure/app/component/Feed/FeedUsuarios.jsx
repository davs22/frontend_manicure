"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiGetAllUsers, apiFollowUser, apiUnfollowUser, getCurrentUser, apiGetFollowStatus } from "../../utils/api";

export default function FeedUsuarios() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [followMap, setFollowMap] = useState({}); // Estado estável
  const currentUser = getCurrentUser();

  useEffect(() => {
    async function loadData() {
      try {
        const allUsers = await apiGetAllUsers();
        const suggestions = Array.isArray(allUsers) ? allUsers.filter(u => u.idUsuario !== currentUser?.id).slice(0, 5) : [];
        setUsers(suggestions);

        // Carrega status inicial
        const initialStatus = {};
        for (const user of suggestions) {
          try {
            const status = await apiGetFollowStatus(user.idUsuario);
            initialStatus[user.idUsuario] = !!status;
          } catch (e) { initialStatus[user.idUsuario] = false; }
        }
        setFollowMap(initialStatus);
      } catch (err) { }
    }
    loadData();
  }, []);

  const handleToggleFollow = async (userId) => {
    const isFollowing = followMap[userId];
    // Muda visualmente
    setFollowMap(prev => ({ ...prev, [userId]: !isFollowing }));

    try {
      if (isFollowing) await apiUnfollowUser(userId);
      else await apiFollowUser(userId);
    } catch (error) {
      // Reverte
      setFollowMap(prev => ({ ...prev, [userId]: isFollowing }));
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <h3 className="text-xs font-bold text-gray-500 uppercase mb-4">Sugestões</h3>
      <div className="space-y-4">
        {users.map((user) => {
          const isFollowing = followMap[user.idUsuario];
          return (
            <div key={user.idUsuario} className="flex items-center justify-between">
              {/* 👇 COLE ISTO NO LUGAR DA DIV ANTIGA 👇 */}
              <div
                className="flex items-center gap-3 cursor-pointer overflow-hidden"
                onClick={() => {
                  if (user.idUsuario) {
                    console.log("Navegando para perfil:", user.idUsuario);
                    router.push(`/perfil/${user.idUsuario}`);
                  } else {
                    alert("Erro: Usuário sem ID! Verifique o console.");
                    console.error("Usuário sem ID:", user);
                  }
                }}
              >
                {/* Mantenha o conteúdo interno igual (Foto e Nome) */}
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border border-gray-200">
                  {user.urlFotoPerfil ? (
                    <img src={user.urlFotoPerfil} className="w-full h-full object-cover" alt={user.nome} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-gray-500 bg-gray-100">
                      {user.nome?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold text-gray-800 dark:text-white truncate max-w-[100px]">{user.nome.split(" ")[0]}</span>
                  {(user.isManicure || user.especialidade) ? <span className="text-[10px] text-pink-500 font-bold">Manicure</span> : <span className="text-[10px] text-gray-400">Novo</span>}
                </div>

              </div>
              <button onClick={() => handleToggleFollow(user.idUsuario)} className={`text-xs font-bold px-3 py-1 rounded-full ${isFollowing ? 'bg-gray-100 text-gray-500' : 'bg-blue-500 text-white'}`}>
                {isFollowing ? "Seguindo" : "Seguir"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}