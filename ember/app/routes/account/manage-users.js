import Route from '@ember/routing/route';

import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

  let usersList =[{
     isBlocked: true,
     isFavorite: false,
     username: "blockedUser1"
  },
  {
    isBlocked: true,
    isFavorite: false,
    username: "blockedUser2"
  },
  {
    isBlocked: true,
    isFavorite: false,
    username: "blockedUser3"
  },
  {
    isBlocked: true,
    isFavorite: false,
    username: "blockedUser4"
  },
  {
      isBlocked: false,
       isFavorite: true,
    username: "favoriteUser1"
  },
  {
    isBlocked: false,
     isFavorite: true,
    username: "favoriteUser2"
  },
  {
    isBlocked: false,
     isFavorite: true,
    username: "favoriteUser3"
  },
  {
    isBlocked: false,
     isFavorite: true,
    username: "favoriteUser4"
  },
  {
    isBlocked: false,
     isFavorite: true,
    username: "favoriteUser5"
  },
  {
    isBlocked: false,
     isFavorite: true,
    username: "favoriteUser6"
  },
  {
    isBlocked: false,
     isFavorite: true,
    username: "favoriteUser7"
  },
  {
    isBlocked: false,
     isFavorite: true,
    username: "favoriteUser8"
  },
  {
    isBlocked: false,
     isFavorite: true,
    username: "favoriteUser9"
  },
  {
    isBlocked: false,
     isFavorite: true,
    username: "favoriteUser10"
  },
  {
    isBlocked: false,
     isFavorite: true,
    username: "favoriteUser11"
  },
  {
    isBlocked: false,
     isFavorite: true,
    username: "favoriteUser12"
  },
  {
    isBlocked: false,
     isFavorite: true,
    username: "favoriteUser13"
  },
  {
    isBlocked: false,
     isFavorite: true,
    username: "favoriteUser14"
  },
  {
    isBlocked: false,
     isFavorite: true,
    username: "favoriteUser15"
  },
  {
    isBlocked: false,
     isFavorite: true,
    username: "favoriteUser16"
  },
  {
    isBlocked: false,
     isFavorite: true,
    username: "favoriteUser17"
  },
  {
    isBlocked: false,
     isFavorite: true,
    username: "favoriteUser18"
  },
  {
    isBlocked: false,
     isFavorite: true,
    username: "favoriteUser19"
  },
  {
    isBlocked: false,
     isFavorite: true,
    username: "favoriteUser20"
  },
  {
    isBlocked: false,
     isFavorite: true,
    username: "favoriteUser21"
  },
  {
    isBlocked: false,
     isFavorite: true,
    username: "favoriteUser22"
  },
  {
    isBlocked: false,
     isFavorite: true,
    username: "favoriteUser23"
  },

  {
     isBlocked: false,
      isFavorite: true,
     username: "favoriteUser24"
  }];


export default Route.extend(AuthenticatedRouteMixin, {
  model: function(){
    return usersList;
  }


});
