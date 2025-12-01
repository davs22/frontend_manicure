"use client";

import { useState } from "react";
import { apiCreatePost } from "../../utils/api"; 
import { useRouter } from "next/navigation"; 

export default function CreatePost() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [urlImagem, setUrlImagem] = useState(""); // Base64
  const [preview, setPreview] = useState(null);
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Converte imagem para Base64
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => setUrlImagem(reader.result);
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!titulo || !urlImagem) {
      setError("Título e Imagem são obrigatórios!");
      return;
    }

    setLoading(true);

    try {
      await apiCreatePost({ titulo, descricao, urlImagem });
      alert("Post criado com sucesso!");
      window.location.reload(); // Recarrega para ver o post no feed
    } catch (err) {
      setError(err.message || "Erro ao criar post.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-xl rounded-2xl border border-gray-100 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-pink-600 flex items-center gap-2">✨ Novo Trabalho</h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {error && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">{error}</p>}

        <input 
          type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Título (Ex: Unhas de Gel)"
          className="p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none dark:bg-gray-700 dark:text-white transition"
          required 
        />
        
        <textarea
          value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Detalhes do serviço..." rows="3"
          className="p-3 border border-gray-200 dark:border-gray-600 rounded-xl resize-none focus:ring-2 focus:ring-pink-500 outline-none dark:bg-gray-700 dark:text-white transition"
        />
        
        {/* --- ÁREA DE UPLOAD DA IMAGEM --- */}
        <div className="relative group">
            <label className={`
                flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition
                ${preview ? 'border-pink-500 bg-black' : 'border-gray-300 hover:border-pink-400 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700'}
            `}>
                {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-400">
                        <span className="text-4xl mb-2">📷</span>
                        <p className="text-sm font-semibold">Clique para enviar uma foto</p>
                        <p className="text-xs opacity-70">JPG ou PNG</p>
                    </div>
                )}
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
            
            {/* Botão para trocar foto se já tiver uma */}
            {preview && (
                <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded pointer-events-none">
                    Clique para trocar
                </div>
            )}
        </div>
        
        <button
          type="submit" disabled={loading}
          className="bg-pink-600 text-white p-3 rounded-xl font-bold hover:bg-pink-700 transition shadow-lg shadow-pink-500/30 disabled:opacity-50 mt-2"
        >
          {loading ? "Publicando..." : "Publicar"}
        </button>
      </form>
    </div>
  );
}
