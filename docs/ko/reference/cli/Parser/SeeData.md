---
sourcePath: "packages/cli/src/core/types/parser.types.ts"
---

# SeeData

 
JSDoc의 @see 태그 파싱 결과를 나타내요. 외부 문서나 관련 내용에 대한 참조를 제공하는 데 사용돼요.


## 시그니처

```typescript
interface SeeData {
  reference: string;
  description?: string;
}
```

### 속성

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">reference</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">참조할 외부 문서의 URL 또는 링크</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">description</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">참조에 대한 설명 (선택)</p>
  </li>
</ul>
