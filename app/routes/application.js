import Route from '@ember/routing/route';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Route.extend(ApplicationRouteMixin, {
  model() {
    //return this.store.createRecord('user')
    if (this.get('session.isAuthenticated')){
      return this.get('store').findRecord('user', this.get('session.data.authenticated.user_id') );
    }
  },
  setupController(controller,model) {
    this._super(controller, model);
    // Set account settings to settings pulled from db
        if (this.get('session.isAuthenticated')){
            controller.set('darkModeCheckbox', this.get('loginState.darkMode'));
      }
}
});
