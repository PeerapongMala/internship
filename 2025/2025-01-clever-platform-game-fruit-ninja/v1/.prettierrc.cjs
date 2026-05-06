module.exports = {
  plugins: [require.resolve('prettier-plugin-tailwindcss')],
  tailwindConfig: './tailwind.config.js',
  semi: true,
  singleQuote: true,
  bracketSpacing: true,
  jsxBracketSameLine: false,
  printWidth: 90,
  tabWidth: 2,
  useTabs: false,
  endOfLine: 'auto',
  trailingComma: 'all',
}
