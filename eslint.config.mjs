import promise from "eslint-plugin-promise";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import importPlugin from 'eslint-plugin-import';
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: ["**/build/", "**/dist/", "**/prebuilds/", '**/*.config.*'],
}, ...compat.extends(
    "airbnb-base",
    "plugin:prettier/recommended",
    "plugin:@typescript-eslint/recommended",
    "eslint:recommended",
), {
    files: ['**/*.js', '**/*.ts', '**/*.mjs'],
    plugins: {
        promise,
        importPlugin,
    },

    languageOptions: {
        globals: {
            navigator: 'readonly',
        },
        ecmaVersion: 2020,
        sourceType: "module",

        parserOptions: {
            project: "./tsconfig.json",
            tsconfigRootDir: __dirname,
            createDefaultProgram: true,
        },
    },

    rules: {
        "import/no-named-as-default": "off",
        "import/no-named-as-default-member": "off",
        "@typescript-eslint/no-require-imports": "off",
        "import/newline-after-import": "off",
        "import/no-amd": "off",
        "import/no-mutable-exports": "off",
        "import/no-extraneous-dependencies": "off",
        "import/no-unresolved": "error",
        "no-console": "off",
        "max-len": "off",
        "no-await-in-loop": "off",
        "no-async-promise-executor": "error",
        "promise/always-return": "off",
        "promise/no-return-wrap": "error",
        "promise/param-names": "error",
        "promise/catch-or-return": "error",
        "promise/no-native": "off",
        "promise/no-nesting": "off",
        "promise/no-promise-in-callback": "off",
        "promise/no-callback-in-promise": "off",
        "promise/avoid-new": "off",
        "promise/no-new-statics": "error",
        "promise/no-return-in-finally": "warn",
        "promise/valid-params": "warn",
        "no-bitwise": "off",
        "no-underscore-dangle": "off",
        "no-throw-literal": "off",
        "no-case-declarations": "off",
        "function-paren-newline": "off",
        "default-param-last": "off",
        "comma-dangle": "off",
        "compat/compat": "off",
        "operator-linebreak": "off",
        "class-methods-use-this": "off",
        "no-unused-expressions": "off",
        "@typescript-eslint/no-unused-expressions": "off",
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "no-alert": "off",
        "jsx-a11y/label-has-associated-control": "off",
        "no-continue": "off",

        "import/extensions": ["error", "ignorePackages", {
            js: "never",
            jsx: "never",
            ts: "never",
            tsx: "never",
        }],

        "no-shadow": "off",
        "@typescript-eslint/no-shadow": "error",
        "no-param-reassign": "off",

        "@typescript-eslint/member-ordering": ["error", {
            classes: "never",
            interfaces: ["field", "signature", "method", "constructor"],
        }],

        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": ["error"],
    },
}];