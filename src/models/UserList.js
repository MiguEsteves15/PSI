const mongoose = require('mongoose');

const userListSchema = new mongoose.Schema(
  {
    utilizador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    nome: {
      type: String,
      required: true,
      trim: true
    },
    cancoes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song'
      }
    ],
    albuns: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Album'
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('UserList', userListSchema);