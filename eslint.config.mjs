import stylistic from "@stylistic/eslint-plugin";
import tseslint from "typescript-eslint";

export default [
    {
        ignores: [
            ".expo/",
            "node_modules/",
        ],
    },
    {
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
    },
    {
        files: ["**/*.{js,jsx,ts,tsx,mjs,cjs}"],
        plugins: {
            "@stylistic": stylistic,
        },
        rules: {
            "@stylistic/brace-style": ["error", "stroustrup", { allowSingleLine: false }],
            "@stylistic/indent": ["error", 4, { SwitchCase: 1 }],
            "@stylistic/max-len": ["error", { code: 120, tabWidth: 4 }],
            "@stylistic/quotes": ["error", "double", { avoidEscape: true }],
            "@stylistic/semi": ["error", "always"],
            "curly": ["error", "all"],
        },
    },
];
