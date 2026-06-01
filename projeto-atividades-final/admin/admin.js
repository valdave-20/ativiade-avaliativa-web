const API_URL = 'http://localhost:3000/api/auth';
const user = JSON.parse(localStorage.getItem('user'));

function logout() {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Busca e desenha a lista
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
            
            // ✅ Adicionado o botão "Alterar Senha" na linha do usuário
            div.innerHTML = `
                <span><strong>[ID: ${u.id}] ${u.name}</strong> (${u.role}) - ${u.email}</span>
                <div class="actions-btn" style="display: inline-block;">
                    <button onclick="resetPassword(${u.id})" style="background-color: #f39c12; color: white; margin-right: 5px;">Alterar Senha</button>
                    ${u.id !== logadoId ? `<button onclick="deleteUser(${u.id})" style="background-color: #e74c3c; color: white;">Excluir</button>` : ''}
                </div>
            `;
            container.appendChild(div);
        });
    } catch (error) {
        console.error("Erro ao carregar lista:", error);
    }
}

// ✅ NOVA FUNÇÃO: Abre a caixa de diálogo e envia a nova senha para a API
async function resetPassword(id) {
    const newPassword = prompt('Digite a nova senha para este usuário:');
    
    // Se o admin cancelar ou deixar em branco, interrompe a execução
    if (!newPassword || newPassword.trim() === '') return;

    try {
        const res = await fetch(`${API_URL}/users/${id}/password`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ newPassword })
        });

        if (res.ok) {
            alert('Senha alterada com sucesso! O usuário já pode logar com a nova senha.');
        } else {
            const data = await res.json();
            alert('Erro ao alterar a senha: ' + data.error);
        }
    } catch (error) {
        console.error("Erro na redefinição:", error);
        alert('Erro ao conectar ao servidor.');
    }
}

// Cadastra um novo usuário
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

// Deleta usuário
async function deleteUser(id) {
    if (confirm('Deseja excluir este usuário?')) {
        await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' });
        loadUsers();
    }
}

// Inicia automaticamente
loadUsers();