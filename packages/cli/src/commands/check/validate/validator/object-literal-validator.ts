import { isEmpty } from "es-toolkit/compat";
import { Node, PropertyAssignment, VariableDeclaration } from "ts-morph";
import { getJSDocParameterNames } from "../../../../core/parser/jsdoc/jsdoc-utils.js";
import { ValidationError } from "../validate.types.js";
import { collectPropertyAssignmentPaths } from "./utils/collect-property-assignment-paths.js";
import { findMissingDocs } from "./utils/find-missing-docs.js";
import { findUnusedDocs } from "./utils/find-unused-docs.js";
import { Validator } from "./validator.js";

export class ObjectLiteralValidator extends Validator<VariableDeclaration> {
  protected collectErrors(): ValidationError[] {
    const properties = this.getProperties();
    if (isEmpty(properties)) {
      return [];
    }

    const allPropertyPaths = collectPropertyAssignmentPaths(properties);
    const jsDocParams = getJSDocParameterNames(this.parsedJSDoc.parameters ?? []);

    return [...findMissingDocs(allPropertyPaths, jsDocParams), ...findUnusedDocs(allPropertyPaths, jsDocParams)];
  }

  private getProperties(): PropertyAssignment[] {
    const initializer = this.node.getInitializer();

    if (!Node.isObjectLiteralExpression(initializer)) {
      return [];
    }

    return initializer.getProperties().filter(p => Node.isPropertyAssignment(p));
  }
}
