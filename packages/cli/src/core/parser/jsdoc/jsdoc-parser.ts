import * as commentParser from "comment-parser";
import { initial, uniq } from "es-toolkit";
import { JSDoc } from "ts-morph";
import {
  ExampleData,
  ParameterData,
  ParsedJSDoc,
  ReturnData,
  SeeData,
  ThrowsData,
  TypedefData,
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
    const descriptionTag = block.tags.find(tag => tag.tag === "description");
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
    const tag = block.tags.find(t => t.tag === "deprecated");
    if (!tag) return undefined;

    const nameMessage = tag.name;
    const fullMessage = tag.description;
    const deprecatedText = [nameMessage, fullMessage].join(" ");

    return deprecatedText;
  }

  private extractSignature(block: commentParser.Block): string | undefined {
    const signatureTag = block.tags.find(tag => tag.tag === "signature");
    if (!signatureTag) return undefined;

    const signatureText = signatureTag.description.trim();
    return signatureText;
  }

  private extractParameters(block: commentParser.Block): ParameterData[] {
    const paramTags = block.tags.filter(tag => tag.tag === "param");
    const uniqueParamTags = this.removeDuplicateParamTags(paramTags);
    const allParamTags = [...uniqueParamTags, ...this.createMissingParentParams(uniqueParamTags)];
    const topLevelParams = allParamTags.filter(paramTag => !paramTag.name.includes("."));

    return topLevelParams.map(paramTag => this.paramTagToParameterData(paramTag, allParamTags));
  }

  // only keep the last tag with the same name
  private removeDuplicateParamTags(paramTags: commentParser.Spec[]): commentParser.Spec[] {
    const uniqueByName = new Map<string, commentParser.Spec>();
    for (const paramTag of paramTags) {
      uniqueByName.set(paramTag.name, paramTag);
    }

    return [...uniqueByName.values()];
  }

  private paramTagToParameterData(paramTag: commentParser.Spec, allParamTags: commentParser.Spec[]): ParameterData {
    return {
      name: this.getParamShortName(paramTag.name),
      type: paramTag.type,
      description: paramTag.description,
      required: !paramTag.optional,
      defaultValue: paramTag.default,
      nested: this.buildNestedParams(paramTag.name, allParamTags),
    };
  }

  private buildNestedParams(parentParamName: string, allParamTags: commentParser.Spec[]): ParameterData[] {
    const childParams = allParamTags.filter(paramTag => this.getParentParamName(paramTag.name) === parentParamName);

    return childParams.map(paramTag => this.paramTagToParameterData(paramTag, allParamTags));
  }

  private createMissingParentParams(paramTags: commentParser.Spec[]): commentParser.Spec[] {
    const existingParamNames = paramTags.map(paramTag => paramTag.name);
    const ancestorParamNames = paramTags.flatMap(paramTag => this.getParamAncestorNames(paramTag.name));
    const missingParentNames = uniq(ancestorParamNames.filter(name => !existingParamNames.includes(name)));

    return missingParentNames.map(name => this.createParamPlaceholderTag(name));
  }

  private getParamAncestorNames(paramName: string): string[] {
    const parentName = this.getParentParamName(paramName);
    if (parentName == null) {
      return [];
    }

    return [parentName, ...this.getParamAncestorNames(parentName)];
  }

  private getParentParamName(paramName: string): string | null {
    const segments = paramName.split(".");
    const hasParent = segments.length > 1;
    if (hasParent) {
      return initial(segments).join(".");
    }

    return null;
  }

  private getParamShortName(paramName: string) {
    const segments = paramName.split(".");

    return segments.at(-1) ?? paramName;
  }

  private createParamPlaceholderTag(name: string): commentParser.Spec {
    return {
      tag: "param",
      name,
      type: "Object",
      description: "",
      optional: false,
      default: undefined,
      source: [],
      problems: [],
    };
  }

  private extractReturns(block: commentParser.Block): ReturnData | undefined {
    const returnTag = block.tags.find(tag => tag.tag === "returns");
    if (!returnTag) return undefined;

    const propertyTags = block.tags.filter(tag => tag.tag === "property");
    const properties = propertyTags.map(tag => ({
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
    const throwsTags = block.tags.filter(tag => tag.tag === "throws");

    return throwsTags.map(tag => ({
      type: tag.type,
      name: tag.name,
      description: tag.description,
    }));
  }

  private extractTypedefs(block: commentParser.Block): TypedefData[] {
    const typedefTags = block.tags.filter(tag => tag.tag === "typedef");
    const propertyTags = block.tags.filter(tag => tag.tag === "property");

    return typedefTags.map(tag => {
      const name = tag.name;
      const type = tag.type;
      const description = tag.description;

      const properties = propertyTags.map(tag => ({
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
    const exampleTags = block.tags.filter(tag => tag.tag === "example");

    return exampleTags.map(tag => {
      const content = tag.description;

      return {
        code: content,
        language: LANGUAGE,
      };
    });
  }

  private extractSee(block: commentParser.Block): SeeData[] {
    const seeTags = block.tags.filter(tag => tag.tag === "see");

    return seeTags.map(tag => {
      const reference = tag.name || tag.type;
      const description = tag.description;

      return {
        reference,
        description: description || undefined,
      };
    });
  }

  private extractVersions(block: commentParser.Block): VersionData[] {
    const versionTags = block.tags.filter(tag => tag.tag === "version");

    return versionTags.map(tag => {
      const versionName = tag.name;
      const description = tag.description;

      const platforms = versionName.includes("/") ? versionName.split("/") : undefined;

      return {
        version: versionName,
        description: description,
        platforms,
      };
    });
  }

  private findTagValue(block: commentParser.Block, tagName: string): string | undefined {
    const tag = block.tags.find(t => t.tag === tagName);
    if (!tag) return undefined;

    const name = tag.name;
    const description = tag.description;

    return name || description;
  }
}
