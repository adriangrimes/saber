import { helper } from '@ember/component/helper';

export function msToDatetime(params /*, hash*/) {
  // Unary + to convert string to an integer
  return (
    new Date(+params).toLocaleDateString('default', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }) +
    ' at ' +
    new Date(+params).toLocaleTimeString('default', {
      hour: 'numeric',
      minute: '2-digit'
    })
  );
}

export default helper(msToDatetime);
