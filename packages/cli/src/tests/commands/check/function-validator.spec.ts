import { describe, it, expect } from "vitest";
import { assert } from "es-toolkit";
import { FunctionValidator } from "../../../commands/check/validate/validator/function-validator.js";
import { createTSSourceFile } from "../../utils/create-ts-source-file.js";
import { parseJSDocFromNode } from "../../utils/parse-jsdoc-from-node.js";

describe("FunctionValidator", () => {
  describe("function declarations", () => {
    describe("parameter validation", () => {
      it("should return valid when all params are documented", () => {
        const sourceFile = createTSSourceFile(`
          /**
           * @public
           * @param name - The name
           * @param age - The age
           * @returns The greeting
           */
          export function greet(name: string, age: number): string {
            return name + age;
          }
        `);

        const fn = sourceFile.getFunctions()[0];
        assert(fn != null, "Expected function");

        const validator = new FunctionValidator(fn, parseJSDocFromNode(fn));
        const result = validator.validate();

        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it("should detect missing param documentation", () => {
        const sourceFile = createTSSourceFile(`
          /**
           * @public
           * @param name - The name
           * @returns The greeting
           */
          export function greet(name: string, age: number): string {
            return name + age;
          }
        `);

        const fn = sourceFile.getFunctions()[0];
        assert(fn != null, "Expected function");

        const validator = new FunctionValidator(fn, parseJSDocFromNode(fn));
        const result = validator.validate();

        expect(result.isValid).toBe(false);
        expect(result.errors).toContainEqual({
          type: "missing_param",
          target: "age",
        });
      });

      it("should detect unused param documentation", () => {
        const sourceFile = createTSSourceFile(`
          /**
           * @public
           * @param name - The name
           * @param oldParam - No longer exists
           * @returns The greeting
           */
          export function greet(name: string): string {
            return name;
          }
        `);

        const fn = sourceFile.getFunctions()[0];
        assert(fn != null, "Expected function");

        const validator = new FunctionValidator(fn, parseJSDocFromNode(fn));
        const result = validator.validate();

        expect(result.isValid).toBe(false);
        expect(result.errors).toContainEqual({
          type: "unused_param",
          target: "oldParam",
        });
      });

      it("should handle object parameter with nested JSDoc", () => {
        const sourceFile = createTSSourceFile(`
          interface Options {
            a: string;
            b: string;
          }

          /**
           * @public
           * @param options - The options object
           * @param options.a - The a value
           * @param options.b - The b value
           * @returns The result
           */
          export function foo(options: Options): string {
            return options.a + options.b;
          }
        `);

        const fn = sourceFile.getFunctions()[0];
        assert(fn != null, "Expected function");

        const validator = new FunctionValidator(fn, parseJSDocFromNode(fn));
        const result = validator.validate();

        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it("should detect unused nested param that does not exist on type", () => {
        const sourceFile = createTSSourceFile(`
          /**
           * @public
           * @param options - The options object
           * @param options.timeout - Timeout in ms
           * @param options.retries - Number of retries
           * @param options.something - This property does not exist
           * @returns The result
           */
          export function fetch(options: { timeout: number; retries: number }): string {
            return "done";
          }
        `);

        const fn = sourceFile.getFunctions()[0];
        assert(fn != null, "Expected function");

        const validator = new FunctionValidator(fn, parseJSDocFromNode(fn));
        const result = validator.validate();

        expect(result.isValid).toBe(false);
        expect(result.errors).toContainEqual({
          type: "unused_param",
          target: "options.something",
        });
      });
    });

    describe("return validation", () => {
      it("should detect missing @returns when @public is present", () => {
        const sourceFile = createTSSourceFile(`
          /**
           * @public
           * @param name - The name
           */
          export function greet(name: string): string {
            return name;
          }
        `);

        const fn = sourceFile.getFunctions()[0];
        assert(fn != null, "Expected function");

        const validator = new FunctionValidator(fn, parseJSDocFromNode(fn));
        const result = validator.validate();

        expect(result.isValid).toBe(false);
        expect(result.errors).toContainEqual({
          type: "missing_returns",
          target: "returns",
        });
      });

      it("should detect invalid @returns type", () => {
        const sourceFile = createTSSourceFile(`
          /**
           * @public
           * @param name - The name
           * @returns {number} The greeting
           */
          export function greet(name: string): string {
            return name;
          }
        `);

        const fn = sourceFile.getFunctions()[0];
        assert(fn != null, "Expected function");

        const validator = new FunctionValidator(fn, parseJSDocFromNode(fn));
        const result = validator.validate();

        expect(result.isValid).toBe(false);
        expect(result.errors).toContainEqual(
          expect.objectContaining({
            type: "invalid_returns",
            target: "returns",
          })
        );
      });
    });

  });

  describe("arrow functions (variable declarations)", () => {
    it("should validate arrow function params", () => {
      const sourceFile = createTSSourceFile(`
        /**
         * @public
         * @param name - The name
         * @returns The greeting
         */
        export const greet = (name: string): string => name;
      `);

      const variable = sourceFile.getVariableDeclarations()[0];
      assert(variable != null, "Expected variable declaration");

      const validator = new FunctionValidator(variable, parseJSDocFromNode(variable));
      const result = validator.validate();

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should detect missing param in arrow function", () => {
      const sourceFile = createTSSourceFile(`
        /**
         * @public
         * @returns The sum
         */
        export const add = (a: number, b: number): number => a + b;
      `);

      const variable = sourceFile.getVariableDeclarations()[0];
      assert(variable != null, "Expected variable declaration");

      const validator = new FunctionValidator(variable, parseJSDocFromNode(variable));
      const result = validator.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        type: "missing_param",
        target: "a",
      });
      expect(result.errors).toContainEqual({
        type: "missing_param",
        target: "b",
      });
    });

  });
});
