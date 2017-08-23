import Ember from 'ember';

//Component - log-in
export default Ember.Component.extend({
  tags: [],

  actions: {

    addTag(tag) {
      if (this.get('tags').length < 10){
        this.get('tags').pushObject(tag);
      }
       },
     removeTagAtIndex(index) {
       this.get('tags').removeAt(index);
    }
  }

});
