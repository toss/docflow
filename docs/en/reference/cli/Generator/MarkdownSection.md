---
sourcePath: "packages/cli/src/core/types/generator.types.ts"
---

# MarkdownSection

 
Interface representing a section of a Markdown document.


## Signature

```typescript
interface MarkdownSection { type: MarkdownSectionType; content: string }
```

### Properties

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">type</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">Type of the Markdown section (title, description, signature, etc.)</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">content</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">Section content in Markdown format</p>
  </li>
</ul>
