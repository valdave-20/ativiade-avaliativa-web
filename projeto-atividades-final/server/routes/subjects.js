const express = require('express');

module.exports = (pool) => {
    const router = express.Router();

    // Listar matérias
    router.get('/', async (req, res) => {
        try {
            const [rows] = await pool.execute('SELECT * FROM subjects');
            res.json(rows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Criar matéria
    router.post('/', async (req, res) => {
        const { name, description, teacher_id } = req.body;
        try {
            await pool.execute(
                'INSERT INTO subjects (name, description, teacher_id) VALUES (?, ?, ?)',
                [name, description, teacher_id]
            );
            res.status(201).json({ message: 'Matéria criada!' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    return router;
};
