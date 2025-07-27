---
sourcePath: "packages/cli/src/core/types/parser.types.ts"
---

# ParsedJSDoc

 
Docflow에서 사용하는 JSDoc 템플릿을 파싱한 결과를 나타내요.


## 시그니처

```typescript
interface ParsedJSDoc { name?: string; description?: string; category?: string; kind?: string; signature?: string; deprecated?: string; examples?: ExampleData[]; parameters?: ParameterData[]; returns?: ReturnData; throws?: ThrowsData[]; typedef?: TypedefData[]; see?: SeeData[]; version?: VersionData[] }
```

### 속성

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">name</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">문서화된 요소의 이름</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">description</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">요소의 설명</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">category</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">요소의 카테고리 분류</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">kind</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">선언의 종류 (function, class, interface 등)</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">signature</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">요소의 TypeScript 시그니처</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">deprecated</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">사용 중단 알림 (해당되는 경우)</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">examples</span> · <span class="post-parameters--type">ExampleData[]</span>
    <br/>
    <p class="post-parameters--description">예제 코드의 배열</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">parameters</span> · <span class="post-parameters--type">ParameterData[]</span>
    <br/>
    <p class="post-parameters--description">매개변수 정보의 배열</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">returns</span> · <span class="post-parameters--type">ReturnData</span>
    <br/>
    <p class="post-parameters--description">반환값 정보</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">throws</span> · <span class="post-parameters--type">ThrowsData[]</span>
    <br/>
    <p class="post-parameters--description">예외 정보의 배열</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">typedef</span> · <span class="post-parameters--type">TypedefData[]</span>
    <br/>
    <p class="post-parameters--description">타입 정의의 배열</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">see</span> · <span class="post-parameters--type">SeeData[]</span>
    <br/>
    <p class="post-parameters--description">관련 문서에 대한 참조의 배열</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">version</span> · <span class="post-parameters--type">VersionData[]</span>
    <br/>
    <p class="post-parameters--description">버전 정보의 배열</p>
  </li>
</ul>
