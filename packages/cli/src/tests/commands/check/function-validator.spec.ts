import { describe, it, expect } from "vitest";
import { assert } from "es-toolkit";
import { FunctionValidator } from "../../../commands/check/validate/validator/function-validator.js";
import { createTSSourceFile } from "../../utils/create-ts-source-file.js";
import { parseJSDocFromNode } from "../../utils/parse-jsdoc-from-node.js";

describe("FunctionValidator", () => {
  describe("param validation", () => {
    it("should return valid when all params are documented", () => {
      const sourceFile = createTSSourceFile(`
        /**
         * @public
         * @param a - First number
         * @param b - Second number
         * @returns The sum
         */
        export function add(a: number, b: number): number {
          return a + b;
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
         * @param a - First number
         * @returns The sum
         */
        export function add(a: number, b: number): number {
          return a + b;
        }
      `);

      const fn = sourceFile.getFunctions()[0];
      assert(fn != null, "Expected function");

      const validator = new FunctionValidator(fn, parseJSDocFromNode(fn));
      const result = validator.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({ type: "missing_param", target: "b" });
    });

    it("should detect unused param documentation", () => {
      const sourceFile = createTSSourceFile(`
        /**
         * @public
         * @param a - First number
         * @param removed - No longer exists
         * @returns The result
         */
        export function calc(a: number): number {
          return a;
        }
      `);

      const fn = sourceFile.getFunctions()[0];
      assert(fn != null, "Expected function");

      const validator = new FunctionValidator(fn, parseJSDocFromNode(fn));
      const result = validator.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({ type: "unused_param", target: "removed" });
    });

    it("should detect both missing and unused params simultaneously", () => {
      const sourceFile = createTSSourceFile(`
        /**
         * @public
         * @param removed - No longer exists
         * @returns The result
         */
        export function calc(a: number, b: number): number {
          return a + b;
        }
      `);

      const fn = sourceFile.getFunctions()[0];
      assert(fn != null, "Expected function");

      const validator = new FunctionValidator(fn, parseJSDocFromNode(fn));
      const result = validator.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({ type: "missing_param", target: "a" });
      expect(result.errors).toContainEqual({ type: "missing_param", target: "b" });
      expect(result.errors).toContainEqual({ type: "unused_param", target: "removed" });
    });

    it("should return valid for zero-param function", () => {
      const sourceFile = createTSSourceFile(`
        /**
         * @public
         * @returns The greeting
         */
        export function greet(): string {
          return "hello";
        }
      `);

      const fn = sourceFile.getFunctions()[0];
      assert(fn != null, "Expected function");

      const validator = new FunctionValidator(fn, parseJSDocFromNode(fn));
      const result = validator.validate();

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe("nested param validation", () => {
    it("should detect missing nested param for inline type literal", () => {
      const sourceFile = createTSSourceFile(`
        /**
         * @public
         * @param options - The options
         * @returns The result
         */
        export function connect(options: { host: string; port: number }): string {
          return options.host;
        }
      `);

      const fn = sourceFile.getFunctions()[0];
      assert(fn != null, "Expected function");

      const validator = new FunctionValidator(fn, parseJSDocFromNode(fn));
      const result = validator.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({ type: "missing_param", target: "options.host" });
      expect(result.errors).toContainEqual({ type: "missing_param", target: "options.port" });
    });

    it("should detect missing nested param for interface reference", () => {
      const sourceFile = createTSSourceFile(`
        interface Options {
          host: string;
          port: number;
        }

        /**
         * @public
         * @param options - The options
         * @returns The result
         */
        export function connect(options: Options): string {
          return options.host;
        }
      `);

      const fn = sourceFile.getFunctions()[0];
      assert(fn != null, "Expected function");

      const validator = new FunctionValidator(fn, parseJSDocFromNode(fn));
      const result = validator.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({ type: "missing_param", target: "options.host" });
      expect(result.errors).toContainEqual({ type: "missing_param", target: "options.port" });
    });

    it("should detect missing nested param for type alias reference", () => {
      const sourceFile = createTSSourceFile(`
        type Options = {
          host: string;
          port: number;
        };

        /**
         * @public
         * @param options - The options
         * @returns The result
         */
        export function connect(options: Options): string {
          return options.host;
        }
      `);

      const fn = sourceFile.getFunctions()[0];
      assert(fn != null, "Expected function");

      const validator = new FunctionValidator(fn, parseJSDocFromNode(fn));
      const result = validator.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({ type: "missing_param", target: "options.host" });
      expect(result.errors).toContainEqual({ type: "missing_param", target: "options.port" });
    });

    it("should return valid when all nested params are documented", () => {
      const sourceFile = createTSSourceFile(`
        /**
         * @public
         * @param options - The options
         * @param options.host - The host
         * @param options.port - The port
         * @returns The result
         */
        export function connect(options: { host: string; port: number }): string {
          return options.host;
        }
      `);

      const fn = sourceFile.getFunctions()[0];
      assert(fn != null, "Expected function");

      const validator = new FunctionValidator(fn, parseJSDocFromNode(fn));
      const result = validator.validate();

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should detect unused nested param documentation", () => {
      const sourceFile = createTSSourceFile(`
        /**
         * @public
         * @param options - The options
         * @param options.host - The host
         * @param options.removed - No longer exists
         * @returns The result
         */
        export function connect(options: { host: string }): string {
          return options.host;
        }
      `);

      const fn = sourceFile.getFunctions()[0];
      assert(fn != null, "Expected function");

      const validator = new FunctionValidator(fn, parseJSDocFromNode(fn));
      const result = validator.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({ type: "unused_param", target: "options.removed" });
    });

    it("should validate 3-level nested params", () => {
      const sourceFile = createTSSourceFile(`
        /**
         * @public
         * @param config - Config
         * @param config.db - DB config
         * @param config.db.host - The host
         * @returns void
         */
        export function init(config: { db: { host: string } }): void {}
      `);

      const fn = sourceFile.getFunctions()[0];
      assert(fn != null, "Expected function");

      const validator = new FunctionValidator(fn, parseJSDocFromNode(fn));
      const result = validator.validate();

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe("returns validation", () => {
    it("should detect missing returns", () => {
      const sourceFile = createTSSourceFile(`
        /**
         * @public
         */
        export function greet(): string {
          return "hello";
        }
      `);

      const fn = sourceFile.getFunctions()[0];
      assert(fn != null, "Expected function");

      const validator = new FunctionValidator(fn, parseJSDocFromNode(fn));
      const result = validator.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({ type: "missing_returns", target: "returns" });
    });

    it("should accept returns without type", () => {
      const sourceFile = createTSSourceFile(`
        /**
         * @public
         * @returns The greeting
         */
        export function greet(): string {
          return "hello";
        }
      `);

      const fn = sourceFile.getFunctions()[0];
      assert(fn != null, "Expected function");

      const validator = new FunctionValidator(fn, parseJSDocFromNode(fn));
      const result = validator.validate();

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should detect invalid returns type mismatch", () => {
      const sourceFile = createTSSourceFile(`
        /**
         * @public
         * @returns {string} The result
         */
        export function getCount(): number {
          return 42;
        }
      `);

      const fn = sourceFile.getFunctions()[0];
      assert(fn != null, "Expected function");

      const validator = new FunctionValidator(fn, parseJSDocFromNode(fn));
      const result = validator.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual(expect.objectContaining({ type: "invalid_returns", target: "returns" }));
    });

    it("should treat void and undefined as equivalent", () => {
      const sourceFile = createTSSourceFile(`
        /**
         * @public
         * @returns {void} Nothing
         */
        export function doNothing(): undefined {}
      `);

      const fn = sourceFile.getFunctions()[0];
      assert(fn != null, "Expected function");

      const validator = new FunctionValidator(fn, parseJSDocFromNode(fn));
      const result = validator.validate();

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe("arrow function and function expression", () => {
    it("should validate arrow function params", () => {
      const sourceFile = createTSSourceFile(`
        /**
         * @public
         * @param a - First number
         * @param b - Second number
         * @returns The sum
         */
        export const add = (a: number, b: number): number => a + b;
      `);

      const varDecl = sourceFile.getVariableDeclarations()[0];
      assert(varDecl != null, "Expected variable declaration");

      const validator = new FunctionValidator(varDecl, parseJSDocFromNode(varDecl));
      const result = validator.validate();

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should validate function expression params", () => {
      const sourceFile = createTSSourceFile(`
        /**
         * @public
         * @param a - First number
         * @param b - Second number
         * @returns The sum
         */
        export const add = function(a: number, b: number): number {
          return a + b;
        };
      `);

      const varDecl = sourceFile.getVariableDeclarations()[0];
      assert(varDecl != null, "Expected variable declaration");

      const validator = new FunctionValidator(varDecl, parseJSDocFromNode(varDecl));
      const result = validator.validate();

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should detect missing nested params in arrow function", () => {
      const sourceFile = createTSSourceFile(`
        /**
         * @public
         * @param options - The options
         * @returns The result
         */
        export const connect = (options: { host: string; port: number }): string => options.host;
      `);

      const varDecl = sourceFile.getVariableDeclarations()[0];
      assert(varDecl != null, "Expected variable declaration");

      const validator = new FunctionValidator(varDecl, parseJSDocFromNode(varDecl));
      const result = validator.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({ type: "missing_param", target: "options.host" });
      expect(result.errors).toContainEqual({ type: "missing_param", target: "options.port" });
    });

    it("should validate optional param with interface reference", () => {
      const sourceFile = createTSSourceFile(`
        interface Options {
          host: string;
          port: number;
        }

        /**
         * @public
         * @param options - The options
         * @param options.host - The host
         * @param options.port - The port
         * @returns The result
         */
        export function connect(options?: Options): string {
          return options?.host ?? "";
        }
      `);

      const fn = sourceFile.getFunctions()[0];
      assert(fn != null, "Expected function");

      const validator = new FunctionValidator(fn, parseJSDocFromNode(fn));
      const result = validator.validate();

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should detect missing nested params for optional param with interface reference", () => {
      const sourceFile = createTSSourceFile(`
        interface Options {
          host: string;
          port: number;
        }

        /**
         * @public
         * @param options - The options
         * @returns The result
         */
        export function connect(options?: Options): string {
          return options?.host ?? "";
        }
      `);

      const fn = sourceFile.getFunctions()[0];
      assert(fn != null, "Expected function");

      const validator = new FunctionValidator(fn, parseJSDocFromNode(fn));
      const result = validator.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({ type: "missing_param", target: "options.host" });
      expect(result.errors).toContainEqual({ type: "missing_param", target: "options.port" });
    });

    it("should validate optional param with type alias reference", () => {
      const sourceFile = createTSSourceFile(`
        type Options = {
          host: string;
          port: number;
        };

        /**
         * @public
         * @param options - The options
         * @param options.host - The host
         * @param options.port - The port
         * @returns The result
         */
        export function connect(options?: Options): string {
          return options?.host ?? "";
        }
      `);

      const fn = sourceFile.getFunctions()[0];
      assert(fn != null, "Expected function");

      const validator = new FunctionValidator(fn, parseJSDocFromNode(fn));
      const result = validator.validate();

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should detect missing params in arrow function", () => {
      const sourceFile = createTSSourceFile(`
        /**
         * @public
         * @param a - First number
         * @returns The sum
         */
        export const add = (a: number, b: number): number => a + b;
      `);

      const varDecl = sourceFile.getVariableDeclarations()[0];
      assert(varDecl != null, "Expected variable declaration");

      const validator = new FunctionValidator(varDecl, parseJSDocFromNode(varDecl));
      const result = validator.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({ type: "missing_param", target: "b" });
    });
  });
});
