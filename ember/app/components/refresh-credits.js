import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { later } from '@ember/runloop';

export default Component.extend({
  currentUser: service(),

  init() {
    this._super(...arguments);
    if (this.currentUser.get('readyForCreditLoad')) {
      this.currentUser.set('readyForCreditLoad', false);
      this.currentUser.load();
      later(
        this,
        function() {
          this.currentUser.set('readyForCreditLoad', true);
        },
        10000
      );
    }
  }
});
