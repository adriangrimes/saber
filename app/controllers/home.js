import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    search() {
      this.set('searchInput', this.get('searchInput').trim());
      if (this.get('searchInput')) {
        console.log('searching');
        console.log(this.get('searchInput'));
        this.store
          .query('user-public-datum', {
            search: this.get('searchInput')
          })
          .then(results => {
            this.set('model', results);

            console.log(results);
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.store
          .query('user-public-datum', {})
          .then(results => {
            this.set('model', results);

            console.log(results);
          })
          .catch(err => {
            console.log(err);
          });
      }
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
