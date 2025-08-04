import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Disable unused imports check
      "@typescript-eslint/no-unused-vars": "off",
      "no-unused-vars": "off",

      // Disable missing type checks
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-return": "off",

      // Disable other strict type checks
      "@typescript-eslint/prefer-nullish-coalescing": "off",
      "@typescript-eslint/prefer-optional-chain": "off",
      "@typescript-eslint/no-unnecessary-type-assertion": "off",
      "@typescript-eslint/no-non-null-assertion": "off",

      // Disable import order checks
      "import/no-unused-modules": "off",
      "import/order": "off",

      // Disable React specific unused checks
      "react/jsx-uses-react": "off",
      "react/jsx-uses-vars": "off",
      "react/no-unused-prop-types": "off",

      // Disable React HTML entity checks
      "react/no-unescaped-entities": "off",

      // Disable Next.js image optimization warnings
      "@next/next/no-img-element": "off",

      // Disable React Hooks rules
      "react-hooks/exhaustive-deps": "off",
      "react-hooks/rules-of-hooks": "off",

      // Disable prefer-const rule
      "prefer-const": "off",

      // Disable other common rules that might cause issues
      "@typescript-eslint/prefer-const": "off",
      "no-console": "off",
      "@typescript-eslint/no-inferrable-types": "off",
      "@typescript-eslint/ban-ts-comment": "off",
    },
  },
];

export default eslintConfig;
