---
sourcePath: "packages/cli/src/core/types/parser.types.ts"
---

# ReturnData

 
JSDoc의 @returns 태그 파싱 결과를 나타내요. 함수의 반환값 정보를 설명하는 데 사용돼요.


## 시그니처

```typescript
interface ReturnData {
  type: string;
  name?: string;
  description: string;
  properties?: PropertyData[];
}
```

### 속성

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">type</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">반환값의 타입</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">name</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">반환값의 이름 (선택)</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">description</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">반환값의 설명</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">properties</span> · <span class="post-parameters--type">PropertyData[]</span>
    <br/>
    <p class="post-parameters--description">반환값이 객체일 때의 속성 정보 배열</p>
  </li>
</ul>
