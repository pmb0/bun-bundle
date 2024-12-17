import type { BunPlugin } from "bun";

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
      console.log("Dynamically setting NestJS externals");
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
        console.log("Add external:", args.path, args.importer);
        return {
          external: true,
          path: args.path,
        };
      } else if (
        args.importer.includes("@nestjs/") &&
        !args.path.startsWith(".")
      ) {
        // console.log("Resolve:", args.path, args.importer);
      }
    });
  },
};
