import Route from '@ember/routing/route';

export default Route.extend({

  model() {
    return this.store.findAll('user-public-datum');//.catch(...) for 404s TODO
  }  

});
