---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Docflow"
  text: "Automatically generate documentation from your JSDoc"
  image:
    loading: eager
    fetchpriority: high
    decoding: async
    src: /hero.png
    alt:
  actions:
    - theme: brand
      text: About Docflow
      link: /en/intro
    - theme: alt
      text: Reference
      link: /en/reference/cli/Configuration/Config
    - theme: alt
      text: Installation
      link: /en/installation

features:
  - title: AI-Generated Documentation
    details: Docflow automatically generates JSDoc comments with AI. Save significant time on documentation tasks.
  - title: Always in Sync with Code
    details: TypeScript integration automatically reflects code signatures and types. Documentation updates alongside your code.
  - title: Flexible Documentation Formats
    details: Generate documentation flexibly to meet project needs. Support various output formats beyond VitePress through plugins.
  - title: Monorepo Support
    details: Supports Yarn, Npm, and Pnpm workspaces. Efficiently manage multiple packages in a single codebase.
---
