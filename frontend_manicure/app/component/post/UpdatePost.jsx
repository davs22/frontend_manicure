"use client";

import { useState } from 'react';
import { apiUpdatePost } from '../../utils/api';

export default function UpdatePost({ post, onClose, onSuccess }) {
  // Inicializa o estado do formulário com os dados atuais do post
  const [titulo, setTitulo] = useState(post.titulo);
  const [descricao, setDescricao] = useState(post.descricao);
  // Assumindo que você tem um campo para URL da Imagem (ajuste conforme seu DTO/Entidade)
  const [urlImagem, setUrlImagem] = useState(post.urlImagem || ''); 
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 💡 Chama a função de atualização da API
      await apiUpdatePost(post.idPost, { titulo, descricao, urlImagem });
      
      alert("Post atualizado com sucesso!");
      onSuccess(); // Chama a função para fechar o modal E recarregar o feed
    } catch (err) {
      setError(err.message || "Erro ao atualizar o post.");
    } finally {
      setLoading(false);
    }
  }

  // Lógica para fechar o modal ao clicar fora da caixa (no backdrop)
  const handleBackdropClick = (e) => {
    // Verifica se o clique ocorreu exatamente no elemento com id 'modal-backdrop'
    if (e.target.id === 'modal-backdrop') {
      onClose();
    }
  };

  return (
    // 1. Backdrop do Modal (Fundo escuro)
    <div 
      id="modal-backdrop"
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      {/* 2. Conteúdo Principal do Modal */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-lg p-6 relative">
        <h2 className="text-2xl font-bold mb-4 text-pink-600">Editar Post: {post.titulo}</h2>
        
        {/* Botão de fechar */}
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-3xl">
          &times;
        </button>
        
        {error && <p className="text-red-600 text-center bg-red-100 p-2 rounded-lg mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          <input 
            type="text" 
            value={titulo} 
            onChange={(e) => setTitulo(e.target.value)} 
            placeholder="Título" 
            className="p-3 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
            required 
          />
          
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descrição"
            rows="4"
            className="p-3 border border-gray-300 rounded-lg resize-none focus:ring-pink-500 focus:border-pink-500"
            required
          />
          
          <input 
            type="url" 
            value={urlImagem} 
            onChange={(e) => setUrlImagem(e.target.value)} 
            placeholder="URL da Imagem (Opcional)"
            className="p-3 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
          />
          
          <button
            type="submit"
            disabled={loading}
            className="bg-pink-600 text-white p-3 rounded-lg font-semibold hover:bg-pink-700 transition disabled:bg-gray-400 mt-2"
          >
            {loading ? "Salvando..." : "Salvar Alterações"}
          </button>
        </form>
      </div>
    </div>
  );
}