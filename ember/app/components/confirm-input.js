import Component from '@ember/component';
import { later } from '@ember/runloop';

export default Component.extend({
  showConfirm: false,
  showButton: true,
  resetIconSpin: false,

  actions: {
    openConfirm() {
      console.log(this.type + ' confirm opened');
      this.set('showButton', false);
      this.set('showConfirm', true);
    },

    confirmInput() {
      console.log(this.type + ' input confirmed');
      this.onConfirm();
      this.set('resetIconSpin', true);
      this.set('showButton', true);
      this.set('showConfirm', false);
      later(
        this,
        function() {
          this.set('resetIconSpin', false);
        },
        1000
      );
    },

    cancelInput() {
      console.log(this.type + ' input canceled');
      this.set('showButton', true);
      this.set('showConfirm', false);
    }
  }
});
