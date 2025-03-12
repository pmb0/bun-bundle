import { NestPlugin } from "bun-plugin-optional-deps";
const out = await Bun.build({
  entrypoints: ["./src/main.ts"],
  sourcemap: "inline",
  target: "node",
  packages: "bundle",
  format: "esm",
  outdir: "/tmp/test",
  plugins: [NestPlugin],
});
console.log("Build done", out);
