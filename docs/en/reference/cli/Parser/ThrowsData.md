---
sourcePath: "packages/cli/src/core/types/parser.types.ts"
---

# ThrowsData

 
Represents the parsed result of @throws tags in JSDoc. Used to describe exception information that can occur in functions.


## Signature

```typescript
interface ThrowsData { type: string; name?: string; description: string }
```

### Properties

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">type</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">Type of the exception</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">name</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">Optional name of the exception</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">description</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">Exception occurrence conditions and description</p>
  </li>
</ul>
