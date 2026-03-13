import { flatMap } from "es-toolkit";
import { Node, ParameterDeclaration, PropertySignature } from "ts-morph";
import { collectPropertySignaturePaths } from "./collect-property-signature-paths.js";

/**
 * Collects all dot-separated paths from function parameters.
 * Resolves inline type literals and type references (interface/type alias) to nested properties.
 *
 * @example
 * // function connect(options: { host: string; port: number }): string
 * collectParameterPaths(params) // => ["options", "options.host", "options.port"]
 */
export function collectParameterPaths(parameters: ParameterDeclaration[]): string[] {
  return flatMap(parameters, param => {
    const name = param.getName();
    const properties = getParamProperties(param);

    return [name, ...flatMap(properties, p => collectPropertySignaturePaths(p, name))];
  });
}

function getParamProperties(param: ParameterDeclaration): PropertySignature[] {
  const typeNode = param.getTypeNode();

  if (Node.isTypeLiteral(typeNode)) {
    return typeNode.getProperties().filter(p => Node.isPropertySignature(p));
  }

  if (Node.isTypeReference(typeNode)) {
    return resolveTypeReferenceProperties(param);
  }

  return [];
}

function resolveTypeReferenceProperties(param: ParameterDeclaration): PropertySignature[] {
  const type = param.getType();

  for (const symbol of [type.getSymbol(), type.getAliasSymbol()]) {
    if (symbol == null) {
      continue;
    }

    for (const declaration of symbol.getDeclarations()) {
      if (Node.isInterfaceDeclaration(declaration)) {
        return declaration.getProperties().filter(p => Node.isPropertySignature(p));
      }

      if (Node.isTypeAliasDeclaration(declaration)) {
        const aliasTypeNode = declaration.getTypeNode();
        if (Node.isTypeLiteral(aliasTypeNode)) {
          return aliasTypeNode.getProperties().filter(p => Node.isPropertySignature(p));
        }
      }
    }
  }

  return [];
}
