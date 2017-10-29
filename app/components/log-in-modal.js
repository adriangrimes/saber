import Ember from 'ember';

export default Ember.Component.extend({
    loginState: Ember.inject.service('login-state'),

    actions: {
      closeModal() {
        this.set('loginState.errorMessage','');
      }
    }
});
