---
sourcePath: "packages/cli/src/core/types/parser.types.ts"
---

# TypedefData

 
JSDoc에서 @typedef 태그를 파싱한 결과를 나타내요. 사용자 정의 타입이나 복잡한 객체 구조를 정의할 때 사용돼요.


## 시그니처

```typescript
interface TypedefData { name: string; type: string; description: string; properties: PropertyData[] }
```

### 속성

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">name</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">타입의 이름</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">type</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">타입의 기본 타입 (예: Object, Array 등)</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">description</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">타입의 설명</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">properties</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">PropertyData[]</span>
    <br/>
    <p class="post-parameters--description">타입이 객체인 경우의 속성 정보 배열</p>
  </li>
</ul>
