---
sourcePath: "packages/cli/src/core/types/parser.types.ts"
---

# ParameterData

 
Represents the parsed result of @param tags in JSDoc.


## Signature

```typescript
interface ParameterData { name: string; type: string; description: string; required: boolean; defaultValue?: string; nested?: ParameterData[] }
```

### Parameters

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">name</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">Parameter name</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">type</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">Parameter type</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">description</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">Parameter description</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">required</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">boolean</span>
    <br/>
    <p class="post-parameters--description">Whether the parameter is required</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">defaultValue</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">Default value if the parameter is optional</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">nested</span> · <span class="post-parameters--type">ParameterData[]</span>
    <br/>
    <p class="post-parameters--description">Nested parameter data for object parameters</p>
  </li>
</ul>
