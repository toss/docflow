import { describe, it, expect } from "vitest";
import { assert } from "es-toolkit";
import { ObjectLiteralValidator } from "../../../commands/check/validate/validator/object-literal-validator.js";
import { createTSSourceFile } from "../../utils/create-ts-source-file.js";
import { parseJSDocFromNode } from "../../utils/parse-jsdoc-from-node.js";

describe("ObjectLiteralValidator", () => {
  it("should return valid when all properties are documented", () => {
    const sourceFile = createTSSourceFile(`
      /**
       * @public
       * @param host - The host
       * @param port - The port
       * @returns void
       */
      export const config = {
        host: "localhost",
        port: 3000,
      };
    `);

    const varDecl = sourceFile.getVariableDeclarations()[0];
    assert(varDecl != null, "Expected variable declaration");

    const validator = new ObjectLiteralValidator(varDecl, parseJSDocFromNode(varDecl));
    const result = validator.validate();

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("should detect missing property documentation", () => {
    const sourceFile = createTSSourceFile(`
      /**
       * @public
       * @param host - The host
       * @returns void
       */
      export const config = {
        host: "localhost",
        port: 3000,
      };
    `);

    const varDecl = sourceFile.getVariableDeclarations()[0];
    assert(varDecl != null, "Expected variable declaration");

    const validator = new ObjectLiteralValidator(varDecl, parseJSDocFromNode(varDecl));
    const result = validator.validate();

    expect(result.isValid).toBe(false);
    expect(result.errors).toContainEqual({ type: "missing_param", target: "port" });
  });

  it("should detect unused property documentation", () => {
    const sourceFile = createTSSourceFile(`
      /**
       * @public
       * @param host - The host
       * @param removed - No longer exists
       * @returns void
       */
      export const config = {
        host: "localhost",
      };
    `);

    const varDecl = sourceFile.getVariableDeclarations()[0];
    assert(varDecl != null, "Expected variable declaration");

    const validator = new ObjectLiteralValidator(varDecl, parseJSDocFromNode(varDecl));
    const result = validator.validate();

    expect(result.isValid).toBe(false);
    expect(result.errors).toContainEqual({ type: "unused_param", target: "removed" });
  });

  it("should validate nested object properties", () => {
    const sourceFile = createTSSourceFile(`
      /**
       * @public
       * @param db - Database config
       * @param db.host - The host
       * @param db.port - The port
       * @returns void
       */
      export const config = {
        db: {
          host: "localhost",
          port: 5432,
        },
      };
    `);

    const varDecl = sourceFile.getVariableDeclarations()[0];
    assert(varDecl != null, "Expected variable declaration");

    const validator = new ObjectLiteralValidator(varDecl, parseJSDocFromNode(varDecl));
    const result = validator.validate();

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("should detect missing nested property documentation", () => {
    const sourceFile = createTSSourceFile(`
      /**
       * @public
       * @param db - Database config
       * @returns void
       */
      export const config = {
        db: {
          host: "localhost",
          port: 5432,
        },
      };
    `);

    const varDecl = sourceFile.getVariableDeclarations()[0];
    assert(varDecl != null, "Expected variable declaration");

    const validator = new ObjectLiteralValidator(varDecl, parseJSDocFromNode(varDecl));
    const result = validator.validate();

    expect(result.isValid).toBe(false);
    expect(result.errors).toContainEqual({ type: "missing_param", target: "db.host" });
    expect(result.errors).toContainEqual({ type: "missing_param", target: "db.port" });
  });

  it("should detect both missing and unused simultaneously", () => {
    const sourceFile = createTSSourceFile(`
      /**
       * @public
       * @param removed - No longer exists
       * @returns void
       */
      export const config = {
        host: "localhost",
        port: 3000,
      };
    `);

    const varDecl = sourceFile.getVariableDeclarations()[0];
    assert(varDecl != null, "Expected variable declaration");

    const validator = new ObjectLiteralValidator(varDecl, parseJSDocFromNode(varDecl));
    const result = validator.validate();

    expect(result.isValid).toBe(false);
    expect(result.errors).toContainEqual({ type: "missing_param", target: "host" });
    expect(result.errors).toContainEqual({ type: "missing_param", target: "port" });
    expect(result.errors).toContainEqual({ type: "unused_param", target: "removed" });
  });

  it("should return no errors for non-object initializer", () => {
    const sourceFile = createTSSourceFile(`
      /**
       * @public
       * @returns void
       */
      export const value = 42;
    `);

    const varDecl = sourceFile.getVariableDeclarations()[0];
    assert(varDecl != null, "Expected variable declaration");

    const validator = new ObjectLiteralValidator(varDecl, parseJSDocFromNode(varDecl));
    const result = validator.validate();

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("should return valid for empty object literal", () => {
    const sourceFile = createTSSourceFile(`
      /**
       * @public
       * @returns void
       */
      export const config = {};
    `);

    const varDecl = sourceFile.getVariableDeclarations()[0];
    assert(varDecl != null, "Expected variable declaration");

    const validator = new ObjectLiteralValidator(varDecl, parseJSDocFromNode(varDecl));
    const result = validator.validate();

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});
