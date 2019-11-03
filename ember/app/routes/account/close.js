import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, {
  model() {
    return this.store.findRecord(
      'user',
      this.get('session.data.authenticated.user_id'),
      { reload: true }
    );
  }
});
