import {
  ParsedJSDoc,
  TypedefData,
  ParameterData,
  ReturnData,
  ThrowsData,
  ExampleData,
  SeeData,
  VersionData,
} from "../../types/parser.types.js";
import { MarkdownSection } from "../../types/generator.types.js";
import { TargetWithJSDoc } from "../../types/parser.types.js";
import {
  GeneratorConfig,
  defaultVitePressLabels,
} from "../../types/generator.types.js";
import path from "path";
import {
  GeneratedDoc,
  MarkdownDocument,
  MarkdownGenerator,
} from "../../types/generator.types.js";

export class VitePressGenerator implements MarkdownGenerator {
  private labels: typeof defaultVitePressLabels;
  private projectRoot: string;
  private signatureLanguage: string;

  constructor(config: GeneratorConfig) {
    this.labels = {
      ...defaultVitePressLabels,
      ...config.labels,
    };
    this.projectRoot = config.projectRoot;
    this.signatureLanguage = config.signatureLanguage || "tsx";
  }

  generate(jsDocData: ParsedJSDoc, sourcePath?: string): MarkdownDocument {
    const sections: MarkdownSection[] = [];

    if (jsDocData.name) {
      sections.push(this.createTitleSection(jsDocData.name));
    }

    if (jsDocData.deprecated) {
      sections.push(this.createDeprecatedSection(jsDocData.deprecated));
    }

    if (jsDocData.description) {
      sections.push(this.createDescriptionSection(jsDocData.description));
    }

    if (jsDocData.signature) {
      sections.push(this.createSignatureSection(jsDocData.signature));
    }

    if (jsDocData.typedef && jsDocData.typedef.length > 0) {
      sections.push(this.createTypedefSection(jsDocData.typedef));
    }

    if (jsDocData.parameters && jsDocData.parameters.length > 0) {
      sections.push(this.createParametersSection(jsDocData.parameters));
    }

    if (jsDocData.returns) {
      sections.push(this.createReturnsSection(jsDocData.returns));
    }

    if (jsDocData.throws && jsDocData.throws.length > 0) {
      sections.push(this.createThrowsSection(jsDocData.throws));
    }

    if (jsDocData.examples && jsDocData.examples.length > 0) {
      sections.push(this.createExamplesSection(jsDocData.examples));
    }

    if (jsDocData.see && jsDocData.see.length > 0) {
      sections.push(this.createSeeSection(jsDocData.see));
    }

    if (jsDocData.version && jsDocData.version.length > 0) {
      sections.push(this.createVersionSection(jsDocData.version));
    }

    return {
      frontmatter: this.createFrontmatter(sourcePath),
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
        parts.push(`${key}: ${JSON.stringify(value)}`);
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

    return path.join(packageFolder, category, `${name}.md`);
  }

  private createFrontmatter(sourcePath?: string): Record<string, unknown> {
    const frontmatter: Record<string, unknown> = {};

    if (sourcePath) {
      frontmatter.sourcePath = this.getRelativeSourcePath(sourcePath);
    }

    return frontmatter;
  }

  private getRelativeSourcePath(absolutePath: string): string {
    if (!this.projectRoot) {
      return absolutePath;
    }

    const relativePath = path.relative(this.projectRoot, absolutePath);
    if (relativePath.startsWith("..")) {
      return absolutePath;
    }

    return relativePath;
  }

  private createTitleSection(name: string): MarkdownSection {
    return {
      type: "title",
      content: `# ${name}`,
    };
  }

  private createDeprecatedSection(deprecated: string): MarkdownSection {
    return {
      type: "deprecated",
      content: `::: warning ${this.labels.deprecated}\n${deprecated}\n:::`,
    };
  }

  private createDescriptionSection(description: string): MarkdownSection {
    return {
      type: "description",
      content: description,
    };
  }

  private createSignatureSection(signature: string): MarkdownSection {
    const normalizedSignature = signature
      .trim()
      .replace(/```\w*\n/g, "")
      .replace(/```/g, "")
      .trim();

    return {
      type: "signature",
      content: `## ${this.labels.signature}\n\n\`\`\`${this.signatureLanguage}\n${normalizedSignature}\n\`\`\``,
    };
  }

  private createTypedefSection(typedefs: TypedefData[]): MarkdownSection {
    const content = [`### ${this.labels.typedef}`, ""];

    for (const typedef of typedefs) {
      content.push(`#### \`${typedef.name}\``);
      content.push(`*\`${typedef.type}\`*`);

      if (typedef.description) {
        content.push(typedef.description);
      }

      content.push("");

      for (const prop of typedef.properties) {
        const requiredText = prop.required ? "" : " (optional)";
        const defaultText = prop.defaultValue
          ? `, default = ${prop.defaultValue}`
          : "";
        content.push(
          `- \`${prop.name}\`${requiredText}${defaultText} ${prop.description}`,
        );
      }

      content.push("");
    }

    return {
      type: "typedef",
      content: content.join("\n"),
    };
  }

  private createParametersSection(
    parameters: ParameterData[],
  ): MarkdownSection {
    const content = [`### ${this.labels.parameters}`, ""];

    content.push('<ul class="post-parameters-ul">');

    for (const param of parameters) {
      if (!param.name.includes(".")) {
        content.push(this.renderParameter(param, true));
      }
    }

    content.push("</ul>");

    return {
      type: "parameters",
      content: content.join("\n"),
    };
  }

  private renderParameter(param: ParameterData, isRoot = false): string {
    const cssClass = isRoot ? "post-parameters-li-root" : "";
    const requiredText = param.required
      ? '<span class="post-parameters--required">Required</span>'
      : "";
    const defaultText = param.defaultValue
      ? `<span class="post-parameters--default">${this.escapeHtml(
          param.defaultValue,
        )}</span>`
      : "";

    const typeText = `<span class="post-parameters--type">${this.escapeHtml(
      param.type,
    )}</span>`;

    const cleanedDescription = param.description.replace(/^-\s*/, "").trim();

    const afterNameParts = [typeText, defaultText].filter(
      (part) => part.length > 0,
    );
    const afterNameText =
      afterNameParts.length > 0 ? " · " + afterNameParts.join(" · ") : "";

    const lines = [
      `  <li class="post-parameters-li ${cssClass}">`,
      `    <span class="post-parameters--name">${param.name}</span>${requiredText}${afterNameText}`,
      `    <br/>`,
      `    <p class="post-parameters--description">${this.toHTMLCode(
        cleanedDescription,
      )}</p>`,
    ];

    if (param.nested && param.nested.length > 0) {
      lines.push('    <ul class="post-parameters-ul">');
      for (const nested of param.nested) {
        lines.push(this.renderParameter(nested, false));
      }
      lines.push("    </ul>");
    }

    lines.push("  </li>");
    return lines.join("\n");
  }

  private createReturnsSection(returns: ReturnData): MarkdownSection {
    const nameText = returns.name ? `${returns.name} ` : "";

    const content = [
      `### ${this.labels.returns}`,
      "",
      '<ul class="post-parameters-ul">',
      '  <li class="post-parameters-li post-parameters-li-root">',
      `    <span class="post-parameters--type">${this.escapeHtml(
        returns.type,
      )}</span>`,
      "    <br/>",
      `    <p class="post-parameters--description">${nameText}${returns.description}</p>`,
      "  </li>",
      "</ul>",
    ];

    if (returns.properties && returns.properties.length > 0) {
      content.push("");
      for (const prop of returns.properties) {
        const requiredText = prop.required ? "" : " (optional)";
        const defaultText = prop.defaultValue
          ? `, default: ${prop.defaultValue}`
          : "";
        content.push(
          `- \`${prop.name}\`: ${prop.description}${requiredText}${defaultText}`,
        );
      }
    }

    return {
      type: "returns",
      content: content.join("\n"),
    };
  }

  private createThrowsSection(throws: ThrowsData[]): MarkdownSection {
    const content = [`### ${this.labels.throws}`, ""];
    content.push('<ul class="post-parameters-ul">');

    for (const throwItem of throws) {
      const nameText = throwItem.name ? `${throwItem.name} ` : "";
      content.push('  <li class="post-parameters-li post-parameters-li-root">');
      content.push(
        `    <span class="post-parameters--type">${this.escapeHtml(
          throwItem.type,
        )}</span>`,
      );
      content.push("    <br/>");
      content.push(
        `    <p class="post-parameters--description">${nameText}${throwItem.description}</p>`,
      );
      content.push("  </li>");
    }

    content.push("</ul>");

    return {
      type: "throws",
      content: content.join("\n"),
    };
  }

  private createExamplesSection(examples: ExampleData[]): MarkdownSection {
    const content = [`## ${this.labels.examples}`, ""];

    for (const example of examples) {
      content.push(example.code);
      content.push("");
    }

    return {
      type: "examples",
      content: content.join("\n"),
    };
  }

  private createSeeSection(seeItems: SeeData[]): MarkdownSection {
    const content = [`## ${this.labels.see}`, ""];

    for (const item of seeItems) {
      const description = item.description ? ` ${item.description}` : "";
      content.push(`* ${item.reference}${description}`);
    }

    return {
      type: "see",
      content: content.join("\n"),
    };
  }

  private createVersionSection(versions: VersionData[]): MarkdownSection {
    const content = [
      `### ${this.labels.version}`,
      "",
      "|Version|Changes|",
      "|-|-|",
    ];

    for (const version of versions) {
      const versionText = version.platforms
        ? version.platforms.map((p) => `**\`${p}\`**`).join(" ")
        : `**\`${version.version}\`**`;

      content.push(`| ${versionText} |${version.description}|`);
    }

    return {
      type: "version",
      content: content.join("\n"),
    };
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  private toHTMLCode(text: string): string {
    return text
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noreferrer">$1</a>',
      );
  }
}
