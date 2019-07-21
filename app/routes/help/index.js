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

    controller.set('isContracted', this.currentUser.user.isContracted);
    controller.set('isBroadcaster', this.currentUser.user.broadcaster);
    controller.set('isDeveloper', this.currentUser.user.developer);
  }
});
