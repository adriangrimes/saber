import DS from 'ember-data';

export default DS.Transform.extend({
  deserialize(serialized) {
    // Unary + to convert string to an integer
    return new Date(+serialized).toLocaleDateString('default', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  },

  serialize() {
    return;
  }
});
