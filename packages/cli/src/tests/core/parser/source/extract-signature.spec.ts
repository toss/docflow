import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { extractSignature } from "../../../../core/parser/source/extract-signature.js";
import { getTsProject } from "../../../../core/get-ts-project.js";
import { getTsConfigPath } from "../../../../core/get-ts-config-path.js";
import { createE2EWorkspace, E2EWorkspace } from "../../../utils/create-e2e-workspace.js";

describe("extractSignature", () => {
  let workspace: E2EWorkspace;

  beforeEach(async () => {
    workspace = await createE2EWorkspace();
  });

  afterEach(async () => {
    await workspace.cleanup();
  });

  it("should extract function signature", async () => {
    const tsConfigPath = getTsConfigPath(workspace.root, "packages/core");
    const project = getTsProject(tsConfigPath);

    const mathFile = project
      .getSourceFiles()
      .find((sf) => sf.getFilePath().includes("math.ts"));

    const addFunction = mathFile?.getFunction("add");
    expect(addFunction).toBeDefined();

    const signature = extractSignature(addFunction!);
    expect(signature).toContain("function add");
    expect(signature).toContain("(a: number, b: number)");
    expect(signature).toContain(": number");
  });

  it("should extract arrow function signature", async () => {
    const tsConfigPath = getTsConfigPath(workspace.root, "packages/core");
    const project = getTsProject(tsConfigPath);

    const mathFile = project
      .getSourceFiles()
      .find((sf) => sf.getFilePath().includes("math.ts"));

    const multiplyVariable = mathFile?.getVariableDeclaration("multiply");
    expect(multiplyVariable).toBeDefined();

    const signature = extractSignature(multiplyVariable!);
    expect(signature).toContain("const multiply:");
    expect(signature).toContain("(x: number, y: number) => number");
  });

  it("should extract class signature", async () => {
    const tsConfigPath = getTsConfigPath(workspace.root, "packages/core");
    const project = getTsProject(tsConfigPath);

    const classFile = project
      .getSourceFiles()
      .find((sf) => sf.getFilePath().includes("classes.ts"));

    const userClass = classFile?.getClass("User");
    expect(userClass).toBeDefined();

    const signature = extractSignature(userClass!);
    expect(signature).toContain("class User");
  });

  it("should extract interface signature", async () => {
    const workspace = await createE2EWorkspace();
    const tsConfigPath = getTsConfigPath(workspace.root, "packages/types");
    const project = getTsProject(tsConfigPath);

    const configFile = project
      .getSourceFiles()
      .find((sf) => sf.getFilePath().includes("index.ts"));

    const userConfigInterface = configFile?.getInterface("UserConfig");
    expect(userConfigInterface).toBeDefined();

    const signature = extractSignature(userConfigInterface!);
    expect(signature).toContain("interface UserConfig");
  });

  it("should extract enum signature", async () => {
    const workspace = await createE2EWorkspace();
    const tsConfigPath = getTsConfigPath(workspace.root, "packages/core");
    const project = getTsProject(tsConfigPath);

    const mathFile = project
      .getSourceFiles()
      .find((sf) => sf.getFilePath().includes("math.ts"));

    const statusEnum = mathFile?.getEnum("Status");
    expect(statusEnum).toBeDefined();

    const signature = extractSignature(statusEnum!);
    expect(signature).toContain("enum Status");
    expect(signature).toContain("PENDING");
    expect(signature).toContain("SUCCESS");
  });

  it("should return undefined for unsupported node types", async () => {
    const workspace = await createE2EWorkspace();
    const tsConfigPath = getTsConfigPath(workspace.root, "packages/core");
    const project = getTsProject(tsConfigPath);

    const classesFile = project
      .getSourceFiles()
      .find((sf) => sf.getFilePath().includes("classes.ts"));

    const importStatement = classesFile?.getImportDeclarations()[0];
    expect(importStatement).toBeDefined();

    const signature = extractSignature(importStatement!);
    expect(signature).toBeUndefined();
  });
});
