import type { BunPlugin } from "bun";
import path from "path";
import fs from "fs";
import { createRequire } from "module";

function log(...args: any[]) {
  if (process.env.BUN_BUNDLE_DEBUG) {
    console.log(...args);
  }
}

function isDependencyInstalled(name: string, resolveDir: string) {
  try {
    Bun.resolveSync(name, resolveDir);
    return true;
  } catch (e) {
    return false;
  }
}

function findNearestPackageJsonDir(startDir: string) {
  let currentDir = startDir;

  while (true) {
    const candidate = path.join(currentDir, "package.json");
    if (fs.existsSync(candidate)) {
      return currentDir;
    }

    const parentDir = path.dirname(currentDir);

    if (parentDir === currentDir) {
      return undefined;
    }

    currentDir = parentDir;
  }
}

export function isDepOptional(depName: string, resolveDir: string) {
  const startDir = path.dirname(resolveDir);

  const packageJsonDir = findNearestPackageJsonDir(startDir);

  if (!packageJsonDir) {
    return false;
  }

  const packageJsonPath = path.join(packageJsonDir, "package.json");
  const rawData = fs.readFileSync(packageJsonPath, "utf8");
  const pkg = JSON.parse(rawData);

  return pkg.peerDependenciesMeta?.[normalizePackageName(depName)]?.optional;
}

export function normalizePackageName(specifier: string): string {
  if (specifier.startsWith("@")) {
    const firstSlash = specifier.indexOf("/");
    if (firstSlash === -1) {
      return specifier;
    }

    const secondSlash = specifier.indexOf("/", firstSlash + 1);
    if (secondSlash === -1) {
      return specifier;
    }
    return specifier.slice(0, secondSlash);
  } else {
    const slashIndex = specifier.indexOf("/");
    if (slashIndex === -1) {
      return specifier;
    }
    return specifier.slice(0, slashIndex);
  }
}

export const OptionalDepsPlugin: BunPlugin = {
  name: "bun-plugin-optional-deps",
  setup(build) {
    build.onStart(() => {
      log("Dynamically setting optional-require externals");
    });

    build.onResolve({ filter: /.*/, namespace: "file" }, async (args) => {
      const isInstalled = isDependencyInstalled(args.path, args.resolveDir);

      if (isInstalled) {
        return;
      }

      if (
        !args.path.startsWith(".") ||
        isDepOptional(args.path, args.resolveDir)
      ) {
        log("Add external:", args.path, args.importer);
        return {
          external: true,
          path: args.path,
        };
      }
    });
  },
};
