"use client";
import React, { useState } from "react";
import Feed from "../component/post/Feed"; // Caminho corrigido
import { apiCreatePost } from "../utils/api";

export default function PostsPage() {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Estado para criar novo post
  const [newPost, setNewPost] = useState({
    titulo: "",
    descricao: "",
    urlImagem: ""
  });

  const handleChange = (e) => setNewPost({ ...newPost, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        await apiCreatePost(newPost);
        alert("Post criado com sucesso! ✨");
        setShowForm(false);
        setNewPost({ titulo: "", descricao: "", urlImagem: "" });
        // Recarrega a página para atualizar o feed (simples e eficaz)
        window.location.reload(); 
    } catch (error) {
        alert("Erro ao postar: " + error.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 pb-20">
      
      {/* Cabeçalho da Página */}
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-extrabold text-pink-600">Feed de Inspirações 💅</h1>
            <p className="text-gray-500">Veja os trabalhos mais recentes.</p>
        </div>
        
        <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-purple-600 text-white px-5 py-3 rounded-xl font-bold shadow-lg hover:bg-purple-700 transition hover:scale-105"
        >
            {showForm ? "✕ Fechar" : "+ Novo Post"}
        </button>
      </div>

      {/* Formulário de Novo Post (Aparece só quando clica no botão) */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-purple-100 mb-8 animate-fadeIn">
            <h2 className="text-xl font-bold mb-4 text-gray-700 dark:text-gray-200">Criar Nova Publicação</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input 
                    type="text" name="titulo" placeholder="Título (ex: Unhas de Gel)" required value={newPost.titulo} onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-purple-500"
                />
                
                <textarea 
                    name="descricao" placeholder="Descreva o trabalho feito..." required value={newPost.descricao} onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px]"
                />
                
                <input 
                    type="text" name="urlImagem" placeholder="URL da Imagem (Link)" value={newPost.urlImagem} onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-xs text-gray-400">Dica: Pegue um link do Google Imagens para testar.</p>

                <button type="submit" disabled={loading} 
                    className="w-full bg-pink-600 text-white font-bold py-3 rounded-lg hover:bg-pink-700 transition disabled:opacity-50">
                    {loading ? "Publicando..." : "Postar Agora"}
                </button>
            </form>
        </div>
      )}

      {/* O Componente de Feed que já arrumamos */}
      <Feed />

    </div>
  );
}