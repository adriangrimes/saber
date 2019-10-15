import Route from '@ember/routing/route';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import { inject } from '@ember/service';

export default Route.extend(ApplicationRouteMixin, {
  notify: inject(),

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
      // returning true will cause the .hbs to display
      return true;
    },

    error(error /*, transition*/) {
      console.log(error);
      if (error.errors[0].status == 0) {
        this.get('notify').error(
          'Sorry, the server appears to be unavailable. Please try again later.'
        );
      }
      if (error.errors[0].status == 500) {
        this.get('notify').error(
          'The server encountered an internal error. Please try again later.'
        );
      }
      // returning true will cause the .hbs to display
      // return true;
    },

    testError() {
      this.get('notify').error('manual error!');
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
