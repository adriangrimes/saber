import Component from '@ember/component';
import { later } from '@ember/runloop';
import { inject as service } from '@ember/service';

export default Component.extend({
  currentUser: service(),

  init() {
    this._super(...arguments);

    this.hlsSource =
      'https://saber.solversion.com/hls/' +
      this.broadcasterUsername.toLowerCase() +
      '/index.m3u8';

    // Observe changes to stream state for use in video player
    this.addObserver('isStreaming', this, 'isStreamingDidChange');
  },

  didInsertElement() {
    this._super(...arguments);

    // Plyr
    this.initializeVideoPlayer();
  },

  isStreamingDidChange() {
    console.log('isStreamingDidChange called');
    if (this.get('isStreaming') === true) {
      // Wait with 1 second of variance to stop everyone
      // from pulling the stream at exactly the same time.
      var reconnectTime = Math.floor(Math.random() * 1000);
      console.log('waiting ' + reconnectTime.toString() + ' ms to reconnect');
      later(
        this,
        function() {
          document.querySelector('video').src = this.hlsSource;
          console.log('streaming');
          this.get('player').play();
        },
        reconnectTime
      );
    } else {
      console.log('stopped streaming');
    }
  },

  initializeVideoPlayer() {
    console.log('initializing player');

    var component = this;
    this.set(
      'player',
      new Plyr('#video-player', {
        debug: true,
        title: 'Example Title',
        controls: ['play', 'mute', 'volume', 'settings', 'fullscreen'],
        settings: ['quality'],
        ratio: '16:9'
      })
    );

    this.get('player').on('ready', event => {
      console.log('video player ready');
      const instance = event.detail.plyr;
      instance.poster = component.profilePhoto;
      var videoPlayer = document.getElementById('video-player');
      if (!Hls.isSupported()) {
        videoPlayer.src = this.hlsSource;
      } else {
        // For more Hls.js options, see https://github.com/video-dev/hls.js
        component.set('hls', new Hls());
        component.get('hls').loadSource(component.hlsSource);
        component.get('hls').attachMedia(videoPlayer);
        window.hls = component.get('hls');
      }

      if (component.isStreaming) {
        instance.play();
      }
    });

    this.get('player').on('error', event => {
      console.log('video player error');
      console.log(event);
      //const instance = event.detail.plyr;
    });
  },

  willDestroyElement() {
    // dispose of video player
    if (this.hls) {
      this.get('hls').destroy();
      console.log('destroying hls');
    }
    if (this.player) {
      this.get('player').destroy();
      console.log('destroying player');
    }
    this.removeObserver('isStreaming', this, 'isStreamingDidChange');
    console.log('removed isStreaming observer');
    this._super(...arguments);
  },

  actions: {
    testAction() {
      console.log('testAction');
      console.log(this.get('player').readyState());
      console.log(this.get('player').error());
      this.get('player').error('');
    },
    reset() {
      console.log('reset');
      this.get('player').reset();
    },
    src() {
      console.log('src');
      this.get('player').src('');
    }
  }
});
