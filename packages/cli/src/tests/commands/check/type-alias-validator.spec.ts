import { describe, it, expect } from "vitest";
import { assert } from "es-toolkit";
import { TypeAliasValidator } from "../../../commands/check/validate/validator/type-alias-validator.js";
import { createTSSourceFile } from "../../utils/create-ts-source-file.js";
import { parseJSDocFromNode } from "../../utils/parse-jsdoc-from-node.js";

describe("TypeAliasValidator", () => {
  describe("type literal validation", () => {
    it("should return valid when all properties are documented", () => {
      const sourceFile = createTSSourceFile(`
        /**
         * @public
         * @property name - The name
         * @property age - The age
         */
        export type User = {
          name: string;
          age: number;
        };
      `);

      const typeAlias = sourceFile.getTypeAliases()[0];
      assert(typeAlias != null, "Expected type alias");

      const validator = new TypeAliasValidator(typeAlias, parseJSDocFromNode(typeAlias));
      const result = validator.validate();

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should detect missing property documentation", () => {
      const sourceFile = createTSSourceFile(`
        /**
         * @public
         * @property name - The name
         */
        export type User = {
          name: string;
          age: number;
        };
      `);

      const typeAlias = sourceFile.getTypeAliases()[0];
      assert(typeAlias != null, "Expected type alias");

      const validator = new TypeAliasValidator(typeAlias, parseJSDocFromNode(typeAlias));
      const result = validator.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({ type: "missing_property", target: "age" });
    });

    it("should detect unused property documentation", () => {
      const sourceFile = createTSSourceFile(`
        /**
         * @public
         * @property name - The name
         * @property removed - No longer exists
         */
        export type User = {
          name: string;
        };
      `);

      const typeAlias = sourceFile.getTypeAliases()[0];
      assert(typeAlias != null, "Expected type alias");

      const validator = new TypeAliasValidator(typeAlias, parseJSDocFromNode(typeAlias));
      const result = validator.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({ type: "unused_property", target: "removed" });
    });

    it("should detect both missing and unused simultaneously", () => {
      const sourceFile = createTSSourceFile(`
        /**
         * @public
         * @property oldField - Removed
         */
        export type Config = {
          host: string;
          port: number;
        };
      `);

      const typeAlias = sourceFile.getTypeAliases()[0];
      assert(typeAlias != null, "Expected type alias");

      const validator = new TypeAliasValidator(typeAlias, parseJSDocFromNode(typeAlias));
      const result = validator.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({ type: "missing_property", target: "host" });
      expect(result.errors).toContainEqual({ type: "missing_property", target: "port" });
      expect(result.errors).toContainEqual({ type: "unused_property", target: "oldField" });
    });
  });

  describe("nested property validation", () => {
    it("should validate nested type literal properties", () => {
      const sourceFile = createTSSourceFile(`
        /**
         * @public
         * @property db - Database config
         * @property db.host - The host
         * @property db.port - The port
         */
        export type Config = {
          db: {
            host: string;
            port: number;
          };
        };
      `);

      const typeAlias = sourceFile.getTypeAliases()[0];
      assert(typeAlias != null, "Expected type alias");

      const validator = new TypeAliasValidator(typeAlias, parseJSDocFromNode(typeAlias));
      const result = validator.validate();

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should detect unused nested property documentation", () => {
      const sourceFile = createTSSourceFile(`
        /**
         * @public
         * @property db - Database config
         * @property db.host - The host
         * @property db.removed - No longer exists
         */
        export type Config = {
          db: {
            host: string;
          };
        };
      `);

      const typeAlias = sourceFile.getTypeAliases()[0];
      assert(typeAlias != null, "Expected type alias");

      const validator = new TypeAliasValidator(typeAlias, parseJSDocFromNode(typeAlias));
      const result = validator.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({ type: "unused_property", target: "db.removed" });
    });

    it("should detect missing nested property documentation", () => {
      const sourceFile = createTSSourceFile(`
        /**
         * @public
         * @property db - Database config
         */
        export type Config = {
          db: {
            host: string;
            port: number;
          };
        };
      `);

      const typeAlias = sourceFile.getTypeAliases()[0];
      assert(typeAlias != null, "Expected type alias");

      const validator = new TypeAliasValidator(typeAlias, parseJSDocFromNode(typeAlias));
      const result = validator.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({ type: "missing_property", target: "db.host" });
      expect(result.errors).toContainEqual({ type: "missing_property", target: "db.port" });
    });
  });

  describe("nested property with type reference", () => {
    it("should validate nested properties when property type is an interface reference", () => {
      const sourceFile = createTSSourceFile(`
        interface DbConfig {
          host: string;
          port: number;
        }

        /**
         * @public
         * @property db - Database config
         * @property db.host - The host
         * @property db.port - The port
         */
        export type Config = {
          db: DbConfig;
        };
      `);

      const typeAlias = sourceFile.getTypeAliases().find(t => t.getName() === "Config");
      assert(typeAlias != null, "Expected type alias");

      const validator = new TypeAliasValidator(typeAlias, parseJSDocFromNode(typeAlias));
      const result = validator.validate();

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should detect missing nested properties when property type is an interface reference", () => {
      const sourceFile = createTSSourceFile(`
        interface DbConfig {
          host: string;
          port: number;
        }

        /**
         * @public
         * @property db - Database config
         */
        export type Config = {
          db: DbConfig;
        };
      `);

      const typeAlias = sourceFile.getTypeAliases().find(t => t.getName() === "Config");
      assert(typeAlias != null, "Expected type alias");

      const validator = new TypeAliasValidator(typeAlias, parseJSDocFromNode(typeAlias));
      const result = validator.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({ type: "missing_property", target: "db.host" });
      expect(result.errors).toContainEqual({ type: "missing_property", target: "db.port" });
    });

    it("should detect missing nested properties when property type is a type alias reference", () => {
      const sourceFile = createTSSourceFile(`
        type DbConfig = {
          host: string;
          port: number;
        };

        /**
         * @public
         * @property db - Database config
         */
        export type Config = {
          db: DbConfig;
        };
      `);

      const typeAlias = sourceFile.getTypeAliases().find(t => t.getName() === "Config");
      assert(typeAlias != null, "Expected type alias");

      const validator = new TypeAliasValidator(typeAlias, parseJSDocFromNode(typeAlias));
      const result = validator.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({ type: "missing_property", target: "db.host" });
      expect(result.errors).toContainEqual({ type: "missing_property", target: "db.port" });
    });

    it("should validate optional property with type alias reference", () => {
      const sourceFile = createTSSourceFile(`
        type DbConfig = {
          host: string;
          port: number;
        };

        /**
         * @public
         * @property db - Database config
         * @property db.host - The host
         * @property db.port - The port
         */
        export type Config = {
          db?: DbConfig;
        };
      `);

      const typeAlias = sourceFile.getTypeAliases().find(t => t.getName() === "Config");
      assert(typeAlias != null, "Expected type alias");

      const validator = new TypeAliasValidator(typeAlias, parseJSDocFromNode(typeAlias));
      const result = validator.validate();

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe("non-type-literal types", () => {
    it("should skip union types", () => {
      const sourceFile = createTSSourceFile(`
        /**
         * @public
         */
        export type Status = "active" | "inactive";
      `);

      const typeAlias = sourceFile.getTypeAliases()[0];
      assert(typeAlias != null, "Expected type alias");

      const validator = new TypeAliasValidator(typeAlias, parseJSDocFromNode(typeAlias));
      const result = validator.validate();

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should skip primitive types", () => {
      const sourceFile = createTSSourceFile(`
        /**
         * @public
         */
        export type ID = string;
      `);

      const typeAlias = sourceFile.getTypeAliases()[0];
      assert(typeAlias != null, "Expected type alias");

      const validator = new TypeAliasValidator(typeAlias, parseJSDocFromNode(typeAlias));
      const result = validator.validate();

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should skip array types", () => {
      const sourceFile = createTSSourceFile(`
        /**
         * @public
         */
        export type Names = string[];
      `);

      const typeAlias = sourceFile.getTypeAliases()[0];
      assert(typeAlias != null, "Expected type alias");

      const validator = new TypeAliasValidator(typeAlias, parseJSDocFromNode(typeAlias));
      const result = validator.validate();

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should skip function types", () => {
      const sourceFile = createTSSourceFile(`
        /**
         * @public
         */
        export type Handler = (event: Event) => void;
      `);

      const typeAlias = sourceFile.getTypeAliases()[0];
      assert(typeAlias != null, "Expected type alias");

      const validator = new TypeAliasValidator(typeAlias, parseJSDocFromNode(typeAlias));
      const result = validator.validate();

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should return valid for empty type literal", () => {
      const sourceFile = createTSSourceFile(`
        /**
         * @public
         */
        export type Empty = {};
      `);

      const typeAlias = sourceFile.getTypeAliases()[0];
      assert(typeAlias != null, "Expected type alias");

      const validator = new TypeAliasValidator(typeAlias, parseJSDocFromNode(typeAlias));
      const result = validator.validate();

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});
