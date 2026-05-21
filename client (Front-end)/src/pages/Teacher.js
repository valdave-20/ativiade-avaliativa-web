import React, { useState, useEffect } from "react";
import { api } from "./apiClient";

function Teacher() {
  const [subjects, setSubjects] = useState([]);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const data = await api.subjects.list();
      setSubjects(Array.isArray(data) ? data : data.subjects || []);
    } catch (err) {
      setError("Erro ao carregar matérias: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    if (!newSubjectName.trim()) {
      setError("Digite o nome da matéria");
      return;
    }

    try {
      setCreating(true);
      setError("");
      setSuccess("");
      await api.subjects.create(newSubjectName);
      setSuccess("Matéria criada com sucesso!");
      setNewSubjectName("");
      await fetchSubjects();
    } catch (err) {
      setError("Erro ao criar matéria: " + err.message);
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteSubject = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta matéria?")) return;

    try {
      setError("");
      setSuccess("");
      await api.subjects.delete(id);
      setSuccess("Matéria excluída com sucesso!");
      await fetchSubjects();
    } catch (err) {
      setError("Erro ao excluir matéria: " + err.message);
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Área do Professor</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <section>
        <h3>Gerenciar Matérias</h3>
        <form onSubmit={handleCreateSubject}>
          <input
            placeholder="Nome da matéria"
            value={newSubjectName}
            onChange={(e) => setNewSubjectName(e.target.value)}
            disabled={creating}
            required
          />
          <button type="submit" disabled={creating}>
            {creating ? "Criando..." : "Criar"}
          </button>
        </form>
        {loading ? (
          <p>Carregando matérias...</p>
        ) : subjects.length > 0 ? (
          <ul>
            {subjects.map((subject) => (
              <li key={subject.id}>
                {subject.name} —
                <button onClick={() => handleDeleteSubject(subject.id)}>
                  Excluir
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhuma matéria criada ainda.</p>
        )}
      </section>

      <section>
        <h3>Atividades Enviadas / Recebidas</h3>
        <p>Aqui você verá as atividades com prazo de entrega e respostas dos alunos.</p>
      </section>
    </div>
  );
}

export default Teacher;