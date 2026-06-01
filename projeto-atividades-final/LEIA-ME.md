# Projeto de Atividades - Guia de Instalação

Este projeto foi totalmente refeito para ser funcional, seguro e organizado.

## Estrutura de Pastas
- `/client`: Contém as páginas HTML, CSS e a lógica JavaScript (Front-end).
- `/server`: Contém o servidor Node.js e as rotas da API (Back-end).
- `/database`: Contém o arquivo `schema.sql` para configurar seu MySQL.

## Passo a Passo para Rodar

### 1. Banco de Dados
1. Abra seu **MySQL Workbench** ou terminal MySQL.
2. Execute o conteúdo do arquivo `database/schema.sql`. Isso criará o banco `atividadedb` e as tabelas necessárias.

### 2. Configuração do Servidor
1. Entre na pasta `server`.
2. Renomeie o arquivo `.env.example` para `.env`.
3. Abra o `.env` e coloque sua senha do MySQL em `DB_PASSWORD`.

### 3. Instalação
1. Abra o terminal na pasta `server`.
2. Digite o comando para instalar as bibliotecas:
   ```bash
   npm install
   ```

### 4. Execução
1. Ainda no terminal da pasta `server`, digite:
   ```bash
   node index.js
   ```
2. Abra seu navegador e acesse: `http://localhost:3000`

## Contas de Teste
- **Admin:** `admin@teste.com` / Senha: `admin123` (Use esta conta para cadastrar outros)
- **Professor:** `professor@teste.com` / Senha: `senha123`
- **Aluno:** `aluno@teste.com` / Senha: `senha123`
