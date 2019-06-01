import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import RSVP from 'rsvp';

export default Route.extend(AuthenticatedRouteMixin, {
  model() {
    return RSVP.hash({
      user: this.store.findRecord('user', this.get('session.data.authenticated.user_id')),
      userPublicDatum: this.store.queryRecord('user-public-datum',
        { username: this.get('session.data.authenticated.username') })
    });

  },

  setupController(controller,model) {
    this._super(controller, model);

  }
});
