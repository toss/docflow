# Project Configuration

## Basic Configuration

Create a `docflow.config.js` file in your project root. Below is an example configuration file.

:::warning
The configuration file should be adjusted to fit your project. The example below shows basic configuration.
Settings may vary depending on the package manager and workspace you use.
:::

```js
/** @type {import('docflow').Config} */
export default {
  project: {
    root: process.cwd(), // Project root directory
    packageManager: "yarn", // Package manager: 'npm' | 'yarn' | 'pnpm'
    workspace: {
      include: ["packages/*"], // Workspace patterns to include
      exclude: ["packages/internal-*"], // Workspace patterns to exclude
    },
  },
  commands: {
    build: {
      // Documentation build settings
      outputDir: "docs/references", // Documentation output directory
      manifest: {
        enabled: true, // Whether to generate manifest file
        prefix: "docs/references", // Manifest path prefix
      },
      generator: {
        name: "vitepress", // Documentation generator type
        signatureLanguage: "typescript", // Signature language
      },
    },
    check: {
      // Documentation validation settings
      entryPoints: ["packages/core/src/index.ts"], // Entry points (auto-detected)
    },
    generate: {
      jsdoc: {
        fetcher: async ({ signature, prompt }) => {
          // Call AI services like OpenAI, Claude
          const response = await fetch(
            "https://api.openai.com/v1/chat/completions",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: "gpt-4",
                messages: [
                  { role: "system", content: prompt },
                  { role: "user", content: signature },
                ],
              }),
            }
          );
          const data = await response.json();
          return data.choices[0].message.content;
        },
      },
    },
  },
};
```

With this configuration, you can now use `docflow build`, `docflow check`, and `docflow generate` commands to automatically generate and manage your documentation.

## Detailed Configuration Options

Docflow provides a flexible configuration system. Let's learn in detail how each configuration option actually works.

## Overall Configuration Structure

```js
/** @type {import('docflow').Config} */
export default {
  project: {
    root: process.cwd(),
    packageManager: "yarn", // "npm" | "yarn" | "pnpm"
    workspace: {
      include: ["packages/*"],
      exclude: ["packages/internal-*"],
    },
  },
  commands: {
    build: {
      /* ... */
    },
    check: {
      /* ... */
    },
    generate: {
      /* ... */
    },
  },
  plugins: [
    // Custom plugins
  ],
};
```

## project Configuration

### `project.root` (Required)

Sets the root directory of the project. This becomes the reference point for all relative paths.

```js
{
  project: {
    root: process.cwd(); // Current directory
  }
}
```

### `project.packageManager` (Required)

Specifies the package manager to use. This changes how workspaces are detected.

```js
{
  project: {
    packageManager: "yarn"; // "yarn" | "pnpm" | "npm"
  }
}
```

**Internal behavior:**

Docflow uses different commands for each package manager to collect workspace information and converts all results to an array in the format `[{name, location}]`. `name` is the package name, and `location` is the relative path.

| Package Manager | Command                          | Result                                |
| --------------- | -------------------------------- | ------------------------------------- |
| yarn            | `yarn workspaces list --json`    | Array<{name, location}>               |
| pnpm            | `pnpm list -r --depth=-1 --json` | Array<{name, version, path, ...}>     |
| npm             | `npm ls --json`                  | Array<{name, version, location, ...}> |

### `project.workspace`

Determines which packages to include and exclude in the workspace.

```js
{
  project: {
    workspace: {
      include: ["packages/*", "apps/*"], // Patterns to include
      exclude: ["packages/internal-*"]   // Patterns to exclude
    }
  }
}
```

**Example:**

```js
// With this configuration
workspace: {
  include: ["packages/*"],
  exclude: ["packages/internal-*"]
}

// Filters as follows:
// ✅ packages/core -> included
// ✅ packages/ui -> included
// ❌ packages/internal-utils -> excluded
// ❌ apps/web -> excluded (not in include)
```

## commands.build Configuration

These are the settings used when the `docflow build` command is executed. You can determine where documents will be generated, what format they'll be output in, whether to create manifest files, and more. For detailed usage of the build command, see the [build command documentation](/en/command/build).

### `outputDir`

The directory where generated documentation will be saved. All Markdown files are saved in this directory, and subdirectories are created for each package.

```js
{
  commands: {
    build: {
      outputDir: "docs/references"; // default value
    }
  }
}
```

With the above configuration, core and ui subdirectories are created as follows:

```txt
docs/
└── references/
    ├── core/
    │   ├── index.md
    │   └── utils.md
    └── ui/
        ├── button.md
        └── input.md
```

