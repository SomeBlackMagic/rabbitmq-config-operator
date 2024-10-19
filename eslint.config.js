// eslint.config.js
const typescript = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const importPlugin = require('eslint-plugin-import');

/** @type {import('eslint').Linter.Config} */
module.exports = [
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: './tsconfig.json', // Укажите ваш tsconfig.json файл
            },
        },
        plugins: {
            '@typescript-eslint': typescript,
            'import': importPlugin,
        },
        rules: {
            'import/no-unresolved': 'error',
            // 'import/no-relative-parent-imports': 'error',
        },
        settings: {
            'import/resolver': {
                typescript: {
                    alwaysTryTypes: true, // Обязательно пытаться разрешить типы
                    project: './tsconfig.json',
                },
            },
        },
    },
];
