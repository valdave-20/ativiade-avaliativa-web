const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.role !== 'teacher') window.location.href = 'login.html';
        document.getElementById('userName').innerText = `Painel do Prof. ${user.name}`;

        function logout() {
            localStorage.removeItem('user');
            window.location.href = 'login.html';
        }

        async function loadSubjects() {
            const res = await fetch('/api/subjects');
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

            await fetch('/api/subjects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description, teacher_id: user.id })
            });
            alert('Matéria criada!');
            loadSubjects();
        });

        document.getElementById('activityForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const subject_id = document.getElementById('subSelect').value;
            const title = document.getElementById('actTitle').value;
            const description = document.getElementById('actDesc').value;
            const due_date = document.getElementById('actDate').value;

            await fetch('/api/activities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subject_id, title, description, due_date })
            });
            alert('Atividade postada!');
        });

        loadSubjects();