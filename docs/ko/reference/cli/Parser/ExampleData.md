---
sourcePath: "packages/cli/src/core/types/parser.types.ts"
---

# ExampleData

 
JSDoc의 @example 태그 파싱 결과를 나타내요.


## 시그니처

```typescript
interface ExampleData {
  title?: string;
  code: string;
  language?: string;
}
```

### 속성

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">title</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">예제의 제목 (선택)</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">code</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">예제 코드 내용</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">language</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">구문 강조에 사용할 프로그래밍 언어</p>
  </li>
</ul>
