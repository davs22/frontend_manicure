'use client';
import React, { useState } from 'react';

export default function EditarPerfilModal({ user, onClose, onSave }) {
  const [nome, setNome] = useState(user?.nome || '');
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(user?.urlFotoPerfil || null);
  const [loading, setLoading] = useState(false);

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      // Cria uma URL temporária para mostrar a prévia da imagem na hora
      setPreview(URL.createObjectURL(file));
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    setLoading(true);
    
    // Prepara os dados para enviar
    const data = { nome, urlFotoPerfil: user?.urlFotoPerfil }; 
    // A lógica de upload real acontece no componente pai (Perfil.jsx) via onSave
    
    await onSave(data, photo); // Passamos o arquivo novo (photo) se houver
    setLoading(false);
    onClose();
  }

  return (
    // Fundo Escuro (Backdrop)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      
      {/* Caixa do Modal */}
      <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-fadeIn transform transition-all scale-100">
        
        {/* Cabeçalho */}
        <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-zinc-800 dark:text-white">Editar Perfil</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 transition text-2xl leading-none">&times;</button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSave} className="p-6 flex flex-col gap-6">
          
          {/* Preview da Foto */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-pink-100 dark:border-zinc-700 relative group">
                {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-zinc-200 flex items-center justify-center text-zinc-400 font-bold">Foto</div>
                )}
                {/* Overlay de troca */}
                <div className="absolute inset-0 bg-black/30 hidden group-hover:flex items-center justify-center text-white text-xs font-bold pointer-events-none">
                    Trocar
                </div>
            </div>
            
            <label className="cursor-pointer text-sm font-bold text-pink-600 hover:text-pink-700 transition">
                Alterar Foto
                <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange} 
                    className="hidden" 
                />
            </label>
          </div>

          {/* Campo Nome */}
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Nome Completo</label>
            <input 
                type="text"
                value={nome} 
                onChange={e => setNome(e.target.value)} 
                className="w-full p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-pink-500 transition"
            />
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-3 mt-2">
            <button 
                type="button" 
                onClick={onClose}
                className="flex-1 py-3 rounded-xl font-bold text-zinc-600 bg-zinc-100 hover:bg-zinc-200 transition dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
                Cancelar
            </button>
            <button 
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-xl font-bold text-white bg-pink-600 hover:bg-pink-700 shadow-lg shadow-pink-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}