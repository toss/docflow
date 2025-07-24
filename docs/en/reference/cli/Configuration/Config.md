---
sourcePath: "packages/cli/src/config/config.schema.ts"
---

# Config

 
Type for Docflow configuration files. Includes project settings, command settings, and plugin settings.


## Signature

```typescript
type Config = z.infer<typeof configSchema>;
```

### Parameters

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">project</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">object</span>
    <br/>
    <p class="post-parameters--description">Project configuration information</p>
    <ul class="post-parameters-ul">
  <li class="post-parameters-li ">
    <span class="post-parameters--name">root</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">Project root directory</p>
  </li>
  <li class="post-parameters-li ">
    <span class="post-parameters--name">packageManager</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">&quot;yarn&quot; | &quot;pnpm&quot; | &quot;npm&quot;</span>
    <br/>
    <p class="post-parameters--description">Package manager to use</p>
  </li>
  <li class="post-parameters-li ">
    <span class="post-parameters--name">workspace</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">object</span>
    <br/>
    <p class="post-parameters--description">Workspace configuration</p>
  </li>
  <li class="post-parameters-li ">
    <span class="post-parameters--name">workspace.include</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string[]</span>
    <br/>
    <p class="post-parameters--description">Package patterns to include in build</p>
  </li>
  <li class="post-parameters-li ">
    <span class="post-parameters--name">workspace.exclude</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string[]</span>
    <br/>
    <p class="post-parameters--description">Package patterns to exclude from build</p>
  </li>
    </ul>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">commands</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">object</span>
    <br/>
    <p class="post-parameters--description">Command settings</p>
    <ul class="post-parameters-ul">
  <li class="post-parameters-li ">
    <span class="post-parameters--name">build</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">object</span>
    <br/>
    <p class="post-parameters--description">Build command settings</p>
  </li>
  <li class="post-parameters-li ">
    <span class="post-parameters--name">check</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">object</span>
    <br/>
    <p class="post-parameters--description">Check command settings</p>
  </li>
  <li class="post-parameters-li ">
    <span class="post-parameters--name">generate</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">object</span>
    <br/>
    <p class="post-parameters--description">Generate command settings</p>
  </li>
    </ul>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">plugins</span> · <span class="post-parameters--type">object[]</span>
    <br/>
    <p class="post-parameters--description">Plugin settings</p>
    <ul class="post-parameters-ul">
  <li class="post-parameters-li ">
    <span class="post-parameters--name">name</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">Plugin name</p>
  </li>
  <li class="post-parameters-li ">
    <span class="post-parameters--name">plugin</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">function</span>
    <br/>
    <p class="post-parameters--description">Factory function that returns plugin instance</p>
  </li>
  <li class="post-parameters-li ">
    <span class="post-parameters--name">options</span> · <span class="post-parameters--type">object</span>
    <br/>
    <p class="post-parameters--description">Plugin options</p>
  </li>
    </ul>
  </li>
</ul>
