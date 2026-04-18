const mongoose = require('mongoose');

const songSchema = new mongoose.Schema(
  {
    isrc: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      match: /^[A-Z]{2}[A-Z0-9]{3}\d{7}$/
    },
    titulo: {
      type: String,
      required: true,
      trim: true
    },
    duracaoSegundos: {
      type: Number,
      required: true,
      min: 1
    },
    artistas: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist',
        required: true
      }
    ]
  },
  {
    timestamps: true
  }
);

songSchema.path('artistas').validate(function validateArtists(artists) {
  return Array.isArray(artists) && artists.length > 0;
}, 'Uma canção deve ter pelo menos um artista');

module.exports = mongoose.model('Song', songSchema);