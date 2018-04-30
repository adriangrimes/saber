export function initialize(appInstance) {
  appInstance.lookup('controller:application').set('copyrightYear', new Date().getFullYear());
}

export default {
  initialize
};
