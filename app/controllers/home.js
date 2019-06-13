import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    search() {
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
    }
  }
});
