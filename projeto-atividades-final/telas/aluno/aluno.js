const user = JSON.parse(localStorage.getItem('user'));
// O ideal aqui é garantir o caminho correto usando ../ como fizemos no login
if (!user || user.role !== 'student') window.location.href = '../../login/login.html';
document.getElementById('userName').innerText = `Olá, ${user.name}`;

function logout() {
    localStorage.removeItem('user');
    window.location.href = '../../login/login.html';
}

async function loadSubjects() {
    // ✅ CORREÇÃO 1: Adicionado o endereço completo do servidor Node.js
    const res = await fetch('http://localhost:3000/api/subjects');
    const subjects = await res.json();
    const container = document.getElementById('subjectsList');
    container.innerHTML = '';
    
    subjects.forEach(sub => {
        const div = document.createElement('div');
        div.className = 'list-item';
        div.innerHTML = `
            <span>${sub.name}</span>
            <button onclick="loadActivities(${sub.id}, '${sub.name}')">Ver Atividades</button>
        `;
        container.appendChild(div);
    });
}

async function loadActivities(id, name) {
    document.getElementById('activitiesArea').classList.remove('hidden');
    document.getElementById('currentSubjectTitle').innerText = `Atividades de ${name}`;
    
    const container = document.getElementById('activitiesList');
    container.innerHTML = '<p>Buscando atividades...</p>'; // Mensagem de carregamento

    try {
        const res = await fetch(`http://localhost:3000/api/activities/subject/${id}`);
        
        // 🚨 O nosso detector de erros!
        if (!res.ok) {
            const erroServer = await res.json();
            container.innerHTML = `<p style="color:red; font-weight:bold;">❌ Erro no banco: ${erroServer.error || 'Erro desconhecido'}</p>`;
            return;
        }

        const activities = await res.json();
        container.innerHTML = '';

        if (activities.length === 0) {
            container.innerHTML = '<p style="color: #666; font-style: italic;">Nenhuma atividade para esta matéria.</p>';
            return;
        }

        activities.forEach(act => {
            const div = document.createElement('div');
            div.className = 'list-item';
            div.style.flexDirection = 'column';
            div.style.alignItems = 'flex-start';
            div.style.gap = '10px';
            
            div.innerHTML = `
                <div style="width: 100%;">
                    <strong style="font-size: 18px; color: #2c3e50;">${act.title}</strong><br>
                    <p style="margin-top: 5px; color: #444;">${act.description || ''}</p>
                </div>
                
                <form onsubmit="enviarResposta(event, ${act.id})" style="width: 100%; background: #fff; padding: 15px; border-radius: 8px; border: 1px solid #ddd; margin-top: 10px;">
                    <label style="font-weight: bold; font-size: 14px;">Sua Resposta:</label>
                    <textarea id="resposta-${act.id}" rows="3" placeholder="Escreva sua resposta aqui..." required style="width: 100%; padding: 10px; margin-top: 5px; border: 1px solid #ccc; border-radius: 4px; resize: vertical;"></textarea>
                    
                    <label style="display: block; margin-top: 10px; font-weight: bold; font-size: 14px;">Anexar Arquivo (Opcional):</label>
                    <input type="file" id="arquivo-${act.id}" style="margin-top: 5px; margin-bottom: 10px; width: 100%;">
                    
                    <button type="submit" style="background-color: #27ae60; width: 100%; margin-top: 5px; color: white; border: none; padding: 10px; border-radius: 6px; cursor: pointer;">📤 Enviar Resposta</button>
                </form>
            `;
            container.appendChild(div);
        });
    } catch (error) {
        console.error("Erro ao carregar:", error);
        container.innerHTML = '<p style="color:red;">❌ O servidor Node.js parece estar desligado ou fora do ar.</p>';
    }
}
// ✅ Função Nova: Envia a resposta do aluno para o banco de dados
async function enviarResposta(event, activity_id) {
    event.preventDefault(); // Impede a página de recarregar

    const form = event.target;
    const btn = form.querySelector('button');
    btn.innerText = "Enviando, aguarde...";
    btn.disabled = true;

    // Pega o texto e o arquivo usando o ID dinâmico
    const answer = document.getElementById(`resposta-${activity_id}`).value;
    const fileInput = document.getElementById(`arquivo-${activity_id}`);
    
    // Cria o pacote de dados (FormData suporta arquivos e texto ao mesmo tempo)
    const formData = new FormData();
    formData.append('activity_id', activity_id);
    formData.append('student_id', user.id); // ID do aluno logado
    formData.append('answer', answer); // Bate com o nome da sua coluna no banco
    
    // Se o aluno escolheu um arquivo, adiciona ele no pacote
    if (fileInput.files[0]) {
        formData.append('file', fileInput.files[0]);
    }

    try {
        const res = await fetch('http://localhost:3000/api/submissions', {
            method: 'POST',
            body: formData 
        });

        if (res.ok) {
            alert('✅ Resposta enviada com sucesso para o professor!');
            form.reset(); // Limpa os campos depois de enviar
        } else {
            const data = await res.json();
            alert('❌ Erro ao enviar resposta: ' + (data.error || 'Erro no servidor'));
        }
    } catch (error) {
        console.error("Erro no envio:", error);
        alert('❌ Erro de conexão. Verifique se o servidor Node está rodando.');
    } finally {
        // Volta o botão ao normal independente se deu erro ou sucesso
        btn.innerText = "📤 Enviar Resposta";
        btn.disabled = false;
    }
}
async function loadAvisos() {
    try {
        const res = await fetch('http://localhost:3000/api/announcements');
        const avisos = await res.json();
        const container = document.getElementById('avisosList');
        container.innerHTML = '';

        if (avisos.length === 0) {
            container.innerHTML = '<p style="color: #666; font-style: italic;">Nenhum aviso no momento.</p>';
            return;
        }

        avisos.forEach(aviso => {
            const div = document.createElement('div');
            div.className = 'list-item';
            div.style.flexDirection = 'column';
            div.style.alignItems = 'flex-start';
            div.style.gap = '5px';
            div.innerHTML = `
                <strong style="font-size: 16px; color: #2c3e50;">📢 ${aviso.title}</strong>
                <p style="color: #444; margin: 0; margin-bottom: 25px;">${aviso.content}</p>
                <small style="color: #999;">${new Date(aviso.created_at).toLocaleDateString('pt-BR')}</small>
            `;
            container.appendChild(div);
        });
    } catch (error) {
        document.getElementById('avisosList').innerHTML = '<p style="color:red;">❌ Erro ao carregar avisos.</p>';
    }
}

// Inicia a busca de matérias assim que a página carrega
loadSubjects();
loadAvisos();