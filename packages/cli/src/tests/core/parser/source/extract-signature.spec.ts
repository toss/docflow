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

    const mathFile = project.getSourceFiles().find(sf => sf.getFilePath().includes("math.ts"));

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

    const mathFile = project.getSourceFiles().find(sf => sf.getFilePath().includes("math.ts"));

    const multiplyVariable = mathFile?.getVariableDeclaration("multiply");
    expect(multiplyVariable).toBeDefined();

    const signature = extractSignature(multiplyVariable!);
    expect(signature).toContain("const multiply:");
    expect(signature).toContain("(x: number, y: number) => number");
  });

  it("should extract class signature", async () => {
    const tsConfigPath = getTsConfigPath(workspace.root, "packages/core");
    const project = getTsProject(tsConfigPath);

    const classFile = project.getSourceFiles().find(sf => sf.getFilePath().includes("classes.ts"));

    const userClass = classFile?.getClass("User");
    expect(userClass).toBeDefined();

    const signature = extractSignature(userClass!);
    expect(signature).toContain("class User");
  });

  it("should extract interface signature", async () => {
    const tsConfigPath = getTsConfigPath(workspace.root, "packages/types");
    const project = getTsProject(tsConfigPath);

    const configFile = project.getSourceFiles().find(sf => sf.getFilePath().includes("index.ts"));

    const userConfigInterface = configFile?.getInterface("UserConfig");
    expect(userConfigInterface).toBeDefined();

    const signature = extractSignature(userConfigInterface!);
    expect(signature).toContain("interface UserConfig");
  });

  it("should extract enum signature", async () => {
    const tsConfigPath = getTsConfigPath(workspace.root, "packages/core");
    const project = getTsProject(tsConfigPath);

    const mathFile = project.getSourceFiles().find(sf => sf.getFilePath().includes("math.ts"));

    const statusEnum = mathFile?.getEnum("Status");
    expect(statusEnum).toBeDefined();

    const signature = extractSignature(statusEnum!);
    expect(signature).toContain("enum Status");
    expect(signature).toContain("PENDING");
    expect(signature).toContain("SUCCESS");
  });

  it("should include JSDoc comments in interface member signatures", async () => {
    const tsConfigPath = getTsConfigPath(workspace.root, "packages/types");
    const project = getTsProject(tsConfigPath);

    const configFile = project.getSourceFiles().find(sf => sf.getFilePath().includes("index.ts"));

    const serverOptionsInterface = configFile?.getInterface("ServerOptions");
    expect(serverOptionsInterface).toBeDefined();

    const signature = extractSignature(serverOptionsInterface!);
    expect(signature).toContain("interface ServerOptions");
    // Top-level member JSDoc should be included
    expect(signature).toContain("/** The port to listen on. */");
    expect(signature).toContain("/** The host configuration. */");
    // Nested object type JSDoc should also be included
    expect(signature).toContain("/** The hostname. */");
    expect(signature).toContain("/** The protocol to use. */");
    // Multi-line JSDoc should be included
    expect(signature).toContain("Optional timeout in milliseconds.");
  });

  it("should include JSDoc comments and members in class signature", async () => {
    const tsConfigPath = getTsConfigPath(workspace.root, "packages/types");
    const project = getTsProject(tsConfigPath);

    const configFile = project.getSourceFiles().find(sf => sf.getFilePath().includes("index.ts"));

    const serverClass = configFile?.getClass("Server");
    expect(serverClass).toBeDefined();

    const signature = extractSignature(serverClass!);
    expect(signature).toContain("class Server");
    // Property JSDoc should be included
    expect(signature).toContain("/** The server name. */");
    expect(signature).toContain("/** The current status. */");
    // Method JSDoc should be included
    expect(signature).toContain("Starts the server.");
    // Member signatures should be included
    expect(signature).toContain("name: string");
    expect(signature).toContain("start(message: string): void");
    // Method body should not be included
    expect(signature).not.toContain("console.log");
  });

  it("should include JSDoc comments in type alias with object type", async () => {
    const tsConfigPath = getTsConfigPath(workspace.root, "packages/types");
    const project = getTsProject(tsConfigPath);

    const configFile = project.getSourceFiles().find(sf => sf.getFilePath().includes("index.ts"));

    const serverConfigType = configFile?.getTypeAlias("ServerConfig");
    expect(serverConfigType).toBeDefined();

    const signature = extractSignature(serverConfigType!);
    expect(signature).toContain("type ServerConfig");
    // Top-level member JSDoc should be included
    expect(signature).toContain("/** The environment name. */");
    expect(signature).toContain("/** The connection settings. */");
    // Nested object JSDoc should also be included
    expect(signature).toContain("/** The database URL. */");
  });

  it("should not include absolute file paths in nested object variable types", async () => {
    const tsConfigPath = getTsConfigPath(workspace.root, "packages/core");
    const project = getTsProject(tsConfigPath);

    const toolbarFile = project.getSourceFiles().find(sf => sf.getFilePath().includes("toolbar.ts"));

    const toolbar = toolbarFile?.getVariableDeclaration("Toolbar");
    expect(toolbar).toBeDefined();

    const signature = extractSignature(toolbar!);
    expect(signature).not.toMatch(/import\("[^"]*\/[^"]*"\)/);
    expect(signature).toContain("ToolbarMenu");
    expect(signature).toContain("CopyAction");
    expect(signature).toContain("PasteAction");
  });

  it("should not include absolute file paths in return types", async () => {
    const tsConfigPath = getTsConfigPath(workspace.root, "packages/core");
    const project = getTsProject(tsConfigPath);

    const indexFile = project.getSourceFiles().find(sf => sf.getFilePath().includes("index.ts"));

    const getDefaultConfig = indexFile?.getFunction("getDefaultConfig");
    expect(getDefaultConfig).toBeDefined();

    const signature = extractSignature(getDefaultConfig!);
    expect(signature).not.toMatch(/import\("[^"]*\/[^"]*"\)/);
    expect(signature).toContain("UserConfig");
  });

  it("should return undefined for unsupported node types", async () => {
    const tsConfigPath = getTsConfigPath(workspace.root, "packages/core");
    const project = getTsProject(tsConfigPath);

    const classesFile = project.getSourceFiles().find(sf => sf.getFilePath().includes("classes.ts"));

    const importStatement = classesFile?.getImportDeclarations()[0];
    expect(importStatement).toBeDefined();

    const signature = extractSignature(importStatement!);
    expect(signature).toBeUndefined();
  });
});
