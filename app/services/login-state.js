import Ember from 'ember';

export default Ember.Service.extend({

  store: Ember.inject.service(),
  session: Ember.inject.service(),
  userId: '',
  username: '',
  broadcaster: false,
  developer: false,
  adminStatus: false,
  darkMode: false,
  devCaster: Ember.computed('broadcaster', 'developer', function() {
    if (this.get('broadcaster') === true || this.get('developer') === true) {
      return true;
    } else {
      return false;
    }
  }),

  init() {
    this._super(...arguments);

    // //jenk autologin for now
    // var user = document.cookie.match(new RegExp('username' + '=([^;]+)'));
    // var password = document.cookie.match(new RegExp('password' + '=([^;]+)'));
    // if (user && password) {
    //   if (user[1] != null && password[1] != null) {
    //     this.set('loggedIn', false);
    //     console.log("autologging in: " + user[1]);
    //     this.logIn(user[1], password[1]);
    //   }
    // }
    //if some sort of cookie found run logIn()??? for autologin
    //how do sites even do that
  },

  //do login work here
  logIn(identification, password) {
    console.log('login');
    this.get('session').authenticate('authenticator:devise', identification, password).catch((reason) => {
      this.set('errorMessage', reason.error || reason);
    });

    Ember.$('#loginModal').modal('hide'); //close log in modal
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
    this.get('store').unloadAll('user-pref');
  },

  signUp(user, email, pw, pwconfirm) {
    //TODO input validation
    if (pw === pwconfirm) {
      var signup = this.get('store').createRecord('user', {
        username: user,
        email: email,
        password: pw
      });
      signup.save().then(function(){
        console.log("signed up");
        Ember.$('#loginModal').modal('hide'); //close log in modal
      });

    } else {
      console.log('error: passwords do not match');
    }
  },

});
