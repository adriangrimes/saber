import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import RSVP from 'rsvp';

export default Route.extend(AuthenticatedRouteMixin, {
  beforeModel() {
    // if user signed up through a contractor signup page, redirect them to fill out
    // their payment and tax profile
    return this.currentUser.load().then(() => {
      if (this.currentUser.user.broadcasterSignup) {
        this.replaceWith('account.broadcaster');
      } else if (this.currentUser.user.developerSignup) {
        this.replaceWith('account.developer');
      } else if (this.currentUser.user.affiliateSignup) {
        this.replaceWith('account.affiliate');
      }
    });
  },

  model() {
    return RSVP.hash({
      user: this.store.findRecord(
        'user',
        this.get('session.data.authenticated.user_id'),
        { reload: true }
      ),
      contractorApplication: this.store
        .queryRecord('contractor-application', {}, { reload: true })
        .catch(err => {
          if (err.errors[0] && err.errors[0].status == 404) {
            return this.store.createRecord('contractor-application', {});
          }
        })
    });
  },

  setupController(controller, model) {
    this._super(controller, model);
    // Set account settings to settings pulled from db
    controller.set(
      'inputPayoutType',
      model.contractorApplication.get('payoutMethod')
    );
    if (model.contractorApplication.get('payoutMethod') == 'bitcoin') {
      controller.set('payoutIsBitcoin', true);
    }
    controller.set(
      'inputbitcoinaddress',
      model.contractorApplication.get('bitcoinAddress')
    );
    controller.set(
      'inputaddress1',
      model.contractorApplication.get('addressLine1')
    );
    controller.set(
      'inputaddress2',
      model.contractorApplication.get('addressLine2')
    );
    if (model.contractorApplication.get('addressLine3') != null) {
      var address3 = model.contractorApplication.get('addressLine3').split('|');
      controller.set('inputCity', address3[0]);
      controller.set('inputRegion', address3[1]);
      controller.set('inputZipcode', address3[2]);
      controller.set('inputCountry', address3[3]);
    }

    if (model.user.get('securityQuestions') != null) {
      var allQuestions = model.user.get('securityQuestions').split('|');
      controller.set('inputQuestion1', allQuestions[0]);
      controller.set('inputAnswer1', allQuestions[1]);
      controller.set('inputQuestion2', allQuestions[2]);
      controller.set('inputAnswer2', allQuestions[3]);
      controller.set('inputQuestion3', allQuestions[4]);
      controller.set('inputAnswer3', allQuestions[5]);
    }


    controller.set(
      'sendEmailFollowedOnline',
      model.user.get('sendEmailFollowedOnline')
    );
    controller.set(
      'privateMessageEmailNotifications',
      model.user.get('privateMessageEmailNotifications')
    );
    controller.set('sendEmailSiteNews', model.user.get('sendEmailSiteNews'));

    controller.set('inputTimeZone', model.user.get('timezone'));
  },

  actions: {
    willTransition(/*transition*/) {
      // Clears any unused created records
      this.controller.get('model.contractorApplication').rollbackAttributes();
      // bubble
      return true;
    }
  }
});
