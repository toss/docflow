import { difference, flatMap } from "es-toolkit";
import { isEmpty } from "es-toolkit/compat";
import { InterfaceDeclaration, Node, PropertySignature } from "ts-morph";
import { getJSDocParameterNames } from "../../../../core/parser/jsdoc/jsdoc-utils.js";
import { Validator } from "./validator.js";

export class InterfaceValidator extends Validator<InterfaceDeclaration> {
  validate() {
    const properties = this.node
      .getProperties()
      .filter((p) => Node.isPropertySignature(p));

    const allPropertyPaths = flatMap(properties, (p) => collectPropertyPaths(p));
    const methods = this.node.getMethods().map((m) => m.getName());

    const jsDocParams = getJSDocParameterNames(this.parsedJSDoc.parameters ?? []);

    // TODO: The original implementation treated params, members, and properties all as params,
    // but each of them should be handled separately
    const missing = difference(allPropertyPaths, jsDocParams).map((target) => ({
      type: "missing_param" as const,
      target,
    }));

    const allValidPaths = [...allPropertyPaths, ...methods];
    const unused = difference(jsDocParams, allValidPaths).map((target) => ({
      type: "unused_param" as const,
      target,
    }));

    const errors = [...missing, ...unused];
    return { errors, isValid: isEmpty(errors) };
  }
}

function collectPropertyPaths(prop: PropertySignature, prefix = ""): string[] {
  const name = prop.getName();
  const fullPath = prefix !== "" ? `${prefix}.${name}` : name;
  const typeNode = prop.getTypeNode();

  if (!Node.isTypeLiteral(typeNode)) {
    return [fullPath];
  }

  const nestedProps = typeNode
    .getProperties()
    .filter((p) => Node.isPropertySignature(p));

  if (isEmpty(nestedProps)) {
    return [fullPath];
  }

  return [fullPath, ...flatMap(nestedProps, (p) => collectPropertyPaths(p, fullPath))];
}
