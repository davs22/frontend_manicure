"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { apiLikePost, apiCommentPost, apiGetComments } from "../../utils/api";

export default function Post({ 
  idPost, titulo, descricao, urlImagem, data, 
  authorNome, authorFoto, idAuthor, 
  likesCount: initialLikes, likedByMe 
}) {
  const router = useRouter();
  
  const [liked, setLiked] = useState(likedByMe);
  const [likesCount, setLikesCount] = useState(initialLikes || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const dataFormatada = new Date(data).toLocaleDateString("pt-BR", { day: '2-digit', month: 'short' });
  const nomeExibicao = authorNome || "Usuário"; // Agora vai pegar o nome real

  const handleLike = async () => {
    setLiked(!liked);
    setLikesCount(prev => !liked ? prev + 1 : prev - 1);
    try { await apiLikePost(idPost); } catch (e) {}
  };

  const handleShare = () => {
      const link = `${window.location.origin}/perfil/${idAuthor}`;
      navigator.clipboard.writeText(link);
      alert("Link do perfil copiado! 📋");
  };

  const toggleComments = async () => {
      if (!showComments) {
          try {
              const data = await apiGetComments(idPost);
              setComments(data || []);
          } catch (e) {}
      }
      setShowComments(!showComments);
  };

  const handleSendComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
        const comment = await apiCommentPost(idPost, newComment);
        setComments([comment, ...comments]);
        setNewComment("");
    } catch (e) { alert("Erro ao comentar."); }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
      
      {/* CABEÇALHO */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push(`/perfil/${idAuthor}`)}>
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border border-gray-100">
                {authorFoto ? (
                    <img src={authorFoto} alt={nomeExibicao} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-pink-600 text-white font-bold">
                        {nomeExibicao.charAt(0).toUpperCase()}
                    </div>
                )}
            </div>
            <div>
                <p className="font-bold text-sm text-gray-900 dark:text-white hover:text-pink-600 transition">
                    {nomeExibicao}
                </p>
                <span className="text-xs text-gray-400">{dataFormatada}</span>
            </div>
        </div>
        <button onClick={handleShare} className="text-gray-400 hover:text-pink-600 p-2">🔗</button>
      </div>

      {/* IMAGEM */}
      {urlImagem && (
        <div className="w-full bg-black cursor-pointer" onDoubleClick={handleLike}>
            <img src={urlImagem} className="w-full h-auto object-contain max-h-[600px]" onError={(e) => e.target.style.display = 'none'} />
        </div>
      )}

      {/* AÇÕES */}
      <div className="p-3">
        <div className="flex items-center gap-4 mb-3">
            <button onClick={handleLike} className="text-2xl transition active:scale-90">
                {liked ? "❤️" : "🤍"}
            </button>
            <button onClick={toggleComments} className="text-2xl hover:text-blue-500">💬</button>
            <button onClick={handleShare} className="text-2xl hover:text-green-500">➤</button>
        </div>

        <p className="font-bold text-sm mb-1">{likesCount} curtidas</p>
        <p className="text-sm mb-2"><span className="font-bold mr-2">{nomeExibicao}</span>{titulo} {descricao && `- ${descricao}`}</p>

        {showComments && (
            <div className="mt-3 pt-3 border-t">
                <div className="max-h-40 overflow-y-auto mb-2 space-y-1">
                    {comments.map(c => (
                        <p key={c.id} className="text-sm"><span className="font-bold mr-2">{c.autor}</span>{c.texto}</p>
                    ))}
                </div>
                <form onSubmit={handleSendComment} className="flex gap-2">
                    <input type="text" value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Comente..." className="flex-1 bg-gray-100 rounded-full px-3 py-1 text-sm text-black" />
                    <button type="submit" className="text-pink-600 font-bold text-sm">Enviar</button>
                </form>
            </div>
        )}
      </div>
    </div>
  );
}