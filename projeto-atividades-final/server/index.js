const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const multer = require('multer'); // NOVO: Para lidar com upload de imagens
const path = require('path');     // NOVO: Para lidar com caminhos de pastas
require('dotenv').config();

const app = express();

app.use(cors()); // Libera o acesso para o seu Front-end
app.use(express.json());

// Permite o acesso público às imagens salvas na pasta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '221093', // Ajuste para a sua senha
    database: process.env.DB_NAME || 'atividadedb', // Nome do seu banco
    waitForConnections: true,
    connectionLimit: 10
});

pool.getConnection()
    .then(() => console.log('✅ Banco de dados conectado com sucesso!'))
    .catch((err) => console.error('❌ Erro no Banco:', err.message));

// ==========================================
// CONFIGURAÇÃO DO MULTER (UPLOAD DE IMAGENS)
// ==========================================
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Certifique-se de que a pasta uploads/ existe!
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// ==========================================
// ROTA ADICIONADA: BUSCAR USUÁRIOS
// ==========================================
// Necessária para o Professor ver a lista de Alunos
app.get('/api/auth/users', async (req, res) => {
    try {
        const [users] = await pool.execute('SELECT id, name, email, role FROM users');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// ROTAS DE AVISOS (ANNOUNCEMENTS)
// ==========================================
app.get('/api/announcements', async (req, res) => {
    try {
        const [avisos] = await pool.execute('SELECT * FROM announcements ORDER BY created_at DESC');
        res.json(avisos);
    } catch (error) {
        console.error("Erro ao buscar avisos:", error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/announcements', upload.single('image'), async (req, res) => {
    const { user_id, title, content } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        await pool.execute(
            'INSERT INTO announcements (user_id, title, content, image_url) VALUES (?, ?, ?, ?)',
            [user_id, title, content, image_url]
        );
        res.status(201).json({ message: 'Aviso publicado com sucesso!' });
    } catch (error) {
        console.error("Erro ao criar aviso:", error);
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// ROTAS DE ENTREGAS (SUBMISSIONS / CORREÇÕES)
// ==========================================
app.get('/api/submissions', async (req, res) => {
    try {
        const query = `
            SELECT s.id, s.answer, s.image_url, s.status, s.grade, s.feedback,
            a.title as activity_title, u.name as student_name
            FROM submissions s
            JOIN activities a ON s.activity_id = a.id
            JOIN users u ON s.student_id = u.id
            ORDER BY s.submitted_at DESC
        `;
        const [entregas] = await pool.execute(query);
        res.json(entregas);
    } catch (error) {
        console.error("Erro ao buscar entregas:", error);
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/submissions/:id/evaluate', async (req, res) => {
    const { id } = req.params;
    const { grade, feedback, status } = req.body;
    
    try {
        await pool.execute(
            'UPDATE submissions SET grade = ?, feedback = ?, status = ? WHERE id = ?',
            [grade, feedback, status, id]
        );
        res.json({ message: 'Avaliação salva com sucesso!' });
    } catch (error) {
        console.error("Erro ao avaliar:", error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/submissions', upload.single('file'), async (req, res) => {
    const activity_id = req.body.activity_id || null;
    const student_id = req.body.student_id || null;
    const answer = req.body.answer || null;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    if (!activity_id || !student_id) {
        return res.status(400).json({ error: "Faltando ID da atividade ou do aluno." });
    }

    try {
        await pool.execute(
            'INSERT INTO submissions (activity_id, student_id, answer, image_url) VALUES (?, ?, ?, ?)',
            [activity_id, student_id, answer, image_url]
        );
        res.status(201).json({ message: 'Resposta enviada com sucesso!' });
    } catch (error) {
        console.error("Erro ao enviar resposta:", error);
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// ROTAS EXISTENTES MANTIDAS
// ==========================================
app.get('/api/subjects', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM subjects ORDER BY name ASC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/subjects', async (req, res) => {
    const { name, description } = req.body;
    console.log("📥 Dados recebidos:", req.body); // ADICIONA ESSA LINHA
    try {
        await pool.execute(
            'INSERT INTO subjects (name, description) VALUES (?, ?)',
            [name, description]
        );
        res.status(201).json({ message: 'Matéria criada com sucesso!' });
    } catch (error) {
        console.error("❌ Erro ao criar matéria:", error.message); // ADICIONA ESSA LINHA
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/activities', async (req, res) => {
    const { subject_id, title, description } = req.body;
    const due_date = req.body.due_date || null;
    console.log("📥 Dados recebidos:", req.body); // ADICIONA ESSA LINHA
    try {
        await pool.execute(
            'INSERT INTO activities (subject_id, title, description, due_date) VALUES (?, ?, ?, ?)',
            [subject_id, title, description, due_date]
        );
        res.status(201).json({ message: 'Atividade criada com sucesso!' });
    } catch (error) {
        console.error("❌ Erro ao criar atividade:", error.message); // ADICIONA ESSA LINHA
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/professor/exportar-notas', async (req, res) => {
    try {
        const dadosAlunos = [
            { nome: "Ana Costa", atividade: "Normalização de Dados", nota: 9.5 },
            { nome: "Bruno Silva", atividade: "Normalização de Dados", nota: 7.0 },
            { nome: "Carlos Mendes", atividade: "Normalização de Dados", nota: 10.0 }
        ];

        let csv = 'Nome do Aluno,Atividade,Nota\n';

        dadosAlunos.forEach(registro => {
            csv += `${registro.nome},${registro.atividade},${registro.nota}\n`;
        });

        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename="relatorio_turma.csv"');
        res.status(200).send(csv);

    } catch (erro) {
        console.error("Erro ao gerar relatório:", erro);
        res.status(500).json({ erro: "Falha ao gerar o arquivo de exportação." });
    }
});

app.get('/api/activities/subject/:id', async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM activities WHERE subject_id = ? ORDER BY id DESC', 
            [req.params.id]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// A ROTA DE ADMIN QUE JÁ EXISTIA
const adminRoutes = require('./routes/admin')(pool);
app.use('/api/auth', adminRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});