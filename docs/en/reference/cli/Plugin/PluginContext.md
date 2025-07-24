---
sourcePath: "packages/cli/src/plugins/types/plugin.types.ts"
---

# PluginContext

 
Context information passed during plugin execution. Includes workspace path and configuration data.


## Signature

```typescript
interface PluginContext { workspacePath?: string; config?: Config }
```

### Parameters

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">workspacePath</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">Absolute path to the workspace root directory</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">config</span> · <span class="post-parameters--type">Config</span>
    <br/>
    <p class="post-parameters--description">Complete configuration object including project, command, and plugin settings</p>
  </li>
</ul>
