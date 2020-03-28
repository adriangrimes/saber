import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { later } from '@ember/runloop';

export default Component.extend({
  currentUser: service(),

  init() {
    this._super(...arguments);
    if (this.currentUser.get('readyForCubeLoad')) {
      this.currentUser.set('readyForCubeLoad', false);
      this.currentUser.load();
      later(
        this,
        function() {
          this.currentUser.set('readyForCubeLoad', true);
        },
        10000
      );
    }
  }
});
