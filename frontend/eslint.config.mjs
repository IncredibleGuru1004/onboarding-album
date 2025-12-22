import { defineConfig } from 'eslint/config'
import eslintPlugin from '@eslint/js'
import { configs as tseslintConfigs } from 'typescript-eslint'
 
const eslintConfig = defineConfig([
    {
        name: 'project/javascript-recommended',
        files: ['**/*.{js,mjs,ts,tsx}'],
        ...eslintPlugin.configs.recommended,
    },
])
 
const typescriptConfig = defineConfig([
    {
        name: 'project/typescript-strict',
        files: ['**/*.{ts,tsx,mjs}'],
        extends: [
            ...tseslintConfigs.strictTypeChecked,
            ...tseslintConfigs.stylisticTypeChecked,
        ],
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
                ecmaFeatures: {
                    jsx: true,
                },
                warnOnUnsupportedTypeScriptVersion: true,
            },
        },
        rules: {
            '@typescript-eslint/no-unsafe-call': 'off',
            '@typescript-eslint/triple-slash-reference': 'off',
        },
    },
    {
        name: 'project/javascript-disable-type-check',
        files: ['**/*.{js,mjs,cjs}'],
        ...tseslintConfigs.disableTypeChecked,
    }
])
 
const ignoresConfig = defineConfig([
    {
        name: 'project/ignores',
        ignores: ['.next/', 'node_modules/', 'public/', '.vscode/', 'next-env.d.ts']
    },
])
 
export default defineConfig([
    ...ignoresConfig,
    ...eslintConfig,
    ...typescriptConfig,
])