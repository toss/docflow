---
sourcePath: "packages/cli/src/core/types/parser.types.ts"
---

# ThrowsData

 
JSDoc에서 @throws 태그를 파싱한 결과를 나타내요. 함수에서 발생할 수 있는 예외 정보를 설명할 때 사용돼요.


## 시그니처

```typescript
interface ThrowsData { type: string; name?: string; description: string }
```

### 매개변수

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">type</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">예외의 타입</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">name</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">예외의 선택적 이름</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">description</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">예외 발생 조건 및 설명</p>
  </li>
</ul>
