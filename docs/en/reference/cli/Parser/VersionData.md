---
sourcePath: "packages/cli/src/core/types/parser.types.ts"
---

# VersionData

 
Represents the parsed result of @version tags in JSDoc. Used to display version information in table format.


## Signature

```typescript
interface VersionData { version: string; description: string; platforms?: string[] }
```

### Parameters

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">version</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">Version number</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">description</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">Description of changes in the version</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">platforms</span> · <span class="post-parameters--type">string[]</span>
    <br/>
    <p class="post-parameters--description">List of supported platforms (optional)</p>
  </li>
</ul>
