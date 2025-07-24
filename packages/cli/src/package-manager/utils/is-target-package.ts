import { minimatch } from "minimatch";
import { Package } from "../types/package-manager.type.js";

type TargetPackageConfig = {
  include: string[];
  exclude: string[];
};

export function isTargetPackage(
  pkg: Package,
  { include, exclude }: TargetPackageConfig,
): boolean {
  const { location } = pkg;

  const isIncluded =
    include.length === 0 ||
    include.some((pattern) => minimatch(location, pattern));
  const isExcluded = exclude.some((pattern) => minimatch(location, pattern));

  return isIncluded && !isExcluded;
}
