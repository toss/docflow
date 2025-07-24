import { describe, it, expect } from "vitest";
import { Manifest } from "../../../../commands/build/manifest/manifest.js";

describe("Manifest", () => {
  it("should create sidebar items with default prefix", () => {
    const manifest = new Manifest();

    manifest.add("pkg/file.md");
    manifest.add("pkg2/dir/foo.md");

    const output = JSON.parse(manifest.toString());

    expect(output).toEqual([
      {
        text: "pkg",
        collapsed: true,
        items: [
          {
            text: "file",
            link: "references/pkg/file.md",
          },
        ],
      },
      {
        text: "pkg2",
        collapsed: true,
        items: [
          {
            text: "dir",
            collapsed: true,
            items: [
              {
                text: "foo",
                link: "references/pkg2/dir/foo.md",
              },
            ],
          },
        ],
      },
    ]);
  });

  it("should respect custom prefix", async () => {
    const manifest = new Manifest({ prefix: "/docs" });
    manifest.add("pkg/file.md");

    const output = JSON.parse(manifest.toString());

    expect(output).toEqual([
      {
        text: "pkg",
        collapsed: true,
        items: [
          {
            text: "file",
            link: "/docs/pkg/file.md",
          },
        ],
      },
    ]);
  });

  it("should handle files at root level", async () => {
    const manifest = new Manifest();
    manifest.add("readme.md");
    manifest.add("guide.md");

    const output = JSON.parse(manifest.toString());

    expect(output).toEqual([
      {
        text: "guide",
        link: "references/guide.md",
      },
      {
        text: "readme",
        link: "references/readme.md",
      },
    ]);
  });

  it("isEmpty should reflect items state", () => {
    const manifest = new Manifest();
    expect(manifest.isEmpty()).toBe(true);

    manifest.add("pkg/file.md");
    expect(manifest.isEmpty()).toBe(false);
  });

  it("should sort items alphabetically", async () => {
    const manifest = new Manifest();
    manifest.add("zebra/file.md");
    manifest.add("alpha/file.md");
    manifest.add("beta/file.md");

    const output = JSON.parse(manifest.toString());
    const topLevelTexts = output.map((item) => item.text);

    expect(topLevelTexts).toEqual(["alpha", "beta", "zebra"]);
  });

  it("should handle complex nested structures", async () => {
    const manifest = new Manifest();
    manifest.add("core/utils/string.md");
    manifest.add("core/utils/array.md");
    manifest.add("core/index.md");
    manifest.add("core/types/base.md");

    const output = JSON.parse(manifest.toString());

    expect(output).toEqual([
      {
        text: "core",
        collapsed: true,
        items: [
          {
            text: "index",
            link: "references/core/index.md",
          },
          {
            text: "types",
            collapsed: true,
            items: [
              {
                text: "base",
                link: "references/core/types/base.md",
              },
            ],
          },
          {
            text: "utils",
            collapsed: true,
            items: [
              {
                text: "array",
                link: "references/core/utils/array.md",
              },
              {
                text: "string",
                link: "references/core/utils/string.md",
              },
            ],
          },
        ],
      },
    ]);
  });

  it("should remove .md extension from text", () => {
    const manifest = new Manifest();
    manifest.add("getting-started.md");

    const output = JSON.parse(manifest.toString());

    expect(output[0].text).toBe("getting-started");
    expect(output[0].link).toBe("references/getting-started.md");
  });

  it("should handle deeply nested and mixed folder structures", () => {
    const manifest = new Manifest();
    manifest.add("foo/bar/baz.md");
    manifest.add("foo/bar/qux.md");
    manifest.add("foo/alpha.md");
    manifest.add("foo/bar2/beta.md");
    manifest.add("zoo.md");

    const output = JSON.parse(manifest.toString());
    expect(output).toEqual([
      {
        text: "foo",
        collapsed: true,
        items: [
          {
            text: "alpha",
            link: "references/foo/alpha.md",
          },
          {
            text: "bar",
            collapsed: true,
            items: [
              {
                text: "baz",
                link: "references/foo/bar/baz.md",
              },
              {
                text: "qux",
                link: "references/foo/bar/qux.md",
              },
            ],
          },
          {
            text: "bar2",
            collapsed: true,
            items: [
              {
                text: "beta",
                link: "references/foo/bar2/beta.md",
              },
            ],
          },
        ],
      },
      {
        text: "zoo",
        link: "references/zoo.md",
      },
    ]);
  });
});
