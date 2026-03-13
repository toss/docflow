import { flatMap } from "es-toolkit";
import { isEmpty } from "es-toolkit/compat";
import { Node, JSDocableNode, JSDoc } from "ts-morph";
import { ParameterData, ParsedJSDoc } from "../../types/parser.types.js";

export const EMPTY_PARSED_JSDOC: ParsedJSDoc = {
  examples: [],
  parameters: [],
  properties: [],
  throws: [],
  typedef: [],
  see: [],
  version: [],
};

export function hasJSDocTag(node: Node, tagName: string): boolean {
  const jsDocableNode = getJSDocableNode(node);
  if (!jsDocableNode) return false;

  return jsDocableNode.getJsDocs().some(jsDoc => jsDoc.getTags().some(tag => tag.getTagName() === tagName));
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

export function getJSDocPropertyNames(properties: ParameterData[]): string[] {
  return getJSDocParameterNames(properties);
}

export function getJSDocParameterNames(parameters: ParameterData[]): string[] {
  const collectNames = (params: ParameterData[], prefix = ""): string[] => {
    return flatMap(params, param => {
      const fullName = isEmpty(prefix) ? param.name : `${prefix}.${param.name}`;

      return [fullName, ...(param.nested != null ? collectNames(param.nested, fullName) : [])];
    });
  };

  return collectNames(parameters);
}
