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
      contractorApplication: this.store
        .queryRecord('contractor-application', {}, { reload: true })
        .catch(err => {
          if (err.errors[0].status == 404) {
            return this.store.createRecord('contractor-application', {});
          }
        }),
      userVerificationUploads: this.store.query('user-verification-upload', {
        id: this.get('session.data.authenticated.user_id')
      })
    });
  },

  setupController(controller, model) {
    this._super(controller, model);
    // Set account settings to settings pulled from db
    // controller.set('inputFullName', model.contractorApplication.get('fullName'));
    controller.set(
      'applicationIsPending',
      model.contractorApplication.pendingBroadcasterApplication
    );
    if (model.contractorApplication.get('businessName')) {
      controller.set('isBusiness', true);
      // controller.set('inputBusinessName', model.contractorApplication.get('businessName'));
      if (model.contractorApplication.get('businessEntityType')) {
        var entityType = model.contractorApplication
          .get('businessEntityType')
          .split('|');
        if (entityType[0] == 'Other') {
          controller.set('inputEntityType', entityType[0]);
          controller.set('otherEntityText', entityType[1]);
        } else {
          controller.set(
            'inputEntityType',
            model.contractorApplication.get('businessEntityType')
          );
        }
      }
    }

    if (model.contractorApplication.get('birthdate')) {
      console.log(model.contractorApplication.get('birthdate').toISOString());
      var birthdate = model.contractorApplication.get('birthdate');
      controller.set('inputMonth', controller.monthsList[birthdate.getMonth()]);
      controller.set('inputDay', birthdate.getDate().toString());
      controller.set('inputYear', birthdate.getFullYear().toString());
    }
    controller.set(
      'inputPayoutType',
      model.contractorApplication.get('payoutMethod')
    );
    if (model.contractorApplication.get('payoutMethod') == 'bitcoin') {
      controller.set('payoutIsBitcoin', true);
    }
    // controller.set('inputbitcoinaddress', model.contractorApplication.get('bitcoinAddress'));

    // controller.set('inputaddress1', model.contractorApplication.get('addressLine1'));
    // controller.set('inputaddress2', model.contractorApplication.get('addressLine2'));
    if (model.contractorApplication.get('addressLine3')) {
      var address3 = model.contractorApplication.get('addressLine3').split('|');
      controller.set('inputCity', address3[0]);
      controller.set('inputRegion', address3[1]);
      controller.set('inputZipcode', address3[2]);
      controller.set('inputCountry', address3[3]);
      controller.set(
        'inputTIN',
        model.contractorApplication.get('businessIdentificationNumber')
      );
      if (address3[3] == 'United States') {
        controller.set('isUSA', true);
      } else if (address3[3] != null) {
        controller.set('notUSA', true);
      }
      controller.set(
        'withholdingInput',
        model.contractorApplication.get('subjectToBackupWithholding')
      );
    }
  },

  actions: {
    willTransition(/*transition*/) {
      this.controller.get('model.contractorApplication').rollbackAttributes();
      return true;
    }
  }
});
