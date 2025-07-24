import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { getDeclarationKind } from "../../../../core/parser/source/get-declaration-kind.js";
import { getTsProject } from "../../../../core/get-ts-project.js";
import { getTsConfigPath } from "../../../../core/get-ts-config-path.js";
import { createE2EWorkspace, E2EWorkspace } from "../../../utils/create-e2e-workspace.js";

describe("getDeclarationKind", () => {
  let workspace: E2EWorkspace;

  beforeEach(async () => {
    workspace = await createE2EWorkspace();
  });

  afterEach(async () => {
    await workspace.cleanup();
  });

  it("should return 'function' for function declarations", async () => {
    const tsConfigPath = getTsConfigPath(workspace.root, "packages/core");
    const project = getTsProject(tsConfigPath);

    const mathFile = project
      .getSourceFiles()
      .find((sf) => sf.getFilePath().includes("math.ts"));

    const addFunction = mathFile?.getFunction("add");
    expect(addFunction).toBeDefined();

    const kind = getDeclarationKind(addFunction!);
    expect(kind).toBe("function");
  });

  it("should return 'variable' for variable declarations", async () => {
    const tsConfigPath = getTsConfigPath(workspace.root, "packages/core");
    const project = getTsProject(tsConfigPath);

    const mathFile = project
      .getSourceFiles()
      .find((sf) => sf.getFilePath().includes("math.ts"));

    const piVariable = mathFile?.getVariableDeclaration("PI");
    expect(piVariable).toBeDefined();

    const kind = getDeclarationKind(piVariable!);
    expect(kind).toBe("variable");
  });

  it("should return 'class' for class declarations", async () => {
    const tsConfigPath = getTsConfigPath(workspace.root, "packages/core");
    const project = getTsProject(tsConfigPath);

    const classFile = project
      .getSourceFiles()
      .find((sf) => sf.getFilePath().includes("classes.ts"));

    const userClass = classFile?.getClass("User");
    expect(userClass).toBeDefined();

    const kind = getDeclarationKind(userClass!);
    expect(kind).toBe("class");
  });

  it("should return 'interface' for interface declarations", async () => {
    const workspace = await createE2EWorkspace();
    const tsConfigPath = getTsConfigPath(workspace.root, "packages/types");
    const project = getTsProject(tsConfigPath);

    const configFile = project
      .getSourceFiles()
      .find((sf) => sf.getFilePath().includes("index.ts"));

    const userConfigInterface = configFile?.getInterface("UserConfig");
    expect(userConfigInterface).toBeDefined();

    const kind = getDeclarationKind(userConfigInterface!);
    expect(kind).toBe("interface");
  });

  it("should return 'type' for type alias declarations", async () => {
    const workspace = await createE2EWorkspace();
    const tsConfigPath = getTsConfigPath(workspace.root, "packages/types");
    const project = getTsProject(tsConfigPath);

    const configFile = project
      .getSourceFiles()
      .find((sf) => sf.getFilePath().includes("index.ts"));

    const idTypeAlias = configFile?.getTypeAlias("ID");
    expect(idTypeAlias).toBeDefined();

    const kind = getDeclarationKind(idTypeAlias!);
    expect(kind).toBe("type");
  });

  it("should return 'enum' for enum declarations", async () => {
    const workspace = await createE2EWorkspace();
    const tsConfigPath = getTsConfigPath(workspace.root, "packages/core");
    const project = getTsProject(tsConfigPath);

    const mathFile = project
      .getSourceFiles()
      .find((sf) => sf.getFilePath().includes("math.ts"));

    const statusEnum = mathFile?.getEnum("Status");
    expect(statusEnum).toBeDefined();

    const kind = getDeclarationKind(statusEnum!);
    expect(kind).toBe("enum");
  });

  it("should return undefined for unsupported declaration types", async () => {
    const workspace = await createE2EWorkspace();
    const tsConfigPath = getTsConfigPath(workspace.root, "packages/core");
    const project = getTsProject(tsConfigPath);

    const classesFile = project
      .getSourceFiles()
      .find((sf) => sf.getFilePath().includes("classes.ts"));

    const importStatement = classesFile?.getImportDeclarations()[0];
    expect(importStatement).toBeDefined();

    const kind = getDeclarationKind(importStatement);
    expect(kind).toBeUndefined();
  });
});
