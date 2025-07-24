---
sourcePath: "packages/cli/src/core/types/generator.types.ts"
---

# GeneratorConfig

 
Configuration for the Markdown generator. Defines generator name, project root, labels, and signature language.


## Signature

```typescript
interface GeneratorConfig { name: string; projectRoot: string; labels?: {
    parameters?: string;
    returns?: string;
    throws?: string;
    examples?: string;
    see?: string;
    version?: string;
    deprecated?: string;
    signature?: string;
    typedef?: string;
  }; signatureLanguage?: string }
```

### Parameters

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">name</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">Name of the generator (e.g., 'vitepress', 'nextra')</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">projectRoot</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">Absolute path to the project root directory</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">labels</span> · <span class="post-parameters--type">object</span>
    <br/>
    <p class="post-parameters--description">Custom labels for documentation sections</p>
    <ul class="post-parameters-ul">
  <li class="post-parameters-li ">
    <span class="post-parameters--name">parameters</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">Label for the parameters section</p>
  </li>
  <li class="post-parameters-li ">
    <span class="post-parameters--name">returns</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">Label for the returns section</p>
  </li>
  <li class="post-parameters-li ">
    <span class="post-parameters--name">throws</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">Label for the throws section</p>
  </li>
  <li class="post-parameters-li ">
    <span class="post-parameters--name">examples</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">Label for the examples section</p>
  </li>
  <li class="post-parameters-li ">
    <span class="post-parameters--name">see</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">Label for the see section</p>
  </li>
  <li class="post-parameters-li ">
    <span class="post-parameters--name">version</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">Label for the version section</p>
  </li>
  <li class="post-parameters-li ">
    <span class="post-parameters--name">deprecated</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">Label for the deprecated section</p>
  </li>
  <li class="post-parameters-li ">
    <span class="post-parameters--name">signature</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">Label for the signature section</p>
  </li>
  <li class="post-parameters-li ">
    <span class="post-parameters--name">typedef</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">Label for the typedef section</p>
  </li>
    </ul>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">signatureLanguage</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">Language for code signature highlighting (e.g., 'typescript', 'tsx')</p>
  </li>
</ul>
