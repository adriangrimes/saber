import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),

  currentPage: 1,
  totalTransactionPages: 0,
  totalTransactions: 0,

  actions: {
    getTransactions() {
      console.log('getting transactions');
      this.store
        .query('transaction', {
          id: this.session.data.authenticated.user_id,
          page: this.currentPage
        })
        .then(transactions => {
          console.log(transactions);
          this.set('transactions', transactions);
          this.set('totalTransactions', transactions.meta.totalTransactions);
          this.set('totalTransactionPages', transactions.meta.totalPages);
        })
        .catch(err => {
          console.log('error getting transactions:', err);
          this.errorHandler.handleWithNotification(err);
        });
    },

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
          this.set('transactions', transactions);
          this.set('totalTransactions', transactions.meta.totalTransactions);
          this.set('totalTransactionPages', transactions.meta.totalPages);
        })
        .catch(err => {
          console.log('error getting transactions:', err);
          this.errorHandler.handleWithNotification(err);
        });
    }
  }
});
