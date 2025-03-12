import { $, type BuildArtifact } from "bun";

function debug(...args: any[]) {
  if (process.env.BUNDLE_DEBUG) console.log(...args);
}

export async function compileApp(artifacts: BuildArtifact[], outfile: string) {
  debug(`Compiling ${artifacts[0].path} to ${outfile} ...`);

  await $`
    bun build \
      --compile \
      ${artifacts[0].path} \
      --minify-whitespace \
      --sourcemap \
      --minify-syntax \
      --outfile ${outfile}
    `.quiet();

  console.log(`✅ Successfully created ${outfile}`);

  debug("Removing ", artifacts.map(({ path }) => path).join(" "));
  await Promise.all(artifacts.map(async ({ path }) => Bun.file(path).delete()));
}
