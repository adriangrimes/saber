import { helper } from '@ember/component/helper';

export function msToDatetime(params /*, hash*/) {
  // Unary + to convert string to an integer
  // Workaround for IE 11: undefined will evaluate to 'default' in most browsers
  return (
    new Date(+params).toLocaleDateString(undefined, {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }) +
    ' at ' +
    new Date(+params).toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit'
    })
  );
}

export default helper(msToDatetime);
