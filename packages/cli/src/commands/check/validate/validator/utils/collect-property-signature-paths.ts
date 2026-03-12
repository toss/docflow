import { flatMap } from "es-toolkit";
import { isEmpty } from "es-toolkit/compat";
import { Node, PropertySignature } from "ts-morph";

export function collectPropertySignaturePaths(prop: PropertySignature, prefix = ""): string[] {
  const name = prop.getName();
  const fullPath = prefix !== "" ? `${prefix}.${name}` : name;
  const typeNode = prop.getTypeNode();

  if (!Node.isTypeLiteral(typeNode)) {
    return [fullPath];
  }

  const nestedProps = typeNode.getProperties().filter(p => Node.isPropertySignature(p));

  if (isEmpty(nestedProps)) {
    return [fullPath];
  }

  return [fullPath, ...flatMap(nestedProps, p => collectPropertySignaturePaths(p, fullPath))];
}
