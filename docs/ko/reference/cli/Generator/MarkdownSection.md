---
sourcePath: "packages/cli/src/core/types/generator.types.ts"
---

# MarkdownSection

 
마크다운 문서의 섹션을 나타내는 인터페이스예요.


## 시그니처

```typescript
interface MarkdownSection {
  type: MarkdownSectionType;
  content: string;
}
```

### 속성

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">type</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">마크다운 섹션의 타입 (title, description, signature 등)</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">content</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">마크다운 형식의 섹션 내용</p>
  </li>
</ul>
