---
sourcePath: "packages/cli/src/core/types/parser.types.ts"
---

# TargetWithJSDoc

Parsed JSDoc data for document generation, extending the [ExportDeclaration](/en/reference/cli/Parser/ExportDeclaration) interface.

## Signature

```typescript
interface TargetWithJSDoc extends ExportDeclaration {
  parsedJSDoc: ParsedJSDoc;
}
```

### Parameters

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">parsedJSDoc</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">ParsedJSDoc</span>
    <br/>
    <p class="post-parameters--description">Parsed result of JSDoc templates used in Docflow</p>
  </li>
</ul>
