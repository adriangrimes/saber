import Component from '@ember/component';

export default Component.extend({
  showConfirm: 'd-none',
  showButton: 'd-flex',
  resetStreamKeyIcon: "fa fa-refresh",

  actions: {
    openConfirm() {
      console.log(this.type + ' confirm opened');
      this.set('showButton', 'd-none');
      this.set('showConfirm', 'd-flex');
    },
    confirmInput() {
      console.log(this.type + ' input confirmed');
      this.onConfirm();
      this.set('resetStreamKeyIcon', 'fa fa-refresh fa-spin');
      var thisParent = this;
      setTimeout(function() {
        thisParent.set('resetStreamKeyIcon', 'fa fa-refresh');
      }, 2000);
      this.set('showButton', 'd-flex');
      this.set('showConfirm', 'd-none');

    },
    cancelInput() {
      console.log(this.type + ' input canceled');
      this.set('showButton', 'd-flex');
      this.set('showConfirm', 'd-none');
    }
  }
});
