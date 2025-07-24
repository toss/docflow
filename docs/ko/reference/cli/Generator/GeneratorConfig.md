---
sourcePath: "packages/cli/src/core/types/generator.types.ts"
---

# GeneratorConfig

 
Markdown 생성기의 설정이에요. 생성기 이름, 프로젝트 루트, 레이블, 시그니처 언어를 정의해요.


## 시그니처

```typescript
interface GeneratorConfig { name: string; projectRoot: string; labels?: {
    parameters?: string;
    returns?: string;
    throws?: string;
    examples?: string;
    see?: string;
    version?: string;
    deprecated?: string;
    signature?: string;
    typedef?: string;
  }; signatureLanguage?: string }
```

### 매개변수

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">name</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">생성기의 이름 (예: 'vitepress', 'nextra')</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">projectRoot</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">프로젝트 루트 디렉토리의 절대 경로</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">labels</span> · <span class="post-parameters--type">object</span>
    <br/>
    <p class="post-parameters--description">문서 섹션에 대한 커스텀 레이블</p>
    <ul class="post-parameters-ul">
  <li class="post-parameters-li ">
    <span class="post-parameters--name">parameters</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">매개변수 섹션의 레이블</p>
  </li>
  <li class="post-parameters-li ">
    <span class="post-parameters--name">returns</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">반환값 섹션의 레이블</p>
  </li>
  <li class="post-parameters-li ">
    <span class="post-parameters--name">throws</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">예외 섹션의 레이블</p>
  </li>
  <li class="post-parameters-li ">
    <span class="post-parameters--name">examples</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">예제 섹션의 레이블</p>
  </li>
  <li class="post-parameters-li ">
    <span class="post-parameters--name">see</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">참조 섹션의 레이블</p>
  </li>
  <li class="post-parameters-li ">
    <span class="post-parameters--name">version</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">버전 섹션의 레이블</p>
  </li>
  <li class="post-parameters-li ">
    <span class="post-parameters--name">deprecated</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">사용 중단 섹션의 레이블</p>
  </li>
  <li class="post-parameters-li ">
    <span class="post-parameters--name">signature</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">시그니처 섹션의 레이블</p>
  </li>
  <li class="post-parameters-li ">
    <span class="post-parameters--name">typedef</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">타입 정의 섹션의 레이블</p>
  </li>
    </ul>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">signatureLanguage</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">코드 시그니처 하이라이팅을 위한 언어 (예: 'typescript', 'tsx')</p>
  </li>
</ul>
