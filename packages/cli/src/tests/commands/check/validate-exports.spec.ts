import { describe, it, expect } from "vitest";
import { assert } from "es-toolkit";
import { validateExports } from "../../../commands/check/validate/validate-exports.js";
import { createTSSourceFile } from "../../utils/create-ts-source-file.js";
import { ExportDeclaration } from "../../../core/types/parser.types.js";

function createExportDeclarations(code: string): ExportDeclaration[] {
  const sourceFile = createTSSourceFile(code);

  const result: ExportDeclaration[] = [];

  for (const [name, decls] of sourceFile.getExportedDeclarations()) {
    for (const decl of decls) {
      result.push({
        symbolName: name,
        declaration: decl,
        filePath: sourceFile.getFilePath(),
      });
    }
  }

  return result;
}

describe("validateExports", () => {
  it("should return no issues for fully documented exports", () => {
    const exports = createExportDeclarations(`
      /**
       * @public
       * @param a - First
       * @returns The sum
       */
      export function add(a: number): number { return a; }
    `);

    const result = validateExports(exports, "/");

    expect(result.issues).toHaveLength(0);
  });

  it("should detect missing @public tag", () => {
    const exports = createExportDeclarations(`
      /**
       * @param a - First
       * @returns The sum
       */
      export function add(a: number): number { return a; }
    `);

    const result = validateExports(exports, "/");

    expect(result.issues).toHaveLength(1);
    expect(result.issues[0].errors).toContainEqual({
      type: "missing_public",
      target: "add",
    });
  });

  it("should detect validation errors for public exports", () => {
    const exports = createExportDeclarations(`
      /**
       * @public
       */
      export function add(a: number): number { return a; }
    `);

    const result = validateExports(exports, "/");

    expect(result.issues).toHaveLength(1);
    expect(result.issues[0].errors).toContainEqual({ type: "missing_param", target: "a" });
    expect(result.issues[0].errors).toContainEqual({ type: "missing_returns", target: "returns" });
  });

  it("should include relative path in issues", () => {
    const exports = createExportDeclarations(`
      /**
       * @public
       */
      export function broken(): void {}
    `);

    const result = validateExports(exports, "/");

    assert(result.issues.length > 0, "Expected issues");
    expect(result.issues[0].relativePath).toBeDefined();
  });

  it("should handle empty export list", () => {
    const result = validateExports([], "/");

    expect(result.issues).toHaveLength(0);
  });

  it("should handle multiple exports with mixed results", () => {
    const exports = createExportDeclarations(`
      /**
       * @public
       * @param a - First
       * @returns The result
       */
      export function good(a: number): number { return a; }

      /**
       * @public
       */
      export function bad(x: number): number { return x; }
    `);

    const result = validateExports(exports, "/");

    expect(result.issues).toHaveLength(1);
    expect(result.issues[0].exportDeclaration.symbolName).toBe("bad");
  });
});
