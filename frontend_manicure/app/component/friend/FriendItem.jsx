"use client";

import React from "react";
import AmigoDetalhes from "./AmigoDetalhes";
/**
 * Cartão de exibição para um único usuário no feed.
 * Navega para a página de perfil do usuário ao clicar.
 * * @param {object} friend - Objeto do usuário (DTO) retornado pelo backend.
 * Campos esperados: idUsuario, nome, urlFotoPerfil e status.
 */
function FriendItem({ friend }) {
  
  // 💡 Mapeia campos do Backend (idUsuario, nome, urlFotoPerfil)
  const id = friend.idUsuario; 
  const name = friend.nome;
  // Usando um placeholder genérico (48x48) com cor e texto de fallback
  const avatarUrl = friend.urlFotoPerfil || `https://placehold.co/48x48/1e3a8a/ffffff?text=${name.charAt(0)}`; 

  // A URL de navegação é '/friend/[idUsuario]'
  return (
    // 💡 CORREÇÃO: Substituindo <Link> por <a>
    <a 
      href={`/friend/${id}`} 
      className="w-full"
    >
      <div
        className="
          p-3 rounded-lg flex items-center gap-4 cursor-pointer
          transition duration-300 bg-white hover:bg-indigo-50 
        "
      >
        {/* Foto de Perfil */}
        <div className="relative w-12 h-12 flex-shrink-0">
            {/* 💡 CORREÇÃO: Substituindo <Image> por <img> padrão */}
            <img
              src={avatarUrl}
              alt={name}
              style={{ width: '48px', height: '48px' }} // Define o tamanho para 48x48px
              className="rounded-full object-cover border border-gray-200" 
              // Adicionando um fallback simples caso o URL da imagem falhe
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = `https://placehold.co/48x48/6366f1/ffffff?text=${name.charAt(0)}`; 
              }}
            />
        </div>

        {/* Nome */}
        <div className="flex flex-col overflow-hidden">
            <span className="font-bold text-gray-800 truncate">{name}</span>
            
        </div>
      </div>
    </a>
  );
}

export default FriendItem;