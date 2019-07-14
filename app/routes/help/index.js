import Route from '@ember/routing/route';


let helpTopic =[
  {
   shortTitle: 'accountSignupHelp',
   title: 'Account and Sign Up',
   all: true,
   isContractedOnly: false,
   broadcastersOnly: false,
   developersOnly: false,

   helpSections: [
          {
            'sectionTitle' : 'Where do I sign up?',
            'sectionBody' : 'Right <br><a href="/signup">here</a> why thanks for asking!',
            },
            {
            'sectionTitle' : 'How do you use my email address?',
            'sectionBody' : 'A verifiable email address is required for signup. This will not be shown anywhere on the site, and is used solely for account management and your chosen notifications. If you created an account with an email address you do not have access to, you will not be able to make another account with that username for two days. Unconfirmed accounts will be deleted two days after their creation.',
          },
          {
          'sectionTitle' : 'Username Rules',
          'sectionBody' : ' Usernames can be between 3 and 26 characters long, and include alphanumeric characters and hyphens (-) and underscores (_).',
          },
          {
          'sectionTitle' : 'Forgotten Password',
          'sectionBody' : 'If you have forgotten your password, visit the <A TAG NEEDED>forgot your password page</a> to recover your account.',
        },
        ]
},
{
   shortTitle: 'payoutHelp',
   title: 'Getting Paid',
   all: false,
   isContractedOnly: true,
   broadcastersOnly: false,
   developersOnly: false,

   helpSections: [
          {
            'sectionTitle' : 'This should be visible by Devs and Broadcasters',
            'sectionBody' : 'Lots of ways! Check',
            },
            {
            'sectionTitle' : 'Payout Requirments',
            'sectionBody' : 'You need at least $XX.XX in your account when payments are processed to be receive payment.',
          },
          {
          'sectionTitle' : 'Payroll Day',
          'sectionBody' : 'Payments are processed on the XX and the XX of every month.',
        },
        ]
},
{
   shortTitle: 'devHelp',
   title: 'Game Development',
   all: false,
   isContractedOnly: false,
   broadcastersOnly: false,
   developersOnly: true,

   helpSections: [
          {
            'sectionTitle' : 'How can I API? This should be visible by Developers',
            'sectionBody' : 'Lots of ways! Check 123 testing',
            },
            {
            'sectionTitle' : 'Game Requirments',
            'sectionBody' : 'HTML5 or Flash pls.',
          },
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
   isContractedOnly: false,
   broadcastersOnly: true,
   developersOnly: false,

   helpSections: [
          {
            'sectionTitle' : 'How can I RTMP? This should be visible by Broadcasters',
            'sectionBody' : 'Ya need some software m8',
            },
            {
            'sectionTitle' : 'But no software pls.',
            'sectionBody' : 'Fine do a quick stream from your browser',
          },
          {
          'sectionTitle' : 'What settings should I use?',
          'sectionBody' : 'Good question',
        },
        ]
},

];

export default Route.extend({

  model: function(){
    return helpTopic;
  }



});
