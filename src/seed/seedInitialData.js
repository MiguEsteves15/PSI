require('dotenv').config();

const { connectDatabase } = require('../config/database');
const Artist = require('../models/Artist');
const Song = require('../models/Song');
const Album = require('../models/Album');
const AlbumRelease = require('../models/AlbumRelease');

async function seedInitialData() {
  const existingAM = await Album.findOne({ mbid: 'a5f4d3b2-6f19-4a1e-8a95-2a958f4d88a9' });
  if (existingAM) {
    console.log('Seed ignorado: os 4 álbuns já foram inicializados na base de dados');
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

  const amSongs = await Song.insertMany(
    amTracks.map((track) => ({
      ...track,
      artistas: [arcticMonkeys._id]
    }))
  );

  const albumAM = await Album.create({
    mbid: 'a5f4d3b2-6f19-4a1e-8a95-2a958f4d88a9',
    titulo: 'AM',
    imagemCapa: 'images/albums/am.jpeg',
    anoLancamento: 2013,
    tipo: 'LP',
    artista: arcticMonkeys._id,
    faixas: amSongs.map((song, index) => ({
      numeroFaixa: index + 1,
      cancao: song._id
    }))
  });

  const swimmingTracks = [
    {
      isrc: 'USWB11801234',
      titulo: 'Come Back to Earth',
      duracaoSegundos: 161
    },
    {
      isrc: 'USWB11801235',
      titulo: 'Self Care',
      duracaoSegundos: 345
    },
    {
      isrc: 'USWB11801236',
      titulo: '2009',
      duracaoSegundos: 347
    },
    {
      isrc: 'USWB11801237',
      titulo: 'Hurt Feelings',
      duracaoSegundos: 245
    },
    {
      isrc: 'USWB11801238',
      titulo: 'What\'s the Use?',
      duracaoSegundos: 288
    },
    {
      isrc: 'USWB11801239',
      titulo: 'Perfecto',
      duracaoSegundos: 215
    },
    {
      isrc: 'USWB11801240',
      titulo: 'Small Worlds',
      duracaoSegundos: 272
    },
    {
      isrc: 'USWB11801241',
      titulo: 'Conversation Pt. 1',
      duracaoSegundos: 210
    },
    {
      isrc: 'USWB11801242',
      titulo: 'Dunno',
      duracaoSegundos: 236
    },
    {
      isrc: 'USWB11801243',
      titulo: 'Jet Fuel',
      duracaoSegundos: 346
    },
    {
      isrc: 'USWB11801244',
      titulo: 'Wings',
      duracaoSegundos: 250
    },
    {
      isrc: 'USWB11801245',
      titulo: 'Ladders',
      duracaoSegundos: 287
    },
    {
      isrc: 'USWB11801246',
      titulo: 'So It Goes',
      duracaoSegundos: 312
    }
  ];

  const swimmingSongs = await Song.insertMany(
    swimmingTracks.map((track) => ({
      ...track,
      artistas: [mac._id]
    }))
  );

  const albumSwimming = await Album.create({
    mbid: 'c8e7374f-b749-4f2b-9844-9f9ec5f1f5ce',
    titulo: 'Swimming',
    imagemCapa: 'images/albums/Swimming.png',
    anoLancamento: 2018,
    tipo: 'LP',
    artista: mac._id,
    faixas: swimmingSongs.map((song, index) => ({
      numeroFaixa: index + 1,
      cancao: song._id
    }))
  });

  const damnTracks = [
    {
      isrc: 'USUM71703860',
      titulo: 'BLOOD.',
      duracaoSegundos: 118
    },
    {
      isrc: 'USUM71703861',
      titulo: 'DNA.',
      duracaoSegundos: 185
    },
    {
      isrc: 'USUM71703862',
      titulo: 'HUMBLE.',
      duracaoSegundos: 177
    },
    {
      isrc: 'USUM71703863',
      titulo: 'LOVE.',
      duracaoSegundos: 213
    },
    {
      isrc: 'USUM71703864',
      titulo: 'YAH.',
      duracaoSegundos: 160
    },
    {
      isrc: 'USUM71703865',
      titulo: 'ELEMENT.',
      duracaoSegundos: 208
    },
    {
      isrc: 'USUM71703866',
      titulo: 'FEEL.',
      duracaoSegundos: 214
    },
    {
      isrc: 'USUM71703867',
      titulo: 'LOYALTY.',
      duracaoSegundos: 227
    },
    {
      isrc: 'USUM71703868',
      titulo: 'PRIDE.',
      duracaoSegundos: 275
    },
    {
      isrc: 'USUM71703869',
      titulo: 'LUST.',
      duracaoSegundos: 307
    },
    {
      isrc: 'USUM71703870',
      titulo: 'XXX.',
      duracaoSegundos: 255
    },
    {
      isrc: 'USUM71703871',
      titulo: 'FEAR.',
      duracaoSegundos: 460
    },
    {
      isrc: 'USUM71703872',
      titulo: 'GOD.',
      duracaoSegundos: 248
    },
    {
      isrc: 'USUM71703873',
      titulo: 'DUCKWORTH.',
      duracaoSegundos: 248
    }
  ];

  const damnSongs = await Song.insertMany(
    damnTracks.map((track) => ({
      ...track,
      artistas: [kendrick._id]
    }))
  );

  const albumDamn = await Album.create({
    mbid: 'f6fb6f57-80f9-456d-92f3-1a9ec31f3b5f',
    titulo: 'DAMN.',
    imagemCapa: 'images/albums/Damn.jpg',
    anoLancamento: 2017,
    tipo: 'LP',
    artista: kendrick._id,
    faixas: damnSongs.map((song, index) => ({
      numeroFaixa: index + 1,
      cancao: song._id
    }))
  });

  const sosTracks = [
    {
      isrc: 'USRC12203401',
      titulo: 'Kill Bill',
      duracaoSegundos: 154
    },
    {
      isrc: 'USRC12203402',
      titulo: 'Snooze',
      duracaoSegundos: 201
    },
    {
      isrc: 'USRC12203403',
      titulo: 'Shirt',
      duracaoSegundos: 181
    },
    {
      isrc: 'USRC12203404',
      titulo: 'SOS',
      duracaoSegundos: 121
    },
    {
      isrc: 'USRC12203405',
      titulo: 'Seek & Destroy',
      duracaoSegundos: 203
    },
    {
      isrc: 'USRC12203406',
      titulo: 'Blind',
      duracaoSegundos: 150
    },
    {
      isrc: 'USRC12203407',
      titulo: 'Love Language',
      duracaoSegundos: 183
    },
    {
      isrc: 'USRC12203408',
      titulo: 'Low',
      duracaoSegundos: 181
    },
    {
      isrc: 'USRC12203409',
      titulo: 'Notice Me',
      duracaoSegundos: 161
    },
    {
      isrc: 'USRC12203410',
      titulo: 'Gone Girl',
      duracaoSegundos: 245
    },
    {
      isrc: 'USRC12203411',
      titulo: 'Smoking on My Ex Pack',
      duracaoSegundos: 83
    },
    {
      isrc: 'USRC12203412',
      titulo: 'Ghost in the Machine',
      duracaoSegundos: 218
    },
    {
      isrc: 'USRC12203413',
      titulo: 'F2F',
      duracaoSegundos: 186
    },
    {
      isrc: 'USRC12203414',
      titulo: 'Nobody Gets Me',
      duracaoSegundos: 180
    },
    {
      isrc: 'USRC12203415',
      titulo: 'Conceited',
      duracaoSegundos: 152
    },
    {
      isrc: 'USRC12203416',
      titulo: 'Special',
      duracaoSegundos: 158
    },
    {
      isrc: 'USRC12203417',
      titulo: 'Too Late',
      duracaoSegundos: 164
    },
    {
      isrc: 'USRC12203418',
      titulo: 'Far',
      duracaoSegundos: 180
    },
    {
      isrc: 'USRC12203419',
      titulo: 'Shirt (Instrumental Interlude)',
      duracaoSegundos: 82
    },
    {
      isrc: 'USRC12203420',
      titulo: 'I Hate U',
      duracaoSegundos: 174
    },
    {
      isrc: 'USRC12203421',
      titulo: 'Good Days',
      duracaoSegundos: 279
    },
    {
      isrc: 'USRC12203422',
      titulo: 'Forgiveless',
      duracaoSegundos: 142
    },
    {
      isrc: 'USRC12203423',
      titulo: 'Open Arms',
      duracaoSegundos: 240
    },
    {
      isrc: 'USRC12203424',
      titulo: 'PSA',
      duracaoSegundos: 95
    },
    {
      isrc: 'USRC12203425',
      titulo: 'Saturn',
      duracaoSegundos: 186
    }
  ];

  const sosSongs = await Song.insertMany(
    sosTracks.map((track) => ({
      ...track,
      artistas: [sza._id]
    }))
  );

  const albumSos = await Album.create({
    mbid: '62f8f9d7-6633-4c7a-bf31-59f0f9dcce06',
    titulo: 'SOS',
    imagemCapa: 'images/albums/SOS.png',
    anoLancamento: 2022,
    tipo: 'LP',
    artista: sza._id,
    faixas: sosSongs.map((song, index) => ({
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
    },
    {
      ean13: '5609876543213',
      album: albumSwimming._id,
      suporteFisico: 'CD',
      versao: 'Edição standard'
    },
    {
      ean13: '5609876543214',
      album: albumDamn._id,
      suporteFisico: 'vinil',
      versao: 'Vinil deluxe'
    },
    {
      ean13: '5609876543215',
      album: albumSos._id,
      suporteFisico: 'CD',
      versao: 'Edição standard'
    }
  ]);

  console.log('Seed concluído: 4 álbuns de autores diferentes inseridos com sucesso');
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