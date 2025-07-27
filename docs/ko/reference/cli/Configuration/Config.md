---
sourcePath: "packages/cli/src/config/config.schema.ts"
---

# Config

 
Docflow의 설정 타입이에요. 프로젝트 설정, 명령어 설정, 플러그인 설정을 포함해요.


## 시그니처

```typescript
type Config = z.infer<typeof configSchema>;
```

### 속성

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">project</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">object</span>
    <br/>
    <p class="post-parameters--description">프로젝트 설정 정보</p>
    <ul class="post-parameters-ul">
  <li class="post-parameters-li ">
    <span class="post-parameters--name">root</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">프로젝트 루트 디렉토리</p>
  </li>
  <li class="post-parameters-li ">
    <span class="post-parameters--name">packageManager</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">&quot;yarn&quot; | &quot;pnpm&quot; | &quot;npm&quot;</span>
    <br/>
    <p class="post-parameters--description">사용할 패키지 매니저</p>
  </li>
  <li class="post-parameters-li ">
    <span class="post-parameters--name">workspace</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">object</span>
    <br/>
    <p class="post-parameters--description">워크스페이스 설정</p>
  </li>
  <li class="post-parameters-li ">
    <span class="post-parameters--name">workspace.include</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string[]</span>
    <br/>
    <p class="post-parameters--description">빌드에 포함할 패키지 패턴</p>
  </li>
  <li class="post-parameters-li ">
    <span class="post-parameters--name">workspace.exclude</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string[]</span>
    <br/>
    <p class="post-parameters--description">빌드에서 제외할 패키지 패턴</p>
  </li>
    </ul>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">commands</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">object</span>
    <br/>
    <p class="post-parameters--description">명령어 설정</p>
    <ul class="post-parameters-ul">
  <li class="post-parameters-li ">
    <span class="post-parameters--name">build</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">object</span>
    <br/>
    <p class="post-parameters--description">build 명령어 설정</p>
  </li>
  <li class="post-parameters-li ">
    <span class="post-parameters--name">check</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">object</span>
    <br/>
    <p class="post-parameters--description">check 명령어 설정</p>
  </li>
  <li class="post-parameters-li ">
    <span class="post-parameters--name">generate</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">object</span>
    <br/>
    <p class="post-parameters--description">generate 명령어 설정</p>
  </li>
    </ul>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">plugins</span> · <span class="post-parameters--type">object[]</span>
    <br/>
    <p class="post-parameters--description">플러그인 설정</p>
    <ul class="post-parameters-ul">
  <li class="post-parameters-li ">
    <span class="post-parameters--name">name</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">플러그인 이름</p>
  </li>
  <li class="post-parameters-li ">
    <span class="post-parameters--name">plugin</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">function</span>
    <br/>
    <p class="post-parameters--description">플러그인 인스턴스를 반환하는 팩토리 함수</p>
  </li>
  <li class="post-parameters-li ">
    <span class="post-parameters--name">options</span> · <span class="post-parameters--type">object</span>
    <br/>
    <p class="post-parameters--description">플러그인 옵션</p>
  </li>
    </ul>
  </li>
</ul>
