import { isEmpty } from "es-toolkit/compat";
import { getJSDocParameterNames } from "../../../../core/parser/jsdoc/jsdoc-utils.js";
import {
  FunctionDeclaration,
  Node,
  ParameterDeclaration,
  Type,
  VariableDeclaration,
} from "ts-morph";
import { ValidationError } from "../validate.types.js";
import { Validator } from "./validator.js";

type FunctionLikeNode = FunctionDeclaration | VariableDeclaration;

export class FunctionValidator extends Validator<FunctionLikeNode> {
  validate() {
    const errors = [...this.validateParams(), ...this.validateReturns()];

    return { errors, isValid: isEmpty(errors) };
  }

  private validateParams(): ValidationError[] {
    const parameters = this.getParameters();
    const jsDocParamNames = getJSDocParameterNames(this.parsedJSDoc.parameters ?? []);
    const tsParamNames = parameters.map((p) => p.getName());

    const missingParams = this.findMissingParams(tsParamNames, jsDocParamNames);
    const unusedParams = this.findUnusedParams(jsDocParamNames, tsParamNames, parameters);

    return [...missingParams, ...unusedParams];
  }

  private validateReturns(): ValidationError[] {
    const jsDocReturns = this.parsedJSDoc.returns;

    if (jsDocReturns == null) {
      return [{ type: "missing_returns" as const, target: "returns" }];
    }

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

  private getParameters(): ParameterDeclaration[] {
    if (Node.isFunctionDeclaration(this.node)) {
      return this.node.getParameters();
    }

    if (Node.isVariableDeclaration(this.node)) {
      const initializer = this.node.getInitializer();
      if (initializer && Node.isArrowFunction(initializer)) {
        return initializer.getParameters();
      }
    }

    return [];
  }

  private getReturnType(): Type | undefined {
    if (Node.isFunctionDeclaration(this.node)) {
      return this.node.getReturnType();
    }

    if (Node.isVariableDeclaration(this.node)) {
      const initializer = this.node.getInitializer();
      const isFunctionLike =
        initializer && (Node.isArrowFunction(initializer) || Node.isFunctionExpression(initializer));

      return isFunctionLike ? initializer.getReturnType() : undefined;
    }

    return undefined;
  }


  private findMissingParams(tsParamNames: string[], jsDocParamNames: string[]): ValidationError[] {
    return tsParamNames
      .filter((name) => !jsDocParamNames.includes(name))
      .map((name) => ({ type: "missing_param" as const, target: name }));
  }

  private findUnusedParams(
    jsDocParamNames: string[],
    tsParamNames: string[],
    parameters: ParameterDeclaration[]
  ): ValidationError[] {
    return jsDocParamNames
      .filter((name) => this.isParamUnused(name, tsParamNames, parameters))
      .map((name) => ({ type: "unused_param" as const, target: name }));
  }

  private isParamUnused(
    jsDocParamName: string,
    tsParamNames: string[],
    parameters: ParameterDeclaration[]
  ): boolean {
    if (!jsDocParamName.includes(".")) {
      return !tsParamNames.includes(jsDocParamName);
    }

    return this.isNestedParamUnused(jsDocParamName, parameters);
  }

  private isNestedParamUnused(jsDocParamName: string, parameters: ParameterDeclaration[]): boolean {
    const [parentName, ...propertyPath] = jsDocParamName.split(".");
    const param = parameters.find((p) => p.getName() === parentName);

    if (param == null) {
      return true;
    }

    return !this.hasPropertyPath(param.getType(), propertyPath, param);
  }

  private hasPropertyPath(type: Type, path: string[], locationNode: ParameterDeclaration): boolean {
    let currentType = type;

    for (const propertyName of path) {
      const property = currentType.getProperty(propertyName);
      if (property == null) {
        return false;
      }
      currentType = property.getValueDeclaration()?.getType() ?? property.getTypeAtLocation(locationNode);
    }

    return true;
  }

  private areTypesCompatible(jsDocTypeText: string, actualType: Type): boolean {
    // import('@mylib/math').Math -> Math
    const normalize = (t: string) =>
      t.replace(/import\([^)]+\)\./g, "").replace(/\s+/g, " ").trim();

    const expected = normalize(jsDocTypeText);
    const actual = normalize(actualType.getText());

    return expected === actual || this.areVoidUndefinedEquivalent(expected, actual);
  }

  private areVoidUndefinedEquivalent(a: string, b: string): boolean {
    const voidTypes = ["void", "undefined"];
    return voidTypes.includes(a) && voidTypes.includes(b);
  }
}
