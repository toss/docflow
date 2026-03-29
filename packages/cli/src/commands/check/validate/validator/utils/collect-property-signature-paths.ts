import { flatMap } from "es-toolkit";
import { isEmpty } from "es-toolkit/compat";
import { Node, PropertySignature } from "ts-morph";

/**
 * Recursively collects dot-separated paths from a PropertySignature.
 * Descends into nested type literals and type references to produce paths like "address.street".
 *
 * @example
 * // interface User { address: { street: string; city: string } }
 * collectPropertySignaturePaths(addressProp) // => ["address", "address.street", "address.city"]
 */
export function collectPropertySignaturePaths(prop: PropertySignature, prefix = ""): string[] {
  const name = prop.getName();
  const fullPath = prefix !== "" ? `${prefix}.${name}` : name;
  const nestedProps = getNestedProperties(prop);

  if (isEmpty(nestedProps)) {
    return [fullPath];
  }

  return [fullPath, ...flatMap(nestedProps, p => collectPropertySignaturePaths(p, fullPath))];
}

function getNestedProperties(prop: PropertySignature): PropertySignature[] {
  const typeNode = prop.getTypeNode();

  if (Node.isTypeLiteral(typeNode)) {
    return typeNode.getProperties().filter(p => Node.isPropertySignature(p));
  }

  if (Node.isTypeReference(typeNode)) {
    return resolveTypeReferenceProperties(prop);
  }

  return [];
}

function resolveTypeReferenceProperties(prop: PropertySignature): PropertySignature[] {
  const type = prop.getType().getNonNullableType();

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
