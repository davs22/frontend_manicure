// Se tiver variável de ambiente, usa ela. Se não, usa localhost.
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// --- CONFIGURAÇÃO, TOKENS E USUÁRIO ---

export function getToken() {
  if (typeof window !== "undefined") return localStorage.getItem("token");
  return null;
}

export function setToken(token) {
  if (typeof window !== "undefined") localStorage.setItem("token", token);
}

export function getCurrentUser() {
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem("currentUser");
    return userStr ? JSON.parse(userStr) : null;
  }
  return null;
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    window.location.href = "/"; 
  }
}

export async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = { ...(options.headers || {}) };

  if (options.body) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  try {
    const res = await fetch(`${API_URL}${path}`, { ...options, headers });
    
    if (res.status === 401) { logout(); return; }
    
    // Se der erro (tipo 400 ou 500), lemos a mensagem do backend
    if (!res.ok) {
      const text = await res.text();
      // Se for erro 400 de "Já seguindo", podemos ignorar ou alertar
      throw new Error(text || `Erro ${res.status}: ${res.statusText}`);
    }

    // ✅ CORREÇÃO AQUI:
    // Se for 204 (No Content) ou 201 (Created sem corpo), retornamos null sem tentar ler JSON
    if (res.status === 204 || res.status === 201) return null; 
    
    // Tenta ler JSON apenas se houver conteúdo
    const text = await res.text();
    return text ? JSON.parse(text) : null;

  } catch (error) {
    console.error(`Erro na requisição ${path}:`, error);
    throw error;
  }
}

// --- AUTENTICAÇÃO ---

export async function apiRegister(userData) {
  return apiFetch("/auth/register", { method: "POST", body: JSON.stringify(userData) });
}


export async function apiLogin({ email, senha }) {
  const data = await apiFetch("/auth/login", { method: "POST", body: JSON.stringify({ email, senha }) });
  
  // 🔴 CORREÇÃO: Verificamos se 'data' existe antes de tentar ler '.token'
  if (data && data.token) {
      setToken(data.token);
  }
  
  if (data && data.usuario) {
      localStorage.setItem("currentUser", JSON.stringify(data.usuario));
  }
  
  return data;
}

// --- USUÁRIOS ---

export async function apiGetAllUsers() { return apiFetch("/usuarios"); }
export async function apiGetManicures() { return apiFetch("/usuarios/manicures"); }
export async function apiGetUserById(id) { return apiFetch(`/usuarios/${id}`); }
export async function apiUpdateUser(id, userData) {
    return apiFetch(`/usuarios/${id}`, { method: "PUT", body: JSON.stringify(userData) });
}
export async function apiSearchUsers(nome) { return apiFetch(`/usuarios/nome?nome=${nome}`); }

// --- AGENDAMENTO ---

export async function apiCreateAgendamento(data) { return apiFetch("/agendamentos", { method: "POST", body: JSON.stringify(data) }); }
export async function apiGetAgendamento() { return apiFetch("/agendamentos/meus"); }
export async function apiDeleteAgendamento(id) { return apiFetch(`/agendamentos/${id}`, { method: "DELETE" }); }
export async function apiGetAgendaManicure() { return apiFetch("/agendamentos/minha-agenda"); }

// --- POSTS ---

export async function apiGetPosts() { return apiFetch("/posts"); }
export async function apiCreatePost(data) { return apiFetch("/posts", { method: "POST", body: JSON.stringify(data) }); }
export async function apiGetMyPosts() { return apiFetch("/posts/my"); }
export async function apiDeletePost(id) { return apiFetch(`/posts/${id}`, { method: "DELETE" }); }

// --- INTERAÇÕES (CURTIDAS E COMENTÁRIOS) - ADICIONADO AGORA ---

export async function apiLikePost(postId) {
    return apiFetch(`/posts/${postId}/like`, { method: "POST" });
}

export async function apiCommentPost(postId, texto) {
    return apiFetch(`/posts/${postId}/comments`, {
        method: "POST",
        body: JSON.stringify({ texto })
    });
}

export async function apiGetComments(postId) {
    return apiFetch(`/posts/${postId}/comments`);
}

// --- SEGUIR ---

export async function apiFollowUser(userId) { return apiFetch(`/api/follow`, { method: "POST", body: JSON.stringify({ seguidoId: userId }) }); }
export async function apiUnfollowUser(userId) { return apiFetch(`/api/follow`, { method: "DELETE", body: JSON.stringify({ seguidoId: userId }) }); }
export async function apiGetFollowStatus(userId) { return apiFetch(`/api/follow/status/${userId}`, { method: "GET" }); }/*
  Função de upload de imagem usada pela UI.
  Recebe:
    - file: File (do input type="file") ou Blob
    - campo (opcional): nome do campo de form-data (default: "file")
  Retorna o JSON do backend ou lança erro.
*/
export async function apiUploadImage(file, campo = "file") {
  if (!file) throw new Error("Nenhum arquivo fornecido para upload.");

  const token = getToken();
  const form = new FormData();
  // se 'file' for array ou FileList, usa o primeiro
  if (file instanceof FileList || Array.isArray(file)) {
    form.append(campo, file[0]);
  } else {
    form.append(campo, file);
  }

  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  // Não definir 'Content-Type' quando usar FormData — o browser define boundary automaticamente
  const res = await fetch(`${API_URL}/upload`, { method: "POST", body: form, headers });

  if (res.status === 401) { logout(); return; }

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || `Erro ${res.status}: ${res.statusText}`);
  }

  // se backend responder com 201/204 sem corpo
  if (res.status === 204 || res.status === 201) return null;

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}
