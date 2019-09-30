import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import RSVP from 'rsvp';

export default Route.extend(AuthenticatedRouteMixin, {
  model() {
    return RSVP.hash({
      user: this.store.findRecord(
        'user',
        this.get('session.data.authenticated.user_id')
      ),
      userVerificationUploads: this.store.query('user-verification-upload', {
        id: this.get('session.data.authenticated.user_id')
      })
    });
  },

  setupController(controller, model) {
    this._super(controller, model);
    // Set account settings to settings pulled from db
    // controller.set('inputFullName', model.user.get('fullName'));
    controller.set('applicationIsPending', model.user.pendingApplication);
    if (model.user.get('businessName')) {
      controller.set('isBusiness', true);
      // controller.set('inputBusinessName', model.user.get('businessName'));
      if (model.user.get('businessEntityType')) {
        var entityType = model.user.get('businessEntityType').split('|');
        if (entityType[0] == 'Other') {
          controller.set('inputEntityType', entityType[0]);
          controller.set('otherEntityText', entityType[1]);
        } else {
          controller.set(
            'inputEntityType',
            model.user.get('businessEntityType')
          );
        }
      }
    }

    if (model.user.get('birthdate')) {
      var bday = model.user.get('birthdate').toString();
      var bdaystr = bday.split(' ');
      controller.set('inputMonth', bdaystr[1]);
      controller.set('inputDay', bdaystr[2]);
      controller.set('inputYear', bdaystr[3]);
    } // else {
    //   controller.set('inputMonth', 'Month');
    //   controller.set('inputDay', 'Day');
    //   controller.set('inputYear', 'Year');
    // }
    controller.set('inputPayoutType', model.user.get('payoutMethod'));
    if (model.user.get('payoutMethod') == 'bitcoin') {
      controller.set('payoutIsBitcoin', true);
    }
    // controller.set('inputbitcoinaddress', model.user.get('bitcoinAddress'));

    // controller.set('inputaddress1', model.user.get('addressLine1'));
    // controller.set('inputaddress2', model.user.get('addressLine2'));
    if (model.user.get('addressLine3')) {
      var address3 = model.user.get('addressLine3').split('|');
      controller.set('inputCity', address3[0]);
      controller.set('inputRegion', address3[1]);
      controller.set('inputZipcode', address3[2]);
      controller.set('inputCountry', address3[3]);
      if (address3[3] == 'United States') {
        controller.set('isUSA', true);
      } else if (address3[3] != null) {
        controller.set('notUSA', true);
      }

      // controller.set(
      //   'withholdingInput',
      //   model.user.get('subjectToBackupWithholding')
      // );
    }
  }
});
