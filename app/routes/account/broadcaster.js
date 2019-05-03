import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';


export default Route.extend(AuthenticatedRouteMixin, {
  model() {
    return this.store.findRecord('user', this.get('session.data.authenticated.user_id') );

  },

  setupController(controller,model) {
    this._super(controller, model);
    // Set account settings to settings pulled from db
    controller.set('inputFullName', model.get('fullName'));
    if(model.get('businessName') != null){
      controller.set('isBusiness', true);
      controller.set('inputBusinessName', model.get('businessName'));
      if(model.get('businessEntityType') != null){

        var entityType = model.get('businessEntityType').split("|");
        if (entityType[0] == 'Other'){
          controller.set('inputEntityType', entityType[0]);
          controller.set('otherEntityText', entityType[1]);

        }else{
          controller.set('inputEntityType', model.get('businessEntityType'));

        }

      }

    }




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
    controller.set('inputPayoutType', model.get('payoutMethod'));
    if(model.get('payoutMethod') == 'bitcoin'){
      controller.set('payoutIsBitcoin', true);
    }
    controller.set('inputbitcoinaddress', model.get('bitcoinAddress'));


    controller.set('inputaddress1', model.get('addressLine1'));
    controller.set('inputaddress2', model.get('addressLine2'));
    if (model.get('addressLine3') != null){

      var address3 = model.get('addressLine3').split("|");
      controller.set('inputCity', address3[0]);
      controller.set('inputRegion', address3[1]);
      controller.set('inputZipcode', address3[2]);
     controller.set('inputCountry', address3[3]);
      if (address3[3] == "United States"){
        controller.set('isUSA', true);
    } else if (address3[3] != null){
      controller.set('notUSA', true);
    }

    controller.set('withholdingInput', model.get('subjectToBackupWithholding'));

  }
}
});
