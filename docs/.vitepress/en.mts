import { type DefaultTheme, defineConfig } from "vitepress";
import { sortByText } from "./libs/sortByText.mts";
import enReferenceManifest from "../en/reference/manifest.json";
import { offCollapsed } from "./libs/offCollapsed.mts";

export const en = defineConfig({
  lang: "en",
  description: "Automatically generate documentation from your JSDoc.",

  themeConfig: {
    nav: nav(),
    sidebar: sidebar(),

    editLink: {
      pattern: "https://github.com/toss/docflow/edit/main/docs/:path",
      text: "Edit this page on GitHub",
    },

    footer: {
      message: "Released under the MIT License.",
      copyright: `Copyright © ${new Date().getFullYear()} Viva Republica, Inc.`,
    },

    outline: {
      label: "On this page",
      level: "deep",
    },

    docFooter: {
      prev: "Previous Page",
      next: "Next Page",
    },
  },
});

function nav(): DefaultTheme.NavItem[] {
  return [
    { text: "Home", link: "/en" },
    { text: "Introduction", link: "/en/intro" },
    { text: "Reference", link: "/en/reference/cli/Configuration/Config" },
  ];
}

function sidebar(): DefaultTheme.Sidebar {
  return [
    {
      text: "Guide",
      items: [
        { text: "Introduction", link: "/en/intro" },
        { text: "Core Concepts", link: "/en/core-concept" },
        {
          text: "Installation",
          link: "/en/installation",
        },
        { text: "Project Configuration", link: "/en/config" },
        { text: "Tutorial", link: "/en/tutorial" },
      ],
    },
    {
      text: "Commands",
      items: [
        { text: "build", link: "/en/command/build" },
        { text: "check", link: "/en/command/check" },
        { text: "generate", link: "/en/command/generate" },
      ],
    },
    {
      text: "Advanced",
      items: [{ text: "Plugins", link: "/en/plugins" }],
    },
    {
      text: "API Reference",
      items: sortByText(offCollapsed(enReferenceManifest)),
    },
  ];
}
