---
sourcePath: "packages/cli/src/core/types/generator.types.ts"
---

# GeneratorConfig

 
마크다운 제너레이터의 설정이에요. 제너레이터 이름, 프로젝트 루트, 라벨, 시그니처 언어를 정의해요.


## 시그니처

```typescript
interface GeneratorConfig {
  name: string;
  projectRoot: string;
  labels?: {
    parameters?: string;
    returns?: string;
    throws?: string;
    examples?: string;
    see?: string;
    version?: string;
    deprecated?: string;
    signature?: string;
    typedef?: string;
    properties?: string;
  };
  signatureLanguage?: string;
}
```

### 속성

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">name</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">제너레이터 이름 (예: 'vitepress', 'nextra')</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">projectRoot</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">프로젝트 루트 디렉토리의 절대 경로</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">labels</span> · <span class="post-parameters--type">object</span>
    <br/>
    <p class="post-parameters--description">문서 섹션의 커스텀 라벨</p>
    <ul class="post-parameters-ul">
  <li class="post-parameters-li ">
    <span class="post-parameters--name">parameters</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">매개변수 섹션 라벨</p>
  </li>
  <li class="post-parameters-li ">
    <span class="post-parameters--name">returns</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">반환값 섹션 라벨</p>
  </li>
  <li class="post-parameters-li ">
    <span class="post-parameters--name">throws</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">예외 섹션 라벨</p>
  </li>
  <li class="post-parameters-li ">
    <span class="post-parameters--name">examples</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">예시 코드 섹션 라벨</p>
  </li>
  <li class="post-parameters-li ">
    <span class="post-parameters--name">see</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">참고 섹션 라벨</p>
  </li>
  <li class="post-parameters-li ">
    <span class="post-parameters--name">version</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">버전 섹션 라벨</p>
  </li>
  <li class="post-parameters-li ">
    <span class="post-parameters--name">deprecated</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">사용 중단 섹션 라벨</p>
  </li>
  <li class="post-parameters-li ">
    <span class="post-parameters--name">signature</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">시그니처 섹션 라벨</p>
  </li>
  <li class="post-parameters-li ">
    <span class="post-parameters--name">typedef</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">타입 정의 섹션 라벨</p>
  </li>
  <li class="post-parameters-li ">
    <span class="post-parameters--name">properties</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">속성 섹션 라벨</p>
  </li>
    </ul>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">signatureLanguage</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">코드 시그니처 구문 강조에 사용할 언어 (예: 'typescript', 'tsx')</p>
  </li>
</ul>
