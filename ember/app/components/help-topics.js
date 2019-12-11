import Component from '@ember/component';

export default Component.extend({
  didInsertElement() {
    this._super(...arguments);

    // scroll to anchor tag after load
    let anchorText = location.hash.replace('#', '');
    if (anchorText) {
      document.getElementById(anchorText).scrollIntoView();
    }
  }
});
