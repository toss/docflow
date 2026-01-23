import { isEmpty } from "es-toolkit/compat";
import path from "path";
import { ExportDeclaration } from "../../../core/types/parser.types.js";
import { validate } from "./validate-jsdoc.js";
import { validatePublic } from "./validate-public.js";
import { ValidationError } from "./validate.types.js";

export interface ValidationIssue {
  exportDeclaration: ExportDeclaration;
  relativePath: string;
  errors: ValidationError[];
}

export interface PackageValidationResult {
  issues: ValidationIssue[];
}

export function validateExports(
  exportDeclarations: ExportDeclaration[],
  projectRoot: string
): PackageValidationResult {
  const issues = exportDeclarations
    .map((target) => {
      const relativePath = path.relative(projectRoot, target.filePath);
      const isPublic = validatePublic(target.declaration);

      if (!isPublic) {
        return {
          exportDeclaration: target,
          relativePath,
          errors: [{ type: "missing_public" as const, target: target.symbolName }],
        };
      }

      const { errors } = validate(target.declaration);
      if (isEmpty(errors)) {
        return null;
      }

      return {
        exportDeclaration: target,
        relativePath,
        errors,
      };
    })
    .filter((issue) => issue != null);

  return { issues };
}