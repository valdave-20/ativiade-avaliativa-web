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
    
    // ✅ CORREÇÃO 2: Adicionado o endereço completo com o ID dinâmico no final
    const res = await fetch(`http://localhost:3000/api/activities/subject/${id}`);
    const activities = await res.json();
    const container = document.getElementById('activitiesList');
    container.innerHTML = '';

    if (activities.length === 0) {
        container.innerHTML = '<p>Nenhuma atividade para esta matéria.</p>';
        return;
    }

    activities.forEach(act => {
        const div = document.createElement('div');
        div.className = 'list-item';
        div.innerHTML = `
            <div>
                <strong>${act.title}</strong><br>
                <small>${act.description || ''}</small>
            </div>
            <button onclick="alert('Funcionalidade de resposta em breve!')">Responder</button>
        `;
        container.appendChild(div);
    });
}

// Inicia a busca de matérias assim que a página carrega
loadSubjects();