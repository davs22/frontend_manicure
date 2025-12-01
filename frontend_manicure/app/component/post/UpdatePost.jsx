"use client";

import { useState } from 'react';
import { apiUpdatePost } from '../../utils/api';

export default function UpdatePost({ post, onClose, onSuccess }) {
  const [titulo, setTitulo] = useState(post.titulo);
  const [descricao, setDescricao] = useState(post.descricao);
  const [urlImagem, setUrlImagem] = useState(post.urlImagem || ''); 
  const [preview, setPreview] = useState(post.urlImagem || null); // Começa com a foto atual
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    setLoading(true);
    setError('');

    try {
      await apiUpdatePost(post.idPost, { titulo, descricao, urlImagem });
      alert("Post atualizado!");
      onSuccess();
    } catch (err) {
      setError(err.message || "Erro ao atualizar.");
    } finally {
      setLoading(false);
    }
  }

  const handleBackdropClick = (e) => {
    if (e.target.id === 'modal-backdrop') onClose();
  };

  return (
    <div id="modal-backdrop" onClick={handleBackdropClick} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg p-6 relative flex flex-col max-h-[90vh] overflow-y-auto custom-scrollbar">
        
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-pink-600">Editar Publicação</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
        </div>
        
        {error && <p className="text-red-500 text-center bg-red-50 p-2 rounded-lg mb-4 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Título" 
            className="p-3 border border-gray-300 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white" required 
          />
          
          <textarea
            value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Descrição" rows="3"
            className="p-3 border border-gray-300 dark:border-gray-600 rounded-xl resize-none outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
          />
          
          {/* --- UPLOAD NO MODAL --- */}
          <label className="block">
            <span className="text-xs font-bold text-gray-500 uppercase mb-2 block">Imagem do Post</span>
            <div className={`
                relative h-48 rounded-xl border-2 border-dashed overflow-hidden flex items-center justify-center cursor-pointer transition
                ${preview ? 'border-pink-500 bg-black' : 'border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700'}
            `}>
                {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                ) : (
                    <span className="text-gray-400">Adicionar Foto</span>
                )}
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition"></div>
                <div className="absolute bottom-2 right-2 bg-white text-black text-xs font-bold px-2 py-1 rounded shadow">Alterar</div>
            </div>
          </label>
          
          <button type="submit" disabled={loading} className="bg-pink-600 text-white p-3 rounded-xl font-bold hover:bg-pink-700 transition disabled:bg-gray-400 mt-2">
            {loading ? "Salvando..." : "Salvar Alterações"}
          </button>
        </form>
      </div>
    </div>
  );
}