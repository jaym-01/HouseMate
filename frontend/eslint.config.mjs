import eslint from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import expoConfig from 'eslint-config-expo/flat.js';
import { defineConfig } from 'eslint/config';
import { configs } from 'typescript-eslint';

export default defineConfig([
  expoConfig,

  {
    ignores: [
      'dist/*',
      'eslint.config.mjs',
      'babel.config.js',
      'metro.config.js',
      'tailwind.config.js',
      'node_modules/*',
    ],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      'no-console': 'warn',
      'no-debugger': 'error',
    },
    extends: [eslint.configs.recommended, configs.strict],
  },
]);
