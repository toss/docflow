import { difference } from "es-toolkit";
import { isEmpty } from "es-toolkit/compat";
import { ClassDeclaration } from "ts-morph";
import { getJSDocParameterNames } from "../../../../core/parser/jsdoc/jsdoc-utils.js";
import { Validator } from "./validator.js";

export class ClassValidator extends Validator<ClassDeclaration> {
  validate() {
    const properties = this.node.getProperties().map((p) => p.getName());
    const methods = this.node.getMethods().map((m) => m.getName());
    const jsDocParams = getJSDocParameterNames(this.parsedJSDoc.parameters ?? []);
    const allValidNames = [...properties, ...methods];

    // TODO: The original implementation treated params, members, and properties all as params,
    // but each of them should be handled separately
    const missing = difference(properties, jsDocParams).map((target) => ({
      type: "missing_param" as const,
      target,
    }));

    const unused = difference(jsDocParams, allValidNames).map((target) => ({
      type: "unused_param" as const,
      target,
    }));

    const errors = [...missing, ...unused];
    return { errors, isValid: isEmpty(errors) };
  }
}
