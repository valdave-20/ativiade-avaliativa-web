const express = require('express');
const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios' });
  }

  try {
    const [rows] = await pool.execute(
      'SELECT id, name, email, password, role FROM users WHERE email = ? LIMIT 1',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const user = rows[0];
    
    // Verifica se a senha é compatível (suporta texto simples para os dados de exemplo, mas prefere hash)
    let isMatch = false;
    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
        isMatch = await bcrypt.compare(password, user.password);
    } else {
        // Fallback para os dados de exemplo em texto simples
        isMatch = (password === user.password);
    }

    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    delete user.password;
    return res.json({ user });
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

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await pool.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
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
