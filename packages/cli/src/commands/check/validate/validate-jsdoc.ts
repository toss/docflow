import { Node } from 'ts-morph';
import { JSDocParser } from '../../../core/parser/jsdoc/jsdoc-parser.js';
import { getJSDoc } from '../../../core/parser/jsdoc/jsdoc-utils.js';
import { ParsedJSDoc } from '../../../core/types/parser.types.js';
import { ClassValidator } from './validator/class-validator.js';
import { FunctionValidator } from './validator/function-validator.js';


export function validate(node: Node) {
  const validator = createValidator(node);

  if (validator != null) {
    return validator.validate();
  }

  return { errors: [], isValid: true };
}

const EMPTY_PARSED_JSDOC: ParsedJSDoc = {
  examples: [],
  parameters: [],
  throws: [],
  typedef: [],
  see: [],
  version: [],
};

function createValidator(node: Node) {
  const jsDocParser = new JSDocParser();
  const jsDoc = getJSDoc(node);
  const parsedJSDoc = jsDoc != null ? jsDocParser.parse(jsDoc) : EMPTY_PARSED_JSDOC;

  if (Node.isFunctionDeclaration(node)) {
    return new FunctionValidator(node, parsedJSDoc);
  }

  if (Node.isClassDeclaration(node)) {
    return new ClassValidator(node, parsedJSDoc);
  }

  if (Node.isVariableDeclaration(node)) {
    const initializer = node.getInitializer();

    if (Node.isArrowFunction(initializer)) {
      return new FunctionValidator(node, parsedJSDoc);
    }

    // TODO:
    // if (Node.isObjectLiteralExpression(initializer)) {
    //   return new ObjectLiteralValidator(node, parsedJSDoc);
    // }
  }

  // TODO: 
  // if (Node.isInterfaceDeclaration(node)) {
  //   return new InterfaceValidator(node, parsedJSDoc);
  // }

  // if (Node.isTypeAliasDeclaration(node)) {
  //   return new TypeAliasValidator(node, parsedJSDoc);
  // }

  // if (Node.isEnumDeclaration(node)) {
  //   return new EnumValidator(node, parsedJSDoc);
  // }

  return undefined;
}