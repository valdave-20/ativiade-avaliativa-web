
const user = JSON.parse(localStorage.getItem('user'));

console.log("Usuário logado:", user);

if (!user || (user.role !== 'teacher' && user.role !== 'admin')) { 
    alert("Acesso negado! Por favor, faça o login com uma conta autorizada.");
    window.location.href = '../login/login.html'; 
}

const API_URL = 'http://localhost:3000/api/auth';

function logout() {
    localStorage.removeItem('user');
    window.location.href = '../login/login.html';
}

function mudarAba(idAba, botaoClicado) {
    document.querySelectorAll('.opcao-card').forEach(btn => btn.classList.remove('ativa'));
    document.querySelectorAll('.secao-conteudo').forEach(sec => sec.classList.remove('ativa'));
    botaoClicado.classList.add('ativa');
    document.getElementById('sec-' + idAba).classList.add('ativa');
}

// ==========================================
// 2. LÓGICA DE USUÁRIOS
// ==========================================

async function loadUsers() {
    try {
        const res = await fetch(`${API_URL}/users`);
        const users = await res.json();
        
        const container = document.getElementById('usersList');
        container.innerHTML = ''; 
        
        users.forEach(u => {
            const div = document.createElement('div');
            div.className = 'list-item';
            
            const logadoId = user ? user.id : 0; 
            
            div.innerHTML = `
                <span><strong>[ID: ${u.id}] ${u.name}</strong> (${u.role}) - ${u.email}</span>
                <div class="actions-btn" style="display: inline-block;">
                    <button onclick="resetPassword(${u.id})" style="background-color: #f39c12; color: white; border: none; ">Alterar Senha</button>
                    ${u.id !== logadoId ? `<button onclick="deleteUser(${u.id})" style="background-color: #e74c3c; color: black; border: none;">Excluir</button>` : ''}
                </div>
            `;
            container.appendChild(div);
        });
    } catch (error) {
        console.error("Erro ao carregar lista:", error);
    }
}

async function resetPassword(id) {
    const newPassword = prompt('Digite a nova senha para este usuário:');
    if (!newPassword || newPassword.trim() === '') return;

    try {
        const res = await fetch(`${API_URL}/users/${id}/password`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ newPassword })
        });

        if (res.ok) {
            alert('Senha alterada com sucesso!');
        } else {
            const data = await res.json();
            alert('Erro ao alterar a senha: ' + data.error);
        }
    } catch (error) {
        alert('Erro ao conectar ao servidor.');
    }
}

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPass').value;
    const role = document.getElementById('regRole').value;

    try {
        const res = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role })
        });

        if (res.ok) {
            alert('Usuário cadastrado com sucesso!');
            document.getElementById('registerForm').reset();
            loadUsers(); 
        } else {
            alert('Erro ao cadastrar.');
        }
    } catch (error) {
        console.error("Erro no cadastro:", error);
    }
});

async function deleteUser(id) {
    if (confirm('Deseja excluir este usuário?')) {
        await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' });
        loadUsers();
    }
}

// ==========================================
// 3. LÓGICA DAS MATÉRIAS (SUBJECTS)
// ==========================================

async function loadSubjects() {
    try {
        const res = await fetch('http://localhost:3000/api/subjects');
        const subjects = await res.json();
        
        const container = document.getElementById('subjectsList');
        container.innerHTML = ''; 
        
        if (subjects.length === 0) {
            container.innerHTML = '<p>Nenhuma matéria cadastrada ainda.</p>';
            return;
        }

        subjects.forEach(s => {
            const div = document.createElement('div');
            div.className = 'list-item'; 
            div.innerHTML = `<span><strong>[ID: ${s.id}] ${s.name}</strong> - <small style="color: #666;">${s.description}</small></span>`;
            container.appendChild(div);
        });
    } catch (error) {
        document.getElementById('subjectsList').innerHTML = '<p style="color:red;">Erro ao carregar a lista.</p>';
    }
}

document.getElementById('form-subject').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('subjectName').value;
    const description = document.getElementById('subjectDesc').value;

    try {
        const res = await fetch('http://localhost:3000/api/subjects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, description })
        });

        if (res.ok) {
            alert('✅ Matéria cadastrada com sucesso!');
            document.getElementById('form-subject').reset();
            loadSubjects(); 
        } else {
            const data = await res.json();
            alert('❌ Erro: ' + (data.error || 'Não foi possível cadastrar.'));
        }
    } catch (error) {
        alert('❌ Erro de conexão com o servidor.');
    }
});

// ==========================================
// 4. LÓGICA DE AVISOS (ANNOUNCEMENTS)
// ==========================================

const formAviso = document.getElementById('form-aviso');
if(formAviso) {
    formAviso.addEventListener('submit', async function(e) {
        e.preventDefault(); 
        
        const mensagemRetorno = document.getElementById('mensagem-retorno');
        mensagemRetorno.innerText = 'Publicando...';
        mensagemRetorno.style.color = 'blue';

        const formData = new FormData(this);
        if (user && user.id) {
            formData.set('user_id', user.id);
        }

        try {
            const res = await fetch('http://localhost:3000/api/announcements', {
                method: 'POST',
                body: formData 
            });

            if (res.ok) {
                mensagemRetorno.innerText = '✅ Aviso publicado com sucesso!';
                mensagemRetorno.style.color = 'green';
                this.reset(); 
                setTimeout(() => { mensagemRetorno.innerText = ''; }, 4000);
            } else {
                const data = await res.json();
                mensagemRetorno.innerText = '❌ Erro: ' + (data.error || 'Não foi possível publicar.');
                mensagemRetorno.style.color = 'red';
            }
        } catch (error) {
            mensagemRetorno.innerText = '❌ Erro de conexão com o servidor.';
            mensagemRetorno.style.color = 'red';
        }
    });
}

// ==========================================
// 5. INICIA AS LISTAS AUTOMATICAMENTE
// ==========================================
loadUsers();
loadSubjects(); 