import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const asArray = (c) => (Array.isArray(c) ? c : [c]);

const eslintConfig = [
  ...asArray(nextCoreWebVitals),
  ...asArray(nextTypescript),
  {
    ignores: [".next/**", "node_modules/**", "supabase/**", ".claude/**"],
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
];

export default eslintConfig;
