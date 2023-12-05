module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
    'node': true,
  },
  'extends': [
    'google',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  'overrides': [
    {
      'env': {
        'node': true,
      },
      'files': [
        '.eslintrc.{js,cjs}',
      ],
      'parserOptions': {
        'sourceType': 'script',
      },
    },
  ],
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module',
  },
  'plugins': [
    'react',
  ],
  'rules': {
    'operator-linebreak': [2, 'before', {'overrides': {'&&': 'after'}}],
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 0,
    'react/jsx-equals-spacing': [2, 'always'],
    'react/no-unknown-property': 0,
    'react-hooks/exhaustive-deps': 0,
  },
};
