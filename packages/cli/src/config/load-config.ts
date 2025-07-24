import { loadConfig as loadConfigUnconfig } from "unconfig";
import { configSchema } from "./config.schema.js";
import { MODULE_NAME } from "../const/config.const.js";

export async function loadConfig(rootPath: string) {
  const { config } = await loadConfigUnconfig({
    cwd: rootPath,
    sources: [
      {
        files: `${MODULE_NAME}.config`,
        extensions: ["ts", "mts", "cts", "js", "mjs", "cjs", "json"],
      },
      {
        files: `.${MODULE_NAME}rc`,
        extensions: ["yaml", "yml"],
      },
      {
        files: "package.json",
        extensions: [],
        rewrite: (pkg: any) => pkg?.[MODULE_NAME],
      },
    ],
  });

  if (config == null) {
    throw new Error(
      `No config file found for ${MODULE_NAME}. Please create a config file.\n 
        - ${MODULE_NAME}.config.ts / .js / .json
        - .${MODULE_NAME}rc.yaml / .yml
        - package.json > ${MODULE_NAME}
        `
    );
  }

  const result = configSchema.safeParse(config);

  if (!result.success) {
    throw new Error(
      `Invalid config file: ${JSON.stringify(result.error.format(), null, 2)}`
    );
  }

  return result.data;
}
