module.exports = {
  extends: ['airbnb'],
  ignorePatterns: ['node_modules/*', '.next/*', '.out/*', '!.prettierrc.js'],
  rules: {
    'react/jsx-filename-extension': 'off',
    quotes: ['warn', 'single'],
    semi: ['warn', 'always'],
  },
};
