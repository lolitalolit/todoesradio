var stationsDefault = [
  {
    freq: "750am",
    title: "AM 750",
    src:
      "http://streaming.750.am:8050/AM750_MP3"

  },
  {
    freq: "102.3",
    title: "Nuestra Radio",
    src: "http://209.95.35.49:7030/stream"
  },
  {
    freq: "580am",
    title: "Universidad",
    src: "http://209.95.35.49:9105/live"
  },
  {
    freq: "98.9",
    title: "Futurock",
    src: "http://radio-us.origin.mdstrm.com:8000/futurockargentina.aac"
  },
  {
    freq: "666.6",
    title: "La Tribu",
    src:
      "http://vivo.fmlatribu.com/latribu.m4a"

  },
  {
    freq: "89.9",
    title: "Radio con vos",
    src:
      "http://server6.stweb.tv:1935/rcvos/live/chunklist.m3u8"
    
  }
];

function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}

function detailFormatter(index, row) {
  var html = [];
  html.push("<ul>");
  $.each(row, function(key, value) {
    if (key === "src") {
      value.forEach(function(item) {
        html.push("<li>" + item + "</li>");
      });
    }
  });
  html.push("</ul>");
  return html.join("");
}

function actionFormatter(value) {
  return [
    '<a class="remove" title="Borrar"><i class="glyphicon glyphicon-remove-circle"></i></a>'
  ].join("");
}

var options = null;
document.addEventListener("DOMContentLoaded", function() {
  options = new Options();
});

var Options = function() {
  this.init();
};

Options.prototype = {
  stations: null,

  init: function() {
    var self = this;
    self.stations = JSON.parse(JSON.stringify(stationsDefault));

    chrome.storage.sync.get(function(items) {
      if (isEmpty(items)) {
        chrome.storage.sync.set({ stations: self.stations });
      } else {
        self.stations = items.stations;
        chrome.storage.sync.set({ stations: self.stations });
      }

      document
        .getElementById("save")
        .addEventListener("click", self.save_options.bind(self));
      document
        .getElementById("radiostab")
        .addEventListener("click", self.load_table.bind(self));
      document
        .getElementById("restore_default")
        .addEventListener("click", self.restore_defaults.bind(self));

      // update and delete events
      window.actionEvents = {
        "click .remove": function(e, value, row) {
          self.stations = $.grep(self.stations, function(e) {
            return e.title != row.title;
          });
          chrome.storage.sync.set({ stations: self.stations }, function() {
            $("#columns").bootstrapTable("remove", {
              field: "title",
              values: [row.title]
            });
          });
        }
      };

      self.create_table();
    });
  },

  create_table: function() {
    var self = this;

    $("#columns").bootstrapTable({
      columns: [
        {
          field: "title",
          title: "T&iacute;tulo"
        },
        {
          field: "freq",
          title: "Frec"
        }
      ],
      smartDisplay: true,

      data: self.stations
    });
  },

  save_options: function() {
    var self = this;

    document.getElementById("save").disabled = true;
    var title = document.getElementById("title").value;
    var freq = document.getElementById("freq").value;
    var src1 = document.getElementById("src1").value;
    var src2 = document.getElementById("src2").value;

    var src = [];
    if (src1 && src1 !== "") {
      src.push(src1);
    }

    if (src2 && src2 !== "") {
      src.push(src2);
    }

    self.stations.push({
      title: title,
      freq: freq,
      src: src
    });

    chrome.storage.sync.set(
      {
        stations: self.stations
      },
      function() {
        setTimeout(function() {
          document.getElementById("save").disabled = false;
        }, 750);
      }
    );
  },

  load_table: function() {
    var self = this;

    $("#columns").bootstrapTable("load", self.stations);
  },

  restore_defaults: function() {
    var self = this;

    chrome.storage.sync.set({ stations: stationsDefault });
    self.stations = JSON.parse(JSON.stringify(stationsDefault));
    self.load_table();
  }
};
