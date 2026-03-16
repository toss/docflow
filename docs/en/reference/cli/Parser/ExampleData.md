---
sourcePath: "packages/cli/src/core/types/parser.types.ts"
---

# ExampleData

 
Represents the parsed result of @example tags in JSDoc.


## Signature

```typescript
interface ExampleData { title?: string; code: string; language?: string }
```

### Properties

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">title</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">Optional title of the example</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">code</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">Example code content</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">language</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">Programming language for syntax highlighting</p>
  </li>
</ul>
