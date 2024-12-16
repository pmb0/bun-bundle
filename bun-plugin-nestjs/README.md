# @pmb0/bun-plugin-nestjs

`@pmb0/bun-plugin-nestjs` is a [Bun](https://bun.sh/) plugin designed to simplify the bundling process of NestJS applications. One key challenge is how NestJS checks for optional dependencies: It attempts to load them using require() (see [this code snippet](https://github.com/nestjs/nest/blob/master/packages/core/helpers/optional-require.ts)). If these dependencies are not installed, this approach typically leads to bundler errors.

`@pmb0/bun-plugin-nestjs` addresses this issue by marking any uninstalled dependencies as [`external`](https://bun.sh/docs/bundler#external), allowing the bundler to complete the process without failing due to missing dependencies.

Another challenge is that you can no longer rely on the Nest CLI and its associated compile-time steps. For example, compiler plugins from `@nestjs/swagger` won't run automatically. As a result, you'll need to manually add the necessary decorators to your code to ensure that metadata for Swagger and other tools is properly generated.

Other potential issues may arise depending on the specific tools or structure of your application. For instance, you might encounter difficulties with certain dynamic imports, reflection mechanisms, or loading module-related assets.

## Getting Started

Add `@pmb0/bun-plugin-nestjs` to your dependencies.

```bash
bun add @pmb0/bun-plugin-nestjs
```

Create a bun build script:

```ts
// build.ts
import { NestPlugin } from "@pmb0/bun-plugin-nestjs";

const out = await Bun.build({
  entrypoints: ["./src/main.ts"],
  format: "esm",
  minify: {
    identifiers: false,
    syntax: true,
    whitespace: true,
  },
  outdir: "/tmp/test",
  packages: "bundle",
  plugins: [NestPlugin],
  sourcemap: "linked",
  target: "node",
});

console.log("Build done", out.success ? "Success" : out);
```

Build the Nest app:

```bash
bun build.ts
```