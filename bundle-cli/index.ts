import { program, Option } from "commander";
import { buildApp } from "./build";
import { name, version } from "./package.json" with { type: "json" };
import { compileApp } from "./compile";
import { basename, join } from "path";

const validTargets = [
  "bun-linux-x64",
  "bun-linux-arm64",
  "bun-windows-x64",
  "bun-windows-arm64",
  "bun-darwin-x64",
  "bun-darwin-arm64",
  "bun-linux-x64-musl",
  "bun-linux-arm64-musl",
];

const currentTarget =
  process.platform === "win32"
    ? "bun-windows-x64"
    : `bun-${process.platform}-${process.arch}`;

program
  .name(name)
  .version(version)
  .description("Bundle Node.js application")
  .argument("[entrypoint]", "entrypoint file", "./src/main.ts")
  .option(
    "-c, --compile",
    "Generate a standalone Bun executable containing your bundled code",
    false
  )
  .addOption(
    new Option("-t, --target <target>", "Target platform")
      .choices(validTargets)
      .default(currentTarget, "current platform")
  )
  .option("-o, --outdir <outdir>", "Output file", "./build")
  .option("--conditions <conditions>", "Build conditions")
  .action(async (entrypoint, options) => {
    if (!(await Bun.file(entrypoint).exists())) {
      program.error("Entrypoint file does not exist", entrypoint);
    }

    console.log(`Create optimized app bundle for ${entrypoint} ...`);
    const { success, outputs, logs } = await buildApp(
      entrypoint,
      options.outdir,
      options.conditions
    );

    if (!success) {
      console.log(logs);
      program.error("Build failed");
    }

    if (options.compile) {
      await compileApp(
        outputs,
        join(options.outdir, basename(entrypoint, ".ts"))
      );
    } else {
      console.log(
        `✅ Successfully created ${outputs.map(({ path }) => path).join(", ")}`
      );
    }
  });

program.parse();
