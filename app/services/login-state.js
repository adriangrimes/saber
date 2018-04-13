import { computed } from '@ember/object';
import Service from '@ember/service';
import { inject as service } from '@ember/service';
import $ from 'jquery';

export default Service.extend({

  store: service(),
  session: service(),
  isOnline: true,
  userId: '',
  username: '',
  broadcaster: false,
  developer: false,
  adminStatus: false,
  darkMode: false,
  devCaster: computed('broadcaster', 'developer', function() {
    if (this.get('broadcaster') === true || this.get('developer') === true) {
      return true;
    } else {
      return false;
    }
  }),
  errorMessage: '',
  signupSuccess: false,


  init() {
    this._super(...arguments);

  },

  //do login work here
  logIn(identification, password) {
    if (identification && password) {

      //add a spinner and remove text
      $('#loginModal > div > div > form > div > button > div').addClass('spinner');
      $("#loginModal > div > div > form > div > button > div").contents().filter(function () {
        console.log('activating spinner - removing text');
        return this.nodeType === 3; // Text nodes only
      }).remove();

      console.log('authenticate go!');
      this.get('session').authenticate('authenticator:devise', identification, password).then(() => {
        console.log('username: ' + this.get('session.data.authenticated.username'));
        $('#loginModal').modal('hide'); //close log in modal
        return this.get('store').findRecord('user', this.get('session.data.authenticated.user_id'));

      }).catch((reason) => {
        console.log('error logging in');
        this.set('errorMessage', reason.error || reason);
      });
    } else {
      this.set('errorMessage',
        [{
          title: 'Missing Info',
          detail: 'Your login or password is missing.'
        }]
      );
    }
    // TODO input validation
    // let that = this;
    //
    // this.get('store').queryRecord('user', {username: user, password: pw}).then(function(query){
    //
    //   that.set('userId', query.get('id'));
    //   that.set('broadcaster', query.get('broadcaster'));
    //   that.set('developer', query.get('developer'));
    //   that.set('adminStatus', query.get('adminStatus'));
    //
    //   let userPref = that.get('store').peekRecord('user-pref', that.get('userId'));
    //   that.set('darkMode', userPref.get('darkMode'));
    //
    //   if (!query) {
    //     console.log('auth failed');
    //     that.set('loggedIn', false);
    //   } else {
    //     console.log('auth success');
    //
    //     that.set('loggedIn', true);
    //     that.set('username', user);
    //     var date = new Date();
    //
    //     // 30 day expiration
    //     var days = 30;
    //
    //     // Get unix milliseconds at current time plus number of days
    //     date.setTime(+ date + (days * 86400000)); //24 * 60 * 60 * 1000
    //     document.cookie ="username="+user+ ";path=/; expires=" + date.toGMTString();
    //     document.cookie ="password="+pw+ ";path=/; expires=" + date.toGMTString();
    //     Ember.$('#loginModal').modal('hide'); //close log in modal
    //   }
    // });
    // this.get('store').find('user', 1).then(function(){
    //   console.log("logged in");
    //   that.set('loggedIn', true);
    //   Ember.$('#loginModal').modal('hide') //close log in modal
    // });

  },

  signUp(user, email, pw, pwconfirm) {
    var self = this;
    //TODO input validation
    if (email && user) {
      if (pw === pwconfirm) {


        let newUser = this.get('store').createRecord('user', {
          email: email,
          username: user,
          password: pw,
          passwordConfirmation: pwconfirm
        });




        console.log('before save');
        newUser.save().then(displaySignupSuccess).catch(failure);

        //   //Ember.$('#loginModal').modal('hide'); //close log in modal
      } else {
        console.log('setting error passwords do not match');
        this.set('errorMessage',
          [{
            title: 'Passwords',
            detail: 'Passwords do not match.'
          }]
        );
      }
    } else {
      console.log('setting error no info');
      this.set('errorMessage',
        [{
          title: 'Missing Info',
          detail: 'Please enter the information below to sign up.'
        }]
      );
    }

    function displaySignupSuccess() {
      console.log('signupsuccess');
      self.set('errorMessage', null);
      self.set('signupSuccess', true);
    }

    function failure(reason) {
      self.set('errorMessage', reason.errors || reason);
    }
  },

  logOut() {
    //do logout work here
    //TODO input validation

    this.get('session').invalidate();

    console.log("logged out");
    this.set('loggedIn', false);
    this.set('userId', '');
    this.set('username', '');
    this.set('broadcaster', false);
    this.set('developer', false);
    this.set('adminStatus', false);

    var date = new Date();

    // 30 day expiration
    var days = -30;

    // Get unix milliseconds at current time plus number of days
    date.setTime(+ date + (days * 86400000)); //24 * 60 * 60 * 1000
    document.cookie ="username=;path=/; expires=" + date.toGMTString();
    document.cookie ="password=;path=/; expires=" + date.toGMTString();
    this.get('store').unloadAll('user');
  },

});
