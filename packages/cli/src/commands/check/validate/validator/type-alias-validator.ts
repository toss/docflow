import { flatMap } from "es-toolkit";
import { Node, TypeAliasDeclaration } from "ts-morph";
import { getJSDocPropertyNames } from "../../../../core/parser/jsdoc/jsdoc-utils.js";
import { ValidationError } from "../validate.types.js";
import { collectPropertySignaturePaths } from "./utils/collect-property-signature-paths.js";
import { findMissingDocs } from "./utils/find-missing-docs.js";
import { findUnusedDocs } from "./utils/find-unused-docs.js";
import { Validator } from "./validator.js";

export class TypeAliasValidator extends Validator<TypeAliasDeclaration> {
  protected collectErrors(): ValidationError[] {
    const typeNode = this.node.getTypeNode();

    if (!Node.isTypeLiteral(typeNode)) {
      return [];
    }

    const properties = typeNode.getProperties().filter(p => Node.isPropertySignature(p));

    const allPropertyPaths = flatMap(properties, p => collectPropertySignaturePaths(p));
    const jsDocProperties = getJSDocPropertyNames(this.parsedJSDoc.properties ?? []);

    return [
      ...findMissingDocs({ codeSymbols: allPropertyPaths, jsDocNames: jsDocProperties, errorType: "missing_property" }),
      ...findUnusedDocs({ codeSymbols: allPropertyPaths, jsDocNames: jsDocProperties, errorType: "unused_property" }),
    ];
  }
}
