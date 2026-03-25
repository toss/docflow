---
sourcePath: "packages/cli/src/core/types/parser.types.ts"
---

# VersionData

 
JSDoc의 @version 태그 파싱 결과를 나타내요. 버전 정보를 테이블 형식으로 표시하는 데 사용돼요.


## 시그니처

```typescript
interface VersionData {
  version: string;
  description: string;
  platforms?: string[];
}
```

### 속성

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">version</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">버전 번호</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">description</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">해당 버전의 변경 사항 설명</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">platforms</span> · <span class="post-parameters--type">string[]</span>
    <br/>
    <p class="post-parameters--description">지원하는 플랫폼 목록 (선택)</p>
  </li>
</ul>
