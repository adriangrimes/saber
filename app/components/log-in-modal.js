import Component from '@ember/component';
import { inject } from '@ember/service';

export default Component.extend({
    loginState: inject.service('login-state'),

    actions: {
      closeModal() {
        this.set('loginState.errorMessage','');
      }
    }
});
