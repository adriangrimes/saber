import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return this.store.query('user-public-datum', {}); //.catch(...) for 404s TODO
  }
});