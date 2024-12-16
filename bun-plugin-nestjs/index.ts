import type { BunPlugin } from "bun";
import debug_ from "debug";

const debug = debug_("bun-plugin-nest:debug");
const info = debug_("bun-plugin-nest:info");

function isDependencyInstalled(name: string, resolveDir: string) {
  try {
    Bun.resolveSync(name, resolveDir);
    return true;
  } catch (e) {
    return false;
  }
}

export const NestPlugin: BunPlugin = {
  name: "bun-plugin-nest",
  setup(build) {
    build.onStart(() => {
      info("Dynamically setting NestJS externals");
    });

    build.onResolve({ filter: /.*/, namespace: "file" }, (args) => {
      if (
        args.importer.includes("@nestjs/") &&
        !isDependencyInstalled(
          args.path,
          // @ts-ignore type missing in @types/bun ...
          args.resolveDir as string
        )
      ) {
        debug("Add external:", args.path, args.importer);
        return {
          external: true,
          path: args.path,
        };
      } else if (
        args.importer.includes("@nestjs/") &&
        !args.path.startsWith(".")
      ) {
        // info("Resolve:", args.path, args.importer);
      }
    });
  },
};
