# 플러그인 시스템

Docflow는 플러그인 시스템을 통해 문서 생성과 manifest 구조를 커스터마이징할 수 있어요. 덕분에 기본 VitePress 외에도 Nextra, Docusaurus 등 다양한 문서 시스템과 연동할 수 있어요.

## 플러그인 설정

설정 파일의 plugins 필드에 플러그인을 등록할 수 있어요.

```javascript
// docflow.config.js (또는 .ts, .mjs)
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
        name: "nextra", // 커스텀 제너레이터 사용
      },
    },
  },
};
```

### 플러그인 구조

플러그인은 다음과 같은 구조를 가져야 해요.

```typescript
export interface Plugin {
  name: string;
  hooks: {
    transformManifest?: (
      manifest: SidebarItem[],
      context: PluginContext,
    ) => SidebarItem[];
    provideGenerator?: () => MarkdownGenerator;
  };
}
```

### 플러그인 훅

#### provideGenerator 훅

커스텀 Markdown 제너레이터를 제공해요. 덕분에 다양한 문서 프레임워크를 사용할 수 있게 돼요.

```typescript
provideGenerator: () => MarkdownGenerator;
```

#### transformManifest 훅

생성된 manifest를 변환해서 파일로 저장할 수 있어요.

```typescript
transformManifest: (manifest: SidebarItem[], context: PluginContext) => SidebarItem[]
```

## Nextra 플러그인 만들기

예시로 Nextra 프레임워크에서도 사용할 수 있게 mdx로 변환하고, JSDoc 포맷을 수정하는 플러그인을 만들어볼게요. 아래 코드를 복사해서 바로 사용할 수 있어요.

:::details 전체 플러그인 코드

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
    packagePath: string,
  ): string {
    const { parsedJSDoc: jsDocData, symbolName, kind } = target;
    const category = jsDocData.category || kind || "misc";
    const name = jsDocData.name || symbolName;
    const packageFolder = path.basename(packagePath);

    return path.join(packageFolder, category, `${name}.mdx`);
  }

  private createFrontmatter(
    title?: string,
    sourcePath?: string,
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
      content: `## 사용법\n\n\`\`\`${this.signatureLanguage}\n${normalizedSignature}\n\`\`\``,
    };
  }

  private createParametersSection(
    parameters: ParameterData[],
  ): MarkdownSection {
    const content = ["## 매개변수", ""];

    content.push("| 이름 | 타입 | 설명 |");
    content.push("|------|------|------|");

    for (const param of parameters) {
      const required = param.required ? " (필수)" : " (선택)";
      content.push(
        `| \`${param.name}\` | \`${param.type}\` | ${param.description}${required} |`,
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
      content: `## 반환값\n\n**\`${returns.type}\`** - ${returns.description}`,
    };
  }

  private createExamplesSection(examples: ExampleData[]): MarkdownSection {
    const content = ["## 예제", ""];

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
  manifest: SidebarItem[],
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

### 설정 파일에서 사용하기

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
      outputDir: "docs/pages", // Nextra의 기본 페이지 디렉토리
      generator: {
        name: "nextra",
      },
      manifest: {
        enabled: true,
        path: "docs/pages/_meta.json", // Nextra의 네비게이션 파일
      },
    },
  },
};
```

## 마무리

Nextra 플러그인을 사용하여 문서를 생성해보세요.

```bash
npx docflow build

docs/pages/
├── math/
│   └── calculateArea.mdx
└── _meta.json
```
