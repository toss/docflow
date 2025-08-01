---
sourcePath: "packages/cli/src/core/types/generator.types.ts"
---

# MarkdownGenerator

 
JSDoc 데이터를 Markdown 문서로 변환하는 Markdown 생성기의 인터페이스에요.


## 시그니처

```typescript
interface MarkdownGenerator { generate(jsDocData: ParsedJSDoc, sourcePath?: string): MarkdownDocument; serialize(markdownDoc: MarkdownDocument): string; generateDocs(
    targetsWithJSDoc: TargetWithJSDoc,
    packagePath: string,
  ): GeneratedDoc }
```

### 속성

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">generate</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">function</span>
    <br/>
    <p class="post-parameters--description">JSDoc 데이터를 Markdown 문서 구조로 변환하는 함수</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">serialize</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">function</span>
    <br/>
    <p class="post-parameters--description">Markdown 문서를 문자열로 변환하는 함수</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">generateDocs</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">function</span>
    <br/>
    <p class="post-parameters--description">대상들로부터 문서 파일을 생성하는 함수</p>
  </li>
</ul>
