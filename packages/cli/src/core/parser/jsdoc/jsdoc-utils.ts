import { Node, JSDocableNode, JSDoc } from "ts-morph";

export function hasJSDocTag(node: Node, tagName: string): boolean {
  const jsDocableNode = getJSDocableNode(node);
  if (!jsDocableNode) return false;

  return jsDocableNode
    .getJsDocs()
    .some((jsDoc) =>
      jsDoc.getTags().some((tag) => tag.getTagName() === tagName),
    );
}

export function getJSDoc(node: Node): JSDoc | undefined {
  const jsDocableNode = getJSDocableNode(node);
  if (!jsDocableNode) return undefined;

  const jsDocs = jsDocableNode.getJsDocs();
  return jsDocs.length > 0 ? jsDocs[0] : undefined;
}

function getJSDocableNode(node: Node): JSDocableNode | undefined {
  if (!Node.isNode(node)) return undefined;

  if (Node.isVariableDeclaration(node)) {
    return node.getVariableStatement();
  }

  if (
    Node.isFunctionDeclaration(node) ||
    Node.isClassDeclaration(node) ||
    Node.isInterfaceDeclaration(node) ||
    Node.isTypeAliasDeclaration(node) ||
    Node.isEnumDeclaration(node) ||
    Node.isVariableStatement(node)
  ) {
    return node;
  }

  return undefined;
}
