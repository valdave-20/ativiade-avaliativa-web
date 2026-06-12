// ==========================================
// 1. VERIFICAÇÃO DE SEGURANÇA E DADOS
// ==========================================
const user = JSON.parse(localStorage.getItem('user'));

// Voltar duas pastas (sai de 'professor', sai de 'telas') para achar o login
if (!user || user.role !== 'teacher') window.location.href = '../../login/login.html';

// Carrega as informações ao abrir a página
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('userName').innerText = `Prof. ${user.name}`;
    loadSubjects();
    loadAlunos();
    loadEntregas();
});

function logout() {
    localStorage.removeItem('user');
    window.location.href = '../../login/login.html';
}

// ==========================================
// 2. SISTEMA DE ABAS (TROCANDO DE TELA)
// ==========================================
function mudarAba(idAba, botaoClicado) {
    // Tira a classe 'ativa' de todos os botões e oculta as seções
    document.querySelectorAll('.opcao-card').forEach(btn => btn.classList.remove('ativa'));
    document.querySelectorAll('.secao-conteudo').forEach(sec => sec.classList.remove('ativa'));

    // Ativa só a aba que foi clicada
    botaoClicado.classList.add('ativa');
    document.getElementById('sec-' + idAba).classList.add('ativa');
}

// ==========================================
// 3. ABA: MATÉRIAS E ATIVIDADES
// ==========================================
async function loadSubjects() {
    try {
        const res = await fetch('http://localhost:3000/api/subjects');
        const subjects = await res.json();
        const select = document.getElementById('subSelect');
        
        if (!select) return; // Segurança extra caso o elemento não exista

        select.innerHTML = '<option value="">Selecione a Matéria</option>';
        
        subjects.forEach(sub => {
            const opt = document.createElement('option');
            opt.value = sub.id;
            opt.innerText = sub.name;
            select.appendChild(opt);
        });
    } catch (error) {
        console.error("Erro ao carregar matérias:", error);
    }
}

// Postar Nova Atividade
document.getElementById('activityForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const subject_id = document.getElementById('subSelect').value;
    const title = document.getElementById('actTitle').value;
    const description = document.getElementById('actDesc').value;
    const due_date = document.getElementById('actDate').value;

    try {
        await fetch('http://localhost:3000/api/activities', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subject_id, title, description, due_date })
        });
        
        alert('✅ Atividade postada com sucesso!');
        document.getElementById('activityForm').reset();
    } catch (error) {
        console.error("Erro ao postar atividade:", error);
        alert('❌ Erro de conexão ao postar atividade.');
    }
});

// ==========================================
// 4. ABA: LISTA DE ALUNOS
// ==========================================
async function loadAlunos() {
    try {
        const res = await fetch('http://localhost:3000/api/auth/users');
        const users = await res.json();
        
        const container = document.getElementById('alunosList');
        if (!container) return;

        container.innerHTML = '';
        
        // Filtra para mostrar apenas quem tem a role 'student'
        const alunos = users.filter(u => u.role === 'student');

        if(alunos.length === 0) {
            container.innerHTML = '<p>Nenhum aluno cadastrado no sistema.</p>';
            return;
        }

        alunos.forEach(aluno => {
            container.innerHTML += `
                <div class="item-linha">
                    <span><strong>${aluno.name}</strong> - <small>${aluno.email}</small></span>
                </div>
            `;
        });
    } catch (error) {
        console.error("Erro ao carregar alunos:", error);
    }
}

// ==========================================
// 5. ABA: AVISOS
// ==========================================
const formAviso = document.getElementById('form-aviso');
if (formAviso) {
    formAviso.addEventListener('submit', async function(e) {
        e.preventDefault(); 
        const msg = document.getElementById('msg-aviso');
        msg.innerText = "Enviando...";

        const formData = new FormData();
        formData.append('user_id', user.id);
        formData.append('title', document.getElementById('avisoTitle').value);
        formData.append('content', document.getElementById('avisoContent').value);

        try {
            const res = await fetch('http://localhost:3000/api/announcements', {
                method: 'POST',
                body: formData 
            });

            if (res.ok) {
                msg.innerText = '✅ Aviso enviado com sucesso!';
                msg.style.color = 'green';
                this.reset(); 
                setTimeout(() => { msg.innerText = ''; }, 3000);
            } else {
                msg.innerText = '❌ Erro ao enviar aviso.';
                msg.style.color = 'red';
            }
        } catch (error) {
            msg.innerText = '❌ Erro de conexão.';
            msg.style.color = 'red';
        }
    });
}

