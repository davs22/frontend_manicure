"use client";

import { useEffect, useState, useCallback } from 'react';
import Post from './Post'; 
import { apiGetMyPosts, apiDeletePost } from '../../utils/api'; 

/**
 * Componente responsável por listar os posts do usuário logado e fornecer 
 * os botões de gerenciamento (Editar e Deletar).
 * @param {function} onEdit - Função passada pela PostsPage para abrir o modal de edição.
 * @param {number} refreshTrigger - Gatilho para forçar a recarga da lista após uma ação (Criação/Edição).
 */
export default function MyFeed({ onEdit, refreshTrigger }) { 
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função para buscar os posts do usuário, memorizada com useCallback
  const loadMyPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Chama o endpoint seguro /posts/my
      const data = await apiGetMyPosts(); 
      setPosts(data || []);
    } catch (err) {
      setError(err.message || "Erro ao carregar seus posts. Verifique sua sessão.");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Busca os posts na montagem e sempre que o refreshTrigger mudar
  useEffect(() => {
    loadMyPosts();
  }, [loadMyPosts, refreshTrigger]); 

  // --- Funções de Ação ---
  
  // 1. Inicia o processo de edição (chama o gerenciador de estado na PostsPage)
  const handleEdit = (post) => {
    if (onEdit) {
        onEdit(post); // Passa o post completo para o modal de edição
    }
  };
  
  // 2. Executa a exclusão via API
  const handleDelete = async (postId) => {
    if (!window.confirm("Tem certeza que deseja deletar este post? Esta ação não pode ser desfeita.")) {
      return;
    }
    setLoading(true); 
    try {
      await apiDeletePost(postId);
      alert("Post deletado com sucesso!");
      loadMyPosts(); // Recarrega a lista para remover o post deletado
    } catch (err) {
      setError(err.message || "Erro ao deletar o post.");
    } finally {
      setLoading(false);
    }
  };

  // --- Renderização de Status ---

  if (loading) return <p className="text-center mt-8 text-pink-600">Carregando seus posts...</p>;
  if (error) return <p className="text-red-500 text-center mt-8 bg-red-100 p-3 rounded-lg">Erro: {error}</p>;
  if (posts.length === 0) return <p className="text-center text-gray-500 mt-8">Você ainda não publicou nenhum trabalho. Clique em "+ Novo Post" para começar!</p>;

  // --- Renderização do Feed ---
  return (
    <div className="space-y-8">
      {posts.map(({ authorNome, ...rest }) => (
        // 💡 Ajuste de Sintaxe: Desestruturando 'authorNome' e usando '...rest'
        <Post 
            key={rest.idPost} // Usamos o ID do objeto 'rest'
            author={authorNome} // Mapeando o campo do DTO
            {...rest} // Passando todos os outros campos (incluindo urlImagem)
        >
          {/* Botão de Editar */}
          <button
            // Passamos o objeto 'post' COMPLETO (authorNome e rest) para handleEdit
            onClick={() => handleEdit({ authorNome, ...rest })} 
            className="text-sm bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
          >
            Editar ✏️
          </button>
          {/* Botão de Deletar */}
          <button
            onClick={() => handleDelete(rest.idPost)}
            className="text-sm bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition"
          >
            Deletar 🗑️
          </button>
        </Post>
      ))}
    </div>
  );
}