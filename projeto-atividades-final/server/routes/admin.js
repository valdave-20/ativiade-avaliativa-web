const express = require('express');
const bcrypt = require('bcryptjs');

module.exports = (pool) => {
    const router = express.Router();

    // 1. Rota para LISTAR usuários
    router.get('/users', async (req, res) => {
        try {
            const [rows] = await pool.execute('SELECT id, name, email, role FROM users');
            res.json(rows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // 2. Rota para CADASTRAR usuário
    router.post('/register', async (req, res) => {
        const { name, email, password, role } = req.body;
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            await pool.execute(
                'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
                [name, email, hashedPassword, role]
            );
            res.status(201).json({ message: 'Usuário criado!' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // 3. ✅ ROTA DE LOGIN (Restaurada)
    router.post('/login', async (req, res) => {
        const { email, password } = req.body;
        try {
            const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
            if (rows.length === 0) return res.status(401).json({ message: 'Usuário não encontrado' });

            const user = rows[0];
            const isMatch = await bcrypt.compare(password, user.password);
            
            // Verifica a senha encriptada ou a senha limpa (caso você tenha criado usuários na mão no MySQL)
            if (!isMatch && password !== user.password) {
                return res.status(401).json({ message: 'Senha incorreta' });
            }

            delete user.password; // Remove a senha antes de devolver os dados para o Front-end
            res.json({ user });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // 4. Rota para REDEFINIR SENHA
    router.put('/users/:id/password', async (req, res) => {
        const { id } = req.params;
        const { newPassword } = req.body;
        try {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await pool.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);
            res.json({ message: 'Senha atualizada com sucesso!' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // 5. Rota para DELETAR usuário
    router.delete('/users/:id', async (req, res) => {
        try {
            await pool.execute('DELETE FROM users WHERE id = ?', [req.params.id]);
            res.json({ message: 'Usuário removido' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    return router;
};