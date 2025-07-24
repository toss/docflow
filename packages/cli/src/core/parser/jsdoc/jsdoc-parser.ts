import { JSDoc } from "ts-morph";
import * as commentParser from "comment-parser";
import {
  ParsedJSDoc,
  ParameterData,
  ReturnData,
  ThrowsData,
  TypedefData,
  ExampleData,
  SeeData,
  VersionData,
} from "../../types/parser.types.js";

const LANGUAGE = "tsx";

export class JSDocParser {
  parse(jsDoc: JSDoc): ParsedJSDoc {
    if (!jsDoc) {
      return this.createEmptyJSDocData();
    }
    const jsDocText = jsDoc.getFullText();

    const parsed = commentParser.parse(jsDocText, {
      spacing: "preserve",
    });

    if (parsed.length === 0) {
      return this.createEmptyJSDocData();
    }

    const block = parsed[0];
    if (!block) {
      return this.createEmptyJSDocData();
    }

    return {
      name: this.extractName(block),
      description: this.extractDescription(block),
      category: this.extractCategory(block),
      kind: this.extractKind(block),
      signature: this.extractSignature(block),
      deprecated: this.extractDeprecated(block),
      examples: this.extractExamples(block),
      parameters: this.extractParameters(block),
      returns: this.extractReturns(block),
      throws: this.extractThrows(block),
      typedef: this.extractTypedefs(block),
      see: this.extractSee(block),
      version: this.extractVersions(block),
    };
  }

  private createEmptyJSDocData(): ParsedJSDoc {
    return {
      examples: [],
      parameters: [],
      throws: [],
      typedef: [],
      see: [],
      version: [],
    };
  }

  private extractDescription(block: commentParser.Block): string | undefined {
    const descriptionTag = block.tags.find((tag) => tag.tag === "description");
    if (!descriptionTag) return undefined;

    const name = descriptionTag.name;
    const description = descriptionTag.description;

    return [name, description].join(" ");
  }

  private extractName(block: commentParser.Block): string | undefined {
    return this.findTagValue(block, "name");
  }

  private extractCategory(block: commentParser.Block): string | undefined {
    return this.findTagValue(block, "category");
  }

  private extractKind(block: commentParser.Block): string | undefined {
    return this.findTagValue(block, "kind");
  }

  private extractDeprecated(block: commentParser.Block): string | undefined {
    const tag = block.tags.find((t) => t.tag === "deprecated");
    if (!tag) return undefined;

    const nameMessage = tag.name;
    const fullMessage = tag.description;
    const deprecatedText = [nameMessage, fullMessage].join(" ");

    return deprecatedText;
  }

  private extractSignature(block: commentParser.Block): string | undefined {
    const signatureTag = block.tags.find((tag) => tag.tag === "signature");
    if (!signatureTag) return undefined;

    const signatureText = signatureTag.description.trim();
    return signatureText;
  }

  private extractParameters(block: commentParser.Block): ParameterData[] {
    const paramTags = block.tags.filter((tag) => tag.tag === "param");
    const parameters: ParameterData[] = [];
    const paramMap = new Map<string, ParameterData>();

    for (const tag of paramTags) {
      const param = this.parseParameterTag(tag);
      if (!param) continue;

      if (param.name.includes(".")) {
        this.handleNestedParameter(param, paramMap, parameters);
      } else {
        paramMap.set(param.name, param);
        parameters.push(param);
      }
    }

    return parameters;
  }

  private parseParameterTag(tag: commentParser.Spec): ParameterData {
    const { type, name, description, optional, default: defaultValue } = tag;

    return {
      name,
      type,
      description,
      required: !optional,
      defaultValue: defaultValue,
      nested: [],
    };
  }

  private handleNestedParameter(
    param: ParameterData,
    paramMap: Map<string, ParameterData>,
    parameters: ParameterData[],
  ): void {
    const parts = param.name.split(".");
    const parentName = parts[0];
    if (!parentName) return;

    let parent = paramMap.get(parentName);

    if (!parent) {
      parent = {
        name: parentName,
        type: "Object",
        description: "",
        required: true,
        defaultValue: undefined,
        nested: [],
      };
      paramMap.set(parentName, parent);
      parameters.push(parent);
    }

    const nestedParam = { ...param, name: parts.slice(1).join(".") };
    parent.nested = parent.nested || [];
    parent.nested.push(nestedParam);
  }

  private extractReturns(block: commentParser.Block): ReturnData | undefined {
    const returnTag = block.tags.find((tag) => tag.tag === "returns");
    if (!returnTag) return undefined;

    const propertyTags = block.tags.filter((tag) => tag.tag === "property");
    const properties = propertyTags.map((tag) => ({
      name: tag.name,
      description: tag.description,
      required: !tag.optional,
      defaultValue: tag.default,
    }));

    return {
      type: returnTag.type,
      name: returnTag.name,
      description: returnTag.description,
      properties: properties.length > 0 ? properties : undefined,
    };
  }

  private extractThrows(block: commentParser.Block): ThrowsData[] {
    const throwsTags = block.tags.filter((tag) => tag.tag === "throws");

    return throwsTags.map((tag) => ({
      type: tag.type,
      name: tag.name,
      description: tag.description,
    }));
  }

  private extractTypedefs(block: commentParser.Block): TypedefData[] {
    const typedefTags = block.tags.filter((tag) => tag.tag === "typedef");
    const propertyTags = block.tags.filter((tag) => tag.tag === "property");

    return typedefTags.map((tag) => {
      const name = tag.name;
      const type = tag.type;
      const description = tag.description;

      const properties = propertyTags.map((tag) => ({
        name: tag.name,
        type: tag.type,
        description: tag.description,
        required: !tag.optional,
        defaultValue: tag.default,
      }));

      return {
        name,
        type,
        description,
        properties,
      };
    });
  }

  private extractExamples(block: commentParser.Block): ExampleData[] {
    const exampleTags = block.tags.filter((tag) => tag.tag === "example");

    return exampleTags.map((tag) => {
      const content = tag.description;

      return {
        code: content,
        language: LANGUAGE,
      };
    });
  }

  private extractSee(block: commentParser.Block): SeeData[] {
    const seeTags = block.tags.filter((tag) => tag.tag === "see");

    return seeTags.map((tag) => {
      const reference = tag.name || tag.type;
      const description = tag.description;

      return {
        reference,
        description: description || undefined,
      };
    });
  }

  private extractVersions(block: commentParser.Block): VersionData[] {
    const versionTags = block.tags.filter((tag) => tag.tag === "version");

    return versionTags.map((tag) => {
      const versionName = tag.name;
      const description = tag.description;

      const platforms = versionName.includes("/")
        ? versionName.split("/")
        : undefined;

      return {
        version: versionName,
        description: description,
        platforms,
      };
    });
  }

  private findTagValue(
    block: commentParser.Block,
    tagName: string,
  ): string | undefined {
    const tag = block.tags.find((t) => t.tag === tagName);
    if (!tag) return undefined;

    const name = tag.name;
    const description = tag.description;

    return name || description;
  }
}
