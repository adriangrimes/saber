import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('profile');//, { path: '/profile/:profile_id' });
  this.route('account', function() {
    this.route('developer');
    this.route('broadcaster');
    this.route('delete');
    this.route('messages');
    this.route('dashboard');
    this.route('manageUsers');
  });
  this.route('signup', function() {
    this.route('broadcaster');
    this.route('developer');
  });
  this.route('help', function() {
    this.route('developer');
    this.route('broadcaster');
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
});

export default Router;
