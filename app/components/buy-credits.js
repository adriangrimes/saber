import Component from '@ember/component';
import { inject } from '@ember/service';

//Component - buy-credits
export default Component.extend({
  store: inject(),
  session: inject(),

  actions: {
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
