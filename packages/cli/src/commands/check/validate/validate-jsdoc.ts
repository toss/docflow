import { Node } from "ts-morph";
import { JSDocParser } from "../../../core/parser/jsdoc/jsdoc-parser.js";
import { EMPTY_PARSED_JSDOC, getJSDoc } from "../../../core/parser/jsdoc/jsdoc-utils.js";
import { FunctionValidator } from "./validator/function-validator.js";
import { InterfaceValidator } from "./validator/interface-validator.js";
import { ObjectLiteralValidator } from "./validator/object-literal-validator.js";
import { TypeAliasValidator } from "./validator/type-alias-validator.js";

export function validate(node: Node) {
  const validator = createValidator(node);

  if (validator != null) {
    return validator.validate();
  }

  return { errors: [], isValid: true };
}

function createValidator(node: Node) {
  const jsDocParser = new JSDocParser();
  const jsDoc = getJSDoc(node);
  const parsedJSDoc = jsDoc != null ? jsDocParser.parse(jsDoc) : EMPTY_PARSED_JSDOC;

  if (Node.isFunctionDeclaration(node)) {
    return new FunctionValidator(node, parsedJSDoc);
  }

  if (Node.isVariableDeclaration(node)) {
    const initializer = node.getInitializer();

    if (Node.isArrowFunction(initializer) || Node.isFunctionExpression(initializer)) {
      return new FunctionValidator(node, parsedJSDoc);
    }

    if (Node.isObjectLiteralExpression(initializer)) {
      return new ObjectLiteralValidator(node, parsedJSDoc);
    }
  }

  if (Node.isInterfaceDeclaration(node)) {
    return new InterfaceValidator(node, parsedJSDoc);
  }

  if (Node.isTypeAliasDeclaration(node)) {
    return new TypeAliasValidator(node, parsedJSDoc);
  }

  return null;
}
