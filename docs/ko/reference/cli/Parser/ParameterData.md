---
sourcePath: "packages/cli/src/core/types/parser.types.ts"
---

# ParameterData

 
JSDoc에서 @param 태그를 파싱한 결과를 나타내요. 


## 시그니처

```typescript
interface ParameterData { name: string; type: string; description: string; required: boolean; defaultValue?: string; nested?: ParameterData[] }
```

### 속성

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">name</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">매개변수 이름</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">type</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">매개변수 타입</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">description</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">매개변수 설명</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">required</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">boolean</span>
    <br/>
    <p class="post-parameters--description">매개변수가 필수인지 여부</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">defaultValue</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">매개변수가 선택적인 경우의 기본값</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">nested</span> · <span class="post-parameters--type">ParameterData[]</span>
    <br/>
    <p class="post-parameters--description">객체 매개변수에 대한 중첩된 매개변수 데이터</p>
  </li>
</ul>
