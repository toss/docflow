import * as commentParser from "comment-parser";
import { initial, uniq } from "es-toolkit";
import { isEmpty } from "es-toolkit/compat";
import { JSDoc } from "ts-morph";
import {
  ExampleData,
  ParameterData,
  ParsedJSDoc,
  PropertyData,
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
      properties: this.extractProperties(block),
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
      properties: [],
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
    const dedupedParamTags = this.dedupeTagsKeepingLastByName(paramTags);
    const normalizedParamTags = this.appendMissingAncestorPlaceholders(dedupedParamTags);

    return this.buildTagTree(normalizedParamTags);
  }

  private dedupeTagsKeepingLastByName(tags: commentParser.Spec[]): commentParser.Spec[] {
    const latestByName = new Map<string, commentParser.Spec>();
    for (const tag of tags) {
      latestByName.set(tag.name, tag);
    }

    return [...latestByName.values()];
  }

  private appendMissingAncestorPlaceholders(tags: commentParser.Spec[]): commentParser.Spec[] {
    return [...tags, ...this.createMissingAncestorPlaceholderTags(tags)];
  }

  private buildTagTree(tags: commentParser.Spec[]): ParameterData[] {
    const childrenByParent = this.groupTagsByParent(tags);
    const rootTags = this.getRootTags(tags);

    return rootTags.map(tag => this.toParameterData(tag, childrenByParent));
  }

  private getRootTags(tags: commentParser.Spec[]): commentParser.Spec[] {
    return tags.filter(tag => this.getParentName(tag.name) == null);
  }

  private toParameterData(tag: commentParser.Spec, childrenByParent: Map<string, commentParser.Spec[]>): ParameterData {
    return {
      name: this.getLeafName(tag.name),
      type: tag.type,
      description: tag.description,
      required: !tag.optional,
      defaultValue: tag.default,
      nested: this.buildNestedTags(tag.name, childrenByParent),
    };
  }

  private buildNestedTags(parentName: string, childrenByParent: Map<string, commentParser.Spec[]>): ParameterData[] {
    const childTags = childrenByParent.get(parentName) ?? [];

    return childTags.map(tag => this.toParameterData(tag, childrenByParent));
  }

  private groupTagsByParent(tags: commentParser.Spec[]): Map<string, commentParser.Spec[]> {
    const childrenByParent = new Map<string, commentParser.Spec[]>();

    for (const tag of tags) {
      const parentName = this.getParentName(tag.name);
      if (parentName == null) {
        continue;
      }

      const existingChildren = childrenByParent.get(parentName);
      if (existingChildren != null) {
        existingChildren.push(tag);

        continue;
      }

      childrenByParent.set(parentName, [tag]);
    }

    return childrenByParent;
  }

  private createMissingAncestorPlaceholderTags(tags: commentParser.Spec[]): commentParser.Spec[] {
    const existingNames = new Set(tags.map(tag => tag.name));
    const ancestorNames = tags.flatMap(tag => this.getAncestorNames(tag.name));
    const missingNames = uniq(ancestorNames.filter(name => !existingNames.has(name)));

    return missingNames.map(name => this.createPlaceholderTag(name));
  }

  private getAncestorNames(tagName: string): string[] {
    const parentName = this.getParentName(tagName);
    if (parentName == null) {
      return [];
    }

    return [parentName, ...this.getAncestorNames(parentName)];
  }

  private getParentName(tagName: string): string | null {
    const segments = tagName.split(".");
    const hasParent = segments.length > 1;
    if (hasParent) {
      return initial(segments).join(".");
    }

    return null;
  }

  private getLeafName(tagName: string): string {
    const segments = tagName.split(".");

    return segments.at(-1) ?? tagName;
  }

  private createPlaceholderTag(name: string): commentParser.Spec {
    return {
      tag: "tag",
      name,
      type: "Object",
      description: "",
      optional: false,
      default: undefined,
      source: [],
      problems: [],
    };
  }

  private extractProperties(block: commentParser.Block): PropertyData[] {
    const propertyTags = block.tags.filter(tag => tag.tag === "property");
    const dedupedPropertyTags = this.dedupeTagsKeepingLastByName(propertyTags);
    const normalizedPropertyTags = this.appendMissingAncestorPlaceholders(dedupedPropertyTags);
    const parameterTree = this.buildTagTree(normalizedPropertyTags);

    return parameterTree.map(param => this.toPropertyData(param));
  }

  private toPropertyData(param: ParameterData): PropertyData {
    return {
      name: param.name,
      type: param.type,
      description: param.description,
      required: param.required,
      defaultValue: param.defaultValue,
      nested: param.nested?.map(nested => this.toPropertyData(nested)),
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

    // comment-parser destructs @category Foo Bar -> name: Foo, description: Bar
    const value = [name, description]
      .filter(x => !isEmpty(x))
      .join(" ")
      .trim();

    return value || undefined;
  }
}
