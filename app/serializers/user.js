import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  serialize() {
    let user = this._super(...arguments);

    user.email = user.data.attributes.email;
    user.username = user.data.attributes.username;
    user.password = user.data.attributes.password;
    user.passwordConfirmation = user.data.attributes.passwordConfirmation;


    delete user.data;

    return user;
  },
});
