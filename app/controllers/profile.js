import Ember from 'ember';

export default Ember.Controller.extend({

  isFavorite: false,
  tags: ['dragons','dungeons','wednesday', 'cheeser','toodles'],

  actions: {
    toggleFav(){
      this.toggleProperty('isFavorite');
    },
    submitmsg(){
      var clientmsg = this.$("#usermsg").val();
      this.$("#usermsg").val('');
      console.log(clientmsg);
      return false;
    },
    setupController: function(controller, model) {
      controller.set('user', model);
    },
  }

});
