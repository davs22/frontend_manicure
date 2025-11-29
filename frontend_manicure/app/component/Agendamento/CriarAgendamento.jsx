"use client";
import React, { useState, useEffect } from "react";
// Subindo 2 níveis para chegar em utils (component -> Agendamento -> app -> utils)
import { apiCreateAgendamento, apiGetAgendamento, apiDeleteAgendamento, apiGetManicures } from "../../utils/api";

export default function CriarAgendamento() {
  const [form, setForm] = useState({ manicureId: "", data: "", horario: "", descricao: "" });
  const [manicures, setManicures] = useState([]); 
  const [meusAgendamentos, setMeusAgendamentos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function carregarDados() {
      try {
        const lista = await apiGetManicures();
        setManicures(lista || []);

        const agendamentos = await apiGetAgendamento();
        setMeusAgendamentos(agendamentos || []);
      } catch (error) { console.error(error); }
    }
    carregarDados();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.manicureId) return alert("Selecione uma manicure!");
    setLoading(true);
    
    let dataFormatada = form.data;
    if (form.data.includes("-")) {
        const [ano, mes, dia] = form.data.split("-");
        dataFormatada = `${dia}/${mes}/${ano}`; 
    }

    const payload = {
        manicureId: Number(form.manicureId),
        descricao: form.descricao,
        data: dataFormatada, 
        hora: form.horario
    };

    try {
      await apiCreateAgendamento(payload);
      alert("Agendado com sucesso!");
      setForm({ manicureId: "", data: "", horario: "", descricao: "" });
      // Atualiza a lista
      const att = await apiGetAgendamento();
      setMeusAgendamentos(att || []);
    } catch (error) {
      alert("Erro: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Cancelar este agendamento?")) return;
    try {
      await apiDeleteAgendamento(id);
      setMeusAgendamentos(meusAgendamentos.filter(a => a.idAgendamento !== id));
    } catch (error) { alert("Erro ao cancelar."); }
  };

  const inputClass = "w-full p-3 bg-white text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none block";

  return (
    <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <div className="bg-pink-600 p-4 text-center">
        <h2 className="text-xl font-bold text-white">Novo Agendamento</h2>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Escolha a Profissional</label>
            <select name="manicureId" value={form.manicureId} onChange={handleChange} required className={inputClass}>
                <option value="">Selecione...</option>
                {manicures.map(m => (
                    <option key={m.idUsuario} value={m.idUsuario}>
                        {m.nome} {m.especialidade ? `(${m.especialidade})` : ''}
                    </option>
                ))}
            </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-bold text-gray-700 mb-1">Data</label><input type="date" name="data" value={form.data} onChange={handleChange} required className={inputClass} /></div>
            <div><label className="block text-sm font-bold text-gray-700 mb-1">Horário</label><input type="time" name="horario" value={form.horario} onChange={handleChange} required className={inputClass} /></div>
        </div>

        <div><label className="block text-sm font-bold text-gray-700 mb-1">Serviço</label><input type="text" name="descricao" value={form.descricao} onChange={handleChange} placeholder="Ex: Unha de Gel" required className={inputClass} /></div>

        <button type="submit" disabled={loading} className="w-full bg-pink-600 text-white font-bold py-3 rounded-lg hover:bg-pink-700 mt-2">{loading ? "Agendando..." : "Confirmar"}</button>
      </form>

      {/* --- LISTA DE AGENDAMENTOS (ATUALIZADA) --- */}
      <div className="bg-gray-50 p-6 border-t border-gray-200">
          <h3 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-wide">Meus Agendamentos</h3>
          
          {meusAgendamentos.length === 0 ? <p className="text-gray-400 text-center text-sm">Sem agendamentos.</p> : (
              <ul className="space-y-3">
                  {meusAgendamentos.map(a => (
                      <li key={a.idAgendamento} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex justify-between items-start">
                          <div>
                              <p className="font-bold text-pink-700 text-lg">{a.descricao}</p>
                              
                              {/* 💅 AQUI ESTÁ A MUDANÇA: Exibe o nome da Manicure */}
                              <p className="text-sm text-gray-800 font-medium mt-1">
                                💅 Com: {a.manicure ? a.manicure.nome : "Profissional"}
                              </p>

                              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                📅 {a.data} às {a.hora}
                              </p>
                          </div>
                          
                          <button onClick={() => handleDelete(a.idAgendamento)} className="text-xs text-red-500 font-bold border border-red-200 bg-red-50 px-3 py-1 rounded hover:bg-red-100 transition">
                            Cancelar
                          </button>
                      </li>
                  ))}
              </ul>
          )}
      </div>
    </div>
  );
}