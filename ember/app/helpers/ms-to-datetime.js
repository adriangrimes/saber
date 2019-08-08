import { helper } from '@ember/component/helper';

export function msToDatetime(params /*, hash*/) {
  // Unary + to convert string to an integer
  return new Date(+params).toLocaleDateString('default', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
}

export default helper(msToDatetime);
