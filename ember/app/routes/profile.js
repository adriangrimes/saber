import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, {

  model() {
    return this.store.queryRecord('user-public-datum',
      { username: this.get('session.data.authenticated.username') });
  },

  setupController(controller, model) {
    // Sets profile view and edit panel input fields with loaded store data
    this._super(controller, model);
    // Set up gender selection inputs with loaded store data
    controller.set('tempGenderText', '');
    if (model.get('profileGender') == 'Male') {
      controller.set('tempGenderSelection', 'Male');
    } else if (model.get('profileGender') == 'Female') {
      controller.set('tempGenderSelection', 'Female');
    } else {
      controller.set('tempGenderSelection', 'Other');
      controller.set('tempGenderText', model.get('profileGender'));
      controller.set('checkOtherGender', true);
    }
    // Set up user tags
    if (model.get('userCustomTags') != null) {
      controller.set('tags', model.get('userCustomTags').split(","));
    }
  }

});
