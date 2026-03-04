import { OptionalDepsPlugin } from "bun-plugin-optional-deps";

const out = await Bun.build({
  entrypoints: ["./src/main.ts"],
  format: "esm",
  minify: {
    identifiers: false,
    syntax: true,
    whitespace: true,
  },
  outdir: "./out",
  packages: "bundle",
  compile: true,
  plugins: [OptionalDepsPlugin],
  sourcemap: "linked",
  target: "node",
});

console.log("Build done", out.success ? "Success" : out);
