import Route from '@ember/routing/route';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Route.extend(ApplicationRouteMixin, {
  beforeModel() {
    console.log('R1 beforeModel application route hook');
    if (this.get('session.isAuthenticated')) {
      console.log('session is authenticated');
      return this._loadCurrentUser();
    }
  },

  // model() {
  // },

  sessionAuthenticated() {
    console.log('R2 sessionAuthenticated()');
    this._super(...arguments);
    this._loadCurrentUser();
  },

  _loadCurrentUser() {
    console.log('R3 _loadCurrentUser()');
    return this.currentUser.load().catch(() => this.session.invalidate());
  },

  actions: {
    loading(transition) {
      let controller = this.controllerFor('application');
      controller.set('currentlyLoading', true);
      transition.promise.finally(function() {
        controller.set('currentlyLoading', false);
      });
      return true;
    },

    willTransition(transition) {
      console.log('transition detected, clearing errorMessages');
      this.currentUser.set('errorMessages', []);
      if (
        this.session.isAuthenticated &&
        transition.to.name != 'account.messages'
      ) {
        this.currentUser.loadMessages(false);
      }
    }
  }
});
