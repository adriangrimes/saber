export function initialize(instance) {
  const session = instance.lookup('service:session');

  session.on('authenticationSucceeded', function() {
    console.log('authenticationSucceeded');
    // reload window after logging in successfully
    window.location.reload();
  });
  session.on('invalidationSucceeded', function() {
    console.log('invalidationSucceeded');
    // reload window after logging out successfully
    window.location.reload();
  });
}

export default {
  initialize,
  name: 'session-events',
  after: 'ember-simple-auth'
};
