import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, {
  model() {
    console.log('getting private messages');
    return this.store.query('private-message', {
      id: this.get('session.data.authenticated.user_id')
    });
  },

  setupController(controller, model) {
    this._super(...arguments);
    // controller.set('model', model);
    this.controllerFor('account.messages').setupConversationList(model);
  }
});
