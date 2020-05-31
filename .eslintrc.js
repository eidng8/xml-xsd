/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

const rules = {
  eqeqeq: 'off',
  yoda: [
    'error',
    'always',
    {
      exceptRange: true,
      onlyEquality: true,
    },
  ],
  'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
};

module.exports = {
  root: true,
  env: { node: true },
  extends: ['plugin:prettier/recommended'],
  parserOptions: { ecmaVersion: 2020 },
  ignorePatterns: ['coverage/', 'docs/', 'lib/', 'node_modules/', 'typings'],
  rules,
  overrides: [
    {
      files: ['**/tests/**/*.spec.{j,t}s'],
      env: { jest: true },
    },
    {
      files: ['*.ts'],
      rules: Object.assign({}, rules, {
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            args: 'after-used',
          },
        ],
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/explicit-function-return-type': [
          'error',
          {
            allowExpressions: true,
            allowTypedFunctionExpressions: true,
            allowHigherOrderFunctions: true,
            allowConciseArrowFunctionExpressionsStartingWithVoid: true,
          },
        ],
      }),
    },
  ],
};
