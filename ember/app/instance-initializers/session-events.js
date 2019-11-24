export function initialize(instance) {
  const session = instance.lookup('service:session');
  const currentUserService = instance.lookup('service:currentUser');

  session.on('authenticationSucceeded', function() {
    console.log('authenticationSucceeded');
    window.location.reload();
  });
  session.on('invalidationSucceeded', function() {
    console.log('invalidationSucceeded');
    window.location.reload();
  });
}

export default {
  initialize,
  name: 'session-events',
  after: 'ember-simple-auth'
};
