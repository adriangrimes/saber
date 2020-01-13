import Component from '@ember/component';
import { inject as service } from '@ember/service';
import jQuery from 'jquery';

//Component - buy-credits
export default Component.extend({
  store: service(),
  session: service(),

  package1: 100,
  package2: 250,
  package3: 500,
  package4: 750,
  package5: 1000,

  actions: {
    selectAmount(amount) {
      console.log('buy this many credits' + amount);
      jQuery('#' + amount)
        .prop('checked', true)
        .change();
    },

    purchaseCredits() {
      console.log('purchasing: ', this.get('creditAmount'));

      let creditPurchase = this.store.createRecord('credit-purchase', {
        userId: this.get('session.data.authenticated.user_id'),
        creditsPurchased: this.get('creditAmount')
      });

      creditPurchase
        .save()
        .then(() => {
          console.log('purchased: ', this.get('creditAmount'));
          this.currentUser.load();
        })
        .catch(() => {
          console.log('failed to purchase');
        });
    }
  }
});
