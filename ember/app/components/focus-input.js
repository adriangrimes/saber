import Component from '@ember/component';

// Wrap this component around any input field to focus it
export default Component.extend({
  didInsertElement() {
    if (this.element.querySelector('input')) {
      this.element.querySelector('input').focus();
    } else if (this.element.querySelector('textarea')) {
      this.element.querySelector('textarea').focus();
    }
  }
});
