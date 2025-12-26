import arc from '@architect/eslint-config'
import importPlugin from 'eslint-plugin-import'

export default [
  ...arc,
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
    plugins: {
      import: importPlugin.flatConfigs.recommended.plugins.import,
    },
    rules: {
      'import/no-commonjs': 'error',
      'import/extensions': [
        'error',
        'ignorePackages',
      ],
      // Additive to our old `import` config, but everything seems quite sane!
      ...importPlugin.flatConfigs.recommended.rules,
    },
  },
]
