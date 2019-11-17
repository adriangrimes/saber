import Route from '@ember/routing/route';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import { inject as service } from '@ember/service';
import jQuery from 'jquery';

export default Route.extend(ApplicationRouteMixin, {
  errorHandler: service(),

  beforeModel() {
    console.log('R1 beforeModel application route hook');
    if (this.get('session.isAuthenticated')) {
      console.log('session is authenticated');
      return this._loadCurrentUser();
    }
  },

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
      // let controller = this.controllerFor('application');
      // controller.set('currentlyLoading', true);
      transition.promise.finally(function() {
        // controller.set('currentlyLoading', false);
      });
      // returning true will cause loading.hbs to display
      return true;
    },

    // Catch route errors (beforeModel(), model(), afterModel())
    error(err /*, transition*/) {
      console.log('application level route action error:', err);
      this.errorHandler.handleWithNotification(err);
      // returning true will cause error.hbs to display
      return true;
    },

    willTransition(transition) {
      if (
        this.session.isAuthenticated &&
        transition.to.name != 'account.messages'
      ) {
        this.currentUser.loadMessages(false);
      }
    }
  }
});
