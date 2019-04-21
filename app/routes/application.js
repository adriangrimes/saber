import Route from '@ember/routing/route';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Route.extend(ApplicationRouteMixin, {

  beforeModel() {
    console.log("beforeModel application route hook");
    if (this.get('session.isAuthenticated')) {
      console.log('session is authenticated');
      return this._loadCurrentUser();
    }
  },

  // model() {
  // },

  sessionAuthenticated() {
    console.log('sessionAuthenticated()');
    this._super(...arguments);
    this._loadCurrentUser();
  },

  _loadCurrentUser() {
    console.log('_loadCurrentUser()');
    return this.get('currentUser').load().catch(() => this.get('session').invalidate());
  },

});
