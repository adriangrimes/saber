import Controller from '@ember/controller';

//Controller - application
export default Controller.extend({

  actions: {
    logout() {
      this.get('loginState').logOut();
      this.transitionToRoute('index');
    }
  }

});
