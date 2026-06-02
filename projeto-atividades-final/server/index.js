const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();

app.use(cors()); // Libera o acesso para o seu Front-end
app.use(express.json());


const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '221093',
    database: process.env.DB_NAME || 'atividadedb',
    waitForConnections: true,
    connectionLimit: 10
});

pool.getConnection()
    .then(() => console.log('✅ Banco de dados conectado com sucesso!'))
    .catch((err) => console.error('❌ Erro no Banco:', err.message));


// Listar todas as matérias (Para Professor e Aluno)
app.get('/api/subjects', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM subjects');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Criar uma nova matéria (Para Professor)
app.post('/api/subjects', async (req, res) => {
    const { name, description, teacher_id } = req.body;
    try {
        await pool.execute(
            'INSERT INTO subjects (name, description, teacher_id) VALUES (?, ?, ?)',
            [name, description, teacher_id]
        );
        res.status(201).json({ message: 'Matéria criada com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Postar uma nova atividade (Para Professor)
app.post('/api/activities', async (req, res) => {
    const { subject_id, title, description, due_date } = req.body;
    try {
        await pool.execute(
            'INSERT INTO activities (subject_id, title, description, due_date) VALUES (?, ?, ?, ?)',
            [subject_id, title, description, due_date]
        );
        res.status(201).json({ message: 'Atividade criada com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// rota_relatorios.js (ou no seu arquivo principal do Express)

app.get('/api/professor/exportar-notas', async (req, res) => {
    try {
        // 1. Aqui você faria o SELECT no seu banco de dados
        // Exemplo fictício de retorno do banco:
        const dadosAlunos = [
            { nome: "Ana Costa", atividade: "Normalização de Dados", nota: 9.5 },
            { nome: "Bruno Silva", atividade: "Normalização de Dados", nota: 7.0 },
            { nome: "Carlos Mendes", atividade: "Normalização de Dados", nota: 10.0 }
        ];

        // 2. Criar a primeira linha com o cabeçalho das colunas
        let csv = 'Nome do Aluno,Atividade,Nota\n';

        // 3. Iterar sobre os dados e preencher as linhas
        dadosAlunos.forEach(registro => {
            // Dica: Se houver vírgulas nos nomes, envolva a variável em aspas: `"${registro.nome}"`
            csv += `${registro.nome},${registro.atividade},${registro.nota}\n`;
        });

        // 4. Configurar os Headers Mágicos que forçam o download no navegador
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename="relatorio_turma.csv"');

        // 5. Enviar o conteúdo gerado
        res.status(200).send(csv);

    } catch (erro) {
        console.error("Erro ao gerar relatório:", erro);
        res.status(500).json({ erro: "Falha ao gerar o arquivo de exportação." });
    }
});

// Listar atividades de uma matéria (Para Aluno)
app.get('/api/activities/subject/:id', async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM activities WHERE subject_id = ?', 
            [req.params.id]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


const adminRoutes = require('./routes/admin')(pool);
app.use('/api/auth', adminRoutes);


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
}); 