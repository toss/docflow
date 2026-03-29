import { flatMap } from "es-toolkit";
import { Node, ParameterDeclaration, PropertySignature } from "ts-morph";
import { collectPropertySignaturePaths } from "./collect-property-signature-paths.js";

export interface ParameterPathEntry {
  name: string;
  paths: string[];
  destructured: boolean;
}

/**
 * Collects dot-separated paths from each function parameter independently.
 * Returns structured entries so callers can handle destructured params appropriately.
 *
 * @example
 * // function connect(options: { host: string; port: number }): string
 * collectParameterPaths(params)
 * // => [{ name: "options", paths: ["options", "options.host", "options.port"], destructured: false }]
 *
 * // function fetch(path: string, { baseUrl }: Options): void
 * collectParameterPaths(params)
 * // => [
 * //   { name: "path", paths: ["path"], destructured: false },
 * //   { name: undefined, paths: ["baseUrl"], destructured: true },
 * // ]
 */
export function collectParameterPaths(parameters: ParameterDeclaration[]): ParameterPathEntry[] {
  return parameters.map(param => {
    const destructured = Node.isObjectBindingPattern(param.getNameNode());

    if (destructured) {
      const properties = getParamProperties(param);
      const paths = flatMap(properties, p => collectPropertySignaturePaths(p));

      return { name: param.getName(), paths, destructured };
    }

    const name = param.getName();
    const properties = getParamProperties(param);
    const paths = [name, ...flatMap(properties, p => collectPropertySignaturePaths(p, name))];

    return { name, paths, destructured };
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
  const type = param.getType().getNonNullableType();

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
