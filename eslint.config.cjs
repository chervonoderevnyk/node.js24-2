const eslintPluginPrettier = require("eslint-plugin-prettier");
const typescriptESLint = require("@typescript-eslint/eslint-plugin");
const simpleImportSort = require("eslint-plugin-simple-import-sort");
const eslintPluginImport = require("eslint-plugin-import");
const typescriptParser = require("@typescript-eslint/parser");

module.exports = [
  {
    files: ["**/*.ts"], // Вказівка, що налаштування діятимуть для всіх файлів з розширенням .ts
    languageOptions: {
      parser: typescriptParser, // Вказання використання TypeScript parser
      parserOptions: {
        project: "./tsconfig.json", // Вказує на шлях до файлу налаштувань TypeScript
        tsconfigRootDir: __dirname, // Вказання кореневої директорії проекту
      },
      globals: {
        window: "readonly", // Визначає window як глобальний об'єкт (лише для читання)
        document: "readonly", // Визначає document як глобальний об'єкт (лише для читання)
      },
    },
    plugins: {
      "@typescript-eslint": typescriptESLint, // Додає TypeScript ESLint плагін
      "simple-import-sort": simpleImportSort, // Додає плагін для сортування імпортів
      "import": eslintPluginImport, // Додає плагін для перевірки правил імпорту
      "prettier": eslintPluginPrettier, // Додає Prettier для автоформатування
    },
    settings: {}, // Пустий об'єкт для додаткових налаштувань, можна розширити за потреби
    rules: {
      "prettier/prettier": ["error", { endOfLine: "auto" }], // Примусове форматування з Prettier; кінець рядка авто
      indent: ["error", 2, { SwitchCase: 1 }], // Вимога двох пробілів для відступів; один відступ для switch-case
      quotes: ["error", "double"], // Використання подвійних лапок для рядків
      semi: ["error", "always"], // Вимога ставити крапку з комою в кінці виразів
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "req|res|next|error" }], // Забороняє невикористані змінні, крім вказаних аргументів
      "@typescript-eslint/return-await": ["error", "always"], // Вимагає використання await при поверненні промісу
      "simple-import-sort/imports": "error", // Виконує сортування імпортів за допомогою simple-import-sort
      "import/first": "error", // Вимагає, щоб імпорт був першим у файлі
      "import/newline-after-import": ["error", { count: 1 }], // Вимагає один порожній рядок після імпорту
      "import/no-duplicates": "error", // Забороняє дублювання імпортів
      "no-console": "off", // Дозволяє використання console.log для відлагодження
      "sort-imports": [
        "error",
        {
          ignoreCase: true, // Ігнорує регістр при сортуванні
          ignoreDeclarationSort: true, // Ігнорує сортування декларацій, сфокусований на сортуванні імпортів
          ignoreMemberSort: true, // Ігнорує сортування елементів імпорту
          memberSyntaxSortOrder: ["none", "all", "single", "multiple"], // Налаштування порядку членів імпорту
          allowSeparatedGroups: false, // Забороняє групи імпортів, які розділені порожніми рядками
        },
      ],
    },
    ignores: ["dist/**", "node_modules/**"], // Ігнорує папки dist і node_modules для перевірок ESLint
  },
];
