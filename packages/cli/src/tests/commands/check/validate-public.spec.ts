import { describe, it, expect } from "vitest";
import { validatePublic } from "../../../commands/check/validate/validate-public.js";
import { createTSSourceFile } from "../../utils/create-ts-source-file.js";

describe("validatePublic", () => {
  describe("function", () => {
    it("should return true when @public tag exists", () => {
      const sourceFile = createTSSourceFile(`
        /** @public */
        export function foo() {}
      `);

      const fn = sourceFile.getFunctions()[0]!;
      expect(validatePublic(fn)).toBe(true);
    });

    it("should return false when @public tag is missing", () => {
      const sourceFile = createTSSourceFile(`
        /** @param a - First */
        export function foo(a: number) {}
      `);

      const fn = sourceFile.getFunctions()[0]!;
      expect(validatePublic(fn)).toBe(false);
    });

    it("should return false when no JSDoc exists", () => {
      const sourceFile = createTSSourceFile(`
        export function foo() {}
      `);

      const fn = sourceFile.getFunctions()[0]!;
      expect(validatePublic(fn)).toBe(false);
    });
  });

  describe("interface", () => {
    it("should return true when @public tag exists", () => {
      const sourceFile = createTSSourceFile(`
        /** @public */
        export interface Foo { name: string; }
      `);

      const iface = sourceFile.getInterfaces()[0]!;
      expect(validatePublic(iface)).toBe(true);
    });

    it("should return false when @public tag is missing", () => {
      const sourceFile = createTSSourceFile(`
        /** @param name - The name */
        export interface Foo { name: string; }
      `);

      const iface = sourceFile.getInterfaces()[0]!;
      expect(validatePublic(iface)).toBe(false);
    });
  });

  describe("type alias", () => {
    it("should return true when @public tag exists", () => {
      const sourceFile = createTSSourceFile(`
        /** @public */
        export type Foo = { name: string };
      `);

      const typeAlias = sourceFile.getTypeAliases()[0]!;
      expect(validatePublic(typeAlias)).toBe(true);
    });

    it("should return false when @public tag is missing", () => {
      const sourceFile = createTSSourceFile(`
        export type Foo = { name: string };
      `);

      const typeAlias = sourceFile.getTypeAliases()[0]!;
      expect(validatePublic(typeAlias)).toBe(false);
    });
  });

  describe("enum", () => {
    it("should return true when @public tag exists", () => {
      const sourceFile = createTSSourceFile(`
        /** @public */
        export enum Color { Red, Green }
      `);

      const enumDecl = sourceFile.getEnums()[0]!;
      expect(validatePublic(enumDecl)).toBe(true);
    });

    it("should return false when @public tag is missing", () => {
      const sourceFile = createTSSourceFile(`
        export enum Color { Red, Green }
      `);

      const enumDecl = sourceFile.getEnums()[0]!;
      expect(validatePublic(enumDecl)).toBe(false);
    });
  });

  describe("variable declaration", () => {
    it("should return true when @public tag exists on arrow function", () => {
      const sourceFile = createTSSourceFile(`
        /** @public */
        export const foo = () => {};
      `);

      const varStmt = sourceFile.getVariableStatements()[0]!;
      expect(validatePublic(varStmt)).toBe(true);
    });

    it("should return false when @public tag is missing on arrow function", () => {
      const sourceFile = createTSSourceFile(`
        export const foo = () => {};
      `);

      const varStmt = sourceFile.getVariableStatements()[0]!;
      expect(validatePublic(varStmt)).toBe(false);
    });
  });
});
