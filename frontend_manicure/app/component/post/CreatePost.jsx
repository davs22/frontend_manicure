"use client";

import { useState } from "react";
import { apiCreatePost } from "../../utils/api"; 
import { useRouter } from "next/navigation"; // Usado para navegação

export default function CreatePost() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [urlImagem, setUrlImagem] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!titulo || !descricao || !urlImagem) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);

    try {
      // 🚀 Chama a nova função da API
      await apiCreatePost({ titulo, descricao, urlImagem });
      
      // Sucesso: Limpa o formulário e navega para o feed ou perfil
      setTitulo("");
      setDescricao("");
      setUrlImagem("");
      alert("Post criado com sucesso!");
      router.push("/"); // Volta para a página inicial (Feed)

    } catch (err) {
      // Se a regra de "precisa de complemento" falhar, o erro virá daqui.
      setError(err.message || "Erro ao criar post. Verifique se você é uma Manicure cadastrada.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-xl rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-pink-600">Criar Novo Post</h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        
        {error && <p className="text-red-500 text-center bg-red-100 p-3 rounded-lg">{error}</p>}

        {/* Campo Título */}
        <input 
          type="text" 
          value={titulo} 
          onChange={(e) => setTitulo(e.target.value)} 
          placeholder="Título do Post (Ex: Unhas de Gel Francesa)"
          className="p-3 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:border-gray-600"
          required 
        />
        
        {/* Campo Descrição */}
        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Descreva seu trabalho..."
          rows="4"
          className="p-3 border border-gray-300 rounded-lg resize-none focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:border-gray-600"
          required
        />
        
        {/* Campo URL da Imagem */}
        <input 
          type="url" 
          value={urlImagem} 
          onChange={(e) => setUrlImagem(e.target.value)} 
          placeholder="URL da Imagem (Ex: https://meusite.com/unha.jpg)"
          className="p-3 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:border-gray-600"
          required 
        />
        
        {/* Botão de Envio */}
        <button
          type="submit"
          disabled={loading}
          className="bg-pink-600 text-white p-3 rounded-lg font-semibold hover:bg-pink-700 transition shadow-md disabled:bg-gray-400"
        >
          {loading ? "Publicando..." : "Publicar Trabalho"}
        </button>
      </form>
    </div>
  );
}