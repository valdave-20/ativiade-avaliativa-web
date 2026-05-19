Resumo do que foi criado

- Front-end (React): páginas em `client (Front-end)/src/pages/`:
  - `Login.js`, `Student.js`, `Teacher.js`

- Back-end (Express): rotas em `server (Back-end)/routes/` e conexão em `server (Back-end)/config/db.js`:
  - `auth.js`, `subjects.js`, `activities.js`, `config/db.js`

- Banco de dados: esquema SQL em `database/schema.sql` (MySQL)

Passos para rodar localmente

1) Configurar MySQL no seu notebook
- Crie um banco ou use o script `database/schema.sql` para criar o schema e tabelas.
- Ajuste variáveis de ambiente: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`.

2) Back-end
- Entre na pasta `server (Back-end)` e instale dependências:

```
cd "server (Back-end)"
npm install express mysql2 dotenv
```

- No `app.js` do back-end, registre as rotas (exemplo):

```
const express = require('express');
const app = express();
app.use(express.json());

const auth = require('./routes/auth');
const subjects = require('./routes/subjects');
const activities = require('./routes/activities');

app.use('/auth', auth);
app.use('/subjects', subjects);
app.use('/activities', activities);

app.listen(3001, () => console.log('API rodando na porta 3001'));
```

3) Front-end
- Entre na pasta `client (Front-end)` e instale dependências:

```
cd "client (Front-end)"
npm install react-router-dom
npm start
```

Observações
- As rotas e componentes criados são scaffolds iniciais; implemente autenticação segura (hash de senhas) e validações antes de usar em produção.
- Posso integrar `App.js` com as rotas se você autorizar a alteração do arquivo `client (Front-end)/src/App.js`.
