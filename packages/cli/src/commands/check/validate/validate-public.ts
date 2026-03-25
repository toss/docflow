import { hasJSDocTag } from "../../../core/parser/jsdoc/jsdoc-utils.js";
import { Node } from "ts-morph";

export function validatePublic(node: Node) {
  return hasJSDocTag(node, "public");
}
