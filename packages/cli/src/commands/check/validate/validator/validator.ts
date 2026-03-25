import { isEmpty } from "es-toolkit/compat";
import { Node } from "ts-morph";
import { ParsedJSDoc } from "../../../../core/types/parser.types.js";
import { ValidationError, ValidationResult } from "../validate.types.js";

export abstract class Validator<TSNode extends Node> {
  constructor(
    readonly node: TSNode,
    protected readonly parsedJSDoc: ParsedJSDoc
  ) {}

  validate(): ValidationResult {
    const errors = this.collectErrors();
    return { errors, isValid: isEmpty(errors) };
  }

  protected abstract collectErrors(): ValidationError[];
}
