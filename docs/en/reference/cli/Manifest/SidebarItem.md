---
sourcePath: "packages/cli/src/commands/build/manifest/manifest.ts"
---

# SidebarItem

 
Represents a sidebar navigation item for the documentation site. Can be a link or a folder containing other items.


## Signature

```typescript
interface SidebarItem { text: string; link?: string; items?: SidebarItem[]; collapsed?: boolean }
```

### Properties

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">text</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">Display text for the sidebar item</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">link</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">Optional link URL for the item</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">items</span> · <span class="post-parameters--type">SidebarItem[]</span>
    <br/>
    <p class="post-parameters--description">Optional array of sub-items for folder-type items</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">collapsed</span> · <span class="post-parameters--type">boolean</span>
    <br/>
    <p class="post-parameters--description">Whether the folder should be collapsed by default</p>
  </li>
</ul>
