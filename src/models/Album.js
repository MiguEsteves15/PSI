//versão digital do album

const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema(
  {
    numeroFaixa: {
      type: Number,
      required: true,
      min: 1
    },
    cancao: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Song',
      required: true
    }
  },
  { _id: false }
);

function isSequentialTrackList(tracks) {
  if (!Array.isArray(tracks) || tracks.length === 0) {
    return false;
  }

  const trackNumbers = tracks.map((track) => track.numeroFaixa).sort((a, b) => a - b);

  for (let index = 0; index < trackNumbers.length; index += 1) {
    if (trackNumbers[index] !== index + 1) {
      return false;
    }
  }

  return true;
}

const albumSchema = new mongoose.Schema(
  {
    mbid: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
    },
    titulo: {
      type: String,
      required: true,
      trim: true
    },
    imagemCapa: {
      type: String,
      trim: true,
      default: ''
    },
    anoLancamento: {
      type: Number,
      required: true,
      max: new Date().getFullYear()
    },
    tipo: {
      type: String,
      enum: ['single', 'EP', 'LP'],
      required: true
    },
    artista: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artist',
      default: null
    },
    faixas: {
      type: [trackSchema],
      validate: {
        validator: isSequentialTrackList,
        message: 'As faixas do álbum devem ser sequenciais (1, 2, 3, ...)'
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Album', albumSchema);