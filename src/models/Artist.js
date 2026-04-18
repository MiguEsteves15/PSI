const mongoose = require('mongoose');

const currentYear = new Date().getFullYear();

const artistSchema = new mongoose.Schema(
  {
    isni: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /^\d{16}$/
    },
    nome: {
      type: String,
      required: true,
      trim: true
    },
    anoInicioAtividade: {
      type: Number,
      required: true,
      max: currentYear
    },
    tipoArtista: {
      type: String,
      enum: ['solista', 'grupo'],
      required: true
    },
    membros: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist'
      }
    ]
  },
  {
    timestamps: true
  }
);

artistSchema.pre('validate', async function validateMembers(next) {
  try {
    if (this.tipoArtista === 'solista' && this.membros.length > 0) {
      return next(new Error('Um solista não pode ter membros'));
    }

    if (this.tipoArtista === 'grupo') {
      if (this.membros.length === 0) {
        return next(new Error('Um grupo deve ter membros'));
      }

      if (this._id && this.membros.some((memberId) => this._id.equals(memberId))) {
        return next(new Error('Um grupo não pode ser membro de si próprio'));
      }

      const groupMembersCount = await mongoose.model('Artist').countDocuments({
        _id: { $in: this.membros },
        tipoArtista: 'grupo'
      });

      if (groupMembersCount > 0) {
        return next(new Error('Um grupo não pode ter outros grupos como membros'));
      }
    }

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Artist', artistSchema);