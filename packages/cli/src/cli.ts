import { Cli } from "clipanion";
import { BuildCommand } from "./commands/build/index.js";
import { CheckCommand } from "./commands/check/index.js";
import { GenerateCommand } from "./commands/generate/index.js";

const cli = new Cli({
  binaryName: "docflow/cli",
  binaryVersion: "0.0.0",
});

cli.register(BuildCommand);
cli.register(CheckCommand);
cli.register(GenerateCommand);

cli.runExit(process.argv.slice(2));
