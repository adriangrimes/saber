import Route from '@ember/routing/route';


let helpTopic =[
  {
   shortTitle: 'accountSignupHelp',
   title: 'Account and Sign Up',
   all: true,
   devCasters: true,
   broadcasters: true,
   developers: true,

   helpSections: [
          {
            'sectionTitle' : 'Where do I sign up? This should be visible by everyone',
            'sectionBody' : 'Right <a href="/signup">here</a> why thanks for asking!',
            },
            {
            'sectionTitle' : 'Second Title',
            'sectionBody' : 'Second Body',
          },
        ]
},
{
   shortTitle: 'rulesHelp',
   title: 'Site Rules',
   all: true,
   devCasters: true,
   broadcasters: true,
   developers: true,
   helpSections: [
          {

            {
            'sectionTitle' : 'NO GIRAFFES!',
            'sectionBody' : 'I mean seriousy. ',
          },
        ]

},
{
   shortTitle: 'payoutHelp',
   title: 'Getting Paid',
   all: false,
   devCasters: true,
   broadcasters: true,
   developers: true,
   helpSections: [
          {
            'sectionTitle' : 'This should be visible by Devs and Broadcasters',
            'sectionBody' : 'Lots of ways! Check',
            },

        ]
},
{
   shortTitle: 'devHelp',
   title: 'Game Development',
   all: false,
   devCasters: true,
   broadcasters: false,
   developers: true,
   helpSections: [

          {
          'sectionTitle' : 'Where do documentations live?',
          'sectionBody' : 'Right over here:',
        },
        ]
},
{
   shortTitle: 'streamHelp',
   title: 'Live Streaming',
   all: false,
   devCasters: true,
   broadcasters: true,
   developers: false,
   helpSections: [
          {
            'sectionTitle' : 'This should be visible by Broadcasters',
            'sectionBody' : 'Ya need some software',
            },

        ]
},

];

export default Route.extend({

  model: function(){
    return helpTopic;
  }



});
