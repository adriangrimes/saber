import Component from '@ember/component';

export default Component.extend({
  show: null,

  didInsertElement() {
    this._super(...arguments);
    this.gotoAnchor();
  },

  didUpdateAttrs() {
    this._super(...arguments);
    this.gotoAnchor();
  },

  gotoAnchor() {
    if (this.show) {
      document.getElementById(this.get('show')).scrollIntoView();
    }
  }
});
