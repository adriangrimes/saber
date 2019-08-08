import Component from '@ember/component';

export default Component.extend({
  didInsertElement() {
    this._super(...arguments);

    // Open accordion if an anchor link is in the URL
    let anchorText = location.hash.replace('#', '');
    if (anchorText) {
      var element = document.getElementById(anchorText + 'Collapse');
      var arr = element.className.split(' ');
      if (arr.indexOf(anchorText) == -1) {
        element.className += ' show';
      }
    }
  }
});
