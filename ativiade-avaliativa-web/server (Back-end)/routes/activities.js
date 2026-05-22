const express = require('express');
const pool = require('../config/db');
const router = express.Router();

// Listar atividades por matéria
router.get('/subject/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM activities WHERE subject_id = ?', [req.params.id]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar atividades' });
  }
});

// Criar nova atividade
router.post('/', async (req, res) => {
  const { subject_id, teacher_id, title, description, due_date } = req.body;
  try {
    await pool.execute(
      'INSERT INTO activities (subject_id, teacher_id, title, description, due_date) VALUES (?, ?, ?, ?, ?)',
      [subject_id, teacher_id, title, description, due_date]
    );
    res.status(201).json({ message: 'Atividade criada com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar atividade' });
  }
});

module.exports = router;
