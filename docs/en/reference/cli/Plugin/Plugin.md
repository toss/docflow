---
sourcePath: "packages/cli/src/plugins/types/plugin.types.ts"
---

# Plugin

 
Interface defining the basic structure of a Docflow plugin. Includes plugin name and hook functions.


## Signature

```typescript
interface Plugin { name: string; hooks: {
    transformManifest?: (
      manifest: SidebarItem[],
      context: PluginContext,
    ) => SidebarItem[];
    provideGenerator?: () => MarkdownGenerator;
  } }
```

### Properties

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">name</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">Unique identifier for the plugin</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">hooks</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">object</span>
    <br/>
    <p class="post-parameters--description">Object containing hook functions that the plugin can implement</p>
    <ul class="post-parameters-ul">
  <li class="post-parameters-li ">
    <span class="post-parameters--name">transformManifest</span> · <span class="post-parameters--type">function</span>
    <br/>
    <p class="post-parameters--description">Hook to transform generated manifest data</p>
  </li>
  <li class="post-parameters-li ">
    <span class="post-parameters--name">provideGenerator</span> · <span class="post-parameters--type">function</span>
    <br/>
    <p class="post-parameters--description">Hook to provide a custom Markdown generator</p>
  </li>
    </ul>
  </li>
</ul>
