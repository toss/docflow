---
sourcePath: "packages/cli/src/core/types/parser.types.ts"
---

# TypedefData

 
Represents the parsed result of @typedef tags in JSDoc. Used to define custom types or complex object structures.


## Signature

```typescript
interface TypedefData { name: string; type: string; description: string; properties: PropertyData[] }
```

### Parameters

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">name</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">Name of the type</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">type</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">Base type of the type (e.g., Object, Array, etc.)</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">description</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">Description of the type</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">properties</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">PropertyData[]</span>
    <br/>
    <p class="post-parameters--description">Array of property information if the type is an object</p>
  </li>
</ul>
