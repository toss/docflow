import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { loadConfig } from "../../config/load-config.js";
import {
  createE2EWorkspace,
  E2EWorkspace,
} from "../utils/create-e2e-workspace.js";

describe("loadConfig", () => {
  let workspace: E2EWorkspace;

  beforeEach(async () => {
    workspace = await createE2EWorkspace();
  });

  afterEach(async () => {
    await workspace.cleanup();
  });

  it("should return config object when config file exists", async () => {
    const result = await loadConfig(workspace.root);
    expect(result).toHaveProperty("project");
    expect(result).toHaveProperty("commands");
    expect(result).toHaveProperty("plugins");
  });

  it("should throw error when config file is invalid", async () => {
    await workspace.write("docflow.config.js", "export default {}");

    await expect(loadConfig(workspace.root)).rejects.toThrow(
      /Invalid config file/
    );
  });
});
