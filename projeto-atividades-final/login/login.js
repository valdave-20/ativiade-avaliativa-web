document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // ✅ Correção: URL completa com a porta 3000 do seu Back-end
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Vamos forçar a entrada na pasta "aluno"
            if (data.user.role === 'student') {
                window.location.assign('../telas/aluno/tela-aluno.html'); 
            } 
            else if (data.user.role === 'teacher') {
                window.location.assign('../telas/professor/tela-professor.html');
            } 
            else {
                window.location.assign('../admin/admin.html');
            }
        } else {
            alert('Erro: ' + data.message);
        }
        
    } catch (err) {
        alert('Erro ao conectar ao servidor. O seu Node.js está ligado?');
        console.error(err);
    }
});