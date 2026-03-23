import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { createEditorSvgMarkup, parseEditorAsset } from "./svg";
import { DEFAULT_STATE } from "../../constants/workspace";
import { documentFromAsset } from "./svg";

async function readPublicSvg(...parts: string[]) {
  const filePath = path.join(process.cwd(), "public", ...parts);
  return readFile(filePath, "utf8");
}

describe("parseEditorAsset", () => {
  it("parses a simple multi-path asset", async () => {
    const svg = await readPublicSvg("regular", "navigation", "ArrowLeft.svg");
    const asset = parseEditorAsset(svg, "/tmp/public/regular/navigation/ArrowLeft.svg");

    expect(asset.viewBox).toBe("0 0 24 24");
    expect(asset.paths).toHaveLength(1);
    expect(asset.paths[0].d).toContain("M");
    expect(asset.unsupportedElements).toEqual([]);
    expect(asset.category).toBe("navigation");
    expect(asset.name).toBe("Arrow Left");
  });

  it("normalizes circle primitives into editable paths", async () => {
    const svg = await readPublicSvg("regular", "users-auth", "UserAdd.svg");
    const asset = parseEditorAsset(svg, "/tmp/public/regular/users-auth/UserAdd.svg");

    expect(asset.paths.length).toBeGreaterThanOrEqual(1);
    expect(asset.paths.every((path) => path.d.startsWith("M"))).toBe(true);
  });

  it("preserves defs and clip-path metadata", async () => {
    const svg = await readPublicSvg("regular", "users-auth", "EyeSlash2.svg");
    const asset = parseEditorAsset(svg, "/tmp/public/regular/users-auth/EyeSlash2.svg");

    expect(asset.defs).toContain("clipPath");
    expect(asset.paths.some((path) => path.clipPath?.includes("clip0"))).toBe(true);
  });
});

describe("createEditorSvgMarkup", () => {
  it("includes defs and path geometry in exported markup", async () => {
    const svg = await readPublicSvg("regular", "users-auth", "EyeSlash2.svg");
    const asset = parseEditorAsset(svg, "/tmp/public/regular/users-auth/EyeSlash2.svg");
    const markup = createEditorSvgMarkup(documentFromAsset(asset), DEFAULT_STATE);

    expect(markup).toContain("<svg");
    expect(markup).toContain("<defs>");
    expect(markup).toContain('clipPath id="clip0_7101_62915"');
    expect(markup).toContain("<path");
  });
});
