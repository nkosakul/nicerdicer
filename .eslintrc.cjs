/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript/recommended',
    'plugin:vue/vue3-recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'vue/order-in-components': [
      'error',
      {
        order: [
          'el',
          'name',
          ['components', 'directives', 'filters'],
          'mixins',
          ['props', 'propsData'],
          'data',
          'computed',
          'methods',
          'watch',
          'LIFECYCLE_HOOKS',
        ],
      },
    ],
  },
};
