const express = require('express');
const pool = require('../config/db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM subjects ORDER BY name');
    return res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar matérias:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

router.post('/', async (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Nome da matéria é obrigatório' });
  }

  try {
    await pool.execute('INSERT INTO subjects (name, description) VALUES (?, ?)', [name, description || null]);
    return res.status(201).json({ message: 'Matéria criada com sucesso' });
  } catch (error) {
    console.error('Erro ao criar matéria:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.execute('SELECT * FROM subjects WHERE id = ? LIMIT 1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Matéria não encontrada' });
    }
    return res.json(rows[0]);
  } catch (error) {
    console.error('Erro ao buscar matéria:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router;
