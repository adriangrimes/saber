import Component from '@ember/component';
import jQuery from 'jquery';

export default Component.extend({
  attributeToModify: 'gender',

  init() {
    this._super(...arguments);
    if (this.changeset && 'profileGender' in this.changeset) {
      console.log('detected profileGender');
      this.set('attributeToModify', 'profileGender');
    }
  },

  didInsertElement() {
    this._super(...arguments);
    if (this.changeset && this.changeset.get(this.attributeToModify)) {
      if (
        this.changeset.get(this.attributeToModify).toLowerCase() == 'female' ||
        this.changeset.get(this.attributeToModify).toLowerCase() == 'male' ||
        this.changeset.get(this.attributeToModify).toLowerCase() == 'hide'
      ) {
        this.set('genderSelection', this.changeset.get(this.attributeToModify));
      } else {
        this.set('genderSelection', 'Other');
        this.set(
          'genderSelectionOther',
          this.changeset.get(this.attributeToModify)
        );
      }
    }
  },

  didUpdateAttrs() {
    this._super(...arguments);
    console.log('didUpdateAttrs gender selection');
    if (
      this.revertingChanges &&
      this.changeset &&
      this.changeset.get(this.attributeToModify) != null
    ) {
      console.log('revertingChanges');
      if (
        this.changeset.get(this.attributeToModify).toLowerCase() == 'female' ||
        this.changeset.get(this.attributeToModify).toLowerCase() == 'male' ||
        this.changeset.get(this.attributeToModify).toLowerCase() == 'hide'
      ) {
        this.set('genderSelection', this.changeset.get(this.attributeToModify));
      } else {
        this.set('genderSelection', 'Other');
        this.set(
          'genderSelectionOther',
          this.changeset.get(this.attributeToModify)
        );
      }
    }
  },

  didRender() {
    this._super(...arguments);
    console.log('didRender gender selection');
    this.set('revertingChanges', false);
    if (this.genderSelection && this.changeset) {
      if (this.genderSelection == 'Other') {
        this.changeset.set(
          this.attributeToModify,
          this.get('genderSelectionOther')
        );
      } else {
        this.set('genderSelectionOther', '');
        this.changeset.set(this.attributeToModify, this.get('genderSelection'));
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
