# Plugin System

Docflow allows you to customize document generation and manifest structure through its plugin system. This enables integration with various documentation systems like Nextra, Docusaurus, and more, beyond the default VitePress.

## Plugin Configuration

You can register plugins in the plugins field of your configuration file.

```javascript
// docflow.config.js (or .ts, .mjs)
export default {
  plugins: [
    {
      name: "nextra-plugin",
      plugin: createNextraPlugin,
      options: {
        signatureLanguage: "typescript",
      },
    },
  ],
  commands: {
    build: {
      generator: {
        name: "nextra", // Use custom generator
      },
    },
  },
};
```

### Plugin Structure

Plugins must have the following structure:

```typescript
export interface Plugin {
  name: string;
  hooks: {
    transformManifest?: (
      manifest: SidebarItem[],
      context: PluginContext
    ) => SidebarItem[];
    provideGenerator?: () => MarkdownGenerator;
  };
}
```

### Plugin Hooks

#### provideGenerator Hook

Provides custom Markdown generators. This enables support for various documentation frameworks.

```typescript
provideGenerator: () => MarkdownGenerator;
```

#### transformManifest Hook

Transforms the generated manifest and saves it to a file.

```typescript
transformManifest: (manifest: SidebarItem[], context: PluginContext) => SidebarItem[]
```

## Creating a Nextra Plugin

Let's create a plugin for Nextra as an example. The plugin modifies the JSDoc format and converts it into MDX. You can copy and use the code below directly.

:::details Complete Plugin Code

````typescript
import {
  Plugin,
  ParsedJSDoc,
  TargetWithJSDoc,
  MarkdownDocument,
  MarkdownGenerator,
  GeneratedDoc,
  GeneratorConfig,
  MarkdownSection,
  SidebarItem,
  ParameterData,
  ReturnData,
  ExampleData,
} from "@docflow/cli";
import path from "path";

export class NextraGenerator implements MarkdownGenerator {
  private projectRoot: string;
  private signatureLanguage: string;

  constructor(config: GeneratorConfig) {
    this.projectRoot = config.projectRoot;
    this.signatureLanguage = config.signatureLanguage || "tsx";
  }

  generate(jsDocData: ParsedJSDoc, sourcePath?: string): MarkdownDocument {
    const sections: MarkdownSection[] = [];

    if (jsDocData.description) {
      sections.push({
        type: "description",
        content: jsDocData.description,
      });
    }

    if (jsDocData.signature) {
      sections.push(this.createSignatureSection(jsDocData.signature));
    }

    if (jsDocData.parameters.length > 0) {
      sections.push(this.createParametersSection(jsDocData.parameters));
    }

    if (jsDocData.returns) {
      sections.push(this.createReturnsSection(jsDocData.returns));
    }

    if (jsDocData.examples && jsDocData.examples.length > 0) {
      sections.push(this.createExamplesSection(jsDocData.examples));
    }

    return {
      frontmatter: this.createFrontmatter(jsDocData.name, sourcePath),
      sections,
    };
  }

  serialize(markdownDoc: MarkdownDocument): string {
    const parts: string[] = [];

    if (
      markdownDoc.frontmatter &&
      Object.keys(markdownDoc.frontmatter).length > 0
    ) {
      parts.push("---");
      for (const [key, value] of Object.entries(markdownDoc.frontmatter)) {
        if (typeof value === "string") {
          parts.push(`${key}: "${value}"`);
        } else {
          parts.push(`${key}: ${JSON.stringify(value)}`);
        }
      }
      parts.push("---");
      parts.push("");
    }

    for (const section of markdownDoc.sections) {
      parts.push(section.content);
      parts.push("");
    }

    return parts.join("\n").trim() + "\n";
  }

  generateDocs(target: TargetWithJSDoc, packagePath: string): GeneratedDoc {
    const filePath = target.filePath;
    const relativePath = this.generateRelativePath(target, packagePath);
    const markdownDoc = this.generate(target.parsedJSDoc, target.filePath);
    const content = this.serialize(markdownDoc);

    return {
      filePath,
      content,
      relativePath,
    };
  }

