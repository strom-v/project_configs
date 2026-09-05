import js from '@eslint/js';
import globals from 'globals';

// подключаем опциональные плагины только если они установлены в проекте
async function tryImport(name) {
  try {
    return await import(name);
  } catch {
    return null;
  }
}

// TS-поддержка: либо мета-пакет typescript-eslint, либо отдельные plugin + parser
const [tseslint, tsPlugin, tsParser, prettierConfig] = await Promise.all([
  tryImport('typescript-eslint'),
  tryImport('@typescript-eslint/eslint-plugin'),
  tryImport('@typescript-eslint/parser'),
  tryImport('eslint-config-prettier'),
]);

const hasTs = Boolean(tseslint || (tsPlugin && tsParser));

const config = [
  {
    ignores: ['dist/**', 'build/**', 'coverage/**', '**/*.min.js'],
  },
  js.configs.recommended,
  {
    files: ['**/*.js', '**/*.ts', '**/*.jsx', '**/*.tsx'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
  },
  {
    files: ['**/*.js', '**/*.jsx'],
    rules: {
      'no-unused-vars': 'error',
      'no-console': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
];

// TypeScript-правила — только если в проекте есть typescript-eslint
if (hasTs) {
  if (tseslint) {
    config.push(...tseslint.default.configs.recommended);
  } else {
    config.push({
      files: ['**/*.ts', '**/*.tsx'],
      plugins: { '@typescript-eslint': tsPlugin.default },
      rules: { ...tsPlugin.default.configs.recommended.rules },
    });
  }

  config.push({
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: (tseslint && tseslint.default.parser) || tsParser.default,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      'no-undef': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': 'warn',
    },
  });
}

// отключаем правила, конфликтующие с prettier — если он подключён
if (prettierConfig) {
  config.push(prettierConfig.default);
}

export default config;
