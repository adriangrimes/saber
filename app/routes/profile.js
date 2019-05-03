import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
// import { A } from '@ember/array';
// import ArrayProxy from '@ember/array/proxy';

export default Route.extend(AuthenticatedRouteMixin, {

  model() {
    return this.store.queryRecord('user-public-datum',
      { user_id: this.get('session.data.authenticated.user_id') });
  },

  setupController(controller, model) {
    // Set profile info to settings pulled from db in display profile and edit modal
    this._super(controller, model);

    controller.set('tempSexText', '');
    if (model.get('profileSex') == 'Male') {
      controller.set('tempSexSelection', 'Male');
    } else if (model.get('profileSex') == 'Female') {
      controller.set('tempSexSelection', 'Female');
    } else {
      controller.set('tempSexSelection', 'Other');
      controller.set('tempSexText', model.get('profileSex'));
      controller.set('checkOtherSex', true);
    }

    if (model.get('userCustomTags') != null) {
      controller.set('tags', model.get('userCustomTags').split(","));
    }

  }
});
