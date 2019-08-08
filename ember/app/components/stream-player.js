import Component from '@ember/component';

export default Component.extend({

  didInsertElement() {
    this._super(...arguments);
    this.set('player', document.querySelector('.player'));
    this.set('video', this.get('player').querySelector('.player-video'));
    this.set('volume', this.get('player').querySelector('.player-volume'));
    console.log(this.get('player'));
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
