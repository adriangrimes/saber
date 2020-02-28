import { helper } from '@ember/component/helper';

export function formatCurrency(num) {
  num = +num;

  if (isNaN(num) || num <= 0) {
    return '';
  }

  num = num.toFixed(2);

  return '$' + num.replace(/\B(?=(\d{3})+(?!\d)(?=\.))/g, ',');
}

export default helper(formatCurrency);
