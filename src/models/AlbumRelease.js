//bersão fisica do album

const mongoose = require('mongoose');

const albumReleaseSchema = new mongoose.Schema(
  {
    ean13: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /^\d{13}$/
    },
    album: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Album',
      required: true
    },
    suporteFisico: {
      type: String,
      enum: ['CD', 'vinil', 'cassete'],
      required: true
    },
    versao: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('AlbumRelease', albumReleaseSchema);