const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  {
    ignores: [
      "node_modules/",
      "package-lock.json",
      "vercel.json",
      "*.html",
      "css/",
    ],
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "commonjs",
      globals: {
        ...globals.browser,
        ...globals.node,
        gtag: "readonly",
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      "no-unused-vars": [
        "warn",
        {
          args: "none",
          ignoreRestSiblings: true,
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "no-undef": "error",
      eqeqeq: "warn",
      curly: "warn",
      semi: ["warn", "always"],
      quotes: ["warn", "double", { avoidEscape: true }],
      "no-console": "off",
    },
  },
];