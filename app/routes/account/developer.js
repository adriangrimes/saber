import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';


export default Route.extend(AuthenticatedRouteMixin, {
  model() {
    return this.get('store').findRecord('user', this.get('session.data.authenticated.user_id') );

  },

  setupController(controller,model) {
    this._super(controller, model);
    // Set account settings to settings pulled from db
    controller.set('inputfirstName', model.get('firstName'));
    controller.set('inputmiddleName', model.get('middleName'));
    controller.set('inputlastName', model.get('lastName'));
    if (model.get('birthdate') != null){
      var bday = model.get('birthdate').toString();
      var bdaystr = bday.split(" ");
      controller.set('inputMonth', bdaystr[1]);
      controller.set('inputDay', bdaystr[2]);
      controller.set('inputYear', bdaystr[3]);
    }else{
      controller.set('inputMonth', 'Month');
      controller.set('inputDay', 'Day');
      controller.set('inputYear', 'Year');
    }
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
