import React from "react";

function Student() {
  return (
    <div>
      <h2>Área do Aluno</h2>

      <section>
        <h3>Minhas Matérias</h3>
        <ul>
          <li>
            Matemática — <button>Ver atividades</button>
          </li>
        </ul>
      </section>

      <section>
        <h3>Atividades Recebidas</h3>
        <p>Aqui aparecerão as atividades para responder.</p>
      </section>
    </div>
  );
}

export default Student;
