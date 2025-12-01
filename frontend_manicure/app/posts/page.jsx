"use client";
import React, { useState } from "react";
import Feed from "../component/post/Feed";
import { apiCreatePost } from "../utils/api";

export default function PostsPage() {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  
  const [newPost, setNewPost] = useState({
    titulo: "",
    descricao: "",
    urlImagem: "" // Agora guardará o Base64
  });

  const handleChange = (e) => setNewPost({ ...newPost, [e.target.name]: e.target.value });

  // Lógica da Foto (File -> Base64)
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => setNewPost(prev => ({ ...prev, urlImagem: reader.result }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        await apiCreatePost(newPost);
        alert("Post criado com sucesso! ✨");
        window.location.reload(); 
    } catch (error) {
        alert("Erro ao postar: " + error.message);
        setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 pb-20">
      
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-extrabold text-pink-600">Feed de Inspirações 💅</h1>
            <p className="text-gray-500">Veja os trabalhos mais recentes.</p>
        </div>
        
        <button onClick={() => setShowForm(!showForm)} className="bg-purple-600 text-white px-5 py-3 rounded-xl font-bold shadow-lg hover:bg-purple-700 transition hover:scale-105">
            {showForm ? "✕ Fechar" : "+ Novo Post"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-purple-100 dark:border-gray-700 mb-8 animate-fadeIn">
            <h2 className="text-xl font-bold mb-4 text-gray-700 dark:text-gray-200">Criar Nova Publicação</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input 
                    type="text" name="titulo" placeholder="Título (ex: Unhas de Gel)" required value={newPost.titulo} onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                />
                
                <textarea 
                    name="descricao" placeholder="Descreva o trabalho feito..." required value={newPost.descricao} onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px] dark:bg-gray-700 dark:text-white"
                />
                
                {/* --- ÁREA DE UPLOAD --- */}
                <label className={`
                    flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer transition bg-gray-50 dark:bg-gray-900
                    ${preview ? 'border-purple-500' : 'border-gray-300 dark:border-gray-600 hover:border-purple-400'}
                `}>
                    {preview ? (
                        <img src={preview} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                    ) : (
                        <div className="text-center text-gray-400">
                            <span className="text-3xl block mb-2">📷</span>
                            <span className="text-sm font-bold">Adicionar Foto do Trabalho</span>
                        </div>
                    )}
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>

                <button type="submit" disabled={loading} 
                    className="w-full bg-pink-600 text-white font-bold py-3 rounded-lg hover:bg-pink-700 transition disabled:opacity-50">
                    {loading ? "Publicando..." : "Postar Agora"}
                </button>
            </form>
        </div>
      )}

      <Feed />
    </div>
  );
}