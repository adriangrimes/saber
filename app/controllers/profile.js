import Ember from 'ember';

export default Ember.Controller.extend({

  isFavorite: false,

  actions: {
    toggleFav(){
      this.toggleProperty('isFavorite');
    },
      submitmsg(){
  		var clientmsg = $("#usermsg").val();
  		$("#usermsg").val('');
            console.log(clientmsg);
  		return false;
	 },

      setupController: function(controller, model) {
        controller.set('user', model);
      },


  }

});
