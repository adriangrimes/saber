import Component from '@ember/component';

export default Component.extend({
  showConfirm: 'd-none',
  showButton: 'd-flex',

  actions: {
    openConfirm() {
      console.log(this.type + ' confirm opened');
      this.set('showButton', 'd-none');
      this.set('showConfirm', 'd-flex');
    },
    confirmInput() {
      console.log(this.type + ' input confirmed');
      this.onConfirm();
    },
    cancelInput() {
      console.log(this.type + ' input canceled');
      this.set('showButton', 'd-flex');
      this.set('showConfirm', 'd-none');
    }
  }
});
