---
sourcePath: "packages/cli/src/core/types/parser.types.ts"
---

# ParsedJSDoc

 
Represents the parsed result of JSDoc templates used in Docflow.


## Signature

```typescript
interface ParsedJSDoc { name?: string; description?: string; category?: string; kind?: string; signature?: string; deprecated?: string; examples?: ExampleData[]; parameters?: ParameterData[]; returns?: ReturnData; throws?: ThrowsData[]; typedef?: TypedefData[]; see?: SeeData[]; version?: VersionData[] }
```

### Parameters

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">name</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">Name of the documented element</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">description</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">Description of the element</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">category</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">Category classification of the element</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">kind</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">Type of declaration (function, class, interface, etc.)</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">signature</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">TypeScript signature of the element</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">deprecated</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">Deprecation notice (if applicable)</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">examples</span> · <span class="post-parameters--type">ExampleData[]</span>
    <br/>
    <p class="post-parameters--description">Array of example code</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">parameters</span> · <span class="post-parameters--type">ParameterData[]</span>
    <br/>
    <p class="post-parameters--description">Array of parameter information</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">returns</span> · <span class="post-parameters--type">ReturnData</span>
    <br/>
    <p class="post-parameters--description">Return value information</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">throws</span> · <span class="post-parameters--type">ThrowsData[]</span>
    <br/>
    <p class="post-parameters--description">Array of exception information</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">typedef</span> · <span class="post-parameters--type">TypedefData[]</span>
    <br/>
    <p class="post-parameters--description">Array of type definitions</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">see</span> · <span class="post-parameters--type">SeeData[]</span>
    <br/>
    <p class="post-parameters--description">Array of references to related documentation</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">version</span> · <span class="post-parameters--type">VersionData[]</span>
    <br/>
    <p class="post-parameters--description">Array of version information</p>
  </li>
</ul>
