import { Node, ExportedDeclarations } from "ts-morph";
import { DeclarationKind } from "../../types/parser.types.js";

export function getDeclarationKind(
  declaration: ExportedDeclarations,
): DeclarationKind | undefined {
  if (Node.isFunctionDeclaration(declaration)) {
    return "function";
  }

  if (Node.isClassDeclaration(declaration)) {
    return "class";
  }

  if (Node.isInterfaceDeclaration(declaration)) {
    return "interface";
  }

  if (Node.isTypeAliasDeclaration(declaration)) {
    return "type";
  }

  if (Node.isEnumDeclaration(declaration)) {
    return "enum";
  }

  if (Node.isVariableDeclaration(declaration)) {
    const initializer = declaration.getInitializer();
    if (
      initializer &&
      (Node.isArrowFunction(initializer) ||
        Node.isFunctionExpression(initializer))
    ) {
      return "function";
    }
    return "variable";
  }

  return undefined;
}
