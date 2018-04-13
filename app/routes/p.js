import Route from '@ember/routing/route';


let profile =[
{
  id: 1,
  username: 'One',
},
{
  id: 2,
  username: 'Two',
}];

export default Route.extend({

    model: function(){
      return profile;

    }
});
