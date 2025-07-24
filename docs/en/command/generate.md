# docflow generate

AI automatically generates complete JSDoc comments for functions with `@generate` JSDoc tags.

## Examples

### Basic Usage

Finds functions with `@generate` tags from all packages in the current workspace and automatically generates JSDoc.

```bash
docflow generate
```

### AI Fetcher Configuration

To generate JSDoc using AI services, you need to configure a fetcher function.

```javascript
export default {
  commands: {
    generate: {
      jsdoc: {
        fetcher: async ({ signature, prompt }) => {
          const response = await fetch(
            "https://api.openai.com/v1/chat/completions",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
              },
              body: JSON.stringify({
                model: "gpt-4",
                messages: [{ role: "user", content: prompt }],
              }),
            },
          );
          const data = await response.json();
          return data.choices[0].message.content;
        },
      },
    },
  },
};
```

### Custom Prompt Configuration

You can customize the prompt used for JSDoc generation.

```javascript
export default {
  commands: {
    generate: {
      jsdoc: {
        fetcher: myFetcher,
        prompt: `
Generate comprehensive JSDoc documentation for this function.
Include @public, @param, @returns, and @example tags.
`,
      },
    },
  },
};
```

## Internal Operation

Using the `@generate` tag allows AI to analyze function signatures and automatically generate and update complete JSDoc comments.

The `generate` command finds functions with `@generate` tags in each package and has AI automatically generate complete JSDoc including `@public` tags. The generated JSDoc includes parameter descriptions, return values, and example code.

### Internal Process

The internal procedure when the `docflow generate` command is executed is as follows:

1. **Load Configuration File**: Read project settings and AI fetcher from the `docflow.config.js` file.
2. **Explore Workspace Packages**: Find target packages according to configured include/exclude patterns.
3. **Process Each Package**:
   - Load TypeScript configuration and parse source files
   - Extract only exported declarations, excluding barrel re-exports
   - Filter only declarations with `@generate` JSDoc tags
   - Extract TypeScript signatures for each function
4. **File Selection**: Users can choose which functions to generate JSDoc for.
5. **AI JSDoc Generation**: AI generates JSDoc for selected functions and saves them to files.

### Output Example

Shows the generation process in the following format:

```bash
npx docflow generate
  - @libs/root (.)
  - core (packages/core)
  - math (packages/math)
📝 core processing...
📝 math processing...
? Select targets for JSDoc generation: …
❯ All targets
  1. fetchData (core)
  2. calculateArea (math)
✔ Select targets for JSDoc generation: · All targets
✅ packages/core/index.ts fetchData updated
✅ packages/math/index.ts calculateArea updated
✅ generate done
```

### Before and After Comparison

**Before:**

```typescript
/**
 * @generate
 */
export function calculateArea(radius: number): number {
  return Math.PI * radius * radius;
}
```

**After:**

````typescript
/**
 * @public
 * @kind function
 * @category Math
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

## Configuration Options

### jsdoc.fetcher

- **Type**: `(params: { signature: string, prompt: string }) => Promise<string>`
- **Required**: true
- **Description**: Function that fetches JSDoc from AI services. You can use any AI service like OpenAI, Claude, Gemini, etc.

### jsdoc.prompt

- **Type**: `string`
- **Default**: Built-in English prompt
- **Description**: Prompt to use for JSDoc generation. You can customize it to your desired style or language.