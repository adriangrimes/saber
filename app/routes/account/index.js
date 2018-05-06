import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, {

  model() {
    return this.get('store').findRecord('user', this.get('session.data.authenticated.user_id') );
  },

  setupController(controller,model) {
    this._super(controller, model);
    // Set account settings to settings pulled from db

    controller.set('sendEmailFavoritesOnline', model.get('sendEmailFavoritesOnline'));
    controller.set('sendEmailSiteNews', model.get('sendEmailSiteNews'));
    controller.set('darkMode', model.get('darkMode'));
    controller.set('inputTimeZone', model.get('timezone'));
    controller.set('inputaddress1', model.get('addressLine1'));
    controller.set('inputaddress2', model.get('addressLine2'));
    if (model.get('addressLine3') != null){

      var address3 = model.get('addressLine3').split("|");
      controller.set('inputCity', address3[0]);
      controller.set('inputRegion', address3[1]);
      controller.set('inputZipcode', address3[2]);
     controller.set('inputCountry', address3[3]);
    }


   }
});
