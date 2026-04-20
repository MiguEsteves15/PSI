require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { connectDatabase } = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const PORT = process.env.PORT || 3000;
const app = express();

// Middlewares
app.use(morgan('tiny'));
app.use(cors());
app.use(helmet());
app.use(express.json());

// Rotas
app.use('/api/users', userRoutes);

// Ligar e arrancar
async function startServer() {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`Servidor da API a correr no porto ${PORT}`);
    });
  } catch (error) {
    console.error('Erro fatal ao arrancar o servidor:', error);
    process.exit(1);
  }
}

startServer();