const user = JSON.parse(localStorage.getItem('user'));

// ✅ CORREÇÃO 1: Voltar duas pastas (sai de 'professor', sai de 'telas') para achar o login
if (!user || user.role !== 'teacher') window.location.href = '../../login/login.html';
document.getElementById('userName').innerText = `Painel do Prof. ${user.name}`;

function logout() {
    localStorage.removeItem('user');
    window.location.href = '../../login/login.html';
}

async function loadSubjects() {
    // ✅ CORREÇÃO 2: URL completa do servidor
    const res = await fetch('http://localhost:3000/api/subjects');
    const subjects = await res.json();
    const select = document.getElementById('subSelect');
    select.innerHTML = '<option value="">Selecione a Matéria</option>';
    
    subjects.forEach(sub => {
        const opt = document.createElement('option');
        opt.value = sub.id;
        opt.innerText = sub.name;
        select.appendChild(opt);
    });
}

document.getElementById('subjectForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('subName').value;
    const description = document.getElementById('subDesc').value;

    // ✅ CORREÇÃO 3: URL completa do servidor
    await fetch('http://localhost:3000/api/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, teacher_id: user.id })
    });
    
    alert('Matéria criada com sucesso!');
    document.getElementById('subjectForm').reset(); // Limpa os campos após salvar
    loadSubjects(); // Recarrega a lista para a nova matéria aparecer no Select
});

document.getElementById('activityForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const subject_id = document.getElementById('subSelect').value;
    const title = document.getElementById('actTitle').value;
    const description = document.getElementById('actDesc').value;
    const due_date = document.getElementById('actDate').value;

    // ✅ CORREÇÃO 4: URL completa do servidor
    await fetch('http://localhost:3000/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject_id, title, description, due_date })
    });
    
    alert('Atividade postada com sucesso!');
    document.getElementById('activityForm').reset(); // Limpa os campos após salvar
});

// Carrega as matérias ao abrir a página
loadSubjects();