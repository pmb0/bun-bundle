import { NestPlugin } from "@pmb0/bun-plugin-nestjs";

const out = await Bun.build({
  entrypoints: ["./src/main.ts"],
  sourcemap: "external",
  target: "node",
  packages: "bundle",
  format: "esm",
  outdir: "/tmp/test",
  plugins: [NestPlugin],
});

console.log("Build done", out.success ? "Done" : out);
