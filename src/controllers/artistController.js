const Artist = require('../models/Artist');
const Album = require('../models/Album');

exports.searchArtists = async (req, res) => {
  try {
    const query = (req.query.q || '').trim();

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'O termo de pesquisa e obrigatorio.'
      });
    }

    const artists = await Artist.find({
      nome: { $regex: query, $options: 'i' }
    })
      .sort({ nome: 1 })
      .limit(10)
      .select('_id nome isni');

    return res.status(200).json({
      success: true,
      data: artists
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor.'
    });
  }
};

exports.getArtistById = async (req, res) => {
  try {
    const { id } = req.params;

    const artist = await Artist.findById(id).select('_id isni nome anoInicioAtividade tipoArtista');

    if (!artist) {
      return res.status(404).json({
        success: false,
        message: 'Artista nao encontrado.'
      });
    }

    const albums = await Album.find({ artista: artist._id })
      .sort({ anoLancamento: -1, titulo: 1 })
      .select('_id titulo anoLancamento tipo imagemCapa artista')
      .populate('artista', 'nome');

    return res.status(200).json({
      success: true,
      data: {
        artist,
        recentAlbums: albums.slice(0, 5),
        totalAlbums: albums.length
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor.'
    });
  }
};

exports.getArtistAlbums = async (req, res) => {
  try {
    const { id } = req.params;

    const artist = await Artist.findById(id).select('_id nome');

    if (!artist) {
      return res.status(404).json({
        success: false,
        message: 'Artista nao encontrado.'
      });
    }

    const albums = await Album.find({ artista: artist._id })
      .sort({ anoLancamento: -1, titulo: 1 })
      .select('_id titulo anoLancamento tipo imagemCapa artista')
      .populate('artista', 'nome');

    return res.status(200).json({
      success: true,
      data: {
        artist,
        albums
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor.'
    });
  }
};
