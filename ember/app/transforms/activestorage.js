import DS from 'ember-data';
import { isNone } from '@ember/utils';

export default DS.Transform.extend({
  deserialize(serialized) {
    return isNone(serialized) ? [] : serialized;
  },

  serialize(deserialized) {
    return isNone(deserialized) ? [] : deserialized ;
  }
});
