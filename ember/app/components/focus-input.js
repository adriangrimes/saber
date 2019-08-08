import Component from '@ember/component';

// Wrap this component around any input field to focus it
export default Component.extend({
  didInsertElement () {
    this.element.querySelector("input").focus();
  }
});
