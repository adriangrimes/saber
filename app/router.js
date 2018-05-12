import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('profile');//, { path: '/profile/:profile_id' });
  this.route('account', function() {
    this.route('developer');
    this.route('broadcaster');
    this.route('messages');
    this.route('dashboard');
    this.route('manage-users');
    this.route('affiliate');
    this.route('close');
  });
  this.route('signup', function() {
    this.route('broadcaster');
    this.route('developer');
    this.route('affiliate');
  });
  this.route('help', function() {
    this.route('developer');
    this.route('broadcaster');
    this.route('affiliate');
  });
  this.route('terms');
  this.route('privacy');
  this.route('contact');
  this.route('games');
  this.route('legal');

  this.route('p', {
    path: 'p/:profile_id'
  });

  this.route('page-not-found', {
    path: '/*wildcard'
  });

  this.route('user-not-found', {
    path: 'p/*wildcard'
  });
  this.route('home');
  this.route('login');
  this.route('g', {
//    path: 'p/:game_id'
  });

});

export default Router;
