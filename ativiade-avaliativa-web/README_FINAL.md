# Projeto de Atividades - Finalizado

O projeto foi transformado de um site estático para uma aplicação funcional conectada ao MySQL.

## Alterações Realizadas:

1.  **Back-end (Node.js):**
    - Implementação de rotas para Autenticação, Matérias e Atividades.
    - Segurança de senhas usando `bcryptjs` (senhas agora são criptografadas).
    - Configuração de variáveis de ambiente via `.env`.
    - Servidor configurado para entregar o front-end automaticamente.

2.  **Front-end (HTML/JS):**
    - Adição de lógica JavaScript (Fetch API) em todas as páginas.
    - **Login:** Agora valida email/senha no banco de dados e salva a sessão no navegador.
    - **Área do Aluno:** Lista matérias e atividades dinamicamente do banco.
    - **Área do Professor:** Permite criar novas matérias e visualizá-las em tempo real.

3.  **Banco de Dados:**
    - Esquema SQL atualizado e corrigido.

## Como rodar o projeto:

1.  **Banco de Dados:**
    - Execute o script `database/schema.sql` no seu MySQL Workbench ou terminal.

2.  **Configuração:**
    - Entre na pasta `server (Back-end)`.
    - Crie um arquivo `.env` e preencha com seus dados:
      ```env
      DB_HOST=localhost
      DB_USER=seu_usuario
      DB_PASSWORD=sua_senha
      DB_NAME=atividadedb
      PORT=3001
      ```

3.  **Instalação e Execução:**
    - No terminal, dentro da pasta `server (Back-end)`, rode:
      ```bash
      npm install
      node app.js
      ```

4.  **Acesso:**
    - Abra o navegador em `http://localhost:3001`.

## Dados de Teste:
- **Aluno:** aluno@teste.com / senha123
- **Professor:** professor@teste.com / senha123
