import { difference } from "es-toolkit";
import { ValidationError } from "../../validate.types.js";

export function findMissingDocs(codeSymbols: string[], jsDocNames: string[]): ValidationError[] {
  return difference(codeSymbols, jsDocNames).map(target => ({
    type: "missing_param" as const,
    target,
  }));
}
