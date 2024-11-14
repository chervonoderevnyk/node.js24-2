module.exports = {
    env: {
        browser: true,
        es2023: true,
    },
    extends: [
        "plugin:prettier/recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier",
    ],
    root: true,
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
    },

    plugins: ["@typescript-eslint/eslint-plugin", "simple-import-sort", "import"],
    rules: {
        indent: ["error", 2, { "SwitchCase": 1 }],
        quotes: ["error", "double"],
        semi: ["error", "always"],
        "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unused-vars": ["error", {argsIgnorePattern: "req|res|next|error"}],
        "@typescript-eslint/return-await": ["error", "always"],
        "simple-import-sort/imports": "error",
        "import/first": "error",
        "import/newline-after-import": ["error", { count: 1 }],
        "import/no-duplicates": "error",
        "prettier/prettier": ["error", {endOfLine: "auto"}],
        "no-console": "off",
        "sort-imports": [
            "error",
            {
                "ignoreCase": true,
                "ignoreDeclarationSort": true,
                "ignoreMemberSort": true,
                "memberSyntaxSortOrder": ["none", "all", "single", "multiple"],
                "allowSeparatedGroups": false,
            },
        ],
    },
    ignorePatterns: ['.eslintrc.js', '/dist', '/data'],
}