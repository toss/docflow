import { describe, it, expect } from "vitest";
import { assert } from "es-toolkit";
import { InterfaceValidator } from "../../../commands/check/validate/validator/interface-validator.js";
import { createTSSourceFile } from "../../utils/create-ts-source-file.js";
import { parseJSDocFromNode } from "../../utils/parse-jsdoc-from-node.js";

describe("InterfaceValidator", () => {
  describe("property validation", () => {
    it("should return valid when all properties are documented", () => {
      const sourceFile = createTSSourceFile(`
        /**
         * @public
         * @property name - The user's name
         * @property age - The user's age
         */
        export interface User {
          name: string;
          age: number;
        }
      `);

      const iface = sourceFile.getInterfaces()[0];
      assert(iface != null, "Expected interface");

      const validator = new InterfaceValidator(iface, parseJSDocFromNode(iface));
      const result = validator.validate();

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should detect missing property documentation", () => {
      const sourceFile = createTSSourceFile(`
        /**
         * @public
         * @property name - The user's name
         */
        export interface User {
          name: string;
          age: number;
        }
      `);

      const iface = sourceFile.getInterfaces()[0];
      assert(iface != null, "Expected interface");

      const validator = new InterfaceValidator(iface, parseJSDocFromNode(iface));
      const result = validator.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        type: "missing_property",
        target: "age",
      });
    });

    it("should detect unused property documentation", () => {
      const sourceFile = createTSSourceFile(`
        /**
         * @public
         * @property name - The user's name
         * @property deletedField - No longer exists
         */
        export interface User {
          name: string;
        }
      `);

      const iface = sourceFile.getInterfaces()[0];
      assert(iface != null, "Expected interface");

      const validator = new InterfaceValidator(iface, parseJSDocFromNode(iface));
      const result = validator.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        type: "unused_property",
        target: "deletedField",
      });
    });

    it("should detect multiple missing and unused params", () => {
      const sourceFile = createTSSourceFile(`
        /**
         * @public
         * @property oldField1 - Removed
         * @property oldField2 - Also removed
         */
        export interface User {
          name: string;
          email: string;
        }
      `);

      const iface = sourceFile.getInterfaces()[0];
      assert(iface != null, "Expected interface");

      const validator = new InterfaceValidator(iface, parseJSDocFromNode(iface));
      const result = validator.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        type: "missing_property",
        target: "name",
      });
      expect(result.errors).toContainEqual({
        type: "missing_property",
        target: "email",
      });
      expect(result.errors).toContainEqual({
        type: "unused_property",
        target: "oldField1",
      });
      expect(result.errors).toContainEqual({
        type: "unused_property",
        target: "oldField2",
      });
    });
  });

  describe("nested property validation", () => {
    it("should accept nested property documentation", () => {
      const sourceFile = createTSSourceFile(`
        /**
         * @public
         * @property address - The address
         * @property address.street - The street
         * @property address.city - The city
         */
        export interface User {
          address: {
            street: string;
            city: string;
          };
        }
      `);

      const iface = sourceFile.getInterfaces()[0];
      assert(iface != null, "Expected interface");

      const validator = new InterfaceValidator(iface, parseJSDocFromNode(iface));
      const result = validator.validate();

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should detect missing nested property documentation", () => {
      const sourceFile = createTSSourceFile(`
        /**
         * @public
         * @property address - The address
         * @property address.street - The street
         */
        export interface User {
          address: {
            street: string;
            city: string;
          };
        }
      `);

      const iface = sourceFile.getInterfaces()[0];
      assert(iface != null, "Expected interface");

      const validator = new InterfaceValidator(iface, parseJSDocFromNode(iface));
      const result = validator.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        type: "missing_property",
        target: "address.city",
      });
    });

    it("should detect unused nested property documentation", () => {
      const sourceFile = createTSSourceFile(`
        /**
         * @public
         * @property address - The address
         * @property address.zipCode - Removed property
         */
        export interface User {
          address: {
            street: string;
          };
        }
      `);

      const iface = sourceFile.getInterfaces()[0];
      assert(iface != null, "Expected interface");

      const validator = new InterfaceValidator(iface, parseJSDocFromNode(iface));
      const result = validator.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        type: "unused_property",
        target: "address.zipCode",
      });
    });
  });

  describe("nested property with type reference", () => {
    it("should validate nested properties when property type is an interface reference", () => {
      const sourceFile = createTSSourceFile(`
        interface Address {
          street: string;
          city: string;
        }

        /**
         * @public
         * @property address - The address
         * @property address.street - The street
         * @property address.city - The city
         */
        export interface User {
          address: Address;
        }
      `);

      const iface = sourceFile.getInterfaces().find(i => i.getName() === "User");
      assert(iface != null, "Expected interface");

      const validator = new InterfaceValidator(iface, parseJSDocFromNode(iface));
      const result = validator.validate();

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should detect missing nested properties when property type is an interface reference", () => {
      const sourceFile = createTSSourceFile(`
        interface Address {
          street: string;
          city: string;
        }

        /**
         * @public
         * @property address - The address
         */
        export interface User {
          address: Address;
        }
      `);

      const iface = sourceFile.getInterfaces().find(i => i.getName() === "User");
      assert(iface != null, "Expected interface");

      const validator = new InterfaceValidator(iface, parseJSDocFromNode(iface));
      const result = validator.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({ type: "missing_property", target: "address.street" });
      expect(result.errors).toContainEqual({ type: "missing_property", target: "address.city" });
    });

    it("should detect missing nested properties when property type is a type alias reference", () => {
      const sourceFile = createTSSourceFile(`
        type Address = {
          street: string;
          city: string;
        };

        /**
         * @public
         * @property address - The address
         */
        export interface User {
          address: Address;
        }
      `);

      const iface = sourceFile.getInterfaces().find(i => i.getName() === "User");
      assert(iface != null, "Expected interface");

      const validator = new InterfaceValidator(iface, parseJSDocFromNode(iface));
      const result = validator.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({ type: "missing_property", target: "address.street" });
      expect(result.errors).toContainEqual({ type: "missing_property", target: "address.city" });
    });

    it("should validate optional property with interface reference", () => {
      const sourceFile = createTSSourceFile(`
        interface Address {
          street: string;
          city: string;
        }

        /**
         * @public
         * @property address - The address
         * @property address.street - The street
         * @property address.city - The city
         */
        export interface User {
          address?: Address;
        }
      `);

      const iface = sourceFile.getInterfaces().find(i => i.getName() === "User");
      assert(iface != null, "Expected interface");

      const validator = new InterfaceValidator(iface, parseJSDocFromNode(iface));
      const result = validator.validate();

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe("interface methods", () => {
    it("should allow documented method names as valid params", () => {
      const sourceFile = createTSSourceFile(`
        /**
         * @public
         * @property name - The name
         * @property greet - Method to greet
         */
        export interface Person {
          name: string;
          greet(): void;
        }
      `);

      const iface = sourceFile.getInterfaces()[0];
      assert(iface != null, "Expected interface");

      const validator = new InterfaceValidator(iface, parseJSDocFromNode(iface));
      const result = validator.validate();

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should detect missing method documentation", () => {
      const sourceFile = createTSSourceFile(`
        /**
         * @public
         * @property name - The name
         */
        export interface Person {
          name: string;
          greet(): void;
        }
      `);

      const iface = sourceFile.getInterfaces()[0];
      assert(iface != null, "Expected interface");

      const validator = new InterfaceValidator(iface, parseJSDocFromNode(iface));
      const result = validator.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        type: "missing_property",
        target: "greet",
      });
    });
  });

  describe("optional properties", () => {
    it("should require documentation for optional properties", () => {
      const sourceFile = createTSSourceFile(`
        /**
         * @public
         * @property name - The name
         */
        export interface User {
          name: string;
          age?: number;
        }
      `);

      const iface = sourceFile.getInterfaces()[0];
      assert(iface != null, "Expected interface");

      const validator = new InterfaceValidator(iface, parseJSDocFromNode(iface));
      const result = validator.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        type: "missing_property",
        target: "age",
      });
    });

    it("should return valid when optional properties are documented", () => {
      const sourceFile = createTSSourceFile(`
        /**
         * @public
         * @property name - The name
         * @property age - The age
         */
        export interface User {
          name: string;
          age?: number;
        }
      `);

      const iface = sourceFile.getInterfaces()[0];
      assert(iface != null, "Expected interface");

      const validator = new InterfaceValidator(iface, parseJSDocFromNode(iface));
      const result = validator.validate();

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe("readonly properties", () => {
    it("should validate readonly properties", () => {
      const sourceFile = createTSSourceFile(`
        /**
         * @public
         * @property id - The ID
         * @property name - The name
         */
        export interface User {
          readonly id: string;
          name: string;
        }
      `);

      const iface = sourceFile.getInterfaces()[0];
      assert(iface != null, "Expected interface");

      const validator = new InterfaceValidator(iface, parseJSDocFromNode(iface));
      const result = validator.validate();

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe("empty interface", () => {
    it("should return valid for empty interface with JSDoc", () => {
      const sourceFile = createTSSourceFile(`
        /**
         * @public
         */
        export interface Empty {}
      `);

      const iface = sourceFile.getInterfaces()[0];
      assert(iface != null, "Expected interface");

      const validator = new InterfaceValidator(iface, parseJSDocFromNode(iface));
      const result = validator.validate();

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});
