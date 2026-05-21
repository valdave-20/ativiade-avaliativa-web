# Integração Frontend com Servidor de Dados

## ✅ Conectado em: `localhost:3001`

### O que foi integrado:

#### 1. **Serviço de API** (`apiClient.js`)
Arquivo centralizado com todas as funções de comunicação com o servidor:
- `api.auth.login(email, password)` - Autenticação
- `api.subjects.list()` - Listar matérias
- `api.subjects.create(name)` - Criar matéria
- `api.subjects.delete(id)` - Deletar matéria
- `api.activities.list()` - Listar atividades
- `api.activities.create()` - Criar atividade
- `api.activities.delete()` - Deletar atividade

#### 2. **Página de Login** (`Login.js`)
- Formulário conectado ao servidor
- Envia email e senha para `POST /auth/login`
- Armazena token no `localStorage`
- Feedback de erro/sucesso

#### 3. **Página do Aluno** (`Student.js`)
- Lista matérias do servidor (GET `/subjects`)
- Lista atividades recebidas (GET `/activities`)
- Carregamento automático ao abrir a página
- Feedback de carregamento

#### 4. **Página do Professor** (`Teacher.js`)
- Lista matérias criadas (GET `/subjects`)
- Criar nova matéria (POST `/subjects`)
- Excluir matéria (DELETE `/subjects/{id}`)
- Confirmação antes de excluir

---

## 🚀 Como testar:

### Pré-requisitos:
1. Servidor rodando em `localhost:3001`
2. Endpoints esperados:
   ```
   POST /auth/login              → { token, ... }
   GET /subjects                 → [{ id, name }, ...]
   POST /subjects                → { id, name }
   DELETE /subjects/:id          → { success: true }
   GET /activities               → [{ id, title, description, deadline }, ...]
   POST /activities              → { id, ... }
   DELETE /activities/:id        → { success: true }
   ```

### 1. Instalar dependências do frontend:
```bash
cd "client (Front-end)"
npm install
npm start
```

O frontend abrirá em `http://localhost:3000`

### 2. Testar Login:
- Acesse a página de Login
- Digite email e senha válidos
- Se sucesso, o token é armazenado no `localStorage`

### 3. Testar Área do Aluno:
- Após fazer login (token deve estar salvo)
- Matérias e atividades devem carregar automaticamente

### 4. Testar Área do Professor:
- Crie uma nova matéria
- Veja a lista atualizar
- Teste excluir uma matéria

---

## 📝 Ajustes possíveis:

### Mudar URL do servidor:
Em `apiClient.js`, linha 1:
```javascript
const API_URL = "http://seu-servidor:porta";
```

### Adicionar CORS (se necessário):
Se o servidor está em outro domínio, adicione no backend:
```javascript
const cors = require('cors');
app.use(cors());
```

### Autenticação com Bearer Token:
Todos os endpoints autenticados enviam:
```
Authorization: Bearer {token}
```

---

## 🔧 Troubleshooting:

| Erro | Solução |
|------|----------|
| `Failed to fetch` | Verificar se servidor está rodando em `localhost:3001` |
| `CORS error` | Adicionar CORS no backend ou mudar `API_URL` |
| `401 Unauthorized` | Token expirado - fazer login novamente |
| `404 Not Found` | Endpoint não existe no servidor |

---

## 📦 Estrutura de arquivos:

```
client (Front-end)/src/
├── pages/
│   ├── apiClient.js    ← Serviço API
│   ├── Login.js        ← Integrado ✅
│   ├── Student.js      ← Integrado ✅
│   └── Teacher.js      ← Integrado ✅
```

---

**Última atualização**: Maio 2026
**Status**: ✅ Pronto para uso