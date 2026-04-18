const mongoose = require('mongoose');

function hasAtLeastThirteenYears(birthDate) {
  if (!(birthDate instanceof Date) || Number.isNaN(birthDate.getTime())) {
    return false;
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  const dayDifference = today.getDate() - birthDate.getDate();

  if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
    age -= 1;
  }

  return age >= 13;
}

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /^[A-Za-z0-9]+$/
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8
    },
    dataNascimento: {
      type: Date,
      required: true,
      validate: {
        validator: hasAtLeastThirteenYears,
        message: 'O utilizador deve ter pelo menos 13 anos'
      }
    },
    artistaFavorito: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artist',
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);