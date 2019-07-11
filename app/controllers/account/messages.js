import Controller from '@ember/controller';

export default Controller.extend({

    selectedFromUserID: '0',

    userMessages:[
      { fromUserID:'1',
        toUserID:'2',
        fromUserName: 'Username1',
        text: 'messagetext' ,
        time: 'Sent at time',
      },
      { fromUserID:'2',
        toUserID:'2',
        fromUserName: 'Username2',
        text: 'messagetext' ,
        time: 'Sent at time',
      },
      { fromUserID:'3',
        toUserID:'2',
        fromUserName: 'Username3',
        text: 'messagetext' ,
        time: 'Sent at time',
      },
      { fromUserID:'1',
        toUserID:'2',
        fromUserName: 'Username1',
        text: 'messagetext' ,
        time: 'Sent at time',
      },
      { fromUserID:'1',
        toUserID:'2',
        fromUserName: 'Username1',
        text: 'messagetext' ,
        time: 'Sent at time',
      },
    ],


    actions:{

      openMessages(fromUserID){
        console.log('opening messages from'+fromUserID);
        this.set('selectedFromUserID', fromUserID);

      },


    },


});
