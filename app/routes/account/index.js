import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, {

  model() {
    return this.get('store').findRecord('user', this.get('session.data.authenticated.user_id') );
  },

  setupController(controller,model) {
    this._super(controller, model);
    // Set account settings to settings pulled from db
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
    }

    if (model.get('securityQuestions') != null){
     var allQuestions = model.get('securityQuestions').split("|");
       controller.set('inputQuestion1', allQuestions[0]);
       controller.set('inputAnswer1', allQuestions[1]);
       controller.set('inputQuestion2', allQuestions[2]);
       controller.set('inputAnswer2', allQuestions[3]);
       controller.set('inputQuestion3', allQuestions[4]);
       controller.set('inputAnswer3', allQuestions[5]);
    }


    controller.set('sendEmailFavoritesOnline', model.get('sendEmailFavoritesOnline'));
    controller.set('privateMessageEmailNotifications', model.get('privateMessageEmailNotifications'));
    controller.set('sendEmailSiteNews', model.get('sendEmailSiteNews'));

    controller.set('inputTimeZone', model.get('timezone'));


   }

  // actions: {
  //   loading(transition) {
  //     let start = new Date();
  //     transition.promise.finally(() => {
  //       console.log(`Took ${new Date() - start}ms to load`);
  //     });
  //
  //     return true;
  //   }
  // }
});
