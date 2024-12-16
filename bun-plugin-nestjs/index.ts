import type { BunPlugin } from "bun";

function isDependencyInstalled(name: string, resolveDir: string) {
  try {
    Bun.resolveSync(
      name,
      // "/Users/pmb/work/bun-plugin-nestjs/bun-plugin-nestjs"
      resolveDir
    );
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
        // && args.path.includes("microservices")
        !isDependencyInstalled(
          args.path,
          args.resolveDir as string
          // args.importer
        )
      ) {
        console.log("!!!!!!!!! external:", args.path, args.importer);
        return {
          external: true,
          path: args.path,
        };
      }
    });
  },
};
