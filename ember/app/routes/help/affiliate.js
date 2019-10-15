import Route from '@ember/routing/route';

let helpTopic = [
  {
    shortTitle: 'accountSignupHelp',
    title: 'Account and Sign Up',
    all: true,
    isContractedOnly: false,
    broadcastersOnly: false,
    developersOnly: false,

    helpSections: [
      {
        sectionTitle: 'Where do I sign up? This should be visible by everyone',
        sectionBody: 'Right <a href="/signup">here</a> why thanks for asking!'
      },
      {
        sectionTitle: 'Second Title',
        sectionBody: 'Second Body'
      }
    ]
  },
  {
    shortTitle: 'rulesHelp',
    title: 'Site Rules',
    all: true,
    isContractedOnly: false,
    broadcastersOnly: false,
    developersOnly: false,

    helpSections: [
      {
        sectionTitle: 'NO GIRAFFES!',
        sectionBody: 'I mean seriousy. '
      }
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
        sectionTitle: 'This should be visible by Devs and Broadcasters',
        sectionBody: 'Lots of ways! Check'
      },
      {
        sectionTitle: 'Payout Requirments',
        sectionBody:
          'You need at least $XX.XX in your account when payments are processed to be receive payment.'
      },
      {
        sectionTitle: 'Payroll Day',
        sectionBody:
          'Payments are processed on the XX and the XX of every month.'
      }
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
        sectionTitle: 'How can I API? This should be visible by Developers',
        sectionBody: 'Lots of ways! Check 123 testing'
      },
      {
        sectionTitle: 'Where do documentations live?',
        sectionBody: 'Right over here:'
      }
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
        sectionTitle: 'How can I RTMP? This should be visible by Broadcasters',
        sectionBody: 'Ya need some software m8'
      {
        sectionTitle: 'What settings should I use?',
        sectionBody: 'Good question'
      }
    ]
  }
];

export default Route.extend({
  model() {
    return helpTopic;
  }
});
