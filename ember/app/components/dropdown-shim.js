import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  currentUser: service(),

  openDropdown: null,

  didInsertElement() {
    this.currentUser.set('openCreditDropdown', this.openDropdown);
  }
});