// ==========================================
// 6. ABA: EXPORTAR NOTAS (Seu código Blob)
// ==========================================
const btnExportar = document.getElementById('btn-exportar');
if (btnExportar) {
    btnExportar.addEventListener('click', async () => {
        const botao = document.getElementById('btn-exportar');
        botao.innerText = "Gerando...";
        botao.disabled = true;

        try {
            // URL completa adicionada aqui!
            const resposta = await fetch('http://localhost:3000/api/professor/exportar-notas', {
                method: 'GET',
            });

            if (!resposta.ok) throw new Error("Erro na requisição");

            const blob = await resposta.blob();
            const urlDownload = window.URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = urlDownload;
            link.download = "relatorio_turma.csv"; 
            document.body.appendChild(link);
            link.click();
            
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
}
// ==========================================
// 7. ABA: CORREÇÃO DE ATIVIDADES
// ==========================================
async function loadEntregas() {
    try {
        const res = await fetch('http://localhost:3000/api/submissions');
        
        // Se o servidor der erro 500, mostra a mensagem na tela do professor
        if (!res.ok) {
            const erroServer = await res.json();
            document.getElementById('entregasList').innerHTML = `<p style="color:red; padding: 15px; background: #fee;">❌ Erro no banco: ${erroServer.error}</p>`;
            return;
        }

        const entregas = await res.json();
        const container = document.getElementById('entregasList');

        if (!container) return;
        container.innerHTML = '';

        if (entregas.length === 0) {
            container.innerHTML = '<p style="color: #999; font-style: italic;">Nenhuma resposta enviada ainda.</p>';
            return;
        }

        // Desenha cada entrega do aluno
        entregas.forEach(e => {
            let corStatus = '#f39c12'; // Laranja para pendente
            let textoStatus = 'Pendente';
            
            if (e.status === 'graded') {
                corStatus = '#27ae60'; // Verde
                textoStatus = 'Corrigido';
            } else if (e.status === 'returned') {
                corStatus = '#e74c3c'; // Vermelho
                textoStatus = 'Refazer';
            }

            const anexoHtml = e.image_url 
                ? `<a href="http://localhost:3000${e.image_url}" target="_blank" style="color: #3498db; text-decoration: none; font-size: 13px; display: block; margin-bottom: 10px;">📎 Ver arquivo enviado</a>` 
                : '';

            container.innerHTML += `
                <div style="background: white; border: 1px solid #ddd; padding: 15px; border-radius: 8px; margin-bottom: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <strong style="color: #2c3e50; font-size: 16px;">🧑‍🎓 ${e.student_name}</strong>
                        <span style="background: ${corStatus}; color: white; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: bold;">${textoStatus}</span>
                    </div>
                    
                    <p style="font-size: 13px; color: #7f8c8d; margin-bottom: 5px;"><strong>Atividade:</strong> ${e.activity_title}</p>
                    
                    <div style="background: #f4f6f9; padding: 10px; border-radius: 6px; font-size: 14px; color: #34495e; margin-bottom: 10px;">
                        <em>"${e.answer || 'Nenhum texto. Apenas arquivo.'}"</em>
                    </div>
                    
                    ${anexoHtml}

                    <div style="border-top: 1px solid #eee; padding-top: 12px; display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
                        <input type="text" id="nota-${e.id}" placeholder="Nota (ex: 10)" value="${e.grade || ''}" style="width: 100px; padding: 8px;">
                        <input type="text" id="feed-${e.id}" placeholder="Seu feedback..." value="${e.feedback || ''}" style="flex: 1; padding: 8px;">
                        
                        <select id="status-${e.id}" style="padding: 8px; width: 130px;">
                            <option value="submitted" ${e.status === 'submitted' ? 'selected' : ''}>Pendente</option>
                            <option value="graded" ${e.status === 'graded' ? 'selected' : ''}>Corrigido</option>
                            <option value="returned" ${e.status === 'returned' ? 'selected' : ''}>Refazer</option>
                        </select>

                        <button onclick="avaliarEntrega(${e.id})" style="background: #3498db; color: white; border: none; padding: 9px 15px; border-radius: 6px; cursor: pointer; font-weight: bold;">Salvar</button>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error("Erro ao carregar entregas:", error);
    }
}

// Função chamada quando o professor clica em "Salvar"
async function avaliarEntrega(id) {
    const grade = document.getElementById(`nota-${id}`).value;
    const feedback = document.getElementById(`feed-${id}`).value;
    const status = document.getElementById(`status-${id}`).value;

    try {
        const res = await fetch(`http://localhost:3000/api/submissions/${id}/evaluate`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ grade, feedback, status })
        });

        if (res.ok) {
            alert('✅ Avaliação salva com sucesso!');
            loadEntregas(); // Recarrega a lista para atualizar a cor da etiqueta
        } else {
            alert('❌ Erro ao salvar avaliação.');
        }
    } catch (error) {
        alert('❌ Erro de conexão ao salvar.');
    }
}