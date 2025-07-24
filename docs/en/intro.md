# Introduction to Docflow

Docflow is a [JSDoc](https://jsdoc.app/)-based library documentation automation tool.

Docflow converts code comments into documentation. JSDoc comments you write in your code are directly converted into official documentation sites. What you see as comments in your IDE becomes polished API documentation for your users. We support eliminating the need to write and maintain separate documentation.

Docflow leverages TypeScript's type system to generate accurate documentation. It automatically extracts function parameter types, return values, and even generics to reflect them in the documentation.

Additionally, it provides AI-powered automatic documentation generation features. By adding the `@generate` tag, it analyzes function signatures and automatically creates appropriate JSDoc comments. This dramatically reduces the time spent on documentation writing.

![/public/images/generate-example.png](/public/images/generate-example.gif)

## Features

The main features provided by Docflow are:

- [**Documentation Build**] (`docflow build`): Parses JSDoc with `@public` tags and automatically generates Markdown documentation. It supports VitePress by default and can output to other formats through plugins.
- **Documentation Validation** (`docflow check`): Checks if all public APIs have `@public` tags and JSDoc comments. You can verify that no APIs have been missed in documentation.
- **Auto Generation** (`docflow generate`): AI automatically generates JSDoc comments for functions with `@generate` tags. It analyzes function signatures to create parameter descriptions, return values, and even example code.
- [**Plugin System**](/en/plugins): A plugin system that supports various output formats and features. Generate documentation in formats like Nextra, Docusaurus, and more beyond VitePress.
