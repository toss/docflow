import { describe, it, expect } from "vitest";
import { assert } from "es-toolkit";
import { validatePublic } from "../../../commands/check/validate/validate-public.js";
import { createTSSourceFile } from '../../utils/create-ts-source-file.js';

describe("validatePublic - @public tag detection", () => {
  describe("function declarations", () => {
    it("should return true when @public tag exists", () => {
      const sourceFile = createTSSourceFile(`
        /**
         * @public
         */
        export function greet(name: string) {}
      `);

      const functions = sourceFile.getFunctions();
      const target = functions[0];
      assert(target != null, "Expected function");

      expect(validatePublic(target)).toBe(true);
    });

    it("should return false when @public tag is missing", () => {
      const sourceFile = createTSSourceFile(`
        /**
         * Internal function
         */
        export function internal(a: number): number {
          return a;
        }
      `);

      const functions = sourceFile.getFunctions();
      const target = functions[0];
      assert(target != null, "Expected function");

      expect(validatePublic(target)).toBe(false);
    });

    it("should return false when no JSDoc exists", () => {
      const sourceFile = createTSSourceFile(`
        export function noDoc(a: number): number {
          return a;
        }
      `);

      const functions = sourceFile.getFunctions();
      const target = functions[0];
      assert(target != null, "Expected function");

      expect(validatePublic(target)).toBe(false);
    });
  });

  describe("variable declarations (arrow functions)", () => {
    it("should return true when @public tag exists", () => {
      const sourceFile = createTSSourceFile(`
        /**
         * @public
         */
        export const greet = (name: string): string => name;
      `);

      const variables = sourceFile.getVariableDeclarations();
      const target = variables[0];
      assert(target != null, "Expected variable declaration");

      expect(validatePublic(target)).toBe(true);
    });

    it("should return false when @public tag is missing", () => {
      const sourceFile = createTSSourceFile(`
        /**
         * Internal arrow function
         */
        export const internal = (a: number): number => a;
      `);

      const variables = sourceFile.getVariableDeclarations();
      const target = variables[0];
      assert(target != null, "Expected variable declaration");

      expect(validatePublic(target)).toBe(false);
    });
  });

  describe("interface declarations", () => {
    it("should return true when @public tag exists", () => {
      const sourceFile = createTSSourceFile(`
        /**
         * @public
         */
        export interface User {
          name: string;
        }
      `);

      const interfaces = sourceFile.getInterfaces();
      const target = interfaces[0];
      assert(target != null, "Expected interface");

      expect(validatePublic(target)).toBe(true);
    });

    it("should return false when @public tag is missing", () => {
      const sourceFile = createTSSourceFile(`
        /**
         * Internal interface
         */
        export interface InternalUser {
          name: string;
        }
      `);

      const interfaces = sourceFile.getInterfaces();
      const target = interfaces[0];
      assert(target != null, "Expected interface");

      expect(validatePublic(target)).toBe(false);
    });
  });

  describe("type alias declarations", () => {
    it("should return true when @public tag exists", () => {
      const sourceFile = createTSSourceFile(`
        /**
         * @public
         */
        export type Point = {
          x: number;
          y: number;
        };
      `);

      const typeAliases = sourceFile.getTypeAliases();
      const target = typeAliases[0];
      assert(target != null, "Expected type alias");

      expect(validatePublic(target)).toBe(true);
    });

    it("should return false when @public tag is missing", () => {
      const sourceFile = createTSSourceFile(`
        /**
         * Internal type
         */
        export type InternalPoint = {
          x: number;
          y: number;
        };
      `);

      const typeAliases = sourceFile.getTypeAliases();
      const target = typeAliases[0];
      assert(target != null, "Expected type alias");

      expect(validatePublic(target)).toBe(false);
    });
  });

  describe("class declarations", () => {
    it("should return true when @public tag exists", () => {
      const sourceFile = createTSSourceFile(`
        /**
         * @public
         */
        export class User {
          name: string;
        }
      `);

      const classes = sourceFile.getClasses();
      const target = classes[0];
      assert(target != null, "Expected class");

      expect(validatePublic(target)).toBe(true);
    });

    it("should return false when @public tag is missing", () => {
      const sourceFile = createTSSourceFile(`
        /**
         * Internal class
         */
        export class InternalUser {
          name: string;
        }
      `);

      const classes = sourceFile.getClasses();
      const target = classes[0];
      assert(target != null, "Expected class");

      expect(validatePublic(target)).toBe(false);
    });
  });
});
