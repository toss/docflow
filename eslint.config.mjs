import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "**/dist/",
      "**/esm/",
      "**/.next/",
      "**/.next-local/",
      "**/fixtures/",
      ".pnp.*",
      ".yarn/",
      "docs/",
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
);
