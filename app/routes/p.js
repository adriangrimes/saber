import Route from '@ember/routing/route';

export default Route.extend({

  model(params) {
    return this.get('store').queryRecord('user-public-datum', { user_id: params.profile_id });
  },

  setupController(controller, model) {
    this._super(controller, model);
    // Set account settings to settings pulled from db
    controller.set('tipAmountOptions', 10);

    if (model.profileAboutMe === null) {
      controller.set('noAboutMe', true);
    }
    if (model.profileAge === null) {
      controller.set('noAge', true);
    }
    if (model.profileSex === null) {
      controller.set('noSex', true);
    }
    if (model.profileLocation === null) {
      controller.set('noLocation', true);
    }
    if (model.profileLanguages === null) {
      controller.set('noLanguage', true);
    }
  }

});
