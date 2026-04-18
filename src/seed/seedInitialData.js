require('dotenv').config();

const { connectDatabase } = require('../config/database');
const Artist = require('../models/Artist');
const Song = require('../models/Song');
const Album = require('../models/Album');
const AlbumRelease = require('../models/AlbumRelease');

async function seedInitialData() {
  const existingAM = await Album.findOne({ mbid: 'a5f4d3b2-6f19-4a1e-8a95-2a958f4d88a9' });
  if (existingAM) {
    console.log('Seed ignorado: o álbum AM já existe na base de dados');
    return;
  }

  const mac = await Artist.create({
    isni: '0000000359479901',
    nome: 'Mac Miller',
    anoInicioAtividade: 2007,
    tipoArtista: 'solista'
  });

  const kendrick = await Artist.create({
    isni: '0000000362907030',
    nome: 'Kendrick Lamar',
    anoInicioAtividade: 2004,
    tipoArtista: 'solista'
  });

  const sza = await Artist.create({
    isni: '0000000448022410',
    nome: 'SZA',
    anoInicioAtividade: 2011,
    tipoArtista: 'solista'
  });

  const drake = await Artist.create({
    isni: '0000000120322460',
    nome: 'Drake',
    anoInicioAtividade: 2001,
    tipoArtista: 'solista'
  });

  const eminem = await Artist.create({
    isni: '0000000117699370',
    nome: 'Eminem',
    anoInicioAtividade: 1996,
    tipoArtista: 'solista'
  });

  const alex = await Artist.create({
    isni: '0000000038860568',
    nome: 'Alex Turner',
    anoInicioAtividade: 2002,
    tipoArtista: 'solista'
  });

  const jamie = await Artist.create({
    isni: '0000000372831893',
    nome: 'Jamie Cook',
    anoInicioAtividade: 2002,
    tipoArtista: 'solista'
  });

  const nick = await Artist.create({
    isni: '0000000133675192',
    nome: "Nick O'Malley",
    anoInicioAtividade: 2002,
    tipoArtista: 'solista'
  });

  const matt = await Artist.create({
    isni: '0000000372801678',
    nome: 'Matt Helders',
    anoInicioAtividade: 2002,
    tipoArtista: 'solista'
  });

  const arcticMonkeys = await Artist.create({
    isni: '0000000122708500',
    nome: 'Arctic Monkeys',
    anoInicioAtividade: 2002,
    tipoArtista: 'grupo',
    membros: [alex._id, jamie._id, nick._id, matt._id]
  });

  const amTracks = [
    {
      isrc: 'GBUM71300001',
      titulo: 'Do I Wanna Know?',
      duracaoSegundos: 272
    },
    {
      isrc: 'GBUM71300002',
      titulo: 'R U Mine?',
      duracaoSegundos: 201
    },
    {
      isrc: 'GBUM71300003',
      titulo: 'One for the Road',
      duracaoSegundos: 206
    },
    {
      isrc: 'GBUM71300004',
      titulo: 'Arabella',
      duracaoSegundos: 207
    },
    {
      isrc: 'GBUM71300005',
      titulo: "I Want It All",
      duracaoSegundos: 184
    },
    {
      isrc: 'GBUM71300006',
      titulo: 'No.1 Party Anthem',
      duracaoSegundos: 244
    },
    {
      isrc: 'GBUM71300007',
      titulo: 'Mad Sounds',
      duracaoSegundos: 215
    },
    {
      isrc: 'GBUM71300008',
      titulo: 'Fireside',
      duracaoSegundos: 181
    },
    {
      isrc: 'GBUM71300009',
      titulo: 'Why\'d You Only Call Me When You\'re High?',
      duracaoSegundos: 161
    },
    {
      isrc: 'GBUM71300010',
      titulo: 'Snap Out of It',
      duracaoSegundos: 193
    },
    {
      isrc: 'GBUM71300011',
      titulo: 'Knee Socks',
      duracaoSegundos: 257
    },
    {
      isrc: 'GBUM71300012',
      titulo: 'I Wanna Be Yours',
      duracaoSegundos: 183
    }
  ];

  const songs = await Song.insertMany(
    amTracks.map((track) => ({
      ...track,
      artistas: [arcticMonkeys._id]
    }))
  );

  const albumAM = await Album.create({
    mbid: 'a5f4d3b2-6f19-4a1e-8a95-2a958f4d88a9',
    titulo: 'AM',
    anoLancamento: 2013,
    tipo: 'LP',
    artista: arcticMonkeys._id,
    faixas: songs.map((song, index) => ({
      numeroFaixa: index + 1,
      cancao: song._id
    }))
  });

  await AlbumRelease.insertMany([
    {
      ean13: '5609876543210',
      album: albumAM._id,
      suporteFisico: 'CD',
      versao: 'Edição standard'
    },
    {
      ean13: '5609876543211',
      album: albumAM._id,
      suporteFisico: 'vinil',
      versao: 'Vinil 180g'
    },
    {
      ean13: '5609876543212',
      album: albumAM._id,
      suporteFisico: 'cassete',
      versao: 'Edição limitada'
    }
  ]);

  console.log('Seed concluído: dados do álbum AM inseridos com sucesso');
}



async function main() {
  try {
    await connectDatabase();
    await seedInitialData();
    process.exit(0);
  } catch (error) {
    console.error('Falha ao executar seed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { seedInitialData };