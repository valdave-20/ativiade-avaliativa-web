const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const subjectRoutes = require('./routes/subjects');
const activityRoutes = require('./routes/activities');

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Servir arquivos estáticos do front-end
app.use(express.static(path.join(__dirname, '..', 'client (Front-end)', 'public')));

// Rotas da API
app.use('/auth', authRoutes);
app.use('/subjects', subjectRoutes);
app.use('/activities', activityRoutes);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`API rodando na porta ${port}`);
});
