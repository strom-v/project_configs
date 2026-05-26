# project-configs

Стандартные конфиги для всех моих проектов: ESLint (flat config), Prettier, TypeScript, Docker и Git ignore.

## Что внутри

| Файл | Назначение |
|---|---|
| `.eslint.config.js` | ESLint flat config: JS, TS, Vue/Nuxt, React/Next, порядок импортов, совместимость с Prettier |
| `.prettierrc` | Правила форматирования Prettier |
| `.prettierignore` | Что Prettier пропускает |
| `tsconfig.json` | Базовый TypeScript-конфиг (strict, ES2022, alias `@/*`) |
| `.gitignore` | Стандартный git-ignore для node-проектов |
| `.dockerignore` | Стандартный docker-ignore |
| `helprer.txt` | Готовый сниппет `installConfigs` для `package.json` |

## Установка в проект

В `package.json` целевого проекта добавь скрипт из [helprer.txt](./helprer.txt) в секцию `scripts`, затем запусти:

```bash
npm run installConfigs
```

Скрипт скачает свежие версии конфигов в корень проекта (`.eslint.config.js` приземляется как `eslint.config.js`). Работает и на macOS/Linux (через `curl`), и на Windows (через `pwsh` + `Invoke-WebRequest`).

## Peer-зависимости для ESLint

Конфиг написан с условной загрузкой плагинов — ставь только то, что нужно проекту:

```bash
# обязательный минимум
npm i -D eslint @eslint/js globals

# TypeScript
npm i -D typescript-eslint

# Vue / Nuxt
npm i -D eslint-plugin-vue vue-eslint-parser

# React / Next.js
npm i -D eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-jsx-a11y @next/eslint-plugin-next

# порядок импортов
npm i -D eslint-plugin-import

# совместимость с Prettier
npm i -D eslint-config-prettier prettier
```

Если плагин не установлен — соответствующая секция конфига просто пропускается, ESLint не упадёт.

## Что включено

- **JS/TS:** `no-var`, `prefer-const`, `prefer-template`, `eqeqeq`, `no-console` (warn), `no-debugger`, `@typescript-eslint/consistent-type-imports`, `@typescript-eslint/consistent-type-definitions: interface`, `no-explicit-any` (warn)
- **Vue:** `flat/recommended`, Composition API + `<script setup>`, порядок `defineProps/defineEmits/defineModel`
- **React:** `prefer-stateless-function`, `self-closing-comp`, `react-hooks/*`, поддержка JSX без импорта React, правила Next.js
- **Imports:** группировка `builtin → external (react первым) → internal (@/, ~/) → relative`, разделение группами пустых строк, запрет дубликатов

## Обновление

```bash
npm run installConfigs
```

Это просто перекачает свежие файлы поверх существующих.