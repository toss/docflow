import { difference } from "es-toolkit";
import { ValidationError } from "../../validate.types.js";

interface FindUnusedDocsOptions {
  codeSymbols: string[];
  jsDocNames: string[];
  errorType: "unused_param" | "unused_property";
}

export function findUnusedDocs({ codeSymbols, jsDocNames, errorType }: FindUnusedDocsOptions): ValidationError[] {
  return difference(jsDocNames, codeSymbols).map(target => ({
    type: errorType,
    target,
  }));
}
