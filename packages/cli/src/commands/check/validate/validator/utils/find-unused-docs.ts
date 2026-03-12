import { difference } from "es-toolkit";
import { ValidationError } from "../../validate.types.js";

export function findUnusedDocs(validTargets: string[], jsDocNames: string[]): ValidationError[] {
  return difference(jsDocNames, validTargets).map(target => ({
    type: "unused_param",
    target,
  }));
}
