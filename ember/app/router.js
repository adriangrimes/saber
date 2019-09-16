import EmberRouter from '@ember/routing/router';
import config from './config/environment';
// Scrolls page to top on page transition
import RouterScroll from 'ember-router-scroll';

const Router = EmberRouter.extend(RouterScroll, {
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
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
    this.route('confirm');
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
    path: 'p/:username'
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

  this.route('forgot-password');
  this.route('reset-password');
  this.route('unlock-account');
});

export default Router;