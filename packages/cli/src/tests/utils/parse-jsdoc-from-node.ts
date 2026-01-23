import { Node } from "ts-morph";
import { JSDocParser } from "../../core/parser/jsdoc/jsdoc-parser.js";
import { getJSDoc } from "../../core/parser/jsdoc/jsdoc-utils.js";
import { ParsedJSDoc } from "../../core/types/parser.types.js";

const EMPTY_PARSED_JSDOC: ParsedJSDoc = {
  examples: [],
  parameters: [],
  throws: [],
  typedef: [],
  see: [],
  version: [],
};

export function parseJSDocFromNode(node: Node): ParsedJSDoc {
  const jsDocParser = new JSDocParser();
  const jsDoc = getJSDoc(node);

  return jsDoc != null ? jsDocParser.parse(jsDoc) : EMPTY_PARSED_JSDOC;
}
