# Core Concepts

Docflow is a tool that automatically generates library documentation based on [JSDoc](https://jsdoc.app/). JSDoc is a standard way to write documentation information as comments in JavaScript code. This document introduces the core concepts and features of Docflow.

## Flow Overview

![concept-flow](/public/images/en/core-concept/concept-flow.png)

## Supported JSDoc Tags

Docflow supports JSDoc's standard tags and custom tags for document generation. Each tag serves specific purposes and plays various roles in the document generation process.

**Standard JSDoc Tags**: [`@param`](https://jsdoc.app/tags-param.html), [`@returns`](https://jsdoc.app/tags-returns.html), [`@throws`](https://jsdoc.app/tags-throws.html), [`@example`](https://jsdoc.app/tags-example.html), [`@deprecated`](https://jsdoc.app/tags-deprecated.html), [`@see`](https://jsdoc.app/tags-see.html), [`@version`](https://jsdoc.app/tags-version.html), [`@description`](https://jsdoc.app/tags-description.html), [`@kind`](https://jsdoc.app/tags-kind.html), [`@name`](https://jsdoc.app/tags-name.html)

**Docflow-specific Tags**: `@public`, `@category`, `@generate`

These tags can be combined to automatically generate structured documentation.

### `@public` Tag

The `@public` tag marks targets to be documented as public API.

```typescript
/**
 * @public
 * ... other JSDoc descriptions ...
 */
export function getUser(id: string): User {
  // ...
}
```

- **When running `docflow build`**: Selects only exports with `@public` tags and generates them as documentation.
- **When running `docflow check`**: Finds and reports functions or classes that are exported as public APIs but are missing `@public` tags.

### `@generate` Tag

The `@generate` tag marks targets for automatic JSDoc generation through AI.

```typescript
/**
 * @generate
 */
export function calculateTotalPrice(
  items: CartItem[],
  discountRate: number
): number {
  // ...
}
```

- **When running `docflow generate`**: Passes function signatures and context to LLM to automatically generate complete JSDoc comments and apply them to code.

## JSDoc Template Usage

Docflow uses standardized JSDoc templates for consistent document generation. Here are examples used in actual code and parts of the generated documentation.

### Tag Examples

````typescript
/**
 * @public
 * @kind function
 * @category Math
 * @name calculateArea
 * @signature
 * ```typescript
 * calculateArea(radius: number): number
 * ```
 * @description
 * Calculates the area of a circle. Takes a radius and returns the exact area using pi (π) and square calculations.
 *
 * @param {number} radius - The radius of the circle (must be positive)
 * @returns {number} The calculated area of the circle
 *
 * @example
 * ```typescript
 * import { calculateArea } from '@mylib/math';
 *
 * const area = calculateArea(5);
 * console.log(area); // 78.53981633974483
 * ```
 *
 * @version Android/5.186.0, iOS/5.231.0, Web/5.0.0
 */
export function calculateArea(radius: number): number {
  return Math.PI * radius * radius;
}
````

### Document Conversion Result

#### **Generated file path**

```
docs/references/math/calculateArea.md
```

#### **Markdown result**

````markdown
---
source: packages/math/src/calculateArea.ts
---

# calculateArea

```typescript
calculateArea(radius: number): number
```

Calculates the area of a circle. Takes a radius and returns the exact area using pi (π) and square calculations.

## Parameters

| Name   | Type   | Description                                 |
| ------ | ------ | ------------------------------------------- |
| radius | number | The radius of the circle (must be positive) |

## Returns

| Type   | Description                       |
| ------ | --------------------------------- |
| number | The calculated area of the circle |

## Example

```typescript
import { calculateArea } from "@mylib/math";

const area = calculateArea(5);
console.log(area); // 78.53981633974483
```

In Browser, you can see it like the image below.
![markdown-example](/public/images/en/core-concept/markdown-exmaple.png)

## Version

- Android: 5.186.0
- iOS: 5.231.0
- Web: 5.0.0
````

### File Structure Determination

Let's learn how files are organized based on JSDoc tags.

**Decision Rules**

1. `@name` tag → filename (uses function name if not present)
2. Folder name decision priority:
   - `@category` tag value (highest priority)
   - Auto-detected TypeScript declaration type (function, class, interface, type, enum, variable)
   - `"misc"` (default)

**Actual behavior examples**

```typescript
// Using @category tag (highest priority)
/** @public @category Math */
export function add(a: number, b: number): number {}
// Result: Math/add.md

// Auto-detection (TypeScript based)
/** @public */
export function multiply(x: number, y: number): number {}
// Result: function/multiply.md

/** @public */
export class Calculator {}
// Result: class/Calculator.md

/** @public */
export interface UserConfig {}
// Result: interface/UserConfig.md
```

**Generated folder structure:**

```
docs/references/
├── Math/           ← @category "Math"
├── function/       ← auto-detected kind
├── class/          ← auto-detected kind
├── interface/      ← auto-detected kind
├── type/           ← auto-detected kind
├── enum/           ← auto-detected kind
├── variable/       ← auto-detected kind
└── misc/           ← default value
```

:::note
The `@kind` tag is parsed as a standard JSDoc tag, but is not currently used for folder structure determination in the VitePress generator. Folder names only use the `@category` tag and TypeScript auto-detection.
:::

## Plugin System

The plugin system is used when you want to extend or customize Docflow's basic functionality. For example, it's useful when you want to generate documentation for Docusaurus or Nextra instead of VitePress, or when you want to modify the structure of generated documents to match your organization's rules.

### Generator Plugin

```js
{
  plugins: [
    {
      name: "custom-generator",
      plugin: () => ({
        hooks: {
          provideGenerator: (name) => {
            if (name === "custom") {
              return new CustomGenerator();
            }
          },
        },
      }),
    },
  ];
}
```

Generator plugins allow support for various document formats. In addition to the default VitePress, you can integrate with desired documentation systems like Docusaurus, Nextra, etc.

### Manifest Transformation

```js
{
  hooks: {
    transformManifest: (manifest) => {
      // Transform VitePress sidebar format to Docusaurus navigation
      return manifest.map((item) => ({
        type: "category",
        label: item.text,
        items: item.items?.map((subItem) => ({
          type: "doc",
          id: subItem.link.replace(".md", ""),
        })),
      }));
    };
  }
}
```

You can transform the VitePress manifest format that Docflow generates by default into formats that can be used in other documentation systems. For example, you can automatically transform to Docusaurus's `sidebars.js` format or Nextra's `_meta.json` format.

## Signature Analysis

Docflow can accurately analyze and document even complex TypeScript types through AST (Abstract Syntax Tree)

**Complex Type Example:**

```typescript
// Input: Complex types like generics, conditional types, union types
export function process<T extends BaseType>(
  data: T[],
  options?: ProcessOptions<T>
): Promise<Result<T>>;
```
