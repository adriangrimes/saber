import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),
  currentUser: service(),

  currentPage: 1,
  totalTransactionPages: 0,
  totalTransactions: 0,
  remainingCubesToPayout: 0,

  actions: {
    getTransactionPage(page) {
      this.set('currentPage', page);
      console.log('getting transaction page', page);
      this.store
        .query('transaction', {
          id: this.session.data.authenticated.user_id,
          page: page
        })
        .then(transactions => {
          console.log(transactions);
          if (transactions.firstObject) {
            this.set('transactions', transactions);
            this.set('totalTransactions', transactions.meta.totalTransactions);
            this.set('totalTransactionPages', transactions.meta.totalPages);
            this.set(
              'remainingCubesToPayout',
              transactions.meta.remainingCubesToPayout
            );
          } else {
            this.set('transactions', [{ details: 'No transactions' }]);
          }
        })
        .catch(err => {
          console.log('error getting transactions:', err);
          this.errorHandler.handleWithNotification(err);
        });
    }
  }
});
