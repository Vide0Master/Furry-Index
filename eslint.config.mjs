import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import noUnsanitized from "eslint-plugin-no-unsanitized";

const ignoredFolders = [
    "!.github/**/*",
    "!file_storage/**/*",
    "!node_modules/**/*",
    "!prisma/**/*"
];

const isDev = !["DEV", "EVAL"].includes(process.env.ENVIROMENT);

const commonRules = {
    "no-console": isDev ? "off" : "error",
    "no-unused-vars": ["warn"],
    "no-undef": "error",

    "no-shadow-restricted-names": "error",
    "no-self-compare": "error",
    "no-useless-return": "error",

    quotes: ["error", "double", { allowTemplateLiterals: true }],

    "no-eval": "error",
    "no-new-func": "error",
    "no-implied-eval": "error",
    "no-script-url": "error",

    "no-unsanitized/property": "error",

    "no-control-regex": "error",
    "no-regex-spaces": "error",

    "no-fallthrough": "error",

    "no-empty": ["error", { allowEmptyCatch: false }]
};

export default defineConfig([
    /**
     * Node.js — root
     */
    {
        files: ["**/*.js", "**/*.cjs", "**/*.mjs", "!webpage/**/*", ...ignoredFolders],
        plugins: { js, "no-unsanitized": noUnsanitized },
        extends: ["js/recommended"],
        languageOptions: {
            globals: { ...globals.node },
            parserOptions: {
                sourceType: "script",
                ecmaVersion: 2022
            }
        },
        rules: {
            ...commonRules
        }
    },

    /**
     * Frontend - /webpage
     */
    {
        files: ["webpage/**/*.js", "webpage/**/*.mjs", ...ignoredFolders],
        plugins: { js, "no-unsanitized": noUnsanitized },
        extends: ["js/recommended"],
        languageOptions: {
            globals: { ...globals.browser },
            parserOptions: {
                ecmaVersion: 2022,
                sourceType: "module"
            }
        },
        rules: {
            ...commonRules
        }
    }
]);
