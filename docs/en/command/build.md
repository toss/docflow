# docflow build

Automatically generates Markdown documentation from TypeScript/JavaScript code with `@public` JSDoc tags.

### Basic Usage

Generates documentation for functions with `@public` tags from all packages in the current workspace.

```bash
docflow build
```

## Examples

### Generate to Specific Output Directory

Field used when the output directory is specified in the configuration file.

```javascript
export default {
  commands: {
    build: {
      outputDir: "docs/api",
    },
  },
};
```

### Generate Manifest File

Generate manifest file for VitePress sidebar or Nextra navigation. This file provides navigation structure data for generated documentation.

```javascript
export default {
  commands: {
    build: {
      manifest: {
        enabled: true,
        path: "docs/.vitepress/sidebar.json",
      },
    },
  },
};
```

### Using Custom Generator

When using generators for Nextra or other documentation systems, you can specify the generator name in the plugin. The default is `vitepress`.

```javascript
export default {
  commands: {
    build: {
      generator: {
        name: "nextra",
        signatureLanguage: "tsx",
      },
    },
  },
};
```

### Customizing Document Section Labels

You can customize section titles in generated documentation. By default, they are defined as parameters, returns, examples, etc.

```javascript
export default {
  commands: {
    build: {
      generator: {
        name: "vitepress",
        labels: {
          parameters: "Parameters",
          returns: "Returns",
          examples: "Examples",
          signature: "Usage",
        },
      },
    },
  },
};
```

## Internal Operation

When code changes occur, there can be inconsistencies between interfaces written as JSDoc comments and actual API documentation. Using the build command prevents these issues and maintains up-to-date documentation, allowing developers and users to get reliable information.

The `build` command analyzes project files and automatically generates Markdown documentation for functions, classes, interfaces, and more that have `@public` JSDoc tags.

### Internal Process

The internal procedure when the `docflow build` command is executed is as follows:

1. **Load Configuration File**: Read project settings from the `docflow.config.js` file.
2. **Explore Workspace Packages**: Find target packages according to configured include/exclude patterns.
3. **Initialize Plugin System**: Load registered plugins and prepare generators.
4. **Process Each Package**:
   - Load TypeScript configuration and parse source files
   - Extract only exported declarations, excluding barrel re-exports
   - Filter only declarations with `@public` JSDoc tags
   - Parse JSDoc comments to extract information needed for document generation
   - Generate and save Markdown documentation for each declaration
5. **Generate Manifest File**: Create navigation manifest file based on all generated document information.

### Output Structure

Generated documents have the following structure by default:

```
docs/references/
├── package-name/
│   ├── category/
│   │   ├── functionName.md
│   │   └── className.md
│   └── misc/
│       └── uncategorized.md
└── manifest.json
```

Folder structure is automatically organized according to JSDoc's `@category` tags or TypeScript declaration types (function, class, etc.).

## Configuration Options

### outputDir

- **Type**: `string`
- **Default**: `"docs/references"`
- **Description**: Directory path where generated documentation will be saved.

### generator.name

- **Type**: `string`
- **Default**: `"vitepress"`
- **Description**: Name of the generator to use. (vitepress or plugin name)

### generator.signatureLanguage

- **Type**: `string`
- **Default**: `"typescript"`
- **Description**: Language to use for code signature syntax highlighting. (typescript, tsx, javascript, etc.)

### generator.labels

- **Type**: `object`
- **Description**: You can customize labels for document sections.
- **Default**:
  ```typescript
  {
    parameters: "Parameters",
    returns: "Returns",
    throws: "Throws",
    examples: "Examples",
    see: "See",
    version: "Version",
    deprecated: "Deprecated",
    signature: "Signature",
    typedef: "Type Definitions"
  }
  ```

### manifest.enabled

- **Type**: `boolean`
- **Default**: `true`
- **Description**: Whether to generate manifest.json file.

### manifest.path

- **Type**: `string`
- **Default**: `outputDir + "/manifest.json"`
- **Description**: Path where the manifest file will be saved. (relative path from project root or absolute path)

### manifest.prefix

- **Type**: `string`
- **Default**: `"docs/references"`
- **Description**: Default prefix to be used for document links.
