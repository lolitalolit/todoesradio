if (typeof browser === "undefined" && typeof chrome === "object") {
  browser = chrome;
}

var radio;

document.addEventListener("DOMContentLoaded", function() {
  radio = new bgController();
});

var bgController = function() {};

bgController.prototype = {
  radio: null,
  station: null,
  id: null,
  m3u8: false,
  format: 'webm',
  data: null,

  init: function() {},

  playHowl: function() {
    var self = this;
    self._smartFormat();
    var radio = new Howl({
      src: self.data.src,
      html5: true,
      format: self.format
    });

    self.id = radio.play();
    self.radio = radio;
    self.station = self.data;
  },

  playM3u8: function() {
    var self = this;

    if (Hls.isSupported()) {
      var video = document.getElementById("video");
      var hls = new Hls();

      hls.attachMedia(video);

      hls.on(Hls.Events.MEDIA_ATTACHED, function() {
        hls.loadSource(self.data.src);

        hls.on(Hls.Events.MANIFEST_PARSED, function() {
          video.play();
          self.id = 'm3u8';
          self.radio = hls;
          self.station = self.data;

          hls.on(Hls.Events.ERROR, function(event, data) {
            if (data.fatal) {
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  // try to recover network error
                  console.log(
                    "fatal network error encountered, try to recover"
                  );
                  hls.startLoad();
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  console.log("fatal media error encountered, try to recover");
                  hls.recoverMediaError();
                  break;
                default:
                  // cannot recover
                  hls.destroy();
                  break;
              }
            }
          });
        });
      });
    }
  },

  play: function() {
    var self = this;
    self.setm3u8();

    if (self.m3u8) {
      self.playM3u8();
    } else {
      self.playHowl();
    }
  },

  toggle: function(data) {
    var self = this;

    self.data = data;

    self.stop();

    if (self.station) {
      if (self.station.title !== data.title) {
        self.id = self.play();
      } else {
        self.station = null;
      }
    } else {
      self.id = self.play();
    }
  },

  stop: function() {
    var self = this;
    if (self.radio) {
      if (self.radio.destroy) {
        self.radio.destroy();
      } else {
        self.radio.unload();
      }
    }
  },

  setm3u8: function() {
    var self = this;
    if (/m3u8/.test(self.data.src.toLowerCase())) {
      self.m3u8 = true;
    } else {
      self.m3u8 = false;
    }
  },

  _smartFormat: function() {
    var self = this;

    if (/mp3/.test(self.data.src.toLowerCase())) {
      self.format = "mp3";
    }

    if (/aac/.test(self.data.src.toLowerCase())) {
      self.format = "aac";
    }

    if (/m4a/.test(self.data.src.toLowerCase())) {
      self.format = "m4a";
    }
  }

};
