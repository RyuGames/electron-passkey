module.exports = {
  root: true,
  extends: [
    'erb',
    'airbnb-base',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended',
    'eslint:recommended',
    'plugin:react/recommended',
  ],
  rules: {
    // A temporary hack related to IDE not resolving correct package.json
    'import/no-extraneous-dependencies': 'off',
    'import/no-unresolved': 'error',
    // Since React 17 and typescript 4.1 you can safely disable the rule
    'react/react-in-jsx-scope': 'off',
    'react/no-array-index-key': 'off',
    'no-console': 'off',
    'max-len': 'off',
    'no-await-in-loop': 'off',
    'no-async-promise-executor': 'error',
    'promise/always-return': 'off',
    'promise/no-return-wrap': 'error',
    'promise/param-names': 'error',
    'promise/catch-or-return': 'error',
    'promise/no-native': 'off',
    'promise/no-nesting': 'off',
    'promise/no-promise-in-callback': 'off',
    'promise/no-callback-in-promise': 'off',
    'promise/avoid-new': 'off',
    'promise/no-new-statics': 'error',
    'promise/no-return-in-finally': 'warn',
    'promise/valid-params': 'warn',
    'no-bitwise': 'off',
    'no-underscore-dangle': 'off',
    'no-throw-literal': 'off',
    'no-case-declarations': 'off',
    'function-paren-newline': 'off',
    'default-param-last': 'off',
    'comma-dangle': 'off',
    'compat/compat': 'off',
    'operator-linebreak': 'off',
    'class-methods-use-this': 'off',
    'no-unused-expressions': 'off',
    '@typescript-eslint/no-unused-expressions': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'react/prop-types': 'off', // Since we do not use prop-types
    'react/require-default-props': 'off', // Since we do not use prop-types
    'no-alert': 'off',
    'jsx-a11y/label-has-associated-control': 'off',
    'react/no-unknown-property': 'off',
    'no-continue': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',
    'no-param-reassign': 'off',
    'react/jsx-handler-names': [
      'error',
      {
        eventHandlerPrefix: 'on',
        checkLocalVariables: true,
      },
    ],
    'react/jsx-sort-props': [
      'error',
      {
        callbacksLast: true,
        ignoreCase: true,
      },
    ],
    'react/display-name': 'off',
    '@typescript-eslint/member-ordering': [
      'error',
      {
        classes: 'never',
        interfaces: ['field', 'signature', 'method', 'constructor'],
      },
    ],
    'react/jsx-filename-extension': [
      2,
      { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
    ],
    'react/jsx-no-useless-fragment': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    createDefaultProgram: true,
  },
  globals: {
    JSX: true,
  },
  env: {
    jest: true,
  },
  plugins: ['promise'],
};
