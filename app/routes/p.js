import Ember from 'ember';


let profile =[
{
  id: 1,
  username: 'One',
},
{
  id: 2,
  username: 'Two',
}];

export default Ember.Route.extend({

    model: function(){
      return profile;

    }
});
