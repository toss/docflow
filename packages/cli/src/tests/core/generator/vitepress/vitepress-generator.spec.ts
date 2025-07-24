import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { VitePressGenerator } from "../../../../core/generator/vitepress/vitepress-generator.js";
import { createE2EWorkspace, E2EWorkspace } from "../../../utils/create-e2e-workspace.js";
import { createGeneratorConfig } from "../../../utils/generator-config.js";
import { TSProjectTestHelper } from "../../../utils/ts-project-helpers.js";

describe("VitePressGenerator", () => {
  let workspace: E2EWorkspace;

  beforeEach(async () => {
    workspace = await createE2EWorkspace();
  });

  afterEach(async () => {
    await workspace.cleanup();
  });

  it("should create VitePressGenerator instance", async () => {
    const config = createGeneratorConfig({
      projectRoot: workspace.root,
    });
    const generator = new VitePressGenerator(config);
    expect(generator).toBeInstanceOf(VitePressGenerator);
  });

  it("should generate markdown document with correct structure", async () => {
    const config = createGeneratorConfig({
      projectRoot: workspace.root,
    });
    const generator = new VitePressGenerator(config);
    const tsHelper = new TSProjectTestHelper(workspace);
    const targetWithJSDoc = await tsHelper.getExportWithJSDoc("add", "math.ts");
    const result = generator.generateDocs(targetWithJSDoc, "@test/core");

    expect(result).toHaveProperty("relativePath");
    expect(result).toHaveProperty("content");
    expect(result.relativePath).toContain("add.md");
  });

  it("should include function signature in generated content", async () => {
    const config = createGeneratorConfig({
      projectRoot: workspace.root,
    });
    const generator = new VitePressGenerator(config);
    const tsHelper = new TSProjectTestHelper(workspace);
    const targetWithJSDoc = await tsHelper.getExportWithJSDoc("add", "math.ts");
    const result = generator.generateDocs(targetWithJSDoc, "@test/core");

    expect(result.content).toContain("function add");
    expect(result.content).toContain("typescript");
  });

  it("should include description in generated content", async () => {
    const config = createGeneratorConfig({
      projectRoot: workspace.root,
    });
    const generator = new VitePressGenerator(config);
    const tsHelper = new TSProjectTestHelper(workspace);
    const targetWithJSDoc = await tsHelper.getExportWithJSDoc("add", "math.ts");
    const result = generator.generateDocs(targetWithJSDoc, "@test/core");

    expect(result.content).toContain("addition");
  });

  it("should include parameters section", async () => {
    const config = createGeneratorConfig({
      projectRoot: workspace.root,
    });
    const generator = new VitePressGenerator(config);
    const tsHelper = new TSProjectTestHelper(workspace);
    const targetWithJSDoc = await tsHelper.getExportWithJSDoc("add", "math.ts");
    const result = generator.generateDocs(targetWithJSDoc, "@test/core");

    expect(result.content).toContain("Parameters");
    expect(result.content).toContain("number");
  });

  it("should include returns section", async () => {
    const config = createGeneratorConfig({
      projectRoot: workspace.root,
    });
    const generator = new VitePressGenerator(config);
    const tsHelper = new TSProjectTestHelper(workspace);
    const targetWithJSDoc = await tsHelper.getExportWithJSDoc("add", "math.ts");
    const result = generator.generateDocs(targetWithJSDoc, "@test/core");

    expect(result.content).toContain("Returns");
    expect(result.content).toContain("number");
  });

  it("should include examples section", async () => {
    const config = createGeneratorConfig({
      projectRoot: workspace.root,
    });
    const generator = new VitePressGenerator(config);
    const tsHelper = new TSProjectTestHelper(workspace);
    const targetWithJSDoc = await tsHelper.getExportWithJSDoc("add", "math.ts");
    const result = generator.generateDocs(targetWithJSDoc, "@test/core");

    expect(result.content).toContain("Examples");
    expect(result.content).toContain("add");
  });

  it("should handle function without examples", async () => {
    const config = createGeneratorConfig({
      projectRoot: workspace.root,
    });
    const generator = new VitePressGenerator(config);
    const tsHelper = new TSProjectTestHelper(workspace);
    await workspace.write(
      "packages/core/src/test-no-examples.ts",
      `
/**
 * @public
 * @kind function
 * @category Test
 * @name testNoExamples
 * @description A function with no examples
 * @param {string} input - Test input
 * @returns {boolean} Test result
 */
export function testNoExamples(input: string): boolean {
  return input.length > 0;
}
    `
    );

    const targetWithJSDoc = await tsHelper.getExportWithJSDoc(
      "testNoExamples",
      "test-no-examples.ts"
    );
    const result = generator.generateDocs(targetWithJSDoc, "@test/core");

    expect(result.content).not.toContain("## Examples");
    expect(result.content).not.toContain("### Examples");
    expect(result.content).toContain("testNoExamples");
    expect(result.content).toContain("A function with no examples");
  });

  it("should generate correct file path for different package names", async () => {
    const config = createGeneratorConfig({
      projectRoot: workspace.root,
    });
    const generator = new VitePressGenerator(config);
    const tsHelper = new TSProjectTestHelper(workspace);
    const targetWithJSDoc = await tsHelper.getExportWithJSDoc("add", "math.ts");

    const result1 = generator.generateDocs(targetWithJSDoc, "@test/core");
    const result2 = generator.generateDocs(targetWithJSDoc, "@test/utils");

    expect(result1.relativePath).toContain("core");
    expect(result2.relativePath).toContain("utils");
  });
});
