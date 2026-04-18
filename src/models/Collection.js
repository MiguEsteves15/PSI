const mongoose = require('mongoose');

const collectionItemSchema = new mongoose.Schema(
  {
    versaoAlbum: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AlbumRelease',
      required: true
    },
    quantidade: {
      type: Number,
      min: 1,
      default: 1
    }
  },
  { _id: false }
);

const collectionSchema = new mongoose.Schema(
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
    itens: {
      type: [collectionItemSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Collection', collectionSchema);