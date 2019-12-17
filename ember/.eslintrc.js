module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  extends: 'eslint:recommended',
  env: {
    browser: true
  },
  rules: {
    'no-console': 'off',
    'no-global-assign': ['error', { exceptions: ['console'] }]
  },
  globals: {
    moment: true,
    grecaptcha: true,
    Plyr: true,
    Hls: true
  }
};
