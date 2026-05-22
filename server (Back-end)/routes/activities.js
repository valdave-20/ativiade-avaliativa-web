const express = require('express');
const pool = require('../config/db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT a.id, a.title, a.description, a.due_date, a.subject_id, a.teacher_id,
        s.name AS subject_name, u.name AS teacher_name
      FROM activities a
      JOIN subjects s ON a.subject_id = s.id
      JOIN users u ON a.teacher_id = u.id
      ORDER BY a.due_date DESC`
    );
    return res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar atividades:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

router.post('/', async (req, res) => {
  const { subject_id, teacher_id, title, description, due_date } = req.body;
  if (!subject_id || !teacher_id || !title) {
    return res.status(400).json({ message: 'subject_id, teacher_id e title são obrigatórios' });
  }

  try {
    await pool.execute(
      'INSERT INTO activities (subject_id, teacher_id, title, description, due_date) VALUES (?, ?, ?, ?, ?)',
      [subject_id, teacher_id, title, description || null, due_date || null]
    );
    return res.status(201).json({ message: 'Atividade criada com sucesso' });
  } catch (error) {
    console.error('Erro ao criar atividade:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.execute('SELECT * FROM activities WHERE id = ? LIMIT 1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Atividade não encontrada' });
    }
    return res.json(rows[0]);
  } catch (error) {
    console.error('Erro ao buscar atividade:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router;
