import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {

  model() {
    return this.get('store').findRecord('user', this.get('session.data.authenticated.user_id') );
  },

  setupController(controller,model) {
    this._super(controller, model);
    // Implement your custom setup after
    let sEFO = model.get('sendEmailFavoritesOnline');
    console.log('sEFO: ' + sEFO);
    controller.set('sendEmailFavoritesOnline', sEFO);
  }
});
