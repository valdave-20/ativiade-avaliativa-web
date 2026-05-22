const express = require('express');
const pool = require('../config/db');
const router = express.Router();

// Listar todas as matérias
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM subjects');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar matérias' });
  }
});

// Criar nova matéria
router.post('/', async (req, res) => {
  const { name, description } = req.body;
  try {
    await pool.execute('INSERT INTO subjects (name, description) VALUES (?, ?)', [name, description]);
    res.status(201).json({ message: 'Matéria criada com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar matéria' });
  }
});

module.exports = router;
