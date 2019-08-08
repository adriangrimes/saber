import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { inject } from '@ember/service';
import { isEmpty } from '@ember/utils';

export default Route.extend(AuthenticatedRouteMixin, {
  currentUser: inject(),

  model() {
    return this.store.query('conversation', {
      id: this.get('session.data.authenticated.user_id')
    });
  },

  setupController(controller, model) {
    if (!isEmpty(model)) {
      controller.set('selectedUser', model.toArray().firstObject.username);
    }
  }
});
