import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  store: service(),

  searchInput: '',

  actions: {
    search() {
      this.set('searchInput', this.get('searchInput').trim());
      console.log('searching');
      console.log(this.get('searchInput'));
      let params = { };
      if (this.searchInput) {
        params.search = this.get('searchInput');
      }
      this.store
        .query('user-public-datum', params, { reload: true })
        .then(results => {
          this.set('model', results);
          console.log(results);
        })
        .catch(err => {
          console.log('error getting search results', err);
          this.errorHandler.handleWithNotification(err);
        });
    },

    // Testing back-end response time on full reload of browse results
    reloadBrowsePageTest() {
      console.log('you found my lucky charms');
      this.store
        .query('user-public-datum', {}, { reload: true })
        .then(browseData => {
          this.set('model', browseData);
        });
      return false;
    }
  }
});
