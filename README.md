# Docflow &middot; [![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/toss/docflow/blob/main/LICENSE) [![NPM badge](https://img.shields.io/npm/v/docflow?logo=npm)](https://www.npmjs.com/package/docflow)

English | [한국어](https://github.com/toss/docflow/blob/main/README-ko_kr.md)

Docflow is a TypeScript-first documentation generator that automatically creates API documentation from JSDoc comments.

- Docflow automatically generates comprehensive documentation from JSDoc comments, supporting essential tags like `@public`, `@category`, and `@example`.
- Designed with AI integration in mind, Docflow can [generate complete JSDoc comments](https://docflow.slash.page/en/command/generate.html) for your functions with a single `@generate` tag.
- Docflow provides accurate TypeScript type extraction, ensuring your documentation always matches your actual code signatures.
- Docflow includes a powerful plugin system, allowing you to generate documentation for [VitePress](https://vitepress.dev/), [Docusaurus](https://docusaurus.io/), [Nextra](https://nextra.site/), and more.

## Examples

```typescript
import { createCalculator } from "@toss/utils";

/**
 * @public
 * @category Math
 * Creates a calculator instance with the given initial value
 * @param initialValue - The starting value for calculations
 * @returns A calculator object with calculation methods
 * @example
 * const calc = createCalculator(10);
 * calc.add(5).multiply(2).getValue(); // 30
 */
export function createCalculator(initialValue: number) {
  return {
    add: (n: number) => createCalculator(initialValue + n),
    multiply: (n: number) => createCalculator(initialValue * n),
    getValue: () => initialValue,
  };
}
```

With just `docflow build`, this becomes a beautiful documentation page with examples, type information, and more.

## Contributing

We welcome contribution from everyone in the community. Read below for detailed contribution guide.

[CONTRIBUTING](https://github.com/toss/docflow/blob/main/.github/CONTRIBUTING.md)

## License

MIT © Toss. See [LICENSE](./LICENSE) for details.

<a title="Toss" href="https://toss.im">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://static.toss.im/logos/png/4x/logo-toss-reverse.png">
    <img alt="Toss" src="https://static.toss.im/logos/png/4x/logo-toss.png" width="100">
  </picture>
</a>
