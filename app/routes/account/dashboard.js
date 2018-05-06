import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';


export default Route.extend(AuthenticatedRouteMixin, {
  model() {
    return this.get('store').findRecord('user', this.get('session.data.authenticated.user_id') );

  },

  setupController(controller,model) {
    this._super(controller, model);
    // Set account settings to settings pulled from db
    controller.set('streamKey', model.get('streamKey'));
  }
});
