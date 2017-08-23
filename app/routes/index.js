import Ember from 'ember';


let broadcaster =[{
  userid: 1,
   username: 'Test Caster1',
   photo: '/testimg.jpg',
   online: true,
   topic: 'text topic of things and stuff wooo long topic example yaaaeeeaaaa'
},
{
    userid: 2,
   username: 'Test Caster2',
   photo: '/usericon.svg',
   online: true,
   topic: 'text topic of things and stuff'

},
{
    userid: 3,
   username: 'Test Caster3',
   photo: '/usericon.svg',
   online: true,
   topic: 'text topic of things and stuff'

},
{
    userid: 4,
   username: 'Test Caster4',
   photo: '/usericon.svg',
   online: true,
   topic: 'text topic of things and stuff'

},
{
    userid: 5,
   username: 'Test Caster5',
   photo: '/usericon.svg',
   online: false,
   topic: 'text topic of things and stuff'

},
{
    userid: 6,
   username: 'Test Caster6',
   photo: '/usericon.svg',
   online: false,
   topic: 'text topic of things and stuff'

},
{
    userid: 7,
   username: 'Test Caster7',
   photo: '/usericon.svg',
   online: false,
   topic: 'text topic of things and stuff'
},
{
    userid: 8,
   username: 'Test Caster8',
   photo: '/usericon.svg',
   online: false,
   topic: 'text topic of things and stuff'

},
{
    userid: 9,
   username: 'Test Caster9',
   photo: '/usericon.svg',
   online: false,
   topic: 'text topic of things and stuff'

},
{
    userid: 10,
   username: 'Test Caster10',
   photo: '/usericon.svg',
   online: false,
   topic: 'text topic of things and stuff'

},
{
    userid: 11,
   username: 'Test Caster11',
   photo: '/usericon.svg',
   online: false,
   topic: 'text topic of things and stuff'

},
{
    userid: 12,
   username: 'Test Caster12',
   photo: '/usericon.svg',
   online: false,
   topic: 'text topic of things and stuff'

},
{
    userid: 13,
   username: 'Test Caster13',
   photo: '/usericon.svg',
   online: false,
   topic: 'text topic of things and stuff'

},
{
    userid: 14,
   username: 'Test Caster14',
   photo: '/usericon.svg',
   online: false,
   topic: 'text topic of things and stuff'

},
{
    userid: 15,
   username: 'Test Caster15',
   photo: '/usericon.svg',
   online: true,
   topic: 'text topic of things and stuff'

},
{
    userid: 16,
   username: 'Test Caster16',
   photo: '/usericon.svg',
   online: false,
   topic: 'text topic of things and stuff'

},
{
    userid: 17,
   username: 'Test Caster17',
   photo: '/usericon.svg',
   online: true,
   topic: 'text topic of things and stuff'

}];
export default Ember.Route.extend({

  model: function(){
    return broadcaster;

  }

});
