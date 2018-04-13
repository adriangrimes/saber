import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    removeFavoriteUser(user){
      console.log('removed favorite user: '+user.username);
    },
    removeBlockedUser(user) {
      console.log('removed blocked user: '+user.username);
    }
  }
});
