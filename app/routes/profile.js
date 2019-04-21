import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, {

  model() {
    return this.get('store').queryRecord('user-public-datum', { user_id: this.get('session.data.authenticated.user_id') });
  },

  setupController(controller, model) {
    this._super(controller, model);

    // Set profile info to settings pulled from db in display profile and edit modal
    controller.set('displayAboutMe', model.get('profileAboutMe'));
    controller.set('inputaboutme', model.get('profileAboutMe'));

    controller.set('displaySex', model.get('profileSex'));
    controller.set('inputSex', model.get('profileSex'));

    if (model.get('profileSex') == 'Male'){
      controller.set('otherSexText', '');
    } else if (model.get('profileSex') == 'Female'){
      controller.set('otherSexText', '');
    } else {
      controller.set('otherSexText', model.get('profileSex'));
    }

    controller.set('displayAge', model.get('profileAge'));
    controller.set('inputAge', model.get('profileAge'));

    controller.set('displayLocation', model.get('profileLocation'));
    controller.set('inputlocation', model.get('profileLocation'));

    controller.set('displayLanguages', model.get('profileLanguages'));
    controller.set('inputLanguages', model.get('profileLanguages'));
  }
});
