const globals = require('globals');
const pluginJs = require('@eslint/js');
const babelParser = require('@babel/eslint-parser');
const stylisticJs = require('@stylistic/eslint-plugin-js');

module.exports = [
  pluginJs.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          babelrc: false,
          configFile: false,
          presets: ['@babel/preset-env']
        }
      },
      globals: {
        ...globals.node
      },
      ecmaVersion: 'latest'
    },
    plugins: {
      '@stylistic/js': stylisticJs
    },
    rules: {
      '@stylistic/js/indent': ['error', 2],
      '@stylistic/js/linebreak-style': ['error', 'unix'],
      '@stylistic/js/quotes': ['error', 'single'],
      '@stylistic/js/semi': ['error', 'always'],
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { 'before': true, 'after': true }],
      'no-trailing-spaces': 'error'
    },
  },
];
