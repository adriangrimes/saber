import Ember from 'ember';

export default Ember.Controller.extend({
  openSearchTab: function() {
      Ember.$(this).tab('show');

  },

});
