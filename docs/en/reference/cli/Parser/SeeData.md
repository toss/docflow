---
sourcePath: "packages/cli/src/core/types/parser.types.ts"
---

# SeeData

 
Represents the parsed result of @see tags in JSDoc. Used to provide references to external documents or related content.


## Signature

```typescript
interface SeeData { reference: string; description?: string }
```

### Parameters

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">reference</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">URL or link to the external document to reference</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">description</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">Optional description for the reference</p>
  </li>
</ul>
