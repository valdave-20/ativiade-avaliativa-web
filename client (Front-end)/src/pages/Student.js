import React, { useState, useEffect } from "react";
import { api } from "./apiClient";

function Student() {
  const [subjects, setSubjects] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSubjects();
    fetchActivities();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoadingSubjects(true);
      const data = await api.subjects.list();
      setSubjects(Array.isArray(data) ? data : data.subjects || []);
    } catch (err) {
      setError("Erro ao carregar matérias: " + err.message);
      console.error(err);
    } finally {
      setLoadingSubjects(false);
    }
  };

  const fetchActivities = async () => {
    try {
      setLoadingActivities(true);
      const data = await api.activities.list();
      setActivities(Array.isArray(data) ? data : data.activities || []);
    } catch (err) {
      setError("Erro ao carregar atividades: " + err.message);
      console.error(err);
    } finally {
      setLoadingActivities(false);
    }
  };

  return (
    <div>
      <h2>Área do Aluno</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <section>
        <h3>Minhas Matérias</h3>
        {loadingSubjects ? (
          <p>Carregando matérias...</p>
        ) : subjects.length > 0 ? (
          <ul>
            {subjects.map((subject) => (
              <li key={subject.id}>
                {subject.name} — <button onClick={() => fetchActivities()}>Ver atividades</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhuma matéria disponível.</p>
        )}
      </section>

      <section>
        <h3>Atividades Recebidas</h3>
        {loadingActivities ? (
          <p>Carregando atividades...</p>
        ) : activities.length > 0 ? (
          <ul>
            {activities.map((activity) => (
              <li key={activity.id}>
                <strong>{activity.title}</strong> - {activity.description}
                {activity.deadline && <p>Prazo: {new Date(activity.deadline).toLocaleDateString("pt-BR")}</p>}
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhuma atividade para responder.</p>
        )}
      </section>
    </div>
  );
}

export default Student;