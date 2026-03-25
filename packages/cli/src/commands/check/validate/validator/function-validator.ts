import { isEmpty } from "es-toolkit/compat";
import {
  ArrowFunction,
  FunctionDeclaration,
  FunctionExpression,
  Node,
  ParameterDeclaration,
  Type,
  VariableDeclaration,
} from "ts-morph";
import { getJSDocParameterNames } from "../../../../core/parser/jsdoc/jsdoc-utils.js";
import { ValidationError } from "../validate.types.js";
import { collectParameterPaths } from "./utils/collect-parameter-paths.js";
import { findMissingDocs } from "./utils/find-missing-docs.js";
import { findUnusedDocs } from "./utils/find-unused-docs.js";
import { Validator } from "./validator.js";

// arrow function or function expression assigned to a variable.
type FunctionLikeNode = FunctionDeclaration | VariableDeclaration;

export class FunctionValidator extends Validator<FunctionLikeNode> {
  protected collectErrors(): ValidationError[] {
    return [...this.validateParams(), ...this.validateReturns()];
  }

  private validateParams(): ValidationError[] {
    const parameters = this.getParameters();
    const allParamPaths = collectParameterPaths(parameters);
    const jsDocParamNames = getJSDocParameterNames(this.parsedJSDoc.parameters ?? []);

    return [
      ...findMissingDocs({ codeSymbols: allParamPaths, jsDocNames: jsDocParamNames, errorType: "missing_param" }),
      ...findUnusedDocs({ codeSymbols: allParamPaths, jsDocNames: jsDocParamNames, errorType: "unused_param" }),
    ];
  }

  private validateReturns(): ValidationError[] {
    const jsDocReturns = this.parsedJSDoc.returns;

    if (jsDocReturns == null) {
      return [{ type: "missing_returns" as const, target: "returns" }];
    }

    // @returns without a type annotation (e.g. "@returns The result") is always valid
    if (isEmpty(jsDocReturns.type)) {
      return [];
    }

    const actualReturnType = this.getReturnType();
    if (actualReturnType == null) {
      return [];
    }

    if (!this.areTypesCompatible(jsDocReturns.type, actualReturnType)) {
      return [
        {
          type: "invalid_returns" as const,
          target: "returns",
          message: `Expected ${jsDocReturns.type}, got ${actualReturnType.getText()}`,
        },
      ];
    }

    return [];
  }

  private getFunctionLikeInitializer(): ArrowFunction | FunctionExpression | undefined {
    if (!Node.isVariableDeclaration(this.node)) {
      return undefined;
    }

    const initializer = this.node.getInitializer();
    if (initializer && (Node.isArrowFunction(initializer) || Node.isFunctionExpression(initializer))) {
      return initializer;
    }

    return undefined;
  }

  private getParameters(): ParameterDeclaration[] {
    if (Node.isFunctionDeclaration(this.node)) {
      return this.node.getParameters();
    }

    return this.getFunctionLikeInitializer()?.getParameters() ?? [];
  }

  private getReturnType(): Type | undefined {
    if (Node.isFunctionDeclaration(this.node)) {
      return this.node.getReturnType();
    }

    return this.getFunctionLikeInitializer()?.getReturnType();
  }

  private areTypesCompatible(jsDocTypeText: string, actualType: Type): boolean {
    // import(FilePath).Math -> Math
    const normalize = (t: string) =>
      t
        .replace(/import\([^)]+\)\./g, "")
        .replace(/\s+/g, " ")
        .trim();

    const expected = normalize(jsDocTypeText);
    const actual = normalize(actualType.getText());

    return expected === actual || this.areVoidUndefinedEquivalent(expected, actual);
  }

  private areVoidUndefinedEquivalent(a: string, b: string): boolean {
    const voidTypes = ["void", "undefined"];
    return voidTypes.includes(a) && voidTypes.includes(b);
  }
}
