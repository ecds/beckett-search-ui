module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        "plugin:react/recommended",
        "airbnb",
        "plugin:react/jsx-runtime",
        "plugin:jsdoc/recommended",
        "prettier",
    ],
    overrides: [],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
    plugins: ["react", "jsdoc"],
    rules: {
        "react/prop-types": [0],
        "jsdoc/require-jsdoc": [
            1,
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
            1,
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
        "jsdoc/require-returns-type": [0],
        "import/prefer-default-export": "off",
        "no-unused-vars": ["error", { destructuredArrayIgnorePattern: "^_" }],
    },
};
