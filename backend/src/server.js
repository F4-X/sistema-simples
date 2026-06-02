const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({ mensagem: 'API Sistema Simples rodando' }));
app.use('/auth', require('./routes/authRoutes'));
app.use('/receitas', require('./routes/receitaRoutes'));
app.use('/despesas', require('./routes/despesaRoutes'));
app.use('/resumo', require('./routes/resumoRoutes'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
