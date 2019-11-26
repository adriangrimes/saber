import Component from '@ember/component';
import jQuery from 'jquery';

export default Component.extend({
  didInsertElement() {
    if (this.changeset && this.changeset.get('gender')) {
      if (
        this.changeset.get('gender').toLowerCase() == 'female' ||
        this.changeset.get('gender').toLowerCase() == 'male' ||
        this.changeset.get('gender').toLowerCase() == 'hide'
      ) {
        this.set('genderSelection', this.changeset.get('gender'));
      } else {
        this.set('genderSelection', 'Other');
        this.set('genderSelectionOther', this.changeset.get('gender'));
      }
    }
  },

  willRender() {
    console.log('willRender genderSelection');
    if (this.genderSelection && this.changeset) {
      if (this.genderSelection == 'Other') {
        this.changeset.set('gender', this.genderSelectionOther);
      } else {
        this.set('genderSelectionOther', '');
        this.changeset.set('gender', this.genderSelection);
      }
    }
  },

  actions: {
    checkOtherGender() {
      this.set('genderSelection', 'Other');
      jQuery('#inputGenderOther')
        .prop('checked', true)
        .change();
    }
  }
});
