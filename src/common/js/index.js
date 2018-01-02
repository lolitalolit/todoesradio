var stationsDefault = [
  {
    freq: "102.3",
    title: "Nuestra Radio",
    src: "http://209.95.35.49:7030/stream"
  },
  {
    freq: "89.9",
    title: "Radio con vos",
    src: "http://server6.stweb.tv:1935/rcvos/live/chunklist.m3u8"
  },
  {
    freq: "98.9",
    title: "Futurock",
    src: "http://radio-us.origin.mdstrm.com:8000/futurockargentina.aac"
  },
  {
    freq: "666.6",
    title: "La Tribu",
    src: "http://vivo.fmlatribu.com/latribu.m4a"
  },
  {
    freq: "580am",
    title: "Universidad",
    src: "http://209.95.35.49:9105/live"
  },
  {
    freq: "750am",
    title: "AM 750",
    src: "http://streaming.750.am:8050/AM750_MP3"
  }
];

function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}
