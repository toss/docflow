---
sourcePath: "packages/cli/src/core/types/parser.types.ts"
---

# ExportDeclaration

Represents an exported declaration with metadata including file path, symbol name, and JSDoc information.

## Signature

```typescript
type ExportDeclaration = {
  filePath: StandardizedFilePath;
  symbolName: string;
  declaration: ExportedDeclarations;
  kind: DeclarationKind;
  jsDoc: JSDoc;
  signature: string;
};
```

### Properties

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">filePath</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">StandardizedFilePath</span>
    <br/>
    <p class="post-parameters--description">Standardized file path of the exported declaration</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">symbolName</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">Symbol name of the exported declaration</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">declaration</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">ExportedDeclarations</span>
    <br/>
    <p class="post-parameters--description">TypeScript declaration object</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">kind</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">DeclarationKind</span>
    <br/>
    <p class="post-parameters--description">Type of the declaration</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">jsDoc</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">JSDoc</span>
    <br/>
    <p class="post-parameters--description">Raw JSDoc data</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">signature</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">TypeScript signature string</p>
  </li>
</ul>
