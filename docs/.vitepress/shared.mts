import { createRequire } from "module";
import path from "path";
import { defineConfig } from "vitepress";
import { search as koSearch } from "./ko.mts";

const require = createRequire(import.meta.url);

const title = "Docflow";

export const shared = defineConfig({
  title,

  lastUpdated: true,
  metaChunk: true,
  ignoreDeadLinks: false,
  outDir: "./dist",

  head: [
    [
      "link",
      {
        rel: "icon",
        type: "image/png",
        sizes: "100x100",
        href: "/favicon-100x100.png",
      },
    ],
    [
      "link",
      {
        rel: "stylesheet",
        href: "https://static.toss.im/tps/main.css",
      },
    ],
    [
      "link",
      {
        rel: "stylesheet",
        href: "https://static.toss.im/tps/others.css",
      },
    ],
    [
      "script",
      {},
      `window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };`,
    ],
    [
      "script",
      {
        src: "/_vercel/insights/script.js",
        defer: "true",
      },
    ],
    [
      "meta",
      {
        property: "og:image",
        content: "/og.png",
      },
    ],
  ],

  themeConfig: {
    logo: {
      dark: "/logo.png",
      light: "/logo.png",
    },
    siteTitle: title,

    search: {
      provider: "local",
      options: {
        locales: {
          ...koSearch,
        },
      },
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/toss/docflow" },
      {
        icon: "npm",
        link: "https://www.npmjs.com/package/docflow",
        ariaLabel: "npm",
      },

      { icon: "discord", link: "https://discord.gg/vGXbVjP2nY" },
    ],
  },

  vite: {
    resolve: {
      alias: {
        vue: path.dirname(
          require.resolve("vue/package.json", {
            paths: [require.resolve("vitepress")],
          })
        ),
        "vue/server-renderer": path.dirname(
          require.resolve("vue/server-renderer", {
            paths: [require.resolve("vitepress")],
          })
        ),
      },
    },
  },
});
