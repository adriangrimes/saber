import Ember from 'ember';


let broadcaster =[{
   id: 1,
   username: 'Test Caster1',
   photo: '/testimg.jpg'
},
{
   id: 2,
   username: 'Test Caster2',
   photo: '/usericon.svg'
},
{
   id: 3,
   username: 'Test Caster3',
   photo: '/usericon.svg'
},
{
   id: 4,
   username: 'Test Caster4',
   photo: '/usericon.svg'
},
{
   id: 5,
   username: 'Test Caster5',
   photo: '/usericon.svg'
},
{
   id: 6,
   username: 'Test Caster6',
   photo: '/usericon.svg'
},
{
   id: 7,
   username: 'Test Caster7',
   photo: '/usericon.svg'
},
{
   id: 8,
   username: 'Test Caster8',
   photo: '/usericon.svg'
},
{
   id: 9,
   username: 'Test Caster9',
   photo: '/usericon.svg'
},
{
   id: 10,
   username: 'Test Caster10',
   photo: '/usericon.svg'
},
{
   id: 11,
   username: 'Test Caster11',
   photo: '/usericon.svg'
},
{
   id: 12,
   username: 'Test Caster12',
   photo: '/usericon.svg'
},
{
   id: 13,
   username: 'Test Caster13',
   photo: '/usericon.svg'
},
{
   id: 14,
   username: 'Test Caster14',
   photo: '/usericon.svg'
},
{
   id: 15,
   username: 'Test Caster15',
   photo: '/usericon.svg'
},
{
   id: 16,
   username: 'Test Caster16',
   photo: '/usericon.svg'
},
{
   id: 17,
   username: 'Test Caster17',
   photo: '/usericon.svg'
}];
export default Ember.Route.extend({

  model: function(){
    return broadcaster;

  }

});
