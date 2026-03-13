import { flatMap } from "es-toolkit";
import { InterfaceDeclaration, Node } from "ts-morph";
import { getJSDocPropertyNames } from "../../../../core/parser/jsdoc/jsdoc-utils.js";
import { ValidationError } from "../validate.types.js";
import { collectPropertySignaturePaths } from "./utils/collect-property-signature-paths.js";
import { findMissingDocs } from "./utils/find-missing-docs.js";
import { findUnusedDocs } from "./utils/find-unused-docs.js";
import { Validator } from "./validator.js";

export class InterfaceValidator extends Validator<InterfaceDeclaration> {
  protected collectErrors(): ValidationError[] {
    const properties = this.node.getProperties().filter(p => Node.isPropertySignature(p));

    const allPropertyPaths = flatMap(properties, p => collectPropertySignaturePaths(p));
    const methods = this.node.getMethods().map(m => m.getName());
    const allMemberPaths = [...allPropertyPaths, ...methods];

    const jsDocProperties = getJSDocPropertyNames(this.parsedJSDoc.properties ?? []);

    return [
      ...findMissingDocs({ codeSymbols: allMemberPaths, jsDocNames: jsDocProperties, errorType: "missing_property" }),
      ...findUnusedDocs({ codeSymbols: allMemberPaths, jsDocNames: jsDocProperties, errorType: "unused_property" }),
    ];
  }
}