### `manifest` Configuration

Manifest files are automatically generated during document builds and contain VitePress sidebar format navigation structure. They are generated like `docs/en/reference/manifest.json` and can be used directly in VitePress configuration as `items: koReferenceManifest`.

```js
{
  commands: {
    build: {
      manifest: {
        enabled: true,                    // default: true
        prefix: "en/reference",        // default: same as outputDir
        path: "docs/references"           // default: same as outputDir
      }
    }
  }
}
```

When `enabled` is set to `true`, a `docs/references/manifest.json` file is generated. `prefix` is the path prefix used when generating links in the manifest, creating links like `/docs/references/core/index.md` with the above configuration. `path` specifies where the manifest file will be saved, and by default uses the same value as `outputDir`.

**Example of generated manifest:**

```json
[
  {
    "text": "cli", // Top-level category
    "collapsed": true,
    "items": [
      {
        "text": "Configuration", // Sub-category
        "collapsed": true,
        "items": [
          {
            "text": "Config", // Document title
            "link": "/en/reference/cli/Configuration/Config.md" // VitePress link
          }
        ]
      },
      {
        "text": "Generator",
        "collapsed": true,
        "items": [
          {
            "text": "MarkdownDocument",
            "link": "/en/reference/cli/Generator/MarkdownDocument.md"
          },
          {
            "text": "MarkdownGenerator",
            "link": "/en/reference/cli/Generator/MarkdownGenerator.md"
          }
        ]
      }
    ]
  }
]
```

### `generator` Configuration

Controls how documentation is generated. By default, it generates Markdown documents that can work with VitePress. You can also generate in other formats through plugins.

```js
{
  commands: {
    build: {
      generator: {
        name: "vitepress",                // Required: generator name
        signatureLanguage: "typescript",  // default: "typescript"
        labels: {                         // label customization
          typedef: "Type Definition"
          signature: "Signature",
          parameters: "Parameters",
          returns: "Returns",
          throws: "Throws",
          examples: "Examples",
          see: "See",
          version: "Version",
          deprecated: "Deprecated",
        }
      }
    }
  }
}
```

`name` determines which generator to use (built-in "vitepress" or plugin name). `signatureLanguage` is used for language highlighting in code blocks.

`labels` allows you to customize section headers in generated documents. Here are the default values and how they appear in documentation:

```markdown
## Signature (signature)

### Parameters (parameters)

### Returns (returns)

### Throws (throws)

### Examples (examples)

### See Also (see)

### Version (version)

### Deprecated (deprecated)
```

## commands.check Configuration

### `entryPoints`

Specifies entry points for documentation validation.

```js
{
  commands: {
    check: {
      entryPoints: ["src/index.ts", "src/api.ts"]; // optional
    }
  }
}
```

If not configured, entry points are automatically detected from the `main` or `exports` fields in `package.json`. If neither exists, `["index.ts"]` is used as the default. This command finds and reports public exports that are missing `@public` tags.

## commands.generate Configuration

### `jsdoc` Configuration

The generate command automatically generates and updates JSDoc comments using AI for functions with `@generate` tags. The `fetcher` function calls AI services using the function's TypeScript signature and prompt to generate JSDoc.

```js
{
  commands: {
    generate: {
      jsdoc: {
        fetcher: async ({ signature, prompt }) => {
          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: 'gpt-4',
              messages: [
                { role: 'system', content: prompt },
                { role: 'user', content: signature }
              ]
            })
          });
          const data = await response.json();
          return data.choices[0].message.content;
        },
        prompt: "Custom prompt..." // optional
      }
    }
  }
}
```

If you don't set a custom `prompt`, the default JSDoc generation guide is used.

## plugins Configuration

Configure plugins that customize document generation methods or add new output formats. For example, you can generate documentation for Nextra or Docusaurus instead of VitePress, or modify the generated manifest structure.

```js
{
  plugins: [
    {
      name: "custom-generator",
      plugin: (options) => ({
        hooks: {
          // Manifest transformation
          transformManifest: (manifest) => {
            // Modify manifest structure
            return modifiedManifest;
          },
          // Provide custom generator
          provideGenerator: (name) => {
            if (name === "custom-generator") {
              return new CustomGenerator();
            }
          },
        },
      }),
      options: {
        // Plugin options
        customOption: "value",
      },
    },
  ];
}
```

Plugins must return a `hooks` object. Currently supported hooks are `transformManifest` (transform generated manifest structure) and `provideGenerator` (provide custom document generators), which are automatically called during the build process.
