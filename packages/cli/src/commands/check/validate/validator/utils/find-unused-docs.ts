import { difference } from "es-toolkit";
import { ValidationError } from "../../validate.types.js";

export function findUnusedDocs(jsDocNames: string[], validTargets: string[]): ValidationError[] {
  return difference(jsDocNames, validTargets).map(target => ({
    type: "unused_param",
    target,
  }));
}
