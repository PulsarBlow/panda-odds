module.exports = {
  extends: 'node',
  env: {
    node: true,
    jest: true,
  },
  rules: {
    'import/no-commonjs': ['off'],
  },
};
