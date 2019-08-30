import Component from '@ember/component';
import { later } from '@ember/runloop';

export default Component.extend({
  didInsertElement() {
    this._super(...arguments);

    this.hlsSource = {
      type: 'application/x-mpegURL',
      src: '/hls/' + this.broadcasterUsername.toLowerCase() + '/index.m3u8'
    };

    // video.js
    this.initializeVideoPlayer();
  },

  isStreamingDidChange() {
    if (this.get('isStreaming') === true) {
      // Wait at least 9 seconds, with 1 second of variance to stop everyone
      // from pulling the stream at exactly the same time.
      var reconnectTime = Math.floor(Math.random() * 1000);
      console.log('waiting ' + reconnectTime.toString() + ' ms to reconnect');
      later(
        this,
        function() {
          this.get('player').src(this.hlsSource);
          this.get('player').play();
          console.log('streaming');
        },
        reconnectTime
      );
    } else {
      console.log('stopped streaming');
      this.set('playerVolume', this.get('player').volume());
      console.log(this.get('player').volume());
      this.get('player').reset();
    }
  },

  initializeVideoPlayer() {
    console.log('initializing player');
    var options = {
      controls: true,
      preload: 'none',
      autoplay: false,
      controlBar: {
        pictureInPictureToggle: false
      },
      errorDisplay: false
    };
    var component = this;
    this.set(
      'player',
      videojs('video-player', options, function onPlayerReady() {
        // Observe changes to stream state for use in video js player
        component.addObserver('isStreaming', component, 'isStreamingDidChange');

        if (component.get('isStreaming') === true) {
          this.src(component.hlsSource);
          console.log('isStreaming true - playing');
          this.play();
        }

        // Event listeners
        this.on('ready', function() {
          videojs.log('player ready');
          this.options(options);
          this.poster(component.profilePhoto);
          if (component.playerVolume) {
            console.log('setting volume to ' + component.playerVolume);
            this.volume(component.playerVolume);
          }
          if (component.retryStream) {
            this.play();
          }
        });

        this.on('error', function(e) {
          videojs.log('error with video:');
          // videojs.log(e);
          // component.set('retryStream', true);
          // this.reset();
        });

        this.on('dispose', function() {
          if (this.isInPictureInPicture()) {
            document.exitPictureInPicture();
          }
          videojs.log('videojs player disposed');
        });
      })
    );
  },

  willDestroyElement() {
    // dispose of videojs player
    if (this.player) {
      this.get('player').dispose();
    }
    this._super(...arguments);
  },

  actions: {
    togglePlay() {
      console.log('toggle play');
      var playState = this.get('video').paused ? 'play' : 'pause';
      this.get('video')[playState]();
    },
    volumeUpdate() {
      this.get('video')['volume'] = this.get('volume').value;
      console.log('volume Updated');
    }
  }
});
