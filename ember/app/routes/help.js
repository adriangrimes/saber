import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return this.store.findAll('help-topic');
  },

  setupController(controller, model) {
    model = model
      .sortBy('allUsers')
      .sortBy('contractorsOnly')
      .sortBy('broadcastersOnly')
      .sortBy('developersOnly');
    controller.set('model', model);

    if (this.session.isAuthenticated && this.currentUser.user) {
      controller.set('isContracted', this.currentUser.user.isContracted);
      controller.set('isBroadcaster', this.currentUser.user.broadcaster);
      controller.set('isDeveloper', this.currentUser.user.developer);
    } else {
      controller.set('isContracted', false);
      controller.set('isBroadcaster', false);
      controller.set('isDeveloper', false);
    }
  },

  resetController(controller, isExiting /*, transition*/) {
    // reset help route query parameters on route exit
    if (isExiting) {
      controller.set('show', null);
    }
  }
});
