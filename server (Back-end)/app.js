const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, '..', 'client (Front-end)', 'public')));
app.use('/auth', authRoutes);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`API rodando na porta ${port}`);
});
