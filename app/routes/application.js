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
    return this.get('currentUser').load().catch(() => this.get('session').invalidate());
  }

});
