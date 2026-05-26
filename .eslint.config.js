import js from '@eslint/js';
import globals from 'globals';

async function tryImport(name) {
  try {
    return await import(name);
  } catch {
    return null;
  }
}

const [tseslint, vuePlugin, vueParser, reactPlugin, reactHooksPlugin, jsxA11yPlugin, nextPlugin, importPlugin, prettierConfig] = await Promise.all([
  tryImport('typescript-eslint'),
  tryImport('eslint-plugin-vue'),
  tryImport('vue-eslint-parser'),
  tryImport('eslint-plugin-react'),
  tryImport('eslint-plugin-react-hooks'),
  tryImport('eslint-plugin-jsx-a11y'),
  tryImport('@next/eslint-plugin-next'),
  tryImport('eslint-plugin-import'),
  tryImport('eslint-config-prettier'),
]);

const config = [
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/.next/**', '**/.nuxt/**', '**/.output/**', '**/coverage/**', '**/uploads/**', '**/public/**', '**/*.min.js', '.env'],
  },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2024,
      },
    },
    rules: {
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-template': 'error',
      'object-shorthand': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      eqeqeq: ['error', 'always'],
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
];

if (tseslint) {
  config.push(
    ...tseslint.default.configs.recommended,
    {
      files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts', '**/*.vue'],
      languageOptions: {
        parser: tseslint.default.parser,
        parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
      },
      rules: {
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports', fixStyle: 'separate-type-imports' }],
        '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
        'no-unused-vars': 'off',
      },
    }
  );
}

if (vuePlugin && vueParser) {
  config.push(...vuePlugin.default.configs['flat/recommended'], {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser.default,
      parserOptions: {
        parser: tseslint ? tseslint.default.parser : undefined,
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
      },
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'off',
      'vue/component-api-style': ['error', ['script-setup', 'composition']],
      'vue/define-macros-order': ['error', { order: ['defineProps', 'defineEmits', 'defineModel'] }],
    },
  });
}

if (reactPlugin) {
  config.push({
    files: ['**/*.jsx', '**/*.tsx'],
    plugins: {
      react: reactPlugin.default,
      ...(reactHooksPlugin && { 'react-hooks': reactHooksPlugin.default }),
      ...(jsxA11yPlugin && { 'jsx-a11y': jsxA11yPlugin.default }),
      ...(nextPlugin && { '@next/next': nextPlugin.default }),
    },
    languageOptions: {
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: { react: { version: 'detect' } },
    rules: {
      ...reactPlugin.default.configs.recommended.rules,
      ...(reactHooksPlugin?.default.configs.recommended?.rules ?? {}),
      ...(nextPlugin?.default.configs.recommended?.rules ?? {}),
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react/prop-types': 'off',
      'react/prefer-stateless-function': 'error',
      'react/self-closing-comp': 'error',
    },
  });
}

if (importPlugin) {
  config.push({
    plugins: { import: importPlugin.default },
    rules: {
      'import/no-duplicates': 'error',
      'import/no-self-import': 'error',
      'import/newline-after-import': 'error',
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
          pathGroups: [
            { pattern: 'react', group: 'external', position: 'before' },
            { pattern: 'react-dom', group: 'external', position: 'before' },
            { pattern: 'react/**', group: 'external', position: 'before' },
            { pattern: 'react-dom/**', group: 'external', position: 'before' },
            { pattern: '@/**', group: 'internal' },
            { pattern: '~/**', group: 'internal' },
          ],
          pathGroupsExcludedImportTypes: ['react'],
          'newlines-between': 'always',
        },
      ],
    },
  });
}

if (prettierConfig) {
  config.push(prettierConfig.default);
}

export default config;