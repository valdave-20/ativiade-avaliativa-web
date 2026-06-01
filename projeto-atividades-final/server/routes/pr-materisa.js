const express = require('express');

module.exports = (pool) => {
    const router = express.Router();

    // Listar atividades de uma matéria
    router.get('/subject/:id', async (req, res) => {
        try {
            const [rows] = await pool.execute('SELECT * FROM activities WHERE subject_id = ?', [req.params.id]);
            res.json(rows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Criar atividade
    router.post('/', async (req, res) => {
        const { subject_id, title, description, due_date } = req.body;
        try {
            await pool.execute(
                'INSERT INTO activities (subject_id, title, description, due_date) VALUES (?, ?, ?, ?)',
                [subject_id, title, description, due_date]
            );
            res.status(201).json({ message: 'Atividade criada!' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    return router;
};
