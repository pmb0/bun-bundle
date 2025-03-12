# bun-plugin-optional-deps

`bun-plugin-optional-deps` is a [Bun](https://bun.sh/) plugin that simplifies bundling Node.js applications by handling optional dependencies. In many projects—NestJS among them—some libraries or frameworks try to `require()` dependencies that might not be installed, causing bundler errors. This plugin automatically marks any uninstalled *optional* dependencies as [`external`](https://bun.sh/docs/bundler#external), allowing the bundling process to succeed without failing over missing packages.

This plugin evolved from a NestJS-specific solution ([@pmb0/bun-plugin-nestjs](https://www.npmjs.com/package/@pmb0/bun-plugin-nestjs)) and now applies to any scenario where optional dependencies can break a Bun build.

## Why Use This Plugin?

- **Avoid Build Errors**: Some libraries do “soft” or “optional” requires. If those dependencies aren’t installed, Bun (or most bundlers) will throw an error. This plugin prevents that error by marking them as external.
- **Generic Solution**: Works for any Node.js project that needs to handle optional dependencies, not just NestJS.
- **Easy to Configure**: Integrates directly into your Bun build script with minimal setup.

## Installation

```sh
bun add --dev bun-plugin-optional-deps
```

## Usage

```ts
// build.ts
import { OptionalDepsPlugin } from "bun-plugin-optional-deps";

const out = await Bun.build({
  entrypoints: ["./src/main.ts"],
  format: "esm",
  minify: {
    identifiers: false,
    syntax: true,
    whitespace: true,
  },
  outdir: "./dist",
  packages: "bundle",
  plugins: [OptionalDepsPlugin],
  sourcemap: "linked",
  target: "node",
});

console.log("Build done", out.success ? "Success" : out);
```

Run the build:

```sh
bun build.ts
```

## Considerations

1. **Optional Dependencies**  
   By marking uninstalled dependencies as external, the application will skip bundling them. If your code actually needs one of those dependencies at runtime, you’ll still need to have it installed.
2. **NestJS (Optional Example)**  
   Originally developed for NestJS applications, this plugin eliminates errors caused by Nest’s `require()` checks for optional libraries. If you’re using NestJS-specific features such as `@nestjs/swagger` compiler plugins, you may still need to manually apply decorators or other code-generation steps that would normally happen at compile time via the Nest CLI.
3. **Dynamic Imports and Reflection**  
   If your code (or libraries) rely heavily on dynamic imports or reflection, you might need additional configurations or manual workarounds. This plugin’s main focus is handling optional dependencies, not altering module resolution logic beyond marking missing deps as external.

## License

MIT
