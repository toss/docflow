# Getting Started

If you understand Docflow's [core concepts](/en/core-concept) and have completed [installation](/en/installation) and [configuration](/en/config), it's time to actually add Docflow to your project and learn how to create documentation.

## Step 1: Set up Documentation Site

First, make sure you have a docs folder in your project root. This is where [reference documentation](/en/core-concept#reference-documentation) will be stored. If you don't have a docs folder, you need to install and configure a documentation framework.

This tutorial explains how to configure with VitePress.

### VitePress Initialization

Install VitePress and run the initial setup.

```bash
npx vitepress init

┌  Welcome to VitePress!
│
◇  Where should VitePress initialize the config?
│  ./docs // Choose a folder name like docs
│
◇  Site title:
│  my-library // Enter the title of your documentation site
│
◇  Site description:
│  This this is my-library // Feel free to enter a description for your documentation site
│
◇  Theme:
│  Default Theme // Feel free to choose a theme
│
◇  Use TypeScript for config and theme files?
│  Yes // Choose whether to use TypeScript
│
◇  Add VitePress npm scripts to package.json?
│  Yes // Choose whether to add VitePress-related scripts to package.json
│
└  Done! Now run npm run docs:dev and start writing.

Tips:
- Make sure to add  docs/.vitepress/dist and  docs/.vitepress/cache to your .gitignore file.
```

### VitePress Basic Configuration

Now a `docs/.vitepress/config.ts` file should be created. This file is VitePress's configuration file and contains basic settings for the documentation site. For more detailed VitePress configuration options, refer to the [official documentation](https://vitepress.dev/guide/getting-started) or Docflow's [configuration guide](/en/config).

## Step 2: Prepare Functions to Document

After completing the documentation setup, let's create the structure and functions to document as follows.

```txt
packages
├── core
│   └── index.ts
└── math
    └── index.ts
```

First, add new functions to the files.

```typescript
// packages/core/src/index.ts
export function fetchData(url: string): Promise<any> {
  return fetch(url).then((response) => response.json());
}

// packages/math/src/index.ts
export function calculateArea(radius: number): number {
  return Math.PI * radius * radius;
}
```

## Step 3: Automatic JSDoc Generation

Now add the `@generate` tag to the functions to have AI automatically generate JSDoc.

```typescript
// packages/core/src/index.ts
/**
 * @generate
 */
export function fetchData(url: string): Promise<any> {
  return fetch(url).then((response) => response.json());
}

// packages/math/src/index.ts
/**
 * @generate
 */
export function calculateArea(radius: number): number {
  return Math.PI * radius * radius;
}
```

Now run the `npx docflow generate` command. When the command runs, you'll see the following prompt. Select "All targets".

```bash
npx docflow generate
  - @libs/root (.)
  - core (packages/core)
  - internal (packages/internal)
  - math (packages/math)
📝 core processing...
📝 math processing...
? Select targets for JSDoc generation: …
❯ All targets
  1. core (core)
  2. calculateArea (math)
✔ Select targets for JSDoc generation: · All targets
✅ /packages/core/index.ts core updated
✅ /packages/math/index.ts math updated
✅ generate done
```

If everything went well, JSDoc comments will be automatically added to the `packages/core/src/index.ts` and `packages/math/src/index.ts` files as follows. Check the files to confirm.

````typescript
/**
 * @public
 * @kind function
 * @category index
 * @name core
 * @signature
 * ```typescript
 * function core(): string;
 * ```
 *
 * @description
 * A function that performs core functionality. This function executes the system's core logic and returns the result as a string.
 * Using this function allows you to easily use the system's main functionality.
 *
 * @returns {string} Returns the result of executing the system's core logic as a string.
 *
 * @example
 * ```typescript
 * import { core } from '@libs/core';
 *
 * const result = core();
 * console.log(result);
 * ```
 *
 * @version [1.0.0] Initial version
 * - Implemented the system's core functionality.
 */
export function core() {
  return "core";
}

// src/utils/math.ts
/**
 * @public
 * @kind function
 * @category index
 *
 * @name calculateArea
 * @signature
 * ```typescript
 * function calculateArea(radius: number): number;
 * ```
 *
 * @description
 * Calculates the area of a circle using the given radius. A simple function that returns the area of a circle when you input the radius.
 *
 * @param {number} radius The radius of the circle in pixels. The radius must be positive.
 * @returns {number} Returns the area of the circle. If the radius is less than or equal to 0, returns 0.
 *
 * @example
 * ```typescript
 * import { calculateArea } from '@libs/math';
 *
 * const area = calculateArea(5);
 * console.log(area); // 78.53981633974483
 * ```
 */
export function calculateArea(radius: number): number {
  return Math.PI * radius * radius;
}
````

## Step 4: Create Markdown Documentation

Now convert functions with `@public` tags to Markdown documents so you can view cleanly parsed JSDoc documentation in the browser.

```bash
npx docflow build
```

When executed, the following files will be generated.

```
docs/references/
├── core/
│   └── index/
│       └── core.md
├── math/
│   └── index/
│       └── calculateArea.md
└── manifest.json
```

## Step 5: Integrate with Documentation Site

Docflow can integrate with various documentation sites. Integrate the generated `manifest.json` with the sidebar.

### VitePress Integration

```typescript
import { defineConfig } from "vitepress";
import manifest from "../docs/references/manifest.json";

export default defineConfig({
  themeConfig: {
    sidebar: [
      {
        text: "Reference",
        items: reference,
      },
    ],
  },
});
```

```bash
npm run docs:dev
```

Now if you access `http://localhost:5173/references/math/index/calculateArea` in your browser, you should see the documentation displayed properly.

## Step 6: Documentation Validation

Let's assume a new spec has been added to the math.ts file. Add a new `calculateVolume` function.

```typescript
// packages/math/src/index.ts
export function calculateArea(radius: number): number {
  return Math.PI * radius * radius;
}

// Add new function
export function calculateVolume(radius: number, height: number): number {
  return Math.PI * radius * radius * height;
}
```

This spec also needs documentation. What happens if you add it without documentation? Check with the `docflow check` command.

```bash
npx docflow check
📝 core processing...
✅ core has JSDoc for all exports

📝 math processing...
❌ math has missing JSDoc:
  - packages/math/index.ts:calculateVolume
```

As you can see, the newly added `calculateVolume` function is missing the `@public` tag. **Synchronizing code and documentation** like this is a core feature of Docflow.

Add documentation to the newly added function:

```typescript
// packages/math/src/index.ts

/**
 * @generate
 */
export function calculateVolume(radius: number, height: number): number {
  return Math.PI * radius * radius * height;
}
```

Then run `npx docflow generate` again to generate JSDoc, and update the documentation with `npx docflow build`. This way you can immediately reflect code changes in the documentation!

## Next Steps

Now you've learned the basic usage of Docflow! For more detailed configuration and advanced features, refer to the following documentation.

- [Plugin System](/en/plugins)
-
