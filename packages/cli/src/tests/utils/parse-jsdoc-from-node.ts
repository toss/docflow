import { Node } from "ts-morph";
import { JSDocParser } from "../../core/parser/jsdoc/jsdoc-parser.js";
import { EMPTY_PARSED_JSDOC, getJSDoc } from "../../core/parser/jsdoc/jsdoc-utils.js";
import { ParsedJSDoc } from "../../core/types/parser.types.js";

export function parseJSDocFromNode(node: Node): ParsedJSDoc {
  const jsDocParser = new JSDocParser();
  const jsDoc = getJSDoc(node);

  return jsDoc != null ? jsDocParser.parse(jsDoc) : EMPTY_PARSED_JSDOC;
}
