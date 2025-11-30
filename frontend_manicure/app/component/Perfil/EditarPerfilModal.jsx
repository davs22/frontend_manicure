'use client';
import React, { useState } from 'react';

export default function EditarPerfilModal({ user, onClose, onSave }) {
  const [name, setName] = useState(user?.name || '');
  const [photo, setPhoto] = useState(null);

  function handleSave(e) {
    e.preventDefault();
    const data = { name, photo };
    if (onSave) onSave(data);
    if (onClose) onClose();
  }

  return (
    <div className="editar-perfil-modal">
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-content">
        <h2>Editar Perfil</h2>
        <form onSubmit={handleSave}>
          <label>Nome
            <input value={name} onChange={e => setName(e.target.value)} />
          </label>
          <label>Foto
            <input type="file" onChange={e => setPhoto(e.target.files?.[0] || null)} />
          </label>
          <div style={{marginTop:10}}>
            <button type="button" onClick={onClose}>Cancelar</button>
            <button type="submit">Salvar</button>
          </div>
        </form>
      </div>
      <style jsx>{`
        .modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,0.4)}
        .modal-content{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);background:white;padding:20px;border-radius:8px;z-index:50}
      `}</style>
    </div>
  );
}
