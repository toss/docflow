import { Node } from "ts-morph";
import { ParsedJSDoc } from "../../../../core/types/parser.types.js";
import { ValidationResult } from "../validate.types.js";

export abstract class Validator<TSNode extends Node> {
  constructor(
    readonly node: TSNode,
    protected readonly parsedJSDoc: ParsedJSDoc
  ) { }

  abstract validate(): ValidationResult;
}
