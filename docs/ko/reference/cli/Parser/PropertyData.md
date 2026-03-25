---
sourcePath: "packages/cli/src/core/types/parser.types.ts"
---

# PropertyData

 
객체 타입의 속성 정보를 나타내요. ReturnData와 TypedefData에서 객체 속성을 설명하는 데 사용돼요.


## 시그니처

```typescript
interface PropertyData {
  name: string;
  type?: string;
  description: string;
  required: boolean;
  defaultValue?: string;
  nested?: PropertyData[];
}
```

### 속성

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">name</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">속성의 이름</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">type</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">속성의 타입</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">description</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">속성의 설명</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">required</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">boolean</span>
    <br/>
    <p class="post-parameters--description">속성의 필수 여부</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">defaultValue</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">속성이 선택적일 때의 기본값</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">nested</span> · <span class="post-parameters--type">PropertyData[]</span>
    <br/>
    <p class="post-parameters--description">중첩된 속성 데이터</p>
  </li>
</ul>
