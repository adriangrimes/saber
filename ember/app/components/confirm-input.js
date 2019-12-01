import Component from '@ember/component';
import { later } from '@ember/runloop';

export default Component.extend({
  showConfirm: 'd-none',
  showButton: 'd-flex',
  resetIcon: 'fa fa-refresh',

  actions: {
    openConfirm() {
      console.log(this.type + ' confirm opened');
      this.set('showButton', 'd-none');
      this.set('showConfirm', 'd-flex');
    },
    confirmInput() {
      console.log(this.type + ' input confirmed');
      this.onConfirm();
      this.set('resetIcon', 'fa fa-refresh fa-spin');
      this.set('showButton', 'd-flex');
      this.set('showConfirm', 'd-none');
      later(
        this,
        function() {
          this.set('resetIcon', 'fa fa-refresh');
        },
        1000
      );
    },
    cancelInput() {
      console.log(this.type + ' input canceled');
      this.set('showButton', 'd-flex');
      this.set('showConfirm', 'd-none');
    }
  }
});
