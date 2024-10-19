module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:import/recommended',
        'plugin:import/typescript'
    ],
    settings: {
        'import/resolver': {
            typescript: {
                alwaysTryTypes: true, // Обязательно пытаться разрешить типы
                project: './tsconfig.json' // Указать путь к tsconfig.json
            }
        }
    },
    rules: {
        'import/no-unresolved': 'error',
        'import/no-relative-parent-imports': 'error'
    }
};
