import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

const ignoredFolders = ["!.github/**/*", "!file_storage/**/*", "!node_modules/**/*", "!prisma/**/*"];

// Разрешить консоль в dev, запретить в продакшн
const isDev = !["DEV", "EVAL"].includes(process.env.ENVIROMENT)

export default defineConfig([
    /**
     * Node.js — root
     */
    {
        files: ["**/*.js", "**/*.cjs", "**/*.mjs", "!webpage/**/*", ...ignoredFolders],
        plugins: { js },
        extends: ["js/recommended"],
        languageOptions: {
            globals: { ...globals.node },
            parserOptions: {
                sourceType: "script",
                ecmaVersion: 2022,
            },
        },
        rules: {
            "no-console": isDev ? "off" : "error",
            "no-unused-vars": ["warn"],
            "no-undef": "error"
        },
    },

    /**
     * Frontend - /webpage
     */
    {
        files: ["webpage/**/*.js", "webpage/**/*.mjs", ...ignoredFolders],
        plugins: { js },
        extends: ["js/recommended"],
        languageOptions: {
            globals: { ...globals.browser },
            parserOptions: {
                ecmaVersion: 2022,
                sourceType: "module",
            },
        },
        rules: {
            "no-console": isDev ? "off" : "error",
            "no-unused-vars": ["warn"],
            "no-undef": "error",
        },
    },
]);
