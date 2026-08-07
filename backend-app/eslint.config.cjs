module.exports = [
  {
    ignores: ['node_modules/**', '.cache/**'],
    files: ['**/*.{js,cjs,mjs}'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'script',
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
];
