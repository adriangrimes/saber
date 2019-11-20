import Component from '@ember/component';
import { later } from '@ember/runloop';
import { inject as service } from '@ember/service';

export default Component.extend({
  currentUser: service(),

  userPaused: false,
  currentUserIsProfileOwner: false,

  init() {
    this._super(...arguments);

    this.hlsSource =
      'https://saber.solversion.com/hls/' +
      this.broadcasterUsername.toLowerCase() +
      '/index.m3u8';

    // Observe changes to stream state for use in video player
    this.addObserver('isStreaming', this, 'isStreamingDidChange');
    this.addObserver('profilePhoto', this, 'profileImageChanged');


  },

  didInsertElement() {
    this._super(...arguments);

    // Plyr
    this.initializeVideoPlayer();

    console.log(this.broadcasterUsername);
    console.log(this.currentUser.user.username);
  },

  isStreamingDidChange() {
    console.log('isStreamingDidChange called');
    if (this.isStreaming === true && this.isStreamingLastRev !== true) {
      // Wait with up to 1 second of variance to stop everyone
      // from pulling the stream at exactly the same time.
      var reconnectTime = Math.floor(Math.random() * 1000);
      console.log('waiting ' + reconnectTime.toString() + ' ms to reconnect');
      later(
        this,
        function() {
          //document.querySelector('video').src = this.hlsSource;
          console.log('streaming');
          // this.get('hls').loadSource('https://cdn.plyr.io/static/blank.mp4');
          this.get('hls').stopLoad();
          this.get('hls').detachMedia();
          this.get('hls').attachMedia(this.get('videoPlayerElement'));
          this.get('hls').loadSource(this.hlsSource);
          this.playUnlessUserPaused();
        },
        reconnectTime
      );
    } else if (this.isStreaming === false) {
      this.get('hls').stopLoad();
      this.get('hls').detachMedia();
      this.get('player').stop();
      console.log('stopped streaming');
    }

    // Set a last revision property due to observer 'rev' argument being null
    this.set('isStreamingLastRev', this.isStreaming);
  },

  profileImageChanged() {
    console.log(this.profilePhoto);
    this.get('player').poster = this.profilePhoto;
  },

  initializeVideoPlayer() {
    console.log('initializing player');

    var component = this;
    this.set(
      'player',
      new Plyr('#video-player', {
        debug: false,
        title: 'Example Title',
        controls: ['play', 'mute', 'volume', 'settings', 'fullscreen'],
        settings: ['quality'],
        ratio: '16:9'
      })
    );

    this.get('player').on('ready', event => {
      console.log('video player ready');
      const instance = event.detail.plyr;
      if (component.profilePhoto) instance.poster = component.profilePhoto;
      component.set(
        'videoPlayerElement',
        document.getElementById('video-player')
      );
      if (!Hls.isSupported()) {
        console.log('hls unsupported');
        component.get('videoPlayerElement').src = this.hlsSource;
      } else {
        console.log('hls supported');
        // For more Hls.js options, see https://github.com/video-dev/hls.js
        component.set('hls', new Hls());

        component.get('hls').attachMedia(component.get('videoPlayerElement'));
        window.hls = component.get('hls');
        window.player = component.get('player');
        component.get('hls').on(Hls.Events.ERROR, function(event, data) {
          console.log('hls ERROR');
          console.log(event);
          console.log(data);
          if (data.details == 'bufferAppendingError') {
            console.log('bufferAppendingError');
            component.get('hls').recoverMediaError();
          }
          if (data.details == 'bufferStalledError') {
            console.log('bufferAppendingError');
            component.get('hls').recoverMediaError();
            component.playUnlessUserPaused();
          }
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                // try to recover network error
                console.log('fatal network error encountered, try to recover');
                component.get('hls').startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.log('fatal media error encountered, try to recover');
                component.get('hls').recoverMediaError();
                break;
              default:
                // cannot recover
                console.log('fatal error cannot recover');
                component.get('hls').destroy();
                break;
            }
          }
        });
        component.get('hls').on(Hls.Events.MEDIA_ATTACHED, function() {
          console.log('media attached');
        });
        component.get('hls').on(Hls.Events.MEDIA_DETACHED, function() {
          console.log('media detached');
        });
        component.get('hls').on(Hls.Events.MANIFEST_LOADED, function() {
          console.log('manifest loaded');
        });
        component.get('hls').on(Hls.Events.MANIFEST_PARSED, function() {
          console.log('manifest parsed');
        });
      }

      if (component.isStreaming) {
        console.log('isStreaming true - playing');
        component.get('hls').loadSource(component.hlsSource);
        component.playUnlessUserPaused();
      }
    });

    this.get('player').on('canplay', function() {
      console.log('video player can play');
      // const instance = event.detail.plyr;
      component.playUnlessUserPaused();
    });
    this.get('player').on('pause', function() {
      console.log('video player pause event');
      // const instance = event.detail.plyr;
      component.set('userPaused', true);
    });

    this.get('player').on('play', function() {
      console.log('video player play event');
      // const instance = event.detail.plyr;
      component.set('userPaused', false);
      component.get('hls').startLoad(-1);
    });
    this.get('player').on('error', function(event, data) {
      console.log('video player error');
      console.log(event);
      console.log(data);
    });
  },

  playUnlessUserPaused() {
    if (this.userPaused == false) {
      this.get('player').play();
    } else {
      this.get('hls').stopLoad();
    }
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

    // test action
    reset() {
      console.log('restart');
      this.get('player').restart();
    },

    // test action
    src() {
      console.log('stop');
      this.get('player').stop();
    }
  }
});
