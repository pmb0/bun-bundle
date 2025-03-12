import { OptionalDepsPlugin } from "bun-plugin-optional-deps";

export function buildApp(
  entrypoint: string,
  outdir: string,
  conditions: string
) {
  return Bun.build({
    entrypoints: [entrypoint],
    conditions,
    format: "esm",
    minify: {
      identifiers: false,
      syntax: true,
      whitespace: true,
    },
    outdir,
    packages: "bundle",
    plugins: [OptionalDepsPlugin],
    sourcemap: "linked",
    target: "node",
  });
}
