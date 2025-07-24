import { getTsConfigPath } from "../../core/get-ts-config-path.js";
import { getTsProject } from "../../core/get-ts-project.js";
import { getExportedDeclarationsBySourceFile } from "../../core/parser/source/get-exported-declarations-by-sourcefile.js";
import { parseJSDoc } from "../../core/parser/jsdoc/parse-jsdoc.js";
import { JSDocParser } from "../../core/parser/jsdoc/jsdoc-parser.js";
import { E2EWorkspace } from "./create-e2e-workspace.js";

export class TSProjectTestHelper {
  private parser = new JSDocParser();

  constructor(private workspace: E2EWorkspace) {}

  async getProject(packageName: string = "core") {
    const tsConfigPath = getTsConfigPath(
      this.workspace.root,
      `packages/${packageName}`
    );
    return getTsProject(tsConfigPath);
  }

  async getFileExports(fileName: string, packageName: string = "core") {
    const project = await this.getProject(packageName);
    const sourceFile = project
      .getSourceFiles()
      .find((sf) => sf.getFilePath().includes(fileName));

    if (!sourceFile) {
      throw new Error(`File ${fileName} not found in package ${packageName}`);
    }

    return getExportedDeclarationsBySourceFile(sourceFile);
  }

  async getExportByName(
    exportName: string,
    fileName: string,
    packageName: string = "core"
  ) {
    const exports = await this.getFileExports(fileName, packageName);
    const targetExport = exports.find((exp) => exp.symbolName === exportName);

    if (!targetExport) {
      throw new Error(`Export ${exportName} not found in ${fileName}`);
    }

    return targetExport;
  }

  async getExportWithJSDoc(
    exportName: string,
    fileName: string,
    packageName: string = "core"
  ) {
    const exportDeclaration = await this.getExportByName(
      exportName,
      fileName,
      packageName
    );
    return parseJSDoc(exportDeclaration, this.parser);
  }

  getParser() {
    return this.parser;
  }
}
