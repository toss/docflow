import { flatMap } from "es-toolkit";
import { isEmpty } from "es-toolkit/compat";
import { Node, PropertyAssignment } from "ts-morph";

/**
 * Recursively collects dot-separated paths from object literal PropertyAssignments.
 * Descends into nested object literals to produce paths like "db.host".
 *
 * @example
 * // const config = { db: { host: "localhost", port: 5432 } }
 * collectPropertyAssignmentPaths(properties) // => ["db", "db.host", "db.port"]
 */
export function collectPropertyAssignmentPaths(properties: PropertyAssignment[], prefix = ""): string[] {
  return flatMap(properties, prop => {
    const name = prop.getName();
    const fullPath = prefix ? `${prefix}.${name}` : name;
    const initializer = prop.getInitializer();

    if (!Node.isObjectLiteralExpression(initializer)) {
      return [fullPath];
    }

    const children = initializer.getProperties().filter(p => Node.isPropertyAssignment(p));

    if (isEmpty(children)) {
      return [fullPath];
    }

    return [fullPath, ...collectPropertyAssignmentPaths(children, fullPath)];
  });
}
