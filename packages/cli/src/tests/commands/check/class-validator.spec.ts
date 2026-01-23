import { describe, it, expect } from "vitest";
import { assert } from "es-toolkit";
import { ClassValidator } from "../../../commands/check/validate/validator/class-validator.js";
import { createTSSourceFile } from "../../utils/create-ts-source-file.js";
import { parseJSDocFromNode } from "../../utils/parse-jsdoc-from-node.js";

describe("ClassValidator", () => {
  describe("property validation", () => {
    it("should return valid when all properties are documented", () => {
      const sourceFile = createTSSourceFile(`
        /**
         * @public
         * @param name - The user's name
         * @param age - The user's age
         */
        export class User {
          name: string;
          age: number;
        }
      `);

      const cls = sourceFile.getClasses()[0];
      assert(cls != null, "Expected class");

      const validator = new ClassValidator(cls, parseJSDocFromNode(cls));
      const result = validator.validate();

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should detect missing property documentation", () => {
      const sourceFile = createTSSourceFile(`
        /**
         * @public
         * @param name - The user's name
         */
        export class User {
          name: string;
          age: number;
        }
      `);

      const cls = sourceFile.getClasses()[0];
      assert(cls != null, "Expected class");

      const validator = new ClassValidator(cls, parseJSDocFromNode(cls));
      const result = validator.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        type: "missing_param",
        target: "age",
      });
    });

    it("should detect unused property documentation", () => {
      const sourceFile = createTSSourceFile(`
        /**
         * @public
         * @param name - The user's name
         * @param deletedField - No longer exists
         */
        export class User {
          name: string;
        }
      `);

      const cls = sourceFile.getClasses()[0];
      assert(cls != null, "Expected class");

      const validator = new ClassValidator(cls, parseJSDocFromNode(cls));
      const result = validator.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        type: "unused_param",
        target: "deletedField",
      });
    });
  });

  describe("method handling", () => {
    it("should allow documented method names as valid params", () => {
      const sourceFile = createTSSourceFile(`
        /**
         * @public
         * @param name - The name
         * @param greet - Method to greet
         */
        export class Person {
          name: string;
          greet() {}
        }
      `);

      const cls = sourceFile.getClasses()[0];
      assert(cls != null, "Expected class");

      const validator = new ClassValidator(cls, parseJSDocFromNode(cls));
      const result = validator.validate();

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should not require method documentation", () => {
      const sourceFile = createTSSourceFile(`
        /**
         * @public
         * @param name - The name
         */
        export class Person {
          name: string;
          greet() {}
        }
      `);

      const cls = sourceFile.getClasses()[0];
      assert(cls != null, "Expected class");

      const validator = new ClassValidator(cls, parseJSDocFromNode(cls));
      const result = validator.validate();

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe("empty class", () => {
    it("should return valid for empty class with JSDoc", () => {
      const sourceFile = createTSSourceFile(`
        /**
         * @public
         */
        export class Empty {}
      `);

      const cls = sourceFile.getClasses()[0];
      assert(cls != null, "Expected class");

      const validator = new ClassValidator(cls, parseJSDocFromNode(cls));
      const result = validator.validate();

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});
