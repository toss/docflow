---
sourcePath: "packages/cli/src/core/types/generator.types.ts"
---

# MarkdownDocument

 
선택적 프론트매터와 섹션을 포함한 완전한 Markdown 문서를 나타내는 구조에요.


## 시그니처

```typescript
interface MarkdownDocument { frontmatter?: Record<string, unknown>; sections: MarkdownSection[] }
```

### 매개변수

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">frontmatter</span> · <span class="post-parameters--type">object</span>
    <br/>
    <p class="post-parameters--description">문서의 선택적 프론트매터 데이터</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">sections</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">MarkdownSection[]</span>
    <br/>
    <p class="post-parameters--description">문서 내용을 구성하는 섹션들의 배열</p>
  </li>
</ul>
