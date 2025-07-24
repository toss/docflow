---
sourcePath: "packages/cli/src/core/types/generator.types.ts"
---

# GeneratedDoc

Document generation result containing file path, content, and relative path information.

## Signature

```typescript
interface GeneratedDoc {
  filePath: StandardizedFilePath;
  content: string;
  relativePath: string;
}
```

### Parameters

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">filePath</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">StandardizedFilePath</span>
    <br/>
    <p class="post-parameters--description">Absolute file path where the document will be saved</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">content</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">Generated Markdown content</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">relativePath</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">Relative path from the output directory</p>
  </li>
</ul>
