const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();

app.use(cors()); // Libera o acesso para o seu Front-end
app.use(express.json());

// Conexão com o Banco de Dados
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

// Configuração da Rota Admin
const adminRoutes = require('./routes/admin')(pool);
app.use('/api/auth', adminRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});