  private generateRelativePath(
    target: TargetWithJSDoc,
    packagePath: string
  ): string {
    const { parsedJSDoc: jsDocData, symbolName, kind } = target;
    const category = jsDocData.category || kind || "misc";
    const name = jsDocData.name || symbolName;
    const packageFolder = path.basename(packagePath);

    return path.join(packageFolder, category, `${name}.mdx`);
  }

  private createFrontmatter(
    title?: string,
    sourcePath?: string
  ): Record<string, unknown> {
    const frontmatter: Record<string, unknown> = {};

    if (title) {
      frontmatter.title = title;
    }

    if (sourcePath) {
      frontmatter.source = this.getRelativeSourcePath(sourcePath);
    }

    return frontmatter;
  }

  private getRelativeSourcePath(absolutePath: string): string {
    if (!this.projectRoot) {
      return absolutePath;
    }

    const relativePath = path.relative(this.projectRoot, absolutePath);
    return relativePath.startsWith("..") ? absolutePath : relativePath;
  }

  private createSignatureSection(signature: string): MarkdownSection {
    const normalizedSignature = signature
      .trim()
      .replace(/```\w*\n/g, "")
      .replace(/```/g, "")
      .trim();

    return {
      type: "signature",
      content: `## Usage\n\n\`\`\`${this.signatureLanguage}\n${normalizedSignature}\n\`\`\``,
    };
  }

  private createParametersSection(
    parameters: ParameterData[]
  ): MarkdownSection {
    const content = ["## Parameters", ""];

    content.push("| Name | Type | Description |");
    content.push("|------|------|-------------|");

    for (const param of parameters) {
      const required = param.required ? " (required)" : " (optional)";
      content.push(
        `| \`${param.name}\` | \`${param.type}\` | ${param.description}${required} |`
      );
    }

    return {
      type: "parameters",
      content: content.join("\n"),
    };
  }

  private createReturnsSection(returns: ReturnData): MarkdownSection {
    return {
      type: "returns",
      content: `## Returns\n\n**\`${returns.type}\`** - ${returns.description}`,
    };
  }

  private createExamplesSection(examples: ExampleData[]): MarkdownSection {
    const content = ["## Examples", ""];

    for (const example of examples) {
      content.push(example.code);
      content.push("");
    }

    return {
      type: "examples",
      content: content.join("\n"),
    };
  }
}

function transformForNextra(
  manifest: SidebarItem[]
): Record<string, string | { type: string; title: string }> {
  const meta: Record<string, string | { type: string; title: string }> = {};

  function processItems(items: SidebarItem[], prefix = "") {
    for (const item of items) {
      if (item.link) {
        const key = item.link.replace(".md", "").replace(".mdx", "");
        meta[key] = item.text;
      } else if (item.items) {
        meta[item.text] = {
          type: "folder",
          title: item.text,
        };
        processItems(item.items, `${prefix}${item.text}/`);
      }
    }
  }

  processItems(manifest);
  return meta;
}

export function createNextraPlugin(options: Record<string, unknown> = {}) {
  return {
    name: "nextra",
    hooks: {
      provideGenerator: () => {
        return new NextraGenerator({
          name: "nextra",
          projectRoot: process.cwd(),
          signatureLanguage: "typescript",
          ...options,
        });
      },
      transformManifest: (manifest: SidebarItem[]) => {
        return transformForNextra(manifest);
      },
    },
  } satisfies Plugin;
}
````

:::

### Using in Configuration File

```javascript
import { createNextraPlugin } from "./plugins/nextra-plugin.js";

export default {
  plugins: [
    {
      name: "nextra-plugin",
      plugin: createNextraPlugin,
      options: {
        signatureLanguage: "typescript",
      },
    },
  ],
  commands: {
    build: {
      outputDir: "docs/pages", // Nextra's default pages directory
      generator: {
        name: "nextra",
      },
      manifest: {
        enabled: true,
        path: "docs/pages/_meta.json", // Nextra's navigation file
      },
    },
  },
};
```

## Conclusion

Generate documentation using the Nextra plugin.

```bash
npx docflow build

docs/pages/
├── math/
│   └── calculateArea.mdx
└── _meta.json
```
