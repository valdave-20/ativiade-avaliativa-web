import React from "react";

function Teacher() {
  return (
    <div>
      <h2>Área do Professor</h2>

      <section>
        <h3>Gerenciar Matérias</h3>
        <form>
          <input placeholder="Nome da matéria" />
          <button type="button">Criar</button>
        </form>
        <ul>
          <li>
            Matemática — <button>Excluir</button>
          </li>
        </ul>
      </section>

      <section>
        <h3>Atividades Enviadas / Recebidas</h3>
        <p>Aqui você verá as atividades com prazo de entrega e respostas dos alunos.</p>
      </section>
    </div>
  );
}

export default Teacher;
