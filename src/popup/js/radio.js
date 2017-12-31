var stationDiv = function(id) {
  var station = document.createElement("div");
  station.className = "station";
  station.id = "station" + id;

  var title = document.createElement("div");
  title.className = "title";

  var subtitle = document.createElement("div");
  subtitle.className = "subtitle";
  subtitle.id = "title" + id;

  var live = document.createElement("div");
  live.className = "live";
  live.id = "live" + id;
  live.innerHTML = "live";

  var playing = document.createElement("div");
  playing.className = "playing";
  playing.id = "playing" + id;

  [1, 2, 3, 4, 5].forEach(function(i) {
    var div = document.createElement("div");
    div.className = "rect" + i;
    playing.appendChild(div);
  });

  /* Build div */
  title.appendChild(subtitle);
  title.appendChild(live);
  title.appendChild(playing);
  station.appendChild(title);

  return station;
};

window.onload = function() {
  chrome.storage.sync.get(function(items) {
    var stations = items.stations;
    if (isEmpty(stations)) {
      stations = stationsDefault;
    }

    buildDom(stations);

    chrome.runtime.getBackgroundPage(function(bg) {
      var radio = new Radio(stations, bg);
      radio.updateUi();
    });
  });
};

function buildDom(st) {
  var stationsDiv = document.getElementById("stations");

  st.forEach(function(elm, i) {
    stationsDiv.appendChild(stationDiv(i));
    window[stationDiv] = document.getElementById(stationDiv);
    ["live" + i, "title" + i, "playing" + i].forEach(function(e) {
      window[e] = document.getElementById(e);
    });
  });
}

var Radio = function(st, bg) {
  this.init(st, bg);
};

function sleep(millis) {
  var date = new Date();
  var curDate = null;
  do {
    curDate = new Date();
  } while (curDate - date < millis);
}

Radio.prototype = {
  bg: null,
  stations: null,

  init: function(st, bg) {
    var self = this;
    self.bg = bg;
    self.stations = st;

    // Setup the display for each station.
    for (var i = 0; i < self.stations.length; i++) {
      window["title" + i].innerHTML =
        "<b>" + self.stations[i].freq + "</b> " + self.stations[i].title;

      window["station" + i].addEventListener(
        "click",
        function(index) {
          self.bg.radio.toggle(self.stations[index]);
          self.toggleStationDisplay(index, self.bg.radio.station);
        }.bind(self, i)
      );
    }

    var reload = document.getElementById("reload");
    reload.addEventListener("click", function() {
      chrome.runtime.reload();
    });

    self.updateUi();
  },

  toggleStationDisplay: function(index, state) {
    var self = this;
    self.resetUi();
    self.rowHighlight(index, state);
    self.showLive(index, state);
    self.showPlaying(index, state);
    self.showBadge(state);
  },

  updateUi: function() {
    var self = this;
    for (var i = 0; i < self.stations.length; i++) {
      if (
        self.bg.radio.station &&
        stations[i].title === self.bg.radio.station.title
      ) {
        self.rowHighlight(i, true);
        self.showLive(i, true);
        self.showPlaying(i, true);
        self.showBadge(true);
      }
    }
  },

  showBadge: function(state) {
    if (state) {
      chrome.browserAction.setBadgeText({ text: "live" });
      chrome.browserAction.setBadgeBackgroundColor({ color: "#bd4961" });
    } else {
      chrome.browserAction.setBadgeText({ text: "" });
    }
  },

  resetUi: function() {
    var self = this;
    for (var i = 0; i < self.stations.length; i++) {
      self.rowHighlight(i, false);
      self.showLive(i, false);
      self.showPlaying(i, false);
    }

    self.showBadge(false);
  },

  rowHighlight: function(index, state) {
    // Highlight/un-highlight the row.
    window["station" + index].style.backgroundColor = state
      ? "rgba(255, 255, 255, 0.33)"
      : "";
  },

  showLive: function(index, state) {
    // Show/hide the "live" marker.
    window["live" + index].style.opacity = state ? 1 : 0;
  },

  showPlaying: function(index, state) {
    // Show/hide the "playing" animation.
    window["playing" + index].style.display = state ? "block" : "none";
  },

  showBadges: function(state) {
    if (state) {
      chrome.browserAction.setBadgeText({ text: "live" });
      chrome.browserAction.setBadgeBackgroundColor({ color: "#bd4961" });
    } else {
      chrome.browserAction.setBadgeText({ text: "" });
    }
  }
};
