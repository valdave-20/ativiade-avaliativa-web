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
// No seu arquivo JavaScript do front-end
document.getElementById('btn-exportar').addEventListener('click', async () => {
    const botao = document.getElementById('btn-exportar');
    botao.innerText = "Gerando...";
    botao.disabled = true;

    try {
        const resposta = await fetch('/api/professor/exportar-notas', {
            method: 'GET',
            // Adicione os headers de autorização (ex: Bearer token) se necessário
        });

        if (!resposta.ok) throw new Error("Erro na requisição");

        // 1. Transforma a resposta em um "Blob" (um objeto de arquivo bruto)
        const blob = await resposta.blob();
        
        // 2. Cria uma URL temporária na memória do navegador para esse arquivo
        const urlDownload = window.URL.createObjectURL(blob);
        
        // 3. Cria um link invisível e simula um clique do usuário nele
        const link = document.createElement('a');
        link.href = urlDownload;
        link.download = "relatorio_turma.csv"; // Nome sugerido para o salvamento
        document.body.appendChild(link);
        link.click();
        
        // 4. Limpa a sujeira do DOM e da memória
        link.remove();
        window.URL.revokeObjectURL(urlDownload);

    } catch (erro) {
        alert("Não foi possível gerar o relatório. Tente novamente.");
        console.error(erro);
    } finally {
        botao.innerText = "📥 Exportar Notas (CSV)";
        botao.disabled = false;
    }
});

// Carrega as matérias ao abrir a página
loadSubjects();