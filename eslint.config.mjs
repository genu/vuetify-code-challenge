import globals from "globals"
import tseslint from "typescript-eslint"
import pluginVue from "eslint-plugin-vue"
import stylistic from "@stylistic/eslint-plugin"
import prettier from "eslint-plugin-prettier" // Make sure this is imported
import eslintConfigPrettier from "eslint-config-prettier"

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{mjs,ts}"] },
  { files: ["**/*.vue"], languageOptions: { parserOptions: { parser: tseslint.parser } } },
  { languageOptions: { globals: globals.browser } },
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  {
    plugins: {
      "@stylistic": stylistic,
      prettier: prettier,
    },
  },

  /**
   * Rules
   */
  {
    rules: {
      "prettier/prettier": ["error"],
    },
  },
  eslintConfigPrettier,
]
