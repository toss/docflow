import { describe, it, expect } from "vitest";
import { validate } from "../../../commands/check/validate/validate-jsdoc.js";
import { createTSSourceFile } from "../../utils/create-ts-source-file.js";

describe("validate", () => {
  it("should validate function declaration", () => {
    const sourceFile = createTSSourceFile(`
      /**
       * @public
       * @param a - First
       * @returns The result
       */
      export function add(a: number): number {
        return a;
      }
    `);

    const fn = sourceFile.getFunctions()[0]!;
    const result = validate(fn);

    expect(result.isValid).toBe(true);
  });

  it("should validate interface declaration", () => {
    const sourceFile = createTSSourceFile(`
      /**
       * @public
       * @param name - The name
       */
      export interface User {
        name: string;
      }
    `);

    const iface = sourceFile.getInterfaces()[0]!;
    const result = validate(iface);

    expect(result.isValid).toBe(true);
  });

  it("should validate type alias declaration", () => {
    const sourceFile = createTSSourceFile(`
      /**
       * @public
       * @param name - The name
       */
      export type User = {
        name: string;
      };
    `);

    const typeAlias = sourceFile.getTypeAliases()[0]!;
    const result = validate(typeAlias);

    expect(result.isValid).toBe(true);
  });

  it("should validate arrow function", () => {
    const sourceFile = createTSSourceFile(`
      /**
       * @public
       * @param a - First
       * @returns The result
       */
      export const add = (a: number): number => a;
    `);

    const varDecl = sourceFile.getVariableDeclarations()[0]!;
    const result = validate(varDecl);

    expect(result.isValid).toBe(true);
  });

  it("should validate object literal", () => {
    const sourceFile = createTSSourceFile(`
      /**
       * @public
       * @param host - The host
       * @returns void
       */
      export const config = {
        host: "localhost",
      };
    `);

    const varDecl = sourceFile.getVariableDeclarations()[0]!;
    const result = validate(varDecl);

    expect(result.isValid).toBe(true);
  });

  it("should detect errors across validator types", () => {
    const sourceFile = createTSSourceFile(`
      /**
       * @public
       */
      export function broken(a: number): number {
        return a;
      }
    `);

    const fn = sourceFile.getFunctions()[0]!;
    const result = validate(fn);

    expect(result.isValid).toBe(false);
    expect(result.errors).toContainEqual({ type: "missing_param", target: "a" });
    expect(result.errors).toContainEqual({ type: "missing_returns", target: "returns" });
  });
});
