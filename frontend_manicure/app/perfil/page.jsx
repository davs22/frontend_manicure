"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
// ✅ CORREÇÃO: Usa o alias absoluto '@/utils/api'
import { getCurrentUser, apiGetUserById, apiUpdateUser, apiUploadImage } from '@/utils/api'; 
import Post from '../component/post/Post';
import EditarPerfilModal from '../component/Perfil/EditarPerfilModal';

export default function Perfil() {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const router = useRouter();
    const currentUser = getCurrentUser();

    useEffect(() => {
        if (!currentUser) {
            router.push('/');
            return;
        }

        const fetchUserAndPosts = async () => {
            try {
                // Fetch User Details
                const userData = await apiGetUserById(currentUser.id);
                if (userData) {
                    setUser(userData);
                    // Fetch Posts (Assuming API for user posts exists)
                    // Substitua 'apiGetUserPosts' pela sua função real se for diferente
                    const userPosts = userData.posts || []; // Exemplo simples
                    setPosts(userPosts.reverse()); 
                }
            } catch (error) {
                console.error("Erro ao carregar perfil:", error);
                router.push('/'); 
            } finally {
                setLoading(false);
            }
        };

        fetchUserAndPosts();
    }, [currentUser?.id, router]);

    const handleUpdate = async (updatedData, fotoFile) => {
        try {
            let urlFotoPerfil = updatedData.urlFotoPerfil;
            if (fotoFile) {
                const uploadResult = await apiUploadImage(fotoFile);
                if (uploadResult?.url) {
                    urlFotoPerfil = uploadResult.url;
                }
            }

            const finalUpdate = { ...updatedData, urlFotoPerfil };
            await apiUpdateUser(currentUser.id, finalUpdate);
            setUser(prev => ({ ...prev, ...finalUpdate }));
            setIsEditing(false);
        } catch (error) {
            console.error("Erro ao atualizar perfil:", error);
            alert("Erro ao salvar o perfil."); 
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center dark:bg-black text-gray-500">Carregando perfil...</div>;
    }

    if (!user) {
        return <div className="min-h-screen flex items-center justify-center dark:bg-black text-red-500">Perfil não encontrado.</div>;
    }

    return (
        <div className="min-h-screen dark:bg-black text-black dark:text-white pb-10">
            <div className="max-w-4xl mx-auto px-4">
                <button onClick={() => router.push('/')} className="mt-4 mb-6 text-gray-500 hover:text-pink-600 flex items-center gap-2">
                    ← Voltar para Home
                </button>

                {/* Seção de Perfil */}
                <div className="bg-white dark:bg-gray-900 shadow-xl rounded-xl p-6 mb-8 border border-gray-100 dark:border-gray-800">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-pink-500 flex-shrink-0">
                            {user.urlFotoPerfil ? (
                                <img src={user.urlFotoPerfil} alt={user.nome} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-3xl font-bold text-gray-500">
                                    {user.nome?.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>

                        <div className="flex-grow text-center sm:text-left mt-4 sm:mt-0">
                            <h2 className="text-3xl font-extrabold text-pink-600">{user.nome}</h2>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">{user.email}</p>
                            
                            {(user.isManicure || user.especialidade) && (
                                <div className="mt-2 flex justify-center sm:justify-start items-center gap-2">
                                    <span className="text-sm font-bold bg-pink-100 text-pink-700 px-3 py-1 rounded-full">
                                        Manicure {user.especialidade ? `(${user.especialidade})` : ''}
                                    </span>
                                </div>
                            )}

                            <p className="mt-4 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{user.bio || "Adicione uma biografia para se apresentar!"}</p>
                            
                            <button onClick={() => setIsEditing(true)} className="mt-4 bg-pink-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-pink-700 transition">
                                Editar Perfil
                            </button>
                        </div>
                    </div>
                </div>

                {/* Seção de Posts */}
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 border-b pb-2 border-pink-500">Minhas Publicações ({posts.length})</h3>
                
                <div className="space-y-8">
                    {posts.length > 0 ? (
                        posts.map(post => (
                            <Post key={post.idPost} post={post} user={user} isOwner={true} />
                        ))
                    ) : (
                        <div className="text-center py-10 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                            <p className="text-gray-500">Você ainda não tem publicações. Crie uma para mostrar seu trabalho!</p>
                        </div>
                    )}
                </div>
            </div>

            {isEditing && (
                <EditarPerfilModal 
                    user={user}
                    onClose={() => setIsEditing(false)}
                    onSave={handleUpdate}
                />
            )}
        </div>
    );
}