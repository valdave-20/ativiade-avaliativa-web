const express = require('express');
const pool = require('../config/db');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios' });
  }

  try {
    const [rows] = await pool.execute(
      'SELECT id, name, email, role FROM users WHERE email = ? AND password = ? LIMIT 1',
      [email, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    return res.json({ user: rows[0] });
  } catch (error) {
    console.error('Erro de login:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }

  if (!['student', 'teacher'].includes(role)) {
    return res.status(400).json({ message: 'Role inválido' });
  }

  try {
    await pool.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, password, role]
    );

    return res.status(201).json({ message: 'Usuário criado com sucesso' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Email já cadastrado' });
    }
    console.error('Erro no registro:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router;
