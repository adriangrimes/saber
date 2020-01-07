import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  currentUser: service(),

  openDropdown: null,

  didInsertElement() {
    // give currentUser service access to the dropdowns openDropdown function
    this.currentUser.set('openCreditDropdown', this.openDropdown);

    this.currentUser.set('openLoginDropdown', this.openDropdown);
  }
});
