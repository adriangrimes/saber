import { helper } from '@ember/component/helper';

export function lowerCase(str/*, hash*/) {
  let lower = String.prototype.toLowerCase.apply(str);
  return lower;
}

export default helper(lowerCase);
