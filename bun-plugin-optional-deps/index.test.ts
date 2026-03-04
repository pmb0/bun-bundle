import { describe, expect, test } from "bun:test";
import { join } from "path";
import { normalizePackageName } from "./index.js";

describe("normalizePackageName", () => {
  test("unscoped package without subpath", () => {
    expect(normalizePackageName("lodash")).toBe("lodash");
  });

  test("unscoped package with subpath", () => {
    expect(normalizePackageName("lodash/pick")).toBe("lodash");
  });

  test("unscoped package with deep subpath", () => {
    expect(normalizePackageName("lodash/fp/pick")).toBe("lodash");
  });

  test("scoped package without subpath", () => {
    expect(normalizePackageName("@nestjs/common")).toBe("@nestjs/common");
  });

  test("scoped package with subpath", () => {
    expect(normalizePackageName("@nestjs/common/decorators")).toBe(
      "@nestjs/common",
    );
  });

  test("scoped package with deep subpath", () => {
    expect(
      normalizePackageName("@nestjs/sequelize/dist/common/sequelize.utils"),
    ).toBe("@nestjs/sequelize");
  });

  test("scope-only (edge case)", () => {
    expect(normalizePackageName("@nestjs")).toBe("@nestjs");
  });
});

describe("OptionalDepsPlugin integration (app1)", () => {
  const app1Dir = join(import.meta.dir, "../examples/app1");

  test("build succeeds and output is valid", async () => {
    const proc = Bun.spawn(["bun", "build.ts"], {
      cwd: app1Dir,
      stdout: "pipe",
      stderr: "pipe",
    });

    const exitCode = await proc.exited;
    const stdout = await new Response(proc.stdout).text();
    const stderr = await new Response(proc.stderr).text();

    expect(exitCode).toBe(0);
    expect(stdout).toContain("Build done Success");

    // Verify the bundled JS output exists and contains expected content
    const outFile = Bun.file(join(app1Dir, "out/main.js"));
    expect(await outFile.exists()).toBe(true);

    const code = await outFile.text();

    // ServerRuntimeClient must be defined (not tree-shaken by barrel optimization)
    expect(code).toContain("ServerRuntimeClient");

    // Uninstalled optional deps should be external imports in the output
    expect(code).toContain("@nestjs/microservices");
    expect(code).toContain("@nestjs/websockets/socket-module");
  }, 30_000);
});
