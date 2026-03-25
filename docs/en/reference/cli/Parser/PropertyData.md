---
sourcePath: "packages/cli/src/core/types/parser.types.ts"
---

# PropertyData

 
Represents property information of an object type. Used to describe object properties in ReturnData and TypedefData.


## Signature

```typescript
interface PropertyData {
  name: string;
  type?: string;
  description: string;
  required: boolean;
  defaultValue?: string;
  nested?: PropertyData[];
}
```

### Properties

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">name</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">Name of the property</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">type</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">Type of the property</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">description</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">Description of the property</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">required</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">boolean</span>
    <br/>
    <p class="post-parameters--description">Whether the property is required</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">defaultValue</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">Default value if the property is optional</p>
  </li>
</ul>
