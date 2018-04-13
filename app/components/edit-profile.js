import Component from '@ember/component';

//Component - log-in
export default Component.extend({

  actions: {
    addTag(tag) {
      if (this.tags.length < 10){
        this.tags.pushObject(tag);
      }
    },
    removeTagAtIndex(index) {
      this.tags.removeAt(index);
    }
  },

  init() {
    this._super(...arguments);
    this.tags = [];
  }

});
