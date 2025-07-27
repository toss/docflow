---
sourcePath: "packages/cli/src/core/types/generator.types.ts"
---

# MarkdownDocument

 
Structure representing a complete Markdown document with optional frontmatter and sections.


## Signature

```typescript
interface MarkdownDocument { frontmatter?: Record<string, unknown>; sections: MarkdownSection[] }
```

### Properties

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">frontmatter</span> · <span class="post-parameters--type">object</span>
    <br/>
    <p class="post-parameters--description">Optional frontmatter data for the document</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">sections</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">MarkdownSection[]</span>
    <br/>
    <p class="post-parameters--description">Array of sections that make up the document content</p>
  </li>
</ul>
