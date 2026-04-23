const mongoose = require('mongoose');

async function connectDatabase() {
  const mongoUri = process.env.DB_URI || 'mongodb://127.0.0.1:27017/psi';

  await mongoose.connect(mongoUri);
  console.log('Ligado ao MongoDB');
}

module.exports = { connectDatabase };