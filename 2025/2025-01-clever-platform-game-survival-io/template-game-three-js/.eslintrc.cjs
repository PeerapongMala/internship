module.exports = {
  root: true,
  env: { browser: true, es2020: true, amd: true, node: true },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    // 'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended',
    'plugin:storybook/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'prettier', 'simple-import-sort', 'check-file', 'unicorn'],
  rules: {
    //
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    //
    'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    'react/react-in-jsx-scope': 'off',
    'jsx-a11y/accessible-emoji': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    // 'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    // Custom Setting
    'jsx-a11y/anchor-is-valid': 'off',
    // '@typescript-eslint/ban-types': 'off',
    // 'jsx-a11y/anchor-is-valid': [
    //   'error',
    //   {
    //     components: ['Link'],
    //     specialLink: ['hrefLeft', 'hrefRight'],
    //     aspects: ['invalidHref', 'preferButton'],
    //   },
    // ],
    // unused-vars warning
    '@typescript-eslint/no-unused-vars': 'off',
    'no-unused-vars': 'off',
    // Name
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variable',
        // 'PascalCase' for react component
        format: ['camelCase', 'PascalCase'],
      },
      {
        selector: 'typeLike',
        format: ['PascalCase'],
      },
      {
        selector: ['default', 'variable'],
        modifiers: ['exported'],
        format: ['PascalCase'],
      },
    ],
    'unicorn/filename-case': [
      'error',
      {
        case: 'kebabCase',
      },
    ],
    'check-file/folder-naming-convention': [
      'error',
      {
        'src/**/': 'KEBAB_CASE',
      },
    ],
    //
  },
};
