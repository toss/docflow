---
sourcePath: "packages/cli/src/core/types/generator.types.ts"
---

# MarkdownGenerator

 
Interface for Markdown generators that convert JSDoc data to Markdown documents.


## Signature

```typescript
interface MarkdownGenerator { generate(jsDocData: ParsedJSDoc, sourcePath?: string): MarkdownDocument; serialize(markdownDoc: MarkdownDocument): string; generateDocs(
    targetsWithJSDoc: TargetWithJSDoc,
    packagePath: string,
  ): GeneratedDoc }
```

### Properties

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">generate</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">function</span>
    <br/>
    <p class="post-parameters--description">Function to convert JSDoc data to Markdown document structure</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">serialize</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">function</span>
    <br/>
    <p class="post-parameters--description">Function to convert Markdown document to string</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">generateDocs</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">function</span>
    <br/>
    <p class="post-parameters--description">Function to generate document files from targets</p>
  </li>
</ul>
