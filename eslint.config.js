import js from "@eslint/js";
import globals from "globals";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import jsdoc from "eslint-plugin-jsdoc";
import prettier from "eslint-config-prettier";

export default [
    // Base JS recommended rules
    js.configs.recommended,

    // React rules (includes JSX transform support)
    reactPlugin.configs.flat.recommended,
    reactPlugin.configs.flat["jsx-runtime"],

    // Accessibility rules
    jsxA11y.flatConfigs.recommended,

    // JSDoc rules
    jsdoc.configs["flat/recommended"],

    // Project-wide config
    {
        files: ["**/*.{js,jsx}"],
        plugins: {
            "react-hooks": reactHooks,
        },
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.browser,
                ...globals.es2021,
            },
            parserOptions: {
                ecmaFeatures: { jsx: true },
            },
        },
        settings: {
            react: { version: "detect" },
        },
        rules: {
            // React Hooks — were installed but never enabled before
            ...reactHooks.configs.recommended.rules,

            // React
            "react/prop-types": "off",

            // JSDoc
            "jsdoc/require-jsdoc": [
                "warn",
                {
                    contexts: [
                        "ArrowFunctionExpression",
                        "FunctionDeclaration",
                        "FunctionExpression",
                        "MethodDefinition",
                    ],
                },
            ],
            "jsdoc/require-description": [
                "warn",
                {
                    contexts: [
                        "ArrowFunctionExpression",
                        "FunctionDeclaration",
                        "FunctionExpression",
                        "MethodDefinition",
                    ],
                },
            ],
            "jsdoc/require-param": [
                "warn",
                {
                    unnamedRootBase: ["props", "kwargs"],
                    checkDestructured: true,
                },
            ],
            "jsdoc/require-returns-type": "off",

            // Core
            "no-unused-vars": [
                "error",
                { destructuredArrayIgnorePattern: "^_" },
            ],
        },
    },

    // Prettier must come last to disable any style rules that conflict
    prettier,
];
