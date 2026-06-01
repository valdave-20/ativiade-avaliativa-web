const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();

app.use(cors()); // Libera o acesso para o seu Front-end
app.use(express.json());

// ==========================================
// 1. PRIMEIRO: CRIAR A CONEXÃO COM O BANCO (POOL)
// ==========================================
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


// ==========================================
// 2. SEGUNDO: AS ROTAS QUE USAM O BANCO
// ==========================================

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


// ==========================================
// 3. TERCEIRO: ROTAS DE ADMINISTRAÇÃO E LOGIN
// ==========================================
const adminRoutes = require('./routes/admin')(pool);
app.use('/api/auth', adminRoutes);


// ==========================================
// 4. QUARTO: LIGAR O SERVIDOR
// ==========================================
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
}); 