"use client";

import { useEffect, useState, useCallback } from "react";
import { apiGetPosts } from "../../utils/api";
import Post from "./Post";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const fetchPosts = useCallback(() => {
    setLoading(true);
    setHasError(false);
    
    apiGetPosts()
      .then(data => {
          if (Array.isArray(data)) setPosts(data);
          else setPosts([]);
      })
      .catch(() => setHasError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  if (loading) return (
    <div className="max-w-xl mx-auto space-y-6">
        {[1, 2].map(i => <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-xl h-96 animate-pulse"></div>)}
    </div>
  );

  if (hasError || !posts.length) return (
    <div className="max-w-xl mx-auto mt-10 p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm text-center border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200">Tudo calmo por aqui</h3>
        <p className="text-gray-500 text-sm mb-4">Seja a primeira a postar sua arte!</p>
        <button onClick={fetchPosts} className="text-pink-600 font-bold hover:underline text-sm">Atualizar página</button>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 max-w-xl mx-auto pb-20">
      {posts.map(post => (
        // 🔴 CORREÇÃO: Passando todos os dados do autor corretamente
        <Post 
            key={post.idPost} 
            {...post} // Isso passa idPost, titulo, descricao, urlImagem, likesCount, etc.
            authorNome={post.authorNome} // Garante o nome
            authorFoto={post.authorFoto} // Garante a foto
            idAuthor={post.idAuthor}     // Garante o link para o perfil
        />
      ))}
    </div>
  );
}