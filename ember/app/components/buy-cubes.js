import Component from '@ember/component';
import { inject as service } from '@ember/service';
import jQuery from 'jquery';

//Component - buy-cubes
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
      console.log('buy this many cubes' + amount);
      jQuery('#' + amount)
        .prop('checked', true)
        .change();
    },

    purchaseCubes() {
      console.log('purchasing: ', this.get('cubeAmount'));

      let cubePurchase = this.store.createRecord('cube-purchase', {
        userId: this.get('session.data.authenticated.user_id'),
        cubesPurchased: this.get('cubeAmount')
      });

      cubePurchase
        .save()
        .then(() => {
          console.log('purchased: ', this.get('cubeAmount'));
          this.currentUser.load();
        })
        .catch(() => {
          console.log('failed to purchase');
        });
    }
  }
});
