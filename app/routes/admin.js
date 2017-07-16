import Ember from 'ember';

let verificationNeeded =[{
   id: 1,
   photo1: '/usericon.svg',
   photo2: '/usericon.svg',
   username: "User1",
   fullName: "Human Name1",
   country: "Country1",
   streetAddress1: "Address 1",
   streetAddress2: "Apt.101",
    city: "PlaceTown",
    state: "PL",
    postalCode: "11111",
    payoutMethod: "Check1",
    account: "Address"


},
{
   id: 2,
   photo1: '/usericon.svg',
   photo2: '/usericon.svg',
   username: "User2",
   fullName: "Human Name2",
   country: "Country1",
   streetAddress1: "Address 1",
   streetAddress2: "Apt.101",
    city: "PlaceTown",
    state: "PL",
    postalCode: "11111",
    payoutMethod: "Check1",
    account: "Address"

},
{
   id: 3,
   photo1: '/usericon.svg',
   photo2: '/usericon.svg',
   username: "User3",
   fullName: "Human Name3",
   country: "Country1",
   streetAddress1: "Address 1",
   streetAddress2: "Apt.101",
    city: "PlaceTown",
    state: "PL",
    postalCode: "11111",
    payoutMethod: "Check1",
    account: "Address"
},
{
   id: 4,
   photo1: '/usericon.svg',
   photo2: '/usericon.svg',
   username: "User4",
   fullName: "Human Name1",
   country: "Country1",
   streetAddress1: "Address 1",
   streetAddress2: "Apt.101",
    city: "PlaceTown",
    state: "PL",
    postalCode: "11111",
    payoutMethod: "Check1",
    account: "Address"
},
{
   id: 5,
   photo1: '/usericon.svg',
   photo2: '/usericon.svg',
   username: "User5",
   fullName: "Human Name5",
   country: "Country1",
   streetAddress1: "Address 1",
   streetAddress2: "Apt.101",
    city: "PlaceTown",
    state: "PL",
    postalCode: "11111",
    payoutMethod: "Check1",
    account: "Address"
 },
 {
    id: 6,
    photo1: '/usericon.svg',
    photo2: '/usericon.svg',
    username: "User6",
    fullName: "Human Name6",
    country: "Country1",
    streetAddress1: "Address 1",
    streetAddress2: "Apt.101",
     city: "PlaceTown",
     state: "PL",
     postalCode: "11111",
     payoutMethod: "Check1",
     account: "Address"
}];

export default Ember.Route.extend({


      model: function(){
        return verificationNeeded;

      }

});
